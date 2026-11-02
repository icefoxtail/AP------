const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath', 'js', 'student.js'), 'utf8');

function extractFunction(sourceText, name) {
  const start = sourceText.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const nextFunction = sourceText.indexOf('\nfunction ', start + 1);
  return sourceText.slice(start, nextFunction === -1 ? sourceText.length : nextFunction);
}

const pinnedPreview = extractFunction(source, 'renderStudentPinnedConsultationPreviewHtml');
assert(
  pinnedPreview.includes('handleDeleteConsultation(${apmsStudentJsString(selected.id)},${apmsStudentJsString(sid)})'),
  'pinned recent consultation preview should expose a delete action'
);
// 2026-11-02 M6: 글자 span(누르는 영역 약 12px)을 실제 버튼(44px)으로 바꿨다. 삭제 동작과 라벨은 그대로다.
assert(
  pinnedPreview.includes('>삭제</button>') && pinnedPreview.includes('ws-link-btn--danger'),
  'pinned recent consultation preview should label the delete action'
);

const listCard = extractFunction(source, 'apStudentConsultationCardHtml');
assert(
  listCard.includes("handleDeleteConsultation('${c.id}', '${sid}')"),
  'consultation list cards should keep their delete action'
);

const deleteHandler = extractFunction(source, 'handleDeleteConsultation');
assert(
  deleteHandler.includes("api.delete('consultations', cid)"),
  'consultation delete handler should call the consultations delete API'
);

console.log('student consultation delete UI contract passed');
