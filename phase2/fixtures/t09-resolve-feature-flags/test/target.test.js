import test from 'node:test'; import assert from 'node:assert/strict'; import { resolveFeatureFlags } from '../src/resolve-feature-flags.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('starts with definitions',()=>assert.deepEqual(resolveFeatureFlags({a:false,b:true}),{a:false,b:true}));
test('applies environment then user',()=>assert.deepEqual(resolveFeatureFlags({a:false,b:true},{a:true,extra:true},{a:false}),{a:false,b:true}));
test('ignores unknown and nonboolean overrides',()=>assert.deepEqual(resolveFeatureFlags({a:false},{extra:true,a:'yes'}),{a:false}));
test('preserves definition order',()=>assert.deepEqual(Object.keys(resolveFeatureFlags({z:false,a:true})),['z','a']));
test('validates maps and definitions',()=>{assert.throws(()=>resolveFeatureFlags({a:1}),TypeError); assert.throws(()=>resolveFeatureFlags(null),TypeError);});
