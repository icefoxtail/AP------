// Derived from TASK-02 alias evidence; consolidate after TASK-02 merges.
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

export function buildScopeAliasData(root) {
  const records=read(path.join(root,'archive/data/question_metadata.json')).records;
  const bindings=read(path.join(root,'archive/data/meta-foundation/compiled/curriculum_bindings.json')).bindings;
  const masterRows=read(path.join(root,'archive/data/master_tables/js_archive_tag_master.json'));
  const master=new Map(masterRows.map(r=>[r.key,r]));
  const observed=buildAliasEvidence({records,registry:{bindingRows:bindings},master});
  const unitEdges=[];
  const unitCurricula={};
  const addCurriculum=(unit,curriculum)=>{if(unit&&['2015','2022'].includes(curriculum)){unitCurricula[unit]=[...new Set([...(unitCurricula[unit]||[]),curriculum])].sort();}};
  for(const b of bindings)if(b.status==='ACTIVE')addCurriculum(b.standardUnitKey,b.curriculum);
  const dir='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0';
  for(const file of fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.json')).sort()) {
    const groups=new Map();
    for(const r of read(path.join(root,dir,file)).records||[]) {
      if(['ACTIVE','DIRECT_ACTIVE','FAMILY_ACTIVE'].includes(r.bindingStatus||r.mappingStatus))addCurriculum(r.standardUnitKey,r.curriculum);
      if(!r.standardUnitKey||!['ACTIVE','DIRECT_ACTIVE','FAMILY_ACTIVE'].includes(r.bindingStatus||r.mappingStatus))continue;
      const leaf=['majorUnit','midUnit','l3','l4'].map(k=>r.rpmPath?.[k]);
      if(leaf.some(v=>typeof v!=='string'||!v))continue;
      const key=JSON.stringify(leaf), rows=groups.get(key)||[];rows.push(r);groups.set(key,rows);
    }
    for(const rows of groups.values())for(const a of rows)for(const b of rows) {
      if(a.curriculum===b.curriculum||![a.curriculum,b.curriculum].every(c=>['2015','2022'].includes(c)))continue;
      unitEdges.push({from:{curriculum:a.curriculum,unit:a.standardUnitKey,course:a.scope},to:{curriculum:b.curriculum,unit:b.standardUnitKey,course:b.scope},evidence:`${dir}/${file}#${a.id}:${b.id}`});
    }
  }
  const parents=read(path.join(root,'archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json'));
  const parentEdges=[];
  const parentCount=new Map();
  for(const u of parents.units||[])for(const legacy of u.legacyUnitKeys||[])parentCount.set(legacy,(parentCount.get(legacy)||0)+1);
  if(parents.authorityStatus==='ACTIVE')for(const u of parents.units||[])for(const legacy of u.legacyUnitKeys||[]) {
    addCurriculum(legacy,'2022');addCurriculum(u.unitKey||u.key,'2022');
    if(parentCount.get(legacy)===1)parentEdges.push({curriculum:'2022',from:legacy,to:u.unitKey||u.key,evidence:`rpm-middle-2022-parents#${u.key}`});
    for(const e of unitEdges.filter(e=>parentCount.get(legacy)===1&&e.from.curriculum==='2022'&&e.from.unit===legacy)) {
      const derived={...e,from:{...e.from,unit:u.unitKey||u.key},evidence:e.evidence+`;rpm-middle-2022-parents#${u.key}`};
      unitEdges.push(derived,{from:derived.to,to:derived.from,evidence:derived.evidence});
    }
  }
  const empty=records.filter(r=>![r.standardCourse,r.courseKey].some(v=>typeof v==='string'&&v.trim())).length;
  return {schemaVersion:'scope-alias-v1',provenance:{questionSource:'archive/data/question_metadata.json',questionCount:records.length,bindingCount:bindings.length,task02Origin:'1bea581a137a6024077c548990d9a9fff6770e7f',note:'Rebuilt against current inputs; consolidate with TASK-02 after merge.'},groups:observed.groups,observedSpellings:[...observed.observedSpellings,{value:'',questionCount:empty,bindingCount:0}],activeUnitKeys:masterRows.filter(r=>r.keyType==='standardUnitKey'&&String(r.status).toUpperCase()==='ACTIVE').map(r=>r.key).sort(),unitEdges,parentEdges,unitCurricula};
}
// Explicit generator entry only; importing this module does not read the repository.
if(process.argv[1]&&import.meta.url===new URL(`file://${path.resolve(process.argv[1])}`).href){
  const root=process.cwd();const out=process.argv[2];
  if(!out)throw Error('Usage: node build-scope-alias-data.mjs <output-json>');
  fs.writeFileSync(out,JSON.stringify(buildScopeAliasData(root),null,2)+'\n');
}
