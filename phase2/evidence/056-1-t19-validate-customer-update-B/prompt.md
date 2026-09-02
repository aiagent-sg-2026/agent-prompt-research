Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

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
