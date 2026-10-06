const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../archive/unit-past-exams-core.js');
const blockedStorage = { getItem: () => null, setItem() { throw new DOMException('Quota exceeded', 'QuotaExceededError'); }, removeItem() {} };

test('Archive 2 unit preparation does not duplicate the question snapshot in legacy browser keys', () => {
  const root = { UnitPastExamsCore: core, location: new URL('https://archive.test/archive/unit-past-exams.html?ready=1'), addEventListener() {} };
  const source = fs.readFileSync(require.resolve('../archive/unit-past-exams.js'), 'utf8');
  const end = source.lastIndexOf('})();');
  vm.runInNewContext(source.slice(0, end) + 'window.testUnit = { state, storeMixedPayload }; })();', {
    window: root, URL, URLSearchParams, document: { getElementById: () => null }, localStorage: blockedStorage,
  });
  root.testUnit.state.profileId = 'h1';
  const unit = core.PROFILES.h1.units[0];
  const meta = root.testUnit.storeMixedPayload(unit, { title: '단원 시험지', snapshotKey: 'unit-test', records: [{ questionUid: 'q-1', sourceFile: 'test.js' }] }, [{ questionUid: 'q-1', content: 'question' }]);
  assert.equal(meta.count, 1);
  assert.equal(meta.questionUids[0], 'q-1');
});

function indexFunction(name) {
  const html = fs.readFileSync(require.resolve('../archive/index.html'), 'utf8');
  let start = html.indexOf('function ' + name + '(');
  if (html.slice(start - 6, start) === 'async ') start -= 6;
  const end = html.indexOf('\nfunction ', start + 1);
  return html.slice(start, end);
}

test('unit assignment uses its in-memory snapshot without requiring legacy localStorage keys', () => {
  const scope = { localStorage: blockedStorage, isUnitPastExamItem: item => item.unitPast === true };
  vm.runInNewContext(indexFunction('getIndexAssignmentMixedPayload') + '\nglobalThis.payload = getIndexAssignmentMixedPayload;', scope);
  const snapshot = { questions: [{ questionUid: 'q-1', content: 'question' }], meta: { title: 'Unit' } };
  const result = scope.payload({ unitPast: true, unitPastSnapshotKey: 'unit-test', outputSnapshot: snapshot });
  assert.deepEqual(JSON.parse(result), snapshot);
});

test('the embedded unit assignment consumes the shared envelope and passes the exact snapshot to class selection', async () => {
  const received = [];
  const questions = [{ questionUid: 'q-1', content: 'question' }];
  const meta = { title: 'Unit', grade: '고1', subject: '공통수학1', qpp: 4 };
  const scope = {
    window: {
      location: new URL('https://archive.test/archive/index.html?unitPastAssign=unit-test&outputRequestId=request-1&outputOwnerId=owner-1&qpp=4'),
      Archive2Output: { readOutputEnvelope: async (...args) => {
        assert.deepEqual(args, ['request-1', 'owner-1', 'exam']);
        return { questions, meta, questionCount: 1 };
      } },
    },
    URL, localStorage: blockedStorage,
    history: { replaceState() {} }, alert(message) { throw new Error(message); },
    openAssignTargetPanel: async (item, qpp) => received.push({ item, qpp }),
  };
  vm.runInNewContext(indexFunction('openPendingUnitPastAssignmentFromUrl') + '\nglobalThis.open = openPendingUnitPastAssignmentFromUrl;', scope);
  await scope.open();
  assert.equal(received.length, 1);
  assert.equal(received[0].qpp, 4);
  assert.equal(received[0].item.unitPastSnapshotKey, 'unit-test');
  assert.equal(JSON.stringify(received[0].item.outputSnapshot), JSON.stringify({ questions, meta }));
});

test('the unit preview republishes an expired cached request instead of reopening a dead output', async () => {
  let calls = 0;
  const root = {
    UnitPastExamsCore: core, location: new URL('https://archive.test/archive/unit-past-exams.html?ready=1'), addEventListener() {},
    Archive2Output: { publishOutputEnvelope: async () => ({ outputRequestId: 'request-' + ++calls, expiresAt: Date.now() + 60000 }) },
  };
  const source = fs.readFileSync(require.resolve('../archive/unit-past-exams.js'), 'utf8');
  vm.runInNewContext(source.slice(0, source.lastIndexOf('})();')) + 'window.testPrepare = prepareOutputEnvelope; })();', {
    window: root, URL, URLSearchParams, document: { getElementById: () => null }, localStorage: blockedStorage,
  });
  const paper = { snapshotKey: 'unit-test' };
  const questions = [{ questionUid: 'q-1' }];
  const first = await root.testPrepare(paper, questions, { title: 'Unit' });
  first.expiresAt = Date.now() - 1;
  const second = await root.testPrepare(paper, questions, { title: 'Unit' });
  assert.equal(calls, 2);
  assert.notEqual(first.outputRequestId, second.outputRequestId);
});
