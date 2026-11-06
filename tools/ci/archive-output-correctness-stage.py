"""One-use task staging utility. Creates Git objects, never moves main or the task ref.
The generated task commit removes this utility and both temporary workflows.
"""
import os, json, pathlib, subprocess, hashlib, urllib.request, re
ROOT = pathlib.Path.cwd()
REPO = 'icefoxtail/AP------'
MAIN = '8a6a71af2317060dacd877a7a7af86d347dc06e6'
MERGE_BASE = 'dc9f34e594f742442795acea4b17d2ffab5e3bed'
ORIGINAL = 'f446e62a29f90d6d30a76b295e5c226f5ead72d2'
HEAD = os.environ['GITHUB_SHA']
OUT = pathlib.Path(os.environ['RUNNER_TEMP']) / 'output-repair-stage'
OUT.mkdir(parents=True, exist_ok=True)
STYLE_ID = 'ap-solution-reminder-image-fit'
STYLE = '''
    // One shared semantic rule for all output adapters. This is the existing
    // original-engine reminder-image rule, not a change to source image bytes.
    // Install synchronously before any staging measurement; no extra request.
    if (root?.document?.head && !root.document.getElementById('ap-solution-reminder-image-fit')) {
        const style = root.document.createElement('style');
        style.id = 'ap-solution-reminder-image-fit';
        style.textContent = '.q-box.sol-box [data-semantic-content="1"] img { max-width: 100%; height: auto; }';
        root.document.head.appendChild(style);
    }
'''

def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()
def read(ref, name):
    return subprocess.check_output(['git', 'show', ref + ':' + name]).decode('utf-8')
def replace_once(text, old, new):
    assert text.count(old) == 1, 'EXACT_PATCH_ANCHOR_REQUIRED: ' + old[:100]
    return text.replace(old, new, 1)
def api(method, endpoint, body=None):
    data = None if body is None else json.dumps(body).encode()
    request = urllib.request.Request('https://api.github.com/repos/' + REPO + '/' + endpoint,
        data=data, method=method, headers={'Authorization':'Bearer ' + os.environ['GH_TOKEN'],
        'Accept':'application/vnd.github+json', 'Content-Type':'application/json'})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)
def commit(parent, changes, message, additional=()):
    entries = []
    for name, content in changes.items():
        if content is None:
            entries.append({'path':name,'mode':'100644','type':'blob','sha':None})
        elif isinstance(content, dict):
            entries.append({'path':name,'mode':'100644','type':'blob',**content})
        else:
            blob = api('POST','git/blobs',{'content':content,'encoding':'utf-8'})['sha']
            entries.append({'path':name,'mode':'100644','type':'blob','sha':blob})
    tree = api('POST','git/trees',{'base_tree':git('rev-parse',parent+'^{tree}'),'tree':entries})['sha']
    sha = api('POST','git/commits',{'message':message,'tree':tree,'parents':[parent,*additional]})['sha']
    return sha, tree, entries

def corrected(ref, prepare_images=False):
    changes = {}
    name = 'archive/solution-render-executor.js'
    text = read(ref,name)
    assert STYLE_ID not in text
    changes[name] = replace_once(text,"    'use strict';", "    'use strict';\n" + STYLE)
    for name in ['archive/engine.html','archive/mixed_engine.html']:
        text = read(ref,name)
        text = re.sub(r'        /\* The solution reminder repeats q.content[^*]*\*/\n', '', text)
        text = text.replace('        .q-box.sol-box [data-semantic-content="1"] img { max-width: 100%; height: auto; }\n', '')
        text, count = re.subn(r'solution-render-executor\.js\?v=[^"\s]+', 'solution-render-executor.js?v=20261106-reminder-fit-1', text)
        assert count == 1, 'SOLUTION_LOADER_REQUIRED'
        if prepare_images:
            text = replace_once(text, 'async function applyAutoImageSizeClasses(root) {\n    await prepareQuestionImages(root);',
                'async function applyAutoImageSizeClasses(root, timeoutMs = 1200) {\n    await prepareQuestionImages(root, timeoutMs);')
        changes[name] = text
    if prepare_images:
        # This is the already validated cold-image correctness repair only.
        # It contains no layout-yield or snapshot-cache performance changes.
        changes['archive/exam-render-executor.js'] = read(HEAD,'archive/exam-render-executor.js')
    return changes

for ref in [MAIN, MERGE_BASE, ORIGINAL]:
    subprocess.run(['git','fetch','--no-tags','--depth=1','origin',ref],check=True,stdout=subprocess.DEVNULL)
branch = api('GET','git/ref/heads/perf/archive-output-718c238a')['object']['sha']
assert branch == HEAD, 'TASK_BRANCH_MOVED_BEFORE_STAGE'
main_changes = git('diff','--name-only',MERGE_BASE,MAIN).splitlines()
task_changes = git('diff','--name-only',MERGE_BASE,HEAD).splitlines()
assert not set(main_changes).intersection(task_changes), 'CONCURRENT_MAIN_FILE_CONFLICT'

perf_changes = corrected(MAIN, prepare_images=True)
perf_ref, perf_tree, perf_entries = commit(MAIN,perf_changes,'fix(archive): correctness-only reference for reminder fit and cold images')
original_changes = corrected(ORIGINAL)
original_ref, original_tree, original_entries = commit(ORIGINAL,original_changes,'test(archive): pre-1418 reference with the identical reminder-image correction')
suffix=os.environ['GITHUB_RUN_ID']+'-'+os.environ['GITHUB_RUN_ATTEMPT']
for kind,sha in [('performance',perf_ref),('pre1418',original_ref)]:
    api('POST','git/refs',{'ref':'refs/heads/review-reference/output-718c238a-'+suffix+'-'+kind,'sha':sha})
refs={'schema':'ARCHIVE_OUTPUT_CORRECTNESS_REFERENCES_V1','performanceBase':MAIN,'performanceReference':perf_ref,
    'originalBase':ORIGINAL,'originalReference':original_ref,
    'corrections':['Shared reminder-image width constraint moved unchanged from original engine','Existing 15s solution-image budget also used for cold exam-image preparation'],
    'sourceDataChanged':False,'historicalUncorrectedEvidenceRun':'42161431317'}
changes=corrected(HEAD)
# Preserve the concurrently advanced main by exact Git blobs, not source rewriting.
for name in main_changes:
    entries=git('ls-tree',MAIN,'--',name).split()
    changes[name]={'sha':entries[2]} if entries else None
for name in ['archive/common-fast-runtime.js','archive/screen-runtime-adapter.js']:
    text=read(HEAD,name)
    if name.endswith('common-fast-runtime.js'):
        text=replace_once(text,'common-fast-output-performance-20261106.1','common-fast-output-performance-20261106.2')
    else:
        text=replace_once(text,"engine: 'archive-solution-loading-20261106.1'","engine: 'archive-output-reminder-fit-20261106.1'")
        text=replace_once(text,"executor: 'solution-loading-20261106.1'","executor: 'solution-reminder-fit-20261106.1'")
    changes[name]=text
for name in ['archive/engine.html','archive/mixed_engine.html']:
    text=changes[name]
    text=text.replace('common-fast-runtime.js?v=20261106-output-performance-1','common-fast-runtime.js?v=20261106-output-performance-2')
    text=text.replace('screen-runtime-adapter.js?v=20261106-output-performance-1','screen-runtime-adapter.js?v=20261106-output-performance-2')
    changes[name]=text
for name in ['tests/archive2-reader-controls.test.cjs','tests/archive-render-authority-adapter.test.js']:
    text=read(HEAD,name)
    text=text.replace('solution-render-executor\\.js\\?v=20261106-output-performance-1','solution-render-executor\\.js\\?v=20261106-reminder-fit-1')
    text=text.replace("'solution-render-executor': '20261106-output-performance-1'","'solution-render-executor': '20261106-reminder-fit-1'")
    text=text.replace('common-fast-runtime\\.js\\?v=20261106-output-performance-1','common-fast-runtime\\.js\\?v=20261106-output-performance-2')
    text=text.replace("'screen-runtime-adapter': '20261106-output-performance-1'","'screen-runtime-adapter': '20261106-output-performance-2'")
    changes[name]=text

new_case = r'''async function real50ReminderFit(session, initial) {
  assertReady(initial, 50, true);
  await remember(session.page, 'exam');
  const solution = await operation(session, 'real50-qpp4-repaired-solution', 'sol');
  assertReady(solution, 50, true);
  requireThat(solution.inputHash === initial.inputHash, 'REMINDER_FIT_MUTATED_SOURCE');
  const fit = await session.page.evaluate(() => {
    const box = [...document.querySelectorAll('#print-area .sol-box')].find(node => node.dataset.sourceRef?.endsWith(':17'));
    const image = box?.querySelector('[data-semantic-content="1"] img');
    const column = image?.closest('.grid-col');
    const bounds = image?.getBoundingClientRect(), container = column?.getBoundingClientRect();
    return { found:!!image, loaded:!!image?.complete && image.naturalWidth > 0,
      naturalWidth:image?.naturalWidth, naturalHeight:image?.naturalHeight,
      width:bounds?.width, height:bounds?.height, columnWidth:container?.width,
      inside:!!bounds && bounds.right <= container.right + 1 && bounds.left >= container.left - 1,
      stylePresent:!!document.getElementById('ap-solution-reminder-image-fit') };
  });
  requireThat(fit.found && fit.loaded && fit.stylePresent && fit.inside && fit.naturalWidth === 420 && fit.naturalHeight === 300 &&
    fit.width > 0 && Math.abs(fit.width / fit.height - 420 / 300) < .01, 'REMINDER_IMAGE_FIT_OR_ASPECT_FAILED', fit);
  await remember(session.page, 'sol');
  const printed = await printCheck(session, solution, true, 'real50-qpp4-repaired-print');
  const answer = await operation(session, 'real50-qpp4-repaired-answer', 'ans'); assertReady(answer,50,true);
  const returned = await operation(session, 'real50-qpp4-repaired-exam', 'exam'); assertReady(returned,50,true);
  await assertHit(session,initial,returned);
  const warm = await operation(session, 'real50-qpp4-repaired-solution-hit', 'sol'); assertReady(warm,50,true);
  await assertHit(session,solution,warm);
  report.repairedIssue={id:'REAL50_QPP4_REMINDER_IMAGE_CLIPPING',status:'FIXED',qualityPass:true,questionCount:50,qpp:4,
    inputHash:solution.inputHash,sourceBytesUnchanged:true,fit,printed,solutionPages:solution.pageCount,warmCacheStatus:warm.cacheStatus};
  return {repairedIssue:report.repairedIssue};
}

'''
name='tests/archive2-output-cache-browser.cjs';text=read(HEAD,name)
text=replace_once(text,'async function knownReal50Clipping(session, initial) {',new_case+'''async function knownReal50Clipping(session, initial) {
  // Reproduce the old real defect by removing only the new shared rule. The
  // original failure/rollback/retry assertions remain intact as a negative test.
  await session.page.evaluate(() => {
    const style=document.getElementById('ap-solution-reminder-image-fit');
    if (!style) throw new Error('REMINDER_FIT_REQUIRED_BEFORE_FAULT_INJECTION');
    style.remove();
  });''')
text=replace_once(text,"await runCase(browser, server, real50, 'known-real50-qpp4-clipping-preservation', knownReal50Clipping);",
    "await runCase(browser, server, real50, 'real50-qpp4-reminder-image-fit', real50ReminderFit);\n    await runCase(browser, server, real50, 'known-real50-qpp4-clipping-preservation', knownReal50Clipping);")
text=replace_once(text,'report.cases.length === 10','report.cases.length === 11')
text=text.replace("status: 'UNRESOLVED', guardPass: true", "status: 'INJECTED_BASELINE_FAULT', guardPass: true, currentProductionStatus: 'FIXED'")
text=text.replace('Existing qpp4 clipping remains unresolved; PASS verifies failure preservation, not solution output quality.',
    'Baseline clipping is explicitly fault-injected; this case verifies failure preservation. Default output has a separate positive repair case.')
changes[name]=text
changes['tests/archive2-output-comparison-references.json']=json.dumps(refs,indent=2)+'\n'
for name,old,new in [('tests/archive2-output-performance-browser.cjs',"'87d7a554448d8ecf9ab5a535f2ff5541b0c79a0a'","require('./archive2-output-comparison-references.json').performanceReference"),
                     ('tests/archive2-solution-loading-browser.cjs',"'f446e62a29f90d6d30a76b295e5c226f5ead72d2'","require('./archive2-output-comparison-references.json').originalReference")]:
    changes[name]=replace_once(read(HEAD,name),old,new)
name='.github/workflows/archive-output-performance.yml';text=read(HEAD,name)
text=text.replace('87d7a554448d8ecf9ab5a535f2ff5541b0c79a0a',perf_ref).replace(ORIGINAL,original_ref)
text=text.replace('        continue-on-error: true\n','')
text=text.replace("      - 'tests/archive2-output-release-qualification.cjs'", "      - 'tests/archive2-output-strict-gate.cjs'\n      - 'tests/archive2-output-comparison-references.json'\n      - 'tests/archive2-output-release-qualification.cjs'")
text=text.replace('        # The raw matrix deliberately retains the pre-existing qpp4 failure.\n        # The release job below classifies only its exact pinned signature and\n        # fails on every new failure, absent artifact or unplanned missing row.\n',
    '        # Compare immutable correctness-only reference and optimized code.\n        # Every planned real output must now pass; no known-failure allowance.\n')
text=text.replace('        # The immutable baseline may fail its old 1.2s image-preparation gate.\n        # The mandatory qualifier requires the exact diagnosed baseline fault,\n        # every current operation ready, and parity with the normal baseline.\n',
    '        # Both references use the validated cold-image preparation budget.\n')
text=replace_once(text,'          ARCHIVE_QUALIFICATION_CURRENT_SHA: ${{ github.event.pull_request.head.sha || github.sha }}',
    '          ARCHIVE_QUALIFICATION_CURRENT_SHA: ${{ github.event.pull_request.head.sha || github.sha }}\n          ARCHIVE_QUALIFICATION_ARTIFACTS: ${{ runner.temp }}/archive-output-all-evidence')
text=replace_once(text,'        run: >-\n          node tests/archive2-output-release-qualification.cjs\n          --artifacts "$RUNNER_TEMP/archive-output-all-evidence"\n          --current-sha "$ARCHIVE_QUALIFICATION_CURRENT_SHA"',
    '        run: node tests/archive2-output-strict-gate.cjs')
text=text.replace('Upload scoped qualification without replacing raw failures','Upload strict complete-matrix qualification')
changes[name]=text
for name in ['.github/workflows/archive-output-review-bundle.yml','.github/workflows/archive-output-correctness-stage.yml','tools/ci/archive-output-correctness-stage.py']:
    changes[name]=None

# Materialize only this task's text edits for syntax/targeted execution checks.
for name,content in changes.items():
    if isinstance(content,str):
        p=ROOT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content,encoding='utf-8')
for name in ['archive/solution-render-executor.js','tests/archive2-output-cache-browser.cjs','tests/archive2-output-performance-browser.cjs','tests/archive2-output-strict-gate.cjs']:
    subprocess.run(['node','--check',name],check=True)
subprocess.run(['node','--test','tests/archive-question-image-map-regression.test.js','tests/archive-render-authority-adapter.test.js','tests/archive2-reader-controls.test.cjs','tests/archive2-output-release-qualification.test.cjs'],check=True)
new_sha,tree,entries=commit(HEAD,changes,'fix(archive): share reminder fitting and require fully clean measured output',[MAIN])
manifest={'taskId':'718c238a-1045-465c-a263-62c14d53f3c4','owner':'GPT6_ASTRA_CHAT','expectedTaskHead':HEAD,
    'candidateSha':new_sha,'candidateTree':tree,'references':refs,'entries':entries,'mainIntegrated':MAIN,
    'concurrentMainFilesPreserved':main_changes,'taskReferenceUpdated':False,'productionChanged':False}
(OUT/'stage-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
for name,content in changes.items():
    if isinstance(content,str):
        target=OUT/'candidate'/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(content,encoding='utf-8')
print(json.dumps({'candidateSha':new_sha,'expectedTaskHead':HEAD,'referenceShas':[perf_ref,original_ref],'taskReferenceUpdated':False}))
