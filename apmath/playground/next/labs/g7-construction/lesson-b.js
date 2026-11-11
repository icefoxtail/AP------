/* 삼각형의 결정·합동 조건: 원본 문제와 대응 관계를 고정한 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-construction'] = window.APL_LESSONS['g7-construction'] || {};
  const ch = (title, cues, length = 10) => ({ title, length, cues });
  function make(title, label, answer, chapters, options = {}) {
    chapters[0].start = {
      cnBT: 0, cnCt: 0, cnBTrace: 0, cnSa: 6, cnSb: 7, cnSc: 8, cnSphi: 70,
      cnMb: 6, cnMc: 7, cnMA: 50, cnMp: 0, cnAA: 55, cnAB: 65, cnAc: 6,
      cnKp: 0, cnLa: 3, cnLb: 4, cnLd: 1, cnLt: 0, cnCx: 2.6, cnCy: 3.6,
      cnEA: 55, cnEB: 65, cnVa: 6, cnVb: 7, cnVc: 8, cnWs1: 6, cnWs2: 7, cnWth: 50, cnUc: 6, cnUa: 50, cnUb: 60,
      ...(options.start || {}), ...(chapters[0].start || {})
    };
    const first = chapters[0].cues[0];
    first.set = {
      cnShowAnswer: false, cnLessonProblem: !!options.problem, cnBMode: options.mode || 'concept', cnBStage: 0,
      cnBChoice: 0, cnBPart: -1, cnBAngle: false, cnBKind: '', cnCond: 'SSS', cnMmode: 'inc', cnKmode: 'aaa',
      cnGv: 0, cnAdd: [], cnTy: 0, cnPk: options.pk || { k: 0 }, ...(options.set || {}), ...(first.set || {})
    };
    if (!first.to) Object.assign(first, { to: options.motion || { cnBT: .5 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer, summary: '주어진 변과 각의 위치를 확인하고 삼각형의 결정·합동 조건을 판단해요', task: '직접 해 보기에서 다른 조건과 비교해 보세요', chapters };
  }
  const choices = {
    sss: [
      [0, '① 세 변이 5, 4, 9 cm인 조건이에요.', '가장 긴 9는 5+4와 같아 일직선이 돼요.', '삼각형이 만들어져야 결정 조건을 따질 수 있어요.'],
      [1, '② CA=4 cm와 ∠C=70°만 주어졌어요.', '한 변과 한 각을 지켜도 다른 변의 길이는 달라져요.', '이 조건만으로 크기와 모양을 하나로 정할 수 없어요.'],
      [2, '③ BC=8 cm, BA=4 cm만 주어졌어요.', '두 변 사이의 각을 바꿔도 주어진 길이는 같아요.', '두 변만으로는 여러 삼각형을 만들 수 있어요.'],
      [4, '⑤ CA=9 cm, AB=7 cm, ∠C=45°예요.', '∠C는 CA와 AB가 만나는 A의 각이 아니에요.', '끼인각이 아니어서 서로 다른 두 후보가 생겨요.'],
      [3, '④ AB=4 cm, BC=6 cm, CA=6 cm예요.', '6<4+6이므로 삼각형을 만들 수 있어요.', '세 변이 정해지는 SSS 조건이므로 정답은 ④예요.']
    ],
    sas: [
      [0, '① CA=4 cm, CB=7 cm만 주어졌어요.', '두 변의 길이를 유지해도 사이의 각은 바뀔 수 있어요.', '두 변만으로는 하나로 정해지지 않아요.'],
      [1, '② CA=4 cm, ∠C=70°만 주어졌어요.', '주어진 각을 유지하면서 다른 변을 늘릴 수 있어요.', '한 변과 한 각만으로는 부족해요.'],
      [3, '④ 세 각이 모두 60°인 조건이에요.', '각을 유지해도 변의 길이가 다른 삼각형이 가능해요.', '세 각만으로는 크기가 정해지지 않아요.'],
      [4, '⑤ AB=5 cm, BC=3 cm, CA=8 cm예요.', '8=5+3이므로 막대가 일직선이 돼요.', '이 길이로는 삼각형이 만들어지지 않아요.'],
      [2, '③ AB=8 cm, AC=6 cm, ∠A=90°예요.', '∠A는 AB와 AC가 만나는 꼭짓점의 끼인각이에요.', '두 변과 끼인각인 SAS 조건, 정답은 ③예요.']
    ],
    asa: [
      [0, '① AB=4 cm, AC=4 cm만 주어졌어요.', '두 변은 같게 두고 사이의 각을 바꿀 수 있어요.', '두 변만으로는 삼각형이 정해지지 않아요.'],
      [1, '② AB=4 cm, BC=5 cm, CA=10 cm예요.', '가장 긴 10은 4+5보다 커서 닿지 않아요.', '삼각형이 만들어지지 않는 조건이에요.'],
      [2, '③ BC=9 cm, CA=6 cm, ∠B=40°예요.', 'BC와 CA 사이의 각은 ∠C라서 ∠B는 끼인각이 아니에요.', '같은 조건으로 서로 다른 두 후보가 생겨요.'],
      [4, '⑤ 세 각이 30°, 60°, 90°예요.', '세 각이 같아도 크기가 다른 삼각형을 만들 수 있어요.', '세 각만으로는 변의 길이를 정하지 못해요.'],
      [3, '④ AB=5 cm, ∠A=80°, ∠B=40°예요.', 'AB의 양 끝 A, B에 있는 두 각이 정해졌어요.', '한 변과 양 끝각인 ASA 조건, 정답은 ④예요.']
    ]
  };
  function choiceLesson(kind, pk) {
    const last = choices[kind].at(-1)[0], answer = `정답은 ${['①', '②', '③', '④', '⑤'][last]}`;
    return make('삼각형이 하나로 정해지는 보기', '보기 판별', answer, choices[kind].map(([index, a, b, c], i) => {
      const chapter = ch(`보기 ${['①', '②', '③', '④', '⑤'][index]} 확인`, [
        { at: 0, say: a, set: { cnBChoice: index, cnBStage: 0 }, to: { cnBT: 1 }, dur: 4 },
        { at: 5, say: b, set: { cnBStage: 1 } },
        { at: 9, say: c, set: i === 4 ? { cnBStage: 2, cnShowAnswer: true } : { cnBStage: 2 } }
      ], 12); chapter.start = { cnBT: 0 }; return chapter;
    }), { problem: true, mode: 'choices', pk });
  }
  function basic(title, label, answer, lines, options = {}) {
    const key = options.motionKey || 'cnBT';
    return make(title, label, answer, [
      ch('기호와 주어진 조건', [{ at: 0, say: lines[0] }, { at: 5, say: lines[1], step: 1 }]),
      ch('조건을 유지하며 비교', [{ at: 0, say: lines[2], to: { [key]: .8 }, dur: 4, set: options.middle || {} }, { at: 5, say: lines[3], set: { cnBStage: 1, ...(options.observe || {}) }, step: 2 }]),
      ch('조건으로 결론 내리기', [{ at: 0, say: lines[4], to: { [key]: 1 }, dur: 4 }, { at: 5, say: lines[5], set: { cnShowAnswer: true, ...(options.final || {}) }, step: 3 }])
    ], { ...options, motion: { [key]: .35 } });
  }
  function congruence(kind) {
    const text = {
      SSS: ['A↔D, B↔E, C↔F 순서로 대응시켜요.', 'AB=DE, BC=EF, CA=FD로 세 변이 각각 같아요.', '세 변이 정해지면 삼각형의 모양과 크기가 정해져요.', '오른쪽 삼각형을 돌려 같은 변을 같은 쪽에 놓아요.', '가로로 옮겨 대응점과 대응변이 모두 겹치는지 봐요.', '세 변이 각각 같으므로 SSS 합동이에요.'],
      SAS: ['A↔D, B↔E, C↔F 순서로 대응시켜요.', 'AB=DE, AC=DF이고 ∠A=∠D인 조건이에요.', '∠A는 AB와 AC 사이, ∠D는 DE와 DF 사이예요.', '두 변뿐 아니라 바로 그 끼인각이 같아야 해요.', '방향을 맞춰 가로로 옮기면 대응하는 부분이 겹쳐요.', '두 변과 끼인각이 각각 같으므로 SAS 합동이에요.'],
      ASA: ['A↔D, B↔E, C↔F 순서로 대응시켜요.', 'AB=DE, ∠A=∠D, ∠B=∠E인 조건이에요.', '주어진 두 각이 같은 변의 양 끝에 있는지 확인해요.', '한 변의 양 끝에서 같은 각으로 뻗으면 꼭짓점도 정해져요.', '방향을 맞춰 가로로 옮기면 대응하는 부분이 겹쳐요.', '한 변과 양 끝각이 각각 같으므로 ASA 합동이에요.']
    };
    return basic(`${kind} 합동 조건 확인`, kind, `${kind}: △ABC ≡ △DEF`, text[kind], { motionKey: 'cnCt', set: { cnCond: kind } });
  }
  function congruenceChoices() {
    const rows = [
      [1, 'SSS', '②는 세 변의 길이가 각각 같은 조건이에요.', 'SSS를 만족하므로 합동이 되는 조건이에요.'],
      [4, 'SAS', '⑤는 두 변과 바로 그 끼인각이 각각 같아요.', '각의 위치까지 맞으므로 SAS 합동 조건이에요.'],
      [3, 'ASA', '④는 한 변과 그 양 끝각이 각각 같아요.', '한 변의 길이까지 같으므로 ASA 합동 조건이에요.'],
      [2, 'ASA', '③은 한 변과 두 각이 각각 같은 조건이에요.', '셋째 각도 같아져 주어진 변의 양 끝각을 알 수 있어요.'],
      [0, 'SAS', '①은 끼인각이 아닌 각이에요. AB=7, AC=5로 봐요.', '∠B=40°를 지켜도 서로 다른 두 삼각형이 가능해요.']
    ];
    return make('합동 조건이 아닌 보기 찾기', '보기 판별', '정답은 ①', rows.map(([index, kind, a, b], i) => {
      const chapter = ch(`보기 ${['①', '②', '③', '④', '⑤'][index]} 확인`, [
        { at: 0, say: a, set: { cnBChoice: index, cnCond: kind, cnBAngle: false }, to: { cnCt: 1, cnBT: 1 }, dur: 4 },
        { at: 5, say: b, set: { cnBAngle: index === 2 } },
        { at: 9, say: i === 4 ? '항상 합동임을 보장하지 못하는 조건은 ①이에요.' : '문제는 합동 조건이 아닌 것을 찾으라고 했어요.', ...(i === 4 ? { set: { cnShowAnswer: true } } : {}) }
      ], 12); chapter.start = { cnCt: 0, cnBT: 0 }; return chapter;
    }), { problem: true });
  }
  function triangleChoices(type) {
    const data = [
      { answer: 'ㅁ', first: '기준 삼각형의 세 변은 6, 7, 8이에요.', strategy: '방향을 보지 말고 세 변의 길이를 한 묶음으로 비교해요.', wrong: [[0, 'ㄱ은 7, 7, 8이라 길이 6인 변이 없어요.'], [1, 'ㄴ은 6, 7, 9라서 길이 9가 기준과 달라요.'], [2, 'ㄷ은 6, 7, 7이라 길이 8인 변이 없어요.'], [3, 'ㄹ은 5, 7, 8이라 길이 5가 기준과 달라요.']], conclusion: 'ㅁ은 6, 7, 8이 각각 같아 SSS 합동이에요.', nums: [6, 7, 8] },
      { answer: 'ㄷ', first: '기준은 두 변 6, 7과 그 끼인각 50°예요.', strategy: '길이뿐 아니라 각이 두 변 사이에 있는지 확인해요.', wrong: [[0, 'ㄱ의 끼인각은 60°라서 기준 50°와 달라요.'], [1, 'ㄴ은 같은 숫자지만 50°가 끼인각이 아니에요.'], [3, 'ㄹ의 두 변은 7, 7이라 길이 6이 없어요.'], [4, 'ㅁ의 두 변은 5, 7이라 길이 6이 없어요.']], conclusion: 'ㄷ은 두 변 6, 7과 끼인각 50°가 같아 SAS 합동이에요.', nums: [6, 7, 50] },
      { answer: 'ㅁ', first: '기준은 한 변 6과 그 양 끝각 50°, 60°예요.', strategy: '같은 길이의 변 양 끝에 어떤 각이 있는지 비교해요.', wrong: [[0, 'ㄱ은 길이 6인 변의 양 끝각이 50°, 70°예요.'], [1, 'ㄴ은 한쪽 끝각이 40°라서 기준과 달라요.'], [2, 'ㄷ은 주어진 변이 7이라 기준 6과 달라요.'], [3, 'ㄹ은 양 끝각이 50°, 50°라서 기준과 달라요.']], conclusion: 'ㅁ은 한 변 6과 양 끝각 50°, 60°가 같아 ASA 합동이에요.', nums: [6, 50, 60] }
    ][type];
    return make('기준과 합동인 삼각형 찾기', ['세 변 보기', '끼인각 보기', '끝각 보기'][type], `정답은 ${data.answer}`, [
      ch('기준과 비교 전략', [{ at: 0, say: data.first, to: { cnBTrace: 1 }, dur: 4 }, { at: 5, say: data.strategy }], 12),
      ch('앞의 두 후보 비교', [{ at: 0, say: data.wrong[0][1], set: { cnBChoice: data.wrong[0][0] } }, { at: 5, say: data.wrong[1][1], set: { cnBChoice: data.wrong[1][0] } }], 12),
      ch('다른 두 후보 비교', [{ at: 0, say: data.wrong[2][1], set: { cnBChoice: data.wrong[2][0] } }, { at: 5, say: data.wrong[3][1], set: { cnBChoice: data.wrong[3][0] } }], 12),
      ch('대응시켜 포개고 답 확인', [{ at: 0, say: '조건이 맞는 후보를 뒤집고 돌려 대응변을 맞춰요.', set: { cnBStage: 2 }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: data.conclusion, set: { cnShowAnswer: true } }], 12)
    ], { problem: true, set: { cnTy: type }, pk: { k: 0, ty: type, nums: data.nums } });
  }
  Object.assign(lessons, {
    'c3-1': [make('세 변으로 삼각형 결정하기', '세 변', 'SSS: 삼각형이 하나로 정해져요', [
      ch('변의 이름과 주어진 길이', [{ at: 0, say: 'a=BC=6, b=CA=7, c=AB=8 cm예요.' }, { at: 5, say: '가장 긴 변도 8<6+7이라 삼각형을 만들 수 있어요.', step: 1 }]),
      ch('두 원의 교점 찾기', [{ at: 0, say: 'AB를 놓고 A에서 7, B에서 6만큼 떨어진 점을 찾아요.', set: { cnBStage: 1 }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: '두 원이 만나는 점에 C를 놓으면 세 변이 모두 맞아요.', step: 2 }]),
      ch('위아래 교점과 합동', [{ at: 0, say: '밑변 아래의 교점도 뒤집으면 같은 삼각형이 돼요.' }, { at: 5, say: '모양과 크기가 하나로 정해져요. SSS 조건이에요.', set: { cnShowAnswer: true }, step: 3 }])
    ]), choiceLesson('sss')],
    'c3-2': [
      basic('두 변과 끼인각으로 결정하기', '끼인각', 'SAS: 삼각형이 하나로 정해져요', ['AB=7 cm, AC=6 cm, ∠A=50°가 주어졌어요.', '∠A는 AB와 AC가 만나는 꼭짓점의 각이에요.', '두 변을 놓고 그 사이의 각을 고정하면 끝점이 정해져요.', '남은 변 BC를 이으면 같은 크기의 삼각형이 돼요.', '돌리고 옮겨 같은 조건의 두 삼각형을 포개어 봐요.', '두 변과 끼인각으로 하나로 정해지는 SAS 조건이에요.']),
      basic('끼인각이 아닌 각의 두 후보', '끼인각 아님', '두 후보: 하나로 정해지지 않아요', ['AB=7 cm, AC=5 cm, ∠B=40°를 고정해요.', 'AB와 AC 사이의 각은 ∠A이므로 ∠B는 끼인각이 아니에요.', 'B에서 40°인 반직선과 A 중심의 반지름 5인 원을 봐요.', '교점이 두 곳이라 조건을 만족하는 두 후보가 생겨요.', '나란히 놓으면 다른 변과 각이 달라 포개어지지 않아요.', '이 값에서는 두 후보예요. SSA는 항상 하나임을 보장하지 못해요.'], { set: { cnMmode: 'non' }, start: { cnMb: 5, cnMc: 7, cnMA: 40 } }),
      choiceLesson('sas')
    ],
    'c3-3': [
      basic('한 변과 양 끝각으로 결정하기', '양 끝각', 'ASA: 삼각형이 하나로 정해져요', ['AB=6 cm, ∠A=55°, ∠B=65°를 고정해요.', 'A, B는 주어진 변 AB의 양 끝점이에요.', 'A에서 55°, B에서 65°인 반직선이 만나는 점을 찾아요.', '나머지 각은 180°−55°−65°=60°예요.', '길이 AB와 양 끝각을 지킨 두 삼각형을 포개어 봐요.', '한 변과 양 끝각으로 하나로 정해지는 ASA 조건이에요.'], { observe: { cnBAngle: true } }),
      basic('각만 같을 때 크기 비교', '각만 같음', '각만으로는 크기가 정해지지 않아요', ['세 각이 55°, 65°, 60°로 같은 삼각형을 비교해요.', 'AB가 3인 예와 AB가 6인 예를 나란히 놓아요.', '크기를 달리해도 각의 크기는 그대로 유지돼요.', '대응변의 길이가 달라서 돌리고 옮겨도 포개지지 않아요.', '같은 모양만으로는 같은 크기까지 보장할 수 없어요.', '각 외에 한 변의 길이도 같아야 합동을 판단할 수 있어요.'], { mode: 'aaa', start: { cnAc: 3 } }),
      choiceLesson('asa')
    ],
    'c3-4': [
      basic('세 각만 같은 경우', '세 각만', 'AAA는 합동 조건이 아니에요', ['세 각이 55°, 65°, 60°로 같은 예를 살펴봐요.', '작은 삼각형과 큰 삼각형의 각 표시가 모두 같아요.', '가로로 벌려 대응하는 변의 길이도 비교해요.', '세 각은 같아도 변의 길이가 다를 수 있어요.', '크기가 다르면 모양이 같아도 합동이 아니에요.', 'AAA는 크기를 정하지 못하므로 합동 조건이 아니에요.'], { set: { cnKmode: 'aaa' }, pk: { k: 0, g: 'sss' } }),
      basic('끼인각이 아닌 각을 준 경우', '끼인각 아님', 'SSA는 합동 조건이 아니에요', ['AB=7 cm, AC=5 cm, ∠B=40°인 예를 살펴봐요.', '주어진 두 변 사이의 각은 ∠A라서 ∠B는 끼인각이 아니에요.', '같은 반직선과 원의 교점이 두 곳인 것을 확인해요.', '두 후보 모두 주어진 길이와 각을 지켜요.', '두 후보의 모양이 달라 하나로 정해지지 않아요.', '값에 따라 결과가 달라 SSA는 일반적인 합동 조건이 아니에요.'], { set: { cnKmode: 'ssa' }, start: { cnMb: 5, cnMc: 7, cnMA: 40 }, pk: { k: 0, g: 'sss' } }),
      basic('가장 긴 변과 나머지 합', '삼각형 성립', '삼각형을 만들 수 없어요', ['세 막대의 길이는 3 cm, 4 cm, 8 cm예요.', '가장 긴 8과 나머지 두 길이의 합을 비교해요.', '3+4=7이므로 두 막대를 펴도 길이 8에 닿지 않아요.', '기울이면 두 막대 끝 사이를 이어도 닫히지 않아요.', '가장 긴 변은 나머지 두 변의 합보다 작아야 해요.', '8>3+4이므로 이 막대들로 삼각형을 만들 수 없어요.'], { set: { cnKmode: 'long' }, observe: { cnBStage: 1 }, pk: { k: 0, g: 'sss' } }),
      choiceLesson('sss', { k: 0, g: 'sss' })
    ],
    'c3-5': [
      basic('끼인각을 기준으로 조건 더하기', '조건 더하기', 'CA=FD를 더하면 SAS 합동', ['AB=DE, ∠A=∠D가 주어진 조건이에요.', 'A와 D를 기준으로 두 변 사이의 각을 살펴봐요.', 'CA=FD를 더하면 같은 두 변 AB·AC와 DE·DF를 얻어요.', '∠A와 ∠D는 바로 그 두 변 사이의 끼인각이에요.', '대응변과 끼인각을 맞추어 두 삼각형을 포개어 봐요.', 'CA=FD를 더하면 두 변과 끼인각인 SAS 합동이에요.'], { pk: { g: 0, rot: 0, k: 0 }, middle: { cnBPart: 2 } }),
      make('합동이 되는 추가 조건의 개수', '조건 개수', '가능한 추가 조건은 3개예요', [
        ch('원래 주어진 두 조건', [{ at: 0, say: 'AB=DE, ∠A=∠D예요. 네 조건을 하나씩 더해 봐요.' }, { at: 5, say: '그림의 모양만 보고 다른 변도 같다고 가정하면 안 돼요.' }]),
        { ...ch('㉠ BC=EF를 더하면', [{ at: 0, say: '㉠ BC=EF를 더해도 ∠A는 두 변의 끼인각이 아니에요.', set: { cnBPart: 1, cnBStage: 0, cnBAngle: false }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: '조건을 지키면서 포개지지 않는 다른 삼각형이 가능해요.', set: { cnBStage: 1 } }]), start: { cnBT: 0 } },
        { ...ch('㉡ CA=FD를 더하면', [{ at: 0, say: '㉡ CA=FD를 더하면 두 변과 그 끼인각이 같아져요.', set: { cnBPart: 2, cnBStage: 0, cnBAngle: false }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: '따라서 ㉡은 SAS 합동 조건을 만들어요.', set: { cnBStage: 1 } }]), start: { cnBT: 0 } },
        { ...ch('㉢ ∠B=∠E를 더하면', [{ at: 0, say: '㉢을 더하면 AB와 DE의 양 끝각이 각각 같아져요.', set: { cnBPart: 4, cnBStage: 0, cnBAngle: false }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: '따라서 ㉢은 ASA 합동 조건을 만들어요.', set: { cnBStage: 1 } }]), start: { cnBT: 0 } },
        { ...ch('㉣ ∠C=∠F를 더하면', [{ at: 0, say: '㉣을 더하면 두 각이 같아 나머지 B와 E도 같아요.', set: { cnBPart: 5, cnBStage: 0, cnBAngle: false }, to: { cnBT: 1 }, dur: 4 }, { at: 5, say: 'AB와 DE의 양 끝각을 알 수 있어 ASA가 돼요.', set: { cnBStage: 1, cnBAngle: true } }]), start: { cnBT: 0 } },
        ch('가능한 조건만 세기', [{ at: 0, say: '㉠은 제외하고 ㉡, ㉢, ㉣을 세어요.' }, { at: 5, say: '합동을 만들 수 있는 추가 조건은 모두 3개예요.', set: { cnShowAnswer: true } }])
      ], { problem: true, pk: { g: 0, rot: 0, k: 0 } })
    ],
    'c5-1': [congruence('SSS'), congruence('SAS'), congruence('ASA'), congruenceChoices()],
    'c5-2': [
      basic('셋째 각 x 구하기', '셋째 각', 'x = 60°', ['∠A=∠D=55°, ∠B=∠E=65°가 주어졌어요.', 'x는 오른쪽 삼각형의 셋째 각 ∠F의 크기예요.', '삼각형의 세 내각의 합 180°에서 두 각의 합을 빼요.', '주어진 두 각의 합은 55°+65°=120°예요.', '∠F=180°−120°를 계산하면 돼요.', 'x=60°예요. 왼쪽의 셋째 각 ∠C도 60°예요.'], { problem: true, mode: 'angle', motionKey: 'cnCt', pk: { A: 55, B: 70, k: 0 }, final: { cnBAngle: true } }),
      basic('두 각과 한 변으로 합동 판단', '합동 이유', 'ASA: △ABC ≡ △DEF', ['∠A=∠D=55°, ∠B=∠E=65°, BC=EF예요.', '주어진 변 BC와 EF의 양 끝각을 알아내는 전략이에요.', '셋째 각 C와 F도 180°−55°−65°로 같아요.', '∠C=∠F=60°이므로 변의 양 끝각이 각각 같아져요.', 'BC↔EF, ∠B↔∠E, ∠C↔∠F를 맞춰 포개어 봐요.', '한 변과 양 끝각이 각각 같아 ASA 합동이에요.'], { motionKey: 'cnCt', observe: { cnBAngle: true }, pk: { A: 55, B: 70, k: 0 } })
    ],
    'c5-3': [triangleChoices(0), triangleChoices(1), triangleChoices(2)]
  });
})();
