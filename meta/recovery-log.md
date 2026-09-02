# Experiment recovery log

## Invalid attempt 1 — t1/A
- Status: INVALID_INFRASTRUCTURE
- Raw evidence: `experiments/invalid-evidence/t1-normalize-tags/A/attempt-1-wrapper-exec127/`
- Observed: Codex exit 127, 3 ms, no token usage, no edits, final tests still failing.
- Cause: `run-one.mjs` invoked the singleton wrapper with Codex arguments but omitted the `codex` executable name, so the wrapper attempted to execute `exec` as a program.
- Recovery: preserve invalid evidence, fix harness only, do not change any frozen prompt or fixture, rerun the same first matrix cell.
