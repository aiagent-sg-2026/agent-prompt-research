import { join } from 'node:path';
import { json, PILOT_ROOT } from './common.mjs';
import { validateOrder, verifyFrozenManifest } from './protocol.mjs';
import { runOne } from './run-one.mjs';
function argNumber(args, name, fallback) { const i = args.indexOf(name); if (i < 0) return fallback; const n = Number(args[i + 1]); if (!Number.isInteger(n)) throw new Error(`${name} requires an integer`); return n; }
export function runMatrix(args = process.argv.slice(2)) {
  if (!args.includes('--run')) throw new Error('refusing to run without explicit --run');
  const order = json(join(PILOT_ROOT, 'order.json')); validateOrder(order); verifyFrozenManifest();
  const from = argNumber(args, '--from', 1); const through = argNumber(args, '--through', 48); const limit = argNumber(args, '--limit', 48);
  if (from < 1 || through > 48 || from > through || limit < 1) throw new Error('invalid matrix range');
  const resume = args.includes('--resume');
  if (!resume && (from !== 1 || through !== 48 || limit !== 48)) console.log('NOTE: bounded non-resume execution requested; completed exact cells still skip safely.');
  let attempted = 0; let invalid = 0; let skipped = 0;
  for (let i = from; i <= through && attempted < limit; i++) {
    const result = runOne(i); attempted++;
    if (result.invalid) { invalid++; console.error(JSON.stringify(result)); break; }
    if (result.skipped) skipped++;
    console.log(JSON.stringify(result));
  }
  return { attempted, invalid, skipped };
}
if (process.argv[1]?.endsWith('run-matrix.mjs')) { try { const out = runMatrix(); console.log(JSON.stringify(out)); if (out.invalid) process.exit(3); } catch (error) { console.error(`MATRIX FAILED: ${error.message}`); process.exit(1); } }
