const assert = require("node:assert/strict");
const core = require("../archive/archive2-core.js");
const { catalog, withTestAssignments } = require("./helpers/archive2-scope-harness.cjs");

const authoritylessRpm = {
  sourceStatus: "VERIFIED",
  sourceIntegrityStatus: "VERIFIED",
  taxonomyStatus: "CONFIRMED",
  foundationTaxonomyStatus: "PROJECTION_PENDING",
  metadataConflicts: [],
};
assert.equal(core.advancedAuthority(authoritylessRpm), "rpm");
assert.equal(core.advancedEligible(authoritylessRpm), false, "stored RPM confirmation cannot replace current assignment proof");

// Verify reviewed Meta Foundation eligibility with an explicit, current proof
// fixture. The production catalog is allowed to have zero certified MF leaves:
// registration must not synthesize semantic approvals to satisfy a test.
const basic = catalog.records.find(row => core.basicEligibility(row, {
  canonicalAuthority: catalog.canonicalAuthority,
}).ok);
assert.ok(basic, "the current projection should include a reviewed BASIC parent");
const parent = core.Canonical.validateBasicAssignment(basic, catalog.canonicalAuthority).parent;
assert.ok(parent);
const problemTypeKey = "TEST_REGISTRATION_MF_PROBLEM";
const templateKey = "TEST_REGISTRATION_MF_TEMPLATE";
const standardUnitKey = basic.standardUnitKey || "";
const subUnitKey = basic.subUnitKey || "";
const bindingKey = [parent.curriculumKey, standardUnitKey, subUnitKey, problemTypeKey].join("\u0000");
const approvedMeta = {
  ...basic,
  problemTypeKey,
  templateKey,
  metaFoundationPackVersion: "test-reviewed-v1",
  foundationTaxonomyStatus: "CONFIRMED",
  metadataConflicts: [],
};
const advancedProof = {
  ...parent,
  questionUid: basic.questionUid,
  standardUnitKey,
  subUnitKey,
  problemTypeKey,
  templateKey,
  taxonomyVersion: catalog.canonicalAuthority.taxonomyVersion,
  approvalStatus: "APPROVED",
  reviewEvidence: {
    status: "PASS",
    reference: "tests/archive2-meta-v2-semantic-authority.test.cjs",
    sha256: "e".repeat(64),
  },
};
const authority = {
  ...catalog.canonicalAuthority,
  advancedAssignmentsByUid: {
    ...catalog.canonicalAuthority.advancedAssignmentsByUid,
    [basic.questionUid]: [advancedProof],
  },
  problemTypeKeys: new Set([...catalog.canonicalAuthority.problemTypeKeys, problemTypeKey]),
  templatesByKey: {
    ...catalog.canonicalAuthority.templatesByKey,
    [templateKey]: { status: "ACTIVE", parentProblemTypeKey: problemTypeKey },
  },
  bindingKeys: new Set([...catalog.canonicalAuthority.bindingKeys, bindingKey]),
};
assert.equal(core.Canonical.validateAdvancedAssignment(approvedMeta, authority).ok, true);
assert.equal(core.advancedAuthority(approvedMeta), "mf");
assert.equal(core.advancedEligible(approvedMeta, { canonicalAuthority: authority }), true);
assert.equal(core.advancedEligible({ ...approvedMeta, foundationTaxonomyStatus: "PROJECTION_PENDING" }, {
  canonicalAuthority: authority,
}), false);
assert.equal(core.advancedEligible({ ...approvedMeta, foundationTaxonomyStatus: "CONFIRMED" }, {
  canonicalAuthority: authority,
}), true);
const withoutAdvancedProof = {
  ...authority,
  advancedAssignmentsByUid: { ...authority.advancedAssignmentsByUid, [basic.questionUid]: [] },
};
assert.equal(core.advancedEligible(approvedMeta, { canonicalAuthority: withoutAdvancedProof }), false,
  "an MF leaf without approved advanced evidence remains blocked");
const inactiveTemplate = {
  ...authority,
  templatesByKey: {
    ...authority.templatesByKey,
    [templateKey]: { status: "HOLD", parentProblemTypeKey: problemTypeKey },
  },
};
assert.equal(core.advancedEligible(approvedMeta, { canonicalAuthority: inactiveTemplate }), false,
  "an inactive template cannot be treated as approved");
assert.equal(core.advancedEligible({ ...approvedMeta, L2: "unapproved parent" }, {
  canonicalAuthority: authority,
}), false, "an invalid parent cannot use advanced evidence");

const heldAdvanced = { ...basic, semanticDisposition: "META_CANONICAL_HOLD", __testApprovedAssignment: true };
const data = withTestAssignments({ ...catalog, records: [heldAdvanced] }, [heldAdvanced]);
assert.equal(core.basicEligibility(heldAdvanced, { canonicalAuthority: data.canonicalAuthority }).ok, true,
  "an advanced semantic hold does not revoke the independently reviewed BASIC parent");
console.log("Archive2 META_V2 semantic authority PASS");
