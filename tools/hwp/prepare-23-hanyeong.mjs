import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/23_hanyeong_2mid");
const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8"));
const job = selected.jobs.find((item) => item.examId === "23_hanyeong_2mid");
const raw = String.raw;

function q(displayNo, pageNo, content, choices = [], options = {}) {
  return {
    displayNo: String(displayNo),
    questionType: options.questionType || (String(displayNo).startsWith("서술") || String(displayNo).startsWith("단답") ? "서술형" : "객관식"),
    content,
    choices,
    hasVisualAsset: Boolean(options.visualAssetBBox),
    visualAssetType: options.visualAssetType || (options.visualAssetBBox ? "diagram" : "none"),
    visualAssetBBox: options.visualAssetBBox || null,
    contentConfidence: options.reviewNeeded ? 0.9 : 0.98,
    choicesConfidence: choices.length ? (options.reviewNeeded ? 0.9 : 0.98) : 0.6,
    visualAssetConfidence: options.visualAssetBBox ? 0.9 : 0,
    reviewNeeded: Boolean(options.reviewNeeded),
    reviewReason: options.reviewReason || [],
    pageNo,
  };
}

const R = [
  q(1, 1, raw`$^4P_4+0!+^5P_0=k$에서 $k$의 값은?`, ["26", "28", "30", "32", "34"]),
  q(2, 1, raw`집합 $A=\{1,3,7,21\}$에 대하여 다음 중 옳은 것은?`, [raw`$5\in A$`, raw`$\{3,6,21\}\subset A$`, raw`$\{7,21\}\in A$`, raw`$\{7,21\}\subset A$`, raw`$7\notin A$`]),
  q(3, 1, raw`두 집합 $A,B$에 대하여 $n(A)=12,n(B)=8,n(A\cup B)=15$일 때, $n(A\cap B)$의 값은?`, ["2", "3", "4", "5", "6"]),
  q(4, 1, raw`다음 <보기>에서 명제인 것은 $a$개, 조건인 것은 $b$개일 때, $a-b$의 값은?\nㄱ. $x^2+x+1>0$ (단, $x$는 실수)\nㄴ. $(x-1)(x-5)=0$ (단, $x$는 실수)\nㄷ. $x$는 5의 배수이다. (단, $x$는 실수)\nㄹ. 한강은 긴 강이다.\nㅁ. 소수는 홀수이다.\nㅂ. 두 집합 $A,B$에 대하여 $A\subset(A\cup B)$이다.`, ["-2", "-1", "0", "1", "2"]),
  q(5, 2, raw`오른쪽 그림과 같이 네 지점 $A,B,C,D$를 연결하는 도로망이 있다. 주어진 도로를 이용하여 $A$ 지점에서 $D$ 지점까지 가는 경우의 수를 $k$라 할 때, $k$의 값은? (단, 같은 지점을 두 번 이상 지나지 않는다.)`, ["11", "13", "15", "17", "19"], { visualAssetBBox: { x1: 400, y1: 70, x2: 820, y2: 610 } }),
  q(6, 2, raw`전체집합 $U=\{1,2,3,\cdots,10\}$의 두 부분집합 $A=\{2,3,5,7\}, B=\{x\mid x는 8의 약수\}$에 대하여 다음 중 옳지 않은 것은?`, [raw`$A\cup B=\{1,2,3,4,5,7,8\}$`, raw`$A\cap B=\{2\}$`, raw`$A^c=\{1,4,6,8,9,10\}$`, raw`$B^c=\{3,5,6,7,9,10\}$`, raw`$A-B=\{1,4,8\}$`]),
  q(7, 2, raw`전체집합 $U$에 대하여 두 조건 $p,q$의 진리집합을 각각 $P,Q$라 하자. 명제 $p\Rightarrow q$가 참일 때, 항상 옳은 것은?`, [raw`$Q\subset P$`, raw`$P\cup Q=P$`, raw`$P^c\subset Q^c$`, raw`$P^c\subset Q^c=U$`, raw`$P-Q=\varnothing$`]),
  q(8, 2, raw`실수 전체의 집합의 두 부분집합 $A,B$가 $A=\{2,a+2,a^2-2a\}, B=\{3,a,b\}$이다. $(A\cap B^c)\cup(A^c\cap B)=\{-1,1\}$을 만족시키는 두 실수 $a,b$에 대하여 $ab$의 값은?`, ["10", "8", "6", "4", "2"]),
  q(9, 3, raw`자연수 $x,y,z$에 대하여 $x+y+z\le5$를 만족시키는 순서쌍 $(x,y,z)$의 개수를 $k$라 할 때, $k$의 값은?`, ["6", "7", "8", "9", "10"]),
  q(10, 3, raw`다음 밑줄 친 ( ) 안에 알맞은 것을 차례로 나열한 것은? (단, $x,y$는 실수이고, $A,B$는 집합이다.)\n• $x^2+y^2=0$은 $xy=0$이기 위한 ( )조건이다.\n• $A\cap B=A$는 $A-B=\varnothing$이기 위한 ( )조건이다.\n• $x^2>0$은 $x>0$이기 위한 ( )조건이다.`, ["충분, 충분, 필요", "필요, 필요, 충분", "충분, 필요충분, 필요", "필요, 필요충분, 충분", "충분, 필요, 필요"]),
  q(11, 3, raw`명제 ‘모든 실수 $x$에 대하여 $x^2+3x+a\ge0$이다.’가 거짓이 되도록 하는 정수 $a$의 최댓값은?`, ["1", "2", "3", "4", "5"], { reviewNeeded: true, reviewReason: ["answer_key_conflict: printed key selects ③, but the quadratic minimum gives false exactly for a<=2, so the maximum integer is 2"] }),
  q(12, 3, raw`실수 $x,y$에 대하여 다음 <보기>의 명제 중 역과 대우가 모두 참인 명제를 모두 고른 것은?\nㄱ. $xy<0$이면 $x^2+y^2>0$이다.\nㄴ. $|x|+|y|=0$이면 $x^2+y^2=0$이다.\nㄷ. $x^2=y^2$이면 $x=y$이다.\nㄹ. $xy=0$이면 $x=0$ 또는 $y=0$이다.\nㅁ. $|x-y|=y-x$이면 $x>y$이다.`, ["ㄱ,ㄷ", "ㄴ,ㄹ", "ㄴ,ㅁ", "ㄱ,ㄷ,ㅁ", "ㄴ,ㄹ,ㅁ"]),
  q(13, 4, raw`집합 $\{1,2,3,4,\cdots,20\}$의 부분집합 중에는 어떤 두 원소의 곱도 6의 배수가 아닌 수들만으로 이루어진 것이 있다. 예를 들면 $\{1,2,4,5,20\},\{3,5,9,15\}$와 같다. 이와 같은 부분집합 중에서 원소의 개수가 최대인 집합을 $M$이라 할 때, 집합 $M$의 원소의 개수는?`, ["13", "14", "15", "16", "17"]),
  q(14, 4, raw`다음 <조건>을 모두 만족시키는 자연수 $n$의 개수는?\n(가) $600\le n\le1300$\n(나) 각 자리의 숫자는 모두 다르다.\n(다) 일의 자리의 숫자는 홀수이다.`, ["200", "208", "218", "228", "230"]),
  q(15, 4, raw`두 양수 $a,b$에 대하여 $a^2-4a+\frac ab+\frac{4b}{a}$가 $a=m,b=n$일 때, 최솟값을 갖는다. 이때, $m\times n$의 값은?`, ["1", "2", "3", "4", "5"]),
  q("단답형1", 5, raw`자연수 $a,b$에 대하여 $A=\{4,a\},\ B=\{b,5\}$가 서로 같을 때, $a+b$의 값을 구하시오.`),
  q("단답형2", 5, raw`전체집합 $U=\{1,2,3,\cdots,9\}$에 대하여 두 조건 $p,q$가 $p:x$는 6의 약수이다, $q:x$는 3의 배수이다일 때, 조건 ‘$p$이고 $\sim q$’의 진리집합을 구하시오.`),
  q("단답형3", 5, raw`다음 <보기>의 명제의 부정을 쓰고, 그것의 참, 거짓을 판별하시오. <보기> 어떤 평행사변형은 정사각형이다.`),
  q("서술형1", 5, raw`다음 <보기>의 부등식이 성립함을 증명하시오. (단, 등호 성립 조건까지 서술할 것.)\n$a>0,b>0$일 때, $a^3+b^3\ge ab(a+b)$`, [], { questionType: "서술형" }),
  q("서술형2", 5, raw`전체집합 $U=\{1,2,3,4,5\}$의 두 부분집합 $A,B$가 다음 <조건>을 모두 만족시킨다. 집합 $A$의 원소의 합을 $a$, 집합 $B$의 원소의 합을 $b$라 하고 $ab$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값을 구하시오. (가) $A\cup B=U$ (나) $A\cap B=\{1,2,3\}$`, [], { questionType: "서술형" }),
  q("서술형3", 6, raw`5개의 숫자 $0,1,2,3,4$ 중에서 서로 다른 4개의 숫자를 택하여 네 자리 자연수를 작은 것부터 차례대로 나열하였을 때, 40번째에 오는 수를 구하시오.`, [], { questionType: "서술형" }),
];

const details = {
  "1": { answer: "①", solution: raw`$^4P_4=4!=24$, $0!=1$, $^5P_0=1$이므로 $k=26$이다.` },
  "2": { answer: "④", solution: raw`$\{7,21\}$의 두 원소가 모두 $A$에 속하므로 $\{7,21\}\subset A$이다.` },
  "3": { answer: "④", solution: raw`포함배제 원리로 $n(A\cap B)=12+8-15=5$이다.` },
  "4": { answer: "③", solution: raw`ㄱ,ㄹ,ㅁ은 변수에 관계없이 참 또는 거짓이 정해지는 명제이고, ㄴ,ㄷ,ㅂ은 변수나 집합에 따라 참·거짓이 달라지는 조건이다. 따라서 $a=b=3$, $a-b=0$이다.` },
  "5": { answer: "②", solution: raw`그림의 각 도로 수를 반영하여 중간 지점을 방문하지 않는 경우를 직접 나누어 세면 직행, 한 중간 지점 경유, 두 중간 지점 경유의 합이 $13$이다.` },
  "6": { answer: "⑤", solution: raw`$B=\{1,2,4,8\}$이므로 $A-B=\{3,5,7\}$이다. 따라서 ⑤의 $\{1,4,8\}$은 옳지 않다.` },
  "7": { answer: "⑤", solution: raw`$p\Rightarrow q$가 항상 참이면 $P\subset Q$이다. 이는 $P-Q=\varnothing$과 동치이다.` },
  "8": { answer: "⑤", solution: raw`대칭차가 $\{-1,1\}$이 되도록 하는 경우는 $a=1,b=2$이고, 따라서 $ab=2$이다.` },
  "9": { answer: "⑤", solution: raw`자연수를 양수로 해석하여 $x'=x-1,y'=y-1,z'=z-1$로 두면 $x'+y'+z'\le2$이다. 음이 아닌 해의 수는 $\binom{5}{3}=10$이다.` },
  "10": { answer: "③", solution: raw`첫째는 충분조건, 둘째는 필요충분조건, 셋째는 필요조건이다. 따라서 ③이다.` },
  "11": { answer: "②", solution: raw`$x^2+3x+a$의 최솟값은 $a-9/4$이다. 명제가 거짓이려면 $a<9/4$이고, 정수 $a$의 최댓값은 $2$이다. 인쇄 답지의 ③과 직접 계산이 충돌한다.` },
  "12": { answer: "②", solution: raw`ㄴ은 $x=y=0$과 동치이고, ㄹ도 $xy=0$과 $x=0$ 또는 $y=0$이 동치이므로 역과 대우가 모두 참이다. ㄱ,ㄷ,ㅁ은 역 또는 대우가 거짓이다.` },
  "13": { answer: "②", solution: raw`6의 배수인 원소를 포함하면 다른 원소와 곱이 모두 6의 배수가 되므로 제외한다. 2의 배수이면서 3의 배수가 아닌 수들과 3의 배수이면서 2의 배수가 아닌 수들은 함께 고를 수 없고, 3의 배수가 아닌 홀수 7개와 전자의 7개를 고르면 총 $14$개이다.` },
  "14": { answer: "①", solution: raw`600부터 999까지는 백의 자리별로 세어 $144$개, 1000부터 1299까지는 $56$개이므로 합은 $200$이다.` },
  "15": { answer: "②", solution: raw`$a/b+4b/a\ge4$이고 등호는 $a/b=2$일 때 성립한다. 따라서 식은 $(a-2)^2$ 이상이고, 최솟값은 $a=2,b=1$에서 이루어져 $mn=2$이다.` },
  "단답형1": { answer: "9", solution: raw`두 집합이 같으려면 $a=5,b=4$이어야 하므로 $a+b=9$이다.` },
  "단답형2": { answer: raw`\{1,2\}`, solution: raw`$p$의 진리집합은 $\{1,2,3,6\}$, $\sim q$의 진리집합은 $\{1,2,4,5,7,8\}$이므로 교집합은 $\{1,2\}$이다.` },
  "단답형3": { answer: "거짓", solution: raw`부정은 ‘어떤 평행사변형도 정사각형이 아니다’가 아니라 ‘모든 평행사변형은 정사각형이 아니다’로 쓰는 것이 아니라, 원문의 존재명제에 대한 정확한 부정인 ‘정사각형이 아닌 평행사변형이 존재한다’이다. 실제로 마름모가 아닌 평행사변형을 예로 들 수 있으므로 원명제는 거짓이다.` },
  "서술형1": { answer: raw`a^3+b^3-ab(a+b)=(a+b)(a-b)^2\ge0`, solution: raw`$a^3+b^3-ab(a+b)=(a+b)(a^2-2ab+b^2)=(a+b)(a-b)^2$이다. $a,b>0$이므로 $a+b>0$이고 $(a-b)^2\ge0$이므로 부등식이 성립한다. 등호는 $a=b$일 때이다.` },
  "서술형2": { answer: "20", solution: raw`$1,2,3$은 두 집합에 공통으로 들어가므로 각 합의 기본값은 $6$이다. 4와 5는 교집합에 들어갈 수 없고 합집합을 위해 정확히 한 집합에 배정된다. 따라서 가능한 $(a,b)$는 $(6,15),(10,11),(11,10),(15,6)$이고, $M=110,m=90$이므로 $M-m=20$이다.` },
  "서술형3": { answer: "2314", solution: raw`첫 자리가 1인 수가 24개이므로 40번째 수는 첫 자리가 2인 블록의 16번째이다. 둘째 자리가 0,1인 블록 각 6개를 지나 둘째 자리는 3이고, 남은 $0,1,4$의 두 자리 순열 중 4번째인 $14$를 붙이면 $2314$이다.` },
};

const pages = [];
for (let pageNo = 1; pageNo <= 7; pageNo += 1) pages.push({ pageNo, questions: R.filter((item) => item.pageNo === pageNo).map(({ pageNo: _pageNo, ...item }) => item) });
await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, expectedQuestionCount: R.length, outputFileName: "23_한영고_2학기_중간_고1_기출.candidate.js", visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify(details, null, 2) + "\n", "utf8");
console.log(`prepared ${R.length} questions from native Hancom PDF page order`);
