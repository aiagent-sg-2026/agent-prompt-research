# Hypotheses and interpretations

This file records our interpretations, not external findings. They are grounded in the frozen pilot and are intentionally provisional.

1. A lean outcome-first prompt may be a good default for bounded coding tasks when it carries all correctness, scope, safety, approval, and evidence requirements. In this pilot A retained 3/3 success and zero unrelated edits while having the lowest mean input tokens and latency.

2. More procedural text may add cost or scope pressure without improving an already-sufficient task. C had the highest aggregate input tokens, output tokens, latency, mean diff, and the only retry proxy, while still matching A and B on success. This is descriptive association, not a causal claim.

3. Structured prompts may improve scope discipline. B had the smallest mean diff (17.33 lines), 35% below A and 52.29% below C, despite all variants changing only the target file. This could reflect organization or task fit; the pilot cannot isolate the mechanism.

4. Prompt length is not a reliable per-task predictor of resource use. On t2, C's prompt was longer than B's but used fewer input tokens and lower latency (90,662 and 53.546s versus 101,227 and 56.484s). Runtime context, caching, model behavior, and task details are plausible contributors.

5. Procedural detail should be added when sequence is itself required or representative evals show a reliability gap. The data do not support deleting needed constraints merely to make a prompt shorter.
