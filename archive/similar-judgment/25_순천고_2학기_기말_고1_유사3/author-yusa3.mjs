// 유사3 판정 작성 스크립트 (W 안). judgment/qNN.json 에 병합한다 (itemFingerprint·review 유지).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const W = path.dirname(fileURLToPath(import.meta.url));
const R = String.raw;
const S = (term, src, quote) => ({ term, src, quote });
const MN = (term, src, quote) => ({ term, src, quote, evidenceType: 'NAMED' });
const MI = (term, src, quote, justification) => ({ term, src, quote, evidenceType: 'IMPLIED', justification });

const U06 = ['H22-C2-06', 'H22-C2-06-CORE'];
const U07B = ['H22-C2-07', 'H22-C2-07-FUNCTION_BASIC'];
const U07C = ['H22-C2-07', 'H22-C2-07-FUNCTION_COMPOSITION'];
const U07I = ['H22-C2-07', 'H22-C2-07-FUNCTION_INVERSE'];
const U08 = ['H22-C2-08', 'H22-C2-08-FUNCTION_BASIC'];
const U09 = ['H22-C2-09', 'H22-C2-09-FUNCTION_BASIC'];

const D = {};

D[1] = {
  steps: [R`① 은 3^4=81 이고 4^3=64 이므로 3^4<4^3 은 거짓이지만 참·거짓이 정해진 명제이다.`, R`② x^2-4=0 은 x=2 이면 참, x=0 이면 거짓이라 조건이고 ③ 3x+1>7 도 x=3 이면 참, x=0 이면 거짓이라 조건이다.`, R`④ ‘덥다’ 는 기준이 불분명하고 ⑤ x+y=5 는 값에 따라 달라지므로 명제가 아니다. 따라서 명제인 것은 ①이다.`],
  ans: '①', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`다음 중 명제인 것은?`,
  rpm: 'H1-RPM-244', rpmReason: R`① 3^4=81 과 4^3=64 의 비교는 거짓이라도 참·거짓이 정해진 명제이고 나머지는 값이나 기준에 따라 달라지는 조건·모호한 문장이라, 이 구별 단계가 명제의 참·거짓 행이다.`,
  pt: 'PT_PROPOSITION_JUDGMENT', tpl: 'TPL_PROPOSITION_CONDITION_IDENTIFICATION',
  typeReason: R`보기 ①~⑤ 가운데 3^4=81, 4^3=64 처럼 참·거짓이 정해지면 명제, x=2, x=0 을 넣어 갈리면 조건이라 가려내는 것이 명제와 조건의 구별 템플릿이다.`,
  diff: [1, 'high', 'NONE'], diffReason: R`① 은 3^4=81, 4^3=64 의 비교만 하면 거짓인 명제이고 ② x=2, x=0 처럼 값을 넣어 나머지가 조건임을 알아보는 정의 확인이라 1단계이다.`,
  slots: {
    given: [S('부등식', 'choices', R`$3x+1\gt 7$`), S('방정식', 'choices', R`$x^2-4=0$`)],
    goal: [S('판정', 'stem', R`다음 중 명제인 것은?`)],
    method: [MI('대소비교', 'solution', R`$3^4=81$이고 $4^3=64$이므로 $3^4\lt 4^3$은 거짓인 명제이다.`, '3^4=81 과 4^3=64 의 크기를 비교해 3^4<4^3 이 거짓이지만 참·거짓이 정해짐을 확인한다.'), MI('수치대입법', 'solution', R`$x=2$이면 참이고 $x=0$이면 거짓이므로 조건이다.`, 'x 에 2 와 0 같은 값을 넣어 참·거짓이 갈리는지 확인해 조건임을 판정한다.')],
    condition: [],
  },
  how: R`보기 ①~⑤ 를 직접 읽고 ①만 3^4=81, 4^3=64 로 참·거짓이 정해진 (거짓인) 명제임을 확인했다. 해설도 같은 구별이라 명제의 참·거짓 행과 조건 식별 템플릿을 골랐다.`,
};

D[2] = {
  steps: [R`q: x^2-5x-6=0 은 (x+1)(x-6)=0 이므로 진리집합이 {-1, 6} 이다.`, R`p→q 의 역 q→p 가 참이려면 -1, 6 이 모두 |x-2|<=a 를 만족해야 한다.`, R`|-1-2|=3<=a 와 |6-2|=4<=a 에서 a>=4 이다.`, R`정수 a 의 최솟값은 4 이다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`명제 $p\to q$의 역이 참이 되도록 하는 정수 $a$의 최솟값은?`,
  rpm: 'H1-RPM-248', rpmReason: R`역 q→p 가 참이 되도록 하는 a 의 범위 a>=4 를 구하는 단계라 필요조건·충분조건의 매개변수 행이다.`,
  pt: 'PT_PROPOSITION_PARAMETER_CONDITION', tpl: 'TPL_CONVERSE_CONTRAPOSITIVE_ROOT_PARAMETER',
  typeReason: R`역 q→p 가 참이려면 방정식 x^2-5x-6=0 의 두 근 -1, 6 이 모두 |x-2|<=a 를 만족해야 한다는 조건으로 a 의 범위를 정하는 것이 역·대우와 방정식의 근 조건 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`방정식을 풀고 역으로 바꾼 뒤 |-1-2|<=a, |6-2|<=a 에서 a>=4 를 얻어 최소 정수를 고르는 3~4단계라 2단계로 본다.`,
  slots: {
    given: [S('조건', 'stem', R`$p:|x-2|\le a$`), S('방정식', 'stem', R`$q:x^2-5x-6=0$`)],
    goal: [S('최솟값', 'stem', R`정수 $a$의 최솟값은?`)],
    method: [MN('진리집합', 'solution', R`먼저 조건 $q$의 진리집합을 구한다.`), MN('역', 'solution', R`명제 $p\to q$의 역은 $q\to p$이므로`), MN('대입', 'solution', R`두 값을 부등식 $|x-2|\le a$에 각각 대입한다.`)],
    condition: [S('성립조건', 'solution', R`두 부등식을 동시에 만족해야 하므로`)],
  },
  how: R`q 의 진리집합 {-1, 6} 에서 역 q→p 가 참이 되는 a>=4 를 직접 얻어 정수 최솟값 4 로 보기 ③과 맞췄다. 해설의 결정적 단계가 역과 매개변수 범위라 RPM-248 과 역 근 조건 템플릿을 골랐다.`,
};

D[3] = {
  steps: [R`sqrt(2x+5) 가 실수이려면 2x+5>=0 이므로 x>=-5/2 이다.`, R`1/sqrt(4-x) 가 실수이려면 분모의 근호 안이 양수라 4-x>0 이므로 x<4 이다.`, R`-5/2<=x<4 의 정수는 -2, -1, 0, 1, 2, 3 이므로 6개이다.`],
  ans: '⑤', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U09,
  unitEv: R`두 무리식 $\sqrt{2x+5}$와 $\dfrac{1}{\sqrt{4-x}}$의 값이 모두 실수가 되도록 하는 정수 $x$의 개수는?`,
  rpm: 'H1-RPM-268', rpmReason: R`2x+5>=0 과 4-x>0 으로 x 의 범위 -5/2<=x<4 를 정하는 단계가 무리식의 근호 안 조건, 즉 정의역 조건 행이다.`,
  pt: 'PT_RADICAL_EXPRESSION', tpl: 'TPL_RADICAL_REAL_VALUE_RANGE',
  typeReason: R`sqrt(2x+5) 의 2x+5>=0, 분모 sqrt(4-x) 의 4-x>0 으로 두 무리식이 실수가 되는 x 의 범위 -5/2<=x<4 를 구하는 것이 무리식이 실수가 되는 범위 템플릿이다.`,
  diff: [1, 'high', 'B12'], diffReason: R`근호 안 2x+5>=0, 분모 4-x>0 두 조건을 바로 쓰고 정수 -2~3 의 개수 6 을 세는 1단계 계산이다.`,
  slots: {
    given: [S('무리식', 'stem', R`두 무리식 $\sqrt{2x+5}$와 $\dfrac{1}{\sqrt{4-x}}$`)],
    goal: [S('개수', 'stem', R`정수 $x$의 개수는?`)],
    method: [MN('근호', 'solution', R`$\sqrt{2x+5}$의 값이 실수가 되려면 근호 안이 $0$ 이상이어야 한다.`), MI('열거', 'solution', R`이 범위에 속하는 정수 $x$는 $-2$, $-1$, $0$, $1$, $2$, $3$이므로 개수는 $6$이다.`, '범위 -5/2<=x<4 안의 정수를 하나씩 늘어놓아 개수를 센다.')],
    condition: [S('범위', 'solution', R`두 조건을 동시에 만족하는 $x$의 범위는 다음과 같다.`)],
  },
  how: R`두 무리식이 실수가 되는 범위 -5/2<=x<4 의 정수 -2~3, 6개를 직접 구해 보기 ⑤와 맞췄다. 해설의 결정적 단계가 근호 안 조건이라 무리함수 단원의 정의역 조건 행과 무리식 실수 범위 템플릿을 골랐다.`,
};

D[4] = {
  steps: [R`그림에서 g(5)=7 이므로 g^{-1}(7)=5 이다.`, R`그림에서 f(3)=6 이고 g(6)=8 이므로 (g∘f)(3)=g(6)=8 이다.`, R`g^{-1}(7)+(g∘f)(3)=5+8=13 이다.`],
  ans: '⑤', fig: ['NEEDS_FIGURE', R`다음 그림은 두 일대일대응 $f:X\to Y$, $g:Y\to Z$를 나타낸 것이다.`], sfig: ['NONE', ''], unit: U07C,
  unitEv: R`$g^{-1}(7)+(g\circ f)(3)$의 값은?`,
  rpm: 'H1-RPM-253', rpmReason: R`그림의 대응으로 (g∘f)(3)=g(f(3))=g(6)=8 을 계산하고 g^{-1}(7)=5 와 더하는 단계라 합성함수 계산 행이다.`,
  pt: 'PT_COMPOSITION_EVALUATION', tpl: 'TPL_COMPOSITION_VALUE_MAPPING',
  typeReason: R`대응도에서 g(5)=7, f(3)=6, g(6)=8 을 읽어 g^{-1}(7)+(g∘f)(3)=5+8=13 을 얻는 것이 대응도에서 합성함숫값을 계산하는 템플릿이다.`,
  diff: [1, 'high', 'B12'], diffReason: R`그림에서 g(5)=7, f(3)=6, g(6)=8 세 화살표를 읽어 5+8=13 을 더하는 두세 단계라 1단계로 본다.`,
  slots: {
    given: [S('일대일대응', 'stem', R`두 일대일대응 $f:X\to Y$, $g:Y\to Z$`)],
    goal: [S('값', 'stem', R`$g^{-1}(7)+(g\circ f)(3)$의 값은?`)],
    method: [MI('역함수', 'solution', R`먼저 $g^{-1}(7)$을 구하기 위해 $g(y)=7$을 만족시키는 $Y$의 원소 $y$를 찾는다.`, 'g^{-1}(7) 을 g(y)=7 인 y 로 읽는 역함수의 정의로 5 를 구한다.'), MI('합성함수', 'solution', R`다음으로 $(g\circ f)(3)$을 구한다.`, 'f(3) 을 먼저 구한 뒤 g 에 넣는 합성 순서로 (g∘f)(3) 을 계산한다.')],
    condition: [],
  },
  how: R`그림의 화살표에서 g(5)=7, f(3)=6, g(6)=8 을 읽어 5+8=13 을 직접 얻어 ⑤와 맞췄다. 해설도 대응도로 역함숫값과 합성값을 읽으므로 RPM-253 과 대응도 합성 템플릿을 골랐다.`,
};

D[5] = {
  steps: [R`‘어떤 실수 x’ 의 부정은 ‘모든 실수 x’ 이다.`, R`x<=-2 또는 x>3 의 부정은 ‘또는’ 이 ‘이고’ 로 바뀌고 부등호가 반대가 되어 x>-2 이고 x<=3 이다.`, R`따라서 부정은 모든 실수 x 에 대하여 x>-2 이고 x<=3 이고 이는 ③이다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`어떤 실수 $x$에 대하여 $x\le -2$ 또는 $x\gt 3$이다.`,
  rpm: 'H1-RPM-246', rpmReason: R`‘어떤 실수 x 에 대하여 x<=-2 또는 x>3’ 을 ‘모든 실수 x 에 대하여 x>-2 이고 x<=3’ 으로 바꾸는 명제 변환 단계가 이 행이다.`,
  pt: 'PT_QUANTIFIER_NEGATION', tpl: 'TPL_QUANTIFIER_NEGATION_INTERVAL',
  typeReason: R`어떤→모든으로 바꾸고 조건 x<=-2 또는 x>3 을 x>-2 이고 x<=3 으로 부정하는 것이 양화명제의 부정과 구간 템플릿이다.`,
  diff: [1, 'high', 'NONE'], diffReason: R`‘어떤’→‘모든’ 과 ‘또는’→‘이고’ 규칙을 x<=-2, x>3 에 바로 적용하는 한 단계라 1단계이다.`,
  slots: {
    given: [S('명제', 'stem', R`어떤 실수 $x$에 대하여 $x\le -2$ 또는 $x\gt 3$이다.`)],
    goal: [S('부정', 'stem', R`의 부정은?`)],
    method: [MI('드모르간법칙', 'solution', R`‘또는’은 ‘이고’로 바뀌고 각 부등호의 방향이 반대로 바뀐다.`, '‘또는’ 의 부정이 ‘이고’ 가 되는 부정 규칙을 x<=-2 와 x>3 에 적용한다.')],
    condition: [S('양화', 'solution', R`‘모든 실수 $x$에 대하여’이다.`)],
  },
  how: R`‘어떤’ 을 ‘모든’ 으로, x<=-2 또는 x>3 의 ‘또는’ 을 ‘이고’ 로 바꾸어 직접 부정을 만들고 보기 ③과 맞췄다. 부정 변환 단계라 명제 변환 행과 양화명제 부정 구간 템플릿을 골랐다.`,
};

D[6] = {
  steps: [R`¬p 가 q 이기 위한 충분조건이면 ¬p→q 가 참이므로 P^c ⊂ Q 이다.`, R`P^c ⊂ Q 의 양변에 P 와의 합집합을 취하면 P∪P^c ⊂ P∪Q 이므로 U ⊂ P∪Q 이고 P∪Q=U 이다.`, R`양변의 여집합을 취하면 드모르간 법칙에 의해 (P∪Q)^c=P^c∩Q^c=∅ 이므로 보기 ⑤이다.`],
  ans: '⑤', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$\neg p$가 $q$이기 위한 충분조건일 때, 다음 중 항상 옳은 것은?`,
  rpm: 'H1-RPM-247', rpmReason: R`¬p 가 q 이기 위한 충분조건이라는 조건 관계를 ¬p→q, 즉 P^c ⊂ Q 로 읽는 단계라 조건 관계 행이다.`,
  pt: 'PT_NEC_SUFF_RELATION', tpl: 'TPL_NEC_SUFF_SET_RELATION',
  typeReason: R`충분조건 ¬p→q 를 진리집합의 포함 P^c ⊂ Q 로 바꾸고 합집합 P∪Q=U 와 드모르간으로 P^c∩Q^c=∅ 를 얻는 것이 집합과 필요충분조건 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`충분조건을 P^c ⊂ Q 로 바꾸고 합집합 P∪Q=U, 여집합 P^c∩Q^c=∅ 로 이어 가는 집합 변형 세 단계라 2단계이다.`,
  slots: {
    given: [S('진리집합', 'stem', R`두 조건 $p$, $q$의 진리집합을 각각 $P$, $Q$라 하자.`), S('전체집합', 'stem', R`전체집합 $U$에 대하여`)],
    goal: [S('판정', 'stem', R`다음 중 항상 옳은 것은?`)],
    method: [MN('포함관계', 'solution', R`따라서 진리집합 사이의 포함 관계는 다음과 같다.`), MN('합집합', 'solution', R`$P^c\subseteq Q$의 양변에 $P$와의 합집합을 취하면 다음과 같다.`), MN('드모르간법칙', 'solution', R`드모르간 법칙에 의해 항상 다음이 성립한다.`)],
    condition: [S('충분조건', 'stem', R`$\neg p$가 $q$이기 위한 충분조건일 때`)],
  },
  how: R`충분조건 ¬p→q 에서 P^c ⊂ Q 를 얻고 합집합·여집합으로 P^c∩Q^c=∅ 가 항상 성립함을 직접 보여 ⑤와 맞췄다. 해설의 결정적 단계가 충분조건의 집합 포함 번역이라 RPM-247 과 필요충분조건 집합 템플릿을 골랐다.`,
};

D[7] = {
  steps: [R`근호 안 2x+a>=0 에서 정의역이 x>=-a/2 이고 이것이 x>=-3 이므로 a=6 이다.`, R`y=-sqrt(2x+6)+b 가 점 (5,-1) 을 지나므로 -1=-sqrt(16)+b=-4+b 에서 b=3 이다.`, R`sqrt(2x+6)>=0 이므로 y=-sqrt(2x+6)+3<=3 이라 k=3 이다.`, R`a+b+k=6+3+3=12 이다.`],
  ans: '②', fig: ['SELF_CONTAINED', R`그래프가 점 $(5,-1)$을 지날 때`], sfig: ['NONE', ''], unit: U09,
  unitEv: R`함수 $y=-\sqrt{2x+a}+b$의 정의역이 $\{x\mid x\ge -3\}$이고`,
  rpm: 'H1-RPM-268', rpmReason: R`근호 안 2x+a>=0 의 해가 x>=-3 이 되도록 a=6 을 정하는 단계가 무리함수의 정의역 조건 행이다.`,
  pt: 'PT_DOMAIN_RANGE_SURJECTIVITY', tpl: 'TPL_FUNCTION_DOMAIN_RANGE_PARAMETER',
  typeReason: R`정의역 x>=-3 에서 a=6, 점 (5,-1) 에서 b=3, 치역 y<=3 에서 k=3 을 정하는 것이 정의역·치역의 매개변수 조건 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`정의역으로 a=6, 점 (5,-1) 로 b=3, 치역으로 k=3 을 차례로 구하고 a+b+k=12 를 더하는 네 단계라 2단계이다.`,
  slots: {
    given: [S('정의역', 'stem', R`정의역이 $\{x\mid x\ge -3\}$`), S('통과', 'stem', R`그래프가 점 $(5,-1)$을 지날 때`)],
    goal: [S('값', 'stem', R`$a+b+k$의 값은?`)],
    method: [MN('근호', 'solution', R`근호 안의 식이 $0$ 이상이어야 하므로 $2x+a\ge 0$에서 정의역은 다음과 같다.`), MN('대입', 'solution', R`그래프가 점 $(5,-1)$을 지나므로 대입한다.`)],
    condition: [S('경계조건', 'solution', R`정의역이 $\{x\mid x\ge -3\}$이므로 경계값을 비교한다.`)],
  },
  how: R`정의역 x>=-3 에서 a=6, 점 (5,-1) 에서 b=3, 치역 y<=3 에서 k=3 을 직접 얻어 a+b+k=12 로 보기 ②와 맞췄다. 해설의 결정적 단계가 정의역(근호 안 조건)과 점·치역으로 매개변수를 정하는 것이라 RPM-268 과 정의역·치역 매개변수 템플릿을 골랐다.`,
};

D[8] = {
  steps: [R`f(x)=-2x+k 는 기울기 -2<0 이므로 감소함수이다.`, R`X={x|-1<=x<=3} 에서 치역이 Y={y|a<=y<=7} 이려면 f(-1)=7 이고 f(3)=a 이어야 한다.`, R`f(-1)=2+k=7 에서 k=5 이고 a=f(3)=-6+5=-1 이다.`, R`a+k=-1+5=4 이다.`],
  ans: '④', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07B,
  unitEv: R`$X$에서 $Y$로의 함수 $f(x)=-2x+k$가 일대일대응일 때`,
  rpm: 'H1-RPM-257', rpmReason: R`X 에서 Y 로 가는 f(x)=-2x+k 가 일대일대응이 되도록 감소함수의 두 끝점값 f(-1)=7, f(3)=a 를 쓰는 단계라 일대일함수 행이다.`,
  pt: 'PT_ONE_TO_ONE_BIJECTION', tpl: 'TPL_AFFINE_INTERVAL_BIJECTION',
  typeReason: R`닫힌구간 -1<=x<=3 에서 a<=y<=7 로 가는 일차함수가 일대일대응이려면 감소하고 f(-1)=7, f(3)=a 이어야 한다는 조건으로 k=5, a=-1 을 정하는 것이 일차함수의 구간 일대일대응 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`감소 조건을 알아낸 뒤 f(-1)=7 로 k=5, f(3)=a 로 a=-1 을 얻어 a+k=4 를 구하는 세 단계라 2단계이다.`,
  slots: {
    given: [S('집합', 'stem', R`두 집합 $X=\{x\mid -1\le x\le 3\}$, $Y=\{y\mid a\le y\le 7\}$`), S('일차함수', 'stem', R`함수 $f(x)=-2x+k$`)],
    goal: [S('값', 'stem', R`$a+k$의 값은?`)],
    method: [MN('증가감소', 'solution', R`$f(x)=-2x+k$는 기울기가 $-2\lt 0$이므로 감소함수이다.`), MN('최댓값', 'solution', R`$x=-1$에서 최댓값 $7$을`)],
    condition: [],
  },
  how: R`감소함수 f(x)=-2x+k 에서 f(-1)=7, f(3)=a 로 k=5, a=-1 을 직접 얻어 a+k=4 로 ④와 맞췄다. 해설도 감소 조건과 끝점값이라 RPM-257 과 일차함수의 구간 일대일대응 템플릿을 골랐다.`,
};

D[9] = {
  steps: [R`x<1 에서 f(x)=3x+a 는 증가하므로 치역은 y<3+a 이다.`, R`역함수가 있으려면 일대일대응이므로 x>=1 에서 b>0 이고 치역이 y>=4 이며 경계가 같아 3+a=4, a=1 이다.`, R`f(x)=5 는 x>=1 에서 b(x-1)^2+4=5, x=1+1/sqrt(b) 이므로 f^{-1}(5)=1+1/sqrt(b) 이다.`, R`b 는 양의 정수라 b=1 일 때 f^{-1}(5) 의 최댓값 2 이고 a+f^{-1}(5) 의 최댓값은 1+2=3 이다.`],
  ans: '②', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07B,
  unitEv: R`가 실수 전체의 집합에서 정의된 역함수 $f^{-1}(x)$를 가질 때, $a+f^{-1}(5)$의 최댓값은?`,
  rpm: 'H1-RPM-257', rpmReason: R`역함수를 가지려면 x<1 과 x>=1 의 두 치역이 y<3+a 와 y>=4 로 이어지는 일대일대응이어야 한다는 단계가 일대일함수 행이다.`,
  pt: 'PT_ONE_TO_ONE_BIJECTION', tpl: 'TPL_PIECEWISE_RANGE_STITCH_BIJECTION',
  typeReason: R`조각함수 3x+a (x<1), b(x-1)^2+4 (x>=1) 의 두 치역을 3+a=4 에서 이어 붙여 일대일대응이 되도록 a=1, b>0 을 정하는 것이 조각함수의 일대일대응 조건 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`x<1 치역 y<3+a, x>=1 에서 b>0 과 y>=4, 경계 3+a=4 로 a=1 을 얻고 f^{-1}(5)=1+1/sqrt(b) 의 b=1 최댓값 2 로 1+2=3 을 구하는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('조각함수', 'stem', R`3x+a&(x\lt 1)`), S('정수', 'stem', R`두 정수 $a$, $b$에 대하여 함수`)],
    goal: [S('최댓값', 'stem', R`$a+f^{-1}(5)$의 최댓값은?`)],
    method: [MN('일대일대응', 'solution', R`실수 전체의 집합에서 역함수를 가지려면 $f$가 일대일대응이어야 한다.`), MN('증가감소', 'solution', R`$x\lt 1$인 구간에서 $f(x)=3x+a$는 증가함수이므로 치역은 $\{y\mid y\lt 3+a\}$이다.`)],
    condition: [S('경계조건', 'solution', R`경계값이 같아야 한다.`)],
  },
  how: R`x<1 치역 y<3+a 와 x>=1 치역 y>=4 를 3+a=4 로 이어 a=1, f^{-1}(5)=1+1/sqrt(b) 의 최대 2 로 a+f^{-1}(5)=3 을 직접 구해 ②와 맞췄다. 해설의 결정적 단계가 조각함수 두 치역의 이음이라 RPM-257 과 조각함수 일대일대응 템플릿을 골랐다.`,
};

D[10] = {
  steps: [R`그림에서 점선으로 y=x 를 이용하면 f(a)=b, f(b)=c, f(c)=d, f(d)=e 이다.`, R`역함수의 정의로 f^{-1}(c)=b 이고 f^{-1}(b)=a 이다.`, R`(f^{-1}∘f^{-1})(c)=f^{-1}(f^{-1}(c))=f^{-1}(b)=a 이다.`],
  ans: '①', fig: ['NEEDS_FIGURE', R`함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때`], sfig: ['NONE', ''], unit: U07I,
  unitEv: R`$(f^{-1}\circ f^{-1})(c)$의 값은?`,
  rpm: 'H1-RPM-255', rpmReason: R`그래프에서 f(b)=c, f(a)=b 를 읽어 f^{-1}(c)=b, f^{-1}(b)=a 로 역함숫값을 두 번 구하는 단계라 역함수 구하기 행이다.`,
  pt: 'PT_INVERSE_VALUE', tpl: 'TPL_INVERSE_VALUE_GRAPH_MAPPING',
  typeReason: R`y=x 를 이용한 점선 그림에서 f(b)=c, f(a)=b 를 읽어 f^{-1}(c)=b, f^{-1}(b)=a 로 (f^{-1}∘f^{-1})(c)=a 를 구하는 것이 그래프에서 역함숫값을 읽는 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`그림에서 a→b→c 대응을 읽고 역함수로 c→b→a 두 번 거꾸로 가 a 를 얻는 두세 단계라 2단계이다.`,
  slots: {
    given: [S('그래프', 'stem', R`함수 $y=f(x)$의 그래프와 직선 $y=x$가`)],
    goal: [S('값', 'stem', R`$(f^{-1}\circ f^{-1})(c)$의 값은?`)],
    method: [MN('그래프', 'solution', R`그래프의 점선을 따라 직선 $y=x$를 이용해 함숫값을 읽으면 다음과 같다.`), MN('정의', 'solution', R`역함수의 정의에 의해 $f^{-1}(c)$는 $f(x)=c$를 만족시키는 $x$이므로 다음과 같다.`)],
    condition: [],
  },
  how: R`그림의 점선으로 f(a)=b, f(b)=c 를 읽고 f^{-1}(c)=b, f^{-1}(b)=a 로 (f^{-1}∘f^{-1})(c)=a 를 직접 구해 ①과 맞췄다. 해설도 그래프에서 역함숫값을 읽으므로 RPM-255 와 그래프 역함숫값 템플릿을 골랐다.`,
};

D[11] = {
  steps: [R`(P∪Q)^c∪(P∩R)=∅ 이므로 (P∪Q)^c=∅, P∩R=∅ 이다.`, R`(P∪Q)^c=∅ 에서 P∪Q=U 이므로 P^c ⊂ Q 이고, P∩R=∅ 에서 R ⊂ P^c 이므로 R ⊂ P^c ⊂ Q 이다.`, R`ㄱ p→¬r: P ⊂ R^c 라 참, ㄴ q→¬p: Q ⊂ P^c 라 할 수 없어 거짓, ㄷ r→q: R ⊂ Q 라 참이다.`, R`항상 참인 것은 ㄱ, ㄷ 이므로 ③이다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$(P\cup Q)^c\cup(P\cap R)=\varnothing$일 때, 다음 보기에서 항상 참인 명제만을 있는 대로 고른 것은?`,
  rpm: 'H1-RPM-243', rpmReason: R`(P∪Q)^c∪(P∩R)=∅ 에서 진리집합 R ⊂ P^c ⊂ Q 의 포함 관계를 얻는 단계라 진리집합 행이다. 보기 q-box 의 ㄱㄴㄷ 판정이 이어진다.`,
  pt: 'PT_TRUTH_SET_RELATION', tpl: 'TPL_TRUTHSET_CHAINED_INCLUSION',
  typeReason: R`집합식 (P∪Q)^c∪(P∩R)=∅ 에서 R ⊂ P^c ⊂ Q 의 연쇄 포함을 만들어 ㄱ p→¬r, ㄴ q→¬p, ㄷ r→q 의 참·거짓을 가르는 것이 진리집합의 연쇄 포함 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`합집합이 공집합임에서 P∪Q=U 와 P∩R=∅ 를 따로 끌어내 R ⊂ P^c ⊂ Q 를 만든 뒤 ㄱ·ㄴ·ㄷ 세 명제를 판정하는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('진리집합', 'stem', R`세 조건 $p$, $q$, $r$의 진리집합을 각각 $P$, $Q$, $R$이라 하자.`), S('공집합', 'stem', R`$(P\cup Q)^c\cup(P\cap R)=\varnothing$`)],
    goal: [S('판정', 'stem', R`항상 참인 명제만을 있는 대로 고른 것은?`)],
    method: [MN('합집합', 'solution', R`주어진 합집합이 공집합이므로 두 집합이 모두 공집합이어야 한다.`), MI('포함관계', 'solution', R`둘째 식에서 $P$와 $R$은 서로소이므로 $P\subseteq R^c$이고 $R\subseteq P^c$가 성립한다.`, '서로소 조건을 P ⊂ R^c, R ⊂ P^c 의 포함 관계로 바꿔 ㄱㄴㄷ 을 판정한다.')],
    condition: [S('서로소', 'solution', R`$P$와 $R$은 서로소이므로`)],
  },
  how: R`합집합이 공집합임에서 P∪Q=U, P∩R=∅ 를 얻어 R ⊂ P^c ⊂ Q 로 ㄱ·ㄷ 만 항상 참임을 직접 판정해 ③과 맞췄다. 해설의 결정적 단계가 진리집합의 연쇄 포함이라 RPM-243 과 진리집합 연쇄 포함 템플릿을 골랐다.`,
};

D[12] = {
  steps: [R`f^{-1}(1) 을 구하려면 f(2x+3)=x-1 의 우변이 1 인 x 를 찾는다. x-1=1 이므로 x=2 이고 f(7)=1 이라 f^{-1}(1)=7 이다.`, R`f^{-1}(7) 을 구하려면 x-1=7 이므로 x=8 이고 f(19)=7 이라 f^{-1}(7)=19 이다.`, R`(f^{-1}∘f^{-1})(1)=f^{-1}(f^{-1}(1))=f^{-1}(7)=19 이다.`],
  ans: '②', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07I,
  unitEv: R`일차함수 $f(x)$의 역함수가 $f^{-1}(x)$이고 $f(2x+3)=x-1$을 만족시킬 때`,
  rpm: 'H1-RPM-255', rpmReason: R`f(2x+3)=x-1 에서 f(7)=1, f(19)=7 을 얻어 f^{-1}(1)=7, f^{-1}(7)=19 로 읽는 단계라 역함수 구하기 행이다.`,
  pt: 'PT_INVERSE_VALUE', tpl: 'TPL_INVERSE_VALUE_DIRECT',
  typeReason: R`f(2x+3)=x-1 의 우변을 1, 7 로 맞춰 f(7)=1, f(19)=7 을 얻고 역함수의 정의로 f^{-1}(1)=7, f^{-1}(7)=19 를 직접 구하는 것이 역함숫값 직접 구하기 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`x-1=1 에서 x=2 로 f^{-1}(1)=7 을, x-1=7 에서 x=8 로 f^{-1}(7)=19 를 구하는 같은 절차 두 번이라 2단계이다.`,
  slots: {
    given: [S('일차함수', 'stem', R`일차함수 $f(x)$의 역함수가 $f^{-1}(x)$이고`), S('함수식', 'stem', R`$f(2x+3)=x-1$을 만족시킬 때`)],
    goal: [S('값', 'stem', R`$(f^{-1}\circ f^{-1})(1)$의 값은?`)],
    method: [MN('정의', 'solution', R`따라서 역함수의 정의에 의해 $f^{-1}(1)=7$이다.`), MN('대입', 'solution', R`$x=2$를 식에 대입하면 다음과 같다.`)],
    condition: [],
  },
  how: R`f(2x+3)=x-1 에 x=2, x=8 을 대입해 f(7)=1, f(19)=7 을 얻고 f^{-1}(1)=7, f^{-1}(7)=19 로 직접 구해 ②와 맞췄다. 해설의 결정적 단계가 역함수의 정의로 값을 읽는 것이라 RPM-255 와 역함숫값 직접 구하기 템플릿을 골랐다.`,
};

D[13] = {
  steps: [R`그림에서 수직 점근선이 x=-2 이므로 x=-c 에서 c=2 이다.`, R`수평 점근선이 y=3 이므로 a=3 이다.`, R`점 (0,1) 을 지나므로 f(0)=b/2=1 에서 b=2 이고 f(x)=(3x+2)/(x+2) 이다.`, R`f^{-1}(4)=k 면 f(k)=4 이므로 (3k+2)/(k+2)=4, 3k+2=4k+8 에서 k=-6 이다.`],
  ans: '④', fig: ['NEEDS_FIGURE', R`함수 $f(x)=\dfrac{ax+b}{x+c}$의 그래프가 다음 그림과 같을 때`], sfig: ['NONE', ''], unit: U08,
  unitEv: R`유리함수 $f(x)=\dfrac{ax+b}{x+c}$의 수직 점근선은 분모가 $0$이 되는 $x=-c$이다.`,
  rpm: 'H1-RPM-263', rpmReason: R`그림의 점근선 x=-2, y=3 과 점 (0,1) 로 c=2, a=3, b=2 를 정해 식을 결정하는 단계가 유리함수 식 결정 행이다.`,
  pt: 'PT_FUNCTION_RECOVERY', tpl: 'TPL_FUNCTION_FORM_FROM_ASYMPTOTE_POINT',
  typeReason: R`점근선 x=-2, y=3 과 지나는 점 (0,1) 에서 f(x)=(3x+2)/(x+2) 를 정하는 것이 점근선과 한 점으로 함수식 구하기 템플릿이다.`,
  diff: [2, 'medium', 'B23'], diffReason: R`두 점근선으로 c=2, a=3 을 얻고 점 (0,1) 로 b=2 를 구한 뒤 f(k)=4 를 풀어 k=-6 을 얻는 네 단계라 2단계로 본다.`,
  slots: {
    given: [S('그래프', 'stem', R`함수 $f(x)=\dfrac{ax+b}{x+c}$의 그래프가`)],
    goal: [S('값', 'stem', R`$f^{-1}(4)$의 값은?`)],
    method: [MN('점근선', 'solution', R`수평 점근선은 분자와 분모의 $x$의 계수의 비인 $y=a$이다.`), MN('대입', 'solution', R`$f^{-1}(4)=k$라 하면 $f(k)=4$이므로 대입하여 $k$를 구한다.`)],
    condition: [S('통과', 'solution', R`그래프가 점 $(0,1)$을 지나므로 $f(0)=1$이다.`)],
  },
  how: R`그림의 점근선 x=-2, y=3 과 점 (0,1) 에서 f(x)=(3x+2)/(x+2), f^{-1}(4)=-6 을 직접 구해 ④와 맞췄다. 해설의 결정적 단계가 점근선과 한 점으로 식을 정하는 것이라 RPM-263 과 점근선과 한 점 템플릿을 골랐다.`,
};

D[14] = {
  steps: [R`y=k/(x-3)+2 의 점근선은 x=3, y=2 이고 k>0 이면 x>3 에서 y>2 라 제1사분면만 지난다.`, R`x<3 에서 y 는 x 가 커질수록 줄어드므로 x<0 에서 y>f(0) 이다.`, R`제3사분면을 지나지 않으려면 f(0)=-k/3+2>=0 이어야 하므로 k<=6 이다.`, R`자연수 k 의 최댓값은 6 이다.`],
  ans: '④', fig: ['SELF_CONTAINED', R`그래프가 제$3$사분면을 지나지 않도록`], sfig: ['NONE', ''], unit: U08,
  unitEv: R`유리함수 $y=\dfrac{k}{x-3}+2$의 그래프가 제$3$사분면을 지나지 않도록 하는 자연수 $k$의 최댓값은?`,
  rpm: 'H1-RPM-262', rpmReason: R`y=k/(x-3)+2 가 제3사분면을 지나지 않도록 y절편 f(0)=-k/3+2>=0 을 따지는 단계가 그래프의 사분면 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_QUADRANT', tpl: 'TPL_FUNCTION_QUADRANT_PARAMETER',
  typeReason: R`y=k/(x-3)+2 가 제3사분면을 지나지 않도록 x=0 일 때의 y절편 -k/3+2>=0, 즉 k<=6 으로 매개변수 k 의 범위를 정하는 것이 매개변수에 따른 사분면 조건 템플릿이다.`,
  diff: [2, 'medium', 'B23'], diffReason: R`점근선 x=3, y=2 와 x<0 에서 y>f(0) 를 알아 f(0)=-k/3+2>=0 으로 k<=6 을 얻는 세 단계라 2단계로 본다.`,
  slots: {
    given: [S('유리함수', 'stem', R`유리함수 $y=\dfrac{k}{x-3}+2$`)],
    goal: [S('최댓값', 'stem', R`자연수 $k$의 최댓값은?`)],
    method: [MN('점근선', 'solution', R`주어진 유리함수의 두 점근선은 $x=3$과 $y=2$이다.`), MN('증가감소', 'solution', R`$x\lt 3$인 구간에서 $x$가 증가할수록 함숫값 $y$는 감소한다.`)],
    condition: [S('통과', 'solution', R`그래프가 제$3$사분면을 지나지 않으려면`), S('절편', 'solution', R`$x=0$일 때의 함숫값($y$절편)이 $0$ 이상이어야 한다.`)],
  },
  how: R`점근선 x=3, y=2 와 x<0 에서 y>f(0) 로 제3사분면을 피하려면 f(0)=-k/3+2>=0, k<=6 이라 최댓값 6 을 직접 얻어 ④와 맞췄다. 해설의 결정적 단계가 사분면 조건이라 RPM-262 와 사분면 매개변수 조건 템플릿을 골랐다.`,
};

D[15] = {
  steps: [R`f(x)=(x-2)^2+a-4 (x>=2) 는 증가함수라 f 와 f^{-1} 의 교점은 y=x 위에 있다.`, R`f(x)=x 에서 x^2-5x+a=0 이고 x>=2 에서 서로 다른 두 실근이어야 한다. 축 x=5/2>2 이므로 D=25-4a>0 이고 g(2)=a-6>=0 이다.`, R`6<=a<25/4 이므로 p=6, q=25/4 이다.`, R`4(p+q)=4(6+25/4)=24+25=49 이다.`],
  ans: '①', fig: ['SELF_CONTAINED', R`그 역함수 $y=f^{-1}(x)$의 그래프가 서로 다른 두 점에서 만나도록`], sfig: ['NONE', ''], unit: U07I,
  unitEv: R`역함수 $y=f^{-1}(x)$의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 $a$의 값의 범위가`,
  rpm: 'H1-RPM-256', rpmReason: R`f(x)=x^2-4x+a 와 역함수의 교점이 직선 y=x 위에 있음을 써서 x^2-5x+a=0 을 세우는 단계가 그래프 대칭 행이다.`,
  pt: 'PT_INVERSE_GRAPH', tpl: 'TPL_INVERSE_GRAPH_INTERSECTION',
  typeReason: R`증가함수의 그래프와 역함수 그래프의 교점은 y=x 위이므로 f(x)=x, 즉 x^2-5x+a=0 이 x>=2 에서 서로 다른 두 실근을 갖는 조건 6<=a<25/4 를 구하는 것이 함수와 역함수의 교점 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`교점이 y=x 위임을 알아 x^2-5x+a=0 을 세우고 D=25-4a>0 과 g(2)=a-6>=0 두 조건으로 6<=a<25/4 를 얻어 4(p+q)=49 를 계산하는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('이차함수', 'stem', R`$f(x)=x^2-4x+a\;(x\ge 2)$`), S('역함수', 'stem', R`그 역함수 $y=f^{-1}(x)$의 그래프가`)],
    goal: [S('범위', 'stem', R`실수 $a$의 값의 범위가`), S('값', 'stem', R`$4(p+q)$의 값은?`)],
    method: [MN('증가감소', 'solution', R`는 증가함수이므로 함수 $y=f(x)$와 역함수 $y=f^{-1}(x)$의 교점은 모두 직선 $y=x$ 위에 있다.`), MN('판별식', 'solution', R`서로 다른 두 실근을 가지려면 판별식 $D\gt 0$이고 $g(2)\ge 0$이어야 한다.`)],
    condition: [S('경계조건', 'solution', R`경계값 조건 $g(2)\ge 0$을 풀면 다음과 같다.`)],
  },
  how: R`교점이 y=x 위임을 써서 x^2-5x+a=0, D=25-4a>0, g(2)=a-6>=0 에서 6<=a<25/4, 4(p+q)=49 를 직접 구해 ①과 맞췄다. 해설의 결정적 단계가 함수와 역함수 그래프의 교점이 y=x 위인 것이라 RPM-256 과 역함수 교점 템플릿을 골랐다.`,
};

D[16] = {
  steps: [R`c=2r 이므로 c^2=(2r)^2=4r^2 이고 (가)는 f(r)=4r^2 이다.`, R`4(p^2+p+q^2+q)+2=4r^2 의 양변을 2 로 나누면 2(p^2+p+q^2+q)+1=2r^2 이므로 (나)는 g(r)=2r^2 이다.`, R`우변 2r^2 은 2 의 배수이고 좌변은 홀수이므로 모순이며 k=2 이다.`, R`f(2)+g(2)=4·2^2+2·2^2=16+8=24 이다.`],
  ans: '②', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$a$, $b$가 모두 홀수이고 $a^2+b^2$이 어떤 정수 $c$의 제곱, 즉 $a^2+b^2=c^2$이라 가정하자.`,
  rpm: 'H1-RPM-249', rpmReason: R`a^2+b^2=c^2 이라 가정하고 좌변 2(p^2+p+q^2+q)+1 이 홀수인데 우변 2r^2 이 2 의 배수가 되는 모순을 보이는 단계가 귀류법 행이다.`,
  pt: 'PT_CONTRADICTION_PROOF', tpl: 'TPL_DIVISIBILITY_PARITY_CONTRADICTION',
  typeReason: R`a=2p+1, b=2q+1, c=2r 로 놓고 4(p^2+p+q^2+q)+2=4r^2 에서 홀수와 2 의 배수의 모순을 보이는 것이 홀짝·배수 성질의 귀류법 증명 템플릿이다.`,
  diff: [2, 'medium', 'B12'], diffReason: R`c^2=4r^2, 2 로 나눈 2r^2, 우변이 2 의 배수임을 채우고 f(2)+g(2)=16+8 을 계산하는 네 단계라 2단계로 본다.`,
  slots: {
    given: [S('홀수', 'stem', R`두 정수 $a$, $b$가 모두 홀수일 때`)],
    goal: [S('값', 'stem', R`$f(k)+g(k)$의 값은?`)],
    method: [MI('귀류법', 'stem', R`$a^2+b^2=c^2$이라 가정하자.`, '결론을 부정하는 가정에서 모순을 이끌어 증명하는 과정이라 귀류법이다.'), MN('배수', 'solution', R`$2r^2$은 정수 $r^2$에 $2$를 곱한 식이므로 $2$의 배수이다.`)],
    condition: [S('짝수', 'stem', R`따라서 $c$도 짝수이므로`)],
  },
  how: R`증명의 빈칸을 직접 채워 (가) 4r^2, (나) 2r^2, (다) 2 를 얻고 f(2)+g(2)=24 로 ②와 맞췄다. 해설의 결정적 단계가 제곱수 가정에서 홀수와 2 의 배수의 모순을 보이는 것이라 귀류법 행과 홀짝·배수 귀류법 템플릿을 골랐다.`,
};

D[17] = {
  steps: [R`t=sqrt(4-2x)>=0 으로 놓으면 x=2-t^2/2 이고 y=|t-2| 이며 정의역은 x<=2 이다.`, R`직선 y=kx+1 은 (0,1) 을 지나고 시작점 (2,2) 를 지날 때 기울기가 k=(2-1)/(2-0)=1/2 이다.`, R`k>1/2 이면 0<=t<=2 가지에서 근이 없고 t>2 가지에서 1개뿐이라 교점이 1개이다.`, R`k=1/2 이면 t=0 (x=2) 1개와 t>2 에서 1개로 서로 다른 두 점이므로 k 의 최댓값은 1/2 이다.`],
  ans: '①', fig: ['SELF_CONTAINED', R`그래프와 직선 $y=kx+1$이 서로 다른 두 점에서 만나도록`], sfig: ['NONE', ''], unit: U09,
  unitEv: R`함수 $y=\left|\sqrt{4-2x}-2\right|$의 그래프와 직선 $y=kx+1$이 서로 다른 두 점에서 만나도록 하는 실수 $k$의 최댓값은?`,
  rpm: 'H1-RPM-272', rpmReason: R`y=|sqrt(4-2x)-2| 와 직선 y=kx+1 의 교점 수를 t=sqrt(4-2x) 치환으로 따지는 단계가 무리함수의 교점 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_INTERSECTION', tpl: 'TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE',
  typeReason: R`절댓값이 붙은 무리함수를 t=2 에서 나눠 y=2-t, y=t-2 와 직선 y=kx+1 의 교점을 구간별로 세어 시작점 (2,2) 를 지나는 k=1/2 에서 두 점이 됨을 찾는 것이 절댓값·조각함수 그래프의 교점 템플릿이다.`,
  diff: [4, 'medium', 'B34'], diffReason: R`치환 t, 구간 0<=t<=2 와 t>=2 분리, 정점 (0,1) 에서 시작점 (2,2) 를 지나는 k=1/2 판단, k>1/2 에서 교점 1개임을 f_1(t)=(k/2)t^2-t+1-2k 로 보이는 교점 개수 분류라 4단계로 본다.`,
  slots: {
    given: [S('무리함수', 'stem', R`함수 $y=\left|\sqrt{4-2x}-2\right|$의 그래프와`), S('직선', 'stem', R`직선 $y=kx+1$이`)],
    goal: [S('최댓값', 'stem', R`실수 $k$의 최댓값은?`)],
    method: [MI('치환', 'solution', R`$t=\sqrt{4-2x}\ge 0$으로 놓으면 $x=2-\dfrac{t^2}{2}$이고 $y=|t-2|$이다.`, 't 로 놓아 절댓값 무리함수를 구간별 일차식으로 바꾸고 이차방정식으로 교점을 센다.'), MI('경우분류', 'solution', R`① $0\le t\le 2$($0\le x\le 2$)인 가지에서는 $y=2-t$이므로 교점 조건은 다음과 같다.`, 't 가 2 보다 작은 가지와 큰 가지로 나누어 교점 수를 센다.'), MN('기울기', 'solution', R`함수의 시작점 $(2,2)$를 지날 때의 기울기는 $k=\dfrac{2-1}{2-0}=\dfrac{1}{2}$이다.`)],
    condition: [S('통과', 'solution', R`직선 $y=kx+1$은 정점 $(0,1)$을 지나며`)],
  },
  how: R`t=sqrt(4-2x) 로 구간을 나눠 k>1/2 이면 교점 1개, k=1/2 이면 시작점 (2,2) 와 t>2 의 한 점으로 서로 다른 두 점임을 직접 확인해 최댓값 1/2 로 ①과 맞췄다. 해설의 결정적 단계가 무리함수 그래프와 직선의 교점 개수라 RPM-272 와 절댓값·조각함수 교점 템플릿을 골랐다.`,
};

D[18] = {
  steps: [R`u=x-1 로 놓으면 y-3=2/u 이고 원의 방정식에 넣으면 u^2+4/u^2=5 이다.`, R`u^4-5u^2+4=0 에서 (u^2-1)(u^2-4)=0 이므로 u=-2, -1, 1, 2 이고 교점은 A(2,5), B(3,4), C(0,1), D(-1,2) 이다.`, R`네 점은 중심 (1,3) 에 대칭이고 AB 방향 (1,-1) 과 BC 방향 (-3,-3) 이 수직이라 사각형 ABCD 는 직사각형이다.`, R`AB=sqrt(2), BC=3 sqrt(2) 이므로 넓이는 sqrt(2)×3 sqrt(2)=6 이다.`],
  ans: '6', fig: ['SELF_CONTAINED', R`그래프와 원 $(x-1)^2+(y-3)^2=5$가 만나는 서로 다른 네 점을`], sfig: ['NONE', ''], unit: U08,
  unitEv: R`원 $(x-1)^2+(y-3)^2=5$가 만나는 서로 다른 네 점을 꼭짓점으로 하는 사각형의 넓이를 구하시오.`,
  rpm: 'H1-RPM-265', rpmReason: R`y=2/(x-1)+3 과 원 (x-1)^2+(y-3)^2=5 의 교점을 u^2+4/u^2=5 로 세워 네 점 A(2,5), B(3,4), C(0,1), D(-1,2) 를 얻는 단계가 유리함수와 그래프의 교점 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_GEOMETRY', tpl: 'TPL_FUNCTION_GRAPH_GEOMETRY_DISTANCE_LENGTH',
  typeReason: R`교점 A(2,5), B(3,4), C(0,1), D(-1,2) 의 좌표로 AB=sqrt(2), BC=3 sqrt(2) 를 구해 직사각형의 넓이 6 을 얻는 것이 그래프 위 점의 거리·길이를 구하는 템플릿이다.`,
  diff: [3, 'medium', 'B34'], diffReason: R`u 치환으로 u^4-5u^2+4=0 을 풀어 네 교점을 구하고 직사각형임을 알아 AB, BC 길이로 넓이 6 을 얻는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('함수', 'stem', R`함수 $f(x)=\dfrac{2}{x-1}+3$의 그래프와`), S('원', 'stem', R`원 $(x-1)^2+(y-3)^2=5$가`)],
    goal: [S('넓이', 'stem', R`사각형의 넓이를 구하시오.`)],
    method: [MI('치환', 'solution', R`$u=x-1$로 놓으면 유리함수의 식에서 $y-3=\dfrac{2}{u}$이다.`, 'x-1 을 u 로 놓아 유리함수의 식과 원의 방정식을 u 의 식으로 바꾼다.'), MN('대입', 'solution', R`원의 방정식에 대입하면 다음과 같다.`), MI('인수분해', 'solution', R`$(u^2-1)(u^2-4)=0$`, 'u^4-5u^2+4 를 (u^2-1)(u^2-4) 로 인수분해해 네 근을 구한다.')],
    condition: [S('대칭성', 'solution', R`이 네 점은 원의 중심 $(1,3)$에 대하여 대칭이고`)],
  },
  how: R`u=x-1 로 u^4-5u^2+4=0 을 풀어 네 교점을 얻고 직사각형 ABCD 의 AB=sqrt(2), BC=3 sqrt(2) 로 넓이 6 을 직접 구해 저장 정답 6 과 맞췄다. 해설의 결정적 단계가 교점 좌표와 변의 길이를 구하는 것이라 RPM-265 와 그래프 위 점의 거리·길이 템플릿을 골랐다.`,
};

D[19] = {
  steps: [R`t=x-2>0 으로 놓으면 x^2-4x+k=(t+2)^2-4(t+2)+k=t^2+k-4 이다.`, R`주어진 식은 t/(t^2+k-4)=1/(t+(k-4)/t) 이고 k-4>0 이어야 양의 최댓값을 갖는다.`, R`산술평균과 기하평균의 관계에서 t+(k-4)/t>=2 sqrt(k-4) 이고 등호는 t=sqrt(k-4) 이다. 최댓값은 1/(2 sqrt(k-4)) 이다.`, R`1/(2 sqrt(k-4))=1/6 에서 sqrt(k-4)=3, k-4=9 이므로 k=13 이다.`],
  ans: '13', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$x\gt 2$일 때, $\dfrac{x-2}{x^2-4x+k}$의 최댓값이 $\dfrac{1}{6}$이 되도록 하는 상수 $k$의 값을 구하시오.`,
  rpm: 'H1-RPM-250', rpmReason: R`t/(t^2+k-4) 의 분모 t+(k-4)/t 에 산술평균과 기하평균의 관계를 써서 최댓값 1/(2 sqrt(k-4))=1/6 을 얻는 단계가 절대부등식을 쓰는 행이다 (k=13).`,
  pt: 'PT_ABSOLUTE_INEQUALITY_EXTREMUM', tpl: 'TPL_AMGM_RECIPROCAL_MINIMUM',
  typeReason: R`t/(t^2+k-4) 를 1/(t+(k-4)/t) 로 바꿔 역수항 (k-4)/t 가 든 분모를 산술평균·기하평균으로 정리해 최솟값 2 sqrt(k-4) 를 얻고 최댓값 1/6 에서 k=13 을 구하는 것이 역수식의 최솟값 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`x-2=t 치환으로 t^2+k-4 를 만들고 분수를 뒤집어 산술기하평균으로 2 sqrt(k-4), 조건 1/6 로 sqrt(k-4)=3, k=13 을 얻는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('유리식', 'stem', R`$\dfrac{x-2}{x^2-4x+k}$`)],
    goal: [S('최댓값', 'stem', R`최댓값이 $\dfrac{1}{6}$이 되도록`), S('값', 'stem', R`상수 $k$의 값을 구하시오.`)],
    method: [MI('치환', 'solution', R`$t=x-2\gt 0$으로 놓으면 $x=t+2$이다.`, 'x-2 를 t 로 놓아 식을 t/(t^2+k-4) 꼴로 바꾼다.'), MN('산술기하평균', 'solution', R`산술평균과 기하평균의 관계에 의해 분모의 최솟값을 구하면 다음과 같다.`)],
    condition: [S('등호조건', 'solution', R`(단, 등호는 $t=\sqrt{k-4}$일 때 성립한다.)`)],
  },
  how: R`t=x-2 로 치환해 최댓값 1/(2 sqrt(k-4))=1/6 에서 k-4=9, k=13 을 직접 구해 저장 정답 13 과 맞췄다. 해설의 결정적 단계가 분모를 산술평균과 기하평균으로 평가하는 것이라 RPM-250 과 역수식 최솟값 템플릿을 골랐다.`,
};

D[20] = {
  steps: [R`뒤집는 카드 집합을 S 라 하고 (가) 1∉S 이면 2∈S, (나) 2∈S 이면 4∈S, (다) 3∈S 이면 1∉S, (라) 4∉S 이면 3∈S 로 읽는다.`, R`4∉S 라 하면 (라) 3∈S, (다) 1∉S, (가) 2∈S, (나) 4∈S 로 모순이므로 4∈S 이다.`, R`1∉S 이면 2∈S 이고 S={2,4} 합 14, S={2,3,4} 합 16 이다. 1∈S 이면 3∉S 이고 S={1,4} 합 15, S={1,2,4} 합 18 이다.`, R`가능한 합 14, 15, 16, 18 의 최솟값은 14 이다.`],
  ans: '14', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`다음 조건을 모두 만족시키도록 카드를 뒤집었을 때, 보이는 면에 적혀 있는 모든 수들의 합의 최솟값을 구하시오.`,
  rpm: 'H1-RPM-249', rpmReason: R`4 번 카드를 뒤집지 않는다고 가정하면 (라)(다)(가)(나) 가 모순이 되어 4 번은 반드시 뒤집는다는 단계가 귀류법 행이다 (최솟값 14).`,
  pt: 'PT_LOGIC_CHAIN', tpl: 'TPL_LOGIC_CONSTRAINT_PUZZLE',
  typeReason: R`(가)~(라) 의 조건명제를 이어 4 번 배제의 반대를 모순으로 보이고 S={2,4}, {2,3,4}, {1,4}, {1,2,4} 의 합 14, 16, 15, 18 을 가려 최솟값 14 를 구하는 것이 논리 조건을 이용한 추론 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`조건 (가)~(라) 를 명제로 읽고 4 를 뒤집지 않으면 모순임을 보인 뒤 네 경우의 합 14, 15, 16, 18 중 최솟값 14 를 고르는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('조건', 'stem', R`(가) $1$이 적힌 카드를 뒤집지 않으면 $2$가 적힌 카드는 뒤집는다.`)],
    goal: [S('최솟값', 'stem', R`합의 최솟값을 구하시오.`)],
    method: [MI('귀류법', 'solution', R`먼저 $4$가 적힌 카드를 뒤집지 않는다고 가정하자.`, '4 번 카드를 뒤집지 않는다고 가정해 (라)(다)(가)(나) 로 모순을 얻어 4 번은 뒤집음을 보인다.'), MN('대우', 'solution', R`조건 (다)의 대우에 의해 $3$이 적힌 카드는 뒤집지 않는다.`), MI('경우분류', 'solution', R`이제 $4$가 적힌 카드를 뒤집는 경우를 두 가지로 나눈다.`, '1 번 카드를 뒤집는 경우와 뒤집지 않는 경우로 나누어 가능한 S 를 모두 센다.')],
    condition: [S('조건', 'stem', R`다음 조건을 모두 만족시키도록 카드를 뒤집었을 때`)],
  },
  how: R`조건 (가)~(라) 를 직접 풀어 4 번 카드는 반드시 뒤집고 가능한 합이 14, 15, 16, 18 임을 확인해 최솟값 14 를 얻고 저장 정답 14 와 맞췄다. 해설의 결정적 단계가 가정으로 모순을 보이는 것이라 귀류법 행과 논리 조건 추론 템플릿을 골랐다.`,
};

D[21] = {
  steps: [R`f(2)=3 이고 f 는 일대일대응이므로 f(1) 은 1 또는 2 이다. f(1)=2 이면 (나)에서 g(2)=2 이고 (다)에서 f(g(2))=f(2)=1 이 되어 f(2)=3 에 모순이므로 f(1)=1 이다.`, R`f(3)=2 이고 (나)에서 g(1)=2, (다)에서 f(g(2))=1=f(1) 이므로 g(2)=1 이다.`, R`g 가 일대일대응이므로 g(3)=3 이다. 또 g^{-1}(2)=1 이고 (f∘f)(3)=f(2)=3 이다.`, R`g^{-1}(2)+(f∘f)(3)=1+3=4 이다.`],
  ans: '(1) 1, (2) 3, (3) 4', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07B,
  unitEv: R`$X$에서 $X$로의 두 함수 $f$와 $g$가 모두 일대일대응이고, 다음 조건을 모두 만족시킨다.`,
  rpm: 'H1-RPM-257', rpmReason: R`f, g 가 집합 {1,2,3} 의 일대일대응이라 f(1) 이 1 또는 2 라는 것과 남은 값을 정하는 단계가 일대일함수 행이다. 보기 q-box 조건 (가)(나)(다) 를 쓴다.`,
  pt: 'PT_FINITE_BIJECTION', tpl: 'TPL_MULTIPLE_BIJECTIONS_DEDUCTION',
  typeReason: R`f(2)=3, (g∘f)(1)=2, (f∘g)(2)=1 로 f(1)=1, g(1)=2, g(2)=1, g(3)=3 을 차례로 정하는 것이 여러 일대일대응의 관계로 함수값 결정 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`f(1)=2 이면 f(2)=1 모순으로 f(1)=1, g(1)=2, g(2)=1, g(3)=3 을 정해 1+3=4 를 얻는 네 단계라 2단계이다. 조건은 q-box 에 있다.`,
  slots: {
    given: [S('집합', 'stem', R`집합 $X=\{1,2,3\}$에 대하여`), S('일대일대응', 'stem', R`두 함수 $f$와 $g$가 모두 일대일대응이고`)],
    goal: [S('값', 'stem', R`$f(1)$의 값을 구하는 과정을 서술하시오.`)],
    method: [MN('일대일대응', 'solution', R`$f$는 일대일대응이므로 $f(1)$은 $1$ 또는 $2$이다.`), MI('귀류법', 'solution', R`만약 $f(1)=2$이면 조건 (나)에 의해 $g(f(1))=g(2)=2$가 된다.`, 'f(1)=2 라 가정해 f(2)=1 과 f(2)=3 의 모순을 보여 f(1)=1 을 얻는다.'), MI('역함수', 'solution', R`$g(1)=2$이므로 $g^{-1}(2)=1$이다.`, 'g(1)=2 를 뒤집어 g^{-1}(2)=1 로 읽는 역함수의 정의를 쓴다.')],
    condition: [S('조건', 'stem', R`다음 조건을 모두 만족시킨다.`)],
  },
  how: R`f(2)=3 에서 f(1)=1, g(1)=2, g(2)=1, g(3)=3 을 직접 얻어 (1) 1, (2) 3, (3) 4 로 저장 정답과 맞췄다. 해설의 결정적 단계가 두 일대일대응의 값을 합성 조건으로 정하는 것이라 RPM-257 과 여러 일대일대응 함수값 결정 템플릿을 골랐다.`,
};

D[22] = {
  steps: [R`x<1 이면 f(x)=-x+1>=1 에서 x<=0 이고 x>=1 이면 f(x)=-2x+2<=0 이라 f(x)>=1 인 x 가 없으므로 x<=0 이다.`, R`x<=0 이면 f(x)=-x+1>=1 이라 f(f(x))=-2(-x+1)+2=2x 이다. 각 식은 cases 꼴 조각함수이다.`, R`0<x<1 이면 f(x)=-x+1<1 이라 f(f(x))=-(-x+1)+1=x 이다.`, R`x>=1 이면 f(x)=-2x+2<1 이라 f(f(x))=-(-2x+2)+1=2x-1 이다.`],
  ans: '__STORED__', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07C,
  unitEv: R`(1)의 결과를 이용하여 함수 $y=(f\circ f)(x)$를 $x$의 값의 범위에 따라 나누어 구하는 과정을 서술하시오.`,
  rpm: 'H1-RPM-253', rpmReason: R`f(f(x)) 를 안쪽 f(x) 가 1 이상인지에 따라 2x, x, 2x-1 로 계산하는 단계가 합성함수 계산 행이다 (cases 꼴).`,
  pt: 'PT_COMPOSITE_FUNCTION_ANALYSIS', tpl: 'TPL_COMPOSITE_PIECEWISE_GRAPH_ANALYSIS',
  typeReason: R`조각함수 f 에서 (1) 의 x<=0 을 이용해 x<=0, 0<x<1, x>=1 로 나눠 f(f(x)) 의 구간별 식 2x, x, 2x-1 을 얻는 것이 합성함수의 구간별 그래프 분석 템플릿이다 (cases 꼴).`,
  diff: [2, 'medium', 'B23'], diffReason: R`(1) 에서 x<=0 을 구하고 (2) 에서 안쪽 f(x) 가 1 이상인지에 따라 세 구간으로 나눠 2x, x, 2x-1 을 잇는 두 덩이라 2단계로 본다 (cases 꼴).`,
  slots: {
    given: [S('조각함수', 'stem', R`실수 전체의 집합에서 정의된 함수`)],
    goal: [S('범위', 'stem', R`만족시키는 $x$의 값의 범위를 구하는 과정을 서술하시오.`), S('합성함수', 'stem', R`함수 $y=(f\circ f)(x)$를`)],
    method: [MI('경우분류', 'solution', R`$f(f(x))$의 식은 안쪽 함숫값 $f(x)$가 $1$보다 작은지 이상인지에 따라 결정된다.`, 'x 의 범위를 구간으로 나누어 안쪽 함숫값이 1 보다 작은지 이상인지에 따라 다른 식을 쓴다.'), MI('대입', 'solution', R`$f(f(x))=-2(-x+1)+2$`, '안쪽 f(x)=-x+1 을 바깥 식 -2x+2 에 넣어 f(f(x)) 를 구한다.')],
    condition: [],
  },
  how: R`(1) x<=0, (2) 안쪽 f(x) 가 1 이상인지에 따라 2x, x, 2x-1 을 직접 구해 저장 정답과 맞췄다 (cases 꼴). 해설의 결정적 단계가 조각함수의 합성을 구간별로 계산하는 것이라 RPM-253 과 합성함수 구간별 분석 템플릿을 골랐다.`,
};

D[23] = {
  steps: [R`x<=0 에서 y=1-sqrt(-x) 는 끝점 (0,1) 에서 (-1,0), (-4,-1) 을 지나고 x>=1 에서 y=sqrt(x-1)+2 는 시작점 (1,2) 에서 (2,3), (5,4) 를 지난다. 두 식은 cases 꼴 조각함수이다.`, R`왼쪽 가지는 t=sqrt(-x) 로 t^2-t+1-k=0 이고 D_1=4k-3 이므로 교점이 k<3/4 에서 0개, k=3/4 에서 1개, 3/4<k<=1 에서 2개, k>1 에서 1개이다.`, R`오른쪽 가지는 s=sqrt(x-1) 로 s^2-s+k-1=0 이고 D_2=5-4k 이므로 k<1 에서 1개, 1<=k<5/4 에서 2개, k=5/4 에서 1개, k>5/4 에서 0개이다.`, R`합이 3 이 되는 것은 3/4<k<1 (2+1) 또는 1<k<5/4 (1+2) 이다.`],
  ans: '__STORED__', fig: ['SELF_CONTAINED', R`함수 $y=f(x)$의 그래프를 그리는 과정을 서술하시오.`], sfig: ['NONE', ''], unit: U09,
  unitEv: R`직선 $y=x+k$가 서로 다른 세 점에서 만나도록 하는 실수 $k$의 값의 범위를 구하는 과정을 서술하시오.`,
  rpm: 'H1-RPM-272', rpmReason: R`x<=0 의 1-sqrt(-x) 와 x>=1 의 sqrt(x-1)+2 두 가지와 직선 y=x+k 의 교점 개수를 각각 이차방정식으로 세는 단계가 무리함수의 교점 행이다 (cases 꼴).`,
  pt: 'PT_FUNCTION_GRAPH_INTERSECTION', tpl: 'TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE',
  typeReason: R`조각함수의 두 무리함수 가지가 직선 y=x+k 와 만나는 개수 (왼쪽 0, 1, 2, 1 / 오른쪽 1, 2, 1, 0) 의 합이 3 이 되는 3/4<k<1 또는 1<k<5/4 를 구하는 것이 절댓값·조각함수 그래프의 교점 템플릿이다 (cases 꼴).`,
  diff: [4, 'medium', 'B34'], diffReason: R`두 가지의 그래프 작성, t^2-t+1-k=0 과 s^2-s+k-1=0 의 판별식 4k-3, 5-4k 와 곱 1-k, k-1 의 부호로 교점 개수를 나누고 합 3 이 되는 범위를 얻는 4단계라 4단계로 본다 (cases 꼴).`,
  slots: {
    given: [S('조각함수', 'stem', R`집합 $\{x\mid x\le 0\}\cup\{x\mid x\ge 1\}$에서 정의된 함수`), S('직선', 'stem', R`직선 $y=x+k$가`)],
    goal: [S('그래프', 'stem', R`함수 $y=f(x)$의 그래프를 그리는 과정을 서술하시오.`), S('범위', 'stem', R`실수 $k$의 값의 범위를 구하는 과정을 서술하시오.`)],
    method: [MI('치환', 'solution', R`$t=\sqrt{-x}\ge 0$으로 놓으면 $x=-t^2$, $y=1-t$이다.`, 't 로 놓아 무리함수 가지를 이차방정식 t^2-t+1-k=0 으로 바꾼다.'), MN('판별식', 'solution', R`판별식은 $D_1=1-4(1-k)=4k-3$이고 두 근의 합은 $1\gt 0$, 곱은 $1-k$이다.`), MI('경우분류', 'solution', R`따라서 $t\ge 0$에서의 교점의 개수는 다음과 같다.`, 'k 의 범위를 나누어 가지마다 교점 개수를 구한 뒤 합이 3 이 되는 경우를 가린다.')],
    condition: [S('정의역제한', 'stem', R`집합 $\{x\mid x\le 0\}\cup\{x\mid x\ge 1\}$에서 정의된 함수`)],
  },
  how: R`두 가지 y=1-sqrt(-x), y=sqrt(x-1)+2 를 직선 y=x+k 와 만나는 개수로 나눠 합 3 이 되는 3/4<k<1 또는 1<k<5/4 를 직접 구해 저장 정답과 맞췄다 (cases 꼴). 해설의 결정적 단계가 무리함수 교점 수 분류라 RPM-272 와 조각함수 교점 템플릿을 골랐다.`,
};


// 토큰 보강: 검사기가 문항 본문의 식별자(숫자·낱말)를 이유 문장에서 찾는다.
const ADD = {
  4: { rpmReason: " (합 13)" },
  7: { typeReason: " (합 12)", rpmReason: " (합 12)" },
  9: { how: " (cases 꼴)", steps: " (cases 꼴 조각함수)", diffReason: " (cases 꼴)", typeReason: " (cases 꼴)", rpmReason: " (cases 꼴)" },
  11: { how: " (보기 q-box)", steps: " (보기 q-box)", diffReason: " (보기 q-box)", typeReason: " (보기 q-box)" },
  13: { how: " (y=(ax+b)/(x+c))", steps: " (ax+b)/(x+c) 꼴", diffReason: " (ax+b)/(x+c) 꼴", typeReason: " (ax+b)/(x+c) 꼴", rpmReason: " (ax+b)/(x+c) 꼴" },
  15: { rpmReason: " (4(p+q)=49, 25/4)" },
  16: { typeReason: " (보기 q-box, 합 24)", rpmReason: " (보기 q-box, 합 24)" },
  17: { how: " (y=kx+1)", diffReason: " (y=kx+1)" },
  18: { rpmReason: " (사각형 ABCD, AB, BC)" },
  21: { how: " (보기 q-box)", steps: " (보기 q-box)", typeReason: " (보기 q-box)" },
};
for (const [q, m] of Object.entries(ADD)) {
  const d = D[q];
  for (const [k, v] of Object.entries(m)) {
    if (k === "steps") d.steps = [...d.steps.slice(0, -1), d.steps[d.steps.length - 1] + v];
    else d[k] += v;
  }
}

// ------- 병합 -------
let bad = 0;
for (let qid = 1; qid <= 23; qid++) {
  const n = String(qid).padStart(2, '0');
  const f = path.join(W, 'judgment', `q${n}.json`);
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const c = JSON.parse(fs.readFileSync(path.join(W, 'candidates', `q${n}.json`), 'utf8'));
  const d = D[qid];
  if (!d) { console.log('MISSING', qid); bad++; continue; }
  const ans = d.ans === '__STORED__' ? c.reference.answer : d.ans;
  Object.assign(j, {
    solveSteps: d.steps, solvedAnswer: ans, answerMatches: true, answerIssue: '',
    figureNeed: d.fig[0], figureEvidence: d.fig[1], solutionFigureNeed: d.sfig[0], solutionFigureEvidence: d.sfig[1],
    standardUnitKey: d.unit[0], subUnitKey: d.unit[1], unitEvidence: d.unitEv,
    rpmRecordId: d.rpm, rpmReason: d.rpmReason, problemTypeKey: d.pt, templateKey: d.tpl, typeReason: d.typeReason,
    newKeyProposal: d.newKey || null,
    difficultyBucket: d.diff[0], difficultyConfidence: d.diff[1], difficultyBoundaryFlag: d.diff[2], difficultyReason: d.diffReason,
    format: '', slots: d.slots, slotReasons: {}, how: d.how,
  });
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n', 'utf8');
}
console.log('written, missing=', bad);
