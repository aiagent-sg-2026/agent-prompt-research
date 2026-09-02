Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Apply payments to invoices deterministically and report unmatched amounts.
Requirements:
R1: Export matchPaymentsToInvoices(invoices, payments).
R2: Require both arguments to be arrays; invoice and payment records require string id and non-negative integer cents, otherwise throw TypeError.
R3: Process payments in input order and apply each payment to the first invoice in input order that still has an unpaid balance.
R4: Return {matches, unmatchedCents, balances}; each match is {paymentId, invoiceId, cents}, balances is an array of {invoiceId, remainingCents} in invoice order.
R5: A payment may create multiple matches; never create zero-cent matches.
R6: Do not mutate either input array or their records.
Allowed target: src/match-payments-to-invoices.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
