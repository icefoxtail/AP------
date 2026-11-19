// 유사 시험지 가져오기 테스트 공용 입력: 구글 문서 내보내기 형태의 일체형 마크다운을 만든다.

// 구글 문서가 본문에 하는 이스케이프를 그대로 흉내 낸다 (역슬래시는 \\ , 문장부호 앞에는 \).
export const googleEscape = s => String(s).replace(/[\\`*_{}[\]()#+\-.!$=<>|~]/g, '\\$&');
const fence = body => '```\n' + body + '\n```\n';

export function buildMd({ stem, grade = '중2', curriculum = '2022', questions, sourceDir = 'original/middle/m2/1mid', totalScore }) {
  const total = totalScore ?? questions.reduce((a, q) => a + q.score, 0);
  const exam = { stem, sourceArchiveFile: `${sourceDir}/${stem.replace('_유사', '_기출')}.js`, examFolder: '1mid', grade, curriculum, questionCount: questions.length, totalScore: total, generatedAt: '2026-11-18' };
  let md = fence(JSON.stringify(exam));
  questions.forEach((q, i) => {
    const circ = ['①', '②', '③', '④', '⑤'];
    md += `\n## Q${String(i + 1).padStart(2, '0')}\n\n- 형식: ${q.format}  \n- 배점: ${q.score}\n\n### 발문\n\n${googleEscape(q.content)}\n\n### 선지\n\n`
      + (q.choices ? q.choices.map((c, k) => `${circ[k]} ${googleEscape(c)}`).join(' ') : '없음')
      + `\n\n### 정답\n\n${googleEscape(q.answer)}\n\n### 해설\n\n${googleEscape(q.solution)}\n\n`;
    md += fence(q.planRaw ?? JSON.stringify(q.plan ?? { exempt: true, reason: 'STRICT_VARIANT' }));
    md += '\n' + fence(q.metaRaw ?? JSON.stringify(q.meta ?? {}));
  });
  return md;
}

export const baseMeta = (n, extra = {}) => ({
  sourceQid: String(n), variationType: 'NUMERIC', standardCourse: '중2', courseKey: 'M2', curriculum: '2022',
  standardUnitKey: 'M2-01', subUnitKey: 'M2-01-EXPONENT_LAW', conceptClusterKey: 'EXPONENT_LAW',
  primaryMethod: '지수를 더한다.', decisiveStep: '$a^2 \\times a^3 = a^5$', ptTplCandidate: { problemTypeKey: null, templateKey: null },
  crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE', difficultyBucket: 1, difficultyConfidence: 'high',
  difficultyBoundaryFlag: 'NONE', difficultyReason: '한 단계', level: '하', hold: '', ...extra,
});

export const q1 = {
  format: '객관식', score: 4,
  content: '$\\frac{1}{2} + \\frac{1}{3} \\neq x$ 이고 $\\overline{AB} = 5$ 일 때 $a_1$ 은? [3점]',
  choices: ['$1$', '$2$', '$3$', '$4$', '$5$'], answer: '③',
  solution: '$\\triangle ABC \\times 2 = 6$ 이므로\n$$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$$\n이다. $\\therefore$ ③',
  meta: baseMeta(1),
};
export const q2 = {
  format: '서답형', score: 6, content: '$2x = 12$ 의 해를 구하시오.', choices: null, answer: '$6$', solution: '$x = 6$ 이다.',
  meta: baseMeta(2, { difficultyBucket: 2, level: '중' }),
};

// 하네스 테스트용: 사전 용어(방정식·해·등식의성질)가 실제로 나오는 두 문항
export const hq1 = {
  format: '객관식', score: 4, content: '방정식 $x+3=7$ 의 해는?', choices: ['$2$', '$3$', '$4$', '$5$', '$6$'], answer: '③',
  solution: '등식의 성질로 양변에서 $3$ 을 빼면 $x=4$ 이다. $\\therefore$ ③',
  meta: baseMeta(1, { primaryMethod: '양변에서 3을 뺀다.', rpm: { majorUnit: 'x', midUnit: 'y', l3: 'z', l4: 'w' } }),
};
export const hq2 = {
  format: '서답형', score: 6, content: '방정식 $2x=12$ 의 해를 구하시오.', choices: null, answer: '$6$',
  solution: '등식의 성질로 양변을 $2$ 로 나누면 $x=6$ 이다.',
  meta: baseMeta(2, { difficultyBucket: 2, level: '중' }),
};
