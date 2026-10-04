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
assert(
  pinnedPreview.includes('>삭제</span>'),
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
