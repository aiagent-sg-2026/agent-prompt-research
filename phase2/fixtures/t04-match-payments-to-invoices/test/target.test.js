import test from 'node:test'; import assert from 'node:assert/strict'; import { matchPaymentsToInvoices } from '../src/match-payments-to-invoices.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('matches across invoices in order',()=>assert.deepEqual(matchPaymentsToInvoices([{id:'i1',cents:50},{id:'i2',cents:80}],[{id:'p1',cents:100},{id:'p2',cents:40}]).matches,[{paymentId:'p1',invoiceId:'i1',cents:50},{paymentId:'p1',invoiceId:'i2',cents:50},{paymentId:'p2',invoiceId:'i2',cents:30}]));
test('reports unmatched and balances',()=>assert.deepEqual(matchPaymentsToInvoices([{id:'i1',cents:10}],[{id:'p',cents:15}]),{matches:[{paymentId:'p',invoiceId:'i1',cents:10}],unmatchedCents:5,balances:[{invoiceId:'i1',remainingCents:0}]}));
test('does not emit zero matches',()=>assert.deepEqual(matchPaymentsToInvoices([{id:'i',cents:0}],[{id:'p',cents:0}]).matches,[]));
test('preserves input records',()=>{const i=[{id:'i',cents:2}],p=[{id:'p',cents:1}]; matchPaymentsToInvoices(i,p); assert.deepEqual(i,[{id:'i',cents:2}]); assert.deepEqual(p,[{id:'p',cents:1}]);});
test('validates arrays and records',()=>{assert.throws(()=>matchPaymentsToInvoices('x',[]),TypeError); assert.throws(()=>matchPaymentsToInvoices([{id:'i',cents:-1}],[]),TypeError);});
