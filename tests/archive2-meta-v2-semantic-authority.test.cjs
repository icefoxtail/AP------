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

const approvedMeta = catalog.records.find(row => core.advancedEligible(row, {
  canonicalAuthority: catalog.canonicalAuthority,
}));
assert.ok(approvedMeta, "the current projection should include a reviewed Meta Foundation leaf");
assert.equal(core.advancedAuthority(approvedMeta), "mf");
assert.equal(core.advancedEligible(approvedMeta, { canonicalAuthority: catalog.canonicalAuthority }), true);
assert.equal(core.advancedEligible({ ...approvedMeta, foundationTaxonomyStatus: "PROJECTION_PENDING" }, {
  canonicalAuthority: catalog.canonicalAuthority,
}), false);
assert.equal(core.advancedEligible({ ...approvedMeta, foundationTaxonomyStatus: "CONFIRMED" }, {
  canonicalAuthority: catalog.canonicalAuthority,
}), true);

const basic = catalog.records.find(row => core.basicEligibility(row, {
  canonicalAuthority: catalog.canonicalAuthority,
}).ok);
assert.ok(basic);
const heldAdvanced = { ...basic, semanticDisposition: "META_CANONICAL_HOLD", __testApprovedAssignment: true };
const data = withTestAssignments({ ...catalog, records: [heldAdvanced] }, [heldAdvanced]);
assert.equal(core.basicEligibility(heldAdvanced, { canonicalAuthority: data.canonicalAuthority }).ok, true,
  "an advanced semantic hold does not revoke the independently reviewed BASIC parent");
console.log("Archive2 META_V2 semantic authority PASS");
