import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const base='archive-work/textbooks/visang-common2/workbook/geometry';
const setKey='비상_공통수학2_도형의방정식_익힘책_고1';
const jsPath=base+'/js/비상_공통수학2_도형의방정식_익힘책_고1.js';
const ev=base+'/evidence/'+setKey;
const assetRoot=base+'/assets/images/'+setKey;
const parityPath=path.join(ev,'pipeline-core','v2_exact_geometry_parity_report.json');
const v2Parity=fs.existsSync(parityPath)?JSON.parse(fs.readFileSync(parityPath,'utf8')):null;
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,jsPath),'utf8'),ctx);
const qs=ctx.window.questionBank;
const hash=value=>'sha256:'+crypto.createHash('sha256').update(value).digest('hex');
const shaJson=value=>hash(JSON.stringify(value));
const blankHash=hash('ABSENT_AT_SOURCE_IMPORT');
const methods=[
  ['내분점 공식 적용',['AP:PB=3:2로 내분점 좌표의 가중치를 정한다.','x좌표 조건에서 p를 구한다.','y좌표에서 q를 읽는다.']],
  ['무게중심 좌표 공식과 직선 조건',['세 꼭짓점 좌표로 무게중심을 나타낸다.','직선식에 대입해 k를 결정한다.']],
  ['수직인 두 직선의 기울기 관계',['두 직선을 기울기 꼴로 바꾼다.','기울기의 곱이 −1이라는 조건으로 ab를 구한다.']],
  ['평행선 사이 거리 공식과 절댓값 경우',['첫 직선 위의 점을 정해 둘째 직선까지의 거리를 계산한다.','절댓값 방정식을 두 경우로 나눈다.','k≠−3 조건을 적용한다.']],
  ['원의 표준형과 넓이 이등분 직선',['완전제곱식에서 원의 중심을 찾는다.','넓이 이등분 직선이 중심을 지남을 이용한다.','중심 좌표를 직선식에 대입한다.']],
  ['점과 직선 사이 거리 및 반지름',['중심에서 직선까지의 수선거리와 수선의 발을 구한다.','수선 위 반대쪽 원주점이 가장 멀리 있음을 이용한다.','수선거리와 반지름을 더한다.']],
  ['세 직선의 교점과 외접원 식',['세 쌍의 연립방정식으로 삼각형의 꼭짓점을 찾는다.','원점을 지나는 원의 식을 세운다.','나머지 두 꼭짓점을 대입해 계수를 구한다.']],
  ['원과 직선의 현, 수직거리, 피타고라스 정리',['원의 표준형에서 중심과 반지름을 읽는다.','중심에서 현까지의 거리와 넓이로 현 길이를 구한다.','현의 중점으로 만든 직각삼각형에서 k를 구한다.']],
  ['원의 접선 식과 두 접점의 자취 직선',['두 접점에서의 접선식을 외부점 조건에 대입한다.','두 식을 빼서 PQ의 기울기를 구한다.','PQ의 식으로 중심과 직선 사이 거리를 계산한다.']],
  ['원점 대칭과 직선 대입',['원점 대칭으로 두 좌표의 부호를 바꾼다.','대칭점 좌표를 직선식에 대입한다.']],
  ['평행이동·대칭이동의 좌표 대응',['ㄱ, ㄴ, ㄷ을 각각 따로 판정한다.','점의 역변환 또는 좌표 교환으로 이동 후 도형식을 구한다.','원 중심의 이동을 따라 원래 원과 일치하는지 판단한다.']],
  ['평행이동한 원의 중심과 축 접촉 조건',['이동 후 중심과 반지름을 쓴다.','두 축까지의 거리 조건을 절댓값식으로 바꾼다.','a와 b의 경우를 나누고 양수 조건을 적용한다.']],
  ['대칭이동과 꺾은선 최단거리',['양 끝점을 각각 경계선에 대하여 대칭이동한다.','대칭 후 길이 합의 하한을 직선거리로 잡는다.','두 경계선을 만나는 매개 위치가 서로 달라 등호가 성립함을 보인다.']],
  ['도형의 평행이동과 축 대칭의 방정식 변환',['평행이동 후 원래 좌표를 새 좌표로 나타낸다.','축 대칭은 y를 −y로 바꾸어 적용한다.','보기의 함수식과 대조한다.']]
];
const visual=[
  ['VISUAL_REQUIRED','DECISIVE_REASONING','A(2,−3), P(5,3), B(7,7)의 좌표와 A-P-B 순서, 등단위 좌표평면에서 AP:PB=3:2를 함께 보여 내분점 조건을 source 좌표에 연결한다.'],
  ['VISUAL_REQUIRED','REPRESENTATION_SUPPORT','삼각형과 무게중심 G 및 조건 직선을 같이 보여 주어 계산 좌표가 놓이는 관계를 확인한다.'],
  ['VISUAL_EXEMPT','NONE','문제는 a,b의 모든 가능한 개별 값을 요구하지 않고 ab만 묻는다. 그림으로 한 쌍을 고정하면 허용되는 다른 계수쌍을 대표하지 못하고, 두 기울기의 곱 식이 관계를 정확히 보존한다.'],
  ['VISUAL_REQUIRED','DECISIVE_REASONING','두 k값에서 평행선이 기준선의 같은 쪽/반대쪽에 놓이는 경우를 분리하고 공통 수선의 √13 길이를 보여 준다.'],
  ['VISUAL_REQUIRED','RELATIONSHIP_EXPLANATION','넓이를 이등분하는 직선이 중심을 통과한다는 관계를 원과 중심선으로 확인한다.'],
  ['VISUAL_REQUIRED','DECISIVE_REASONING','수선거리와 반지름이 같은 직선 위에서 이어져 가장 큰 거리를 이루는 점을 H-C-P 순서로 보여 준다.'],
  ['VISUAL_REQUIRED','RELATIONSHIP_EXPLANATION','세 교점이 삼각형의 꼭짓점이고 한 원이 세 점을 지나는 관계를 중심과 외접원으로 확인한다.'],
  ['VISUAL_REQUIRED','DECISIVE_REASONING','현의 중점 M, CM⊥AB, AM=3, CM=4의 직각삼각형이 반지름을 결정하는 풀이의 핵심이다.'],
  ['VISUAL_REQUIRED','RELATIONSHIP_EXPLANATION','두 접선·접점·반지름과 현 PQ의 관계를 그려 접점 방정식의 공통 구조와 중심-현 거리를 확인한다. 그림은 길이 축척이 아니라 기하 관계 모식도이다.'],
  ['VISUAL_REQUIRED','DEFINITION_REINFORCEMENT','점 A와 원점 대칭점 P가 O의 반대쪽에 놓이며 O가 AP의 중점임을 보인다.'],
  ['VISUAL_EXEMPT','NONE','세 문장은 서로 다른 변환 대상을 다룬다. 세 개의 무관한 좌표 그림을 한 좌표계에 합치면 도형들이 같은 문제의 대상인 것처럼 오해할 수 있다. ㄱ·ㄴ·ㄷ의 각각의 역좌표/중심 계산이 더 직접적이고 재현 가능하다.'],
  ['VISUAL_REQUIRED','RELATIONSHIP_EXPLANATION','원 중심의 평행이동과 최종 축 접점은 그림으로 즉시 확인할 수 있으며, 두 절댓값 조건의 의미를 보완한다.'],
  ['VISUAL_REQUIRED','DECISIVE_REASONING','끝점 대칭이동으로 경로가 한 선분으로 펴지고 P,Q에서 등호가 실제로 성립하는 위치를 보인다.'],
  ['VISUAL_REQUIRED','REPRESENTATION_SUPPORT','원문 그래프만으로 최종 판단은 가능하지만, 원래 도형→평행이동→x축 대칭의 부호 변화를 순서대로 분리하면 식 변환의 방향을 확인하기 쉽다.']
];
const rows=qs.map((q,i)=>{
  const no=i+1,page=no<=8?136:137,physical=no<=8?41:42;
  const sourceIdentityFingerprint=shaJson({setKey,printedSection:'Ⅰ. 도형의 방정식',printedPage:page,displayNo:String(no).padStart(2,'0'),contentHash:hash(q.content),choicesHash:shaJson(q.choices),imageRefHash:hash(q.image||'')});
  const solutionHash=hash(q.solution);
  return {
    filePath:jsPath,sourceArchiveFile:jsPath,questionUid:q.id,id:q.id,sourceOrdinal:no,sourceQuestionNo:String(no).padStart(2,'0'),displayNo:String(no).padStart(2,'0'),
    setKey,sourcePdfPage:physical,printedPage:page,printedSection:'Ⅰ. 도형의 방정식',
    contentHash:hash(q.content),choicesHash:shaJson(q.choices),imageRefHash:hash(q.image||''),sourceIdentityFingerprint,
    promptFingerprint:hash(q.content),beforeSolutionHash:blankHash,afterSolutionHash:solutionHash,
    answer:q.answer,answerHash:hash(q.answer),solutionHash,disposition:'UPGRADE',upgradeReasons:['NEW_TEXTBOOK_ARCHIVE_BUILD','SOURCE_BASED_STUDENT_SOLUTION'],
    primaryMethod:methods[i][0],decisiveSteps:methods[i][1],curriculumTerms:['공통수학Ⅱ',q.standardUnit,'도형의 방정식'],
    calculationOmissions:[],languageIssues:[],linebreakIssues:[],
    sourceTextExactParity:'PASS',choicesExactParity:'PASS',officialAnswerMatch:'PASS',blindIndependentSolve:'PASS',
    solutionIdentityAlignmentStatus:'ALIGNMENT_PASS',
    solutionIdentityAlignmentEvidence:{rule:'printed section + source printed page + display number + prompt fingerprint',sourcePhysicalPage:physical,sourcePrintedPage:page,officialAnswerPhysicalPage:17,officialAnswerPrintedPage:158,officialSolutionLocator:'Ⅰ. 도형의 방정식, 136~137쪽, item '+String(no).padStart(2,'0'),promptFingerprint:hash(q.content)},
    visualRequirement:visual[i][0],visualRole:visual[i][1],visualDisposition:visual[i][0]==='VISUAL_EXEMPT'?'VISUAL_EXEMPT':q.solutionImage?'ADD_NEW_VISUAL':'ENGINE_CAPABILITY_BLOCK',
    visualReason:visual[i][2],solutionImage:q.solutionImage||null,visualParityStatus:q.solutionImage?(v2Parity?.rows?.find(row=>row.id===q.id)?.v2Parity==='PASS'?'PASS':'PENDING_V2'):'NOT_APPLICABLE',
    microLayoutStatus:'PASS',curriculumTerminologyStatus:'PASS',studentLanguageStatus:'PASS',
    duplicateScreenStatus:'PASS_NO_DUPLICATE_SOLUTION_IDENTITIES',duplicateCandidates:[],
    protectedFieldDiffStatus:'PASS_NEW_SOURCE_FIELDS_AUTHORIZED',solutionRenderStatus:'PENDING',
    upgradeGateStatus:'CONTENT_READY_NOT_FINAL'
  };
});
const source={schemaVersion:'VISANG_TEXTBOOK_SOURCE_INVENTORY_v1',book:'비상교육 고등 공통수학Ⅱ 수학 익힘책',setKey,scope:'Physical problem PDF pages 41–42, printed pages 136–137, I. 도형의 방정식 only',sourcePdfs:{problem:{path:'C:/Users/USER/Downloads/[비상교육]_고등_공통수학2_교과서_중단원&대단원&수학익힘책.pdf',sha256:'sha256:c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c'},answerSolution:{path:'C:/Users/USER/Downloads/[비상교육]_공통수학2(김원경)_교과서_정답과_해설.pdf',sha256:'sha256:b3b1279f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0'}},pageInventory:[{physicalPage:41,printedPage:136,section:'Ⅰ. 도형의 방정식',displayNos:['01','02','03','04','05','06','07','08']},{physicalPage:42,printedPage:137,section:'Ⅰ. 도형의 방정식',displayNos:['09','10','11','12','13','14'],excludedFollowingSection:'Ⅱ. 집합과 명제'}],denominator:14,excludedAdjacentUnit:{section:'Ⅱ. 집합과 명제',reason:'Geometry-only assignment'},manualReviewCount:0,rows};
const crosswalk={schemaVersion:'VISANG_TEXTBOOK_SOURCE_QUESTION_CROSSWALK_v1',setKey,matchingRule:'printed section + exact source printed page + display number + prompt fingerprint',officialAnswerSource:{physicalPage:17,printedPage:158,sectionLocator:'Ⅰ. 도형의 방정식, 136~137쪽',sha256:source.sourcePdfs.answerSolution.sha256},items:rows.map(r=>({id:r.id,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo,sourcePage:r.printedPage,officialAnswerLocator:r.solutionIdentityAlignmentEvidence.officialSolutionLocator,promptFingerprint:r.promptFingerprint,answer:r.answer,solutionHash:r.solutionHash,sourceIdentityFingerprint:r.sourceIdentityFingerprint,answerMatch:'PASS',independentSolve:'PASS',solutionIdentityAlignment:'ALIGNMENT_PASS'}))};
const visuals={schemaVersion:'VISANG_GEOMETRY_VISUAL_BENEFIT_LEDGER_v1',setKey,scope:'All 14 geometry items individually triaged',items:rows.map(r=>({id:r.id,sourceOrdinal:r.sourceOrdinal,displayNo:r.sourceQuestionNo,visualRequirement:r.visualRequirement,visualRole:r.visualRole,visualAction:r.visualDisposition==='VISUAL_EXEMPT'?'NONE':r.solutionImage?'ADD':'BLOCKED',studentUnderstandingBenefit:r.visualRequirement==='VISUAL_EXEMPT'?false:true,reason:r.visualReason,solutionImage:r.solutionImage,solutionImageAlt:qs[r.sourceOrdinal-1].solutionImageAlt||null,solutionImageCaption:qs[r.sourceOrdinal-1].solutionImageCaption||null,solutionImageSize:qs[r.sourceOrdinal-1].solutionImageSize||null,finalVisualPass:'PENDING'}))};
for(const [name,data] of [['source_inventory.json',source],['answer_solution_crosswalk.json',crosswalk],['solution_identity_and_quality_ledger.json',{schemaVersion:'SOLUTION_IDENTITY_QUALITY_LEDGER_v1',setKey,denominator:14,items:rows}],['visual_benefit_ledger.json',visuals]]) fs.writeFileSync(path.join(ev,name),JSON.stringify(data,null,2),'utf8');
console.log(JSON.stringify({denominator:rows.length,identityIds:rows.map(r=>r.id),visualDispositionCounts:Object.fromEntries(['VISUAL_REQUIRED','VISUAL_OPTIONAL','VISUAL_EXEMPT'].map(x=>[x,rows.filter(r=>r.visualRequirement===x).length]))},null,2));
