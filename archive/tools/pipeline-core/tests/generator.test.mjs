import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { bytesSha } from '../canonical.mjs';
import fs from 'node:fs';

export const generatorFacts = JSON.parse(fs.readFileSync(new URL('../examples/visual-facts.json', import.meta.url), 'utf8'));
const python = process.env.APMATH_PYTHON || 'python';
const script = 'import sys,json,xml.etree.ElementTree as ET\nfrom alive.engine.pipeline_generation import render_typed_visual\nf=json.load(sys.stdin)\na,e=render_typed_visual(f)\nb,e2=render_typed_visual(f)\nassert a==b and e==e2\nET.fromstring(a)\nprint(json.dumps({"svg":a,"witness":e},ensure_ascii=False))';
for (const input of generatorFacts) test(`Python deterministic numeric generation: ${input.visualType}`, () => {
  const result = spawnSync(python, ['-X', 'utf8', '-c', script], { input: JSON.stringify(input), encoding: 'utf8', timeout: 45000, maxBuffer: 4_000_000 });
  assert.equal(result.status, 0, result.stderr);
  const { svg, witness } = JSON.parse(result.stdout);
  assert.equal(witness.artifactSha, bytesSha(Buffer.from(svg)));
  assert.equal(witness.numericExecution, 'PYTHON_EXECUTED');
  assert.equal(witness.status, 'BUILD_SIDE_ONLY');
  assert.equal(witness.independentReview, 'NOT_TESTED');
  assert.match(svg, /preserveAspectRatio/); assert.match(svg, /<title/); assert.match(svg, /<desc/);
  if (input.visualType.startsWith('set-')) assert.match(svg, />U<\/text>/);
  if (input.visualType === 'cartesian') assert.equal(witness.computedPrimitives.find(p => p.branch).sampleCount, 513);
});
test('numeric geometry and graph generators reject false model facts', () => {
  for (const input of [structuredClone(generatorFacts.find(f => f.visualType === 'cartesian')), structuredClone(generatorFacts.find(f => f.visualType === 'geometry'))]) {
    if (input.visualType === 'cartesian') input.semantic.branches[0].points[1].y = 2;
    else input.semantic.points[3].y = 3;
    const result = spawnSync(python, ['-X', 'utf8', '-c', script], { input: JSON.stringify(input), encoding: 'utf8', timeout: 45000 });
    assert.notEqual(result.status, 0); assert.match(result.stderr, /FUNCTION_SAMPLE_MISMATCH|GEOMETRY_RELATION_FALSE|BRANCH_NUMERIC_OR_DOMAIN_VERIFICATION_FAIL/);
  }
});
test('candidate boundary refuses production roots and refuses replacing changed candidates', () => {
  const code = 'import sys,tempfile\nfrom pathlib import Path\nfrom alive.engine.pipeline_generation import candidate_root,write_candidate\nroot=Path.cwd()\nsys.argv=["test","--candidate-root",str(root)]\ntry: candidate_root(root,"test")\nexcept ValueError: pass\nelse: raise AssertionError("repository root must not be a candidate root")\nwith tempfile.TemporaryDirectory() as d:\n p=Path(d)\n write_candidate(p,"a.svg","first")\n write_candidate(p,"a.svg","first")\n try: write_candidate(p,"a.svg","changed")\n except ValueError: pass\n else: raise AssertionError("must not overwrite")\nprint("PASS")';
  const result = spawnSync(python, ['-X', 'utf8', '-c', code], { encoding: 'utf8', timeout: 15000 });
  assert.equal(result.status, 0, result.stderr);
});
