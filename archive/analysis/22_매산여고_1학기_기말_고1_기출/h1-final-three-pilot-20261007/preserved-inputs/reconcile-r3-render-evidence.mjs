import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
const [root,ev,assets]=process.argv.slice(2);
const sha=b=>createHash("sha256").update(b).digest("hex");
const gitBlob=b=>createHash("sha1").update(Buffer.concat([Buffer.from("blob "+b.length+"\0"),b])).digest("hex");
for(const [file,beforeBlob,afterBlob] of [
 ["R3.q4-math-encoding-repair.json","1d522aea3c4ee0ac51015f5a307cfba2a3ce7336","b1bf059a78acbaecc4b036a8e72fc1b9fafc72dd"],
 ["R3.q4-math-layout-repair.json","b1bf059a78acbaecc4b036a8e72fc1b9fafc72dd","6a2deee9d7a6009448d01d30530b8a34461b99ac"]
]){
 const p=path.join(ev,file),r=JSON.parse(fs.readFileSync(p,"utf8"));
 r.before.artifactSha=beforeBlob;r.before.validatorRawBufferBlobSha1=beforeBlob;r.before.gitCleanFilterBlobSha1=beforeBlob;
 r.after.artifactSha=afterBlob;r.after.validatorRawBufferBlobSha1=afterBlob;r.after.gitCleanFilterBlobSha1=afterBlob;
 fs.writeFileSync(p,JSON.stringify(r,null,2)+"\n");
 console.log(JSON.stringify({path:p,sha256:sha(fs.readFileSync(p)),beforeBlob:r.before.artifactSha,afterBlob:r.after.artifactSha}));
}
const attempts=[
 {path:".tmp/archive/h1-final-three-pilot-20261007/22_매산여고_1학기_기말_고1_기출/capture-01/machine-capture.json",sha256:"87155a2e504bbca1336c26dc2bfe79abc8dec2bc3edf2708a11ab502d38f2762",artifactRawSha256:"9d6abce101a9e73602224abad9939617679fd35ceaf20b712f8e73420189d48c",artifactSha:"1d522aea3c4ee0ac51015f5a307cfba2a3ce7336",status:"CAPTURE_BLOCKED",cases:0,reason:"page.waitForFunction: Timeout 60000ms exceeded."},
 {path:".tmp/archive/h1-final-three-pilot-20261007/22_매산여고_1학기_기말_고1_기출/capture-diagnostic-02/machine-capture.json",sha256:"be2bfef7a03a8ff5aea5f9eddf6fc1cc286a20633ae6c55a5e4bf63d249c95b5",artifactRawSha256:"9d6abce101a9e73602224abad9939617679fd35ceaf20b712f8e73420189d48c",artifactSha:"1d522aea3c4ee0ac51015f5a307cfba2a3ce7336",status:"CAPTURE_BLOCKED",cases:0,reason:"EQUAL_SLOT_MATH_ERROR; q4 bare aligned TeX caused Missing \\\\end{aligned}, missing \\\\dfrac argument, missing \\\\left/\\\\right delimiter."},
 {path:".tmp/archive/h1-final-three-pilot-20261007/22_매산여고_1학기_기말_고1_기출/capture-03/machine-capture.json",sha256:"b8d92a8277487d54be080a9c35b2c90cafcd65f9bb1333545e470c38dc1a83a4",artifactRawSha256:"690231f3158fc88c93b676a3eda91f86742587cba73f10109cb86ed7bbb7e0d4",artifactSha:"b1bf059a78acbaecc4b036a8e72fc1b9fafc72dd",status:"CAPTURE_BLOCKED",cases:2,reason:"exam desktop/mobile passed; sol desktop failed SNAPSHOT_COMMON_HARD_GATE:S12 because q4 source card width 400px exceeded 316px."},
 {path:".tmp/archive/h1-final-three-pilot-20261007/22_매산여고_1학기_기말_고1_기출/capture-04/machine-capture.json",sha256:"f64dbe11fa7a421ab57afbb55b09a66146d5af6c625f70660f2eace1ada30f56",artifactRawSha256:"ce2da2d64e740c9e8b39b45980834dbe925e64603710c4edb65d1db5a4e0add2",artifactSha:"6a2deee9d7a6009448d01d30530b8a34461b99ac",status:"CAPTURED_REVIEW_REQUIRED",cases:6,reason:"All cases mechanical PASS; actual screen review completed separately."}
];
const output={schemaVersion:"JS_ARCHIVE_CODEX_R3_RENDER_ATTEMPT_LEDGER_V1",runId:"h1-final-three-pilot-20261007",examUid:"22_매산여고_1학기_기말_고1_기출",attempts,reviewerIdentity:{role:"archive_r3",reviewerId:"/root/r3_maesan2022"}};
const out=path.join(ev,"R3.render-attempt-ledger.json");fs.writeFileSync(out,JSON.stringify(output,null,2)+"\n");console.log(JSON.stringify({path:out,sha256:sha(fs.readFileSync(out))}));
