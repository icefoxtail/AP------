import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const exam='19_왕운중_2학기_기말_중3_기출';
const candidate=`${root}/.tmp/archive/m3-codex-20261007/${exam}/${exam}.js`;
const evidenceDir=`${root}/archive/analysis/m3-codex-20261007/${exam}`;
const assetDir=`${root}/.tmp/archive/m3-codex-20261007/${exam}/assets/images/${exam}`;
const roster=JSON.parse(fs.readFileSync(`${root}/archive/analysis/m3-codex-20261007/locked-roster.json`,'utf8'));
const assignment=roster.rows.find(r=>r.examUid===exam);
const sourceRow=assignment.sourceRow;
fs.mkdirSync(assetDir,{recursive:true});
for(const asset of sourceRow.assets){
 const src=`C:/Users/USER/Desktop/AP------/${asset.workingPath}`.replaceAll('\\','/');
 const dst=`${assetDir}/${path.basename(asset.repositoryPath)}`;
 const bytes=fs.readFileSync(src); const sha=crypto.createHash('sha256').update(bytes).digest('hex');
 if(sha!==asset.sha256) throw new Error(`asset SHA mismatch ${asset.ref}: ${sha}`);
 fs.writeFileSync(dst,bytes);
}
const provenance=sourceRow.sourceEvidence[0];
const provenanceSrc=`C:/Users/USER/Desktop/AP------/${provenance.workingPath}`.replaceAll('\\','/');
const provenanceDst=`${root}/.tmp/archive/m3-codex-20261007/${exam}/provenance/${provenance.repositoryPath}`;
fs.mkdirSync(path.dirname(provenanceDst),{recursive:true});
const provenanceBytes=fs.readFileSync(provenanceSrc);
if(crypto.createHash('sha256').update(provenanceBytes).digest('hex')!==provenance.sha256) throw new Error('source provenance SHA mismatch');
fs.writeFileSync(provenanceDst,provenanceBytes);
const sourceCandidate='C:/Users/USER/Desktop/AP------/.tmp/archive/source-batch-20261006/middle/m3/19_왕운중_2학기_기말_중3_기출/19_왕운중_2학기_기말_중3_기출.js';
const raw=fs.readFileSync(sourceCandidate,'utf8');
if(crypto.createHash('sha256').update(raw).digest('hex')!==sourceRow.inputFileSha256) throw new Error('candidate did not match locked source before authoring');
const ctx={window:{}}; vm.runInNewContext(raw,ctx,{timeout:1000});
const qs=ctx.window.questionBank;
const pdfSha='08ec6156cca27316447d010dbf8a4950d4c847b6a3a8728574539ed1f01954e0';
const answers=['④','⑤','②','③','⑤','②','③','②','①',null,'①','④','①','④','①','⑤','④','⑤','②','③','$\\dfrac{2+\\sqrt2}{\\sqrt3}$','13','24'];
const solutions={
1:'[키포인트] 직각삼각형에서 삼각비를 변의 비로 나타낸 뒤 곱한다.\n$\\cos A=\\dfrac{AB}{AC}=\\dfrac23$이므로 $AB=2k$, $AC=3k$로 둘 수 있다.\n피타고라스 정리에서 $BC=\\sqrt{(3k)^2-(2k)^2}=\\sqrt5k$이다.\n따라서 $\\sin A=\\dfrac{BC}{AC}=\\dfrac{\\sqrt5}{3}$, $\\tan A=\\dfrac{BC}{AB}=\\dfrac{\\sqrt5}{2}$이다.\n$\\sin A\\times\\tan A=\\dfrac{\\sqrt5}{3}\\times\\dfrac{\\sqrt5}{2}=\\dfrac56$이므로 정답은 ④이다.',
2:'[키포인트] 반지름 1인 사분원에서 sin·cos 값은 좌표로, tan 값은 두 변의 비로 확인한다.\n$\\sin38^\\circ\\approx0.62$, $\\sin52^\\circ\\approx0.79$이다.\n$\\cos38^\\circ=\\sin52^\\circ\\approx0.79$, $\\cos52^\\circ=\\sin38^\\circ\\approx0.62$이다.\n그림에서 $\\tan38^\\circ=\\dfrac{0.62}{0.79}\\approx0.78$이므로 $1.28$이 아니다.\n따라서 옳지 않은 것은 ⑤이다.',
3:'[키포인트] $15^\\circ=45^\\circ-30^\\circ$로 두 각의 삼각비를 이용한다.\n$\\tan15^\\circ=\\tan(45^\\circ-30^\\circ)$\n$=\\dfrac{\\tan45^\\circ-\\tan30^\\circ}{1+\\tan45^\\circ\\tan30^\\circ}$\n$=\\dfrac{1-\\frac1{\\sqrt3}}{1+\\frac1{\\sqrt3}}=\\dfrac{\\sqrt3-1}{\\sqrt3+1}$\n$=\\dfrac{(\\sqrt3-1)^2}{3-1}=2-\\sqrt3$이다.\n따라서 정답은 ②이다.',
4:'[키포인트] 직각삼각형의 빗변과 두 직각변을 구한 뒤 수선으로 나뉜 작은 삼각형에서 sin을 계산한다.\n$BC=\\sqrt{12^2+5^2}=13$이다.\n$BH=\\dfrac{AB^2}{BC}=\\dfrac{144}{13}$, $HC=\\dfrac{AC^2}{BC}=\\dfrac{25}{13}$이다.\n그림의 각에 따라 $\\sin x=\\dfrac{BH}{AB}=\\dfrac{12}{13}$, $\\sin y=\\dfrac{HC}{AC}=\\dfrac{5}{13}$이다.\n$\\sin x+\\sin y=\\dfrac{12}{13}+\\dfrac{5}{13}=\\dfrac{17}{13}$이므로 정답은 ③이다.',
5:'[키포인트] $\\sin x$로 직각삼각형 $ABD$의 빗변을 구한 다음 두 방향의 각 차를 벡터의 내적·외적으로 계산한다.\n$\\sin x=\\dfrac{BD}{AD}=\\dfrac{12}{AD}=\\dfrac34$이므로 $AD=16$이다.\n$AB=\\sqrt{16^2-12^2}=4\\sqrt7$이고, $BC=BD+DC=24$이다.\n기준선을 $BC$로 놓으면 $\\overrightarrow{DA}$와 $\\overrightarrow{CA}$의 내적은 $12\\cdot24+(4\\sqrt7)^2=400$이고, 외적의 크기는 $48\\sqrt7$이다.\n따라서 $\\tan y=\\dfrac{48\\sqrt7}{400}=\\dfrac{3\\sqrt7}{25}$이므로 정답은 ⑤이다.',
6:'[키포인트] 가까운 지점에서 수평거리와 높이가 같고, 두 관측 지점의 수평거리 차는 50 m이다.\n등대의 높이를 $h\\rm\\,m$라 하면 $45^\\circ$에서 가까운 지점과 등대 밑 사이 거리도 $h\\rm\\,m$이다.\n먼 지점에서는 수평거리가 $h+50$이므로 $\\tan30^\\circ=\\dfrac{h}{h+50}=\\dfrac1{\\sqrt3}$이다.\n$\\sqrt3h=h+50$, $(\\sqrt3-1)h=50$\n$h=\\dfrac{50}{\\sqrt3-1}=25(\\sqrt3+1)$이다.\n따라서 정답은 ②이다.',
7:'[키포인트] 정사면체의 높이는 밑면 정삼각형의 중심과 꼭짓점을 이은 직각삼각형에서 구한다.\n밑면의 한 변이 $a$이고 $H$가 중심이므로 $DH=\\dfrac{a}{\\sqrt3}$이다.\n$\\triangle ADH$에서 $AH=\\sqrt{AD^2-DH^2}=\\sqrt{a^2-\\dfrac{a^2}{3}}=\\dfrac{a\\sqrt6}{3}$이다.\n따라서 $\\sin x=\\dfrac{AH}{AD}=\\dfrac{\\sqrt6}{3}$이므로 정답은 ③이다.',
8:'[키포인트] 사각형의 넓이는 두 대각선과 그 사이 각으로 나타낼 수 있다.\n두 대각선의 길이가 모두 $d$이고 그 사이 각이 $120^\\circ$이므로\n$2\\sqrt3=\\dfrac12d^2\\sin120^\\circ$\n$=\\dfrac12d^2\\cdot\\dfrac{\\sqrt3}{2}=\\dfrac{d^2\\sqrt3}{4}$이다.\n따라서 $d^2=8$, $d=2\\sqrt2\\rm\\,cm$이다.\n정답은 ②이다.',
9:'[키포인트] 정사각형의 변을 좌표축으로 두고 두 선분의 끼인각을 계산한다.\n한 변의 길이를 $s$라 하고 $B=(0,0)$, $A=(0,s)$, $C=(s,0)$, $D=(s,s)$로 둔다.\n$M=(\\frac{s}{2},s)$, $N=(s,\\frac{s}{2})$이므로 $\\overrightarrow{BM}\\cdot\\overrightarrow{BN}=s^2$이다.\n$BM=BN=\\dfrac{\\sqrt5}{2}s$이므로 $\\cos x=\\dfrac{s^2}{(\\frac{\\sqrt5}{2}s)^2}=\\dfrac45$이다.\n$\\sin x=\\sqrt{1-\\cos^2x}=\\dfrac35$이므로 정답은 ①이다.',
11:'[키포인트] 두 관측 지점과 기구의 수직 높이를 직각삼각형으로 나타낸다.\n기구의 높이를 $h\\rm\\,m$라 하면 $45^\\circ$인 지점에서 기구 아래까지의 수평거리는 $h$이다.\n다른 지점까지는 $200-h$이므로 $\\tan30^\\circ=\\dfrac{h}{200-h}=\\dfrac1{\\sqrt3}$이다.\n$\\sqrt3h=200-h$, $(\\sqrt3+1)h=200$\n$h=\\dfrac{200}{\\sqrt3+1}=100(\\sqrt3-1)$이다.\n따라서 정답은 ①이다.',
12:'[키포인트] 중심각이 같은 호의 길이는 같고, 같은 원에서 같은 호에 대한 현의 길이도 같다.\n$\\angle AOB=\\angle BOC=\\angle DOE$이므로 $\\overset{\\frown}{AB}=\\overset{\\frown}{BC}=\\overset{\\frown}{DE}$이다.\n따라서 $\\overset{\\frown}{BC}=\\overset{\\frown}{DE}$이고 $\\overline{BC}=\\overline{DE}$이다.\n또 $\\overset{\\frown}{AC}=\\overset{\\frown}{AB}+\\overset{\\frown}{BC}$이므로 $\\overset{\\frown}{DE}=\\dfrac12\\overset{\\frown}{AC}$이다.\n$\\triangle OAB$와 $\\triangle ODE$는 두 반지름과 그 사이의 중심각이 각각 같아 합동이다. 하지만 현 $AC$는 중심각 두 배에 대응하는 현이므로 일반적으로 $AC\\ne2DE$이다.\n따라서 옳지 않은 것은 ④이다.',
13:'[키포인트] 지름이 만드는 반원과 같은 길이의 호를 차례로 이용한다.\n$\\angle ABC=25^\\circ$가 보는 호 $AC$의 크기는 $2\\times25^\\circ=50^\\circ$이다.\n$\\overset{\\frown}{AC}=\\overset{\\frown}{CD}$이므로 호 $CD$도 $50^\\circ$이다.\n$AB$가 지름이므로 아래쪽 반원의 호 합은 $180^\\circ$이고, $\\overset{\\frown}{DB}=180^\\circ-50^\\circ-50^\\circ=80^\\circ$이다.\n$x=\\angle BCD=\\dfrac{80^\\circ}{2}=40^\\circ$이므로 정답은 ①이다.',
14:'[키포인트] 현의 중점에 내린 수선에서 반지름·반현·활꼴의 높이 관계를 피타고라스 정리로 나타낸다.\n원의 중심을 $O$, 반지름을 $r$라 하자. $OM\\perp AB$이므로 $AM=3$이고 $OC=r$, $CM=1$이다.\n그림에서 $O,M,C$는 한 직선 위에 있고 $OM=r-1$이다.\n직각삼각형 $OMA$에서 $r^2=3^2+(r-1)^2$\n$r^2=9+r^2-2r+1$, $2r=10$, $r=5$이다.\n따라서 원래 접시의 넓이는 $\\pi r^2=25\\pi$이므로 정답은 ④이다.',
15:'[키포인트] 원주각으로 호의 중심각을 구하고 같은 원의 호 길이를 비례시킨다.\n$\\angle BPC=50^\\circ$이므로 이에 대응하는 호 $BC$의 중심각은 $100^\\circ$이다.\n호 $BC$의 길이가 $10\\pi\\rm\\,cm$이므로 원둘레는 $10\\pi\\times\\dfrac{360}{100}=36\\pi\\rm\\,cm$이다.\n$AB$가 지름이므로 호 $AB$의 길이는 $36\\pi\\div2=18\\pi\\rm\\,cm$이다.\n따라서 $x=\\overset{\\frown}{AC}=18\\pi-10\\pi=8\\pi\\rm\\,cm$이므로 정답은 ①이다.',
16:'[키포인트] 한 점에서 원에 그은 두 접선의 길이가 같음을 각 접점에서 적용한다.\n점 $C$에서 $CA=CE$, 점 $D$에서 $DB=DE$이다.\n$CD=CE+DE=5$이고 $PA=PB$이므로 $7+CE=8+DE$이다.\n$CE-DE=1$, $CE+DE=5$를 풀면 $CE=3$, $DE=2$이다.\n$PB=PD+DB=8+2=10\\rm\\,cm$이므로 정답은 ⑤이다.',
17:'[키포인트] 두 외부 할선의 각에서 서로 마주 보는 두 호의 차를 구한 뒤 네 호의 합을 사용한다.\n원 위의 호 $AB,BC,CD,DA$를 각각 $u,v,w,z$라 하자.\n점 $P$에서 $w-u=2\\times30^\\circ=60^\\circ$, 점 $Q$에서 $z-v=2\\times40^\\circ=80^\\circ$이다.\n$u+v+w+z=360^\\circ$에 대입하면 $u+v+(u+60^\\circ)+(v+80^\\circ)=360^\\circ$이다.\n따라서 $u+v=110^\\circ$이고, $x=\\angle CDA=\\dfrac{u+v}{2}=55^\\circ$이다.\n정답은 ④이다.',
18:'[키포인트] 접선의 길이로 사다리꼴의 빗변과 높이를 구한 뒤 반원의 넓이를 뺀다.\n점 $D$에서 그은 두 접선은 같으므로 $DT=DA=8\\rm\\,cm$이고, 점 $C$에서 그은 두 접선은 같으므로 $CT=CB=2\\rm\\,cm$이다.\n따라서 $DC=DT+TC=10\\rm\\,cm$이다. 높이 차는 $8-2=6\\rm\\,cm$이므로 직각삼각형에서 $AB=\\sqrt{10^2-6^2}=8\\rm\\,cm$이다.\n사다리꼴 $DABC$의 넓이는 $\\dfrac{8+2}{2}\\times8=40\\rm\\,cm^2$이다.\n반원의 반지름은 $4\\rm\\,cm$이므로 넓이는 $\\dfrac12\\pi\\times4^2=8\\pi\\rm\\,cm^2$이다.\n색칠한 부분의 넓이는 $40-8\\pi\\rm\\,cm^2$이므로 정답은 ⑤이다.',
19:'[키포인트] 교차하는 두 현이 만드는 각은 마주 보는 두 호에 대응하는 중심각 합의 절반이다.\n주어진 두 호의 길이 합은 $2\\pi$이고 반지름은 $4$이므로 두 중심각의 합은 $\\dfrac{2\\pi}{4}=\\dfrac\\pi2=90^\\circ$이다.\n따라서 $\\angle APC=\\dfrac{90^\\circ}{2}=45^\\circ$이므로 정답은 ②이다.',
20:'[키포인트] 원 안에서 만나는 두 현의 두 부분의 곱은 같다.\n$AP\\times PB=CP\\times DP$이므로 $5\\times8=CP\\times DP=40$이다.\n$CP:DP=2:5$이므로 $CP=2k$, $DP=5k$로 두면 $10k^2=40$이다.\n$k^2=4$이고 길이는 양수이므로 $k=2$, $DP=10\\rm\\,cm$이다.\n정답은 ③이다.',
21:'[키포인트] 네 모서리가 길이 $a$인 옆면 삼각형은 정삼각형이고, 중점들을 잇는 $MN$은 밑면의 한 변과 같다.\n$\\triangle VAB$가 정삼각형이므로 $VM=\\dfrac{\\sqrt3}{2}a$이다. 마찬가지로 $VN=\\dfrac{\\sqrt3}{2}a$이고 $MN=a$이다.\n코사인 법칙에서 $\\cos x=\\dfrac{VM^2+MN^2-VN^2}{2\\,VM\\,MN}=\\dfrac1{\\sqrt3}$이다.\n$\\sin x=\\sqrt{1-\\cos^2x}=\\sqrt{\\dfrac23}$, $\\tan x=\\sqrt2$이다.\n$(\\sin x+\\cos x)\\tan x=(\\sqrt{\\dfrac23}+\\dfrac1{\\sqrt3})\\sqrt2=\\dfrac{2+\\sqrt2}{\\sqrt3}$.',
22:'[키포인트] 외부 점 $Q$의 두 할선에 대한 원의 거듭제곱과 주어진 비를 사용한다.\n$BC=8$, $AB=AC=5$이므로 좌표를 $B=(0,0)$, $C=(8,0)$, $A=(4,3)$으로 둘 수 있다.\n$Q=(q,0)$라 하면 $q>8$, $BQ=q$, $CQ=q-8$, $QA^2=(q-4)^2+3^2$이다.\n$AP:PQ=1:3$이고 $A,P,Q$가 한 직선 위에서 $P$가 사이에 있으므로 $PQ=\\dfrac34QA$이다.\n할선 정리에서 $QA\\cdot QP=QB\\cdot QC$이므로 $\\dfrac34((q-4)^2+9)=q(q-8)$이다.\n정리하면 $q^2-8q-75=0$, $(q-13)(q+5)=0$이다. $q>8$이므로 $q=13$이고 $BQ=13$이다.',
23:'[키포인트] 접선의 방정식과 직사각형의 좌표를 이용해 $M$의 위치를 구한다.\n$AB=8$, $BC=12$이므로 $B=(0,0)$, $A=(0,8)$, $C=(12,0)$으로 둔다. 원은 위·오른쪽·아래 세 변에 접하므로 중심은 $O=(8,4)$, 반지름은 $4$이다.\n$BM$은 원에 $F$에서 접하므로 직선 $y=mx$와 원의 거리 조건은 $\\dfrac{|8m-4|}{\\sqrt{m^2+1}}=4$이다.\n이를 풀면 $m=0$ 또는 $m=\\dfrac43$이다. $m=0$은 밑변 $BC$이므로 위쪽 변과 만나는 접선은 $m=\\dfrac43$이다. $M$은 위쪽 변 $y=8$ 위에 있으므로 $8=\\dfrac43x_M$, $x_M=6$이다.\n따라서 $\\triangle ABM$의 넓이는 $\\dfrac12\\times8\\times6=24\\rm\\,cm^2$이다.'
};
const meta=(q)=>{
 const n=Number(q.id); const isTrig=n<=11||n===21; const unit=isTrig?'M3-05':'M3-06'; const sub=isTrig?(n===6||n===11?'M3-05-TRIG_RATIO_APPLICATION':(n===4||n===5||n===7||n===8||n===9||n===10||n===21?'M3-05-TRIG_RATIO_APPLICATION':'M3-05-TRIG_RATIO')):(n===14||n===16||n===18||n===20||n===22||n===23?'M3-06-CIRCLE_LINE':'M3-06-CIRCLE_INSCRIBED_ANGLE');
 let pt=null,tpl=null;
 if(sub==='M3-05-TRIG_RATIO'){pt='PT_TRIG_RATIO';tpl=n===3?'TPL_TRIG_RATIO_SPECIAL_ANGLE':'TPL_TRIG_RATIO_BASIC_RELATION';}
 if(sub==='M3-05-TRIG_RATIO_APPLICATION'){pt='PT_TRIG_RATIO_APPLICATION';tpl=(n===6||n===11)?'TPL_TRIG_APPLICATION_SHARED_HEIGHT':'TPL_TRIG_APPLICATION_CHAINED_MEASURE';}
 if(sub==='M3-06-CIRCLE_INSCRIBED_ANGLE'){pt='PT_CIRCLE_ANGLE_RELATIONS';tpl=(n===12||n===13||n===15)?'TPL_CIRCLE_ANGLE_CENTER_ARC':(n===16?'TPL_CIRCLE_ANGLE_TANGENT_CHORD':'TPL_CIRCLE_ANGLE_COMPOSITE');}
 const difficulty=[1,2,12].includes(n)?1:([5,7,9,10,11,16,17,18,21,22,23].includes(n)?3:2);
 const level=difficulty===1?'하':difficulty===3?'상':'중';
 const unitName=unit==='M3-05'?'삼각비':'원의 성질'; const subName=sub==='M3-05-TRIG_RATIO'?'삼각비':sub==='M3-05-TRIG_RATIO_APPLICATION'?'삼각비의 활용':sub==='M3-06-CIRCLE_LINE'?'원과 직선':'원주각';
 return {category:unitName,originalCategory:unitName,standardCourse:'중3 수학',curriculum:'2015',standardUnitKey:unit,standardUnit:unitName,standardUnitOrder:unit==='M3-05'?5:6,questionType:n<=20?'객관식':'서술형',layoutTag:'grid',wide:false,level,subUnitKey:sub,subUnit:subName,subUnitConfidence:'candidate_evidence',subUnitClassificationDepth:'complete_candidate',problemTypeKey:pt,templateKey:tpl,crossConceptKeys:[],conditionKeys:[],integrationPattern:n===17||n===22?'SEQUENTIAL':'SINGLE',difficultyBucket:difficulty,difficultyConfidence:'medium',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:difficulty===1?'EASY':difficulty===3?'HARD':'NORMAL',tagConfidence:'medium',tagStatus:'reviewed_create',sourceQuestionNo:String(n),displayNo:String(n),sourceOrdinal:n,sourcePageNo:n<=6?1:n<=14?2:n<=20?3:4,contentSource:'full_page_source_evidence',choicesSource:'source_pixel_transcription',answerSource:answers[n-1]?'independent_solve':'pending_clean_independent_review',solutionSource:solutions[n]?'fresh_independent_solution':'pending_clean_independent_review',extractionStatus:'SOURCE_TEXT_EXTRACTED',reviewStatus:solutions[n]?'CREATE_DONE':'OPEN_FOR_R1_R2',sourceDocumentSha256:`sha256:${pdfSha}`,sourceIdentityKey:`sha256:${pdfSha}|${n}`,decisiveStep:solutions[n]?solutions[n].split('\n')[0].replace('[키포인트] ',''):'Open source-only q10 fold geometry for independent blind solve.',...(q.image?{solutionImage:q.image,solutionImageAlt:`원문 ${n}번 문항의 도형 자료. 풀이에서 사용하는 표시와 대상은 실제 그림을 함께 확인한다.`,solutionImageCaption:`원문 도형에서 풀이에 필요한 조건을 확인한다.`,solutionImageSize:'medium'}:{})};
};
const corrections=[];
for(const q of qs){const n=Number(q.id); if(n===23){const before=q.content;q.content=q.content.replace('의 각 변에 접하는 원 ', '의 세 변에 접하는 원 '); if(q.content===before) throw new Error('q23 source correction locus not found'); corrections.push({qid:23,field:'content',before,after:q.content,reason:'PDF page 4 source says circle is tangent to three sides (세 변), not every side (각 변); exact minimal transcription correction.'});}
 if(answers[n-1]){q.answer=answers[n-1];q.solution=solutions[n];} else {q.answer='';q.solution='';}
 Object.assign(q,meta(q));
}
const js=`window.examTitle = ${JSON.stringify(exam)};\nwindow.questionBank = ${JSON.stringify(qs,null,2)};\n`;
fs.writeFileSync(candidate,js,'utf8');
const sourceComp={qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'CREATE',examUid:exam,sourceInputPath:sourceRow.selectedPath,sourceInputRawSha256:sourceRow.inputFileSha256,sourcePdf:{path:sourceRow.sourcePdfs[0].originalPath,sha256:sourceRow.sourcePdfs[0].sha256,pageCount:4,allPagesCompared:true,renderedPages:Array.from({length:4},(_,i)=>`${evidenceDir}/source-pdf-pages/page-${i+1}.png`)},corrections,openItems:[{qid:10,status:'OPEN_FOR_R1_R2',reason:'Student prompt and source diagram are present and checked, but fold geometry has not been independently resolved; no answer/solution was exposed upstream.'}],assetCopy:{count:sourceRow.assets.length,refs:sourceRow.assets.map(a=>({ref:a.ref,sha256:a.sha256}))}};
fs.writeFileSync(`${evidenceDir}/CREATE.source-comparison.json`,JSON.stringify(sourceComp,null,2)+'\n','utf8');
const updated=fs.readFileSync(candidate);
const sha=crypto.createHash('sha256').update(updated).digest('hex');
console.log(JSON.stringify({candidate,sha256:sha,assetCount:sourceRow.assets.length,corrections,openItems:sourceComp.openItems,questionCount:qs.length,withSolutions:qs.filter(q=>q.solution).length},null,2));






