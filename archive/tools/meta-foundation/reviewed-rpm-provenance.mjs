import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { authenticatedPrerequisiteRpmScope } from "./reviewed-m2s1-prerequisite-existing-application.mjs";

export const REVIEWED_RPM_FIELDS = Object.freeze(["rpmPrimaryId", "rpmPrimaryPath", "rpmL1", "rpmL2", "rpmL3", "rpmL4"]);
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const CROSSWALKS = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0";
const fail = message => { throw new Error(`RPM provenance: ${message}`); };
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const present = value => typeof value === "string" && value.trim();
const compact = value => String(value || "").normalize("NFC").replace(/\s/g, "");
const dimensions = ["majorUnit", "midUnit", "l3", "l4"];

function readAuthority(root, cache) {
  const key = `rpm-provenance:${root}`;
  if (cache.has(key)) return cache.get(key);
  const read = relative => {
    const full = path.join(root, relative);
    if (!fs.existsSync(full) || fs.lstatSync(full).isSymbolicLink()) fail("authority file unavailable");
    const bytes = fs.readFileSync(full);
    return { doc: JSON.parse(bytes), ref: { path: relative, sha256: sha256(bytes) } };
  };
  const master = read(MASTER), rows = [];
  if (master.doc.schemaVersion !== "js-archive-taxonomy-rpm-primary-v1.0" || master.doc.authorityStatus !== "LOCKED" ||
      !Array.isArray(master.doc.records)) fail("RPM master authority mismatch");
  const directory = path.join(root, CROSSWALKS);
  if (!fs.existsSync(directory) || fs.lstatSync(directory).isSymbolicLink()) fail("crosswalk authority unavailable");
  for (const filename of fs.readdirSync(directory).filter(name => /^[a-z0-9-]+\.json$/.test(name)).sort()) {
    const value = read(`${CROSSWALKS}/${filename}`);
    if (!Array.isArray(value.doc.records)) fail("crosswalk records missing");
    for (const record of value.doc.records) rows.push({ ...value, record });
  }
  const result = { master, rows }; cache.set(key, result); return result;
}

function normalizedPath(value) {
  if (typeof value === "string") {
    const parts = value.includes(" > ") ? value.split(" > ") : value.split("/");
    if (parts.length !== 4 || parts.some(part => !part.trim())) fail("declared RPM path malformed");
    return Object.fromEntries(dimensions.map((key, i) => [key, parts[i].trim()]));
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("declared RPM path required");
  return Object.fromEntries(dimensions.map((key, i) => {
    const values = [key, `L${i + 1}`, `rpmL${i + 1}`].filter(alias => Object.hasOwn(value, alias)).map(alias => value[alias]);
    if (!values.length || values.some(v => !present(v) || v !== values[0])) fail("RPM path aliases missing or conflicting");
    return [key, values[0]];
  }));
}

// This alias identifies an RPM path, not a new PT/TPL authority. The ordinary
// registrar still validates the reviewed PT/TPL, parent and exact ACTIVE binding.
// A crosswalk's old single-template mapping must not override a reviewed decision.
export function validateRpmPrimaryProvenance({ root, question, final, cache = new Map(), prerequisiteAuthority = null }) {
  const id = final.rpmPrimaryId;
  if (!Object.hasOwn(question, "rpmPrimaryId") || !isDeepStrictEqual(question.rpmPrimaryId, id))
    fail("rpmPrimaryId must carry the exact declared source value");
  if (id === null) return null;
  if (!present(id)) fail("rpmPrimaryId must be a nonempty record ID or null");
  const { master, rows } = readAuthority(root, cache), matches = rows.filter(value => value.record.id === id);
  if (matches.length !== 1) fail("record ID missing or ambiguous");
  const { doc, ref, record } = matches[0];
  if (doc.schemaVersion !== "rpm-primary-active-crosswalk-v1" || doc.status !== "ACTIVE_REFERENCE" ||
      doc.rpmAuthority?.source !== MASTER) fail("crosswalk authority mismatch");
  const curricula = [final.curriculum, final.curriculumKey].filter(present);
  if (!curricula.length || curricula.some(value => value !== record.curriculum))
    fail("record curriculum/scope mismatch");
  const sameScope = [final.courseKey, final.standardCourse].some(value => compact(value) === compact(record.scope));
  const prerequisiteScopeBinding = sameScope ? null : authenticatedPrerequisiteRpmScope(prerequisiteAuthority, { question, final, record });
  if (!sameScope && !prerequisiteScopeBinding) fail("record curriculum/scope mismatch");
  for (const field of REVIEWED_RPM_FIELDS) if (Object.hasOwn(question, field) && !isDeepStrictEqual(question[field], final[field]))
    fail(`declared source/final value mismatch: ${field}`);
  const declared = normalizedPath(final.rpmPrimaryPath || Object.fromEntries(dimensions.map((key, i) => [key, final[`rpmL${i + 1}`]])));
  if (!isDeepStrictEqual(declared, record.rpmPath)) fail("record ID and RPM path disagree");
  for (let i = 0; i < dimensions.length; i++) {
    const field = `rpmL${i + 1}`;
    if (final[field] != null && final[field] !== "" && final[field] !== declared[dimensions[i]]) fail(`flat RPM field conflicts with path: ${field}`);
  }
  if (final.rpmPrimaryPath && typeof final.rpmPrimaryPath === "object") {
    const value = final.rpmPrimaryPath;
    for (const field of ["curriculum", "curriculumKey", "scope"])
      if (Object.hasOwn(value, field) && value[field] !== record[field === "curriculumKey" ? "curriculum" : field]) fail(`RPM path ${field} mismatch`);
    if (Object.hasOwn(value, "recordId") && value.recordId !== id || Object.hasOwn(value, "crosswalkRecordIds") &&
        (!Array.isArray(value.crosswalkRecordIds) || value.crosswalkRecordIds.length !== 1 || value.crosswalkRecordIds[0] !== id))
      fail("RPM path record ID mismatch");
  }
  const leaves = master.doc.records.filter(r => r.curriculum === record.curriculum && r.scope === record.scope &&
    r.majorUnit === declared.majorUnit && r.midUnit === declared.midUnit).flatMap(r => (r.concepts || [])
      .filter(c => c.concept === declared.l3).flatMap(c => (c.problemTypes || []).filter(p => p.problemType === declared.l4)));
  if (leaves.length !== 1) fail("record path missing or ambiguous in RPM master");
  return { recordId: id, crosswalkRef: ref, masterRef: master.ref, curriculum: record.curriculum,
    scope: record.scope, rpmPath: declared, authorityUse: "RPM_PATH_PROVENANCE_ONLY", selectsPtTpl: false,
    ...(prerequisiteScopeBinding ? { prerequisiteScopeBinding } : {}) };
}

// Display fill: the author picks only rpmPrimaryRecordId; the registrar writes rpmL1~L4 from that crosswalk row.
// Existing values are never overwritten (a differing value is only reported) and an unknown ID leaves the fields empty.
const blank = value => value === null || value === undefined || value === "";
export function fillRpmFromRecordId({ root, final, cache = new Map(), questionUid, reportTags }) {
  const id = final.rpmPrimaryRecordId;
  if (!present(id)) return;
  const matches = readAuthority(root, cache).rows.filter(value => value.record.id === id);
  if (matches.length !== 1) { reportTags.push({ questionUid, kind: "RPM_RECORD_ID_NOT_IN_CROSSWALK", rpmPrimaryRecordId: id }); return; }
  const rpmPath = matches[0].record.rpmPath, filled = [], differs = [];
  dimensions.forEach((dimension, i) => {
    const field = `rpmL${i + 1}`;
    if (blank(final[field])) { final[field] = rpmPath[dimension]; filled.push(field); }
    else if (final[field] !== rpmPath[dimension]) differs.push(field);
  });
  if (filled.length) reportTags.push({ questionUid, kind: "RPM_FILLED_FROM_RECORD_ID", rpmPrimaryRecordId: id, fields: filled });
  if (differs.length) reportTags.push({ questionUid, kind: "RPM_DIFFERS_FROM_CROSSWALK", rpmPrimaryRecordId: id, fields: differs });
}
