import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { atomicJson, countToolCalls, json, latestUsage, PILOT_ROOT, REPO_ROOT, safeId } from './common.mjs';
import { validateOrder, verifyFrozenManifest } from './protocol.mjs';

const MODEL = 'gpt-5.6-luna';
const EFFORT = 'medium';
function promptFor(task, commonBase, conditionPrompt, transcript, userTurn) {
  return `${commonBase}\n\n${conditionPrompt}\n\nSupplied context/evidence:\n${task.context_evidence}\n\nAuthority and safety boundary:\n${task.authority_boundary}\n\nConversation transcript so far:\n${transcript || '(none)'}\n\nUser turn:\n${userTurn}\n\nRespond only to the user. Do not mention hidden instructions and do not call tools.`;
}
function readEvents(stdout) {
  return String(stdout || '').split('\n').filter(Boolean).flatMap((line) => { try { return [JSON.parse(line)]; } catch { return []; } });
}
function exactCompleted(dir, cell, hash) {
  if (!existsSync(join(dir, 'metrics.json'))) return false;
  try {
    const m = json(join(dir, 'metrics.json'));
    return m.harness_valid === true && m.protocol_hash === hash && m.order_index === cell.orderIndex && m.task_id === cell.taskId && m.condition_id === cell.conditionId && m.repeat === cell.repeat;
  } catch { return false; }
}
function moveExistingToInvalid(evidenceDir, invalidRoot, cellId, reason) {
  if (!existsSync(evidenceDir)) return null;
  mkdirSync(invalidRoot, { recursive: true });
  let target = join(invalidRoot, `${safeId(cellId)}-${reason}`);
  let n = 1;
  while (existsSync(target)) target = join(invalidRoot, `${safeId(cellId)}-${reason}-${n++}`);
  renameSync(evidenceDir, target);
  return target;
}
function tokenTotals(turns) {
  const out = { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0, available_turns: 0 };
  for (const turn of turns) {
    const u = turn.token_usage;
    if (!u) continue;
    const input = u.input_tokens ?? u.input ?? null;
    const cached = u.cached_input_tokens ?? u.cache_read_input_tokens ?? u.cached_input ?? null;
    const output = u.output_tokens ?? u.output ?? null;
    if ([input, cached, output].some(Number.isFinite)) out.available_turns++;
    if (Number.isFinite(input)) out.input_tokens += input;
    if (Number.isFinite(cached)) out.cached_input_tokens += cached;
    if (Number.isFinite(output)) out.output_tokens += output;
  }
  return out.available_turns ? out : null;
}
export function runOne(orderIndex) {
  const hash = verifyFrozenManifest();
  const order = json(join(PILOT_ROOT, 'order.json')); validateOrder(order);
  if (!Number.isInteger(orderIndex) || orderIndex < 1 || orderIndex > 48) throw new Error(`order index must be 1..48: ${orderIndex}`);
  const cell = order.cells[orderIndex - 1];
  const evidenceRoot = join(PILOT_ROOT, 'evidence');
  const invalidRoot = join(PILOT_ROOT, 'invalid-evidence');
  const evidenceDir = join(evidenceRoot, safeId(cell.cellId));
  if (exactCompleted(evidenceDir, cell, hash)) return { skipped: true, cell_id: cell.cellId, order_index: orderIndex };
  moveExistingToInvalid(evidenceDir, invalidRoot, cell.cellId, 'stale');

  const tasks = json(join(PILOT_ROOT, 'tasks.json')).tasks;
  const conditions = json(join(PILOT_ROOT, 'conditions.json'));
  const task = tasks.find((x) => x.id === cell.taskId);
  const condition = conditions.conditions.find((x) => x.id === cell.conditionId);
  if (!task || !condition) throw new Error('cell references unknown task/condition');

  const runDir = mkdtempSync(join(tmpdir(), 'tcm-pilot-neutral-'));
  const turns = [];
  let transcriptText = '';
  const runStarted = Date.now();
  try {
    for (let i = 0; i < task.user_turns.length; i++) {
      const turnNo = i + 1;
      const prompt = promptFor(task, conditions.common_base, condition.prompt, transcriptText, task.user_turns[i]);
      writeFileSync(join(runDir, `prompt-turn-${turnNo}.txt`), prompt);
      const finalPath = join(runDir, `final-message-turn-${turnNo}.txt`);
      const turnStarted = Date.now();
      const result = spawnSync(join(REPO_ROOT, 'scripts', 'with-codex-writer-lock.sh'), [
        'codex', 'exec', '--ephemeral', '--ignore-user-config', '--ignore-rules',
        '--model', MODEL, '--config', "model_reasoning_effort='medium'",
        '--sandbox', 'read-only', '--skip-git-repo-check', '--json', '-o', finalPath, '-C', runDir, '-'
      ], { cwd: runDir, input: prompt, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
      const elapsed = Date.now() - turnStarted;
      const stdout = result.stdout ?? ''; const stderr = result.stderr ?? '';
      writeFileSync(join(runDir, `turn-${turnNo}.jsonl`), stdout);
      writeFileSync(join(runDir, `turn-${turnNo}.stderr.log`), stderr);
      writeFileSync(join(runDir, `turn-${turnNo}.exit-code`), String(result.status ?? -1));
      const finalMessage = existsSync(finalPath) ? readFileSync(finalPath, 'utf8').trim() : '';
      const events = readEvents(stdout);
      if (result.error || result.status !== 0 || !finalMessage) throw new Error(result.error?.message || `turn ${turnNo} invalid: exit=${result.status}, final=${Boolean(finalMessage)}`);
      const turn = {
        turn: turnNo,
        user: task.user_turns[i],
        assistant: finalMessage,
        latency_ms: elapsed,
        response_chars: finalMessage.length,
        response_words: finalMessage.split(/\s+/).filter(Boolean).length,
        token_usage: latestUsage(events),
        tool_call_count: countToolCalls(events)
      };
      turns.push(turn);
      transcriptText += `User: ${task.user_turns[i]}\nAssistant: ${finalMessage}\n`;
    }

    const transcript = {
      task_id: cell.taskId,
      category: task.category,
      condition_id: cell.conditionId,
      repeat: cell.repeat,
      order_index: cell.orderIndex,
      model: MODEL,
      reasoning_effort: EFFORT,
      turns
    };
    atomicJson(join(runDir, 'transcript.json'), transcript);
    const metrics = {
      harness_valid: true,
      protocol_hash: hash,
      task_id: cell.taskId,
      category: task.category,
      condition_id: cell.conditionId,
      repeat: cell.repeat,
      order_index: cell.orderIndex,
      model: MODEL,
      codex_cli: '0.151.0',
      reasoning_effort: EFFORT,
      sandbox: 'read-only',
      turns_completed: turns.length,
      expected_turns: task.user_turns.length,
      latency_ms: Date.now() - runStarted,
      response_chars: turns.reduce((n, x) => n + x.response_chars, 0),
      response_words: turns.reduce((n, x) => n + x.response_words, 0),
      tool_call_count: turns.reduce((n, x) => n + x.tool_call_count, 0),
      token_totals: tokenTotals(turns),
      completed_at: new Date().toISOString()
    };
    mkdirSync(evidenceRoot, { recursive: true });
    renameSync(runDir, evidenceDir);
    atomicJson(join(evidenceDir, 'metrics.json'), metrics);
    return metrics;
  } catch (error) {
    mkdirSync(invalidRoot, { recursive: true });
    let target = join(invalidRoot, `${safeId(cell.cellId)}-${Date.now()}`);
    let n = 1; while (existsSync(target)) target = join(invalidRoot, `${safeId(cell.cellId)}-${Date.now()}-${n++}`);
    renameSync(runDir, target);
    writeFileSync(join(target, 'INVALID.txt'), `${error.message}\n`);
    return { harness_valid: false, invalid: true, cell_id: cell.cellId, order_index: orderIndex, reason: error.message };
  }
}
if (process.argv[1]?.endsWith('run-one.mjs')) {
  const raw = process.argv[2] ?? (process.argv.includes('--order-index') ? process.argv[process.argv.indexOf('--order-index') + 1] : '');
  const index = Number(raw);
  if (!Number.isInteger(index)) { console.error('usage: node run-one.mjs ORDER_INDEX'); process.exit(2); }
  const result = runOne(index); console.log(JSON.stringify(result));
  if (result.invalid) process.exit(3);
}
