# Task: normalize tags

Implement and export `normalizeTags(tags)` in `src/normalize-tags.js`. Preserve the existing test setup. Edit only `src/normalize-tags.js`; do not edit unrelated source or documentation.

The contract is: `tags` must be an array and every element must be a string, otherwise throw `TypeError`; trim leading/trailing whitespace; lowercase using normal JavaScript `toLowerCase()`; omit entries that become empty after trimming; remove duplicates after normalization while preserving first occurrence order; do not mutate the input array.

Follow this order:
1. Inspect the fixture, target, tests, and module configuration.
2. Implement the complete contract in the named target.
3. Re-check that validation occurs for the array and every element.
4. Re-check trimming, lowercasing, empty omission, stable deduplication, and input immutability.
5. Run deterministic `npm test` and use its result as the correctness check.
6. Inspect the final diff and ensure only the named target changed.

Keep the task facts above unchanged in meaning: do not add requirements or solution hints. Before finishing, verify the test result and target-only scope again, then report the change and evidence.
