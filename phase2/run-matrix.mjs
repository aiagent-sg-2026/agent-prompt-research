import { existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { verifyFrozenManifest } from './protocol.mjs';

const root = resolve(new URL('.', import.meta.url).pathname);
const order = JSON.parse(readFileSync(join(root, 'order.json'), 'utf8'));
const args = process.argv.slice(2);
if (!args.includes('--run')) { console.log('Use --run [--resume] [--limit N] [--from INDEX] [--through INDEX]'); process.exit(0); }
const number = flag => { const i = args.indexOf(flag); return i < 0 ? null : Number(args[i + 1]); };
const validInteger = value => Number.isInteger(value) && value >= 1;
const from = number('--from') ?? 1;
const throughArg = number('--through');
const limit = number('--limit');
if (!validInteger(from) || (throughArg !== null && !validInteger(throughArg)) || (limit !== null && !validInteger(limit))) {
  console.error('INVALID: --from, --through, and --limit must be positive integers'); process.exit(2);
}
const through = Math.min(throughArg ?? 300, limit === null ? 300 : from + limit - 1);
if (from > through || through > 300) { console.error('INVALID: requested matrix range is outside 1..300'); process.exit(2); }
let frozenHash;
try { frozenHash = verifyFrozenManifest(root); } catch (error) { console.error(`INVALID: ${error.message}`); process.exit(3); }
const resume = args.includes('--resume');
const invalidRoot = join(root, 'invalid-evidence');
const moveStale = (dir, name) => {
  if (!existsSync(dir)) return;
  mkdirSync(invalidRoot, { recursive: true });
  let destination = join(invalidRoot, name);
  let suffix = 1;
  while (existsSync(destination)) destination = join(invalidRoot, `${name}-${suffix++}`);
  renameSync(dir, destination);
};
for (let i = from; i <= through; i++) {
  const cell = order[i - 1];
  const name = `${String(i).padStart(3, '0')}-${cell.repeat}-${cell.task}-${cell.variant}`;
  const dir = join(root, 'evidence', name);
  let exact = false;
  if (resume && existsSync(join(dir, 'metrics.json'))) {
    try {
      const metric = JSON.parse(readFileSync(join(dir, 'metrics.json'), 'utf8'));
      exact = metric.harness_valid === true && metric.mode === 'formal' && metric.protocol_hash === frozenHash &&
        metric.order_index === i && metric.repeat === cell.repeat && metric.task === cell.task && metric.variant === cell.variant;
    } catch { exact = false; }
  }
  if (resume && exact) continue;
  if (existsSync(dir)) moveStale(dir, name);
  const result = spawnSync(process.execPath, [join(root, 'run-one.mjs'), String(i)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
