import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {typesetter} from '../production/typography.mjs';
import {bytesSha} from '../../pipeline-core/canonical.mjs';
import {typographyLabels} from '../production/typography-spike.mjs';
const fontPath=fileURLToPath(new URL('../../../../.tmp/apmath-visual-engine/dependencies/NotoSansKR.ttf',import.meta.url));
const fontSha256=bytesSha(fs.readFileSync(fontPath));
test('actual MathJax SVG and Korean outlines for required notation inventory',()=>{
  const t=typesetter({fontPath,fontSha256});
  for(const label of typographyLabels){const f=t(label,{visualAssetKey:'asset1'});assert.ok(f.intrinsic.width>0);assert.match(f.svg,/<path/);assert.doesNotMatch(f.svg,/<text|<use|href=/);}
});
test('owner namespaces, deterministic fragment, font hash and missing glyph negatives',()=>{
  const t=typesetter({fontPath,fontSha256}),label=typographyLabels[0];
  const a=t(label,{visualAssetKey:'asset1'});assert.deepEqual(a,t(label,{visualAssetKey:'asset1'}));
  assert.notEqual(a.namespace,t({...label,owner:'another'},{visualAssetKey:'asset1'}).namespace);
  assert.throws(()=>typesetter({fontPath,fontSha256:'wrong'}),/FONT_HASH/);
  assert.throws(()=>t({...label,text:'\u{10ffff}'},{visualAssetKey:'asset1'}),/MISSING_KOREAN/);
});
