# Agent Prompt Research

An evidence-separated, reproducible engineering pilot on instruction density for modern coding agents.

Research question: **Do lean, outcome-first prompts outperform long prescriptive prompts for modern reasoning and coding agents?** This is a small bounded pilot, not proof that short prompts are universally better.

## Navigate

- [Report](REPORT.md), [methodology](research/methodology.md), and [research site](docs/index.html).
- [Official guidance](research/official-guidance.md), [peer-reviewed research](research/peer-reviewed.md), [preprints](research/preprints.md), and [hypotheses](research/hypotheses.md).
- `experiments/prompts/` — raw A/B/C prompts; `fixtures/` — deterministic Node fixtures.
- `experiments/run-one.mjs` — one run; `experiments/run-matrix.mjs --run` — frozen sequential matrix (official runs are complete; do not rerun them casually).
- `experiments/summarize.mjs` — aggregate evidence; `experiments/evidence/` — tracked raw evidence.
- `experiments/summary.json`, `experiments/derived-analysis.json`, and `experiments/summary.md` — generated aggregate and derived results.
- `meta/experiment-contract.md`, `meta/frozen-input-sha256.txt`, and `meta/recovery-log.md` — contract, integrity manifest, and recovery record.

`experiments/runs/` is transient and ignored. The completed pilot has 9 valid cells: 3 tasks × 3 variants. Every variant succeeded on all 3 tasks, changed only its target file, and made zero unrelated edits.

## Read or reproduce

Start with the [full report](REPORT.md) or the [static research site](docs/index.html). The research notes separate official vendor guidance, peer-reviewed work, preprints/surveys, and hypotheses.

The original experiment matrix is frozen. To verify the completed aggregate without running agents, use:

```sh
node experiments/summarize.mjs
node experiments/derive-analysis.mjs
node scripts/qa-scaffold.mjs
node scripts/qa-site.mjs
sha256sum -c meta/frozen-input-sha256.txt
```

The matrix runner can reproduce the protocol in a fresh environment, but it invokes Codex and is intentionally not part of the normal read-only verification path. Do not commit or push from this repository as part of verification.
