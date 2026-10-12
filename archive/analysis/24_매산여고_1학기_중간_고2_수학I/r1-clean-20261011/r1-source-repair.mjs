import fs from 'node:fs';
import crypto from 'node:crypto';
const source='archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const bytes=fs.readFileSync(source);
const before=crypto.createHash('sha256').update(bytes).digest('hex');
let text=bytes.toString('utf8');
const replacements=[
  {qid:2,from:String.raw`a-1\ne1`,to:String.raw`a-1\\ne1`,locus:'solution logarithm-base exclusion'},
  {qid:2,from:String.raw`a\ne2`,to:String.raw`a\\ne2`,locus:'solution logarithm-base exclusion'},
  {qid:8,from:String.raw`\\cos x\ne0`,to:String.raw`\\cos x\\ne0`,locus:'solution cosine nonzero condition'}
];
const changes=[];
for(const r of replacements){const count=text.split(r.from).length-1;if(count!==1)throw new Error(`EXPECTED_ONE_EXACT_SOURCE_MATCH q${r.qid} ${r.locus} count=${count}`);text=text.replace(r.from,r.to);changes.push({qid:r.qid,locus:r.locus,exactSequenceOccurrences:count});}
fs.writeFileSync(source,text,'utf8');
const after=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
fs.writeFileSync(process.argv[2],JSON.stringify({schemaVersion:'JS_ARCHIVE_R1_SOURCE_REPAIR_V1',examUid:'24_매산여고_1학기_중간_고2_수학I',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',reason:'Runtime postfreeze disclosure showed TeX \\ne rendered as a newline followed by e in q2 and q8 solutions.',beforeRawSha256:before,afterRawSha256:after,changes},null,2)+String.fromCharCode(10));
console.log(JSON.stringify({beforeRawSha256:before,afterRawSha256:after,changes},null,2));
