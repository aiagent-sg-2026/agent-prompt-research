import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { atomicJson, json, PILOT_ROOT } from './common.mjs';

export const SEED = 'tcm-pilot-generation-20260903-v1';
function rngFor(seed) {
  let state = Number.parseInt(createHash('sha256').update(seed).digest('hex').slice(0, 8), 16) >>> 0;
  return () => {
    state = (Math.imul(state ^ (state >>> 16), 2246822519) + 3266489917) >>> 0;
    state ^= state >>> 13;
    return state >>> 0;
  };
}
export function makeOrder() {
  const tasks = json(join(PILOT_ROOT, 'tasks.json')).tasks;
  const conditions = json(join(PILOT_ROOT, 'conditions.json')).conditions;
  const cells = [];
  for (const repeat of [1, 2]) {
    const block = tasks.flatMap((task) => conditions.map((condition) => ({ taskId: task.id, conditionId: condition.id, repeat })));
    const next = rngFor(`${SEED}:repeat:${repeat}`);
    for (let i = block.length - 1; i > 0; i--) {
      const j = next() % (i + 1);
      [block[i], block[j]] = [block[j], block[i]];
    }
    cells.push(...block);
  }
  return { version: 'tcm-pilot-order-v1', seed: SEED, cells: cells.map((cell, i) => ({ orderIndex: i + 1, ...cell, cellId: `${cell.taskId}__${cell.conditionId}__r${cell.repeat}` })) };
}
if (process.argv[1]?.endsWith('generate-order.mjs')) atomicJson(join(PILOT_ROOT, 'order.json'), makeOrder());
