import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const work = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908/work/24_yeocheon_2mid");
const selected = JSON.parse(await fs.readFile(path.join(path.dirname(work), "hwp-pipeline-selected-manifest.json"), "utf8"));
const job = selected.jobs.find((item) => item.examId === "24_yeocheon_2mid");
if (!job) throw new Error("24_yeocheon_2mid job not found");
const raw = String.raw;
const q = (displayNo, pageNo, questionType, content, choices = [], extra = {}) => ({
  displayNo: String(displayNo), questionType, content, choices,
  hasVisualAsset: Boolean(extra.visualAssetBBox),
  visualAssetType: extra.visualAssetType || (extra.visualAssetBBox ? "diagram" : "none"),
  visualAssetBBox: extra.visualAssetBBox || null,
  contentConfidence: 0.98, choicesConfidence: choices.length ? 0.98 : 0.96,
  visualAssetConfidence: extra.visualAssetBBox ? 0.95 : 0,
  reviewNeeded: Boolean(extra.reviewNeeded), reviewReason: extra.reviewReason || [], pageNo,
});
const records = [
  q(1,1,"객관식",raw`점 $(-2,5)$를 $(2,4)$로 옮기는 평행이동에 의하여 점 $(a,b)$는 점 $(3,3)$으로 옮겨진다. 이때 점 $(a,b)$의 좌표는? [3.1점]`,[raw`$(-1,7)$`,raw`$(-2,6)$`,raw`$(-1,4)$`,raw`$(2,-6)$`,raw`$(-1,-6)$`]),
  q(2,1,"객관식",raw`전체집합 $U$의 두 부분집합 $A,B$에 대하여 $B\subset A$일 때, 다음 중 항상 성립한다고 할 수 없는 것은? [3.2점]`,[raw`$A\cup B=A$`,raw`$A\cap B=B$`,raw`$(A\cup B)^C=B^C$`,raw`$B-A=\varnothing$`,raw`$A^C\subset B^C$`]),
  q(3,1,"객관식",raw`직선 $y=4x+k$를 $y=x$에 대하여 대칭이동한 직선이 점 $(-2,4)$를 지날 때, 상수 $k$의 값은? [3.3점]`,[raw`$-20$`,raw`$-18$`,raw`$-16$`,raw`$-14$`,raw`$-12$`]),
  q(4,1,"객관식",raw`전체집합 $U=\{1,2,3,4,5\}$의 부분집합 $A$에 대하여 $\{1,2,3\}\cap A\ne\varnothing$을 만족시키는 모든 집합 $A$의 개수는? [3.5점]`,[raw`$12$`,raw`$16$`,raw`$18$`,raw`$21$`,raw`$24$`],{reviewNeeded:true,reviewReason:["source_conflict: direct count is 28, absent from printed choices"]}),
  q(5,2,"객관식",raw`냉장고에 넣어 두었던 초콜릿이 밤사이에 없어졌다. 엄마가 네 명의 자녀 $A,B,C,D$에게 물어본 결과 다음과 같은 사실을 알았다. (가) 세 명의 자녀가 초콜릿을 함께 먹었다. (나) $A$가 초콜릿을 먹었다면 $C$도 초콜릿을 먹었다. (다) $D$가 초콜릿을 먹지 않았다면 $C$도 초콜릿을 먹지 않았다. (라) $A$가 초콜릿을 먹지 않았다면 $B$도 초콜릿을 먹지 않았다. 초콜릿을 안 먹은 사람을 모두 고르면? [3.5점]`,[raw`$A,B,C$`,raw`$A,C,D$`,raw`$A$`,raw`$B$`,raw`$D$`],{reviewNeeded:true,reviewReason:["source_conflict: conditions allow B or D to be the unique non-eater"]}),
  q(6,2,"객관식",raw`전체집합 $U$에 대하여 두 조건 $p,q$에 대하여 $q$는 $\sim p$이기 위한 필요조건이다. 두 조건 $p,q$의 진리집합을 각각 $P,Q$라고 할 때, 다음 중 항상 옳은 것은? [3.6점]`,[raw`$P^C\cup Q=Q$`,raw`$P\cap Q^C=P$`,raw`$P^C\subset Q^C$`,raw`$P^C-Q=P$`,raw`$Q\subset P$`]),
  q(7,2,"객관식",raw`다음 중 오른쪽 벤다이어그램에서 색칠한 부분을 나타내는 집합은? [3.7점]`,[raw`$U-(A\cup B)$`,raw`$A^C\cup B$`,raw`$U-A$`,raw`$A\cap B^C$`,raw`$(A\cup B)-(A\cap B)$`],{visualAssetType:"diagram",visualAssetBBox:{x1:990,y1:100,x2:1720,y2:830}}),
  q(8,2,"객관식",raw`전체집합 $U$의 두 부분집합 $A,B$가 $(A\cup B)^C=\{1,2,4,8,11,13\}$, $(A\cap B)^C=\{3,4,11,12\}$일 때, $B-A$를 고르면? [3.7점]`,[raw`$\{3,12\}$`,raw`$\{3,13\}$`,raw`$\{1,3,4,8\}$`,raw`$\{1,2,8,13\}$`,raw`$\{12\}$`],{reviewNeeded:true,reviewReason:["source_conflict: complements violate (A∩B)⊆(A∪B)"]}),
  q(9,3,"객관식",raw`세 조건 $p,q,r$의 진리집합을 각각 $P,Q,R$라 할 때, 세 집합 $P,Q,R$의 포함 관계가 그림과 같다. <보기>에서 참인 명제인 것만을 있는 대로 고른 것은? (단, $U$는 전체집합) [3.8점]`,["ㄱ","ㄱ,ㄷ","ㄴ","ㄴ,ㄷ","ㄷ"],{reviewNeeded:true,reviewReason:["source_unresolved: proposition text in the printed view is not recoverable without changing source"]}),
  q(10,3,"객관식",raw`전체집합 $U$의 두 부분집합 $A,B$에 대하여 $\{A\cap(A\cup B)^C\}\cup\{(B-A)\cap A\}=B^C$가 성립할 때, 항상 옳은 것을 보기에서 모두 고르면? [3.9점] ㄱ. $A\supset B$  ㄴ. $A\cup B=U$  ㄷ. $A\cap B=\varnothing$  ㄹ. $A^C\cup B=B$`,["ㄱ","ㄱ,ㄴ","ㄴ,ㄷ","ㄷ,ㄹ","ㄴ,ㄷ,ㄹ"]),
  q(11,3,"객관식",raw`좌표평면 위에 두 점 $A(1,3),B(3,1)$이 있다. $x$축 위의 점 $C$에 대하여 삼각형 $ABC$의 둘레 길이의 최솟값을 고르면? (단, $C$는 직선 $AB$ 위에 있지 않다.) [4점]`,[raw`$4\sqrt2$`,raw`$4\sqrt5$`,raw`$\sqrt2+\sqrt5$`,raw`$2(\sqrt2+\sqrt5)$`,raw`$5\sqrt5$`]),
  q(12,4,"객관식",raw`전체집합 $U$의 두 부분집합 $A,B$에 대하여 $A☆B=(B-A)\cup(A-B)$라 한다. $U$의 세 부분집합 $A,B,C$에 대하여 다음 벤다이어그램 중 집합 $A☆(B☆C)$를 나타내는 것은? [4.1점]`,["그림 1","그림 2","그림 3","그림 4","그림 5"],{reviewNeeded:true,reviewReason:["source_unresolved: answer choices are source diagrams requiring separate visual adjudication"]}),
  q(13,4,"객관식",raw`$a$가 2 이상의 자연수일 때, 두 조건 $p:-2<x<a^2-5$, $q:|x-3|\ge2a$에 대하여 $\sim q$가 $p$이기 위한 필요조건이 되도록 하는 $a$의 최댓값은? [4.2점]`,["1","2","3","4","5"]),
  q(14,4,"객관식",raw`$x,y$가 실수일 때, 두 조건 $p,q$에 대하여 다음 보기 중 $p$는 $q$이기 위한 충분조건이지만 필요조건은 아닌 것을 모두 고르면? [4.3점] ㄱ. $p:xy<0$, $q:x^2+y^2>0$ ㄴ. $p:x^2=x$, $q:x^3=x$ ㄷ. $p:xy<0$, $q:|x|+|y|>|x+y|$`,["ㄱ","ㄱ,ㄴ","ㄱ,ㄴ,ㄷ","ㄴ","ㄴ,ㄷ"]),
  q(15,4,"객관식",raw`놀이공원에 다녀온 50명의 학생 중 놀이기구 $A$를 이용한 학생이 35명, 놀이기구 $B$를 이용한 학생이 33명이었다. 이 50명의 학생 중에서 놀이기구 $A,B$ 중 한 개만을 이용한 학생 수의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$은? [4.4점]`,["32","33","34","35","36"]),
  q(16,5,"객관식",raw`실수 전체의 집합에서 명제 ‘어떤 실수 $x$에 대하여 $ax^2+bx+3\le0$이다’의 부정이 참이 되도록 하는 음이 아닌 4 이하의 두 정수 $a,b$의 순서쌍 $(a,b)$의 개수를 구하면? [4.5점]`,["20","19","18","17","16"]),
  q(17,5,"객관식",raw`원 $(x-a)^2+(y-a)^2=b^2$을 $x$축의 방향으로 3만큼 평행 이동한 후 원점에 대하여 대칭이동한 원이 직선 $y=x$와 $x$축에 동시에 접할 때, 양수 $a,b$에 대하여 $a^2+b^2$의 값은? [4.6점]`,["18","16","12","10","9"]),
  q(18,5,"객관식",raw`원 $(x-5)^2+(y+3)^2=16$ 위의 점 $P$가 있다. 점 $P$를 직선 $y=x$에 대하여 대칭이동한 후, $x$축에 대하여 대칭이동한 점을 $Q$라 할 때, 두 점 $A(-2,3),B(6,-3)$에 대하여 삼각형 $ABQ$의 넓이의 최솟값은? [4.7점]`,["15","16","17","18","19"]),
  q("서술형1",6,"서술형",raw`길이가 60m인 철사를 겹치는 부분 없이 모두 사용하여 오른쪽 그림과 같이 네 개의 작은 직사각형 모양으로 이루어진 잔디밭의 경계를 만들려고 한다. 이때, 잔디밭 전체의 넓이의 최댓값을 $M$, 최대 넓이가 되는 전체 가로의 길이를 $a$, 전체 세로의 길이를 $b$라 하면 $M+a+b$의 합을 구하시오. [5점]`,[],{visualAssetType:"diagram",visualAssetBBox:{x1:170,y1:400,x2:1010,y2:1180}}),
  q("서술형2",6,"서술형",raw`길이가 $5\sqrt3$인 선분 $AB$ 위를 움직이는 점 $P$에 대하여 중심이 $A$이고 반지름이 선분 $AP$인 원을 $C_1$, 중심이 $B$이고 반지름이 선분 $BP$인 원을 $C_2$라고 하자. 두 원 $C_1,C_2$의 넓이를 각각 $S_1,S_2$라 할 때, $4S_1+S_2$의 최솟값을 구하시오. [5점]`),
  q("서술형3",7,"서술형",raw`(1) 자연수 $n$에 대하여 ‘$n^2$이 홀수이면 $n$도 홀수이다.’의 대우를 쓰시오. (2) 위에 쓴 대우를 증명하여라. [6점]`),
  q("서술형4",7,"서술형",raw`좌표평면에서 포물선 $y=x^2+2x$를 포물선 $y=x^2+4x+5$로 옮기는 평행이동에 의하여 직선 $2x-y+k=0$은 직선 $l$로 옮겨진다. 이 때, 직선 $l$이 원 $x^2+y^2=5$와 한 점에서 만나도록 하는 모든 상수 $k$의 값의 합을 구하는 과정을 쓰시오. [7점]`),
  q("서술형5",8,"서술형",raw`모든 실수 $x$에 대하여 $x^2-x+\dfrac{16}{x^2-x+2}$의 최솟값을 $m$이라 하자. 위 식이 최솟값 $m$을 갖게 만드는 음수인 $x$의 값이 얼마인지를 구하고 그 과정을 잘 설명하여 보시오. (최솟값 $m$과 그 때의 음수 $x$를 둘 다 구해야함) [7점]`),
];
const pages = [];
for (let pageNo = 1; pageNo <= 8; pageNo += 1) pages.push({ pageNo, questions: records.filter((item) => item.pageNo === pageNo).map(({ pageNo: _p, ...item }) => item) });
await fs.writeFile(path.join(work, "vision-page-extract.json"), JSON.stringify({ examId: job.examId, generatedAt: new Date().toISOString(), status: "manual_full_page_review", pages }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "manifest-with-vision.json"), JSON.stringify({ ...job, visionPageExtractJsonPath: path.join(work, "vision-page-extract.json") }, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(work, "question-details.json"), JSON.stringify({
  "1": { answer: "③", solution: raw`이동 벡터는 $(4,-1)$이다. 따라서 $(a,b)+(4,-1)=(3,3)$이므로 $(a,b)=(-1,4)$이다.` },
  "2": { answer: "③", solution: raw`$B\subset A$이면 $A\cup B=A$, $A\cap B=B$, $B-A=\varnothing$, $A^C\subset B^C$는 항상 참이다. 그러나 $(A\cup B)^C=A^C$이므로 $B^C$와 같다고 할 수 없다.` },
  "3": { answer: "②", solution: raw`대칭이동한 직선은 $x=4y+k$, 즉 $y=(x-k)/4$이다. $(-2,4)$를 대입하면 $4=(-2-k)/4$이므로 $k=-18$이다.` },
  "4": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "직접 계산한 답 28이 인쇄 선택지에 없으므로 source conflict로 제외한다." },
  "5": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "논리 조건과 세 명이 먹었다는 조건만으로 B 또는 D 중 누가 안 먹었는지 단일 결정되지 않는다." },
  "6": { answer: "①", solution: raw`$q$가 $\sim p$의 필요조건이라는 것은 $\sim p\subset Q$라는 뜻이다. 따라서 $P^C\cup Q=Q$가 항상 성립한다.` },
  "7": { answer: "④", solution: raw`그림의 색칠한 부분은 $A$에는 속하고 $B$에는 속하지 않는 부분이므로 $A\cap B^C$이다.` },
  "8": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "두 complement 집합이 교집합·합집합의 포함 관계와 모순되어 B-A를 유일하게 결정할 수 없다." },
  "9": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "보기의 명제 수식이 source PDF에서 판독되지 않아 임의 복원하지 않는다." },
  "10": { answer: "⑤", solution: raw`왼쪽의 두 교집합은 모두 공집합이므로 조건은 $B^C=\varnothing$, 즉 $B=U$를 뜻한다. 따라서 $A\cup B=U$와 $A^C\cup B=B$가 항상 참이므로 ㄴ, ㄹ을 고른다.` },
  "11": { answer: "④", solution: raw`$A$를 $x$축에 대칭시킨 $A'(1,-3)$을 이용하면 $CA+CB$의 최솟값은 $A'B=2\sqrt5$이다. $AB=2\sqrt2$이므로 둘레의 최솟값은 $2(\sqrt2+\sqrt5)$이다.` },
  "12": { answer: "", solution: "", reviewStatus: "REVIEW_NEEDED", reviewReason: "선택지가 도형 이미지로만 제시되어 대칭차 결과와 선택지 도형의 일치를 별도 visual adjudication 없이 확정하지 않는다." },
  "13": { answer: "④", solution: raw`$p$의 범위는 $-2<x<a^2-5$, $\sim q$의 범위는 $3-2a<x<3+2a$이다. $p\subset\sim q$가 되려면 $a\ge5/2$와 $a^2-5\le3+2a$가 필요하므로 $a\le4$이다. 최댓값은 4이다.` },
  "14": { answer: "②", solution: raw`ㄱ은 $xy<0$이면 $x^2+y^2>0$이고 역은 아니므로 해당한다. ㄴ도 $x^2=x$이면 $x^3=x$이고 역은 아니므로 해당한다. ㄷ은 $|x|+|y|>|x+y|$와 $xy<0$가 서로 동치이므로 해당하지 않는다.` },
  "15": { answer: "③", solution: raw`교집합의 최솟값은 $35+33-50=18$, 최댓값은 $33$이다. 한 개만 이용한 학생 수는 각각 $50-18=32$, $35+33-2\cdot33=2$이므로 $M+m=34$이다.` },
  "16": { answer: "④", solution: raw`부정이 참이려면 $ax^2+bx+3>0$가 모든 실수에서 성립해야 한다. $a=0$이면 $b=0$ 한 쌍만 가능하고, $a=1,2,3,4$에서는 $b^2-12<0$인 $b=0,1,2,3$ 네 개씩 가능하다. 총 $1+4\cdot4=17$이다.` },
  "17": { answer: "⑤", solution: raw`이동·대칭 후 중심은 $(-(a+3),-a)$이다. $x$축까지의 거리는 $a$, $y=x$까지의 거리는 $3/\sqrt2$이므로 $a=b=3/\sqrt2$이다. 따라서 $a^2+b^2=9$이다.` },
  "18": { answer: "①", solution: raw`$P$의 변환으로 얻는 $Q$는 중심 $(-3,-5)$, 반지름 4인 원 위에 있다. 직선 $AB$는 $3x+4y-6=0$이고 중심에서 직선까지의 거리는 7이다. 원 위에서 직선까지의 최솟거리는 $7-4=3$이므로 삼각형 넓이의 최솟값은 $\frac12\cdot10\cdot3=15$이다.` },
  "서술형1": { answer: "111", solution: raw`전체 가로를 $a$, 세로를 $b$라 하면 외곽 둘레와 세로 칸막이 세 개를 합친 철사 길이는 $2a+5b=60$이다. $M=ab=b(30-5b/2)$는 $b=6$, $a=15$일 때 최대이고 $M=90$이다. 따라서 $M+a+b=111$이다.` },
  "서술형2": { answer: "$60\pi$", solution: raw`$AP=t$, $BP=5\sqrt3-t$라 하면 $4S_1+S_2=\pi(4t^2+(5\sqrt3-t)^2)$이다. 완전제곱 또는 미분으로 $t=\sqrt3$일 때 최솟값을 가지며 값은 $60\pi$이다.` },
  "서술형3": { answer: "대우: n^2가 홀수가 아니면 n도 홀수가 아니다.", solution: raw`대우는 ‘$n^2$이 홀수가 아니면 $n$도 홀수가 아니다’, 즉 $n^2$이 짝수이면 $n$이 짝수라는 명제이다. $n$이 홀수라면 $n=2k+1$이고 $n^2=4k(k+1)+1$은 홀수이므로, 대우가 참이다.` },
  "서술형4": { answer: "-8", solution: raw`첫 포물선은 $(x+1)^2-1$, 둘째는 $(x+2)^2+1$이므로 평행이동은 $(-1,2)$이다. 직선은 $2x-y+k+4=0$으로 옮겨지고, 원에 한 점에서 만나려면 $|k+4|/\sqrt5=\sqrt5$이다. 따라서 $k=1,-9$, 합은 $-8$이다.` },
  "서술형5": { answer: "$m=6, x=-1$", solution: raw`$t=x^2-x+2$라 두면 $t\ge7/4$이고 식은 $t-2+16/t$이다. $t=4$에서 최솟값 6을 가지며 $x^2-x+2=4$의 음수해는 $x=-1$이다.` },
}, null, 2) + "\n", "utf8");
console.log(`prepared ${records.length} questions`);
