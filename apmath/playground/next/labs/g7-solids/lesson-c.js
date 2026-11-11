/* t3/t4 원본 전개도·상태·최단 경로에 연결하는 원클릭 해설입니다. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-solids'] = window.APL_LESSONS['g7-solids'] || {};
  const reset = (goal, extra) => ({ soShowAnswer: false, soLessonGoal: goal, soArcReady: false, soAngleReady: false, soLengthReady: false, soAreaReady: false, soBaseReady: false, ...extra });

  bank['s3-1'] = [
    { title: '원기둥 옆면의 가로와 세로', label: '전개도', tab: 'review', answer: '가로 4π, 세로 4', answerText: '직사각형: 가로 4π, 세로 4 (cm)',
      summary: '가로는 밑면의 둘레, 세로는 원기둥의 높이', task: '반지름과 높이를 바꾸고 펼친 직사각형의 두 변을 비교해 보세요',
      chapters: [
        { length: 10, title: '옆면을 잘라 펼치기', start: { soCr: 2, soCh: 4, soRl: 0 }, cues: [
          { at: 0, say: 'r은 밑면 반지름 2, h는 높이 4예요.', set: reset('net'), to: { soRl: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '세로선을 따라 잘라 옆면을 한 줄로 펴요.' }
        ] },
        { length: 11, title: '한 바퀴 돈 길이', cues: [
          { at: 0, say: '한 바퀴를 모두 펴서 옆면 전체를 살펴봐요.', to: { soRl: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '가로로 간 길이와 세로 길이가 어디서 왔을까요?' }
        ] },
        { length: 10, title: '전개도의 두 변', cues: [
          { at: 0, say: '가로는 밑면의 둘레, 세로는 높이예요.' },
          { at: 5, say: '직사각형이고 가로 4π, 세로 4 cm예요.', step: 3, set: { soShowAnswer: true, soArcReady: true } }
        ] }
      ] },
    { title: '원기둥의 옆넓이 구하기', label: '옆넓이', tab: 'review', answer: '16π', answerText: '16π cm²',
      summary: '옆넓이 = 밑면의 둘레 × 높이', task: '밑면 원은 제외하고 펼친 옆면의 넓이만 구해 보세요',
      chapters: [
        { length: 11, title: '반지름과 높이', start: { soCr: 2, soCh: 4, soRl: 0 }, cues: [
          { at: 0, say: 'r은 밑면 반지름 2, h는 높이 4예요.', set: reset('area'), to: { soRl: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '펼친 직사각형의 가로와 세로를 곱해요.' }
        ] },
        { length: 11, title: '가로와 세로 읽기', cues: [
          { at: 0, say: '가로는 밑면의 둘레 $2π×2=4π$예요.', set: { soArcReady: true } },
          { at: 5.5, say: '세로는 원기둥의 높이 4 그대로예요.' }
        ] },
        { length: 10, title: '옆면의 넓이', cues: [
          { at: 0, say: '위아래 원은 빼고 옆면만 계산해요.' },
          { at: 5, say: '옆넓이는 $4π×4=16π$ cm²예요.', step: 4, set: { soShowAnswer: true } }
        ] }
      ] }
  ];

  const coneStart = () => ({ soNr: 3, soNR: 6, soNt: 0 });
  bank['s3-2'] = [
    { title: '원뿔 옆면과 밑면 연결하기', label: '전개도', tab: 'review', answer: '호의 길이 = 밑면의 둘레', answerText: '부채꼴, 호의 길이 = 밑면의 둘레 = 6π cm',
      summary: '모선은 부채꼴의 반지름, 테두리 길이는 같습니다', task: 'r과 R을 바꾸어도 호와 둘레가 함께 자라는지 확인해 보세요',
      chapters: [
        { length: 10, title: '두 반지름 구별하기', start: coneStart(), cues: [
          { at: 0, say: 'r은 밑면 반지름 3, R은 모선의 길이 6이에요.', set: reset('net'), to: { soNt: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '옆면을 펼친 그림과 원 모양 밑면을 비교해요.' }
        ] },
        { length: 11, title: '같은 테두리 따라가기', cues: [
          { at: 0, say: '모선 R은 펼친 도형의 반지름이 돼요.', to: { soNt: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '노란 테두리를 한 바퀴씩 끝까지 따라가 보세요.' }
        ] },
        { length: 10, title: '펼치기 전후의 관계', cues: [
          { at: 0, say: '잘라 펼쳐도 맞붙는 테두리의 길이는 변하지 않아요.' },
          { at: 5, say: '옆면은 부채꼴, 호의 길이 = 밑면의 둘레 = 6π예요.', set: { soShowAnswer: true, soArcReady: true } }
        ] }
      ] },
    { title: '원뿔 전개도의 중심각', label: '중심각', tab: 'review', answer: '180°',
      summary: '중심각 = 360° × 밑면 반지름 ÷ 모선', task: 'R을 바꾸고 r/R의 비가 중심각에 미치는 영향을 보세요',
      chapters: [
        { length: 10, title: '구하는 각 표시하기', start: coneStart(), cues: [
          { at: 0, say: '밑면 반지름 r은 3, 모선 R은 6, 구할 각은 x예요.', set: reset('angle'), to: { soNt: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '호의 길이와 밑면의 둘레가 같다는 것을 써요.' }
        ] },
        { length: 12, title: '호의 길이로 식 세우기', cues: [
          { at: 0, say: '밑면 둘레는 $2π×3=6π$예요.', set: { soArcReady: true }, to: { soNt: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '호는 반지름 R인 원의 둘레 중 x/360만큼이에요.' }
        ] },
        { length: 10, title: '같은 길이의 비', cues: [
          { at: 0, say: '원의 둘레비 r/R가 중심각의 비 x/360과 같아요.' },
          { at: 5, say: '$x=360°×3÷6=180°$예요.', set: { soShowAnswer: true } }
        ] }
      ] },
    { title: '중심각으로 모선 구하기', label: '모선 길이', tab: 'review', answer: 'R = 6 cm',
      summary: '주어진 중심각과 밑면 둘레로 모선을 구합니다', task: '다른 중심각에서 같은 호의 길이 식으로 모선을 구해 보세요',
      chapters: [
        { length: 10, title: '주어진 각과 반지름', start: coneStart(), cues: [
          { at: 0, say: '밑면 반지름 r은 3, 중심각은 180°예요.', set: reset('slant', { soAngleReady: true }), to: { soNt: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '구할 모선 R은 부채꼴의 반지름이에요.' }
        ] },
        { length: 11, title: '반원의 호와 둘레', cues: [
          { at: 0, say: '밑면 둘레 $6π$가 반원의 호의 길이예요.', set: { soArcReady: true }, to: { soNt: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '반원의 호는 전체 둘레 2πR의 절반인 πR예요.' }
        ] },
        { length: 10, title: '모선의 길이는', cues: [
          { at: 0, say: '같은 길이이므로 πR = 6π로 놓아요.' },
          { at: 5, say: '양쪽을 π로 나누면 R = 6 cm예요.', set: { soShowAnswer: true } }
        ] }
      ] }
  ];

  bank['s3-3'] = [
    { title: '반지름비로 중심각 구하기', label: '중심각', tab: 'review', answer: '120°',
      summary: 'r : R = 1 : k이면 중심각은 360° ÷ k', task: '비를 1:2, 1:4, 1:6으로 바꾸어 중심각을 비교해 보세요',
      chapters: [
        { length: 10, title: '밑면과 모선의 비', start: { soCr3: 2, soNk: 3, soNt: 0 }, cues: [
          { at: 0, say: '밑면 반지름 r은 2, 모선 R은 6이에요.', set: reset('angle'), to: { soNt: 0.5 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: 'r : R는 1 : 3이고, 구하는 중심각은 x예요.' }
        ] },
        { length: 11, title: '호가 차지하는 비율', cues: [
          { at: 0, say: '호의 길이는 밑면의 둘레와 같아요.', to: { soNt: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '반지름 R인 원의 둘레에서 3분의 1을 차지해요.' }
        ] },
        { length: 10, title: '한 바퀴에서 같은 비율', cues: [
          { at: 0, say: '중심각도 한 바퀴 360°의 3분의 1이에요.' },
          { at: 5, say: '$x=360°÷3=120°$예요.', set: { soShowAnswer: true } }
        ] }
      ] },
    { title: '중심각으로 반지름비 구하기', label: '반지름비', tab: 'review', answer: '1 : 4', answerText: 'r : R = 1 : 4',
      summary: 'r/R = 중심각/360°를 거꾸로 읽습니다', task: '주어진 중심각이 달라질 때 밑면 반지름과 모선의 비를 구해 보세요',
      chapters: [
        { length: 10, title: '각이 주어진 전개도', start: { soCr3: 2, soNk: 4, soNt: 0 }, cues: [
          { at: 0, say: '중심각은 90°이고 r은 밑면 반지름, R은 모선이에요.', set: reset('ratio', { soAngleReady: true }), to: { soNt: 0.5 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '구할 것은 두 길이의 비 r : R예요.' }
        ] },
        { length: 11, title: '호와 중심각의 비', cues: [
          { at: 0, say: '호의 길이는 밑면의 둘레 2πr와 같아요.', to: { soNt: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '2πr : 2πR는 중심각 : 360°와 같아요.' }
        ] },
        { length: 10, title: '두 비를 약분하면', cues: [
          { at: 0, say: '공통인 2π를 약분하면 r : R = 90 : 360이에요.' },
          { at: 5, say: '따라서 r : R = 1 : 4예요.', set: { soShowAnswer: true } }
        ] }
      ] }
  ];

  bank['s3-4'] = [
    { title: '조각으로 원뿔 옆넓이 구하기', label: '옆넓이', tab: 'review', answer: '12π', answerText: '12π cm²',
      summary: '옆넓이 = 호의 길이의 절반 × 모선 = πRr', task: '직사각형에 가까운 배열에서 가로와 세로가 무엇인지 설명해 보세요',
      chapters: [
        { length: 11, title: '모선과 밑면 반지름', start: { soNr: 2, soNR: 6, soNq: 0 }, cues: [
          { at: 0, say: '밑면 반지름 r은 2, 모선 R은 6이에요.', set: reset('area'), to: { soNq: 0.4 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '옆면인 부채꼴을 작은 조각으로 나누어요.' }
        ] },
        { length: 12, title: '조각을 서로 맞물리기', cues: [
          { at: 0, say: '호의 길이는 밑면 둘레 $2π×2=4π$예요.', set: { soArcReady: true } },
          { at: 5, say: '위아래를 번갈아 놓으면 직사각형에 가까워져요.', to: { soNq: 1 }, dur: 5, ease: 'smooth' }
        ] },
        { length: 11, title: '가로와 세로의 뜻', cues: [
          { at: 0, say: '가로는 호의 절반 2π, 세로는 모선 6에 가까워져요.', set: { soLengthReady: true } },
          { at: 5.5, say: '더 잘게 나눌수록 직사각형에 더 가까워져요.' }
        ] },
        { length: 10, title: '옆넓이를 계산하면', cues: [
          { at: 0, say: '배열을 바꿔도 조각들의 넓이 합은 같아요.' },
          { at: 5, say: '옆넓이는 $2π×6=12π$ cm²예요.', step: 4, set: { soShowAnswer: true } }
        ] }
      ] },
    { title: '원뿔의 겉넓이 구하기', label: '겉넓이', tab: 'review', answer: '16π', answerText: '16π cm²',
      summary: '원뿔의 겉넓이 = 옆넓이 + 밑넓이 한 개', task: '옆넓이와 겉넓이가 어떻게 다른지 전개도에서 짚어 보세요',
      chapters: [
        { length: 11, title: '겉에 드러나는 두 면', start: { soNr: 2, soNR: 6, soNq: 0 }, cues: [
          { at: 0, say: '밑면 반지름 r은 2, 모선 R은 6이에요.', set: reset('surface'), to: { soNq: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '겉넓이는 옆면과 밑면 한 개의 넓이를 더해요.' }
        ] },
        { length: 12, title: '두 넓이 따로 구하기', cues: [
          { at: 0, say: '옆넓이는 $π×R×r=π×6×2=12π$예요.', set: { soAreaReady: true } },
          { at: 6, say: '밑넓이는 $π×2^2=4π$예요.', set: { soBaseReady: true } }
        ] },
        { length: 10, title: '겉넓이를 더하면', cues: [
          { at: 0, say: '밑면은 한 개만 더해야 해요.' },
          { at: 5, say: '겉넓이는 $12π+4π=16π$ cm²예요.', set: { soShowAnswer: true } }
        ] }
      ] }
  ];

  const frustumStart = () => ({ soF1: 2, soF2: 4, soFk: 3, soFg: 0 });
  bank['s3-5'] = [
    { title: '원뿔대 옆면의 모양', label: '전개도', tab: 'review', answer: '띠 모양',
      summary: '큰 부채꼴에서 같은 중심각의 작은 부채꼴을 뺍니다', task: '작은 부채꼴을 밀어 옆면의 안쪽 호와 바깥쪽 호를 확인해 보세요',
      chapters: [
        { length: 10, title: '큰 것과 작은 것', start: frustumStart(), cues: [
          { at: 0, say: '큰 부채꼴 반지름 R₂는 12, 작은 R₁은 6이에요.', set: reset('net'), to: { soFg: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '작은 원뿔을 잘라 냈을 때 옆면이 어떻게 남을까요?' }
        ] },
        { length: 11, title: '작은 부채꼴 빼기', cues: [
          { at: 0, say: '같은 중심각의 작은 부채꼴을 빼내요.', to: { soFg: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '안쪽 호와 바깥쪽 호는 같은 중심에서 그려졌어요.' }
        ] },
        { length: 10, title: '남은 옆면은', cues: [
          { at: 0, say: '남은 하늘색 부분이 원뿔대의 옆면이에요.' },
          { at: 5, say: '큰 부채꼴에서 작은 부채꼴을 뺀 띠 모양이에요.', set: { soShowAnswer: true } }
        ] }
      ] },
    { title: '원뿔대의 옆넓이 구하기', label: '옆넓이', tab: 'review', answer: '36π', answerText: '36π cm²',
      summary: '옆넓이 = 큰 부채꼴 넓이 − 작은 부채꼴 넓이', task: '두 밑면의 반지름을 바꾸고 빼는 넓이가 어떻게 변하는지 보세요',
      chapters: [
        { length: 11, title: '네 길이 구별하기', start: frustumStart(), cues: [
          { at: 0, say: '큰 밑면 반지름은 4, 작은 밑면 반지름은 2예요.', set: reset('area'), to: { soFg: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '전개도 부채꼴의 반지름 R₂는 12, R₁은 6이에요.' }
        ] },
        { length: 11, title: '큰 부채꼴의 넓이', cues: [
          { at: 0, say: '큰 부채꼴에서 작은 부채꼴의 넓이를 빼요.', to: { soFg: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '큰 부채꼴은 $π×12×4=48π$예요.', set: { soAreaReady: true } }
        ] },
        { length: 10, title: '작은 부채꼴의 넓이', cues: [
          { at: 0, say: '작은 부채꼴은 $π×6×2=12π$예요.', set: { soBaseReady: true } },
          { at: 5, say: '두 넓이는 더하지 않고 큰 것에서 작은 것을 빼요.' }
        ] },
        { length: 10, title: '남은 옆넓이', cues: [
          { at: 0, say: '남은 하늘색 부분의 넓이만 구해요.' },
          { at: 5, say: '옆넓이는 $48π-12π=36π$ cm²예요.', set: { soShowAnswer: true } }
        ] }
      ] }
  ];

  bank['s4-1'] = {
    title: '한 바퀴 도는 가장 짧은 끈', label: '최단 경로', tab: 'review', answer: '전개도의 선분 AA′',
    summary: '입체의 끈을 펼쳐 두 점 사이의 선분과 비교합니다', task: '점 M을 선분 안팎으로 옮기며 꺾인 길이와 직선을 비교해 보세요',
    chapters: [
      { length: 11, title: '같은 점이 두 끝으로', start: { soTr: 2, soTR: 6, soMs: 5, soMp: -90 }, cues: [
        { at: 0, say: '점 M을 지나 한 바퀴 도는 끈의 모양을 바꿔 봐요.', set: reset('path', { soMode: 'via' }), to: { soMs: 4.5 }, dur: 5, ease: 'smooth' },
        { at: 6, say: '전개도의 두 끝 A와 A′는 입체에서 같은 점 A예요.' }
      ] },
      { length: 11, title: '호를 따르는 길과 비교', cues: [
        { at: 0, say: '밑면 둘레를 따르면 전개도에서는 호가 돼요.', set: { soMode: 'rim' } },
        { at: 5, say: '두 끝을 곧게 이은 선과 길이를 비교해요.', step: 2 }
      ] },
      { length: 11, title: '꺾이지 않게 잇기', cues: [
        { at: 0, say: '꺾이는 점 M을 두 끝을 잇는 선 위로 옮겨요.', set: { soMode: 'via' }, to: { soMs: 3 }, dur: 4, ease: 'smooth' },
        { at: 5, say: '전개도의 선분 AA′에 해당하는 끈이 가장 짧아요.', step: 3, set: { soMode: 'line', soShowAnswer: true } }
      ] }
    ]
  };

  const fullPath = (angle) => {
    const R = angle === 60 ? 12 : 4, answer = angle === 60 ? R : 2 * R;
    return { title: angle === 60 ? '정삼각형으로 길이 구하기' : '반원에서 길이 구하기', label: angle === 60 ? '육십 도' : '백팔십 도', tab: 'review', answer: `AA′ = ${answer} cm`,
      summary: angle === 60 ? '정삼각형의 세 변은 같으므로 AA′ = R' : '꼭짓점을 지나는 경로를 포함하면 AA′ = 2R', task: '같은 중심각에서 반지름을 바꾸고 최단 거리의 변화를 보세요',
      chapters: [
        { length: 11, title: '조건과 출발점', start: { soTr: 2, soPathT: 0 }, cues: [
          { at: 0, say: `밑면 반지름 r은 2, 모선 R은 ${R}예요.`, set: reset('path', { soAng: angle }), to: { soPathT: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: 'A에서 한 바퀴 돌아 같은 점 A로 오는 길이에요.' }
        ] },
        { length: 12, title: '중심각과 두 반지름', cues: [
          { at: 0, say: `중심각은 $360°×2÷${R}=${angle}°$예요.`, step: 2 },
          { at: 6, say: angle === 60 ? 'OA와 OA′가 같고 그 사이 각이 60°예요.' : '180°이므로 A, O, A′가 한 직선 위에 있어요.', step: 3 }
        ] },
        { length: 10, title: '선분의 길이', cues: [
          { at: 0, say: angle === 60 ? '세 각이 60°인 정삼각형이므로 세 변의 길이가 같아요.' : '이 문항은 꼭짓점 O를 지나는 경로도 포함해요.' },
          { at: 5, say: angle === 60 ? `최단 거리 AA′ = ${answer} cm예요.` : `R + R = ${R} + ${R}, 최단 거리 AA′ = ${answer} cm예요.`, step: 4, set: { soShowAnswer: true } }
        ] }
      ] };
  };
  bank['s4-2'] = [fullPath(60), fullPath(180)];

  const pointPath = (angle) => {
    const R = angle === 60 ? 12 : 4, p = angle === 60 ? 6 : 3, answer = angle === 60 ? p : 2 * p;
    return { title: angle === 60 ? '모선 위의 점과 정삼각형' : '모선 위의 점과 반원', label: angle === 60 ? '육십 도' : '백팔십 도', tab: 'review', answer: `PP′ = ${answer} cm`,
      summary: angle === 60 ? '모선 전체 대신 OP를 써서 PP′ = OP' : '꼭짓점 경유를 포함하고 OP를 두 번 더합니다', task: '점 P의 위치만 바꾸어 최단 거리가 OP에 따라 달라지는지 보세요',
      chapters: [
        { length: 11, title: '모선 위의 출발점', start: { soTr: 2, soTp: p, soPathT: 0 }, cues: [
          { at: 0, say: `밑면 반지름 r은 2, 모선 R은 ${R}예요.`, set: reset('path', { soAng3: angle }), to: { soPathT: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: `출발점 P는 꼭짓점 O에서 ${p} cm 떨어져 있어요.` }
        ] },
        { length: 12, title: '펼친 두 점 잇기', cues: [
          { at: 0, say: `중심각은 $360°×2÷${R}=${angle}°$예요.`, step: 2 },
          { at: 6, say: angle === 60 ? 'OP와 OP′가 같고 사이 각이 60°라 정삼각형이에요.' : 'P, O, P′가 한 직선 위에 놓여요.', step: 3 }
        ] },
        { length: 10, title: '점 P까지의 길이 쓰기', cues: [
          { at: 0, say: angle === 60 ? '모선 전체 R이 아니라 점 P까지의 거리 OP를 써요.' : '이 문항은 꼭짓점 경유를 포함하므로 OP를 두 번 더해요.' },
          { at: 5, say: angle === 60 ? `최단 거리 PP′ = ${answer} cm예요.` : `OP + OP = ${p} + ${p}, 최단 거리 PP′ = ${answer} cm예요.`, step: angle === 60 ? 4 : 3, set: { soShowAnswer: true } }
        ] }
      ] };
  };
  bank['s4-3'] = [pointPath(60), pointPath(180)];
  bank['s4-4'] = {
    title: '원뿔대의 띠 위 최단 거리', label: '최단 거리', tab: 'review', answer: 'AA′ = 24 cm',
    summary: '직선이 잘라 낸 부분을 지나지 않는지 먼저 확인', task: '작은 밑면을 바꾸고 선분이 원뿔대의 옆면 안에 놓이는지 확인해 보세요',
    chapters: [
      { length: 11, title: '큰 원뿔의 길이', start: { soTg: 4, soTf: 2, soPathT: 0 }, cues: [
        { at: 0, say: '큰 원뿔의 밑면 반지름은 4, 모선 R₂는 24예요.', set: reset('path'), to: { soPathT: 1 }, dur: 5, ease: 'smooth' },
        { at: 6, say: '잘라 낸 작은 부채꼴의 반지름 R₁은 12예요.' }
      ] },
      { length: 11, title: '전개도에서 잇기', cues: [
        { at: 0, say: '큰 부채꼴의 중심각은 $360°×4÷24=60°$예요.', step: 2 },
        { at: 5, say: 'A와 A′를 잇고 안쪽 잘린 부분을 지나는지 확인해요.', step: 3 }
      ] },
      { length: 10, title: '옆면 위에 놓이는 선분', cues: [
        { at: 0, say: '이 그림의 선분은 작은 부채꼴을 지나지 않아요.' },
        { at: 5, say: 'OA와 OA′가 같고 사이 각이 60°라 정삼각형이에요.' }
      ] },
      { length: 10, title: '최단 거리 계산', cues: [
        { at: 0, say: '세 변이 같으므로 선분의 길이는 큰 반지름 R₂예요.' },
        { at: 5, say: '최단 거리 AA′ = 24 cm예요.', step: 4, set: { soShowAnswer: true } }
      ] }
    ]
  };
})();
