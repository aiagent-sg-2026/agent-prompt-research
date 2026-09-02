import test from 'node:test'; import assert from 'node:assert/strict'; import { parsePaginationQuery } from '../src/parse-pagination-query.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('accepts query string forms',()=>{assert.deepEqual(parsePaginationQuery('?page=3&limit=20'),{page:3,limit:20}); assert.deepEqual(parsePaginationQuery('page=2'),{page:2,limit:20});});
test('accepts URLSearchParams and first repeated value',()=>assert.deepEqual(parsePaginationQuery(new URLSearchParams('page=4&page=9&limit=7')),{page:4,limit:7}));
test('clamps page and limit',()=>assert.deepEqual(parsePaginationQuery('?page=0&limit=120'),{page:1,limit:100}));
test('uses defaults for invalid values',()=>assert.deepEqual(parsePaginationQuery('page=nope&limit=wat',{page:2,limit:30}),{page:2,limit:30}));
test('validates input and does not mutate params',()=>{const p=new URLSearchParams('page=2'); parsePaginationQuery(p); assert.equal(p.toString(),'page=2'); assert.throws(()=>parsePaginationQuery(4),TypeError);});
