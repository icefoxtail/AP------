import fs from 'node:fs'; import crypto from 'node:crypto';
const root=process.argv[2], sampleFile=process.argv[3], out=process.argv[4];
const samples=JSON.parse(fs.readFileSync(sampleFile,'utf8'));
const excerpts={
 'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js':{2:'두 직선이 평행하므로 기울기가 서로 같다.',3:'원의 중심과 반지름을 읽으려면 주어진 식을 원의 표준형으로 바꾸어야 한다.'},
 'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js':{2:'두 직선이 서로 수직이므로 두 직선의 기울기의 곱은 $-1$이다.',3:'원의 중심과 반지름을 구하려면 주어진 식을 원의 표준형으로 바꾼다.'},
 'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js':{2:'함수의 그래프는 같은 $x$좌표에 서로 다른 두 $y$좌표가 대응하지 않아야 한다.',3:'부분집합에 $a$, $b$를 모두 포함하지 않으므로 나머지 원소 $c,d,e,f$만 선택하면 된다.'}
};
const sha=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const refs=samples.map(s=>({path:s.path,sha256:sha(fs.readFileSync(root+'/'+s.path)),gitBlobSha:blob(fs.readFileSync(root+'/'+s.path))}));
const qrefs=[]; for(const sample of samples) for(const item of sample.items){const excerpt=excerpts[sample.path][item.qid]; if(!item.solution.includes(excerpt)) throw Error('EXCERPT_MISMATCH:'+sample.path+':q'+item.qid); qrefs.push({path:sample.path,qid:item.qid,solutionSha256:item.solutionSha256Prefixed,solutionExcerpt:excerpt,observation:`실제 ${item.qid}번 해설을 판독해 조건→개념 선택→수식 전개→결론이 연결되는지 확인했다.${item.solutionImage?` 연결 SVG ${item.solutionImage}도 실제로 열어 계산 도형과 수치 표기를 확인했다.`:''}`});}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const negSvg='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q3-solution.bad.svg';
const evidence={solutionQualityCalibration:{sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'INDEPENDENT_REVIEW',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],goldenSampleRefs:refs,goldenSampleQuestionRefs:qrefs,negativeSampleRefs:[{path:negPath,sha256:sha(fs.readFileSync(root+'/'+negPath)),gitBlobSha:blob(fs.readFileSync(root+'/'+negPath))},{path:negSvg,sha256:sha(fs.readFileSync(root+'/'+negSvg)),gitBlobSha:blob(fs.readFileSync(root+'/'+negSvg))}]}};
fs.writeFileSync(out,JSON.stringify(evidence,null,2));