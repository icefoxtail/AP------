(function (root, factory) {
  const api = factory(typeof module === "object" && module.exports
    ? require("./problem-bank-meta.js") : root.ProblemBankMeta);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ProblemBankAssessmentRecipes = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (meta) {
  "use strict";
  if (!meta) throw new Error("PROBLEM_BANK_META_UNAVAILABLE");
  // Shared selection defaults only; this module does not publish or generate packs.
  const RECIPES = Object.freeze({
    FIVE_MINUTE: Object.freeze({ key: "FIVE_MINUTE", label: "5분 테스트", defaultCount: 4, profile: "VERIFIED" }),
    SUBUNIT: Object.freeze({ key: "SUBUNIT", label: "소단원 평가", defaultCount: 12, profile: "VERIFIED" }),
    UNIT: Object.freeze({ key: "UNIT", label: "단원 평가", defaultCount: 20, profile: "VERIFIED" }),
    MONTHLY: Object.freeze({ key: "MONTHLY", label: "월말 평가", defaultCount: 24, profile: "VERIFIED" }),
  });
  function getRecipe(key) {
    const recipe = RECIPES[key];
    if (!recipe) throw new Error("UNKNOWN_ASSESSMENT_RECIPE:" + key);
    return recipe;
  }
  function queryRecipe(records, key, filters = {}, options = {}) {
    const recipe = getRecipe(key);
    const profile = options.profile || recipe.profile;
    const candidates = meta.query(Array.isArray(records) ? records : [], filters, { profile });
    const uids = new Set(candidates.map(row => row.questionUid || row.uid).filter(Boolean));
    const familyFor = row => row.variantGroupKey || row.familyKey || row.templateFamilyKey || null;
    const knownFamilies = new Set(candidates.map(familyFor).filter(Boolean));
    const familyUnknownUids = new Set(candidates.filter(row => !familyFor(row))
      .map(row => row.questionUid || row.uid).filter(Boolean));
    const requestedCount = Number.isInteger(options.count) && options.count > 0
      ? options.count : recipe.defaultCount;
    const available = uids.size;
    return Object.freeze({
      recipe,
      profile,
      requestedCount,
      candidates,
      coverage: Object.freeze({
        available,
        duplicateUidCount: candidates.length - available,
        distinctKnownFamilyCount: knownFamilies.size,
        familyUnknownUidCount: familyUnknownUids.size,
        shortage: Math.max(0, requestedCount - available),
        familyShortage: options.uniqueFamilies === true
          ? Math.max(0, requestedCount - knownFamilies.size) : 0,
      }),
    });
  }
  return Object.freeze({ VERSION: "PROBLEM_BANK_ASSESSMENT_RECIPE_META_V1", RECIPES, getRecipe, queryRecipe });
});
