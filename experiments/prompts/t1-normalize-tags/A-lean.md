# Task: normalize tags

In `src/normalize-tags.js`, implement and export `normalizeTags(tags)`. Preserve the repository's existing test setup and edit only this target file.

Requirements: `tags` must be an array and every element a string, otherwise throw `TypeError`; trim each string; lowercase with JavaScript `toLowerCase()`; omit values empty after trimming; remove normalized duplicates while preserving first-occurrence order; do not mutate the input array.

Success evidence: run the deterministic tests with `npm test`, make them pass, and leave only the target changed. Report what you changed and the test result.
