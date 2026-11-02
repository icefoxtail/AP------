import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { verifySimilarExam } from '../tools/harness/verify_similar_exam.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), 'similar-harness-'));
after(() => fs.rmSync(TEST_SCRATCH, { recursive: true, force: true }));

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
    
    const tmpJs = path.join(TEST_SCRATCH, 'mutated_score_99.js');
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
    
    const tmpJs = path.join(TEST_SCRATCH, 'mutated_slot_imbalance.js');
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
    
    const tmpJs = path.join(TEST_SCRATCH, 'mutated_raw_choice.js');
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
    
    const tmpJs = path.join(TEST_SCRATCH, 'mutated_todo_token.js');
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
    
    const tmpJs = path.join(TEST_SCRATCH, 'mutated_missing_svg.js');
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
    
    const tmpJs = path.join(TEST_SCRATCH, 'mutated_blob_tampered.js');
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

  test('Strict release authoring rejects legacy capability-only plans without engine provenance', () => {
    const res = verifySimilarExam({
      stem: '19_금당중_1학기_기말_중1_유사',
      strictAuthoring: true,
      phase: 'draft'
    });
    assert.equal(res.ok, false);
    assert.ok(res.errors.some(e => e.includes('no actual engine input')), 'Capability-only plan must fail');
    assert.ok(res.errors.some(e => e.includes('missing engineEvidence')), 'Generated bytes must be bound to engine outputs');
    assert.ok(!res.errors.some(e => e.includes('Review receipt not found')), 'Draft phase must not demand a signed receipt');
  });

  test('Fault Injection: strict production cannot silently approve UNSUPPORTED visual', () => {
    const planPath = path.join(REPO_ROOT, 'archive/exams/similar/middle/m1/1final/19_금당중_1학기_기말_중1_유사_plans/q21-problem.plan.json');
    const before = fs.readFileSync(planPath, 'utf8');
    fs.writeFileSync(planPath, JSON.stringify({status:'UNSUPPORTED',reason:'도형의 관계는 현 렌더러가 지원하지 않음'}), 'utf8');
    try {
      const res = verifySimilarExam({stem:'19_금당중_1학기_기말_중1_유사',strictAuthoring:true,phase:'draft'});
      assert.ok(res.errors.some(e => e.includes('UNSUPPORTED cannot be used')));
    } finally {
      fs.writeFileSync(planPath, before, 'utf8');
    }
  });

  test('Fault Injection: strict source caption and engine asset binding reject legacy placeholder', () => {
    const res = verifySimilarExam({stem:'19_금당중_1학기_기말_중1_유사',strictAuthoring:true,phase:'draft'});
    assert.ok(res.errors.some(e => e.includes('substantive student-facing Korean caption')));
  });

  test('Draft phase can pass legacy static gates without pretending to sign off', () => {
    const res = verifySimilarExam({
      stem: '23_동산중_1학기_중간_중1_유사',
      phase: 'draft'
    });
    assert.equal(res.ok, true, res.errors.join('; '));
    assert.ok(res.warnings.some(e => e.includes('DRAFT_PHASE')));
    assert.ok(res.warnings.some(e => e.includes('LEGACY_STATIC_ONLY')));
  });

  test('Fault Injection: strict sourceQuote must exist exactly in its question or solution', () => {
    const planPath = path.join(REPO_ROOT, 'archive/exams/similar/middle/m1/1final/19_금당중_1학기_기말_중1_유사_plans/q21-problem.plan.json');
    const before = fs.readFileSync(planPath, 'utf8');
    const plan = JSON.parse(before);
    plan.sourceQuote = '1234567890123';
    fs.writeFileSync(planPath, JSON.stringify(plan), 'utf8');
    try {
      const res = verifySimilarExam({stem:'19_금당중_1학기_기말_중1_유사',strictAuthoring:true,phase:'draft'});
      assert.ok(res.errors.some(e => e.includes('sourceQuote must be an exact')));
    } finally {
      fs.writeFileSync(planPath, before, 'utf8');
    }
  });

  test('Fault Injection: nested SVG tspan with raw TeX is blocked', () => {
    const svgPath = path.join(REPO_ROOT, 'archive/assets/images/19_금당중_1학기_기말_중1_유사/q21.svg');
    const before = fs.readFileSync(svgPath, 'utf8');
    fs.writeFileSync(svgPath, before.replace('</svg>', '<text><tspan>\\\\frac{1}{2}</tspan></text></svg>'), 'utf8');
    try {
      const res = verifySimilarExam({stem:'19_금당중_1학기_기말_중1_유사'});
      assert.ok(res.errors.some(e => e.includes('raw unrendered LaTeX')), 'Nested TeX should fail');
    } finally {
      fs.writeFileSync(svgPath, before, 'utf8');
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

// ---------------------------------------------------------------------------
// High school similar exams (h1/h2/h3). Fixtures are copied under a scratch ".../similar/high/..." tree so no
// repository file is modified; engine evidence and assets are still read from the repository.
// ---------------------------------------------------------------------------
const HIGH_DIR = 'archive/exams/similar/high/h2/2final';
const HS = '25_제일고_2학기_기말_고2_확률과통계_유사'; // questionsReview receipt, clean PASS
const HS_MATH2 = '25_제일고_2학기_기말_고2_수학II_유사'; // blindFirstPass.frozenAnswers receipt, PASS_WITH_NOTES
const HS_DEBT = '25_매산여고_2학기_기말_고2_수학II_유사'; // UNSUPPORTED solution figures + VISUAL_DEBT receipt
const HS_STAT = '24_매산여고_2학기_기말_고2_확률과통계_유사'; // stat-chart-figure-v1 plans
const HS_SET = '25_순천여고_2학기_기말_고1_공통수학2_유사'; // set-diagram-figure-v1, h1

function stageHighFixture(stem, name, dirRel = HIGH_DIR) {
  const dir = path.join(TEST_SCRATCH, name, 'similar', 'high', 'h2', '2final');
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(path.join(REPO_ROOT, dirRel))) {
    if (!f.startsWith(stem)) continue;
    fs.cpSync(path.join(REPO_ROOT, dirRel, f), path.join(dir, f), { recursive: true });
  }
  const file = (suffix) => path.join(dir, `${stem}${suffix}`);
  return {
    dir,
    js: file('.js'),
    receipt: file('.review-receipt.json'),
    meta: fs.readdirSync(dir).map((f) => path.join(dir, f)).find((f) => f.includes('.meta-')),
    plan: (n) => path.join(dir, `${stem}_plans`, n),
    run: (opts = {}) => verifySimilarExam({ jsPath: file('.js'), strictAuthoring: true, ...opts })
  };
}
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2), 'utf8');

describe('High school similar exams: grade-aware harness', () => {
  test('stem lookup finds high-school exams and passes the clean release gate', () => {
    const res = verifySimilarExam({ stem: HS, strictAuthoring: true });
    assert.equal(res.ok, true, res.errors.join('; '));
    assert.equal(res.totalQuestions, 23);
  });

  test('PT/TPL are checked against the course packs (수학II -> derivative/integral-calculus), not middle1', () => {
    const res = verifySimilarExam({ stem: HS_MATH2, strictAuthoring: true });
    assert.equal(res.ok, true, res.errors.join('; '));
    assert.ok(!res.errors.some((e) => e.includes('unregistered')));
  });

  test('stat-chart-figure-v1 / set-diagram-figure-v1 plans and their title-less engine SVGs are supported', () => {
    const stat = verifySimilarExam({ stem: HS_STAT, strictAuthoring: true });
    assert.equal(stat.ok, true, stat.errors.join('; '));
    const set = verifySimilarExam({ stem: HS_SET, strictAuthoring: true });
    assert.equal(set.ok, true, set.errors.join('; '));
    assert.ok(set.warnings.some((w) => w.includes('VISUAL_DEBT_ACKNOWLEDGED')), 'debt must stay visible');
  });

  test('PASS_WITH_* receipt statuses are accepted and surfaced as a qualified PASS', () => {
    const res = verifySimilarExam({ stem: HS_DEBT, strictAuthoring: true });
    assert.equal(res.ok, true, res.errors.join('; '));
    assert.ok(res.warnings.some((w) => w.includes('RECEIPT_QUALIFIED_PASS')));
  });

  test('Fault Injection: non-PASS receipt status or non-PASS verdict is blocked', () => {
    const fx = stageHighFixture(HS, 'status');
    const base = readJson(fx.receipt);
    assert.equal(fx.run().ok, true, 'control copy must pass');
    for (const patch of [{ signOffStatus: 'SIGNED_OFF_FAIL' }, { signOffStatus: 'PASS_WITH_FAIL' }, { signOffStatus: 'NEEDS_REVISION' }, { overallVerdict: 'FAIL' }]) {
      writeJson(fx.receipt, { ...base, ...patch });
      const res = fx.run();
      assert.equal(res.ok, false, JSON.stringify(patch));
      assert.ok(res.errors.some((e) => e.includes('not a PASS-family status')), JSON.stringify(patch));
    }
  });

  test('Fault Injection: receipt JS blob hash tamper is blocked', () => {
    const fx = stageHighFixture(HS, 'blob');
    const r = readJson(fx.receipt);
    r.candidateGitBlobSha1 = '0'.repeat(40);
    writeJson(fx.receipt, r);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('Receipt candidateGitBlobSha1 mismatch')));
  });

  test('Fault Injection: changing an exam answer breaks the blob binding and the receipt answer binding', () => {
    const fx = stageHighFixture(HS, 'answer');
    const js = fs.readFileSync(fx.js, 'utf8');
    const m = js.match(/"answer": "([①②③④⑤])"/);
    const swapped = m[1] === '①' ? '②' : '①';
    fs.writeFileSync(fx.js, js.replace(m[0], `"answer": "${swapped}"`), 'utf8');
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('Receipt candidateGitBlobSha1 mismatch')));
    assert.ok(res.errors.some((e) => e.includes('differs from the exam answer')), 'receipt candidateAnswer must be bound to the exam answer');
  });

  test('Fault Injection: receipt derivation that disagrees with the exam answer or says match=false is blocked', () => {
    const fx = stageHighFixture(HS, 'derived');
    const r = readJson(fx.receipt);
    const mcs = r.questionsReview.filter((x) => x.type === '객관식');
    mcs[0].match = false;
    mcs[1].derivedAnswer = mcs[1].derivedAnswer === '①' ? '②' : '①';
    writeJson(fx.receipt, r);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('review receipt match is false')));
    assert.ok(res.errors.some((e) => e.includes('independently derived')));
  });

  test('Fault Injection: frozenAnswers-only receipt cannot carry answers that differ from the exam', () => {
    const fx = stageHighFixture(HS_MATH2, 'frozen');
    assert.equal(fx.run().ok, true, 'control copy must pass');
    const r = readJson(fx.receipt);
    const f = typeof r.blindFirstPass.frozenAnswers === 'string' ? JSON.parse(r.blindFirstPass.frozenAnswers) : r.blindFirstPass.frozenAnswers;
    f['1'] = f['1'] === '①' ? '②' : '①';
    r.blindFirstPass.frozenAnswers = f;
    writeJson(fx.receipt, r);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('receipt frozen answer')));
  });

  test('Fault Injection: receipt with no per-question evidence is blocked', () => {
    const fx = stageHighFixture(HS, 'noevidence');
    const r = readJson(fx.receipt);
    delete r.questionsReview;
    delete r.blindFirstPass;
    writeJson(fx.receipt, r);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('no per-question review evidence')));
  });

  test('Fault Injection: unregistered PT, and a PT from an unrelated course, are blocked', () => {
    const fx = stageHighFixture(HS, 'tax');
    const meta = readJson(fx.meta);
    meta.items[0].after.problemTypeKey = 'PT_FAKE_UNREGISTERED_MATH_KEY';
    meta.items[1].after.problemTypeKey = 'PT_CIRCLE_TANGENT'; // middle-school key owned by no 확률과통계 pack
    writeJson(fx.meta, meta);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('unregistered problemTypeKey (PT_FAKE_UNREGISTERED_MATH_KEY)')));
    assert.ok(res.errors.some((e) => e.includes('PT_CIRCLE_TANGENT') || e.includes('does not belong')), res.errors.join('; '));
  });

  test('Fault Injection: unknown or unverified engine capability is an explicit error, never a silent pass', () => {
    const fx = stageHighFixture(HS_STAT, 'cap');
    const p = fx.plan('q04-problem.plan.json');
    const plan = readJson(p);
    writeJson(p, { ...plan, capability: 'made-up-figure-v1' });
    let res = fx.run();
    assert.ok(res.errors.some((e) => e.includes("missing or invalid 'capability' (made-up-figure-v1)")));
    writeJson(p, { ...plan, capability: 'solid-figure-v1' });
    res = fx.run();
    assert.ok(res.errors.some((e) => e.includes('HARNESS_CAPABILITY_LIMIT')));
    const noChart = { ...plan };
    delete noChart.chart;
    writeJson(p, noChart);
    res = fx.run();
    assert.ok(res.errors.some((e) => e.includes("requires 'chart'")));
  });

  test('Fault Injection: title-less engine stat-chart SVG needs a real plan caption', () => {
    const fx = stageHighFixture(HS_STAT, 'caption');
    const p = fx.plan('q04-problem.plan.json');
    const plan = readJson(p);
    plan.caption = '';
    writeJson(p, plan);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('no <title>/<desc>') && e.includes('caption')));
  });

  test('Fault Injection: UNSUPPORTED solution figure is only accepted under an explicit, blob-bound VISUAL_DEBT sign-off', () => {
    const fx = stageHighFixture(HS_DEBT, 'debt');
    assert.equal(fx.run().ok, true, 'control copy must pass');
    const r = readJson(fx.receipt);
    r.signOffStatus = 'SIGNED_OFF_PASS';
    writeJson(fx.receipt, r);
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('UNSUPPORTED cannot be used as a production-visual PASS')));
    r.signOffStatus = 'SIGNED_OFF_PASS_WITH_VISUAL_DEBT';
    r.candidateGitBlobSha1 = '1'.repeat(40);
    writeJson(fx.receipt, r);
    const res2 = fx.run();
    assert.equal(res2.ok, false);
    assert.ok(res2.errors.some((e) => e.includes('UNSUPPORTED cannot be used')));
  });

  test('Fault Injection: UNSUPPORTED problem figure is never accepted by a VISUAL_DEBT sign-off', () => {
    const fx = stageHighFixture(HS_DEBT, 'debtproblem');
    writeJson(fx.plan('q09-problem.plan.json'), { status: 'UNSUPPORTED', reason: '문제 그림을 엔진이 그리지 못함' });
    const res = fx.run();
    assert.equal(res.ok, false);
    assert.ok(res.errors.some((e) => e.includes('q09-problem.plan.json UNSUPPORTED cannot be used')));
  });

  test('Label symbols: bare math capitals are reported, explicit "점 X" references stay enforced for graph figures', () => {
    const fx = stageHighFixture(HS_SET, 'point', 'archive/exams/similar/high/h1/2final');
    assert.equal(fx.run().ok, true, 'control copy must pass');
    assert.ok(!fx.run().warnings.some((w) => w.includes('VISUAL_SYMBOL_NOT_DECODABLE: Q15')), 'P, Q, O are declared by the plan');
    // Plan no longer declares Q: a bare math capital is a recorded limitation (warning), not a silent pass.
    const p = fx.plan('q15-problem.plan.json');
    writeJson(p, JSON.parse(fs.readFileSync(p, 'utf8').replace(/"Q"/g, '"R"')));
    const bare = fx.run();
    assert.ok(bare.warnings.some((w) => w.includes('VISUAL_SYMBOL_NOT_DECODABLE: Q15') && w.includes('Q')), bare.warnings.join('; '));
    // The stem now names the point explicitly ("점 Q"): that must be backed by a decodable label.
    const js = fs.readFileSync(fx.js, 'utf8');
    assert.ok(js.includes('두 점 $P, Q$에서'));
    fs.writeFileSync(fx.js, js.replace('두 점 $P, Q$에서', '점 Q에서'), 'utf8');
    const explicit = fx.run();
    assert.equal(explicit.ok, false);
    assert.ok(explicit.errors.some((e) => e.includes("Point/symbol 'Q'")), explicit.errors.join('; '));
  });
});
