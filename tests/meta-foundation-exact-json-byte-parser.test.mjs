import test from 'node:test';
import assert from 'node:assert/strict';
import {createExactJsonByteParser} from '../archive/tools/meta-foundation/exact-json-byte-parser.mjs';
test('exact bytes share only a deeply frozen parsed value',()=>{
 const parse=createExactJsonByteParser(),raw=Buffer.from('{"rows":[{"key":"original"}]}');
 const first=parse(raw),second=parse(Buffer.from(raw));assert.equal(first,second);
 assert(Object.isFrozen(first)&&Object.isFrozen(first.rows)&&Object.isFrozen(first.rows[0]));
 assert.throws(()=>{first.rows[0].key='different';},TypeError);assert.equal(parse(raw).rows[0].key,'original');
});
test('changed or malformed fresh bytes do not inherit a parsed result',()=>{
 const parse=createExactJsonByteParser(),old=parse(Buffer.from('{"value":1}'));
 const next=parse(Buffer.from('{"value":2}'));assert.equal(next.value,2);assert.notEqual(next,old);
 assert.throws(()=>parse(Buffer.from('{"value":')),SyntaxError);assert.equal(parse(Buffer.from('{"value":1}')),old);
});
test('semantic equality does not collapse distinct raw byte snapshots',()=>{
 const parse=createExactJsonByteParser(),a=parse(Buffer.from('{"value":1}')),b=parse(Buffer.from('{ "value": 1 }'));
 assert.deepEqual(a,b);assert.notEqual(a,b);
});
test('caller byte buffer changes cannot alter the stored snapshot',()=>{
 const parse=createExactJsonByteParser(),raw=Buffer.from('{"value":1}'),first=parse(raw);
 raw[9]='2'.charCodeAt(0);assert.equal(parse(raw).value,2);assert.equal(parse(Buffer.from('{"value":1}')),first);
});
test('the parser has a bounded least-recently-used cache',()=>{
 const parse=createExactJsonByteParser(2),a=parse(Buffer.from('{"a":1}'));parse(Buffer.from('{"b":2}'));assert.equal(parse(Buffer.from('{"a":1}')),a);
 parse(Buffer.from('{"c":3}'));assert.equal(parse(Buffer.from('{"a":1}')),a);assert.throws(()=>parse('not bytes'));
 assert.throws(()=>createExactJsonByteParser(0));
});
