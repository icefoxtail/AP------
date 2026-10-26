(()=>{
  "use strict";
  const guides={
    'points-lines.html':['점과 선을 선택하세요','점을 움직이거나 선의 방향을 바꿔보세요','겹치는 부분과 서로 다른 부분을 비교해 보세요'],
    'spatial-relations.html':['직선이나 모서리를 선택해 보세요','입체를 돌려 다른 방향에서 살펴보세요','평행·만남·꼬인 위치를 구분해 보세요'],
    'polygons-area.html':['관찰할 다각형을 선택하세요','조각을 이동하거나 꼭짓점을 움직이세요','모양이 달라도 넓이가 같은지 확인해 보세요'],
    'circle-sectors.html':['보고 싶은 원과 부채꼴 그림을 선택하세요','반지름과 중심각을 바꾸거나 도형을 움직이세요','둘레와 넓이가 어떻게 달라지는지 비교해 보세요'],
    'circle-sectors-basic.html':['원과 부채꼴의 기본 실험을 선택하세요','반지름과 중심각을 조절해 보세요','호의 길이·둘레·넓이를 구분해 보세요'],
    'polyhedra.html':['관찰할 입체도형을 선택하세요','입체를 돌려 꼭짓점·모서리·면을 살펴보세요','관계 찾기를 켜면 연결된 모서리가 강조돼요'],
    'nets-folding.html':['전개도 모양을 선택하세요','슬라이더로 접고 펼쳐보세요','관계 찾기를 켜고 만나는 점·모서리를 눌러보세요'],
    'surface-volume.html':['입체도형을 선택하세요','전개도를 펼쳐 각 면을 살펴보세요','어떤 면의 넓이를 더해야 하는지 확인해 보세요'],
    'solids-3d.html':['입체도형을 선택하세요','회전하거나 펼치고 접어보세요','겉넓이·부피 또는 모서리의 관계를 확인해 보세요'],
    'triangles-atlas.html':['삼각형의 종류를 선택하세요','꼭짓점을 움직이거나 보조선을 켜보세요','각·변·중심의 관계를 다른 그림에서도 찾아보세요'],
    'quadrilaterals-atlas.html':['사각형 장면을 선택하세요','대각선과 변의 조건을 바꿔보세요','어떤 조건에서 도형 이름이 바뀌는지 살펴보세요'],
    'similarity-atlas.html':['닮은 도형이 숨은 장면을 선택하세요','두 도형을 분리하고 같은 방향으로 맞춰보세요','대응하는 변과 각을 찾아 비를 비교해 보세요']
  };
  function ready(){
    const which=window.AP_STUDENT_GUIDE_PAGE||decodeURIComponent(location.pathname.split('/').pop());
    const steps=guides[which];if(!steps)return;
    const root=document.createElement('div');root.className='ap-student-guide';
    const btn=document.createElement('button');btn.type='button';btn.textContent='? 사용 방법';btn.className='ap-student-guide-btn';btn.setAttribute('aria-expanded','false');
    const panel=document.createElement('section');panel.className='ap-student-guide-panel';panel.hidden=true;panel.setAttribute('aria-label','실험실 사용 방법');
    const title=document.createElement('strong');title.textContent='이렇게 탐구해 보세요';
    const list=document.createElement('ol');steps.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.appendChild(li)});
    const link=document.createElement('a');link.href='../../index.html';link.textContent='← 다른 단원 선택';
    panel.append(title,list,link);root.append(btn,panel);document.body.appendChild(root);
    const set=v=>{panel.hidden=!v;btn.setAttribute('aria-expanded',String(v))};
    btn.addEventListener('click',()=>set(panel.hidden));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
    document.addEventListener('pointerdown',e=>{if(!root.contains(e.target)&&!panel.hidden)set(false)});
  }
  const css=document.createElement('style');css.textContent=`
    .ap-student-guide{position:fixed;top:12px;right:12px;z-index:60;font-family:system-ui,-apple-system,'Malgun Gothic',sans-serif}
    .ap-student-guide-btn{border:1px solid #75b899;background:#10362b;color:#e7fff1;border-radius:999px;padding:8px 12px;font-size:12px;cursor:pointer;box-shadow:0 5px 18px #0005;font-weight:700}
    .ap-student-guide-btn:focus-visible,.ap-student-guide-panel a:focus-visible{outline:2px solid #ffd27c;outline-offset:3px}
    .ap-student-guide-panel{position:absolute;right:0;top:42px;width:min(330px,calc(100vw - 28px));border:1px solid #78b49b;background:#0b281f;color:#edf8f0;border-radius:16px;padding:17px;box-shadow:0 16px 40px #0009;font-size:13px;line-height:1.6}
    .ap-student-guide-panel[hidden]{display:none}.ap-student-guide-panel strong{font-size:15px}.ap-student-guide-panel ol{margin:10px 0 14px;padding-left:20px}.ap-student-guide-panel li{margin:8px 0}.ap-student-guide-panel a{color:#d1f5b7;font-weight:800}
    @media(max-width:767px){.ap-student-guide{top:8px;right:8px}.ap-student-guide-btn{padding:7px 9px;font-size:11px}.ap-student-guide-panel{top:38px}}
  `;document.head.appendChild(css);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();