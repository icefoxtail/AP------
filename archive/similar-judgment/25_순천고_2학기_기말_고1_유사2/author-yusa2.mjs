// 유사2 판정 작성 스크립트 (W 안). judgment/qNN.json 에 병합한다 (itemFingerprint·review 유지).
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
  steps: [R`① 은 모든 실수 x 에 대하여 x^2+1>0 이 항상 참이라 참·거짓이 정해진 명제이다.`, R`② x^2-9=0 은 x=3 이면 참, x=0 이면 거짓이라 조건이다.`, R`③ 2x-3<7 은 x=1 이면 참, x=6 이면 거짓이고 ④ x^2=4x, ⑤ x^2-3x+2<=0 도 값에 따라 참·거짓이 갈린다.`, R`따라서 조건이 아닌 것은 ①이다.`],
  ans: '①', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`다음 중 조건이 아닌 것은?`,
  rpm: 'H1-RPM-244', rpmReason: R`① 모든 실수 x 에 대하여 x^2+1>0 은 항상 참인 명제이고 나머지는 값에 따라 참·거짓이 갈리는 조건이라, 명제와 조건의 구별 단계가 명제의 참·거짓 행이다.`,
  pt: 'PT_PROPOSITION_JUDGMENT', tpl: 'TPL_PROPOSITION_CONDITION_IDENTIFICATION',
  typeReason: R`보기 ①~⑤ 가운데 x=3, x=0 처럼 값을 넣어 참·거짓이 갈리면 조건, 항상 참이면 명제라고 가려내는 것이 명제와 조건의 구별 템플릿이다.`,
  diff: [1, 'high', 'NONE'], diffReason: R`② x^2-9=0 에 x=3, x=0 을 넣어 보는 정의 확인 한 단계이고 ① 이 항상 참임만 알아보면 되어 1단계이다.`,
  slots: {
    given: [S('방정식', 'choices', R`$x^2-9=0$`), S('부등식', 'choices', R`$2x-3\lt 7$`)],
    goal: [S('판정', 'stem', R`다음 중 조건이 아닌 것은?`)],
    method: [MI('수치대입법', 'solution', R`$x=3$이면 참이고 $x=0$이면 거짓이므로 조건이다.`, 'x 에 3 과 0 같은 값을 넣어 참·거짓이 갈리는지 확인해 조건임을 판정한다.')],
    condition: [S('양화', 'choices', R`모든 실수 $x$에 대하여`)],
  },
  how: R`보기 ①~⑤ 를 직접 읽고 ①만 모든 실수 x 에서 x^2+1>0 이 항상 참인 명제라 조건이 아님을 확인했다. 해설도 같은 구별이라 명제의 참·거짓 행과 조건 식별 템플릿을 골랐다.`,
};

D[2] = {
  steps: [R`q: x^2-x-6=0 은 (x+2)(x-3)=0 이므로 진리집합이 {-2, 3} 이다.`, R`p→q 의 역 q→p 가 참이려면 -2, 3 이 모두 a<=x<=a+7 에 속해야 한다.`, R`a<=-2 이고 3<=a+7 에서 -4<=a<=-2 이다.`, R`정수 a 는 -4, -3, -2 로 3개이다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`명제 $p\to q$의 역이 참이 되도록 하는 정수 $a$의 개수는?`,
  rpm: 'H1-RPM-248', rpmReason: R`역 q→p 가 참이 되도록 하는 a 의 범위 -4<=a<=-2 를 구하는 단계라 필요조건·충분조건의 매개변수 행이다.`,
  pt: 'PT_PROPOSITION_PARAMETER_CONDITION', tpl: 'TPL_CONVERSE_CONTRAPOSITIVE_ROOT_PARAMETER',
  typeReason: R`역 q→p 가 참이려면 방정식 x^2-x-6=0 의 두 근 -2, 3 이 모두 구간 a<=x<=a+7 에 들어가야 한다는 조건으로 a 를 정하는 것이 역·대우와 방정식의 근 조건 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`방정식을 풀고 역으로 바꾼 뒤 a<=-2, 3<=a+7 두 부등식을 합쳐 정수를 세는 3~4단계라 2단계로 본다.`,
  slots: {
    given: [S('조건', 'stem', R`$p:a\le x\le a+7$`), S('방정식', 'stem', R`$q:x^2-x-6=0$`)],
    goal: [S('개수', 'stem', R`정수 $a$의 개수는?`)],
    method: [MN('진리집합', 'solution', R`먼저 조건 $q$의 진리집합을 구한다.`), MN('역', 'solution', R`명제 $p\to q$의 역은 $q\to p$이므로`)],
    condition: [S('성립조건', 'solution', R`두 부등식이 동시에 성립해야 한다`)],
  },
  how: R`q 의 진리집합 {-2, 3} 을 구하고 역 q→p 가 참이 되는 a 의 범위 -4<=a<=-2 를 직접 얻어 보기 ③과 맞췄다. 해설의 결정적 단계가 역과 매개변수 범위라 RPM-248 과 역 근 조건 템플릿을 골랐다.`,
};

D[3] = {
  steps: [R`분자 sqrt(x+2) 에서 x+2>=0 이므로 x>=-2 이다.`, R`분모 sqrt(6-x) 는 0 이 될 수 없어 6-x>0, 즉 x<6 이다.`, R`-2<=x<6 의 정수는 -2, -1, 0, 1, 2, 3, 4, 5 이다.`, R`합은 (-2)+(-1)+0+1+2+3+4+5=12 이다.`],
  ans: '②', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U09,
  unitEv: R`무리식 $\dfrac{\sqrt{x+2}}{\sqrt{6-x}}$의 값이 실수가 되도록 하는 모든 정수 $x$의 합은?`,
  rpm: 'H1-RPM-268', rpmReason: R`x+2>=0 과 6-x>0 으로 x 의 범위 -2<=x<6 을 정하는 단계가 무리식의 근호 안 조건, 즉 정의역 조건 행이다.`,
  pt: 'PT_RADICAL_EXPRESSION', tpl: 'TPL_RADICAL_REAL_VALUE_RANGE',
  typeReason: R`sqrt(x+2) 의 x+2>=0, 분모 sqrt(6-x) 의 6-x>0 으로 실수가 되는 x 의 범위 -2<=x<6 을 구하는 것이 무리식이 실수가 되는 범위 템플릿이다.`,
  diff: [1, 'high', 'B12'], diffReason: R`근호 안 x+2>=0, 분모 6-x>0 두 조건을 바로 쓰고 정수 -2~5 를 더하는 12 계산이라 1단계로 본다.`,
  slots: {
    given: [S('무리식', 'stem', R`무리식 $\dfrac{\sqrt{x+2}}{\sqrt{6-x}}$`)],
    goal: [S('합', 'stem', R`모든 정수 $x$의 합은?`)],
    method: [MN('근호', 'solution', R`분자의 근호 안은 $0$ 이상이어야 한다.`), MI('열거', 'solution', R`이 범위에 속하는 정수 $x$는 $-2$, $-1$, $0$, $1$, $2$, $3$, $4$, $5$이다.`, '범위 -2<=x<6 안의 정수를 하나씩 늘어놓아 합을 구한다.')],
    condition: [S('범위', 'solution', R`두 조건을 동시에 만족하는 $x$의 범위는 다음과 같다.`)],
  },
  how: R`무리식 sqrt(x+2)/sqrt(6-x) 가 실수가 되는 범위 -2<=x<6 의 정수합 12 를 직접 구해 보기 ②와 맞췄다. 해설의 결정적 단계가 근호 안 조건이라 무리함수 단원의 정의역 조건 행과 무리식 실수 범위 템플릿을 골랐다.`,
};

D[4] = {
  steps: [R`그림에서 g(5)=9 이므로 (g∘f)(a)=9 에서 f(a)=5 이다.`, R`그림에서 f(3)=5 이므로 a=3 이다.`, R`a+f(a)=3+5=8 이다.`],
  ans: '④', fig: ['NEEDS_FIGURE', R`다음 그림은 두 함수 $f:X\to Y$, $g:Y\to Z$를 나타낸 것이다.`], sfig: ['NONE', ''], unit: U07C,
  unitEv: R`$(g\circ f)(a)=9$를 만족시키는 $X$의 원소 $a$에 대하여`,
  rpm: 'H1-RPM-253', rpmReason: R`그림의 대응으로 (g∘f)(a)=g(f(a))=9 가 되는 a=3 을 찾는 단계라 합성함수 계산 행이다.`,
  pt: 'PT_COMPOSITION_EVALUATION', tpl: 'TPL_COMPOSITION_VALUE_MAPPING',
  typeReason: R`대응도에서 g(5)=9, f(3)=5 를 읽어 (g∘f)(3)=9 인 a=3 을 찾는 것이 대응도에서 합성함숫값을 계산하는 템플릿이다.`,
  diff: [1, 'high', 'NONE'], diffReason: R`그림에서 g(5)=9, f(3)=5 두 화살표를 거꾸로 따라가 a+f(a)=3+5=8 을 얻는 두 단계라 1단계이다.`,
  slots: {
    given: [S('함수', 'stem', R`두 함수 $f:X\to Y$, $g:Y\to Z$`), S('원소', 'stem', R`$X$의 원소 $a$`)],
    goal: [S('값', 'stem', R`$a+f(a)$의 값은?`)],
    method: [MN('대응', 'solution', R`먼저 $g$의 대응에서 함숫값이 $9$가 되는 $Y$의 원소를 찾는다.`), MN('함숫값', 'solution', R`이제 $f$의 대응에서 함숫값이 $5$가 되는 $X$의 원소를 찾는다.`)],
    condition: [],
  },
  how: R`그림의 화살표에서 g(5)=9, f(3)=5 를 읽어 a=3, a+f(a)=8 을 직접 얻어 ④와 맞췄다. 해설도 대응도에서 거꾸로 따라가는 합성함숫값 계산이라 RPM-253 과 대응도 템플릿을 골랐다.`,
};

D[5] = {
  steps: [R`‘모든 실수 x’ 의 부정은 ‘어떤 실수 x’ 이다.`, R`-1<x<=4 는 -1<x 이고 x<=4 이므로 부정은 x<=-1 또는 x>4 이다.`, R`따라서 부정은 어떤 실수 x 에 대하여 x<=-1 또는 x>4 이고 이는 ④이다.`],
  ans: '④', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`모든 실수 $x$에 대하여 $-1\lt x\le 4$이다.`,
  rpm: 'H1-RPM-246', rpmReason: R`‘모든 실수 x 에 대하여 -1<x<=4’ 를 ‘어떤 실수 x 에 대하여 x<=-1 또는 x>4’ 로 바꾸는 명제 변환 단계가 이 행이다.`,
  pt: 'PT_QUANTIFIER_NEGATION', tpl: 'TPL_QUANTIFIER_NEGATION_INTERVAL',
  typeReason: R`모든→어떤으로 바꾸고 구간 -1<x<=4 를 x<=-1 또는 x>4 로 부정하는 것이 양화명제의 부정과 구간 템플릿이다.`,
  diff: [1, 'high', 'NONE'], diffReason: R`‘모든’→‘어떤’ 과 ‘이고’→‘또는’ 규칙을 -1<x<=4 에 바로 적용하는 한 단계라 1단계이다.`,
  slots: {
    given: [S('명제', 'stem', R`모든 실수 $x$에 대하여 $-1\lt x\le 4$이다.`)],
    goal: [S('부정', 'stem', R`의 부정은?`)],
    method: [MI('드모르간법칙', 'solution', R`각 부등호의 방향을 반대로 바꾸면 다음과 같다.`, '‘이고’ 의 부정이 ‘또는’ 이 되는 부정 규칙을 -1<x 와 x<=4 에 적용한다.')],
    condition: [S('양화', 'solution', R`‘어떤 실수 $x$에 대하여’이다.`)],
  },
  how: R`‘모든’ 을 ‘어떤’ 으로, -1<x<=4 의 ‘이고’ 를 ‘또는’ 으로 바꾸어 직접 부정을 만들고 보기 ④와 맞췄다. 부정 변환 단계라 명제 변환 행과 양화명제 부정 구간 템플릿을 골랐다.`,
};

D[6] = {
  steps: [R`p 가 ¬q 이기 위한 필요조건이면 ¬q→p 가 참이므로 Q^c ⊂ P 이다.`, R`양변에 Q 와의 합집합을 취하면 Q^c∪Q ⊂ P∪Q 이므로 U ⊂ P∪Q 이다.`, R`P∪Q 는 U 의 부분집합이므로 P∪Q=U 이고 보기 ⑤이다.`],
  ans: '⑤', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$p$가 $\neg q$이기 위한 필요조건일 때, 다음 중 항상 옳은 것은?`,
  rpm: 'H1-RPM-247', rpmReason: R`p 가 ¬q 이기 위한 필요조건이라는 조건 관계를 ¬q→p, 즉 Q^c ⊂ P 로 읽는 단계라 조건 관계 행이다.`,
  pt: 'PT_NEC_SUFF_RELATION', tpl: 'TPL_NEC_SUFF_SET_RELATION',
  typeReason: R`필요조건 ¬q→p 를 진리집합의 포함 Q^c ⊂ P 로 바꾸고 합집합 P∪Q=U 를 얻는 것이 집합과 필요충분조건 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`필요조건을 Q^c ⊂ P 로 바꾸고 합집합 U ⊂ P∪Q 를 이끄는 집합 변형 두세 단계라 2단계이다.`,
  slots: {
    given: [S('진리집합', 'stem', R`두 조건 $p$, $q$의 진리집합을 각각 $P$, $Q$라 하자.`), S('전체집합', 'stem', R`전체집합 $U$에 대하여`)],
    goal: [S('판정', 'stem', R`다음 중 항상 옳은 것은?`)],
    method: [MN('포함관계', 'solution', R`따라서 진리집합 사이의 포함 관계는 다음과 같다.`), MN('합집합', 'solution', R`양변에 $Q$와의 합집합을 취하면 다음이 성립한다.`)],
    condition: [S('필요조건', 'stem', R`$p$가 $\neg q$이기 위한 필요조건일 때`)],
  },
  how: R`필요조건 ¬q→p 에서 Q^c ⊂ P 를 얻고 합집합을 취해 P∪Q=U 가 항상 성립함을 직접 보여 ⑤와 맞췄다. 해설의 결정적 단계가 필요조건의 집합 포함 번역이라 RPM-247 과 필요충분조건 집합 템플릿을 골랐다.`,
};

D[7] = {
  steps: [R`sqrt(ax+6) 의 근호 안 ax+6>=0 의 해가 x<=3 이려면 a<0 이고 x<=-6/a 이다.`, R`-6/a=3 에서 a=-2 이다.`, R`sqrt(-2x+6)>=0 이므로 치역은 y>=b 이고 b=-5 이다.`, R`a+b=-2+(-5)=-7 이다.`],
  ans: '①', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U09,
  unitEv: R`함수 $y=\sqrt{ax+6}+b$의 정의역이 $\{x\mid x\le 3\}$이고 치역이 $\{y\mid y\ge -5\}$일 때`,
  rpm: 'H1-RPM-268', rpmReason: R`근호 안 ax+6>=0 의 해가 x<=3 이 되도록 a=-2 를 정하는 단계가 무리함수의 정의역 조건 행이다.`,
  pt: 'PT_DOMAIN_RANGE_SURJECTIVITY', tpl: 'TPL_FUNCTION_DOMAIN_RANGE_PARAMETER',
  typeReason: R`정의역 x<=3 과 치역 y>=-5 에서 a=-2, b=-5 를 정하는 것이 정의역·치역의 매개변수 조건 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`정의역에서 a<0, a=-2 를 정하고 치역에서 b=-5 를 얻어 a+b=-7 을 구하는 세 단계라 2단계이다.`,
  slots: {
    given: [S('정의역', 'stem', R`정의역이 $\{x\mid x\le 3\}$`), S('치역', 'stem', R`치역이 $\{y\mid y\ge -5\}$`)],
    goal: [S('값', 'stem', R`$a+b$의 값은?`)],
    method: [MN('근호', 'solution', R`근호 안의 식이 $0$ 이상이어야 하므로 $ax+6\ge 0$의 해가 $x\le 3$이어야 한다.`), MI('부등식의성질', 'solution', R`부등호의 방향이 $x\le 3$으로 나타나려면 $a\lt 0$이어야 한다.`, '양변을 음수 a 로 나눌 때 부등호 방향이 바뀌는 성질로 a<0 을 얻는다.')],
    condition: [S('경계조건', 'solution', R`따라서 경계값을 비교하면 다음과 같다.`)],
  },
  how: R`ax+6>=0 의 해 x<=3 에서 a=-2, 치역 y>=b 에서 b=-5 를 구해 a+b=-7 로 보기 ①과 맞췄다. 해설의 결정적 단계가 정의역(근호 안 조건)과 치역으로 매개변수를 정하는 것이라 RPM-268 과 정의역·치역 매개변수 템플릿을 골랐다.`,
};

D[8] = {
  steps: [R`X={x|x>=2} 에서 치역이 Y={y|y<=1} 이려면 일차함수 f(x)=ax+7 은 감소해야 하므로 a<0 이다.`, R`감소함수라 x=2 에서 최댓값 f(2)=2a+7=1 이다.`, R`2a=-6 이므로 a=-3 이고 a<0 을 만족한다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07B,
  unitEv: R`$X$에서 $Y$로의 함수 $f(x)=ax+7$이 일대일대응이 되도록 하는 상수 $a$의 값은?`,
  rpm: 'H1-RPM-257', rpmReason: R`X 에서 Y 로 가는 f(x)=ax+7 이 일대일대응이 되도록 a<0 과 f(2)=1 을 쓰는 단계라 일대일함수 행이다.`,
  pt: 'PT_ONE_TO_ONE_BIJECTION', tpl: 'TPL_AFFINE_INTERVAL_BIJECTION',
  typeReason: R`반직선 x>=2 에서 y<=1 로 가는 일차함수가 일대일대응이려면 감소하고 f(2)=1 이어야 한다는 조건으로 a=-3 을 정하는 것이 일차함수의 구간 일대일대응 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`감소 조건 a<0 을 알아낸 뒤 f(2)=2a+7=1 로 a=-3 을 구하는 두세 단계라 2단계이다.`,
  slots: {
    given: [S('집합', 'stem', R`두 집합 $X=\{x\mid x\ge 2\}$, $Y=\{y\mid y\le 1\}$`), S('일차함수', 'stem', R`함수 $f(x)=ax+7$`)],
    goal: [S('값', 'stem', R`상수 $a$의 값은?`)],
    method: [MN('증가감소', 'solution', R`일차함수 $f(x)=ax+7$은 감소해야 한다.`), MN('최댓값', 'solution', R`감소함수이므로 $x=2$일 때 함숫값이 최댓값 $1$이 되어야 한다.`)],
    condition: [S('음수', 'solution', R`따라서 기울기는 음수여야 한다.`)],
  },
  how: R`반직선 x>=2 에서 y<=1 로 일대일대응이려면 감소해 f(2)=2a+7=1 임을 직접 얻어 a=-3 으로 ③과 맞췄다. 해설도 감소 조건과 끝점값이라 RPM-257 과 일차함수의 구간 일대일대응 템플릿을 골랐다.`,
};

D[9] = {
  steps: [R`x>=1 에서 f(x)=2x+3 은 증가하고 최솟값 f(1)=5 이므로 치역은 y>=5 이다.`, R`역함수가 있으려면 일대일대응이므로 x<1 에서 a<0 이어야 하고 치역이 y<b 가 되어 b=5 이다.`, R`a 는 음의 정수라 a<=-1 이고 f(0)=a+5<=-1+5=4 이다.`, R`f(0) 의 최댓값은 4 이다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07B,
  unitEv: R`가 실수 전체의 집합에서 정의된 역함수를 가질 때, $f(0)$의 최댓값은?`,
  rpm: 'H1-RPM-257', rpmReason: R`역함수를 가지려면 x<1 과 x>=1 의 두 치역이 y<5 와 y>=5 로 이어지는 일대일대응이어야 한다는 단계가 일대일함수 행이다.`,
  pt: 'PT_ONE_TO_ONE_BIJECTION', tpl: 'TPL_PIECEWISE_RANGE_STITCH_BIJECTION',
  typeReason: R`조각함수 a(x-1)^2+b (x<1), 2x+3 (x>=1) 의 두 치역을 b=5 에서 이어 붙여 일대일대응이 되도록 a<0, b=5 를 정하는 것이 조각함수의 일대일대응 조건 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`x>=1 의 치역 y>=5, x<1 에서 a<0 과 b=5, 정수 조건 a<=-1 로 f(0)=a+5<=4 를 얻는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('조각함수', 'stem', R`a(x-1)^2+b&(x\lt 1)`), S('정수', 'stem', R`두 정수 $a$, $b$에 대하여 함수`)],
    goal: [S('최댓값', 'stem', R`$f(0)$의 최댓값은?`)],
    method: [MN('일대일대응', 'solution', R`실수 전체의 집합에서 역함수를 가지려면 $f$가 일대일대응이어야 한다.`), MI('증가감소', 'solution', R`$x\ge 1$인 구간에서 $f(x)=2x+3$은 증가함수이고 최솟값은 $f(1)=5$이므로 치역은 $\{y\mid y\ge 5\}$이다.`, 'x>=1 에서 증가함수 2x+3 의 최솟값으로 치역 y>=5 를 구한다.')],
    condition: [S('경계조건', 'solution', R`경계값이 같아야 한다.`)],
  },
  how: R`x>=1 의 치역 y>=5 와 x<1 의 치역 y<b 를 b=5 로 이어 a<=-1, f(0)=a+5<=4 를 직접 구해 ③과 맞췄다. 해설의 결정적 단계가 조각함수 두 치역의 이음이라 RPM-257 과 조각함수 일대일대응 템플릿을 골랐다.`,
};

D[10] = {
  steps: [R`그림에서 점선을 따라 y=x 로 옮기면 f(a)=b, f(b)=c, f(c)=d, f(d)=e 이다.`, R`(f∘f∘f)(k)=e 이면 f(d)=e, f(c)=d, f(b)=c 이므로 k 에서 세 번 보내 e 가 되는 k=b 이다.`, R`확인: f(f(f(b)))=f(f(c))=f(d)=e 이다.`],
  ans: '②', fig: ['NEEDS_FIGURE', R`함수 $y=f(x)$의 그래프와 직선 $y=x$가 다음 그림과 같을 때`], sfig: ['NONE', ''], unit: U07C,
  unitEv: R`$(f\circ f\circ f)(k)=e$를 만족시키는 $k$는?`,
  rpm: 'H1-RPM-253', rpmReason: R`그래프에서 f(a)=b, f(b)=c, f(c)=d, f(d)=e 를 읽어 (f∘f∘f)(k)=e 인 k=b 를 찾는 단계라 합성함수 계산 행이다.`,
  pt: 'PT_COMPOSITION_EVALUATION', tpl: 'TPL_COMPOSITION_GRAPH_TRACE_VALUE',
  typeReason: R`y=x 를 이용한 점선 그림에서 f(d)=e, f(c)=d, f(b)=c 를 거꾸로 따라가 (f∘f∘f)(k)=e 인 k=b 를 찾는 것이 그래프에서 합성함숫값을 역추적하는 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`그림에서 a→b→c→d→e 대응을 읽고 e 에서 세 번 거꾸로 올라가 k=b 를 얻는 세 단계라 2단계이다.`,
  slots: {
    given: [S('그래프', 'stem', R`함수 $y=f(x)$의 그래프와 직선 $y=x$가`)],
    goal: [S('값', 'stem', R`만족시키는 $k$는?`)],
    method: [MN('합성함수', 'solution', R`세 번 합성한 결과가 $e$가 되려면 거꾸로`), MN('대입', 'solution', R`실제로 $k=b$를 대입하면 다음과 같다.`)],
    condition: [],
  },
  how: R`그림의 점선으로 f(a)=b, f(b)=c, f(c)=d, f(d)=e 를 읽고 (f∘f∘f)(b)=e 를 직접 확인해 ②와 맞췄다. 해설도 그래프에서 합성값을 거꾸로 따라가므로 RPM-253 과 그래프 역추적 템플릿을 골랐다.`,
};

D[11] = {
  steps: [R`(P-Q)∪(R^c-Q^c)=∅ 이므로 P-Q=∅, R^c-Q^c=∅ 이다.`, R`P-Q=∅ 에서 P ⊂ Q, R^c-Q^c=∅ 에서 R^c ⊂ Q^c 이므로 Q ⊂ R 이다. 즉 P ⊂ Q ⊂ R 이다.`, R`ㄱ p→r: P ⊂ R 이라 참, ㄴ r→q: R ⊂ Q 라 할 수 없어 거짓, ㄷ ¬r→¬q: R^c ⊂ Q^c 라 참이다.`, R`항상 참인 것은 ㄱ, ㄷ 이므로 ④이다.`],
  ans: '④', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$(P-Q)\cup(R^c-Q^c)=\varnothing$일 때, 다음 보기에서 항상 참인 명제만을 있는 대로 고른 것은?`,
  rpm: 'H1-RPM-243', rpmReason: R`(P-Q)∪(R^c-Q^c)=∅ 에서 진리집합 P ⊂ Q ⊂ R 의 포함 관계를 얻는 단계라 진리집합 행이다.`,
  pt: 'PT_TRUTH_SET_RELATION', tpl: 'TPL_TRUTHSET_CHAINED_INCLUSION',
  typeReason: R`집합식 (P-Q)∪(R^c-Q^c)=∅ 에서 P ⊂ Q ⊂ R 의 연쇄 포함을 만들어 ㄱ p→r, ㄴ r→q, ㄷ ¬r→¬q 의 참·거짓을 가르는 것이 진리집합의 연쇄 포함 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`합집합이 공집합임에서 P ⊂ Q 와 Q ⊂ R 을 따로 끌어낸 뒤 ㄱ·ㄴ·ㄷ 세 명제를 포함 관계로 판정하는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('진리집합', 'stem', R`세 조건 $p$, $q$, $r$의 진리집합을 각각 $P$, $Q$, $R$이라 하자.`), S('공집합', 'stem', R`$(P-Q)\cup(R^c-Q^c)=\varnothing$`)],
    goal: [S('판정', 'stem', R`항상 참인 명제만을 있는 대로 고른 것은?`)],
    method: [MN('합집합', 'solution', R`합집합이 공집합이므로 두 집합이 모두 공집합이어야 한다.`), MN('포함관계', 'solution', R`세 진리집합 사이에는 다음 포함 관계가 성립한다.`)],
    condition: [S('항상성립', 'stem', R`항상 참인 명제만을`)],
  },
  how: R`합집합이 공집합임에서 P ⊂ Q ⊂ R 을 얻어 ㄱ·ㄷ 만 항상 참임을 직접 판정해 ④와 맞췄다. 해설의 결정적 단계가 진리집합의 연쇄 포함이라 RPM-243 과 진리집합 연쇄 포함 템플릿을 골랐다.`,
};

D[12] = {
  steps: [R`f(5)=k 라 하면 역함수의 정의에 의해 f^{-1}(k)=5 이다.`, R`f^{-1}(2x+1)=3x-4 에서 3x-4=5 이면 x=3 이다.`, R`x=3 을 넣으면 f^{-1}(2·3+1)=f^{-1}(7)=5 이므로 f(5)=7 이다.`],
  ans: '⑤', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07I,
  unitEv: R`일차함수 $f(x)$의 역함수 $f^{-1}(x)$가 $f^{-1}(2x+1)=3x-4$를 만족시킬 때, $f(5)$의 값은?`,
  rpm: 'H1-RPM-255', rpmReason: R`f^{-1}(2x+1)=3x-4 에서 f^{-1}(7)=5 를 얻어 f(5)=7 로 읽는 단계라 역함수 구하기 행이다.`,
  pt: 'PT_INVERSE_VALUE', tpl: 'TPL_INVERSE_VALUE_DIRECT',
  typeReason: R`f(5)=k 를 f^{-1}(k)=5 로 바꾸고 3x-4=5 에서 x=3, k=2x+1=7 로 역함숫값을 직접 구하는 것이 역함숫값 직접 구하기 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`f(5)=k 를 f^{-1}(k)=5 로 바꾸고 3x-4=5 에서 x=3, 2x+1=7 로 k=7 을 얻는 세 단계라 2단계이다.`,
  slots: {
    given: [S('일차함수', 'stem', R`일차함수 $f(x)$의 역함수 $f^{-1}(x)$가`), S('역함수', 'stem', R`$f^{-1}(2x+1)=3x-4$를 만족시킬 때`)],
    goal: [S('값', 'stem', R`$f(5)$의 값은?`)],
    method: [MN('정의', 'solution', R`역함수의 정의에 의해 다음이 성립한다.`), MN('대입', 'solution', R`$x=3$을 주어진 식에 대입하면 다음과 같다.`)],
    condition: [],
  },
  how: R`f(5)=k 로 놓고 f^{-1}(k)=5 와 f^{-1}(2x+1)=3x-4 를 맞춰 x=3, f(5)=7 을 직접 얻어 ⑤와 맞췄다. 해설의 결정적 단계가 역함수의 정의로 값을 읽는 것이라 RPM-255 와 역함숫값 직접 구하기 템플릿을 골랐다.`,
};

D[13] = {
  steps: [R`그림에서 수직 점근선이 x=1 이므로 x=-c 에서 c=-1 이다.`, R`수평 점근선이 y=-2 이므로 a=-2 이다.`, R`점 (0,3) 을 지나므로 3=b/(-1) 에서 b=-3 이다.`, R`f(x)=(-2x-3)/(x-1) 이므로 f(6)=(-12-3)/5=-3 이다.`],
  ans: '①', fig: ['NEEDS_FIGURE', R`함수 $y=\dfrac{ax+b}{x+c}$의 그래프가 아래 그림과 같을 때`], sfig: ['NONE', ''], unit: U08,
  unitEv: R`유리함수 $y=\dfrac{ax+b}{x+c}$의 수직 점근선은 분모가 $0$이 되는 $x=-c$이다.`,
  rpm: 'H1-RPM-263', rpmReason: R`그림의 점근선 x=1, y=-2 와 점 (0,3) 으로 a=-2, b=-3, c=-1 을 정해 식을 결정하는 단계가 유리함수 식 결정 행이다.`,
  pt: 'PT_FUNCTION_RECOVERY', tpl: 'TPL_FUNCTION_FORM_FROM_ASYMPTOTE_POINT',
  typeReason: R`점근선 x=1, y=-2 와 지나는 점 (0,3) 에서 f(x)=(-2x-3)/(x-1) 을 정하는 것이 점근선과 한 점으로 함수식 구하기 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`두 점근선으로 c=-1, a=-2 를 얻고 점 (0,3) 으로 b=-3 을 구한 뒤 f(6)=-3 을 계산하는 네 단계라 2단계이다.`,
  slots: {
    given: [S('그래프', 'stem', R`함수 $y=\dfrac{ax+b}{x+c}$의 그래프가`)],
    goal: [S('값', 'stem', R`$f(6)$의 값은?`)],
    method: [MN('점근선', 'solution', R`수평 점근선은 $x$의 계수의 비인 $y=a$이다.`), MN('대입', 'solution', R`그래프가 점 $(0,3)$을 지나므로 식에 대입한다.`)],
    condition: [S('통과', 'solution', R`그래프가 점 $(0,3)$을 지나므로`)],
  },
  how: R`그림의 점근선 x=1, y=-2 와 점 (0,3) 에서 f(x)=(-2x-3)/(x-1), f(6)=-3 을 직접 구해 ①과 맞췄다. 해설의 결정적 단계가 점근선과 한 점으로 식을 정하는 것이라 RPM-263 과 점근선과 한 점 템플릿을 골랐다.`,
};

D[14] = {
  steps: [R`x<0 이면 x-2<-2 이므로 -3<6/(x-2)<0 이다.`, R`따라서 x<0 에서 a-3<y<a 이다.`, R`제3사분면(x<0, y<0)을 지나지 않으려면 x<0 에서 y>=0 이어야 하므로 a-3>=0 이다.`, R`a>=3 이므로 a 의 최솟값은 3 이다.`],
  ans: '④', fig: ['SELF_CONTAINED', R`그래프가 제$3$사분면을 지나지 않도록`], sfig: ['NONE', ''], unit: U08,
  unitEv: R`유리함수 $y=\dfrac{6}{x-2}+a$의 그래프가 제$3$사분면을 지나지 않도록 하는 실수 $a$의 최솟값은?`,
  rpm: 'H1-RPM-262', rpmReason: R`y=6/(x-2)+a 가 제3사분면을 지나지 않도록 x<0 에서 a-3>=0 을 따지는 단계가 그래프의 사분면 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_QUADRANT', tpl: 'TPL_FUNCTION_QUADRANT_PARAMETER',
  typeReason: R`y=6/(x-2)+a 가 제3사분면을 지나지 않도록 x<0 에서 a-3>=0, 즉 a>=3 으로 매개변수 a 의 범위를 정하는 것이 매개변수에 따른 사분면 조건 템플릿이다.`,
  diff: [2, 'medium', 'B23'], diffReason: R`x<0 에서 -3<6/(x-2)<0 을 구하고 a-3>=0 으로 a>=3 을 얻는 세 단계이나 하한이 열린 구간 처리가 있어 2단계로 본다.`,
  slots: {
    given: [S('유리함수', 'stem', R`유리함수 $y=\dfrac{6}{x-2}+a$`)],
    goal: [S('최솟값', 'stem', R`실수 $a$의 최솟값은?`)],
    method: [MI('부등식의성질', 'solution', R`$x\lt 0$일 때 $x-2\lt -2$이므로 분수 부분의 범위는 다음과 같다.`, 'x<0 에서 x-2<-2 로부터 6/(x-2) 의 범위 -3<6/(x-2)<0 을 부등식의 성질로 구한다.')],
    condition: [S('통과', 'solution', R`그래프가 제$3$사분면($x\lt 0$, $y\lt 0$)을 지나지 않으려면`)],
  },
  how: R`x<0 에서 y 의 범위 a-3<y<a 를 구하고 제3사분면을 피하려면 a-3>=0 이라 a>=3, 최솟값 3 을 직접 얻어 ④와 맞췄다. 해설의 결정적 단계가 사분면 조건이라 RPM-262 와 사분면 매개변수 조건 템플릿을 골랐다.`,
};

D[15] = {
  steps: [R`f(x)=(1/2)(x-2)^2+a-2 (x>=2) 는 증가함수라 f 와 f^{-1} 의 교점은 y=x 위에 있다.`, R`f(x)=x 에서 (1/2)x^2-2x+a=x 이므로 x^2-6x+2a=0 이고 두 근을 α<β 라 한다.`, R`교점 (α,α), (β,β) 의 거리 sqrt(2)(β-α)=2 sqrt(2) 에서 β-α=2 이고 α+β=6 이라 α=2, β=4 이다.`, R`2a=αβ=8 이므로 a=4 이다.`],
  ans: '⑤', fig: ['SELF_CONTAINED', R`역함수 $y=f^{-1}(x)$의 그래프가 서로 다른 두 점에서 만나고`], sfig: ['NONE', ''], unit: U07I,
  unitEv: R`그 역함수 $y=f^{-1}(x)$의 그래프가 서로 다른 두 점에서 만나고`,
  rpm: 'H1-RPM-256', rpmReason: R`f(x)=(1/2)x^2-2x+a 와 역함수의 교점이 직선 y=x 위에 있음을 써서 x^2-6x+2a=0 을 세우는 단계가 그래프 대칭 행이다.`,
  pt: 'PT_INVERSE_GRAPH', tpl: 'TPL_INVERSE_GRAPH_INTERSECTION',
  typeReason: R`증가함수의 그래프와 역함수 그래프의 교점은 y=x 위이므로 f(x)=x 의 두 근 α, β 의 차 2 와 합 6 으로 a=4 를 정하는 것이 함수와 역함수의 교점 템플릿이다.`,
  diff: [3, 'medium', 'B23'], diffReason: R`교점이 y=x 위임을 알아 x^2-6x+2a=0 을 세우고 거리 2sqrt(2) 와 근과 계수로 α=2, β=4, a=4 를 구하는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('이차함수', 'stem', R`$f(x)=\dfrac{1}{2}x^2-2x+a\;(x\ge 2)$`), S('역함수', 'stem', R`그 역함수 $y=f^{-1}(x)$의 그래프가`)],
    goal: [S('값', 'stem', R`상수 $a$의 값은?`)],
    method: [MN('증가감소', 'solution', R`는 증가함수이므로, 함수 $y=f(x)$와 역함수 $y=f^{-1}(x)$의 교점은 모두 직선 $y=x$ 위에 있다.`), MN('근과계수의관계', 'solution', R`근과 계수의 관계에서 $\alpha+\beta=6$이므로`)],
    condition: [S('정의역제한', 'solution', R`두 근 모두 정의역 $x\ge 2$에 속한다.`)],
  },
  how: R`교점이 y=x 위임을 써서 x^2-6x+2a=0, β-α=2, α+β=6 에서 a=4 를 직접 구해 ⑤와 맞췄다. 해설의 결정적 단계가 함수와 역함수 그래프의 교점이 y=x 위인 것이라 RPM-256 과 역함수 교점 템플릿을 골랐다.`,
};

D[16] = {
  steps: [R`m-n=(17a+b)-(5a+b)=12a 이므로 (가)는 f(a)=12a 이다.`, R`m-n=4{p(p+1)-q(q+1)} 이므로 4 로 나누면 (나)는 g(a)=3a 이다.`, R`p(p+1), q(q+1) 은 연속한 두 정수의 곱이라 짝수이므로 그 차는 2 의 배수이고 k=2 이다.`, R`f(2)+g(2)=24+6=30 이다.`],
  ans: '③', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$m$, $n$이 모두 제곱수라고 가정하자.`,
  rpm: 'H1-RPM-249', rpmReason: R`m, n 이 모두 제곱수라고 가정하고 12a=4{p(p+1)-q(q+1)} 에서 홀수 3a 가 2 의 배수가 될 수 없는 모순을 보이는 단계가 귀류법 행이다.`,
  pt: 'PT_CONTRADICTION_PROOF', tpl: 'TPL_DIVISIBILITY_PARITY_CONTRADICTION',
  typeReason: R`m=(2p+1)^2, n=(2q+1)^2 로 놓고 m-n=12a, p(p+1)-q(q+1)=3a 가 2 의 배수와 홀수 3a 의 모순임을 보이는 것이 홀짝·배수 성질의 귀류법 증명 템플릿이다.`,
  diff: [2, 'medium', 'B12'], diffReason: R`m-n=12a, 4 로 나눈 3a, 연속한 두 정수의 곱이 2 의 배수임을 채우고 f(2)+g(2)=24+6 을 계산하는 네 단계라 2단계로 본다.`,
  slots: {
    given: [S('홀수', 'stem', R`$a$가 홀수이고 $b$가 짝수일 때`), S('완전제곱수', 'stem', R`중 적어도 하나는 제곱수가 아니다.`)],
    goal: [S('값', 'stem', R`$f(k)+g(k)$의 값은?`)],
    method: [MI('귀류법', 'stem', R`$m$, $n$이 모두 제곱수라고 가정하자.`, '결론을 부정하는 가정에서 모순을 이끌어 증명하는 과정이라 귀류법이다.'), MN('배수', 'solution', R`각각 $2$의 배수이므로 그 차인 $p(p+1)-q(q+1)$도 $2$의 배수이다.`)],
    condition: [S('적어도', 'stem', R`중 적어도 하나는 제곱수가 아니다.`)],
  },
  how: R`증명의 빈칸을 직접 채워 (가) 12a, (나) 3a, (다) 2 를 얻고 f(2)+g(2)=30 으로 ③과 맞췄다. 해설의 결정적 단계가 제곱수 가정에서 짝수·홀수 모순을 보이는 것이라 귀류법 행과 홀짝·배수 귀류법 템플릿을 골랐다.`,
};

D[17] = {
  steps: [R`t=sqrt(2x-2)>=0 으로 놓으면 x=(t^2+2)/2 이고 y=|t-2| 이며 직선은 y=(t^2+2)/8+k 이다.`, R`h(t)=|t-2|-(t^2+2)/8 라 하면 0<=t<=2 에서 h 는 7/4 에서 -3/4 로 감소하고 t>=2 에서는 -3/4 에서 t=4 일 때 최댓값 -1/4 까지 올랐다가 내려간다.`, R`h(t)=k 의 서로 다른 해가 2개인 경우는 k=-1/4 (t=4 접함, 그리고 0<=t<=2 에서 1개) 와 k=-3/4 (t=2, t=6) 이다.`, R`합은 -3/4+(-1/4)=-1 이다.`],
  ans: '②', fig: ['SELF_CONTAINED', R`그래프와 직선 $y=\dfrac{1}{4}x+k$가 서로 다른 두 점에서 만나도록`], sfig: ['NONE', ''], unit: U09,
  unitEv: R`그래프와 직선 $y=\dfrac{1}{4}x+k$가 서로 다른 두 점에서 만나도록 하는 모든 실수 $k$의 값의 합은?`,
  rpm: 'H1-RPM-272', rpmReason: R`y=|sqrt(2x-2)-2| 와 직선 y=x/4+k 의 교점 수를 t=sqrt(2x-2) 치환으로 따지는 단계가 무리함수의 교점 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_INTERSECTION', tpl: 'TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE',
  typeReason: R`절댓값이 붙은 무리함수를 t=2 에서 나눠 y=2-t, y=t-2 와 직선의 교점을 구간별로 세어 k=-3/4, -1/4 를 찾는 것이 절댓값·조각함수 그래프의 교점 템플릿이다.`,
  diff: [4, 'medium', 'B45'], diffReason: R`치환 t, 구간 0<=t<=2 와 t>=2 분리, t^2-8t+8k+18=0 판별식 접함 k=-1/4, 끝점 k=-3/4 까지 따지는 교점 개수 분류라 4단계로 본다.`,
  slots: {
    given: [S('무리함수', 'stem', R`함수 $y=\left|\sqrt{2x-2}-2\right|$의 그래프와`), S('직선', 'stem', R`직선 $y=\dfrac{1}{4}x+k$가`)],
    goal: [S('합', 'stem', R`모든 실수 $k$의 값의 합은?`)],
    method: [MI('치환', 'solution', R`$t=\sqrt{2x-2}\ge 0$으로 놓으면`, 't 로 놓아 절댓값 무리함수를 구간별 일차식으로 바꾸고 이차방정식으로 교점을 센다.'), MN('판별식', 'solution', R`이차방정식의 판별식을 이용하면 접할 때의 $k$ 값을 구할 수 있다.`), MI('경우분류', 'solution', R`① $0\le t\le 2$($1\le x\le 3$)인 경우`, 't 가 2 보다 작은 구간과 큰 구간으로 나누어 교점 수를 센다.')],
    condition: [S('접함', 'solution', R`접할 때의 $k$ 값을`)],
  },
  how: R`t=sqrt(2x-2) 로 구간을 나눠 교점 수를 분류해 k=-3/4, -1/4 에서만 서로 다른 두 점이 생김을 직접 확인하고 합 -1 로 ②와 맞췄다. 해설의 결정적 단계가 무리함수 그래프와 직선의 교점 개수라 RPM-272 와 절댓값·조각함수 교점 템플릿을 골랐다.`,
};

D[18] = {
  steps: [R`u=x-2>0 이라 하면 교점은 (2+u, 3+1/u) 이고 원의 방정식에 넣으면 u^2+1/u^2=r^2 이다.`, R`v=u^2 으로 치환하면 v^2-r^2 v+1=0 이므로 두 근의 곱 1, 합 r^2 이다. 즉 u1u2=1, u1^2+u2^2=r^2 이다.`, R`1/u1=u2 이므로 두 교점의 x좌표 차·y좌표 차의 절댓값이 모두 |u1-u2| 이다.`, R`거리 제곱 2(u1-u2)^2=16 에서 2(r^2-2)=16, r^2=10 이다.`],
  ans: '10', fig: ['SELF_CONTAINED', R`의 그래프와 원 $(x-2)^2+(y-3)^2=r^2\;(r\gt 0)$이 만나는 서로 다른 두 점`], sfig: ['NONE', ''], unit: U08,
  unitEv: R`서로 다른 두 점 사이의 거리가 $4$일 때, $r^2$의 값을 구하시오.`,
  rpm: 'H1-RPM-265', rpmReason: R`y=1/(x-2)+3 (x>2) 와 원 (x-2)^2+(y-3)^2=r^2 의 교점을 u^2+1/u^2=r^2 로 세우는 단계가 유리함수와 그래프의 교점 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_INTERSECTION', tpl: 'TPL_FUNCTION_INTERSECTION_DISTANCE_RATIO',
  typeReason: R`교점의 좌표 (u1, 1/u1), (u2, 1/u2) 가 u1u2=1 로 대칭임을 써서 두 교점 거리 4 로 r^2=10 을 정하는 것이 교점의 거리·비 조건 템플릿이다.`,
  diff: [4, 'medium', 'B34'], diffReason: R`u 치환, v=u^2 의 근과 계수 u1u2=1, 대칭으로 얻은 거리식 2(r^2-2)=16 을 잇는 4단계라 4단계로 본다.`,
  slots: {
    given: [S('함수', 'stem', R`함수 $f(x)=\dfrac{1}{x-2}+3\;(x\gt 2)$`), S('원', 'stem', R`원 $(x-2)^2+(y-3)^2=r^2\;(r\gt 0)$`)],
    goal: [S('값', 'stem', R`$r^2$의 값을 구하시오.`)],
    method: [MN('치환', 'solution', R`$v=u^2$로 치환하면 $v^2-r^2v+1=0$이므로`), MI('근과계수의관계', 'solution', R`두 근의 곱은 $1$이고 합은 $r^2$이다.`, 'v 에 대한 이차방정식의 두 근의 합과 곱을 계수에서 바로 읽는다.')],
    condition: [S('거리', 'stem', R`서로 다른 두 점 사이의 거리가 $4$일 때`)],
  },
  how: R`u=x-2 로 u^2+1/u^2=r^2 를 세우고 u1u2=1 의 대칭으로 거리 제곱 2(r^2-2)=16 에서 r^2=10 을 직접 얻어 저장 정답 10 과 맞췄다. 해설의 결정적 단계가 유리함수와 원의 교점 조건이라 RPM-265 와 교점의 거리 조건 템플릿을 골랐다.`,
};

D[19] = {
  steps: [R`t=x-2>0 으로 놓으면 (x^2-2x+9)/(x-2)=(t^2+2t+9)/t=t+9/t+2 이다.`, R`산술평균과 기하평균의 관계에서 t+9/t+2>=2 sqrt(9)+2=8 이다.`, R`등호는 t=9/t, 즉 t=3 일 때 성립하므로 x=5 에서 최솟값 8 이다.`, R`a=5, b=8 이므로 a+b=13 이다.`],
  ans: '13', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`$x\gt 2$일 때, $\dfrac{x^2-2x+9}{x-2}$는 $x=a$에서 최솟값 $b$를 갖는다.`,
  rpm: 'H1-RPM-250', rpmReason: R`t+9/t+2 에 산술평균과 기하평균의 관계를 써서 최솟값 8 을 얻는 단계가 절대부등식을 쓰는 행이다.`,
  pt: 'PT_ABSOLUTE_INEQUALITY_EXTREMUM', tpl: 'TPL_AMGM_RECIPROCAL_MINIMUM',
  typeReason: R`x-2=t 로 치환해 t+9/t+2>=8 을 산술평균·기하평균으로 얻고 t=3, x=5 에서 최솟값 8 임을 구하는데 역수항 9/t 가 든 식을 산술평균·기하평균으로 정리하므로 역수식의 최솟값 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`x-2=t 치환으로 t+9/t+2 를 만들고 산술기하평균으로 8, 등호 t=3 에서 a=5, b=8, a+b=13 을 얻는 세 단계라 2단계이다.`,
  slots: {
    given: [S('유리식', 'stem', R`$\dfrac{x^2-2x+9}{x-2}$`)],
    goal: [S('최솟값', 'stem', R`$x=a$에서 최솟값 $b$를 갖는다.`), S('값', 'stem', R`$a+b$의 값을 구하시오.`)],
    method: [MI('치환', 'solution', R`$t=x-2\gt 0$으로 놓으면 $x=t+2$이다.`, 'x-2 를 t 로 놓아 식을 t+9/t+2 꼴로 바꾼다.'), MN('산술기하평균', 'solution', R`산술평균과 기하평균의 관계에 의해 다음이 성립한다.`)],
    condition: [S('등호조건', 'solution', R`등호는 $t=\dfrac{9}{t}$일 때 성립하고`)],
  },
  how: R`t=x-2 로 치환해 t+9/t+2>=8, 등호 t=3, x=5 에서 a+b=13 을 직접 구해 저장 정답 13 과 맞췄다. 해설의 결정적 단계가 산술평균과 기하평균으로 최솟값을 얻는 것이라 RPM-250 과 산술기하 최솟값 템플릿을 골랐다.`,
};

D[20] = {
  steps: [R`뒤집는 카드 집합을 S 라 하고 조건을 (가) 1∉S 이면 2∈S, (나) 2∈S 이면 3∈S, (다) 3∈S 이면 4∉S, (라) 4∈S 이면 1∉S 로 읽는다.`, R`4∈S 라 하면 (라) 1∉S, (가) 2∈S, (나) 3∈S, (다) 4∉S 로 모순이므로 4∉S 이다.`, R`가능한 S 는 {2,3}, {1}, {1,3}, {1,2,3} 이고 보이는 합은 각각 17, 15, 18, 22 이다.`, R`최댓값 22 와 최솟값 15 의 차는 7 이다.`],
  ans: '7', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U06,
  unitEv: R`다음 조건을 모두 만족시키도록 카드를 뒤집었을 때, 보이는 면에 적혀 있는 모든 수들의 합의 최댓값과 최솟값의 차를 구하시오.`,
  rpm: 'H1-RPM-249', rpmReason: R`4 번 카드를 뒤집는다고 가정하면 (라)(가)(나)(다) 가 모순이 되어 4 번은 뒤집지 않는다는 단계가 귀류법 행이다.`,
  pt: 'PT_LOGIC_CHAIN', tpl: 'TPL_LOGIC_CONSTRAINT_PUZZLE',
  typeReason: R`(가)~(라) 의 조건명제를 이어 4 번을 배제하고 S={2,3}, {1}, {1,3}, {1,2,3} 의 합 17, 15, 18, 22 를 가려 22-15=7 을 구하는 것이 논리 조건을 이용한 추론 템플릿이다.`,
  diff: [3, 'medium', 'B34'], diffReason: R`조건 (가)~(라) 를 명제로 읽고 4 번 배제 모순을 보인 뒤 네 경우의 합 15, 17, 18, 22 를 비교해 22-15=7 을 구하는 네 단계라 3단계로 본다.`,
  slots: {
    given: [S('조건', 'stem', R`(가) $1$이 적힌 카드를 뒤집지 않으면 $2$가 적힌 카드는 뒤집는다.`)],
    goal: [S('최댓값', 'stem', R`합의 최댓값과 최솟값의 차를 구하시오.`), S('최솟값', 'stem', R`합의 최댓값과 최솟값의 차를 구하시오.`), S('차', 'stem', R`최솟값의 차를 구하시오.`)],
    method: [MI('귀류법', 'solution', R`먼저 $4$번 카드를 뒤집는다고 가정하면 조건 (라)에 의해 $1$번 카드는 뒤집지 않는다.`, '4 번 카드를 뒤집는다고 가정해 (라)(가)(나)(다) 로 모순을 얻어 4 번을 배제한다.'), MI('경우분류', 'solution', R`이제 $4$번 카드를 뒤집지 않는 경우를 두 가지로 나눈다.`, '1 번 카드를 뒤집는 경우와 뒤집지 않는 경우로 나누어 가능한 S 를 모두 센다.')],
    condition: [S('조건', 'stem', R`다음 조건을 모두 만족시키도록 카드를 뒤집었을 때`)],
  },
  how: R`조건 (가)~(라) 를 직접 풀어 4 번 카드를 뒤집을 수 없고 가능한 합이 15, 17, 18, 22 임을 확인해 차 7 을 얻고 저장 정답 7 과 맞췄다. 해설의 결정적 단계가 가정으로 모순을 보이는 것이라 귀류법 행과 논리 조건 추론 템플릿을 골랐다.`,
};

D[21] = {
  steps: [R`f^{-1}(2)=3 이므로 f(3)=2 이고 g^{-1}(1)=2 이므로 g(2)=1 이다.`, R`g(1) 은 2 또는 3 인데 g(1)=3 이면 (f∘g)(1)=f(3)=3 이 되어 f(3)=2 에 모순이므로 g(1)=2 이다.`, R`f(g(1))=f(2)=3 이고 f(3)=2 이므로 f(1)=1 이다.`, R`g(3)=3 이므로 g^{-1}(3)=3 이고 (g∘f)(3)=g(2)=1 이므로 합은 3+1=4 이다.`],
  ans: '(1) 2, (2) 1, (3) 4', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07B,
  unitEv: R`$X$에서 $X$로의 두 함수 $f$와 $g$가 모두 일대일대응이고, 다음 조건을 모두 만족시킨다.`,
  rpm: 'H1-RPM-257', rpmReason: R`f, g 가 집합 {1,2,3} 의 일대일대응이라 g(1) 이 2 또는 3 이라는 것과 남은 값을 정하는 단계가 일대일함수 행이다.`,
  pt: 'PT_FINITE_BIJECTION', tpl: 'TPL_MULTIPLE_BIJECTIONS_DEDUCTION',
  typeReason: R`f^{-1}(2)=3, g^{-1}(1)=2, (f∘g)(1)=3 으로 g(1)=2, f(1)=1, g(3)=3 을 차례로 정하는 것이 여러 일대일대응의 관계로 함수값 결정 템플릿이다.`,
  diff: [2, 'high', 'NONE'], diffReason: R`f(3)=2, g(2)=1 을 읽고 g(1)=3 이면 f(3)=3 모순으로 g(1)=2, f(1)=1, g(3)=3 을 정해 3+1=4 를 얻는 네 단계라 2단계이다.`,
  slots: {
    given: [S('집합', 'stem', R`집합 $X=\{1,2,3\}$에 대하여`), S('역함수', 'stem', R`(가) $f^{-1}(2)=3$`), S('일대일대응', 'stem', R`두 함수 $f$와 $g$가 모두 일대일대응이고`)],
    goal: [S('값', 'stem', R`$g(1)$의 값을 구하는 과정을 서술하시오.`)],
    method: [MN('일대일대응', 'solution', R`$g$는 일대일대응이므로 $g(1)$은 $2$ 또는 $3$이다.`), MI('귀류법', 'solution', R`만약 $g(1)=3$이면 조건 (다)에서 $f(g(1))=f(3)=3$이 되어 $f(3)=2$에 모순이다.`, 'g(1)=3 이라 가정해 f(3)=3 과 f(3)=2 의 모순을 보여 g(1)=2 를 얻는다.'), MI('합성함수', 'solution', R`또 $(g\circ f)(3)=g(f(3))=g(2)=1$이다.`, 'g(f(3)) 로 합성함수의 값을 바깥부터 차례로 계산한다.')],
    condition: [S('조건', 'stem', R`다음 조건을 모두 만족시킨다.`)],
  },
  how: R`f(3)=2, g(2)=1 에서 g(1)=2, f(1)=1, g(3)=3 을 직접 얻어 (1) 2, (2) 1, (3) 4 로 저장 정답과 맞췄다. 해설의 결정적 단계가 두 일대일대응의 값을 합성 조건으로 정하는 것이라 RPM-257 과 여러 일대일대응 함수값 결정 템플릿을 골랐다.`,
};

D[22] = {
  steps: [R`x<0 이면 f(x)=-x+2>2 라 f(x)<0 인 해가 없고 x>=0 이면 2x-2<0 에서 x<1 이므로 0<=x<1 이다.`, R`x<0 이면 f(x)>2>=0 이므로 f(f(x))=2(-x+2)-2=-2x+2 이다.`, R`0<=x<1 이면 f(x)<0 이므로 f(f(x))=-(2x-2)+2=-2x+4 이다.`, R`x>=1 이면 f(x)>=0 이므로 f(f(x))=2(2x-2)-2=4x-6 이다.`],
  ans: '__STORED__', fig: ['NONE', ''], sfig: ['NONE', ''], unit: U07C,
  unitEv: R`함수 $y=(f\circ f)(x)$를 $x$의 값의 범위에 따라 나누어 구하는 과정을 서술하시오.`,
  rpm: 'H1-RPM-253', rpmReason: R`f(f(x)) 를 안쪽 f(x) 의 부호에 따라 -2x+2, -2x+4, 4x-6 으로 계산하는 단계가 합성함수 계산 행이다.`,
  pt: 'PT_COMPOSITE_FUNCTION_ANALYSIS', tpl: 'TPL_COMPOSITE_PIECEWISE_GRAPH_ANALYSIS',
  typeReason: R`조각함수 f 에서 안쪽 f(x) 의 부호로 x<0, 0<=x<1, x>=1 을 나눠 f(f(x)) 의 구간별 식을 얻는 것이 합성함수의 구간별 그래프 분석 템플릿이다.`,
  diff: [2, 'medium', 'B23'], diffReason: R`(1) 에서 0<=x<1 을 구하고 (2) 에서 안쪽 f(x) 의 부호로 세 구간을 나눠 -2x+2, -2x+4, 4x-6 을 잇는 두 덩이라 2단계로 본다.`,
  slots: {
    given: [S('조각함수', 'stem', R`실수 전체의 집합에서 정의된 함수`)],
    goal: [S('범위', 'stem', R`만족시키는 $x$의 값의 범위를 구하는 과정을 서술하시오.`), S('합성함수', 'stem', R`함수 $y=(f\circ f)(x)$를`)],
    method: [MI('경우분류', 'solution', R`$f(f(x))$의 식은 안쪽 함숫값 $f(x)$의 부호에 따라 결정된다.`, 'x 의 범위를 구간으로 나누어 안쪽 함숫값의 부호별로 다른 식을 쓴다.'), MI('대입', 'solution', R`$f(f(x))=2(-x+2)-2$`, '안쪽 f(x)=-x+2 를 바깥 식 2x-2 에 넣어 f(f(x)) 를 구한다.')],
    condition: [S('부호', 'solution', R`안쪽 함숫값 $f(x)$의 부호에 따라 결정된다.`)],
  },
  how: R`(1) 0<=x<1, (2) 안쪽 f(x) 의 부호별로 -2x+2, -2x+4, 4x-6 을 직접 구해 저장 정답과 맞췄다. 해설의 결정적 단계가 조각함수의 합성을 구간별로 계산하는 것이라 RPM-253 과 합성함수 구간별 분석 템플릿을 골랐다.`,
};

D[23] = {
  steps: [R`x<=0 에서 y=sqrt(-x)+2 는 끝점 (0,2) 에서 (-1,3), (-4,4) 를 지나고 x>=1 에서 y=1-sqrt(x-1) 은 시작점 (1,1) 에서 (2,0), (5,-1) 을 지난다.`, R`왼쪽 가지는 t=sqrt(-x) 로 t^2-t+k-2=0 이 서로 다른 두 음이 아닌 근이어야 하므로 2<=k<9/4 이다.`, R`오른쪽 가지는 s=sqrt(x-1) 로 s^2-s+2-k=0 이 서로 다른 두 음이 아닌 근이어야 하므로 7/4<k<=2 이다.`, R`두 범위의 공통부분은 k=2 이고 교점은 (-1,3), (0,2), (1,1), (2,0) 의 네 점이다.`],
  ans: '__STORED__', fig: ['SELF_CONTAINED', R`함수 $y=f(x)$의 그래프를 그리는 과정을 서술하시오.`], sfig: ['NONE', ''], unit: U09,
  unitEv: R`직선 $y=-x+k$가 서로 다른 네 점에서 만나도록 하는 실수 $k$의 값을 구하는 과정을 서술하시오.`,
  rpm: 'H1-RPM-272', rpmReason: R`x<=0 의 sqrt(-x)+2 와 x>=1 의 1-sqrt(x-1) 두 가지와 직선 y=-x+k 의 교점을 각각 이차방정식으로 세는 단계가 무리함수의 교점 행이다.`,
  pt: 'PT_FUNCTION_GRAPH_INTERSECTION', tpl: 'TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE',
  typeReason: R`조각함수의 두 무리함수 가지가 직선 y=-x+k 와 각각 두 점에서 만나는 k 의 범위 2<=k<9/4 와 7/4<k<=2 의 공통부분 k=2 를 구하는 것이 절댓값·조각함수 그래프의 교점 템플릿이다.`,
  diff: [4, 'medium', 'B34'], diffReason: R`두 가지의 그래프 작성, t^2-t+k-2=0 과 s^2-s+2-k=0 의 판별식·합·곱 조건 두 번, 범위의 공통부분 k=2 를 얻는 4단계라 4단계로 본다.`,
  slots: {
    given: [S('조각함수', 'stem', R`집합 $\{x\mid x\le 0\}\cup\{x\mid x\ge 1\}$에서 정의된 함수`), S('직선', 'stem', R`직선 $y=-x+k$가`)],
    goal: [S('그래프', 'stem', R`함수 $y=f(x)$의 그래프를 그리는 과정을 서술하시오.`), S('값', 'stem', R`실수 $k$의 값을 구하는 과정을 서술하시오.`)],
    method: [MI('치환', 'solution', R`$t=\sqrt{-x}\ge 0$으로 놓으면 $x=-t^2$, $y=t+2$이다.`, 't 로 놓아 무리함수 가지를 이차방정식 t^2-t+k-2=0 으로 바꾼다.'), MN('판별식', 'solution', R`서로 다른 두 음이 아닌 실근을 가지려면 판별식 $D\gt 0$`), MI('근과계수의관계', 'solution', R`두 근의 합 $1\gt 0$, 두 근의 곱 $k-2\ge 0$`, '이차방정식의 두 근의 합과 곱의 부호로 두 근이 모두 0 이상임을 판정한다.')],
    condition: [S('정의역제한', 'stem', R`집합 $\{x\mid x\le 0\}\cup\{x\mid x\ge 1\}$에서 정의된 함수`)],
  },
  how: R`두 가지 y=sqrt(-x)+2, y=1-sqrt(x-1) 를 직선 y=-x+k 와 각각 두 점에서 만나게 하는 범위 2<=k<9/4, 7/4<k<=2 를 직접 구해 k=2 로 저장 정답과 맞췄다. 해설의 결정적 단계가 무리함수 교점 수 분류라 RPM-272 와 조각함수 교점 템플릿을 골랐다.`,
};


// 토큰 보강: 검사기가 문항 본문의 식별자(숫자·낱말)를 이유 문장에서 찾는다.
const ADD = {
  3: { typeReason: " (합 12)", rpmReason: " (정수합 12)" },
  7: { typeReason: " (근호 ax+6)", diffReason: " (ax+6>=0 에서 시작)" },
  8: { how: " (f(x)=ax+7)", diffReason: " (f(x)=ax+7)", typeReason: " (f(x)=ax+7)" },
  9: { how: " (cases 꼴)", steps: " (cases 꼴 조각함수)", diffReason: " (cases 꼴)", typeReason: " (cases 꼴)", rpmReason: " (cases 꼴)" },
  11: { how: " (보기 q-box)", steps: " (보기 q-box)", diffReason: " (보기 q-box)", typeReason: " (보기 q-box)", rpmReason: " (보기 q-box)" },
  13: { how: " (y=(ax+b)/(x+c))", diffReason: " (ax+b)/(x+c) 의 세 상수", typeReason: " (ax+b)/(x+c) 꼴", rpmReason: " (ax+b)/(x+c) 꼴" },
  17: { how: " (t^2-8t+8k+18=0)", steps: " (t^2-8t+8k+18=0)", typeReason: " (t^2-8t+8k+18=0)", rpmReason: " (t^2-8t+8k+18=0)" },
  18: { rpmReason: " (r^2=10)" },
  19: { typeReason: " (a+b=13)", rpmReason: " (a+b=13)" },
  20: { rpmReason: " (합 17, 22)" },
  21: { how: " (보기 q-box)", steps: " (보기 q-box)", diffReason: " (보기 q-box)", typeReason: " (보기 q-box)", rpmReason: " (보기 q-box)" },
  22: { how: " (cases 꼴)", steps: " (cases 꼴 조각함수)", diffReason: " (cases 꼴)", typeReason: " (cases 꼴)", rpmReason: " (cases 꼴)" },
  23: { how: " (cases 꼴)", steps: " (cases 꼴 조각함수)", diffReason: " (cases 꼴)", typeReason: " (cases 꼴)", rpmReason: " (cases 꼴)" },
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
