const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const classroomSource = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');

const modalMatch = classroomSource.match(/function openHomeworkPhotoAssignmentModal\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(modalMatch, 'openHomeworkPhotoAssignmentModal should exist');

const createMatch = classroomSource.match(/async function handleCreateHomeworkPhotoAssignment\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(createMatch, 'handleCreateHomeworkPhotoAssignment should exist');

const listMatch = classroomSource.match(/async function openHomeworkPhotoAssignmentList\s*\([^)]*\)\s*\{([\s\S]*?)async function loadHomeworkPhotoLinksModal/);
assert(listMatch, 'openHomeworkPhotoAssignmentList should exist before link modal loader');

assert(modalMatch[1].includes('>저장</button>'), 'homework assignment primary button should only say save');
assert(!modalMatch[1].includes('저장하고 링크 생성'), 'homework assignment modal should not present link generation as the primary action');
assert(!modalMatch[1].includes('학생별 제출 링크와 QR'), 'homework assignment modal should not mention QR/link creation');

assert(createMatch[1].includes("toast('숙제가 등록되었습니다.', 'success');"), 'homework save should still show success toast');
assert(createMatch[1].includes('closeModal(true);'), 'homework save should close the modal after saving');
assert(!createMatch[1].includes('openHomeworkPhotoLinksModal'), 'homework save should not open student link/QR modal');

assert(!listMatch[1].includes("loadHomeworkPhotoLinksModal('${a.id}')"), 'homework assignment list should not expose the link/QR button');

console.log('homework assignment save-only regression test passed');
