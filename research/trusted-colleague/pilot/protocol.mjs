import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { json, PILOT_ROOT, sha256 } from './common.mjs';

export const protocolFiles = [
  '../protocol-v0.1.md', '../evaluation-rubric.md',
  'PILOT-CONTRACT.md', 'tasks.json', 'conditions.json', 'order.json', 'secondary-eval-schema.json',
  'common.mjs', 'generate-order.mjs', 'protocol.mjs', 'freeze.mjs', 'run-one.mjs', 'run-matrix.mjs',
  'summarize.mjs', 'make-blind-pack.mjs', 'evaluate-secondary.mjs', 'analyze-pilot.mjs',
  '../../../scripts/qa-tcm.mjs', '../../../scripts/with-codex-writer-lock.sh'
];
export function currentEntries() {
  return [...protocolFiles].sort().map((path) => {
    const absolute = join(PILOT_ROOT, path);
    if (!existsSync(absolute)) throw new Error(`protocol file missing: ${path}`);
    return { path, hash: sha256(readFileSync(absolute)) };
  });
}
export function protocolHash() {
  const hashInput = currentEntries().map((x) => `${x.path}\0${x.hash}\n`).join('');
  return sha256(hashInput);
}
export function frozenManifestPath() { return join(PILOT_ROOT, 'freeze-manifest.sha256'); }
export function verifyFrozenManifest() {
  const file = frozenManifestPath();
  if (!existsSync(file)) throw new Error('freeze-manifest.sha256 is missing; freeze before generation');
  const lines = readFileSync(file, 'utf8').trim().split('\n').filter(Boolean);
  const expected = currentEntries();
  const actual = lines.map((line) => {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    if (!match) throw new Error('manifest is not sha256sum-compatible');
    return { hash: match[1], path: match[2] };
  });
  if (actual.length !== expected.length || actual.some((entry, i) => entry.path !== expected[i].path || entry.hash !== expected[i].hash)) throw new Error('frozen manifest does not match current protocol files');
  return protocolHash();
}
export function validateOrder(order) {
  const tasks = json(join(PILOT_ROOT, 'tasks.json')).tasks.map((x) => x.id);
  const conditions = json(join(PILOT_ROOT, 'conditions.json')).conditions.map((x) => x.id);
  if (!order || order.cells?.length !== 48 || order.seed !== 'tcm-pilot-generation-20260903-v1') throw new Error('order is not the exact 48-cell seeded matrix');
  const keys = order.cells.map((x) => `${x.taskId}|${x.conditionId}|${x.repeat}`);
  if (new Set(keys).size !== 48) throw new Error('order identities are not unique');
  if (order.cells.some((x, i) => x.orderIndex !== i + 1 || !tasks.includes(x.taskId) || !conditions.includes(x.conditionId) || ![1, 2].includes(x.repeat))) throw new Error('order contains invalid cells');
  for (const repeat of [1, 2]) {
    const block = order.cells.filter((x) => x.repeat === repeat);
    if (block.length !== 24) throw new Error(`repeat ${repeat} is not a 24-cell balanced block`);
    for (const task of tasks) if (block.filter((x) => x.taskId === task).length !== 4) throw new Error(`task imbalance ${task}/r${repeat}`);
    for (const condition of conditions) if (block.filter((x) => x.conditionId === condition).length !== 6) throw new Error(`condition imbalance ${condition}/r${repeat}`);
  }
  return true;
}
