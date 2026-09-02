import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { protocolHash, verifyFrozenManifest } from './protocol.mjs';

const root = resolve(new URL('.', import.meta.url).pathname);
const repo = resolve(root, '..');
const args = process.argv.slice(2);
const smoke = args.includes('--smoke');
const index = Number(args[0]);
const value = flag => { const i = args.indexOf(flag); return i < 0 ? null : args[i + 1]; };
const taskArg = value('--task');
const variantArg = value('--variant');
const tasks = JSON.parse(readFileSync(join(root, 'task-specs.json'), 'utf8'));
const order = JSON.parse(readFileSync(join(root, 'order.json'), 'utf8'));
const variants = new Set(['A', 'B', 'C']);
const die = (message, code = 2) => { console.error(`INVALID: ${message}`); process.exit(code); };
let cell;
if (smoke) {
  if (!taskArg || !variants.has(variantArg) || !tasks.some(task => task.id === taskArg)) die('smoke requires --task TASK --variant A|B|C');
  cell = { order_index: null, repeat: null, task: taskArg, variant: variantArg, seed: 'smoke' };
} else {
  if (!Number.isInteger(index) || index < 1 || index > 300) die('usage: node phase2/run-one.mjs ORDER_INDEX [--smoke]');
  cell = order[index - 1];
}
const task = tasks.find(item => item.id === cell.task);
if (!task) die(`unknown task ${cell.task}`);
const mode = smoke ? 'smoke' : 'formal';
const currentHash = smoke ? protocolHash(root) : (() => { try { return verifyFrozenManifest(root); } catch (error) { die(error.message); } })();
const promptName = { A: 'A-lean', B: 'B-structured', C: 'C-prescriptive' }[cell.variant];
const prefix = smoke ? `smoke-${cell.task}-${cell.variant}` : `${String(index).padStart(3, '0')}-${cell.repeat}-${cell.task}-${cell.variant}`;
const evidenceRoot = join(root, smoke ? 'smoke-evidence' : 'evidence');
const evidence = join(evidenceRoot, prefix);
const invalidRoot = join(root, 'invalid-evidence');
const runDir = join(root, 'runs', prefix);
const run = (command, commandArgs, cwd, options = {}) => spawnSync(command, commandArgs, { cwd, encoding: 'utf8', maxBuffer: 60 * 1024 * 1024, ...options });
const sha256 = valueToHash => createHash('sha256').update(valueToHash).digest('hex');
const moveEvidenceToInvalid = () => {
  if (!existsSync(evidence)) return;
  mkdirSync(invalidRoot, { recursive: true });
  let destination = join(invalidRoot, prefix);
  let suffix = 1;
  while (existsSync(destination)) destination = join(invalidRoot, `${prefix}-${suffix++}`);
  renameSync(evidence, destination);
};
const writeEvidence = (name, valueToWrite) => writeFileSync(join(evidence, name), valueToWrite);

if (existsSync(join(evidence, 'metrics.json'))) {
  try {
    const metric = JSON.parse(readFileSync(join(evidence, 'metrics.json'), 'utf8'));
    const exact = metric.harness_valid === true && metric.mode === mode && metric.protocol_hash === currentHash &&
      metric.order_index === cell.order_index && metric.repeat === cell.repeat && metric.task === cell.task && metric.variant === cell.variant;
    if (exact) { console.log(`SKIP completed ${prefix}`); process.exit(0); }
  } catch { /* stale evidence is preserved below */ }
}
if (existsSync(evidence)) moveEvidenceToInvalid();
mkdirSync(evidence, { recursive: true });
rmSync(runDir, { recursive: true, force: true });
cpSync(join(root, 'fixtures', task.id), runDir, { recursive: true });
const git = (...gitArgs) => run('git', gitArgs, runDir);
git('init', '-q');
git('config', 'user.email', 'phase2@example.invalid');
git('config', 'user.name', 'Phase 2 Harness');
git('add', '.');
git('commit', '-qm', 'baseline fixture');

const baseline = run('npm', ['test'], runDir);
writeEvidence('baseline-test.stdout', baseline.stdout ?? '');
writeEvidence('baseline-test.stderr', baseline.stderr ?? '');
writeEvidence('baseline-test.exit-code', String(baseline.status ?? 1));
const baselineText = `${baseline.stdout ?? ''}\n${baseline.stderr ?? ''}`;
const baselineInfra = baseline.error || baseline.status === null || baseline.status === undefined ||
  baseline.status === 0 || !/(AssertionError|Assertion failed|Expected)/i.test(baselineText);
if (baselineInfra) { moveEvidenceToInvalid(); die('baseline npm test was not an expected assertion failure', 3); }

const prompt = readFileSync(join(root, 'prompts', task.id, `${promptName}.md`), 'utf8');
writeEvidence('prompt.md', prompt);
const finalPath = join(runDir, 'final-message.txt');
const start = Date.now();
const codex = run(join(repo, 'scripts', 'with-codex-writer-lock.sh'), [
  'codex', 'exec', '--ephemeral', '--ignore-user-config', '--ignore-rules',
  '--model', 'gpt-5.6-luna', '--config', "model_reasoning_effort='medium'",
  '--sandbox', 'workspace-write', '--json', '-o', finalPath, '-C', runDir, '-'
], runDir, { input: prompt });
const elapsed = Date.now() - start;
const finalMessage = existsSync(finalPath) ? readFileSync(finalPath, 'utf8') : '';
const hadFinalMessage = finalMessage.trim().length > 0;
writeEvidence('codex.jsonl', codex.stdout ?? '');
writeEvidence('codex.stderr', codex.stderr ?? '');
writeEvidence('codex.exit-code', String(codex.status ?? 1));
writeEvidence('final-message.txt', finalMessage);
rmSync(finalPath, { force: true });
const final = run('npm', ['test'], runDir);
writeEvidence('final-test.stdout', final.stdout ?? '');
writeEvidence('final-test.stderr', final.stderr ?? '');
writeEvidence('final-test.exit-code', String(final.status ?? 1));
const changed = git('status', '--short').stdout ?? '';
const diff = git('diff', 'HEAD', '--binary').stdout ?? '';
const numstat = git('diff', 'HEAD', '--numstat').stdout ?? '';
writeEvidence('changed-files.txt', changed);
writeEvidence('diff.patch', diff);
writeEvidence('numstat.txt', numstat);
const changedFiles = changed.split('\n').filter(Boolean).map(line => line.slice(3));
const additions = numstat.split('\n').filter(Boolean).reduce((sum, line) => sum + Number(line.split('\t')[0] || 0), 0);
const deletions = numstat.split('\n').filter(Boolean).reduce((sum, line) => sum + Number(line.split('\t')[1] || 0), 0);
let usage = null;
const events = [];
const visit = value => {
  if (!value || typeof value !== 'object') return;
  if (value.usage && typeof value.usage === 'object') usage = value.usage;
  for (const nested of Object.values(value)) visit(nested);
};
for (const line of (codex.stdout ?? '').split('\n')) {
  try { const event = JSON.parse(line); events.push(event); visit(event); } catch { /* jsonl can contain diagnostics */ }
}
const commandEvents = events.filter(event => event.type === 'item.completed' && event.item?.type === 'command_execution');
const testInvocations = commandEvents.filter(event => /(?:npm\s+test|node\s+--test)/.test(event.item?.command ?? '')).length;
const finalText = `${final.stdout ?? ''}\n${final.stderr ?? ''}`;
const finalPass = final.status === 0;
const finalAssertionFailure = final.status === 1 && /(AssertionError|Assertion failed|Expected)/i.test(finalText);
const infraReason = codex.error ? 'spawn error' : codex.status !== 0 ? 'codex process nonzero' : !hadFinalMessage ? 'missing final message' :
  (finalPass || finalAssertionFailure) ? null : 'final test infrastructure failure';
const harnessValid = infraReason === null;
const unrelated = changedFiles.filter(file => file !== task.target);
const metrics = {
  protocol_version: 'phase2-v1', mode, protocol_hash: currentHash,
  order_index: cell.order_index, repeat: cell.repeat, task: cell.task, variant: cell.variant,
  category: task.category, fixture_mode: task.fixture_mode,
  model: 'gpt-5.6-luna', effort: 'medium', prompt_chars: prompt.length, prompt_sha256: sha256(prompt),
  start_iso: new Date(start).toISOString(), end_iso: new Date(start + elapsed).toISOString(), wall_clock_ms: elapsed,
  input_tokens: usage?.input_tokens ?? null, cached_input_tokens: usage?.cached_input_tokens ?? usage?.cache_read_input_tokens ?? null,
  output_tokens: usage?.output_tokens ?? null, codex_exit_code: codex.status ?? 1,
  baseline_test_exit_code: baseline.status ?? 1, final_test_exit_code: final.status ?? 1,
  changed_files: changedFiles, changed_file_count: changedFiles.length, target_changed: changedFiles.includes(task.target),
  unrelated_files_changed: unrelated, unrelated_edit_count: unrelated.length, additions, deletions,
  diff_lines: additions + deletions, test_invocations: testInvocations, test_retry_proxy: Math.max(0, testInvocations - 1),
  had_final_message: hadFinalMessage, harness_valid: harnessValid,
  task_success: harnessValid && finalPass && changedFiles.includes(task.target) && unrelated.length === 0
};
if (!harnessValid) { moveEvidenceToInvalid(); die(infraReason, 4); }
const temporary = join(evidence, 'metrics.json.tmp');
writeFileSync(temporary, JSON.stringify(metrics, null, 2) + '\n');
renameSync(temporary, join(evidence, 'metrics.json'));
console.log(JSON.stringify(metrics, null, 2));
