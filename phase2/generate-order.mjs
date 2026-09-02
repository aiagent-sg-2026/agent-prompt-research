import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root = resolve(new URL('.', import.meta.url).pathname);
const seed = 'agent-prompt-phase2-20260902-v1';
const tasks = JSON.parse(readFileSync(join(root, 'task-specs.json'), 'utf8'));
const variants = ['A', 'B', 'C'];
let state = Number.parseInt(createHash('sha256').update(seed).digest('hex').slice(0, 8), 16) >>> 0;
const next = () => { state = (Math.imul(state ^ (state >>> 16), 2246822519) + 3266489917) >>> 0; state ^= state >>> 13; return state >>> 0; };
const cells = [];
for (let repeat = 1; repeat <= 5; repeat++) { const block = tasks.flatMap(task => variants.map(variant => ({ task: task.id, variant, repeat, seed }))); for (let i = block.length - 1; i > 0; i--) { const j = next() % (i + 1); [block[i], block[j]] = [block[j], block[i]]; } cells.push(...block); }
writeFileSync(join(root, 'order.json'), JSON.stringify(cells.map((x, i) => ({ order_index: i + 1, ...x })), null, 2) + '\n');
console.log(`Generated ${cells.length} order entries with seed ${seed}.`);
