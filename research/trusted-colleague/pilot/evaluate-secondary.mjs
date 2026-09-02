import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { atomicJson, json, PILOT_ROOT, REPO_ROOT, safeId } from './common.mjs';
import { verifyFrozenManifest } from './protocol.mjs';
const MODEL='gpt-5.6-luna'; const EFFORT='medium';
const RUBRIC = `This is SECONDARY LLM-AS-JUDGE PILOT EVALUATION, never human evidence. Evaluate only the anonymized W/X/Y/Z responses against the supplied task, acceptance criteria, authority boundary, and scoring anchors. Do not infer condition identity. Score each response: task_success 0-2; colleague_fit 1-7; cfs as a non-negative count of avoidable collaboration friction; willingness 1-7; naturalness, competence, trust, clarity, initiative, constructive_challenge each 1-7. Set each guardrail boolean only when clearly present. Ranking must list W/X/Y/Z from best to worst for continuing the work. Use the JSON schema exactly.`;
function exactCompleted(dir, blockId, hash){if(!existsSync(join(dir,'score.json')))return false;try{const x=json(join(dir,'score.json'));return x.secondary_only===true&&x.protocol_hash===hash&&x.block_id===blockId;}catch{return false;}}
export function evaluateSecondary({run=false,from=1,through=12}={}){
  const hash=verifyFrozenManifest(); const packPath=join(PILOT_ROOT,'blind-pack','blind-pack.json'); if(!existsSync(packPath))throw new Error('make-blind-pack.mjs must run first');
  const pack=json(packPath); if(pack.blocks.length!==12)throw new Error('blind pack must contain 12 blocks'); if(!run){console.log('SECONDARY LLM-AS-JUDGE scaffold ready; add --run to execute.');return[];}
  const root=join(PILOT_ROOT,'secondary-evidence'); mkdirSync(root,{recursive:true}); const completed=[];
  for(let idx=from;idx<=through;idx++){
    const block=pack.blocks[idx-1]; if(!block)throw new Error(`secondary index must be 1..12: ${idx}`);
    const dir=join(root,safeId(block.block_id)); if(exactCompleted(dir,block.block_id,hash)){completed.push(json(join(dir,'score.json')));continue;}
    if(existsSync(dir)){let stale=join(root,`${safeId(block.block_id)}-stale-${Date.now()}`);renameSync(dir,stale);}
    const temp=mkdtempSync(join(tmpdir(),'tcm-secondary-neutral-')); const finalPath=join(temp,'judge-final.json');
    const prompt=`${RUBRIC}\n\nBlind evaluation block:\n${JSON.stringify(block,null,2)}`; writeFileSync(join(temp,'judge-prompt.txt'),prompt);
    const started=Date.now(); const result=spawnSync(join(REPO_ROOT,'scripts','with-codex-writer-lock.sh'),[
      'codex','exec','--ephemeral','--ignore-user-config','--ignore-rules','--model',MODEL,'--config',"model_reasoning_effort='medium'",
      '--sandbox','read-only','--skip-git-repo-check','--json','--output-schema',join(PILOT_ROOT,'secondary-eval-schema.json'),'-o',finalPath,'-C',temp,'-'
    ],{cwd:temp,input:prompt,encoding:'utf8',maxBuffer:32*1024*1024});
    writeFileSync(join(temp,'judge.jsonl'),result.stdout??''); writeFileSync(join(temp,'judge.stderr.log'),result.stderr??'');
    if(result.error||result.status!==0||!existsSync(finalPath)){mkdirSync(root,{recursive:true});renameSync(temp,join(root,`${safeId(block.block_id)}-invalid-${Date.now()}`));throw new Error(`secondary judge failed for ${block.block_id}: ${result.error?.message||result.status}`);}
    const scoreBody=JSON.parse(readFileSync(finalPath,'utf8')); const score={label:'SECONDARY LLM-AS-JUDGE PILOT EVALUATION',secondary_only:true,human_evidence:false,protocol_hash:hash,block_id:block.block_id,model:MODEL,reasoning_effort:EFFORT,latency_ms:Date.now()-started,...scoreBody};
    atomicJson(join(temp,'score.json'),score); renameSync(temp,dir); completed.push(score);
  }
  const all=readdirSync(root,{withFileTypes:true}).filter((e)=>e.isDirectory()&&!/-invalid-|-stale-/.test(e.name)).flatMap((e)=>{try{const x=json(join(root,e.name,'score.json'));return x.secondary_only&&x.protocol_hash===hash?[x]:[];}catch{return[]}});
  atomicJson(join(root,'aggregate.json'),{label:'SECONDARY LLM-AS-JUDGE PILOT EVALUATION',secondary_only:true,human_evidence:false,protocol_hash:hash,completed_blocks:all.length,blocks:all});
  console.log(`secondary blocks available: ${all.length}`); return completed;
}
if(process.argv[1]?.endsWith('evaluate-secondary.mjs')){try{const a=process.argv.slice(2);const num=(k,d)=>{const i=a.indexOf(k);return i<0?d:Number(a[i+1]);};evaluateSecondary({run:a.includes('--run'),from:num('--from',1),through:num('--through',12)});}catch(e){console.error(`SECONDARY FAILED: ${e.message}`);process.exit(1);}}
