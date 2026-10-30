#!/usr/bin/env bash
# Pages registration derivation: materialize reviewed META_V2 payloads, rebuild registration data, verify.
#   archive-pages-registration-derive.sh materialize   (steps 1-2)
#   archive-pages-registration-derive.sh verify        (verification list)
#   archive-pages-registration-derive.sh all           (the --regenerate command of the race-safe push helper)
# Logs are tee'd into $RELEASE_EVIDENCE_DIR exactly like the workflow steps always did.
set -euo pipefail
: "${RELEASE_EVIDENCE_DIR:?RELEASE_EVIDENCE_DIR is required}"
mkdir -p "$RELEASE_EVIDENCE_DIR"
phase="${1:-all}"

# Meta Foundation compiled/ + canonical/registry_index.json + geometry runtime/evidence are pure functions of the
# canonical packs. A human commit that edits canonical packs without recompiling left them stale and tests
# meta-foundation-global-compile / *-runtime red on main until someone noticed (3dd29226 .. b71def20); everything
# below (catalog input manifest, readiness receipts) hashes these files, so they are refreshed FIRST.
# A canonical defect (alias collision, broken parent, ...) makes the compiler refuse to write: that is a real
# content defect owned by CI (global-compile test), not a reason to block the student release, so it is reported
# as a warning and the previously committed files are used unchanged.
refresh_meta_foundation_compiled() {
  if node archive/tools/meta-foundation/compile-meta-foundation.mjs --write 2>&1 | tee "$RELEASE_EVIDENCE_DIR/meta-foundation-compile-write.log"; then
    return 0
  fi
  echo "::warning title=Meta Foundation compile::compile-meta-foundation --write refused (canonical defect); compiled artifacts left unchanged. See meta-foundation-compile-write.log and the CI global-compile test."
  git checkout -- archive/data/meta-foundation/compiled archive/data/meta-foundation/canonical/registry_index.json \
    archive/data/meta-foundation/runtime/geometry-equations-v1.json archive/data/meta-foundation/evidence/geometry-equations/v1 2>/dev/null || true
  return 0
}

materialize() {
  refresh_meta_foundation_compiled
  node archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs --write 2>&1 | tee "$RELEASE_EVIDENCE_DIR/meta-v2-materializer-write.log"
  python archive/build_db.py 2>&1 | tee "$RELEASE_EVIDENCE_DIR/archive-registration-build.log"
}

verify() {
  node tests/archive-meta-v2-materializer.test.mjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/meta-v2-materializer-tests.log"
  node tests/archive2-meta-v2-semantic-authority.test.cjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/meta-v2-authority-tests.log"
  node archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs --check 2>&1 | tee "$RELEASE_EVIDENCE_DIR/meta-v2-materializer-check.log"
  node tests/archive-question-identity-contract.test.mjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/question-identity-contract-tests.log"
  node tests/archive-question-identity-runtime.test.mjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/question-identity-runtime-tests.log"
  node tests/jeil-legacy-similar-22-registration.test.cjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/jeil-registration-tests.log"
  node tests/palma-legacy-similar-23-registration.test.cjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/palma-registration-tests.log"
  node archive/tools/verify-archive-registration.mjs 2>&1 | tee "$RELEASE_EVIDENCE_DIR/archive-registration-parity.log"
  git diff --check
}

case "$phase" in
  materialize) materialize ;;
  verify) verify ;;
  all) materialize; verify ;;
  *) echo "usage: $0 materialize|verify|all" >&2; exit 2 ;;
esac
