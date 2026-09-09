import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_yeocheon_2final");
const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8"));
const job = selected.jobs.find((item) => item.examId === "23_yeocheon_2final");
const raw = String.raw;
function q(displayNo, pageNo, content, choices = [], options = {}) { return { displayNo: String(displayNo), questionType: options.questionType || (String(displayNo).startsWith("서술") || String(displayNo).startsWith("단답") ? "서술형" : "객관식"), content, choices, hasVisualAsset: Boolean(options.visualAssetBBox), visualAssetType: options.visualAssetType || (options.visualAssetBBox ? "diagram" : "none"), visualAssetBBox: options.visualAssetBBox || null, contentConfidence: options.reviewNeeded ? 0.86 : 0.98, choicesConfidence: choices.length ? (options.reviewNeeded ? 0.86 : 0.98) : 0.6, visualAssetConfidence: options.visualAssetBBox ? 0.9 : 0, reviewNeeded: Boolean(options.reviewNeeded), reviewReason: options.reviewReason || [], pageNo }; }

const R = [
  q(1, 1, raw`두 집합 $X=\{-1,0,1\}, Y=\{2,3,4\}$에 대하여 $X$에서 $Y$로의 두 함수 중 $X$로의 대응이 함수가 아닌 것은?`, [raw`$x\mapsto x^2+x+2$`, raw`$x\mapsto x+3$`, raw`$x\mapsto x^2+2$`, raw`$x\mapsto2x+2$`, raw`$x\mapsto x^3+3$`]),
  q(2, 1, raw`집합 $X=\{-1,0,1\}$을 정의역으로 하는 <보기>의 두 함수 $f,g$에 대하여 $f=g$인 것만을 있는 대로 고른 것은?\nㄱ. $f(x)=x-1, g(x)=-x+1$\nㄴ. $f(x)=x, g(x)=x^3$\nㄷ. $f(x)=|x|, g(x)=x^2$`, ["ㄱ", "ㄴ", "ㄷ", "ㄱ,ㄷ", "ㄴ,ㄷ"]),
  q(3, 1, raw`집합 $X=\{1,3,5\}$에 대하여 $X$에서 $X$로의 두 함수 $f,g$가 각각 항등함수, 상수함수이고, $f(3)=g(5)$일 때, $f(1)+g(1)$의 값은?`, ["3", "4", "5", "6", "7"]),
  q(4, 1, raw`두 집합 $X=\{x\mid0\le x\le2\}, Y=\{y\mid0\le y\le6\}$에 대하여 $X$에서 $Y$로의 함수 $f(x)=ax+b$가 일대일 대응이 되도록 하는 상수 $a,b$에 대하여 $a+3b$의 최댓값과 최솟값의 차를 구하면?`, ["5", "7", "9", "12", "15"]),
  q(5, 2, raw`실수 전체의 집합에서 정의된 두 함수 $f(x)=\begin{cases}-x^2&(x\ge0)\\x^2&(x<0)\end{cases},\ g(x)=2x+6$에 대하여 $(f\circ(g\circ f)^{-1}\circ f)(-3)$의 값은?`, [raw`\frac32`, raw`\frac{11}{2}`, raw`\frac{15}{2}`, raw`\frac{17}{2}`, raw`\frac{21}{2}`], { reviewNeeded: true, reviewReason: ["source_composition_conflict: literal inverse-composition evaluation gives a value absent from the printed choices; answer-key selection is not independently reproducible"] }),
  q(6, 2, raw`두 함수 $f(x)=\begin{cases}-2x+1&(x\ge1)\\-x&(x<1)\end{cases}, g(x)=x-1$에 대하여 $f\circ h=g^{-1}$를 만족할 때, $h(1)$의 값은?`, ["-2", "-1", "0", "1", "2"]),
  q(7, 2, raw`다음 중 유리함수 $y=\frac{-3x+1}{x-1}$의 그래프에 대한 설명으로 옳지 않은 것은?`, [raw`점근선은 $x=1, y=-3$이다.`, raw`$x>1$일 때, $x$의 값이 증가할수록 $y$의 값은 증가한다.`, raw`점 $(1,-3)$에 대하여 대칭인 그래프이다.`, raw`그래프는 제1,2,4사분면을 지난다.`, raw`$y=-\frac2x$의 그래프를 평행이동하면 주어진 그래프와 겹쳐진다.`]),
  q(8, 2, raw`정의역이 $\{x\mid0\le x\le2\}$인 유리함수 $y=\frac{2x+k}{x+1}$의 최댓값이 $1$일 때, 최솟값은?`, ["-2", "-1", "0", "1", "2"]),
  q(9, 3, raw`유리함수 $y=-\frac{7x}{3x-5}$ 위의 점 중에서 제3사분면에 있는 점을 $A$, 제4사분면에 있는 점을 $B$라 하자. 점 $A$에서 $x$축과 $y$축에 내린 수선의 발을 각각 $P,Q$라 하고 점 $B$에 내린 수선의 발을 각각 $R,S$라 하자. 두 사각형 $OPAQ$와 $OSBR$이 정사각형일 때, 두 사각형의 넓이의 합은?`, [raw`\frac{98}{9}`, raw`\frac{148}{9}`, raw`\frac{58}{3}`, "18", "2"]),
  q(10, 3, raw`$\sqrt{2x+1}+\frac{x}{\sqrt{4-x}}$의 값이 실수가 되도록 하는 실수 $x$에 대하여 $|2x+1|+\sqrt{(x-4)^2}$을 간단히 하면?`, [raw`$x-2$`, raw`$x-3$`, raw`$x+5$`, "$3x$", raw`$3x-4$`]),
  q(11, 3, raw`유리함수 $y=\frac{b}{x+a}+c$의 그래프가 주어진 그림과 같을 때, 다음 중 무리함수 $y=b\sqrt{ax+c}$의 그래프의 개형은? (단, 점선은 점근선이고, $a,b,c$는 상수이다.)`, ["① graph", "② graph", "③ graph", "④ graph", "⑤ graph"], { reviewNeeded: true, reviewReason: ["source_visual_conflict: qualitative axes/endpoint placement in the printed option graph does not allow a unique independent selection from the raster alone"], visualAssetBBox: { x1: 930, y1: 180, x2: 1750, y2: 1250 } }),
  q(12, 3, raw`무리함수 $y=-\sqrt{a(x-b)}+c$의 그래프가 다음 그림과 같을 때, 상수 $a+b+c$의 값은?`, ["-3", "-2", "-1", "1", "2"], { visualAssetBBox: { x1: 940, y1: 1400, x2: 1750, y2: 2260 } }),
  q(13, 4, raw`서로 다른 두 개의 주사위를 동시에 던져 나온 눈의 수의 합이 짝수가 되는 경우의 수는?`, ["10", "12", "14", "16", "18"]),
  q(14, 4, raw`5개의 숫자 $0,1,2,3,4$ 중에서 서로 다른 3개를 택하여 만들 수 있는 세 자리 자연수 중에서 300보다 작은 짝수의 개수는?`, ["12", "15", "18", "24", "27"]),
  q(15, 4, raw`다음 중 옳지 않은 것은?`, [raw`학생 6명 중에서 4명을 뽑아 일렬로 세울 때, 특정한 2명을 반드시 포함하여 세우는 경우의 수: $_6C_2\times4!`, raw`20명이 빠짐없이 서로 한 번씩 악수하는 경우의 수: $_{20}C_2`, raw`남학생 3명과 여학생 3명이 교대로 서는 경우의 수: $3!\times3!\times2`, raw`어른 1명과 어린이 5명을 일렬로 세울 때, 어른이 세 번째 오도록 세우는 경우의 수: $1\times5!`, raw`남학생 5명과 여학생 4명이 있는 동아리에서 4명의 대표를 뽑을 때 적어도 여학생 1명이 포함될 경우의 수: $_9C_4-{}_5C_4`]),
  q(16, 4, raw`$\,{}_nP_r=20, {}_nC_r=10$을 만족시키는 자연수 $n,r$에 대하여 $n+r$의 값은?`, ["5", "6", "7", "8", "9"]),
  q(17, 5, raw`집합 $X=\{1,2,3,4,5\}$에서 $X$로의 함수 중 다음 조건을 만족시키는 함수의 개수는? (가) $f$는 일대일 대응이다. (나) $f(f(1))=1$ (다) $f(2)-f(1)=2$`, ["8", "10", "12", "14", "16"]),
  q(18, 5, raw`서로 다른 5개의 상자에 1부터 5까지의 자연수가 적힌 5개의 공을 남김없이 넣을 때, 빈 상자가 3개가 되도록 공을 넣는 방법의 수는?`, ["100", "150", "200", "250", "300"]),
  q("단답형1", 5, raw`실수 전체에서 정의된 함수 $f(x)=\begin{cases}\frac{a-x}{x-1}&(x>3)\\-\sqrt{3-x}-2&(x\le3)\end{cases}$가 (가) 치역은 $\{y\mid y<-1\}$이다. (나) 임의의 두 실수 $x_1,x_2$에 대하여 $f(x_1)=f(x_2)$이면 $x_1=x_2$이다. 를 모두 만족시킬 때, $f(8)$을 구하시오.`),
  q("단답형2", 5, raw`집합 $X=\{1,2,3,4,5,6\}$의 부분집합 중에서 두 부분집합 $A,B$를 택할 때, $n(A)=4, n(B)=2, A\cap B\ne\varnothing$을 만족시키는 경우의 수는?`),
  q("서술형1", 6, raw`일차함수 $f$가 $f(1)=4$이고 모든 실수 $x$에 대하여 $f(2x)=2f(x)$를 만족시킨다. $g(x)=\frac{f(x)-12}{f(x)+12}$일 때, 함수 $y=g(x)$의 그래프 위의 한 점 $P$와 점 $A(-3,1)$ 사이의 거리의 최솟값을 구하시오.`, [], { questionType: "서술형" }),
  q("서술형2", 6, raw`무리함수 $f(x)=\sqrt{2x+4}\ (-2\le x\le3)$ 위에 임의의 점 $A$가 있다. 점 $A$를 직선 $y=x$에 대하여 대칭인 점을 $B$라 할 때, 선분 $AB$를 대각선으로 하는 정사각형의 넓이가 최대가 되도록 하는 점 $A$의 좌표와 그때 정사각형의 넓이를 구하시오.`, [], { questionType: "서술형" }),
  q("서술형3", 6, raw`1학년 1명, 2학년 2명, 3학년 3명을 일렬로 세울 때, 3학년끼리는 이웃하지 않고, 2학년끼리는 이웃하도록 세우는 경우의 수를 구하시오.`, [], { questionType: "서술형" }),
];

const details = {
  "1": { answer: "①", solution: raw`$x=-1,0,1$에서 $x^2+x+2$의 값은 $2,2,4$이므로 $Y=\{2,3,4\}$ 전체에 대응하지 못한다.` },
  "2": { answer: "⑤", solution: raw`정의역이 $\{-1,0,1\}$일 때 $x=x^3$ 및 $|x|=x^2$가 모든 정의역 원소에서 성립하므로 ㄴ,ㄷ이다.` },
  "3": { answer: "②", solution: raw`$f$가 항등함수이므로 $f(3)=3$이고 $f(3)=g(5)$에서 상수함수 $g$의 값은 3이다. 따라서 $f(1)+g(1)=1+3=4$이다.` },
  "4": { answer: "④", solution: raw`일대일 대응인 일차함수는 양 끝점을 대응시키므로 $f(x)=3x$ 또는 $f(x)=6-3x$이다. $a+3b$의 값은 각각 3과 15이므로 차는 12이다.` },
  "5": { reviewStatus: "REVIEW_NEEDED", reviewReason: "문자 그대로의 역함수 합성은 선택지에 없는 값이 되어 표기·답지 충돌을 해소하지 못함" },
  "6": { answer: "①", solution: raw`$g^{-1}(1)=2$이고 $f(x)=2$를 만족하는 정의역 조건은 $x<1$인 $-x=2$이므로 $h(1)=f^{-1}(2)=-2$이다.` },
  "7": { answer: "④", solution: raw`점근선은 $x=1,y=-3$이고 도함수는 $2/(x-1)^2>0$이다. 그래프는 제3,4사분면을 지나므로 제1,2,4사분면을 지난다는 ④가 옳지 않다.` },
  "8": { answer: "②", solution: raw`$y'=(2-k)/(x+1)^2$이다. 최댓값이 1이 되려면 증가하는 경우 $y(2)=(4+k)/3=1$이므로 $k=-1$이고, 최솟값은 $y(0)=-1$이다.` },
  "9": { answer: "②", solution: raw`정사각형 조건으로 제3사분면 점은 $y=x$, 제4사분면 점은 $y=-x$이다. 각각 곡선과 연립하면 $A=(-2/3,-2/3)$, $B=(4,-4)$이고 넓이의 합은 $4/9+16=148/9$이다.` },
  "10": { answer: "③", solution: raw`실수 조건은 $x\ge-1/2$, $x<4$이다. 이 범위에서 $|2x+1|=2x+1$, $\sqrt{(x-4)^2}=4-x$이므로 합은 $x+5$이다.` },
  "11": { reviewStatus: "REVIEW_NEEDED", reviewReason: "rational-to-radical graph option raster is not independently decisive" },
  "12": { answer: "②", solution: raw`끝점이 $(1,1)$이므로 $b=1,c=1$이다. 그래프가 $(0,-1)$을 지나므로 $-\sqrt{-a}+1=-1$, $a=-4$이다. 따라서 $a+b+c=-2$이다.` },
  "13": { answer: "⑤", solution: raw`합이 짝수이려면 두 주사위 눈의 홀짝이 같아야 한다. 홀수끼리 9가지, 짝수끼리 9가지로 모두 18가지이다.` },
  "14": { answer: "②", solution: raw`백의 자리가 1이면 일의 자리 3가지와 십의 자리 3가지로 9개, 백의 자리가 2이면 일의 자리 2가지와 십의 자리 3가지로 6개이다. 합은 15개이다.` },
  "15": { answer: "①", solution: raw`특정한 두 명을 포함해 4명을 세우는 경우는 나머지 2명을 고르는 $\binom42$와 배열 $4!$의 곱이어야 한다. ①은 $\binom62\times4!$로 잘못되었다.` },
  "16": { answer: "③", solution: raw`$nP_r/nC_r=r!=2$이므로 $r=2$이고, $nC_2=10$에서 $n=5$이다. 따라서 $n+r=7$이다.` },
  "17": { answer: "①", solution: raw`$f(1)=a$, $f(2)=a+2$이고 $f(a)=1$이다. $a=1$이면 나머지 세 값의 배치가 6가지, $a=3$이면 $f(3)=1$로 고정되어 나머지 두 값의 배치가 2가지이며, 합계는 8가지이다.` },
  "18": { answer: "⑤", solution: raw`빈 상자 3개이므로 점유 상자 2개를 고르는 $\binom52$가지가 있고, 5개의 서로 다른 공을 두 상자에 모두 쓰는 방법은 $2^5-2=30$가지이다. 따라서 $10\times30=300$이다.` },
  "단답형1": { answer: raw`-9/7`, solution: raw`두 번째 가지의 치역은 $(-\infty,-2]$이고, 전체 치역이 $(-\infty,-1)$이며 일대일이 되려면 첫 번째 가지의 $x\to3+$ 극한이 $-2$이어야 한다. $(a-3)/2=-2$에서 $a=-1$이고 $f(8)=(-1-8)/7=-9/7$이다.` },
  "단답형2": { answer: "210", solution: raw`$A$는 $\binom64=15$가지로 고른다. 고정한 $A$에 대해 $B$는 전체 $\binom62=15$가지에서 $A$와 서로소인 한 가지를 빼므로 14가지이다. 곱은 $15\times14=210$이다.` },
  "서술형1": { answer: raw`2\sqrt3`, solution: raw`$f(2x)=2f(x)$와 $f(1)=4$로 $f(x)=4x$를 얻어 $g(x)=(x-3)/(x+3)$이다. $t=x+3$으로 두면 점 $P$와 $A(-3,1)$의 거리 제곱은 $t^2+36/t^2\ge12$이고 등호는 $t^2=6$에서 성립하므로 최솟값은 $2\sqrt3$이다.` },
  "서술형2": { answer: raw`A=(-3/2,1),\ 25/4`, solution: raw`$A=(x,\sqrt{2x+4})$이고 $B$는 대칭점이므로 $AB^2=2(\sqrt{2x+4}-x)^2$이다. 대각선으로 하는 정사각형의 넓이는 $(\sqrt{2x+4}-x)^2$이며, 미분하여 $x=-3/2$에서 최댓값을 얻는다. 이때 $A=(-3/2,1)$, 넓이는 $(5/2)^2=25/4$이다.` },
  "서술형3": { answer: "24", solution: raw`2학년 두 명을 하나의 블록으로 묶고, 1학년 한 명과 함께 3학년 사이의 세 빈자리에 배치해야 3학년이 서로 이웃하지 않는다. 2학년 블록과 1학년의 순서 2가지, 2학년 내부 순서 2가지, 3학년 순서 3!가 있으므로 $2\times2\times3!=24$이다.` },
};

const pages = [];
for (let pageNo = 1; pageNo <= 7; pageNo += 1) pages.push({ pageNo, questions: R.filter((item) => item.pageNo === pageNo).map(({ pageNo: _pageNo, ...item }) => item) });
await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, expectedQuestionCount: R.length, outputFileName: "23_여천고_2학기_기말_고1_기출.candidate.js", visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify(details, null, 2) + "\n", "utf8");
console.log(`prepared ${R.length} questions from native Hancom PDF page order`);
