import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { atomicJson, PILOT_ROOT, json } from './common.mjs';
import { protocolHash, verifyFrozenManifest } from './protocol.mjs';
function validMetrics(hash){const d=join(PILOT_ROOT,'evidence');return existsSync(d)?readdirSync(d).flatMap(x=>{try{const m=json(join(d,x,'metrics.json'));return m.harness_valid&&m.protocol_hash===hash?[m]:[]}catch{return[]}}):[];}
function mean(xs,key){const v=xs.map(key).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;}
export function analyze(){
  const frozen=existsSync(join(PILOT_ROOT,'freeze-manifest.sha256')); const hash=frozen?verifyFrozenManifest():null; const rows=hash?validMetrics(hash):[];
  const lengths={}; for(const id of ['A','B','C','D']){const r=rows.filter(x=>x.condition_id===id);lengths[id]={n:r.length,mean_chars:mean(r,x=>x.response_chars),mean_words:mean(r,x=>x.response_words),tool_calls:r.reduce((n,x)=>n+(x.tool_call_count||0),0)};}
  const humanPath=join(PILOT_ROOT,'human-evaluation.json'); const secondaryPath=join(PILOT_ROOT,'secondary-evidence','aggregate.json');
  const secondary=existsSync(secondaryPath)?json(secondaryPath):null;
  const maxMean=Math.max(...Object.values(lengths).map(x=>x.mean_words??0)); const minMean=Math.min(...Object.values(lengths).map(x=>x.mean_words??Infinity));
  const lengthRatio=Number.isFinite(minMean)&&minMean>0?maxMean/minMean:null;
  const complete=rows.length===48; const blindReady=existsSync(join(PILOT_ROOT,'blind-pack','blind-pack.json'));
  const out={label:'TCM PILOT ANALYSIS',protocol_hash:hash,valid_cells:rows.length,
    harness_diagnostics:{expected_cells:48,all_cells_valid:complete,blind_pack_ready:blindReady,length_by_condition:lengths,length_max_min_ratio:lengthRatio,length_confound_warning:lengthRatio&&lengthRatio>1.35?'MATERIAL_LENGTH_DIFFERENCE_REVIEW_REQUIRED':'no >35% mean-word spread detected',tool_use_violation_count:rows.reduce((n,x)=>n+(x.tool_call_count||0),0),condition_separation:'HUMAN/SECONDARY REVIEW REQUIRED'},
    human_evaluation:existsSync(humanPath)?'available':'HUMAN_EVALUATION_PENDING',secondary_evaluation:secondary?{status:'available and secondary-only',completed_blocks:secondary.completed_blocks}: 'not available',
    pilot_status:complete&&blindReady?'PILOT_READY_FOR_HUMAN_REVIEW':'PILOT_NEEDS_REPAIR',behavioral_finding:'NONE — confirmatory interpretation requires predeclared human evaluation; secondary judge is diagnostic only.'};
  atomicJson(join(PILOT_ROOT,'analysis','pilot-analysis.json'),out); console.log(JSON.stringify(out,null,2)); return out;
}
if(process.argv[1]?.endsWith('analyze-pilot.mjs')){try{analyze();}catch(e){console.error(`ANALYZE FAILED: ${e.message}`);process.exit(1);}}
