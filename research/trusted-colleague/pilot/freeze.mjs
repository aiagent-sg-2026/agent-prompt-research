import { existsSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { atomicWrite, PILOT_ROOT, REPO_ROOT, json } from './common.mjs';
import { currentEntries, protocolHash, validateOrder, verifyFrozenManifest } from './protocol.mjs';

function nonempty(dir) { return existsSync(dir) && readdirSync(dir).some((name) => statSync(join(dir, name)).isDirectory() || statSync(join(dir, name)).size > 0); }
export function freeze() {
  validateOrder(json(join(PILOT_ROOT, 'order.json')));
  for (const dir of ['evidence', 'invalid-evidence', 'secondary-evidence']) if (nonempty(join(PILOT_ROOT, dir))) throw new Error(`refusing to freeze with existing model evidence: ${dir}`);
  const qa = spawnSync(process.execPath, [join(REPO_ROOT, 'scripts', 'qa-tcm.mjs')], { cwd: REPO_ROOT, encoding: 'utf8' });
  process.stdout.write(qa.stdout ?? ''); process.stderr.write(qa.stderr ?? '');
  if (qa.error || qa.status !== 0) throw new Error('TCM QA failed; refusing to freeze');
  const manifest = currentEntries().map((x) => `${x.hash}  ${x.path}`).join('\n') + '\n';
  atomicWrite(join(PILOT_ROOT, 'freeze-manifest.sha256'), manifest);
  const sum = spawnSync('sha256sum', ['-c', 'freeze-manifest.sha256'], { cwd: PILOT_ROOT, encoding: 'utf8' });
  if (sum.error || sum.status !== 0) throw new Error(`sha256sum verification failed: ${sum.stderr || sum.stdout}`);
  const hash = verifyFrozenManifest();
  console.log(`protocol hash: ${hash}`);
  return hash;
}
if (process.argv[1]?.endsWith('freeze.mjs')) { try { freeze(); } catch (error) { console.error(`FREEZE FAILED: ${error.message}`); process.exit(1); } }
