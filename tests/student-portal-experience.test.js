(async function studentUxRuntimeTest() {
  'use strict';
  const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
  const root=path.resolve(__dirname,'..');
  const html=fs.readFileSync(path.join(root,'apmath/student/index.html'),'utf8');
  const scriptStart=html.lastIndexOf('<script>');
  const scriptEnd=html.indexOf('</script>',scriptStart);
  assert(scriptStart>=0 && scriptEnd>scriptStart,'portal script accessible');
  const source=html.slice(scriptStart+'<script>'.length,scriptEnd);
  const bootAt=source.lastIndexOf('    boot();');
  assert(bootAt>0,'boot entrypoint present');
  const program=source.slice(0,bootAt);
  const app={innerHTML:''},browser={innerHTML:''};
  const elements={'app':app,'student-chip':{textContent:''},'toast':{textContent:'',classList:{add(){},remove(){}}},'omr-submit-btn':{disabled:false,textContent:'',isConnected:true},'omr-wrong-count':{textContent:'1개'},'omr-expected-score':{textContent:'80점'}};
  const nodes=Array.from({length:5},()=>({
    attrs:{},wrong:false,
    setAttribute(k,v){this.attrs[k]=v;},
    classList:{toggle(k,v){this.parent.wrong=v;}},
  }));
  nodes.forEach(n=>n.classList.parent=n);
  const doc={
    getElementById(id){return elements[id]||null;},
    querySelector(selector){return selector==='.omr-browser'?browser:null;},
    querySelectorAll(selector){return selector==='.omr-sheet .omr-no'?nodes:[];}
  };
  const sent=[];
  const cases=[
    {assignment_id:'a1',exam_title:'1차 확인',class_name:'중1A',exam_date:'2026-11-10',question_count:5,is_submitted:0,wrong_ids:[2],archive_file:'original/middle/a1.js'},
    {assignment_id:'a2',exam_title:'2차 확인',class_name:'중1A',exam_date:'2026-11-09',question_count:5,is_submitted:0,wrong_ids:[],archive_file:'original/middle/a2.js'},
    {assignment_id:'a3',exam_title:'완료 시험',class_name:'중1A',exam_date:'2026-11-08',question_count:5,is_submitted:1,score:83,archive_file:'original/middle/a3.js'},
    {assignment_id:'a4',exam_title:'오래된 완료',class_name:'중1A',exam_date:'2026-11-07',question_count:5,is_submitted:1,score:91,archive_file:'original/middle/a4.js'},
    {assignment_id:'a5',exam_title:'확인 필요',class_name:'중1A',exam_date:'2026-11-06',question_count:5,archive_file:'original/middle/a5.js'}
  ];
  const currentLocation={href:'https://example.test/AP------/apmath/student/',search:''};
  const context=vm.createContext({
    console,Date,Math,Number,Set,Map,JSON,URL,URLSearchParams,Promise,encodeURIComponent,
    document:doc,location:currentLocation,
    window:{location:currentLocation,StudentClinicLineageView:null,ClinicLearningView:null},
    navigator:{userAgent:'test'},setTimeout,clearTimeout,
    localStorage:{getItem(){return null},setItem(){},removeItem(){}},
    sessionStorage:{getItem(){return null},setItem(){},removeItem(){}},
    fetch:async (url,options={})=>{
      if(options.method==='POST' && String(url).includes('omr-submit')){
        const body=JSON.parse(options.body);sent.push(body);
        return {ok:true,json:async()=>({success:true,session:{id:99,score:83,wrong_ids:body.wrong_ids}})};
      }
      if(String(url).includes('student-portal/exams'))return {ok:true,json:async()=>({success:true,exams:cases})};
      throw Error('Unexpected network call: '+url);
    }
  });
  vm.runInContext(program,context,{filename:'apmath/student/index.html',timeout:2500});
  vm.runInContext('session={student_id:"p1",student_token:"test"}; homeData={student:{name:"테스트",grade:"중1"},assignments:[]};',context);
  context.cases=cases;
  vm.runInContext('omrData={exams:cases};',context);
  const home=vm.runInContext('renderOmrHomeSection()',context);
  assert.strictEqual((home.match(/<article class="omr-card"/g)||[]).length,3,'home has bounded three exam previews');
  assert(home.includes('전체 시험지 5개 보기'),'all exam list remains accessible');
  assert(home.includes('진행 중 2 · 제출 2'),'counts use recorded submission state');
  assert(!home.includes('오래된 완료'),'older exams stay in full list, not deleted');
  const list=vm.runInContext('renderOmrExamBrowser(getVisibleOmrExams())',context);
  assert.strictEqual((list.match(/<article class="omr-card"/g)||[]).length,5,'full list preserves all assignments');
  const completed=vm.runInContext('renderOmrExamCard(cases[2])',context);
  const unknown=vm.runInContext('renderOmrExamCard(cases[4])',context);
  assert(completed.includes('기록 점수 83점')&&completed.includes('해설로 복습'),'recorded score is not the expected score');
  assert(!unknown.includes('onclick="renderOmrInput('),'unknown state does not enable OMR mutation');
  assert(unknown.includes('중복 제출을 피하려면'),'unknown state has clear guidance');
  vm.runInContext('renderOmrInput("a1")',context);
  const initialHtml=app.innerHTML;
  assert(initialHtml.includes('예상 점수')&&initialHtml.includes('80점')&&initialHtml.includes('aria-pressed="true"'),'OMR UI indicates expected score and selected wrong IDs');
  vm.runInContext('toggleOmrWrong(1)',context);
  assert.strictEqual(app.innerHTML,initialHtml,'toggling wrong number keeps the DOM and scroll state');
  assert.strictEqual(elements['omr-wrong-count'].textContent,'2개');
  assert.strictEqual(elements['omr-expected-score'].textContent,'60점');
  assert.strictEqual(nodes[0].attrs['aria-pressed'],'true');
  vm.runInContext('toggleOmrWrong(1)',context);
  assert.strictEqual(elements['omr-expected-score'].textContent,'80점','second tap deselects wrong number');
  await vm.runInContext('submitOmr()',context);
  assert.strictEqual(sent.length,1,'one submission request is created');
  assert.strictEqual(sent[0].student_id,'p1');
  assert.strictEqual(sent[0].assignment_id,'a1');
  assert.deepStrictEqual(Array.from(sent[0].wrong_ids),[2],'wrong_ids contract preserved');
  const previewLocation={href:'https://example.test/AP------/apmath/student/?teacher_preview=1&student_id=p1',search:'?teacher_preview=1&student_id=p1'};
  const previewContext=vm.createContext({
    console,Date,Math,Number,Set,Map,JSON,URL,URLSearchParams,Promise,encodeURIComponent,
    document:doc,location:previewLocation,window:{location:previewLocation,StudentClinicLineageView:null,ClinicLearningView:null},
    navigator:{userAgent:'test'},setTimeout,clearTimeout,
    localStorage:{getItem(){return null},setItem(){},removeItem(){}},
    sessionStorage:{getItem(){return null},setItem(){},removeItem(){}}
  });
  vm.runInContext(program,previewContext,{filename:'preview student index',timeout:2500});
  previewContext.cases=cases;
  const previewHtml=vm.runInContext('renderOmrExamCard(cases[0])',previewContext);
  assert(!previewHtml.includes('renderOmrInput('),'teacher preview never presents submit control');
  const css=fs.readFileSync(path.join(root,'apmath/css/apms-student-experience.css'),'utf8');
  for(const pathname of ['apmath/student/index.html','apmath/planner/index.html','apmath/homework/index.html']){
    const text=fs.readFileSync(path.join(root,pathname),'utf8');
    assert(text.includes('apms-student-experience.css?v=2026.11.11.1'),pathname+' must use shared CSS');
  }
  assert(css.includes('body.student-portal-theme')&&css.includes('body.apms-student-homework')&&css.includes('body.apms-student-planner'),'consistent family styles cover lower pages');
  console.log('Student portal runtime UX contracts passed: full exam list, 3 preview, state actions, OMR toggle/submit, teacher preview, shared style.');
})().catch(error=>{console.error(error);process.exitCode=1;});
