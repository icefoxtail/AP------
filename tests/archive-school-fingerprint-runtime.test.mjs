import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import runtime from '../archive/mixer-school-fingerprint-runtime.js';

const payload = JSON.parse(fs.readFileSync('archive/data/school-fingerprints.json', 'utf8'));

test('Mixer fingerprint runtime accepts eligible candidates without operational exposure', () => {
  const validation = runtime.validatePayload(payload);
  assert.equal(validation.ok, true);
  assert.equal(validation.presetCount, 23);
  const presets = runtime.eligiblePresets(payload);
  assert.equal(presets.length, 23);
  assert.ok(presets.every(preset => preset.exposure === 'not_operational'));
  assert.ok(presets.every(preset => preset.sample.policy === 'candidate_v1_not_operational'));
  assert.equal(new Set(presets.map(preset => preset.schoolName)).size, 23);
  assert.ok(!presets.some(preset => preset.schoolName === '광양제철고'));
});

test('Mixer fingerprint runtime loads validated JSON through injected fetch', async () => {
  const result = await runtime.load('/fingerprints.json', async () => ({ ok: true, async json() { return payload; } }));
  assert.equal(result.ok, true);
  assert.equal(result.presetCount, 23);
  assert.equal(result.policyStatus, 'candidate_v1_not_operational');
  assert.equal(result.contractVersion, runtime.CONTRACT_VERSION);
});

test('Mixer includes the hidden fingerprint runtime contract', () => {
  const html = fs.readFileSync('archive/mixer.html', 'utf8');
  assert.match(html, /mixer-school-fingerprint-runtime\.js\?v=20260825\.1/);
  assert.doesNotMatch(html, /school-fingerprint-(?:select|preset)\b/i);
});
