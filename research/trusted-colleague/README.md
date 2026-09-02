# Trusted Colleague Model (TCM)

Status: **PRE-PILOT / protocol development**. No TCM experimental result has been collected yet.

TCM is the communication-and-collaboration research track inside Agent Prompt Research. It asks a different question from instruction-density work:

> How should an AI agent collaborate and communicate so it behaves like a competent, context-aware, responsible colleague without pretending to be human?

The target is **low-friction human-AI collaboration**, not human imitation or friendliness by itself.

## Research model

TCM treats natural agent communication as the visible result of a deeper working relationship:

`Shared goal + ownership + context continuity + judgment + calibrated initiative + constructive disagreement + trust calibration + natural expression`

Core dimensions:

1. Shared goal
2. Ownership
3. Context continuity / shared mental model
4. Mutual performance monitoring
5. Backup behavior
6. Constructive disagreement
7. Initiative calibration
8. Adaptability
9. Trust calibration
10. Natural expression

## Experimental design

The preregistration draft compares four conditions while holding model, reasoning setting, tools, task context, safety policy, and task contract constant:

- A — Report Assistant
- B — Friendly Assistant
- C — Trusted Colleague (fixed peer stance)
- D — Adaptive Trusted Colleague (dynamic Peer / Senior / Specialist / Reviewer / Operator stance)

Planned pilot: `6 tasks × 4 conditions × 2 repeats = 48 runs`.

Planned full experiment after prompt/rubric freeze: `24 tasks × 4 conditions × 5 repeats = 480 runs`, including single-turn and multi-turn work, randomized generation order, blind evaluation, and task/rater-aware analysis.

## Primary outcomes

- Task Success
- Colleague Fit
- Collaboration Friction Score (CFS)
- Willingness to Continue

Safety, factual accuracy, unsupported certainty, over-initiative, and excessive disagreement are guardrail outcomes rather than acceptable trade-offs for sounding more natural.

## Files

- [protocol-v0.1.md](protocol-v0.1.md) — experimental protocol
- [hypotheses.md](hypotheses.md) — preregistered research hypotheses
- [source-pack.md](source-pack.md) — evidence-separated literature notes
- [evaluation-rubric.md](evaluation-rubric.md) — human/blind evaluation contract
- `conditions/` — isolated communication/collaboration conditions

## Separation from instruction-density experiments

TCM does **not** alter Phase 1 or Phase 2 prompt-density inputs, outcomes, or preregistration. Any TCM run uses its own task corpus, randomization, evidence directories, and analysis. Cross-track synthesis may happen only after each track reports its own evidence independently.
