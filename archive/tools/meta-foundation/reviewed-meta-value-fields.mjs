// The native writer and read-only reuse checks share one exact value contract.
// Native review documents may also contain display/order fields outside this set;
// those fields are not approved or copied into metadata by the registrar.
export const REVIEWED_SOURCE_FIELDS = Object.freeze([
  'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'level', 'L3', 'L4',
  'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket',
]);
export const REVIEWED_META_VALUE_FIELDS = Object.freeze([
  ...REVIEWED_SOURCE_FIELDS, 'sourceFingerprint', 'contentFingerprint', 'curriculum', 'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4',
  'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'rpmPrimaryId', 'rpmPrimaryRecordId', 'rpmPrimaryPath', 'rpmSemanticStatus', 'semanticSourceScope', 'semanticScopeRelation',
  'primaryMethod', 'decisiveStep', 'integrationReason', 'conceptClusterKey', 'secondaryConceptKeys',
  'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'curriculumApplicability', 'defaultSelectable',
]);
