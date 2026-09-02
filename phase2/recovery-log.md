# Phase 2 recovery log

Formal results include only evidence that matches the frozen protocol hash and exact order identity.

## Formal cell 3 connector re-entry

The first long VMMCP batch was re-entered by the connector while the original sequential process was still alive. Two infrastructure attempts for cell 3 were excluded before the valid rerun:

1. An empty partial evidence directory was moved aside before any model-result files were written.
2. A duplicate attempt reached the singleton wrapper while the original writer held the lock and exited `73` with `Codex writer lock is already held`. It made no target edit and is preserved under `recovery-evidence/003-lock-collision/`.

The cell was then rerun once with the same frozen input and protocol hash and produced the sole valid formal cell-3 result. Neither excluded attempt is counted in `summary.json` or stability analysis.
