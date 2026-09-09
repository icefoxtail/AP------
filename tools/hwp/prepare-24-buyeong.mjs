import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/24_buyeong_2mid");
const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8"));
const job = selected.jobs.find((item) => item.examId === "24_buyeong_2mid");
if (!job) throw new Error("24_buyeong_2mid job not found");

const latexFix = (value) => String(value);

const q = (displayNo, pageNo, questionType, content, choices = [], extra = {}) => ({
  displayNo: String(displayNo), questionType, content: latexFix(content), choices: choices.map(latexFix),
  hasVisualAsset: Boolean(extra.visualAssetBBox),
  visualAssetType: extra.visualAssetType || (extra.visualAssetBBox ? "diagram" : "none"),
  visualAssetBBox: extra.visualAssetBBox || null,
  contentConfidence: 0.98, choicesConfidence: choices.length ? 0.98 : 0.96,
  visualAssetConfidence: extra.visualAssetBBox ? 0.95 : 0,
  reviewNeeded: Boolean(extra.reviewNeeded),
  reviewReason: extra.reviewReason || [], pageNo,
});

const records = [
  q(1, 1, "객관식", "원 $(x-a)^2+(y+2a)^2=-3a^2-6a+9$의 넓이가 최대가 될 때, 원의 중심의 좌표는? (단, $a$는 실수이다.) [4.2점]", ["$(1,-1)$", "$(-1,1)$", "$(-1,0)$", "$(-1,2)$", "$(1,-2)$"]),
  q(2, 1, "객관식", "원 $x^2+y^2=5$ 위의 점 $(1,2)$에서의 접선이 원 $(x+3)^2+(y-2)^2=13-a$와 만나지 않을 때, 정수 $a$의 최솟값은? [4.2점]", ["$10$", "$11$", "$12$", "$13$", "$14$"]),
  q(3, 1, "객관식", "직선 $y=x+1$을 $x$축의 방향으로 $3$만큼, $y$축의 방향으로 $1$만큼 평행이동하면 $(a,4)$를 지난다. 이때 실수 $a$의 값은? [4점]", ["$5$", "$6$", "$7$", "$8$", "$9$"]),
  q(4, 1, "객관식", "직선 $3x-4y+10=0$을 $x$축의 방향으로 $a$만큼 평행이동하여 원 $(x-2)^2+(y+1)^2=4$와 만나도록 하는 실수 $a$의 최댓값은? [4.2점]", ["$2$", "$4$", "$6$", "$8$", "$10$"]),
  q(5, 2, "객관식", "전체집합 $U=\{x\mid x는 10이하의 자연수\}$의 두 부분집합 $A,B$에 대하여 $A^C\cup B^C=\{2,3,5,7\}$, $(A\cup B)\cap A^C=\{2,5\}$일 때, 집합 $B$의 원소의 개수는? [3.8점]", ["$4$", "$5$", "$6$", "$7$", "$8$"]),
  q(6, 2, "객관식", "다음 중 참인 명제는? [3.6점]", ["$\pi$는 유리수이다.", "한강은 긴 강이다.", "$x$는 $10$의 약수이다.", "$a>b>c$이면 $ac>bc$이다.", "모든 실수 $x$에 대하여 $x^2-x+1>0$이다."]),
  q(7, 2, "객관식", "양수 $x$에 대하여 $x+\dfrac{16}{x+1}$은 $x=p$일 때 최솟값 $q$를 갖는다. $p+q$의 값은? [4.3점]", ["$10$", "$11$", "$12$", "$13$", "$14$"]),
  q(8, 2, "객관식", "점 $P(2,5)$에서 원 $x^2+y^2-4x-1=0$에 그은 접선과 $x$축으로 둘러싸인 삼각형의 넓이는? [4.3점]", ["$\dfrac{21}{2}$", "$\dfrac{23}{2}$", "$\dfrac{25}{2}$", "$\dfrac{27}{2}$", "$\dfrac{29}{2}$"]),
  q(9, 3, "객관식", "두 점 $A(-3,1)$과 $B(2,1)$에서의 거리의 비가 $2:3$으로 일정한 점 $P$가 그리는 도형 위의 점 $Q(a,b)$에 대하여 $\sqrt{a^2+b^2}$의 최댓값은? [4.6점]", ["$3\sqrt2+4$", "$4\sqrt2+4$", "$5\sqrt2+4$", "$4\sqrt2+6$", "$5\sqrt2+6$"]),
  q(10, 3, "객관식", "원 $C_1:x^2+y^2-6x-8y+a=0$을 원점에 대하여 대칭이동한 원을 $C_2$라 하자. 원 $C_1$ 위의 임의의 점 $P$와 원 $C_2$ 위의 임의의 점 $Q$에 대하여 $6\le\overline{PQ}\le14$를 만족한다. 이때 실수 $a$의 값은? [4.6점]", ["$20$", "$21$", "$22$", "$23$", "$24$"], {reviewNeeded: true, reviewReason: ["source_conflict: stated inequalities allow a range, while answer key selects 21; no unique a is determined"]}),
  q(11, 3, "객관식", "점 $A(2,a)$를 직선 $y=x$에 대하여 대칭이동한 점을 $B$라 하자. 삼각형 $OAB$가 정삼각형이 되도록 하는 모든 실수 $a$의 값의 합은? (단, $O$는 원점이다.) [4.4점]", ["$6$", "$7$", "$8$", "$9$", "$10$"]),
  q(12, 3, "객관식", "진호네 반 학생들을 대상으로 세 영화 $A,B,C$의 관람 여부를 조사했더니 영화 $A$를 관람한 학생은 6명, 영화 $B$를 관람한 학생은 8명, 영화 $C$를 관람한 학생은 11명이고, 영화 $A$와 $B$를 모두 관람한 학생은 4명, 영화 $A,B,C$를 모두 관람한 학생은 2명이었다. $A,B,C$ 세 영화 중 적어도 한 영화를 관람한 학생 수의 최솟값은? [4.5점]", ["$13$", "$15$", "$17$", "$19$", "$21$"], {reviewNeeded: true, reviewReason: ["source_conflict: stated overlap data do not determine the keyed minimum 13; direct bounds permit 11"]}),
  q(13, 4, "객관식", "실수 $x$에 대하여 두 조건 $p,q$가 다음과 같다. $p:x^2-2kx+k^2-1<0$, $q:\left|x-\dfrac{k}{2}\right|<6$. 다음 명제가 거짓일 때, 자연수 $k$의 개수는? 모든 실수 $x$에 대하여 $\sim p$ 또는 $\sim q$이다. [4.6점]", ["$11$", "$12$", "$13$", "$14$", "$15$"]),
  q(14, 4, "객관식", "실수 $a,b$에 대하여 조건 $p$가 조건 $q$이기 위한 충분조건이지만 필요조건이 아닌 것을 <보기>에서 있는 대로 고른 것은? [4.5점] <보기> ㄱ. $p$: $a+b$와 $ab$가 모두 유리수이다. $q$: $a$와 $b$는 모두 유리수이다. ㄴ. $p$: $a^3-b^3=0$, $q$: $a^2-b^2=0$. ㄷ. $p$: $ab\ne0$, $q$: $a\ne0$이고 $b\ne0$이다. ㄹ. $p$: $a=0,b=0$, $q$: $a+b\sqrt3=0$.", ["ㄱ, ㄴ", "ㄱ, ㄹ", "ㄴ, ㄷ", "ㄴ, ㄹ", "ㄷ, ㄹ"]),
  q(15, 4, "객관식", "직선 $y=-x+2k$가 다음 조건을 만족시킬 때, 모든 정수 $k$의 합은? (단, $k\ne0$) [5점] (가) 원 $x^2+y^2=36$과 서로 다른 두 점에서 만난다. (나) 원 $(x-4)^2+y^2=k^2$와 만나지 않는다.", ["$-9$", "$-5$", "$0$", "$5$", "$9$"]),
  q(16, 4, "객관식", "직선 $y=0$ 위를 움직이는 점 $P$와 원 $(x-3)^2+(y-6)^2=4$ 위를 움직이는 점 $Q$가 있다. 점 $A(15,3)$에 대하여 $\overline{PQ}+\overline{PA}$의 값이 최소일 때, 선분 $PQ$의 길이는? [5점]", ["$5$", "$6$", "$7$", "$8$", "$9$"]),
  q(17, 5, "객관식", "자연수 $n$에 대하여 집합 $A_n$을 $A_n=\{x\mid 2n-1\le x\le10n+3,\ x는 자연수\}$라 하자. $A_1\cap A_2\cap\cdots\cap A_n\ne\varnothing$이 되도록 하는 $n$의 최댓값은? [5점]", ["$6$", "$7$", "$8$", "$9$", "$10$"]),
  q(18, 5, "객관식", "그림과 같이 $\overline{AC}=4$, $\overline{BC}=3$인 직각삼각형 내부에 한 변이 선분 $AB$ 위에 있고 두 꼭짓점이 각각 선분 $AC,BC$ 위에 있는 사각형의 넓이의 최댓값을 $S$, 그 때의 직사각형의 둘레의 길이를 $l$이라고 하자. $\dfrac{S}{l}=\dfrac qp$일 때, $p+q$의 값은? (단, $p,q$는 서로소인 자연수이다.) [5.1점]", ["$51$", "$52$", "$53$", "$54$", "$55$"], {visualAssetType: "diagram", visualAssetBBox: {x1: 1040, y1: 590, x2: 1690, y2: 1530}}),
  q("서술형1", 6, "서술형", "직선 $y=-\dfrac12x-3$을 직선 $y=x$에 대하여 대칭이동시킨 후 다시 $x$축의 방향으로 $a$만큼 평행이동한 직선을 $l$이라 하자. 직선 $l$이 원 $x^2+y^2+2x-6y+5=0$에 접하도록 하는 모든 $a$의 값을 구하고, 그 과정을 서술하시오. (단, $a$는 상수이다.) [6점, 부분점수 있음]"),
  q("서술형2", 6, "서술형", "$20$ 이하의 자연수 $k$에 대하여 두 집합 $A=\{x\mid x는 k의 양의 약수\}$, $B=\{2,5,6\}$이 있다. $n(A\cap B)=2$일 때, 집합 $A-B$의 모든 원소의 합이 홀수가 되는 모든 $k$의 값을 구하고, 그 과정을 서술하시오. [7점, 부분점수 있음]"),
  q("서술형3", 6, "서술형", "그림과 같이 원 $x^2+y^2=100$ 위에 세 점 $A(-10,0)$, $B(0,-10)$, $C(8,6)$이 있다. 점 $B$를 포함하지 않는 호 $AC$ 위에 점 $P$가 있을 때, 사각형 $PABC$의 넓이의 최댓값을 구하고, 그 과정을 서술하시오. [7점, 부분점수 있음]", [], {visualAssetType: "diagram", visualAssetBBox: {x1: 1020, y1: 520, x2: 1710, y2: 1610}}),
];

const pages = [];
for (let pageNo = 1; pageNo <= 6; pageNo += 1) {
  pages.push({ pageNo, questions: records.filter((item) => item.pageNo === pageNo).map(({ pageNo: _p, ...item }) => item) });
}
await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify({
  "1": { answer: "④", solution: "원의 반지름의 제곱은 $r^2=-3a^2-6a+9=12-3(a+1)^2$이다. 따라서 $a=-1$일 때 최댓값을 갖고 중심은 $(-1,2)$이다." },
  "2": { answer: "①", solution: "접선은 $x+2y=5$이다. 중심 $(-3,2)$에서 이 직선까지의 거리의 제곱은 $16/5$이고, 두 번째 원의 반지름의 제곱은 $13-a$이다. 만나지 않으려면 $13-a<16/5$이므로 $a>49/5$이고 정수 최솟값은 $10$이다." },
  "3": { answer: "①", solution: "평행이동한 직선은 $y-1=(x-3)+1$, 즉 $y=x-1$이다. $(a,4)$를 대입하면 $a=5$이다." },
  "4": { answer: "⑤", solution: "오른쪽으로 $a$만큼 옮긴 직선은 $3x-4y+10-3a=0$이다. 중심 $(2,-1)$에서의 거리가 반지름 $2$ 이하이어야 하므로 $|20-3a|\le10$, 따라서 $a\le10$이고 최댓값은 $10$이다." },
  "5": { answer: "⑤", solution: "$A^C\cup B^C=(A\cap B)^C$이므로 $A\cap B=\{1,4,6,8,9,10\}$이다. 또 $(A\cup B)\cap A^C=B-A=\{2,5\}$이므로 $B$의 원소 수는 $6+2=8$이다." },
  "6": { answer: "⑤", solution: "$x^2-x+1=(x-1/2)^2+3/4>0$이므로 모든 실수 $x$에서 참이다. 나머지는 유리수 여부나 주어진 조건만으로 보장되지 않는다." },
  "7": { answer: "①", solution: "$x+1>0$이고 $x+16/(x+1)=x+1+16/(x+1)-1\ge8-1=7$이다. 등호는 $x+1=4$, 즉 $x=3$일 때 성립하므로 $p+q=3+7=10$이다." },
  "8": { answer: "③", solution: "원의 중심은 $(2,0)$, 반지름은 $\sqrt5$이다. 점 $(2,5)$에서의 두 접선은 $y-5=\pm2(x-2)$이고 $x$축과의 교점은 $(-1/2,0),(9/2,0)$이다. 밑변은 $5$, 높이는 $5$이므로 넓이는 $25/2$이다." },
  "9": { answer: "⑤", solution: "$PA:PB=2:3$의 자취는 $x^2+y^2+14x-2y+14=0$, 즉 중심 $(-7,1)$, 반지름 $6$인 원이다. 원점에서 가장 먼 점까지의 거리는 $\sqrt{50}+6=5\sqrt2+6$이다." },
  "10": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "원문 조건 $6\le\overline{PQ}\le14$만으로는 $a$가 단일값이 되지 않고 범위가 허용된다. 정답표의 21을 임의로 채택하지 않고 제외한다." },
  "11": { answer: "③", solution: "$B=(a,2)$이고 $OA^2=OB^2=a^2+4$, $AB^2=2(a-2)^2$이다. 정삼각형 조건에서 $a^2+4=2(a-2)^2$, 즉 $a^2-8a+4=0$이므로 두 근의 합은 $8$이다." },
  "12": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "제시된 $|A|,|B|,|C|,|A\cap B|,|A\cap B\cap C|$만으로는 합집합의 최솟값이 정답표의 13으로 고정되지 않는다. 원문 충돌 문항으로 제외한다." },
  "13": { answer: "③", solution: "$p$의 해는 $k-1<x<k+1$, $q$의 해는 $k/2-6<x<k/2+6$이다. $p\cap q$가 존재하도록 하는 조건은 $k-1<k/2+6$, 즉 $k<14$이다. 자연수 $k$는 $1$부터 $13$까지 모두 가능하므로 13개이다." },
  "14": { answer: "④", solution: "ㄴ은 $a^3=b^3$이면 $a=b$이므로 $a^2=b^2$가 성립하지만 역은 아니다. ㄹ은 $a=b=0$이면 $a+b\sqrt3=0$이지만 역은 아니다. 따라서 충분조건이지만 필요조건이 아닌 것은 ㄴ, ㄹ이다." },
  "15": { answer: "①", solution: "첫 조건에서 $|k|<3\sqrt2$이므로 정수 $k$는 $-4$부터 $4$까지이다. 두 번째 원과 만나지 않으려면 $\sqrt2|2-k|>|k|$이다. $k\ne0$을 적용하면 $k=-4,-3,-2,-1,1$이고 합은 $-9$이다." },
  "16": { answer: "④", solution: "점 $A(15,3)$을 $x$축에 대칭시킨 $A'(15,-3)$을 생각한다. 원의 중심 $C(3,6)$과 $A'$의 거리는 $15$이므로 최단점 $Q$는 $A'C$ 방향의 원 위 점이고, 직선 $A'Q$와 $x$축의 교점은 $P(11,0)$이다. 이때 $Q=(23/5,24/5)$이므로 $PQ=8$이다." },
  "17": { answer: "②", solution: "교집합의 하한은 $2n-1$, 상한은 첫 집합의 상한 $13$이다. 공집합이 아니려면 $2n-1\le13$, 즉 $n\le7$이다. 최댓값은 7이다." },
  "18": { answer: "②", solution: "빗변 $AB=5$, 빗변에 대한 높이는 $12/5$이다. 빗변에서 거리 $h$인 평행선분의 길이는 $5(1-5h/12)$이므로 넓이는 $S(h)=5h-25h^2/12$이다. $h=6/5$에서 $S=3$, 직사각형 둘레는 $l=2(5/2+6/5)=37/5$이다. 따라서 $S/l=15/37$이고 $p+q=52$이다." },
  "서술형1": { answer: "1, 6", solution: "대칭이동한 직선은 $y=-2x-6$이고, 다시 $x$축 방향으로 $a$만큼 옮기면 $2x+y+6-2a=0$이다. 원은 $(x+1)^2+(y-3)^2=5$이므로 중심에서 직선까지의 거리가 $\sqrt5$여야 한다. $|7-2a|/\sqrt5=\sqrt5$에서 $a=1,6$을 얻는다." },
  "서술형2": { answer: "10, 18, 20", solution: "$A\cap B$가 두 원소가 되도록 하고 약수 집합을 직접 점검하면 $k=6,10,12,18,20$이 후보이다. 각 경우 $A-B$의 원소 합을 계산하면 홀수가 되는 것은 각각 $k=10,18,20$이다." },
  "서술형3": { answer: "$90+30\sqrt{10}$", solution: "신발끈 공식으로 사각형 $PABC$의 넓이는 $90+9y_P-3x_P$이다. $P=(x_P,y_P)$가 $x_P^2+y_P^2=100$ 위에 있으므로 $9y_P-3x_P$의 최댓값은 $10\sqrt{9^2+(-3)^2}=30\sqrt{10}$이다. 해당 점은 $B$를 포함하지 않는 호에 있으므로 최댓값은 $90+30\sqrt{10}$이다." },
}, null, 2) + "\n", "utf8");
console.log(`prepared ${records.length} questions`);
