import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const tasks = {
  't1-normalize-tags': 'src/normalize-tags.js',
  't2-retry': 'src/retry.js',
  't3-merge-preferences': 'src/merge-preferences.js'
};
const variants = new Set(['A', 'B', 'C']);
const [task, variant] = process.argv.slice(2);
if (!tasks[task] || !variants.has(variant)) {
  console.error('Usage: node experiments/run-one.mjs TASK A|B|C'); process.exit(2);
}

const target = tasks[task];
const runDir = join(root, 'experiments', 'runs', task, variant);
const evidenceDir = join(root, 'experiments', 'evidence', task, variant);
const evidence = name => join(evidenceDir, name);
const put = (file, value) => writeFileSync(file, value);
const run = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const saveProcess = (prefix, result) => {
  put(evidence(`${prefix}.stdout`), result.stdout ?? '');
  put(evidence(`${prefix}.stderr`), result.stderr ?? '');
  put(evidence(`${prefix}.exit-code`), String(result.status ?? (result.error ? 1 : 0)));
  return result.status ?? (result.error ? 1 : 0);
};

rmSync(runDir, { recursive: true, force: true });
mkdirSync(evidenceDir, { recursive: true });
cpSync(join(root, 'fixtures', task), runDir, { recursive: true });
const git = (...args) => run('git', args, runDir);
git('init', '-q'); git('config', 'user.email', 'experiment@example.invalid'); git('config', 'user.name', 'Prompt Experiment'); git('add', '.'); git('commit', '-qm', 'baseline fixture');

const baseline = run('npm', ['test'], runDir);
const baselineExit = saveProcess('baseline-test', baseline);
if (baselineExit === 0) {
  const invalid = { task, variant, invalid_run: true, reason: 'baseline npm test unexpectedly passed', baseline_test_exit_code: baselineExit };
  put(evidence('metrics.json'), JSON.stringify(invalid, null, 2) + '\n');
  console.error(`INVALID: baseline passed for ${task}/${variant}`); process.exit(2);
}

const promptPath = join(root, 'experiments', 'prompts', task, `${variant === 'A' ? 'A-lean' : variant === 'B' ? 'B-structured' : 'C-prescriptive'}.md`);
const prompt = readFileSync(promptPath, 'utf8'); put(evidence('prompt.md'), prompt);
const finalMessage = join(runDir, 'final-message.txt');
const wrapper = join(root, 'scripts', 'with-codex-writer-lock.sh');
const args = ['exec', '--ephemeral', '--ignore-user-config', '--ignore-rules', '-m', 'gpt-5.6-luna', '-c', "model_reasoning_effort='medium'", '-s', 'workspace-write', '--json', '-o', finalMessage, '-C', runDir, '-'];
const start = new Date(); const t0 = performance.now();
const agent = spawnSync(wrapper, args, { cwd: runDir, input: prompt, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
const elapsed = Math.round(performance.now() - t0); const end = new Date();
const agentExit = saveProcess('codex', agent);
put(evidence('final-message.txt'), existsSync(finalMessage) ? readFileSync(finalMessage, 'utf8') : '');
rmSync(finalMessage, { force: true });
const finalTest = run('npm', ['test'], runDir); const finalExit = saveProcess('final-test', finalTest);

const changed = git('status', '--short').stdout ?? '';
const diff = git('diff', 'HEAD', '--binary').stdout ?? '';
const numstat = git('diff', 'HEAD', '--numstat').stdout ?? '';
put(evidence('changed-files.txt'), changed); put(evidence('diff.patch'), diff); put(evidence('numstat.txt'), numstat);
const changedFiles = changed.split('\n').filter(Boolean).map(line => line.slice(3));
const targetChanged = changedFiles.includes(target);
const unrelated = changedFiles.filter(file => file !== target);
const additions = numstat.split('\n').filter(Boolean).reduce((n, line) => n + Number(line.split('\t')[0] || 0), 0);
const deletions = numstat.split('\n').filter(Boolean).reduce((n, line) => n + Number(line.split('\t')[1] || 0), 0);

let events = []; for (const line of (agent.stdout ?? '').split('\n')) { try { events.push(JSON.parse(line)); } catch {} }
const completed = events.filter(e => e.type === 'item.completed' && e.item?.type === 'command_execution');
const testInvocations = completed.filter(e => /(?:npm test|node\s+--test)/.test(e.item.command ?? '')).length;
let usage = null;
const findUsage = value => { if (!value || typeof value !== 'object') return; if (value.usage && typeof value.usage === 'object') usage = value.usage; for (const v of Object.values(value)) findUsage(v); };
for (const event of events) findUsage(event);
const tokens = usage ? { input_tokens: usage.input_tokens ?? null, cached_input_tokens: usage.cached_input_tokens ?? usage.cache_read_input_tokens ?? null, output_tokens: usage.output_tokens ?? null } : { input_tokens: null, cached_input_tokens: null, output_tokens: null };
const metrics = {
  task, variant, model: 'gpt-5.6-luna', codex_cli: '0.151.0', reasoning_effort: 'medium',
  prompt_chars: prompt.length, start_iso: start.toISOString(), end_iso: end.toISOString(), wall_clock_ms: elapsed,
  codex_exit_code: agentExit, baseline_test_exit_code: baselineExit, final_test_exit_code: finalExit,
  input_tokens: tokens.input_tokens, cached_input_tokens: tokens.cached_input_tokens, output_tokens: tokens.output_tokens,
  changed_files: changedFiles, changed_file_count: changedFiles.length, additions, deletions, diff_lines: additions + deletions,
  target_changed: targetChanged, unrelated_files_changed: unrelated, unrelated_edit_count: unrelated.length,
  agent_test_invocations: testInvocations, test_retry_count: Math.max(0, testInvocations - 1),
  test_retry_count_definition: 'Operational proxy: max(0, completed agent test-command events - 1); not provider retry count.',
  harness_valid: agentExit === 0,
  task_success: finalExit === 0 && targetChanged && unrelated.length === 0 && agentExit === 0
};
put(evidence('metrics.json'), JSON.stringify(metrics, null, 2) + '\n');
console.log(JSON.stringify(metrics, null, 2));
if (agent.error) console.error(agent.error.message);
if (agentExit !== 0) process.exit(3);
