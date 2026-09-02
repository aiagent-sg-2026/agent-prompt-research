import test from 'node:test'; import assert from 'node:assert/strict'; import { createTtlCache } from '../src/create-ttl-cache.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('stores and gets with injected now',()=>{let time=0; const c=createTtlCache(100,()=>time); assert.equal(c.set('x',0),c); assert.equal(c.get('x'),0);});
test('is valid just before expiry',()=>{let time=0; const c=createTtlCache(100,()=>time).set('x','v'); time=99; assert.equal(c.has('x'),true); assert.equal(c.get('x'),'v');});
test('expires exactly at TTL and removes',()=>{let time=0; const c=createTtlCache(100,()=>time).set('x','v'); time=100; assert.equal(c.get('x'),undefined); assert.equal(c.delete('x'),false);});
test('delete reports presence',()=>{let time=0; const c=createTtlCache(10,()=>time).set('x',1); assert.equal(c.delete('x'),true); assert.equal(c.delete('x'),false);});
test('uses now for set and validates',()=>{let calls=0; const c=createTtlCache(10,()=>calls++); c.set('x',1); c.has('x'); assert.ok(calls>=2); assert.throws(()=>createTtlCache(-1,()=>0),TypeError);});
