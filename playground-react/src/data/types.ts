export type BasicId = 'basic-circumference' | 'basic-circle-area' | 'basic-arc' | 'basic-sector-perimeter' | 'basic-sector-area';
export type LabId = BasicId | 'geometry' | 'semis' | 'arc' | 'sector' | 'boundary' | 'square' | 'spinarea' | 'rotate' | 'rope' | 'rolling' | 'overlap' | 'polygon' | 'tether' | 'pizza' | 'equalarea';

export type LabType = {
  id: LabId;
  number: string;
  name: string;
  hint: string;
  thumb: string; // 기존 프로토타입의 정적 SVG만 저장. 외부 입력은 허용하지 않음.
  implemented: boolean;
};

export const LAB_TYPES: LabType[] = [
  {id:'basic-circumference',number:'B1',name:'원의 둘레',hint:'원을 굴리고 펼쳐 2πr 확인',implemented:true,thumb:`<circle cx="70" cy="55" r="40" fill="#f8fafc" stroke="#2563eb" stroke-width="4"/><path d="M30 103 H110" stroke="#e56b36" stroke-width="5"/>`},
  {id:'basic-circle-area',number:'B2',name:'원의 넓이',hint:'부채꼴 조각을 재배열해 πr²',implemented:true,thumb:`<circle cx="70" cy="55" r="40" fill="#bcebd7" stroke="#16845f" stroke-width="2"/><path d="M70 55 L70 15 A40 40 0 0 1 98 26 Z" fill="#f7b267"/>`},
  {id:'basic-arc',number:'B3',name:'부채꼴 호의 길이',hint:'중심각에 비례하는 원호',implemented:true,thumb:`<path d="M70 55 L110 55 A40 40 0 0 0 50 20 Z" fill="#dbeafe" stroke="#2563eb"/><path d="M110 55 A40 40 0 0 0 50 20" fill="none" stroke="#e56b36" stroke-width="5"/>`},
  {id:'basic-sector-perimeter',number:'B4',name:'부채꼴의 둘레',hint:'호의 길이 + 반지름 두 개',implemented:true,thumb:`<path d="M70 55 L110 55 A40 40 0 0 0 50 20 Z" fill="#bcebd7" stroke="#e56b36" stroke-width="4"/>`},
  {id:'basic-sector-area',number:'B5',name:'부채꼴의 넓이',hint:'원의 넓이 중 중심각만큼',implemented:true,thumb:`<path d="M70 55 L110 55 A40 40 0 0 0 50 20 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2"/><path d="M70 55 L70 15" stroke="#fff" stroke-width="2"/>`},
  {id:'geometry',number:'G1',name:'기본 도형·작도·합동·평행선',hint:'선을 끌고 작도 과정과 합동 조건 확인',implemented:true,thumb:`<path d="M22 76 L118 30 M22 30 L118 76" fill="none" stroke="#64748b" stroke-width="2.5"/><path d="M48 64 L70 52 L91 63 Z M84 74 L105 62 L126 73 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/><path d="M20 91 H120 M38 105 H138" fill="none" stroke="#16845f" stroke-width="3"/><circle cx="70" cy="52" r="4" fill="#e56b36"/>`},
  {id:'semis',number:'01',name:'반원 결합 · 태극형',hint:'복잡한 곡선의 둘레와 넓이',implemented:true,thumb:`<path d="M14 77 A55 55 0 0 1 124 77 A22 22 0 0 0 80 77 A33 33 0 0 0 14 77 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2.3"/><path d="M14 77 A55 55 0 0 1 124 77" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M14 77 A33 33 0 0 1 80 77 M80 77 A22 22 0 0 1 124 77" fill="none" stroke="#ea6a35" stroke-width="3.2"/>`},
  {id:'arc',number:'02',name:'중심각과 호의 길이',hint:'각도에 따라 변하는 곡선',implemented:true,thumb:`<circle cx="70" cy="55" r="43" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/><path d="M70 55 L106 31 A43 43 0 0 0 33 33 Z" fill="#dbeafe"/><path d="M106 31 A43 43 0 0 0 33 33" fill="none" stroke="#ea6a35" stroke-width="5"/><circle cx="70" cy="55" r="3" fill="#334155"/>`},
  {id:'sector',number:'03',name:'부채꼴 계산',hint:'호 · 둘레 · 넓이',implemented:true,thumb:`<path d="M35 88 L116 88 A81 81 0 0 0 71 15 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2.5"/><path d="M116 88 A81 81 0 0 0 71 15" fill="none" stroke="#ea6a35" stroke-width="5"/>`},
  {id:'boundary',number:'04',name:'색칠 영역의 둘레',hint:'실제 경계선 찾기',implemented:true,thumb:`<path d="M29 16 H110 V96 H29 Z" fill="none" stroke="#cbd5e1" stroke-dasharray="4 3"/><path d="M29 16 A81 81 0 0 1 110 97 A40.5 40.5 0 0 0 29 97 Z" fill="#bcebd7"/><path d="M29 16 A81 81 0 0 1 110 97" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M110 97 A40.5 40.5 0 0 0 29 97" fill="none" stroke="#ea6a35" stroke-width="4"/>`},
  {id:'square',number:'05',name:'사각형 속 원',hint:'사분원 · 꽃잎 · 모서리',implemented:true,thumb:`<rect x="30" y="13" width="82" height="82" fill="#fff" stroke="#64748b" stroke-width="2"/><path d="M30 13 A82 82 0 0 0 112 95 A82 82 0 0 0 30 13 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2.5"/>`},
  {id:'spinarea',number:'06',name:'회전하여 생긴 넓이',hint:'동심원과 회전 영역',implemented:true,thumb:`<path d="M108 88 A75 75 0 0 0 52 20 L45 45 A44 44 0 0 1 77 88 Z" fill="#bcebd7" stroke="#2563eb" stroke-width="3"/>`},
  {id:'rotate',number:'07',name:'점의 회전 이동 거리',hint:'회전 중심별 호의 합',implemented:true,thumb:`<path d="M20 86 H126" stroke="#94a3b8" stroke-width="2"/><rect x="38" y="57" width="29" height="29" fill="#e2e8f0" stroke="#475569"/><path d="M38 57 A41 41 0 0 1 96 57" fill="none" stroke="#ea6a35" stroke-width="4"/><circle cx="67" cy="86" r="4" fill="#2563eb"/>`},
  {id:'rope',number:'08',name:'원을 감싸는 끈',hint:'접선 · 원호 · 직선',implemented:true,thumb:`<circle cx="51" cy="55" r="23" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/><circle cx="94" cy="55" r="23" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/><rect x="28" y="32" width="89" height="46" rx="23" fill="none" stroke="#ea6a35" stroke-width="4"/>`},
  {id:'rolling',number:'09',name:'원 굴리기',hint:'중심 궤적과 지나간 면',implemented:true,thumb:`<rect x="25" y="24" width="90" height="64" rx="25" fill="#bcebd7" stroke="#16845f" stroke-width="2"/><rect x="35" y="35" width="70" height="42" rx="15" fill="none" stroke="#ea6a35" stroke-width="3"/>`},
  {id:'overlap',number:'10',name:'겹친 원 · 렌즈',hint:'교집합과 차집합',implemented:true,thumb:`<circle cx="55" cy="55" r="36" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><circle cx="88" cy="55" r="36" fill="#fff1eb" stroke="#ea6a35" stroke-width="2"/><path d="M71.5 22.7 A36 36 0 0 1 71.5 87.3 A36 36 0 0 1 71.5 22.7 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2"/>`},
  {id:'polygon',number:'11',name:'다각형 속 부채꼴',hint:'정다각형의 중심각',implemented:true,thumb:`<polygon points="70,13 105,35 105,75 70,97 35,75 35,35" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><path d="M70 55 L70 13 A42 42 0 0 1 105 35 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2"/>`},
  {id:'tether',number:'12',name:'목줄 · 울타리',hint:'모퉁이의 이동 가능 영역',implemented:true,thumb:`<path d="M65 58 L65 15 A43 43 0 1 0 108 58 Z" fill="#bcebd7" stroke="#2563eb" stroke-width="2"/><rect x="65" y="35" width="42" height="23" fill="#cbd5e1" stroke="#334155"/><circle cx="65" cy="58" r="4" fill="#ea6a35"/>`},
  {id:'pizza',number:'13',name:'피자와 조각 비교',hint:'반지름 제곱과 조각 수',implemented:true,thumb:`<circle cx="48" cy="57" r="33" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><path d="M48 57 L48 24 A33 33 0 0 1 77 41 Z" fill="#f59e0b"/><circle cx="107" cy="57" r="23" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><path d="M107 57 L107 34 A23 23 0 0 1 123 40 Z" fill="#ea6a35"/>`},
  {id:'equalarea',number:'14',name:'같은 넓이로 식 바꾸기',hint:'공통 부분을 더해 π가 사라지는 렌즈',implemented:true,thumb:`<path d="M27 87 V54 A33 33 0 0 1 93 54 V87 Z" fill="#bcebd7" stroke="#16845f" stroke-width="2"/><rect x="98" y="45" width="28" height="42" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="70" y="105" text-anchor="middle" fill="#64748b" font-size="8">S₁ = S₂</text>`}
];

export const BASIC_TYPES = LAB_TYPES.filter(type=>type.id.startsWith('basic-'));
export const GEOMETRY_TYPES = LAB_TYPES.filter(type=>type.id==='geometry');
export const PRACTICE_TYPES = LAB_TYPES.filter(type=>!type.id.startsWith('basic-')&&type.id!=='geometry');
