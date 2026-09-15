(function (root) {
    const svg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="520" height="460" viewBox="0 0 520 460"><rect x="2" y="2" width="516" height="456" fill="white" stroke="black"/><path d="M50 400 L260 50 L470 400 Z" fill="none" stroke="black" stroke-width="3"/><text x="246" y="35" font-size="24">A</text><text x="20" y="425" font-size="24">B</text><text x="477" y="425" font-size="24">C</text></svg>');
    const prompts = [
        '함수 $f(x)=2x+1$일 때 $f(3)$의 값을 구하시오.',
        Array.from({ length: 18 }, (_, i) => `${i + 1}번째 조건을 확인한다. 두 자연수의 합과 차를 비교하고 조건에 맞는 값을 구하시오.`).join(' '),
        '다음 식의 값을 구하시오. $$' + Array.from({ length: 18 }, (_, i) => `\\frac{x^{${i + 1}}+${i + 2}}{${i + 1}}`).join('+') + '$$',
        '그림에서 삼각형 $ABC$의 넓이를 구하시오.',
        '각 선택지의 조건을 확인하고 옳은 것을 고르시오.',
        '표를 읽고 $a+b$의 값을 구하시오.<div class="question-table-wrap"><table class="question-table"><tr><th>항목</th><th>첫째 값</th><th>둘째 값</th></tr><tr><td>$a$</td><td>$\\frac{123}{456}$</td><td>$2$</td></tr><tr><td>$b$</td><td>$3$</td><td>$4$</td></tr></table></div>',
        '다음 보기와 그림을 보고 옳은 것을 고르시오.<div class="question-note-box">ㄱ. $AB=AC$이다.<br>ㄴ. 세 내각의 합은 $180^{\\circ}$이다.<br>ㄷ. 조건에 맞는 수를 모두 찾는다.</div>',
        '슬롯 병합 힌트가 있어도 내용과 순서를 보존해야 한다. $x^2-3x+2=0$의 두 근의 합은?',
        '마지막 페이지의 나머지 세 칸도 동일 크기로 유지한다. $1+2+3$의 값은?'
    ];
    function makeBank(count = 9, special = true) {
        return Array.from({ length: count }, (_, i) => ({
            id: i + 1, sourceOrdinal: i + 1, sourceQuestionNo: i + 1, sourceQuestionUid: `equal-slot-${i + 1}`,
            content: `검증문항${String(i + 1).padStart(3, '0')} ${prompts[i % prompts.length]}`,
            choices: i % 9 === 4 ? Array.from({ length: 5 }, (_, n) => `${n + 1}번째 선택지는 $x^2+${n + 1}x+1$의 값이 양수이고 주어진 모든 조건을 만족한다.${n === 4 ? ' 선택끝' + String(i + 1).padStart(3, '0') : ''}`) : ['1', '$\\frac{2}{3}$', '3', '4', '선택끝' + String(i + 1).padStart(3, '0')],
            ...(i % 9 === 3 || i % 9 === 6 ? { image: svg, imageSize: 'full', imageAlt: '삼각형 ABC' } : {}),
            ...(special && i % 9 === 7 ? { layoutTag: 'subjective-2up' } : {}),
            answer: '3', solution: `검증해설${i + 1}. 조건을 정리하면 $x=3$이다.`
        }));
    }
    if (typeof module === 'object') module.exports = { makeBank };
    else root.questionBank = makeBank();
})(typeof window === 'undefined' ? globalThis : window);
