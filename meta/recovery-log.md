# Experiment recovery log

## Invalid attempt 1 — t1/A
- Status: INVALID_INFRASTRUCTURE
- Raw evidence: `experiments/invalid-evidence/t1-normalize-tags/A/attempt-1-wrapper-exec127/`
- Observed: Codex exit 127, 3 ms, no token usage, no edits, final tests still failing.
- Cause: `run-one.mjs` invoked the singleton wrapper with Codex arguments but omitted the `codex` executable name, so the wrapper attempted to execute `exec` as a program.
- Recovery: preserve invalid evidence, fix harness only, do not change any frozen prompt or fixture, rerun the same first matrix cell.

## Invalid/out-of-order t3/C observation during VMMCP 502 recovery
- Status: EXCLUDED_OUT_OF_ORDER.
- A process probe observed a completed t3/C cell with start `2026-09-02T13:32:47.749Z` and end `13:33:58.369Z`, before the frozen-order t2/B cell (`13:33:59.006Z` to `13:34:55.491Z`).
- Observed metrics: success=true; 70,619 ms; input 93,202; cached input 76,288; output 2,725; diff 72 lines; one test invocation; zero retry proxy; zero unrelated edits.
- It is excluded because it violated the frozen order. The correctly ordered t3/C cell later ran from `13:34:55.746Z` to `13:36:19.087Z` and is the only t3/C result in the aggregate.
- Limitation: the stray run used the same active evidence path and its full raw files were overwritten by the correctly ordered run before they could be copied. Only the metrics observed in the process probe are documented here; this invalid run is not represented as preserved raw evidence.
- The 502 did not create concurrent Codex writers: the singleton lock showed one holder while the batch continued, then returned FREE after completion.
