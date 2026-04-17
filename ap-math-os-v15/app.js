const STORAGE_KEY = 'ap_math_os_v15';
const now = () => new Date().toISOString();
const uid = (p) => `${p}_${Math.random().toString(36).slice(2,10)}`;
const KR = (s='') => s || '-';

const initialState = () => ({
  meta:{appName:'AP Math OS',schemaVersion:'15.0.0-final',lastUpdatedAt:now()},
  auth:{currentUser:null,users:[{id:'user_admin',username:'admin',password:'1234',name:'관리자',role:'director',createdAt:now(),updatedAt:now()}]},
  db:{
    students:[
      {id:'student_1',name:'김민준',schoolName:'순천고등학교',grade:'고1',studentPhone:'010-1111-2222',status:'재원',joinDate:'2026-03-01',memo:'서술형 보완 필요',classIds:['class_1'],parentIds:['parent_1'],createdAt:now(),updatedAt:now()},
      {id:'student_2',name:'이서윤',schoolName:'왕운중학교',grade:'중3',studentPhone:'010-2222-3333',status:'재원',joinDate:'2026-02-15',memo:'오답 반복 관리 중',classIds:['class_2'],parentIds:['parent_2'],createdAt:now(),updatedAt:now()}
    ],
    parents:[
      {id:'parent_1',name:'김영희',phone:'010-9999-8888',relation:'모',kakaotalkEnabled:true,studentIds:['student_1'],memo:'상담 선호',createdAt:now(),updatedAt:now()},
      {id:'parent_2',name:'이정훈',phone:'010-8888-7777',relation:'부',kakaotalkEnabled:true,studentIds:['student_2'],memo:'문자 우선',createdAt:now(),updatedAt:now()}
    ],
    classes:[
      {id:'class_1',name:'고1 심화 A',course:'내신심화',teacherName:'박원장',schoolLevel:'고등',grade:'고1',subject:'공통수학',scheduleIds:['schedule_1'],studentIds:['student_1'],createdAt:now(),updatedAt:now()},
      {id:'class_2',name:'중3 완성 B',course:'내신완성',teacherName:'박원장',schoolLevel:'중등',grade:'중3',subject:'중3 수학',scheduleIds:['schedule_2'],studentIds:['student_2'],createdAt:now(),updatedAt:now()}
    ],
    schedules:[
      {id:'schedule_1',classId:'class_1',dayOfWeek:'월',startTime:'18:00',endTime:'20:00',room:'A강의실',createdAt:now(),updatedAt:now()},
      {id:'schedule_2',classId:'class_2',dayOfWeek:'수',startTime:'19:00',endTime:'21:00',room:'B강의실',createdAt:now(),updatedAt:now()}
    ],
    attendance:[
      {id:'att_1',studentId:'student_1',classId:'class_1',date:'2026-04-15',status:'출석',reason:'',note:'',createdAt:now()},
      {id:'att_2',studentId:'student_2',classId:'class_2',date:'2026-04-16',status:'지각',reason:'교통',note:'10분 지각',createdAt:now()}
    ],
    homework:[
      {id:'hw_1',studentId:'student_1',classId:'class_1',title:'다항식 심화 1~20',dueDate:'2026-04-20',status:'미제출',score:0,feedback:'',linkedUnit:'다항식',createdAt:now(),updatedAt:now()},
      {id:'hw_2',studentId:'student_2',classId:'class_2',title:'제곱근 유형 15제',dueDate:'2026-04-19',status:'제출',score:85,feedback:'계산 정교화 필요',linkedUnit:'제곱근',createdAt:now(),updatedAt:now()}
    ],
    counseling:[
      {id:'coun_1',studentId:'student_1',parentId:'parent_1',counselor:'박원장',date:'2026-04-10T19:30',type:'성적',summary:'서술형 누락 반복',actionItems:['서술형 주2회','오답노트 점검'],nextCounselingDate:'2026-04-24',createdAt:now(),updatedAt:now()}
    ],
    examPapers:[
      {id:'exam_1',title:'2026 순천고1 1학기 중간 공통수학',schoolName:'순천고등학교',grade:'고1',year:2026,semester:'1학기',examType:'중간',subject:'공통수학',rangeText:'다항식~방정식',totalQuestions:3,questionIds:['q_1','q_2','q_3'],sourceType:'기출',tags:['순천고','고1'],createdAt:now(),updatedAt:now()},
      {id:'exam_2',title:'2026 왕운중 1학기 중간 중3수학',schoolName:'왕운중학교',grade:'중3',year:2026,semester:'1학기',examType:'중간',subject:'중3 수학',rangeText:'제곱근과 실수',totalQuestions:2,questionIds:['q_4','q_5'],sourceType:'기출',tags:['왕운중','중3'],createdAt:now(),updatedAt:now()}
    ],
    questions:[
      {id:'q_1',examPaperId:'exam_1',number:1,type:'객관식',difficulty:'중',category:'다항식',standardUnit:'공통수학-다항식',skillTags:['계산'],answer:'3',sourceReference:'순천고1 1번',linkedVariantIds:[],createdAt:now(),updatedAt:now()},
      {id:'q_2',examPaperId:'exam_1',number:2,type:'객관식',difficulty:'상',category:'인수분해',standardUnit:'공통수학-인수분해',skillTags:['패턴'],answer:'5',sourceReference:'순천고1 2번',linkedVariantIds:['q_4'],createdAt:now(),updatedAt:now()},
      {id:'q_3',examPaperId:'exam_1',number:3,type:'서술형',difficulty:'상',category:'방정식',standardUnit:'공통수학-방정식',skillTags:['서술형'],answer:'x=2',sourceReference:'순천고1 3번',linkedVariantIds:[],createdAt:now(),updatedAt:now()},
      {id:'q_4',examPaperId:'exam_2',number:1,type:'객관식',difficulty:'중',category:'제곱근',standardUnit:'중3-제곱근',skillTags:['계산'],answer:'2',sourceReference:'왕운중 1번',linkedVariantIds:['q_2'],createdAt:now(),updatedAt:now()},
      {id:'q_5',examPaperId:'exam_2',number:2,type:'서술형',difficulty:'상',category:'실수',standardUnit:'중3-실수',skillTags:['서술형'],answer:'4',sourceReference:'왕운중 2번',linkedVariantIds:[],createdAt:now(),updatedAt:now()}
    ],
    examSessions:[
      {id:'session_1',studentId:'student_1',examPaperId:'exam_1',date:'2026-04-12',totalScore:72,averageScore:68,wrongQuestionIds:['q_2','q_3'],note:'시간 부족',createdAt:now(),updatedAt:now()},
      {id:'session_2',studentId:'student_2',examPaperId:'exam_2',date:'2026-04-14',totalScore:58,averageScore:64,wrongQuestionIds:['q_4','q_5'],note:'서술형 약함',createdAt:now(),updatedAt:now()}
    ],
    questionResults:[
      {id:'qr_1',examSessionId:'session_1',studentId:'student_1',questionId:'q_1',isCorrect:true,studentAnswer:'3',earnedScore:4,mistakeType:'',note:'',createdAt:now()},
      {id:'qr_2',examSessionId:'session_1',studentId:'student_1',questionId:'q_2',isCorrect:false,studentAnswer:'2',earnedScore:0,mistakeType:'계산실수',note:'부호',createdAt:now()},
      {id:'qr_3',examSessionId:'session_1',studentId:'student_1',questionId:'q_3',isCorrect:false,studentAnswer:'미완성',earnedScore:2,mistakeType:'시간부족',note:'풀이 미완성',createdAt:now()},
      {id:'qr_4',examSessionId:'session_2',studentId:'student_2',questionId:'q_4',isCorrect:false,studentAnswer:'3',earnedScore:0,mistakeType:'계산실수',note:'근호 계산 오류',createdAt:now()},
      {id:'qr_5',examSessionId:'session_2',studentId:'student_2',questionId:'q_5',isCorrect:false,studentAnswer:'부분정답',earnedScore:2,mistakeType:'서술미흡',note:'풀이 누락',createdAt:now()}
    ],
    wrongAnswers:[
      {id:'wa_1',studentId:'student_1',questionId:'q_2',sourceExamSessionId:'session_1',sourceExamPaperId:'exam_1',category:'인수분해',standardUnit:'공통수학-인수분해',mistakeType:'계산실수',repeatCount:2,lastWrongDate:'2026-04-12',resolved:false,resolutionNote:'',createdAt:now(),updatedAt:now()},
      {id:'wa_2',studentId:'student_1',questionId:'q_3',sourceExamSessionId:'session_1',sourceExamPaperId:'exam_1',category:'방정식',standardUnit:'공통수학-방정식',mistakeType:'시간부족',repeatCount:1,lastWrongDate:'2026-04-12',resolved:false,resolutionNote:'',createdAt:now(),updatedAt:now()},
      {id:'wa_3',studentId:'student_2',questionId:'q_4',sourceExamSessionId:'session_2',sourceExamPaperId:'exam_2',category:'제곱근',standardUnit:'중3-제곱근',mistakeType:'계산실수',repeatCount:2,lastWrongDate:'2026-04-14',resolved:false,resolutionNote:'',createdAt:now(),updatedAt:now()},
      {id:'wa_4',studentId:'student_2',questionId:'q_5',sourceExamSessionId:'session_2',sourceExamPaperId:'exam_2',category:'실수',standardUnit:'중3-실수',mistakeType:'서술미흡',repeatCount:1,lastWrongDate:'2026-04-14',resolved:false,resolutionNote:'',createdAt:now(),updatedAt:now()}
    ],
    reports:[
      {id:'report_1',studentId:'student_1',type:'월간',targetMonth:'2026-04',title:'4월 학습 리포트',content:{summary:'서술형 보완 필요',weakUnits:['방정식','인수분해'],homeworkRate:50},generatedAt:now(),sentAt:'',status:'전송대기'}
    ],
    messageTemplates:[
      {id:'tmpl_1',name:'상담 예약 안내',category:'상담',channelType:'알림톡',templateCode:'ALIM001',body:'[AP수학학원] {학부모명}님, {학생명} 상담이 {상담일시}에 예정되어 있습니다.',variables:['학부모명','학생명','상담일시'],approvalStatus:'승인완료',createdAt:now(),updatedAt:now()}
    ],
    messageLogs:[
      {id:'msg_1',studentId:'student_1',parentId:'parent_1',templateId:'tmpl_1',eventType:'상담예약',status:'성공',sentAt:'2026-04-09T18:00',reservedAt:'',failReason:'',contentSnapshot:'[AP수학학원] 김영희님, 김민준 상담이 2026-04-10 19:30에 예정되어 있습니다.',createdAt:now()}
    ]
  },
  ui:{selectedPage:'dashboard',selectedStudentId:'student_1',selectedClassId:'class_1',selectedExamPaperId:'exam_1',selectedTab:'timeline',search:'',modal:null,modalData:null}
});

let state = loadState();
function loadState(){ try{ const raw=localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw): initialState(); }catch(e){ return initialState(); } }
function saveState(){ state.meta.lastUpdatedAt=now(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function resetState(){ state = initialState(); saveState(); render(); toast('초기화 완료'); }
function exportBackup(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`ap-math-os-backup-${new Date().toISOString().replace(/[:T]/g,'-').slice(0,19)}.json`; a.click(); }
function importBackup(file){ const r=new FileReader(); r.onload=()=>{ try{ const parsed=JSON.parse(r.result); if(!parsed.db||!parsed.auth||!parsed.ui) throw new Error('구조오류'); state=parsed; saveState(); render(); toast('백업 복원 완료'); }catch(e){ toast('백업 복원 실패'); } }; r.readAsText(file); }

function riskBundle(studentId){
  const sessions = state.db.examSessions.filter(x=>x.studentId===studentId).sort((a,b)=>a.date.localeCompare(b.date));
  const hw = state.db.homework.filter(x=>x.studentId===studentId);
  const att = state.db.attendance.filter(x=>x.studentId===studentId);
  const wa = state.db.wrongAnswers.filter(x=>x.studentId===studentId && !x.resolved);
  let scoreDecline=0,homeworkRisk=0,attendanceRisk=0,wrongAnswerRisk=0,counselingRisk=0;
  if(sessions.length>=2){ const recent = sessions.slice(-2).reduce((s,x)=>s+x.totalScore,0)/2; const prev = sessions.slice(0,Math.max(1,sessions.length-2)).reduce((s,x)=>s+x.totalScore,0)/Math.max(1,sessions.length-2); const diff=prev-recent; if(diff>=10) scoreDecline=3; else if(diff>=5) scoreDecline=2; else if(diff>=1) scoreDecline=1; }
  const unsubmitted = hw.filter(x=>x.status==='미제출').length; homeworkRisk = unsubmitted>=2?2:unsubmitted>=1?1:0;
  const abs = att.filter(x=>x.status==='결석').length, late = att.filter(x=>x.status==='지각').length; attendanceRisk = abs>=2?2:(abs>=1||late>=2?1:0);
  wrongAnswerRisk = wa.length>=6?2:wa.length>=3?1:0; if(wa.some(x=>x.repeatCount>=3)) wrongAnswerRisk+=1;
  const recentCoun = state.db.counseling.filter(x=>x.studentId===studentId).sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];
  if(recentCoun && (homeworkRisk||attendanceRisk||wrongAnswerRisk||scoreDecline)) counselingRisk = 1 + ((homeworkRisk+attendanceRisk+wrongAnswerRisk+scoreDecline)>=4?1:0);
  const total = scoreDecline+homeworkRisk+attendanceRisk+wrongAnswerRisk+counselingRisk;
  const level = total>=9?'긴급':total>=6?'조치':total>=3?'관찰':'정상';
  return {scoreDecline,homeworkRisk,attendanceRisk,wrongAnswerRisk,counselingRisk,totalRiskScore:total,riskLevel:level};
}

function studentTimeline(studentId){
  const className = id => state.db.classes.find(x=>x.id===id)?.name || '-';
  const examName = id => state.db.examPapers.find(x=>x.id===id)?.title || '-';
  const templateName = id => state.db.messageTemplates.find(x=>x.id===id)?.name || '-';
  return [
    ...state.db.attendance.filter(x=>x.studentId===studentId).map(x=>({date:`${x.date}T00:00`,title:x.status,desc:`${className(x.classId)} 수업 ${x.status}`,tone:x.status==='결석'?'danger':'info'})),
    ...state.db.homework.filter(x=>x.studentId===studentId).map(x=>({date:`${x.dueDate}T00:00`,title:`숙제 ${x.status}`,desc:`${x.title}`,tone:x.status==='미제출'?'danger':'warn'})),
    ...state.db.counseling.filter(x=>x.studentId===studentId).map(x=>({date:x.date,title:'상담 진행',desc:x.summary,tone:'success'})),
    ...state.db.examSessions.filter(x=>x.studentId===studentId).map(x=>({date:`${x.date}T00:00`,title:'시험 응시',desc:`${examName(x.examPaperId)} · ${x.totalScore}점`,tone:'info'})),
    ...state.db.wrongAnswers.filter(x=>x.studentId===studentId).map(x=>({date:`${x.lastWrongDate}T00:00`,title:x.resolved?'오답 해결':'오답 누적',desc:`${x.category} · ${x.mistakeType} · ${x.repeatCount}회`,tone:x.resolved?'success':'danger'})),
    ...state.db.messageLogs.filter(x=>x.studentId===studentId).map(x=>({date:x.sentAt||x.reservedAt||x.createdAt,title:'알림 발송',desc:`${templateName(x.templateId)} · ${x.status}`,tone:x.status==='실패'?'danger':'success'})),
    ...state.db.reports.filter(x=>x.studentId===studentId).map(x=>({date:x.generatedAt,title:'리포트 생성',desc:x.title,tone:'info'})),
  ].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
}

function latestAverage(studentId){ const s=state.db.examSessions.filter(x=>x.studentId===studentId); return s.length? Math.round(s.reduce((a,b)=>a+b.totalScore,0)/s.length):0; }
function homeworkRate(studentId){ const list=state.db.homework.filter(x=>x.studentId===studentId); if(!list.length) return 0; return Math.round(list.filter(x=>x.status!=='미제출').length/list.length*100); }
function unresolvedCount(studentId){ return state.db.wrongAnswers.filter(x=>x.studentId===studentId&&!x.resolved).length; }
function getStudent(id){ return state.db.students.find(x=>x.id===id); }
function getParent(id){ return state.db.parents.find(x=>x.id===id); }
function getExam(id){ return state.db.examPapers.find(x=>x.id===id); }
function getQuestion(id){ return state.db.questions.find(x=>x.id===id); }

function questionWrongCount(questionId){ return state.db.questionResults.filter(x=>x.questionId===questionId && !x.isCorrect).length; }
function questionAccuracy(questionId){ const rows = state.db.questionResults.filter(x=>x.questionId===questionId); if(!rows.length) return '-'; return Math.round(rows.filter(x=>x.isCorrect).length/rows.length*100)+'%'; }
function classWeakUnits(classId){
  const studentIds = (state.db.classes.find(x=>x.id===classId)?.studentIds)||[];
  const counts = {};
  state.db.wrongAnswers.filter(w=>studentIds.includes(w.studentId)&&!w.resolved).forEach(w=> counts[w.standardUnit]=(counts[w.standardUnit]||0)+1);
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
}
function classExamStats(classId){
  const studentIds = (state.db.classes.find(x=>x.id===classId)?.studentIds)||[];
  const sessions = state.db.examSessions.filter(s=>studentIds.includes(s.studentId));
  const avg = sessions.length ? Math.round(sessions.reduce((a,b)=>a+b.totalScore,0)/sessions.length) : 0;
  return {count:sessions.length, avg, low:sessions.filter(s=>s.totalScore<70).length};
}
function linkedVariants(questionId){ const q=getQuestion(questionId); return (q?.linkedVariantIds||[]).map(getQuestion).filter(Boolean); }

function render(){
  const app = document.getElementById('app');
  app.innerHTML = state.auth.currentUser ? mainLayout() : loginView();
  bindCommon();
}

function loginView(){
  return `<div class="login-wrap"><div class="login-card"><h1>AP Math OS v13</h1><p class="muted mb20">운영형 통합 관리자</p><div class="panel-list"><input id="login-id" class="input" placeholder="아이디" value="admin"><input id="login-pw" class="input" type="password" placeholder="비밀번호" value="1234"><button class="btn primary" id="login-btn">로그인</button></div></div></div>`;
}

function statCard(title,val,sub,tone=''){ return `<div class="card"><div class="sub">${title}</div><div class="stat-value">${val}</div><div class="badge ${tone}">${sub}</div></div>`; }

function mainLayout(){
  const pageTitleMap={dashboard:'홈',students:'학생',classes:'반',exams:'시험',sessions:'시험결과',wrong:'오답',counseling:'상담',reports:'리포트',messages:'메시지',settings:'설정'};
  return `<div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><h1>AP Math OS</h1><p>출제·운영·오답·리포트 통합</p></div>
      <nav class="nav">
        ${navBtn('dashboard','홈')}${navBtn('students','학생')}${navBtn('classes','반')}${navBtn('exams','시험')}${navBtn('sessions','시험결과')}${navBtn('wrong','오답')}${navBtn('counseling','상담')}${navBtn('reports','리포트')}${navBtn('messages','메시지')}${navBtn('settings','설정')}
      </nav>
      <div class="sidebar-footer">${state.auth.currentUser.name}<br>마지막 저장 ${new Date(state.meta.lastUpdatedAt).toLocaleString('ko-KR')}</div>
    </aside>
    <main class="main">
      <div class="topbar">
        <div><h2>${pageTitleMap[state.ui.selectedPage]}</h2><p>시험·문항·오답·반 통계 강화판</p></div>
        <div class="top-actions">
          <input id="global-search" class="search" placeholder="학생명·학교·시험 검색" value="${state.ui.search||''}">
          <button class="btn" id="backup-btn">백업</button>
          <label class="btn" for="restore-input">복원</label><input id="restore-input" type="file" accept="application/json" class="hidden">
          <button class="btn" id="logout-btn">로그아웃</button>
        </div>
      </div>
      <div class="content">${page()}</div>
    </main>
    ${modalHtml()}
  </div>`;
}
function navBtn(key,label){ return `<button class="nav-btn ${state.ui.selectedPage===key?'active':''}" data-page="${key}"><span>${label}</span></button>`; }
function page(){ switch(state.ui.selectedPage){ case 'dashboard': return dashboardPage(); case 'students': return studentsPage(); case 'classes': return classesPage(); case 'exams': return examsPage(); case 'sessions': return sessionsPage(); case 'wrong': return wrongPage(); case 'counseling': return counselingPage(); case 'reports': return reportsPage(); case 'messages': return messagesPage(); case 'settings': return settingsPage(); default:return ''; } }

function dashboardPage(){
  const students=state.db.students.length, unresolved=state.db.wrongAnswers.filter(x=>!x.resolved).length, reports=state.db.reports.length, upcoming=state.db.counseling.filter(x=>x.nextCounselingDate).length;
  const riskStudents = state.db.students.map(s=>({s,r:riskBundle(s.id)})).sort((a,b)=>b.r.totalRiskScore-a.r.totalRiskScore).slice(0,5);
  const actions = [
    ...state.db.homework.filter(x=>x.status==='미제출').map(x=>`${getStudent(x.studentId)?.name} 숙제 미제출`),
    ...state.db.wrongAnswers.filter(x=>!x.resolved && x.repeatCount>=2).map(x=>`${getStudent(x.studentId)?.name} 반복 오답`),
    ...state.db.counseling.filter(x=>x.nextCounselingDate).map(x=>`${getStudent(x.studentId)?.name} 상담 예정 ${x.nextCounselingDate}`),
  ].slice(0,8);
  return `
    <div class="grid-4">
      ${statCard('재원 학생',students,'운영중','info')}
      ${statCard('미해결 오답',unresolved,'누적관리','danger')}
      ${statCard('리포트',reports,'생성본','success')}
      ${statCard('예정 상담',upcoming,'일정관리','warn')}
    </div>
    <div class="split">
      <div class="card"><div class="between mb12"><h3>오늘 할 일</h3><button class="btn small primary" data-pagego="students">학생 보기</button></div><div class="panel-list">${actions.length?actions.map(x=>`<div class="panel-item">${x}</div>`).join(''):`<div class="panel-item">없음</div>`}</div></div>
      <div class="card"><h3>위험 학생</h3><div class="panel-list mt10">${riskStudents.map(({s,r})=>`<div class="panel-item between"><div><strong>${s.name}</strong><div class="sub">${s.schoolName} · ${s.grade}</div></div><div class="badge ${r.riskLevel==='긴급'?'danger':r.riskLevel==='조치'?'warn':r.riskLevel==='관찰'?'info':'success'}">${r.riskLevel} ${r.totalRiskScore}</div></div>`).join('')}</div></div>
    </div>
    <div class="grid-3">
      <div class="card"><h3>최근 시험</h3><div class="panel-list mt10">${state.db.examSessions.slice(-5).reverse().map(x=>`<div class="panel-item">${getStudent(x.studentId)?.name} · ${getExam(x.examPaperId)?.title}<div class="sub">${x.date} · ${x.totalScore}점</div></div>`).join('')}</div></div>
      <div class="card"><h3>상담 일정</h3><div class="panel-list mt10">${state.db.counseling.map(x=>`<div class="panel-item">${getStudent(x.studentId)?.name}<div class="sub">다음 상담 ${KR(x.nextCounselingDate)}</div></div>`).join('')}</div></div>
      <div class="card"><h3>최근 알림</h3><div class="panel-list mt10">${state.db.messageLogs.slice(-5).reverse().map(x=>`<div class="panel-item">${getStudent(x.studentId)?.name}<div class="sub">${x.eventType} · ${x.status}</div></div>`).join('')}</div></div>
    </div>`;
}

function studentsPage(){
  const q=(state.ui.search||'').toLowerCase();
  const list=state.db.students.filter(s=>[s.name,s.schoolName,s.grade].join(' ').toLowerCase().includes(q));
  return `
    <div class="between"><div class="tabs">${['timeline','scores','wrong','homework','attendance','counseling','messages'].map(t=>`<button class="student-tab ${state.ui.selectedTab===t?'active':''}" data-tab="${t}">${({timeline:'타임라인',scores:'성적',wrong:'오답',homework:'숙제',attendance:'출결',counseling:'상담',messages:'연락'}[t])}</button>`).join('')}</div><button class="btn primary" data-open="studentForm">학생 추가</button></div>
    <div class="split">
      <div class="card"><h3>학생 목록</h3><div class="table-wrap mt10"><table class="table"><thead><tr><th>학생</th><th>학교</th><th>반</th><th>평균</th><th>오답</th><th>위험</th><th></th></tr></thead><tbody>${list.map(s=>{ const r=riskBundle(s.id); return `<tr><td><button class="btn small" data-select-student="${s.id}">${s.name}</button><div class="sub">${s.grade}</div></td><td>${s.schoolName}</td><td>${s.classIds.map(id=>state.db.classes.find(c=>c.id===id)?.name).join(', ')}</td><td>${latestAverage(s.id)}</td><td>${unresolvedCount(s.id)}</td><td><span class="badge ${r.riskLevel==='긴급'?'danger':r.riskLevel==='조치'?'warn':r.riskLevel==='관찰'?'info':'success'}">${r.riskLevel}</span></td><td><button class="btn small danger" data-del-student="${s.id}">삭제</button></td></tr>`; }).join('')}</tbody></table></div></div>
      ${studentDetailPanel()}
    </div>`;
}

function studentDetailPanel(){
  const student = getStudent(state.ui.selectedStudentId) || state.db.students[0]; if(!student) return `<div class="card">학생 없음</div>`; state.ui.selectedStudentId=student.id;
  const parents = student.parentIds.map(getParent).filter(Boolean); const rb=riskBundle(student.id); const timeline=studentTimeline(student.id);
  const scoreList=state.db.examSessions.filter(x=>x.studentId===student.id); const wa=state.db.wrongAnswers.filter(x=>x.studentId===student.id); const hw=state.db.homework.filter(x=>x.studentId===student.id); const att=state.db.attendance.filter(x=>x.studentId===student.id); const coun=state.db.counseling.filter(x=>x.studentId===student.id); const msg=state.db.messageLogs.filter(x=>x.studentId===student.id);
  let body='';
  if(state.ui.selectedTab==='timeline') body=`<div class="timeline">${timeline.map(i=>`<div class="timeline-item"><div class="between"><div class="t">${i.title}</div><span class="badge ${i.tone}">${new Date(i.date).toLocaleDateString('ko-KR')}</span></div><div class="d">${i.desc}</div></div>`).join('')}</div>`;
  if(state.ui.selectedTab==='scores') body=`<div class="panel-list">${scoreList.map(x=>`<div class="panel-item between"><div>${getExam(x.examPaperId)?.title}<div class="sub">${x.date}</div></div><div><strong>${x.totalScore}</strong><div class="sub">평균 ${x.averageScore}</div></div></div>`).join('')||'<div class="panel-item">기록 없음</div>'}</div>`;
  if(state.ui.selectedTab==='wrong') body=`<div class="panel-list">${wa.map(x=>`<div class="panel-item between"><div>${x.category}<div class="sub">${x.mistakeType} · ${x.repeatCount}회</div></div><div class="row"><span class="badge ${x.resolved?'success':'danger'}">${x.resolved?'해결':'미해결'}</span>${!x.resolved?`<button class="btn small" data-resolve-wa="${x.id}">해결</button>`:''}</div></div>`).join('')||'<div class="panel-item">없음</div>'}</div>`;
  if(state.ui.selectedTab==='homework') body=`<div class="panel-list">${hw.map(x=>`<div class="panel-item between"><div>${x.title}<div class="sub">마감 ${x.dueDate}</div></div><span class="badge ${x.status==='미제출'?'danger':'success'}">${x.status}</span></div>`).join('')||'<div class="panel-item">없음</div>'}</div>`;
  if(state.ui.selectedTab==='attendance') body=`<div class="panel-list">${att.map(x=>`<div class="panel-item between"><div>${x.date}</div><span class="badge ${x.status==='결석'?'danger':x.status==='지각'?'warn':'success'}">${x.status}</span></div>`).join('')||'<div class="panel-item">없음</div>'}</div>`;
  if(state.ui.selectedTab==='counseling') body=`<div class="panel-list">${coun.map(x=>`<div class="panel-item"><div class="between"><strong>${x.type}</strong><span class="badge info">${String(x.date).slice(0,10)}</span></div><div class="d">${x.summary}</div></div>`).join('')||'<div class="panel-item">없음</div>'}</div>`;
  if(state.ui.selectedTab==='messages') body=`<div class="panel-list">${msg.map(x=>`<div class="panel-item"><div class="between"><strong>${x.eventType}</strong><span class="badge ${x.status==='성공'?'success':x.status==='대기'?'warn':'danger'}">${x.status}</span></div><div class="d">${x.contentSnapshot}</div></div>`).join('')||'<div class="panel-item">없음</div>'}</div>`;
  return `<div class="card"><div class="between mb12"><div><h3>${student.name}</h3><div class="sub">${student.schoolName} · ${student.grade} · ${student.classIds.map(id=>state.db.classes.find(c=>c.id===id)?.name).join(', ')}</div></div><div class="row wrap"><span class="badge ${rb.riskLevel==='긴급'?'danger':rb.riskLevel==='조치'?'warn':rb.riskLevel==='관찰'?'info':'success'}">${rb.riskLevel} ${rb.totalRiskScore}</span><button class="btn small" data-open="homeworkForm">숙제</button><button class="btn small" data-open="attendanceForm">출결</button><button class="btn small" data-open="counselingForm">상담</button><button class="btn small primary" data-open="messageForm">연락</button></div></div>
    <div class="grid-4 mb16">
      <div class="kpi"><div class="sub">최근 평균</div><div class="v">${latestAverage(student.id)}</div></div>
      <div class="kpi"><div class="sub">숙제 이행률</div><div class="v">${homeworkRate(student.id)}%</div></div>
      <div class="kpi"><div class="sub">미해결 오답</div><div class="v">${unresolvedCount(student.id)}</div></div>
      <div class="kpi"><div class="sub">보호자</div><div class="v">${parents.map(p=>p.name).join(', ')||'-'}</div></div>
    </div>${body}</div>`;
}

function classesPage(){
  const classCards = state.db.classes.map(c=>{ const students=c.studentIds.map(getStudent).filter(Boolean); const stats=classExamStats(c.id); return `<div class="panel-item"><div class="between"><strong>${c.name}</strong><button class="btn small" data-select-class="${c.id}">선택</button></div><div class="sub mt10">${c.course} · ${c.subject} · ${c.teacherName}</div><div class="row wrap mt10"><span class="badge info">학생 ${students.length}</span><span class="badge success">평균 ${stats.avg}</span><span class="badge ${stats.low? 'warn':'success'}">70점 미만 ${stats.low}</span></div></div>`; }).join('');
  const selected = state.db.classes.find(x=>x.id===state.ui.selectedClassId) || state.db.classes[0];
  if(selected) state.ui.selectedClassId=selected.id;
  const students= selected? selected.studentIds.map(getStudent).filter(Boolean):[];
  const weak = selected ? classWeakUnits(selected.id) : [];
  const stats = selected ? classExamStats(selected.id) : {count:0,avg:0,low:0};
  return `<div class="split"><div class="card"><div class="between mb12"><h3>반 목록</h3><button class="btn primary" data-open="classForm">반 추가</button></div><div class="panel-list">${classCards}</div></div><div class="card">${selected?`<h3>${selected.name}</h3><div class="sub">${selected.course} · ${selected.subject} · ${selected.teacherName}</div><div class="grid-4 mt16"><div class="kpi"><div class="sub">학생 수</div><div class="v">${students.length}</div></div><div class="kpi"><div class="sub">응시 수</div><div class="v">${stats.count}</div></div><div class="kpi"><div class="sub">반 평균</div><div class="v">${stats.avg}</div></div><div class="kpi"><div class="sub">70점 미만</div><div class="v">${stats.low}</div></div></div><div class="split-eq mt16"><div class="panel-item"><strong>취약 표준단원 TOP</strong><div class="panel-list mt10">${weak.length?weak.map(([u,c])=>`<div class="between"><span>${u}</span><span class="badge danger">${c}</span></div>`).join(''):'<div class="sub">취약 단원 없음</div>'}</div></div><div class="panel-item"><strong>학생별 성적</strong><div class="panel-list mt10">${students.map(s=>`<div class="between"><span>${s.name}</span><span class="badge ${latestAverage(s.id)>=80?'success':latestAverage(s.id)>=70?'info':'warn'}">${latestAverage(s.id)}점</span></div>`).join('')||'<div class="sub">학생 없음</div>'}</div></div></div><div class="table-wrap mt16"><table class="table"><thead><tr><th>학생</th><th>학교</th><th>평균</th><th>오답</th><th>위험도</th></tr></thead><tbody>${students.map(s=>{const r=riskBundle(s.id); return `<tr><td>${s.name}</td><td>${s.schoolName}</td><td>${latestAverage(s.id)}</td><td>${unresolvedCount(s.id)}</td><td><span class="badge ${r.riskLevel==='긴급'?'danger':r.riskLevel==='조치'?'warn':r.riskLevel==='관찰'?'info':'success'}">${r.riskLevel}</span></td></tr>`}).join('')}</tbody></table></div>`:'반 없음'}</div></div>`;
}

function examsPage(){
  const selected = getExam(state.ui.selectedExamPaperId) || state.db.examPapers[0]; if(selected) state.ui.selectedExamPaperId=selected.id;
  const examRows = state.db.examPapers.map(x=>{ const related = state.db.examSessions.filter(s=>s.examPaperId===x.id); const avg = related.length?Math.round(related.reduce((a,b)=>a+b.totalScore,0)/related.length):0; return `<tr><td>${x.title}<div class="sub">${x.subject}</div></td><td>${x.schoolName}</td><td>${x.grade}</td><td>${x.examType}</td><td>${x.totalQuestions}</td><td>${avg||'-'}</td><td><button class="btn small" data-select-exam="${x.id}">선택</button></td></tr>`}).join('');
  const questions = selected ? state.db.questions.filter(q=>q.examPaperId===selected.id).sort((a,b)=>a.number-b.number) : [];
  return `<div class="split"><div class="card"><div class="between mb12"><h3>시험지 DB</h3><button class="btn primary" data-open="examForm">시험지 추가</button></div><div class="table-wrap"><table class="table"><thead><tr><th>시험지명</th><th>학교</th><th>학년</th><th>유형</th><th>문항</th><th>평균</th><th></th></tr></thead><tbody>${examRows}</tbody></table></div></div><div class="card">${selected?`<div class="between"><div><h3>${selected.title}</h3><div class="sub">${selected.schoolName} · ${selected.grade} · ${selected.rangeText}</div></div><div class="row"><button class="btn small" data-open="questionForm">문항 추가</button><button class="btn small primary" data-pagego="sessions">시험결과</button></div></div><div class="grid-3 mt16"><div class="kpi"><div class="sub">문항 수</div><div class="v">${questions.length}</div></div><div class="kpi"><div class="sub">응시 수</div><div class="v">${state.db.examSessions.filter(x=>x.examPaperId===selected.id).length}</div></div><div class="kpi"><div class="sub">평균 점수</div><div class="v">${(()=>{const rows=state.db.examSessions.filter(x=>x.examPaperId===selected.id); return rows.length?Math.round(rows.reduce((a,b)=>a+b.totalScore,0)/rows.length):0;})()}</div></div></div><div class="table-wrap mt16"><table class="table"><thead><tr><th>번호</th><th>유형</th><th>난이도</th><th>단원</th><th>오답수</th><th>정답률</th><th>유사연결</th></tr></thead><tbody>${questions.map(q=>`<tr><td>${q.number}</td><td>${q.type}</td><td>${q.difficulty}</td><td>${q.category}</td><td>${questionWrongCount(q.id)}</td><td>${questionAccuracy(q.id)}</td><td>${linkedVariants(q.id).map(v=>v.number).join(', ')||'-'}</td></tr>`).join('')}</tbody></table></div><div class="split-eq mt16"><div class="panel-item"><strong>재출제 추천</strong><div class="panel-list mt10">${questions.filter(q=>questionWrongCount(q.id)>=1).map(q=>`<div class="between"><span>${q.number}번 ${q.category}</span><span class="badge danger">오답 ${questionWrongCount(q.id)}</span></div>`).join('')||'<div class="sub">추천 없음</div>'}</div></div><div class="panel-item"><strong>유사문항 연결</strong><div class="panel-list mt10">${questions.map(q=>`<div>${q.number}번 → ${linkedVariants(q.id).length?linkedVariants(q.id).map(v=>v.category).join(', '):'연결 없음'}</div>`).join('')}</div></div></div>`:'시험지 없음'}</div></div>`;
}

function sessionsPage(){
  return `<div class="card"><div class="between mb12"><h3>시험 결과 등록</h3><button class="btn primary" data-open="sessionForm">시험 결과 추가</button></div><div class="table-wrap"><table class="table"><thead><tr><th>학생</th><th>시험지</th><th>일자</th><th>점수</th><th>오답</th></tr></thead><tbody>${state.db.examSessions.slice().reverse().map(s=>`<tr><td>${getStudent(s.studentId)?.name}</td><td>${getExam(s.examPaperId)?.title}</td><td>${s.date}</td><td>${s.totalScore}</td><td>${s.wrongQuestionIds.length}</td></tr>`).join('')}</tbody></table></div></div>`;
}

function wrongPage(){
  return `<div class="grid-3">${statCard('미해결 오답', state.db.wrongAnswers.filter(x=>!x.resolved).length, '누적', 'danger')}${statCard('반복 오답', state.db.wrongAnswers.filter(x=>x.repeatCount>=2&&!x.resolved).length, '2회 이상', 'warn')}${statCard('재출제 후보 단원', recommendations().length, '표준단원 기준', 'info')}</div><div class="split"><div class="card"><h3>오답 목록</h3><div class="table-wrap mt12"><table class="table"><thead><tr><th>학생</th><th>단원</th><th>유형</th><th>반복</th><th>상태</th><th></th></tr></thead><tbody>${state.db.wrongAnswers.map(w=>`<tr><td>${getStudent(w.studentId)?.name}</td><td>${w.category}</td><td>${w.mistakeType}</td><td>${w.repeatCount}</td><td><span class="badge ${w.resolved?'success':'danger'}">${w.resolved?'해결':'미해결'}</span></td><td>${w.resolved?'':`<button class="btn small" data-resolve-wa="${w.id}">해결</button>`}</td></tr>`).join('')}</tbody></table></div></div><div class="card"><h3>재출제 추천</h3><div class="panel-list mt12">${recommendations().map(x=>`<div class="panel-item"><strong>${x.student}</strong><div class="sub">${x.unit} · ${x.count}문항 재훈련 권장</div></div>`).join('')||'<div class="panel-item">없음</div>'}</div></div>`;
}
function recommendations(){ const map={}; state.db.wrongAnswers.filter(x=>!x.resolved).forEach(w=>{ const k=`${w.studentId}|${w.standardUnit}`; map[k]=(map[k]||0)+1; }); return Object.entries(map).filter(([,v])=>v>=1).map(([k,v])=>{ const [sid,unit]=k.split('|'); return {student:getStudent(sid)?.name,unit,count:v}; }).sort((a,b)=>b.count-a.count); }

function counselingPage(){
  return `<div class="split"><div class="card"><div class="between mb12"><h3>상담 기록</h3><button class="btn primary" data-open="counselingForm">상담 추가</button></div><div class="table-wrap"><table class="table"><thead><tr><th>일시</th><th>학생</th><th>유형</th><th>요약</th></tr></thead><tbody>${state.db.counseling.slice().reverse().map(c=>`<tr><td>${String(c.date).slice(0,16).replace('T',' ')}</td><td>${getStudent(c.studentId)?.name}</td><td>${c.type}</td><td>${c.summary}</td></tr>`).join('')}</tbody></table></div></div><div class="card"><h3>예정 상담</h3><div class="panel-list mt12">${state.db.counseling.filter(x=>x.nextCounselingDate).map(c=>`<div class="panel-item between"><div>${getStudent(c.studentId)?.name}<div class="sub">${c.summary}</div></div><span class="badge info">${c.nextCounselingDate}</span></div>`).join('')||'<div class="panel-item">없음</div>'}</div></div>`;
}

function reportsPage(){
  return `<div class="split"><div class="card"><div class="between mb12"><h3>리포트</h3><button class="btn primary" data-open="reportForm">월간 리포트 생성</button></div><div class="table-wrap"><table class="table"><thead><tr><th>학생</th><th>종류</th><th>제목</th><th>상태</th><th></th></tr></thead><tbody>${state.db.reports.map(r=>`<tr><td>${getStudent(r.studentId)?.name}</td><td>${r.type}</td><td>${r.title}</td><td><span class="badge ${r.status==='전송완료'?'success':'warn'}">${r.status}</span></td><td><button class="btn small" data-preview-report="${r.id}">보기</button></td></tr>`).join('')}</tbody></table></div></div><div class="card">${reportPreview()}</div></div>`;
}
function reportPreview(){ const r=state.db.reports[0]; if(!r) return '<h3>미리보기</h3><div class="sub">리포트 없음</div>'; const s=getStudent(r.studentId); return `<h3>리포트 미리보기</h3><div class="panel-item mt12"><strong>${r.title}</strong><div class="sub">${s?.name} · ${r.targetMonth||''}</div><div class="mt10">${typeof r.content==='object'?`${r.content.summary||''}<div class="sub mt10">취약단원: ${(r.content.weakUnits||[]).join(', ')}</div><div class="sub">숙제 이행률: ${KR(r.content.homeworkRate)}%</div>`:r.content}</div><div class="row mt16"><button class="btn">인쇄</button><button class="btn primary" data-open="messageForm">학부모 전송</button></div></div>`; }

function messagesPage(){
  return `<div class="split"><div class="card"><div class="between mb12"><h3>메시지 템플릿</h3><button class="btn primary" data-open="templateForm">템플릿 추가</button></div><div class="panel-list">${state.db.messageTemplates.map(t=>`<div class="panel-item"><div class="between"><strong>${t.name}</strong><span class="badge ${t.approvalStatus==='승인완료'?'success':'warn'}">${t.approvalStatus}</span></div><div class="sub mt10">${t.body}</div></div>`).join('')}</div></div><div class="card"><div class="between mb12"><h3>발송 이력</h3><button class="btn primary" data-open="messageForm">메시지 발송</button></div><div class="table-wrap"><table class="table"><thead><tr><th>학생</th><th>이벤트</th><th>상태</th><th>시각</th></tr></thead><tbody>${state.db.messageLogs.slice().reverse().map(m=>`<tr><td>${getStudent(m.studentId)?.name}</td><td>${m.eventType}</td><td><span class="badge ${m.status==='성공'?'success':m.status==='대기'?'warn':'danger'}">${m.status}</span></td><td>${m.sentAt||m.reservedAt||m.createdAt}</td></tr>`).join('')}</tbody></table></div></div>`;
}

function settingsPage(){
  return `<div class="grid-2"><div class="card"><h3>시스템</h3><div class="panel-list mt12"><div class="panel-item between"><div><strong>스키마 버전</strong><div class="sub">${state.meta.schemaVersion}</div></div><span class="badge info">v13</span></div><div class="panel-item between"><div><strong>저장 키</strong><div class="sub">${STORAGE_KEY}</div></div><span class="badge success">localStorage</span></div></div></div><div class="card"><h3>관리</h3><div class="row wrap mt12"><button class="btn" id="export-settings">백업 내보내기</button><button class="btn danger" id="reset-app">초기화</button></div></div></div>`;
}

function modalHtml(){ if(!state.ui.modal) return ''; const m=state.ui.modal; return `<div class="modal-backdrop" id="modal-close-bg"><div class="modal" onclick="event.stopPropagation()"><div class="between mb12"><h3>${modalTitle(m)}</h3><button class="btn small" id="modal-close">닫기</button></div>${modalBody(m)}</div></div>`; }
function modalTitle(m){ return ({studentForm:'학생 추가',classForm:'반 추가',examForm:'시험지 추가',questionForm:'문항 추가',sessionForm:'시험 결과 추가',homeworkForm:'숙제 추가',attendanceForm:'출결 추가',counselingForm:'상담 추가',templateForm:'템플릿 추가',messageForm:'메시지 발송',reportForm:'월간 리포트 생성'}[m]||'입력'); }
function modalBody(m){
  const studentOpts = state.db.students.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  const classOpts = state.db.classes.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  const parentOpts = state.db.parents.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  const examOpts = state.db.examPapers.map(s=>`<option value="${s.id}">${s.title}</option>`).join('');
  const tmplOpts = state.db.messageTemplates.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  if(m==='studentForm') return `<div class="form-grid"><input class="input" id="f_name" placeholder="학생명"><input class="input" id="f_school" placeholder="학교명"><select class="select" id="f_grade"><option>중1</option><option>중2</option><option>중3</option><option>고1</option><option>고2</option><option>고3</option></select><input class="input" id="f_phone" placeholder="연락처"><select class="select" id="f_status"><option>재원</option><option>휴원</option><option>퇴원</option></select><select class="select" id="f_class"><option value="">반 선택</option>${classOpts}</select><textarea class="textarea full" id="f_memo" placeholder="메모"></textarea><button class="btn primary full" id="save-student">저장</button></div>`;
  if(m==='classForm') return `<div class="form-grid"><input class="input" id="c_name" placeholder="반명"><input class="input" id="c_course" placeholder="과정명"><input class="input" id="c_teacher" placeholder="담당강사" value="박원장"><select class="select" id="c_level"><option>중등</option><option>고등</option></select><select class="select" id="c_grade"><option>중1</option><option>중2</option><option>중3</option><option>고1</option><option>고2</option><option>고3</option></select><input class="input" id="c_subject" placeholder="과목" value="수학"><button class="btn primary full" id="save-class">저장</button></div>`;
  if(m==='examForm') return `<div class="form-grid"><input class="input" id="e_title" placeholder="시험지명"><input class="input" id="e_school" placeholder="학교명"><select class="select" id="e_grade"><option>중1</option><option>중2</option><option>중3</option><option>고1</option><option>고2</option><option>고3</option></select><input class="input" id="e_year" type="number" value="2026"><select class="select" id="e_sem"><option>1학기</option><option>2학기</option></select><select class="select" id="e_type"><option>중간</option><option>기말</option><option>모의</option><option>파이널</option></select><input class="input" id="e_subject" placeholder="과목" value="수학"><input class="input" id="e_range" placeholder="범위"><button class="btn primary full" id="save-exam">저장</button></div>`;
  if(m==='questionForm') return `<div class="form-grid"><select class="select" id="q_exam">${examOpts}</select><input class="input" id="q_no" type="number" placeholder="번호"><select class="select" id="q_type"><option>객관식</option><option>서술형</option></select><select class="select" id="q_diff"><option>하</option><option>중</option><option>상</option></select><input class="input" id="q_cat" placeholder="단원"><input class="input" id="q_std" placeholder="표준단원"><input class="input" id="q_ans" placeholder="정답"><button class="btn primary full" id="save-question">저장</button></div>`;
  if(m==='sessionForm') return `<div class="form-grid"><select class="select" id="s_student">${studentOpts}</select><select class="select" id="s_exam">${examOpts}</select><input class="input" id="s_date" type="date" value="2026-04-17"><input class="input" id="s_avg" type="number" placeholder="기준평균" value="70"><textarea class="textarea full" id="s_note" placeholder="메모"></textarea><textarea class="textarea full" id="s_wrongs" placeholder="오답 입력: 문항번호/점수/오답유형 을 줄마다 입력&#10;예) 2,0,계산실수&#10;3,2,시간부족"></textarea><button class="btn primary full" id="save-session">저장</button></div>`;
  if(m==='homeworkForm') return `<div class="form-grid"><select class="select" id="h_student">${studentOpts}</select><select class="select" id="h_class">${classOpts}</select><input class="input" id="h_title" placeholder="숙제명"><input class="input" id="h_due" type="date"><select class="select" id="h_status"><option>미제출</option><option>제출</option><option>지연제출</option><option>확인완료</option></select><input class="input" id="h_unit" placeholder="단원"><button class="btn primary full" id="save-homework">저장</button></div>`;
  if(m==='attendanceForm') return `<div class="form-grid"><select class="select" id="a_student">${studentOpts}</select><select class="select" id="a_class">${classOpts}</select><input class="input" id="a_date" type="date"><select class="select" id="a_status"><option>출석</option><option>지각</option><option>결석</option><option>보강</option></select><input class="input full" id="a_reason" placeholder="사유"><button class="btn primary full" id="save-attendance">저장</button></div>`;
  if(m==='counselingForm') return `<div class="form-grid"><select class="select" id="co_student">${studentOpts}</select><select class="select" id="co_parent">${parentOpts}</select><input class="input" id="co_counselor" value="박원장"><input class="input" id="co_date" type="datetime-local"><select class="select" id="co_type"><option>학습</option><option>성적</option><option>생활</option><option>진학</option></select><input class="input" id="co_next" type="date"><textarea class="textarea full" id="co_summary" placeholder="상담 요약"></textarea><button class="btn primary full" id="save-counseling">저장</button></div>`;
  if(m==='templateForm') return `<div class="form-grid"><input class="input" id="t_name" placeholder="템플릿명"><select class="select" id="t_cat"><option>상담</option><option>숙제</option><option>시험</option><option>리포트</option></select><select class="select" id="t_channel"><option>알림톡</option><option>문자</option></select><input class="input" id="t_code" placeholder="템플릿 코드"><textarea class="textarea full" id="t_body" placeholder="본문"></textarea><button class="btn primary full" id="save-template">저장</button></div>`;
  if(m==='messageForm') return `<div class="form-grid"><select class="select" id="m_student">${studentOpts}</select><select class="select" id="m_parent">${parentOpts}</select><select class="select" id="m_template">${tmplOpts}</select><input class="input" id="m_event" placeholder="이벤트" value="수동발송"><input class="input full" id="m_reserve" type="datetime-local"><textarea class="textarea full" id="m_snapshot" placeholder="발송 내용"></textarea><button class="btn primary full" id="save-message">발송 기록 저장</button></div>`;
  if(m==='reportForm') return `<div class="form-grid"><select class="select" id="r_student">${studentOpts}</select><input class="input" id="r_month" type="month" value="2026-04"><button class="btn primary full" id="save-report">생성</button></div>`;
  return '';
}

function bindCommon(){
  document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>{ state.ui.selectedPage=b.dataset.page; saveState(); render(); });
  const gs=document.getElementById('global-search'); if(gs) gs.oninput=(e)=>{ state.ui.search=e.target.value; render(); };
  const loginBtn=document.getElementById('login-btn'); if(loginBtn) loginBtn.onclick=()=>{ const id=document.getElementById('login-id').value; const pw=document.getElementById('login-pw').value; const u=state.auth.users.find(x=>x.username===id&&x.password===pw); if(!u) return toast('로그인 실패'); state.auth.currentUser={id:u.id,name:u.name,role:u.role}; saveState(); render(); };
  const logout=document.getElementById('logout-btn'); if(logout) logout.onclick=()=>{ state.auth.currentUser=null; saveState(); render(); };
  document.getElementById('backup-btn')?.addEventListener('click', exportBackup);
  document.getElementById('restore-input')?.addEventListener('change', e=>e.target.files[0]&&importBackup(e.target.files[0]));
  document.getElementById('export-settings')?.addEventListener('click', exportBackup);
  document.getElementById('reset-app')?.addEventListener('click', ()=>confirm('초기화할까요?')&&resetState());
  document.querySelectorAll('[data-pagego]').forEach(b=>b.onclick=()=>{ state.ui.selectedPage=b.dataset.pagego; saveState(); render(); });
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{ state.ui.modal=b.dataset.open; render(); bindCommon(); });
  document.querySelectorAll('[data-select-student]').forEach(b=>b.onclick=()=>{ state.ui.selectedStudentId=b.dataset.selectStudent; render(); bindCommon(); });
  document.querySelectorAll('[data-select-class]').forEach(b=>b.onclick=()=>{ state.ui.selectedClassId=b.dataset.selectClass; render(); bindCommon(); });
  document.querySelectorAll('[data-select-exam]').forEach(b=>b.onclick=()=>{ state.ui.selectedExamPaperId=b.dataset.selectExam; render(); bindCommon(); });
  document.querySelectorAll('.student-tab').forEach(b=>b.onclick=()=>{ state.ui.selectedTab=b.dataset.tab; render(); bindCommon(); });
  document.querySelectorAll('[data-del-student]').forEach(b=>b.onclick=()=>{ const id=b.dataset.delStudent; if(!confirm('삭제할까요?')) return; state.db.students=state.db.students.filter(x=>x.id!==id); state.db.parents.forEach(p=>p.studentIds=(p.studentIds||[]).filter(sid=>sid!==id)); state.db.classes.forEach(c=>c.studentIds=(c.studentIds||[]).filter(sid=>sid!==id)); saveState(); render(); toast('학생 삭제'); });
  document.querySelectorAll('[data-resolve-wa]').forEach(b=>b.onclick=()=>{ const x=state.db.wrongAnswers.find(w=>w.id===b.dataset.resolveWa); if(x){ x.resolved=true; x.resolutionNote='보강 완료'; x.updatedAt=now(); saveState(); render(); toast('오답 해결'); } });
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-close-bg')?.addEventListener('click', closeModal);
  bindModalForms();
}
function closeModal(){ state.ui.modal=null; render(); }

function bindModalForms(){
  const byId=id=>document.getElementById(id);
  byId('save-student')?.addEventListener('click', ()=>{ const s={id:uid('student'),name:byId('f_name').value.trim(),schoolName:byId('f_school').value.trim(),grade:byId('f_grade').value,studentPhone:byId('f_phone').value.trim(),status:byId('f_status').value,joinDate:new Date().toISOString().slice(0,10),memo:byId('f_memo').value.trim(),classIds:byId('f_class').value?[byId('f_class').value]:[],parentIds:[],createdAt:now(),updatedAt:now()}; if(!s.name||!s.schoolName) return toast('학생명/학교명 필요'); state.db.students.push(s); if(s.classIds[0]) state.db.classes.find(c=>c.id===s.classIds[0])?.studentIds.push(s.id); saveState(); closeModal(); toast('학생 저장'); render(); });
  byId('save-class')?.addEventListener('click', ()=>{ const c={id:uid('class'),name:byId('c_name').value.trim(),course:byId('c_course').value.trim(),teacherName:byId('c_teacher').value.trim(),schoolLevel:byId('c_level').value,grade:byId('c_grade').value,subject:byId('c_subject').value.trim(),scheduleIds:[],studentIds:[],createdAt:now(),updatedAt:now()}; if(!c.name) return toast('반명 필요'); state.db.classes.push(c); saveState(); closeModal(); render(); toast('반 저장'); });
  byId('save-exam')?.addEventListener('click', ()=>{ const e={id:uid('exam'),title:byId('e_title').value.trim(),schoolName:byId('e_school').value.trim(),grade:byId('e_grade').value,year:Number(byId('e_year').value||2026),semester:byId('e_sem').value,examType:byId('e_type').value,subject:byId('e_subject').value.trim(),rangeText:byId('e_range').value.trim(),totalQuestions:0,questionIds:[],sourceType:'자체',tags:[],createdAt:now(),updatedAt:now()}; if(!e.title) return toast('시험지명 필요'); state.db.examPapers.push(e); saveState(); closeModal(); render(); toast('시험지 저장'); });
  byId('save-question')?.addEventListener('click', ()=>{ const q={id:uid('q'),examPaperId:byId('q_exam').value,number:Number(byId('q_no').value),type:byId('q_type').value,difficulty:byId('q_diff').value,category:byId('q_cat').value.trim(),standardUnit:byId('q_std').value.trim(),skillTags:[],answer:byId('q_ans').value.trim(),sourceReference:'',linkedVariantIds:[],createdAt:now(),updatedAt:now()}; if(!q.number||!q.category) return toast('문항번호/단원 필요'); state.db.questions.push(q); const exam=getExam(q.examPaperId); exam.questionIds.push(q.id); exam.totalQuestions=exam.questionIds.length; exam.updatedAt=now(); saveState(); closeModal(); render(); toast('문항 저장'); });
  byId('save-homework')?.addEventListener('click', ()=>{ const h={id:uid('hw'),studentId:byId('h_student').value,classId:byId('h_class').value,title:byId('h_title').value.trim(),dueDate:byId('h_due').value,status:byId('h_status').value,score:0,feedback:'',linkedUnit:byId('h_unit').value.trim(),createdAt:now(),updatedAt:now()}; if(!h.title) return toast('숙제명 필요'); state.db.homework.push(h); saveState(); closeModal(); render(); toast('숙제 저장'); });
  byId('save-attendance')?.addEventListener('click', ()=>{ const a={id:uid('att'),studentId:byId('a_student').value,classId:byId('a_class').value,date:byId('a_date').value,status:byId('a_status').value,reason:byId('a_reason').value.trim(),note:'',createdAt:now()}; if(!a.date) return toast('날짜 필요'); state.db.attendance.push(a); saveState(); closeModal(); render(); toast('출결 저장'); });
  byId('save-counseling')?.addEventListener('click', ()=>{ const c={id:uid('coun'),studentId:byId('co_student').value,parentId:byId('co_parent').value,counselor:byId('co_counselor').value.trim(),date:byId('co_date').value,type:byId('co_type').value,summary:byId('co_summary').value.trim(),actionItems:[],nextCounselingDate:byId('co_next').value,createdAt:now(),updatedAt:now()}; if(!c.date||!c.summary) return toast('상담일시/요약 필요'); state.db.counseling.push(c); saveState(); closeModal(); render(); toast('상담 저장'); });
  byId('save-template')?.addEventListener('click', ()=>{ const t={id:uid('tmpl'),name:byId('t_name').value.trim(),category:byId('t_cat').value,channelType:byId('t_channel').value,templateCode:byId('t_code').value.trim(),body:byId('t_body').value.trim(),variables:[],approvalStatus:'승인완료',createdAt:now(),updatedAt:now()}; if(!t.name||!t.body) return toast('템플릿명/본문 필요'); state.db.messageTemplates.push(t); saveState(); closeModal(); render(); toast('템플릿 저장'); });
  byId('save-message')?.addEventListener('click', ()=>{ const snap=byId('m_snapshot').value.trim() || state.db.messageTemplates.find(t=>t.id===byId('m_template').value)?.body || ''; const m={id:uid('msg'),studentId:byId('m_student').value,parentId:byId('m_parent').value,templateId:byId('m_template').value,eventType:byId('m_event').value.trim()||'수동발송',status:byId('m_reserve').value?'대기':'성공',sentAt:byId('m_reserve').value?'':now().slice(0,16),reservedAt:byId('m_reserve').value,failReason:'',contentSnapshot:snap,createdAt:now()}; state.db.messageLogs.push(m); saveState(); closeModal(); render(); toast('메시지 기록 저장'); });
  byId('save-report')?.addEventListener('click', ()=>{ const studentId=byId('r_student').value; const month=byId('r_month').value; const s=getStudent(studentId); const content={summary:`${s.name} 학생 월간 리포트`,weakUnits:state.db.wrongAnswers.filter(x=>x.studentId===studentId&&!x.resolved).map(x=>x.category).slice(0,3),homeworkRate:homeworkRate(studentId)}; state.db.reports.push({id:uid('report'),studentId,type:'월간',targetMonth:month,title:`${month} 학습 리포트`,content,generatedAt:now(),sentAt:'',status:'전송대기'}); saveState(); closeModal(); render(); toast('리포트 생성'); });
  byId('save-session')?.addEventListener('click', ()=>{ const studentId=byId('s_student').value, examPaperId=byId('s_exam').value; const exam=getExam(examPaperId); if(!exam) return toast('시험지 없음'); const lines=(byId('s_wrongs').value||'').split('\n').map(x=>x.trim()).filter(Boolean); const questionResults=[]; let total=0; const wrongIds=[]; const questions=state.db.questions.filter(q=>q.examPaperId===examPaperId).sort((a,b)=>a.number-b.number);
    questions.forEach(q=>{ const line = lines.find(l=>String(l.split(',')[0]).trim()===String(q.number)); if(line){ const [,score,mtype='기타']=line.split(','); const earned=Number(score||0); questionResults.push({id:uid('qr'),examSessionId:'tmp',studentId,questionId:q.id,isCorrect:false,studentAnswer:'',earnedScore:earned,mistakeType:(mtype||'기타').trim(),note:'',createdAt:now()}); total+=earned; wrongIds.push(q.id); } else { const earned=q.type==='서술형'?4:4; questionResults.push({id:uid('qr'),examSessionId:'tmp',studentId,questionId:q.id,isCorrect:true,studentAnswer:'',earnedScore:earned,mistakeType:'',note:'',createdAt:now()}); total+=earned; } });
    const sessionId=uid('session'); const session={id:sessionId,studentId,examPaperId,date:byId('s_date').value,totalScore:total,averageScore:Number(byId('s_avg').value||0),wrongQuestionIds:wrongIds,note:byId('s_note').value.trim(),createdAt:now(),updatedAt:now()}; questionResults.forEach(qr=>qr.examSessionId=sessionId); state.db.examSessions.push(session); state.db.questionResults.push(...questionResults); syncWrongAnswers(session, questionResults); saveState(); closeModal(); render(); toast('시험 결과 저장'); });
}

function syncWrongAnswers(session, questionResults){
  questionResults.filter(x=>!x.isCorrect).forEach(result=>{
    const question=getQuestion(result.questionId); const existing=state.db.wrongAnswers.find(w=>w.studentId===session.studentId && w.questionId===result.questionId);
    if(existing){ existing.repeatCount += 1; existing.lastWrongDate=session.date; existing.mistakeType=result.mistakeType||existing.mistakeType; existing.resolved=false; existing.updatedAt=now(); }
    else state.db.wrongAnswers.push({id:uid('wa'),studentId:session.studentId,questionId:result.questionId,sourceExamSessionId:session.id,sourceExamPaperId:session.examPaperId,category:question?.category||'',standardUnit:question?.standardUnit||'',mistakeType:result.mistakeType||'',repeatCount:1,lastWrongDate:session.date,resolved:false,resolutionNote:'',createdAt:now(),updatedAt:now()});
  });
}

function toast(msg){ const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }
render();
