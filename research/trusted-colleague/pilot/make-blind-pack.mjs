import { createHash } from 'node:crypto';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { atomicJson, PILOT_ROOT, json } from './common.mjs';
import { verifyFrozenManifest } from './protocol.mjs';
const SEED = 'tcm-pilot-eval-20260903-v1';
function rngFor(seed) { let s = Number.parseInt(createHash('sha256').update(seed).digest('hex').slice(0,8),16)>>>0; return()=>{s=(Math.imul(s^(s>>>16),2246822519)+3266489917)>>>0;s^=s>>>13;return s>>>0;}; }
function shuffle(values, seed) { const out=[...values]; const next=rngFor(seed); for(let i=out.length-1;i>0;i--){const j=next()%(i+1);[out[i],out[j]]=[out[j],out[i]];} return out; }
export function makeBlindPack() {
  const hash = verifyFrozenManifest();
  const tasks = Object.fromEntries(json(join(PILOT_ROOT,'tasks.json')).tasks.map((t)=>[t.id,t]));
  const evidenceDir = join(PILOT_ROOT,'evidence');
  if (!existsSync(evidenceDir)) throw new Error('no generation evidence');
  const grouped = new Map();
  for (const name of readdirSync(evidenceDir)) {
    try {
      const m=json(join(evidenceDir,name,'metrics.json')); const t=json(join(evidenceDir,name,'transcript.json'));
      if (!m.harness_valid || m.protocol_hash !== hash) continue;
      const block=`${m.task_id}__r${m.repeat}`;
      grouped.set(block,[...(grouped.get(block)||[]),{condition_id:m.condition_id,turns:t.turns.map((x)=>({turn:x.turn,user:x.user,assistant:x.assistant}))}]);
    } catch {}
  }
  const blocks=[]; const keys=[];
  for (const [blockId,responses] of [...grouped.entries()].sort()) {
    if (responses.length !== 4) continue;
    const [taskId,repeatRaw]=blockId.split('__r'); const task=tasks[taskId];
    const shuffled=shuffle(responses,`${SEED}:${blockId}`); const labels=['W','X','Y','Z'];
    const publicResponses={}; const mapping={};
    shuffled.forEach((response,i)=>{publicResponses[labels[i]]=response.turns;mapping[labels[i]]=response.condition_id;});
    blocks.push({
      block_id:blockId, task_id:taskId, repeat:Number(repeatRaw), category:task.category,
      task:{user_turns:task.user_turns,context_evidence:task.context_evidence,acceptance_criteria:task.acceptance_criteria,authority_boundary:task.authority_boundary,scoring_anchors:task.scoring_anchors},
      responses:publicResponses
    });
    keys.push({block_id:blockId,mapping});
  }
  if (blocks.length !== 12) throw new Error(`expected 12 complete blind blocks, got ${blocks.length}`);
  atomicJson(join(PILOT_ROOT,'blind-pack','blind-pack.json'),{label:'BLIND HUMAN-EVALUATION PACK',seed:SEED,protocol_hash:hash,blocks});
  atomicJson(join(PILOT_ROOT,'evaluator-hidden','blind-key.json'),{label:'EVALUATOR-HIDDEN CONDITION KEY',seed:SEED,protocol_hash:hash,blocks:keys});
  console.log(`blind blocks: ${blocks.length}`); return blocks.length;
}
if(process.argv[1]?.endsWith('make-blind-pack.mjs')){try{makeBlindPack();}catch(e){console.error(`BLIND PACK FAILED: ${e.message}`);process.exit(1);}}
