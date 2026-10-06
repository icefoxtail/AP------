import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
const root = '.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출';
const bundlePath = path.join(root, 'evidence/R2.student-input.json');
const bundleRaw = fs.readFileSync(bundlePath);
const bundle = JSON.parse(bundleRaw.toString('utf8'));
const sourceRaw = fs.readFileSync(path.join(root, '20_금당중_2학기_기말_중2_기출.js'));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const answers = [
  {qid:1, answer:'3', reasoning:'Similar quadrilaterals map A-E, B-F, C-G, D-H. F=85, A=100, C=80, so H=95 degrees; only choice 3 is true.'},
  {qid:2, answer:'5', reasoning:'Triangles DEC and ACB are similar with EC:AC=6:12=1:2. DC:BC=1:2, so BC=18 and BE=BC-EC=12 cm.'},
  {qid:3, answer:'1', reasoning:'AB=21, AC=14, and AD=9, AF=6; AD:AB=AF:AC=3:7, with DF parallel BC in the diagram, so ABC is similar to ADF.'},
  {qid:4, answer:'4', reasoning:'Altitude theorem gives DC=AD^2/BD=81/6=13.5, and the corresponding side/angle similarity statements hold. Area ratio [ACD]:[ABD]=DC:BD=13.5:6=9:4, not 2:1.'},
  {qid:5, answer:'5', reasoning:'Midsegment lengths/parallelism and the stated similarities hold. Triangle DBE has sides 4, 6, and 5 cm, perimeter 15 cm rather than 20 cm.'},
  {qid:6, answer:'5', reasoning:'The left transversal has total l-to-n length 10 cm, with l-to-m 6 cm; the right has l-to-m 9 cm. Similar intercept ratios give right total 15 cm, so x=15-9=6 cm.'},
  {qid:7, answer:'1', reasoning:'BM=6 gives BC=12. Centroid G lies at 2/3 of the median from A, so DE=(2/3)BC=8 and DG=GE=4. AE=8 and AE/AC=2/3 imply EC=4. Thus 2x-y=4.'},
  {qid:8, answer:'1', reasoning:'With BC as base, G is one-third the altitude above BC and G-prime is one-third of G’s altitude, hence one-ninth the original altitude. D is midpoint of BC, so [G-prime BD]/[ABC]=1/18; 90/18=5 cm^2.'},
  {qid:9, answer:'2', reasoning:'In triangle BCD, M and N are midpoints of BC and CD, so MN=BD/2=6. Coordinate/section ratio on median AM gives BE=BD/3=4. Sum=10 cm.'},
  {qid:10, answer:'2', reasoning:'The two right triangles share x=12 cm from the 5-12-13 triple; the other triangle is 9-12-15, so y=9 and x+y=21.'},
  {qid:11, answer:'3', reasoning:'Only 7^2+24^2=25^2, so the third triple is right.'},
  {qid:12, answer:'5', reasoning:'The horizontal offset is 11-4=7. With slanted side 25, trapezoid height is sqrt(25^2-7^2)=24. Area=(4+11)·24/2=180 cm^2.'},
  {qid:13, answer:'4', reasoning:'Rectangle diagonal BD=10, so DO=5. The perpendicular through O yields DE=6.25 and EO=3.75 by the 3-4-5 direction ratio; perimeter=15 cm.'},
  {qid:14, answer:'3', reasoning:'Independent choices multiply: 3 bread options × 4 sauce options = 12.'},
  {qid:15, answer:'4', reasoning:'Ordered distinct dice: sum 5 has 4 outcomes and sum 7 has 6; total 10.'},
  {qid:16, answer:'3', reasoning:'y=x+1 with x,y in 1..6 allows (1,2),(2,3),(3,4),(4,5),(5,6): 5 outcomes.'},
  {qid:17, answer:'2', reasoning:'Only x-y=0 has nonzero probability among the five events; it has 6/36 outcomes, while the other four have probability 0.'},
  {qid:18, answer:'3', reasoning:'Primes in 1..15: 6; multiples of 5: 3; overlap {5}. Union count=6+3-1=8, probability 8/15.'},
  {qid:19, answer:'4', reasoning:'At least one hit is 1-(2/5)^2=21/25.'},
  {qid:20, answer:'2', reasoning:'Favorable choices 3·4=12; total pairs C(7,2)=21; probability=12/21=4/7.'},
  {qid:21, answer:'△ACF∼△DEF; x/220.5=1/1.5; x=147 m', reasoning:'Pyramid height and stick are vertical, shadow lengths are 220.5 m and 1.5 m, and both triangles are right with the same sun-ray angle. Similarity gives x/1=220.5/1.5=147.'},
  {qid:22, answer:'EF=15 cm; △AGG′∼△AEF; GG′=10 cm', reasoning:'E and F are the midpoints of BD and DC, so EF=BC/2=15. Each centroid is 2/3 along its median from A, so GG′ is parallel EF and △AGG′∼△AEF at ratio 2:3; GG′=10.'},
  {qid:23, answer:'1/6; 1/8; 5/48; 7/48; 1/4', reasoning:'Miss A=1/6 and miss B=1/8. A-only=(5/6)(1/8)=5/48; B-only=(1/6)(7/8)=7/48; exactly one=12/48=1/4.'}
];
if (bundle.count !== 23 || bundle.questions.length !== 23 || bundle.assets.length !== 16) throw new Error('student bundle coverage mismatch');
const qids = bundle.questions.map(q=>q.id);
if (JSON.stringify(answers.map(a=>a.qid)) !== JSON.stringify(qids)) throw new Error('answer freeze denominator mismatch');
const record = {
  examUid: '20_금당중_2학기_기말_중2_기출', stage: 'R2', status: 'BLIND_ANSWER_FREEZE',
  frozenBeforeStoredAnswerExposure: true,
  source: {path:'20_금당중_2학기_기말_중2_기출.js', sha256:bundle.source.sha256, gitBlobSha1:'25737072ff23b6c7b863c3ee1e803fdc538f89f1'},
  studentInput: {path:'evidence/R2.student-input.json', sha256:sha(bundleRaw), questionCount:bundle.count, visualCount:bundle.assets.length, assets:bundle.assets},
  imageReview: {status:'ALL_REFERENCED_STUDENT_VISUALS_OPENED_AND_REVIEWED', qids:bundle.assets.map(a=>a.qid)},
  frozenAt: new Date().toISOString(), blindAnswers: answers
};
const out=path.join(root,'evidence/R2.independent-freeze.json');
fs.writeFileSync(out,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path:out,sha256:sha(fs.readFileSync(out)),studentInputSha256:record.studentInput.sha256,sourceSha256:record.source.sha256,gitBlobSha1:record.source.gitBlobSha1,qidCount:answers.length,visualCount:record.studentInput.visualCount,frozenAt:record.frozenAt}));
