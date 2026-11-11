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
})();
