import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
const here = dirname(new URL(import.meta.url).pathname);
const order = [['t1-normalize-tags','A'],['t2-retry','B'],['t3-merge-preferences','C'],['t1-normalize-tags','B'],['t2-retry','C'],['t3-merge-preferences','A'],['t1-normalize-tags','C'],['t2-retry','A'],['t3-merge-preferences','B']];
console.log(`Frozen interleaved order: ${order.map(([t,v]) => `${t}/${v}`).join(', ')}`);
if (process.argv.includes('--run')) for (const [task, variant] of order) {
  console.log(`\n=== ${task}/${variant} ===`);
  const result = spawnSync(process.execPath, [resolve(here, 'run-one.mjs'), task, variant], { stdio: 'inherit' });
  if (result.status !== 0) { console.error(`Run failed: ${task}/${variant}`); process.exit(result.status ?? 1); }
}
