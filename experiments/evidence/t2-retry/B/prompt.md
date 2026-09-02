# Task: retry

Implement and export `async retry(operation, options = {})` in `src/retry.js`; preserve the existing test setup and edit only this target file.

Hard requirements: `operation` must be a function or throw `TypeError`. `options.retries` defaults to 2 and must be a non-negative integer or throw `TypeError`. Total attempts are retries + 1. Return the first successfully resolved value, including falsy values. On throw/rejection, retry until attempts are exhausted. After exhaustion, throw the final error object unchanged.

Work structure:
1. Inspect the target, tests, and module configuration.
2. Implement the smallest complete contract-preserving change.
3. Run deterministic `npm test` and inspect the result.
4. Verify the diff contains only `src/retry.js`.

Success evidence: passing `npm test`, a target-only diff, and a concise report of the change and test result.
