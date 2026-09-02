import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pilot = join(root, 'research', 'trusted-colleague', 'pilot');
const failures = [];
const read = (file) => readFileSync(join(root, file), 'utf8');
const required = [
  'research/trusted-colleague/README.md','research/trusted-colleague/protocol-v0.1.md','research/trusted-colleague/hypotheses.md','research/trusted-colleague/source-pack.md','research/trusted-colleague/evaluation-rubric.md',
  'research/trusted-colleague/conditions/A-report-assistant.md','research/trusted-colleague/conditions/B-friendly-assistant.md','research/trusted-colleague/conditions/C-trusted-colleague.md','research/trusted-colleague/conditions/D-adaptive-trusted-colleague.md','docs/tcm.html',
  'research/trusted-colleague/pilot/PILOT-CONTRACT.md','research/trusted-colleague/pilot/tasks.json','research/trusted-colleague/pilot/conditions.json','research/trusted-colleague/pilot/order.json','research/trusted-colleague/pilot/secondary-eval-schema.json',
  'research/trusted-colleague/pilot/common.mjs','research/trusted-colleague/pilot/generate-order.mjs','research/trusted-colleague/pilot/protocol.mjs','research/trusted-colleague/pilot/freeze.mjs','research/trusted-colleague/pilot/run-one.mjs','research/trusted-colleague/pilot/run-matrix.mjs','research/trusted-colleague/pilot/summarize.mjs','research/trusted-colleague/pilot/make-blind-pack.mjs','research/trusted-colleague/pilot/evaluate-secondary.mjs','research/trusted-colleague/pilot/analyze-pilot.mjs'
];
for (const file of required) if (!existsSync(join(root, file))) failures.push(`missing ${file}`);

const overview=read('research/trusted-colleague/README.md'); const protocol=read('research/trusted-colleague/protocol-v0.1.md'); const hypotheses=read('research/trusted-colleague/hypotheses.md'); const sources=read('research/trusted-colleague/source-pack.md'); const rubric=read('research/trusted-colleague/evaluation-rubric.md'); const html=read('docs/tcm.html'); const rootReadme=read('README.md');
for (const [name,text] of [['overview',overview],['protocol',protocol],['hypotheses',hypotheses],['site',html]]) if(!/PRE-PILOT|untested|preregistered draft/i.test(text)) failures.push(`${name} does not expose pre-pilot/untested status`);
for(const marker of ['48 runs','480 runs','24 real-world tasks','Blind evaluation','Collaboration Friction Score','A — Report Assistant','B — Friendly Assistant','C — Trusted Colleague','D — Adaptive Trusted Colleague']) if(!protocol.includes(marker)) failures.push(`protocol missing: ${marker}`);
for(const marker of ['Task Success','Colleague Fit','Collaboration Friction Score','Willingness to Continue','Unsupported Certainty','Over-Initiative']) if(!rubric.includes(marker)) failures.push(`rubric missing: ${marker}`);
for(const doi of ['10.1177/1046496405277134','10.1080/1463922X.2022.2061080','10.1145/3764591','10.3389/fpsyg.2025.1637339']) if(!sources.includes(doi)) failures.push(`source pack missing DOI: ${doi}`);
if(!rootReadme.includes('Track 2 — Trusted Colleague Model (TCM)')||!rootReadme.includes('PRE-PILOT')) failures.push('root README does not clearly expose TCM as pre-pilot track');
if(!html.includes('PRE-PILOT')||!html.includes('No TCM experiment has been run yet')) failures.push('TCM site must withhold experimental claims');
if(/TCM (?:proved|proves|outperformed|improved task|reduced friction by)/i.test(html)) failures.push('TCM site appears to claim an unrun result');
const legacyConditions=['A-report-assistant.md','B-friendly-assistant.md','C-trusted-colleague.md','D-adaptive-trusted-colleague.md'].map(f=>read(`research/trusted-colleague/conditions/${f}`));
if(!/isolat/i.test(legacyConditions[1])||!/friendl/i.test(legacyConditions[1])||!legacyConditions[1].includes('from teammate behavior')) failures.push('existing B condition no longer isolates friendly expression');
if(!legacyConditions[2].includes('Peer Trusted Colleague')) failures.push('existing C condition is not fixed peer stance');
for(const stance of ['Peer','Senior','Specialist','Reviewer','Operator']) if(!legacyConditions[3].includes(stance)) failures.push(`existing D missing stance ${stance}`);

if (existsSync(pilot)) {
  const tasks=JSON.parse(readFileSync(join(pilot,'tasks.json'),'utf8')); const conditions=JSON.parse(readFileSync(join(pilot,'conditions.json'),'utf8')); const order=JSON.parse(readFileSync(join(pilot,'order.json'),'utf8'));
  if(tasks.version!=='tcm-pilot-tasks-v1'||tasks.tasks?.length!==6) failures.push('pilot must have exactly six versioned tasks');
  const ids=tasks.tasks?.map(x=>x.id)??[]; if(JSON.stringify(ids)!==JSON.stringify(['p01','p02','p03','p04','p05','p06'])) failures.push('pilot task IDs must be p01..p06 in order');
  for(const task of tasks.tasks??[]){
    for(const field of ['id','category','turns','user_turns','context_evidence','acceptance_criteria','authority_boundary','tcm_mechanisms','scoring_anchors']) if(task[field]==null) failures.push(`${task.id} missing ${field}`);
    if(!Array.isArray(task.user_turns)||!Array.isArray(task.acceptance_criteria)||task.acceptance_criteria.length<3||!Array.isArray(task.scoring_anchors)||task.scoring_anchors.length<3) failures.push(`${task.id} incomplete task/scoring contract`);
  }
  if(tasks.tasks.find(x=>x.id==='p05')?.user_turns.length<2||tasks.tasks.find(x=>x.id==='p06')?.user_turns.length<2) failures.push('p05/p06 must be genuinely multi-turn');
  if(conditions.version!=='tcm-pilot-conditions-v1'||conditions.conditions?.length!==4||JSON.stringify(conditions.conditions.map(x=>x.id))!==JSON.stringify(['A','B','C','D'])) failures.push('pilot conditions must be exact A/B/C/D');
  if(/experiment|pre-pilot|condition|evaluation|hidden criteria/i.test(conditions.common_base)) failures.push('model-facing common base leaks experiment/evaluation framing');
  for(const c of conditions.conditions??[]) if(new RegExp(`condition\\s+${c.id}\\b`,'i').test(c.prompt)) failures.push(`condition ${c.id} leaks its condition label`);
  const B=conditions.conditions.find(x=>x.id==='B')?.prompt??''; const C=conditions.conditions.find(x=>x.id==='C')?.prompt??''; const D=conditions.conditions.find(x=>x.id==='D')?.prompt??'';
  for(const marker of ['do not gain initiative','monitoring','backup','disagreement','expression only']) if(!B.toLowerCase().includes(marker)) failures.push(`B isolation marker missing: ${marker}`);
  if(!/fixed peer relationship/i.test(C)||/(Senior|Specialist|Reviewer|Operator)/.test(C)) failures.push('C must stay fixed peer without adaptive stance set');
  for(const stance of ['Peer','Senior','Specialist','Reviewer','Operator']) if(!D.includes(stance)) failures.push(`D missing adaptive stance: ${stance}`);
  if(!D.includes('fixed role router')||!/Do not announce the stance/i.test(D)) failures.push('D adaptive stance safeguards missing');
  if(order.seed!=='tcm-pilot-generation-20260903-v1'||order.cells?.length!==48) failures.push('pilot order seed/size mismatch');
  const keys=(order.cells??[]).map(x=>`${x.taskId}|${x.conditionId}|${x.repeat}`); if(new Set(keys).size!==48) failures.push('pilot order contains duplicate cells');
  if((order.cells??[]).some((x,i)=>x.orderIndex!==i+1)) failures.push('pilot order index must be 1..48');
  for(const repeat of [1,2]){const block=(order.cells??[]).filter(x=>x.repeat===repeat);if(block.length!==24)failures.push(`repeat ${repeat} size mismatch`);for(const id of ids)if(block.filter(x=>x.taskId===id).length!==4)failures.push(`repeat ${repeat} task ${id} imbalance`);for(const id of ['A','B','C','D'])if(block.filter(x=>x.conditionId===id).length!==6)failures.push(`repeat ${repeat} condition ${id} imbalance`);}
  const gen=read('research/trusted-colleague/pilot/generate-order.mjs'); if(gen.includes('Math.random')||!gen.includes('tcm-pilot-generation-20260903-v1')) failures.push('generation randomization is not deterministic');
  const runner=read('research/trusted-colleague/pilot/run-one.mjs');
  for(const marker of ['with-codex-writer-lock.sh','--ephemeral','--ignore-user-config','--ignore-rules','gpt-5.6-luna',"model_reasoning_effort='medium'",'--sandbox',"'read-only'",'--skip-git-repo-check',"'-o'",'mkdtempSync','tcm-pilot-neutral-','moveExistingToInvalid',"atomicJson(join(evidenceDir, 'metrics.json')",'tool_call_count']) if(!runner.includes(marker)) failures.push(`runner protocol marker missing: ${marker}`);
  if(!runner.includes('prompt-turn-')||!runner.includes('final-message-turn-')||!runner.includes('transcriptText +=')) failures.push('runner multi-turn/raw-evidence contract missing');
  const freeze=read('research/trusted-colleague/pilot/freeze.mjs'); for(const marker of ['qa-tcm.mjs','sha256sum','refusing to freeze with existing model evidence','verifyFrozenManifest']) if(!freeze.includes(marker)) failures.push(`freeze safeguard missing: ${marker}`);
  const matrix=read('research/trusted-colleague/pilot/run-matrix.mjs'); for(const marker of ['--run','--resume','--from','--through','--limit','verifyFrozenManifest']) if(!matrix.includes(marker)) failures.push(`matrix option/safeguard missing: ${marker}`);
  const protocolCode=read('research/trusted-colleague/pilot/protocol.mjs'); for(const marker of ['evaluation-rubric.md','order.json','secondary-eval-schema.json','qa-tcm.mjs','with-codex-writer-lock.sh','protocolHash','verifyFrozenManifest']) if(!protocolCode.includes(marker)) failures.push(`protocol SSOT missing: ${marker}`);
  const blind=read('research/trusted-colleague/pilot/make-blind-pack.mjs'); if(!blind.includes('tcm-pilot-eval-20260903-v1')||!blind.includes('acceptance_criteria')||!blind.includes('evaluator-hidden')||!blind.includes("labels=['W','X','Y','Z']")) failures.push('blind-pack separation/context contract missing');
  const secondary=read('research/trusted-colleague/pilot/evaluate-secondary.mjs'); if(!secondary.includes('SECONDARY LLM-AS-JUDGE PILOT EVALUATION')||!secondary.includes('human_evidence:false')||!secondary.includes('--output-schema')) failures.push('secondary judge is not explicitly secondary/schema-bound');
  const analysis=read('research/trusted-colleague/pilot/analyze-pilot.mjs'); if(!analysis.includes('HUMAN_EVALUATION_PENDING')||!analysis.includes('PILOT_READY_FOR_HUMAN_REVIEW')||!/behavioral_finding.*NONE/.test(analysis)) failures.push('pilot analysis could overclaim before human evaluation');
  const blindPath=join(pilot,'blind-pack','blind-pack.json'); if(existsSync(blindPath)&&/condition_id|conditionId|condition_prompt|\"A\"\s*:|\"B\"\s*:|\"C\"\s*:|\"D\"\s*:/.test(readFileSync(blindPath,'utf8'))) failures.push('generated blind pack leaks condition identity');
  const forbidden=spawnSync('git',['status','--short','--','experiments','fixtures','phase2','REPORT.md'],{cwd:root,encoding:'utf8'}); if((forbidden.stdout??'').trim()) failures.push(`TCM pilot modified forbidden prompt-density paths:\n${forbidden.stdout}`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1);} console.log('TCM QA passed: base track plus six-task pilot protocol, condition isolation, randomization, freeze/runner/blinding, secondary labeling, and track isolation are valid.');
