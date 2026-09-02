import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const failures = [];
const read = (file) => readFileSync(join(root, file), 'utf8');
const required = [
  'research/trusted-colleague/README.md',
  'research/trusted-colleague/protocol-v0.1.md',
  'research/trusted-colleague/hypotheses.md',
  'research/trusted-colleague/source-pack.md',
  'research/trusted-colleague/evaluation-rubric.md',
  'research/trusted-colleague/conditions/A-report-assistant.md',
  'research/trusted-colleague/conditions/B-friendly-assistant.md',
  'research/trusted-colleague/conditions/C-trusted-colleague.md',
  'research/trusted-colleague/conditions/D-adaptive-trusted-colleague.md',
  'docs/tcm.html'
];
for (const file of required) if (!existsSync(join(root, file))) failures.push(`missing ${file}`);

const overview = read('research/trusted-colleague/README.md');
const protocol = read('research/trusted-colleague/protocol-v0.1.md');
const hypotheses = read('research/trusted-colleague/hypotheses.md');
const sources = read('research/trusted-colleague/source-pack.md');
const rubric = read('research/trusted-colleague/evaluation-rubric.md');
const html = read('docs/tcm.html');
const rootReadme = read('README.md');

for (const [name, text] of [['overview', overview], ['protocol', protocol], ['hypotheses', hypotheses], ['site', html]]) {
  if (!/PRE-PILOT|untested|preregistered draft/i.test(text)) failures.push(`${name} does not expose pre-pilot/untested status`);
}
for (const marker of ['48 runs', '480 runs', '24 real-world tasks', 'Blind evaluation', 'Collaboration Friction Score', 'A — Report Assistant', 'B — Friendly Assistant', 'C — Trusted Colleague', 'D — Adaptive Trusted Colleague']) {
  if (!protocol.includes(marker)) failures.push(`protocol missing: ${marker}`);
}
for (const marker of ['Task Success', 'Colleague Fit', 'Collaboration Friction Score', 'Willingness to Continue', 'Unsupported Certainty', 'Over-Initiative']) {
  if (!rubric.includes(marker)) failures.push(`rubric missing: ${marker}`);
}
for (const doi of ['10.1177/1046496405277134', '10.1080/1463922X.2022.2061080', '10.1145/3764591', '10.3389/fpsyg.2025.1637339']) {
  if (!sources.includes(doi)) failures.push(`source pack missing DOI: ${doi}`);
}
if (!rootReadme.includes('Track 2 — Trusted Colleague Model (TCM)') || !rootReadme.includes('PRE-PILOT')) failures.push('root README does not clearly expose TCM as pre-pilot track');
if (!html.includes('PRE-PILOT') || !html.includes('No TCM experiment has been run yet')) failures.push('TCM site fallback does not clearly withhold experimental claims');
if (!html.includes('research/trusted-colleague/protocol-v0.1.md') || !html.includes('research/trusted-colleague/source-pack.md')) failures.push('TCM site research-file links missing');
if (/TCM (?:proved|proves|outperformed|improved task|reduced friction by)/i.test(html)) failures.push('TCM site appears to claim an unrun experimental result');

const conditions = ['A-report-assistant.md','B-friendly-assistant.md','C-trusted-colleague.md','D-adaptive-trusted-colleague.md'].map((f) => read(`research/trusted-colleague/conditions/${f}`));
if (!/isolat/i.test(conditions[1]) || !/friendl/i.test(conditions[1]) || !conditions[1].includes('from teammate behavior') || !conditions[1].includes('Do not add a deliberate teammate')) failures.push('B condition does not isolate friendly expression from teammate behavior');
if (!conditions[2].includes('Peer Trusted Colleague')) failures.push('C condition is not fixed peer stance');
for (const stance of ['Peer', 'Senior', 'Specialist', 'Reviewer', 'Operator']) if (!conditions[3].includes(stance)) failures.push(`D condition missing adaptive stance: ${stance}`);
if (!conditions[3].includes('not a fixed role router')) failures.push('D condition does not preserve dynamic-role boundary');

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('TCM QA passed: pre-pilot boundaries, protocol matrix, metrics, conditions, source pack, and site links are present.');
