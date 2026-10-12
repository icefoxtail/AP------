import test from 'node:test';
import assert from 'node:assert/strict';
import {needsSameMetaSourceRebind} from './auto-register-approved-qid9.mjs';
import {metaSha256} from './register-approved-generated-meta.mjs';

test('visual-only Source change refreshes an approved same-Meta projection instead of skipping stale SHA',()=>{
 const meta={rpmL3:'원의 방정식',difficultyBucket:3};
 const row={meta,metaFinalSha256:metaSha256(meta),sourceShardGitSha:'old',metaVerification:{status:'VERIFIED_CURRENT_SOURCE',sourceShardGitSha:'old'}};
 assert.equal(needsSameMetaSourceRebind(row,meta,'new'),true);
 assert.equal(needsSameMetaSourceRebind({...row,sourceShardGitSha:'new'},meta,'new'),true);
 assert.equal(needsSameMetaSourceRebind({...row,metaVerification:undefined},meta,'new'),true,'source-derived projection can drop a stale marker; compiler must validate its preserved authority evidence');
 assert.equal(needsSameMetaSourceRebind({...row,sourceShardGitSha:'new',metaVerification:{...row.metaVerification,sourceShardGitSha:'new'}},meta,'new'),false);
});

test('same-Meta Source rebind cannot authorize different Meta, absent Source, or an unverified row',()=>{
 const meta={rpmL3:'원의 방정식',difficultyBucket:3};
 const row={meta,metaFinalSha256:metaSha256(meta),sourceShardGitSha:'old',metaVerification:{status:'VERIFIED_CURRENT_SOURCE',sourceShardGitSha:'old'}};
 assert.equal(needsSameMetaSourceRebind(row,{...meta,difficultyBucket:4},'new'),false);
 assert.equal(needsSameMetaSourceRebind({...row,meta:{...meta,difficultyBucket:4}},meta,'new'),false);
 assert.equal(needsSameMetaSourceRebind(row,meta,null),false);
 assert.equal(needsSameMetaSourceRebind({...row,metaVerification:{status:'NOT_VERIFIED'}},meta,'new'),false);
});
