import test from 'node:test';import assert from 'node:assert/strict';import {decodeRecent,limitRecent} from '../scripts/lib/recent.mjs';
test('recent deduplicates and sorts newest first',()=>assert.deepEqual(limitRecent([{substanceId:'substance.mdma',viewedAt:1}],{substanceId:'substance.mdma',viewedAt:2}),[{substanceId:'substance.mdma',viewedAt:2}]));
test('recent remains capped',()=>assert.equal(Array.from({length:20},(_,i)=>({substanceId:`substance.x-${i}`,viewedAt:i})).reduce((x,e)=>limitRecent(x,e),[]).length,12));
test('persistence round trip and corruption fallback',()=>{const entries=[{substanceId:'substance.mdma',viewedAt:2}];assert.deepEqual(decodeRecent(JSON.stringify(entries)),entries);assert.deepEqual(decodeRecent('{bad'),[])});
