'use strict';
// 원본 시험지 JS(window.questionBank)를 읽어 중1 2학기 기말 모의고사 후보 풀을 만든다.
// 원본은 읽기만 한다. 선정 결과는 selection-m1-2final-mock.json 에 기록하고, build 스크립트가 사본을 조립한다.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ARCHIVE_ROOT = path.resolve(__dirname, '..', '..');
const EXAMS_ROOT = path.join(ARCHIVE_ROOT, 'exams');
const M1_DIRS = ['original/middle/m1/2final', 'original/middle/m1/2mid'];

function listExamFiles() {
  const out = [];
  for (const dir of M1_DIRS) {
    const abs = path.join(EXAMS_ROOT, dir);
    for (const name of fs.readdirSync(abs)) {
      if (name.endsWith('.js') && fs.statSync(path.join(abs, name)).isFile()) out.push(`${dir}/${name}`);
    }
  }
  return out.sort();
}

function loadExam(relFile) {
  const code = fs.readFileSync(path.join(EXAMS_ROOT, relFile), 'utf8');
  const sandbox = { window: {} };
  sandbox.window.window = sandbox.window;
  vm.runInNewContext(code, sandbox, { filename: relFile });
  return { title: sandbox.window.examTitle || '', questions: sandbox.window.questionBank || [] };
}

function parseSource(relFile) {
  const base = path.basename(relFile, '.js');
  const m = base.match(/^(\d{2})_(.+?)_(\d)학기_(중간|기말)_/);
  return {
    year: m ? 2000 + Number(m[1]) : 0,
    school: m ? m[2] : '',
    semester: m ? m[3] : '',
    examType: m ? (m[4] === '기말' ? 'final' : 'mid') : '',
  };
}

module.exports = { ARCHIVE_ROOT, EXAMS_ROOT, listExamFiles, loadExam, parseSource };
