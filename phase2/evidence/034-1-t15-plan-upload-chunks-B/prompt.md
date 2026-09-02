Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Plan contiguous upload chunks with a bounded chunk size.
Requirements:
R1: Export planUploadChunks(totalBytes, chunkSize).
R2: Require both arguments to be positive integers; otherwise throw TypeError.
R3: Return an array of {index, offset, size} covering exactly 0 through totalBytes without gaps or overlap.
R4: Each size is at most chunkSize, indexes start at 0, and offsets are zero-based.
R5: The final chunk may be smaller; exact multiples do not receive an extra empty chunk.
R6: Do not use randomness or mutate any input.
Allowed target: src/plan-upload-chunks.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
