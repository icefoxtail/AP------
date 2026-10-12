import path from 'node:path';
import { readExam, artifactSnapshot } from '../../../tools/archive-codex-artifact-io.mjs';

const runDir = import.meta.dirname;
const root = path.resolve(runDir, '../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js');
const evidenceFile = path.join(root, 'archive/analysis/24_강남여고_1학기_중간_고2_확률과통계/r2-clean-20261011/r2-generic-validator.raw.json');
const assetRoot = path.join(root, 'archive');
const exam = readExam(sourceFile);
const snapshot = artifactSnapshot({ sourceFile, evidenceFile, assetRoot, questions: exam.questions });
if (snapshot.issues.length) throw new Error(`RELEASE_ASSET_SET_INVALID:${snapshot.issues.join('|')}`);
console.log(JSON.stringify({ questionCount: exam.questions.length, source: snapshot.source, evidence: snapshot.evidence, assetCount: snapshot.assets.length, assets: snapshot.assets }));
