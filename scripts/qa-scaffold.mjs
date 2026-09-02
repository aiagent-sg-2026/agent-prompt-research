import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const tasks = ['t1-normalize-tags', 't2-retry', 't3-merge-preferences'];
const promptFiles = {
  A: 'A-lean.md',
  B: 'B-structured.md',
  C: 'C-prescriptive.md'
};
const failures = [];

for (const task of tasks) {
  const fixture = join(root, 'fixtures', task);
  const result = spawnSync('npm', ['test'], { cwd: fixture, encoding: 'utf8' });
  if (result.status === 0) failures.push(`${task}: baseline tests unexpectedly pass`);
  for (const file of Object.values(promptFiles)) {
    if (!existsSync(join(root, 'experiments', 'prompts', task, file))) failures.push(`${task}: missing prompt ${file}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Scaffold QA passed: ${tasks.length} fixtures fail baseline tests and each has A/B/C prompts.`);
