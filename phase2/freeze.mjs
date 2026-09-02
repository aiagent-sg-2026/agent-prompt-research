import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { protocolFiles, protocolHash } from './protocol.mjs';

const root = resolve(new URL('.', import.meta.url).pathname);
const qa = spawnSync(process.execPath, [join(root, 'qa.mjs')], { stdio: 'inherit' });
if (qa.status !== 0) process.exit(qa.status ?? 1);
const current = protocolHash(root);
const smokeCells = [
  ['t05-parse-pagination-query', 'A'],
  ['t10-resolve-permissions', 'B'],
  ['t17-map-with-concurrency-limit', 'C']
];
for (const [task, variant] of smokeCells) {
  const name = `smoke-${task}-${variant}`;
  const metricPath = join(root, 'smoke-evidence', name, 'metrics.json');
  if (!existsSync(metricPath)) throw new Error(`missing smoke metric ${name}`);
  const metric = JSON.parse(readFileSync(metricPath, 'utf8'));
  if (metric.order_index !== null || metric.repeat !== null || metric.task !== task || metric.variant !== variant ||
      metric.mode !== 'smoke' || metric.harness_valid !== true || metric.unrelated_edit_count !== 0 || metric.protocol_hash !== current) {
    throw new Error(`invalid smoke identity ${name}`);
  }
}
const lines = protocolFiles(root).map(file => `${createHash('sha256').update(readFileSync(join(root, file))).digest('hex')}  ${file}`);
writeFileSync(join(root, 'frozen-input-sha256.txt'), lines.join('\n') + '\n');
const check = spawnSync('sha256sum', ['-c', 'frozen-input-sha256.txt'], { cwd: root, stdio: 'inherit' });
if (check.status !== 0) throw new Error('frozen manifest verification failed');
console.log(`Frozen protocol hash: ${current}`);
