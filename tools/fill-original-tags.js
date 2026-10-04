const fs = require('fs');
const path = require('path');
const { audit, loadExam } = require('./audit-original-tags.js');
const { applyTagPlan } = require('./apply-original-tags-batch.js');

const root = path.resolve(__dirname, '..');

function normalize(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function add(tags, ...items) {
  for (const item of items) {
    const tag = normalize(item);
    if (tag && !tags.includes(tag)) tags.push(tag);
  }
}

function has(text, pattern) {
  return pattern.test(text);
}

function inferQuestionMode(question) {
  const type = normalize(question.questionType);
  if (/서술/.test(type)) return '서술형';
  if (/객관|선택/.test(type)) return '객관식';
  if (Array.isArray(question.choices) && question.choices.length) return '객관식';
  return '서술형';
}

function inferTags(question, file) {
  const tags = [];
  const text = [
    file,
    question.category,
    question.originalCategory,
    question.standardCourse,
    question.standardUnit,
    question.content,
    Array.isArray(question.choices) ? question.choices.join(' ') : '',
    question.answer,
    question.solution,
    question.level,
  ].map(normalize).join(' ');

  add(tags, inferQuestionMode(question));

  if (has(text, /제곱근|근호|루트|sqrt|\\sqrt/)) add(tags, '제곱근', '근호');
  if (has(text, /무리수/)) add(tags, '무리수');
  if (has(text, /유리수/)) add(tags, '유리수');
  if (has(text, /유리화|분모.*실수|켤레/)) add(tags, '분모유리화');
  if (has(text, /정수부분/)) add(tags, '정수부분');
  if (has(text, /소수부분/)) add(tags, '소수부분');
  if (has(text, /절댓값|\\left\||\\right\||\|/)) add(tags, '절댓값');

  if (has(text, /다항식/)) add(tags, '다항식');
  if (has(text, /항등식/)) add(tags, '항등식');
  if (has(text, /나머지정리|나머지/)) add(tags, '나머지정리');
  if (has(text, /인수정리/)) add(tags, '인수정리');
  if (has(text, /인수분해|인수/)) add(tags, '인수분해');
  if (has(text, /곱셈공식/)) add(tags, '곱셈공식');
  if (has(text, /완전제곱/)) add(tags, '완전제곱식');
  if (has(text, /제곱의 차|제곱의차/)) add(tags, '제곱의차');
  if (has(text, /공통인수/)) add(tags, '공통인수');
  if (has(text, /전개/)) add(tags, '전개');
  if (has(text, /계수/)) add(tags, '계수비교');

  if (has(text, /복소수|허수|i\^|i\s/)) add(tags, '복소수');
  if (has(text, /켤레복소수/)) add(tags, '켤레복소수');
  if (has(text, /이차방정식/)) add(tags, '이차방정식');
  if (has(text, /판별식|실근|허근|중근/)) add(tags, '판별식');
  if (has(text, /근과\s*계수|근과계수/)) add(tags, '근과계수');
  if (has(text, /이차함수/)) add(tags, '이차함수');
  if (has(text, /최대|최소|최댓값|최솟값/)) add(tags, '최대최소');

  if (has(text, /지수함수/)) add(tags, '지수함수');
  if (has(text, /로그함수/)) add(tags, '로그함수');
  if (has(text, /상용로그/)) add(tags, '상용로그');
  if (has(text, /로그|log/)) add(tags, '로그');
  if (has(text, /지수|거듭제곱|분수지수|음의지수/)) add(tags, '지수');
  if (has(text, /삼각함수|사인|코사인|탄젠트|sin|cos|tan/)) add(tags, '삼각함수');
  if (has(text, /일반각|라디안|호도법/)) add(tags, '일반각');
  if (has(text, /수열/)) add(tags, '수열');
  if (has(text, /등차/)) add(tags, '등차수열');
  if (has(text, /등비/)) add(tags, '등비수열');
  if (has(text, /시그마|Sigma|\\sum/)) add(tags, '시그마');
  if (has(text, /귀납/)) add(tags, '수학적귀납법');

  if (has(text, /확률/)) add(tags, '확률');
  if (has(text, /경우의 수|경우의수/)) add(tags, '경우의수');
  if (has(text, /순열/)) add(tags, '순열');
  if (has(text, /조합/)) add(tags, '조합');
  if (has(text, /중복순열/)) add(tags, '중복순열');
  if (has(text, /중복조합/)) add(tags, '중복조합');
  if (has(text, /이항정리/)) add(tags, '이항정리');
  if (has(text, /배반/)) add(tags, '배반사건');
  if (has(text, /여사건/)) add(tags, '여사건');
  if (has(text, /조건부/)) add(tags, '조건부확률');

  if (has(text, /순환소수/)) add(tags, '순환소수');
  if (has(text, /유한소수/)) add(tags, '유한소수');
  if (has(text, /부등식/)) add(tags, '부등식');
  if (has(text, /일차부등식/)) add(tags, '일차부등식');
  if (has(text, /연립방정식/)) add(tags, '연립방정식');
  if (has(text, /일차방정식/)) add(tags, '일차방정식');
  if (has(text, /일차함수/)) add(tags, '일차함수');
  if (has(text, /함수/)) add(tags, '함수');

  if (has(text, /도형|삼각형|사각형|직사각형|정사각형|원|부채꼴|입체|직육면체/)) add(tags, '도형');
  if (has(text, /삼각형/)) add(tags, '삼각형');
  if (has(text, /직사각형|정사각형|사각형/)) add(tags, '사각형');
  if (has(text, /원|부채꼴/)) add(tags, '원');
  if (has(text, /넓이|면적/)) add(tags, '넓이');
  if (has(text, /부피/)) add(tags, '부피');
  if (has(text, /겉넓이/)) add(tags, '겉넓이');

  if (has(text, /그래프/)) add(tags, '그래프');
  if (has(text, /표|자료/)) add(tags, '표해석');
  if (has(text, /수직선/)) add(tags, '수직선');
  if (has(text, /좌표|좌표평면/)) add(tags, '좌표');
  if (has(text, /실생활|요금|거리|속력|농도|증가율|연도|등급/)) add(tags, '실생활');

  if (has(text, /자연수|정수/)) add(tags, has(text, /자연수/) ? '자연수조건' : '정수조건');
  if (has(text, /범위|구간|이상|이하|초과|미만/)) add(tags, '범위');
  if (has(text, /개수|몇 개|몇개/)) add(tags, '개수세기');
  if (has(text, /참|거짓|O|X|옳|옳지|바르/)) add(tags, '참거짓');
  if (has(text, /오류|틀린|옳지|아닌/)) add(tags, '오류판별');
  if (has(text, /대입/)) add(tags, '대입');
  if (has(text, /조건|구하|만족|일 때|일때/)) add(tags, '조건해석');
  if (has(text, /식.*세우|식세우|방정식.*세우/)) add(tags, '식세우기');
  if (has(text, /계산|값|간단히|구하/)) add(tags, '계산');
  if (has(text, /개념|정의|성질|분류/)) add(tags, '개념');
  if (has(text, /응용|활용/)) add(tags, '응용');
  if (has(text, /상급|어려|최댓값|최솟값|매개변수/)) add(tags, '상급');

  if (!tags.includes('계산') && !tags.includes('개념')) {
    add(tags, tags.some((tag) => /정의|참거짓|분류|개념/.test(tag)) ? '개념' : '계산');
  }
  if (tags.length < 5) add(tags, '조건해석');
  if (tags.length < 5 && normalize(question.level)) add(tags, `${normalize(question.level)}난도`);
  if (tags.length < 5) add(tags, '기출');
  if (tags.length < 5) add(tags, '문제유형');

  return tags.slice(0, 8);
}

function buildPlans() {
  const rows = audit().rows.filter((row) => row.emptyTags || row.missingTags);
  const plans = [];
  for (const row of rows) {
    const loaded = loadExam(path.join(root, row.file));
    const items = Array.from(loaded.questionBank)
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => question && (!Array.isArray(question.tags) || question.tags.length === 0))
      .map(({ question, index }) => ({ id: question.id, index, addTags: inferTags(question, row.file) }));
    if (items.length) plans.push({ file: row.file, items });
  }
  return plans;
}

if (require.main === module) {
  const shouldApply = process.argv.includes('--apply');
  const planPath = path.join(root, 'reports', 'original-exam-tags-auto-fill-plan.json');
  const plans = buildPlans();
  fs.writeFileSync(planPath, JSON.stringify(plans, null, 2), 'utf8');
  const questionCount = plans.reduce((sum, plan) => sum + plan.items.length, 0);
  console.log(JSON.stringify({ files: plans.length, questions: questionCount, planPath: path.relative(root, planPath).replace(/\\/g, '/') }, null, 2));
  if (shouldApply) {
    plans.forEach(applyTagPlan);
    console.log(`applied ${plans.length} auto-fill plan(s)`);
  }
}

module.exports = { buildPlans, inferTags };
