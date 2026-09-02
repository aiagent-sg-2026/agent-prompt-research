import test from 'node:test'; import assert from 'node:assert/strict'; import { buildQueryString } from '../src/build-query-string.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('sorts keys',()=>assert.equal(buildQueryString({z:'last',a:'first'}),'a=first&z=last'));
test('encodes scalar values',()=>assert.equal(buildQueryString({'x y':'a/b',flag:true,n:4}),'flag=true&n=4&x%20y=a%2Fb'));
test('repeats arrays in order',()=>assert.equal(buildQueryString({tag:['b','a']}),'tag=b&tag=a'));
test('omits nullish and handles empty',()=>assert.equal(buildQueryString({skip:null,also:undefined}),''));
test('validates object shape',()=>{assert.throws(()=>buildQueryString(null),TypeError); assert.throws(()=>buildQueryString([]),TypeError);});
