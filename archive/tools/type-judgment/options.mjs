import { loadContext, readExam, scopeForRecord, activeKey, matchingBindings, validScope, parseArgs, writeOutput, isMain } from './common.mjs';

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
function candidates(context, rows) {
  return [...new Set(rows.map(row => row.problemTypeKey))].sort().map(key => ({
    ...describe(context, context.registry.problemTypes.get(key), 'problemTypeKey'),
    templates: [...context.registry.templates.values()]
      .filter(tpl => tpl.parentProblemTypeKey === key && activeKey(context, 'TPL', tpl.templateKey))
      .sort((a, b) => a.templateKey.localeCompare(b.templateKey))
      .map(tpl => describe(context, tpl, 'templateKey')),
  }));
}
export function integrity(context) {
  return { verified: context.registry.status === 'ACTIVE',
    heading: context.registry.status === 'ACTIVE' ? '유형 판정 준비 목록 (승인 아님)' : '레지스트리 무결성 미확인',
    errors: context.registry.errors };
}
export function buildOptions(context, scope) {
  const result = { scope, status: 'EXACT', fallback: null, candidates: [], candidateExpansion: [] };
  if (!validScope(context, scope)) return { ...result, status: 'INVALID_CANONICAL_SCOPE' };
  let rows = matchingBindings(context, scope, null, { exactSub: Boolean(scope.sub) });
  if (!rows.length && scope.sub) {
    rows = matchingBindings(context, scope, null, { exactSub: false });
    if (rows.length) { result.status = 'UNIT_FALLBACK'; result.fallback = '소단원 연결 없음: 단원 전체 후보'; }
  }
  result.candidates = candidates(context, rows);
  if (!rows.length) {
    result.status = 'CANDIDATE_EXPANSION';
    result.fallback = '단원 연결 없음: 같은 교육과정·과목의 인접 단원 후보 확장 (현재 단원 승인 아님)';
    // Adjacency is deterministic natural key order, not inferred mathematical similarity.
    const units = [...new Set(context.registry.bindingRows.filter(row => row.curriculum === scope.curriculum
      && row.standardCourse === scope.course).map(row => row.standardUnitKey)), scope.unit]
      .filter((unit, i, all) => all.indexOf(unit) === i).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    const index = units.indexOf(scope.unit);
    for (const unit of [units[index - 1], units[index + 1]].filter(Boolean)) {
      const expanded = { ...scope, unit, sub: null };
      const neighboring = candidates(context, matchingBindings(context, expanded, null, { exactSub: false }));
      if (neighboring.length) result.candidateExpansion.push({ unit, candidates: neighboring });
    }
  }
  return result;
}
export function buildWorkload(context, exam) {
  const optionSets = {};
  const rows = exam.rows.map(row => {
    if (!row.metadata) return { questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal,
      canonicalScope: null, optionsRef: null, status: 'MISSING_CANONICAL_METADATA' };
    const scope = scopeForRecord(row.metadata);
    const ref = JSON.stringify([scope.curriculum, scope.course, scope.unit, scope.sub, scope.curriculumKey || null, scope.courseKey || null]);
    optionSets[ref] ||= buildOptions(context, scope);
    return { questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal, canonicalScope: scope, optionsRef: ref };
  });
  return { schemaVersion: 'type-judgment-workload-v1', ...integrity(context), exam: exam.exam, rows, optionSets };
}
export function formatMarkdown(result) {
  const lines = [`# ${result.heading}`, '', '읽기 전용 후보이며 판정·승인·등록 결과가 아닙니다.', ''];
  for (const error of result.errors || []) lines.push(`- ${error}`);
  const groups = result.optionSets ? Object.entries(result.optionSets) : [['선택 범위', result.options]];
  for (const [name, group] of groups) {
    lines.push(`## ${name}`, `상태: ${group.status}`, group.fallback || '', '');
    const append = list => { for (const pt of list) {
      lines.push(`### ${pt.key}: ${pt.canonicalLabelKo}`, pt.definition || '');
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
  const args = parseArgs(argv, ['--curriculum', '--course', '--unit', '--sub', '--format', '--exam', '--out'], ['--strict']);
  if (args.format && !['json', 'md'].includes(args.format)) throw Error('FORMAT_MUST_BE_JSON_OR_MD');
  if (args.exam && ['curriculum', 'course', 'unit', 'sub'].some(key => args[key])) throw Error('EXAM_USES_CANONICAL_SCOPE_ONLY');
  if (args.exam && args.format === 'md') throw Error('EXAM_WORKLOAD_REQUIRES_JSON');
  if (!args.exam && (!args.curriculum || !args.course || !args.unit)) throw Error('CURRICULUM_COURSE_UNIT_REQUIRED');
  const context = suppliedContext || loadContext();
  const result = args.exam ? buildWorkload(context, readExam(context, args.exam))
    : { schemaVersion: 'type-judgment-options-v1', ...integrity(context),
      options: buildOptions(context, { curriculum: args.curriculum, course: args.course, unit: args.unit, sub: args.sub || null }) };
  writeOutput(args.format === 'md' ? formatMarkdown(result) : `${JSON.stringify(result, null, 2)}\n`, args.out, context.root);
  return args.strict && !result.verified ? 1 : 0;
}
if (isMain(import.meta.url)) {
  try { process.exitCode = runCli(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
