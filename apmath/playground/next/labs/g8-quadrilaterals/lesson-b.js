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
      qdBFirstReady: false, qdBSecondReady: false, qdBFeet: false, qdBBaseReady: false, ...(options.set || {}), ...(first.set || {}) };
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
  const squareCases = [
    { label: '직각·이웃변', answer: '∠A=90°이고 AB=BC', rect: '한 내각이 90°이면 평행사변형의 네 각이 직각이에요.', rhomb: 'AB=BC이면 대변도 같아서 네 변이 모두 같아요.' },
    { label: '같고 수직', answer: 'AC=BD이고 AC⊥BD', rect: '대각선 AC=BD이면 평행사변형은 직사각형이에요.', rhomb: '대각선 AC⊥BD이면 평행사변형은 마름모예요.' },
    { label: '같고 이웃변', answer: 'AC=BD이고 AB=BC', rect: '대각선 AC=BD는 직사각형이 되는 조건이에요.', rhomb: '이웃한 변 AB=BC는 마름모가 되는 조건이에요.' },
    { label: '같은각·수직', answer: '∠A=∠B이고 AC⊥BD', rect: '같은 이웃각의 합은 180°라서 각 90°가 돼요.', rhomb: '대각선이 수직이면 마름모 성질도 얻어요.' },
    { label: '직각·수직', answer: '∠A=90°이고 AC⊥BD', rect: '한 내각이 90°이면 네 각이 직각인 직사각형이에요.', rhomb: '대각선이 수직이면 네 변이 같은 마름모이기도 해요.' }
  ];
  function squareConcept() {
    return make('두 성질을 함께 가진 사각형', '두 성질 합', '정사각형', [
      ch('서로 다른 두 조건', [{ at: 0, say: '네 각이 직각인 조건과 네 변이 같은 조건을 구분해요.', to: { qcSb: 76, qdBT: 1 }, dur: 4 }, { at: 6, say: '처음에는 평행사변형의 모양과 두 대각선을 보아요.' }]),
      ch('먼저 네 각을 직각으로', [{ at: 0, say: '직사각형 조건을 켜면 네 각이 모두 90°예요.', set: { qcR: true } }, { at: 6, say: '이 상태만으로 이웃한 변의 길이까지 같지는 않아요.' }]),
      ch('네 변도 같게 만들기', [{ at: 0, say: '마름모 조건을 함께 켜서 네 변도 같게 해요.', set: { qcM: true } }, { at: 6, say: '네 각이 직각이고 네 변이 같은 도형은 정사각형이에요.', set: { qdShowAnswer: true } }])
    ], { problem: false, mode: 'square' });
  }
  function squareCondition(index) {
    const item = squareCases[index];
    return make('평행사변형을 정사각형으로', item.label, `③ ${item.answer}`, [
      ch('주어진 도형과 목표', [{ at: 0, say: '평행사변형을 정사각형으로 만드는 추가 조건을 찾아요.' }, { at: 6, say: '네 각이 직각인 성질과 네 변이 같은 성질이 모두 필요해요.' }]),
      ch('대각선 조건 한 가지만 있는 보기', [{ at: 0, say: '① AC=BD는 직사각형 조건 하나만 줘요.' }, { at: 6, say: '② AC⊥BD는 마름모 조건 하나만 줘요.' }]),
      ch('변이나 각 조건 한 가지만 있는 보기', [{ at: 0, say: '④ AB=BC는 마름모가 되는 조건이에요.' }, { at: 6, say: '⑤ ∠A=90°는 직사각형이 되는 조건이에요.' }]),
      ch('두 성질을 모두 주는 조건', [{ at: 0, say: item.rect, set: { qdShowAnswer: true } }, { at: 4, say: item.rhomb }, { at: 8, say: '두 성질을 함께 가진 ③이 정사각형을 보장해요.' }])
    ], { key: { ...squareKey, c: index }, mode: 'square-condition' });
  }
  function rectangleToSquare(perp) {
    return make('직사각형에 더할 정사각형 조건', perp ? '수직 추가' : '이웃변 추가', perp ? '③ AC⊥BD' : '③ AB=BC', [
      ch('이미 가진 성질 구분', [{ at: 0, say: '주어진 도형은 직사각형이고 정사각형 조건을 찾아요.' }, { at: 6, say: '네 각이 직각인 것은 이미 알므로 같은 네 변을 확인해요.' }]),
      ch('새 조건이 아닌 보기', [{ at: 0, say: '① AC=BD는 모든 직사각형이 이미 가지는 성질이에요.' }, { at: 6, say: '② ∠A=90°도 직사각형의 원래 성질이에요.' }]),
      ch('평행사변형의 기본 성질 보기', [{ at: 0, say: '④ OA=OC는 대각선을 이등분하는 원래 성질이에요.' }, { at: 6, say: '⑤ AB∥DC도 이미 주어진 직사각형의 성질이에요.' }]),
      ch('빠진 마름모 성질 추가', [{ at: 0, say: perp ? 'AC⊥BD를 더하면 마름모가 되어 네 변이 같아져요.' : 'AB=BC를 더하면 대변도 같아서 네 변이 모두 같아져요.', set: { qdShowAnswer: true } }, { at: 6, say: '네 각이 직각이고 네 변도 같아지는 ③이 정답이에요.' }])
    ], { start: { qcK: 1 }, key: { ...squareKey, rc: perp ? 1 : 0 }, mode: 'rectangle-square' });
  }
  lessons['q3-3'] = [squareConcept(), ...squareCases.map((_, i) => squareCondition(i)), rectangleToSquare(false), rectangleToSquare(true)];
  const diagonalKey = { a: 0, b: [0, 1, 3, 4], c: 0, d: [0, 1, 3, 4] };
  function diagonalBase(counterexample) {
    return make('대각선의 이등분 조건', counterexample ? '이등분 없음' : '이등분 기준', counterexample ? '같고 수직이어도 이등분이 없으면 정사각형이 아니에요' : '서로 이등분하면 평행사변형이에요', [
      ch('교점과 반쪽 길이', [{ at: 0, say: counterexample ? '두 대각선은 길이가 같고 수직이지만 반쪽 길이는 달라요.' : 'O는 대각선의 교점이고 OA=OC, OB=OD예요.' }, { at: 6, say: '전체 길이가 같은 것과 서로 이등분하는 것은 달라요.' }]),
      ch('반쪽 선분과 두 삼각형', [{ at: 0, say: counterexample ? '이 그림은 OA=OB=3, OC=OD=5인 반례예요.' : '△AOB와 △COD는 두 변과 맞꼭지각으로 SAS 합동이에요.' }, { at: 6, say: counterexample ? '대각선 전체는 각각 8이지만 3과 5로 나뉘어요.' : '대응하는 엇각이 같아 한 쌍의 대변이 평행해져요.' }]),
      ch('이등분 조건의 역할', [{ at: 0, say: counterexample ? '평행사변형이라면 두 대각선이 서로 이등분해야 해요.' : '다른 두 삼각형도 같은 방법으로 비교하면 나머지 대변도 평행해요.' }, { at: 6, say: counterexample ? '따라서 같고 수직이라는 두 조건만으로 정사각형은 아니에요.' : '두 쌍의 대변이 각각 평행하므로 평행사변형이에요.', set: { qdShowAnswer: true } }])
    ], { problem: false, mode: counterexample ? 'no-bisect' : 'bisect', key: diagonalKey,
      set: { qcI: !counterexample, qcL: counterexample, qcV: counterexample } });
  }
  const rectConditions = [
    { label: '대각선 같음', answer: 'AC=BD', proof: 'AB=DC, BC 공통, AC=BD로 두 삼각형이 SSS 합동이에요.', end: '같은 이웃각의 합이 180°라서 각 90°인 직사각형이에요.' },
    { label: '한 각 직각', answer: '∠A=90°', proof: '한 내각이 90°이면 이웃한 각도 180°−90°예요.', end: '마주 보는 각도 같아서 네 각이 직각인 직사각형이에요.' },
    { label: '이웃각 같음', answer: '∠A=∠B', proof: '같은 이웃각의 합이 180°이므로 두 각은 각각 90°예요.', end: '마주 보는 각도 같아 네 각이 직각인 직사각형이에요.' }
  ];
  const rhombConditions = [
    { label: 'AB=BC', answer: 'AB=BC', proof: 'AB=BC를 평행사변형의 같은 대변과 연결해요.', end: 'AB=BC=CD=DA가 되어 네 변이 같은 마름모예요.' },
    { label: '대각선 수직', answer: 'AC⊥BD', proof: 'AO=CO, BO 공통, 끼인각이 직각이라 SAS 합동이에요.', end: '대응변 AB=BC를 얻어 네 변이 같은 마름모예요.' },
    { label: 'AB=AD', answer: 'AB=AD', proof: 'AB=AD도 같은 꼭짓점 A에서 만나는 이웃한 두 변이에요.', end: '같은 대변과 연결하면 네 변이 같은 마름모예요.' }
  ];
  function diagonalCondition(rhomb, index) {
    const item = (rhomb ? rhombConditions : rectConditions)[index];
    return make(rhomb ? '마름모를 보장하는 추가 조건' : '직사각형을 보장하는 추가 조건', item.label, `③ ${item.answer}`, [
      ch('기본 조건과 새 조건', [{ at: 0, say: rhomb ? '평행사변형이 마름모가 되기 위한 추가 조건을 찾아요.' : '평행사변형이 직사각형이 되기 위한 추가 조건을 찾아요.' }, { at: 6, say: '대변의 평행과 대각선의 이등분은 이미 가진 성질이에요.' }]),
      ch('다른 종류의 조건 보기', [{ at: 0, say: rhomb ? '① AC=BD는 직사각형을 보장하지만 마름모는 아니에요.' : '① AC⊥BD는 마름모를 보장하지만 직사각형은 아니에요.' }, { at: 6, say: rhomb ? '② ∠A=90°도 네 변이 같다는 조건은 아니에요.' : '② AB=BC도 네 각이 직각이라는 조건은 아니에요.' }]),
      ch('원래 성질만 적힌 보기', [{ at: 0, say: '④ ∠A=∠C는 모든 평행사변형이 가지는 성질이에요.' }, { at: 6, say: rhomb ? '⑤ OB=OD도 대각선의 원래 이등분 성질이에요.' : '⑤ OA=OC도 대각선의 원래 이등분 성질이에요.' }]),
      ch('추가 조건으로 목표 확인', [{ at: 0, say: item.proof, set: { qdShowAnswer: true } }, { at: 4, say: item.end }, { at: 8, say: '따라서 목표 사각형을 보장하는 조건은 ③이에요.' }])
    ], { start: { qcK: rhomb ? 1 : 0 }, key: { ...diagonalKey, a: rhomb ? 0 : index, c: rhomb ? index : 0 }, mode: 'diagonal-condition' });
  }
  lessons['q3-4'] = [diagonalBase(false), diagonalBase(true), ...rectConditions.map((_, i) => diagonalCondition(false, i)), ...rhombConditions.map((_, i) => diagonalCondition(true, i))];
  const inclusionKey = { t: [0, 1, 2, 3], f: [0, 1, 2, 3], a: 0, b: 0 };
  const membership = [
    { shape: 'gen', label: '사각형', given: '네 선분으로 둘러싸인 일반 사각형을 보아요.', reason: '특별한 평행·직각·같은 변 조건은 주어지지 않았어요.', chain: '네 변이라는 정의만으로 특별한 사각형은 보장하지 못해요.', answer: '주어진 조건만으로는 사각형이라고만 할 수 있어요.' },
    { shape: 'trap', label: '사다리꼴', given: '그림의 윗변과 아랫변이 평행한 사다리꼴을 보아요.', reason: '이 실험실에서 사다리꼴은 한 쌍 이상의 대변이 평행해요.', chain: '평행한 한 쌍을 알아도 나머지 대변이 평행한지는 몰라요.', answer: '사다리꼴은 사각형에 포함돼요.' },
    { shape: 'para', label: '평행사변형', given: '두 쌍의 대변이 각각 평행한 평행사변형을 보아요.', reason: '두 쌍이 평행하면 적어도 한 쌍도 평행해요.', chain: '따라서 사다리꼴의 조건과 사각형의 조건을 함께 만족해요.', answer: '평행사변형은 사다리꼴과 사각형에 포함돼요.' },
    { shape: 'rect', label: '직사각형', given: '네 내각이 모두 직각인 직사각형을 보아요.', reason: '같은 직선에 수직인 두 직선은 평행해요.', chain: '두 쌍의 대변이 각각 평행해 평행사변형의 조건도 만족해요.', answer: '직사각형은 평행사변형·사다리꼴·사각형에 포함돼요.' },
    { shape: 'rhomb', label: '마름모', given: '네 변의 길이가 모두 같은 마름모를 보아요.', reason: '두 쌍의 대변 길이도 각각 같아 평행사변형이 돼요.', chain: '평행사변형이므로 두 쌍의 대변이 평행해요.', answer: '마름모는 평행사변형·사다리꼴·사각형에 포함돼요.' },
    { shape: 'sq', label: '정사각형', given: '네 각이 직각이고 네 변이 같은 정사각형을 보아요.', reason: '직각 조건은 직사각형, 같은 네 변 조건은 마름모의 정의예요.', chain: '두 종류에 모두 속하므로 그 바깥의 평행사변형에도 속해요.', answer: '정사각형은 직사각형과 마름모에 모두 포함돼요.' }
  ];
  function membershipConcept(item) {
    return make('선택한 사각형의 포함 관계', item.label, item.answer, [
      ch('주어진 도형의 정의', [{ at: 0, say: item.given }, { at: 6, say: '포함된다는 말은 바깥 도형의 조건도 모두 만족한다는 뜻이에요.' }]),
      ch('더 넓은 종류의 조건', [{ at: 0, say: item.reason }, { at: 6, say: item.chain }]),
      ch('포함되는 영역 확인', [{ at: 0, say: item.answer, set: { qdShowAnswer: true } }, { at: 6, say: '포함 관계를 거꾸로 읽으면 항상 맞는 것은 아니에요.' }])
    ], { problem: false, shape: item.shape, key: inclusionKey, mode: 'inclusion' });
  }
  function inclusionProblem(wantTrue) {
    return make('사각형 포함 관계의 보기 판별', wantTrue ? '옳은 보기' : '틀린 보기', wantTrue ? '③ 정사각형은 직사각형이다.' : '③ 직사각형은 마름모이다.가 옳지 않아요', [
      ch('포함 방향의 뜻', [{ at: 0, say: wantTrue ? '이번에는 다섯 문장 중 항상 옳은 것을 찾아요.' : '이번에는 다섯 문장 중 항상 옳지는 않은 것을 찾아요.' }, { at: 6, say: '한 종류의 모든 도형이 다른 종류의 조건을 만족해야 해요.' }]),
      ch('첫 두 문장을 도형으로 확인', [{ at: 0, say: wantTrue ? '① 직사각형은 이웃한 변이 달라도 되어 마름모는 아니에요.' : '① 정사각형은 네 각이 직각이므로 직사각형이에요.', set: { qdBShape: wantTrue ? 'rect' : 'sq' } }, { at: 6, say: wantTrue ? '② 마름모는 직각이 아니어도 되어 직사각형은 아니에요.' : '② 정사각형은 네 변이 같으므로 마름모이기도 해요.', set: { qdBShape: wantTrue ? 'rhomb' : 'sq' } }]),
      ch('나머지 종류의 포함 방향', [{ at: 0, say: wantTrue ? '④ 기울어진 평행사변형은 직사각형의 반례예요.' : '④ 직사각형은 두 쌍의 대변이 평행해 평행사변형이에요.', set: { qdBShape: wantTrue ? 'para' : 'rect' } }, { at: 6, say: wantTrue ? '⑤ 한 쌍만 평행한 사다리꼴은 평행사변형이 아니에요.' : '⑤ 마름모도 두 쌍의 대변이 평행해 평행사변형이에요.', set: { qdBShape: wantTrue ? 'trap' : 'rhomb' } }]),
      ch('요청한 참·거짓에 답하기', [{ at: 0, say: wantTrue ? '정사각형은 네 각이 직각이라 항상 직사각형이에요.' : '이웃한 변이 다른 직사각형은 마름모가 아닌 반례예요.', set: { qdShowAnswer: true, qdBShape: wantTrue ? 'sq' : 'rect' } }, { at: 6, say: wantTrue ? '따라서 옳은 포함 관계는 ③이에요.' : '따라서 옳지 않은 포함 관계는 ③이에요.' }])
    ], { start: { qcK: wantTrue ? 1 : 0 }, key: inclusionKey, shape: wantTrue ? 'sq' : 'rect', mode: 'inclusion-choices' });
  }
  lessons['q3-5'] = [...membership.map(membershipConcept), inclusionProblem(false), inclusionProblem(true)];
  function isoscelesTrapezoidConcept(diagonal) {
    return make('등변사다리꼴의 같은 길이', diagonal ? '대각선 성질' : '두 다리', diagonal ? 'AC=BD' : 'AB=DC', [
      ch('평행한 변과 같은 밑각', [{ at: 0, say: 'AD∥BC이고 아랫변 양 끝각 ∠B=∠C=55°예요.' }, { at: 6, say: diagonal ? '두 대각선 AC와 BD를 잇고 두 삼각형을 비교해요.' : 'A, D에서 BC에 수선을 내려 발을 H, I라 해요.', set: { qdBFeet: true } }]),
      ch(diagonal ? '두 변과 끼인각' : '같은 높이의 직각삼각형', [{ at: 0, say: diagonal ? '두 다리 AB=DC이고, BC는 두 삼각형에 공통이에요.' : '평행한 두 직선 사이의 높이 AH=DI는 같아요.', set: { qdBFirstReady: true } }, { at: 6, say: diagonal ? '두 변 사이의 밑각 ∠ABC=∠DCB도 같아요.' : '두 직각삼각형의 나머지 예각도 90°−55°로 같아요.' }]),
      ch('합동인 대응변의 길이', [{ at: 0, say: diagonal ? '△ABC≡△DCB는 두 변과 끼인각에 의한 SAS 합동이에요.' : '같은 높이와 그 양 끝각으로 △ABH≡△DCI, ASA 합동이에요.' }, { at: 6, say: diagonal ? '따라서 대응변 AC=DB, 두 대각선의 길이가 같아요.' : '따라서 대응하는 빗변 AB=DC, 두 다리의 길이가 같아요.', set: { qdShowAnswer: true } }])
    ], { problem: false, mode: diagonal ? 'iso-diagonal' : 'iso-legs' });
  }
  function isoscelesTrapezoidProblem(kind) {
    return make('등변사다리꼴의 실제 값 계산', ['윗각 ∠A', '아랫각 ∠C', 'BD 길이'][kind], ['∠A=125°', '∠C=55°', 'BD=13'][kind], [
      ch('주어진 값과 구할 대상', [{ at: 0, say: ['∠B=55°에서 윗각 ∠A를 구해요.', '∠A=125°에서 아랫각 ∠C를 구해요.', '대각선 AC=13에서 다른 대각선 BD를 구해요.'][kind] }, { at: 6, say: 'AD∥BC이고 아랫변 양 끝각이 같은 등변사다리꼴이에요.', step: 1 }]),
      ch('평행선과 합동의 성질', [{ at: 0, say: kind === 2 ? 'AB=DC, BC 공통, ∠B=∠C로 두 삼각형은 SAS 합동이에요.' : '평행선 AD, BC에서 이웃한 두 내각의 합은 180°예요.', step: 2 }, { at: 6, say: ['∠A는 180°−55°로 구할 수 있어요.', '∠B=180°−125°=55°이고 ∠C=∠B예요.', '△ABC와 △DCB의 대응하는 대각선 AC, BD는 같아요.'][kind], step: 3, set: { qdCalculationReady: true } }]),
      ch('물어본 각이나 길이', [{ at: 0, say: ['따라서 윗각 ∠A=125°가 정답이에요.', '따라서 아랫각 ∠C=55°가 정답이에요.', '따라서 BD=AC=13이 정답이에요.'][kind], step: 4, set: { qdShowAnswer: true } }, { at: 6, say: kind === 2 ? '대각선의 절반을 구하는 문제가 아니에요.' : '같은 밑변 양 끝각과 같은 다리 양 끝각을 구별해요.', step: 5 }])
    ], { start: { qdK: kind } });
  }
  lessons['q4-1'] = [isoscelesTrapezoidConcept(false), isoscelesTrapezoidConcept(true), isoscelesTrapezoidProblem(0), isoscelesTrapezoidProblem(1), isoscelesTrapezoidProblem(2)];
  function trapezoidAux(method, kind, concept = false) {
    const perp = method === 'perp', known = kind === 1 ? 'BC=12, AB=6' : 'AD=6, AB=6';
    const chapters = [
      ch('조건과 보조선', [{ at: 0, say: `${known}인 그림에 ${perp ? '수선 AH, DI' : 'DE∥AB'}를 그어요.` }, { at: 4, say: 'AD∥BC이므로 ∠B=180°−120°=60°예요.', set: { qdCalculationReady: true } }, { at: 8, say: '등변사다리꼴이라 아랫변의 다른 각 ∠C도 60°예요.', set: { qdBFeet: true } }]),
      ch(perp ? '30°의 맞은편 길이' : '평행사변형의 같은 대변', [{ at: 0, say: perp ? '△ABH는 직각삼각형이고 ∠BAH=30°예요.' : 'AB∥DE, AD∥BE이므로 ABED는 평행사변형이에요.' }, { at: 6, say: perp ? '30°의 맞은편 BH=AB÷2=3이고 CI도 3이에요.' : kind === 1 ? '따라서 BE=AD=x이고 DE=AB=6이에요.' : '따라서 BE=AD=6이고 DE=AB=6이에요.', set: { qdBFirstReady: true } }]),
      ch(perp ? '가운데 부분의 길이' : '정삼각형의 나머지 변', [{ at: 0, say: perp ? 'AH와 DI는 BC에 수직이고 AD∥HI라서 AHID는 직사각형이에요.' : 'DE∥AB이므로 동위각 ∠DEC도 60°예요.' }, { at: 6, say: perp ? kind === 1 ? '따라서 HI=AD=x이고 BC=BH+HI+IC예요.' : '따라서 HI=AD=6이고 BC=BH+HI+IC예요.' : '△DEC는 정삼각형이므로 EC=DC=6이에요.', set: { qdBSecondReady: true } }])
    ];
    if (kind === 2) chapters.push(ch('둘레에 필요한 아랫변', [{ at: 0, say: perp ? 'BC=BH+HI+IC=3+6+3=12예요.' : 'BC=BE+EC=6+6=12예요.', set: { qdBBaseReady: true } }, { at: 6, say: '둘레에는 AD, BC와 같은 두 다리 AB, DC가 들어가요.' }]));
    chapters.push(ch(concept ? '두 방법의 길이 관계' : kind === 2 ? '네 변을 모두 더하기' : '구할 밑변 계산', [{ at: 0, say: concept ? (perp ? '양쪽 반씩을 합하면 BC=AD+AB예요.' : 'BE=AD, EC=AB이므로 BC=AD+AB예요.') : kind === 0 ? (perp ? 'BC=3+6+3=12가 정답이에요.' : 'BC=6+6=12가 정답이에요.') : kind === 1 ? (perp ? 'AD=HI=12−3−3=6이 정답이에요.' : 'AD=BE=BC−EC=12−6=6이 정답이에요.') : '사각형의 둘레는 6+12+6+6=30이 정답이에요.', set: { qdShowAnswer: true } }, { at: 6, say: concept ? '이 그림에 대입하면 BC=6+6=12예요.' : kind === 2 ? '다리가 두 개라는 점까지 확인했어요.' : '아랫변을 구하면 더하고, 윗변을 구하면 바깥 부분을 빼요.' }]));
    return make(perp ? '수선을 이용한 등변사다리꼴' : '평행선을 이용한 등변사다리꼴', concept ? (perp ? '수선 원리' : '평행선 원리') : (perp ? ['수선 BC', '수선 AD', '수선 둘레'][kind] : ['평행선 BC', '평행선 AD', '평행선 둘레'][kind]),
      concept ? 'BC=AD+AB' : ['BC=12', 'AD=6', '둘레=30'][kind], chapters,
      { problem: !concept, method, mode: concept ? 'aux-concept' : 'aux-problem', start: { qdK: kind } });
  }
  lessons['q4-2'] = [trapezoidAux('par', 0, true), trapezoidAux('perp', 0, true),
    trapezoidAux('par', 0), trapezoidAux('perp', 0), trapezoidAux('par', 1), trapezoidAux('perp', 1), trapezoidAux('par', 2), trapezoidAux('perp', 2)];
})();
