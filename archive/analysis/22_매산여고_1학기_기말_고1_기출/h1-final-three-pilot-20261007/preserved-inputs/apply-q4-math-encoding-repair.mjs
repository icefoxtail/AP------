import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {createHash} from "node:crypto";
const gitBlobSha=b=>createHash("sha1").update(Buffer.concat([Buffer.from("blob "+b.length+"\\0"),b])).digest("hex");
const [root,ev,js]=process.argv.slice(2);
const h=b=>createHash("sha256").update(b).digest("hex");
const bytesBefore=fs.readFileSync(js),sourceBefore=bytesBefore.toString("utf8");
const boxBefore={window:{}};vm.runInNewContext(sourceBefore,boxBefore);
const qBefore=boxBefore.window.questionBank.find(q=>q.id===4);
const beforeContent=qBefore.content;
const qStart=sourceBefore.indexOf('"id": 4');
const qEnd=sourceBefore.indexOf('"id": 5',qStart);
if(qStart<0||qEnd<0)throw Error("Q4_SCOPE_NOT_FOUND");
let chunk=sourceBefore.slice(qStart,qEnd);
const open="&lt;보기&gt;\\n\\\\begin{aligned}";
const close="\\\\end{aligned}";
if(chunk.split(open).length!==2||chunk.split(close).length!==2)throw Error("Q4_EXACT_MARKER_CARDINALITY");
const repaired=chunk.replace(open,"&lt;보기&gt;\\n$\\\\begin{aligned}").replace(close,"\\\\end{aligned}$");
const sourceAfter=sourceBefore.slice(0,qStart)+repaired+sourceBefore.slice(qEnd);
const boxAfter={window:{}};vm.runInNewContext(sourceAfter,boxAfter);
const qAfter=boxAfter.window.questionBank.find(q=>q.id===4);
const afterContent=qAfter.content;
const erased=afterContent.replace("$\\begin{aligned}","\\begin{aligned}").replace("\\end{aligned}$","\\end{aligned}");
if(erased!==beforeContent)throw Error("SEMANTIC_CONTENT_DIFF");
for(const field of ["choices","answer","solution"])if(JSON.stringify(qBefore[field])!==JSON.stringify(qAfter[field]))throw Error("UNEXPECTED_FIELD_CHANGE:"+field);
fs.writeFileSync(js,sourceAfter,"utf8");
const bytesAfter=fs.readFileSync(js);
const evidence={
schemaVersion:"JS_ARCHIVE_CODEX_R3_ENCODING_REPAIR_V1",
runId:"h1-final-three-pilot-20261007",examUid:"22_매산여고_1학기_기말_고1_기출",qid:4,
repairType:"EXACT_MATH_DELIMITER_ENCODING",
reason:"Official Archive Engine raised EQUAL_SLOT_MATH_ERROR. MathJax saw bare aligned TeX and reported Missing \\\\end{aligned}, missing \\\\dfrac arguments, and missing \\\\left/\\\\right delimiters.",
sourcePdf:{path:"C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2022_매여고1_1기말.pdf",sha256:"a2f4bf1d1d6692b00553907b44d440fd5a72321e16edd6c33e5829a6d5b35db9",page:1},
before:{artifactRawSha256:h(bytesBefore),artifactSha:gitBlobSha(bytesBefore),content:beforeContent,contentSha256:h(Buffer.from(beforeContent,"utf8"))},
after:{artifactRawSha256:h(bytesAfter),artifactSha:gitBlobSha(bytesAfter),content:afterContent,contentSha256:h(Buffer.from(afterContent,"utf8"))},
change:{field:"questionBank[id=4].content",locus:"&lt;보기&gt; aligned block",beforePrefix:"\\begin{aligned}",afterPrefix:"$\\begin{aligned}",beforeSuffix:"\\end{aligned}",afterSuffix:"\\end{aligned}$",sourceWordsAndMathTokensPreserved:true,choicesUnchanged:true,answerUnchanged:true,solutionUnchanged:true,semanticStudentPayloadChanged:false,studentFacingEncodingChanged:true},
proof:{afterRemovingOnlyAddedMathDelimitersContentEqualsBefore:true,engineErrorLocus:"q4; actual source ref ordinal 4",pdfSourceQ4Observed:"four aligned statements inside 보기 box"},
reviewerIdentity:{role:"archive_r3",reviewerId:"/root/r3_maesan2022"}
};
const out=path.join(ev,"R3.q4-math-encoding-repair.json");
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+"\n");
console.log(JSON.stringify({js,artifactRawSha256:h(bytesAfter),artifactSha:gitBlobSha(bytesAfter),evidence:out,evidenceSha256:h(fs.readFileSync(out)),q4Content:afterContent,studentFieldsUnchanged:["choices","answer","solution"]}));

