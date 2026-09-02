import { readFileSync, writeFileSync } from 'node:fs';
const s=JSON.parse(readFileSync('experiments/summary.json','utf8'));
const by=Object.fromEntries(s.by_variant.map(x=>[x.variant,x]));
const pct=(a,b)=>Number(((a-b)/a*100).toFixed(2));
const result={
  status:s.status,
  all_variants_success_rate:Object.fromEntries(s.by_variant.map(x=>[x.variant,x.success_rate])),
  mean_input_tokens:Object.fromEntries(s.by_variant.map(x=>[x.variant,Number(x.input_tokens.mean.toFixed(2))])),
  mean_output_tokens:Object.fromEntries(s.by_variant.map(x=>[x.variant,Number(x.output_tokens.mean.toFixed(2))])),
  mean_latency_ms:Object.fromEntries(s.by_variant.map(x=>[x.variant,Number(x.latency_ms.mean.toFixed(2))])),
  median_latency_ms:Object.fromEntries(s.by_variant.map(x=>[x.variant,x.latency_ms.median])),
  mean_diff_lines:Object.fromEntries(s.by_variant.map(x=>[x.variant,Number(x.diff_lines.mean.toFixed(2))])),
  total_retries:Object.fromEntries(s.by_variant.map(x=>[x.variant,x.test_retry_count.total])),
  total_unrelated_edits:Object.fromEntries(s.by_variant.map(x=>[x.variant,x.unrelated_edit_count.total])),
  comparisons:{
    A_input_reduction_vs_B_pct:pct(by.B.input_tokens.mean,by.A.input_tokens.mean),
    A_input_reduction_vs_C_pct:pct(by.C.input_tokens.mean,by.A.input_tokens.mean),
    A_latency_reduction_vs_B_pct:pct(by.B.latency_ms.mean,by.A.latency_ms.mean),
    A_latency_reduction_vs_C_pct:pct(by.C.latency_ms.mean,by.A.latency_ms.mean),
    A_output_reduction_vs_C_pct:pct(by.C.output_tokens.mean,by.A.output_tokens.mean),
    A_prompt_char_reduction_vs_C_pct:pct(by.C.prompt_chars.mean,by.A.prompt_chars.mean),
    B_diff_reduction_vs_A_pct:pct(by.A.diff_lines.mean,by.B.diff_lines.mean),
    B_diff_reduction_vs_C_pct:pct(by.C.diff_lines.mean,by.B.diff_lines.mean)
  },
  interpretation:'Descriptive n=3 tasks per variant. No significance testing or universal causal claim.'
};
writeFileSync('experiments/derived-analysis.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
