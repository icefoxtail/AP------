// A composite, number-line, solid and inequality-chain figure carries the same root accessibility metadata a single figure does
// (role="img", <title> from the plan caption, <desc> from plan.accessibilityDescription else the fixed sentence), so no after-render script is needed.
// Pure checks (no Chrome): the metadata builder, the plan pass-through of the three expanders, and the student SVG language contract on the result.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {compositeAccessibleNames} from '../production/composite-candidate-svg-v1.mjs';
import {expandNumberLineFigure} from '../production/number-line-v1.mjs';
import {expandInequalityChain} from '../production/quadratic-inequality-chain-v1.mjs';
import {expandSolidFigure} from '../production/solid-figure-v1.mjs';
import {upgradeSvgAccessibility} from '../production/svg-accessibility-v1.mjs';

const {validateSvgStudentLanguage}=createRequire(import.meta.url)('../../svg-language-contract.cjs');
const golden=dir=>JSON.parse(fs.readFileSync(new URL(`../ops/golden/${dir}/plan.json`,import.meta.url),'utf8'));
const wrap=(plan,body='<g/>')=>`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" role="img" aria-labelledby="visual-title visual-desc" data-composite="composite-panels-v1">${compositeAccessibleNames(plan)}${body}</svg>`;

test('title is the plan caption, description is accessibilityDescription, else the single-figure defaults',()=>{
  assert.equal(compositeAccessibleNames({caption:'수직선 위의 구간',accessibilityDescription:'두 구간의 공통 범위를 수직선에 나타낸 그림이다.'}),
    '<title id="visual-title">수직선 위의 구간</title><desc id="visual-desc">두 구간의 공통 범위를 수직선에 나타낸 그림이다.</desc>');
  assert.equal(compositeAccessibleNames({}),'<title id="visual-title">해설 도형</title><desc id="visual-desc">점과 도형의 관계를 확인한다.</desc>');
  assert.match(compositeAccessibleNames({caption:'-3<a<5 & b'}),/<title id="visual-title">-3&lt;a&lt;5 &amp; b<\/title>/);
});

test('an invalid accessibilityDescription is refused like the single construction path',()=>{
  for(const bad of ['',' ','줄\n바꿈','가'.repeat(501),7])assert.throws(()=>compositeAccessibleNames({caption:'가나',accessibilityDescription:bad}),error=>error.status==='SPEC_ERROR'&&error.detail.code==='INVALID_ACCESSIBILITY_DESCRIPTION');
});

test('number-line, chain and solid plans pass accessibilityDescription through to the composite plan',()=>{
  const desc='공통 범위를 수직선에 나타낸 그림이다.';
  assert.equal(expandNumberLineFigure({...golden('item13'),accessibilityDescription:desc}).accessibilityDescription,desc);
  assert.equal(expandInequalityChain({...golden('item11'),accessibilityDescription:desc}).accessibilityDescription,desc);
  assert.equal(expandSolidFigure({...golden('item22'),accessibilityDescription:desc}).accessibilityDescription,desc);
  assert.equal(Object.hasOwn(expandNumberLineFigure(golden('item13')),'accessibilityDescription'),false,'absent stays absent');
  assert.equal(Object.hasOwn(expandSolidFigure(golden('item22')),'accessibilityDescription'),false);
});

test('the metadata passes the student SVG language contract for the real golden captions',()=>{
  for(const dir of ['item11','item13','item22','item24']){
    const plan=dir==='item24'?golden(dir):{caption:golden(dir).caption};
    const result=validateSvgStudentLanguage(wrap(plan),{assetRef:dir});
    assert.deepEqual(result.errors,[],dir);
  }
});

test('a figure that already has the metadata is refused by the after-render script (so running it again is harmless)',()=>{
  const svg=Buffer.from(wrap({caption:'수직선 위의 구간'}),'utf8');
  assert.throws(()=>upgradeSvgAccessibility(svg,{expectedSha256:crypto.createHash('sha256').update(svg).digest('hex'),title:'해설 그림: 가나',description:'수직선 위의 범위를 나타낸 그림이다.'}),/METADATA_ALREADY_PRESENT/);
});
