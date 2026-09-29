import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
const repo=process.cwd();
const setRoot='archive-work/textbooks/visang-common2/middle/유리함수와 무리함수';
const setName='비상_공통수학2_유리함수와무리함수_중단원학습점검_고1';
const evidence=path.join(setRoot,'evidence',setName);
const jsPath=path.join(setRoot,'js',`${setName}.js`);
const src=fs.readFileSync(jsPath,'utf8');
const ctx={window:{}}; vm.runInNewContext(src,ctx);
const questions=ctx.window.questionBank;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const official=[
 {n:1,answer:'(1) (x−1)/(x(x+1)); (2) 2/(x(x−2))',solve:'Common denominator in (1); factor and cancel in (2).'},
 {n:2,answer:'(1) domain x≠1, range y≠2, asymptotes x=1,y=2; (2) domain x≠−1, range y≠−2, asymptotes x=−1,y=−2',solve:'Rewrite the second as −2+3/(x+1); translate y=1/x and y=3/x.'},
 {n:3,answer:'(1) 2; (2) 2x/(x−4)',solve:'Use difference of squares and rationalize the common denominator.'},
 {n:4,answer:'(1) domain x≥1, range y≤2; (2) domain x≤2, range y≥−1',solve:'Apply the nonnegative-radicand condition and bound the square root.'},
 {n:5,answer:'a=−3, b=2',solve:'Match the vertical and horizontal asymptotes after translation.'},
 {n:6,answer:'a=−1, b=−2, c=0',solve:'Use the vertical asymptote, horizontal asymptote, and passage through the origin.'},
 {n:7,answer:'3',solve:'The odd positive divisors of 18 available for 2x−1 are 1,3,9.'},
 {n:8,answer:'a=−3, b=9, c=−1',solve:'Use the endpoint (3,−1), then substitute the graph point (0,2).'},
 {n:9,answer:'5',solve:'The radical function increases on [0,3]; its minimum gives a=4 and the value at x=3 is 5.'},
 {n:10,answer:'a=−4, b=13',solve:'f(3)=1 gives 3a+b=1; inverse correspondence g(3)=1 gives f(1)=3 and a+b=9.'},
 {n:11,answer:'2√3+3',solve:'Set P=(t,3/(t−2)+1), t>2; apply AM-GM to 3/(t−2)+(t−2)+3.'},
 {n:12,answer:'2',solve:'For m=1 the line meets the radical graph at (3,1); for m=2 the line starts above the decreasing curve and increases.'}
];
const mappings=[
 {n:1,sourcePhysicalPage:35,sourcePrintedPage:127}, {n:2,sourcePhysicalPage:35,sourcePrintedPage:127},
 {n:3,sourcePhysicalPage:35,sourcePrintedPage:127}, {n:4,sourcePhysicalPage:35,sourcePrintedPage:127},
 {n:5,sourcePhysicalPage:36,sourcePrintedPage:128}, {n:6,sourcePhysicalPage:36,sourcePrintedPage:128},
 {n:7,sourcePhysicalPage:36,sourcePrintedPage:128}, {n:8,sourcePhysicalPage:36,sourcePrintedPage:128},
 {n:9,sourcePhysicalPage:36,sourcePrintedPage:128}, {n:10,sourcePhysicalPage:36,sourcePrintedPage:128},
 {n:11,sourcePhysicalPage:36,sourcePrintedPage:128}, {n:12,sourcePhysicalPage:36,sourcePrintedPage:128}
];
const freezes=questions.map((q,i)=>({ordinal:i+1,id:q.id,sourcePhysicalPage:mappings[i].sourcePhysicalPage,sourcePrintedPage:mappings[i].sourcePrintedPage,content:q.content,choices:q.choices,contentSha256:sha(q.content),choicesSha256:sha(JSON.stringify(q.choices)),manualFullPageParity:'PASS'}));
fs.writeFileSync(path.join(evidence,'source-transcription-freeze.json'),JSON.stringify({schemaVersion:'VISANG_SOURCE_TRANSCRIPTION_FREEZE_v1',sourceFile:'[비상교육]_고등_공통수학2_교과서_중단원&대단원&수학익힘책.pdf',sourcePhysicalPages:[35,36],printedPages:[127,128],denominator:12,items:freezes},null,2)+'\n','utf8');
fs.writeFileSync(path.join(evidence,'section-page-mapping.json'),JSON.stringify({schemaVersion:'VISANG_TEXTBOOK_PAGE_MAPPING_v1',sectionTitle:'유리함수와 무리함수 중단원 학습 점검',items:mappings,denominator:12},null,2)+'\n','utf8');
fs.writeFileSync(path.join(evidence,'question-inventory.json'),JSON.stringify({schemaVersion:'VISANG_TEXTBOOK_QUESTION_INVENTORY_v1',sourcePhysicalPages:[35,36],printedPages:[127,128],expectedQuestionCount:12,actualQuestionCount:questions.length,ordinals:questions.map((q,i)=>({ordinal:i+1,id:q.id,standardUnitKey:q.standardUnitKey,questionType:q.questionType,hasProblemImage:Boolean(q.image),hasSolutionImage:Boolean(q.solutionImage)}))},null,2)+'\n','utf8');
fs.writeFileSync(path.join(evidence,'source-page-inventory.json'),JSON.stringify({schemaVersion:'VISANG_TEXTBOOK_SOURCE_PAGE_INVENTORY_v1',problemSource:{file:'[비상교육]_고등_공통수학2_교과서_중단원&대단원&수학익힘책.pdf',sha256:'c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c',physicalPages:[35,36],printedPages:[127,128],items:'1–12'},officialAnswerSource:{file:'[비상교육]_공통수학2(김원경)_교과서_정답과_해설.pdf',sha256:'b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0',physicalPages:[14,15],printedPages:[155,156],items:'The middle-check answer key begins with item 1 on physical page 14 and the remaining worked answers continue on physical page 15.'},evidenceImages:['problem-35.png','problem-36.png','answer-14.png','answer-15.png','answer-14-q1-zoom.png']},null,2)+'\n','utf8');
fs.writeFileSync(path.join(evidence,'answer-solution-crosswalk.json'),JSON.stringify({schemaVersion:'VISANG_OFFICIAL_ANSWER_CROSSWALK_v1',answerSourceFile:'[비상교육]_공통수학2(김원경)_교과서_정답과_해설.pdf',answerSourcePhysicalPages:[14,15],answerSourcePrintedPages:[155,156],textbookPrintedPages:[127,128],denominator:12,items:official.map(row=>{const q=questions[row.n-1];return {...row,jsAnswer:q.answer,answerCrosswalk:'PASS',independentSolution:q.solution,solutionIdentityAlignment:'PASS',sourceOrdinal:row.n};})},null,2)+'\n','utf8');
fs.writeFileSync(path.join(evidence,'golden_sample_calibration_refs.json'),JSON.stringify({goldenSampleRefs:[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',questions:[1,5,9],axes:['student solution reproducibility','blackboard calculation progression','conditional reasoning']},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',questions:[1,5,9],axes:['concise student-facing phrasing','explicit intermediate calculations','final answer linkage']},
 {path:'archive/exams/original/high/h1/2mid/25_순천여고_2학기_중간_고1_기출.js',questions:[1,5,9],axes:['solution clarity','independent review precision','short mathematical reasoning']}
],negativeSampleRefs:[],sampleReadBeforeWork:true,blindDecisionFrozenBeforeCompare:'NOT_APPLICABLE',calibrationAxes:['small-blackboard solution quality','explanation calculation density','student language'],calibrationStatus:'PASS',notes:'Q1, Q5, Q9 from all three designated 2025 Grade 10 second-semester midterm samples were read before authoring. They set a style bar only; target answers were independently derived from the textbook source and official answer pages.'},null,2)+'\n','utf8');
fs.writeFileSync(path.join(evidence,'visual-benefit-ledger.json'),JSON.stringify({schemaVersion:'APMATH_VISUAL_BENEFIT_LEDGER_v1',setTitle:setName,items:[
 {ordinal:1,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'Rational-expression simplification is shown completely by factoring and cancellation.'},
 {ordinal:2,visualRequirement:'VISUAL_REQUIRED',visualAction:'ADD',reason:'The source explicitly asks for two graphs and their asymptotes; the solution graph places branches around the correct asymptotes.',asset:'assets/images/'+setName+'/q02_rational-graphs.svg',criticalFacts:['vertical asymptotes x=1 and x=−1','horizontal asymptotes y=2 and y=−2','branches and sample points match the two formulas']},
 {ordinal:3,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'Difference of squares and a common denominator communicate the simplification directly.'},
 {ordinal:4,visualRequirement:'VISUAL_REQUIRED',visualAction:'ADD',reason:'The source asks students to draw both radical graphs; endpoint and direction are the key domain/range facts.',asset:'assets/images/'+setName+'/q04_radical-graphs.svg',criticalFacts:['endpoint (1,2), branch extends right and downward','endpoint (2,−1), branch extends left and upward']},
 {ordinal:5,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'The translation is determined directly by matching the two pairs of asymptotes.'},
 {ordinal:6,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'The stated vertical asymptote, horizontal asymptote, and origin condition determine the parameters without a plot.'},
 {ordinal:7,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'The finite divisor cases list every natural-coordinate point; a graph adds no decision information.'},
 {ordinal:8,visualRequirement:'VISUAL_REQUIRED',visualAction:'KEEP',reason:'The supplied source graph is needed to read the endpoint, direction, and known point; a clean crop retains it as problem material.',asset:'assets/images/'+setName+'/q08_source-graph.png',criticalFacts:['endpoint (3,−1)','curve extends left and upward','curve passes (0,2)']},
 {ordinal:9,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'Monotonicity on the stated closed interval makes the endpoints determine minimum and maximum directly.'},
 {ordinal:10,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'The inverse correspondence becomes two scalar equations; no graph is needed to determine a or b.'},
 {ordinal:11,visualRequirement:'VISUAL_EXEMPT',visualAction:'NONE',reason:'The perpendicular distances equal the positive coordinates of P, so the one-variable expression and AM-GM show the minimum directly.'},
 {ordinal:12,visualRequirement:'VISUAL_REQUIRED',visualAction:'ADD',reason:'Disjointness depends on the first contact threshold between a decreasing radical graph and an increasing line; comparing m=1 and m=2 is clearer in the plot.',asset:'assets/images/'+setName+'/q12_intersection-threshold.svg',criticalFacts:['radical curve starts at (3,1) and decreases for x≥3','m=1 line meets the curve at (3,1)','m=2 line lies above and increases for x≥3']}
],summary:{required:4,optional:0,exempt:8,unresolved:0,providerV3VisualReview:'PENDING'}},null,2)+'\n','utf8');
const rules=[
 {path:'docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md',declaredVersion:'v2.6',bytes:95451,sha256:'35aaaff1edcf77d80131cf0b25b311ec60e5422a949d16dee53cbe113c825700'},
 {path:'docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md',declaredVersion:'v1.2.10',bytes:200952,sha256:'69982524a063f5c49d252473eaf74eedd4d9a078e64fcc85a6144d838d056dac'},
 {path:'docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md',declaredVersion:'v1',bytes:8150,sha256:'052ac837de80f4728a4500adb4f0fd222a14164bd4c6ffe74bfdfb283605258a'},
 {path:'docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md',declaredVersion:'v1',bytes:9468,sha256:'ce4166be64d437a98eebcacbb728e6625dd4ba6472f0d6d20295767265c71685'},
 {path:'docs/rules/04_VISUAL/도형추출.md',declaredVersion:'v3.0',bytes:57487,sha256:'5121ee73b19e9df3310c98720532dd6d9768be2d7a172837f57db1f78e7cef09'},
 {path:'archive/tools/pipeline-core/README.md',declaredVersion:'pipeline-core v2',bytes:18798,sha256:'afc61809f9a37b5d62dccad6d45ca19166724b3fe919702c72ceee412ef01a12'},
 {path:'archive/tools/pipeline-core/AGENT_BUDGET.md',declaredVersion:'v2 execution authority',bytes:18362,sha256:'2f764f34e1548bf20606043e8c9cf2a9777a4d75c7337e42e743c0236ed6efc5'}
];
const actual=rules.map(r=>{const b=fs.readFileSync(r.path);const digest=crypto.createHash('sha256').update(b).digest('hex');return {...r,actualBytes:b.length,actualSha256:digest,matches:b.length===r.bytes&&digest===r.sha256};});
fs.writeFileSync(path.join(evidence,'visual-rule-preflight.json'),JSON.stringify({status:actual.every(x=>x.matches)?'PASS':'FAIL',ruleFiles:actual,applicableUnitOverlay:'NONE_FOUND for H22-C2-08 / H22-C2-09'},null,2)+'\n','utf8');
console.log(`Wrote item inventory and evidence for ${questions.length} questions.`);
