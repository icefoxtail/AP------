import { loadContext, readExam, scopeForRecord, activeKey, matchingBindings, validScope, parseArgs, writeOutput, isMain } from './common.mjs';
import { coursesEquivalent, crossCurriculumScopes, evidenceConflict } from './alias-evidence.mjs';
import { loadUnits, resolveUnitScope } from './units.mjs';

function representatives(context, field, key) {
  return context.records.filter(row => row[field] === key
    && /^approved(?:_|$)/.test(row.fieldStatus?.[field === 'problemTypeKey' ? 'problemType' : 'template'] || ''))
    .sort((a, b) => a.questionUid.localeCompare(b.questionUid)).slice(0, 3)
    .map(({ questionUid, sourceArchiveFile, sourceOrdinal }) => ({ questionUid, sourceArchiveFile, sourceOrdinal }));
}
function describe(context, item, field) {
  return { key: item[field], canonicalLabelKo: item.canonicalLabelKo, definition: item.definition,
    ...(item.internalSkeleton ? { internalSkeleton: item.internalSkeleton } : {}),
    representatives: representatives(context, field, item[field]) };
}
function eligibleBinding(context, row) {
  const owner = row.ownerPack || context.registry.problemTypes.get(row.problemTypeKey)?.ownerPack;
  const pack = context.packs.get(owner);
  return row.status === 'ACTIVE' && activeKey(context, 'PT', row.problemTypeKey)
    && context.registry.activePacks.has(owner) && pack?.curricula.includes(row.curriculum)
    && pack?.standardCourses.includes(row.standardCourse);
}
function bindingScope(row) {
  return {curriculum:row.curriculum,course:row.standardCourse,unit:row.standardUnitKey,sub:row.subUnitKey || null};
}
function candidates(context, selected, stage, pt) {
  return [...selected].sort(([a],[b])=>a.localeCompare(b)).filter(([key])=>stage !== 'tpl' || key === pt).map(([key, proof]) => {
    const templates = [...context.registry.templates.values()]
      .filter(tpl => tpl.parentProblemTypeKey === key && activeKey(context, 'TPL', tpl.templateKey))
      .sort((a, b) => a.templateKey.localeCompare(b.templateKey));
    return {...describe(context, context.registry.problemTypes.get(key), 'problemTypeKey'), ...proof,
      templateCount:templates.length,
      templates:stage === 'pt' ? [] : templates.map(tpl=>describe(context,tpl,'templateKey'))};
  });
}
export function integrity(context) {
  return { verified: context.registry.status === 'ACTIVE',
    heading: context.registry.status === 'ACTIVE' ? '유형 판정 준비 목록 (승인 아님)' : '레지스트리 무결성 미확인',
    errors: context.registry.errors };
}
export function buildOptions(context, scope, {stage = 'all', pt} = {}) {
  if (!['all','pt','tpl'].includes(stage) || (stage === 'tpl' && !pt)) throw Error('STAGE_REQUIRES_PT_OR_TPL_WITH_PT_KEY');
  const result = {scope,status:'BROAD',stage,candidates:[],candidateExpansion:[],fallback:null};
  if (!validScope(context, scope)) return {...result,status:'INVALID_CANONICAL_SCOPE'};
  if (evidenceConflict({...scope,standardUnitKey:scope.unit,standardCourse:scope.course}))
    return {...result,status:'SCOPE_EVIDENCE_CONFLICT'};
  const selected = new Map();
  const exact = new Set(matchingBindings(context,scope,null,{exactSub:true}));
  for (const row of context.registry.bindingRows) {
    if (!eligibleBinding(context,row) || row.curriculum !== scope.curriculum || row.standardUnitKey !== scope.unit
      || !coursesEquivalent(scope,bindingScope(row),context.courseAliasEvidence)) continue;
    const status = exact.has(row) ? 'EXACT' : 'ALIAS';
    const old = selected.get(row.problemTypeKey);
    if (!old || status === 'EXACT') selected.set(row.problemTypeKey,{bindingStatus:status,stage:1,
      bindingReason:status === 'EXACT' ? 'EXACT_SCOPE' : row.standardCourse === scope.course ? 'UNIT_WIDE' : 'OBSERVED_COURSE_ALIAS',
      evidence:{unit:row.standardUnitKey,course:row.standardCourse,sub:row.subUnitKey || null}});
  }
  for (const mapped of crossCurriculumScopes(context,scope)) {
    if (!validScope(context,mapped)) continue;
    for (const row of context.registry.bindingRows) {
      if (!eligibleBinding(context,row) || row.curriculum !== mapped.curriculum || row.standardUnitKey !== mapped.unit
        || !coursesEquivalent(mapped,bindingScope(row),context.courseAliasEvidence) || selected.has(row.problemTypeKey)) continue;
      selected.set(row.problemTypeKey,{bindingStatus:'CROSS_CURRICULUM',stage:2,evidence:mapped.evidence || mapped});
    }
  }
  if (!selected.size) for (const row of context.records || []) {
    if (row.standardUnitKey !== scope.unit || !activeKey(context,'PT',row.problemTypeKey)
      || !/^approved(?:_|$)/.test(row.fieldStatus?.problemType || '')
      || !coursesEquivalent(scope,scopeForRecord(row),context.courseAliasEvidence)
      || scopeForRecord(row).curriculum !== scope.curriculum) continue;
    if (!selected.has(row.problemTypeKey)) selected.set(row.problemTypeKey,{bindingStatus:'USED_IN_UNIT',stage:3,
      evidence:{questionUid:row.questionUid,sourceArchiveFile:row.sourceArchiveFile,sourceOrdinal:row.sourceOrdinal}});
  }
  result.candidateCount = selected.size;
  result.twoStageRecommended = selected.size > 25;
  result.candidates = candidates(context,selected,stage,pt);
  if (!selected.size) {result.status='NO_CANDIDATES';result.fallback='근거 있는 단원 후보 없음: 새 키 판정 또는 보류';}
  if (stage === 'tpl' && !selected.has(pt)) return {...result,status:'PT_NOT_IN_CANDIDATE_POOL'};
  return result;
}
export function buildWorkload(context, exam, {units,stage='all',pt} = {}) {
  const optionSets = {};
  const rows = exam.rows.map(row => {
    if (!row.metadata) return {questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,
      canonicalScope:null,optionsRef:null,status:'MISSING_CANONICAL_METADATA'};
    const resolved=resolveUnitScope(context,row,exam.questions[row.sourceOrdinal-1],units),scope=resolved.scope;
    const ref=JSON.stringify([scope.curriculum,scope.course,scope.unit,scope.sub,scope.curriculumKey||null,scope.courseKey||null,Boolean(evidenceConflict({...scope,standardUnitKey:scope.unit,standardCourse:scope.course})),stage,pt||null]);
    optionSets[ref] ||= resolved.errors.length ? {scope,status:'INVALID_CANONICAL_SCOPE',candidates:[],candidateExpansion:[],errors:resolved.errors}
      : buildOptions(context,scope,{stage,pt});
    return {questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,canonicalScope:scope,unitSource:resolved.unitSource,optionsRef:ref};
  });
  return {schemaVersion:'type-judgment-workload-v1',...integrity(context),exam:exam.exam,rows,optionSets};
}
export function formatMarkdown(result) {
  const lines = [`# ${result.heading}`, '', '읽기 전용 후보이며 판정·승인·등록 결과가 아닙니다.', ''];
  for (const error of result.errors || []) lines.push(`- ${error}`);
  const groups = result.optionSets ? Object.entries(result.optionSets) : [['선택 범위', result.options]];
  for (const [name, group] of groups) {
    lines.push(`## ${name}`, `상태: ${group.status}`, group.fallback || '', '');
    const append = list => { for (const pt of list) {
      lines.push(`### ${pt.key}: ${pt.canonicalLabelKo}`, pt.definition || '', `연결: ${pt.bindingStatus} / 단계 ${pt.stage}`);
      if (pt.internalSkeleton) lines.push(`풀이 구조: ${pt.internalSkeleton}`);
      lines.push(`대표 번호표: ${pt.representatives.map(row => row.questionUid).join(', ') || '없음'}`);
      for (const tpl of pt.templates) lines.push(`- ${tpl.key}: ${tpl.canonicalLabelKo}`, `  정의: ${tpl.definition || ''}`,
        `  풀이 구조: ${tpl.internalSkeleton || '없음'}`, `  대표 번호표: ${tpl.representatives.map(row => row.questionUid).join(', ') || '없음'}`);
    } };
    append(group.candidates);
    for (const expansion of group.candidateExpansion) { lines.push(`### 후보 확장: ${expansion.unit}`); append(expansion.candidates); }
  }
  return `${lines.join('\n')}\n`;
}
export function runCli(argv = process.argv.slice(2), suppliedContext) {
  const args = parseArgs(argv, ['--curriculum', '--course', '--unit', '--sub', '--format', '--exam', '--out', '--units', '--stage', '--pt'], ['--strict']);
  if (args.format && !['json', 'md'].includes(args.format)) throw Error('FORMAT_MUST_BE_JSON_OR_MD');
  if (args.exam && ['curriculum', 'course', 'unit', 'sub'].some(key => args[key])) throw Error('EXAM_USES_CANONICAL_SCOPE_ONLY');
  if (args.exam && args.format === 'md') throw Error('EXAM_WORKLOAD_REQUIRES_JSON');
  if (!args.exam && (!args.curriculum || !args.course || !args.unit)) throw Error('CURRICULUM_COURSE_UNIT_REQUIRED');
  if (args.units && !args.exam) throw Error('UNITS_REQUIRES_EXAM');
  if (args.stage && !['pt','tpl'].includes(args.stage)) throw Error('STAGE_MUST_BE_PT_OR_TPL');
  if ((args.stage === 'tpl') !== Boolean(args.pt)) throw Error('TPL_STAGE_REQUIRES_PT');
  const context = suppliedContext || loadContext();
  const controls={units:loadUnits(args.units,context.root),stage:args.stage||'all',pt:args.pt};
  const result = args.exam ? buildWorkload(context, readExam(context, args.exam), controls)
    : { schemaVersion: 'type-judgment-options-v1', ...integrity(context),
      options: buildOptions(context, { curriculum: args.curriculum, course: args.course, unit: args.unit, sub: args.sub || null }, controls) };
  writeOutput(args.format === 'md' ? formatMarkdown(result) : `${JSON.stringify(result, null, 2)}\n`, args.out, context.root);
  return args.strict && !result.verified ? 1 : 0;
}
if (isMain(import.meta.url)) {
  try { process.exitCode = runCli(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
