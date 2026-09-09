import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."); const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_hanyeong_2final"); const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8")); const job = selected.jobs.find((item) => item.examId === "23_hanyeong_2final"); const raw = String.raw;
function q(displayNo, pageNo, content, choices = [], options = {}) { return { displayNo: String(displayNo), questionType: options.questionType || (String(displayNo).startsWith("서술") ? "서술형" : String(displayNo).startsWith("단답") ? "서술형" : "객관식"), content, choices, hasVisualAsset: Boolean(options.visualAssetBBox), visualAssetType: options.visualAssetType || (options.visualAssetBBox ? "diagram" : "none"), visualAssetBBox: options.visualAssetBBox || null, contentConfidence: options.reviewNeeded ? 0.86 : 0.98, choicesConfidence: choices.length ? (options.reviewNeeded ? 0.86 : 0.98) : 0.6, visualAssetConfidence: options.visualAssetBBox ? 0.9 : 0, reviewNeeded: Boolean(options.reviewNeeded), reviewReason: options.reviewReason || [], pageNo }; }
const R = [
  q(1, 1, raw`두 집합 $X=\{-1,1,2\},Y=\{0,1,2,3\}$에서 $X$의 임의의 원소 $x$에 대하여 다음 <보기>와 같은 $X$에서 $Y$로의 대응을 생각할 때, $X$에서 $Y$로의 함수인 것을 모두 고른 것은?\nㄱ. $x\mapsto x$\quad ㄴ. $x\mapsto x+1$\quad ㄷ. $x\mapsto|x|-1$\quad ㄹ. $x\mapsto x^2$\quad ㅁ. $x\mapsto x^2-1$`, ["ㄱ,ㄷ", "ㄴ,ㄹ", "ㄷ,ㅁ", "ㄱ,ㄷ,ㄹ", "ㄴ,ㄷ,ㅁ"]),
  q(2, 1, raw`무리식 $\frac{x}{\sqrt{2-x}}$의 값이 실수가 되도록 하는 $x$의 값의 범위는?`, [raw`$x<2$`, raw`$x\le2$`, raw`$x>2$`, raw`$x\ge2$`, "$x<0$"]),
  q(3, 1, raw`다음 그림과 같은 $f:X\to Y$와 함수 $g(x)=ax^2+bx+c$가 서로 같은 함수일 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값은?`, ["-2", "-1", "0", "1", "2"], { visualAssetBBox: { x1: 900, y1: 280, x2: 1740, y2: 1000 } }),
  q(4, 1, raw`조합에서 ${"_nC_2"}=36$을 만족시키는 자연수 $n$의 값은?`, ["7", "8", "9", "10", "11"]),
  q(5, 2, raw`함수 $y=\frac{3x-1}{x+1}$의 그래프에 대한 설명 중 옳지 않은 것은?`, [raw`정의역은 $\{x\mid x\ne-1\}$인 실수이다.`, raw`치역은 $\{y\mid y\ne3\}$인 실수이다.`, raw`점근선은 $x=-1,y=3$이다.`, raw`$y=\frac3x$의 그래프를 $x$축의 방향으로 -1만큼, $y$축의 방향으로 3만큼 평행이동한 것이다.`, "함수의 그래프는 모든 사분면을 지난다."]),
  q(6, 2, raw`함수 $y=\sqrt{ax+b}+c$의 그래프가 오른쪽 그림과 같을 때, 상수 $a,b,c$에 대하여 $abc$의 값은?`, ["-10", "-8", "-6", "-4", "-2"], { visualAssetBBox: { x1: 610, y1: 750, x2: 850, y2: 1320 } }),
  q(7, 2, raw`두 집합 $X=\{x\mid x\ge2\},Y=\{y\mid y\ge5\}$에 대하여 $X$에서 $Y$로의 함수 $f(x)=x^2-2x+a$가 일대일 대응일 때, 상수 $a$의 값은?`, ["1", "2", "3", "4", "5"]),
  q(8, 2, raw`두 함수 $f(x)=-x+3,g(x)=2x-4$에 대하여 $(h\circ g\circ f)(x)=g(x)$를 만족시키는 함수 $h(x)$에 대하여 $h(1)$의 값은?`, ["-3", "-1", "1", "3", "5"]),
  q(9, 3, raw`함수 $f(x)=\frac{bx+c}{x+a}$의 그래프가 점 $(2,1)$에 대하여 대칭이고 $(0,2)$를 지날 때, $f^{-1}(5)$의 값은? (단, $a,b,c$는 상수이다.)`, [raw`\frac12`, "1", raw`\frac32`, "2", raw`\frac52`]),
  q(10, 3, raw`어느 은행의 본점이 있는 도시에 4개의 지점이 있는데, 본점에서 각 지점까지의 거리는 모두 다르다. 본점에 소속된 4명의 직원 A,B,C,D를 각 지점에 출장 보내려고 할 때, A를 B보다 가까운 지점으로 보내는 경우의 수는?`, ["12", "14", "16", "18", "20"]),
  q(11, 3, raw`어느 회사에서 올해 입사한 직원 8명 중 해외 지사로 파견할 3명의 직원을 뽑으려고 한다. 남자 직원을 적어도 1명 포함하여 뽑는 방법의 수가 46일 때, 올해 입사한 남자 직원의 수는?`, ["2", "3", "4", "5", "6"]),
  q(12, 3, raw`두 집합 $X=\{1,2,3,4,5\},Y=\{1,2,3,4,5,6,7,8\}$에 대하여 다음 조건을 모두 만족시키는 $X$에서 $Y$로의 함수 $f$의 개수는? (가) $x_1<x_2$이면 $f(x_1)<f(x_2)$ (나) $f(3)>5$`, ["22", "24", "26", "28", "30"], { reviewNeeded: true, reviewReason: ["source_choice_conflict: direct increasing-function count is 10, absent from the printed choices"] }),
  q(13, 4, raw`곡선 $y=\frac2x$ 위의 제1사분면에 있는 점 $P$와 곡선 $y=-\frac8x$ 위의 제4사분면에 있는 점 $Q$에 대하여 삼각형 $OPQ$의 넓이의 최솟값은? (단, $O$는 원점이다.)`, ["1", "2", "3", "4", "5"]),
  q(14, 4, raw`두 함수 $f(x)=\begin{cases}x^2+2ax+6&(x<0)\\x+6&(x\ge0)\end{cases},g(x)=x+3$에 대하여 합성함수 $(g\circ f)(x)$의 치역이 $\{y\mid y\ge5\}$일 때, 상수 $a$의 값은?`, ["1", "2", "3", "4", "5"]),
  q(15, 4, raw`아래 그림과 같이 직사각형을 같은 크기의 직사각형 6개로 나눈 종이가 벽에 붙어 있다. 모든 칸에 문자 A,B,C 중 한 문자를 써 넣을 때, 다음 조건을 모두 만족시키도록 문자 6개를 써 넣는 경우의 수는? (가) 좌우 또는 상하의 칸에는 같은 문자를 쓰지 않는다. (나) A,B,C 중 적어도 한 문자는 반드시 3번 이상 쓴다. (다) 두 문자만 사용해도 된다.`, ["34", "36", "38", "40", "42"], { visualAssetBBox: { x1: 930, y1: 100, x2: 1620, y2: 540 } }),
  q("단답형1", 5, raw`다음 함수 $y=-x^2+1$의 정의역과 치역을 구하시오.`),
  q("단답형2", 5, raw`함수 $y=\frac1{x+1}+2$의 점근선의 방정식을 모두 쓰시오.`),
  q("단답형3", 5, raw`1부터 9까지의 자연수 중에서 서로 다른 4개의 자연수를 택할 때, 홀수 2개, 짝수 2개를 택하는 경우의 수를 구하시오.`),
  q("서술형1", 5, raw`남학생 3명, 여학생 4명 중 5명을 택하여 다음 <조건>을 모두 만족하도록 일렬로 세우는 경우의 수를 구하시오. (가) 남학생 2명 이상을 반드시 포함한다. (나) 남학생끼리는 모두 이웃하지 않는다.`, [], { questionType: "서술형" }),
  q("서술형2", 6, raw`함수 $f(x)=x^2+1\ (x\ge0)$의 역함수를 $g(x)$라 할 때, $F(x)$를 $F(x)=g(x)-x+1$로 정의한다. 함수 $F(x)$의 그래프와 $x$축과의 교점의 개수를 구하시오.`, [], { questionType: "서술형" }),
  q("서술형3", 6, raw`실수 전체의 집합에서 정의된 함수 $f(x)=\begin{cases}\frac{x+1}{x-3}&(x>4)\\\sqrt{4-x}+a&(x\le4)\end{cases}$가 치역 $\{y\mid y>1\}$이고 일대일일 때, $f(3)+f(k)=10$을 만족하는 상수 $k$의 값을 구하시오.`, [], { questionType: "서술형" }),
];
const details = {
  "1": { answer: "⑤", solution: raw`Y의 원소로만 값을 내는 것은 ㄴ,ㄷ,ㅁ이다. ㄱ은 $-1$을, ㄹ은 $4$를 값으로 내므로 함수가 아니다.` },
  "2": { answer: "①", solution: raw`분모가 0이 아니고 제곱근이 실수여야 하므로 $2-x>0$, 즉 $x<2$이다.` },
  "3": { answer: "④", solution: raw`그림에서 $g(-1)=0,g(0)=1,g(1)=1$이다. 따라서 $a-b+c=0,c=1,a+b+c=1$에서 $a=-1/2,b=1/2,c=1$, 합은 1이다.` },
  "4": { answer: "③", solution: raw`$n(n-1)/2=36$에서 $n^2-n-72=0$, 자연수 해는 $n=9$이다.` },
  "5": { answer: "④", solution: raw`$y=3-4/(x+1)$이므로 $x=-1,y=3$이 점근선이다. ④는 $3/x$를 옮긴 식이 아니며, 실제로는 $-4/x$를 옮긴 것이다.` },
  "6": { answer: "②", solution: raw`끝점 $(2,1)$에서 $2a+b=0,c=1$, y절편 $(0,3)$에서 $\sqrt b+1=3$이므로 $b=4,a=-2$이다. $abc=-8$이다.` },
  "7": { answer: "④", solution: raw`$f(x)=(x-1)^2+a$의 $x\ge2$에서 최솟값은 $a+1$이다. 치역이 $y\ge5$가 되려면 $a+1=5$, 즉 $a=4$이다.` },
  "8": { answer: "①", solution: raw`$g(f(x))=-2x+2$로 두고 $u=-2x+2$라 하면 $x=1-u/2$, $h(u)=g(x)=-u-2$이다. 따라서 $h(1)=-3$이다.` },
  "9": { answer: "③", solution: raw`대칭 중심이 $(2,1)$이므로 $a=-2,b=1$이고 $f(0)=2$에서 $c=-4$이다. $f(x)=5$를 풀면 $x=3/2$이다.` },
  "10": { answer: "①", solution: raw`서로 다른 네 거리 지점에 4명을 배치하는 4!가지 중 A가 B보다 가까운 경우는 대칭성으로 절반인 $12$가지이다.` },
  "11": { answer: "②", solution: raw`전체 선택은 $\binom83=56$이고 남자 미포함 10개를 제외한 46개이므로 여자 수는 5, 남자 수는 3이다.` },
  "12": { reviewStatus: "REVIEW_NEEDED", reviewReason: "증가함수 선택 수는 10개인데 인쇄 선택지는 22 이상으로 source conflict" },
  "13": { answer: "④", solution: raw`$P=(x,2/x),Q=(u,-8/u)$라 하면 넓이는 $4x/u+u/x$이다. $t=x/u$로 두면 $4t+1/t\ge4$이고 최솟값은 4이다.` },
  "14": { answer: "②", solution: raw`$x\ge0$ 구간의 치역은 $[6,\infty)$이다. $x<0$ 구간의 포물선 최솟값이 2가 되도록 꼭짓점이 음수에 있어야 하므로 $6-a^2=2$, $a=2$이다.` },
  "15": { answer: "⑤", solution: raw`전체 proper 3색 칠하기는 첫 칸 6가지와 다음 두 열 각 3가지로 54가지이다. 세 문자를 각각 두 번 쓰는 경우 12가지를 제외하면, 적어도 한 문자를 세 번 이상 쓰는 경우는 42가지이다.` },
  "단답형1": { answer: raw`정의역=\mathbb R,\ 치역=\{y\mid y\le1\}`, solution: raw`모든 실수에서 정의되고 아래로 열린 것이 아니라 위로 열린? $y=-x^2+1$은 최댓값 1을 가지므로 치역은 $y\le1$이다.` },
  "단답형2": { answer: raw`x=-1,\ y=2`, solution: raw`$1/(x+1)+2$에서 분모가 0인 $x=-1$, 수평점근선은 $y=2$이다.` },
  "단답형3": { answer: "60", solution: raw`홀수 5개 중 2개와 짝수 4개 중 2개를 고르므로 $\binom52\binom42=10\times6=60$이다.` },
  "서술형1": { answer: "936", solution: raw`남학생 2명 선택 시 $\binom32\binom43=12$개 선택, 남학생을 이웃하지 않게 배치하는 위치 6가지와 내부 배열 $2!3!$을 곱해 864이다. 남학생 3명 선택 시 여학생 2명 선택 6개, 남학생 위치는 하나뿐이고 내부 배열 $3!2!$을 곱해 72이다. 합은 936이다.` },
  "서술형2": { answer: "2", solution: raw`역함수는 $g(x)=\sqrt{x-1}$이고 $F(x)=\sqrt{x-1}-x+1$이다. $F(x)=0$에서 $t=x-1\ge0$라 두면 $\sqrt t=t$, 따라서 $t=0,1$ 두 해이다.` },
  "서술형3": { answer: raw`k=13/3`, solution: raw`첫째 가지의 치역은 $(1,5)$이고 둘째 가지의 치역은 $[a,\infty)$이다. 치역이 $(1,\infty)$이고 일대일이 되려면 $a=5$이다. $f(3)=\sqrt1+5=6$이므로 $f(k)=4$이고, 첫째 가지에서 $(k+1)/(k-3)=4$를 풀면 $k=13/3$이다.` },
};
const pages = []; for (let pageNo = 1; pageNo <= 7; pageNo += 1) pages.push({ pageNo, questions: R.filter((item) => item.pageNo === pageNo).map(({ pageNo: _pageNo, ...item }) => item) });
await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8"); await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, expectedQuestionCount: R.length, outputFileName: "23_한영고_2학기_기말_고1_기출.candidate.js", visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8"); await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify(details, null, 2) + "\n", "utf8"); console.log(`prepared ${R.length} questions from native Hancom PDF page order`);
