Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Calculate line totals, tax, and a final invoice total using integer cents.
Requirements:
R1: Export calculateInvoiceTotals(lines, taxRatePercent).
R2: Require lines to be an array of objects with non-negative integer quantity and unitCents; require taxRatePercent to be a finite non-negative number, otherwise throw TypeError.
R3: Line subtotal is quantity multiplied by unitCents; subtotalCents is the exact sum of line subtotals.
R4: Tax is round-half-up to the nearest cent from subtotalCents * taxRatePercent / 100; use integer arithmetic semantics for the final rounding.
R5: Return {subtotalCents, taxCents, totalCents}, where totalCents is subtotalCents plus taxCents.
R6: Do not mutate input lines.
Allowed target: src/calculate-invoice-totals.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
