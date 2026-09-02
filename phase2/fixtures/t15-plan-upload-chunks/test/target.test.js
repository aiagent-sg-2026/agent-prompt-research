import test from 'node:test'; import assert from 'node:assert/strict'; import { planUploadChunks } from '../src/plan-upload-chunks.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('plans bounded chunks',()=>assert.deepEqual(planUploadChunks(10,4),[{index:0,offset:0,size:4},{index:1,offset:4,size:4},{index:2,offset:8,size:2}]));
test('covers exact multiple without empty chunk',()=>assert.deepEqual(planUploadChunks(8,4).map(x=>x.size),[4,4]));
test('starts at zero',()=>assert.deepEqual(planUploadChunks(3,10),[{index:0,offset:0,size:3}]));
test('has contiguous offsets',()=>{const chunks=planUploadChunks(11,3); assert.deepEqual(chunks.map(x=>x.offset),[0,3,6,9]); assert.equal(chunks.reduce((n,x)=>n+x.size,0),11);});
test('validates positive integers',()=>{assert.throws(()=>planUploadChunks(0,4),TypeError); assert.throws(()=>planUploadChunks(4,0),TypeError);});
