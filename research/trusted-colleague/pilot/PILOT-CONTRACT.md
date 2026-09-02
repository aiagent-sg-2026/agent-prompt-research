# TCM pilot contract

Status: **PRE-PILOT** until all 48 generation cells have been generated and the pilot has passed human-review intake. This harness does not report TCM findings.

This is a reproducibility and protocol-quality pilot for the approved matrix: six synthetic work tasks × four prompt conditions × two repeats = 48 generation cells. Generation output is exploratory evidence only and is excluded from the confirmatory full experiment. The six tasks are not production or customer data.

## Fixed protocol

- Runtime: Codex CLI 0.151.0, model `gpt-5.6-luna`, reasoning effort `medium`.
- Invocation: every model invocation goes through `scripts/with-codex-writer-lock.sh`; user configuration and repository rules are ignored.
- Tool boundary: task prompts require no tool use. Codex may technically expose built-in tools, but the sandbox is read-only, tool calls are recorded as protocol diagnostics, and the model must not claim actions/evidence it did not receive.
- Working directory: a fresh neutral temporary directory with no repository files exposed as task context.
- Common task wording, supplied evidence, acceptance criteria, authority boundary, and scoring anchors are fixed in `tasks.json`.
- Conditions share one byte-identical common base instruction. A/B/C/D differ only in the operational condition text in `conditions.json`.
- Generation order is deterministic and balanced by seed `tcm-pilot-generation-20260903-v1`.
- Runs are strictly sequential. A matching completed cell is never overwritten. Infrastructure-invalid attempts are quarantined as whole run directories; content quality is never called harness-invalid.
- Multi-turn tasks run their declared user turns sequentially, carrying the prior generated assistant output in the next transcript.
- Freeze occurs before generation. A frozen manifest covers the task/condition/order contract and the runner/evaluator/QA code that defines a cell, but never evidence or analysis outputs.

## Evaluation boundary

Human evaluation is blind to condition identity and follows `../evaluation-rubric.md`. Secondary LLM-as-judge output, if enabled, is explicitly labeled secondary and is not human evidence. Any behavioral-effect conclusion remains **PENDING EVALUATION** until the predeclared human evaluation exists. Pilot verdicts are protocol-quality statuses only: `PILOT_READY_FOR_HUMAN_REVIEW` or `PILOT_NEEDS_REPAIR`, never `TCM_SUPPORT` or `TCM_REJECT`.

The pilot must not modify Phase 1 or Phase 2 experiment inputs/evidence, and it must not be used to claim TCM findings.
