Continue this existing research repository; do not reset or delete the seed work. Build the reproducible experiment infrastructure and research/site skeleton for a study of prompt instruction density for modern AI agents.

Hard project rules:
- Preserve existing README.md and research/methodology.md intent; improve them only where needed.
- This is a small bounded engineering pilot, not proof that short prompts are universally better.
- Separate: official vendor guidance, peer-reviewed research, preprints, our Luna experiment evidence, and hypotheses.
- Never invent experiment results. Any result area that has not run yet must clearly say PENDING.
- Preserve raw prompts/results/evidence in the repository.
- All experiment agent runs use exactly gpt-5.6-luna, Codex CLI 0.151.0, reasoning effort medium, fresh fixture copies, and no user/project prompt rules where practical.
- A/B/C prompts for a given task must contain exactly the same task facts/requirements. A may be lean outcome-first, B structured medium, C long prescriptive. C may add process guidance/repetition but no extra solution hint or requirement.
- The evaluator must be deterministic and independent from model prose.
- One Codex writer at a time is enforced by the existing scripts/with-codex-writer-lock.sh. The experiment runner must use that wrapper for every Codex call.

Create three dependency-free Node.js fixtures (Node built-in test runner), each with a failing baseline implementation, tests, package.json, and unrelated files so scope discipline can be measured. The only allowed production file for each run is the named target.

Task t1-normalize-tags, target src/normalize-tags.js:
- export function normalizeTags(tags)
- tags must be an array, otherwise TypeError
- every array element must be a string, otherwise TypeError
- trim leading/trailing whitespace
- lowercase using normal JavaScript toLowerCase
- omit entries that become empty after trimming
- remove duplicates after normalization, preserving first occurrence order
- do not mutate the input array

Task t2-retry, target src/retry.js:
- export async function retry(operation, options = {})
- operation must be a function, otherwise TypeError
- options.retries defaults to 2 and must be a non-negative integer, otherwise TypeError
- total attempts are retries + 1
- return the first successfully resolved value, including falsy values
- on throw/rejection, retry until attempts are exhausted
- after exhaustion, throw the final error object unchanged

Task t3-merge-preferences, target src/merge-preferences.js:
- export function mergePreferences(defaults, overrides)
- both inputs must be plain objects (non-null object, not array), otherwise TypeError
- return a new recursively merged plain object
- when both corresponding values are plain objects, merge recursively
- arrays and all non-plain-object values from overrides replace defaults
- an override value of undefined means retain the default value
- keys only in overrides are included
- do not mutate either input or reuse nested plain-object/array references from either input in the result

Each fixture should have at least one unrelated source file and one docs file that are not to be edited. Baseline tests must fail before any agent change. Keep tests deterministic and comprehensive enough to score the stated contract.

Create prompts under experiments/prompts/<task>/{A-lean,B-structured,C-prescriptive}.md. Same facts in each variant. A should be compact outcome-first (goal, hard requirements, success evidence). B should add concise investigation/verification structure. C should add explicit ordered process and repeated safeguards but no new task facts. Record prompt char counts in generated metrics, not hard-coded prose.

Create experiments/run-one.mjs accepting TASK and VARIANT (A|B|C). It must:
1. Make a fresh experiments/runs/<task>/<variant> copy from the fixture, removing any prior run dir.
2. Initialize a local git repo in that run dir, configure a local test identity, add/commit baseline.
3. Run baseline npm test and save stdout/stderr/exit code evidence; baseline should be nonzero, otherwise abort that run as invalid.
4. Invoke Codex through ../../../../scripts/with-codex-writer-lock.sh (resolve paths robustly), using stdin prompt and exactly: codex exec --ephemeral --ignore-user-config --ignore-rules -m gpt-5.6-luna -c model_reasoning_effort='medium' -s workspace-write --json -o <final-message-file> -C <run-dir> - . Do not use network/search. Do not automatically retry a failed Codex process.
5. Save raw Codex JSONL stdout, stderr, exit code, start/end ISO timestamps, wall-clock milliseconds, and final message.
6. Run the deterministic final npm test independently and save its output/exit code.
7. Save git changed-file list, diff.patch, numstat, file count, additions/deletions, whether any file other than the target changed, and whether target changed.
8. Parse the final turn usage from JSONL if present: input_tokens, cached_input_tokens, output_tokens. If unavailable, store null, never guess.
9. Count completed Codex command-execution events whose command invokes npm test or node --test. Store agent_test_invocations and test_retry_count=max(0,count-1), clearly defining this as an operational proxy, not provider retry count.
10. Write evidence/metrics.json and mirror/copy the important raw files to experiments/evidence/<task>/<variant>/ so committed evidence is independent of transient run dirs.
11. Define task_success = final test exit 0 AND target changed AND no unrelated/prohibited file changed AND Codex exit 0.

Create experiments/run-matrix.mjs that prints the frozen interleaved order and can run all sequentially, never concurrently: t1/A, t2/B, t3/C, t1/B, t2/C, t3/A, t1/C, t2/A, t3/B. It may call run-one.mjs serially. Do not hide a failed run.

Create experiments/summarize.mjs that reads all 9 metrics and emits experiments/summary.json, experiments/summary.csv, experiments/summary.md, and docs/data/summary.json. Aggregate by variant across the 3 tasks: success count/rate, prompt chars, token totals/means (null-aware), latency mean/median, changed files, diff lines, unrelated-edit count, agent test invocations, test-retry proxy. Preserve per-run rows. Do not make causal claims.

Create research/official-guidance.md, research/peer-reviewed.md, research/preprints.md, research/hypotheses.md, and research/source-log.md using ONLY the source-backed notes below. Link to sources directly. Explicitly distinguish direct prompt-verbosity evidence from indirect long-context evidence.

Source-backed notes to encode, without embellishment:
1) OpenAI GPT-5.6 Model Guidance, https://developers.openai.com/api/docs/guides/latest-model
   - Current guidance says "Favor leaner prompts"; remove repeated instructions/examples and simplify tool descriptions where possible.
   - OpenAI reports a sample of internal coding-agent evals in which leaner system prompts improved evaluation scores roughly 10-15%, reduced total tokens 41-66%, and reduced cost 33-67%.
   - OpenAI explicitly calls those ranges directional and says to validate on representative workloads.
   - Outcome-focused prompts should keep goal, relevant context, constraints, required evidence, success criteria, and output format; domain context/hard constraints/approval boundaries remain important.
2) OpenAI GPT-5.5 guidance, https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5
   - Start from the smallest prompt that preserves the product contract; prefer outcome-first instructions; reduce detailed step-by-step process unless exact path matters; legacy prompting can add noise or mechanical behavior.
3) Anthropic prompt best practices, https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables
   - Current reasoning-model guidance often favors general instructions over prescriptive reasoning steps; explicit self-check criteria can help but inherited verification instructions can sometimes cause over-verification/token/latency overhead. Treat as vendor guidance, not universal proof.
4) Google Gemini prompting strategies, https://ai.google.dev/gemini-api/docs/prompting-strategies and Gemini 3 guidance at https://ai.google.dev/gemini-api/docs/gemini-3
   - Be direct, clear, specific and consistently structured; verbose/overly complex legacy techniques can cause over-analysis in newer models. For complex systems Google also shows structured prompt templates/chaining, so "concise" does not mean "omit required structure".
5) Microsoft Copilot Studio real-time agent guidance, https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/optimize-prompts-custom-agents
   - Structured instructions are useful for complex flows, ordered logic, rules/fallbacks; supports keeping procedure when sequence itself matters.
6) AgentIF: Benchmarking Instruction Following of Large Language Models in Agentic Scenarios, NeurIPS 2025, https://proceedings.neurips.cc/paper_files/paper/2025/hash/9d11096820f63d9f0a6c746aeb2e2442-Abstract-Conference.html
   - Peer-reviewed benchmark built from 50 real-world agent applications, 707 human-annotated instructions, average about 1,723 words and 11.9 constraints; reports substantial difficulty following complex agent instructions. Use as evidence that instruction burden/constraint density matters, not as proof that prompt length alone causes failure.
7) Lost in the Middle: How Language Models Use Long Contexts, TACL 2024, https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long
   - Peer-reviewed controlled evidence that long-context models do not use information uniformly across positions. This is indirect evidence for prompt design; do not present it as a prompt-verbosity experiment.
8) Automatic Engineering of Long Prompts, Findings of ACL 2024, https://aclanthology.org/2024.findings-acl.714/
   - Peer-reviewed counterpoint: automatically optimized long prompts can improve task accuracy; paper reports average 9.2% accuracy gain over baseline prompts on eight BBH tasks and consistent GSM8K improvements. This shows prompt content/optimization can matter more than raw length.
9) LIFBench: Evaluating the Instruction Following Performance and Stability of Large Language Models in Long-Context Scenarios, ACL 2025, https://aclanthology.org/2025.acl-long.1358/
   - Peer-reviewed long-context instruction-following benchmark; useful as supporting evidence that instruction following under long context is a distinct reliability problem.
10) Preprint: An Empirical Study on Prompt Compression, arXiv 2025, https://arxiv.org/abs/2504.15508
   - Classify as preprint. Treat any quality gains from moderate compression as workload-dependent, not universal.

Create REPORT.md and docs/index.html/docs/styles.css/docs/app.js with a clean responsive accessible research-site skeleton. Before experiments are summarized, clearly show PENDING experiment cells rather than invented numbers. Site should be mobile-first, no CDN, no build step, GitHub Pages compatible. Include methodology, evidence taxonomy, experiment design, result placeholder, practical decision framework, limitations, and links to raw evidence/report/repo paths.

Also update README.md into a useful navigation page. Add .gitignore entries so experiments/runs are ignored, but experiments/evidence is tracked. Do not add third-party dependencies.

Before finishing, run fixture baseline tests (they should fail) and syntax/check commands for the harness itself. Report exactly what you created and what remains pending; do not run the 9 experiments yet.
