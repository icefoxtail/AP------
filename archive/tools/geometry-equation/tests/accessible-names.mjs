// A composed figure carries a Korean <title>/<desc> bound by aria-labelledby that the student SVG language contract accepts (archive/tools/svg-language-contract.cjs).
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {validateSvgStudentLanguage}=createRequire(import.meta.url)('../../svg-language-contract.cjs');
export function assertAccessibleNames(svg){
  const result=validateSvgStudentLanguage(svg,{assetRef:'<composed-figure>'});
  assert.deepEqual(result.errors,[],'student SVG language contract');
  assert.equal((svg.match(/<title\b/g)||[]).length,1);
  assert.equal((svg.match(/<desc\b/g)||[]).length,1);
  assert.match(svg.match(/<svg\b[^>]*>/)[0],/ aria-labelledby="visual-title visual-desc"/);
}
