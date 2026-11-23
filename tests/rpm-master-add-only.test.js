// Unit test for the single "LOCKED RPM master is add-only" judgment used by the registrar's
// receipt verifiers and by the middle-geometry receipt-integrity check. Synthetic Git fixtures only.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { pathToFileURL } = require("url");

const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const bytesOf = doc => Buffer.from(JSON.stringify(doc, null, 2) + "\n");
const leaf = name => ({ problemType: name });
const concept = (name, ...types) => ({ concept: name, problemTypes: types.map(leaf) });
const base = () => ({
  schemaVersion: "js-archive-taxonomy-rpm-primary-v1.0", authorityStatus: "LOCKED",
  records: [
    { curriculum: "2022", scope: "A", majorUnit: "u1", midUnit: "m1", concepts: [concept("c1", "p1", "p2"), concept("c2", "p3")] },
    { curriculum: "2022", scope: "A", majorUnit: "u1", midUnit: "m2", concepts: [concept("c3", "p4")] }
  ]
});
const clone = x => JSON.parse(JSON.stringify(x));

function repo(cleanups) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rpm-master-add-only-"));
  cleanups.push(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, "init", "--quiet"); git(root, "config", "user.name", "Unit Fixture"); git(root, "config", "user.email", "unit@example.invalid");
  return root;
}
function commit(root, doc, message) {
  const full = path.join(root, MASTER); fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, bytesOf(doc)); git(root, "add", "."); git(root, "commit", "--quiet", "-m", message);
}

async function main() {
  const { judgeLockedMaster, lockedMasterEvidenceBytes, retainedInOrder, RpmMasterHistoryUnavailable, RPM_MASTER_PATH, rpmMasterGitCallCount } =
    await import("../archive/tools/meta-foundation/rpm-master-add-only.mjs");
  assert.strictEqual(RPM_MASTER_PATH, MASTER);
  const cleanups = [];
  try {
    const v1 = base(), pinned = sha(bytesOf(v1));
    const root = repo(cleanups);
    commit(root, v1, "v1");
    const v2 = clone(v1); v2.records[0].concepts.push(concept("c4", "p5")); v2.records.push({ curriculum: "2022", scope: "B", majorUnit: "u9", midUnit: "m9", concepts: [concept("c9", "p9")] });
    commit(root, v2, "v2 add-only growth");

    // accept: identical bytes (no Git needed), appended growth, growth inserted in the middle
    const same = judgeLockedMaster({ root, pinnedSha256: pinned, currentBytes: bytesOf(v1) });
    assert(same.ok && same.mode === "BYTES_EQUAL");
    const grown = judgeLockedMaster({ root, pinnedSha256: pinned, currentBytes: bytesOf(v2) });
    assert(grown.ok && grown.mode === "ADD_ONLY_FROM_GIT_HISTORY", "appended growth is accepted");
    assert.strictEqual(sha(grown.bytes), pinned, "the pinned (historical) bytes are handed back");
    const middle = clone(v1); middle.records[0].concepts.splice(1, 0, concept("inserted", "px")); middle.records[0].concepts[0].problemTypes.splice(1, 0, leaf("py"));
    assert(judgeLockedMaster({ root, pinnedSha256: pinned, currentBytes: bytesOf(middle) }).ok, "insertion between retained nodes is accepted");
    assert.strictEqual(sha(lockedMasterEvidenceBytes({ root, pinnedSha256: pinned, currentBytes: bytesOf(v2) })), pinned);
    // the default current bytes are the file on disk (HEAD == v2)
    assert(judgeLockedMaster({ root, pinnedSha256: pinned }).ok);

    // reject: every kind of tampering with a retained node
    const tampers = {
      "value changed": d => { d.records[0].concepts[0].problemTypes[0].problemType = "changed"; },
      "concept renamed": d => { d.records[0].concepts[1].concept = "renamed"; },
      "node removed": d => { d.records[0].concepts[0].problemTypes.splice(1, 1); },
      "whole record removed": d => { d.records.splice(1, 1); },
      "order swapped": d => { d.records[0].concepts.reverse(); },
      "records swapped": d => { d.records.reverse(); },
      "key added to a retained node": d => { d.records[0].extra = "x"; },
      "top-level key added": d => { d.extra = "x"; },
      "schemaVersion changed": d => { d.schemaVersion = "other"; },
      "authorityStatus changed": d => { d.authorityStatus = "DRAFT"; },
      "records no longer an array": d => { d.records = {}; }
    };
    for (const [name, change] of Object.entries(tampers)) {
      const doc = clone(v2); change(doc);
      const verdict = judgeLockedMaster({ root, pinnedSha256: pinned, currentBytes: bytesOf(doc) });
      assert.strictEqual(verdict.ok, false, name + " must be rejected");
      assert.strictEqual(sha(lockedMasterEvidenceBytes({ root, pinnedSha256: pinned, currentBytes: bytesOf(doc) })), sha(bytesOf(doc)), name + ": caller digest comparison fails");
    }
    assert.strictEqual(judgeLockedMaster({ root, pinnedSha256: pinned, currentBytes: Buffer.from("not json") }).ok, false);

    // reject: a sha that is no Git revision of the path (a hand-made "older master" cannot be pinned)
    const forged = bytesOf({ ...base(), records: [base().records[0]] });
    assert.strictEqual(judgeLockedMaster({ root, pinnedSha256: sha(forged), currentBytes: bytesOf(v2) }).ok, false);
    assert.strictEqual(judgeLockedMaster({ root, pinnedSha256: "0".repeat(64), currentBytes: bytesOf(v2) }).ok, false);
    assert.strictEqual(judgeLockedMaster({ root, pinnedSha256: "xyz", currentBytes: bytesOf(v2) }).ok, false);

    // reject: a historical revision that was not LOCKED authority cannot vouch for a later master
    const draftRoot = repo(cleanups), draft = base(); draft.authorityStatus = "DRAFT";
    commit(draftRoot, draft, "draft"); const lockedLater = base(); commit(draftRoot, lockedLater, "locked");
    assert.strictEqual(judgeLockedMaster({ root: draftRoot, pinnedSha256: sha(bytesOf(draft)), currentBytes: bytesOf(lockedLater) }).ok, false);

    // history that cannot be read is a clear failure, never a silent pass: no repository, shallow clone
    const bare = fs.mkdtempSync(path.join(os.tmpdir(), "rpm-master-no-git-")); cleanups.push(() => fs.rmSync(bare, { recursive: true, force: true }));
    fs.mkdirSync(path.join(bare, path.dirname(MASTER)), { recursive: true }); fs.writeFileSync(path.join(bare, MASTER), bytesOf(v2));
    assert(judgeLockedMaster({ root: bare, pinnedSha256: sha(bytesOf(v2)) }).ok, "identical bytes never need Git history");
    assert.throws(() => judgeLockedMaster({ root: bare, pinnedSha256: pinned }), error => error instanceof RpmMasterHistoryUnavailable);
    assert.throws(() => lockedMasterEvidenceBytes({ root: bare, pinnedSha256: pinned, currentBytes: bytesOf(v2) }), error => error instanceof RpmMasterHistoryUnavailable);
    const shallow = path.join(os.tmpdir(), "rpm-master-shallow-" + process.pid); cleanups.push(() => fs.rmSync(shallow, { recursive: true, force: true }));
    git(os.tmpdir(), "clone", "--quiet", "--depth", "1", pathToFileURL(root).href, shallow);
    assert.throws(() => judgeLockedMaster({ root: shallow, pinnedSha256: pinned }), error => error instanceof RpmMasterHistoryUnavailable && /shallow/.test(error.message));

    // git is consulted once per run: the revision list is cached, so later receipts add no git calls
    const before = rpmMasterGitCallCount();
    for (let i = 0; i < 5; i++) {
      const variant = clone(v2); variant.records[0].concepts.push(concept("more " + i, "q" + i));
      assert(judgeLockedMaster({ root, pinnedSha256: pinned, currentBytes: bytesOf(variant) }).ok);
    }
    assert.strictEqual(rpmMasterGitCallCount(), before, "no further git call once the revision list is cached");

    // the pure containment helper
    assert(retainedInOrder([1, 2, 3], [0, 1, 1.5, 2, 3, 4]));
    assert(!retainedInOrder([1, 2], [2, 1]));
    assert(retainedInOrder({ a: [1] }, { a: [0, 1] }));
    assert(!retainedInOrder({ a: 1 }, { a: 1, b: 2 }));
    assert(!retainedInOrder({ a: 1 }, null));
  } finally {
    for (const cleanup of cleanups.reverse()) cleanup();
  }
}

main().then(() => console.log("rpm master add-only: passed"), error => { console.error(error); process.exit(1); });
