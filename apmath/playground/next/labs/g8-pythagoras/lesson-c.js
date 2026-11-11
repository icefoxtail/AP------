/* 수선·접기·최단거리와 세 가지 제곱합 관계: 원본 수치 조건에 결속한 해설. */
(function () {
  'use strict';
  const G = window.APL_PY;
  if (!G) return;
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g8-pythagoras'] = window.APL_LESSONS['g8-pythagoras'] || {};
  const ids = ['py6-iso', 'py6-trap', 'py6-rect', 'py7-rect', 'py7-tri', 'py7-refl', 'py7-box', 'py7-cyl', 'py8-quad', 'py8-rectP', 'py8-cross'];
  const source = Object.fromEntries((window.APL_PY_GROUPS || []).flatMap(g => g.scenes).filter(s => ids.includes(s.id)).map(s => [s.id, s.py]));
  const reset = extra => ({ pyLessonProblem: true, pyShowAnswer: false, pyCalculationReady: false, pyQ: {}, pySeed: 0, pyLessonGoal: '', pyLessonQuestion: '', pyLessonAnswer: '', pyLessonMath: '', pyRoute: 0, ...extra });
  const ch = (title, a, b, one = {}, two = {}, length = 12) => ({ title, length, cues: [{ at: 0, say: a, ...one }, { at: 6, say: b, ...two }] });
  function lesson(title, label, answer, start, settings, chapters) {
    chapters[0].start = { pyFp: 0, ...start };
    chapters[0].cues[0].set = reset({ ...settings, pyLessonAnswer: answer.replace(/\$/g, ''), ...chapters[0].cues[0].set });
    return { title, label, tab: 'review', answer, summary: '원본 조건에서 직각삼각형을 찾아 제곱 관계로 계산합니다', task: '직접 해 보기에서 조건과 구하는 선분을 바꾸어 확인해 보세요', chapters };
  }
  const calc = (step, math = '') => ({ step, set: { pyCalculationReady: true, pyLessonMath: math } });
  const finish = (step = 5) => ({ step, set: { pyShowAnswer: true } });
  const move = (key, value, snap) => ({ to: { [key]: value }, dur: 5, ease: 'linear', ...(snap ? { snap } : {}) });
  const isoQ = kind => ({ pyIb: 10, pyIl: 13, pyKind: kind });
  bank['py6-iso'] = [
    lesson('이등변삼각형에서 높이 찾기', '높이', 'AH = 12', { pyIb: 10, pyIl: 13 }, { pyQ: isoQ(0) }, [
      ch('높이와 빗변 구별하기', 'AH는 밑변에 수직인 높이예요. x로 놓아요.', '같은 두 변 AB와 AC의 길이는 각각 13이에요.', { step: 1 }),
      ch('밑변을 반으로 나누기', '이등변삼각형의 높이는 밑변을 이등분해요.', 'BC=10이므로 BH=HC=5예요.', { step: 2 }),
      ch('직각삼각형에서 높이 계산', 'ABH의 빗변은 AB예요. x²=13²−5²예요.', 'x²=144이고 길이는 양수이므로 AH = 12예요.', { step: 3 }, finish())
    ]),
    lesson('높이를 이용해 넓이 구하기', '넓이', '넓이 = 60', { pyIb: 10, pyIl: 13, pyKind: 0 }, { pyQ: isoQ(0), pyLessonProblem: false, pyLessonGoal: 'iso-area', pyLessonQuestion: 'AB=AC=13, BC=10인 이등변삼각형 ABC의 넓이를 구하세요. AH는 밑변에 내린 수선입니다.' }, [
      ch('넓이에 필요한 높이', '넓이에 쓰는 높이는 비스듬한 AB가 아니라 AH예요.', 'A에서 수선을 내리고 밑변을 반으로 나눠요.', { step: 1 }, { step: 2 }),
      ch('직각삼각형으로 높이 구하기', 'BH=5이고 빗변은 13이므로 AH²=13²−5²예요.', 'AH²=144에서 높이는 12예요.', { step: 3 }, calc(3)),
      ch('밑변과 수직인 높이 곱하기', '삼각형의 넓이는 밑변×높이÷2예요.', '10×12÷2를 계산하면 넓이 = 60이에요.', {}, finish())
    ]),
    lesson('넓이로 같은 변 길이 구하기', '같은변', 'AB = 13', { pyIb: 10, pyIl: 13 }, { pyQ: isoQ(1) }, [
      ch('주어진 넓이에서 출발하기', '밑변은 10, 넓이는 60이에요. 구할 변은 AB예요.', '수선 AH를 내리면 밑변의 반은 5예요.', { step: 1 }, { step: 2 }),
      ch('넓이 식에서 높이 찾기', '60=10×AH÷2이므로 AH=60×2÷10이에요.', '높이는 12예요. 이제 직각삼각형 ABH를 봐요.', {}, calc(3)),
      ch('빗변인 같은 변 구하기', 'AB²=12²+5²=169예요.', '길이는 양수이고 13²=169이므로 AB = 13이에요.', { step: 4 }, finish())
    ])
  ];
  const trapQ = kind => kind ? { pyTu: 4, pyTh: 12, pyTd1: 5, pyTd2: 5, pyKind: 1 } : { pyTu: 6, pyTh: 12, pyTd1: 5, pyTd2: 9, pyKind: 0 };
  bank['py6-trap'] = [
    lesson('사다리꼴의 수직인 높이', '높이', 'AH = 12', {}, { pyQ: trapQ(0) }, [
      ch('직각삼각형을 만들기', 'AH는 높이이고 AB는 비스듬한 다리예요.', 'A에서 밑변으로 수선을 내려 ABH를 봐요.', { step: 1 }),
      ch('빗변과 한 변 사용하기', '직각삼각형 ABH에서 빗변 AB=13, BH=5예요.', 'AH²=AB²−BH²=13²−5²로 계산해요.', { step: 2 }, { step: 3 }),
      ch('높이와 다리 구별하기', 'AH²=169−25=144예요.', '12²=144이므로 높이는 AH = 12예요.', calc(4), finish())
    ]),
    lesson('이등변사다리꼴의 둘레', '둘레', '둘레 = 44', {}, { pyQ: trapQ(1) }, [
      ch('둘레에 필요한 네 변', '윗변은 4, 아랫변은 14, 수직인 높이는 12예요.', '수선 두 개를 내려 양쪽의 직각삼각형을 봐요.', { step: 1 }),
      ch('남는 밑변을 반씩 나누기', '가운데 HI는 윗변과 같은 4예요.', '양옆은 같으므로 BH=IC=(14−4)÷2=5예요.', { step: 2 }, calc(3)),
      ch('비스듬한 다리 구하기', '직각삼각형에서 AB²=12²+5²=169예요.', 'AB=CD=13이므로 네 변을 모두 더해요.', {}, calc(4)),
      ch('네 변의 합', '높이 12가 아니라 다리 13을 두 번 더해요.', '4+14+13+13을 계산하면 둘레 = 44예요.', {}, finish())
    ]),
    lesson('높이로 사다리꼴 넓이 구하기', '넓이', '넓이 = 156', trapQ(0), { pyQ: trapQ(0), pyLessonProblem: false, pyLessonGoal: 'trap-area', pyLessonQuestion: '그림의 사다리꼴은 윗변이 6, 아랫변이 20, 수직인 높이가 12입니다. 넓이를 구하세요.' }, [
      ch('평행한 두 변과 높이', '윗변은 6, 아랫변은 20, 높이는 12예요.', '수선으로 나누면 직사각형과 두 직각삼각형이 돼요.', { step: 1 }),
      ch('넓이를 더해 공식 만들기', '가운데와 양옆의 넓이를 같은 높이로 묶어요.', '넓이는 (윗변+아랫변)×높이÷2예요.', { step: 2 }),
      ch('조건을 넣어 계산하기', '(6+20)×12÷2를 계산해요.', '26×6이므로 넓이 = 156이에요.', calc(3), finish())
    ])
  ];
  const rectQ = kind => ({ pyWw: 8, pyWh: 6, pyKind: kind });
  bank['py6-rect'] = [
    lesson('대각선 양쪽의 높이 더하기', '수선합', 'AP+CQ = $\\frac{48}{5}$', {}, { pyQ: rectQ(0) }, [
      ch('두 수선과 대각선', 'AP와 CQ는 대각선 BD에 수직인 높이예요.', 'AB=6, BC=8인 직사각형에서 두 높이의 합을 구해요.', { step: 1 }),
      ch('대각선과 넓이 이용하기', 'BD²=6²+8²=100이므로 BD=10이에요.', '같은 삼각형 ABD의 넓이를 두 번 나타내요.', calc(2)),
      ch('높이 하나 구하기', '6×8÷2=10×AP÷2이므로 $AP=\\frac{24}{5}$예요.', '합동인 삼각형 ABD와 CDB의 높이는 서로 같아요.', calc(3)),
      ch('같은 두 높이 더하기', 'CQ도 AP와 같으므로 같은 값을 두 번 더해요.', '$AP+CQ=\\frac{24}{5}+\\frac{24}{5}=\\frac{48}{5}$예요.', {}, finish())
    ]),
    lesson('대각선에 내린 높이 하나', 'AP길이', 'AP = $\\frac{24}{5}$', {}, { pyQ: rectQ(2) }, [
      ch('높이의 기준 변 확인하기', 'AP는 AB가 아니라 대각선 BD에 내린 높이예요.', '직각삼각형 ABD의 넓이를 두 방식으로 써요.', { step: 1 }),
      ch('피타고라스로 밑변 구하기', 'BD²=6²+8²=100이므로 BD=10이에요.', '넓이 식은 6×8÷2=10×AP÷2예요.', calc(2)),
      ch('같은 넓이 식 풀기', '양쪽의 2를 없애면 10×AP=48이에요.', '따라서 $AP=\\frac{24}{5}$예요.', { step: 3 }, finish())
    ]),
    lesson('수선의 발 사이 거리', 'PQ길이', 'PQ = $\\frac{14}{5}$', {}, { pyQ: rectQ(1) }, [
      ch('발의 위치로 거리 구하기', 'P와 Q는 대각선 위 수선의 발이에요.', 'B에서 잰 P와 Q의 위치 차로 PQ를 구해요.', { step: 1 }),
      ch('대각선과 닮음 사용하기', 'BD²=6²+8²=100이므로 BD=10이에요.', '△ABP∼△DBA에서 BP=AB²÷BD예요.', calc(2)),
      ch('같은 기준점에서 위치 재기', '$BP=\\frac{36}{10}=\\frac{18}{5}$이고 DQ=BP예요.', '$BQ=10-\\frac{18}{5}=\\frac{32}{5}$예요.', calc(3, 'BP=\\frac{18}{5}  ·  BQ=\\frac{32}{5}'), { step: 4 }),
      ch('위치의 차를 양수로 구하기', '같은 기준 B에서 잰 두 위치를 빼요.', '$PQ=\\frac{32}{5}-\\frac{18}{5}=\\frac{14}{5}$예요.', {}, finish())
    ])
  ];

  const rectFoldQ = kind => ({ pyFoldH: 9, pyFoldW: 15, pyKind: kind });
  const rectFoldStart = { pyFi: 6, pyKind: 0 };
  const foldOpening = () => ch('접히는 점과 같은 길이', 'D가 E에 오도록 접는 선 AF를 축으로 접어요.', '접어도 길이는 같아 AE=AD, FE=FD예요.', move('pyFp', 1), { step: 2 });
  bank['py7-rect'] = [
    lesson('직사각형을 접어 길이 비교', '접기성질', 'AE=AD, FE=FD', rectFoldStart, { pyQ: rectFoldQ(0), pyLessonProblem: false, pyLessonQuestion: '직사각형 ABCD에서 접는 선 AF를 축으로 D를 E에 포개면, 어떤 선분끼리 같은 길이가 될까요?' }, [
      ch('접는 선을 움직이지 않기', 'A와 F를 잇는 선을 축으로 D를 옮겨요.', '접는 선 위의 A와 F는 제자리에 남아요.', move('pyFp', 0.45)),
      ch('접기 전후의 대응 확인', '접기가 끝나면 D가 E와 겹쳐요.', '같은 종이의 선분이므로 AE=AD, FE=FD예요.', move('pyFp', 1), finish())
    ]),
    lesson('접힌 직사각형에서 BE 찾기', 'BE길이', 'BE = 12', rectFoldStart, { pyQ: rectFoldQ(2) }, [
      foldOpening(),
      ch('직각삼각형 ABE 찾기', '직각은 B이고 AE=15가 빗변이에요.', 'BE²=AE²−AB²=15²−9²로 구해요.', { step: 2 }),
      ch('구하는 선분 확인하기', 'BE²=225−81=144예요.', '12²=144이므로 BE = 12예요.', calc(3), finish())
    ]),
    lesson('접힌 선분 FE의 길이', 'FE길이', 'FE = 5', rectFoldStart, { pyQ: rectFoldQ(1) }, [
      foldOpening(),
      ch('밑변의 남은 부분 구하기', 'ABE에서 BE²=15²−9²=144이므로 BE=12예요.', 'EC=15−12=3이에요. 다음은 직각삼각형 FEC예요.', calc(3)),
      ch('접힌 길이를 같은 문자로', 'FE=FD=y라 하면 FC=9−y예요.', 'FEC에서 y²=(9−y)²+3²이므로 18y=90이에요.', { step: 4 }),
      ch('구하는 FE에 연결하기', '양변을 18로 나누면 y=5예요.', 'y가 바로 FE의 길이이므로 FE = 5예요.', {}, finish())
    ]),
    lesson('접고 남은 선분 FC의 길이', 'FC길이', 'FC = 4', rectFoldStart, { pyQ: rectFoldQ(0) }, [
      foldOpening(),
      ch('두 번째 직각삼각형 준비', 'ABE에서 BE²=15²−9²=144이므로 BE=12예요.', 'EC=3이에요. FE=FD=y라 하면 FC=9−y예요.', calc(3)),
      ch('FEC에서 방정식 세우기', 'y²=(9−y)²+3²에서 y²항을 지워요.', '18y=90에서 FE=FD=5예요.', {}, calc(4)),
      ch('구하는 남은 길이 확인', '구할 선분은 FE가 아니라 FC예요.', 'FC=DC−FD=9−5이므로 FC = 4예요.', {}, finish())
    ])
  ];
  const triFoldQ = kind => ({ pyGa: 8, pyGb: 6, pyKind: kind });
  const triFoldStart = { pyGa: 8, pyGb: 6, pyKind: 0 };
  const triOpening = () => ch('포개지는 두 점 확인하기', 'B가 A와 겹치도록 선분 DE를 축으로 접어요.', '접는 선은 AB의 수직이등분선이므로 AE=BE예요.', move('pyFp', 1), { step: 2 });
  bank['py7-tri'] = [
    lesson('B와 A를 포개는 접는 선', '접기성질', 'AB의 수직이등분선', triFoldStart, { pyQ: triFoldQ(0), pyLessonProblem: false, pyLessonQuestion: '직각삼각형 ABC에서 B가 A에 겹치도록 접으면 접는 선 DE는 AB와 어떤 관계일까요?' }, [
      ch('두 점을 포개기', 'DE를 축으로 접으면 B가 A 쪽으로 움직여요.', '접는 선 위의 D와 E는 위치가 바뀌지 않아요.', move('pyFp', 0.45)),
      ch('접는 선의 성질', '접는 선 위에서는 A와 B까지의 거리가 같아요.', '따라서 접는 선 DE는 AB의 수직이등분선이에요.', move('pyFp', 1), finish())
    ]),
    lesson('접고 남은 CE의 길이', 'CE길이', 'CE = $\\frac{7}{4}$', triFoldStart, { pyQ: triFoldQ(0) }, [
      triOpening(),
      ch('같은 길이를 문자로 놓기', 'AE=BE=y라 하면 CE=8−y예요.', '직각삼각형 ACE에서 y²=(8−y)²+6²예요.', { step: 3 }),
      ch('같은 제곱항 없애기', '양변의 y²을 지우면 16y=100이에요.', '$AE=BE=\\frac{25}{4}$예요. 구할 것은 CE예요.', {}, calc(4)),
      ch('밑변에서 같은 길이 빼기', 'BC에서 BE를 빼면 CE예요.', '$CE=8-\\frac{25}{4}=\\frac{7}{4}$예요.', {}, finish())
    ]),
    lesson('접혀서 겹친 AE의 길이', 'AE길이', 'AE = $\\frac{25}{4}$', triFoldStart, { pyQ: triFoldQ(1) }, [
      triOpening(),
      ch('빗변을 같은 문자로 놓기', 'AE=BE=y, CE=8−y예요.', 'ACE의 빗변 AE를 써서 y²=(8−y)²+36이에요.', { step: 3 }),
      ch('방정식에서 값 구하기', '양변의 y²을 지우면 16y=100이에요.', '$AE=y=\\frac{100}{16}=\\frac{25}{4}$예요.', { step: 4 }, finish())
    ]),
    lesson('접는 선 DE의 길이', 'DE길이', 'DE = $\\frac{15}{4}$', triFoldStart, { pyQ: triFoldQ(2) }, [
      triOpening(),
      ch('빗변의 중점과 길이', 'AB²=8²+6²=100이므로 AB=10이에요.', 'D는 AB의 중점이므로 BD=5예요.', calc(3)),
      ch('닮은 직각삼각형 찾기', '△BDE와 △BCA는 직각과 ∠B가 같아 닮았어요.', 'B↔B, D↔C, E↔A이므로 DE:6=5:8이에요.', { step: 4 }),
      ch('대응하는 길이 계산하기', 'DE는 CA에, BD는 BC에 대응해요.', '$DE=6\\times\\frac{5}{8}=\\frac{15}{4}$예요.', {}, finish())
    ])
  ];
  const reflectQ = { pyLd: 12, pyLp: 3, pyLq: 2 };
  const reflectStart = { ...reflectQ, pyLt: 6 };
  const reflectFirst = () => ch('움직이는 경로와 대칭점', 'P를 움직이면 AP+PB의 길이가 달라져요.', 'A를 직선 ℓ에 대칭이동한 점 A′을 표시해요.', move('pyLt', 4), { step: 2 });
  bank['py7-refl'] = [
    lesson('가장 짧아지는 P의 위치', '최단위치', 'P는 A′B와 ℓ의 교점', reflectStart, { pyQ: reflectQ, pyLessonProblem: false, pyLessonGoal: 'reflect-position', pyLessonQuestion: '직선 ℓ 위의 P를 지나 A에서 B로 가는 길이 가장 짧아지려면 P를 어디에 놓아야 할까요?' }, [
      reflectFirst(),
      ch('꺾인 길이를 직선으로 바꾸기', '대칭이므로 AP=A′P예요. 바뀐 길이를 펴 봐요.', '두 점 사이에서는 꺾이지 않은 선분이 가장 짧아요.', move('pyLt', 7.2)),
      ch('최단 위치의 조건', 'A′, P, B가 한 직선에 놓이는 위치를 찾아요.', 'P는 A′B와 ℓ의 교점이에요.', {}, finish(3))
    ]),
    lesson('대칭이동으로 최솟값 구하기', '최단거리', '최단거리 = 13', reflectStart, { pyQ: reflectQ }, [
      reflectFirst(),
      ch('대칭점에서 잇는 선분', 'AP=A′P이므로 A′, P, B를 일직선으로 맞춰요.', '가로 거리는 12, 세로 거리는 두 높이의 합 5예요.', move('pyLt', 7.2)),
      ch('피타고라스로 최소 길이', '최단거리 x에 대해 x²=12²+5²=169예요.', '13²=169이므로 최단거리 = 13이에요.', calc(3), finish(3))
    ])
  ];
  bank['py7-box'] = [
    lesson('세 전개도의 최단거리 비교', '세경로', '최단거리 = 5', { pyXa: 1, pyXb: 2, pyXc: 4 }, { pyQ: { pyXa: 1, pyXb: 2, pyXc: 4 } }, [
      ch('겉면 경로를 펼쳐 보기', '모서리 길이는 1, 2, 4예요. 공간 속으로 가면 안 돼요.', '맞은편 꼭짓점으로 가는 세 전개도를 비교해요.', { step: 1 }, { step: 2 }),
      ch('첫째와 셋째 경로 계산', '앞면과 윗면은 가로 6, 세로 1이라 x²=37이에요.', '왼쪽면과 윗면은 가로 5, 세로 2라 x²=29예요.', calc(3), { step: 3, set: { pyRoute: 2 } }),
      ch('남은 경로도 계산하기', '앞면과 오른쪽면은 가로 3, 세로 4예요.', '이 경로의 제곱은 3²+4²=25예요.', { step: 3, set: { pyRoute: 1 } }),
      ch('세 길이 중 최솟값 선택', '양수인 길이는 제곱이 작을수록 짧아요. 25가 가장 작아요.', '5²=25이므로 최단거리 = 5예요.', {}, finish(3))
    ])
  ];
  bank['py7-cyl'] = [
    lesson('원기둥을 한 바퀴 감는 실', '한바퀴', '실의 길이 = 13', {}, { pyQ: { pyCl: 12, pyCh: 5, pyTurn: 1 } }, [
      ch('실이 지나는 옆면', '밑면의 둘레는 12, 높이는 5예요.', '한 바퀴 감은 옆면을 직사각형으로 펼쳐요.', { step: 1 }, { step: 2 }),
      ch('펼친 가로와 세로', '한 바퀴이므로 가로는 둘레 전체인 12예요.', '가장 짧은 실은 가로 12, 세로 5인 직사각형의 대각선이에요.', { step: 3 }),
      ch('대각선 길이 계산하기', 'x²=12²+5²=169예요.', '13²=169이므로 실의 길이 = 13이에요.', calc(3), finish(3))
    ]),
    lesson('원기둥을 반 바퀴 감는 실', '반바퀴', '실의 길이 = 5', {}, { pyQ: { pyCl: 8, pyCh: 3, pyTurn: 0.5 } }, [
      ch('반대쪽 위의 점으로 가기', '밑면의 둘레는 8, 높이는 3이에요.', '반 바퀴 감으므로 옆면의 절반만 펼쳐요.', { step: 1 }, { step: 2 }),
      ch('가로를 둘레의 반으로', '펼친 가로는 8÷2=4이고 세로는 3이에요.', '가장 짧은 실은 펼친 직사각형의 대각선이에요.', { step: 3 }),
      ch('반 바퀴의 길이 계산', 'x²=4²+3²=25예요.', '5²=25이므로 실의 길이 = 5예요.', calc(3), finish(3))
    ])
  ];

  const quadQ = { pyQa: 9, pyQb: 12, pyQc: 5, pyQd: 12, pyKind: 0 };
  bank['py8-quad'] = [
    lesson('수직인 대각선의 제곱합', '관계식', 'AB²+CD² = AD²+BC²', { ...quadQ, pyQr: 0 }, { pyQ: quadQ, pyLessonProblem: false, pyLessonQuestion: '대각선 AC와 BD가 수직인 사각형에서 AB²+CD²와 AD²+BC²의 관계를 설명하세요.' }, [
      ch('네 직각삼각형의 공통 교점', 'O에서 대각선이 수직이에요. 돌려도 직각은 같아요.', 'OA, OB, OC, OD의 길이를 a, b, c, d라 해요.', move('pyQr', 35, 5), { step: 1 }),
      ch('마주 보는 두 변씩 전개하기', '$AB^2=a^2+b^2$, $CD^2=c^2+d^2$예요.', '$AD^2=a^2+d^2$, $BC^2=b^2+c^2$예요.', { step: 2 }, { step: 3 }),
      ch('같은 네 제곱을 비교하기', '어느 쪽도 a², b², c², d²을 한 번씩 더해요.', '따라서 AB²+CD² = AD²+BC²예요.', {}, finish())
    ]),
    lesson('수직 대각선에서 변의 제곱', '값구하기', 'AD² = 225', { pyQr: 20 }, { pyQ: quadQ }, [
      ch('주어진 변과 직각 조건', 'AB=15, BC=13, CD=13이고 대각선이 수직이에요.', '내부 선분의 길이를 몰라도 네 직각삼각형을 이용해요.', move('pyQr', 55, 5), { step: 1 }),
      ch('마주 보는 제곱합 묶기', '네 내부 선분의 제곱을 같은 쌍으로 묶어요.', 'AB²+CD²=AD²+BC²이므로 BC²를 빼면 돼요.', { step: 2 }, { step: 3 }),
      ch('구하는 제곱값 계산하기', 'AD²=15²+13²−13²이에요.', '따라서 AD² = 225예요. 길이가 아니라 제곱값이에요.', calc(4), finish())
    ])
  ];
  const pointQ = kind => ({ pyRW: 9, pyRH: 12, pyPx: 6, pyPy: 4, pyKind: kind });
  bank['py8-rectP'] = [
    lesson('움직이는 점과 두 제곱합', '관계식', 'PA²+PC² = PB²+PD²', pointQ(0), { pyQ: pointQ(0), pyLessonProblem: false, pyLessonQuestion: '직사각형 안의 점 P를 움직여도 PA²+PC²와 PB²+PD²는 어떤 관계일까요?' }, [
      ch('점 P와 가로세로 거리', 'P를 옮기며 네 꼭짓점까지의 선분을 비교해요.', 'P에서 그은 가로·세로로 네 직각삼각형을 만들어요.', { to: { pyPx: 4, pyPy: 5 }, dur: 5, snap: 1, ease: 'linear' }, { step: 2 }),
      ch('가로와 세로의 제곱으로', '왼쪽·오른쪽 거리를 a, b, 위·아래를 c, d라 해요.', '$PA^2=a^2+c^2$, $PC^2=b^2+d^2$예요.', { step: 2 }),
      ch('다른 대각 꼭짓점과 비교', '$PB^2=a^2+d^2$, $PD^2=b^2+c^2$예요.', '같은 네 제곱이므로 PA²+PC² = PB²+PD²예요.', { step: 3 }, finish())
    ]),
    lesson('마주 보는 두 길이의 제곱합', '제곱합', 'PA²+PC² = 125', {}, { pyQ: pointQ(0) }, [
      ch('주어진 두 거리 읽기', 'PB=10, PD=5예요. 구할 것은 PA²+PC²예요.', '가로·세로 보조선으로 네 직각삼각형을 만들어요.', { step: 2 }),
      ch('같은 네 제곱 다시 묶기', 'A와 C를 잇는 길이도 가로·세로 거리로 나타내요.', 'PA²+PC²=PB²+PD²이므로 두 주어진 길이를 써요.', { step: 3 }),
      ch('길이를 각각 제곱하기', '구할 값은 10+5가 아니라 10²+5²이에요.', '100+25이므로 PA²+PC² = 125예요.', calc(4), finish())
    ]),
    lesson('직사각형 속 한 거리의 제곱', 'PD제곱', 'PD² = 25', {}, { pyQ: pointQ(1) }, [
      ch('길이와 제곱값 구별하기', '주어진 값은 PA²=52, PB²=100, PC²=73이에요.', '이미 제곱한 값이므로 다시 제곱하지 않아요.', { step: 2 }),
      ch('마주 보는 꼭짓점끼리 묶기', 'PA²+PC²=PB²+PD²이에요.', 'PD²를 남기려면 PA²+PC²에서 PB²를 빼요.', { step: 3 }),
      ch('제곱값으로 계산하기', 'PD²=52+73−100이에요.', '따라서 PD² = 25예요.', calc(4), finish())
    ])
  ];
  const crossQ = { pyXp: 8, pyXq: 6, pyXm: 3, pyXn: 4, pyKind: 0 };
  bank['py8-cross'] = [
    lesson('X자 선분의 제곱합 관계', '관계식', 'BE²+CD² = BC²+DE²', crossQ, { pyQ: crossQ, pyLessonProblem: false, pyLessonQuestion: '직각삼각형 ABC에서 D는 AB 위, E는 AC 위의 점입니다. BE²+CD²와 BC²+DE²의 관계를 설명하세요.' }, [
      ch('직각을 공유하는 삼각형', 'D와 E를 옮겨도 A의 직각은 그대로예요.', 'ABE와 ACD에서 빗변은 각각 BE와 CD예요.', { to: { pyXm: 2, pyXn: 3 }, dur: 5, snap: 1, ease: 'linear' }, { step: 2 }),
      ch('두 빗변의 제곱 더하기', '$BE^2=AB^2+AE^2$, $CD^2=AC^2+AD^2$예요.', '더한 네 제곱을 AB²+AC²와 AD²+AE²로 묶어요.', { step: 3 }),
      ch('바깥과 안쪽 빗변으로 바꾸기', '앞 묶음은 BC², 뒤 묶음은 DE²이에요.', '따라서 BE²+CD² = BC²+DE²예요.', {}, finish())
    ]),
    lesson('X자의 두 제곱합 계산하기', '값구하기', 'BE²+CD² = 125', {}, { pyQ: crossQ }, [
      ch('주어진 두 선분 찾기', '바깥 빗변 BC=10, 안쪽 빗변 DE=5예요.', '구할 것은 엇갈린 선분 BE와 CD의 제곱합이에요.', { step: 2 }),
      ch('네 제곱을 다시 묶기', '두 직각삼각형에서 BE²와 CD²를 각각 전개해요.', '같은 항을 묶으면 BE²+CD²=BC²+DE²이에요.', { step: 3 }),
      ch('주어진 길이만으로 계산', 'BE와 CD를 따로 구하지 않고 10²+5²를 계산해요.', '100+25이므로 BE²+CD² = 125예요.', calc(4), finish())
    ])
  ];

  for (const id of ids) {
    const D = source[id];
    if (!D) continue;
    D.lessonQuestion = (M, s, Q) => s.pyLessonProblem && Q
      ? `<p>${Q.stem || Q.html}</p><ol>${Q.choices.map(c => `<li>${c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p}</li>`).join('')}</ol>`
      : s.pyLessonQuestion || D.question;
    const original = D.draw;
    D.draw = function (b, s, M, C) {
      let context = C;
      if (C.lesson && s.pyLessonGoal === 'iso-area') context = { ...C, answer: C.calculation };
      if (C.lesson && id === 'py7-refl') context = { ...C, givens: true, answer: s.pyLessonGoal === 'reflect-position' ? false : C.answer };
      if (C.lesson && id === 'py8-rectP') context = { ...C, givens: true };
      original(b, s, M, context);
      if (!C.lesson || !C.txt) return;
      const text = C.answer ? s.pyLessonAnswer : C.calculation ? s.pyLessonMath : '';
      if (text) b.stext(b.W / 2, b.H - 24, text, { size: b.W < 560 ? 14 : 16, color: C.answer ? 'green' : 'amber', weight: 800, align: 'center' });
    };
  }
})();
