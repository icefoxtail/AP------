import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';
import { verifySimilarExam } from '../tools/harness/verify_similar_exam.mjs';

const REPO_ROOT = path.resolve('c:/Users/USER/Desktop/AP------');

describe('Similar Exam Harness Gate & Fault Injection (Negative Tests)', () => {
  test('Baseline: 23_동산중_1학기_중간_중1_유사 passes all automated gates', () => {
    const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사' });
    assert.equal(res.ok, true, `Expected PASS, got errors: ${res.errors.join('; ')}`);
    assert.equal(res.totalScore, 100.0);
    assert.deepEqual(res.mcDistribution, { '①': 4, '②': 4, '③': 4, '④': 4, '⑤': 4 });
  });

  test('Baseline: 19_금당중_1학기_기말_중1_유사 passes all automated gates', () => {
    const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
    assert.equal(res.ok, true, `Expected PASS, got errors: ${res.errors.join('; ')}`);
    assert.equal(res.totalScore, 100.0);
    assert.deepEqual(res.mcDistribution, { '①': 4, '②': 4, '③': 4, '④': 4, '⑤': 4 });
  });

  test('Fault Injection: Score sum violation (99.0 pts) is blocked', () => {
    const origJs = fs.readFileSync('archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.js', 'utf8');
    const mutatedJs = origJs.replace('"points": 4.0', '"points": 3.0'); // 100.0 -> 99.0
    
    const tmpJs = path.join(REPO_ROOT, 'scratch/mutated_score_99.js');
    fs.writeFileSync(tmpJs, mutatedJs, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사', jsPath: tmpJs });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('Total score invariant violated')), 'Must catch score violation');
    } finally {
      if (fs.existsSync(tmpJs)) fs.unlinkSync(tmpJs);
    }
  });

  test('Fault Injection: Dynamic MCQ count (e.g. 19 or 21 MCQs) slot imbalance is blocked', () => {
    const origJs = fs.readFileSync('archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.js', 'utf8');
    // Change Q1 answer from ③ to ②, making distribution {①:4, ②:5, ③:3, ④:4, ⑤:4}
    const mutatedJs = origJs.replace('"answer": "③"', '"answer": "②"');
    
    const tmpJs = path.join(REPO_ROOT, 'scratch/mutated_slot_imbalance.js');
    fs.writeFileSync(tmpJs, mutatedJs, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사', jsPath: tmpJs });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('MCQ slot balance violated')), 'Must catch slot balance violation');
    } finally {
      if (fs.existsSync(tmpJs)) fs.unlinkSync(tmpJs);
    }
  });

  test('Dynamic Invariant: Any arbitrary MCQ count M must satisfy spread(max - min) <= 1', () => {
    // Test logic directly: 17 MCQs -> {①:4, ②:4, ③:3, ④:3, ⑤:3} is valid (spread=1)
    // 17 MCQs -> {①:5, ②:3, ③:3, ④:3, ⑤:3} is invalid (spread=2)
    const valid17 = [4, 4, 3, 3, 3];
    assert.ok(Math.max(...valid17) - Math.min(...valid17) <= 1, 'Balanced 17 MCQs must have spread <= 1');
    const invalid17 = [5, 3, 3, 3, 3];
    assert.ok(Math.max(...invalid17) - Math.min(...invalid17) > 1, 'Imbalanced 17 MCQs must be detected');
  });

  test('Fault Injection: Unescaped math in choice is blocked', () => {
    const origJs = fs.readFileSync('archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.js', 'utf8');
    // Change "$1$개" to "1개"
    const mutatedJs = origJs.replace('"$1$개"', '"1개"');
    
    const tmpJs = path.join(REPO_ROOT, 'scratch/mutated_raw_choice.js');
    fs.writeFileSync(tmpJs, mutatedJs, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사', jsPath: tmpJs });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('mathematical choice not enclosed in LaTeX math')), 'Must catch raw math choice');
    } finally {
      if (fs.existsSync(tmpJs)) fs.unlinkSync(tmpJs);
    }
  });

  test('Fault Injection: Content placeholder token ([TODO]) is blocked', () => {
    const origJs = fs.readFileSync('archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.js', 'utf8');
    const mutatedJs = origJs.replace('다음 중 소수는 모두 몇 개인가?', '다음 중 소수는 모두 몇 개인가? [TODO: 검토]');
    
    const tmpJs = path.join(REPO_ROOT, 'scratch/mutated_todo_token.js');
    fs.writeFileSync(tmpJs, mutatedJs, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사', jsPath: tmpJs });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('illegal placeholder token')), 'Must catch illegal placeholder');
    } finally {
      if (fs.existsSync(tmpJs)) fs.unlinkSync(tmpJs);
    }
  });

  test('Fault Injection: Missing SVG file reference is blocked', () => {
    const origJs = fs.readFileSync('archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.js', 'utf8');
    const mutatedJs = origJs.replace('assets/images/23_동산중_1학기_중간_중1_유사/q10.svg', 'assets/images/23_동산중_1학기_중간_중1_유사/missing_q10.svg');
    
    const tmpJs = path.join(REPO_ROOT, 'scratch/mutated_missing_svg.js');
    fs.writeFileSync(tmpJs, mutatedJs, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사', jsPath: tmpJs });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('referenced image not found on disk')), 'Must catch missing image');
    } finally {
      if (fs.existsSync(tmpJs)) fs.unlinkSync(tmpJs);
    }
  });

  test('Fault Injection: Candidate JS blob mismatch against review receipt is blocked', () => {
    const origJs = fs.readFileSync('archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.js', 'utf8');
    // Subtle modification changing comments/whitespace
    const mutatedJs = origJs + '\n// modified after review receipt was signed';
    
    const tmpJs = path.join(REPO_ROOT, 'scratch/mutated_blob_tampered.js');
    fs.writeFileSync(tmpJs, mutatedJs, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사', jsPath: tmpJs });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('Receipt candidateGitBlobSha1 mismatch')), 'Must catch tampered blob');
    } finally {
      if (fs.existsSync(tmpJs)) fs.unlinkSync(tmpJs);
    }
  });

  test('Fault Injection: Unregistered problemTypeKey in meta is blocked', () => {
    // Create temporary mutated meta
    const origMetaPath = 'archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.meta-q01-q23.json';
    const origMeta = JSON.parse(fs.readFileSync(origMetaPath, 'utf8'));
    const mutatedMeta = JSON.parse(JSON.stringify(origMeta));
    mutatedMeta.items[0].after.problemTypeKey = 'PT_FAKE_UNREGISTERED_MATH_KEY';
    
    // Temporarily replace meta file
    fs.writeFileSync(origMetaPath, JSON.stringify(mutatedMeta, null, 2), 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('unregistered problemTypeKey (PT_FAKE_UNREGISTERED_MATH_KEY)')), 'Must catch unregistered PT');
    } finally {
      fs.writeFileSync(origMetaPath, JSON.stringify(origMeta, null, 2), 'utf8');
    }
  });

  test('Fault Injection: Receipt fraud with copy-pasted derivation strings is blocked', () => {
    // Create temporary mutated receipt
    const origReceiptPath = 'archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사.review-receipt.json';
    const origReceipt = JSON.parse(fs.readFileSync(origReceiptPath, 'utf8'));
    const mutatedReceipt = JSON.parse(JSON.stringify(origReceipt));
    for (const qr of mutatedReceipt.questionReviews) {
      qr.blindDerivation = 'Copy-pasted identical mock derivation across all questions';
    }
    
    fs.writeFileSync(origReceiptPath, JSON.stringify(mutatedReceipt, null, 2), 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('Receipt fraud detected')), 'Must catch copy-paste receipt fraud');
    } finally {
      fs.writeFileSync(origReceiptPath, JSON.stringify(origReceipt, null, 2), 'utf8');
    }
  });

  test('Fault Injection: Blank/mock SVG (only canvas background rect) is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    const mockSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#ffffff"/></svg>';
    fs.writeFileSync(origSvgPath, mockSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('lacks substantive mathematical diagram content')), 'Must catch mock canvas rect SVG');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: Shaded region stem with un-shaded SVG is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    // Replace non-white fill with white fill
    const unshadedSvg = origSvg.replace(/fill=["']#bbdefb["']/g, 'fill="#ffffff"').replace(/fill=["']#f5f5f5["']/g, 'fill="#ffffff"');
    fs.writeFileSync(origSvgPath, unshadedSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes("Question stem asks about shaded region ('색칠한 부분')")), 'Must catch unshaded SVG');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: Corrupt coordinate attribute (x="NaN") in SVG is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    const corruptSvg = origSvg.replace('x="90"', 'x="NaN"');
    fs.writeFileSync(origSvgPath, corruptSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('SVG contains corrupt coordinate attributes (NaN, undefined, or null)')), 'Must catch NaN coordinate');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: Degenerate geometry (circle r="0") in SVG is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    const degenerateSvg = origSvg.replace('</svg>', '<circle cx="50" cy="50" r="0"/></svg>');
    fs.writeFileSync(origSvgPath, degenerateSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('degenerate circle with radius 0')), 'Must catch degenerate circle');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: Referenced point missing in SVG is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q03.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    // Remove label B from Q03 SVG (stem asks for A + B)
    const missingPointSvg = origSvg.replace('<text x="295" y="117" font-style="italic">B</text>', '');
    fs.writeFileSync(origSvgPath, missingPointSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes("Point/symbol 'B' referenced in question stem is missing from SVG text labels")), 'Must catch missing vertex/point in SVG');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: Plan marked EXEMPT missing reason is blocked', () => {
    const origPlanPath = path.join(REPO_ROOT, 'archive/exams/similar/middle/m1/1mid/23_동산중_1학기_중간_중1_유사_plans/q01-problem.plan.json');
    const origPlan = fs.readFileSync(origPlanPath, 'utf8');
    const invalidPlan = JSON.stringify({ status: 'EXEMPT' }); // missing reason
    fs.writeFileSync(origPlanPath, invalidPlan, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '23_동산중_1학기_중간_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes("must have a substantive 'reason' string per AUTHOR_GUIDE.md")), 'Must catch EXEMPT plan without reason');
    } finally {
      fs.writeFileSync(origPlanPath, origPlan, 'utf8');
    }
  });

  test('Fault Injection: Active visual plan missing valid capability is blocked', () => {
    const origPlanPath = path.join(REPO_ROOT, 'archive/exams/similar/middle/m1/1final/19_금당중_1학기_기말_중1_유사_plans/q21-problem.plan.json');
    const origPlan = fs.readFileSync(origPlanPath, 'utf8');
    const invalidPlan = JSON.stringify({ capability: 'INVALID_UNKNOWN_CAPABILITY', caption: 'test' });
    fs.writeFileSync(origPlanPath, invalidPlan, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes("missing or invalid 'capability'")), 'Must catch invalid capability in plan');
    } finally {
      fs.writeFileSync(origPlanPath, origPlan, 'utf8');
    }
  });

  test('Fault Injection: SVG missing required <title> tag is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    const noTitleSvg = origSvg.replace(/<title\b[^>]*>[\s\S]+?<\/title>/gi, '');
    fs.writeFileSync(origSvgPath, noTitleSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('SVG is missing required educational <title> tag')), 'Must catch missing <title>');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: SVG with raw unrendered LaTeX commands in <text> is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    const rawTexSvg = origSvg.replace('10 cm</text>', '\\frac{10}{2}\\text{ cm}</text>');
    fs.writeFileSync(origSvgPath, rawTexSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('SVG contains raw unrendered LaTeX commands in <text> elements')), 'Must catch raw TeX in SVG');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });

  test('Fault Injection: SVG violating 11px font size floor is blocked', () => {
    const origSvgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const origSvg = fs.readFileSync(origSvgPath, 'utf8');
    const smallFontSvg = origSvg.replace('font-size="14"', 'font-size="9px"');
    fs.writeFileSync(origSvgPath, smallFontSvg, 'utf8');
    try {
      const res = verifySimilarExam({ stem: '19_금당중_1학기_기말_중1_유사' });
      assert.equal(res.ok, false);
      assert.ok(res.errors.some(e => e.includes('SVG violates 11px font size floor')), 'Must catch sub-11px font');
    } finally {
      fs.writeFileSync(origSvgPath, origSvg, 'utf8');
    }
  });
});
