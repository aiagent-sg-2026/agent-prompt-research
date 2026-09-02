import test from 'node:test'; import assert from 'node:assert/strict'; import { calculateReorderRecommendation } from '../src/calculate-reorder-recommendation.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('recommends to target from available stock',()=>assert.deepEqual(calculateReorderRecommendation({onHand:10,reserved:3,reorderPoint:8,targetStock:20}),{available:7,reorder:13,needsReorder:true}));
test('does not reorder at point',()=>assert.deepEqual(calculateReorderRecommendation({onHand:10,reserved:3,reorderPoint:7,targetStock:20}),{available:7,reorder:0,needsReorder:false}));
test('clamps reserved stock',()=>assert.equal(calculateReorderRecommendation({onHand:2,reserved:9,reorderPoint:1,targetStock:4}).available,0));
test('never recommends negative quantity',()=>assert.deepEqual(calculateReorderRecommendation({onHand:0,reserved:0,reorderPoint:2,targetStock:0}),{available:0,reorder:0,needsReorder:false}));
test('validates and does not mutate',()=>{const x={onHand:1,reserved:0,reorderPoint:2,targetStock:3}; calculateReorderRecommendation(x); assert.deepEqual(x,{onHand:1,reserved:0,reorderPoint:2,targetStock:3}); assert.throws(()=>calculateReorderRecommendation(null),TypeError);});
