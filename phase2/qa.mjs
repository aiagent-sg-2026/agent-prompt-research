import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = resolve(new URL('.', import.meta.url).pathname); const read = p => readFileSync(join(root, p), 'utf8');
const tasks = JSON.parse(read('task-specs.json')); const order = JSON.parse(read('order.json')); const fail = m => { throw new Error(m); };
if (tasks.length !== 20 || new Set(tasks.map(t => t.id)).size !== 20) fail('task ids');
for (const t of tasks) {
  if (!t.target || !t.goal || !Array.isArray(t.requirements) || t.requirements.length < 5) fail(`incomplete spec ${t.id}`);
  const ids = t.requirements.map(r => r.id);
  if (new Set(ids).size !== ids.length || ids.some((id, i) => id !== `R${i + 1}`) || t.requirements.some(r => !r.text)) fail(`requirement ids/text ${t.id}`);
  const targetPath = join(root, 'fixtures', t.id, t.target);
  if (!existsSync(targetPath) || readFileSync(targetPath, 'utf8').length < 200) fail(`missing/small target ${t.id}`);
  if (!existsSync(join(root, 'fixtures', t.id, 'src/unrelated.js')) || !existsSync(join(root, 'fixtures', t.id, 'docs/README.md'))) fail(`missing evaluator context ${t.id}`);
  const test = read(join('fixtures', t.id, 'test/target.test.js'));
  if (!test.includes(t.target.split('/').pop())) fail(`spec/test import marker missing ${t.id}`);
  const marker = test.match(/\/\/ SPEC_REQUIREMENTS:\s*([^\n]+)/)?.[1]?.split(',').map(x => x.trim()) ?? [];
  if (marker.length !== ids.length || marker.some((id, i) => id !== ids[i]) || new Set(marker).size !== marker.length) fail(`spec requirement marker mismatch ${t.id}`);
  if ((test.match(/\btest\s*\(/g) ?? []).length < 5) fail(`too few tests ${t.id}`);
}
const baseline = tasks.map(t => { const r = spawnSync('npm test', { cwd: join(root, 'fixtures', t.id), encoding: 'utf8', shell: true }); return { id: t.id, status: r.status, output: `${r.stdout}\n${r.stderr}` }; });
if (baseline.some(x => x.status === 0 || !/(AssertionError|Assertion failed|Expected)/i.test(x.output))) fail(`baseline audit failed: ${JSON.stringify(baseline)}`);
const prompts = tasks.flatMap(t => ['A-lean.md', 'B-structured.md', 'C-prescriptive.md'].map(v => join(root, 'prompts', t.id, v))); if (prompts.length !== 60 || prompts.some(p => !existsSync(p))) fail('prompt parity');
for (const t of tasks) {
  const ps = ['A-lean.md','B-structured.md','C-prescriptive.md'].map(v => readFileSync(join(root,'prompts',t.id,v),'utf8'));
  const end = '--- END CANONICAL TASK CONTRACT ---';
  const blocks = ps.map(p => p.slice(p.indexOf('--- BEGIN CANONICAL TASK CONTRACT ---'), p.indexOf(end) + end.length));
  if (new Set(blocks).size !== 1 || !(ps[0].length < ps[1].length && ps[1].length < ps[2].length)) fail(`prompt QA ${t.id}`);
  if (ps[1].length - ps[0].length < 150 || ps[2].length - ps[1].length < 250) fail(`instruction-density separation too small ${t.id}`);
  if (blocks[0].includes('[object Object]')) fail(`serialized requirement object ${t.id}`);
  if (!blocks[0].includes(`Goal: ${t.goal}`) || !blocks[0].includes(`Allowed target: ${t.target}`) || !blocks[0].includes('Success/evidence:')) fail(`canonical block ${t.id}`);
  for (const requirement of t.requirements) {
    const needle = `${requirement.id}: ${requirement.text}`;
    if (!blocks[0].includes(needle)) fail(`missing prompt requirement ${t.id}/${requirement.id}`);
    if (blocks[0].split(needle).length - 1 !== 1) fail(`duplicate prompt requirement ${t.id}/${requirement.id}`);
  }
  createHash('sha256').update(blocks[0]).digest('hex');
}
if (order.length !== 300 || new Set(order.map(x => `${x.repeat}/${x.task}/${x.variant}`)).size !== 300 || order.some((x,i) => x.order_index !== i+1 || x.seed !== 'agent-prompt-phase2-20260902-v1')) fail('order shape');
for (const v of ['A','B','C']) if (order.filter(x => x.variant === v).length !== 100) fail('variant balance'); for (const t of tasks) if (order.filter(x=>x.task===t.id).length !== 15) fail(`task balance ${t.id}`); for (let r=1;r<=5;r++) if(order.filter(x=>x.repeat===r).length!==60) fail('repeat balance');
for (const p of ['protocol.mjs','run-one.mjs','run-matrix.mjs','freeze.mjs','summarize.mjs','analyze-stability.mjs','smoke.mjs']) if (!existsSync(join(root,p))) fail(`missing ${p}`);
const generator = read('generate-order.mjs');
if (generator.includes('Math.random') || !generator.includes('agent-prompt-phase2-20260902-v1')) fail('order generator is not deterministic');
const protocol = read('protocol.mjs');
for (const marker of ['protocolFiles', 'protocolHash', 'verifyFrozenManifest', 'frozen-input-sha256.txt']) if (!protocol.includes(marker)) fail(`protocol SSOT missing ${marker}`);
const runner = read('run-one.mjs');
for (const marker of ['with-codex-writer-lock.sh','gpt-5.6-luna','--ignore-user-config','--ignore-rules',"model_reasoning_effort='medium'",'protocolHash','verifyFrozenManifest','protocol_hash','metrics.json.tmp','renameSync','invalid-evidence','hadFinalMessage','testInvocations']) if (!runner.includes(marker)) fail(`runner protocol missing ${marker}`);
if (runner.includes('Math.random')) fail('runner uses Math.random');
const matrix = read('run-matrix.mjs');
for (const marker of ['verifyFrozenManifest','protocol_hash','harness_valid',"mode === 'formal'",'renameSync','invalid-evidence','spawnSync']) if (!matrix.includes(marker)) fail(`matrix protocol missing ${marker}`);
const freezer = read('freeze.mjs');
for (const marker of ['protocolFiles','protocolHash','smoke-evidence','protocol_hash','sha256sum','frozen-input-sha256.txt']) if (!freezer.includes(marker)) fail(`freeze protocol missing ${marker}`);
const summarizer = read('summarize.mjs');
if (!summarizer.includes('verifyFrozenManifest') || !summarizer.includes("mode === 'formal'") || summarizer.includes('smoke-evidence') || summarizer.includes('invalid-evidence')) fail('summarizer evidence separation');
const analyzer = read('analyze-stability.mjs');
for (const marker of ['agent-prompt-phase2-analysis-20260902-v1','10000','for (let sample = 0; sample < resamples; sample++)','for (let draw = 0; draw < 20; draw++)','successPass','efficiencyPass',"taskEfficiency('input_tokens'","taskEfficiency('wall_clock_ms'",'SUPPORT','MIXED','NOT_STABLE']) if (!analyzer.includes(marker)) fail(`analysis protocol missing ${marker}`);
if (analyzer.includes('smoke-evidence') || analyzer.includes('invalid-evidence')) fail('analysis evidence separation');
console.log(`QA PASS: ${tasks.length} specs, ${prompts.length} prompts, ${order.length} balanced order cells, 20 assertion-failing baselines, frozen-hash/resume/bootstrap instrumentation present.`);
