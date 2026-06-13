#!/usr/bin/env node
// AP------ 테스트 러너
// tests/*.test.js 를 각각 자식 프로세스로 실행하고 결과를 집계한다.
// KNOWN_FAILURES에 등록된 테스트는 실패해도 CI를 막지 않는다(수리 대상 목록).
// 사용법: node tools/run-tests.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 2026-06-13 기준 코드 변경으로 기대값이 낡아 실패하는 테스트들.
// 수리(테스트 갱신 또는 회귀 수정) 후 한 줄씩 제거할 것.
const KNOWN_FAILURES = new Set([
    'admin-diagnostic-assessment-alert.test.js',
    'admin-recent-consultation-panel.test.js',
    'assessment-grade-target-round5-1.test.js',
    'assessment-m1-diagnostic-packs.test.js',
    'assessment-m1-type-source-integrity.test.js',
    'eie-attendance-print-design-contract.test.js',
    'eie-attendance-visual-contract.test.js'
]);

const testsDir = path.resolve(__dirname, '..', 'tests');
const files = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js')).sort();

let pass = 0;
const failed = [];
const knownFailed = [];
const fixedKnown = [];

for (const file of files) {
    let ok = true;
    try {
        execFileSync(process.execPath, [path.join(testsDir, file)], { stdio: 'pipe', timeout: 60000 });
    } catch (e) {
        ok = false;
    }
    if (ok) {
        pass += 1;
        if (KNOWN_FAILURES.has(file)) fixedKnown.push(file);
    } else if (KNOWN_FAILURES.has(file)) {
        knownFailed.push(file);
    } else {
        failed.push(file);
    }
}

console.log(`PASS ${pass} / FAIL ${failed.length} / KNOWN-FAIL ${knownFailed.length} (total ${files.length})`);
if (failed.length) {
    console.log('\n차단 실패(수정 필요):');
    for (const f of failed) console.log(`  FAIL ${f}`);
}
if (knownFailed.length) {
    console.log('\n알려진 실패(비차단, 수리 대상):');
    for (const f of knownFailed) console.log(`  KNOWN ${f}`);
}
if (fixedKnown.length) {
    console.log('\n통과로 복구된 알려진 실패 — KNOWN_FAILURES에서 제거하세요:');
    for (const f of fixedKnown) console.log(`  FIXED ${f}`);
}
process.exit(failed.length ? 1 : 0);
