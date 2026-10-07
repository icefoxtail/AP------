import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { objectSha } from './pipeline-core/canonical.mjs';
import { validateMetaValidatorReceipt, validateResolverEvidence } from './meta-foundation/rpm-active-resolver.mjs';

export const QUALITY_CONTRACT_V2 = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';

const META_FIELDS = Object.freeze([
  'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder',
  'subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth',
  'problemTypeKey',
  'templateKey',
  'crossConceptKeys',
  'conditionKeys',
  'integrationPattern',
]);

const DIFFICULTY_FIELDS = Object.freeze([
  'difficultyBucket',
  'difficultyConfidence',
  'difficultyBoundaryFlag',
  'legacyLevelCompatibility',
]);

const BASIC_FIELDS = ['id', 'level', 'category', 'originalCategory', 'questionType', 'layoutTag', 'tags', 'wide', 'content', 'choices', 'answer', 'solution'];
const DIFFICULTY_ENUMS = { difficultyConfidence: ['high','medium','low','UNKNOWN'], difficultyBoundaryFlag: ['NONE','B12','B23','B34','B45','UNKNOWN'], legacyLevelCompatibility: ['NORMAL','BORDERLINE_REVIEW','BORDERLINE_ACCEPTABLE','STRONG_CONFLICT','UNKNOWN'] };
const EXCLUDED_ANSWERS = new Set(['__EXCLUDED__', 'EXCLUDED_CANDIDATE']);
const CIRCLED_PREFIX = /^\s*(?:①|②|③|④|⑤)\s*/;
const CONTROL_ESCAPE = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/;

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const array = value => Array.isArray(value) ? value : [];

export function solutionSha256(solution) {
  return createHash('sha256').update(String(solution ?? ''), 'utf8').digest('hex');
}

function rowMap(evidence) {
  return new Map(array(evidence?.rows)
    .map(row => [Number(row?.qid), row])
    .filter(([qid]) => Number.isInteger(qid)));
}

function inspectControlEscapes(question, qid, issues) {
  const values = [
    ['content', question?.content],
    ['solution', question?.solution],
    ['decisiveStep', question?.decisiveStep],
    ...array(question?.choices).map((value, index) => ['choices[' + index + ']', value]),
  ];

  for (const [field, value] of values) {
    if (typeof value === 'string' && (CONTROL_ESCAPE.test(value) || /\r(?!\n)/.test(value))) {
      issues.push('ARTIFACT_CONTROL_ESCAPE:' + field + ':q' + qid);
    }
  }
}

function validateRpmOnlyNullSubUnitProjection(question, row, qid, repoRoot, issues) {
  const debtFields = new Set(array(row?.metaDebtFields).map(String));
  if (!debtFields.has('subUnitKey')) return false;
  const projection = row?.rpmOnlyNullSubUnitProjection;
  try {
    const input = projection?.input;
    const evidence = projection?.resolverEvidence;
    const context = input?.curriculumContext || {};
    const source = input?.sourceIdentity || {};
    const solution = input?.solutionIdentity || {};
    const exactScope = projection?.schemaVersion === 'JS_ARCHIVE_RPM_ONLY_NULL_SUBUNIT_PROJECTION_V1'
      && context.grade === 'H2' && context.curriculum === '2015' && context.scope === '기하'
      && ['기하', '기하와 벡터'].includes(context.standardCourse)
      && question.standardCourse === context.standardCourse
      && context.standardUnitKey === question.standardUnitKey
      && context.subUnitKey === '';
    const exactArtifact = question.subUnitKey === null
      && source.sourceOrdinal === qid
      && source.contentHash === objectSha(question.content ?? '')
      && source.choicesHash === objectSha(question.choices ?? [])
      && source.imageRefHash === objectSha({
        image: question.image ?? '', visualAsset: question.visualAsset ?? '',
        fullPageImagePath: question.fullPageImagePath ?? '', fullPageImageRelPath: question.fullPageImageRelPath ?? '',
        sourceEvidencePath: question.sourceEvidencePath ?? '', sourcePageEvidencePaths: question.sourcePageEvidencePaths ?? [],
      })
      && (!question.sourceIdentityKey || source.sourceIdentityKey === question.sourceIdentityKey)
      && solution.solutionHash === objectSha(question.solution ?? '');
    const exactResolution = evidence?.semanticStatus === 'FINAL'
      && evidence?.disposition === 'RPM_SEMANTIC_FINAL'
      && evidence?.projectionStatus === 'PROJECTION_UNMATERIALIZED'
      && evidence?.projectionReasonCode === 'RPM_ONLY_COMPATIBILITY_PROJECTION'
      && evidence?.crosswalkFile === 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json'
      && evidence?.crosswalkStatus === 'RPM_ONLY';
    if (!repoRoot || !exactScope || !exactArtifact || !exactResolution) throw new Error('PROJECTION_BINDING_INVALID');
    const validation = validateResolverEvidence(input, evidence, { repoRoot });
    if (validation.status !== 'PASS') throw new Error('RESOLVER_EVIDENCE_INVALID');
    const receipt = projection.validatorReceipt;
    if (!validateMetaValidatorReceipt(receipt, evidence.evidenceSha, validation)) throw new Error('RESOLVER_RECEIPT_INVALID');
    return true;
  } catch {
    issues.push('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q' + qid);
    return false;
  }
}

function loadH15GeometryProjectionAuthority(repoRoot) {
  if (!repoRoot) throw new Error('REPO_ROOT_REQUIRED');
  const standardUnitsPath = path.join(repoRoot, 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md');
  const standardUnits = fs.readFileSync(standardUnitsPath, 'utf8');
  const crosswalkPath = path.join(repoRoot, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json');
  const crosswalk = JSON.parse(fs.readFileSync(crosswalkPath, 'utf8'));
  const metadataPath = path.join(repoRoot, 'archive/data/question_metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const registeredKeys = new Set(array(metadata.records).map(record => [record.standardCourse, record.standardUnitKey, record.subUnitKey].join('|')));
  return { standardUnits, crosswalkRecords: array(crosswalk.records), registeredKeys };
}

function validateH15GeometrySubUnitProjection(question, qid, authority, issues) {
  if (!/^H15-GV-\d{2}$/.test(String(question?.standardUnitKey || '')) || !nonEmpty(question?.subUnitKey)
    || question.subUnitKey === question.standardUnitKey) return;
  if (!authority) {
    issues.push('ARTIFACT_META_GEOMETRY_RPM_ONLY_KEY_AUTHORITY_UNAVAILABLE:q' + qid);
    return;
  }
  if (!authority.standardUnits.includes('| ' + question.standardUnitKey + ' |')) return;
  const rows = authority.crosswalkRecords.filter(record => record.curriculum === '2015'
      && record.standardUnitKey === question.standardUnitKey);
  const rpmOnlyWithoutSubUnit = rows.length === 0 || rows.every(record => record.mappingStatus === 'RPM_ONLY'
    && record.bindingStatus === 'NO_ACTIVE_MAPPING' && record.subUnitKey === null);
  if (!rpmOnlyWithoutSubUnit) return;

  const legacyKey = [question.standardCourse, question.standardUnitKey, question.subUnitKey].join('|');
  if (!authority.registeredKeys.has(legacyKey)) issues.push('ARTIFACT_META_GEOMETRY_RPM_ONLY_NONCANONICAL_SUBUNIT_KEY:q' + qid);
}

function validateMeta(question, row, qid, repoRoot, h15GeometryAuthority, issues) {
  const debtFields = new Set(array(row?.metaDebtFields).map(String));
  const allowedNullSubUnit = validateRpmOnlyNullSubUnitProjection(question, row, qid, repoRoot, issues);
  validateH15GeometrySubUnitProjection(question, qid, h15GeometryAuthority, issues);
  for (const field of ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth']) {
    if (hasOwn(question, field) && !nonEmpty(question[field]) && !(field === 'subUnitKey' && question[field] === null && allowedNullSubUnit)) issues.push('ARTIFACT_META_VALUE_REQUIRED:'+field+':q'+qid);
  }
  if (!Number.isInteger(question.standardUnitOrder) || question.standardUnitOrder < 0) issues.push('ARTIFACT_META_ORDER_INVALID:q'+qid);
  for (const field of META_FIELDS) {
    if (!hasOwn(question, field)) {
      issues.push('ARTIFACT_META_FIELD_REQUIRED:' + field + ':q' + qid);
    }
  }

  if (hasOwn(question, 'crossConceptKeys') && (!Array.isArray(question.crossConceptKeys) || question.crossConceptKeys.some(v=>!nonEmpty(v)))) {
    issues.push('ARTIFACT_META_ARRAY_REQUIRED:crossConceptKeys:q' + qid);
  }
  if (hasOwn(question, 'conditionKeys') && (!Array.isArray(question.conditionKeys) || question.conditionKeys.some(v=>!nonEmpty(v)))) {
    issues.push('ARTIFACT_META_ARRAY_REQUIRED:conditionKeys:q' + qid);
  }
  if (hasOwn(question, 'integrationPattern') && !nonEmpty(question.integrationPattern)) {
    issues.push('ARTIFACT_META_VALUE_REQUIRED:integrationPattern:q' + qid);
  }

  if([...debtFields].some(f=>!['problemTypeKey','templateKey','subUnitKey'].includes(f))
    || (debtFields.has('subUnitKey') && !allowedNullSubUnit)) issues.push('ARTIFACT_META_DEBT_FIELD_INVALID:q'+qid);
  for (const field of ['problemTypeKey', 'templateKey']) {
    if (hasOwn(question, field) && !nonEmpty(question[field])) {
      if (question[field] !== null) issues.push('ARTIFACT_META_NULL_OR_STRING_REQUIRED:'+field+':q'+qid);
      if (!debtFields.has(field)) {
        issues.push('ARTIFACT_META_DEBT_REQUIRED:' + field + ':q' + qid);
      }
    }
  }
  if (debtFields.size > 0 && !nonEmpty(row?.metaDebtReason)) {
    issues.push('ARTIFACT_META_DEBT_REASON_REQUIRED:q' + qid);
  }
}

function validateDifficulty(question, qid, issues) {
  for (const field of DIFFICULTY_FIELDS) {
    if (!hasOwn(question, field)) {
      issues.push('ARTIFACT_DIFFICULTY_FIELD_REQUIRED:' + field + ':q' + qid);
    }
  }
  if (hasOwn(question, 'difficultyBucket')
      && (!Number.isInteger(question.difficultyBucket)
        || question.difficultyBucket < 1
        || question.difficultyBucket > 5)) {
    issues.push('ARTIFACT_DIFFICULTY_BUCKET_INVALID:q' + qid);
  }
  for (const field of ['difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
    if (hasOwn(question, field) && !DIFFICULTY_ENUMS[field].includes(question[field])) issues.push('ARTIFACT_DIFFICULTY_ENUM_INVALID:'+field+':q'+qid);
    if (hasOwn(question, field) && !nonEmpty(question[field])) {
      issues.push('ARTIFACT_DIFFICULTY_VALUE_REQUIRED:' + field + ':q' + qid);
    }
  }
}

function validateChoiceStructure(question, qid, issues) {
  if (!Array.isArray(question?.choices)) issues.push('ARTIFACT_CHOICES_ARRAY_REQUIRED:q'+qid);
  const choices = array(question?.choices);
  for (let index = 0; index < choices.length; index += 1) {
    const choice = choices[index];
    if (typeof choice !== 'string' || !choice.trim()) {
      issues.push('ARTIFACT_CHOICE_VALUE_REQUIRED:q' + qid + ':i' + index);
      continue;
    }
    if (CIRCLED_PREFIX.test(choice)) {
      issues.push('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:q' + qid + ':i' + index);
    }
  }

  if (choices.length > 0) {
    const answer = question?.answer;
    if (!(typeof answer === 'string' || typeof answer === 'number') || String(answer).trim() === '') {
      issues.push('ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q' + qid);
    }
  }
}

function validateSmallBoard(question, row, qid, issues) {
  if (!nonEmpty(question?.solution)) {
    issues.push('ARTIFACT_SOLUTION_REQUIRED:q' + qid);
    return;
  }
  if (String(row?.smallBoardContinuityStatus || '').toUpperCase() !== 'PASS') {
    issues.push('ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q' + qid);
  }
  const expected = solutionSha256(question.solution);
  if (!nonEmpty(row?.solutionSha256)) {
    issues.push('ARTIFACT_SOLUTION_SHA256_REQUIRED:q' + qid);
  } else if (row.solutionSha256 !== expected) {
    issues.push('ARTIFACT_SOLUTION_SHA256_MISMATCH:q' + qid);
  }
}


function validateBasicSchema(question, qid, issues) {
  for (const field of BASIC_FIELDS) if (!hasOwn(question,field)) issues.push('ARTIFACT_BASIC_FIELD_REQUIRED:'+field+':q'+qid);
  for (const field of ['content','solution','questionType']) if (!nonEmpty(question?.[field])) issues.push('ARTIFACT_VALUE_REQUIRED:'+field+':q'+qid);
  if (!(nonEmpty(question?.answer) || (typeof question?.answer==='number' && Number.isFinite(question.answer)))) issues.push('ARTIFACT_ANSWER_REQUIRED:q'+qid);
  for (const field of ['category','originalCategory','layoutTag']) if (typeof question?.[field] !== 'string') issues.push('ARTIFACT_STRING_REQUIRED:'+field+':q'+qid);
  if (!Array.isArray(question?.tags) || question.tags.some(t=>!nonEmpty(t))) issues.push('ARTIFACT_TAGS_ARRAY_REQUIRED:q'+qid);
  if (typeof question?.wide !== 'boolean') issues.push('ARTIFACT_WIDE_BOOLEAN_REQUIRED:q'+qid);
  // difficulty canonical v1.3: historical level labels are not numeric bucket values.
  if (!['하','중','상'].includes(question?.level)) issues.push('ARTIFACT_LEGACY_LEVEL_INVALID:q'+qid);
}

function resolveInside(root, relative) {
  if (!root || !nonEmpty(relative) || path.isAbsolute(relative)) throw new Error('ROOT_OR_RELATIVE_REQUIRED');
  const normalized=relative.replaceAll('\\','/');
  const target=path.resolve(root,normalized),rel=path.relative(path.resolve(root),target);
  if (rel==='..' || rel.startsWith('..'+path.sep) || path.isAbsolute(rel)) throw new Error('PATH_ESCAPE');
  if (fs.existsSync(target)) {
    const real=fs.realpathSync(target),rr=path.relative(fs.realpathSync(root),real);
    if (rr==='..' || rr.startsWith('..'+path.sep) || path.isAbsolute(rr)) throw new Error('SYMLINK_ESCAPE');
  }
  return target;
}

function validateAssetRefs(question,qid,assetRoot,issues) {
  const refs=[];
  for (const field of ['image','solutionImage','visualAsset']) if (question?.[field] !== undefined && question[field] !== '') {
    if (!nonEmpty(question[field])) issues.push('ARTIFACT_ASSET_REF_INVALID:'+field+':q'+qid);
    else refs.push(question[field]);
  }
  for (const field of ['content','solution']) if (typeof question?.[field]==='string') {
    for (const match of question[field].matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/gi)) if(!/^(?:data:|#)/.test(match[1])) refs.push(match[1]);
  }
  const seen=new Set();
  for (let i=0;i<refs.length;i++) {
    const ref=refs[i].replaceAll('\\','/');if(seen.has(ref))continue;seen.add(ref);
    try {
      if(!ref.startsWith('assets/images/') || /(?:^|\/)generated(?:\/|\.)|_generated/i.test(ref)) throw new Error('NON_PRODUCTION_REF');
      const file=resolveInside(assetRoot,ref);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error('NOT_FOUND');
      if (file.endsWith('.svg')) for (const m of fs.readFileSync(file,'utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi)) {
        if (/^(?:data:|#)/.test(m[1]))continue;
        refs.push(path.posix.normalize(path.posix.join(path.posix.dirname(ref),m[1])));
      }
    } catch(error) {issues.push('ARTIFACT_ASSET_REF_INVALID:q'+qid+':'+ref+':'+error.message);}
  }
}

function validateGoldenProvenance(evidence,repoRoot,issues) {
  try {
    const registryPath = evidence.executionLine === 'GPT_SCHEDULED' ? 'archive/data/gpt-quality-calibration-registry-v2.json' : 'archive/data/codex-quality-calibration-registry-v2.json';
    const registry=JSON.parse(fs.readFileSync(resolveInside(repoRoot,registryPath),'utf8'));
    if (registry.executionLine && registry.executionLine !== evidence.executionLine) throw new Error('REGISTRY_EXECUTION_LINE_MISMATCH');
    if(registry.qualityContractVersion!==QUALITY_CONTRACT_V2) throw new Error('REGISTRY_VERSION_MISMATCH');
    const negative=evidence.goldenCalibration?.negativeSample;
    if(!negative || !registry.negativePaths?.includes(negative.path) || !nonEmpty(negative.observation) || solutionSha256(fs.readFileSync(resolveInside(repoRoot,negative.path),'utf8'))!==negative.sha256) throw new Error('NEGATIVE_SAMPLE_BINDING_REQUIRED');
    const samples=evidence.goldenCalibration?.samples;
    if (!Array.isArray(samples) || samples.length<2 || samples.length>3) throw new Error('SAMPLES_REQUIRED');
    const paths=samples.map(s=>s?.path);
    if (new Set(paths).size!==paths.length || paths.some(p=>!registry.goldenPaths.includes(p))) throw new Error('UNAPPROVED_SAMPLE');
    if (JSON.stringify([...paths].sort())!==JSON.stringify([...array(evidence.goldenCalibrationSet)].sort())) throw new Error('SET_MISMATCH');
    for (const sample of samples) {
      const file=resolveInside(repoRoot,sample.path),bytes=fs.readFileSync(file);
      if (solutionSha256(bytes.toString('utf8'))!==sample.sha256) throw new Error('FILE_SHA_MISMATCH');
      const box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});
      if (!Array.isArray(sample.items) || sample.items.length<2 || sample.items.some(i=>!Number.isInteger(i.qid)||i.qid<1) || new Set(sample.items.map(i=>i.qid)).size!==sample.items.length) throw new Error('ITEMS_REQUIRED');
      let visualReviewed=false;
      for (const item of sample.items) {
        if((registry.knownExceptions||[]).some(e=>e.path===sample.path && e.qid===item.qid && array(item.axes).includes(e.axis))) throw new Error('KNOWN_GOLDEN_EXCEPTION');
        const q=box.window.questionBank?.find(q=>Number(q.id)===Number(item.qid));
        if(!q || !nonEmpty(item.observation) || solutionSha256(q.solution)!==item.solutionSha256) throw new Error('ITEM_BINDING_REQUIRED');
        if(q.solutionImage) {
          const visual=resolveInside(repoRoot,'archive/'+q.solutionImage);
          if(solutionSha256(fs.readFileSync(visual,'utf8'))!==item.visualSha256) throw new Error('GOLDEN_VISUAL_BINDING_REQUIRED');
          visualReviewed=visualReviewed || !(registry.knownExceptions||[]).some(e=>e.path===sample.path && e.qid===item.qid && e.axis==='VISUAL_SEMANTIC_PARITY');
        }
      }
      if(box.window.questionBank?.some(q=>q.solutionImage) && !visualReviewed) throw new Error('GOLDEN_VISUAL_READ_REQUIRED');
    }
  } catch(error) {issues.push('ARTIFACT_GOLDEN_PROVENANCE_INVALID:'+error.message);}
}

export function validateArtifactContract({ stage, evidence, questions, repoRoot, assetRoot = repoRoot && path.join(repoRoot, 'archive') }) {
  const active = evidence?.qualityContractVersion === QUALITY_CONTRACT_V2;
  if (!active) {
    return {
      validatorLayer: 'ARTIFACT_CONTRACT_V2',
      active: false,
      qualityContractVersion: evidence?.qualityContractVersion || null,
      issues: [],
    };
  }

  const issues = [];
  const normalizedStage = String(stage || '').toUpperCase();
  const rows = rowMap(evidence);
  // Full-artifact dispositions do not expand targeted R3 review rows.
  const dispositions = new Map();
  if (evidence.artifactDispositions !== undefined) {
    if (!evidence.artifactDispositions || evidence.artifactDispositions.artifactSha !== evidence.artifactSha || !Array.isArray(evidence.artifactDispositions.rows)) issues.push('ARTIFACT_DISPOSITIONS_BINDING_REQUIRED');
    else for (const row of evidence.artifactDispositions.rows) {
      const id = Number(row?.qid);
      if (!Number.isInteger(id) || dispositions.has(id) || !array(questions).some(q=>Number(q.id)===id)) issues.push('ARTIFACT_DISPOSITIONS_QID_INVALID');
      else dispositions.set(id,row);
    }
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    issues.push('ARTIFACT_QUESTION_BANK_REQUIRED');
  }
  const needsH15GeometryAuthority = array(questions).some(question => /^H15-GV-\d{2}$/.test(String(question?.standardUnitKey || ''))
    && nonEmpty(question?.subUnitKey) && question.subUnitKey !== question.standardUnitKey);
  let h15GeometryAuthority = null;
  if (needsH15GeometryAuthority) {
    try { h15GeometryAuthority = loadH15GeometryProjectionAuthority(repoRoot); }
    catch { h15GeometryAuthority = null; }
  }

  if (['CREATE', 'R1'].includes(normalizedStage)) {
    if (evidence?.goldenCalibrationReviewed !== true) {
      issues.push('ARTIFACT_GOLDEN_CALIBRATION_REQUIRED');
    }
    if (!Array.isArray(evidence?.goldenCalibrationSet) || evidence.goldenCalibrationSet.length === 0) {
      issues.push('ARTIFACT_GOLDEN_SET_REQUIRED');
    }
    validateGoldenProvenance(evidence, repoRoot, issues);
  }

  const seenQids = new Set();
  for (const question of array(questions)) {
    const qid = Number(question?.id);
    if (!Number.isInteger(question?.id) || qid < 1) {
      issues.push('ARTIFACT_QID_INVALID');
      continue;
    }

    if (seenQids.has(qid)) issues.push('ARTIFACT_QID_DUPLICATE:q'+qid);
    seenQids.add(qid);
    const reviewRow=rows.get(qid);
    const failed=s=>['FAIL','HOLD','NOT_VERIFIED'].includes(String(s||'').toUpperCase());
    if(failed(reviewRow?.verdict) || Object.values(reviewRow?.axisEvidence||{}).some(v=>failed(typeof v==='object'?v?.status:v))) issues.push('ARTIFACT_KNOWN_FAILED_REVIEW:q'+qid);
    validateBasicSchema(question, qid, issues);
    validateAssetRefs(question, qid, assetRoot, issues);
    validateChoiceStructure(question, qid, issues);
    inspectControlEscapes(question, qid, issues);

    if (EXCLUDED_ANSWERS.has(String(question?.answer || ''))) issues.push('ARTIFACT_EXCLUDED_STUDENT_ITEM:q'+qid);

    validateMeta(question, dispositions.get(qid) || rows.get(qid), qid, repoRoot, h15GeometryAuthority, issues);
    validateDifficulty(question, qid, issues);

    if (['CREATE', 'R1'].includes(normalizedStage)) {
      validateSmallBoard(question, rows.get(qid), qid, issues);
    }
  }

  return {
    validatorLayer: 'ARTIFACT_CONTRACT_V2',
    active: true,
    qualityContractVersion: QUALITY_CONTRACT_V2,
    stage: normalizedStage,
    questionCount: array(questions).length,
    disposition: issues.length ? 'FAIL' : 'PASS',
    issues,
  };
}
