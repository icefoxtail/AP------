// Read-only course spelling evidence. A spelling is only equivalent within its
// observed unit family, never a global replacement of operational metadata.
import fs from 'node:fs';
import path from 'node:path';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export function unitFamily(unit = '') {
  let m=String(unit).match(/^(?:M([123])-|M22-([123])-|RPM22-M([123])-)/);
  if(m)return 'M'+(m[1]||m[2]||m[3]);
  m=String(unit).match(/^(H\d{2}-[A-Z][A-Z0-9]*)-/);
  return m?.[1] || null;
}
export function pathGrade(file = '') {
  const m=String(file).match(/(?:^|\/)(middle|high)\/(m[123]|h[123])(?:\/|$)/);
  return m ? m[2].toUpperCase() : null;
}
export function unitGrade(unit = '') {
  const family=unitFamily(unit);
  if(/^M[123]$/.test(family||''))return family;
  if(/^H\d{2}-(SA|SB|C|C1|C2)$/.test(family||''))return 'H1';
  return family?.startsWith('H') ? 'HIGH' : null;
}
const explicitCourseGrade = course => {
  const m=String(course||'').match(/^(?:[중中](?:학교\s*)?\s*([123])|M([123])(?:-|$)|중학교\s*수학\s*([123]))/);
  return m?'M'+(m[1]||m[2]||m[3]):null;
};
export function evidenceConflict(row = {}) {
  const unit=row.standardUnitKey||row.unit||'', course=row.standardCourse||row.courseKey||row.course||'';
  const fromPath=pathGrade(row.sourceArchiveFile),fromUnit=unitGrade(unit),fromCourse=explicitCourseGrade(course);
  const mismatch=fromPath&&fromUnit&&(fromUnit==='HIGH'?!fromPath.startsWith('H'):fromPath!==fromUnit);
  if(mismatch)return {reason:'PATH_UNIT_GRADE_MISMATCH',pathGrade:fromPath,unitGrade:fromUnit};
  if(fromCourse&&fromUnit&&fromCourse!==fromUnit)return {reason:'COURSE_UNIT_GRADE_MISMATCH',courseGrade:fromCourse,unitGrade:fromUnit};
  return null;
}
// Same scope spellings already used by reviewed-exam-registration-v2's
// normalizedScope; spacing and Unicode Roman glyphs do not change a course.
export const normalizedCourse = value => String(({수학_상:'수학(상)',수학_하:'수학(하)'})[value] || value || '')
  .replace(/\s+/g,'').replace(/Ⅰ/g,'I').replace(/Ⅱ/g,'II').replace(/Ⅲ/g,'III');
const genericCourse = value => ['수학','공통수학','UNKNOWN'].includes(value);
export function buildAliasEvidence(context) {
  const groups=new Map(),observed=new Map(),mismatches=[],unresolved=[];
  const bindings=(context.registry?.bindingRows||[]).filter(r=>r.status===undefined||r.status==='ACTIVE');
  const scopeCourses = unit => [...new Set(bindings.filter(r=>r.standardUnitKey===unit).map(r=>normalizedCourse(r.standardCourse)).filter(Boolean))];
  const add=(row,kind)=>{
    const spellings=[...new Set([row.standardCourse,row.courseKey].filter(v=>typeof v==='string'&&v.trim()))];
    for(const course of spellings){const counts=observed.get(course)||{value:course,questionCount:0,bindingCount:0};counts[kind==='question'?'questionCount':'bindingCount']++;observed.set(course,counts);}
    const family=unitFamily(row.standardUnitKey),conflict=evidenceConflict(row),master=context.master?.get(row.standardUnitKey);
    const detail={kind,questionUid:row.questionUid||null,sourceArchiveFile:row.sourceArchiveFile||null,sourceOrdinal:row.sourceOrdinal||null,standardCourse:row.standardCourse||null,courseKey:row.courseKey||null,standardUnitKey:row.standardUnitKey||null};
    if(conflict){mismatches.push({...detail,...conflict});return;}
    if(!family||context.master&&(!master||master.keyType!=='standardUnitKey'||!['active','ACTIVE'].includes(master.status))){
      if(spellings.length)unresolved.push({...detail,reason:family?'INVALID_MASTER_UNIT':'UNIT_FAMILY_UNRESOLVED'});return;
    }
    const admittedGroups=new Set();
    for(const value of spellings){
      const conflict=evidenceConflict({...row,standardCourse:value});
      if(conflict){mismatches.push({...detail,standardCourse:value,...conflict});continue;}
      let courseId=normalizedCourse(value),expected=scopeCourses(row.standardUnitKey);
      if(family.startsWith('H')){
        if(genericCourse(value)){
          if(expected.length!==1){unresolved.push({...detail,standardCourse:value,reason:'AMBIGUOUS_GENERIC_COURSE'});continue;}
          courseId=expected[0];
        }else if(expected.length&&!expected.includes(courseId)){
          mismatches.push({...detail,standardCourse:value,reason:'COURSE_UNIT_BINDING_CONFLICT',expectedCourses:expected});continue;
        }
      }
      const id=family.startsWith('H')?family+':'+courseId:family;
      const group=groups.get(id)||{id,family,evidenceQuestionCount:0,evidenceBindingCount:0,aliases:new Map()};
      if(!admittedGroups.has(id)){group[kind==='question'?'evidenceQuestionCount':'evidenceBindingCount']++;admittedGroups.add(id);}
      const item=group.aliases.get(value)||{value,questionCount:0,bindingCount:0,unitKeys:new Set(),pathGrades:new Set()};
      item[kind==='question'?'questionCount':'bindingCount']++;item.unitKeys.add(row.standardUnitKey);if(pathGrade(row.sourceArchiveFile))item.pathGrades.add(pathGrade(row.sourceArchiveFile));group.aliases.set(value,item);groups.set(id,group);
    }
  };
  for(const row of context.records||[])add(row,'question');
  for(const row of context.registry?.bindingRows||[])add(row,'binding');
  return {schemaVersion:'type-judgment-course-alias-evidence-v1',policy:'OBSERVED_SPELLINGS; active master units; middle grade groups; high courses separated; conflicts excluded; no operational data mutation',
    groups:[...groups.values()].sort((a,b)=>a.id.localeCompare(b.id)).map(g=>({...g,aliases:[...g.aliases.values()].sort((a,b)=>a.value.localeCompare(b.value)).map(a=>({...a,unitKeys:[...a.unitKeys].sort(),pathGrades:[...a.pathGrades].sort()}))})),
    observedSpellings:[...observed.values()].sort((a,b)=>a.value.localeCompare(b.value)),
    mismatchCount:mismatches.length,mismatches,unresolvedCount:unresolved.length,unresolved};
}
export function loadAliasEvidence(root) { return read(path.join(root,'archive/tools/type-judgment/course-aliases.json')); }
export function courseGroup(scope,evidence) {
  const family=unitFamily(scope.unit||scope.standardUnitKey),course=scope.course||scope.standardCourse||scope.courseKey;
  if(evidenceConflict({...scope,standardUnitKey:scope.unit||scope.standardUnitKey,standardCourse:course}))return null;
  const groups=evidence?.groups?.filter(g=>g.family===family&&g.aliases.some(a=>a.value===course&&(!genericCourse(course)||a.unitKeys.includes(scope.unit||scope.standardUnitKey))))||[];
  return groups.length===1?groups[0].id:null;
}
export function coursesEquivalent(left,right,evidence) {
  if(left.curriculum!==right.curriculum)return false;
  if(!evidence)return left.course===right.course && unitFamily(left.unit)===unitFamily(right.unit);
  const a=courseGroup(left,evidence),b=courseGroup(right,evidence);
  return Boolean(a&&a===b);
}
const mappingCache=new WeakMap();
export function crossCurriculumScopes(context, scope) {
  if(!context.root||evidenceConflict({...scope,standardUnitKey:scope.unit,standardCourse:scope.course}))return [];
  let edges=mappingCache.get(context);
  if(!edges){
    edges=[];
    const add=(from,to,evidence)=>{if(from.curriculum!==to.curriculum&&['2015','2022'].includes(from.curriculum)&&['2015','2022'].includes(to.curriculum))edges.push({from,to,evidence});};
    const dir=path.join(context.root,'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');
    if(fs.existsSync(dir))for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.json')).sort()){
      const doc=read(path.join(dir,name)),byLeaf=new Map();
      for(const r of doc.records||[]){
        if(!r.standardUnitKey||!r.rpmPath||!['ACTIVE','DIRECT_ACTIVE','FAMILY_ACTIVE'].includes(r.bindingStatus||r.mappingStatus))continue;
        const leaf=['majorUnit','midUnit','l3','l4'].map(k=>r.rpmPath[k]);if(leaf.some(v=>typeof v!=='string'||!v))continue;
        const sig=JSON.stringify(leaf),list=byLeaf.get(sig)||[];list.push(r);byLeaf.set(sig,list);
      }
      for(const list of byLeaf.values())for(const a of list)for(const b of list)if(a!==b)add({curriculum:a.curriculum,unit:a.standardUnitKey,course:a.scope},{curriculum:b.curriculum,unit:b.standardUnitKey,course:b.scope},`archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/${name}#${a.id}:${b.id}`);
    }
    // The parent authority identifies 2022 effective units and explicit legacy
    // keys. It does not itself assert 2015 equivalence; only existing crosswalk
    // leaf identity above permits a cross-curriculum edge.
    const parentFile=path.join(context.root,'archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json');
    if(fs.existsSync(parentFile)){
      const parents=read(parentFile);
      if(parents.authorityStatus==='ACTIVE')for(const u of parents.units||[])for(const legacy of u.legacyUnitKeys||[]){
        const originals=edges.filter(e=>e.from.curriculum==='2022'&&e.from.unit===legacy);
        for(const edge of originals){edges.push({...edge,from:{...edge.from,unit:u.unitKey||u.key},evidence:edge.evidence+';rpm-middle-2022-parents#'+u.key});edges.push({from:edge.to,to:{...edge.from,unit:u.unitKey||u.key},evidence:edge.evidence+';rpm-middle-2022-parents#'+u.key});}
      }
    }
    mappingCache.set(context,edges);
  }
  const found=edges.filter(e=>e.from.curriculum===scope.curriculum&&e.from.unit===scope.unit
    && (normalizedCourse(scope.course)===normalizedCourse(e.from.course)
      || coursesEquivalent(scope,{...e.from,course:normalizedCourse(e.from.course)},context.courseAliasEvidence)));
  return [...new Map(found.map(e=>[JSON.stringify([e.to.curriculum,e.to.unit,e.to.course]),{...e.to,sub:null,evidence:e.evidence}])).values()];
}
