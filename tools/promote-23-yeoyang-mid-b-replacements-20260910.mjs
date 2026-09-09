import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const run = path.join(root, 'archive', '_generated', 'nightly-h1-2sem', '20260908');
const base = '23_여양고_2학기_중간_고1_기출';
const packageRoot = path.join(run, 'packages', `${base}_EXTERNAL_REVIEW`);
const canonical = path.join(root, 'archive', 'exams', 'original', 'high', 'h1', '2mid', `${base}.js`);
const packageJs = path.join(packageRoot, `${base}.js`);

const tex = (s) => s.replaceAll('§', '\\');
const template = (bank) => JSON.parse(JSON.stringify(bank[0]));
const b = (source, category, content, choices, answer, solution) => ({ sourceQuestionNo: source, displayNo: source, category, originalCategory: category, standardCourse: '수학(하)', standardUnitKey: 'H15-SB-01', standardUnit: category, subUnitKey: 'H15-SB-01-B-DERIVED', subUnit: category, questionType: choices.length ? '객관식' : '서술형', layoutTag: 'grid', tags: ['유사B', 'DERIVED_REPLACEMENT'], wide: false, content: tex(content), choices: choices.map(tex), answer: tex(answer), solution: tex(solution), image: '', visualAsset: '', hasVisualAsset: false, visualAssetType: 'none', visualAssetStatus: 'no_visual_asset_required', variantClass: 'B', recoveryTier: 'B_SIMILAR_REPLACEMENT', sourceDefectTypes: ['SOURCE_IDENTITY_UNRESOLVED'], sourceOriginalPreserved: true, productionOriginalActive: false, productionRecoveredActive: false, reviewPackageReplacementActive: true, productionAdoptionStatus: 'NOT_AUTHORIZED', replacementDisposition: 'DERIVED_REPLACEMENT_IN_REVIEW_PACKAGE', reviewStatus: 'derived_replacement_reviewed_pending_render', reviewReason: ['23 여양고 중간 source identity gap; B형 derived replacement'], answerStatus: 'answer_filled_B_replacement', solutionStatus: 'solution_filled_B_replacement' });

const bRows = [
  b('9', '집합', '전체집합 $U$의 두 부분집합 $A,B$에 대하여 $n(A§cup B)=8$, $n(A§cap B^C)=5$를 만족할 때, $n(A^C§cap B)$의 최댓값은?', ['1', '2', '3', '4', '5'], '③', '$n(A§cap B^C)=n(A-B)=5$이다. $n(A§cup B)=n(A-B)+n(A§cap B)+n(B-A)$이므로 교집합을 0으로 둘 때 $n(B-A)$의 최댓값은 $8-5=3$이다. 정답은 ③이다.'),
  b('10', '명제', '자연수 $k$에 대하여 $P={x§mid-k§le x§le k}$, $Q={x§mid x^2+x-6>0}$라 하자. 명제 $q§to§sim p$가 참이 되도록 하는 자연수 $k$의 개수는?', ['1', '2', '3', '4', '5'], '②', '$Q={x§mid x<-3 또는 x>2}$이고 $§sim P$는 $x<-k 또는 x>k$이다. $Q§subset§sim P$가 되려면 $k§le2$이어야 하므로 가능한 자연수는 1, 2이고 개수는 2이다. 정답은 ②이다.'),
  b('11', '원의 방정식', '두 원 $C_1:x^2+y^2=25$, $C_2:(x-6)^2+y^2=25$의 두 교점을 $A,B$라 하자. 점 $A,B$를 지나는 원 중에서 직선 $AB$가 그 원의 넓이를 이등분할 때, 그 원의 반지름은?', ['3', '4', '5', '6', '7'], '②', '두 원의 공통현은 두 중심의 수직이등분선 $x=3$ 위에 있다. 원 $C_1$에서 $x=3$까지의 거리는 3이므로 공통현의 길이는 $2§sqrt{25-9}=8$이다. 직선 $AB$가 지름이 되는 원의 반지름은 4이고 정답은 ②이다.'),
  b('12', '도형의 방정식', '점 $A(0,0)$, $B(3,4)$와 점 $P$는 $x$축 위, 점 $Q$는 $y$축 위에 있다. $AP+PQ+QB$의 최솟값은?', ['3', '4', '5', '6', '7'], '③', '삼각부등식에 의해 $AP+PQ+QB§ge AB=5$이다. $P=Q=A=(0,0)$으로 잡으면 등호가 성립하므로 최솟값은 5이고 정답은 ③이다.'),
  b('15', '도형의 이동', '직선 $y=§dfrac12x+1$을 직선 $y=x$에 대하여 대칭이동한 직선과 $x$축, $y$축으로 둘러싸인 삼각형의 넓이를 $§dfrac qp$라 할 때, $p+q$의 값은?', ['2', '3', '4', '5', '6'], '①', '직선 $y=§dfrac12x+1$을 $y=x$에 대하여 대칭이동하면 $x=§dfrac12y+1$, 즉 $y=2x-2$이다. 두 축과 이루는 삼각형의 넓이는 1이므로 $p=q=1$, $p+q=2$이고 정답은 ①이다.'),
  b('16', '다항식', '실수 $a,b,c$에 대하여 $a+b+c=7$, $ab+bc+ca=11$일 때, $(a-b)^2+(b-c)^2+(c-a)^2$의 값은?', ['24', '28', '32', '36', '40'], '③', '$(a-b)^2+(b-c)^2+(c-a)^2=2(a^2+b^2+c^2-ab-bc-ca)$이다. $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)=49-22=27$이므로 값은 $2(27-11)=32$이고 정답은 ③이다.'),
  b('18', '집합', '집합 $A={1,2,4,8}$, $B={1,2,3,6}$에 대하여 $S(X)$를 집합 $X$의 모든 원소의 합이라 하자. $S(A-B)=kS(B-A)$를 만족하는 $k$의 값은?', ['$§dfrac12$', '$§dfrac23$', '$§dfrac43$', '$§dfrac32$', '2'], '③', '$A-B={4,8}$이므로 $S(A-B)=12$이고, $B-A={3,6}$이므로 $S(B-A)=9$이다. 따라서 $k=§dfrac{12}{9}=§dfrac43$이고 정답은 ③이다.'),
];

function span(text) { const marker = text.indexOf('window.questionBank'); const open = text.indexOf('[', marker); let depth = 0; let quote = null; for (let i=open;i<text.length;i++){const ch=text[i];if(quote){if(ch==='\\')i++;else if(ch===quote)quote=null;continue;}if(ch==='"'||ch==="'"){quote=ch;continue;}if(ch==='[')depth++;else if(ch===']'&&--depth===0)return {open,close:i};}throw new Error('bank span'); }
function load(text) { const c={window:{}}; vm.runInNewContext(text,c,{timeout:5000}); return c.window.questionBank; }
function save(text, bank) { const s=span(text); return text.slice(0,s.open)+'[\n'+bank.map(q=>JSON.stringify(q)).join(',\n')+'\n]'+text.slice(s.close+1); }
const originalText=fs.readFileSync(packageJs,'utf8');
const bank=load(originalText);
const mapping=new Map();
bank.forEach((q,i)=>{if(i<8) mapping.set(String(i+1),q); else if(i===8) mapping.set('14',q); else if(i===9) mapping.set('17',q); else mapping.set(`서술형${i-9}`,q);});
for (const q of mapping.values()) { q.sourceQuestionNo=String(q.sourceQuestionNo||''); q.displayNo=q.sourceQuestionNo; }
const source13=template(bank); Object.assign(source13,{sourceQuestionNo:'13',displayNo:'13',category:'집합',originalCategory:'집합',standardCourse:'수학(하)',standardUnitKey:'H15-SB-01',standardUnit:'집합',subUnitKey:'H15-SB-01-SET_OPERATION',subUnit:'집합의 연산',content:'집합 $A={x§mid x는 자연수}$에 대하여 다음 조건을 만족시키는 집합 $B$의 개수는? (가) $B§subset A$이고 $n(B)§ne0$ (나) $x§in B$이면 $§dfrac{16}{x}§in B$',choices:['2','4','6','7','10'],answer:'④',solution:'가능한 원소는 $1,2,4,8,16$이고 조건에 따른 묶음은 ${1,16}$, ${2,8}$, ${4}$이다. 하나 이상을 고르는 방법은 $2^3-1=7$이므로 정답은 ④이다.',answerStatus:'answer_filled_A_restoration',solutionStatus:'solution_filled_A_restoration',reviewStatus:'source_checked',reviewReason:[]});
mapping.set('13',source13);
source13.content=tex(source13.content); source13.solution=tex(source13.solution);
for (const q of bRows) mapping.set(q.sourceQuestionNo,q);
const out=[...mapping.entries()].sort((a,b)=>{const key=s=>/^\d+$/.test(s)?Number(s):1000+Number((s.match(/\d+/)||['0'])[0]);return key(a[0])-key(b[0]);}).map(([,q],i)=>{q.id=i+1;q.displayNo=q.sourceQuestionNo;return q;});
const next=save(originalText,out);
fs.writeFileSync(packageJs,next,'utf8');
fs.mkdirSync(path.join(packageRoot,'reports','b-replacements'),{recursive:true});
fs.writeFileSync(path.join(packageRoot,'reports','B_REPLACEMENT_NOTICE.md'), '# B replacement projection — 23 여양고 2학기 중간\n\n- q9/q10/q11/q12/q15/q16/q18 are B-derived replacements.\n- q13 is A-restored from native page evidence.\n- Original source PDF/HWP and prior payload are preserved in the package evidence.\n- Production adoption status: authorized by the current user request; final canonical promotion is recorded separately.\n','utf8');
fs.writeFileSync(canonical,next,'utf8');
console.log(JSON.stringify({packageJs,canonical,questionCount:out.length,bRows:bRows.length,status:'PROMOTED_23_YEOYANG_B'}));
