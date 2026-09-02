# Task: retry

In `src/retry.js`, implement and export `async retry(operation, options = {})`. Preserve the existing test setup and edit only this target file.

Requirements: `operation` must be a function or throw `TypeError`; `options.retries` defaults to 2 and must be a non-negative integer or throw `TypeError`; total attempts are retries + 1; return the first successfully resolved value including falsy values; on throw/rejection retry until exhausted; after exhaustion throw the final error object unchanged.

Success evidence: run deterministic `npm test`, make it pass, leave only the target changed, and report the change and test result.
