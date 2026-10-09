'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const archive = path.join(root, 'archive');
const indexPath = path.join(archive, 'data/generated-lite-consumer/v1/index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const prefix = 'data/generated-lite-consumer/v1/';
const b03 = index.records.filter(r => r.uid.startsWith('ALITE-BSG26-B03-'));
const hyocheon = index.records.filter(r => r.school === '효천고');
const palma = index.records.filter(r => r.school === '팔마고');
const holdUids = new Set(index.excludedHoldUids);
const selectableCount = value => value.records.filter(r => r.consumerSelectable === true).length;
const originalFile = 'archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js';

function gitSha(bytes) {
  const b = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return crypto.createHash('sha1').update('blob ' + b.length + '\0').update(b).digest('hex');
}
function contentFingerprint(question) {
  const value = JSON.stringify({
    content: question.content, choices: question.choices,
    answer: question.answer, solution: question.solution
  });
  let n = 14695981039346656037n;
  for (let i = 0; i < value.length; i++) {
    n = BigInt.asUintN(64, (n ^ BigInt(value.charCodeAt(i))) * 1099511628211n);
  }
  return 'fnv1a64-utf16:' + n.toString(16).padStart(16, '0');
}

test('consumer DB preserves previous approvals, adds four Palma questions and excludes holds', () => {
  assert.equal(index.schemaVersion, 'ALIVE_GENERATED_CONSUMER_INDEX_V1');
  assert.equal(index.approvedCount, index.records.length);
  assert.equal(index.records.length, 323);
  assert.equal(hyocheon.length, 92);
  assert.equal(b03.length, 38);
  assert.equal(index.approvedBySchool['효천고'], 92);
  assert.equal(index.approvedBySchool['복성고'],191);
  assert.equal(palma.length, 40);
  assert.equal(index.approvedBySchool['팔마고'], 40);
  assert.deepEqual(palma.filter(r => r.uid.includes('-B07-')).map(r => r.uid), [
    'ALITE-PALMA25-H1-2MID-B07-Q01-BP01',
    'ALITE-PALMA25-H1-2MID-B07-Q01-BP02',
    'ALITE-PALMA25-H1-2MID-B07-Q13-BP01',
    'ALITE-PALMA25-H1-2MID-B07-Q13-BP02'
  ]);
  assert.equal(new Set(index.records.map(r => r.uid)).size, 323);
  assert.ok(index.records.slice(0, 92).every(r => r.school === '효천고'));
  assert.ok(index.records.slice(92,130).every(r => r.school === '복성고' && r.approval === 'REVIEW_APPROVED'));
  assert.ok(index.records.slice(130,165).every(r => r.school === '복성고' && r.approval === 'USER_DIRECTED_OPERATING_APPROVED'));
  assert.ok(index.records.slice(165,273).every(r => r.school === '복성고' && r.approval === 'REVIEW_APPROVED'));
  assert.ok(index.records.every(r => !holdUids.has(r.uid)));
  assert.ok(index.records.every(r => r.sourceKind === 'generated' && /^ALITE-[A-Za-z0-9-]+$/.test(r.uid)));
  assert.equal(index.records.filter(r => r.uid.includes('BSG26-B01R2-')).length, 45);
  assert.equal(index.records.filter(r => r.uid.includes('BSG26-B02-')).length, 38);
  assert.equal(gitSha(fs.readFileSync(path.join(root, originalFile))), '8266fa476906e9134b94f23e803bd3b2fb26ece4');
});

test('38 B03 approved consumer rows resolve to exact source/meta and SHA-bound consumer shards with five choices', () => {
  const bySource = new Map();
  const perQ = {};
  for (const row of b03) {
    assert.ok(row.shard.startsWith(prefix) && !row.shard.includes('..'));
    const consumerFile = path.join(archive, row.shard);
    const consumerBytes = fs.readFileSync(consumerFile);
    assert.equal(gitSha(consumerBytes), row.consumerShardGitSha, row.uid);
    const consumer = JSON.parse(consumerBytes.toString('utf8'));
    assert.equal(consumer.schemaVersion, 'ALIVE_GENERATED_CONSUMER_SHARD_V1');
    assert.equal(consumer.school, '복성고');
    const matches = consumer.records.filter(r => r.generatedUid === row.uid && r.localOrdinal === row.localOrdinal);
    assert.equal(matches.length, 1, row.uid);
    const got = matches[0], q = got.question;
    assert.equal(got.sourceKind, 'generated');
    assert.equal(got.l2, row.l2);
    assert.equal(row.sourceExamPath, originalFile);
    assert.equal(row.schoolMarker, '복성고');
    assert.equal(row.l1, q.standardUnitKey);
    assert.equal(row.rpmL3, got.rpmPrimary.l3);
    assert.equal(row.rpmL4, got.rpmPrimary.l4);
    assert.equal(row.rpmRecordId, got.rpmPrimary.recordId);
    assert.equal(row.shardGitBlobSha, row.consumerShardGitSha);
    assert.equal(row.reviewStatus, 'REVIEW_PASS');
    assert.equal(got.reviewApprovalMainSha, row.reviewFinalArtifactSha);
    assert.equal(got.sourceShardGitSha, row.sourceShardGitSha);
    assert.equal(got.sourceExamBlobSha, row.sourceExamBlobSha);
    assert.equal(got.contentFingerprint, row.contentFingerprint);
    assert.equal(contentFingerprint(q), row.contentFingerprint);
    assert.ok(['하', '중', '상'].includes(q.level));
    assert.equal(q.subUnitKey, row.l2);
    assert.equal(q.uid, row.uid);
    assert.equal(q.choices.length, 5);
    assert.equal(new Set(q.choices).size, 5);
    assert.ok('①②③④⑤'.includes(q.answer));
    assert.ok(q.solution.endsWith('정답은 ' + q.answer + '이다.'));
    assert.equal(row.consumerSelectable, true);
    assert.equal(row.sourceExamBlobSha, '8266fa476906e9134b94f23e803bd3b2fb26ece4');

    const sourcePath = path.join(root, got.sourceShard);
    assert.equal(gitSha(fs.readFileSync(sourcePath)), got.sourceShardGitSha, row.uid);
    const metaPath = got.sourceShard.replace('/shards/', '/metadata/').replace(/\.js$/, '.json');
    const meta = bySource.get(metaPath) || JSON.parse(fs.readFileSync(path.join(root, metaPath), 'utf8'));
    bySource.set(metaPath, meta);
    const m = meta.find(entry => entry.uid === row.uid);
    assert.equal(m?.reviewApprovalStatus, 'REVIEW_PASS', row.uid);
    assert.equal(m?.targetSubUnitKey, row.l2, row.uid);
    assert.equal(m?.answerPosition, '①②③④⑤'.indexOf(q.answer) + 1, row.uid);
    assert.equal(got.rpmPrimary.recordId, m.rpmCrosswalkId, row.uid);

    if (row.uid.endsWith('-Q14-I10')) {
      assert.ok(q.content.includes('(가)') && q.content.includes('(나)') && q.content.includes('(다)'));
      assert.ok(q.content.includes('\n'));
      assert.ok(!/<br|<div|<\/div/i.test(q.content));
    }
    perQ[row.sourceQid] = (perQ[row.sourceQid] || 0) + 1;
  }
  assert.deepEqual(perQ, { '9': 10, '13': 9, '14': 10, '16': 9 });
  assert.equal(bySource.size, 4);
  assert.equal(b03.filter(r => r.reviewApprovalBasis.includes('USER_DIRECTED_OVERRIDE')).length, 4);
});

test('four Palma approvals resolve through the exact runtime shard path and candidate UID', () => {
  const expectedUids = [
    'ALITE-PALMA25-H1-2MID-B07-Q01-BP01',
    'ALITE-PALMA25-H1-2MID-B07-Q01-BP02',
    'ALITE-PALMA25-H1-2MID-B07-Q13-BP01',
    'ALITE-PALMA25-H1-2MID-B07-Q13-BP02'
  ];
  assert.deepEqual(palma.filter(r => r.uid.includes('-B07-')).map(r => r.uid), expectedUids);
  for (const row of palma.filter(r => r.uid.includes('-B07-'))) {
    assert.equal(row.consumerSelectable, true, row.uid);
    assert.equal(row.approval, 'REVIEW_APPROVED', row.uid);
    assert.equal(row.reviewStatus, 'REVIEW_PASS', row.uid);
    assert.ok(row.shard.startsWith(prefix) && !row.shard.includes('..'), row.uid);
    const bytes = fs.readFileSync(path.join(archive, row.shard));
    assert.equal(gitSha(bytes), row.consumerShardGitSha, row.uid);
    const consumer = JSON.parse(bytes.toString('utf8'));
    assert.equal(consumer.schemaVersion, 'ALIVE_GENERATED_CONSUMER_SHARD_V1');
    const matches = consumer.records.filter(r => r.generatedUid === row.uid && r.localOrdinal === row.localOrdinal);
    assert.equal(matches.length, 1, row.uid);
    const question = matches[0].question;
    assert.equal(question.uid, row.uid);
    assert.equal(matches[0].sourceQid, row.sourceQid);
    assert.equal(question.choices.length, 5);
    assert.ok('①②③④⑤'.includes(question.answer));
    assert.equal(question.subUnitKey, row.l2);
    assert.equal(matches[0].sourceExamBlobSha, row.sourceExamBlobSha);
  }
});


test('new Palma QID9 36 register with four canonical parent units and retain B07 existing four', () => {
  const fresh=palma.filter(r=>/^ALITE-PALMA25-2MID-Q0[1-4]-[ABC][123]$/.test(r.uid));
  assert.equal(fresh.length,36);
  assert.equal(new Set(fresh.map(r=>r.uid)).size,36);
  const expectedL2=['H22-C2-05-CORE','H22-C2-06-CORE','H22-C2-03-CIRCLE_EQUATION','H22-C2-01-COORDINATE_METRIC'];
  for(let n=1;n<=4;n++){
    const batch=fresh.filter(r=>r.sourceQid===n);
    assert.equal(batch.length,9);
    assert.ok(batch.every(r=>r.l2===expectedL2[n-1]));
  }
  for(const row of fresh){
    assert.equal(row.approval,'USER_DIRECTED_OPERATING_APPROVED');
    assert.equal(row.reviewApprovalBasis,'USER_DIRECTED_OPERATING_APPROVAL_20261009_QID9_36');
    assert.equal(row.consumerSelectable,true);
    const bytes=fs.readFileSync(path.join(archive,row.shard));
    assert.equal(gitSha(bytes),row.shardGitBlobSha,row.uid);
    const shard=JSON.parse(bytes);
    const matches=shard.records.filter(x=>x.generatedUid===row.uid&&x.localOrdinal===row.localOrdinal);
    assert.equal(matches.length,1,row.uid);
    const q=matches[0].question;
    assert.equal(q.uid,row.uid);
    assert.equal(q.subUnitKey,row.l2);
    assert.equal(q.standardUnitKey,row.l1);
    assert.equal(q.choices.length,5);
    assert.equal(new Set(q.choices).size,5);
    assert.ok('①②③④⑤'.includes(q.answer));
    assert.ok(q.content&&q.solution);
    assert.equal(q.sourceKind,'generated');
  }
});

class Node {
  constructor(tag = 'div', fragment = false) {
    this.tag = tag; this.fragment = fragment; this.children = [];
    this.listeners = Object.create(null); this.textContent = '';
    this.value = ''; this.checked = false; this.disabled = false;
  }
  appendChild(child) {
    if (child.fragment) this.children.push(...child.children);
    else this.children.push(child);
    return child;
  }
  replaceChildren(...children) { this.children = []; this.textContent = ''; children.forEach(x => this.appendChild(x)); }
  addEventListener(kind, handler) { this.listeners[kind] = handler; }
  setAttribute(key, value) { this[key] = value; }
}

test('consumer UI lists only selectable generated rows, searches individual questions, and preserves approved paper printing', async () => {
  const nodes=Object.create(null);
  const document={
    getElementById:id=>nodes[id]??(nodes[id]=new Node()),
    createElement:tag=>new Node(tag),
    createDocumentFragment:()=>new Node('fragment',true)
  };
  const html=fs.readFileSync(path.join(archive,'generated-bank.html'),'utf8');
  assert.ok(html.includes('생성 문항 검색·선택'));
  assert.ok(html.includes('consumerSelectable'));
  const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  const code=scripts.at(-1)?.[1];
  assert.ok(code&&code.includes('data/generated-lite-consumer/v1/index.json'));
  new vm.Script(code,{filename:'generated-bank.inline.js'});
  const fetchStub=async u=>{
    if(!u.startsWith(prefix)||u.includes('..'))return{ok:false,status:404};
    const file=path.join(archive,u);
    return{ok:true,json:async()=>JSON.parse(fs.readFileSync(file,'utf8'))};
  };
  let printed=0;
  vm.runInNewContext(code,{document,window:{print:()=>printed++},fetch:fetchStub,console,Map,Set,Promise},{timeout:2000});
  await new Promise(resolve=>setTimeout(resolve,25));
  const el=id=>document.getElementById(id);
  const cards=el('exam-cards').children;
  assert.equal(cards.length,2);
  assert.equal(el('print').disabled,true);
  const bok=cards.find(x=>x.children[0].textContent.includes('복성고'));
  const hyo=cards.find(x=>x.children[0].textContent.includes('효천고'));
  assert.ok(bok);
  assert.ok(hyo);
  assert.match(bok.children[1].textContent,/23문항/);
  bok.onclick();await el('print').listeners.click();
  assert.equal(printed,1);
  assert.equal(el('paper-items').children.length,23);
  assert.match(el('paper-title').textContent,/복성고/);
  const search=el('generated-search');
  search.value='효천고';search.listeners.input();
  assert.equal(el('generated-results').children.filter(x=>x.tag==='article').length,0);
  search.value='복성고';search.listeners.input();
  assert.ok(el('generated-results').children.length>0);
  const card=el('generated-results').children[0];
  const actions=card.children.find(x=>x.className==='generated-actions');
  const open=actions.children.find(x=>x.textContent==='문항 열기');
  const choose=actions.children.find(x=>x.textContent==='시험지에 선택');
  await open.listeners.click();
  assert.equal(el('generated-preview').hidden,false);
  choose.listeners.click();
  assert.match(el('generated-selection-summary').textContent,/1개 문항/);
  await el('generated-print').listeners.click();
  assert.equal(printed,2);
  assert.equal(el('paper-items').children.length,1);
  const textOf=node=>String(node.textContent||'')+node.children.map(textOf).join('');
  assert.ok(!textOf(el('paper-items')).includes('정답:'));
  assert.equal(index.records.length,323);
  assert.equal(selectableCount(index),231);
  assert.ok(index.records.every(r=>!holdUids.has(r.uid)));
  search.value='팔마고';search.listeners.input();
  assert.equal(el('generated-results').children.filter(x=>x.tag==='article').length,40);
  const palmaCard=el('generated-results').children.find(x=>x.tag==='article');
  const palmaActions=palmaCard.children.find(x=>x.className==='generated-actions');
  const palmaOpen=palmaActions.children.find(x=>x.textContent==='문항 열기');
  await palmaOpen.listeners.click();
  assert.ok(!textOf(el('generated-preview')).includes('정답'));
  assert.ok(!textOf(el('generated-preview')).includes('해설'));
  search.value='ALITE-PALMA25-H1-2MID-B07-Q13-BP03';search.listeners.input();
  assert.equal(el('generated-results').children.filter(x=>x.tag==='article').length,0);
});
