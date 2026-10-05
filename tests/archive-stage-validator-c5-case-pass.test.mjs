import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validateC5Evidence } from '../archive/tools/archive-stage-validator-c5-v2.mjs';
const raw = fs.readFileSync(path.resolve('archive/fixtures/stage-validator-pilot/c5-pass.b64'),'utf8').trim();
const evidence = JSON.parse(Buffer.from(raw,'base64').toString('utf8'));
const report = validateC5Evidence({examUid:'fixture-c5',artifactSha:'artifact-c5',actualArtifactSha:'artifact-c5',evidenceRef:'fixture://c5-pass',evidence,expectedQids:[1]});
assert.equal(report.ok,true);
