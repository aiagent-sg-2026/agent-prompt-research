import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(new URL('.', import.meta.url).pathname);
const seed = 'agent-prompt-phase2-analysis-20260902-v1';
const resamples = 10000;
const summaryPath = join(root, 'summary.json');
const incomplete = (valid = 0) => ({ status: 'IN_PROGRESS', verdict: null, valid_cells: valid, task_clusters: 20, bootstrap_seed: seed, resamples, note: 'Stability verdict is withheld until exactly 300 valid formal cells.' });
if (!existsSync(summaryPath)) { const out = incomplete(); writeFileSync(join(root, 'stability-analysis.json'), JSON.stringify(out, null, 2) + '\n'); writeFileSync(join(root, 'stability-analysis.md'), '# Phase 2 stability\n\nStatus: **IN_PROGRESS**; verdict: `null`.\n'); console.log('Phase 2 stability: IN_PROGRESS (verdict null)'); process.exit(0); }
const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
if (summary.valid_cells !== 300 || !Array.isArray(summary.rows)) {
  const out = incomplete(summary.valid_cells || 0); writeFileSync(join(root, 'stability-analysis.json'), JSON.stringify(out, null, 2) + '\n'); writeFileSync(join(root, 'stability-analysis.md'), `# Phase 2 stability\n\nStatus: **IN_PROGRESS**; verdict: \`null\`.\n`); console.log(`Phase 2 stability: IN_PROGRESS (${summary.valid_cells || 0}/300)`); process.exit(0);
}
const rows = summary.rows.filter(row => row.harness_valid === true && row.mode === 'formal');
const tasks = [...new Set(rows.map(row => row.task))].sort();
if (tasks.length !== 20 || rows.length !== 300) { const out = incomplete(rows.length); writeFileSync(join(root, 'stability-analysis.json'), JSON.stringify(out, null, 2) + '\n'); console.log(`Phase 2 stability: IN_PROGRESS (${rows.length}/300)`); process.exit(0); }
const variants = ['A', 'B', 'C'];
const numeric = (values) => { const usable = values.filter(Number.isFinite); return usable.length ? usable.reduce((a, b) => a + b, 0) / usable.length : null; };
const taskMeans = {};
for (const task of tasks) for (const variant of variants) {
  const group = rows.filter(row => row.task === task && row.variant === variant);
  if (group.length !== 5) { const out = incomplete(rows.length); writeFileSync(join(root, 'stability-analysis.json'), JSON.stringify(out, null, 2) + '\n'); console.log(`Phase 2 stability: IN_PROGRESS (${rows.length}/300)`); process.exit(0); }
  taskMeans[`${task}/${variant}`] = Object.fromEntries(['success', 'input_tokens', 'cached_input_tokens', 'output_tokens', 'wall_clock_ms', 'diff_lines', 'unrelated_edit_count', 'test_retry_proxy'].map(key => [key, key === 'success' ? numeric(group.map(row => row.task_success === true ? 1 : row.task_success === false ? 0 : null)) : numeric(group.map(row => row[key]))]));
}
const mean = values => numeric(values);
const variantStats = Object.fromEntries(variants.map(variant => {
  const group = rows.filter(row => row.variant === variant);
  return [variant, { n: group.length, success: mean(group.map(row => row.task_success === true ? 1 : row.task_success === false ? 0 : null)), input: mean(group.map(row => row.input_tokens)), cached: mean(group.map(row => row.cached_input_tokens)), output: mean(group.map(row => row.output_tokens)), latency: mean(group.map(row => row.wall_clock_ms)), diff: mean(group.map(row => row.diff_lines)), unrelated: mean(group.map(row => row.unrelated_edit_count)), retry: mean(group.map(row => row.test_retry_proxy)) }];
}));
const compare = (left, right, metric, direction) => {
  let win = 0, tie = 0, loss = 0, unavailable = 0;
  for (const task of tasks) {
    const a = taskMeans[`${task}/${left}`][metric]; const b = taskMeans[`${task}/${right}`][metric];
    if (!Number.isFinite(a) || !Number.isFinite(b)) { unavailable++; continue; }
    const d = direction === 'higher' ? a - b : b - a;
    if (d > 0) win++; else if (d < 0) loss++; else tie++;
  }
  return { win, tie, loss, unavailable };
};
const pairwise = Object.fromEntries([['A', 'B'], ['A', 'C'], ['B', 'C']].map(([left, right]) => [ `${left}-${right}`, {
  success: compare(left, right, 'success', 'higher'), input: compare(left, right, 'input_tokens', 'lower'), latency: compare(left, right, 'wall_clock_ms', 'lower'), diff: compare(left, right, 'diff_lines', 'lower')
}]));
let state = 0;
for (const char of seed) state = (Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0);
const random = () => { state = (state + 0x6D2B79F5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const percentile = values => { if (!values.length) return null; values.sort((a, b) => a - b); return [values[Math.floor((values.length - 1) * 0.025)], values[Math.floor((values.length - 1) * 0.975)]]; };
const bootstrap = (left, right, metric, operation) => {
  const taskValues = tasks.map(task => [taskMeans[`${task}/${left}`][metric], taskMeans[`${task}/${right}`][metric]]);
  const samples = [];
  for (let sample = 0; sample < resamples; sample++) {
    const values = [];
    for (let draw = 0; draw < 20; draw++) {
      const pair = taskValues[Math.floor(random() * taskValues.length)];
      const value = operation(pair[0], pair[1]);
      if (Number.isFinite(value)) values.push(value);
    }
    samples.push(values.length ? mean(values) : null);
  }
  return percentile(samples.filter(Number.isFinite));
};
const ci = {};
for (const [left, right] of [['A', 'B'], ['A', 'C'], ['B', 'C']]) {
  const key = `${left}-${right}`;
  ci[key] = {
    success_diff: bootstrap(left, right, 'success', (a, b) => a == null || b == null ? null : a - b),
    input_diff: bootstrap(left, right, 'input_tokens', (a, b) => a == null || b == null ? null : a - b),
    input_ratio: bootstrap(left, right, 'input_tokens', (a, b) => a == null || b == null || b === 0 ? null : a / b),
    latency_diff: bootstrap(left, right, 'wall_clock_ms', (a, b) => a == null || b == null ? null : a - b),
    latency_ratio: bootstrap(left, right, 'wall_clock_ms', (a, b) => a == null || b == null || b === 0 ? null : a / b)
  };
}
const taskEfficiency = (metric, comparator) => tasks.filter(task => {
  const a = taskMeans[`${task}/A`][metric]; const b = taskMeans[`${task}/${comparator}`][metric]; return Number.isFinite(a) && Number.isFinite(b) && a < b;
}).length;
const aggregateRatio = (metric, comparator) => { const a = variantStats.A[metric]; const b = variantStats[comparator][metric]; return Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : null; };
const aggregate = { 'A-B': { input_ratio: aggregateRatio('input', 'B'), latency_ratio: aggregateRatio('latency', 'B') }, 'A-C': { input_ratio: aggregateRatio('input', 'C'), latency_ratio: aggregateRatio('latency', 'C') } };
const successPass = (ci['A-B'].success_diff?.[0] ?? -Infinity) >= -0.05 && (ci['A-C'].success_diff?.[0] ?? -Infinity) >= -0.05;
const efficiencyPass = taskEfficiency('input_tokens', 'B') >= 12 && taskEfficiency('input_tokens', 'C') >= 12 && taskEfficiency('wall_clock_ms', 'B') >= 12 && taskEfficiency('wall_clock_ms', 'C') >= 12 && aggregate['A-B'].input_ratio !== null && aggregate['A-B'].latency_ratio !== null && aggregate['A-C'].input_ratio !== null && aggregate['A-C'].latency_ratio !== null && aggregate['A-B'].input_ratio < 1 && aggregate['A-B'].latency_ratio < 1 && aggregate['A-C'].input_ratio < 1 && aggregate['A-C'].latency_ratio < 1;
const verdict = successPass && efficiencyPass ? 'SUPPORT' : successPass ? 'MIXED' : 'NOT_STABLE';
const output = { status: 'COMPLETE', verdict, valid_cells: rows.length, task_clusters: 20, repeats_per_cell: 5, bootstrap_seed: seed, resamples, variant_stats: variantStats, task_variant_means: taskMeans, pairwise, bootstrap_95_ci: ci, aggregate_run_level_ratios: aggregate, efficiency_task_wins: { input_AB: taskEfficiency('input_tokens', 'B'), input_AC: taskEfficiency('input_tokens', 'C'), latency_AB: taskEfficiency('wall_clock_ms', 'B'), latency_AC: taskEfficiency('wall_clock_ms', 'C') }, successPass, efficiencyPass, note: 'B diff is tracked separately; null metrics are unavailable and never imputed.' };
writeFileSync(join(root, 'stability-analysis.json'), JSON.stringify(output, null, 2) + '\n');
writeFileSync(join(root, 'stability-analysis.md'), `# Phase 2 stability\n\nStatus: **COMPLETE**; verdict: **${verdict}**.\n\nBootstrap: exactly ${resamples} deterministic task-cluster resamples using \`${seed}\`. Null metrics are unavailable. B diff is tracked separately.\n\n- Success criterion: ${successPass ? 'pass' : 'fail'}\n- Efficiency criterion: ${efficiencyPass ? 'pass' : 'fail'}\n`);
console.log(`Phase 2 stability: COMPLETE (${verdict})`);
