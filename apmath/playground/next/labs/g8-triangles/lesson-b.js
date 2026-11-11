/* 각의 이등분선·수직이등분선·외심: 실제 원본문항과 solve 그림에 결속한 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g8-triangles'] = window.APL_LESSONS['g8-triangles'] || {};
  const ch = (title, cues, length = 12) => ({ title, length, cues });
  function make(title, label, answer, chapters, options = {}) {
    chapters[0].start = { trBT: 0, trV: 0, trBh: 25, trBd: 4, trB1: 4, trB2: 4, trBm: 3, trBq: 4,
      trBc: 5, trBb: 4, trBa: 70, trBe: 3, trCb: 50, trCc: 50, trM: 7, trAl: 30, trK: 1,
      trOa: 60, trOb: 65, trOr: 6, trPa: 50, trPr: 4, trQa: 112, trQb: 25,
      trRa: 2, trRb: 3, trRc: 4, trSr: 5, trSa: 6, ...(options.start || {}) };
    const first = chapters[0].cues[0];
    first.set = { trLessonProblem: options.problem !== false, trShowAnswer: false, trCalculationReady: false,
      trSeed: 0, trBConcept: options.concept || '', trBLabels: false, trOf: [-3, -1, 0, 2, 4], ...(first.set || {}) };
    if (!first.to) Object.assign(first, { to: { trBT: 1 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer,
      summary: '주어진 조건과 대응하는 변·각을 확인하고 결론을 연결해요',
      task: '직접 해 보기에서 다른 조건과 비교해 보세요', chapters };
  }
  function bisectorPoint(v, concept = false) {
    const label = concept ? '거리 원리' : ['수선 길이', '두 각의 합', '대응변'][v];
    const answer = concept ? 'PE=PF' : ['PF=4 cm', '∠EPF=130°', 'OF=8 cm'][v];
    return make('각의 이등분선 위의 점', label, answer, [
      ch('점과 구할 대상', [{ at: 0, say: concept ? 'P는 각 XOY의 이등분선 위에 있는 점이에요.' : ['PE=4 cm이며, 구할 길이는 PF=x예요.', '∠XOP=25°이며, 구할 각은 ∠EPF예요.', 'OE=8 cm이며, 구할 길이는 OF=x예요.'][v] }, { at: 6, say: 'E와 F는 P에서 두 변에 내린 수선의 발이에요.', step: 1 }]),
      ch('직각삼각형의 합동 조건', [{ at: 0, say: '△POE와 △POF는 E, F에서 직각이에요.', step: 3 }, { at: 4, say: '두 삼각형의 빗변 OP는 공통이에요.', step: 4 }, { at: 8, say: 'OP가 이등분선이므로 O의 두 예각도 같아요.', step: 5 }]),
      ch('RHA 합동으로 대응 찾기', [{ at: 0, say: '직각·빗변·한 예각으로 RHA 합동이에요.', step: 6 }, { at: 6, say: v === 1 && !concept ? 'P의 두 작은 각도 같고, 각각 90°−25°예요.' : 'P↔P, O↔O, E↔F 순서로 대응해요.' }]),
      ch('구한 대상에 결론 적용', [{ at: 0, say: concept ? '대응변이 같으므로 두 변까지의 거리는 PE=PF예요.' : ['대응변이므로 PF=PE=4 cm가 정답이에요.', '각각 65°이므로 ∠EPF=65°+65°=130°예요.', '대응변이므로 OF=OE=8 cm가 정답이에요.'][v], step: concept ? 6 : 7, set: { trShowAnswer: true, trCalculationReady: true } }, { at: 6, say: concept ? '거리는 비스듬한 길이가 아니라 수선의 길이예요.' : '두 삼각형의 대응 관계와 물어본 대상을 확인해요.', step: concept ? 6 : 8 }])
    ], { problem: !concept, start: { trV: v } });
  }
  lessons['t4-1'] = [bisectorPoint(0, true), bisectorPoint(0), bisectorPoint(1), bisectorPoint(2)];
  function equalDistance(v, concept = false) {
    return make('두 변까지의 거리가 같은 점', concept ? '이등분선' : v ? '다른 예각' : '전체 각', concept ? 'P는 ∠XOY의 이등분선 위에 있어요' : v ? '∠POY=25°' : '∠POE=25°', [
      ch('같은 수선과 구할 각', [{ at: 0, say: 'P에서 두 변에 내린 수선 PE, PF가 같아요.' }, { at: 6, say: concept ? '두 직각삼각형의 합동으로 O의 각을 비교해요.' : v ? '∠XOP=25°이며 구할 각은 ∠POY예요.' : '∠XOY=50°이며 구할 각은 ∠POE예요.', step: 1 }]),
      ch('RHS 합동 조건', [{ at: 0, say: 'E와 F가 수선의 발이므로 두 각은 직각이에요.', step: 3 }, { at: 4, say: '빗변 OP는 두 삼각형에 공통이에요.', step: 4 }, { at: 8, say: '직각변 PE=PF는 문제에서 주어진 조건이에요.', step: 5 }]),
      ch('대응각으로 결론', [{ at: 0, say: '△POE≡△POF는 RHS 합동이에요.', step: 6 }, { at: 6, say: concept ? '∠POE=∠POF이므로 P는 이등분선 위에 있어요.' : v ? '대응각이므로 ∠POY=∠XOP=25°예요.' : '같은 두 각의 합이 50°이므로 ∠POE=25°예요.', step: concept ? 6 : 8, set: { trShowAnswer: true, trCalculationReady: true } }])
    ], { problem: !concept, start: { trV: v } });
  }
  lessons['t4-2'] = [equalDistance(0, true), equalDistance(0), equalDistance(1)];
  function perpendicularBisector(v, concept = false) {
    return make('수직이등분선 위의 점', concept ? '양 끝점' : ['변의 길이', '밑각', '꼭지각'][v], concept ? 'PA=PB' : ['PB=7 cm', '∠PBA=30°', '∠APB=60°'][v], [
      ch('수직이등분선의 뜻', [{ at: 0, say: 'M은 AB의 중점이고, 직선 ℓ은 AB와 수직이에요.' }, { at: 6, say: concept ? 'ℓ 위의 점 P에서 A, B까지의 거리를 비교해요.' : ['PA=7 cm이며 구할 길이는 PB예요.', '∠PAB=30°이며 구할 각은 ∠PBA예요.', '∠APM=30°이며 구할 각은 ∠APB예요.'][v], step: 1 }]),
      ch('두 변과 끼인각', [{ at: 0, say: '중점의 뜻에서 AM=BM이에요.', step: 3 }, { at: 4, say: '∠PMA와 ∠PMB는 두 변 사이의 직각이에요.', step: 4 }, { at: 8, say: '다른 한 변 PM은 두 삼각형에 공통이에요.', step: 5 }]),
      ch('SAS 합동과 대응', [{ at: 0, say: '두 변과 끼인각으로 △PAM≡△PBM이에요.', step: 6 }, { at: 6, say: 'P↔P, A↔B, M↔M의 대응을 따라가요.' }]),
      ch('물어본 변이나 각', [{ at: 0, say: concept ? '대응변이므로 양 끝점까지의 거리는 PA=PB예요.' : ['대응변이 같으므로 PB=PA=7 cm예요.', '대응각이 같으므로 ∠PBA=∠PAB=30°예요.', 'P의 같은 두 각을 더하면 ∠APB=30°+30°=60°예요.'][v], step: concept ? 6 : 7, set: { trShowAnswer: true, trCalculationReady: true } }, { at: 6, say: '수직과 중점이라는 두 조건을 모두 사용했어요.', step: concept ? 6 : 8 }])
    ], { problem: !concept, start: { trV: v } });
  }
  lessons['t4-3'] = [perpendicularBisector(0, true), perpendicularBisector(0), perpendicularBisector(1), perpendicularBisector(2)];
  function bisectorArea(v, concept = false) {
    return make('이등분선과 넓이의 비', concept ? '넓이 비' : v ? 'ABD 넓이' : 'ACD 넓이', concept ? '△ABD:△ACD=5:4' : v ? '△ABD=5 cm²' : '△ACD=4 cm²', [
      ch('밑변과 높이 선택', [{ at: 0, say: 'AD는 ∠A의 이등분선이고 AB=5, AC=4 cm예요.' }, { at: 6, say: concept ? '각 삼각형에서 AB와 AC를 밑변으로 삼아요.' : v ? '△ACD=4 cm²이며 △ABD의 넓이를 구해요.' : '△ABD=5 cm²이며 △ACD의 넓이를 구해요.', step: 1 }]),
      ch('수선으로 같은 높이 찾기', [{ at: 0, say: 'D에서 AB, AC에 내린 수선의 발은 E, F예요.', step: 3 }, { at: 6, say: 'D가 이등분선 위에 있으므로 DE=DF예요.' }]),
      ch('공통 높이가 약분되는 비', [{ at: 0, say: '넓이는 각각 AB×DE÷2와 AC×DF÷2예요.', step: 4 }, { at: 6, say: concept ? '같은 높이와 2로 나누는 부분을 약분해요.' : '높이가 같아서 넓이의 비는 밑변 5:4예요.', set: { trCalculationReady: true } }]),
      ch('같은 순서로 답하기', [{ at: 0, say: concept ? '따라서 △ABD:△ACD=AB:AC=5:4예요.' : v ? '△ABD=4×5÷4=5 cm²가 정답이에요.' : '△ACD=5×4÷5=4 cm²가 정답이에요.', step: concept ? 4 : 5, set: { trShowAnswer: true } }, { at: 6, say: '넓이와 밑변의 대응 순서를 바꾸지 않아요.', step: concept ? 4 : 6 }])
    ], { problem: !concept, start: { trV: v } });
  }
  lessons['t4-4'] = [bisectorArea(0, true), bisectorArea(0), bisectorArea(1)];
  function distanceLesson(v, concept = false) {
    const heading = concept ? '거리 원리' : ['수선 찾기', '다른변 거리', '비스듬한 선'][v];
    if (v === 1) return make('이등분선과 다른 변까지의 거리', heading, 'PF=4 cm', [
      ch('거리인 수선 찾기', [{ at: 0, say: 'P는 이등분선 위에 있고 PE=4 cm예요.' }, { at: 6, say: 'P에서 OY까지의 거리는 수선 PF의 길이예요.', step: 1 }]),
      ch('대응하는 직각삼각형', [{ at: 0, say: 'E, F에서 직각이고 OP는 공통인 빗변이에요.', step: 2 }, { at: 6, say: 'O의 두 예각도 같으므로 두 삼각형은 RHA 합동이에요.', step: 3 }]),
      ch('수선의 길이로 답하기', [{ at: 0, say: '대응변 PE=PF를 이용해 주어진 4 cm를 옮겨요.' }, { at: 6, say: '따라서 P에서 OY까지의 거리 PF는 4 cm예요.', step: 5, set: { trShowAnswer: true, trCalculationReady: true } }])
    ], { start: { trV: 1 } });
    return make('점에서 직선까지의 거리', heading, concept ? '가장 짧은 선분은 수선 PE예요' : v === 0 ? '선분 PC' : '거리=4 cm', [
      ch('점과 직선의 관계', [{ at: 0, say: v === 0 ? '점 P에서 직선 ℓ의 다섯 점까지 선분을 그었어요.' : 'P에서 OX 위의 E, Q로 선분을 그었어요.' }, { at: 6, say: v === 0 ? 'A, B, C, D, E 중 수선의 발을 찾아보세요.' : 'E는 수선의 발이고 PE=4 cm, Q는 다른 점이에요.', step: 1 }]),
      ch('수직과 비스듬한 선분', [{ at: 0, say: '직선과 직각을 이루는 선분을 표시해요.', step: 3 }, { at: 6, say: v === 0 ? '나머지 선분은 각각 직각삼각형의 빗변이에요.' : '△PEQ에서 PQ는 빗변, PE는 직각변이에요.', step: 4 }]),
      ch('가장 짧은 길이가 거리', [{ at: 0, say: '직각삼각형의 빗변은 직각변보다 길어요.' }, { at: 6, say: concept ? '가장 짧은 선분은 수선 PE이고 그 길이가 거리예요.' : v === 0 ? '수직인 PC가 가장 짧아, 거리를 나타내는 선분이에요.' : '거리는 비스듬한 PQ가 아니라 수선 PE=4 cm예요.', step: concept ? 4 : v === 0 ? 5 : 6, set: { trShowAnswer: true, trCalculationReady: true } }])
    ], { problem: !concept, start: { trV: v } });
  }
  lessons['t4-5'] = [distanceLesson(2, true), distanceLesson(0), distanceLesson(1), distanceLesson(2)];
  function equalFeet(v, concept = false) {
    return make('중점에서 내린 같은 수선', concept ? '삼각형 종류' : ['∠C 구하기', '∠B 구하기', 'AC 길이'][v], concept ? '△ABC는 이등변삼각형이에요' : ['∠C=50°', '∠B=50°', 'AC=7 cm'][v], [
      ch('중점과 같은 수선', [{ at: 0, say: 'M은 BC의 중점이고 MD=ME, D와 E는 수선의 발이에요.' }, { at: 6, say: concept ? '△BMD와 △CME의 합동으로 밑각을 비교해요.' : ['∠B=50°이며, 구할 각은 ∠C예요.', '∠A=80°이며, 구할 각은 ∠B예요.', 'AB=7 cm이며, 구할 길이는 AC예요.'][v], step: 1 }]),
      ch('직각·빗변·한 변', [{ at: 0, say: '수선의 발 D와 E에서 두 각은 직각이에요.', step: 3 }, { at: 4, say: 'M이 중점이므로 두 빗변 BM=CM이에요.', step: 4 }, { at: 8, say: '직각변 MD=ME도 주어져 RHS 합동을 써요.', step: 5 }]),
      ch('합동으로 같은 밑각', [{ at: 0, say: '△BMD≡△CME의 대응각은 ∠B=∠C예요.', step: 6 }, { at: 6, say: v === 1 && !concept ? '두 밑각의 합은 180°−80°로 구해요.' : '같은 밑각의 맞은편 변 AB와 AC도 같아요.' }]),
      ch('구할 대상에 적용', [{ at: 0, say: concept ? '따라서 AB=AC인 이등변삼각형이에요.' : ['대응각이 같으므로 ∠C=∠B=50°예요.', '두 밑각을 반으로 나누면 ∠B=100°÷2=50°예요.', '같은 각의 대변도 같아서 AC=AB=7 cm예요.'][v], step: concept ? 6 : 7, set: { trShowAnswer: true, trCalculationReady: true } }, { at: 6, say: '중점 조건과 수선의 길이 조건을 함께 사용했어요.', step: concept ? 6 : 8 }])
    ], { problem: !concept, start: { trV: v } });
  }
  lessons['t4-6'] = [equalFeet(0, true), equalFeet(0), equalFeet(1), equalFeet(2)];
  function circumcenterConcept(which) {
    const center = which === 'center';
    return make('외심과 수직이등분선', center ? '외심 위치' : '세 반지름', center ? '세 수직이등분선은 외심 O에서 만나요' : 'OA=OB=OC=R', [
      ch('점과 선의 뜻', [{ at: 0, say: center ? 'D, E, F는 삼각형의 세 변에 있는 중점이에요.' : 'O는 외심이고, R은 외접원의 반지름을 뜻해요.' }, { at: 6, say: '수직이등분선 위의 점은 양 끝점에서 같은 거리에 있어요.', step: 1 }]),
      ch('양 끝점까지의 거리 연결', [{ at: 0, say: 'AB의 수직이등분선 위에 있으므로 OA=OB예요.', step: 3 }, { at: 6, say: 'BC의 수직이등분선 위에 있으므로 OB=OC예요.' }]),
      ch(center ? '세 번째 수직이등분선' : '같은 거리의 세 꼭짓점', [{ at: 0, say: center ? 'OA=OC도 되어 O는 AC의 수직이등분선 위에 있어요.' : '앞의 두 등식을 연결하면 세 꼭짓점까지 거리가 같아요.' }, { at: 6, say: center ? '세 수직이등분선이 만나는 한 점 O가 외심이에요.' : '따라서 OA=OB=OC=R, 모두 같은 원의 반지름이에요.', step: center ? 3 : 4, set: { trShowAnswer: true } }])
    ], { problem: false, concept: which });
  }
  function circumcenterProblem(v) {
    if (v === 2) return make('외심의 성질에서 옳지 않은 보기', '성질 판별', '② ∠AOB=∠BOC가 옳지 않아요', [
      ch('보기와 판단 기준', [{ at: 0, say: 'O는 외심이고 D, E, F는 세 변의 중점이에요.' }, { at: 6, say: '옳지 않은 보기를 찾되, 참인 이유와 반례를 구별해요.', step: 1 }]),
      ch('수직과 직각 보기', [{ at: 0, say: '① OD는 BC의 수직이등분선이므로 OD⊥BC예요.', step: 3 }, { at: 6, say: '③ 따라서 ∠ODB=90°도 참이에요.', step: 5 }]),
      ch('중점과 같은 밑각 보기', [{ at: 0, say: '④ D가 중점이므로 BD=CD는 참이에요.', step: 6 }, { at: 6, say: '⑤ OA=OB인 이등변삼각형이므로 두 밑각도 같아요.', step: 7 }]),
      ch('항상 같지 않은 각의 반례', [{ at: 0, say: '반례로 이 그림의 ∠A=60°, ∠C=55°를 보아요.' }, { at: 4, say: '∠AOB=110°, ∠BOC=120°로 서로 달라요.', step: 4, set: { trShowAnswer: true, trCalculationReady: true } }, { at: 8, say: '따라서 옳지 않은 것은 ② ∠AOB=∠BOC예요.', step: 8 }])
    ], { start: { trV: 2 } });
    const angle = v === 1;
    return make('외심의 반지름과 이등변삼각형', angle ? '밑각 구하기' : '반지름 길이', angle ? '∠OAB=35°' : 'OB=6 cm', [
      ch('조건과 구할 대상', [{ at: 0, say: angle ? 'O는 외심이고 ∠AOB=110°, ∠OAB=x예요.' : 'O는 외심이고 OA=6 cm, OB=x예요.' }, { at: 6, say: 'O에서 A, B까지의 선분은 같은 원의 반지름이에요.', step: 1 }]),
      ch('같은 반지름으로 관계 만들기', [{ at: 0, say: '수직이등분선의 성질에서 OA=OB를 얻어요.', step: angle ? 3 : 3 }, { at: 6, say: angle ? '△OAB의 같은 밑각을 x로 두면 2x+110°=180°예요.' : '구할 OB와 알려진 OA가 대응하는 같은 길이예요.', step: angle ? 4 : 3 }]),
      ch('구할 길이나 각 계산', [{ at: 0, say: angle ? '두 밑각의 합은 180°−110°=70°예요.' : '같은 반지름이므로 OB=OA=6 cm예요.', step: angle ? 4 : 4, set: angle ? { trCalculationReady: true } : { trCalculationReady: true, trShowAnswer: true } }, { at: 6, say: angle ? '같은 두 밑각으로 나누면 ∠OAB=70°÷2=35°예요.' : 'OA, OB, OC는 모두 같은 반지름 6 cm예요.', step: 6, set: { trShowAnswer: true } }])
    ], { start: { trV: v } });
  }
  lessons['t5-1'] = [circumcenterConcept('center'), circumcenterConcept('radii'), circumcenterProblem(0), circumcenterProblem(1), circumcenterProblem(2)];
  function rightCenterConcept() {
    return make('직각삼각형의 외심 위치', '외심 위치', '직각삼각형의 외심은 빗변 AB의 중점이에요', [
      ch('직각과 빗변 찾기', [{ at: 0, say: '∠C=90°이고 그 맞은편 AB가 빗변이에요.' }, { at: 6, say: '세 꼭짓점을 지나는 원과 빗변의 관계를 보아요.', step: 1 }]),
      ch('직각을 보는 지름', [{ at: 0, say: 'C에서 직각으로 보이는 빗변 AB는 원의 지름이에요.', step: 2 }, { at: 6, say: '지름을 반으로 나눈 점에서 A, B까지의 거리가 같아요.' }]),
      ch('세 꼭짓점까지 같은 거리', [{ at: 0, say: 'C까지도 같은 원의 반지름이 되어 OA=OB=OC예요.' }, { at: 6, say: '따라서 외심 O는 빗변 AB의 중점이에요.', step: 3, set: { trShowAnswer: true } }])
    ], { problem: false, concept: 'right' });
  }
  function rightCenterProblem(v) {
    const answers = ['OC=4 cm', '∠OCB=40°', 'AB=8 cm'];
    return make('직각삼각형의 외심으로 계산', ['반지름 길이', '∠OCB', '빗변 길이'][v], answers[v], [
      ch('주어진 직각과 외심', [{ at: 0, say: '∠C=90°이고 외심 O는 빗변 AB의 중점이에요.' }, { at: 6, say: ['AB=8 cm이며, 구할 길이는 OC예요.', '∠A=50°이며, 구할 각은 ∠OCB예요.', 'OC=4 cm이며, 구할 길이는 빗변 AB예요.'][v], step: 1 }]),
      ch('반지름으로 식 세우기', [{ at: 0, say: v === 1 ? 'OB=OC이므로 △OBC의 밑각은 같아요.' : 'OA, OB, OC는 같은 원의 반지름이에요.', step: 2 }, { at: 6, say: ['OA=AB÷2이고 OC=OA이므로 8을 반으로 나눠요.', '두 예각의 합이 90°이므로 ∠B=90°−50°예요.', 'OA=OB=OC=4 cm이므로 AB는 4+4예요.'][v], step: v === 2 ? 3 : 2, set: { trCalculationReady: true } }]),
      ch('요청한 길이나 각', [{ at: 0, say: ['OA=OB=8÷2=4 cm이고 OC도 같아요.', '∠B=40°이고 ∠OCB는 같은 밑각이에요.', '반지름 두 개를 이어 AB=4+4=8 cm예요.'][v], step: v === 0 ? 3 : v === 1 ? 3 : 4, set: { trShowAnswer: true } }, { at: 6, say: ['따라서 OC=4 cm가 정답이에요.', '따라서 ∠OCB=40°가 정답이에요.', '따라서 빗변 AB=8 cm가 정답이에요.'][v], step: 6 }])
    ], { start: { trV: v } });
  }
  lessons['t5-2'] = [rightCenterConcept(), rightCenterProblem(0), rightCenterProblem(1), rightCenterProblem(2)];
  function thirtyConcept() {
    return make('30°의 맞은편 변과 반지름', '30° 원리', 'BC=R=AB÷2', [
      ch('특별한 직각삼각형', [{ at: 0, say: '∠A=30°, ∠B=60°, ∠C=90°인 삼각형이에요.' }, { at: 6, say: 'O는 빗변 AB의 중점이고 R은 외접원의 반지름이에요.', step: 1 }]),
      ch('같은 반지름의 두 변', [{ at: 0, say: '△OBC에서 OB=OC=R이므로 두 밑각은 같아요.', step: 3 }, { at: 6, say: '한 밑각 ∠B가 60°라서 다른 두 각도 60°예요.', step: 4 }]),
      ch('정삼각형의 같은 세 변', [{ at: 0, say: '세 각이 60°인 △OBC는 정삼각형이에요.' }, { at: 6, say: '따라서 30°의 맞은편 BC=R=AB÷2예요.', step: 5, set: { trShowAnswer: true } }])
    ], { problem: false, concept: 'thirty' });
  }
  function thirtyProblem(v) {
    return make('30° 직각삼각형의 길이와 둘레', ['BC 길이', '빗변 길이', 'OBC 둘레'][v], ['BC=5 cm', 'AB=10 cm', '△OBC의 둘레=15 cm'][v], [
      ch('각과 알려진 길이', [{ at: 0, say: '∠A=30°, ∠B=60°, ∠C=90°이고 O는 외심이에요.' }, { at: 6, say: ['AB=10 cm에서 BC의 길이를 구해요.', 'BC=5 cm에서 빗변 AB의 길이를 구해요.', 'AB=10 cm에서 △OBC의 둘레를 구해요.'][v], step: 1 }]),
      ch('반지름과 60°를 연결', [{ at: 0, say: 'OB=OC인 △OBC의 두 밑각은 같아요.', step: 2 }, { at: 6, say: '세 각이 모두 60°이므로 △OBC는 정삼각형이에요.', step: 4 }]),
      ...(v === 2 ? [ch('세 변에 공통인 길이', [{ at: 0, say: 'O는 AB의 중점이므로 OB=10÷2=5 cm예요.', step: 3, set: { trCalculationReady: true } }, { at: 6, say: '정삼각형의 나머지 변 BC, OC도 5 cm예요.', step: 5 }])] : []),
      ch('물어본 길이나 둘레', [{ at: 0, say: ['BC는 빗변의 반이므로 10÷2=5 cm예요.', 'OB=BC=5 cm이고 AB=2×OB=10 cm예요.', '같은 세 변을 더하면 5+5+5=15 cm예요.'][v], step: 5, set: { trShowAnswer: true, trCalculationReady: true } }, { at: 6, say: ['따라서 BC=5 cm가 정답이에요.', '따라서 빗변 AB=10 cm가 정답이에요.', '따라서 △OBC의 둘레는 15 cm예요.'][v], step: 7 }])
    ], { start: { trV: v } });
  }
  lessons['t5-3'] = [thirtyConcept(), thirtyProblem(0), thirtyProblem(1), thirtyProblem(2)];
  function centerAnglesConcept(central) {
    const chapters = [
      ch('밑각 기호의 위치', [{ at: 0, say: 'x는 ∠OAB, y는 ∠OBC, z는 ∠OCA를 뜻해요.' }, { at: 6, say: 'OA=OB=OC이므로 세 작은 삼각형은 이등변이에요.', step: 3 }]),
      ch('같은 밑각끼리 연결', [{ at: 0, say: '각각의 이등변삼각형에서 같은 색 밑각은 같아요.', step: 4 }, { at: 6, say: '∠A=x+z, ∠B=x+y, ∠C=y+z로 묶어요.' }]),
      ch('세 내각의 합', [{ at: 0, say: '삼각형 ABC의 내각의 합을 쓰면 2(x+y+z)=180°예요.' }, { at: 6, say: '양변을 2로 나누어 x+y+z=90°를 얻어요.', step: 5, set: central ? { trCalculationReady: true } : { trShowAnswer: true, trCalculationReady: true } }])
    ];
    if (central) chapters.push(ch('중심에서 보는 각', [{ at: 0, say: '△OBC에서 ∠BOC=180°−2y로 나타내요.' }, { at: 6, say: '90°−y=x+z=∠A이므로 ∠BOC=2∠A예요.', step: 6, set: { trShowAnswer: true } }]));
    return make('외심의 밑각과 중심각 관계', central ? '중심각 원리' : '밑각의 합', central ? '∠BOC=2∠A' : 'x+y+z=90°', chapters,
      { problem: false, concept: central ? 'central' : 'sum', start: { trV: central ? 1 : 0 } });
  }
  function centerAnglesProblem(v) {
    return make('외심의 각을 같은 밑각으로 계산', ['∠OAB', '∠BOC', '∠ACB'][v], ['∠OAB=35°', '∠BOC=120°', '∠ACB=55°'][v], [
      ch('주어진 각과 구할 각', [{ at: 0, say: ['∠OBC=30°, ∠OCA=25°이고 ∠OAB를 구해요.', '∠A=60°이고 외심에서 보는 ∠BOC를 구해요.', '∠OAB=35°, ∠OBC=30°이고 ∠ACB를 구해요.'][v] }, { at: 6, say: 'OA=OB=OC이므로 세 이등변삼각형을 이용해요.', step: 3 }]),
      ch('같은 밑각으로 내각 표현', [{ at: 0, say: '각 이등변삼각형의 같은 밑각을 같은 색으로 묶어요.', step: 4 }, { at: 6, say: '서로 다른 세 밑각의 합은 내각의 합 180°의 반이에요.' }]),
      ch('계산에 필요한 관계', [{ at: 0, say: '따라서 서로 다른 세 밑각의 합은 90°예요.', step: 5, set: { trCalculationReady: true } }, { at: 6, say: ['구할 ∠OAB는 90°−30°−25°로 구해요.', '∠OBC=∠OCB=90°−60°=30°예요.', '∠OCA=90°−35°−30°=25°예요.'][v] }]),
      ch('구할 각에 계산 적용', [{ at: 0, say: ['계산하면 ∠OAB=35°가 정답이에요.', '∠BOC=180°−30°−30°=120°예요.', '∠ACB=∠OCB+∠OCA=30°+25°=55°예요.'][v], step: 6, set: { trShowAnswer: true } }, { at: 6, say: '그림의 x가 표시된 실제 각과 답을 맞춰 보세요.', step: 7 }])
    ], { start: { trV: v } });
  }
  lessons['t5-4'] = [centerAnglesConcept(false), centerAnglesConcept(true), centerAnglesProblem(0), centerAnglesProblem(1), centerAnglesProblem(2)];
  function obtuseCenterConcept() {
    return make('둔각삼각형의 외심 위치', '외심 위치', '둔각삼각형의 외심은 삼각형 밖에 있어요', [
      ch('둔각과 세 변', [{ at: 0, say: '∠A=112°인 둔각삼각형 ABC를 보아요.' }, { at: 6, say: '세 변의 중점에서 각 변에 수직인 선을 그어요.', step: 1 }]),
      ch('수직이등분선의 교점', [{ at: 0, say: '같은 눈금은 중점, 직각 표시는 수직이라는 뜻이에요.', set: { trBLabels: true } }, { at: 6, say: '세 수직이등분선을 연장해서 만나는 점을 확인해요.' }]),
      ch('삼각형에 대한 위치', [{ at: 0, say: '교점에서 세 꼭짓점까지의 거리는 모두 같아요.', step: 3 }, { at: 6, say: '그 교점인 외심 O는 변 BC 너머, 삼각형 밖에 있어요.', set: { trShowAnswer: true } }])
    ], { problem: false, concept: 'outside' });
  }
  function obtuseCenterProblem(v) {
    return make('둔각삼각형의 외심 각 계산', v ? '둔각 ∠A' : '∠BOC', v ? '∠A=112°' : '∠BOC=136°', [
      ch('둔각 조건과 구할 각', [{ at: 0, say: v ? '∠A는 둔각이고 ∠BOC=136°가 주어졌어요.' : '∠A=112°인 둔각이고 ∠BOC를 구해요.' }, { at: 6, say: '구하는 ∠BOC는 O의 두 반직선 사이 작은 각이에요.', step: 1 }]),
      ch('같은 반지름으로 두 삼각형', [{ at: 0, say: 'OA=OB=OC이므로 △OAB와 △OAC는 이등변이에요.', step: 3 }, { at: 6, say: '∠OAB=∠OBA=p, ∠OAC=∠OCA=q로 두어요.', step: 4 }]),
      ch('두 꼭지각을 더하는 전략', [{ at: 0, say: '∠A=p+q이고 각 꼭지각은 180°−2p, 180°−2q예요.' }, { at: 6, say: '이를 더하면 ∠BOC=360°−2∠A가 돼요.', step: 5, set: { trCalculationReady: true } }]),
      ch('둔각 조건에 맞게 계산', [{ at: 0, say: v ? '∠A=(360°−136°)÷2=112°가 정답이에요.' : '∠BOC=360°−2×112°=136°가 정답이에요.', step: 6, set: { trShowAnswer: true } }, { at: 6, say: v ? '112°는 둔각이므로 원래 조건에도 맞아요.' : '2×112°는 큰 쪽 각이며, 작은 쪽은 136°예요.', step: 7 }])
    ], { start: { trV: v } });
  }
  lessons['t5-5'] = [obtuseCenterConcept(), obtuseCenterProblem(0), obtuseCenterProblem(1)];
  function centerRatio(concept = false) {
    return make('중심각의 비와 같은 호', concept ? '비의 원리' : '∠ACB', concept ? '∠ACB=180°×a÷(a+b+c)' : '∠ACB=40°', [
      ch('비의 뜻과 구할 각', [{ at: 0, say: '중심각 ∠AOB:∠BOC:∠COA는 2:3:4예요.' }, { at: 6, say: concept ? '일반적인 비를 a:b:c라 두고 같은 호 AB를 살펴요.' : '∠ACB는 호 AB를 보는 각이므로 ∠AOB부터 구해요.', step: 1 }]),
      ch('한 바퀴를 비로 나누기', [{ at: 0, say: '중심각 세 개의 합은 한 바퀴 360°예요.', step: 2 }, { at: 6, say: concept ? '비의 합은 a+b+c이고, 이 그림에서는 2+3+4=9예요.' : '비의 합은 9라서 비 1은 360°÷9=40°예요.', step: 3, set: { trCalculationReady: true } }]),
      ch('중심각과 같은 호 확인', [{ at: 0, say: concept ? '∠AOB는 전체 360°의 a÷(a+b+c)만큼이에요.' : '∠AOB는 비 2이므로 40°×2=80°예요.', step: 4 }, { at: 6, say: '∠ACB는 같은 호 AB의 중심각 ∠AOB의 반이에요.', step: 5 }]),
      ch('원주에서 보는 각', [{ at: 0, say: concept ? '따라서 ∠ACB=180°×a÷(a+b+c)예요.' : '따라서 ∠ACB=80°÷2=40°가 정답이에요.', step: concept ? 5 : 6, set: { trShowAnswer: true } }, { at: 6, say: concept ? '비 2:3:4를 넣으면 180°×2÷9=40°예요.' : '비의 합은 360°에서 나누고 마지막에 반으로 나눠요.', step: 7 }])
    ], { problem: !concept, concept: concept ? 'ratio' : '' });
  }
  lessons['t5-6'] = [centerRatio(true), centerRatio(false)];
  function circlePerimeter(v, concept = false) {
    const circle = v === 1;
    const chapters = [
      ch('둘레와 기호의 뜻', [{ at: 0, say: 'O는 외심, △OBC의 둘레는 16 cm, BC=6 cm예요.' }, { at: 6, say: concept ? '반지름을 R, 삼각형 둘레를 L, BC의 길이를 a라 해요.' : circle ? '원의 둘레를 구하려면 반지름 R부터 알아야 해요.' : 'R은 외접원의 반지름이며 구할 길이예요.', step: 1 }]),
      ch('두 반지름과 남은 한 변', [{ at: 0, say: 'OB=OC=R이므로 둘레는 R+R+BC예요.', step: 3 }, { at: 6, say: concept ? '따라서 삼각형의 둘레 식은 2R+a=L이에요.' : '주어진 길이를 넣으면 2R+6=16이에요.', step: 4 }])
    ];
    if (circle) chapters.push(ch('원의 둘레에 필요한 반지름', [{ at: 0, say: '삼각형의 둘레에서 BC를 빼면 2R=16−6=10이에요.' }, { at: 6, say: '반지름은 R=10÷2=5 cm예요.', step: 5, set: { trCalculationReady: true } }]));
    chapters.push(ch(circle ? '원의 둘레 계산' : '반지름을 답하기', [{ at: 0, say: circle ? (concept ? '원의 둘레는 지름에 π를 곱하므로 2πR이에요.' : '원의 둘레는 2πR=2π×5=10π cm예요.') : concept ? '따라서 반지름은 R=(L−a)÷2로 구해요.' : '반지름은 R=(16−6)÷2=5 cm예요.', step: circle ? 6 : 5, set: { trShowAnswer: true, trCalculationReady: true } }, { at: 6, say: circle ? '이 그림의 외접원 둘레는 10π cm예요.' : '이 그림에서는 R=(16−6)÷2=5 cm예요.', step: circle ? 7 : 6 }]));
    return make('삼각형의 둘레로 외접원 구하기', concept ? circle ? '둘레 원리' : '반지름 원리' : circle ? '원의 둘레' : '반지름 계산', concept ? circle ? '원의 둘레=2πR' : 'R=(L−a)÷2' : circle ? '원의 둘레=10π cm' : 'R=5 cm', chapters,
      { problem: !concept, concept: concept ? circle ? 'circleRule' : 'radiusRule' : '', start: { trV: v } });
  }
  lessons['t5-7'] = [circlePerimeter(0, true), circlePerimeter(1, true), circlePerimeter(0), circlePerimeter(1)];
})();
