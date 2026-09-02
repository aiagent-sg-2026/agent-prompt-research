Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Normalize CSV header names into stable JavaScript keys.
Requirements:
R1: Export normalizeCsvHeaders(headers).
R2: Require headers to be an array of strings; throw TypeError otherwise.
R3: Trim leading and trailing whitespace, lowercase with Unicode lowercasing, and replace each run of non-ASCII-alphanumeric characters with a single underscore.
R4: Remove leading and trailing underscores; an empty normalized header is the empty string.
R5: Preserve input order and do not mutate the input array.
R6: Return an array of normalized strings without deduplicating.
Allowed target: src/normalize-csv-headers.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
