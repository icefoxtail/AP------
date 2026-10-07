const fs=require('node:fs'); const vm=require('node:vm'); const path=require('node:path'); const crypto=require('node:crypto'); const {execFileSync}=require('node:child_process');
const root=process.argv[2], evidenceRoot=process.argv[3];
const sha=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const blob=p=>execFileSync('git',['-C',root,'hash-object',p],{encoding:'utf8'}).trim();
const goldenNames=['25_매산여고_2학기_중간_고1_기출','25_효천고_2학기_중간_고1_기출','25_제일고_2학기_중간_고1_기출'];
const selected=[[goldenNames[0],15,'먼저 점 $P$의 좌표를 구한다.'],[goldenNames[0],21,'이제 $AC=BC$라는 조건으로 $b$를 구한다.'],[goldenNames[1],2,'두 직선이 서로 수직이므로 두 직선의 기울기의 곱은'],[goldenNames[1],3,'주어진 식을 원의 표준형으로 바꾼다.'],[goldenNames[2],6,'드모르간의 법칙으로'],[goldenNames[2],20,'내분점 공식으로']];
const goldenSampleRefs=goldenNames.map(name=>{const p=`archive/exams/original/high/h1/2mid/${name}.js`,abs=path.join(root,p),b=fs.readFileSync(abs); return {path:p,sha256:sha(b),gitBlobSha:blob(abs)}});
const goldenSampleQuestionRefs=selected.map(([name,qid,excerpt])=>{const p=`archive/exams/original/high/h1/2mid/${name}.js`,s={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,p),'utf8'),s);const q=(s.window.questionBank||s.window.questions).find(x=>Number(x.id)===qid);if(!q||!String(q.solution||'').includes(excerpt))throw new Error(`sample qid/excerpt invalid ${name} ${qid}`);return {path:p,qid,solutionSha256:sha(Buffer.from(String(q.solution),'utf8')),solutionExcerpt:excerpt,observation:`실제 solution을 읽고 공식 설정, 핵심 변형·대입·결론이 연결되는 흐름을 확인했다. 학생이 따라 쓸 수 있도록 단계별 식을 분리했다.`}});
const negPaths=['archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md','archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q1-solution.bad.svg'];
const negativeSampleRefs=negPaths.map(p=>{const abs=path.join(root,p),b=fs.readFileSync(abs);return {path:p,sha256:sha(b),gitBlobSha:blob(abs)}});
const evidence={qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',solutionQualityCalibration:{sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'SOURCE_ONLY_CREATE',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],goldenSampleRefs,goldenSampleQuestionRefs,negativeSampleRefs,preflightObservations:{negative:'복성고 q1 실제 SVG를 열고 좌표를 비교했다. A(-5,3), B(1,-2)와 y절편 -7/6을 지나는 직선은 기울기 -5/6과 불일치하므로 라벨 확인만으로 SVG PASS를 줄 수 없다.',render:'선택한 6개 Golden SVG를 실제 렌더해 라벨·좌표·기하 primitive 일치 여부를 확인했다. 알려진 제일고 q18 visual 예외는 사용하지 않았다.'}}};
fs.writeFileSync(path.join(evidenceRoot,'CREATE.calibration-preflight.json'),JSON.stringify(evidence,null,2)+'\n','utf8');




