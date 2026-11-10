'use strict';

// Synthetic UI fixtures only. No production student, token, question, or answer.
function createStudentPortalFixture() {
  const today = new Date().toISOString().slice(0, 10);
  const student = { id: 'qa-student', name: '테스트 학생', grade: '중2', school_name: 'QA 학교' };
  const exam = (id, title, extra = {}) => ({
    assignment_id: id, class_name: 'QA 반', exam_title: title,
    exam_date: today, question_count: 20, archive_file: 'qa-only.js',
    is_submitted: 0, wrong_ids: [], ...extra
  });
  const snapshot = sourceKind => JSON.stringify({
    meta: { sourceKind, outputContractVersion:'archive2-v1', qpp:2,
      title:'합성 검수 자료', questionUids:['qa-placeholder-1','qa-placeholder-2'] },
    questions: [1,2].map(id => ({ id, questionUid:'qa-placeholder-'+id,
      question:'합성 UI 검수 문항 '+id, answer:'', solution:'' }))
  });
  return {
    student,
    session: { student_id: student.id, name: student.name, grade: student.grade,
      school_name: student.school_name, student_token: 'qa-fixture-token', pin: '0000' },
    exams: [
      exam('qa-pending', '삼각형의 성질 · 개념 확인', { clinic_lineage:{
        status:'verified', mode:'same_uid', sourceAttemptState:'recorded',
        source:{ assignmentId:'qa-complete', examTitle:'확률 · 단원 마무리', examDate:today, questionCount:20, availability:'available' },
        sourceAttempt:{ submissionStatus:'submitted', scoreAvailable:true, score:87, examDate:today }
      } }),
      exam('qa-complete', '확률 · 단원 마무리', { is_submitted: 1, score: 87, wrong_ids: [2, 7], session_id: 'qa-session', clinic_lineage:{
        relation:'source_of_follow_up', derivedAssignments:[{ assignmentId:'qa-pending', examTitle:'삼각형의 성질 · 개념 확인', examDate:today, mode:'same_uid' }]
      } }),
      exam('qa-unknown', '제출 상태가 없는 시험지', { is_submitted: null }),
      exam('qa-cancelled', '취소된 시험지 · 복습용', { is_cancelled: true, is_review_only: true, is_submitted: 1, score: 75 }),
      exam('qa-replaced', '대체된 시험지 · 복습용', { is_replaced: true, is_review_only: true, is_submitted: 1, score: 80 }),
      exam('qa-missing', '원본이 없는 시험지', { archive_file: '', is_submitted: 0 }),
      exam('qa-old', '예전 시험지 · 긴 제목의 줄바꿈과 버튼 배치를 확인하는 자료', { exam_date: '2024-01-15', is_submitted: 1, score: 70 }),
      exam('qa-mixed-missing', '이전 출제본 · 복습 자료 없음', { archive_file: 'MIXED:qa-no-snapshot', is_submitted: 1, score: 60 }),
      exam('qa-pdf', 'PDF 준비 상태 시험지', { pdf_status: 'generating' }),
      exam('qa-readonly', '열람 전용 참고 시험지', { is_review_only:true }),
      exam('qa-previous', '이전 달에 나온 미제출 시험지', { exam_date:'2024-01-16' }),
      exam('qa-original', '저장된 원본 출제본', { question_count:2, is_submitted:1, score:50, mixed_payload_json:snapshot('archive2-original') }),
      exam('qa-mixed', '저장된 혼합 출제본', { archive_file:'MIXED:qa-snapshot', question_count:2, is_submitted:1, score:50, mixed_payload_json:snapshot('archive2-mixed') })
    ],
    assignments: [
      { assignment_id: 'qa-homework', class_name: 'QA 반', title: '수학 학습지 사진 제출', description: '풀이가 보이도록 사진을 올려 주세요.', due_date: today, due_time: '23:00', is_submitted: 0 },
      { assignment_id: 'qa-homework-done', class_name: 'QA 반', title: '지난 학습지 확인', description: '이미 제출한 과제입니다.', is_submitted: 1, submitted_at: today }
    ],
    packets: [
      { packet_key: 'qa-clinic', title: '삼각형 오답 클리닉', source_class_name: 'QA 반', mode: 'wrong', created_at: today, item_count: 12, is_submitted: 1, review_wrong_ids: [3] },
      { packet_key: 'qa-clinic-pending', title: '아직 확인하지 않은 클리닉', source_class_name: 'QA 반', mode: 'wrong', created_at: today, item_count: 8, is_submitted: 0, review_wrong_ids: [] },
      { packet_key: 'qa-clinic-unknown', title: '제출 상태를 확인할 클리닉', source_class_name:'QA 반', mode:'wrong', created_at:today, item_count:5, is_submitted:null, review_wrong_ids:[] }
    ],
    materials: [1,2,3].map((number,index) => ({ assignment_id:index ? 'qa-material-'+number : 'qa-material', assignment_title:'수업자료 '+number+' · 1~120번', material_title:'기본 개념 연습', class_name:'QA 반', assigned_date:today, is_submitted:0 })),
    learning: { success: true, rows: [
      { sessionId:'qa-session', assignmentId:'qa-complete', title:'확률 · 단원 마무리', className:'QA 반', examDate:today, score:87, questionCount:20, state:'complete', counts:{ observed:20, correct:18, wrong:2, unchecked:0 }, sourceRefs:{ kind:'assignment', assignmentId:'qa-complete', sessionId:'qa-session' } },
      { sessionId:'qa-partial', assignmentId:'qa-old', title:'일부 문항만 확인한 기록', className:'QA 반', examDate:'2024-01-15', score:70, questionCount:20, state:'partial', itemsMissing:true, counts:{ observed:20, correct:10, wrong:4, partial:2, unchecked:4 } },
      { sessionId:'qa-legacy', title:'오답 수만 남아 있는 이전 기록', examDate:'2024-01-10', questionCount:20, state:'legacy', counts:{ wrong:3 } }
    ], page: { hasMore: false, nextCursor: null }, summary: { attempts:{ loaded:3 }, questions:{ observed:40, correct:28, wrong:6, partial:2, unchecked:4 }, uniqueQuestion:{ confirmed:30, unverified:10 }, unclassified:{ legacyWrongs:3 } }, types: [
      { key:'qa-type', label:'도형의 성질', depth:3, observed:20, wrong:2, evidence:[{ assignmentId:'qa-complete',sessionId:'qa-session' }] }
    ] },
    plans: [ { id: 'qa-plan', title: '삼각형 오답 다시 풀기', subject: '수학', plan_date: today, is_done: 0, updated_at: today + 'T00:00:00Z' } ]
  };
}

// Optional local preview adapter. Injected into HTTP responses by the test server
// only; never linked from a production page. It replaces fetch, not app logic.
function installStudentPortalBrowserFixture(createFixture, initialScenario) {
  const scenario = initialScenario || localStorage.getItem('APMATH_QA_SCENARIO') || 'normal';
  localStorage.setItem('APMATH_QA_SCENARIO', scenario);
  const data = createFixture();
  const state = { scenario, requests: [], data };
  window.__studentPortalQa = state;
  if (scenario === 'empty') { data.exams=[]; data.assignments=[]; data.packets=[]; data.materials=[]; }
  if (scenario === 'high-school') data.student.grade=data.session.grade='고2';
  if (scenario === 'logged-out') localStorage.removeItem('APMATH_STUDENT_PORTAL_SESSION');
  else localStorage.setItem('APMATH_STUDENT_PORTAL_SESSION', JSON.stringify(data.session));
  if (scenario === 'teacher') localStorage.setItem('APMATH_SESSION', JSON.stringify({ session_token:'qa-teacher-fixture-token' }));
  const originalFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin === location.origin) return originalFetch(input, init);
    if (url.hostname !== 'ap-math-os-v2612.js-pdf.workers.dev') return new Response('', { status:200 });
    const endpoint = url.pathname.replace(/^\/api\//, '');
    let body = null;
    try { body=JSON.parse(init?.body || 'null'); } catch (_) {}
    state.requests.push({ endpoint, method:init?.method || 'GET', body });
    const json=(value,status=200) => new Response(JSON.stringify(value), { status, headers:{'Content-Type':'application/json'} });
    if (endpoint === 'student-portal/auth') return json({success:true,student:data.student,student_token:data.session.student_token});
    if (endpoint === 'student-portal/home') return json({success:true,student:data.student,assignments:data.assignments,class_exam_assignments:data.exams,read_only:scenario==='teacher'});
    if (endpoint === 'student-portal/exams') {
      if (scenario === 'error') return json({success:false,message:'QA 시험지 조회 실패'},503);
      if (scenario === 'late') await new Promise(resolve => setTimeout(resolve,1500));
      return json({success:true,exams:data.exams});
    }
    if (endpoint === 'student-portal/wrong-clinics') return json({success:true,packets:data.packets});
    if (endpoint === 'student-portal/learning-history') return json(data.learning);
    if (endpoint === 'student-portal/omr-submit') {
      await new Promise(resolve => setTimeout(resolve,350));
      if (scenario === 'reject-submit') return json({success:false,message:'QA 제출 실패: 다시 시도하세요.'},503);
      const exam=data.exams.find(x=>x.assignment_id===body.assignment_id);
      if(!exam || exam.is_submitted || exam.is_review_only || exam.is_cancelled) return json({success:false,message:'이미 제출했거나 제출할 수 없는 시험지입니다.'},409);
      Object.assign(exam,{is_submitted:1,score:83,wrong_ids:body.wrong_ids,session_id:'qa-new-session'});
      return json({success:true,session:{id:'qa-new-session',score:83,wrong_ids:body.wrong_ids}});
    }
    if (/^student-portal\/wrong-clinics\/[^/]+\/(submit|review-wrongs)$/.test(endpoint)) {
      const packet=data.packets.find(x=>endpoint.includes(x.packet_key+'/'));
      if(packet) Object.assign(packet,{is_submitted:1},endpoint.endsWith('review-wrongs')?{review_wrong_ids:body.wrong_ids}:{});
      return json({success:true,packet});
    }
    if(endpoint==='material-omr/student-assignments') return json({success:true,items:data.materials});
    if(endpoint==='material-omr/assignment') return json({success:true,material:{title:'기본 개념 연습',number_start:1,number_end:120},assignment:{title:'수업자료 1~120번'},submission:null});
    if(endpoint==='material-omr/submit') return json({success:true});
    if(endpoint==='planner-auth') return json({success:true,student:data.student});
    if(endpoint==='planner') return json({success:true,plans:data.plans,feedback:[]});
    if(endpoint==='homework-photo/assignment') return json({success:true,assignment:data.assignments[0],student:data.student,submission:null});
    if(endpoint==='homework-photo/auth') return json({success:true});
    return json({success:false,message:'Unhandled QA fixture endpoint: '+endpoint},501);
  };
}

module.exports = { createStudentPortalFixture, installStudentPortalBrowserFixture };
