# Agent Prompt Research pilot report

## Executive summary

This completed engineering pilot compared three instruction styles on three deterministic JavaScript coding tasks using `gpt-5.6-luna`, Codex CLI 0.151.0, and medium reasoning effort. The valid evidence is nine cells: three tasks per variant, one run per task/variant.

All A/B/C variants achieved 3/3 task success and zero unrelated edits. Lean A was most efficient on aggregate input tokens and latency. Structured B produced the smallest average diff. Prescriptive C matched the same success rate but had higher aggregate resource measures and the only retry proxy. These are descriptive results from a small pilot, not evidence that short prompts always win, nor evidence of causality or statistical significance.

The practical verdict is: use the leanest prompt that is sufficient. Preserve correctness, safety, domain, approval, success, and evidence constraints. Add procedure when procedure matters or representative evals show a reliability gap.

## Research question

For bounded coding-agent tasks on the same model and environment, can a lean outcome-first prompt preserve task success while reducing input and operational overhead relative to more structured or prescriptive prompts?

The question is deliberately narrower than “are short prompts better?” Prompt length is one observable difference among instruction styles, and the pilot does not isolate it causally.

## Evidence taxonomy

| Evidence class | What it can support | Used here |
|---|---|---|
| Official vendor guidance | Current practitioner guidance and vendor-reported directional observations | OpenAI, Anthropic, Google, Microsoft |
| Peer-reviewed research | Published findings, with direct/indirect relevance labelled | AgentIF, APEX, LongLLMLingua, Lost in the Middle, LLMLingua |
| Preprints/surveys | Landscape and terminology, not peer-reviewed causal evidence | The Prompt Report |
| Our experiment | Frozen, descriptive observations for this model/runtime/tasks | 9 valid cells, n=3 tasks per variant |
| Hypotheses/interpretations | Provisional explanations and decision rules | `research/hypotheses.md` |

## External evidence

### Official vendor guidance

OpenAI's [GPT-5.6 guidance](https://developers.openai.com/api/docs/guides/latest-model) favors leaner prompts, including removing repeated instructions/examples, simplifying tools, exposing only relevant tools, and stating constraints once. It reports directional internal coding-agent eval ranges, but explicitly says they require validation on representative workloads. Its lean recommendation still preserves domain context, hard constraints, autonomy/approval boundaries, success criteria, and necessary examples. [GPT-5.5 guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) emphasizes outcome, success criteria, allowed side effects, evidence rules, and output shape, while reducing process detail unless the path itself matters.

Anthropic's [prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) similarly values clear direct instructions, uses sequence when order or completeness is genuinely required, and cautions against unnecessary legacy verification. [Google's strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) emphasize direct goals, consistent structure, explicit parameters, and prioritization. [Microsoft's Copilot Studio guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-instructions) recommends a clear/simple starting description expanded through testing.

### Peer-reviewed research

[AgentIF](https://papers.neurips.cc/paper_files/paper/2025/hash/51bb3a8a33610a25aae074bfc51b1b1f-Abstract-Datasets_and_Benchmarks_Track.html) is directly relevant to instruction complexity: it reports difficulty with complex constraint structures and tool specifications in a benchmark of real agentic applications. It does not prove shorter prompts are better. [APEX](https://aclanthology.org/2024.findings-acl.634/) is important counter-evidence: long prompts can be systematically improved, and quality/organization/task fit can matter more than raw brevity.

[LongLLMLingua](https://aclanthology.org/2024.acl-long.91/), [Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/), and [LLMLingua](https://aclanthology.org/2023.emnlp-main.825/) are indirect context-efficiency evidence. They concern compression or position-sensitive long-context use, not direct A/B tests of coding-agent prompt verbosity. Their appropriate interpretation is that more context is not automatically better context, while high-signal context can be valuable.

### Preprint/survey evidence

[The Prompt Report](https://arxiv.org/abs/2406.06608) is used for taxonomy and background only. It is not treated as peer-reviewed causal evidence.

## Methodology

The pilot used three dependency-free Node.js fixtures with the built-in test runner: normalize tags, retry, and recursively merge preferences. Each fixture started with a failing baseline, had one allowed production target, deterministic tests, and unrelated files for scope measurement. Each run started from a fresh copy. The frozen interleaved order was `t1/A, t2/B, t3/C, t1/B, t2/C, t3/A, t1/C, t2/A, t3/B`.

Variant A was lean outcome-first (goal, essential context, hard constraints, success/evidence). B retained the same facts with more explicit investigation and verification guidance. C expanded the same facts into a longer step-by-step procedure and repeated reminders; no extra solution hint was allowed. Primary success required passing final tests and only the allowed production file changing. Secondary measures were prompt characters, provider-reported input/cached/output tokens, wall-clock duration, diff size, unrelated edits, and test invocations.

Important measurement detail: reported Codex input tokens include large cached/base agent context. Prompt-character differences are therefore only one contributor to total tokens; prompt characters must not be equated directly with total input tokens.

## Aggregate results

| Variant | Success | Mean prompt chars | Mean input tokens | Mean latency | Mean output tokens | Mean diff | Retry proxy total | Unrelated edits |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A — Lean | 3/3 (100%) | 689.33 | 66,003 | 40.665s | 1,261.33 | 26.67 | 0 | 0 |
| B — Structured | 3/3 (100%) | 928.00 | 86,585.33 | 47.265s | 1,349.67 | 17.33 | 0 | 0 |
| C — Prescriptive | 3/3 (100%) | 1,290.00 | 97,599.33 | 58.232s | 1,988.00 | 36.33 | 1 | 0 |

On these aggregate means, A used 23.77% fewer input tokens than B and 32.37% fewer than C. A's mean latency was 13.96% lower than B and 30.17% lower than C. B's mean diff was 35% smaller than A and 52.29% smaller than C. The retry proxy is operational only—`max(0, completed agent test-command events - 1)`—not a provider retry count.

## Per-task results

| Task | Variant | Prompt chars | Input tokens | Latency | Output tokens | Diff lines | Retry proxy | Success | Changed file |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| normalize tags | A | 626 | 55,370 | 33.050s | 889 | 18 | 0 | yes | `src/normalize-tags.js` |
| normalize tags | B | 868 | 84,515 | 37.573s | 877 | 6 | 0 | yes | `src/normalize-tags.js` |
| normalize tags | C | 1,210 | 71,846 | 37.809s | 1,146 | 21 | 0 | yes | `src/normalize-tags.js` |
| retry | A | 650 | 69,841 | 39.782s | 1,164 | 19 | 0 | yes | `src/retry.js` |
| retry | B | 889 | 101,227 | 56.484s | 1,475 | 16 | 0 | yes | `src/retry.js` |
| retry | C | 1,251 | 90,662 | 53.546s | 1,736 | 15 | 0 | yes | `src/retry.js` |
| merge preferences | A | 792 | 72,798 | 49.163s | 1,731 | 43 | 0 | yes | `src/merge-preferences.js` |
| merge preferences | B | 1,027 | 74,014 | 47.739s | 1,697 | 30 | 0 | yes | `src/merge-preferences.js` |
| merge preferences | C | 1,409 | 130,290 | 83.340s | 3,082 | 73 | 1 | yes | `src/merge-preferences.js` |

The per-task pattern is non-monotonic. For example, t2/C's prompt was longer than t2/B's but used fewer input tokens and lower latency. This is why prompt characters cannot be used as a direct proxy for total runtime input or performance.

## Paired interpretation

Every task-level pairing ended in success with target-only scope, so the pilot found no success or unrelated-edit separation among variants. A is the aggregate efficiency leader for input tokens and latency; B is the scope/diff leader; C has no observed success advantage in these cells and is costlier on the recorded aggregate measures. Those observations may reflect the tested task mix, runtime cache state, ordering, or model behavior. They do not identify a causal effect of verbosity.

The result is compatible with the external guidance's outcome-first/high-signal direction, but it is also compatible with APEX's warning that well-organized longer prompts can work. In particular, B's smaller diffs show that added structure may be useful for scope discipline even when it does not improve binary task success.

## Practical decision framework

1. Start with the outcome: name the task, relevant domain context, allowed files/side effects, correctness contract, success test, evidence to report, and approval boundary.
2. Remove repetition, stale examples, irrelevant tools, and process narration. Keep any detail whose omission could change correctness, safety, business semantics, approvals, or evidence.
3. Add procedure only when sequence, completeness, or a required workflow is itself part of the task—or when representative evals show a reliability gap.
4. Evaluate the smallest candidate set on representative tasks. Track success first, then scope/diff, latency, input/output tokens, and operational retry proxies.
5. Treat a prompt variant as a workload-specific configuration, not a universal ranking. Recheck after model, tool, runtime, or domain changes.

## Limitations and threats

This is descriptive n=3 tasks per variant: no statistical power, confidence intervals, significance testing, or causal identification. It uses one model/runtime (`gpt-5.6-luna`, Codex CLI 0.151.0), medium reasoning, one run per task/variant, three small deterministic JavaScript tasks, and limited agent-domain diversity. Caching, interleaved order, environment effects, and runtime variability may affect token and latency observations. The task set is bounded and does not represent production workflows. Provider usage is accepted as reported; missing or unparseable usage would be unknown rather than fabricated. The retry field is an operational test-invocation proxy, not provider retry telemetry. Diff lines measure scope/shape imperfectly and not code quality.

## Reproducibility and evidence links

The [methodology](research/methodology.md), [experiment contract](meta/experiment-contract.md), [frozen-input manifest](meta/frozen-input-sha256.txt), [aggregate summary](experiments/summary.json), and [derived analysis](experiments/derived-analysis.json) define the protocol and numbers. Prompts are in `experiments/prompts/`; raw metrics, prompts, final messages, diffs, and Codex event streams are in `experiments/evidence/`. The [summary markdown](experiments/summary.md) is a compact human-readable view. Run `node experiments/summarize.mjs`, `node experiments/derive-analysis.mjs`, and `sha256sum -c meta/frozen-input-sha256.txt` for deterministic aggregation/integrity checks; the official agent matrix should not be rerun as part of ordinary verification.

## Recovery notes

An initial t1/A infrastructure attempt is preserved under `experiments/invalid-evidence/t1-normalize-tags/A/attempt-1-wrapper-exec127/`. It exited 127 after 3 ms, had no token usage or edits, and left final tests failing because the wrapper was invoked without the `codex` executable name. The harness was fixed and the same first matrix cell was rerun; the invalid attempt is excluded from all aggregates.

During VMMCP 502 recovery, a process probe observed a completed t3/C run before the frozen-order t2/B run. That observation is excluded as `EXCLUDED_OUT_OF_ORDER`; its observed metrics were success, 70,619 ms, 93,202 input tokens, 2,725 output tokens, 72 diff lines, one test invocation, zero retry proxy, and zero unrelated edits. The correctly ordered t3/C run is the sole t3/C aggregate input. The excluded run used the active evidence path and its full raw files were overwritten before copying, so only those probe metrics are preserved. Neither event is counted in aggregate.

## Final verdict

For this bounded pilot, choose the leanest prompt that remains sufficient: preserve correctness, safety, domain, approval, success, and evidence constraints; add procedure when procedure matters or evals show a reliability gap. A is the observed aggregate efficiency choice, while B is the observed diff/scope choice. The evidence does not justify a universal “shorter is better” rule.
