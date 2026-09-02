import test from 'node:test'; import assert from 'node:assert/strict'; import { canonicalizeHeaders } from '../src/canonicalize-headers.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('trims and lowercases names',()=>assert.deepEqual(canonicalizeHeaders({' X-Test ':' value '}),[{name:'x-test',value:'value'}]));
test('collapses ASCII whitespace',()=>assert.equal(canonicalizeHeaders({x:' a  b\t c '})[0].value,'a b c'));
test('sorts names',()=>assert.deepEqual(canonicalizeHeaders({z:'1',a:'2'}).map(x=>x.name),['a','z']));
test('retains repeated array values',()=>assert.deepEqual(canonicalizeHeaders({x:['a','a']}),[{name:'x',value:'a'},{name:'x',value:'a'}]));
test('validates values and does not mutate',()=>{const x={x:[' a ']}; canonicalizeHeaders(x); assert.deepEqual(x,{x:[' a ']}); assert.throws(()=>canonicalizeHeaders({x:[1]}),TypeError);});
