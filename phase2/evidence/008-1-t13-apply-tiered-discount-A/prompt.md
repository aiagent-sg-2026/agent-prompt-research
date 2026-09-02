Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Apply the highest eligible percentage discount to a subtotal in cents.
Requirements:
R1: Export applyTieredDiscount(subtotalCents, tiers).
R2: Require subtotalCents to be a non-negative integer and tiers to be an array of {minimumCents, percent}; invalid values throw TypeError.
R3: A tier is eligible when subtotalCents is at least minimumCents; percent is finite and in the inclusive range 0..100.
R4: Choose the eligible tier with the greatest minimumCents; ties use first array order.
R5: Discount cents is round-half-up subtotalCents * percent / 100 and finalCents is subtotalCents minus discountCents.
R6: Return {percent, discountCents, finalCents}; use percent 0 when no tier is eligible and do not mutate tiers.
Allowed target: src/apply-tiered-discount.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
