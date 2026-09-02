import test from 'node:test'; import assert from 'node:assert/strict'; import { allocateInventoryFifo } from '../src/allocate-inventory-fifo.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('consumes oldest lots first',()=>assert.deepEqual(allocateInventoryFifo([{id:'a',quantity:3},{id:'b',quantity:5}],6),{allocations:[{id:'a',quantity:3},{id:'b',quantity:3}],remaining:0}));
test('reports shortage',()=>assert.deepEqual(allocateInventoryFifo([{id:'a',quantity:2}],5),{allocations:[{id:'a',quantity:2}],remaining:3}));
test('omits zero lots',()=>assert.deepEqual(allocateInventoryFifo([{id:'a',quantity:0}],1),{allocations:[],remaining:1}));
test('zero request is empty',()=>assert.deepEqual(allocateInventoryFifo([{id:'a',quantity:2}],0),{allocations:[],remaining:0}));
test('validates and does not mutate',()=>{const x=[{id:'a',quantity:2}]; allocateInventoryFifo(x,1); assert.deepEqual(x,[{id:'a',quantity:2}]); assert.throws(()=>allocateInventoryFifo(x,-1),TypeError); assert.throws(()=>allocateInventoryFifo([{id:'a',quantity:-1}],1),TypeError);});
