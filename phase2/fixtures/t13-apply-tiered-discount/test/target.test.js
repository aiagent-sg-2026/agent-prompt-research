import test from 'node:test'; import assert from 'node:assert/strict'; import { applyTieredDiscount } from '../src/apply-tiered-discount.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('chooses highest eligible tier',()=>assert.deepEqual(applyTieredDiscount(999,[{minimumCents:0,percent:0},{minimumCents:500,percent:12.5}]),{percent:12.5,discountCents:125,finalCents:874}));
test('rounds half up exactly',()=>assert.equal(applyTieredDiscount(1,[{minimumCents:0,percent:50}]).discountCents,1));
test('uses zero when no tier',()=>assert.deepEqual(applyTieredDiscount(10,[]),{percent:0,discountCents:0,finalCents:10}));
test('supports boundary eligibility',()=>assert.equal(applyTieredDiscount(100,[{minimumCents:100,percent:10}]).percent,10));
test('validates and preserves tiers',()=>{const tiers=[{minimumCents:0,percent:5}]; applyTieredDiscount(10,tiers); assert.deepEqual(tiers,[{minimumCents:0,percent:5}]); assert.throws(()=>applyTieredDiscount(-1,[]),TypeError); assert.throws(()=>applyTieredDiscount(1,[{minimumCents:0,percent:101}]),TypeError);});
