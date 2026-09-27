import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fixture } from './fixture.mjs';
import { archiveWorkspace, initArchiveWorkspace, workingExamOptions, examStorage } from '../archive-workspace.mjs';
import { prepareDraft } from '../prepare.mjs';
import { runtimeDependencyBundle } from '../runtime.mjs';
import { serveWorkspacePreview } from '../workspace-preview.mjs';

const examFile = 'original/high/h1/1mid/25_학교_1학기_중간_고1_공통수학1.js';

test('working folder keeps actual JS names and rejects production/traversal/legacy output folders', () => {
  const f = fixture(); try {
    const layout = initArchiveWorkspace(f.root, { workRoot: 'archive-work', examFile });
    assert.equal(layout.examPath, `archive-work/exams/${examFile}`);
    assert.equal(layout.assetDir, 'archive-work/assets/images/25_학교_1학기_중간_고1_공통수학1');
    assert.deepEqual(examStorage(path.join(f.root, layout.examPath)), { assetRoot: path.join(f.root, 'archive-work'), evidenceRoot: path.join(f.root, layout.evidenceDir) });
    for (const workRoot of ['archive', 'archive/assets/work', '../outside', 'archive/_generated', 'candidate']) assert.throws(() => archiveWorkspace(f.root, { workRoot, examFile }));
    assert.throws(() => archiveWorkspace(f.root, { examFile: 'original/../escape.js' }));
    assert.throws(() => archiveWorkspace(f.root, { examFile: 'original/x.candidate.js' }));
    assert.throws(() => workingExamOptions(f.root, { workRoot: 'archive-work', examFile, candidatePath: 'other.js' }), /PATH_CONFLICT/);
    const inferred = workingExamOptions(f.root, { candidatePath: layout.examPath, runId: 'alias-test' });
    assert.equal(inferred.assetRoot, 'archive-work');
    assert.equal(inferred.workdir, `${layout.evidenceDir}/reviews/alias-test`);
  } finally { f.cleanup(); }
});

test('common prepare uses the working JS and its own assets while source assets stay in the source folder', () => {
  const f = fixture(); try {
    const layout = archiveWorkspace(f.root, { workRoot: 'archive-work', examFile });
    const sourceText = fs.readFileSync(path.join(f.root, 'source.js'), 'utf8');
    const workText = fs.readFileSync(path.join(f.root, 'candidate.js'), 'utf8');
    f.write(`archive/exams/${examFile}`, `${sourceText}\nwindow.questionBank[0].image='assets/source.svg';`);
    f.write(layout.examPath, `${workText}\nwindow.questionBank[0].image='assets/problem.svg';`);
    f.write('archive/assets/source.svg', '<svg xmlns="http://www.w3.org/2000/svg"><text>source</text></svg>');
    f.write('archive-work/assets/problem.svg', '<svg xmlns="http://www.w3.org/2000/svg"><text>working</text></svg>');
    f.write('archive-work/assets/visual.svg', fs.readFileSync(path.join(f.root, 'assets/visual.svg')));
    for (const ref of runtimeDependencyBundle(process.cwd()).localFiles) f.write(ref.path, fs.readFileSync(path.join(process.cwd(), ref.path)));
    for (const relative of ['archive/tools/pipeline-core/visual-contract.json', 'archive/tools/pipeline-core/closure.mjs', 'archive/tools/pipeline-core/generator.py']) f.write(relative, fs.readFileSync(relative));
    const result = prepareDraft(f.root, { pipeline: 'logic-visual', runId: 'folder-test', workRoot: 'archive-work', examFile });
    const run = JSON.parse(fs.readFileSync(path.join(f.root, result.manifestPath)));
    assert.equal(run.questions[0].candidatePath, layout.examPath);
    assert.equal(run.assetRoot, 'archive-work');
    assert.ok(run.inputs.some(ref => ref.path === 'archive-work/assets/problem.svg'));
    const sourceBundle = JSON.parse(fs.readFileSync(path.join(f.root, layout.evidenceDir, 'reviews/folder-test/bundles/q1-v1.json')));
    assert.equal(sourceBundle.problemAssets[0].path, 'archive/assets/source.svg');
    assert.equal(result.status, 'DRAFT_NOT_EXECUTABLE');
  } finally { f.cleanup(); }
});

test('preview serves actual workspace bytes with no production image or exam fallback', async () => {
  const f = fixture(); let preview;
  try {
    const layout = archiveWorkspace(f.root, { workRoot: 'archive-work', examFile });
    f.write(layout.examPath, 'window.examTitle="working";');
    f.write(`${layout.assetDir}/q001_visual.png`, 'working-image');
    f.write('archive/engine.html', '<html>engine</html>');
    f.write(`archive/exams/${examFile}`, 'production');
    preview = await serveWorkspacePreview(f.root, { workRoot: 'archive-work', examFile });
    const base = new URL(preview.url).origin;
    assert.equal(await (await fetch(`${base}/archive/exams/${examFile}`)).text(), 'window.examTitle="working";');
    assert.equal(await (await fetch(`${base}/archive/assets/images/${layout.examId}/q001_visual.png`)).text(), 'working-image');
    assert.equal((await fetch(`${base}/archive/exams/other.js`)).status, 404);
    assert.equal((await fetch(`${base}/archive/assets/images/${layout.examId}/missing.png`)).status, 404);
    assert.equal((await fetch(`${base}/archive/tools/pipeline-core/cli.mjs`)).status, 404);
    assert.equal((await fetch(`${base}/archive/engine.html`, { method: 'POST' })).status, 405);
  } finally { if (preview) { preview.server.closeAllConnections(); await new Promise(resolve => preview.server.close(resolve)); } f.cleanup(); }
});
