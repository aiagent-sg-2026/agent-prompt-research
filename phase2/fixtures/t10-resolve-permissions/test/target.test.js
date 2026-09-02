import test from 'node:test'; import assert from 'node:assert/strict'; import { resolvePermissions } from '../src/resolve-permissions.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('resolves string requests',()=>assert.deepEqual(resolvePermissions([{permission:'read',allow:true}],['read']),[{permission:'read',scope:undefined,allowed:true}]));
test('uses scope and last rule',()=>assert.deepEqual(resolvePermissions([{permission:'write',allow:true,scope:'admin'},{permission:'write',allow:false,scope:'admin'}],[{permission:'write',scope:'admin'}]),[{permission:'write',scope:'admin',allowed:false}]));
test('global rule applies to scoped request',()=>assert.equal(resolvePermissions([{permission:'read',allow:true}],[{permission:'read',scope:'team'}])[0].allowed,true));
test('missing decisions deny',()=>assert.equal(resolvePermissions([],['delete'])[0].allowed,false));
test('preserves request order and validates',()=>{assert.deepEqual(resolvePermissions([],['b','a']).map(x=>x.permission),['b','a']); assert.throws(()=>resolvePermissions('x',[]),TypeError); assert.throws(()=>resolvePermissions([{permission:'x',allow:'yes'}],[]),TypeError);});
