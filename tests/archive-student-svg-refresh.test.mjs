import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planPagesSite } from '../tools/build-archive-pages-site.mjs';
import visual from '../archive/student-svg-refresh.js';

test('published SVGs refresh issued originals, unit papers and generated questions without mutating the snapshot', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'student-svg-refresh-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, data) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), data);
  };
  const file = 'original/high/h1/2final/22_시험_2학기_기말.js';
  const asset = 'assets/images/fixture/q18-solution-v2.svg';
  const question = { id: 18, content: 'Determine the value.', choices: ['1', '2'], answer: '②', solution: 'Frozen explanation.',
    image: 'assets/images/fixture/problem.svg', imageSize: 'small',
    solutionImage: asset, solutionImageCaption: 'Updated graph.', solutionImageSize: 'full' };
  const source = 'archive/exams/' + file;
  const generated = 'archive/data/generated-lite-consumer/v1/shards/sample.json';
  put(source, 'window.questionBank = ' + JSON.stringify([question]));
  put(generated, JSON.stringify({ schemaVersion: 'ALIVE_GENERATED_CONSUMER_SHARD_V1',
    records: [{ sourceKind: 'generated', generatedUid: 'generated-fixture', question }] }));
  put('archive/' + asset, '<svg xmlns="http://www.w3.org/2000/svg"/>');
  put('archive/' + question.image, '<svg xmlns="http://www.w3.org/2000/svg"><title>Updated</title></svg>');
  const manifest = { schemaVersion: 'ARCHIVE_PAGES_SITE_MANIFEST_V1', maxBytes: 100_000,
    studentSvgRefresh: true, files: [source, generated] };
  const projection = () => planPagesSite({ sourceRoot: root, manifest }).entries.filter(entry => entry.studentSvgInputs);
  let entries = projection();
  assert.deepEqual(new Set(entries.flatMap(entry => entry.studentSvgInputs)), new Set([source, generated, 'archive/' + asset, 'archive/' + question.image]));
  const baseUrl = 'https://student.example/portal/archive/mixed_engine.html';
  const options = { baseUrl, fetcher: async (url, init) => {
    assert.match(url.href, /^https:\/\/student\.example\/portal\/archive\/data\/student-svg-refresh-v1\/(?:high-h1|generated)\.json$/);
    assert.equal(init.cache, 'no-cache');
    return new Response(entries.find(entry => url.pathname.endsWith(entry.path)).content);
  } };
  const old = Object.freeze({ ...question, image: 'old.png', imageAlt: 'outdated', solution: 'The original issued explanation.',
    solutionImage: 'old.svg', solutionImageCaption: 'Old caption.', solutionImageSize: 'medium' });
  const assigned = { sourceKind: 'assignment', assignmentId: 'already-issued' };
  const [original] = await visual.refresh([old], { ...assigned, sourceId: 'exams/' + file }, options);
  assert.match(original.solutionImage, /q18-solution-v2\.svg\?v=[a-f0-9]{64}$/);
  assert.match(original.image, /problem\.svg\?v=/);
  assert.equal(original.imageAlt, undefined);
  assert.equal(original.solutionImageCaption, 'Updated graph.');
  assert.equal(original.solutionImageSize, 'full');
  assert.equal(original.solution, old.solution);
  assert.equal(old.solutionImage, 'old.svg');

  const first = { ...old, id: 12, _sourceFile: file.replace('/2final/', '/final/'), _sourceQuestionNo: 18 };
  const generatedQuestion = { ...old, generatedUid: 'generated-fixture', sourceKind: 'generated' };
  const changed = { ...first, content: 'A different problem.' };
  const mixed = [first, generatedQuestion, changed];
  const mixedEnvelope = { ...assigned, sourceId: 'MIXED:unit' };
  const result = await visual.refresh(mixed, mixedEnvelope, options);
  assert.equal(result[0].id, 12);
  assert.equal(result[0].solutionImage, original.solutionImage);
  assert.equal(result[1].solutionImage, original.solutionImage);
  assert.equal(result[2], changed);

  put('archive/' + asset, '<svg xmlns="http://www.w3.org/2000/svg"><title>New bytes at the same path</title></svg>');
  entries = projection();
  const [updated] = await visual.refresh([first], mixedEnvelope, options);
  assert.notEqual(updated.solutionImage, original.solutionImage);
  assert.equal(updated.solutionImage.split('?')[0], original.solutionImage.split('?')[0]);

  assert.equal(await visual.refresh(mixed, { sourceKind: 'unit-past' }, options), mixed);
  assert.equal(await visual.refresh(mixed, mixedEnvelope, { ...options, fetcher: async () => new Response('', { status: 404 }) }), mixed);
});
