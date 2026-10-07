import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const exam='19_왕운중_2학기_기말_중3_기출';
const candidate=`${root}/.tmp/archive/m3-codex-20261007/${exam}/${exam}.js`;
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(candidate,'utf8'),ctx,{timeout:1000});
const qs=ctx.window.questionBank;
qs.find(q=>q.id===5).solution=String.raw`[키포인트] 직각삼각형의 길이를 구한 뒤, $D$에서 $AC$에 내린 수선으로 두 직각삼각형을 만든다.
$\sin x=\dfrac{BD}{AD}=\dfrac{12}{AD}=\dfrac34$이므로 $AD=16$이다.
피타고라스 정리로 $AB=\sqrt{16^2-12^2}=4\sqrt7$이고, $BC=24$이다.
직각삼각형 $ABC$에서 $AC=\sqrt{(4\sqrt7)^2+24^2}=4\sqrt{43}$이다.
$D$에서 $AC$에 내린 수선의 발을 $K$라 하면
$AK^2+DK^2=16^2=256$, $CK^2+DK^2=12^2=144$이다.
따라서 $(AK-CK)(AK+CK)=112$이고, $AK+CK=AC=4\sqrt{43}$이므로 $AK-CK=\dfrac{28}{\sqrt{43}}$이다.
$AK=\dfrac{AC+(AK-CK)}2=\dfrac{100}{\sqrt{43}}$이고, $DK=\sqrt{256-\left(\dfrac{100}{\sqrt{43}}\right)^2}=\dfrac{12\sqrt7}{\sqrt{43}}$이다.
직각삼각형 $ADK$에서 $\tan y=\dfrac{DK}{AK}=\dfrac{3\sqrt7}{25}$이므로 정답은 ⑤이다.`;
qs.find(q=>q.id===5).decisiveStep='두 직각삼각형의 피타고라스 식을 빼서 AK-CK를 구하고 tan y를 계산한다.';
qs.find(q=>q.id===9).solution=String.raw`[키포인트] 정사각형의 넓이에서 세 바깥 부분을 빼 $\triangle BMN$의 넓이를 구한 뒤, 삼각형 넓이와 sin의 관계를 사용한다.
한 변의 길이를 $s$라 하면 $BM^2=BN^2=\left(\dfrac{s}{2}\right)^2+s^2=\dfrac{5s^2}{4}$이다.
또 $MN^2=\left(\dfrac{s}{2}\right)^2+\left(\dfrac{s}{2}\right)^2=\dfrac{s^2}{2}$이다.
정사각형에서 $\triangle ABM$, $\triangle BCN$, $\triangle MND$의 넓이는 각각 $\dfrac{s^2}{4}$, $\dfrac{s^2}{4}$, $\dfrac{s^2}{8}$이다.
따라서 $[\triangle BMN]=s^2-\dfrac{s^2}{4}-\dfrac{s^2}{4}-\dfrac{s^2}{8}=\dfrac{3s^2}{8}$이다.
삼각형 넓이 공식에서 $\dfrac{3s^2}{8}=\dfrac12 BM\cdot BN\sin x=\dfrac{5s^2}{8}\sin x$이다.
따라서 $\sin x=\dfrac35$이므로 정답은 ①이다.`;
qs.find(q=>q.id===9).decisiveStep='넓이 분할로 BMN의 넓이를 구하고 두 변과 sin x로 다시 나타낸다.';
qs.find(q=>q.id===21).solution=String.raw`[키포인트] $\triangle VMN$은 이등변삼각형이므로 밑변의 중점에 수선을 내려 직각삼각형으로 나눈다.
옆면 $\triangle VAB$와 $\triangle VCD$는 모두 정삼각형이다. 따라서 $VM=VN=\dfrac{\sqrt3}{2}a$이다.
밑면에서 마주 보는 두 변의 중점을 이은 선분은 한 변과 같으므로 $MN=a$이다.
$V$에서 $MN$에 내린 수선의 발을 $H$라 하면 $MH=\dfrac a2$이다.
직각삼각형 $VMH$에서 $VH=\sqrt{VM^2-MH^2}=\sqrt{\dfrac{3a^2}{4}-\dfrac{a^2}{4}}=\dfrac a{\sqrt2}$이다.
따라서 $\sin x=\dfrac{VH}{VM}=\sqrt{\dfrac23}$, $\cos x=\dfrac{MH}{VM}=\dfrac1{\sqrt3}$, $\tan x=\dfrac{VH}{MH}=\sqrt2$이다.
$(\sin x+\cos x)\tan x=\left(\sqrt{\dfrac23}+\dfrac1{\sqrt3}\right)\sqrt2=\dfrac{2+\sqrt2}{\sqrt3}$.`;
qs.find(q=>q.id===21).decisiveStep='이등변삼각형 VMN의 밑변 중점에 수선을 내려 sin, cos, tan을 직각삼각형 비로 구한다.';
for(const q of qs) q.legacyLevelCompatibility='NORMAL';
fs.writeFileSync(candidate,`window.examTitle = ${JSON.stringify(exam)};\nwindow.questionBank = ${JSON.stringify(qs,null,2)};\n`,'utf8');
const bytes=fs.readFileSync(candidate), sha=crypto.createHash('sha256').update(bytes).digest('hex');
console.log(JSON.stringify({candidate,rawSha256:sha,q10:{answer:qs[9].answer,solution:qs[9].solution},updatedSolutionQids:[5,9,21],questionCount:qs.length},null,2));
