import assert from "node:assert/strict";
import test from "node:test";
import { applyReviewedRepairProjection } from "../archive/tools/meta-foundation/reviewed-runtime-repair-projection.mjs";

test("held M1-06 REPAIR stays out of MIDDLE_GEOMETRY until source release", () => {
  const heldUid = "qid_v1_held_m1_circle";
  const runtimes = new Map([
    ["MIDDLE_GEOMETRY", { runtime: { records: [{ questionUid: heldUid, runtimeSelectable: true }] } }],
    ["MIDDLE1", { runtime: { records: [] } }]
  ]);

  const held = applyReviewedRepairProjection({
    runtimes,
    questionUid: heldUid,
    packId: "MIDDLE_GEOMETRY",
    sourceStatus: "HOLD",
    record: { questionUid: heldUid, standardUnitKey: "M1-06", runtimeSelectable: true }
  });
  assert.deepEqual(held, {
    promoted: false,
    preserved: false,
    affectedPackIds: ["MIDDLE_GEOMETRY"],
    removedFromPackIds: ["MIDDLE_GEOMETRY"]
  });
  assert.equal(runtimes.get("MIDDLE_GEOMETRY").runtime.records.some((row) => row.questionUid === heldUid), false);
  assert.equal(runtimes.get("MIDDLE1").runtime.records.some((row) => row.questionUid === heldUid), false);

  const heldAbsent = applyReviewedRepairProjection({
    runtimes,
    questionUid: "qid_v1_held_m1_circle_not_yet_added",
    packId: "MIDDLE_GEOMETRY",
    sourceStatus: "HOLD",
    recordInPackScope: false,
    record: { questionUid: "qid_v1_held_m1_circle_not_yet_added", standardUnitKey: "M1-06" }
  });
  assert.deepEqual(heldAbsent, {
    promoted: false,
    preserved: false,
    affectedPackIds: ["MIDDLE_GEOMETRY"],
    removedFromPackIds: []
  });

  const priorInScopeUid = "qid_v1_in_scope_h1_graph";
  const inScopeRuntimes = new Map([
    ["FUNCTIONS_GRAPHS", { runtime: { records: [{ questionUid: priorInScopeUid, standardUnitKey: "M1-04", standardCourse: "중1 수학", defaultSelectable: false, runtimeSelectable: false }] } }]
  ]);
  const preserved = applyReviewedRepairProjection({
    runtimes: inScopeRuntimes,
    questionUid: priorInScopeUid,
    packId: "FUNCTIONS_GRAPHS",
    sourceStatus: "HOLD",
    existingRecordInPackScope: true,
    record: { questionUid: priorInScopeUid, defaultSelectable: true, runtimeSelectable: true }
  });
  assert.equal(preserved.preserved, true);
  assert.deepEqual(inScopeRuntimes.get("FUNCTIONS_GRAPHS").runtime.records, [
    { questionUid: priorInScopeUid, standardUnitKey: "M1-04", standardCourse: "중1 수학", defaultSelectable: false, runtimeSelectable: false }
  ]);

  const released = applyReviewedRepairProjection({
    runtimes,
    questionUid: heldUid,
    packId: "MIDDLE_GEOMETRY",
    sourceStatus: "VERIFIED",
    record: { questionUid: heldUid, standardUnitKey: "M1-06", runtimeSelectable: true }
  });
  assert.equal(released.promoted, true);
  assert.deepEqual(released.affectedPackIds, ["MIDDLE_GEOMETRY"]);
  assert.deepEqual(runtimes.get("MIDDLE_GEOMETRY").runtime.records, [
    { questionUid: heldUid, standardUnitKey: "M1-06", runtimeSelectable: true }
  ]);
});
