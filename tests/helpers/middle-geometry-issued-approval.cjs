// Test-only observer. It never authorizes current metadata production or source release.
// f9e49a0 is the completed actual writer 43988393301. This fixed issued snapshot
// authenticates retention; the original Native and planQuestion still own current reuse.
"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const SvgIndexContinuity = require("../../tools/4slot/existing-vector-svg-index-continuity.cjs");
const ExistingVectorUi = require("../../tools/4slot/existing-registered-vector-ui.cjs");
const SVG_INDEX = "archive/data/svg-accessibility-index.js";
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const ACTIVE_INDEX = "archive/data/meta-foundation/canonical/registry_index.json";
const FAMILY3_UIDS = Object.freeze([
  "qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd",
  "qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942",
  "qid_v1_9a0686ad7215cc2afff66c158131fd343a64bd2111f30341df6b8383aaba1b7c"
]);
// Historical MD/ID are authenticated as streams; no old database is installed
// over the current selected rows. Only immutable digests may be memoized.
const STREAM_GIT_PINS = `const {spawn}=require("node:child_process"),c=require("node:crypto");
const expected=Number(process.argv[2]),s256=c.createHash("sha256"),s1=c.createHash("sha1");
s1.update("blob "+expected+String.fromCharCode(0));let n=0;
const p=spawn("git",["cat-file","blob",process.argv[1]],{stdio:["ignore","pipe","pipe"]});
p.stdout.on("data",b=>{n+=b.length;s256.update(b);s1.update(b)});p.stderr.resume();
p.on("error",()=>process.exit(2));p.on("close",code=>{if(code!==0||n!==expected)process.exit(2);
process.stdout.write(JSON.stringify({gitBlobSha1:s1.digest("hex"),sha256:s256.digest("hex"),bytes:n}))});`;
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const UID = /^qid_v1_[a-f0-9]{64}$/;
const same = (a, b) => stable(a) === stable(b);
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const pins = bytes => ({ gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length });

const OBSERVATION = Object.freeze({
  "anchor": "f9e49a0e0c18f18c63f31d7547bd504f07a821c6",
  "observed": "735596ae7fdf37e920569271def0c2bc4add6f86",
  "served": [
    {
      "path": "archive/engine.html",
      "before": {
        "gitBlobSha1": "905952ae39138e1f6dc0aa2d7c7c8a64403f527b",
        "sha256": "a963c562478b96f7f9d8ae09ad6e5c85b3262296d734e7abd001836e1c3f317b",
        "bytes": 201060
      },
      "after": {
        "gitBlobSha1": "226342544e896cd6a6f35aa946947b89ef3c893e",
        "sha256": "671f89999fe07b0f5695bb088ef9d262d7d2da95947689117241bb6f3b633ce5",
        "bytes": 196085
      }
    },
    {
      "path": "archive/screen-runtime-adapter.js",
      "before": {
        "gitBlobSha1": "3d8f3159934c99637c4df893649adbc331065d96",
        "sha256": "2834bd3d0f3b40264921e15a85840df3d2374c7fcc6158844ce12883fb7cdd93",
        "bytes": 52980
      },
      "after": {
        "gitBlobSha1": "fb0ee7afc7eed48b30975874c5536eb283f308c9",
        "sha256": "ed0b267dc3b27675c2c0ed0aa985991a0aad3d3863ce5bcd43f0acb28033d709",
        "bytes": 53393
      }
    },
    {
      "path": "archive/render-feedback.js",
      "before": {
        "gitBlobSha1": "d1dd28351e42c887269744fa127f5979b81f213c",
        "sha256": "a55be90c452de08090ba648c1e8150f6fdecbfc9e10a9bd2e1ed59ccad727052",
        "bytes": 7419
      },
      "after": {
        "gitBlobSha1": "bba4a0a028b08260de01ae66a936dd9b77a849af",
        "sha256": "324177edefdcb996b4717a7853fc8bd542ac98098e3c6b8eabd42124eb424631",
        "bytes": 7461
      }
    },
    {
      "path": "archive/css/js-archive-theme-override.css",
      "before": {
        "gitBlobSha1": "930e73b8d48bb793d5ec4cc7effabd6eef40dd4f",
        "sha256": "4dfc5092355c90859e75f62a0fb0d7bf150c54202ce51d2cb5a48951adb2b7a2",
        "bytes": 15557
      },
      "after": {
        "gitBlobSha1": "5e168d7e3753639e8a0b92753b0797bef0d9d3e2",
        "sha256": "205a1d456fc21ee150550a61f1959b027a4fcd22f20e623471b637481b4702a4",
        "bytes": 13947
      }
    },
    {
      "path": "archive/archive2-reader-controls.css",
      "before": {
        "gitBlobSha1": "66a223f9e2c737a4caa0bd9b2fd0710ad5b4ee49",
        "sha256": "24631292b2c7a8831fd6cb01de7eb4662d2c69d3c6542d380a5abaa0c43bafe3",
        "bytes": 3687
      },
      "after": {
        "gitBlobSha1": "8bbb2202ba3d8c04aa6f7867031fbbebff0c511d",
        "sha256": "5e53a4a96dcf8e1e08eb8e55096ef61299946269aa8d3b33b4d35ad604c022eb",
        "bytes": 4905
      }
    }
  ],
  "source": {
    "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "before": {
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "after": {
      "gitBlobSha1": "2b9a077f00f0fc3ec6ee5c03ae5037076ecf88cb",
      "sha256": "11b02d6fd4916e30dbbcd0f98b0386388f44d9980d76b8c02bf5047058f529ae",
      "bytes": 66844
    }
  }
});

const SOURCE_ONLY = Object.freeze({
  "schemaVersion": "EXACT_E017_Q11_Q15_SOURCE_PRESERVATION",
  "source": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
  "expectedQuestionCount": 23,
  "child": {
    "requestId": "m2s2-image8-source-preservation-20261116-01-e017-finalqa2",
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-image8-source-preservation-20261116-01-e017-finalqa2.json",
    "bytes": 17192,
    "sha256": "dde6864582f6718194bc698ec662ed2fe38431820357ccc70fea5b59978790b5",
    "gitBlobSha1": "604545637d955a2fe5ad32efcd441bfe2cbf9a66"
  },
  "prior": {
    "requestId": "m2s2-native78-current-r9-20261116-20-e017",
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-native78-current-r9-20261116-20-e017.json",
    "bytes": 22923,
    "sha256": "ebaebf777097b20355ae68591a49f91fb80844001fb9904f865c19b358c2c56a",
    "gitBlobSha1": "b12b32003ee71b63ddbdc2fb86ba2523ed4a53fd"
  },
  "priorSource": {
    "gitBlobSha1": "05cf74896963b16a7e6ecb4c0a9e0cfafb604a76",
    "sha256": "f881c6bb1a663ba2a48959234b4e4718e688cbecf67a51bc540b4f95bf0ea353",
    "bytes": 66605
  },
  "subjects": [
    {
      "questionUid": "qid_v1_061f56b801d84fca7fb2dccabc0f36cd424db51a71705aaf9907bbe01c0206a4",
      "sourceOrdinal": 11
    },
    {
      "questionUid": "qid_v1_4ad4963857cd28e9d6dc520af77e1d6ef455036cb0da5de3f01f20341805078a",
      "sourceOrdinal": 15
    }
  ],
  "changedSourceOrdinal": 2,
  "changedSourceFields": [
    "image",
    "imageAlt",
    "imageSize",
    "layoutTag"
  ],
  "currentRejection": "NATIVE_SOURCE_PRESERVATION_REVALIDATION_FAILED"
});

// These later source bytes are an observed blocking condition, never a source
// approval. The exact edition and the complete changed-field inventory are fixed.
const SOURCE_EDITION_2372 = Object.freeze({
  "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
  "pins": {
    "bytes": 66857,
    "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
    "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f"
  },
  "changes": [
    {
      "sourceOrdinal": 2,
      "fields": [
        "image",
        "imageAlt",
        "imageSize",
        "layoutTag"
      ]
    },
    {
      "sourceOrdinal": 6,
      "fields": [
        "content"
      ]
    },
    {
      "sourceOrdinal": 17,
      "fields": [
        "solution"
      ]
    }
  ]
});

const RHS_ONLY = Object.freeze({
  "schemaVersion": "EXACT_E017_Q2_ISSUED_RHS_SOURCE_BLOCK",
  "questionUid": "qid_v1_3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9",
  "sourceOrdinal": 2,
  "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
  "expectedQuestionCount": 23,
  "requestId": "m2s2-display21-current626-e017-existing-rhs1-20261116",
  "requestSha256": "fb902c9c631d8cfcc848dd544ebfb3fad6371534c71eb36d3431b8411bb1c176",
  "receipt": {
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-existing-rhs1-20261116.json",
    "bytes": 26178,
    "sha256": "5aa6d34e837537778e9f228f889f512658abc7f2cdfe5e7cf6deaae5b67ca740",
    "gitBlobSha1": "310ad0cb7f1ccbba4835c961360941661513181c"
  },
  "sourceBinding": {
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-existing-rhs1-20261116.source-review-binding.json",
    "bytes": 9069,
    "sha256": "b5586ffc169d8309a7e1fd917b8ccebe1d3cbc45512abd68b08c75551b6859a3",
    "gitBlobSha1": "b0f2b4244e08e3cc9b561f1a73e51f9517fcb273"
  },
  "reviewBinding": {
    "commit": "3f7430d37ca2257ede52175baa94c160c0125f7a",
    "path": "docs/operations/m2-e017-rhs-continuity-20261116/final-ui-binding-r1.json",
    "bytes": 6009,
    "sha256": "12084de0ea2681bb6cf78a6ec6f60b00eb79fa6605b9b48dbf7dc8a1003dcb6d",
    "gitBlobSha1": "6235ee120366c52d2e6035dfba8a9431a5104fca"
  },
  "nativeSourceRef": {
    "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
    "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "bytes": 40638,
    "sha256": "ec693aa011e6a82f41c63f640666d061c2751a972abfb730ca91e954565ad9c3",
    "gitBlobSha1": "6a96cbd5c2671c61a63b0e964777ec6d6ac3369d"
  },
  "sourceReviewSha256": "cecf291e5adf9ccb8fc84a1539620a997db3882c3bab167fd3e74ae7d17a04bd",
  "typedProofSha256": "010cd67a316b38b058aee0949f6cea26e55dda4b964b14aacd9547e79445bde5"
});

const PROOF_KINDS = Object.freeze([
  ["m2ProblemRenderer21Continuity", "archive-reviewed-m2-problem21-continuity-v1", "archive-m2-problem24-student-ui-preview-v1"],
  ["m2Family3ProblemContinuity", "archive-m2-family3-problem-continuity-v1", "archive-m2-problem24-student-ui-preview-v1"],
  ["q5CompleteGivenApplication", "archive-m3-e052-q5-complete-given-application-v1", "archive-m3-e052-q5-student-ui-preview-v1"]
]);
function relativePath(value) {
  assert(typeof value === "string" && value.length > 0 && value.length < 800 &&
    !path.isAbsolute(value) && !/[\u0000-\u001f\\]/.test(value) &&
    value.split("/").every(part => part && part !== "." && part !== ".."), "ISSUED_RETENTION:PATH");
  return value;
}
function regularRead(root, relative) {
  const base = fs.realpathSync(root);
  let current = base;
  const parts = relativePath(relative).split("/");
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const stat = fs.lstatSync(current);
    assert(!stat.isSymbolicLink() && (i === parts.length - 1 ? stat.isFile() : stat.isDirectory()),
      "ISSUED_RETENTION:REGULAR_PATH:" + relative);
  }
  assert(current.startsWith(base + path.sep), "ISSUED_RETENTION:PATH_ESCAPE");
  return fs.readFileSync(current);
}
function single(rows, predicate, label) {
  assert(Array.isArray(rows), label);
  const matches = rows.filter(predicate);
  assert.strictEqual(matches.length, 1, label);
  return matches[0];
}
function uniqueRows(rows, label) {
  assert(Array.isArray(rows) && rows.length > 0, label);
  const byUid = new Map(), joins = new Set();
  for (const row of rows) {
    assert(UID.test(row.questionUid) && typeof row.sourceArchiveFile === "string" &&
      Number.isSafeInteger(row.sourceOrdinal) && row.sourceOrdinal > 0, label);
    const join = row.sourceArchiveFile + "#" + row.sourceOrdinal;
    assert(!byUid.has(row.questionUid) && !joins.has(join), label + ": duplicate UID/source");
    byUid.set(row.questionUid, row); joins.add(join);
  }
  return byUid;
}
function assertOriginalNativeSourceBytes(raw, prior) {
  assert(prior && prior.sourceBlobSha1 === SOURCE_ONLY.priorSource.gitBlobSha1 &&
    prior.sourceRawSha256 === SOURCE_ONLY.priorSource.sha256, "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_REF");
  assert(Buffer.isBuffer(raw), "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_BYTES");
  assert.deepStrictEqual(pins(raw), SOURCE_ONLY.priorSource, "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_BYTES");
  return raw;
}
function readOriginalNativeSource(root, prior) {
  assert(prior && prior.sourceBlobSha1 === SOURCE_ONLY.priorSource.gitBlobSha1 &&
    prior.sourceRawSha256 === SOURCE_ONLY.priorSource.sha256, "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_REF");
  // This is the original immutable input consumed by source preservation.
  // Re-read its object in the caller's Git context; the child-source refusal
  // occurs earlier in Native and cannot establish that this object is present.
  const raw = execFileSync("git", ["cat-file", "blob", SOURCE_ONLY.priorSource.gitBlobSha1], {
    cwd: root, maxBuffer: 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  return assertOriginalNativeSourceBytes(raw, prior);
}
function assertRhsOriginalNativeSourceBytes(raw) {
  assert(Buffer.isBuffer(raw), "ISSUED_RETENTION:RHS_ORIGINAL_SOURCE_BYTES");
  const ref = RHS_ONLY.nativeSourceRef;
  assert.deepStrictEqual(pins(raw), { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes },
    "ISSUED_RETENTION:RHS_ORIGINAL_SOURCE_BYTES");
  return raw;
}
function readRhsOriginalNativeSource(root) {
  const ref = RHS_ONLY.nativeSourceRef;
  const options = { cwd: root, maxBuffer: 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"] };
  // Re-read the original required source in this caller's Git object context.
  // The current whole-source refusal occurs before Native reaches this input.
  const entry = execFileSync("git", ["--literal-pathspecs", "ls-tree", "-z", ref.commit, "--", ref.path], options).toString("utf8");
  assert.strictEqual(entry, "100644 blob " + ref.gitBlobSha1 + "\t" + ref.path + "\0",
    "ISSUED_RETENTION:RHS_ORIGINAL_SOURCE_PATH");
  return assertRhsOriginalNativeSourceBytes(execFileSync("git", ["cat-file", "blob", ref.gitBlobSha1], options));
}
function createIssuedApprovalObserver(api) {
  const immutableCache = new Map(), ancestorCache = new Set();
  const git = (root, args) => execFileSync("git", args, {
    cwd: root, maxBuffer: 16 * 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  function ancestor(root, commit) {
    const head = git(root, ["rev-parse", "HEAD"]).toString("utf8").trim();
    assert(SHA1.test(head) && SHA1.test(commit), "ISSUED_RETENTION:COMMIT");
    const key = fs.realpathSync(root) + ":" + head + ":" + commit;
    if (!ancestorCache.has(key)) {
      git(root, ["merge-base", "--is-ancestor", commit, head]);
      ancestorCache.add(key);
    }
    return head;
  }
  function immutable(root, commit, relative) {
    relativePath(relative); assert(SHA1.test(commit), "ISSUED_RETENTION:IMMUTABLE_COMMIT");
    const key = commit + ":" + relative;
    if (!immutableCache.has(key)) {
      const entry = git(root, ["--literal-pathspecs", "ls-tree", "-z", commit, "--", relative]).toString("utf8");
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      assert(match && match[3] === relative, "ISSUED_RETENTION:GIT_REGULAR_FILE:" + relative);
      const raw = git(root, ["cat-file", "blob", match[2]]);
      assert.strictEqual(blob(raw), match[2], "ISSUED_RETENTION:GIT_BLOB:" + relative);
      immutableCache.set(key, raw);
    }
    return immutableCache.get(key);
  }
  function boundImmutable(root, ref) {
    assert(ref && SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) &&
      SHA256.test(ref.sha256) && Number.isSafeInteger(ref.bytes) && ref.bytes > 0,
      "ISSUED_RETENTION:IMMUTABLE_REF");
    const raw = immutable(root, ref.commit, ref.path);
    assert.deepStrictEqual(pins(raw), { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes },
      "ISSUED_RETENTION:IMMUTABLE_REF_BYTES:" + ref.path);
    return raw;
  }

  const authenticatedRefs = new Set();
  function authenticateRef(root, ref) {
    assert(ref && SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) &&
      SHA256.test(ref.sha256) && Number.isSafeInteger(ref.bytes) &&
      ref.bytes > 0 && ref.bytes <= 128 * 1024 * 1024, "ISSUED_RETENTION:IMMUTABLE_REF");
    const relative = relativePath(ref.path), key = stable([ref.commit, relative, ref.gitBlobSha1, ref.sha256, ref.bytes]);
    if (authenticatedRefs.has(key)) return;
    if (ref.bytes <= 8 * 1024 * 1024) boundImmutable(root, ref);
    else {
      const entry = git(root, ["--literal-pathspecs", "ls-tree", "-z", ref.commit, "--", relative]).toString("utf8");
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      assert(match && match[2] === ref.gitBlobSha1 && match[3] === relative, "ISSUED_RETENTION:GIT_REGULAR_LARGE_REF");
      const actual = JSON.parse(execFileSync(process.execPath,
        ["-e", STREAM_GIT_PINS, ref.gitBlobSha1, String(ref.bytes)], {
          cwd: root, timeout: 30000, maxBuffer: 4096, stdio: ["ignore", "pipe", "pipe"],
          env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" }
        }).toString("utf8"));
      assert.deepStrictEqual(actual, { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes },
        "ISSUED_RETENTION:IMMUTABLE_LARGE_REF_BYTES");
    }
    authenticatedRefs.add(key);
  }
  function assertObservedSourceEdition(root, relative, issued, actual, label) {
    assert.strictEqual(relative, OBSERVATION.source.path, label + ": unknown source change");
    assert.deepStrictEqual(pins(issued), OBSERVATION.source.before, label + ": known source before");
    const editions = [
      { commit: OBSERVATION.observed, pins: OBSERVATION.source.after,
        changes: [{ sourceOrdinal: SOURCE_ONLY.changedSourceOrdinal, fields: SOURCE_ONLY.changedSourceFields }] },
      SOURCE_EDITION_2372
    ];
    const edition = single(editions, value => same(value.pins, pins(actual)), label + ": unobserved source edition");
    const head = ancestor(root, edition.commit);
    assert(actual.equals(immutable(root, edition.commit, relative)) && actual.equals(immutable(root, head, relative)),
      label + ": exact observed source and current HEAD bytes");
    const beforeBank = api.loadBank(issued.toString("utf8"), relative);
    const currentBank = api.loadBank(actual.toString("utf8"), relative);
    assert.strictEqual(beforeBank.length, SOURCE_ONLY.expectedQuestionCount, label);
    assert.strictEqual(currentBank.length, SOURCE_ONLY.expectedQuestionCount, label);
    const changes = beforeBank.map((before, index) => {
      const after = currentBank[index];
      if (same(before, after)) return null;
      return { sourceOrdinal: index + 1, fields: [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .filter(field => !same(before[field], after[field])).sort() };
    }).filter(Boolean);
    assert.deepStrictEqual(changes, edition.changes, label + ": exact known source field inventory");
    return { commit: edition.commit, pins: edition.pins, changes, beforeBank, currentBank };
  }
  function assertRetained(input, label) {
    const { current, identity, source, ordinal, question, previous, registry, runtimeOwner, nativeSource } = input;
    const row = nativeSource?.runtimeRecord, root = nativeSource?.root;
    assert(root && current && identity && row && registry?.status === "ACTIVE", label + ": retained inputs");
    ancestor(root, OBSERVATION.anchor);
    assert(UID.test(current.questionUid) && current.questionUid === identity.questionUid &&
      current.questionUid === row.questionUid, label + ": retained UID");
    for (const value of [current, identity, row])
      assert(value.sourceArchiveFile === source && value.sourceOrdinal === ordinal, label + ": retained join");
    assert(Number.isSafeInteger(ordinal) && ordinal > 0, label + ": retained ordinal");
    const uniqueIdentity = single(nativeSource.identityMap?.records, value => value.questionUid === identity.questionUid,
      label + ": identity UID must be globally unique");
    assert.deepStrictEqual(uniqueIdentity, identity, label);
    assert.strictEqual(single(nativeSource.identityMap.records,
      value => value.sourceArchiveFile === source && value.sourceOrdinal === ordinal, label + ": identity join").questionUid,
      identity.questionUid, label);
    assert.deepStrictEqual(nativeSource.identityByJoin?.get(source + "#" + ordinal), identity, label);
    if (identity.status) assert.strictEqual(identity.status, "VERIFIED", label);
    assert.strictEqual(nativeSource.runtimeStatus, "ACTIVE", label);
    assert.strictEqual(current.metaFoundationStatus, "ACTIVE", label);
    assert.strictEqual(current.metaFoundationPackId, runtimeOwner, label);
    assert.strictEqual(row.metaFoundationPackId, runtimeOwner, label);
    assert.notStrictEqual(current.metadataStatus, "SOURCE_HOLD", label);
    assert(["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType), label + ": retained approval kind");
    assert.strictEqual(current.sourceFingerprint, identity.sourceFingerprint, label);
    assert.strictEqual(row.sourceFingerprint, identity.sourceFingerprint, label);
    assert.strictEqual(row.approvedSourceFingerprint, identity.sourceFingerprint, label);
    assert.strictEqual(String(current.sourceQuestionNo), String(identity.sourceQuestionNo), label);
    assert(Array.isArray(nativeSource.bank) && Buffer.isBuffer(nativeSource.bytes), label);
    assert.deepStrictEqual(nativeSource.bank[ordinal - 1], question, label + ": current bank binding");
    assert.deepStrictEqual(previous, question, label + ": read-only current-input probe");
    assert.strictEqual(blob(nativeSource.bytes), nativeSource.blobSha1, label + ": current source blob");
    assert.strictEqual(String(row.sourceQuestionNo), String(question.sourceQuestionNo ?? question.id ?? ""), label);
    if (question.questionUid && question.questionUid !== identity.questionUid)
      assert(api.isUnambiguousLegacySourceUidAlias({ question, sourceArchiveFile: source, sourceOrdinal: ordinal,
        identityRecord: identity, identityMap: nativeSource.identityMap, bank: nativeSource.bank }), label);
    const classification = Object.fromEntries([
      "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
      "standardUnitKey", "subUnitKey", "sourceArchiveFile"
    ].map(key => [key, current[key]]));
    const check = api.validateActiveMetaFields(classification, registry, { requireFields: false });
    assert.strictEqual(check.status, "VALIDATED", label + ": retained ACTIVE classification");
    assert.strictEqual(check.activeBinding, true, label);
    const context = api.activeBindingContext({ candidate: current, check, registry, runtimeOwner });
    assert(!context.reason && context.ownerPack === runtimeOwner, label + ": retained ACTIVE owner");
    const prefix = "meta-foundation:" + runtimeOwner + "@" + current.metaFoundationPackVersion +
      ":exam-" + current.metadataApprovalType.toLowerCase() + "-v2:";
    assert(typeof current.metadataRevision === "string" && current.metadataRevision.startsWith(prefix), label);
    const requestId = current.metadataRevision.slice(prefix.length);
    assert(/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId), label);
    const receiptPath = RECEIPTS + requestId + ".json", readPaths = new Set();
    const live = relative => { readPaths.add(relative); return regularRead(root, relative); };
    assert(current.approvalEvidence?.includes(receiptPath) && row.approvalEvidence?.includes(receiptPath), label);
    const issuedBytes = immutable(root, OBSERVATION.anchor, receiptPath);
    assert(live(receiptPath).equals(issuedBytes), label + ": current receipt must equal issued anchor bytes");
    const receipt = JSON.parse(issuedBytes);
    assert(receipt.schemaVersion === "archive-reviewed-exam-meta-registration-v2" &&
      receipt.metadataRegistrationStatus === "REGISTERED" && receipt.requestId === requestId &&
      SHA256.test(receipt.requestSha256) && receipt.sourceArchiveFile === source &&
      SHA1.test(receipt.sourceBlobSha1) && SHA256.test(receipt.sourceRawSha256), label + ": issued receipt");
    assert.strictEqual(receipt.approval?.type, current.metadataApprovalType, label);
    assert.strictEqual(receipt.approval.metadataReviewed, true, label);
    assert(typeof receipt.approval.approvedBy === "string" && receipt.approval.approvedBy.trim(), label);
    if (receipt.approval.type === "REVIEW2") assert.strictEqual(receipt.approval.reviewPassCount, 2, label);
    const issuedMaps = [receipt.appliedRecords, receipt.appliedIdentityRecords, receipt.runtimeRecords]
      .map((records, i) => uniqueRows(records, label + ": issued inventory " + i));
    const uids = [...issuedMaps[0].keys()].sort();
    for (const records of issuedMaps) {
      assert.deepStrictEqual([...records.keys()].sort(), uids, label + ": issued inventory UID set");
      for (const value of records.values())
        assert(value.sourceArchiveFile === source && value.sourceOrdinal === issuedMaps[0].get(value.questionUid).sourceOrdinal,
          label + ": issued inventory source/ordinal");
    }
    assert.strictEqual(receipt.totalQuestions, uids.length, label);
    if (receipt.scope === "PARTIAL_UIDS") assert.strictEqual(receipt.partialUidCount, uids.length, label);
    assert.deepStrictEqual(issuedMaps[0].get(current.questionUid), current, label + ": retained metadata whole row");
    assert.deepStrictEqual(issuedMaps[1].get(current.questionUid), identity, label + ": retained identity whole row");
    assert.deepStrictEqual(issuedMaps[2].get(current.questionUid), row, label + ": retained runtime whole row");
    assert.deepStrictEqual(current.fieldStatus, row.fieldStatus, label);
    assert.strictEqual(current.metadataApprovalType, row.metadataApprovalType, label);
    const evidence = receipt.approval.evidenceRefs, seenEvidence = new Set();
    assert(Array.isArray(evidence) && evidence.length > 0, label + ": evidence inventory");
    for (const ref of evidence) {
      assert(ref && SHA256.test(ref.sha256) && !seenEvidence.has(relativePath(ref.path)), label + ": evidence ref");
      seenEvidence.add(ref.path);
      const raw = immutable(root, OBSERVATION.anchor, ref.path);
      assert.strictEqual(sha(raw), ref.sha256, label + ": issued evidence digest");
      assert(live(ref.path).equals(raw), label + ": current evidence bytes");
    }
    const sourceOnly = requestId === SOURCE_ONLY.child.requestId;
    let bindingPath = null, patch = null;
    if (sourceOnly) {
      assert.strictEqual(receiptPath, SOURCE_ONLY.child.path, label + ": closed source receipt path");
      assert.deepStrictEqual(pins(issuedBytes), pinsOnly(SOURCE_ONLY.child), label + ": closed issued source receipt");
      assert(source === SOURCE_ONLY.source && SOURCE_ONLY.subjects.some(value =>
        value.questionUid === current.questionUid && value.sourceOrdinal === ordinal), label + ": closed source target");
    } else {
      bindingPath = RECEIPTS + requestId + ".source-review-binding.json";
      const digest = single(receipt.outputDigests, ref => ref.path === bindingPath, label + ": source-review output");
      assert(SHA256.test(digest.sha256) && current.approvalEvidence.includes(bindingPath) &&
        row.approvalEvidence.includes(bindingPath), label + ": typed provenance");
      const bindingBytes = immutable(root, OBSERVATION.anchor, bindingPath);
      assert.strictEqual(sha(bindingBytes), digest.sha256, label + ": issued binding digest");
      assert(live(bindingPath).equals(bindingBytes), label + ": current binding bytes");
      const binding = JSON.parse(bindingBytes), request = binding.requestSnapshot;
      assert(binding.schemaVersion === "archive-reviewed-source-binding-v1" && binding.requestId === requestId &&
        request?.requestId === requestId && request.sourceArchiveFile === source, label + ": typed binding");
      assert.deepStrictEqual(request.approval, receipt.approval, label);
      patch = single(request.items, value => value.questionUid === current.questionUid && value.sourceOrdinal === ordinal,
        label + ": issued typed request target");
      assert(patch.sourceReview?.schemaVersion === "archive-reviewed-source-reassessment-v1", label);

      assert(Array.isArray(patch.evidenceRefs) && patch.evidenceRefs.length > 0, label + ": selected evidence inventory");
      const selectedEvidence = new Set();
      for (const ref of patch.evidenceRefs) {
        assert(ref && SHA256.test(ref.sha256) && !selectedEvidence.has(relativePath(ref.path)),
          label + ": selected evidence ref");
        selectedEvidence.add(ref.path);
        const evidenceBytes = immutable(root, OBSERVATION.anchor, ref.path);
        assert.strictEqual(sha(evidenceBytes), ref.sha256, label + ": issued selected evidence digest");
        assert(live(ref.path).equals(evidenceBytes), label + ": current selected evidence bytes");
      }
    }
    const sourcePath = "archive/exams/" + source, currentSource = live(sourcePath);
    assert(currentSource.equals(nativeSource.bytes), label + ": current source bytes");
    const anchorSource = immutable(root, OBSERVATION.anchor, sourcePath);
    const sourceChangedSinceAnchor = !currentSource.equals(anchorSource);
    const sourceEdition = sourceChangedSinceAnchor
      ? assertObservedSourceEdition(root, sourcePath, anchorSource, currentSource, label) : null;
    if (sourceEdition) assert.deepStrictEqual(sourceEdition.currentBank, nativeSource.bank, label + ": observed caller source bank");
    const rhsOnly = requestId === RHS_ONLY.requestId;
    if (rhsOnly) {
      assert(source === RHS_ONLY.sourceArchiveFile && ordinal === RHS_ONLY.sourceOrdinal &&
        current.questionUid === RHS_ONLY.questionUid, label + ": exact issued RHS singleton");
      assert.deepStrictEqual(pins(issuedBytes), pinsOnly(RHS_ONLY.receipt), label + ": fixed RHS issued receipt");
    }
    return { kind: sourceOnly ? SOURCE_ONLY.schemaVersion : rhsOnly ? RHS_ONLY.schemaVersion : "ISSUED_TYPED_UI",
      receiptPath, receipt, bindingPath, patch, context, readPaths, sourceChangedSinceAnchor, sourceEdition, live,
      proof: { approval: "RETAINED_ISSUED_APPROVAL", anchor: OBSERVATION.anchor,
        receipt: { path: receiptPath, ...pins(issuedBytes) }, questionUid: current.questionUid,
        sourceArchiveFile: source, sourceOrdinal: ordinal, metadataSha256: sha(stable(current)),
        identitySha256: sha(stable(identity)), runtimeSha256: sha(stable(row)),
        sourceChangedSinceAnchor, newMetadataApprovals: 0 } };
  }
  function assertAuthorityInputs(input, kept, label) {
    const { registry, nativeSource } = input, root = nativeSource.root;
    // The current ACTIVE registry is re-read with the same digest policy as the
    // ordinary Native reader. Its owner/binding was checked by assertRetained.
    assert.deepStrictEqual(JSON.parse(kept.live(ACTIVE_INDEX)), registry.files?.index,
      label + ": current ACTIVE registry input");
    const registryRefs = [...registry.files.index.canonicalSources, ...registry.files.index.compiledArtifacts];
    assert(registryRefs.length > 0, label + ": ACTIVE input closure");
    for (const entry of registryRefs) {
      assert(entry && /^sha256:[a-f0-9]{64}$|^[a-f0-9]{64}$/.test(entry.sha256 || ""), label + ": ACTIVE digest");
      assert.strictEqual(sha(Buffer.from(kept.live(entry.path).toString("utf8").replaceAll("\r\n", "\n"))),
        entry.sha256.replace(/^sha256:/, ""), label + ": ACTIVE declared input drift:" + entry.path);
    }
    assert(kept.live(MASTER).equals(immutable(root, OBSERVATION.anchor, MASTER)),
      label + ": unknown master input drift");

  }
  function assertKnownSourceOnlyInputs(input, kept, label) {
    const { nativeSource, source, ordinal, current, identity } = input, root = nativeSource.root;
    assert.strictEqual(kept.kind, SOURCE_ONLY.schemaVersion, label + ": exact source-only lane");
    assert(kept.sourceChangedSinceAnchor && source === SOURCE_ONLY.source, label + ": exact observed source drift required");
    const child = kept.receipt, expectedSubjects = SOURCE_ONLY.subjects.map(value => value.questionUid).sort();
    assert(child.scope === "PARTIAL_UIDS" && child.partialUidCount === 2 && child.totalQuestions === 2 &&
      child.expectedQuestionCount === SOURCE_ONLY.expectedQuestionCount && child.newMetadataApprovals === 0 &&
      child.preservedMetadataApprovals === 2 && child.registryChanges?.length === 0 &&
      child.fingerprintRepairs?.length === 0, label + ": exact approval-preserving child inventory");
    assert.deepStrictEqual(child.appliedRecords.map(value => value.questionUid).sort(), expectedSubjects, label);
    assert.deepStrictEqual(child.approval.evidenceRefs,
      [{ path: SOURCE_ONLY.prior.path, sha256: SOURCE_ONLY.prior.sha256 }], label + ": closed parent evidence");
    assert.deepStrictEqual(child.approval.sourceRebind,
      { priorReceiptRef: child.approval.evidenceRefs[0] }, label + ": exact source preservation claim");
    assert.deepStrictEqual({ gitBlobSha1: child.sourceBlobSha1, sha256: child.sourceRawSha256 },
      { gitBlobSha1: OBSERVATION.source.before.gitBlobSha1, sha256: OBSERVATION.source.before.sha256 }, label);

    const priorBytes = immutable(root, OBSERVATION.anchor, SOURCE_ONLY.prior.path);
    assert.deepStrictEqual(pins(priorBytes), pinsOnly(SOURCE_ONLY.prior), label + ": immutable original Native receipt");
    assert(kept.live(SOURCE_ONLY.prior.path).equals(priorBytes), label + ": live original Native receipt");
    const prior = JSON.parse(priorBytes);
    const originalNativeSource = readOriginalNativeSource(root, prior);
    assert(prior.schemaVersion === "archive-reviewed-exam-meta-registration-v2" &&
      prior.metadataRegistrationStatus === "REGISTERED" && prior.requestId === SOURCE_ONLY.prior.requestId &&
      prior.sourceArchiveFile === source && prior.expectedQuestionCount === SOURCE_ONLY.expectedQuestionCount &&
      prior.scope === "PARTIAL_UIDS" && prior.partialUidCount === 2 && prior.totalQuestions === 2 &&
      prior.approval?.type === "FINAL_QA" && prior.approval.metadataReviewed === true &&
      prior.registryChanges?.length === 0, label + ": original complete Native approval");
    const withoutTransport = value => {
      const copy = { ...value }; delete copy.metadataRevision; delete copy.approvalEvidence; return copy;
    };
    for (const collection of ["appliedRecords", "appliedIdentityRecords", "runtimeRecords"]) {
      const oldRows = uniqueRows(prior[collection], label + ": original " + collection);
      const newRows = uniqueRows(child[collection], label + ": child " + collection);
      assert.deepStrictEqual([...oldRows.keys()].sort(), expectedSubjects, label);
      assert.deepStrictEqual([...newRows.keys()].sort(), expectedSubjects, label);
      for (const subject of SOURCE_ONLY.subjects) {
        const before = oldRows.get(subject.questionUid), after = newRows.get(subject.questionUid);
        assert(before.sourceOrdinal === subject.sourceOrdinal && after.sourceOrdinal === subject.sourceOrdinal, label);
        assert.deepStrictEqual(collection === "appliedIdentityRecords" ? after : withoutTransport(after),
          collection === "appliedIdentityRecords" ? before : withoutTransport(before), label + ": original approved whole state");
      }
    }
    const priorEvidencePaths = [], seen = new Set();
    assert(Array.isArray(prior.approval.evidenceRefs) && prior.approval.evidenceRefs.length > 0, label);
    for (const ref of prior.approval.evidenceRefs) {
      assert(SHA256.test(ref.sha256) && !seen.has(relativePath(ref.path)) &&
        !ref.path.startsWith(RECEIPTS), label + ": exact terminal original evidence closure");
      seen.add(ref.path);
      const raw = immutable(root, OBSERVATION.anchor, ref.path);
      assert.strictEqual(sha(raw), ref.sha256, label + ": original evidence SHA");
      assert(kept.live(ref.path).equals(raw), label + ": live original evidence");
      priorEvidencePaths.push(ref.path);
    }
    assertAuthorityInputs(input, kept, label);
    for (const subject of SOURCE_ONLY.subjects) {
      const actual = api.currentRows(subject.questionUid);
      assert(actual.runtimeStatus === "ACTIVE" && actual.runtimeOwner === "MIDDLE_GEOMETRY",
        label + ": both current runtime owners must be ACTIVE");
      for (const [key, collection] of [["metadata", "appliedRecords"], ["identity", "appliedIdentityRecords"], ["runtime", "runtimeRecords"]])
        assert.deepStrictEqual(actual[key], single(child[collection], value => value.questionUid === subject.questionUid,
          label + ": issued source pair " + key), label + ": both current source-pair whole rows");
      const classification = Object.fromEntries([
        "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
        "standardUnitKey", "subUnitKey", "sourceArchiveFile"
      ].map(field => [field, actual.metadata[field]]));
      const check = api.validateActiveMetaFields(classification, input.registry, { requireFields: false });
      assert(check.status === "VALIDATED" && check.activeBinding, label + ": both current source-pair classifications");
      const context = api.activeBindingContext({ candidate: actual.metadata, check, registry: input.registry,
        runtimeOwner: actual.runtimeOwner });
      assert(!context.reason && context.ownerPack === actual.runtimeOwner, label + ": both current source-pair ACTIVE owners");
    }

    // Existing source bytes are parsed only for exact structural equality.
    // No mathematical review, rendering, new approval or source rewrite occurs.
    const sourcePath = "archive/exams/" + source, beforeBytes = immutable(root, OBSERVATION.anchor, sourcePath);
    assert.deepStrictEqual(pins(beforeBytes), OBSERVATION.source.before, label + ": issued source edition");
    const edition = kept.sourceEdition;
    assert(edition && nativeSource.bytes.equals(immutable(root, edition.commit, sourcePath)),
      label + ": exact observed source edition");
    const oldBank = edition.beforeBank, newBank = edition.currentBank;
    assert.deepStrictEqual(newBank, nativeSource.bank, label + ": caller bank must be the current source bytes");
    const changedFields = single(edition.changes, value => value.sourceOrdinal === SOURCE_ONLY.changedSourceOrdinal,
      label + ": original observed question change").fields;
    for (const subject of SOURCE_ONLY.subjects)
      assert.deepStrictEqual(newBank[subject.sourceOrdinal - 1], oldBank[subject.sourceOrdinal - 1],
        label + ": selected source question whole unchanged");
    assert.deepStrictEqual(input.question, newBank[ordinal - 1], label);
    assert.strictEqual(api.sourceFingerprint(input.question), identity.sourceFingerprint, label + ": selected current fingerprint");
    return { ...kept, declaredInputs: {
      readonlyPaths: priorEvidencePaths.slice().sort(), fontPaths: [], assetPaths: [], sourcePaths: [sourcePath],
      inventorySize: kept.readPaths.size, priorEvidencePaths,
      originalNativeSource: pins(originalNativeSource),
      selectedSource: { anchor: OBSERVATION.anchor, path: sourcePath,
        subjects: SOURCE_ONLY.subjects.map(value => ({ ...value,
          wholeQuestionSha256: sha(stable(newBank[value.sourceOrdinal - 1])) })),
        changedOrdinal: SOURCE_ONLY.changedSourceOrdinal, changedFields,
        observedCommit: edition.commit, completeChangedFields: edition.changes,
        currentNativeAuthority: "NOT_GRANTED" }
    }, authenticatedDrifts: [{ path: sourcePath, issued: OBSERVATION.source.before, current: edition.pins }] };
  }
  function assertKnownRhsInputs(input, kept, label) {
    const { current, identity, source, ordinal, nativeSource } = input, root = nativeSource.root;
    assert(kept.kind === RHS_ONLY.schemaVersion && current.questionUid === RHS_ONLY.questionUid &&
      source === RHS_ONLY.sourceArchiveFile && ordinal === RHS_ONLY.sourceOrdinal &&
      kept.sourceChangedSinceAnchor && kept.sourceEdition, label + ": exact RHS blocking scope");
    const receipt = kept.receipt;
    assert(receipt.scope === "PARTIAL_UIDS" && receipt.partialUidCount === 1 && receipt.totalQuestions === 1 &&
      receipt.expectedQuestionCount === RHS_ONLY.expectedQuestionCount &&
      receipt.requestSha256 === RHS_ONLY.requestSha256 && receipt.registryChanges?.length === 0 &&
      receipt.approval?.type === "FINAL_QA" && receipt.approval.sourceRebind === undefined &&
      receipt.sourceBlobSha1 === OBSERVATION.source.before.gitBlobSha1 &&
      receipt.sourceRawSha256 === OBSERVATION.source.before.sha256, label + ": fixed original RHS issuance");
    assert.strictEqual(kept.receiptPath, RHS_ONLY.receipt.path, label);
    assert.strictEqual(kept.bindingPath, RHS_ONLY.sourceBinding.path, label);
    const bindingBytes = immutable(root, OBSERVATION.anchor, kept.bindingPath);
    assert.deepStrictEqual(pins(bindingBytes), pinsOnly(RHS_ONLY.sourceBinding), label + ": exact issued RHS source binding");
    assert(kept.live(kept.bindingPath).equals(bindingBytes), label);
    const request = JSON.parse(bindingBytes).requestSnapshot, patch = kept.patch;
    assert(request.items.length === 1 && request.requestId === RHS_ONLY.requestId &&
      request.expectedQuestionCount === RHS_ONLY.expectedQuestionCount &&
      request.expectedSourceBlobSha1 === OBSERVATION.source.before.gitBlobSha1 &&
      request.registrationMode === undefined && patch.rebind === undefined, label + ": closed original RHS request");
    assert.deepStrictEqual(Object.keys(patch.sourceReview).sort(),
      ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "e017RhsContinuity"].sort(),
      label + ": unmixed original RHS marker");
    const marker = patch.sourceReview.e017RhsContinuity;
    assert.deepStrictEqual(marker, { schemaVersion: "archive-m2-e017-existing-rhs-solution-continuity-v1",
      reviewCommit: RHS_ONLY.reviewBinding.commit,
      reviewRef: { path: RHS_ONLY.reviewBinding.path, sha256: RHS_ONLY.reviewBinding.sha256 } },
      label + ": exact original RHS binding marker");
    const repair = single(receipt.fingerprintRepairs, value => value.questionUid === current.questionUid &&
      value.sourceOrdinal === ordinal, label + ": exact original RHS repair");
    assert.strictEqual(receipt.fingerprintRepairs.length, 1, label);
    const original = repair.sourceReview, typed = original.e017RhsContinuity;
    assert.strictEqual(sha(stable(original)), RHS_ONLY.sourceReviewSha256, label + ": complete original RHS source-review proof");
    assert.strictEqual(sha(stable(typed)), RHS_ONLY.typedProofSha256, label + ": complete original RHS typed proof");
    const documentBytes = boundImmutable(root, RHS_ONLY.reviewBinding);
    assert(kept.live(RHS_ONLY.reviewBinding.path).equals(documentBytes) &&
      immutable(root, OBSERVATION.anchor, RHS_ONLY.reviewBinding.path).equals(documentBytes),
      label + ": immutable and live RHS binding document");
    const document = JSON.parse(documentBytes);
    assert(document.schemaVersion === "archive-m2-e017-existing-rhs-binding-v1" &&
      document.scope === "EXACT_E017_Q2_EXISTING_RHS_FIRST_LINE_ONLY" &&
      document.questionUid === current.questionUid && document.sourceOrdinal === ordinal &&
      document.sourceArchiveFile === source && document.expectedQuestionCount === RHS_ONLY.expectedQuestionCount &&
      document.newMathematicalQa === false && document.newMetadataApprovals === 0,
      label + ": original RHS binding scope");
    for (const key of ["nativeReviewRef", "nativeItemSha256", "authorityRefs", "reviewedCurrentSourceRef",
      "currentSourceRef", "currentAssetRefs", "solutionAssetRefs", "transition",
      "studentUiTechnicalRef", "studentUiVisualRef"])
      assert.deepStrictEqual(document[key], typed[key], label + ": original RHS declared " + key);
    assert.deepStrictEqual(pinsOnly(document.currentSourceRef), OBSERVATION.source.before, label);
    assert.strictEqual(document.currentSourceRef.path, "archive/exams/" + source, label);

    // Authenticate the complete original reader closure. Only paths that the
    // original reader consumes live are compared with current regular files;
    // no new review, current screenshot or historical database is manufactured.
    const immutableRefs = [document.nativeReviewRef, ...document.authorityRefs,
      document.reviewedCurrentSourceRef, document.currentSourceRef,
      document.studentUiTechnicalRef, document.studentUiVisualRef];
    const rpm = original.nativeRpmCourseTransport;
    assert(rpm?.schemaVersion === "archive-m2-native-rpm-course-transport-v1" &&
      rpm.questionUid === current.questionUid && rpm.sourceOrdinal === ordinal &&
      rpm.ordinaryParentValidationRequired === true && rpm.newMathematicalQa === false &&
      rpm.nativeSource.gitBlobSha1 === RHS_ONLY.nativeSourceRef.gitBlobSha1 &&
      rpm.nativeSource.sha256 === RHS_ONLY.nativeSourceRef.sha256, label + ": original RHS RPM transport");
    immutableRefs.push(rpm.nativeRpmRef, rpm.currentRpmRef);
    for (const ref of immutableRefs) authenticateRef(root, ref);
    const originalSource = readRhsOriginalNativeSource(root);
    assert(boundImmutable(root, RHS_ONLY.nativeSourceRef).equals(originalSource),
      label + ": original RHS source commit and object binding");
    assert.strictEqual(original.reviewedSourceBlobSha1, RHS_ONLY.nativeSourceRef.gitBlobSha1, label);
    assert.strictEqual(original.reviewCommitSourceBlobSha1, RHS_ONLY.nativeSourceRef.gitBlobSha1, label);
    assert.strictEqual(original.reviewedSourceSha256, RHS_ONLY.nativeSourceRef.sha256, label);
    assert(kept.live(original.reviewRef.path).equals(boundImmutable(root, document.nativeReviewRef)),
      label + ": original Native review live witness");
    assert(kept.live(rpm.currentRpmRef.path).equals(boundImmutable(root, rpm.currentRpmRef)),
      label + ": original current RPM live witness");

    const assetPaths = [];
    assert.strictEqual(document.currentAssetRefs.length, 2, label + ": original RHS asset inventory");
    for (const ref of document.currentAssetRefs) {
      const raw = boundImmutable(root, ref);
      assert(raw.equals(boundImmutable(root, { ...ref, commit: RHS_ONLY.nativeSourceRef.commit })) &&
        raw.equals(kept.live(ref.path)), label + ": original RHS asset history/live bytes");
      assetPaths.push(ref.path);
    }
    const technical = JSON.parse(boundImmutable(root, document.studentUiTechnicalRef));
    const visual = JSON.parse(boundImmutable(root, document.studentUiVisualRef));
    assert(technical.expectedLogicalCases === 1 && technical.completedLogicalCases === 1 &&
      technical.results?.length === 1 && visual.records?.length === 1,
      label + ": immutable original RHS solution-one UI");
    assert.deepStrictEqual(ExistingVectorUi.verifyUi({
      technical, visual, technicalRef: document.studentUiTechnicalRef,
      readRef: ref => boundImmutable(root, ref), questionUid: current.questionUid,
      sourceOrdinal: ordinal, surface: "SOLUTION", sourceRef: document.currentSourceRef,
      assetRefs: document.solutionAssetRefs
    }), typed.ui, label + ": original issued UI contract only");
    assertAuthorityInputs(input, kept, label);
    const edition = kept.sourceEdition, sourcePath = "archive/exams/" + source;
    assert.deepStrictEqual(edition.currentBank, nativeSource.bank, label + ": exact current RHS source bank");
    assert.deepStrictEqual(input.question, edition.currentBank[ordinal - 1], label);
    const q2Change = single(edition.changes, value => value.sourceOrdinal === ordinal,
      label + ": exact observed Q2 source change");
    assert.deepStrictEqual(q2Change.fields, SOURCE_ONLY.changedSourceFields, label + ": known Q2 image/layout change only");
    const expectedPlanReason = api.sourceFingerprint(input.question) === identity.sourceFingerprint
      ? "NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED" : "IDENTITY_SOURCE_FINGERPRINT_MISMATCH";
    return { ...kept, expectedPlanReason, declaredInputs: {
      readonlyPaths: [...kept.readPaths].filter(relative => relative !== sourcePath && !assetPaths.includes(relative)).sort(),
      fontPaths: [], assetPaths: assetPaths.sort(), sourcePaths: [sourcePath], inventorySize: kept.readPaths.size,
      immutableRefs, originalNativeSource: pins(originalSource),
      originalSolutionUi: { technicalRef: document.studentUiTechnicalRef, visualRef: document.studentUiVisualRef,
        logicalCases: 1, originalTiles: 1, currentUiContinuity: "NOT_ASSERTED" },
      selectedSource: { anchor: OBSERVATION.anchor, path: sourcePath, observedCommit: edition.commit,
        changes: edition.changes, currentQuestionSha256: sha(stable(input.question)), currentNativeAuthority: "NOT_GRANTED" }
    }, authenticatedDrifts: [{ path: sourcePath, issued: OBSERVATION.source.before, current: edition.pins }] };
  }
  function assertKnownInputs(input, label) {
    const kept = assertRetained(input, label), { current, identity, source, ordinal, nativeSource, registry } = input;
    const root = nativeSource.root, head = ancestor(root, OBSERVATION.observed);
    if (kept.kind === SOURCE_ONLY.schemaVersion) return assertKnownSourceOnlyInputs(input, kept, label);
    if (kept.kind === RHS_ONLY.schemaVersion) return assertKnownRhsInputs(input, kept, label);
    const repair = single(kept.receipt.fingerprintRepairs,
      value => value.questionUid === current.questionUid && value.sourceOrdinal === ordinal, label + ": issued typed repair");
    const candidates = PROOF_KINDS.filter(([key]) => repair.sourceReview?.[key] !== undefined);
    assert.strictEqual(candidates.length, 1, label + ": known typed UI obligation required");
    const [key, schema, technicalSchema] = candidates[0], typed = repair.sourceReview[key];
    assert(typed.schemaVersion === schema && typed.questionUid === current.questionUid &&
      typed.sourceOrdinal === ordinal && typed.sourceArchiveFile === source &&
      typed.requiresOrdinaryNativeValidation !== false, label + ": typed target");
    const ref = typed.ui?.technicalRef;
    const declared = single(kept.receipt.approval.evidenceRefs, value => value.path === ref?.path,
      label + ": technical evidence ref");
    assert.strictEqual(declared.sha256, ref.sha256, label);
    const raw = boundImmutable(root, ref);
    assert(kept.live(ref.path).equals(raw) && immutable(root, OBSERVATION.anchor, ref.path).equals(raw),
      label + ": issued technical bytes");
    const technical = JSON.parse(raw);
    assert(technical.schemaVersion === technicalSchema && SHA1.test(technical.checkoutCommit) &&
      technical.checkoutCommit === typed.ui.checkoutCommit &&
      technical.status === "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" &&
      technical.executionOwner === "GITHUB_ACTIONS_SUPPORTED_CHROME" &&
      technical.expectedLogicalCases === technical.completedLogicalCases &&
      technical.results?.length === technical.completedLogicalCases &&
      technical.failures?.length === 0 && technical.externalFontResources?.length === 0,
      label + ": issued technical transport");
    const isQ5 = key === "q5CompleteGivenApplication";
    assert.strictEqual(technical.items?.length, isQ5 ? 1 : 24, label + ": immutable item inventory");
    assert.strictEqual(technical.completedLogicalCases, isQ5 ? 2 : 48, label + ": immutable case inventory");
    const selected = single(technical.items, value => value.questionUid === identity.questionUid &&
      value.sourceOrdinal === ordinal && value.sourceRef?.path === "archive/exams/" + source,
      label + ": exact UI selected UID/source");

    // Authenticate the original technical inventory first. A known renderer
    // difference never exempts an additional code/font/asset from this loop.
    const inputs = new Map(), sources = new Set(), fontPaths = new Set(), assetPaths = new Set();
    const add = (ref, live, kind) => {
      assert(ref && ref.commit === technical.checkoutCommit, label + ": capture checkout ref");
      authenticateRef(root, ref);
      const previous = inputs.get(ref.path);
      if (previous) assert.deepStrictEqual(pinsOnly(ref), pinsOnly(previous.ref), label + ": mixed declared input pins");
      const row = previous || { ref, live: false, kinds: new Set() };
      row.live ||= live; row.kinds.add(kind); inputs.set(ref.path, row);
      if (kind === "font") fontPaths.add(ref.path);
      if (ref.path.startsWith("archive/assets/")) assetPaths.add(ref.path);
    };
    const addList = (rows, live, kind) => {
      assert(Array.isArray(rows) && rows.length > 0, label + ": declared " + kind + " inventory");
      assert.strictEqual(new Set(rows.map(row => row.path)).size, rows.length, label + ": duplicate " + kind + " path");
      for (const row of rows) add(row, live, kind);
    };
    for (const item of technical.items) {
      assert(UID.test(item.questionUid) && Number.isSafeInteger(item.sourceOrdinal) &&
        item.sourceOrdinal > 0 && item.sourceRef?.path.startsWith("archive/exams/") &&
        item.assetRef?.path.startsWith("archive/assets/"), label + ": declared item binding");
      sources.add(item.sourceRef.path);
      add(item.sourceRef, true, "source"); add(item.assetRef, true, "asset");
    }
    assert.strictEqual(new Set(technical.items.map(item => item.questionUid)).size, technical.items.length,
      label + ": duplicate technical UID");
    addList(technical.servedFiles, true, "served");
    addList(technical.mirroredAssets, true, "mirrored");
    addList(technical.studentFontResources, true, "font");
    for (const value of [technical.manifestRef, technical.checkerRef, technical.identityRef])
      add(value, false, "immutable");
    add(technical.captureHelperRef, isQ5, "capture-helper");
    add(technical.fontLicenseRef, isQ5, "font-license");
    if (isQ5) addList(technical.surfaceRefs, true, "surface");

    assertAuthorityInputs(input, kept, label);

    const drifts = [], readonlyPaths = [];
    for (const [relative, entry] of inputs) {
      if (!entry.live) continue;
      // The ordinary selected MD/ID/runtime whole rows are already joined to
      // f9's issued receipt. Never require an old whole generated database.
      if (relative === "archive/data/question_metadata.json" || relative === "archive/data/question_identity_map.json" ||
          relative === SVG_INDEX) continue;
      const actual = kept.live(relative);
      if (sources.has(relative)) {
        const issued = immutable(root, OBSERVATION.anchor, relative);
        if (!actual.equals(issued)) {
          assertObservedSourceEdition(root, relative, issued, actual, label + ": declared source dependency");
        }
        continue;
      }
      const known = OBSERVATION.served.find(row => row.path === relative);
      if (known) {
        assert.deepStrictEqual(pinsOnly(entry.ref), known.before, label + ": unknown captured renderer revision");
        assert.deepStrictEqual(pins(actual), known.after, label + ": unknown live renderer change");
        assert(actual.equals(immutable(root, OBSERVATION.observed, relative)) &&
          actual.equals(immutable(root, head, relative)), label + ": current observed renderer bytes");
        drifts.push({ path: relative, captured: known.before, current: known.after });
      } else {
        assert.deepStrictEqual(pins(actual), pinsOnly(entry.ref), label + ": unknown declared input drift:" + relative);
        readonlyPaths.push(relative);
      }
    }
    assert(drifts.length > 0, label + ": unknown Native null without authenticated observed drift");

    // Use the production normalizer, both roles and global-duplicate rejection.
    // This compares actual issued f9 -> current selected footprint. It does not
    // assert captured UI -> f9 equality, approve closed8 additions or pass Native.
    assert(inputs.get(SVG_INDEX)?.live, label + ": declared generated SVG input");
    let assetRefs;
    if (key === "m2ProblemRenderer21Continuity") assetRefs = [selected.assetRef];
    else if (key === "m2Family3ProblemContinuity") {
      assetRefs = FAMILY3_UIDS.map(uid =>
        single(technical.items, item => item.questionUid === uid, label + ": family3 footprint target").assetRef);
    } else {
      assetRefs = [...technical.servedFiles, ...technical.mirroredAssets]
        .filter(value => value.path.startsWith("archive/assets/"));
    }
    assert(assetRefs.length > 0, label + ": closed SVG footprint");
    const issuedSvg = immutable(root, OBSERVATION.anchor, SVG_INDEX), liveSvg = kept.live(SVG_INDEX);
    const issuedEntries = SvgIndexContinuity.selectEntries(SvgIndexContinuity.parseIndex(issuedSvg), assetRefs);
    const liveEntries = SvgIndexContinuity.selectEntries(SvgIndexContinuity.parseIndex(liveSvg), assetRefs);
    assert.deepStrictEqual(liveEntries, issuedEntries, label + ": unknown selected generated SVG drift");
    return { ...kept, declaredInputs: {
      readonlyPaths: readonlyPaths.sort(), fontPaths: [...fontPaths].sort(), assetPaths: [...assetPaths].sort(),
      sourcePaths: [...sources].sort(), inventorySize: inputs.size,
      selectedSvg: { anchor: OBSERVATION.anchor, path: SVG_INDEX,
        assetPaths: [...new Set(assetRefs.map(value => value.path))].sort(),
        records: issuedEntries.length, sha256: sha(stable(issuedEntries)),
        capturedUiContinuity: "NOT_ASSERTED", currentNativeAuthority: "NOT_GRANTED" }
    }, authenticatedDrifts: drifts };
  }
  function pinsOnly(ref) {
    return { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes };
  }
  function assertBlocked(input, label) {
    const kept = assertKnownInputs(input, label), { current, identity, source, ordinal, nativeSource } = input;
    const before = sha(stable({ current, identity, runtime: nativeSource.runtimeRecord,
      question: input.question, previous: input.previous, sourceBytes: sha(nativeSource.bytes) }));
    assert.strictEqual(api.nativeReviewReceipt({ ...input, pt: kept.context.pt, tpl: kept.context.tpl,
      ownerPack: kept.context.ownerPack }), null, label + ": current Native must remain unverified");
    const result = api.planQuestion({ ...input, validate: api.validateActiveMetaFields });
    assert.strictEqual(result.status, "SUPPLEMENT_PENDING", label + ": current producer must refuse");
    assert.deepStrictEqual(Object.keys(result).sort(),
      ["status", "reasons", "questionUid", "sourceArchiveFile", "sourceOrdinal"].sort(), label + ": no generated metadata");
    assert.strictEqual(result.questionUid, current.questionUid, label);
    assert.strictEqual(result.sourceArchiveFile, source, label);
    assert.strictEqual(result.sourceOrdinal, ordinal, label);
    const sourceOnly = kept.kind === SOURCE_ONLY.schemaVersion;
    const allowed = new Set([sourceOnly ? SOURCE_ONLY.currentRejection : "NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED"]);
    if (!sourceOnly && kept.sourceChangedSinceAnchor) {
      allowed.add("IDENTITY_SOURCE_FINGERPRINT_MISMATCH");
      allowed.add("METADATA_SOURCE_FINGERPRINT_CONFLICT");
    }
    assert(Array.isArray(result.reasons) && result.reasons.length > 0 &&
      result.reasons.every(reason => allowed.has(reason)), label + ": unknown current refusal");
    if (kept.kind === RHS_ONLY.schemaVersion)
      assert.deepStrictEqual(result.reasons, [kept.expectedPlanReason], label + ": exact RHS current refusal");
    assert.strictEqual(sha(stable({ current, identity, runtime: nativeSource.runtimeRecord,
      question: input.question, previous: input.previous, sourceBytes: sha(nativeSource.bytes) })), before,
      label + ": original producer probe must not mutate issued inputs");
    return { ...kept, proof: { ...kept.proof, currentNativeReady: false, currentReadiness: "BLOCKED", readinessBasis: kept.kind,
      currentPlan: { status: result.status, reasons: result.reasons }, authenticatedDrifts: kept.authenticatedDrifts,
      declaredInputs: kept.declaredInputs,
      firstNativeFailureSite: "NOT_INFERRED_FROM_NULL", currentDisplayQuality: "NOT_REVIEWED" } };
  }
  return { assertRetained, assertKnownInputs, assertBlocked };
}
module.exports = { createIssuedApprovalObserver, readOriginalNativeSource, assertOriginalNativeSourceBytes,
  readRhsOriginalNativeSource, assertRhsOriginalNativeSourceBytes };
