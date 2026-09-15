# Print Engine v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Track steps below.

**Goal:** Replace the three engines' qpp=4 exam layout with a shared print-first compositor and verify the replacement in Chromium.
**Architecture:** Retain normalization and snapshot transactions. Place canonical nodes in four physical equal slots, typeset once, batch fit overflow only, and audit before output.
**Tech Stack:** Browser JavaScript/CSS, Node test runner, Playwright Chromium, existing MathJax.
**Spec:** docs/superpowers/specs/2026-09-15-print-engine-v2.md

## Global Constraints
Four equal slots, column-major order, final partial page placeholders. Preserve content and source identity. Respect recipient/duplex boundaries. No main merge/deployment. Default v2 for compatible qpp=4; special layouts keep existing behavior unless equalSlots=1; slotEngine=legacy rolls back. Keep existing snapshot caches and solution/answer executors.

### Task 1: Implement and connect equal-slot engine
**Files:** Create archive/equal-slot-engine.js and archive/equal-slot-engine.css; modify archive/exam-render-executor.js, archive/engine.html, archive/mixed_engine.html, apmath/wrong_print_engine.html and only necessary final readiness hooks; create tests/equal-slot-engine.test.js.
**Interfaces:** AP interface in spec; adapters retain original formatting and call shared compositor before legacy staging/profiling. Composed Wrong path retains page decorations.
- [x] Write tests for deterministic slot planning, fit candidate selection, invalid geometry and route selection before implementation; run `node --test tests/equal-slot-engine.test.js` to observe failures.
- [x] Implement compositor and integration with explicit return branches and late-decoration finalization. Use existing normalization helpers to build canonical nodes; dispatch qpp=4 before legacy staging/typesetting.
- [x] Run new tests and focused runtime/readiness regressions. Commit only owned files and provide evidence/report.

### Task 2: Real-browser validation and performance evidence
**Files:** tests/equal-slot-engine-browser.cjs, archive/exams/test-fixtures/equal-slot-engine-bank.js, docs/evidence/print-engine-v2-20260915.md.
**Interfaces:** Real entry points and AP public API, no stubbed MathJax for final acceptance. Use slotEngine=legacy on same fixtures as baseline.
- [x] Build shared fixtures and self-serving harness. Assert qpp=4 page counts, equal geometry, source order/text integrity, full bounds/internal clip audit, diagnostics, QR safety, partial pages and print media parity.
- [x] Run before implementation to record the missing v2 contract failure; run after implementation and report failures to implementer.
- [x] Exercise solution/answer mode switching, snapshot hits, Wrong recipient separators, changed inputs and missing-image failure. Capture PDFs/screenshots and compare render metrics without asserting a speed multiplier.
- [x] Record actual commands and limitations in evidence document.

### Task 3: Independent review and replacement handoff
**Files:** review report/evidence and scoped fixes only.
- [x] Independent review of final diff against spec and quality. Address blocking findings and rerun affected tests.
- [x] Verify clean branch, commits and main unchanged. Supply branch/path, launch commands, performance results and rollback instructions.

Execution complete for scoped branch trial; evidence: docs/evidence/print-engine-v2-20260915.md.
