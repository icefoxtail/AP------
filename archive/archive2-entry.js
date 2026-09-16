(function () {
  const params=new URLSearchParams(location.search);
  const requested=params.get('archive2Issue');
  const embedded=requested&&params.get('archive2Embedded')==='1'&&parent!==window;
  const preferenceKey=()=> 'APMATH_ARCHIVE2_ORIGINAL_CLASSES:'+String(JSON.parse(localStorage.getItem('APMATH_SESSION')||'{}').id||'local');
  window.isArchive2OriginalBusy=()=>Boolean(AssignTarget?.progress&&Object.values(AssignTarget.progress).some(p=>p.status==='pending'));
  if(embedded){
    document.documentElement.classList.add('archive2-original-host');
    const css=document.createElement('link');css.rel='stylesheet';css.href='archive2-original.css';document.head.appendChild(css);
    const previousClose=window.closeModal;
    window.closeModal=function(){if(window.isArchive2OriginalBusy())return;previousClose();parent.postMessage({type:'archive2-original-close'},location.origin);};
  }
  window.setArchive2OriginalQpp=function(value){
    const qpp=Number(value);if(![4,6].includes(qpp)||!AssignTarget||AssignTarget.view==='progress')return;
    AssignTarget.qpp=qpp;_pendingQpp=qpp;
    localStorage.setItem('APMATH_ARCHIVE2_ORIGINAL_QPP',String(qpp));
    if(AssignTarget.previewOpen){resetAssignTargetPreviewPane();AssignTarget.previewOpen=true;syncAssignTargetPreviewPane();}
  };
  window.openArchive2OriginalIssue=async function(){
    if(!requested)return false;
    const file=String(requested).normalize('NFC').replace(/\\/g,'/').replace(/^(?:archive\/)?exams\//,'');
    const item=normalizedExams().find(ex=>ex.file.normalize('NFC')===file);
    if(!item){document.body.textContent='선택한 기출을 찾을 수 없습니다. 목록을 새로고침해 주세요.';return true;}
    _pendingFile=item.file;_pendingAction='exam';_pendingQpp=[4,6].includes(Number(params.get('qpp')))?Number(params.get('qpp')):4;
    await openAssignTargetPanel(item,_pendingQpp);
    try{
      const saved=JSON.parse(localStorage.getItem(preferenceKey())||'null');
      if(saved?.grade===AssignTarget?.grade){
        const ids=(saved.classIds||[]).filter(id=>AssignTarget.classState[id]);
        ids.forEach(id=>{AssignTarget.classState[id].checked=true;});
        await Promise.all(ids.map(ensureAssignClassRoster));
        if(ids.length)renderAssignTargetSelectView();
      }
    }catch{/* Preferences never replace the actual current roster. */}
    if(embedded)parent.postMessage({type:'archive2-original-ready'},location.origin);
    return true;
  };
  window.rememberArchive2OriginalTargets=function(){
    if(!requested||!AssignTarget)return;
    try{localStorage.setItem(preferenceKey(),JSON.stringify({grade:AssignTarget.grade,classIds:Object.keys(AssignTarget.classState).filter(id=>AssignTarget.classState[id].checked)}));}catch{}
  };
  // Explicit pilot entry. Flag OFF leaves the existing Archive route unchanged.
  if (params.get("archive2") !== "1") return;
  const link = document.createElement("a");
  link.href = "workspace.html";
  link.textContent = "Archive 2.0 교사용 작업공간 열기";
  link.style.cssText =
    "display:block;padding:12px 20px;background:#203551;color:white;text-align:center;font-weight:700;text-decoration:none";
  document.body.prepend(link);
})();
