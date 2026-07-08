import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

function makeContext() {
  const context = {
    state: {
      db: {
        students: [
          { id: 's1', name: '서유나', grade: '중3' },
          { id: 's2', name: '김학생', grade: '중3' },
          { id: 's3', name: '박학생', grade: '중3' }
        ],
        classes: [{ id: 'c1', name: '중3A', grade: '중3' }],
        class_students: [
          { class_id: 'c1', student_id: 's1' },
          { class_id: 'c1', student_id: 's2' }
        ],
        exam_sessions: [{ id: 'sess1', student_id: 's1', exam_title: '기말고사', exam_date: '2026-07-03', score: 72, question_count: 20, archive_file: 'exams/final.js' }],
        school_exam_records: [
          { student_id: 's1', exam_year: 2026, semester: '1학기', exam_type: 'final', subject: '수학', score: 85 },
          { student_id: 's2', exam_year: 2026, semester: '1학기', exam_type: 'final', subject: '수학', score: 75 },
          { student_id: 's3', exam_year: 2026, semester: '1학기', exam_type: 'final', subject: '수학', score: 65 }
        ],
        exam_student_reports: []
      }
    },
    window: {}, document: { querySelectorAll: () => [], getElementById: () => null },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    console, setTimeout, clearTimeout
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'apmath/js/report.js' });
  return context;
}

const c = makeContext();
const student = c.state.db.students[0];
const session = c.state.db.exam_sessions[0];

// 1) 매칭 키 파생
const key = c.reportCenterDeriveSchoolExamKey(session);
assert.equal(key.year, 2026);
assert.equal(key.semester, '1학기');
assert.equal(key.examType, 'final');
assert.equal(key.subject, '수학');
assert.equal(key.isHigh, false);

// 2) 성적표 매칭 → 실제 점수
let resolved = c.reportCenterResolveExamScore(student, session, 'exams/final.js');
assert.equal(resolved.source, 'ledger');
assert.equal(resolved.score, 85);
assert.equal(resolved.percent, 72);

// 3) 평균: 전체 (85+75+65)/3=75, 반 (85+75)/2=80
const avg = c.reportCenterGetLedgerAverages('s1', key);
assert.equal(avg.overallAvg, 75);
assert.equal(avg.classAvg, 80);

// 4) 수동 override 우선
c.state.db.exam_student_reports.push({ archive_file: 'exams/final.js', student_id: 's1', report_type: 'school_exam_score', fields_json: JSON.stringify({ manualScore: 90 }) });
resolved = c.reportCenterResolveExamScore(student, session, 'exams/final.js');
assert.equal(resolved.source, 'manual');
assert.equal(resolved.score, 90);

// 5) 고등 학생은 자동 매칭 안 함 → OMR 폴백
c.state.db.students[0].grade = '고1';
const highKey = c.reportCenterDeriveSchoolExamKey(session);
assert.equal(highKey.isHigh, true);
assert.equal(highKey.subject, '');
const highResolved = c.reportCenterResolveExamScore(student, session, 'exams/nomatch.js');
assert.equal(highResolved.source, 'omr');
assert.equal(highResolved.score, 72);

// 6) 요약 페이지에 실제 점수·평균 반영 (중등, override 제거 상태)
c.state.db.students[0].grade = '중3';
c.state.db.exam_student_reports = [];
const data = c.reportCenterGetExamReportData('s1', 'sess1');
const summary = c.reportCenterBuildSchoolExamPrintSummaryPage(data, [], '');
assert.match(summary, /85점/); // 실제 점수
assert.doesNotMatch(summary, /72점/); // OMR 백분율이 점수로 노출되면 안 됨

console.log('report school exam score ledger test passed');
