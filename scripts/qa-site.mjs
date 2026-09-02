import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const required = ['docs/index.html', 'docs/styles.css', 'docs/app.js', 'docs/data/summary.json', 'docs/.nojekyll'];
const failures = [];
for (const file of required) if (!existsSync(join(root, file))) failures.push(`missing ${file}`);

const html = readFileSync(join(root, 'docs/index.html'), 'utf8');
const app = readFileSync(join(root, 'docs/app.js'), 'utf8');
for (const marker of ['Key results', 'Experiment comparison', 'Task-level results', 'External evidence tiers', 'Prompt decision framework', 'Limitations', 'Reproducibility and links']) {
  if (!html.includes(marker)) failures.push(`missing essential section: ${marker}`);
}
for (const asset of ['styles.css', 'app.js']) if (!html.includes(asset)) failures.push(`missing relative asset reference: ${asset}`);
if (!app.includes('data/summary.json')) failures.push('missing relative asset reference: data/summary.json');
if (html.includes('href="../')) failures.push('site contains parent-relative artifact links that break from a /docs GitHub Pages source');
const repoBase = 'https://github.com/aiagent-sg-2026/agent-prompt-research/';
if (!html.includes(repoBase + 'blob/main/REPORT.md')) failures.push('missing GitHub report link');
if (!html.includes(repoBase + 'tree/main/experiments/evidence')) failures.push('missing GitHub raw-evidence link');
const data = JSON.parse(readFileSync(join(root, 'docs/data/summary.json'), 'utf8'));
if (data.status !== 'COMPLETE') failures.push('summary data is not COMPLETE');
for (const variant of data.by_variant ?? []) if (variant.success_rate !== 1 || variant.unrelated_edit_count.total !== 0) failures.push(`unexpected result for variant ${variant.variant}`);

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Site QA passed: required files, sections, Pages-safe artifact links, relative assets, and completed summary checks are valid.');
