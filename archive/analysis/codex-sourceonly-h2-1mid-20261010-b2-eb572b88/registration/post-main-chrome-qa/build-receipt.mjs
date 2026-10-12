import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const qaRel = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/registration/post-main-chrome-qa';
const capturesRel = `${qaRel}/captures`;
const run = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/registration';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''));
const examSpecs = [
  { key: 't1', examUid: '24_순천고_1학기_중간_고2_확률과통계', questionCount: 23 },
  { key: 't2', examUid: '24_순천여고_1학기_중간_고2_수학I', questionCount: 22 },
  { key: 't3', examUid: '24_순천여고_1학기_중간_고2_확률과통계', questionCount: 23 },
];
const readback = readJson(`${run}/remote-readback.json`);
const binding = readJson(`${run}/publication-binding.json`);
const userAgentText = fs.readFileSync(path.join(root, qaRel, 'browser-user-agent.cli.txt'), 'utf8');
const userAgent = userAgentText.match(/Mozilla\/[^\r\n]+/)?.[0]?.replace(/"$/, '');
if (!userAgent || !/Chrome\//.test(userAgent) || /HeadlessChrome/.test(userAgent)) throw new Error('ACTUAL_HEADED_CHROME_USER_AGENT_REQUIRED');
if (!readback.allBytesMatch || readback.mainSha !== '9964fd57af3e67c303936155e48f7f94689fc2f9') throw new Error('REMOTE_READBACK_NOT_BOUND_TO_RELEASE');

const views = [];
for (const exam of examSpecs) {
  for (const mode of ['exam', 'sol', 'ans']) {
    const stem = `${exam.key}-${mode}`;
    const detailRel = `${capturesRel}/${stem}.qa-detail.txt`;
    const detailText = fs.readFileSync(path.join(root, detailRel), 'utf8');
    const encoded = detailText.split(/\r?\n/).find(line => line.startsWith('"{'));
    if (!encoded) throw new Error(`QA_DETAIL_JSON_MISSING:${stem}`);
    const detail = JSON.parse(JSON.parse(encoded));
    const consoleRel = `${capturesRel}/${stem}.console.txt`;
    const consoleText = fs.readFileSync(path.join(root, consoleRel), 'utf8');
    const errors = Number(consoleText.match(/Errors:\s*(\d+)/)?.[1]);
    const warnings = Number(consoleText.match(/Warnings:\s*(\d+)/)?.[1]);
    const screenshotRel = `${capturesRel}/${stem}.png`;
    const png = fs.readFileSync(path.join(root, screenshotRel));
    const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
    const expectedQuestions = Array.from({ length: exam.questionCount }, (_, index) => index + 1);
    if (detail.mode !== mode || detail.questionCount !== exam.questionCount
      || JSON.stringify(detail.questions) !== JSON.stringify(expectedQuestions)) throw new Error(`QUESTION_COVERAGE_FAIL:${stem}`);
    if ((detail.failedAssets || []).length) throw new Error(`BROKEN_STUDENT_ASSET:${stem}`);
    if (errors !== 0 || warnings !== 0) throw new Error(`BROWSER_CONSOLE_FINDING:${stem}:${errors}:${warnings}`);
    if (mode === 'sol' && (detail.answerBlocks !== exam.questionCount || detail.solutionBlocks !== exam.questionCount)) throw new Error(`SOLUTION_BLOCK_COVERAGE_FAIL:${stem}`);
    if (mode === 'ans' && !detail.bodyText.includes('[ 정답표 ]')) throw new Error(`ANSWER_VIEW_MISSING:${stem}`);
    if (exam.key === 't3' && mode === 'ans' && detail.q22AnswerConfirmed !== true) throw new Error('Q22_ANSWER_OUTPUT_NOT_CONFIRMED');
    views.push({
      examUid: exam.examUid,
      mode,
      questionCount: detail.questionCount,
      solutionAnswerBlocks: mode === 'sol' ? detail.answerBlocks : null,
      solutionBlocks: mode === 'sol' ? detail.solutionBlocks : null,
      loadedAssetImageCount: detail.assetCount,
      failedAssets: detail.failedAssets || [],
      q22AnswerConfirmed: detail.q22AnswerConfirmed === true,
      browserConsoleErrors: errors,
      browserConsoleWarnings: warnings,
      screenshot: { path: screenshotRel, sha256: sha(png), width, height },
      qaDetail: { path: detailRel, sha256: sha(fs.readFileSync(path.join(root, detailRel))) },
      consoleLog: { path: consoleRel, sha256: sha(fs.readFileSync(path.join(root, consoleRel))) },
    });
  }
}

const receipt = {
  schemaVersion: 'ROOT_ARCHIVE_POST_MAIN_CHROME_STUDENT_QA_V1',
  status: 'PASS',
  browser: { channel: 'chrome', headed: true, userAgent },
  releaseMainSha: readback.mainSha,
  bindingSha256: readback.bindingSha256,
  sourceSha256: readback.sourceSha256,
  readbackSha256: sha(fs.readFileSync(path.join(root, `${run}/remote-readback.json`))),
  examCount: examSpecs.length,
  viewCount: views.length,
  allQuestionCountsMatch: true,
  allSolutionAndAnswerBlocksMatch: true,
  allReferencedImagesLoaded: true,
  allConsoleErrorsZero: true,
  q22Answer: '(6, 3)',
  q22StudentAnswerOutputConfirmed: true,
  transientInitialLocalFavicon404: 'The first local-engine open requested /favicon.ico and received 404; this automatic browser request was not an exam asset. All nine captured student views had zero console errors and warnings.',
  views,
  verifiedAt: new Date().toISOString(),
};
const output = path.join(root, qaRel, 'chrome-qa-receipt.json');
fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ status: receipt.status, output: path.relative(root, output), mainSha: receipt.releaseMainSha, bindingSha256: receipt.bindingSha256, browser: receipt.browser, examCount: receipt.examCount, viewCount: receipt.viewCount, views: views.map(({ examUid, mode, questionCount, loadedAssetImageCount, browserConsoleErrors, browserConsoleWarnings, q22AnswerConfirmed }) => ({ examUid, mode, questionCount, loadedAssetImageCount, browserConsoleErrors, browserConsoleWarnings, q22AnswerConfirmed })) }, null, 2));
