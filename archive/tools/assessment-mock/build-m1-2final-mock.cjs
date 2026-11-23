'use strict';
// 중1 2학기 기말 모의고사 1~5회 + 시험 범위 맞춤 모의고사(scoped-mock-scopes.json, build-scoped-mock.cjs) 자료 파일 조립기.
// 새 학교·범위는 scoped-mock-scopes.json에 항목을 더하고 이 스크립트를 다시 돌린다(기본 5회는 앞에 그대로 있다).
//   node archive/tools/assessment-mock/build-m1-2final-mock.cjs            -> 자료 파일 쓰기
//   node archive/tools/assessment-mock/build-m1-2final-mock.cjs --check    -> 쓰지 않고 현재 파일과 같은지 검사
//   node archive/tools/assessment-mock/build-m1-2final-mock.cjs --tsv <경로> -> 선정 목록 TSV 출력
// 문항 텍스트·정답·해설·그림 참조는 원본 시험지 JS(window.questionBank)에서 그대로 복사한다.
// 바꾸는 것은 서술형 앞머리의 원 시험지 번호 표기("[서술형3]", "서술형 1." 등) 제거와 _ 로 시작하는 출처 필드 추가뿐이다.
const fs = require('fs');
const path = require('path');
const { ARCHIVE_ROOT, loadExam, parseSource } = require('./load-pool.cjs');

const SELECTION_FILE = path.join(__dirname, 'selection-m1-2final-mock.json');
const OUT_FILE = path.join(ARCHIVE_ROOT, 'assessment', 'assessment-packs-2sem-final-mock.generated.js');
const CATEGORY = '26년 2학기 기말 모의고사';
const SCOPE_LABEL = '다각형, 원과 부채꼴, 입체도형, 히스토그램·도수분포다각형·상대도수';
const SCOPE_UNITS = ['다각형', '원과 부채꼴', '다면체·회전체', '입체도형의 겉넓이와 부피', '히스토그램·도수분포다각형', '상대도수'];
const DOMAIN_SKILL_ORDER = ['P', 'C', 'H', 'S', 'G', 'R'];
const FIXED_GENERATED_AT = '2026-11-19T00:00:00.000Z';

// 서술형 앞머리의 원 시험지 번호 표기. 예: "[서술형3] ", "[서·논술형 1] ", "[서답형 4]<br>[서술형] ", "서술형 1. ", "서·논술형1. ", "서술 4. "
// 꺾쇠 꼴 "<서술형 3>"과 HTML 이스케이프 꼴 "&lt;서술형 3&gt;"(원본 일부)도 지운다.
const SUBJECTIVE_PREFIX = /^(?:\s*(?:\[[^\]]*(?:서술|논술|서답)[^\]]*\]|(?:&lt;|<)[^&<>]*(?:서술|논술|서답)[^&<>]*(?:&gt;|>)|(?:서·논술형|서술형|서답형|서술|논술)\s*\d+\s*[.．])\s*(?:<br\s*\/?>\s*)*)+/;

function stripSubjectivePrefix(content) {
  const text = String(content);
  const m = text.match(SUBJECTIVE_PREFIX);
  if (!m) return { content: text, removed: '' };
  return { content: text.slice(m[0].length), removed: m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
}

// 그림 크기는 덮어쓰지 않는다: 원본 시험지의 imageScale·data-scale을 그대로 쓰고, 없으면 공통 그림 크기 규칙(archive/figure-size.css)을 따른다.
// 이유(사용자 2026-11-20): 모의고사만 단원별 90·100%로 임의 확대하던 것을 해제한다.
const { stripScoreLabels } = require('./clean-stem.cjs');

// 팩 사본에 남기는 원본 칸: 화면·출력·정답·해설에 필요한 칸과 단원·난이도·유형 표시용 칸만(기존 1학기 팩 문항의 칸 목록 기준).
// 메타 증거·영수증·해시·경로 칸(resolver*Sha, difficultyEvidenceSha, rpm*, ...Disposition, primaryMethod 등)과 배점(score)은 복사하지 않는다.
// 이유: 배포되는 이 파일 안에 배포되지 않는 메타 파일 이름이 들어가면 tests/archive-pages-site-reach.test.mjs가 막는다.
const KEEP_FIELDS = [
  'id', 'level', 'category', 'originalCategory', 'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder',
  'subUnitKey', 'subUnit', 'conceptClusterKey', 'questionType', 'layoutTag', 'tags', 'wide',
  'content', 'choices', 'answer', 'solution',
  'image', 'imageAlt', 'imageSize', 'imageScale',
  'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize',
  'problemTypeKey', 'templateKey', 'difficultyBucket',
];

function levelOf(q) { return q.level; }

function buildPacks() {
  const sel = JSON.parse(fs.readFileSync(SELECTION_FILE, 'utf8'));
  const cache = new Map();
  const getExam = (file) => {
    if (!cache.has(file)) cache.set(file, loadExam(file).questions);
    return cache.get(file);
  };
  const rows = [];
  const packs = sel.sets.map((setDef) => {
    const packId = `MOCK_2026_2SEM_FINAL_M1_${String(setDef.set).padStart(2, '0')}`;
    const questions = setDef.items.map((item) => {
      const src = getExam(item.file).find((q) => q.id === item.q);
      if (!src) throw new Error(`원본 문항을 찾지 못함: ${item.file} #${item.q}`);
      const meta = parseSource(item.file);
      const clone = {};
      for (const key of KEEP_FIELDS) if (src[key] !== undefined) clone[key] = JSON.parse(JSON.stringify(src[key]));
      let removed = '';
      if (clone.questionType === '서술형') {
        const r = stripSubjectivePrefix(clone.content);
        clone.content = r.content;
        removed = r.removed;
      }
      const score = stripScoreLabels(clone.content);
      clone.content = score.content;
      if (score.removed.length) clone._sourceScoreLabels = score.removed.join(' ');
      const qKey = `${item.file}_${src.id}`;
      Object.assign(clone, {
        _sourceTitle: path.basename(item.file, '.js'),
        _sourceFile: item.file,
        _sourceQuestionNo: src.id,
        _sourceSchool: meta.school,
        _sourceYear: meta.year % 100,
        _sourceExamType: meta.examType,
        _qKey: qKey,
        _assessmentPackId: packId,
        _assessmentSkill: item.subtype,
        _assessmentTypeKey: `MOCK_${item.domain}`,
        _assessmentDomain: sel.domains[item.domain],
      });
      if (removed) clone._sourceStemLabel = removed;
      rows.push({
        set: setDef.set, n: item.n, file: item.file, srcNo: src.id, domain: sel.domains[item.domain],
        level: levelOf(src), type: src.questionType, subtype: item.subtype,
        stem: String(clone.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40),
      });
      return clone;
    });
    const difficultyMix = {};
    for (const lv of ['하', '중', '상']) {
      const n = questions.filter((q) => q.level === lv).length;
      if (n) difficultyMix[lv] = n;
    }
    const skillMix = {};
    for (const d of DOMAIN_SKILL_ORDER) {
      const label = sel.domains[d];
      const n = setDef.items.filter((it) => it.domain === d).length;
      if (n) skillMix[label] = n;
    }
    const subjective = questions.filter((q) => q.questionType === '서술형').length;
    return {
      id: packId,
      title: `중1 2학기 기말 모의고사 ${setDef.set}회`,
      category: CATEGORY,
      grade: '중1',
      semester: '2',
      examType: 'mock',
      unitKey: 'M1-2FINAL-MOCK',
      unitLabel: '평면도형·입체도형·자료의 정리와 해석',
      courseLabel: '중1 수학 2학기',
      purpose: `중1 2학기 기말고사 대비 모의고사 (객관식 ${questions.length - subjective} + 서술형 ${subjective})`,
      questionCount: questions.length,
      estimatedMinutes: 50,
      hasImage: questions.some((q) => !!q.image || /<img\s/i.test(String(q.content || ''))),
      sourceScope: '중1 2학기 기말·중간 기출 원본(2024·2025년) 중 시험 범위 문항, 한 모의고사 안 같은 유형 중복 없음',
      difficultyMix,
      skillMix,
      scopeUnits: SCOPE_UNITS.slice(),
      scopeLabel: SCOPE_LABEL,
      scopeNote: '기말고사 범위 모의고사',
      questions,
    };
  });
  const summary = {
    packCount: packs.length,
    questionCount: packs.reduce((a, p) => a + p.questions.length, 0),
    subjectiveCount: packs.reduce((a, p) => a + p.questions.filter((q) => q.questionType === '서술형').length, 0),
  };
  return { packs, rows, summary };
}

function renderFile(packs, summary) {
  const data = {
    version: 1,
    generatedAt: FIXED_GENERATED_AT,
    sourceSummary: summary,
    categoryOrder: [CATEGORY],
    packs,
  };
  return `window.APMATH_ASSESSMENT_PACKS_MOCK_2SEM_FINAL = ${JSON.stringify(data, null, 1)};\n`;
}

// 기존 5회(선정 목록) 뒤에 시험 범위 맞춤 모의고사(scoped-mock-scopes.json)를 이어 붙인 전체 팩.
// 기존 5회의 id·문항·순서는 그대로다. 맞춤 모의고사는 같은 자료 파일·같은 전역에 들어간다(mixed_engine.html이 이 파일 한 곳만 읽는다).
function buildAllPacks() {
  const base = buildPacks();
  const scoped = require('./build-scoped-mock.cjs').buildScopedPacks({ KEEP_FIELDS, stripSubjectivePrefix, CATEGORY });
  const packs = base.packs.concat(scoped.packs);
  const summary = {
    packCount: packs.length,
    questionCount: packs.reduce((a, p) => a + p.questions.length, 0),
    subjectiveCount: packs.reduce((a, p) => a + p.questions.filter((q) => q.questionType === '서술형').length, 0),
  };
  return { packs, rows: base.rows, summary, basePackCount: base.packs.length, scoped };
}

function main() {
  const args = process.argv.slice(2);
  const { packs, rows, summary } = buildAllPacks();
  const text = renderFile(packs, summary);
  const tsvIdx = args.indexOf('--tsv');
  if (tsvIdx >= 0) {
    const header = ['회차', '번호', '출처 파일', '원 문항 번호', '단원', 'level', '유형', '세부 유형', '발문 앞 40자'];
    const lines = [header.join('\t')].concat(rows.map((r) => [r.set, r.n, r.file, r.srcNo, r.domain, r.level, r.type, r.subtype, r.stem].join('\t')));
    fs.writeFileSync(args[tsvIdx + 1], lines.join('\n') + '\n');
    console.log('TSV 저장:', args[tsvIdx + 1]);
  }
  if (args.includes('--check')) {
    const current = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, 'utf8') : '';
    if (current !== text) { console.error('자료 파일이 선정 목록·원본과 다릅니다. 다시 조립하세요.'); process.exit(1); }
    console.log('자료 파일이 선정 목록·원본과 같습니다.');
    return;
  }
  if (!args.includes('--no-write')) {
    fs.writeFileSync(OUT_FILE, text);
    console.log('자료 파일 저장:', OUT_FILE, `(${Buffer.byteLength(text)} bytes)`, summary);
  }
}

if (require.main === module) main();
module.exports = { buildPacks, buildAllPacks, renderFile, stripSubjectivePrefix, KEEP_FIELDS, SELECTION_FILE, OUT_FILE, CATEGORY };
