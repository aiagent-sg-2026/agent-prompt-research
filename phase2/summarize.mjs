import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { verifyFrozenManifest } from './protocol.mjs';

const root = resolve(new URL('.', import.meta.url).pathname);
const order = JSON.parse(readFileSync(join(root, 'order.json'), 'utf8'));
let frozenHash = null;
if (existsSync(join(root, 'frozen-input-sha256.txt'))) {
  try { frozenHash = verifyFrozenManifest(root); } catch (error) { console.error(`Formal evidence cannot be verified: ${error.message}`); process.exitCode = 2; }
}
const readMetric = cell => {
  if (!frozenHash) return null;
  const path = join(root, 'evidence', `${String(cell.order_index).padStart(3, '0')}-${cell.repeat}-${cell.task}-${cell.variant}`, 'metrics.json');
  if (!existsSync(path)) return null;
  try {
    const metric = JSON.parse(readFileSync(path, 'utf8'));
    return metric.harness_valid === true && metric.mode === 'formal' && metric.protocol_hash === frozenHash &&
      metric.order_index === cell.order_index && metric.repeat === cell.repeat && metric.task === cell.task && metric.variant === cell.variant ? metric : undefined;
  } catch { return undefined; }
};
const metrics = order.map(readMetric);
const valid = metrics.filter(Boolean);
const status = valid.length === 300 ? 'COMPLETE' : 'IN_PROGRESS';
const mean = (rows, key) => { const values = rows.map(row => row[key]).filter(Number.isFinite); return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; };
const byVariant = ['A', 'B', 'C'].map(variant => {
  const rows = valid.filter(row => row.variant === variant);
  const successes = rows.filter(row => row.task_success === true).length;
  return { variant, count: rows.length, success_count: successes, success_rate: rows.length ? successes / rows.length : null,
    mean_input_tokens: mean(rows, 'input_tokens'), mean_cached_input_tokens: mean(rows, 'cached_input_tokens'),
    mean_output_tokens: mean(rows, 'output_tokens'), mean_latency_ms: mean(rows, 'wall_clock_ms'),
    mean_diff_lines: mean(rows, 'diff_lines'), unrelated_edit_count: rows.reduce((sum, row) => sum + (row.unrelated_edit_count || 0), 0) };
});
const rows = order.map((cell, i) => metrics[i] || { ...cell, mode: 'formal', protocol_hash: frozenHash, status: metrics[i] === undefined ? 'INVALID' : 'PENDING' });
const output = { status, valid_cells: valid.length, total_cells: 300, formal_only: true, protocol_hash: frozenHash, by_variant: byVariant, rows };
writeFileSync(join(root, 'summary.json'), JSON.stringify(output, null, 2) + '\n');
const fields = ['order_index', 'repeat', 'task', 'variant', 'mode', 'status', 'task_success', 'input_tokens', 'cached_input_tokens', 'output_tokens', 'wall_clock_ms', 'diff_lines', 'unrelated_edit_count', 'protocol_hash'];
const csv = value => value == null ? '' : Array.isArray(value) ? `"${value.join(';')}"` : typeof value === 'string' && /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : String(value);
writeFileSync(join(root, 'summary.csv'), fields.join(',') + '\n' + rows.map(row => fields.map(field => csv(row[field])).join(',')).join('\n') + '\n');
writeFileSync(join(root, 'summary.md'), `# Phase 2 summary\n\nStatus: **${status}** (${valid.length}/300 valid formal cells). Smoke and invalid evidence are excluded.\n\n| Variant | Valid | Success | Rate | Mean input | Mean latency |\n|---|---:|---:|---:|---:|---:|\n${byVariant.map(row => `| ${row.variant} | ${row.count} | ${row.success_count} | ${row.success_rate == null ? 'PENDING' : (row.success_rate * 100).toFixed(1) + '%'} | ${row.mean_input_tokens ?? 'PENDING'} | ${row.mean_latency_ms ?? 'PENDING'} |`).join('\n')}\n`);
console.log(`Phase 2 summary: ${status} ${valid.length}/300`);
