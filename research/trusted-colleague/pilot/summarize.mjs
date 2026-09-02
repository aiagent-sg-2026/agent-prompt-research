import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { atomicJson, PILOT_ROOT, json } from './common.mjs';
import { protocolHash, validateOrder, verifyFrozenManifest } from './protocol.mjs';
function validMetrics() { const dir = join(PILOT_ROOT, 'evidence'); if (!existsSync(dir)) return []; return readdirSync(dir).flatMap((x) => { try { const m = json(join(dir, x, 'metrics.json')); return m.harness_valid ? [m] : []; } catch { return []; } }); }
function mean(rows, getter) { const values = rows.map(getter).filter(Number.isFinite); return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null; }
export function summarize() {
  const order = json(join(PILOT_ROOT, 'order.json')); validateOrder(order);
  const frozen = existsSync(join(PILOT_ROOT, 'freeze-manifest.sha256')); if (frozen) verifyFrozenManifest();
  const rows = validMetrics(); const invalidAttempts = existsSync(join(PILOT_ROOT, 'invalid-evidence')) ? readdirSync(join(PILOT_ROOT, 'invalid-evidence')).length : 0;
  const byCondition = {};
  for (const id of ['A','B','C','D']) {
    const r = rows.filter((x) => x.condition_id === id);
    byCondition[id] = {
      valid_cells: r.length,
      mean_response_chars: mean(r, (x)=>x.response_chars),
      mean_response_words: mean(r, (x)=>x.response_words),
      mean_latency_ms: mean(r, (x)=>x.latency_ms),
      mean_input_tokens: mean(r, (x)=>x.token_totals?.input_tokens),
      mean_output_tokens: mean(r, (x)=>x.token_totals?.output_tokens),
      tool_call_count: r.reduce((n,x)=>n+(x.tool_call_count||0),0),
      multi_turn_completed: r.filter((x)=>x.expected_turns > 1 && x.turns_completed === x.expected_turns).length
    };
  }
  const out = {
    label: 'PILOT GENERATION SUMMARY ONLY', protocol_hash: frozen ? protocolHash() : null,
    status: rows.length === 48 ? 'GENERATION_COMPLETE' : 'GENERATION_IN_PROGRESS',
    valid_cells: rows.length, expected_cells: 48, pending_cells: 48 - rows.length, invalid_attempts: invalidAttempts,
    by_condition: byCondition, human_behavioral_findings: 'PENDING EVALUATION',
    note: 'Length/token/latency are descriptive generation diagnostics, not evidence that any TCM condition is better.'
  };
  atomicJson(join(PILOT_ROOT, 'summaries', 'generation-summary.json'), out); console.log(JSON.stringify(out, null, 2)); return out;
}
if (process.argv[1]?.endsWith('summarize.mjs')) summarize();
