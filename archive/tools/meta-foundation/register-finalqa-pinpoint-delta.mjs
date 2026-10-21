import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const EXAM = "26_제일고_1학기_기말_고2_대수";
const SOURCE = "original/high/h2/1final/" + EXAM + ".js";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const FIELDS = new Set(["standardUnitKey", "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit", "difficultyBucket"]);
const fail = message => { throw new Error("FINALQA_PINPOINT: " + message); };
const equal = (a,b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const read = (root, p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const blobSha = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const fingerprint = q => crypto.createHash("sha256").update(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null
})).digest("hex");

export function registerFinalqaPinpointDelta({root, request, write = false, verifyProjection = false}) {
  if (request.schemaVersion !== "archive-finalqa-pinpoint-register-request-v1" ||
      request.examUid !== EXAM || request.sourceArchiveFile !== SOURCE ||
      request.requestId !== "jeil26-algebra-finalqa-20261021-01")
    fail("this registered scope accepts exactly one exam and request");
  if (request.expectedQuestionCount !== 21 || !Array.isArray(request.items) || request.items.length !== 21)
    fail("exact 21-item denominator required");
  const sourceBytes = fs.readFileSync(path.join(root,"archive/exams",SOURCE));
  const sha = blobSha(sourceBytes);
  if (sha !== request.expectedSourceBlobSha1) fail("source Git blob drift");
  const parseBank = bytes => {
    const ctx = {window:{},console:{log(){},warn(){},error(){}}};
    vm.createContext(ctx); vm.runInContext(bytes.toString("utf8"),ctx,{timeout:5000});
    return ctx.window.questionBank;
  };
  if (request.previousSourceBlobSha1 !== "bb9f516f0e4e3a9ce79c5edba20e4b1d21884931") fail("unexpected prior source reference");
  const previousBytes=execFileSync("git",["cat-file","blob",request.previousSourceBlobSha1],{cwd:root,encoding:null,maxBuffer:40*1024*1024});
  if (blobSha(previousBytes)!==request.previousSourceBlobSha1) fail("prior source blob unavailable");
  const bank = parseBank(sourceBytes), previousBank = parseBank(previousBytes);
  if (!Array.isArray(previousBank) || previousBank.length!==21) fail("prior student question denominator mismatch");
  for(let i=0;i<21;i++) for(const f of ["content","choices","answer","solution","image","solutionImage"]) {
    if (!equal(previousBank[i]?.[f],bank[i]?.[f])) fail("student field drift #" + (i+1) + "." + f);
  }
  if (!Array.isArray(bank) || bank.length !== 21) fail("actual question denominator drift");
  const doc = read(root,META);
  const ids = read(root,IDENTITY);
  const target = (doc.records||[]).filter(x=>x.sourceArchiveFile === SOURCE);
  const identity = (ids.records||[]).filter(x=>x.sourceArchiveFile === SOURCE);
  if (target.length !== 21 || identity.length !== 21) fail("sidecar/identity denominator mismatch");
  const byOrdinal = new Map(target.map(x=>[x.sourceOrdinal,x]));
  const byId = new Map(identity.map(x=>[x.sourceOrdinal,x]));
  if (byOrdinal.size!==21 || byId.size!==21) fail("duplicate source ordinal");
  const ords=new Set();
  let changed=0, changedFields=0, fingerprintRepairs=0;
  for (const item of request.items) {
    const n=item.sourceOrdinal, old=byOrdinal.get(n), id=byId.get(n), q=bank[n-1];
    if (!Number.isInteger(n) || n<1 || n>21 || ords.has(n) || !old || !id || !q || q.id!==n) fail("item ordinal mismatch");
    ords.add(n);
    if (item.questionUid!==old.questionUid || item.questionUid!==id.questionUid) fail("canonical UID mismatch #" + n);
    const currentFingerprint=fingerprint(q);
    if (old.sourceFingerprint!==currentFingerprint || id.sourceFingerprint!==currentFingerprint) {
      if (verifyProjection) fail("fingerprint materialization parity missing #" + n);
      if (old.sourceFingerprint!==id.sourceFingerprint) fail("pre-existing metadata/identity fingerprint divergence #" + n);
      old.sourceFingerprint=currentFingerprint;
      old.contentFingerprint=crypto.createHash("sha256").update(JSON.stringify({
        content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null
      })).digest("hex");
      id.sourceFingerprint=currentFingerprint;
      fingerprintRepairs++;
    }
    if (!item.before || !item.after || !Number.isInteger(item.after.difficultyBucket) ||
        item.after.difficultyBucket<1 || item.after.difficultyBucket>5)
      fail("explicit numeric bucket required #" + n);
    for (const field of Object.keys(item.after)) {
      if (!FIELDS.has(field) || !Object.hasOwn(item.before,field)) fail("unapproved or unmatched field #" + n + "." + field);
      if (Object.hasOwn(q,field) && !equal(q[field],item.after[field])) fail("source/metadata mismatch #" + n + "." + field);
      if (!verifyProjection && !equal(old[field],item.before[field])) fail("before mismatch #" + n + "." + field);
      if (verifyProjection && !equal(old[field],item.after[field])) fail("registered metadata mismatch #" + n + "." + field);
    }
    if (verifyProjection) continue;
    let touched=false;
    for (const [field,value] of Object.entries(item.after)) {
      if (!equal(old[field],value)) { old[field]=value; touched=true; changedFields++; }
    }
    if (touched) {
      old.fieldStatus={...(old.fieldStatus||{}),difficulty:"approved_final_qa"};
      if (Object.hasOwn(item.after,"subUnitKey")) old.fieldStatus.subUnit="approved_final_qa";
      old.metadataRevision="finalqa-pinpoint:jeil26-algebra-20261021-01";
      old.approvalEvidence=[...new Set([...(old.approvalEvidence||[]),request.evidencePath])];
      changed++;
    }
  }
  if (ords.size!==21) fail("21 unique ordinals required");
  if (verifyProjection) return {status:"PASS",examUid:EXAM,verifiedRows:21,sourceBlobSha:sha,consumerSidecarParity:"STATIC_SOURCE_SIDECAR_MATCH",ptTpl:"NOT_IN_SCOPE"};
  if (write && changed) {
    // The only historical fingerprint repairs are tied to this exact exam's verified
    // unchanged student fields, leaving all other identities and PT/TPL untouched.
    if (fingerprintRepairs) {
      ids.sourceCommit=execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim();
      const identityBytes=JSON.stringify(ids,null,2)+"\n";
      fs.writeFileSync(path.join(root,IDENTITY),identityBytes,"utf8");
      doc.sourceDigests={...(doc.sourceDigests||{}),identityMap:crypto.createHash("sha256").update(identityBytes).digest("hex")};
    }
    // Preserve the shared sidecar digest convention after the authorized server write.
    delete doc.digest;
    doc.digest=crypto.createHash("sha256").update(JSON.stringify(doc)).digest("hex");
    const newText=JSON.stringify(doc,null,2)+"\n";
    fs.writeFileSync(path.join(root,META),newText,"utf8");
  }
  return {status:"PASS",examUid:EXAM,write,matchedRows:21,changedRows:changed,changedFields,fingerprintRepairs,
          sourceBlobSha:sha,ptTpl:"UNTOUCHED_NOT_IN_SCOPE"};
}
