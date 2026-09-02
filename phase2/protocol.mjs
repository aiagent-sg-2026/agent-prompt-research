import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const protocolScripts = [
  'generate-prompts.mjs', 'generate-order.mjs', 'protocol.mjs', 'run-one.mjs',
  'run-matrix.mjs', 'qa.mjs', 'summarize.mjs', 'analyze-stability.mjs',
  'freeze.mjs', 'smoke.mjs'
];
const slash = value => value.replaceAll('\\', '/');

function walk(root, dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    const file = join(dir, entry.name);
    return entry.isDirectory() ? walk(root, file) : [slash(relative(root, file))];
  });
}

export function protocolFiles(root) {
  root = resolve(root);
  const tasks = JSON.parse(readFileSync(join(root, 'task-specs.json'), 'utf8'));
  const exact = new Set(['task-specs.json', 'CONTRACT.md', 'order.json', ...protocolScripts]);
  for (const task of tasks) {
    const fixtureRoot = join(root, 'fixtures', task.id);
    for (const file of walk(fixtureRoot, fixtureRoot)) exact.add(`fixtures/${task.id}/${file}`);
    for (const prompt of ['A-lean.md', 'B-structured.md', 'C-prescriptive.md']) {
      exact.add(`prompts/${task.id}/${prompt}`);
    }
  }
  const actual = new Set(walk(root, root));
  return [...exact].filter(file => actual.has(file)).sort();
}

export function protocolHash(root) {
  root = resolve(root);
  const hash = createHash('sha256');
  for (const file of protocolFiles(root)) {
    hash.update(file);
    hash.update('\0');
    hash.update(readFileSync(join(root, file)));
    hash.update('\0');
  }
  return hash.digest('hex');
}

export function verifyFrozenManifest(root) {
  root = resolve(root);
  const manifest = join(root, 'frozen-input-sha256.txt');
  if (!existsSync(manifest)) throw new Error('frozen-input-sha256.txt is missing');
  const expected = protocolFiles(root);
  const lines = readFileSync(manifest, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  if (lines.length !== expected.length) throw new Error('frozen manifest coverage mismatch');
  for (const [index, line] of lines.entries()) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    if (!match || slash(match[2]) !== expected[index] || match[2].startsWith('phase2/')) {
      throw new Error(`frozen manifest path/order mismatch at line ${index + 1}`);
    }
    const actual = createHash('sha256').update(readFileSync(join(root, expected[index]))).digest('hex');
    if (actual !== match[1]) throw new Error(`frozen hash mismatch: ${expected[index]}`);
  }
  return protocolHash(root);
}

export { protocolScripts };
