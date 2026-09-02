import test from 'node:test'; import assert from 'node:assert/strict'; import { calculateInvoiceTotals } from '../src/calculate-invoice-totals.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('sums line subtotals',()=>assert.equal(calculateInvoiceTotals([{quantity:2,unitCents:125},{quantity:1,unitCents:101}],0).subtotalCents,351));
test('rounds exact half cent up',()=>assert.deepEqual(calculateInvoiceTotals([{quantity:1,unitCents:1}],50),{subtotalCents:1,taxCents:1,totalCents:2}));
test('rounds just below and above half cent correctly',()=>{assert.equal(calculateInvoiceTotals([{quantity:1,unitCents:1}],49.9).taxCents,0); assert.equal(calculateInvoiceTotals([{quantity:1,unitCents:1}],50.1).taxCents,1);});
test('returns total as subtotal plus tax',()=>assert.deepEqual(calculateInvoiceTotals([{quantity:3,unitCents:10}],8.5),{subtotalCents:30,taxCents:3,totalCents:33}));
test('validates all inputs',()=>{assert.throws(()=>calculateInvoiceTotals(null,0),TypeError); assert.throws(()=>calculateInvoiceTotals([{quantity:-1,unitCents:2}],0),TypeError); assert.throws(()=>calculateInvoiceTotals([],NaN),TypeError);});
test('does not mutate lines',()=>{const x=[{quantity:1,unitCents:10}]; calculateInvoiceTotals(x,0); assert.deepEqual(x,[{quantity:1,unitCents:10}]);});
