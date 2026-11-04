import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {upgradeSvgAccessibility,verifySvgAccessibilityUpgrade} from './svg-accessibility-v1.mjs';
import {upgradeBatch} from '../ops/svg-m1/upgrade-svg-accessibility.mjs';

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const title='직사각형과 대각선의 관계';
const description='직사각형의 대각선과 같은 길이 표시를 비교하는 그림이다.';
const fixture=()=>Buffer.from('\uFEFF<?xml version="1.0" encoding="UTF-8"?>\r\n<!-- engine bytes -->\r\n<svg xmlns="http://www.w3.org/2000/svg" width="720" height="600" viewBox="0 0 720 600" role=\'presentation\' aria-labelledby=\'old\' style=\'stroke-linecap:round\'  >\r\n<g transform="translate(1.2 3.4)"><path id="segment" data-role="line" d="M0 0L24.500 42" stroke="#111" stroke-width="1.60"/><image href="data:image/svg+xml;base64,PHN2Zy8+" x="10" width="30" height="40"/></g>\r\n</svg>\r\n');
const convert=(before,extra={})=>upgradeSvgAccessibility(before,{expectedSha256:sha(before),title,description,...extra});

test('only root accessibility attributes and non-drawing text are serialized; visible bytes stay exact',()=>{
  const before=fixture(),original=Buffer.from(before),result=convert(before);
  assert.deepEqual(before,original,'input buffer must not be mutated');
  const body=before.subarray(before.indexOf(Buffer.from('>\r\n<g'))+1);
  assert.ok(result.svg.subarray(result.svg.length-body.length).equals(body));
  for(const bytes of ['width="720" height="600" viewBox="0 0 720 600"',"style='stroke-linecap:round'",'d="M0 0L24.500 42"','data:image/svg+xml;base64,PHN2Zy8+'])assert.ok(result.svg.includes(Buffer.from(bytes)));
  assert.equal(result.certificate.preservation.bodySha256,sha(body));
  assert.equal(result.certificate.beforeSvgSha256,sha(before));
  assert.equal(result.certificate.afterSvgSha256,sha(result.svg));
  assert.equal(result.certificate.actualRenderRun,false);
  assert.equal(result.certificate.reviewCarryForward.priorReviewAndRenderResultsModified,false);
  assert.equal(verifySvgAccessibilityUpgrade(before,result.svg,result.certificate).status,'METADATA_ONLY_VERIFIED');
  assert.deepEqual(convert(before),result,'serialization is deterministic');
});

test('metadata is plain escaped Korean text and cannot inject visible elements',()=>{
  const result=convert(fixture(),{title:'직사각형의 <대각선> & 같은 길이',description:'대각선과 같은 길이의 관계를 "비교"하는 도형이다.'});
  assert.ok(result.svg.includes(Buffer.from('&lt;대각선&gt; &amp;')));
  assert.ok(result.svg.includes(Buffer.from('&quot;비교&quot;')));
  assert.equal((result.svg.toString().match(/<title\b/g)||[]).length,1);
  assert.equal((result.svg.toString().match(/<desc\b/g)||[]).length,1);
});

test('stale hashes, existing metadata, dynamic styling and changed output fail closed',()=>{
  const before=fixture(),result=convert(before);
  assert.throws(()=>convert(before,{expectedSha256:'0'.repeat(64)}),/INPUT_SHA_MISMATCH/);
  assert.throws(()=>convert(result.svg),/METADATA_ALREADY_PRESENT/);
  for(const injection of ['<style>svg>:first-child{display:none}</style>','<script/>']){
    const dynamic=Buffer.from(before.toString().replace('<g transform=',injection+'<g transform='));
    assert.throws(()=>convert(dynamic),/DYNAMIC_RENDERING/);
  }
  assert.throws(()=>convert(Buffer.from('<!DOCTYPE svg><svg></svg>')),/DECLARATION_UNSUPPORTED/);
  assert.throws(()=>convert(Buffer.from([0xff,0x3c,0x3e])),/INVALID_UTF8/);
  const changed=Buffer.from(result.svg.toString().replace('M0 0L24.500 42','M0 0L24.500 43'));
  assert.throws(()=>verifySvgAccessibilityUpgrade(before,changed,result.certificate),/CERTIFICATE_MISMATCH/);
  const forged=structuredClone(result.certificate);forged.preservation.bodySha256='0'.repeat(64);
  assert.throws(()=>verifySvgAccessibilityUpgrade(before,result.svg,forged),/CERTIFICATE_MISMATCH/);
});

function batchFixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'svg metadata 한글 '));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const assetPath='archive/assets/images/example/q1-solution.svg',sourcePath='archive/exams/original/example.js',sourceRun='.tmp/svg-m1/runs/example/q1';
  const write=(relative,bytes)=>{const file=path.join(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);return file;};
  const before=fixture();write(assetPath,before);write(sourcePath,'window.questionBank=[];');
  write(sourceRun+'/plan.json',JSON.stringify({caption:title}));
  const publishBytes=Buffer.from(JSON.stringify({alt:description,caption:'정답은 바깥 캡션에만 기록한다.'}));write(sourceRun+'/publish.json',publishBytes);
  const oldRender='{"status":"ARCHIVE_BOUND","oldSha":"unchanged"}\n';write(sourceRun+'/out/figure-result.json',oldRender);
  const manifestPath='manifest.json',row={key:'example-q1',ord:1,assetPath,expectedSha256:sha(before),titleKo:title,descriptionKo:description,sourcePath,sourceRun,sourceReviewedPublishSha256:sha(publishBytes)};
  write(manifestPath,JSON.stringify([row]));
  return {root,row,before,write,oldRender,manifestPath,auditDir:'.tmp/svg-m1/runs/audit'};
}

test('batch preserves original SVG and provenance, changes no old render result, and verifies readback',t=>{
  const x=batchFixture(t),sourceBefore=fs.readFileSync(path.join(x.root,x.row.sourcePath));
  const report=upgradeBatch({...x,repoRoot:x.root});assert.equal(report.status,'METADATA_ONLY_UPGRADED');assert.equal(report.rows.length,1);
  const row=report.rows[0],evidence=JSON.parse(fs.readFileSync(row.certificatePath,'utf8'));
  assert.deepEqual(fs.readFileSync(row.beforePath),x.before);
  assert.deepEqual(fs.readFileSync(row.afterPath),fs.readFileSync(path.join(x.root,x.row.assetPath)));
  assert.equal(verifySvgAccessibilityUpgrade(x.before,fs.readFileSync(row.afterPath),evidence.certificate).status,'METADATA_ONLY_VERIFIED');
  assert.equal(evidence.provenance.publishSha256,x.row.sourceReviewedPublishSha256);
  assert.equal(fs.readFileSync(path.join(x.root,x.row.sourceRun,'out/figure-result.json'),'utf8'),x.oldRender);
  assert.deepEqual(fs.readFileSync(path.join(x.root,x.row.sourcePath)),sourceBefore);
  assert.throws(()=>upgradeBatch({...x,repoRoot:x.root}),/Audit directory must be new/);
});

test('batch preflight refuses stale publish evidence or any bad row before mutation',t=>{
  const x=batchFixture(t),bad={...x.row,key:'bad',expectedSha256:'0'.repeat(64)};
  x.write(x.manifestPath,JSON.stringify([x.row,bad]));
  assert.throws(()=>upgradeBatch({...x,repoRoot:x.root}));
  assert.deepEqual(fs.readFileSync(path.join(x.root,x.row.assetPath)),x.before);
  assert.ok(!fs.existsSync(path.join(x.root,x.auditDir)));
  x.write(x.manifestPath,JSON.stringify([{...x.row,sourceReviewedPublishSha256:'0'.repeat(64)}]));
  assert.throws(()=>upgradeBatch({...x,repoRoot:x.root}),/Reviewed publish SHA mismatch/);
  assert.deepEqual(fs.readFileSync(path.join(x.root,x.row.assetPath)),x.before);
});
