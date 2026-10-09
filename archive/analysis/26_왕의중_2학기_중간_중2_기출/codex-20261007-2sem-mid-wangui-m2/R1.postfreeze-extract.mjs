import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const [examPath, outPath] = process.argv.slice(2);
const code = fs.readFileSync(examPath, 'utf8');
const box = { window: {} };
vm.runInNewContext(code, box, { timeout: 3000 });
const bank = box.window.questionBank;
if (!Array.isArray(bank) || bank.length !== 24) throw new Error('QID_DENOMINATOR_MISMATCH');
const fields = ['id','questionType','content','choices','answer','solution','decisiveStep','image','solutionImage','visualAsset','level','category','originalCategory','layoutTag','tags','wide','standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','sourceIdentityKey','sourceOrdinal','sourcePage','sourcePageSha256','score','subScores'];
const questions = bank.map(q => Object.fromEntries(fields.filter(f => Object.hasOwn(q, f)).map(f => [f, q[f]])));
if (questions.some(q => !Number.isInteger(q.id) || q.id < 1 || q.id > 24)) throw new Error('QID_SCOPE_INVALID');
fs.writeFileSync(outPath, JSON.stringify({ schemaVersion:'JS_ARCHIVE_R1_POSTFREEZE_QID_EXTRACTION_V1', rowCount:questions.length, fields, questions }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({rowCount:questions.length, fields, sha256:crypto.createHash('sha256').update(fs.readFileSync(outPath)).digest('hex')}));

