import test from 'node:test'; import assert from 'node:assert/strict'; import { normalizeCsvHeaders } from '../src/normalize-csv-headers.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('exports and normalizes punctuation',()=>assert.deepEqual(normalizeCsvHeaders([' First Name ','E-mail','税 額']),['first_name','e_mail','税_額']));
test('empty normalized header is stable',()=>assert.deepEqual(normalizeCsvHeaders(['  !!!  ','OK']),['','ok']));
test('preserves order and duplicates',()=>{const x=['A','A']; assert.deepEqual(normalizeCsvHeaders(x),['a','a']); assert.deepEqual(x,['A','A']);});
test('rejects non string lists',()=>{assert.throws(()=>normalizeCsvHeaders(null),TypeError); assert.throws(()=>normalizeCsvHeaders(['ok',3]),TypeError);});
test('returns a new array',()=>{const x=['Name']; const y=normalizeCsvHeaders(x); assert.notStrictEqual(y,x);});
