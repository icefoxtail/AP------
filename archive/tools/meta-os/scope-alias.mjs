// Read-time scope evidence only. No operational values are rewritten.
import data from './scope-alias-data.json' with { type: 'json' };
export const aliasData = data;
const groups=data.groups;
const activeUnits=new Set(data.activeUnitKeys);
const observed=new Set(data.observedSpellings.map(a=>a.value));
const generic=new Set(['','수학','공통수학','UNKNOWN']);
const input=s=>({curriculum:String(s?.curriculum??''),course:String(s?.course??s?.standardCourse??s?.courseKey??''),unit:String(s?.standardUnitKey??s?.unit??''),file:String(s?.sourceArchiveFile??s?.file??'')});
function family(unit) {
  const m=unit.match(/^(?:M([123])-|M22-([123])-|RPM22-M([123])-)/);
  if(m)return 'M'+(m[1]||m[2]||m[3]);
  return unit.match(/^(H\d{2}-[A-Z][A-Z0-9]*)-/)?.[1]??null;
}
function unitCurriculum(unit) {
  if(/^(M22-|RPM22-|H22-)/.test(unit))return '2022';
  if(/^(M[123]-|H15-)/.test(unit))return '2015';
  return null;
}
const unique=items=>[...new Set(items)];
function groupGrade(g) {
  if(/^M[123]$/.test(g))return Number(g[1]);
  return null;
}
/** Evidence votes: one vote per independent course/unit/path signal. Ties prefer
 * unit, then course, then path. High-school paths alone cannot name a subject. */
export function canonicalCourse(scope={}) {
  const s=input(scope), f=activeUnits.has(s.unit)?family(s.unit):null;
  const pathMatch=s.file.match(/(?:^|\/)(middle|high)\/(m[123]|h[123])(?:\/|$)/);
  const pathGrade=pathMatch?.[2]?.toUpperCase()??null;
  const pathId=pathGrade?.startsWith('M')?pathGrade:null;
  const familyGroups=groups.filter(g=>g.family===f);
  const matching=groups.filter(g=>g.aliases.some(a=>a.value===s.course));
  const contextual=matching.filter(g=>g.family===f&&g.aliases.some(a=>a.value===s.course&&(!generic.has(s.course)||a.unitKeys.includes(s.unit))));
  const courseCandidates=generic.has(s.course)?contextual:matching;
  let courseId=contextual.length===1?contextual[0].id:courseCandidates.length===1?courseCandidates[0].id:null;
  const familyIds=unique(familyGroups.map(g=>g.id));
  let unitId=familyIds.length===1?familyIds[0]:contextual.length===1?contextual[0].id:null;
  // For a generic high-school spelling, do not guess outside its observed units.
  if(f?.startsWith('H')&&generic.has(s.course)&&contextual.length===0)unitId=null;
  const signals=[{kind:'unit',courseId:unitId},{kind:'course',courseId},{kind:'path',courseId:pathId}].filter(e=>e.courseId);
  const votes=new Map();for(const e of signals)votes.set(e.courseId,(votes.get(e.courseId)||0)+1);
  const ranked=[...votes].sort((a,b)=>b[1]-a[1]||signals.findIndex(e=>e.courseId===a[0])-signals.findIndex(e=>e.courseId===b[0]));
  courseId=ranked[0]?.[0]??null;
  const curricula=data.unitCurricula[s.unit]??(unitCurriculum(s.unit)?[unitCurriculum(s.unit)]:[]);
  const curriculumConflict=Boolean(curricula.length&&s.curriculum&&!curricula.includes(s.curriculum));
  const levelConflict=Boolean(f&&pathGrade&&f[0]!==pathGrade[0]);
  const conflict=unique(signals.map(e=>e.courseId)).length>1||curriculumConflict||levelConflict;
  const resolved=conflict&&!curriculumConflict&&!levelConflict&&unitId&&unitId===pathId;
  const unknownAlias=!observed.has(s.course);
  let confidence=resolved?'RESOLVED_BY_UNIT_AND_PATH':conflict?'CONFLICT':unknownAlias?'UNKNOWN_ALIAS':courseId?'SUPPORTED':'UNRESOLVED';
  const term=s.file.match(/\/(?:m[123]|h[123])\/([12])(?:mid|final)(?:\/|_)/)?.[1]??s.course.match(/^(?:M[123]|중[123])-([12])$/)?.[1]??null;
  const group=groups.find(g=>g.id===courseId);
  return {courseId,grade:groupGrade(courseId??'')??(pathGrade?.startsWith('H')?Number(pathGrade[1]):null),semester:term?Number(term):null,curriculum:s.curriculum||unitCurriculum(s.unit),confidence,unknownAlias,conflict:Boolean(conflict),evidence:{signals,votes:Object.fromEntries(votes),tieBreak:'UNIT_THEN_COURSE_THEN_PATH',unit:s.unit,course:s.course,pathGrade,curriculumConflict,levelConflict,questionCount:group?.aliases.find(a=>a.value===s.course)?.questionCount??0}};
}
function permitted(s,c) {
  if(!c.courseId||c.confidence==='CONFLICT'||c.unknownAlias)return false;
  if(c.evidence.signals.some(e=>e.kind==='course'&&e.courseId!==c.courseId))return false;
  // Conflicting known high-school subjects are never accepted by fallback.
  return !c.evidence.curriculumConflict&&!c.evidence.levelConflict;
}
export function sameCourse(left,right) {
  const a=input(left),b=input(right),ca=canonicalCourse(left),cb=canonicalCourse(right);
  if(!a.curriculum||!b.curriculum||!permitted(a,ca)||!permitted(b,cb))return false;
  if(a.curriculum!==b.curriculum)return sameUnit(left,right);
  return ca.courseId===cb.courseId;
}
function edgeCourseMatches(scope,edgeScope) {
  const a=canonicalCourse(scope),b=canonicalCourse(edgeScope);
  // Unknown spellings must not be a back door to another curriculum.
  return !a.unknownAlias&&permitted(input(scope),a)&&permitted(input(edgeScope),b)&&a.courseId===b.courseId;
}
export function sameUnit(left,right) {
  const a=input(left),b=input(right);
  if(!a.unit||!b.unit)return false;
  if(a.curriculum===b.curriculum) {
    if(a.unit===b.unit)return true;
    return data.parentEdges.some(e=>e.curriculum===a.curriculum
      &&data.parentEdges.filter(other=>other.curriculum===e.curriculum&&other.from===e.from).length===1
      &&((e.from===a.unit&&e.to===b.unit)||(e.from===b.unit&&e.to===a.unit)));
  }
  return data.unitEdges.some(e=>e.from.curriculum===a.curriculum&&e.from.unit===a.unit&&e.to.curriculum===b.curriculum&&e.to.unit===b.unit&&edgeCourseMatches(left,e.from)&&edgeCourseMatches(right,e.to));
}

// The diagnostic is lazy: importing the pure API performs no filesystem scan.
if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://' + process.cwd() + '/').href) {
  import('./scope-alias-report.mjs').then(({runCli})=>runCli(process.argv.slice(2))).catch(error=>{
    console.error(error.message);process.exitCode=1;
  });
}
