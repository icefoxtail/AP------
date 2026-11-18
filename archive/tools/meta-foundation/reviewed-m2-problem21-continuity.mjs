import { readM2Problem21CurrentUiContinuation } from "./m2-problem21-current-ui-continuity.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { validateM2ProblemRendererUiTileEvidence } from "./reviewed-m2-problem-renderer-continuity.mjs";
import { verifySvgIndexFootprint } from "./svg-index-continuity.mjs";

// A comparison view for the frozen problem-only review. This is separate from
// the three-item renderer contract and grants no semantic or solution authority.
export const M2_PROBLEM21_CONTINUITY_SCHEMA = "archive-reviewed-m2-problem21-continuity-v1";
export const M2_PROBLEM21_BINDING_SCHEMA = "archive-m2-problem21-continuity-binding-v1";
export const M2_PROBLEM21_SCOPE = "EXACT_M2_E017_15_E023_6_PROBLEM_DISPLAY";
const NATIVE_COMMIT = "c28641f67d91bfb27352b11faaef4552f46c45be";
const NATIVE_BASE = "ed83f05220b64f75cbbd5de360a68dd6ddaadd22";
const UI_COMMIT = "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7";
const E017 = "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js";
const E023 = "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js";
const EVIDENCE_DIRECTORY = "docs/operations/m2-problem21-continuity-20261116/";
const EVIDENCE = Object.freeze({
  staticRef: Object.freeze({ path: `${EVIDENCE_DIRECTORY}static-v1.json`, sha256: "035aaaf952f3a6e12f2aad2eb5b236a755e31f022b05f965e909f70ff8451822", gitBlobSha1: "d5892f559ed0005afeb52cadb4bc7fc82c03c4fc", bytes: 96598 }),
  studentUiObservedRef: Object.freeze({ path: `${EVIDENCE_DIRECTORY}student-ui-observed-v1.json`, sha256: "e975b3e2373c0b4de6a417a3f2f7db556ff211a41e69c9f3f3ebd60a3e8eac80", gitBlobSha1: "c5e399079a19d1b96f969c38274bfbdb76702d93", bytes: 26197 }),
  studentUiTechnicalRef: Object.freeze({ path: `${EVIDENCE_DIRECTORY}student-ui-technical-v1.json`, sha256: "90265ccadf9b400e99396667f5e44ec39da5a43138eaa04626e605d9b840d264", gitBlobSha1: "8e30cbebdf2518a9e307383d04d50e5a4b337e9d", bytes: 501326 }),
  q10IndependentRef: Object.freeze({ path: `${EVIDENCE_DIRECTORY}q10-independent-ui-v1.json`, sha256: "d36aa60c93c906cf93d4d9dedcf683e2a1dddc07c96c9250556d3c915be3e357", gitBlobSha1: "e394b9e32696c532ef05ec199923a1acc0500461", bytes: 2296 }),
});
const PROBLEM_FIELDS = Object.freeze(["id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType",
  "content", "question", "choices", "image", "images", "figureSvg", "layoutTag", "wide", "imageAlt", "imageCaption", "imageSize", "score"]);
const IDENTITIES = [
  ["E017-Q01", 1, "fc40513f50e6014b508eb1e8061f135682b5a065fbf336fa755918de6c97ccf7"],
  ["E017-Q02", 2, "3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9"],
  ["E017-Q03", 3, "f867386595af4f85ce29e7ce9d88ded95c6ad8c288eceb582812d0b4b8d171f7"],
  ["E017-Q04", 4, "aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b"],
  ["E017-Q05", 5, "ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490"],
  ["E017-Q07", 7, "56134964da05fe0b1f0c03da443c3f5b954bf9479a9ee8b7250ff9363f2db98d"],
  ["E017-Q08", 8, "76f0b67bec2a21754fd8f036418aae1956e62d1f19d0f60bf9acd93ba2606cc8"],
  ["E017-Q09", 9, "7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad"],
  ["E017-Q10", 10, "204dd3224ff8354e6989356a1f9151983e1bb875d1705e1aaf2d884aeafcfbc9"],
  ["E017-Q12", 12, "9a1c71c7ed648940f63646fd8f2062e131ad914bdf109362eef3aef1a880d7f2"],
  ["E017-Q17", 17, "f609573d96834aca9d5a21693e0ac6150be59ed77721e3cccc0005ed5f6e89fa"],
  ["E017-Q18", 18, "e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67"],
  ["E017-Q20", 20, "ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7"],
  ["E017-Q21", 21, "8d5adb66553e5a1bd552ef118800a9e9daa315723365055741bff1a87eafa26d"],
  ["E017-Q23", 23, "59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472"],
  ["E023-Q04", 4, "848012b5f539fa1f58a6358ff0c5aaea032b0acc9c134b9f91cba0b749a1e303"],
  ["E023-Q05", 5, "8b5f4eefcea6be04066923235f2898bf46c052a4994adbd1161554f69511b5e4"],
  ["E023-Q06", 6, "a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758"],
  ["E023-Q08", 8, "ac6ea5f6d4266e383b7db2063dbeb68348852d5420e02746ba76e62781138ede"],
  ["E023-Q10", 10, "54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9"],
  ["E023-Q19", 19, "3cd4b66acdc9f4b61132f18d6577c7cc9166137ad5135988bb892f15d3b94643"],
];
export const M2_PROBLEM21_ITEMS = Object.freeze(IDENTITIES.map(([key, sourceOrdinal, uid]) => Object.freeze({ key, sourceOrdinal,
  questionUid: `qid_v1_${uid}`, sourceArchiveFile: key.startsWith("E017") ? E017 : E023,
  expectedQuestionCount: key.startsWith("E017") ? 23 : 24,
  callerAction: key === "E017-Q02" ? "EXISTING_E017_RHS_ONLY" : "NORMALIZE_EXACT_PROBLEM_FIELDS" })));
const fail = code => { throw new Error(`M2_PROBLEM21:${code}`); };

// The reviewed derivation table identifies the existing-vector worker. It does
// not replace the current generic SVG footprint or grant new authority.
export const M2_PROBLEM21_DERIVED_SVG8_ITEMS = Object.freeze([
  {
    "key": "E017-Q04",
    "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
    "sourceOrdinal": 4,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "sourceGitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sourceSha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q4-problem-visual-v4.svg",
    "assetGitBlobSha1": "8ceb67213019d19a316f585046f4dfb2a3866770",
    "assetSha256": "536b894d4b9c78180125ec685816040271a46e8c297e4b025ba5570efbafde7c",
    "staticRecordSha256": "480c26de564d4a32fc4be4c1e80e0dfdd99450efce15c70ad913ded05ff6b465",
    "derivedRecordSha256": "a72a163f5babe53d35a96ab48dce28a0c1188e50b47b09fcf85c6893124c2118"
  },
  {
    "key": "E017-Q05",
    "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
    "sourceOrdinal": 5,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "sourceGitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sourceSha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q5-problem-visual-v4.svg",
    "assetGitBlobSha1": "28c9d60eee441984ce81ed941a477d661a556f3e",
    "assetSha256": "2c7fd8f8cbebe68fc21b52c3927382e609ae4238f5cd601ddfe6c58c9dd5a87e",
    "staticRecordSha256": "6d02ce59a84d5bbac4be9794c1055da5becb4020638a78b266871c026ef37b60",
    "derivedRecordSha256": "8eb2aeec34bb12550c0662dacc4a25b0f88022c0eebcdb3d852617edb59eb83d"
  },
  {
    "key": "E017-Q09",
    "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
    "sourceOrdinal": 9,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "sourceGitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sourceSha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q9-problem-visual-v4.svg",
    "assetGitBlobSha1": "1c2b78a81b3e5a34be0ac1a7163bbfb19ca4b85e",
    "assetSha256": "b1378acc43d6a968bade6c4b4ab15a55cfd4738252fc044857093fffe1fdff20",
    "staticRecordSha256": "5c2708c9e666bb9de014234a5777aeee8668ab5d8925a3e16b21d276b9b3c3d1",
    "derivedRecordSha256": "d48ab8301815c5182badd68ce374a27a3a1f506a2d3e829592b92726b03872cf"
  },
  {
    "key": "E017-Q18",
    "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
    "sourceOrdinal": 18,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "sourceGitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sourceSha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q18-problem-visual-v3.svg",
    "assetGitBlobSha1": "2cae8726c373f5c728f010860ae288e103982212",
    "assetSha256": "a301b3ff21f2f371ec0220600757e74b4473c5cad5f084494a233f16506ad37c",
    "staticRecordSha256": "85a2eaf5601124eaa99e1c350904d9e2850d481e60933e38cc1f0ea358f6441d",
    "derivedRecordSha256": "a4326f07972ea013fe76241e5f5646ea0aa9cc69eb2bf208348794b371689d0b"
  },
  {
    "key": "E017-Q20",
    "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
    "sourceOrdinal": 20,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "sourceGitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sourceSha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q20-problem-visual-v3.svg",
    "assetGitBlobSha1": "c1c73664336bdbdd83136ea58773b1c23b189b90",
    "assetSha256": "a156e3687d04197ee3dff3dd65710e833908432b3c3d6440b854526b57145fe6",
    "staticRecordSha256": "00bf0e4adc24f8c2f073ed782d1500d453e9819d59dd3aa80b59f7ffa193d938",
    "derivedRecordSha256": "53ebb6687d4c348b7e92b3c4adf8a4cfafcd7738c2bc7db6cf1ab01d0b94df84"
  },
  {
    "key": "E017-Q23",
    "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
    "sourceOrdinal": 23,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "sourceGitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sourceSha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q23-problem-visual-v3.svg",
    "assetGitBlobSha1": "2f865edf92807075f5ab0bb7fa36009a8b28693c",
    "assetSha256": "82f2b31b9133062ce50c6332a7668a7ce228c4bb21f6ba512103e9ad5ce94f1d",
    "staticRecordSha256": "98fd751a166ecc36c2b7a0bbc624002acdcd31834be546c00602c0e68ee87a50",
    "derivedRecordSha256": "56cf0a1077398d100fc758bb9634add014072e481dbffab6d6fbe4b0c85949be"
  },
  {
    "key": "E023-Q06",
    "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
    "sourceOrdinal": 6,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "sourceGitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
    "sourceSha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
    "assetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q6-problem-visual-v4.svg",
    "assetGitBlobSha1": "c42e846519c266ef9f30389c03e71d6f33c81d72",
    "assetSha256": "a92041578869d2121a0524f79dec4cb77d1711a59b530bbc2f1ca4e2cb860482",
    "staticRecordSha256": "e4cddc02b62ccedfcb9ff65b1ba844bd7934b3f006fd921418ab5e64953118b9",
    "derivedRecordSha256": "5aa1b61e413007f5fe9a7cdbf8fdfb6a0b5052d1777305a56fc327a0271bde59"
  },
  {
    "key": "E023-Q10",
    "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
    "sourceOrdinal": 10,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "sourceGitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
    "sourceSha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
    "assetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q10-problem-visual-v4.svg",
    "assetGitBlobSha1": "56a4c294c7dcadb0271a9b13e4222afc2a764e8f",
    "assetSha256": "ad5ef51883df950f9b12f28083921b98b87547b382edc9326365a21fdf33a3f7",
    "staticRecordSha256": "e4b7a82b8e32db870d29f36b447f15c22f3a10e039f159024d36b322e596d707",
    "derivedRecordSha256": "d189af9942d54187e6a31b2b3922b99c0cecc8a94cc66b2ed7edd81f55e23fc1"
  }
].map(row=>Object.freeze(row)));

const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blob = value => crypto.createHash("sha1").update(`blob ${value.length}\0`).update(value).digest("hex");
const keys = (value, expected) => value && typeof value === "object" && !Array.isArray(value) && same(Object.keys(value).sort(), [...expected].sort());
const projection = question => Object.fromEntries(PROBLEM_FIELDS.filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]]));
const presence = (question, field) => Object.hasOwn(question, field) ? { present: true, sha256: sha(stable(question[field])) } : { present: false };
const delta = (before, after) => PROBLEM_FIELDS.slice().sort().filter(field => !same(presence(before, field), presence(after, field)))
  .map(field => ({ field, before: presence(before, field), after: presence(after, field) }));
const refOnly = value => Object.fromEntries(["commit", "path", "gitBlobSha1", "sha256", "bytes"].map(key => [key, value[key]]));
function safe(root, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative) || /[\\\x00-\x1f\x7f]/.test(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("UNSAFE_PATH");
  const full = path.resolve(root, relative);
  for (let cursor = full; cursor !== path.resolve(root); cursor = path.dirname(cursor))
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) fail("SYMLINK_PATH");
  return full;
}
function git(ctx, args, maxBuffer = 8 * 1024 * 1024) {
  try { return execFileSync("git", args, { cwd: ctx.root, maxBuffer, stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" } }); }
  catch { fail("IMMUTABLE_GIT_INPUT_UNAVAILABLE"); }
}
function regularGitBlob(ctx, commit, relative) {
  safe(ctx.root, relative);
  const entries = git(ctx, ["ls-tree", "-z", commit, "--", relative]).toString("utf8").split("\0");
  if (entries.length !== 2 || entries[1] !== "") fail("IMMUTABLE_BLOB_MODE");
  const tab = entries[0].indexOf("\t"), header = entries[0].slice(0, tab), name = entries[0].slice(tab + 1);
  const match = /^100644 blob ([a-f0-9]{40})$/.exec(header);
  if (!match || name !== relative) fail("IMMUTABLE_BLOB_MODE");
  return match[1];
}
// Stream the two historical data snapshots rather than retaining 100 MB of
// metadata in each renderer call. The child emits digests only, never contents.
const STREAM_GIT_DIGEST = `const {spawn}=require('node:child_process'),c=require('node:crypto');
const p=spawn('git',['cat-file','blob',process.argv[1]],{stdio:['ignore','pipe','pipe']});
const h=c.createHash('sha256');let n=0;p.stdout.on('data',b=>{n+=b.length;h.update(b)});
p.stderr.resume();p.on('error',()=>process.exit(2));p.on('close',x=>{if(x!==0)process.exit(2);process.stdout.write(JSON.stringify({bytes:n,sha256:h.digest('hex')}))});`;
function immutable(ctx, ref, read = false) {
  if (!keys(ref, ["commit", "path", "gitBlobSha1", "sha256", "bytes"]) || !SHA1.test(ref.commit || "") ||
      !SHA1.test(ref.gitBlobSha1 || "") || !SHA256.test(ref.sha256 || "") || !Number.isSafeInteger(ref.bytes) || ref.bytes < 1) fail("EXACT_FIVE_KEY_REF_REQUIRED");
  safe(ctx.root, ref.path);
  const cacheKey = stable(["m2-problem21-immutable", ctx.root, ref]);
  if (!ctx.cache.has(cacheKey)) {
    if (git(ctx, ["rev-parse", "--verify", `${ref.commit}^{commit}`]).toString().trim() !== ref.commit ||
        regularGitBlob(ctx, ref.commit, ref.path) !== ref.gitBlobSha1 ||
        Number(git(ctx, ["cat-file", "-s", ref.gitBlobSha1]).toString().trim()) !== ref.bytes) fail("IMMUTABLE_REF_BINDING");
    let digest;
    if (ref.bytes > 8 * 1024 * 1024) {
      try { digest = JSON.parse(execFileSync(process.execPath, ["-e", STREAM_GIT_DIGEST, ref.gitBlobSha1], {
        cwd: ctx.root, maxBuffer: 4096, stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" } })); }
      catch { fail("IMMUTABLE_GIT_INPUT_UNAVAILABLE"); }
    } else { const bytes = git(ctx, ["cat-file", "blob", ref.gitBlobSha1]); digest = { bytes: bytes.length, sha256: sha(bytes) }; }
    if (digest.bytes !== ref.bytes || digest.sha256 !== ref.sha256) fail("IMMUTABLE_RAW_DIGEST");
    ctx.cache.set(cacheKey, true);
  }
  if (!read) return ref;
  if (ref.bytes > 8 * 1024 * 1024) fail("LARGE_CONTENT_READ_OUTSIDE_PROFILE");
  const bytes = git(ctx, ["cat-file", "blob", ref.gitBlobSha1]);
  if (bytes.length !== ref.bytes || sha(bytes) !== ref.sha256 || blob(bytes) !== ref.gitBlobSha1) fail("IMMUTABLE_RAW_DIGEST");
  return bytes;
}
// Render engine files may change after the capture; only their captured Git bytes are authenticated (user decision 2026-11-18).
const isRenderEngineFile = p => p === "archive/engine.html" || p === "archive/mixed_engine.html" || p === "apmath/wrong_print_engine.html" ||
  /^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) ||
  /^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);
function live(ctx, ref, code = "LIVE_REF_DRIFT") {
  let fd;
  try {
    fd = fs.openSync(safe(ctx.root, ref.path), "r");
    if (!fs.fstatSync(fd).isFile()) fail(code);
    const digest = crypto.createHash("sha256"), buffer = Buffer.alloc(65536); let count = 0, n;
    while ((n = fs.readSync(fd, buffer, 0, buffer.length, null))) { count += n; digest.update(buffer.subarray(0, n)); }
    if (count !== ref.bytes || digest.digest("hex") !== ref.sha256) fail(code);
  } catch (error) { if (String(error.message).startsWith("M2_PROBLEM21:")) throw error; fail(code); }
  finally { if (fd !== undefined) fs.closeSync(fd); }
}
function bindEvidence(ctx, ref) {
  const narrow = { path: ref.path, sha256: ref.sha256 };
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!Array.isArray(refs) || refs.filter(value => same(value, narrow)).length !== 1) fail("BOTH_EVIDENCE_LISTS_REQUIRED");
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail("INVALID_EVIDENCE_JSON"); } }
function source(ctx, ref, count) {
  const bytes = immutable(ctx, ref, true), bank = ctx.bankFromBytes(bytes);
  if (!Array.isArray(bank) || bank.length !== count) fail("SOURCE_DENOMINATOR");
  return { bytes, bank, ref };
}
function assetPaths(ctx, problem) {
  const paths = new Set();
  const add = value => {
    if (typeof value !== "string" || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail("PROBLEM_ASSET_PATH");
    const relative = value.startsWith("archive/") ? value : `archive/${value}`; safe(ctx.root, relative); paths.add(relative);
  };
  const explicit = value => { if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) value.forEach(explicit); else add(value); };
  explicit(problem.image); explicit(problem.images);
  if (problem.figureSvg) fail("INLINE_PROBLEM_FIGURE_OUTSIDE_PROFILE");
  const html = value => {
    if (Array.isArray(value)) return value.forEach(html);
    if (value && typeof value === "object") return Object.values(value).forEach(html);
    if (typeof value !== "string") return;
    // Q10's frozen transcription includes its original table styles. Its whole
    // problem hash has already been matched above; this permits no new style,
    // resource URL or content and does not alter the older three-item checker.
    if (/<(?:svg|object|iframe|image)\b|srcset\s*=|url\s*\(/i.test(value) ||
        /style\s*=/i.test(value) && !(ctx.request.sourceArchiveFile === E017 && ctx.patch.sourceOrdinal === 10))
      fail("UNDECLARED_PROBLEM_DEPENDENCY");
    for (const match of value.matchAll(/<img\b[^>]*>/gi)) {
      const src = match[0].match(/\bsrc\s*=\s*(["'])([^"']+)\1/i); if (!src) fail("PROBLEM_IMAGE_SRC"); add(src[2]);
    }
  };
  html(problem); return [...paths].sort();
}
function assets(ctx, problem, refs) {
  if (!Array.isArray(refs) || !same(refs.map(ref => ref.path).sort(), assetPaths(ctx, problem)) ||
      new Set(refs.map(ref => ref.path)).size !== refs.length) fail("COMPLETE_PROBLEM_ASSETS_REQUIRED");
  for (const ref of refs) { immutable(ctx, ref); live(ctx, ref, "LIVE_PROBLEM_ASSET_DRIFT"); }
}
function evidence(ctx) {
  const ref = ctx.spec.reviewRef;
  if (!keys(ref, ["path", "sha256"]) || !SHA256.test(ref.sha256 || "")) fail("EXACT_WRAPPER_REF");
  safe(ctx.root, ref.path); bindEvidence(ctx, ref);
  if (git(ctx, ["rev-parse", "--verify", `${ctx.spec.reviewCommit}^{commit}`]).toString().trim() !== ctx.spec.reviewCommit) fail("WRAPPER_BINDING");
  const raw = git(ctx, ["cat-file", "blob", regularGitBlob(ctx, ctx.spec.reviewCommit, ref.path)]);
  if (sha(raw) !== ref.sha256) fail("WRAPPER_BINDING");
  live(ctx, { ...ref, bytes: raw.length }, "LIVE_WRAPPER_DRIFT");
  const wrapper = parse(raw);
  if (!keys(wrapper, ["schemaVersion", "scope", "sourceArchiveFile", "selectedQuestionUids", ...Object.keys(EVIDENCE), "inventoryQuestions", "normalizationQuestions", "existingRouteQuestions",
      "newMathematicalQa", "newMetadataApprovals", "newDifficultyJudgments", "newReview2Claims", "sourceWrites", "rendererWrites"]) ||
      wrapper.schemaVersion !== M2_PROBLEM21_BINDING_SCHEMA || wrapper.scope !== M2_PROBLEM21_SCOPE ||
      wrapper.sourceArchiveFile !== ctx.request.sourceArchiveFile || !same(wrapper.selectedQuestionUids, M2_PROBLEM21_ITEMS
        .filter(item => item.sourceArchiveFile === ctx.request.sourceArchiveFile && item.callerAction === "NORMALIZE_EXACT_PROBLEM_FIELDS").map(item => item.questionUid)) ||
      wrapper.inventoryQuestions !== 21 || wrapper.normalizationQuestions !== 20 || wrapper.existingRouteQuestions !== 1 ||
      wrapper.newMathematicalQa !== false || ["newMetadataApprovals", "newDifficultyJudgments", "newReview2Claims", "sourceWrites", "rendererWrites"].some(key => wrapper[key] !== 0)) fail("EXACT_WRAPPER_SCOPE");
  const documents = {};
  for (const [name, expected] of Object.entries(EVIDENCE)) {
    const current = wrapper[name];
    if (!current || !same(Object.fromEntries(Object.keys(expected).map(key => [key, current[key]])), expected)) fail("FROZEN_CAPSULE_CHANGED");
    bindEvidence(ctx, current); const bytes = immutable(ctx, current, true); live(ctx, current, "LIVE_CAPSULE_DRIFT"); documents[name] = parse(bytes);
  }
  return { wrapper, documents };
}
function validateStatic(ctx, document) {
  if (document.schemaVersion !== "archive-m2-problem21-frozen-static-transport-v1" || document.scope !== M2_PROBLEM21_SCOPE ||
      document.inventoryQuestions !== 21 || document.normalizationQuestions !== 20 || document.existingRouteQuestions !== 1 ||
      !Array.isArray(document.rows) || document.rows.length !== 21 || document.sourceReviewer !== "M3S2_RELEASE" ||
      document.newMathematicalQa !== false || document.newMetadataApprovals !== 0) fail("FROZEN_STATIC_SCOPE");
  for (const item of M2_PROBLEM21_ITEMS) if (document.rows.filter(row => Object.entries(item).every(([key, value]) => row[key] === value)).length !== 1) fail("STATIC_IDENTITY_INVENTORY");
  const witness = document.rows.find(row => row.questionUid === ctx.patch.questionUid);
  const original = source(ctx, witness.nativeSourceRef, witness.expectedQuestionCount);
  const current = source(ctx, witness.currentSourceRef, witness.expectedQuestionCount);
  const n = ctx.patch.sourceOrdinal - 1, oldProblem = projection(original.bank[n]), currentProblem = projection(current.bank[n]);
  if (witness.nativeSourceRef.commit !== NATIVE_BASE || witness.currentSourceRef.commit !== UI_COMMIT ||
      witness.nativeSourceRef.path !== `archive/exams/${ctx.request.sourceArchiveFile}` || witness.currentSourceRef.path !== witness.nativeSourceRef.path ||
      sha(stable(oldProblem)) !== witness.nativeProblemSha256 || sha(stable(currentProblem)) !== witness.currentProblemSha256 ||
      !same(delta(oldProblem, currentProblem), witness.problemFieldDelta)) fail("STATIC_PROBLEM_BINDING");
  const nativeReview = parse(immutable(ctx, witness.nativeReviewRef, true)), native = ctx.native;
  if (witness.nativeReviewRef.commit !== NATIVE_COMMIT || native.spec.reviewCommit !== NATIVE_COMMIT || native.review.baseSha !== NATIVE_BASE ||
      native.spec.reviewPath !== witness.nativeReviewRef.path || native.spec.reviewRef.sha256 !== witness.nativeReviewRef.sha256 ||
      !same(native.review, nativeReview) || sha(stable(ctx.row)) !== witness.nativeItemSha256 ||
      sha(stable(nativeReview.items.find(row => row.questionUid === ctx.patch.questionUid))) !== witness.nativeItemSha256 ||
      native.sourceBlob !== witness.nativeSourceRef.gitBlobSha1 || native.committedBlob !== witness.nativeSourceRef.gitBlobSha1 ||
      git(ctx, ["rev-parse", `${NATIVE_COMMIT}:${witness.nativeSourceRef.path}`]).toString().trim() !== native.committedBlob ||
      !same(projection(native.reviewedBank[n]), oldProblem) || !same(projection(native.committedBank[n]), oldProblem)) fail("ORIGINAL_NATIVE_AUTHORITY_CHANGED");
  assets(ctx, oldProblem, witness.nativeProblemAssets); assets(ctx, currentProblem, witness.currentProblemAssets);
  if (witness.basis.kind === "EXACT_ORIGINAL_STATIC_ACCEPTANCE") {
    const reviewed = source(ctx, witness.basis.staticSourceRef, witness.expectedQuestionCount);
    if (witness.basis.staticDecision !== "NARROW_STATIC_ACCEPTABLE" || !same(projection(reviewed.bank[n]), currentProblem)) fail("ORIGINAL_STATIC_PROJECTION");
    for (const ref of witness.currentProblemAssets) immutable(ctx, { ...ref, commit: reviewed.ref.commit });
  } else if (witness.basis.kind === "EXACT_PUBLIC_REPAIR8_A2") {
    const a2 = parse(immutable(ctx, witness.basis.staticRef, true)), row = a2.rows.find(item => item.key === witness.key);
    if (!row || sha(stable(row)) !== witness.basis.staticRecordSha256 || row.staticDecision !== "ACCEPTED" ||
        a2.reviewer !== "GPT_M3S2_RELEASE" || a2.producer !== "GPT_ROOT_C8F1B0BFB4FA" || a2.reviewer === a2.producer ||
        !same(refOnly(row.newAssetRef), refOnly({ ...witness.currentProblemAssets[0], commit: row.newAssetRef.commit }))) fail("REPAIR8_STATIC_AUTHORITY");
    const before = source(ctx, row.beforeSourceRef, witness.expectedQuestionCount);
    if (sha(stable(before.bank[n])) !== row.wholeQuestionBeforeSha256 ||
        !same({ ...projection(before.bank[n]), image: currentProblem.image }, currentProblem)) fail("REPAIR8_CONTEXT_DRIFT");
    immutable(ctx, row.oldAssetRef); immutable(ctx, row.newAssetRef);
  } else fail("STATIC_NORMALIZATION_NOT_APPROVED");
  const allowed = witness.key === "E017-Q10" ? ["content", "image", "layoutTag"] : witness.key === "E017-Q05"
    ? ["image", "imageAlt", "layoutTag"] : ["image", "imageAlt", "imageSize", "layoutTag"];
  if (!same(witness.problemFieldDelta.map(row => row.field).sort(), allowed.slice().sort())) fail("OWNED_PROBLEM_FIELDS_CHANGED");
  return { witness, original, current, oldProblem, currentProblem, ownedFields: allowed };
}
const SVG_INDEX_PATH = "archive/data/svg-accessibility-index.js";
// The generated index is rebuilt by every main snapshot, so it is compared by
// the entries this question's screen consumed instead of by bytes (rules in
// svg-index-continuity.mjs). The frozen file is authenticated by its pinned
// hashes first. Every other served file keeps its exact live byte pin.
function svgIndexFootprint(ctx, ref, assetRefs) {
  verifySvgIndexFootprint({ frozenBytes: immutable(ctx, ref, true), root: ctx.root, indexPath: ref.path, assetRefs, safe, fail });
}
// Exposed so the test can corrupt the frozen-index authentication directly; the
// sealed evidence capsule cannot be edited and resealed through the public path.
export { svgIndexFootprint as verifyFrozenSvgIndexFootprint };
function validateUi(ctx, bound, current, authenticatedCurrentUi = false) {
  const { studentUiTechnicalRef: technical, studentUiObservedRef: visual, q10IndependentRef: q10 } = bound.documents;
  if (technical.schemaVersion !== "archive-m2-problem24-student-ui-preview-v1" || technical.checkoutCommit !== UI_COMMIT ||
      technical.status !== "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" || technical.executionOwner !== "GITHUB_ACTIONS_SUPPORTED_CHROME" ||
      technical.mode !== "exam" || technical.problemOnlyScreenshots !== true || technical.solutionsOpened !== false ||
      technical.sourceOverlay !== false || technical.sourceOverlayCount !== 0 || technical.sourceWrites !== 0 ||
      technical.fontTransport !== "EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS" ||
      technical.newFullMathematicalQa !== false || technical.newMetadataApprovals !== 0 || technical.newReviewPassCount !== 0 ||
      technical.expectedLogicalCases !== 48 || technical.completedLogicalCases !== 48 || technical.results?.length !== 48 ||
      technical.items?.length !== 24 || technical.screenshotArtifactCount !== 51 || technical.screenshotArtifacts?.length !== 51 ||
      technical.failures?.length !== 0 || technical.externalFontResources?.length !== 0) fail("ACTUAL_UI_48_51_REQUIRED");
  if (visual.schemaVersion !== "archive-m2-problem21-student-ui-observation-transport-v1" || visual.scope !== M2_PROBLEM21_SCOPE ||
      visual.checkoutCommit !== UI_COMMIT || visual.observer !== "m2s1_release" || visual.roleDisclosure.engineCodeAuthor !== true ||
      visual.roleDisclosure.independentMathQa !== false || visual.decision !== "DISPLAY_CONTINUITY_ACCEPTABLE" ||
      visual.inventoryQuestions !== 21 || visual.normalizationQuestions !== 20 || visual.logicalCases !== 42 || visual.originalPngs !== 45 ||
      visual.cases?.length !== 42 || visual.technicalProofRef.sha256 !== bound.wrapper.studentUiTechnicalRef.sha256 ||
      visual.q10IndependentRef.sha256 !== bound.wrapper.q10IndependentRef.sha256 || visual.newMathematicalQa !== false || visual.newMetadataApprovals !== 0) fail("ACTUAL_OBSERVATION_ROLE_OR_SCOPE");
  for (const ref of [technical.manifestRef, technical.checkerRef, technical.captureHelperRef, technical.identityRef, technical.fontLicenseRef]) {
    if (ref?.commit !== UI_COMMIT) fail("UI_CHECKOUT_REF"); immutable(ctx, ref);
  }
  const dynamic = new Set(["archive/data/question_metadata.json", ...technical.items.map(item => item.sourceRef.path)]);
  if (technical.servedFiles?.length !== 98 || new Set(technical.servedFiles.map(ref => ref.path)).size !== 98) fail("SERVED_INVENTORY");
  // Derive the consumed asset keys from what this question's evidence actually
  // displays: its captured UI assets and its frozen current problem assets.
  const indexAssetRefs = [...new Set([...current.witness.currentProblemAssets.map(ref => ref.path),
    ...technical.results.filter(row => row.questionUid === ctx.patch.questionUid).map(row => row.assetRef?.path)])]
    .filter(value => typeof value === "string").sort().map(value => ({ path: value }));
  for (const ref of technical.servedFiles) {
    if (ref.commit !== UI_COMMIT) fail("SERVED_CHECKOUT_REF"); immutable(ctx, ref);
    if (ref.path === SVG_INDEX_PATH) svgIndexFootprint(ctx, ref, indexAssetRefs);
    else if (!dynamic.has(ref.path) && !authenticatedCurrentUi && !isRenderEngineFile(ref.path)) live(ctx, ref, "LIVE_SERVED_CODE_DRIFT");
  }
  const fonts = new Map();
  for (const font of technical.studentFontResources) {
    if (font.status !== 200 || font.commit !== UI_COMMIT || !SHA256.test(font.resourceId || "") || fonts.has(font.resourceId) ||
        !["STYLESHEET", "FONT"].includes(font.kind)) fail("STUDENT_FONT_BINDING");
    immutable(ctx, refOnly(font)); if (!authenticatedCurrentUi) live(ctx, font, "LIVE_STUDENT_FONT_DRIFT"); fonts.set(font.resourceId, font);
  }
  const shots = [];
  for (const item of M2_PROBLEM21_ITEMS) for (const viewport of ["desktop", "mobile"]) {
    const results = technical.results.filter(row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal && row.viewport?.name === viewport);
    const observations = visual.cases.filter(row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal && row.viewport === viewport);
    const manifests = technical.items.filter(row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal);
    if (results.length !== 1 || observations.length !== 1 || manifests.length !== 1) fail("UI_IDENTITY_CASE_INVENTORY");
    const result = results[0], observation = observations[0], manifest = manifests[0], t = result.technical, g = result.geometry, f = t.fontReadiness;
    if (result.key !== item.key || observation.key !== item.key || manifest.key !== item.key || manifest.expectedBankCount !== item.expectedQuestionCount ||
        result.status !== "PASS" || result.visualReview !== "PENDING" || observation.decision !== "DISPLAY_CONTINUITY_ACCEPTABLE" ||
        !same(observation.screenshots, result.screenshots) || !same(result.sourceRef, manifest.sourceRef) || !same(result.assetRef, manifest.assetRef) ||
        t.mode !== "exam" || t.questions !== item.expectedQuestionCount || t.readiness !== "RENDER_READY" || t.imagesComplete !== true ||
        t.mathErrors !== 0 || t.unrenderedMath !== 0 || t.mathJaxSource !== "local" || t.solutionNodes !== 0 ||
        g.imageInsideQuestion !== true || g.naturalWidth <= 0 || g.naturalHeight <= 0 || Number(String(g.questionNumber).match(/^\d+/)?.[0]) !== item.sourceOrdinal ||
        [result.pageErrors, result.requestFailures, result.externalRequests].some(value => !Array.isArray(value) || value.length) ||
        f.status !== "loaded" || f.family !== "Nanum Myeongjo" || !same(f.weights.map(row => row.weight).sort((a, b) => a - b), [400, 700, 800]) ||
        f.weights.some(row => row.allLoaded !== true || row.checked !== true || row.loadedFaces < 1) ||
        !Array.isArray(t.fontResourceIds) || !t.fontResourceIds.length || t.fontResourceIds.some(id => !fonts.has(id))) fail("ACTUAL_UI_CASE_OR_READINESS");
    // Translate the existing display decision into the generic tile validator's
    // shape. This preserves the disclosed engine-author role; it is not a new
    // independent review. Q10 additionally requires the separate root record.
    validateM2ProblemRendererUiTileEvidence(ctx, result, { questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
      screenshots: observation.screenshots, decision: "PASS", conditionsAndLabelsPreserved: true, legible: true,
      notClipped: true, completeProblemCoverage: true }, item.key);
    shots.push(...result.screenshots);
    if (item.questionUid === ctx.patch.questionUid) {
      if (!same(result.sourceRef, current.witness.currentSourceRef) || !current.witness.currentProblemAssets.some(ref => same(ref, result.assetRef))) fail("UI_CURRENT_PROBLEM_BINDING");
    }
  }
  if (shots.length !== 45 || new Set(shots.map(shot => shot.path)).size !== 45) fail("SELECTED_ORIGINAL_PNG_INVENTORY");
  const all = technical.results.flatMap(result => result.screenshots.map(({ tileIndex, ...ref }) => ref)).sort((a, b) => a.path.localeCompare(b.path));
  if (all.length !== 51 || new Set(all.map(ref => ref.path)).size !== 51 || !same(all, technical.screenshotArtifacts.slice().sort((a, b) => a.path.localeCompare(b.path)))) fail("FULL_ORIGINAL_PNG_INVENTORY");
  const q10Item = M2_PROBLEM21_ITEMS.find(item => item.key === "E017-Q10"), q10Results = technical.results.filter(row => row.questionUid === q10Item.questionUid);
  if (q10.schemaVersion !== "root-q10-actual-student-ui-independent-v1" || q10.authorIsReviewer !== false || q10.observer !== "GPT_ROOT_C8F1B0BFB4FA" ||
      q10.commit !== UI_COMMIT || q10.questionUid !== q10Item.questionUid || q10.technicalProofSha256 !== bound.wrapper.studentUiTechnicalRef.sha256 ||
      q10.status !== "ACCEPT_ACTUAL_DISPLAY_REPAIR" || q10.observedViewports !== 2 || q10.newMathematicalQa !== 0 || q10.newMetadataApproval !== 0 || q10.newNativeAuthority !== 0 ||
      q10.images?.length !== 2 || !same(q10.images.map(row => ({ path: path.basename(row.path), sha256: row.sha256, bytes: row.bytes })).sort((a, b) => a.path.localeCompare(b.path)),
        q10Results.flatMap(row => row.screenshots.map(({ tileIndex, ...ref }) => ref)).sort((a, b) => a.path.localeCompare(b.path)))) fail("Q10_SEPARATE_ACTUAL_OBSERVER");
  return { technicalRef: bound.wrapper.studentUiTechnicalRef, observationRef: bound.wrapper.studentUiObservedRef,
    q10IndependentRef: bound.wrapper.q10IndependentRef, checkoutCommit: UI_COMMIT, logicalCases: 42, originalPngs: 45,
    fullLogicalCases: 48, fullOriginalPngs: 51, observerRoleDisclosure: visual.roleDisclosure, liveServedCodeVerified: true };
}

export function validateM2ProblemRenderer21Continuity(args) {
  const sourceReview = args.patch?.sourceReview;
  if (!sourceReview || !Object.hasOwn(sourceReview, "m2ProblemRenderer21Continuity")) return null;
  const spec = sourceReview.m2ProblemRenderer21Continuity;
  const ctx = { ...args, spec, cache: args.cache || new Map() }, { request, patch, native, row, question } = ctx;
  if (!keys(spec, ["schemaVersion", "reviewCommit", "reviewRef"]) || spec.schemaVersion !== M2_PROBLEM21_CONTINUITY_SCHEMA ||
      !SHA1.test(spec.reviewCommit || "") || request?.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.metadataReviewed !== true || request.approval.sourceRebind !== undefined || request.registrationMode !== undefined ||
      patch.rebind !== undefined || native?.review?.schemaVersion !== "m2-s2-meta-review-v1" || !SHA1.test(request.expectedSourceBlobSha1 || "") ||
      typeof ctx.bankFromBytes !== "function" || !question || !row) fail("EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT");
  const supported = M2_PROBLEM21_ITEMS.find(item => item.questionUid === patch.questionUid && item.sourceOrdinal === patch.sourceOrdinal && item.sourceArchiveFile === request.sourceArchiveFile);
  if (!supported || supported.callerAction !== "NORMALIZE_EXACT_PROBLEM_FIELDS") fail("EXACT20_ONLY_Q2_USES_EXISTING_ROUTE");
  const reviewKeys = ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "m2ProblemRenderer21Continuity"];
  if (Object.hasOwn(sourceReview, "e023SolutionDisplayContinuity")) {
    const companion = sourceReview.e023SolutionDisplayContinuity;
    if (supported.sourceArchiveFile !== E023 || !keys(companion, ["schemaVersion", "reviewCommit", "reviewRef"]) ||
        companion.schemaVersion !== "archive-m2-e023-solution-display6-continuity-v1" || !SHA1.test(companion.reviewCommit || "") ||
        !keys(companion.reviewRef, ["path", "sha256"]) || !SHA256.test(companion.reviewRef.sha256 || "")) fail("PRIVATE_COMPANION_OUTER_CONTRACT");
    safe(ctx.root, companion.reviewRef.path); reviewKeys.push("e023SolutionDisplayContinuity");
  }
  if (!keys(sourceReview, reviewKeys) || sourceReview.schemaVersion !== "archive-reviewed-source-reassessment-v1" ||
      !["schemaVersion", "reviewCommit", "reviewPath", "reviewRef"].every(key => same(sourceReview[key], native.spec?.[key]))) fail("EXACT_SOURCE_REVIEW_OPTIONS");
  if (request.expectedQuestionCount !== supported.expectedQuestionCount || row.questionUid !== patch.questionUid || row.sourceOrdinal !== patch.sourceOrdinal ||
      PROBLEM_FIELDS.some(field => Object.hasOwn(patch.after || {}, field))) fail("NATIVE_IDENTITY_OR_METADATA_ONLY_SCOPE");
  const bound = evidence(ctx), validated = validateStatic(ctx, bound.documents.staticRef);
  const originalView = readM2Problem21CurrentUiContinuation({context:ctx.m2Problem21CurrentUiContinuation,
    root:ctx.root,request,patch,current:ctx.final,question,relativePath:validated.current.ref.path});
  // Old 48/51, all original static authority and Q10's separate observer remain
  // mandatory. The private token already checked fresh full 16/18 evidence and
  // its actual live code/font closure before choosing these current live checks.
  const ui = validateUi(ctx, bound, validated, originalView !== null);
  let bytes;
  try { bytes = originalView ?? fs.readFileSync(safe(ctx.root, validated.current.ref.path)); } catch { fail("LIVE_SOURCE_UNAVAILABLE"); }
  if (blob(bytes) !== request.expectedSourceBlobSha1) fail("LIVE_SOURCE_CAS");
  const bank = ctx.bankFromBytes(bytes), n = patch.sourceOrdinal - 1;
  if (!Array.isArray(bank) || bank.length !== request.expectedQuestionCount || !same(projection(bank[n]), projection(question))) fail("LIVE_ARGUMENT_OR_DENOMINATOR");
  // Metadata/solution authority remains with its ordinary validator. This
  // module checks only problem projections, including every nonselected row.
  if (bank.some((item, index) => !same(projection(item), projection(validated.current.bank[index])))) fail("LIVE_PROBLEM_BANK_DRIFT");
  if (sha(stable(projection(question))) !== validated.witness.currentProblemSha256) fail("LIVE_SELECTED_PROBLEM_DRIFT");
  const normalizedQuestion = { ...question };
  for (const field of validated.ownedFields) {
    if (Object.hasOwn(validated.oldProblem, field)) normalizedQuestion[field] = structuredClone(validated.oldProblem[field]);
    else delete normalizedQuestion[field];
  }
  if (!same(projection(normalizedQuestion), validated.oldProblem)) fail("NORMALIZED_PROBLEM_NOT_NATIVE");
  const normalizedPatch = { ...patch, sourceReview: { ...patch.sourceReview } };
  delete normalizedPatch.sourceReview.m2ProblemRenderer21Continuity;
  return { normalizedQuestion, normalizedPatch, normalizedProblemFields: [...validated.ownedFields], proof: {
    schemaVersion: M2_PROBLEM21_CONTINUITY_SCHEMA, scope: M2_PROBLEM21_SCOPE, questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
    sourceArchiveFile: request.sourceArchiveFile, reviewCommit: spec.reviewCommit, reviewRef: spec.reviewRef,
    staticRef: bound.wrapper.staticRef, nativeReviewRef: validated.witness.nativeReviewRef, nativeItemSha256: validated.witness.nativeItemSha256,
    nativeSourceRef: validated.witness.nativeSourceRef, currentSourceRef: validated.witness.currentSourceRef,
    normalizedProblemFields: [...validated.ownedFields], problemFieldDelta: validated.witness.problemFieldDelta,
    originalProblemSha256: validated.witness.nativeProblemSha256, currentProblemSha256: validated.witness.currentProblemSha256,
    liveSourceBlobSha1: blob(bytes), liveSourceSha256: sha(bytes), ui, memoryOnlyNormalization: true,
    requiresOrdinaryNativeValidation: true, requiresSeparateSolutionContinuity: validated.witness.requiresSeparateSolutionContinuity,
    newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReview2Claims: 0, sourceWrites: 0, rendererWrites: 0,
  } };
}
