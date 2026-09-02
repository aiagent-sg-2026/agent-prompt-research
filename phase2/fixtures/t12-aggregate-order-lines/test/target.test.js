import test from 'node:test'; import assert from 'node:assert/strict'; import { aggregateOrderLines } from '../src/aggregate-order-lines.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('groups exact SKUs',()=>assert.deepEqual(aggregateOrderLines([{sku:'a',quantity:2,unitCents:5},{sku:'b',quantity:1,unitCents:9},{sku:'a',quantity:3,unitCents:7}]),[{sku:'a',quantity:5,unitCents:5,totalCents:25},{sku:'b',quantity:1,unitCents:9,totalCents:9}]));
test('retains first unit price',()=>assert.equal(aggregateOrderLines([{sku:'x',quantity:1,unitCents:10},{sku:'x',quantity:2,unitCents:99}])[0].unitCents,10));
test('supports zero quantities and empty input',()=>assert.deepEqual(aggregateOrderLines([{sku:'x',quantity:0,unitCents:4}]),[{sku:'x',quantity:0,unitCents:4,totalCents:0}]));
test('does not mutate lines',()=>{const x=[{sku:'x',quantity:1,unitCents:4}]; aggregateOrderLines(x); assert.deepEqual(x,[{sku:'x',quantity:1,unitCents:4}]);});
test('validates records',()=>{assert.deepEqual(aggregateOrderLines([]),[]); assert.throws(()=>aggregateOrderLines([{sku:'',quantity:1,unitCents:1}]),TypeError); assert.throws(()=>aggregateOrderLines([{sku:'x',quantity:-1,unitCents:1}]),TypeError);});
