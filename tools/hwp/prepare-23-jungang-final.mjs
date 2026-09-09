import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_jungang_2final");
const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8"));
const job = selected.jobs.find((item) => item.examId === "23_jungang_2final");
const raw = String.raw;
function q(displayNo, pageNo, content, choices = [], options = {}) { return { displayNo: String(displayNo), questionType: options.questionType || (String(displayNo).startsWith("서술") ? "서술형" : "객관식"), content, choices, hasVisualAsset: Boolean(options.visualAssetBBox), visualAssetType: options.visualAssetType || (options.visualAssetBBox ? "diagram" : "none"), visualAssetBBox: options.visualAssetBBox || null, contentConfidence: options.reviewNeeded ? 0.88 : 0.98, choicesConfidence: choices.length ? (options.reviewNeeded ? 0.88 : 0.98) : 0.6, visualAssetConfidence: options.visualAssetBBox ? 0.9 : 0, reviewNeeded: Boolean(options.reviewNeeded), reviewReason: options.reviewReason || [], pageNo }; }
const R = [
  q(1, 1, raw`$0$이 아닌 세 실수 $x,y,z$에 대하여 $x=\frac y2=\frac z3$일 때, $\frac{5x+y-3z}{x-y+z}$의 값은?`, ["-2", "-1", "0", "1", "2"]),
  q(2, 1, raw`유리함수 $y=\frac{3x+1}{x+1}$의 그래프가 점 $(a,b)$에 대하여 점 대칭일 때, $a+b$의 값은?`, ["1", "2", "3", "4", "5"]),
  q(3, 1, raw`1부터 8까지의 자연수가 각각 적힌 8장의 카드 중 3장을 택하여 일렬로 나열할 때, 소수가 적힌 카드가 적어도 한 장 포함되는 경우의 수를 구하면?`, ["306", "312", "324", "336", "342"]),
  q(4, 1, raw`전체집합 $U=\{1,2,3,4,5,6,7\}$의 두 부분집합 $A,B$에 대하여 $A\cup B=U$, $n(A)=5,n(B)=4$일 때, 조건을 만족시키는 순서쌍 $(A,B)$의 개수는?`, ["200", "205", "210", "215", "220"]),
  q(5, 2, raw`무리함수 $y=\sqrt{ax+b}+c$의 그래프가 다음 그림과 같을 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값을 구하시오.`, ["1", "2", "3", "4", "5"], { visualAssetBBox: { x1: 90, y1: 100, x2: 820, y2: 760 } }),
  q(6, 2, raw`함수 $y=\frac4x$의 그래프를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $q$만큼 평행이동한 그래프의 식이 $y=\frac{3x+1}{x-1}$일 때, $p+q$의 값을 구하면?`, ["1", "2", "3", "4", "5"]),
  q(7, 2, raw`함수 $y=\frac{2x+k-7}{x-1}$의 그래프가 제3사분면을 지나지 않도록 하는 모든 자연수 $k$의 개수를 구하면?`, ["4", "5", "6", "7", "8"], { reviewNeeded: true, reviewReason: ["answer_key_conflict: direct sign analysis gives k=1..7 (7 values), while printed key selects ③" ] }),
  q(8, 2, raw`자연수 $n$에 대하여 $f(n)=\frac1{\sqrt{n+4}+\sqrt{n+3}}$일 때, $f(1)+f(2)+\cdots+f(n)>4$를 만족시키는 40 이하의 자연수 $n$의 개수를 구하면?`, ["5", "6", "7", "8", "9"]),
  q(9, 3, raw`무리함수 $y=\sqrt{-2x+6}-1$에 대한 설명으로 <보기>에서 옳은 것만을 있는 대로 고른 것은?\nㄱ. 정의역은 $\{x\mid x\le3\}$, 치역은 $\{y\mid y\ge-1\}$이다.\nㄴ. $y=\sqrt{-2x}$의 그래프를 $x$축의 방향으로 3만큼, $y$축의 방향으로 -1만큼 평행이동한 것이다.\nㄷ. 그래프는 제3사분면을 지난다.\nㄹ. 역함수는 $y=-\frac12(x+1)^2+3\ (x\ge-1)$이다.`, ["ㄱ,ㄴ", "ㄱ,ㄷ", "ㄴ,ㄹ", "ㄱ,ㄴ,ㄹ", "ㄴ,ㄷ,ㄹ"], { reviewNeeded: true, reviewReason: ["answer_key_conflict: direct domain/range and inverse calculation support ㄱ,ㄴ,ㄹ (④), while printed key selects ①"] }),
  q(10, 3, raw`두 집합 $A=\{(x,y)\mid y=\frac{x+1}{x}\}, B=\{(x,y)\mid x+y-k=0\}$에 대하여 $n(A\cap B)=1$이 되도록 하는 모든 실수 $k$의 값의 합은?`, ["2", "3", "4", "5", "6"]),
  q(11, 3, raw`함수 $f(x)=\frac{2x-1}{x+1}$과 $g(x)=\sqrt{x-1}$의 역함수 $f^{-1}(x),g^{-1}(x)$에 대하여 $(g\circ f^{-1})^{-1}(1)$의 값은?`, ["1", "2", "3", "4", "5"]),
  q(12, 3, raw`KOREA에 있는 5개의 문자를 모두 한 번씩만 사용하여 사전식으로 배열할 때, 99번째 오는 문자열에서 마지막 문자를 고르면?`, ["K", "O", "R", "E", "A"]),
  q(13, 4, raw`6개의 숫자 $0,1,2,3,4,5$ 중에서 서로 다른 4개를 택하여 네 자리의 자연수를 만들 때, 4000보다 작은 홀수의 개수를 구하면?`, ["24", "36", "48", "60", "84"]),
  q(14, 4, raw`집합 $X=\{a,b,c,d,e,f\}$에 대하여 다음 조건을 만족시키는 $f:X\to X$의 개수를 구하면? (가) $x_1\ne x_2$이면 $f(x_1)\ne f(x_2)$이다. (나) $f(a)\ne a$ (다) 치역과 공역은 일치한다.`, ["600", "610", "620", "630", "640"]),
  q(15, 4, raw`성화, 수라, 지은, 효진, 철수 5명을 일렬로 나열할 때, 성화와 수라 또는 수라와 지은이가 이웃하게 앉는 방법의 수를 구하면?`, ["72", "78", "84", "92", "96"]),
  q(16, 4, raw`실수 전체의 집합에서 정의된 함수 $f(x)=\begin{cases}-\sqrt{x+2}+a&(x>-2)\\\frac{2x+7}{x-1}&(x\le-2)\end{cases}$가 치역 $\{y\mid y<2\}$이고 일대일일 때, $f(k)-f(2)=4$를 만족하는 상수 $k$의 값은?`, ["-10", "-9", "-8", "-7", "-6"]),
  q(17, 5, raw`여학생 3명과 남학생 3명이 모두 의자에 앉아 있다. (가) 여학생은 한 번에 한 명씩 일어난다. (나) 남학생은 한 번에 한 명씩 일어나거나 두 명이 동시에 일어난다. (다) 남학생과 여학생이 동시에 일어날 수는 없다. 6명의 학생이 모두 일어나도록 할 때, 일어나는 순서를 정하는 경우의 수는?`, ["920", "960", "1000", "1040", "1080"]),
  q(18, 5, raw`함수 $f(x)=\sqrt{3x+4}+5$에 대하여 $y=f(x)$의 그래프와 두 직선 $x=-1,x=1$ 및 $x$축으로 둘러싸인 부분의 넓이를 $S_1$, 함수 $g(x)=-\sqrt{-3x+4}-3$에 대하여 같은 방식의 넓이를 $S_2$라 할 때, $S_1-S_2$의 값은?`, ["1", "2", "3", "4", "5"]),
  q(19, 5, raw`1000원짜리 지폐 3장, 500원짜리 동전 5개, 100원짜리 동전 5개 일부 또는 전부를 사용하여 지불할 때, 다음 <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, 0원을 지불하는 경우는 제외한다.)\nㄱ. 지불할 수 있는 방법의 수는 143이다.\nㄴ. 지불할 수 있는 금액의 수는 59이다.\nㄷ. 3000원을 지불하는 방법의 수는 4이다.`, ["ㄱ", "ㄷ", "ㄱ,ㄴ", "ㄱ,ㄷ", "ㄱ,ㄴ,ㄷ"]),
  q(20, 5, raw`그림과 같이 $0<a<1$인 실수 $a$에 대하여 직선 $x=a$가 두 곡선 $y=\frac1x, y=\frac{x-1}{x}$와 만나는 점을 각각 $A,B$라 하자. 점 $A$를 지나고 $y$축에 수직인 직선이 곡선 $y=\frac{x-1}{x}$와 만나는 점을 $C$, 점 $B$를 지나고 $y$축에 수직인 직선이 곡선 $y=\frac1x$와 만나는 점을 $D$라 할 때, 사각형 $ACDB$가 정사각형이 되도록 하는 $a$의 값은?`, [raw`\frac{-1+\sqrt3}{4}`, raw`\frac{-1+\sqrt5}{4}`, raw`\frac{-1+\sqrt6}{4}`, raw`\frac{-1+\sqrt3}{2}`, raw`\frac{-1+\sqrt5}{2}`], { visualAssetBBox: { x1: 900, y1: 850, x2: 1770, y2: 2200 } }),
  q("서술형1", 6, raw`두 함수 $f(x)=\frac{2x}{x+1}, g(x)=\sqrt{2x}+1$에 대하여 $0\le x\le2$에서 함수 $y=(f\circ g)(x)$의 최댓값을 $\alpha$, 최솟값을 $\beta$라 할 때, $\frac\beta\alpha$의 값을 구하시오.`, [], { questionType: "서술형" }),
  q("서술형2", 6, raw`유리함수 $y=\frac{k}{x-1}$의 그래프와 무리함수 $y=\sqrt{ax+b}+c$의 그래프가 다음 그림과 같을 때, 네 상수 $k,a,b,c$의 합을 구하시오.`, [], { questionType: "서술형", visualAssetBBox: { x1: 80, y1: 920, x2: 850, y2: 2250 }, reviewNeeded: true, reviewReason: ["source_visual_conflict: graph labels and intersection coordinates are not fully recoverable at independent-calculation precision"] }),
  q("서술형3", 6, raw`5명의 학생들이 동시에 가위, 바위, 보를 한 번 할 때, 이기는 사람이 한 명인 경우의 수를 $a$, 이기는 사람이 두 명인 경우의 수를 $b$, 이기는 사람이 세 명인 경우의 수를 $c$, 이기는 사람이 네 명인 경우의 수를 $d$, 이기는 사람이 한 명 이상인 경우의 수를 $e$라 할 때, $a,b,c,d,e$의 값을 각각 구하시오.`, [], { questionType: "서술형" }),
  q("서술형4", 6, raw`원 위에 같은 간격으로 놓인 8개의 점이 있다. 이 중에서 2개의 점을 연결하여 만들 수 있는 선분의 개수를 $a$, 3개의 점을 연결하여 만들 수 있는 삼각형의 개수를 $b$, 직각 삼각형의 개수를 $c$, 4개의 점을 연결하여 만들 수 있는 사각형의 개수를 $d$, 정사각형의 개수를 $e$라 할 때, $a,b,c,d,e$의 값을 각각 구하시오.`, [], { questionType: "서술형", visualAssetBBox: { x1: 930, y1: 1100, x2: 1740, y2: 2070 } }),
];
const details = {
  "1": { answer: "②", solution: raw`$x=t,y=2t,z=3t$로 두면 분자는 $-2t$, 분모는 $2t$이므로 값은 $-1$이다.` },
  "2": { answer: "②", solution: raw`$y=3-2/(x+1)$의 중심은 $(-1,3)$이므로 $a+b=2$이다.` },
  "3": { answer: "②", solution: raw`전체 순열은 $8P3=336$, 합성수가 적힌 $\{1,4,6,8\}$만으로 만드는 경우는 $4P3=24$이므로 $336-24=312$이다.` },
  "4": { answer: "③", solution: raw`$|A\cap B|=5+4-7=2$이고, $A\setminus B$ 3개, $B\setminus A$ 2개를 정하면 경우의 수는 $\binom72\binom53=210$이다.` },
  "5": { answer: "④", solution: raw`끝점 $(4,1)$에서 $4a+b=0$, $c=1$이고 $y$절편 $(0,3)$에서 $\sqrt b+1=3$이므로 $b=4,a=-1$이다. 합은 4이다.` },
  "6": { answer: "④", solution: raw`평행이동식은 $y=4/(x-p)+q$이다. 이를 $(3x+1)/(x-1)$과 비교하면 $p=1,q=3$이므로 합은 4이다.` },
  "7": { reviewStatus: "REVIEW_NEEDED", reviewReason: "직접 부호 분석은 k=1,...,7을 주지만 인쇄 답지의 선택지와 충돌함" },
  "8": { answer: "④", solution: raw`$f(n)=\sqrt{n+4}-\sqrt{n+3}$이므로 합은 $\sqrt{n+4}-2$이다. $>4$이면 $n>32$이고 40 이하에서 33부터40까지 8개이다.` },
  "9": { answer: "④", solution: raw`정의역과 치역, 평행이동은 참이고 제3사분면은 지나지 않는다. 역함수는 $y=-\frac12(x+1)^2+3$이므로 ㄱ,ㄴ,ㄹ인 ④이다. 인쇄 답지 ①과 충돌한다.` },
  "10": { answer: "①", solution: raw`교점의 x는 $x^2+(1-k)x+1=0$의 해이다. 해가 하나이려면 $(1-k)^2-4=0$, 즉 $k=-1,3$이고 합은 2이다.` },
  "11": { answer: "①", solution: raw`$g^{-1}(1)=2$이고 $f(2)=1$이므로 $(g\circ f^{-1})^{-1}(1)=f(g^{-1}(1))=1$이다.` },
  "12": { answer: "②", solution: raw`사전순 99번째는 R로 시작하는 블록의 3번째이다. 나머지 A,E,K,O의 세 번째 순열은 K가 두 번째인 블록의 첫 순열 $AKO$이므로 마지막 문자는 O이다.` },
  "13": { answer: "⑤", solution: raw`천의 자리가 1,3일 때 각각 3개의 홀수 일의 자리와 $4P2$를 곱해 24개씩, 천의 자리가 2일 때 3개와 $4P2$로 36개이므로 총 84개이다.` },
  "14": { answer: "①", solution: raw`일대일이고 치역과 공역이 같으므로 6!개의 전단사 중 $f(a)=a$인 $5!$개를 제외하여 $720-120=600$이다.` },
  "15": { answer: "③", solution: raw`성화-수라 인접 48가지, 수라-지은 인접 48가지이고 두 쌍 모두 인접한 경우 12가지를 중복 제거하여 $48+48-12=84$이다.` },
  "16": { answer: "③", solution: raw`치역이 $y<2$이고 일대일이 되려면 첫째 가지의 상한이 $-1$이어야 하므로 $a=-1$이다. $f(2)=-3$, 조건에서 $f(k)=1$은 둘째 가지에서 $k=-8$을 주므로 ③이다.` },
  "17": { answer: "⑤", solution: raw`여학생 순서는 3!, 남학생이 모두 한 명씩 일어나는 경우의 남학생 사건 순서는 3!, 사건 사이의 interleaving을 세면 720, 한 쌍의 남학생이 동시에 일어나는 경우는 360으로 합계 1080이다.` },
  "18": { answer: "④", solution: raw`두 적분에서 공통인 제곱근 적분 부분은 소거되고 상수항 차이만 남아 $10-6=4$이다.` },
  "19": { answer: "①", solution: raw`방법 수는 $4\times6\times6-1=143$이다. 가능한 금액은 0부터 6000원까지 100원 단위로 모두 만들어져 0 제외 60개이고, 3000원은 5가지이므로 ㄱ만 참이다.` },
  "20": { answer: "⑤", solution: raw`$A=(a,1/a),B=(a,(a-1)/a)$이고 수평선으로 얻는 C,D의 x좌표는 $a/(a-1)$이다. 정사각형 조건에서 $a(2-a)/(1-a)=(2-a)/a$이므로 $a^2=1-a$, 따라서 $a=(-1+\sqrt5)/2$이다.` },
  "서술형1": { answer: raw`\beta/\alpha=2/3`, solution: raw`$t=\sqrt{2x}$라 두면 $0\le t\le2$이고 $(f\circ g)(x)=2(t+1)/(t+2)$이다. 증가함수이므로 최솟값은 1, 최댓값은 $3/2$이고 비는 $2/3$이다.` },
  "서술형2": { reviewStatus: "REVIEW_NEEDED", reviewReason: "그래프의 상수 라벨과 교점 좌표가 독립 계산에 충분히 판독되지 않음" },
  "서술형3": { answer: raw`a=15,b=30,c=30,d=15,e=90`, solution: raw`5명 중 승자 수가 1,2,3,4명이 되는 경우를 각각 경우 분류하여 세면 $15,30,30,15$이고, 적어도 한 명이 이기는 경우는 모두 같은 3가지를 제외한 $3^5-3=240$이 아니라 가위바위보 승패가 결정되는 비동률 경우를 세어 $90$이다.` },
  "서술형4": { answer: raw`a=28,b=56,c=24,d=70,e=2`, solution: raw`선분은 $\binom82=28$, 삼각형은 $\binom83=56$, 직각삼각형은 지름 4개마다 나머지 점 6개를 골라 $24$, 사각형은 $\binom84=70$, 정사각형은 8개 점에서 두 개의 지름을 고르는 $\binom42=6$이 아니라 실제 같은 간격 조건을 만족하는 2개이다.` },
};
const pages = [];
for (let pageNo = 1; pageNo <= 7; pageNo += 1) pages.push({ pageNo, questions: R.filter((item) => item.pageNo === pageNo).map(({ pageNo: _pageNo, ...item }) => item) });
await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, expectedQuestionCount: R.length, outputFileName: "23_중앙여고_2학기_기말_고1_기출.candidate.js", visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify(details, null, 2) + "\n", "utf8");
console.log(`prepared ${R.length} questions from native Hancom PDF page order`);
