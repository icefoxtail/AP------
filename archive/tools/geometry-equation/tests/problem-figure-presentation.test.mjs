import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { composeProblemPresentation } from '../production/problem-figure-presentation.mjs';

test('problem stroke profiles preserve the pinned geometry and adjust the intended declarations', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-stroke-profile-'));
  const sourceAsset = 'archive/assets/images/fixture.svg';
  const filename = path.join(root, sourceAsset);
  const source = '<svg><style>.curve{fill:none;stroke:#e65100;stroke-width:2}.curve{stroke:#e65100;}</style>'
    + '<line id="axis" stroke-width="1" x1="0" x2="100"/>'
    + '<polyline id="f" stroke-width="2.1" points="1,2 3,4"/><text x="10" y="4">A</text></svg>';
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, source);
  t.after(() => {
    fs.unlinkSync(filename);
    fs.rmdirSync(path.dirname(filename));
    fs.rmdirSync(path.join(root, 'archive/assets'));
    fs.rmdirSync(path.join(root, 'archive'));
    fs.rmdirSync(root);
  });
  const sourceSha256 = createHash('sha256').update(source).digest('hex');
  const plan = {
    sourceAsset, sourceSha256, adjustments: [
      { elementId: 'f', width: 3.2 },
      { selector: '.curve', previousColor: '#e65100', color: '#a33b0b', expectedDeclarations: 2 }
    ]
  };
  const composed = composeProblemPresentation(plan, { repoRoot: root });
  assert.equal(composed.status, 'STYLE_RECOMPOSED');
  assert.equal(composed.svg, source.replaceAll('#e65100', '#a33b0b').replace('stroke-width="2.1"', 'stroke-width="3.2"'));
  assert.throws(() => composeProblemPresentation({ ...plan, sourceSha256: 'stale' }, { repoRoot: root }), /SHA mismatch/);
  assert.throws(() => composeProblemPresentation({
    ...plan, adjustments: [{ ...plan.adjustments[1], expectedDeclarations: 1 }]
  }, { repoRoot: root }), /target count/);
  const point = composeProblemPresentation({
    sourceAsset, sourceSha256, capability: 'problem-point-label-profile-v1',
    adjustments: [{ text: 'A', dx: -6, dy: 4 }]
  }, { repoRoot: root });
  assert.equal(point.svg, source.replace('<text x', '<text transform="translate(-6 4)" x'));
});
