# Task: normalize tags

Implement and export `normalizeTags(tags)` in `src/normalize-tags.js`; preserve the existing test setup and edit only this target file.

Hard requirements: `tags` must be an array and every element must be a string, otherwise throw `TypeError`. Trim leading/trailing whitespace, lowercase using JavaScript `toLowerCase()`, omit entries empty after trimming, remove normalized duplicates preserving first-occurrence order, and do not mutate the input array.

Work structure:
1. Inspect the target and tests to understand the existing module shape.
2. Make the smallest implementation that satisfies every requirement.
3. Run deterministic `npm test` and inspect the result.
4. Verify the diff contains only `src/normalize-tags.js`.

Success evidence: passing `npm test`, the target-only diff, and a concise report of the change and test result.
