# Agent Prompt Research

An evidence-separated, reproducible engineering pilot on instruction density for modern AI agents.

Research question: **Do lean, outcome-first prompts outperform long prescriptive prompts for modern reasoning and coding agents?** This is a small bounded pilot, not proof that short prompts are universally better.

## Navigate

- [Report](REPORT.md), [methodology](research/methodology.md), and [research site](docs/index.html).
- [Official guidance](research/official-guidance.md), [peer-reviewed research](research/peer-reviewed.md), [preprints](research/preprints.md), and [hypotheses](research/hypotheses.md).
- `experiments/prompts/` — raw A/B/C prompts; `fixtures/` — deterministic Node fixtures.
- `experiments/run-one.mjs` — one run; `experiments/run-matrix.mjs --run` — frozen sequential matrix.
- `experiments/summarize.mjs` — aggregate evidence; `experiments/evidence/` — tracked raw evidence.

`experiments/runs/` is transient and ignored. No experiment agent runs have been executed yet; result cells are PENDING.
