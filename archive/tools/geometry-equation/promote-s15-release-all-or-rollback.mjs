import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const staging = path.join(reports, 'staging', 'archive');
const production = path.join(root, 'archive');
const release = JSON.parse(fs.readFileSync(path.join(reports, 'current_release_artifact.json'), 'utf8'));
const mother = JSON.parse(fs.readFileSync(path.join(reports, 'mother_preseal_S12.json'), 'utf8'));
const backupRoot = path.join(reports, 'promotion_backup_S15');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
if (mother.status !== 'MOTHER_PRE_SEAL_READY_FOR_PROMOTION' || mother.releaseArtifactSha !== release.releaseArtifactSha || !mother.shaLock.allEqual) throw new Error('Mother preseal is not ready for this exact release SHA');
const resolveInside = (base, relativePath) => { const absolute = path.resolve(base, relativePath.replaceAll('/', path.sep)); if (!absolute.startsWith(`${base}${path.sep}`)) throw new Error(`Unsafe release path: ${relativePath}`); return absolute; };
const preimage = []; const missingBefore = []; const changedBefore = [];
for (const member of release.files) {
  const sourcePath = resolveInside(staging, member.relativePath);
  const destinationPath = resolveInside(production, member.relativePath);
  const sourceInfo = { sha256: sha(fs.readFileSync(sourcePath)), bytes: fs.statSync(sourcePath).size };
  if (sourceInfo.sha256 !== member.sha256 || sourceInfo.bytes !== member.bytes) throw new Error(`Staging release member drift before promotion: ${member.relativePath}`);
  if (!fs.existsSync(destinationPath)) { missingBefore.push(member.relativePath); preimage.push({ ...member, destinationExists: false, destinationSha256: null, destinationBytes: null }); continue; }
  const destinationInfo = { sha256: sha(fs.readFileSync(destinationPath)), bytes: fs.statSync(destinationPath).size };
  const changed = destinationInfo.sha256 !== member.sha256 || destinationInfo.bytes !== member.bytes;
  if (changed) changedBefore.push(member.relativePath);
  preimage.push({ ...member, destinationExists: true, destinationSha256: destinationInfo.sha256, destinationBytes: destinationInfo.bytes, changedBefore: changed });
}
fs.mkdirSync(backupRoot, { recursive: true });
for (const row of preimage.filter((item) => item.destinationExists && item.changedBefore)) {
  const sourcePath = resolveInside(production, row.relativePath); const backupPath = resolveInside(backupRoot, row.relativePath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true }); fs.copyFileSync(sourcePath, backupPath);
}
fs.writeFileSync(path.join(reports, 'promotion_preimage_S15.json'), JSON.stringify({ status: 'PROMOTION_PREIMAGE_CAPTURED', releaseLabel: release.label, releaseArtifactSha: release.releaseArtifactSha, memberCount: release.files.length, missingBeforeCount: missingBefore.length, changedBeforeCount: changedBefore.length, changedBefore: changedBefore, missingBefore: missingBefore, backupRoot: path.relative(root, backupRoot).replaceAll('\\', '/'), preimage }, null, 2) + '\n', 'utf8');
const createdDuringPromotion = []; const copied = [];
try {
  for (const member of release.files) {
    const sourcePath = resolveInside(staging, member.relativePath); const destinationPath = resolveInside(production, member.relativePath);
    const existed = fs.existsSync(destinationPath); fs.mkdirSync(path.dirname(destinationPath), { recursive: true }); fs.copyFileSync(sourcePath, destinationPath); if (!existed) createdDuringPromotion.push(member.relativePath); copied.push(member.relativePath);
  }
  const mismatches = release.files.map((member) => { const destinationPath = resolveInside(production, member.relativePath); const actualSha256 = sha(fs.readFileSync(destinationPath)); const actualBytes = fs.statSync(destinationPath).size; return { relativePath: member.relativePath, expectedSha256: member.sha256, actualSha256, expectedBytes: member.bytes, actualBytes, pass: actualSha256 === member.sha256 && actualBytes === member.bytes }; }).filter((row) => !row.pass);
  if (mismatches.length) throw new Error(`Post-copy production member mismatch: ${mismatches.length}`);
  const productionRows = release.files.map((member) => ({ relativePath: member.relativePath, sha256: sha(fs.readFileSync(resolveInside(production, member.relativePath))), bytes: fs.statSync(resolveInside(production, member.relativePath)).size }));
  const productionSha = sha(JSON.stringify(productionRows));
  if (productionSha !== release.releaseArtifactSha) throw new Error(`Post-copy production release SHA mismatch: ${productionSha}`);
  const head = (() => { try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); } catch { return null; } })();
  fs.writeFileSync(path.join(reports, 'promotion_evidence_S15.json'), JSON.stringify({ status: 'PRODUCTION_PROMOTION_PASS', releaseLabel: release.label, releaseArtifactSha: release.releaseArtifactSha, productionRecomputedSha: productionSha, releaseMemberCount: release.files.length, copiedCount: copied.length, changedBeforeCount: changedBefore.length, missingBeforeCount: missingBefore.length, createdDuringPromotionCount: createdDuringPromotion.length, productionMemberMismatchCount: 0, atomicRollback: 'not-triggered', gitHeadAfter: head, releaseScopeOnly: true, outsideReleaseFilesTouched: false, backupRoot: path.relative(root, backupRoot).replaceAll('\\', '/') }, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ status: 'PRODUCTION_PROMOTION_PASS', releaseArtifactSha: release.releaseArtifactSha, productionRecomputedSha: productionSha, releaseMemberCount: release.files.length, changedBeforeCount: changedBefore.length, missingBeforeCount: missingBefore.length, outsideReleaseFilesTouched: false }, null, 2));
} catch (error) {
  for (const member of release.files) {
    const destinationPath = resolveInside(production, member.relativePath); const backupPath = resolveInside(backupRoot, member.relativePath);
    if (fs.existsSync(backupPath)) fs.copyFileSync(backupPath, destinationPath);
    else if (createdDuringPromotion.includes(member.relativePath) && fs.existsSync(destinationPath)) fs.unlinkSync(destinationPath);
  }
  fs.writeFileSync(path.join(reports, 'promotion_evidence_S15.json'), JSON.stringify({ status: 'PRODUCTION_PROMOTION_ROLLED_BACK', releaseLabel: release.label, releaseArtifactSha: release.releaseArtifactSha, copiedCount: copied.length, rollbackBackupRoot: path.relative(root, backupRoot).replaceAll('\\', '/'), error: String(error) }, null, 2) + '\n', 'utf8');
  throw error;
}
