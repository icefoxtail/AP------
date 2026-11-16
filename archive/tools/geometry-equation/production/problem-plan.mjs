import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import language from '../../svg-language-contract.cjs';
import { assetIdentity } from './contracts.mjs';
import { composeProblem } from './problem-figure-render.mjs';
import { loadBank } from '../build-visual-render-matrix.mjs';
import { launchBrowser, repoRoot } from '../visual-browser-runtime.mjs';

const sourcePattern = /^archive\/exams\/(?:original|similar|types)\/(?:high|middle)\/(?:[^./][^/]*\/)*[^/]+\.js$/;
const assetPattern = /^assets\/images\/(?:[^./][^/]*\/)+[^/]+\.svg$/;
export const problemDigest = value => crypto.createHash('sha256').update(value).digest('hex');
export const normalizedInputDigest = value => problemDigest(JSON.stringify(value));

export function readProblemInput(input) {
  return typeof input === 'string' ? JSON.parse(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, '')) : input;
}

export function problemSlot(question, slot) {
  if (slot === 'image') return { key: 'image', value: question.image };
  if (slot === 'body') {
    const key = typeof question.content === 'string' ? 'content' : 'question';
    return { key, value: question[key] };
  }
  const choice = /^choice-([1-9][0-9]*)$/.exec(slot);
  if (!choice) throw Error('INVALID_PROBLEM_SLOT:' + slot);
  const index = Number(choice[1]) - 1;
  return { key: 'choices', index, value: question.choices?.[index] };
}

export function problemIdentity(item) {
  const exam = path.posix.basename(item.sourcePath, '.js');
  return assetIdentity(exam + '|' + item.ordinal, 'PROBLEM_VISUAL', item.slot);
}

export function readProblemSource(item, root = repoRoot) {
  if (item?.visualRole !== 'PROBLEM_VISUAL' || typeof item.sourcePath !== 'string' ||
      !sourcePattern.test(item.sourcePath) || /[\\:]/.test(item.sourcePath)) throw Error('INVALID_PROBLEM_SOURCE');
  if (!Number.isSafeInteger(item.ordinal) || item.ordinal < 1) throw Error('INVALID_PROBLEM_ORDINAL');
  if (typeof item.assetRef !== 'string' || !assetPattern.test(item.assetRef) ||
      /[\\:?&#"'<>]/.test(item.assetRef)) throw Error('INVALID_PROBLEM_ASSET');
  const sourceFile = path.join(root, item.sourcePath);
  const code = fs.readFileSync(sourceFile, 'utf8');
  const bank = loadBank(code);
  const question = bank[item.ordinal - 1];
  if (!question) throw Error('PROBLEM_ORDINAL_MISSING');
  const slot = problemSlot(question, item.slot);
  const imageSources = typeof slot.value === 'string'
    ? [...slot.value.matchAll(/<img\b[^>]*\ssrc\s*=\s*["']([^"']+)["']/gi)].map(m => m[1])
    : [];
  const references = item.slot === 'image' ? [slot.value] : imageSources;
  if (references.filter(ref => ref === item.assetRef).length !== 1) throw Error('PROBLEM_ASSET_NOT_BOUND_TO_SLOT');
  return { sourceFile, code, bank, question, slot };
}

export async function renderProblemPlan({ item, planInput, outDir, sharedBrowser }) {
  fs.mkdirSync(outDir, { recursive: true });
  const resultFile = path.join(outDir, 'figure-result.json');
  const svgFile = path.join(outDir, 'figure-problem.svg');
  if (fs.existsSync(resultFile) || fs.existsSync(svgFile)) throw Error('PROBLEM_RENDER_OUTPUT_EXISTS');
  let result;
  let browser;
  try {
    const source = readProblemSource(item);
    const plan = readProblemInput(planInput);
    if (['EXEMPT', 'UNSUPPORTED'].includes(plan?.status)) {
      result = { status: plan.status, detail: plan.reason };
    } else {
      if (!plan?.capability || plan.capability.startsWith('problem-') || typeof plan.caption !== 'string' || !plan.caption.trim()) {
        throw Error('NATIVE_PROBLEM_PLAN_REQUIRED');
      }
      const { baseFontPx, displayScale } = item.typography ?? {};
      if (!Number.isFinite(baseFontPx) || baseFontPx <= 0 || !Number.isFinite(displayScale) || displayScale <= 0) {
        throw Error('PROBLEM_TYPOGRAPHY_REQUIRED');
      }
      const identity = problemIdentity(item);
      browser = sharedBrowser ?? await launchBrowser();
      const composed = await composeProblem(plan, identity, item.typography, browser, { repoRoot, question: source.question });
      if (composed.status !== 'COMPOSED' || composed.renderedLayout?.status !== 'PASS') {
        result = { status: 'FAILED', stage: 'composition', detail: composed.detail, nativeStatus: composed.status };
      } else {
        language.assertSvgStudentLanguage(composed.svg, { assetRef: item.assetRef });
        result = {
          status: 'PROBLEM_RENDERED',
          identity,
          sourcePath: item.sourcePath,
          ordinal: item.ordinal,
          slot: item.slot,
          assetRef: item.assetRef,
          sourceSha256: problemDigest(source.code),
          itemSha256: normalizedInputDigest(item),
          planSha256: normalizedInputDigest(plan),
          svgSha256: problemDigest(composed.svg),
          layoutStatus: composed.renderedLayout.status
        };
        fs.writeFileSync(svgFile, composed.svg, { flag: 'wx' });
      }
    }
  } catch (error) {
    result = { status: 'FAILED', stage: 'problem-render', detail: String(error?.message ?? error) };
  } finally {
    if (!sharedBrowser) await browser?.close();
  }
  fs.writeFileSync(resultFile, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  return result;
}
