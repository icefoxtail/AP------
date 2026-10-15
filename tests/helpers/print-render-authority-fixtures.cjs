'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const BASELINE_COMMIT = '5519b07d117b741f21e94d3d9e80129ec987168d';
const FIXTURE_ROOT = path.join(__dirname, '..', 'fixtures', 'print-render-authority-v2.2');
const FIXTURES = Object.freeze({
  'phase-a-solution-layout-bridge.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-a-solution-layout-bridge.json',
    gitBlobSha1: 'c3100bf68df950c7053b56504fbf8e7fcf454f22',
    sha256: 'f5e37091bbc745e245df33a18bb96c534915746496fc20fc72721effeaa39b57',
    sizeBytes: 3014
  }),
  'phase-3-archive-browser-fixture.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-3-archive-browser-fixture.json',
    gitBlobSha1: '04f1632fd9b97393e881ccebbb437c159bc02912',
    sha256: '9ae83c5c3496f6968458c890c8a745bb0fda99d16e2efc15e6d477d56fc6516b',
    sizeBytes: 680
  }),
  'phase-3-archive-semantic-browser-fixture.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-3-archive-semantic-browser-fixture.json',
    gitBlobSha1: '52d9374d151cfe8c537bbb46702d4dd29b0d47db',
    sha256: '9ebe91a8885fd9e2bec26e074f89c3834395787c18a7360d2e7711f2b1bba689',
    sizeBytes: 1460
  }),
  'phase-4-mixer-browser-fixture.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-4-mixer-browser-fixture.json',
    gitBlobSha1: '6e63093270d2a14fd6c78d08e40915f51635d22e',
    sha256: '86624ab4fed887c7f8370f5f7af1943dd66df96996f1158a5c1c9cd3ad3d0eff',
    sizeBytes: 2125
  }),
  'phase-5-clinic-browser-fixture.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-5-clinic-browser-fixture.json',
    gitBlobSha1: 'c97f6069c1b59822082eeccd62cc0ab1a5c94f29',
    sha256: 'b0713c2ec9f01e0444b958e0f957bda7e8a0d8c3336471cbb2807b2638bca4a9',
    sizeBytes: 4860
  }),
  'phase-6-readiness-authority.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-6-readiness-authority.json',
    gitBlobSha1: '55a42d9ffb7358a1ad96dd5aa8501b1c9bead7ee',
    sha256: 'b87b8712bcda464b59d8635904298d6d16a938461589f956425c0365fa93e580',
    sizeBytes: 1912
  }),
  'phase-0.6-known-drift-ledger.json': Object.freeze({
    originalPath: 'reports/print-render-authority-v2.2/phase-0.6-known-drift-ledger.json',
    gitBlobSha1: '10c18ae847ebe1169f4777e2ab60cb5ce80139f4',
    sha256: '50fa689c75fa6d24dd0cb0668478e22a91565f846409cfc3c1a53fc6b1454175',
    sizeBytes: 15259
  })
});

function gitBlobSha1(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(bytes).digest('hex');
}

function readPrintRenderAuthorityFixture(name) {
  const source = FIXTURES[name];
  if (!source) throw new Error(`PRINT_RENDER_FIXTURE_NOT_DECLARED:${name}`);
  const fullPath = path.join(FIXTURE_ROOT, name);
  const stat = fs.lstatSync(fullPath);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`PRINT_RENDER_FIXTURE_PATH_INVALID:${name}`);
  const bytes = fs.readFileSync(fullPath);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== source.sizeBytes || gitBlobSha1(bytes) !== source.gitBlobSha1 || sha256 !== source.sha256) {
    throw new Error(`PRINT_RENDER_FIXTURE_BASELINE_BYTES_MISMATCH:${name}`);
  }
  try { return JSON.parse(bytes.toString('utf8')); }
  catch { throw new Error(`PRINT_RENDER_FIXTURE_JSON_INVALID:${name}`); }
}

module.exports = {
  BASELINE_COMMIT,
  FIXTURES,
  readPrintRenderAuthorityFixture
};
