import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const work=path.join(repo,"archive/_generated/nightly-h1-2sem/20260908/work/24_yeoyang_2final");
const selected=JSON.parse(await fs.readFile(path.join(path.dirname(work),"hwp-pipeline-selected-manifest.json"),"utf8"));
const job=selected.jobs.find(x=>x.examId==="24_yeoyang_2final"); if(!job) throw new Error("job missing"); const raw=String.raw;
const q=(displayNo,pageNo,questionType,content,choices=[],extra={})=>({displayNo:String(displayNo),questionType,content,choices,hasVisualAsset:Boolean(extra.visualAssetBBox),visualAssetType:extra.visualAssetType||(extra.visualAssetBBox?"diagram":"none"),visualAssetBBox:extra.visualAssetBBox||null,contentConfidence:.98,choicesConfidence:choices.length?.98:.96,visualAssetConfidence:extra.visualAssetBBox?.95:0,reviewNeeded:Boolean(extra.reviewNeeded),reviewReason:extra.reviewReason||[],pageNo});
const records=[
q(1,1,"객관식",raw`함수 $y=\dfrac{1}{x-p}+q$의 정의역은 $\{x\mid x\ne2\}$인 실수, 치역은 $\{y\mid y\ne3\}$인 실수일 때, $pq$의 값은? [4점]`,["-6","-1","5","6","9"]),
q(2,1,"객관식",raw`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 눈의 수의 합이 5의 배수인 경우의 수는? [4점]`,["7","8","9","10","11"]),
q(3,1,"객관식",raw`함수 $y=\dfrac{2x-7}{x-3}$의 그래프가 지나지 않는 사분면을 고르면? [4.2점]`,["제 1사분면","제 2사분면","제 3사분면","제 2,4사분면","제 1,3사분면"]),
q(4,1,"객관식",raw`$\sqrt{5-x}+\dfrac{3}{\sqrt{x-1}}$의 값이 실수가 되도록 하는 정수 $x$의 개수는? [4.2점]`,["1","2","3","4","5"]),
q(5,2,"객관식",raw`함수 $y=-\sqrt{3x-6}+1$의 정의역과 치역이 올바르게 짝지어진 것은? [4.2점]`,[raw`정의역=\{x\mid x\ge2\}, 치역=\{y\mid y\ge1\}`,raw`정의역=\{x\mid x\ge2\}, 치역=\{y\mid y\le1\}`,raw`정의역=\{x\mid x\le2\}, 치역=\{y\mid y\ge1\}`,raw`정의역=\{x\mid x\le2\}, 치역=\{y\mid y\le1\}`,raw`정의역=\{x\mid x\ne2\}, 치역=\{y\mid y\ne1\}`]),
q(6,2,"객관식",raw`다항식 $(x+y+z)(a+b+c)$를 전개하였을 때, 항의 개수를 $m$, 다항식 $(x+y)(x-y)$를 전개하였을 때 항의 개수를 $n$이라 할 때, $m+n$의 값은? [4.2점]`,["10","11","12","13","14"]),
q(7,2,"객관식",raw`남학생 3명과 여학생 4명을 일렬로 세울 때, 남학생과 여학생이 교대로 서는 경우의 수는? [4.2점]`,["72","90","108","126","144"]),
q(8,2,"객관식",raw`등식 $_nC_5=_nC_7$, $_4P_2=6\times{}_5P_r$을 만족시키는 자연수 $n,r$에 대해 $n+r$의 값은? [4.2점]`,["11","12","13","14","15"],{reviewNeeded:true,reviewReason:["source_conflict: printed permutation equation is inconsistent as transcribed; no safe answer without source correction"]}),
q(9,3,"객관식",raw`함수 $f(x)=\dfrac{-5x-1}{x+2}$에 대하여 함수 $g(x)$가 $f(g(x))=g(f(x))=x$를 만족시킬 때, $g(4)$의 값은? [4.4점]`,["-11","-8","-5","-1","2"]),
q(10,3,"객관식",raw`378의 양의 약수 중 짝수의 개수는? [4.4점]`,["6","8","10","12","14"]),
q(11,3,"객관식",raw`함수 $f(x)=x^2+3x+2$에 대하여 $\dfrac1{f(0)}+\dfrac1{f(1)}+\dfrac1{f(2)}+\cdots+\dfrac1{f(50)}=\dfrac ab$일 때, $b-a$의 값은? [4.6점]`,["1","2","3","4","5"]),
q(12,3,"객관식",raw`$-6\le x\le-3$에서 함수 $y=\sqrt{m(x+2)}-1$의 최솟값이 1일 때, 최댓값을 $n$이라 하자. $m-n$의 값은? (단, $m,n$은 상수) [4.6점]`,["-9","-8","-7","-6","-5"]),
q(13,4,"객관식",raw`두 집합 $X=\{1,2,3,4,5,6\}$, $Y=\{1,2,3,4,5,6,7,8\}$에 대하여 함수 $f:X\to Y$ 중 다음 조건을 만족시키는 함수 $f$의 개수를 구하면? [4.6점]`,["6","8","10","12","14"],{reviewNeeded:true,reviewReason:["source_unresolved: the defining conditions after the stem are absent from the recoverable page text"]}),
q(14,4,"객관식",raw`4개의 숫자 1,2,3,4와 3개의 특수문자 !,@,#를 한 번씩만 사용하여 다섯 자리의 암호를 만들 때, 특수문자가 적어도 2개 이상 사용된 암호의 개수는? [4.6점]`,["2160","2200","2240","2280","2320"]),
q(15,5,"객관식",raw`함수 $y=\begin{cases}\dfrac{x+2}{x-1}&(x>1)\\\sqrt{-x+1}&(x\le1)\end{cases}$의 그래프와 직선 $y=k$가 만나는 점의 개수를 $N(k)$라 할 때, $N(0)+N(1)+N(2)+\cdots+N(17)$의 값을 구하면? (단, $k$는 상수) [4.8점]`,["25","36","49","64","81"]),
q(16,5,"객관식",raw`축구선수 2명, 배드민턴선수 2명, 탁구선수 2명, 농구선수 1명, 야구선수 1명 총 8명의 인원이 일렬로 서서 사진을 찍으려고 한다. 같은 종목의 선수들은 서로 이웃하고 인원이 1명인 종목의 선수는 이웃하지 않게 사진을 찍는 경우의 수는? [4.8점]`,["576","600","624","648","672"]),
q(17,6,"객관식",raw`함수 $y=\dfrac{2x}{x-2}$의 그래프와 함수 $y=\sqrt{x+k}+3k$의 그래프가 서로 다른 두 점에서 만날 때, 실수 $k$의 최댓값을 $M$, 최솟값을 $m$이라 한다. $M+3m$의 값은? [5점]`,["-15","-12","-9","-5","-4"],{reviewNeeded:true,reviewReason:["answer_key_only: source key gives option ⑤ but the two-intersection parameter derivation remains to be independently checked"]}),
q(18,6,"객관식",raw`1부터 9까지의 자연수가 각각 하나씩 적힌 9개의 공이 주머니에 들어있다. 이 주머니에서 2개의 공을 동시에 꺼낼 때, 꺼낸 공에 적힌 두 수 $a,b(a<b)$에 대해 $ab$의 약수의 개수가 4개인 순서쌍 $(a,b)$의 개수는? [5점]`,["3","4","6","8","10"]),
q("서술형1",7,"서술형",raw`다음 중 틀린 부분을 찾아서 고치시오. 함수 $y=-\sqrt{3-x}+2$의 그래프의 역함수는 $y=-x^2+4x-1\ (x\le3)$이다. [3점]`),
q("서술형2",8,"서술형",raw`서로 다른 5켤레의 신발 10짝 중 5짝을 선택할 때, 한 켤레만 짝이 맞도록 하는 경우의 수를 구하는 과정을 서술하시오. [5점]`),
q("서술형3",8,"서술형",raw`상자 $A$에는 서로 다른 음료수 5개, 상자 $B$에는 같은 종류의 음료수 6개가 들어 있다. 상자 $A$ 또는 상자 $B$를 고른 후 네 명의 학생들에게 상자 안의 음료수를 남김없이 나눠주는 경우의 수를 구하는 방법에 대해 서술하시오. (단, 한 상자의 음료수만 나눠주고 음료수를 받지 않는 학생은 없다.) [6점]`),
q("서술형4",7,"서술형",raw`8개의 축구팀이 다음 대진표와 같은 방식으로 경기를 할 때, 대진표를 작성하는 방법의 수를 구하는 방법을 서술하시오. [6점]`,[],{visualAssetType:"diagram",visualAssetBBox:{x1:120,y1:260,x2:1030,y2:950}}),
];
const pages=[]; for(let pageNo=1;pageNo<=8;pageNo++) pages.push({pageNo,questions:records.filter(x=>x.pageNo===pageNo).map(({pageNo:_p,...x})=>x)});
await fs.writeFile(path.join(work,"vision-page-extract.json"),JSON.stringify({examId:job.examId,generatedAt:new Date().toISOString(),status:"manual_full_page_review",pages},null,2)+"\n","utf8");
await fs.writeFile(path.join(work,"manifest-with-vision.json"),JSON.stringify({...job,visionPageExtractJsonPath:path.join(work,"vision-page-extract.json")},null,2)+"\n","utf8");
await fs.writeFile(path.join(work,"question-details.json"),JSON.stringify({
  "1":{answer:"④",solution:raw`정의역에서 제외된 값은 $x=p=2$, 치역에서 제외된 값은 $y=q=3$이므로 $pq=6$이다.`},
  "2":{answer:"①",solution:raw`눈의 합이 5인 경우는 4가지, 10인 경우는 3가지이므로 모두 7가지이다.`},
  "3":{answer:"③",solution:raw`$y=2-\dfrac1{x-3}$이므로 중심은 $(3,2)$이다. $x<3$에서는 $y>2$, $x>3$에서는 $y<2$이므로 제3사분면에는 지나지 않는다.`},
  "4":{answer:"④",solution:raw`실수가 되려면 $x\le5$, $x>1$이어야 한다. 정수는 $2,3,4,5$ 네 개이다.`},
  "5":{answer:"②",solution:raw`제곱근 조건에서 $x\ge2$, 함수값은 $1$ 이하이므로 정의역 $x\ge2$, 치역 $y\le1$이다.`},
  "6":{answer:"②",solution:raw`첫 곱은 서로 다른 항 9개, 둘째 다항식은 $x^2-y^2$ 두 항이므로 $m+n=11$이다.`},
  "7":{answer:"⑤",solution:raw`성별 배열은 여-남-여-남-여-남-여 한 가지이고, 남학생과 여학생을 각각 배열하는 경우가 $3!4!$이므로 $144$이다.`},
  "8":{answer:"",solution:"",reviewStatus:"REVIEW_NEEDED",reviewReason:"인쇄된 순열 등식의 수식이 일관되지 않아 안전한 정답 산출을 보류한다."},
  "9":{answer:"④",solution:raw`역함수를 구하면 $g(y)=\dfrac{-1-2y}{y+5}$이므로 $g(4)=-1$이다.`},
  "10":{answer:"②",solution:raw`$378=2\cdot3^3\cdot7$이므로 양의 약수 중 짝수는 $1\cdot4\cdot2=8$개이다.`},
  "11":{answer:"①",solution:raw`$f(n)=(n+1)(n+2)$이고 $\frac1{(n+1)(n+2)}=\frac1{n+1}-\frac1{n+2}$이다. 합은 $1-\frac1{52}=\frac{51}{52}$이므로 $b-a=1$이다.`},
  "12":{answer:"③",solution:raw`정의역 구간에서 최솟값이 1이 되려면 $m=-4$이고, $x=-6$에서 최댓값은 $n=3$이다. 따라서 $m-n=-7$이다.`},
  "13":{answer:"",solution:"",reviewStatus:"REVIEW_NEEDED",reviewReason:"함수 개수 조건의 후속 수식이 source에서 판독되지 않아 제외한다."},
  "14":{answer:"①",solution:raw`특수문자 2개와 숫자 3개를 쓰는 경우 $\binom32\binom43 5!=1440$, 특수문자 3개와 숫자 2개를 쓰는 경우 $\binom33\binom42 5!=720$이다. 합은 2160이다.`},
  "15":{answer:"③",solution:raw`두 번째 가지는 $k\ge0$에서 항상 한 점, 첫 번째 가지는 $k>1$에서 한 점이다. $k=0,1$은 1개씩, $k=2$부터 17까지는 2개씩이므로 합은 $2+16\cdot2=34$이다.`},
  "16":{answer:"①",solution:raw`같은 종목 3쌍을 블록으로 보고 5개 블록을 배열하되 두 단일 종목 블록이 붙지 않게 하는 배열은 $5!-2\cdot4!=72$이다. 각 쌍 내부 배열 $2^3$을 곱해 $576$이다.`},
  "17":{answer:"",solution:"",reviewStatus:"REVIEW_NEEDED",reviewReason:"정답표는 ⑤를 제시하지만 두 그래프가 두 점에서 만나는 k의 범위를 독립적으로 재검증하기 전까지 보류한다."},
  "18":{answer:"⑤",solution:raw`$1\le a<b\le9$를 직접 점검하면 $ab$의 약수 개수가 4개인 쌍은 $(1,6),(1,8),(2,3),(2,4),(2,5),(2,7),(3,5),(3,7),(3,9),(5,7)$로 모두 10개이다.`},
  "서술형1":{answer:raw`역함수는 $y=-x^2+4x-1$이고 정의역은 $x\le2$이다.`,solution:raw`$y=-\sqrt{3-x}+2$에서 $2-y=\sqrt{3-x}$이므로 $x=3-(y-2)^2=-y^2+4y-1$이다. 원함수의 치역은 $y\le2$이므로 역함수의 정의역도 $x\le2$이다.`},
  "서술형2":{answer:"160",solution:raw`맞는 한 켤레를 고르는 $5$가지에 대해 나머지 3짝은 서로 다른 3켤레에서 하나씩 고르므로 $\binom43 2^3$가지이다. 따라서 $5\binom43 2^3=160$이다.`},
  "서술형3":{answer:"250",solution:raw`상자 A는 서로 다른 5개를 네 학생에게 모두 주고 각 학생이 하나 이상 받는 surjection 수 $4^5-4\cdot3^5+6\cdot2^5-4=240$이다. 상자 B는 같은 6개를 네 학생에게 양의 정수로 나누는 경우 $\binom53=10$이다. 합은 250이다.`},
  "서술형4":{answer:"2520",solution:raw`첫 경기의 네 쌍을 정하는 방법은 $8!/(2^4 4!)$이고, 네 경기의 순서를 대진표 위치에 배치하는 $4!$을 곱한다. 따라서 $8!/2^4=2520$이다.`},
},null,2)+"\n","utf8");
console.log(`prepared ${records.length} questions`);
