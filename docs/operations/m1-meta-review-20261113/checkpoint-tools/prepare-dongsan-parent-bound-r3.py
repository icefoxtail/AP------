#!/usr/bin/env python3
"""Bind the existing Q17 coarse parent without altering reviewed metadata values.

This prepares request bytes only. It does not register, build, verify, or publish.
"""
import copy
import hashlib
import json
from pathlib import Path
import subprocess


ROOT = Path(subprocess.check_output(
    ["git", "-C", str(Path(__file__).parent), "rev-parse", "--show-toplevel"],
    text=True).strip())
D = "docs/operations/m1-meta-review-20261113/"
BASE = "573fa32804480b2d70f7536b211e240e8d64d5ed"
RID = "m1-dongsan-2025-final-meta-review-20261113-r3"
OLD = D + "04-dongsan-r2-failed-request.json"
PROOF = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/" + RID + ".parent-labels.json"
LEDGER = D + "04-dongsan-semantic-review-rev2.json"
SUPPLEMENT = D + "04-dongsan-q17-parent-link-supplement.json"
UID = "qid_v1_a522a6981ee48b611c9394519acfe249450312545fcf0669ba4928e79b88ccc1"


def raw(rel):
    return (ROOT / rel).read_bytes()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(rel):
    return json.loads(raw(rel))


def ref(rel):
    return {"path": rel, "sha256": sha(raw(rel))}


def put(rel, obj):
    b = (json.dumps(obj, ensure_ascii=False, indent=2) + "\n").encode()
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if p.exists() and p.read_bytes() != b:
        raise RuntimeError("Refusing to overwrite different bytes: " + rel)
    p.write_bytes(b)
    return {"path": rel, "sha256": sha(b), "bytes": len(b)}


old = read(OLD)
assert sha(raw(OLD)) == "b7f05f3f15d6afe1335ceea6771182ba76f82c356e3b6b7f0dd0cc0702b1c653"
assert old["requestId"] == "m1-dongsan-2025-final-meta-review-20261113-r2"
assert len(old["items"]) == old["expectedQuestionCount"] == 24
proof = read(PROOF)
source = subprocess.check_output(["git", "-C", str(ROOT), "show", BASE + ":" + proof["sourcePath"]])
assert proof["sourcePath"] == "archive/data/basic-scope-parent-links.json"
assert proof["sourceSha256"] == sha(source)
rows = [x for x in json.loads(source)["records"] if x.get("curriculumKey") == "2022"
        and x.get("courseKey") == "M1-1" and x.get("standardUnitKey") == "M1-04"
        and x.get("subUnitKey") == "M1-04-COORDINATE_PLANE"]
assert len(rows) == 1 and proof["records"] == rows and proof["derivedRecords"] == []
assert rows[0]["L1"] == "좌표평면과 그래프" and rows[0]["L2"] == "좌표와 그래프"
assert proof["questionUid"] == UID and proof["sourceOrdinal"] == 17
ledger = read(LEDGER)
q17 = next(x for x in ledger["items"] if x["ordinal"] == 17)
assert q17["questionUid"] == UID and q17["rpmEvidenceDebt"]
assert q17["after"]["rpmPrimaryPath"] is None and q17["exactCrosswalkRecordId"] is None
assert q17["effectiveParent"]["curriculum"] == "2022"
assert q17["effectiveParent"]["scope"] == "M1-1"
assert q17["effectiveParent"]["majorUnit"] == rows[0]["L1"]
assert q17["effectiveParent"]["midUnit"] == rows[0]["L2"]
read(SUPPLEMENT)  # Require the independently recorded diagnosis/provenance.

out = copy.deepcopy(old)
out["requestId"] = RID
add = [ref(PROOF), ref(LEDGER), ref(SUPPLEMENT)]
out["approval"]["evidenceRefs"].extend(add)
item = next(x for x in out["items"] if x["questionUid"] == UID)
assert item["sourceOrdinal"] == 17 and "targetParentRef" not in item and "basicScopeParentRef" not in item
item["basicScopeParentRef"] = ref(PROOF)
item["evidenceRefs"].extend(add)
assert all(a["before"] == b["before"] and a["after"] == b["after"]
           and a["questionUid"] == b["questionUid"] and a["sourceOrdinal"] == b["sourceOrdinal"]
           for a, b in zip(old["items"], out["items"]))
assert old["registryChanges"] == out["registryChanges"]
assert old["expectedSourceBlobSha1"] == out["expectedSourceBlobSha1"]
check = copy.deepcopy(out)
check["requestId"] = old["requestId"]
check["approval"]["evidenceRefs"] = old["approval"]["evidenceRefs"]
check["items"][16].pop("basicScopeParentRef")
check["items"][16]["evidenceRefs"] = old["items"][16]["evidenceRefs"]
assert check == old
output = put(".tmp/m1-meta-review/04-dongsan-actual573-r3.request.json", out)
report = {
    "schemaVersion": "existing-exam-parent-reference-request-supplement-v1",
    "baselineMain": BASE, "inputRequest": ref(OLD), "outputRequest": output,
    "parentEvidence": ref(PROOF), "semanticLedger": ref(LEDGER),
    "diagnosisSupplement": ref(SUPPLEMENT), "targetOrdinal": 17,
    "questionUid": UID, "questionCount": 24, "beforeAfterValuesChanged": 0,
    "registryChangesChanged": 0, "normalSourceContentChanged": False,
    "exactRpmLeafCount": 23, "rpmDebtOrdinals": [17], "leafAssignedToDebt": False,
    "officialRegistrarChanged": False, "registrationOrConsumerExecuted": False,
    "changes": ["new requestId", "Q17 basicScopeParentRef to existing exact baseline parent",
                "SHA-bound parent, semantic revision, and diagnosis evidence references"],
}
info = put(D + "04-dongsan-r3-request-binding.json", report)
print(json.dumps({"request": output, "report": info}, ensure_ascii=False))
