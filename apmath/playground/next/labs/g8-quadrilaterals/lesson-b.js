/* 직사각형·마름모·정사각형과 사다리꼴: 원본문항, 보기, 풀이 그림의 고정 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g8-quadrilaterals'] = window.APL_LESSONS['g8-quadrilaterals'] || {};
  const ch = (title, cues, length = 12) => ({ title, length, cues });
  const squareKey = { c: 0, w: [0, 1, 2, 3], rc: 0, rw: [0, 1, 2, 3] };
  function make(title, label, answer, chapters, options = {}) {
    chapters[0].start = { qdBT: 0, qcW: 8, qcS: 4, qcB: 66, qcTh0: 30, qcAc: 12, qcK: 0,
      qcRw: 6, qcRs: 4, qcSs: 4, qcDw: 3, qcSb: 66, qcP: 4, qcTh: 70, qcZs: 4,
      qcAl: 66, qcTh1: 30, qdTa: 5, qdTb: 10, qdTt: 55, qdUa: 6, qdUl: 6, qdK: 0,
      ...(options.start || {}) };
    const first = chapters[0].cues[0];
    first.set = { qdLessonProblem: options.problem !== false, qdShowAnswer: false, qdCalculationReady: false,
      qdSeed: 0, qdOrd: [1, 2, 0, 3, 4], qcPk: options.key || squareKey,
      qcR: false, qcM: false, qcI: true, qcL: false, qcV: false, qcSh: options.shape || 'sq',
      qdBShape: options.shape || 'sq', qdBMode: options.mode || '', qdMd: options.method || 'par',
      qdBFirstReady: false, qdBSecondReady: false, qdBFeet: false, ...(options.set || {}), ...(first.set || {}) };
    if (!first.to) Object.assign(first, { to: { qdBT: 1 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer,
      summary: '주어진 사각형의 성질과 추가 조건을 구분하고 대응 관계로 계산해요',
      task: '직접 해 보기에서 조건을 바꾸어 비교해 보세요', chapters };
  }
  function rectangleConcept(diagonal) {
    return make('평행사변형에서 직사각형으로', diagonal ? '대각선 조건' : '내각 조건', diagonal ? 'AC=BD이면 직사각형이에요' : '한 내각이 90°이면 직사각형이에요', [
      ch('평행사변형의 기본 성질', [{ at: 0, say: 'AB∥DC, AD∥BC인 평행사변형의 모양을 바꿔 보아요.', to: { qcB: 76, qdBT: 1 }, dur: 4 }, { at: 6, say: diagonal ? '대변 AB=DC이고 BC는 두 삼각형에 공통이에요.' : '대각은 같고, 이웃한 두 내각의 합은 180°예요.' }]),
      ch('추가 조건으로 각을 연결', [{ at: 0, say: diagonal ? 'AC=BD를 더하면 △ABC와 △DCB가 SSS 합동이에요.' : '한 각을 직각으로 만들면 이웃한 각도 180°−90°예요.' }, { at: 6, say: diagonal ? '대응각 ∠B=∠C인데 두 각의 합은 180°예요.' : '마주 보는 두 각도 각각 같은 크기를 가져요.' }]),
      ch('네 각이 직각인 순간', [{ at: 0, say: '그림을 직각이 되는 모양으로 맞춰 확인해요.', to: { qcB: 90 }, dur: 4 }, { at: 6, say: diagonal ? 'AC=BD이면 네 각이 모두 90°인 직사각형이에요.' : '한 내각이 90°이면 네 각이 직각인 직사각형이에요.', set: { qdShowAnswer: true } }])
    ], { problem: false, mode: diagonal ? 'rect-diagonal' : 'rect-angle' });
  }
  function rectangleProblem(length) {
    return make('직사각형의 두 대각선', length ? 'OB 길이' : '∠AOB', length ? 'OB=6' : '∠AOB=60°', [
      ch('주어진 값과 구할 대상', [{ at: 0, say: length ? '직사각형에서 AC=12이고, 구할 길이는 OB예요.' : '직사각형에서 ∠OBC=30°이고 ∠AOB를 구해요.' }, { at: 6, say: 'O는 두 대각선이 만나는 점이에요.', step: 1 }]),
      ch('같은 대각선과 이등분', [{ at: 0, say: 'AC=BD이고 두 대각선은 서로 이등분해요.', step: 2 }, { at: 6, say: length ? '따라서 OB는 AC와 같은 BD의 절반이에요.' : 'OB=OC라서 △OBC의 두 밑각은 각각 30°예요.', step: 3, set: { qdCalculationReady: true } }]),
      ch('구할 대상에 성질 적용', [{ at: 0, say: length ? 'OB=12÷2=6이 정답이에요.' : '∠AOB는 외각이므로 30°+30°=60°예요.', set: { qdShowAnswer: true }, step: 4 }, { at: 6, say: length ? '대각선 전체와 반쪽 선분을 구분해요.' : '구할 각은 ∠BOC가 아니라 그 이웃한 외각이에요.', step: 5 }])
    ], { start: { qcK: length ? 1 : 0 } });
  }
  lessons['q3-1'] = [rectangleConcept(false), rectangleConcept(true), rectangleProblem(false), rectangleProblem(true)];
  function rhombusConcept(diagonal) {
    return make('평행사변형에서 마름모로', diagonal ? '수직 조건' : '이웃한 변', diagonal ? 'AC⊥BD이면 마름모예요' : 'AB=BC이면 마름모예요', [
      ch('변과 대각선의 뜻', [{ at: 0, say: 'AB와 BC는 이웃한 변이고, AC와 BD는 대각선이에요.', to: { qcRw: 5, qdBT: 1 }, dur: 4 }, { at: 6, say: '평행사변형이므로 대변은 같고 대각선은 서로 이등분해요.' }]),
      ch('추가 조건으로 같은 변 찾기', [{ at: 0, say: diagonal ? '두 대각선이 수직이면 △ABO와 △CBO를 비교해요.' : 'AB=BC가 되면 AB=DC, BC=AD와 연결해요.' }, { at: 6, say: diagonal ? 'AO=CO, BO는 공통, 끼인각은 직각이라 SAS 합동이에요.' : '대변끼리 같은 성질과 이웃한 변이 같은 조건을 함께 써요.' }]),
      ch('네 변이 같은 순간', [{ at: 0, say: '그림을 네 변이 같은 모양으로 맞춰 확인해요.', to: { qcRw: 4 }, dur: 4 }, { at: 6, say: diagonal ? '대응변 AB=CB가 되어 네 변이 같은 마름모예요.' : '네 변이 모두 같은 마름모가 되고 대각선도 수직이에요.', set: { qdShowAnswer: true } }])
    ], { problem: false, mode: diagonal ? 'rhomb-diagonal' : 'rhomb-side' });
  }
  function rhombusProblem(diagonal) {
    return make('마름모의 각과 대각선', diagonal ? '∠BAO' : '∠ABD', diagonal ? '∠BAO=60°' : '∠ABD=57°', [
      ch('구할 각의 위치', [{ at: 0, say: diagonal ? '마름모에서 ∠ABO=30°이고 ∠BAO를 구해요.' : '마름모에서 ∠A=66°이고 ∠ABD를 구해요.' }, { at: 6, say: diagonal ? 'O는 두 대각선 AC와 BD가 만나는 점이에요.' : 'BD는 ∠B를 둘로 나누는 대각선이에요.', step: 1 }]),
      ch('마름모의 성질로 식 세우기', [{ at: 0, say: diagonal ? '대각선이 수직이므로 ∠AOB=90°예요.' : '이웃한 내각의 합은 180°이므로 ∠B=114°예요.', step: 2, set: { qdCalculationReady: true } }, { at: 6, say: diagonal ? '직각삼각형 ABO의 두 예각의 합은 90°예요.' : '마름모의 대각선 BD는 ∠B를 이등분해요.', step: 3 }]),
      ch('물어본 각 계산', [{ at: 0, say: diagonal ? '∠BAO=90°−30°=60°가 정답이에요.' : '∠ABD=114°÷2=57°가 정답이에요.', set: { qdShowAnswer: true }, step: 4 }, { at: 6, say: diagonal ? '직각은 꼭짓점 A가 아니라 대각선 교점 O에 있어요.' : '주어진 ∠A를 반으로 나누는 문제가 아니에요.', step: 5 }])
    ], { start: { qcK: diagonal ? 1 : 0 } });
  }
  lessons['q3-2'] = [rhombusConcept(false), rhombusConcept(true), rhombusProblem(false), rhombusProblem(true)];
})();
