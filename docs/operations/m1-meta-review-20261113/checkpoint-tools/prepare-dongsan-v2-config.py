"""Prepare the reviewed Dongsan24 config after the shared binding is on main.

This script only reads Git/files and writes two scratch JSON files. It does not
apply the candidate, create the official request, register, build, or run a
Consumer. Root must first fetch/verify main and apply the exact reviewed source,
crosswalk, and parent candidates to its isolated/prepared working tree.

Usage after the dependency's actual main registration is independently closed:
  python .tmp/m1-meta-review/04-dongsan-build-config.py \
    --baseline-main FULL_ACTUAL_MAIN_SHA

Current bf35 main is deliberately ineligible. Do not replace its missing receipt
with an isolated receipt. Frozen evidence is not rewritten by this script.
"""

import argparse
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys

sys.dont_write_bytecode = True


DOCS = "docs/operations/m1-meta-review-20261113/"
TMP = ".tmp/m1-meta-review/"
SOURCE = "original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js"
SOURCE_PATH = "archive/exams/" + SOURCE
ORIGINAL_SHA = "357bfa1d8b326e228179624bf4943ec151a53362e23b00d2dcaac717a5334029"
CANDIDATE_SHA = "9a631f2376d09ded4c4ca4a8d924ea7f5ba8c3bf3bb8e29adb33e9e4d6bff35f"
CROSSWALK = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json"
PARENTS = "archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json"
MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"
PACK = "archive/data/meta-foundation/canonical/packs/middle1/pack.json"
BINDINGS = "archive/data/meta-foundation/canonical/packs/middle1/bindings.json"
RUNTIME = "archive/data/meta-foundation/runtime/middle1-v1.json"
INDEX = "archive/data/meta-foundation/canonical/registry_index.json"
DEPENDENCY_ID = "m1-linear-equation-course-spelling-20261113"
DEPENDENCY_REQUEST = ".archive-meta-register/inbox/" + DEPENDENCY_ID + ".json"
DEPENDENCY_REQUEST_COMMIT = "a70a155542016cc47215bced471a07a1f7602695"
DEPENDENCY_REQUEST_RAW_SHA = "2b4ce237d03dde8b4c70a9da859883f37a6c9d120639c65633ea0d425f917007"
DEPENDENCY_PREFLIGHT = DOCS + "04-binding-v2-isolated-preflight.json"
DEPENDENCY_PREFLIGHT_SHA = "8c8b003668886e18abe8ad464734c484da4ea5f1766ea3f5adde4c74634fbc14"
DEPENDENCY_RECEIPT = (
    "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/"
    + DEPENDENCY_ID + ".binding-course-correction.json"
)
FOREIGN_UID = "qid_v1_553b57b364c7ebc98905d8268bc248b500f3e8a62855de1769b6328dfff6fdb2"
HELPER = DOCS + "checkpoint-tools/build-reviewed-exam-v2-request.mjs"
DERIVED_LABEL_SUPPLEMENT = DOCS + "04-dongsan-derived-label-preconditions.json"
DERIVED_LABEL_SUPPLEMENT_SHA = "256707102ba31a48a708a7c6ef9c733079aae0d46b4ef73b553cc19b90cae779"
FROZEN = {
    "04-dongsan-semantic-review.json": "60526e5edf2ab259fbed1a911ed065bb0fcef0840178757eb694ca6dc0d0995c",
    "04-dongsan-candidate-independent-check.json": "473effa71d29e7dcb84020214eb2b321a03f36da8dbf9ea97f8c4eedf0ea772e",
    "04-dongsan-native-registration-plan.json": "739a5d4ff0f158c000d9c508dc1a579d33f187746dedb290a6b85c7a9dd8cb18",
    "04-dongsan-crosswalk-plan.json": "8c296d30b30dcefe23e10340b58f1051a32ac3ee76baa7d39f88e0186bd4e2ff",
    "04-dongsan-source-candidate-delta.json": "e0b75db9a907a51fdb8a2ac0b1f95ebbed4db598db15e0fbd6dff4ec728b9281",
    "04-dongsan-figure-read-evidence.json": "6aa8a4dcd06ba119cfd632ef225b610b3df2e814c5caf8cb37cc68befd38dc06",
    "04-dongsan-binding-course-scope.json": "b52bff377b492e4aa9ae4ea9812102513751b9ff73e01c0742b1086c70c661a8",
    "04-dongsan-q22-native-proposal.json": "df3859dc258df3f938cc5a83186f08dc8b0c9dc69f965fe33cd85d35f6c4aa45",
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def blob(raw):
    return hashlib.sha1(("blob " + str(len(raw)) + "\0").encode() + raw).hexdigest()


def canonical(value):
    # Request provenance contains strings, booleans, nulls, arrays and integers.
    # Refuse floats rather than guessing at ECMAScript numeric serialization.
    def inspect(v):
        require(not isinstance(v, float), "Unexpected floating-point request provenance")
        if isinstance(v, dict):
            for item in v.values():
                inspect(item)
        elif isinstance(v, list):
            for item in v:
                inspect(item)
    inspect(value)
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()


def parse_bank(raw):
    text = raw.decode("utf-8")
    match = re.fullmatch(
        r'window\.examTitle\s*=\s*("(?:[^"\\]|\\.)*");\s*'
        r'window\.questionBank\s*=\s*(\[.*\])\s*;\s*', text, re.S,
    )
    require(match is not None, "Reviewed source wrapper changed; stop for owner review")
    return json.loads(match[1]), json.loads(match[2])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root")
    parser.add_argument("--baseline-main", required=True)
    parser.add_argument("--request-id", default="m1-dongsan-2025-final-meta-review-20261113")
    parser.add_argument("--out", default=TMP + "04-dongsan-approved-config.json")
    args = parser.parse_args()
    root = Path(args.repo_root).resolve() if args.repo_root else Path(
        subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], cwd=Path(__file__).resolve().parent,
            env={**os.environ, "GIT_NO_LAZY_FETCH": "1", "GIT_OPTIONAL_LOCKS": "0"}, timeout=15,
        ).decode().strip()
    ).resolve()
    require(re.fullmatch(r"[a-f0-9]{40}", args.baseline_main), "Full actual main SHA required")
    require(re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,100}", args.request_id), "Invalid immutable requestId")

    def path(rel):
        require(isinstance(rel, str) and rel and "\\" not in rel and "\0" not in rel,
                "Unsafe repository path")
        require(not Path(rel).is_absolute() and not any(p in ("", ".", "..") for p in rel.split("/")),
                "Repository-relative path required")
        result = root / rel
        require(root in result.resolve().parents, "Path leaves repository")
        require(not any(p.is_symlink() for p in [result, *result.parents] if p != root),
                "Symlink input/output is not supported")
        return result

    def git(*argv):
        return subprocess.check_output(["git", *argv], cwd=root,
            env={**os.environ, "GIT_NO_LAZY_FETCH": "1", "GIT_OPTIONAL_LOCKS": "0"}, timeout=30)

    def from_main(rel):
        path(rel)
        return git("show", args.baseline_main + ":" + rel)

    def baseline_doc(rel):
        return json.loads(from_main(rel))

    def read(rel):
        return json.loads(path(rel).read_bytes())

    def ref(rel, expected=None):
        require(not rel.startswith(".tmp/"), "Approval evidence must be durable repository data")
        actual = sha(path(rel).read_bytes())
        require(expected is None or actual == expected, "Evidence SHA drift: " + rel)
        return {"path": rel, "sha256": actual}

    # These gates read published Git objects, not local/isolation-only evidence.
    require(git("rev-parse", "refs/remotes/origin/main").decode().strip() == args.baseline_main,
            "baseline-main must equal root's freshly fetched origin/main")
    pack, runtime, index = (baseline_doc(p) for p in [PACK, RUNTIME, INDEX])
    require(pack["packId"] == runtime["packId"] == "MIDDLE1"
            and pack["packVersion"] == runtime["packVersion"] == "1.0.9",
            "Shared dependency is not the reviewed MIDDLE1 1.0.9 main state")
    require(any(r["id"] == "MIDDLE1" and r["version"] == "1.0.9" and r["status"] == "ACTIVE"
                for r in index["activePacks"]), "Published pack index differs")
    # The single writer consumes/deletes inbox requests. Bind its exact published
    # historical body to the current main receipt; never require a pending inbox.
    request_raw = git("show", DEPENDENCY_REQUEST_COMMIT + ":" + DEPENDENCY_REQUEST)
    require(sha(request_raw) == DEPENDENCY_REQUEST_RAW_SHA, "Historical dependency request raw SHA differs")
    request = json.loads(request_raw)
    preflight_ref = ref(DEPENDENCY_PREFLIGHT, DEPENDENCY_PREFLIGHT_SHA)
    require(read(DEPENDENCY_PREFLIGHT)["request"] == {
        "path":DEPENDENCY_REQUEST, "rawSha256":DEPENDENCY_REQUEST_RAW_SHA},
        "Durable preflight does not bind the historical request")
    receipt = baseline_doc(DEPENDENCY_RECEIPT)
    require(request["schemaVersion"] == "archive-binding-course-correction-request-v2"
            and receipt["schemaVersion"] == "archive-binding-course-correction-receipt-v2",
            "Exact historical published v2 request and actual main receipt required")
    require(request["requestId"] == receipt["requestId"] == DEPENDENCY_ID
            and receipt["requestSha256"] == sha(canonical(request)), "Dependency request/receipt provenance differs")
    require(receipt["status"] == "CORRECTED_EXISTING_BINDING"
            and receipt["operation"] == "BINDING_COURSE_SPELLING_CORRECTION"
            and receipt["approvalCreated"] is False
            and receipt["metadataApprovalStatus"] == "NOT_CREATED"
            and receipt["examFinalQaStatus"] == "NOT_EVALUATED"
            and receipt["packVersionBefore"] == "1.0.8"
            and receipt["packVersionAfter"] == "1.0.9", "Wrong dependency receipt operation/version")
    require(receipt["correction"] == request["correction"]
            and receipt["sourceSnapshots"] == request["sourceSnapshots"]
            and receipt["preservedConsumers"] == request["preservedConsumers"], "Dependency closure differs")
    correction = receipt["correction"]
    require(correction["path"] == BINDINGS and correction["collection"] == "bindings"
            and correction["after"] == {**correction["before"], "standardCourse": "중1 수학"}
            and correction["before"]["standardCourse"] == "中1 수학"
            and correction["after"]["problemTypeKey"] == "PT_M1_LINEAR_EQUATION_SOLVING"
            and correction["after"]["curriculum"] == "2022"
            and correction["after"]["standardUnitKey"] == "M1-03"
            and correction["after"]["subUnitKey"] == "M1-03-LINEAR_EQUATION"
            and correction["after"]["ownerPack"] == "MIDDLE1"
            and correction["after"]["status"] == "ACTIVE", "Unexpected shared binding correction")
    base_bindings = baseline_doc(BINDINGS)["bindings"]
    require(base_bindings[154] == correction["after"]
            and sum(r == correction["after"] for r in base_bindings) == 1,
            "Published /bindings/154 must be the unique exact corrected row")
    require(len(receipt["sourceSnapshots"]) == 2 and len(receipt["preservedConsumers"]) == 5,
            "Shared correction must preserve exactly two sources/five UIDs")
    require({r["questionUid"] for r in receipt["preservedConsumers"]}
            == set(correction["after"]["supportingQuestionUids"]), "Shared UID closure differs")
    for snapshot in receipt["sourceSnapshots"]:
        raw = from_main("archive/exams/" + snapshot["sourceArchiveFile"])
        require(sha(raw) == snapshot["expectedSourceSha256"]
                and blob(raw) == snapshot["expectedSourceBlobSha1"], "Published dependency source drift")
    for rel in [PACK, RUNTIME, INDEX, BINDINGS, DEPENDENCY_RECEIPT]:
        require(path(rel).read_bytes() == from_main(rel), "Working dependency differs from actual main: " + rel)

    refs = [ref(DOCS + name, expected) for name, expected in FROZEN.items()]
    ledger = read(DOCS + "04-dongsan-semantic-review.json")
    audit = read(DOCS + "04-dongsan-candidate-independent-check.json")
    native = read(DOCS + "04-dongsan-native-registration-plan.json")
    crossplan = read(DOCS + "04-dongsan-crosswalk-plan.json")
    delta = read(DOCS + "04-dongsan-source-candidate-delta.json")
    require(ledger["metadataReviewed"] is True and ledger["examMathFinalQaPerformed"] is False
            and ledger["fullR1R2R3Rerun"] is False and not audit["discrepancies"], "Metadata review authority is incomplete")
    original = from_main(SOURCE_PATH)
    candidate = path(TMP + "04-dongsan-source-candidate.js").read_bytes()
    require(sha(original) == ORIGINAL_SHA and sha(candidate) == CANDIDATE_SHA
            and path(SOURCE_PATH).read_bytes() == candidate,
            "Root must apply the exact reviewed candidate after the dependency; no source edit is performed here")
    title, bank = parse_bank(candidate)
    old_title, old_bank = parse_bank(original)
    require(title == old_title and len(bank) == len(old_bank) == len(ledger["items"]) == 24,
            "Source/exam/ledger denominator differs")
    require(delta["candidateSourceSha256"] == CANDIDATE_SHA
            and delta["baselineSourceSha256"] == ORIGINAL_SHA, "Candidate delta provenance differs")
    allowed = set(audit["metadataOnlyWhitelist"])
    require(all({k:v for k,v in a.items() if k not in allowed} == {k:v for k,v in b.items() if k not in allowed}
                for a,b in zip(old_bank,bank)), "Protected source payload changed")
    for evidence in audit["normalPreservation"]["assets"]:
        raw = path(evidence["path"]).read_bytes()
        require(sha(raw) == evidence["sha256"] and blob(raw) == evidence["gitBlobSha1"]
                and git("rev-parse", args.baseline_main + ":" + evidence["path"]).decode().strip()
                    == evidence["gitBlobSha1"], "Previously read figure changed: " + evidence["path"])
    slot = audit["normalPreservation"]["fourSlot"]
    slot_raw = path(slot["path"]).read_bytes()
    require(sha(slot_raw) == slot["sha256"] and blob(slot_raw) == slot["gitBlobSha1"]
            and git("rev-parse", args.baseline_main + ":" + slot["path"]).decode().strip()
                == slot["gitBlobSha1"], "Protected four-slot data changed")

    # The durable independent audit proved the exact full projection bytes and
    # the 24-row intake join. The shared correction preserves those bytes. Stop
    # on any global drift; an owner must rebind it rather than waive this proof.
    helper = path(DOCS + "checkpoint-tools/extract-reviewed-exam-projections.py")
    spec = importlib.util.spec_from_file_location("dongsan_projection_read", helper)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    ledger_by_ordinal = {item["ordinal"]:item for item in ledger["items"]}
    require(set(ledger_by_ordinal) == set(range(1,25))
            and len({item["questionUid"] for item in ledger["items"]}) == 24,
            "Durable ledger ordinal/UID denominator differs")
    projection = {}
    for name, rel in [("metadata", "archive/data/question_metadata.json"), ("identity", "archive/data/question_identity_map.json")]:
        rows = [r for r in reader.stream_records(path(rel)) if r.get("sourceArchiveFile") == SOURCE]
        hashes = reader.hashes(path(rel))
        proved = audit["projectionSnapshots"][name]
        require(proved["path"] == rel and proved["sourceRows"] == 24 and proved["intakeRowsExact"] is True
                and hashes["sha256"] == proved["sha256"] and hashes["blobSha1"] == proved["blobSha1"],
                "Projection differs from durable reviewed bytes; owner rebinding required: " + name)
        require(hashes["blobSha1"] == git("rev-parse", args.baseline_main + ":" + rel).decode().strip(),
                "Current projection is not actual baseline main: " + name)
        require(len(rows) == 24 and {r["sourceOrdinal"] for r in rows} == set(range(1,25)),
                "Current projection ordinal denominator differs")
        by_ordinal = {r["sourceOrdinal"]:r for r in rows}
        require(all(by_ordinal[ordinal]["questionUid"] == ledger_by_ordinal[ordinal]["questionUid"]
                    for ordinal in range(1,25)), "Current " + name + " differs from durable ledger UID join")
        projection[name] = {"rows":by_ordinal, "snapshot":{"path":rel, **hashes}}
    expected_shared = {ledger["items"][n-1]["questionUid"] for n in [11,12,13,14]} | {FOREIGN_UID}
    require(expected_shared == set(correction["after"]["supportingQuestionUids"]), "Wrong five shared dependency consumers")

    cross = read(CROSSWALK)
    require(len(cross["records"]) == 281 and cross["records"][:273] == baseline_doc(CROSSWALK)["records"]
            and cross["records"][273:] == crossplan["newRows"], "Exact reviewed eight crosswalk additions are not installed")
    expected_cross_sha = next(r["sha256"] for r in audit["evidenceRefs"] if r["path"] == TMP + "04-dongsan-crosswalk-candidate.json")
    expected_parent_sha = next(r["sha256"] for r in audit["evidenceRefs"] if r["path"] == TMP + "04-dongsan-parents-candidate.json")
    require(sha(path(CROSSWALK).read_bytes()) == expected_cross_sha
            and sha(path(PARENTS).read_bytes()) == expected_parent_sha, "Crosswalk/parent candidate bytes drifted")
    supplement_ref = ref(DERIVED_LABEL_SUPPLEMENT, DERIVED_LABEL_SUPPLEMENT_SHA)
    supplement = read(DERIVED_LABEL_SUPPLEMENT)
    audited_helpers = [r for r in audit["evidenceRefs"] if r["path"] == HELPER]
    require(supplement["schemaVersion"] == "dongsan-derived-label-preconditions-v1"
            and supplement["helperPath"] == HELPER and len(audited_helpers) == 1
            and audited_helpers[0]["sha256"] == supplement["beforeHelperSha"]
            and supplement["sourceCandidateSha256"] == CANDIDATE_SHA
            and supplement["change"]["afterValuesChanged"] is False
            and supplement["change"]["classificationDecisionChanges"] == 0,
            "Derived-label supplement does not bind the original audited helper/candidate")
    ref(HELPER, supplement["afterHelperSha"])
    ref(supplement["officialRegistrarPath"], supplement["officialRegistrarSha256"])
    for evidence in audit["evidenceRefs"]:
        if evidence["path"] == MASTER:
            ref(evidence["path"], evidence["sha256"])
    cross_by_id = {r["id"]:r for r in cross["records"]}
    require(len(cross_by_id) == 281, "Duplicate crosswalk ID")

    registry = copy.deepcopy(native["registryChanges"])
    require(len(registry) == 5 and sum(r["before"] is None for r in registry) == 1, "Expected native template1/spelling4")
    target_uids = {r["questionUid"] for r in ledger["items"]}
    changed_indexes = []
    for change in registry:
        for evidence in change["evidenceRefs"]:
            ref(evidence["path"], evidence["sha256"])
        rows = read(change["path"])[change["collection"]]
        matching = [r for r in rows if all(r.get(k) == v for k,v in change["match"].items())]
        if change["before"] is None:
            require(not matching, "Proposed template appeared concurrently")
        else:
            before = change["before"]
            require(matching == [before] and change["after"] == {**before,"standardCourse":"중1 수학"}
                    and set(before["supportingQuestionUids"]) <= target_uids, "Same-exam spelling before/scope drift")
            changed_indexes.append(base_bindings.index(before))
    require(sorted(changed_indexes) == [151,152,153,155], "Shared154 must not enter the normal exam request")

    refs += [preflight_ref, ref(DEPENDENCY_RECEIPT), ref(HELPER), supplement_ref]
    item_refs = [ref(DOCS + "04-dongsan-semantic-review.json"), ref(DOCS + "04-dongsan-candidate-independent-check.json")]
    items = []
    for ordinal, (decision, q) in enumerate(zip(ledger["items"], bank), 1):
        meta = projection["metadata"]["rows"][ordinal]
        identity = projection["identity"]["rows"][ordinal]
        require(decision["ordinal"] == q["id"] == ordinal
                and decision["questionUid"] == meta["questionUid"] == identity["questionUid"], "Exact ordinal/UID join drift")
        require("level" not in meta and q["level"] == old_bank[ordinal-1]["level"] == meta["legacyLevel"],
                "Unchanged source.level / original before.level:null contract differs")
        item = {"sourceOrdinal":ordinal, "questionUid":decision["questionUid"],
                "preserveCurrentSourceMetadata":True,
                "after":{"curriculumKey":"2022","courseKey":"M1-1","integrationReason":decision["integrationReason"]},
                "reason":decision["reason"], "evidenceRefs":item_refs}
        if decision["rpmEvidenceDebt"]:
            require(ordinal == 17 and q["rpmPrimaryRecordId"] is None and q["rpmPrimaryPath"] is None
                    and decision["exactCrosswalkRecordId"] is None, "Q17 debt must not acquire an RPM leaf")
            item["rpmEvidenceDebt"] = decision["rpmEvidenceDebt"]
            # Native 좌표평면 is not the locked midUnit 좌표와 그래프: do not invent
            # a parent-only bridge or use a FAMILY row as an exact leaf.
        else:
            row = cross_by_id[decision["exactCrosswalkRecordId"]]
            require(row["mappingStatus"] == "DIRECT_ACTIVE" and row["bindingStatus"] == "ACTIVE"
                    and row["curriculum"] == "2022" and row["scope"] == "M1-1"
                    and row["rpmPath"] == q["rpmPrimaryPath"]
                    and all(row[k] == q[k] for k in ["problemTypeKey","templateKey","standardUnitKey","subUnitKey"]),
                    "Exact selected RPM row does not match candidate native metadata")
            item.update(crosswalkPath=CROSSWALK, crosswalkRecordId=row["id"])
            item["after"].update({"rpmL1":row["rpmPath"]["majorUnit"],"rpmL2":row["rpmPath"]["midUnit"],
                                  "rpmL3":row["rpmPath"]["l3"],"rpmL4":row["rpmPath"]["l4"]})
        items.append(item)
    require(sum("crosswalkRecordId" in r for r in items) == 23
            and [r["sourceOrdinal"] for r in items if "rpmEvidenceDebt" in r] == [17], "Exact/debt denominator differs")
    config = {"status":"READY_FOR_METADATA_REQUEST", "reviewScope":"METADATA_ONLY_CURRENT_SOURCE",
              "requestId":args.request_id, "baselineMain":args.baseline_main,
              "expectedCurrentSourceSha256":CANDIDATE_SHA, "baselineSourceSha256":ORIGINAL_SHA,
              "sourceArchiveFile":SOURCE, "expectedQuestionCount":24, "examUid":title,
              "expectedProjectionBlobs":{k:v["snapshot"]["blobSha1"] for k,v in projection.items()},
              "approval":{"type":"FINAL_QA","metadataReviewed":True,"approvedBy":"GPT_ROOT_933015CD0A4F","evidenceRefs":refs},
              "permittedSourceOnlyMetadataFields":["standardUnitOrder","tagStatus","tagConfidence","canonicalBindingStatus",
                                                    "runtimeMaterializationStatus","rpmPrimaryRecordId","rpmCrosswalkStatus","metaNullReason"],
              "registryChanges":registry, "items":items}
    report = {"schemaVersion":"dongsan-config-preparation-v1","status":"CONFIG_BUILT_NOT_REQUESTED_NOT_REGISTERED",
              "baselineMain":args.baseline_main,"dependencyRequestId":DEPENDENCY_ID,
              "dependencyReceipt":ref(DEPENDENCY_RECEIPT),"dependencyRequestCanonicalSha256":receipt["requestSha256"],
              "dependencyHistoricalRequest":{"commit":DEPENDENCY_REQUEST_COMMIT,"path":DEPENDENCY_REQUEST,
                                             "rawSha256":DEPENDENCY_REQUEST_RAW_SHA},
              "dependencyInboxPresenceRequired":False,
              "dependencyPublishedSourceCount":2,"dependencyPublishedConsumerCount":5,"dependencyPackVersion":"1.0.9",
              "questionCount":24,"registryChanges":5,"crosswalkRows":281,"exactRpmItems":23,"rpmDebtOrdinals":[17],
              "sourceLevelPreservedItems":24,"originalMetadataBeforeLevel":None,
              "projectionSnapshots":{k:v["snapshot"] for k,v in projection.items()},
              "mathFinalQaPerformed":False,"officialRequestBuilt":False,"consumerExecuted":False,
              "dependencyPostBuildConsumerProof":"Root-owned closure gate; receipt existence is not a substitute for its final Consumer proof.",
              "nextAction":"Root creates the official request with the existing helper, then performs official isolated projection/Consumer gates."}
    output = path(args.out)
    require(args.out.startswith(TMP) and output.suffix == ".json", "Only scratch config JSON output is permitted")
    report_path = path(args.out + ".build-report.json")
    data = (json.dumps(config,ensure_ascii=False,indent=2)+"\n").encode()
    report["configSha256"] = sha(data)
    report_data = (json.dumps(report,ensure_ascii=False,indent=2)+"\n").encode()
    for p, raw in [(output,data),(report_path,report_data)]:
        require(not p.exists() or p.read_bytes() == raw, "Existing immutable output differs; choose a new --out")
    for p, raw in [(output,data),(report_path,report_data)]:
        if not p.exists():
            with p.open("xb") as handle:
                handle.write(raw)
        require(p.read_bytes() == raw, "Saved scratch bytes differ")
    print(json.dumps({"config":str(output),"sha256":sha(data),"report":str(report_path),"reportSha256":sha(report_data),
                      "status":report["status"],"questions":24,"registryChanges":5,"exactRpm":23,"debt":1},ensure_ascii=False))


if __name__ == "__main__":
    main()
