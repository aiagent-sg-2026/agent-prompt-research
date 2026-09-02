# Pilot Methodology

## Hypothesis
For bounded coding-agent tasks on the same model and environment, lean outcome-first prompts can preserve task success while reducing prompt size and potentially reducing total token use / unnecessary scope compared with long prescriptive prompts.

## Important limitation
This is a small engineering pilot, not a statistically powered scientific study. Results apply only to the tested tasks, model, Codex version, reasoning effort, and environment. The public report must not generalize beyond the evidence.

## Model and runtime
- Model: gpt-5.6-luna
- Codex CLI: 0.151.0
- Reasoning effort: medium (runtime default)
- Environment: isolated Ubuntu ARM64 VMMCP workspace
- Each run starts from a fresh copy of the same task fixture.
- User/project rules are suppressed for experiment runs where practical to reduce confounding.

## Prompt variants
A. Lean outcome-first: goal, essential context, hard constraints, success criteria, evidence/output.
B. Structured medium: same facts plus more explicit investigation and verification guidance.
C. Long prescriptive: same task facts but expanded step-by-step process and repeated reminders; no extra solution hint may be added.

## Tasks
Three dependency-free Node.js fixtures use the built-in test runner. Each starts with a failing baseline, has one allowed production target, comprehensive deterministic tests, and unrelated source/documentation files for scope measurement: normalize tags, retry, and recursively merge preferences.

## Metrics
- deterministic test pass/fail
- prompt characters
- input / cached input / output tokens from Codex JSON events
- wall-clock duration
- files changed and diff size
- whether unrelated files changed
- final report claims vs actual tests

The frozen interleaved order is t1/A, t2/B, t3/C, t1/B, t2/C, t3/A, t1/C, t2/A, t3/B. Runs are sequential and invoke the writer lock for every Codex call. Missing provider usage is recorded as null.

## Interpretation
Primary: task success. Secondary: token efficiency, latency, scope discipline. A shorter prompt is better only if it preserves required correctness and evidence. A longer prompt is justified when it materially increases reliability or encodes a required procedure.
