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
const holdUids = new Set(index.excludedHoldUids);
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

test('consumer DB contains 92 protected Hyocheon and exactly 38 approved Bokseong B03; no hold or duplicate UID', () => {
  assert.equal(index.schemaVersion, 'ALIVE_GENERATED_CONSUMER_INDEX_V1');
  assert.equal(index.approvedCount, index.records.length);
  assert.equal(index.records.length, 130);
  assert.equal(hyocheon.length, 92);
  assert.equal(b03.length, 38);
  assert.equal(index.approvedBySchool['효천고'], 92);
  assert.equal(index.approvedBySchool['복성고'], 38);
  assert.equal(new Set(index.records.map(r => r.uid)).size, 130);
  assert.ok(index.records.slice(0, 92).every(r => r.school === '효천고'));
  assert.ok(index.records.slice(92).every(r => r.school === '복성고' && r.approval === 'REVIEW_APPROVED'));
  assert.ok(index.records.every(r => !holdUids.has(r.uid)));
  assert.ok(index.records.every(r => r.sourceKind === 'generated' && /^ALITE-[A-Za-z0-9-]+$/.test(r.uid)));
  assert.ok(!index.records.some(r => r.uid.includes('BSG26-B01R2-') || r.uid.includes('BSG26-B02-')));
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
  assert.equal(b03.filter(r => r.approvalBasis === 'USER_DIRECTED_OVERRIDE').length, 4);
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

test('student finder loads 130; school search, UID preview, answer, checkbox/print and hold rejection work', async () => {
  const nodes = Object.create(null);
  const document = {
    getElementById: id => nodes[id] ||= new Node(),
    createElement: tag => new Node(tag),
    createDocumentFragment: () => new Node('fragment', true)
  };
  let printed = 0;
  const html = fs.readFileSync(path.join(archive, 'generated-bank.html'), 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  const code = scripts.at(-1)?.[1];
  assert.ok(code && code.includes('data/generated-lite-consumer/v1/index.json'));
  assert.ok(!code.includes('data.records.length!==92'));
  new vm.Script(code, { filename: 'generated-bank.inline.js' });
  const fetchStub = async u => {
    const file = path.join(archive, u);
    if (!u.startsWith(prefix) || u.includes('..')) return { ok: false, status: 404 };
    const raw = fs.readFileSync(file, 'utf8');
    return { ok: true, json: async () => JSON.parse(raw) };
  };
  const window = { print: () => { printed++; } };
  vm.runInNewContext(code, { document, window, fetch: fetchStub, console, Map, Set, Promise }, { timeout: 2000 });
  const wait = () => new Promise(resolve => setTimeout(resolve, 15));
  await wait();
  const el = id => document.getElementById(id);
  assert.equal(el('count').textContent, 130);
  assert.ok(el('school').children.some(x => x.value === '복성고'));
  assert.ok(el('school').children.some(x => x.value === '효천고'));
  el('school').value = '복성고'; el('school').listeners.change();
  assert.equal(el('count').textContent, 38);
  el('query').value = 'ALITE-BSG26-B03-Q14-I10'; el('query').listeners.input();
  assert.equal(el('count').textContent, 1);
  const selectedItem = el('items').children[0];
  const choiceInput = selectedItem.children[0], previewButton = selectedItem.children[2];
  await previewButton.onclick();
  assert.equal(el('toggle-answer').disabled, false);
  assert.ok(el('detail').children.some(x => x.textContent.includes('(가)') && x.textContent.includes('(다)')));
  assert.ok(!el('detail').children.some(x => x.textContent.includes('<br')));
  await el('toggle-answer').listeners.click();
  assert.ok(el('detail').children.some(x => x.textContent.includes('정답: ④') && x.textContent.includes('해설')));
  choiceInput.checked = true; choiceInput.listeners.change();
  assert.equal(el('print').disabled, false);
  await el('print').listeners.click();
  assert.equal(printed, 1);
  assert.equal(el('paper-items').children.length, 1);

  el('school').value = ''; el('school').listeners.change();
  el('query').value = 'ALITE-20261008-HYC26-Q10-001'; el('query').listeners.input();
  assert.equal(el('count').textContent, 0);
  el('query').value = ''; el('query').listeners.input();
  el('school').value = '효천고'; el('school').listeners.change();
  assert.equal(el('count').textContent, 92);
});
