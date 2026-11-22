'use strict';
// 모의고사 팩 문항 사본에만 적용하는 발문 정리: 배점 표기 제거, 그림 크기(imageScale / <img data-scale>) 지정.
// 원본 시험지 JS는 건드리지 않는다.

// 원 시험지 배점 표기: "[3점]", "(5점)", "[4.5점]", "[총 10점]", "[5점, 부분점수 있음]"과 "(과정: 2점, 크기: 2점)" 같은 부분 점수 표.
// 수식($...$)을 가린 글에서 괄호 묶음 하나씩만 보고, 묶음 전체가 배점 표기일 때만 지운다("점 A", "60점 이상" 같은 발문 속 "점"은 건드리지 않는다).
const SCORE_GROUP = /[[(][^[\]()]*\d(?:\.\d+)?\s*점[^[\]()]*[\])]/g;
const SCORE_ONLY = /^[[(]\s*(?:총\s*)?\d+(?:\.\d+)?\s*점\s*(?:,\s*부분\s*점수\s*있음)?\s*[\])]$/;
const MASK = '\u0001';

function stripScoreLabels(content) {
  const text = String(content);
  const masked = text.replace(/\$[^$]*\$/g, (m) => MASK.repeat(m.length));
  let out = '';
  let last = 0;
  const removed = [];
  let m;
  SCORE_GROUP.lastIndex = 0;
  while ((m = SCORE_GROUP.exec(masked))) {
    const isScore = SCORE_ONLY.test(m[0]) || /[:：]/.test(m[0]);
    if (!isScore) continue;
    let start = m.index;
    while (start > last && /[ \t]/.test(text[start - 1])) start -= 1;
    out += text.slice(last, start);
    last = m.index + m[0].length;
    removed.push(text.slice(m.index, last));
  }
  out += text.slice(last);
  out = out.replace(/(?:[ \t]*<br\s*\/?>)+[ \t]*$/i, '').replace(/[ \t]+$/, '');
  return { content: out, removed };
}

// 그림 크기: 문항 필드 imageScale(단 폭 대비 %, 30~100)과 본문 <img data-scale>. 원본에 더 큰 값이 있으면 그 값을 둔다.

module.exports = { stripScoreLabels, SCORE_GROUP };
