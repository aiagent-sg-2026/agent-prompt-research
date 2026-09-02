# Phase 2 recovery log

Formal results include only evidence that matches the frozen protocol hash and exact order identity.

## Formal cell 3 connector re-entry

The first long VMMCP batch was re-entered by the connector while the original sequential process was still alive. Two infrastructure attempts for cell 3 were excluded before the valid rerun:

1. An empty partial evidence directory was moved aside before any model-result files were written.
2. A duplicate attempt reached the singleton wrapper while the original writer held the lock and exited `73` with `Codex writer lock is already held`. It made no target edit and is preserved under `recovery-evidence/003-lock-collision/`.

The cell was then rerun once with the same frozen input and protocol hash and produced the sole valid formal cell-3 result. Neither excluded attempt is counted in `summary.json` or stability analysis.

## Formal cell 21 connector re-entry

A second connector re-entry occurred at cell 21. One active evidence directory was moved while the original run was still executing, leaving its result non-atomic; another duplicate was rejected by the singleton lock. The non-atomic run snapshot and both moved partial directories are preserved under `recovery-evidence/021-connector-interference/` and excluded. A later clean run from the unchanged frozen protocol produced the sole eligible cell-21 metrics (`harness_valid=true`, exact identity/hash, target-only scope, final tests passed).

## Cell 60 incomplete connector-side attempt

Before the valid formal cell 60 result, a connector-side batch process ended after the agent had modified the transient run directory but before run-one completed codex/final-test/diff/metrics evidence. The partial evidence and orphan run snapshot are preserved under `phase2/recovery-evidence/060-incomplete-attempt/`. That incomplete attempt is excluded. Cell 60 was rerun from the same frozen input under the outer supervisor lock and only the complete exact-protocol-hash result counts.
