import test from 'node:test'; import assert from 'node:assert/strict'; import { dedupeEvents } from '../src/dedupe-events.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5
test('keeps first id order',()=>assert.deepEqual(dedupeEvents([{id:'a',timestamp:2},{id:'b',timestamp:1},{id:'a',timestamp:3}]),[{id:'a',timestamp:2},{id:'b',timestamp:1}]));
test('duplicate timestamp does not replace first',()=>{const first={id:'x',timestamp:9}; assert.strictEqual(dedupeEvents([first,{id:'x',timestamp:1}])[0],first);});
test('returns a new array',()=>{const input=[]; assert.notStrictEqual(dedupeEvents(input),input);});
test('accepts finite timestamp boundaries',()=>assert.equal(dedupeEvents([{id:'a',timestamp:0}]).length,1));
test('validates array and records',()=>{assert.throws(()=>dedupeEvents(null),TypeError); assert.throws(()=>dedupeEvents([{id:'a',timestamp:'x'}]),TypeError);});
