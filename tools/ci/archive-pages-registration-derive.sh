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

materialize() {
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
