import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_yeocheon_2mid");
const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8"));
const job = selected.jobs.find((item) => item.examId === "23_yeocheon_2mid");
const raw = String.raw;

function q(displayNo, pageNo, content, choices = [], options = {}) {
  return {
    displayNo: String(displayNo),
    questionType: options.questionType || "객관식",
    content,
    choices,
    hasVisualAsset: Boolean(options.visualAssetBBox),
    visualAssetType: options.visualAssetType || (options.visualAssetBBox ? "diagram" : "none"),
    visualAssetBBox: options.visualAssetBBox || null,
    contentConfidence: options.reviewNeeded ? 0.85 : 0.98,
    choicesConfidence: choices.length ? (options.reviewNeeded ? 0.85 : 0.98) : 0.6,
    visualAssetConfidence: options.visualAssetBBox ? 0.9 : 0,
    reviewNeeded: Boolean(options.reviewNeeded),
    reviewReason: options.reviewReason || [],
    pageNo,
  };
}

const R = [
  q(1, 1, raw`원 $x^2+y^2=45$ 위의 점 $(3,6)$에서의 접선이 $(3,a)$를 지날 때, $a$의 값은?`, ["2", "3", "4", "5", "6"]),
  q(2, 1, raw`중심의 좌표가 $A(-2,2), B(-8,4)$를 지름의 양 끝점으로 하는 원의 방정식이 $(x-a)^2+(y-b)^2=c$일 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값은?`, ["5", "6", "7", "8", "9"]),
  q(3, 1, raw`원 $(x-1)^2+(y-1)^2=2$와 직선 $x+y-k=0$이 만날 때, 실수 $k$의 범위는?`, [raw`$-2<k<2$`, raw`$-2\le k\le2$`, raw`$-1<k<3$`, raw`$0<k<4$`, raw`$0\le k\le4$`]),
  q(4, 1, raw`원 $x^2+y^2+4y+k=0$이 직선 $3x+4y-2=0$과 만나는 두 점을 $A,B$라 하고 원의 중심을 $C$라 하자. 삼각형 $ABC$의 넓이가 $2$일 때 상수 $k$의 값은?`, ["-2", "-1", "1", "2", "3"]),
  q(5, 2, raw`직선 $y=2x+1$을 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $a$만큼 평행이동한 직선이 점 $(-3,1)$을 지날 때, $a$의 값은?`, ["-2", "-1", "1", "2", "3"]),
  q(6, 2, raw`점 $(1,-2)$를 $y$축에 대하여 대칭이동한 후, 원점에 대하여 대칭이동하였다. 이것을 다시 직선 $y=x$에 대하여 대칭이동한 점의 좌표는?`, ["(-2,-1)", "(-2,1)", "(2,1)", "(2,-1)", "(1,2)"]),
  q(7, 2, raw`다음 그림의 도형의 방정식을 $f(x,y)=0$이라 할 때, 방정식 $f(x,y)=0, f(y,x)=0$으로 나타내는 도형과 직선 $y=-x+2$로 둘러싸인 부분의 넓이를 구하면?`, ["8", "9", "10", "11", "12"], { reviewNeeded: true, reviewReason: ["source_geometry_conflict: f(x,y)=0 and f(y,x)=0 are parallel in the printed diagram, so no finite enclosed region is determined"], visualAssetBBox: { x1: 930, y1: 330, x2: 1720, y2: 1100 } }),
  q(8, 3, raw`$3$ 이하의 자연수 $n$에 대하여 좌표평면 위의 점 $A(x,y)$는 다음 규칙에 따라 움직인다. (가) $y>x$이면 점 $A$를 $x$축의 방향으로 $n$만큼 평행이동한다. (나) $y<x$이면 점 $A$를 직선 $y=x$에 대칭이동한 후, 다시 $y$축의 방향으로 $1$만큼 평행이동한다. (다) $y=x$이면 점 $A$는 이동하지 않는다. 점 $A$가 점 $P(5,8)$에서 출발하여 어떤 점 $Q$에 도착한 후에는 더 이상 이동하지 않을 때, 선분 $PQ$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M^2+m^2$의 값은?`, ["38", "39", "40", "41", "42"], { reviewNeeded: true, reviewReason: ["source_dynamics_conflict: repeated-move interpretation and printed answer choices do not yield a unique reconciled value"] }),
  q(9, 3, raw`다음 그림과 같이 가로의 길이, 세로의 길이가 각각 $2,5$인 직사각형 $ABCD$를 직선 $y=2x+1$에 대하여 대칭이동하였을 때, 두 직사각형의 공통부분의 넓이는?`, ["5", raw`$\frac92$`, "4", raw`$\frac72$`, "3"], { reviewNeeded: true, reviewReason: ["source_visual_missing: rectangle placement/diagram needed to determine the overlap"] }),
  q(10, 3, raw`집합 $A=\{\varnothing,0,\{0,1\}\}$일 때, 옳지 않은 것은?`, [raw`$\varnothing\in A$`, raw`$0\subset A$`, raw`$\{0,1\}\in A$`, raw`$\{\varnothing,1\}\subset A$`, "집합 $A$의 부분집합의 개수는 16개"], { reviewNeeded: true, reviewReason: ["source_set_conflict: printed options ④ and ⑤ are both false under the standard identification 0=empty set"] }),
  q(11, 3, raw`전체집합 $U$의 두 부분집합 $A,B$가 $A\cap B=(A-B^c)\cup(A\cup B^c)^c$을 만족시킬 때, 다음 중 항상 성립하는 것은?`, [raw`$A\subset B$`, raw`$A\cap B=\varnothing$`, raw`$A-B=\varnothing$`, raw`$A\cup B=B$`, raw`$(A\cup B)^c=A^c$`]),
  q(12, 4, raw`영화를 관람한 학생 50명 중에서 공포영화를 관람한 학생이 30명, 공상 과학 영화를 관람한 학생이 25명이다. 공포 영화와 공상 과학 영화를 모두 관람한 학생이 최소일 때, 공포 영화와 공상 과학 영화 중 하나만 관람한 학생수는?`, ["42", "43", "44", "45", "46"]),
  q(13, 4, raw`전체 집합 $U=\{1,2,3,4,5,6,7,8,9\}$의 두 부분집합 $A=\{1,2\}, B=\{3,4,5,6\}$에 대하여 $X\cup A=X\cap B^c$를 만족시키는 집합 $U$의 부분집합 $X$의 개수는?`, ["4", "8", "16", "32", "64"]),
  q(14, 4, raw`전체집합 $U$에 대하여 세 조건 $p,q,r$의 진리집합을 각각 $P,Q,R$라 할 때, 세 집합 사이의 포함 관계가 그림과 같다. 다음 중에서 옳은 것은?`, [raw`$r$이기 위한 $p$는 충분조건이다.`, raw`$q$이기 위한 $p$는 필요조건이다.`, raw`$q$가 $r$이기 위한 충분조건이다.`, raw`$r$은 $\sim p$이기 위한 충분조건이다.`, raw`$\sim r$은 $\sim q$이기 위한 필요조건이다.`], { visualAssetBBox: { x1: 920, y1: 270, x2: 1740, y2: 930 } }),
  q(15, 4, raw`조건 $p,q$에 대하여 $p:-\frac{k}{3}\le x<9,\ q:x\le-2$ 또는 $x>k$일 때, $\sim p\Rightarrow q$가 참이 되게 하는 모든 자연수 $k$의 합은?`, ["17", "19", "21", "23", "25"]),
  q(16, 5, raw`다음 명제 중 참인 것은?`, [raw`$|x+y|=|x-y|$이면 $|xy|=xy$이다.`, raw`$x\ne0$ 또는 $y\ne0$이면 $xy\ne0$이다.`, raw`$x^2=1$이면 $x=1$이다.`, raw`어떤 실수 $x$에 대하여 $x^2+3\le0$이다.`, raw`$(a-b)^2=0$이면 $|a|+|b|=0$이다.`]),
  q(17, 5, raw`양수 $a,b$에 대하여 $5a+4b=6$일 때, $\frac1a+\frac5b$의 최솟값은?`, [raw`$\frac{13}{2}$`, raw`$\frac{15}{2}$`, raw`$\frac{17}{2}$`, raw`$\frac{19}{2}$`, raw`$\frac{21}{2}$`]),
  q(18, 5, raw`다음 두 문장 (가),(나)가 모두 참일 때, 항상 참인 것은? (가) 수학을 잘하면 집중력이 좋다. (나) 과학을 잘하면 수학도 잘한다.`, ["집중력이 좋으면 과학을 잘한다.", "집중력이 좋지 않으면 과학을 못한다.", "수학을 못하면 집중력이 좋지 않다.", "과학을 못하면 집중력이 좋지 않다.", "수학을 잘하면 과학을 잘한다."]),
  q("서술형1", 6, raw`두 원 $O:x^2+y^2=4,\ O':(x+1)^2+(y-2)^2=4$에 대하여 직선 $l$이 원 $O$에 접하고 원 $O'$의 넓이를 이등분할 때, 직선 $l$의 방정식을 모두 구하시오.`, [], { questionType: "서술형" }),
  q("서술형2", 7, raw`두 점 $A(-1,4), B(3,7)$과 직선 $x-y+2=0$ 위의 점 $P$에 대하여 $\overline{AP}+\overline{BP}$의 최솟값을 $m$, 점 $P$의 좌표를 $(a,b)$라 할 때, $a+b+m$의 값을 구하시오. (단, $a,b,m$은 상수이며 $a,b$는 기약분수이다.)`, [], { questionType: "서술형" }),
  q("서술형3", 7, raw`다음 그림과 같이 원점과 점 $A(4,0)$을 지나고 반지름의 길이가 $2\sqrt2$인 원이 있다. 두 점 $B(-2,0), C(0,-4)$와 원 위를 움직이는 점 $P$를 꼭짓점으로 하는 삼각형 $PBC$의 넓이의 최솟값을 구하시오. (단, 원의 중심은 제1사분면 위에 있다.)`, [], { questionType: "서술형", visualAssetBBox: { x1: 900, y1: 120, x2: 1750, y2: 1170 } }),
];

const details = {
  "1": { answer: "⑤", solution: raw`원의 접선 $3x+6y=45$가 $(3,a)$를 지나므로 $9+6a=45$, 따라서 $a=6$이다.` },
  "2": { answer: "④", solution: raw`원의 중심은 지름의 중점 $(-5,3)$이고 반지름의 제곱은 $((-2+8)^2+(2-4)^2)/4=10$이다. 따라서 $a+b+c=-5+3+10=8$이다.` },
  "3": { answer: "⑤", solution: raw`중심 $(1,1)$에서 직선까지의 거리가 반지름 이하이므로 $|2-k|/\sqrt2\le\sqrt2$, 즉 $0\le k\le4$이다.` },
  "4": { answer: "②", solution: raw`중심 $C=(0,-2)$에서 직선까지의 거리는 $2$이고 반지름의 제곱은 $4-k$이다. 현의 길이는 $2\sqrt{-k}$, 높이는 $2$이므로 넓이는 $2\sqrt{-k}=2$, 따라서 $k=-1$이다.` },
  "5": { answer: "④", solution: raw`벡터 $(-2,a)$만큼 평행이동한 직선은 $y=2x+a+5$이다. $(-3,1)$을 대입하면 $a=2$이다.` },
  "6": { answer: "③", solution: raw`$(1,-2)\to(-1,-2)\to(1,2)\to(2,1)$ 순서로 대칭이동한다.` },
  "7": { reviewStatus: "REVIEW_NEEDED", reviewReason: "f(x,y)=0과 f(y,x)=0이 인쇄 그림에서 평행선이 되어 유한한 둘러싸인 영역이 정의되지 않음" },
  "8": { reviewStatus: "REVIEW_NEEDED", reviewReason: "반복 이동 규칙의 해석과 인쇄 선택지가 독립적으로 일치하지 않음" },
  "9": { reviewStatus: "REVIEW_NEEDED", reviewReason: "직사각형의 원래 위치를 결정할 도형이 원문 페이지에서 확인되지 않음" },
  "10": { reviewStatus: "REVIEW_NEEDED", reviewReason: "표준 집합 해석에서 ④와 ⑤가 동시에 거짓이 되어 단일 정답이 성립하지 않음" },
  "11": { answer: "⑤", solution: raw`$A-B^c=A\cap B$, $(A\cup B^c)^c=A^c\cap B$이므로 우변은 $B$이다. 따라서 조건은 $A\cap B=B$, 즉 $B\subset A$이고 이는 $(A\cup B)^c=A^c$와 동치이다.` },
  "12": { answer: "④", solution: raw`교집합의 최솟값은 $30+25-50=5$이다. 하나만 관람한 학생은 $30+25-2\cdot5=45$명이다.` },
  "13": { answer: "②", solution: raw`등식에서 $A\subset X$이고 $X\cap B=\varnothing$이어야 한다. 따라서 $X$는 $\{1,2\}$를 포함하고 $\{3,4,5,6\}$을 포함하지 않으며, $7,8,9$의 선택이 자유이므로 $2^3=8$개이다.` },
  "14": { answer: "⑤", solution: raw`그림에서 $R\subset Q$이므로 $r\Rightarrow q$가 참이다. 대우인 $\sim q\Rightarrow\sim r$가 참이므로 ⑤가 옳다.` },
  "15": { answer: "③", solution: raw`$\sim p$인 $x$가 모두 $q$를 만족하려면 $-k/3\le-2$ 및 $9>k$이어야 한다. 따라서 $6\le k<9$인 자연수 $k=6,7,8$의 합은 $21$이다.` },
  "16": { answer: "①", solution: raw`$|x+y|=|x-y|$이면 제곱하여 $xy=0$이므로 $|xy|=xy$이다. 나머지 명제는 반례가 있다.` },
  "17": { answer: "②", solution: raw`$b=(6-5a)/4$로 두면 $f(a)=1/a+20/(6-5a)$이다. 미분 조건에서 $10a=6-5a$이므로 $(a,b)=(2/5,1)$이고 최솟값은 $5/2+5=15/2$이다.` },
  "18": { answer: "②", solution: raw`$S\Rightarrow M$이고 $M\Rightarrow C$이므로 $S\Rightarrow C$이다. 대우인 $\sim C\Rightarrow\sim S$가 ②이다.` },
  "서술형1": { answer: raw`y=2;\quad 4x-3y+10=0`, solution: raw`$O'$의 넓이를 이등분하는 직선은 중심 $(-1,2)$을 지난다. 기울기를 $m$으로 두고 $y-2=m(x+1)$이 원점에서 원 $O$의 반지름 $2$만큼 떨어져야 하므로 $(m+2)^2=4(m^2+1)$, 즉 $m=0$ 또는 $m=4/3$이다. 따라서 $y=2$, $4x-3y+10=0$이다.` },
  "서술형2": { answer: raw`a=13/5,\ b=23/5,\ m=\sqrt{37};\quad a+b+m=36/5+\sqrt{37}`, solution: raw`점 $A(-1,4)$를 직선 $x-y+2=0$에 대하여 대칭이동한 점은 $A'(2,1)$이다. $A'B$와 직선의 교점은 $P=(13/5,23/5)$이고, 최솟값은 $A'B=\sqrt{(3-2)^2+(7-1)^2}=\sqrt{37}$이다.` },
  "서술형3": { answer: raw`10-2\sqrt{10}`, solution: raw`원의 중심은 제1사분면 조건으로 $(2,2)$이다. 직선 $BC$는 $2x+y+4=0$이고, 삼각형 넓이는 $|2x+y+4|$이다. 원 위에서 이 식의 최솟값은 중심값 $10$에서 $2\sqrt2\sqrt5=2\sqrt{10}$을 뺀 $10-2\sqrt{10}$이다.` },
};

const pages = [];
for (let pageNo = 1; pageNo <= 7; pageNo += 1) {
  pages.push({ pageNo, questions: R.filter((item) => item.pageNo === pageNo).map(({ pageNo: _pageNo, ...item }) => item) });
}

await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify(details, null, 2) + "\n", "utf8");
console.log(`prepared ${R.length} questions from native Hancom PDF page order`);
