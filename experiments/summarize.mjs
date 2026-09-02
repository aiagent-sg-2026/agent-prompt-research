import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root = resolve(new URL('.', import.meta.url).pathname, '..');
const order = [['t1-normalize-tags','A'],['t2-retry','B'],['t3-merge-preferences','C'],['t1-normalize-tags','B'],['t2-retry','C'],['t3-merge-preferences','A'],['t1-normalize-tags','C'],['t2-retry','A'],['t3-merge-preferences','B']];
const rows = order.map(([task, variant]) => {
  const path = join(root, 'experiments', 'evidence', task, variant, 'metrics.json');
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { task, variant, status: 'PENDING' };
});
const numeric = (items, key) => { const values = items.map(x => x[key]).filter(x => typeof x === 'number'); return { total: values.length ? values.reduce((a,b) => a+b, 0) : null, mean: values.length ? values.reduce((a,b) => a+b, 0) / values.length : null }; };
const median = values => { const x = values.filter(v => typeof v === 'number').sort((a,b) => a-b); return x.length ? x[Math.floor(x.length / 2)] : null; };
const byVariant = ['A','B','C'].map(variant => {
  const group = rows.filter(x => x.variant === variant); const completed = group.filter(x => x.status !== 'PENDING');
  const latency = completed.map(x => x.wall_clock_ms);
  const success = completed.filter(x => x.task_success === true).length;
  const sum = key => numeric(completed, key);
  return { variant, run_count: group.length, completed_count: completed.length, success_count: success, success_rate: completed.length ? success / completed.length : null,
    prompt_chars: sum('prompt_chars'), input_tokens: sum('input_tokens'), cached_input_tokens: sum('cached_input_tokens'), output_tokens: sum('output_tokens'),
    latency_ms: { mean: latency.length ? latency.reduce((a,b) => a+b, 0) / latency.length : null, median: median(latency) },
    changed_files: sum('changed_file_count'), diff_lines: sum('diff_lines'), unrelated_edit_count: sum('unrelated_edit_count'), agent_test_invocations: sum('agent_test_invocations'), test_retry_count: sum('test_retry_count') };
});
const allPending = rows.every(x => x.status === 'PENDING');
const allComplete = rows.every(x => x.status !== 'PENDING');
const output = { status: allPending ? 'PENDING' : allComplete ? 'COMPLETE' : 'PARTIAL', note: 'Descriptive pilot aggregation only; no causal claims.', frozen_order: order.map(([task,variant]) => ({task,variant})), by_variant: byVariant, runs: rows };
mkdirSync(join(root, 'experiments'), { recursive: true }); mkdirSync(join(root, 'docs', 'data'), { recursive: true });
writeFileSync(join(root, 'experiments', 'summary.json'), JSON.stringify(output, null, 2) + '\n'); writeFileSync(join(root, 'docs', 'data', 'summary.json'), JSON.stringify(output, null, 2) + '\n');
const fields = ['task','variant','status','task_success','prompt_chars','input_tokens','cached_input_tokens','output_tokens','wall_clock_ms','changed_file_count','diff_lines','unrelated_edit_count','agent_test_invocations','test_retry_count'];
const csv = [fields.join(','), ...rows.map(row => fields.map(f => { const value = row[f] ?? ''; return /[,"\n]/.test(String(value)) ? `"${String(value).replaceAll('"','""')}"` : value; }).join(','))].join('\n') + '\n';
writeFileSync(join(root, 'experiments', 'summary.csv'), csv);
const md = `# Experiment summary\n\nStatus: **${output.status}**. Unrun cells are **PENDING**. This table is descriptive and makes no causal claims.\n\n| Variant | Completed | Success | Success rate | Prompt chars (mean) | Input tokens (mean) | Output tokens (mean) | Latency ms (median) | Unrelated edits |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n${byVariant.map(x => `| ${x.variant} | ${x.completed_count}/${x.run_count} | ${x.success_count} | ${x.success_rate == null ? 'PENDING' : `${(x.success_rate*100).toFixed(1)}%`} | ${x.prompt_chars.mean ?? 'PENDING'} | ${x.input_tokens.mean ?? 'PENDING'} | ${x.output_tokens.mean ?? 'PENDING'} | ${x.latency_ms.median ?? 'PENDING'} | ${x.unrelated_edit_count.total ?? 'PENDING'} |`).join('\n')}\n\n## Per-run rows\n\n| Task | Variant | Status | Success | Prompt chars | Final test exit |\n|---|---|---|---|---:|---:|\n${rows.map(x => `| ${x.task} | ${x.variant} | ${x.status ?? 'complete'} | ${x.task_success ?? 'PENDING'} | ${x.prompt_chars ?? 'PENDING'} | ${x.final_test_exit_code ?? 'PENDING'} |`).join('\n')}\n`;
writeFileSync(join(root, 'experiments', 'summary.md'), md);
console.log(md);
