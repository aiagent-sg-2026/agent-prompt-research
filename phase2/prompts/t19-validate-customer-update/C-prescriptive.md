Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Validate a partial customer update and report stable field errors.
Requirements:
R1: Export validateCustomerUpdate(update).
R2: Require a non-null plain object; otherwise throw TypeError.
R3: Allowed fields are name, email, phone, and marketingOptIn; unknown fields produce errors.
R4: When present, name is a non-empty trimmed string, email contains exactly one @ with non-empty sides, phone matches optional leading plus followed by 7..15 digits, and marketingOptIn is boolean.
R5: Return {valid, errors}; errors is an array of {field, message} sorted by input field order, with at most one error per field.
R6: Do not mutate update.
Allowed target: src/validate-customer-update.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
