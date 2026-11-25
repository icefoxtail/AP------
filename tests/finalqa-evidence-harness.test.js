const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const gate = require('../tools/harness/verify-finalqa-evidence.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finalqa-gate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const examRel = 'archive/exams/similar/high/h2/1mid/26_시험고_대수_유사2.js';
  const stem = examRel.slice(0, -3);
  const planDir = stem + '_plans';
  const examUid = path.basename(stem);
  const questions = [
    { id: 1, questionType: '객관식', content: '사인함수의 최댓값을 구하시오.', choices: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      answer: '③', solution: '최댓값은 3이다. 사인함수의 진폭을 먼저 확인한다.', points: 5, curriculum: '2022', standardCourse: '대수' },
    { id: 2, questionType: '서술형', content: '원 C는 원점 O에서 떨어져 있다. 중심의 위치를 논하시오.',
      answer: '중심은 (0,4)', solution: '완전제곱식으로 정리하면 중심의 좌표는 (0,4)이다.', points: 5,
      curriculum: '2022', standardCourse: '대수' }
  ];
  function write(rel, data) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  }
  function read(rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
  write(examRel, `window.examTitle = ${JSON.stringify(examUid)}; window.questionBank = ${JSON.stringify(questions)};\n`);
  const p1 = planDir + '/q01-solution.plan.json';
  const p2 = planDir + '/q02-problem.plan.json';
  const p3 = planDir + '/q02-solution.plan.json';
  write(p1, {
    capability: 'trigonometric-spike-v1',
    graphPlan: { family: 'trigonometric' },
    sourceQuote: '사인함수의 진폭을 먼저 확인한다.',
    sourceConditions: [{ id: 's1', condition: '진폭이 3이다.', mappedTo: ['graphPlan'] }],
    caption: '최댓값을 설명하는 그래프', accessibilityDescription: '최댓값은 3이다.'
  });
  write(p2, {
    capability: 'construction-spike-v1',
    mathPlan: { nodes: [{ id: 'A', op: 'SOURCE_POINT', factRole: 'DERIVED_INTERMEDIATE' }] },
    displayPoints: ['A'], hiddenPointNames: ['A'], hiddenPointStyle: 'NONE',
    sourceQuote: '원 C는 원점 O에서 떨어져 있다.',
    sourceConditions: [{ id: 's2', condition: '원점과 원의 배치', mappedTo: ['mathPlan'] }],
    caption: '주어진 원과 원점의 관계', accessibilityDescription: '중심 좌표는 표시하지 않는다.'
  });
  write(p3, {
    status: 'UNSUPPORTED', reason: '현재 공식 엔진은 이 조합을 지원하지 않는다.',
    requiredEngineExtension: 'piecewise-coordinate-v1', studentRequirements: ['경계점 표기', '공간 내 위치 관계']
  });
  const ledgerRel = stem + '.svg-followup-ledger.json';
  const axis = (qid, a, necessity, planPath = null, planStatus = necessity === 'EXEMPT' ? 'EXEMPT' : 'VALID_OFFICIAL_PLAN') =>
    ({ qid, axis: a, necessity, reason: '실제 교육적 조건에 따라 이 축을 판정했다.', planPath, planStatus });
  write(ledgerRel, {
    examUid, axes: [
      axis(1, 'problem', 'EXEMPT'),
      axis(1, 'solution', 'BENEFICIAL', p1),
      axis(2, 'problem', 'REQUIRED', p2),
      axis(2, 'solution', 'REQUIRED', p3, 'ENGINE_CAPABILITY_PENDING')
    ]
  });
  // Test-only process stub: tests invocation/failure propagation, not engine mathematics.
  const lintRel = 'archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs';
  write(lintRel, 'process.exit(0);\n');
  function fillEvidence() {
    const evidence = gate.makeTemplate({ root, examRel });
    evidence.reviewer = {
      id: 'independent-reviewer', blindFirstPass: 'CONFIRMED',
      independentEvidence: '별도의 정답 비공개 1차 계산 기록을 확보했다.',
      blindArtifactRef: 'external-evidence:blind-first-pass-01'
    };
    for (const row of evidence.questions) {
      row.blindAnswer = questions.find(q => q.id === row.qid).answer;
      row.blindReasoning = '학생용 발문만 읽고 공식을 적용하여 답을 따로 구했다.';
      for (const key of Object.keys(row.checks)) {
        if (row.checks[key] !== 'NOT_APPLICABLE') row.checks[key] = 'PASS';
      }
      for (const a of ['problem', 'solution']) {
        const current = row.plan[a];
        current.status = row.qid === 2 && a === 'solution' ? 'ENGINE_PENDING' : current.status === 'EXEMPT' ? 'EXEMPT' : 'PASS';
        current.reasoning = '원문의 수학 조건 및 문제와 해설의 축을 따로 확인했다.';
      }
    }
    return evidence;
  }
  const verify = (evidence, lint = true) => gate.verifyEvidence({ root, examRel, evidence, lint });
  return { root, examRel, examUid, planDir, p1, p2, p3, ledgerRel, lintRel, questions, write, read, fillEvidence, verify };
}

function codes(result) { return result.issues.map(x => x.code); }

test('정상 정밀검수: 2N축·원문 결속·블라인드 증거·린트 두 모드, 엔진 미지원은 따로 센다', t => {
  const f = fixture(t);
  const evidence = f.fillEvidence();
  assert.deepEqual(evidence.preflightProblems, []);
  const result = f.verify(evidence);
  assert.equal(result.status, 'QA_EVIDENCE_COMPLETE');
  assert.equal(result.formalQualityCertifiedBySoftware, false);
  assert.equal(result.rendering, 'NOT_RUN_BY_DESIGN');
  assert.deepEqual(result.axes, { expected: 4, checked: 4, exempt: 1, executable: 2, unsupported: 1 });
  assert.deepEqual(result.lint, [{ mode: 'shallow', exitCode: 0 }, { mode: 'full', exitCode: 0 }]);
});

test('별도 검수자용 블라인드 팩은 정답·해설·메타를 노출하지 않는다', t => {
  const f = fixture(t);
  const pack = gate.makeBlindPack({ root: f.root, examRel: f.examRel });
  assert.equal(pack.questions.length, 2);
  for (const q of pack.questions) {
    assert.equal(Object.hasOwn(q, 'answer'), false);
    assert.equal(Object.hasOwn(q, 'solution'), false);
    assert.equal(Object.hasOwn(q, 'standardCourse'), false);
  }
  assert.equal(pack.questions[1].requiredProblemFigure.status, 'PLAN_DESCRIPTION_ONLY');
  assert.equal(pack.questions[1].requiredProblemFigure.accessibilityDescription, '중심 좌표는 표시하지 않는다.');
});

test('공식 린트를 생략한 점검은 완전 통과가 아니라 READY_FOR_OFFICIAL_LINT', t => {
  const f = fixture(t);
  assert.equal(f.verify(f.fillEvidence(), false).status, 'READY_FOR_OFFICIAL_LINT');
});

test('원문에 없는 sourceQuote가 있으면 플랜 린트와 무관하게 실패', t => {
  const f = fixture(t);
  const receipt = f.fillEvidence();
  const plan = f.read(f.p1); plan.sourceQuote = '원문에 존재하지 않는 허위 인용문'; f.write(f.p1, plan);
  assert.ok(codes(f.verify(receipt)).includes('PLAN_SOURCE_QUOTE_MISMATCH'));
});

test('문제용 플랜이 풀이로 구한 SOURCE_POINT를 보이게 하면 실패', t => {
  const f = fixture(t);
  const plan = f.read(f.p2);
  delete plan.hiddenPointNames; delete plan.hiddenPointStyle;
  f.write(f.p2, plan);
  assert.ok(codes(f.verify(f.fillEvidence())).includes('PROBLEM_DERIVED_SOURCE_POINT_VISIBLE'));
});

test('문제용 플랜에서 파생점 좌표를 표시하면 점 표식을 숨겨도 실패', t => {
  const f = fixture(t);
  const plan = f.read(f.p2);
  plan.coordinateLabels = ['A'];
  f.write(f.p2, plan);
  assert.ok(codes(f.verify(f.fillEvidence())).includes('PROBLEM_DERIVED_COORDINATE_REVEALED'));
});

test('UNSUPPORTED를 실행 가능한 계획으로 조용히 통과시키지 않는다', t => {
  const f = fixture(t);
  const plan = f.read(f.p3);
  delete plan.requiredEngineExtension;
  f.write(f.p3, plan);
  assert.ok(codes(f.verify(f.fillEvidence())).includes('UNSUPPORTED_HANDOFF_INCOMPLETE'));
  const receipt = f.fillEvidence();
  receipt.questions[1].plan.solution.status = 'PASS';
  assert.ok(codes(f.verify(receipt)).includes('PLAN_REVIEW_STATUS_MISMATCH'));
});

test('문제·해설 2축의 한 축이 빠지면 실패', t => {
  const f = fixture(t);
  const ledger = f.read(f.ledgerRel);
  ledger.axes.pop();
  f.write(f.ledgerRel, ledger);
  assert.ok(codes(f.verify(f.fillEvidence())).includes('AXIS_COVERAGE_MISSING'));
});

test('문항의 최종 해설이 바뀌면 옛 검수 증거를 재사용할 수 없다', t => {
  const f = fixture(t);
  const receipt = f.fillEvidence();
  f.questions[0].solution = '정답을 별도로 계산하여 최댓값 3을 얻는다.';
  f.write(f.examRel, `window.examTitle = ${JSON.stringify(f.examUid)}; window.questionBank = ${JSON.stringify(f.questions)};\n`);
  assert.ok(codes(f.verify(receipt)).includes('REVIEW_STALE_SOURCE'));
});

test('발문/보기 변경으로 블라인드 팩 지문이 달라져도 옛 검수 증거는 거절한다', t => {
  const f = fixture(t);
  const receipt = f.fillEvidence();
  f.questions[0].content = '사인함수의 최댓값과 최솟값을 구하시오.';
  f.write(f.examRel, `window.examTitle = ${JSON.stringify(f.examUid)}; window.questionBank = ${JSON.stringify(f.questions)};\n`);
  assert.ok(codes(f.verify(receipt)).includes('BLIND_PACK_STALE_OR_MISSING'));
});

test('정답 불일치·검수 체크 미완료·실제 근거 누락은 FAIL', t => {
  const f = fixture(t);
  const receipt = f.fillEvidence();
  receipt.questions[0].blindAnswer = '⑤';
  receipt.questions[0].checks.solution = 'NOT_RUN';
  receipt.questions[0].blindReasoning = '';
  const actual = codes(f.verify(receipt));
  assert.ok(actual.includes('BLIND_ANSWER_DISAGREES'));
  assert.ok(actual.includes('QUESTION_CHECK_INCOMPLETE'));
  assert.ok(actual.includes('BLIND_SOLUTION_EVIDENCE_MISSING'));
});

test('공식 린트가 실패하면 증거가 완전해도 게이트를 통과하지 않는다', t => {
  const f = fixture(t);
  f.write(f.lintRel, 'process.exit(3);\n');
  const result = f.verify(f.fillEvidence());
  assert.equal(result.status, 'EVIDENCE_INCOMPLETE');
  assert.equal(codes(result).filter(code => code === 'OFFICIAL_PLAN_LINT_FAILED').length, 2);
});
