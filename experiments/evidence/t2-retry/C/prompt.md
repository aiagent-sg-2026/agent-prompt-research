# Task: retry

Implement and export `async retry(operation, options = {})` in `src/retry.js`. Preserve the existing test setup. Edit only `src/retry.js`; do not edit unrelated source or documentation.

The contract is: `operation` must be a function or throw `TypeError`; `options.retries` defaults to 2 and must be a non-negative integer or throw `TypeError`; total attempts are retries + 1; return the first successfully resolved value including falsy values; on throw/rejection retry until exhausted; after exhaustion throw the final error object unchanged.

Follow this order:
1. Inspect the fixture, target, tests, and module configuration.
2. Implement the complete contract in the named target.
3. Re-check operation and retries validation, including the default and boundary values.
4. Re-check attempt count, async resolution, falsy success values, retry behavior, and identity of the final error.
5. Run deterministic `npm test` and use its result as the correctness check.
6. Inspect the final diff and ensure only the named target changed.

Keep the task facts above unchanged in meaning: do not add requirements or solution hints. Before finishing, verify the test result and target-only scope again, then report the change and evidence.
