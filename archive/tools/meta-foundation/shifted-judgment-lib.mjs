// 번호 밀림 감지(카탈로그 빌더가 쓰는 한 겹): UID는 시험지 안의 자리 번호라, 중간 문항을 지우거나 순서를 바꾸면 한 UID의 판정이 다른 문제에 붙을 수 있다.
// 한 시험지에서 "행이 판정 당시에 본 지문(contentFingerprint)이 더는 자기 문항의 지금 지문이 아닌" 행(움직인 행)을 모아 두고,
// 판정이 지금 발문·보기에 묶이지 않은 문항의 지금 지문이 다른 UID의 움직인 행의 옛 지문과 같으면 "밀림"으로 본다.
// 밀린 문항은 옛 판정을 힌트로 싣지 않는다(다른 문제에 대한 판정이므로). 수정한 문항에 판정을 유지하는 규칙(재결속 기록)과는 겹치지 않는다: 묶인 문항은 대상이 아니다.
// rows: [{ uid, anchorFp, currentFp }] — 시험지 한 개의 문항 전부(anchorFp는 행이 없으면 빈 값).
export function movedAnchorOwners(rows) {
  const owners = new Map();
  for (const { uid, anchorFp, currentFp } of rows) {
    if (!uid || !anchorFp || anchorFp === currentFp) continue;
    if (!owners.has(anchorFp)) owners.set(anchorFp, new Set());
    owners.get(anchorFp).add(uid);
  }
  return owners;
}

export function isShiftedJudgment(owners, currentFp, uid) {
  const holders = owners.get(currentFp);
  return Boolean(holders && [...holders].some((other) => other !== uid));
}
