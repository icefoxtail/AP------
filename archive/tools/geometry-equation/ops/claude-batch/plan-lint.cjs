#!/usr/bin/env node
// plan-lint: SVG 해설 그림 plan 을 렌더(Chrome 측정·조립) 전에 엔진의 검증 함수로 미리 검사한다. 문항당 1초 안팎.
//
//   node plan-lint.cjs <plan.json | 폴더>…            문항마다 한 줄: `OK` 또는 `코드: 이유 → 고치는 법`
//   옵션: --json            결과 전체를 JSON 으로 낸다(줄마다 한 문항)
//         --shallow         python 으로 모델·라벨을 만드는 깊은 검사(prepare·MathJax)를 건너뛴다(틀·모델·spec 까지만)
//         --engine <저장소>  엔진을 읽을 저장소 루트(기본: 이 파일이 있는 저장소). 엔진 파일은 읽기만 한다.
//         --jobs N          python 호스트 수(기본 1)
//         --quiet           OK 줄을 내지 않는다
//   종료코드: 0 = 전부 OK(또는 lint 불가), 1 = 하나라도 FAIL, 2 = 사용법 오류
//
// 무엇을 하나: render-plan.mjs 가 Chrome 을 켜기 전에 거치는 단계를 같은 함수로 거친다.
//   plan 읽기 → (숨김 곡선 라벨·불연속 쌍·평면 벡터 펼치기) → capability 별 검증:
//     set-diagram/stat-chart/lattice-path/container-fill: check*Plan (production/*-v1.mjs)
//     ellipse: solveEllipseFigure   number-line/solid/quadratic-inequality-chain/composite: expand + compositePanels + 패널별 solve
//     그래프·작도(graphPlan/mathPlan): frame_graph → graph/construction 모델 → specFor → prepare → 라벨 MathJax 조판
//   엔진 함수를 그대로 부르므로 렌더가 거절할 형식 오류는 같은 코드로 잡힌다.
// lint 불가(Chrome 으로 측정해야 나오는 것): LAYOUT_INVENTORY_INCOMPLETE, *DISPLAY_ENVELOPE*, *NO_ROOM, *TOO_CLOSE, TEXT_CLIPPED, LEADER_CROSSING … (NOT_LINTABLE_CODES)
//   이런 코드는 lint 가 OK 를 내도 렌더에서 나올 수 있다.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { pathToFileURL } = require('url');
const codes = require('./plan-lint-codes.cjs');
// 합성 그림 한 변의 표시 한계(CSS px = SVG 단위): 297px(해설 칸 안쪽 298의 94%) / 0.3516(11.25px 글자 / 기본 글자 상한 32). 아래 deep 검사의 주석 참고.
const DISPLAY_LIMIT_PX = 845;

const HERE = __dirname;
// 저장소 루트: 이 파일이 <저장소>/archive/tools/geometry-equation/ops/claude-batch/ 에 있거나 restore.sh 로 <저장소>/.tmp/work/ 에 펼쳐져 있어도 찾는다.
const ENGINE_MARK = path.join('archive', 'tools', 'geometry-equation', 'production', 'render-plan.mjs');
function findRepo() {
  const starts = [process.env.PLAN_LINT_REPO, HERE, process.cwd()].filter(Boolean);
  for (const start of starts) { let d = path.resolve(start); for (let i = 0; i < 8; i++) { if (fs.existsSync(path.join(d, ENGINE_MARK))) return d; const up = path.dirname(d); if (up === d) break; d = up; } }
  return path.resolve(HERE, '..', '..', '..', '..', '..');
}
const DEFAULT_REPO = findRepo();
const TIMEOUT_MS = Number(process.env.PLAN_LINT_TIMEOUT_MS) || 30000;

// ---------------------------------------------------------------- 엔진 불러오기
function makeEngine(repo) {
  const prod = path.join(repo, 'archive/tools/geometry-equation/production');
  if (!fs.existsSync(path.join(prod, 'render-plan.mjs'))) throw new Error(`엔진을 찾지 못했다: ${prod}`);
  const imp = f => import(pathToFileURL(path.join(prod, f)).href);
  const depPy = path.join(repo, '.tmp/apmath-visual-engine/dependencies/python');
  return { repo, prod, depPy, imp, mods: null };
}
async function loadMods(E) {
  if (E.mods) return E.mods;
  const [contracts, phase2, plane, comp, chain, nlf, sol, scf, sdg, ell, cfv, lpf, hidden, pair, vec, typo] = await Promise.all([
    'contracts.mjs', 'phase2.mjs', 'plane-marks.mjs', 'composite-candidate-svg-v1.mjs', 'quadratic-inequality-chain-v1.mjs', 'number-line-v1.mjs', 'solid-figure-v1.mjs',
    'stat-chart-v1.mjs', 'set-diagram-v1.mjs', 'ellipse-figure-v1.mjs', 'container-fill-v1.mjs', 'lattice-path-v1.mjs', 'hidden-curve-label.mjs', 'discontinuous-pair-v1.mjs',
    'plane-vectors.mjs', 'typography.mjs'].map(E.imp));
  let hints = null, guide = null; try { hints = await import(pathToFileURL(path.join(E.prod, '../ops/tools/hints.mjs')).href); } catch { /* 힌트는 없어도 된다 */ }
  try { guide = await import(pathToFileURL(path.join(E.prod, 'error-guidance.mjs')).href); } catch { /* 없어도 된다 */ }
  return (E.mods = { contracts, phase2, plane, comp, chain, nlf, sol, scf, sdg, ell, cfv, lpf, hidden, pair, vec, typo, hints, guide });
}

// ---------------------------------------------------------------- python 호스트(요청마다 python 을 새로 띄우지 않는다)
class Host {
  constructor(E) { this.E = E; this.proc = null; this.buf = ''; this.pending = new Map(); this.seq = 0; }
  start() {
    if (this.proc) return;
    const env = { ...process.env, PYTHONPATH: this.E.depPy + (process.env.PYTHONPATH ? path.delimiter + process.env.PYTHONPATH : ''), PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' };
    this.proc = cp.spawn(process.env.GEOMETRY_PYTHON || 'python', ['-X', 'utf8', path.join(HERE, 'plan-lint-host.py'), this.E.prod], { stdio: ['pipe', 'pipe', 'pipe'], env, windowsHide: true });
    this.proc.stdout.setEncoding('utf8');
    this.proc.stdout.on('data', d => {
      this.buf += d; let i;
      while ((i = this.buf.indexOf('\n')) >= 0) {
        const line = this.buf.slice(0, i); this.buf = this.buf.slice(i + 1);
        if (!line.startsWith('@@LINT@@')) continue;
        let r; try { r = JSON.parse(line.slice(8)); } catch { continue; }
        const p = this.pending.get(r.id); if (p) { this.pending.delete(r.id); clearTimeout(p.timer); p.resolve(r); }
      }
    });
    this.proc.stderr.on('data', () => {});
    this.proc.on('exit', () => { this.proc = null; for (const [, p] of this.pending) { clearTimeout(p.timer); p.resolve({ status: 'CRASH', result: { code: 'HOST_EXIT' } }); } this.pending.clear(); });
  }
  call(payload, timeoutMs = TIMEOUT_MS) {
    this.start();
    const id = ++this.seq;
    return new Promise(resolve => {
      const timer = setTimeout(() => { this.pending.delete(id); resolve({ status: 'TIMEOUT', result: { code: 'WORKER_TIMEOUT' } }); if (this.proc) this.proc.kill(); }, timeoutMs);
      this.pending.set(id, { resolve, timer });
      this.proc.stdin.write(JSON.stringify({ id, ...payload }) + '\n');
    });
  }
  close() { if (this.proc) { try { this.proc.stdin.end(); this.proc.kill(); } catch { /* 이미 끝났다 */ } } }
}

// ---------------------------------------------------------------- 오류 → 코드
class Refusal { constructor(code, stage, extra = {}) { this.code = code; this.stage = stage; Object.assign(this, extra); } }
const isDomainCode = e => e && e.constructor === Error && /^[A-Z][A-Z0-9_]*(?::|$)/.test(e.message);
// 엔진이 던진 것(Error('CODE'), Stop{status,detail}, {stage,detail})에서 코드를 뽑는다. render-plan.mjs 의 errorCode 와 같은 순서.
function codeOf(e) {
  if (e instanceof Refusal) return e.code;
  const d = e && e.detail;
  if (d && typeof d === 'object') {
    const inner = d.code ?? d.detail?.code ?? d.result?.code ?? d.detail?.detail?.code ?? d.message ?? d.detail?.message;
    if (typeof inner === 'string') return inner;
  }
  if (e && typeof e.status === 'string' && e.status !== 'OK') return e.status + (d && typeof d.code === 'string' ? ':' + d.code : '');
  return String((e && e.message) ?? e);
}

// ---------------------------------------------------------------- 한 plan 검사
async function lintPlan(plan, ctx) {
  const { E, host, deep } = ctx;
  const M = await loadMods(E);
  let stage = 'read-plan';
  const fail = (code, st, extra) => { throw new Refusal(code, st || stage, extra); };
  try {
    if (!plan || typeof plan !== 'object' || Array.isArray(plan)) fail('PLAN_NOT_OBJECT');
    if (plan.status === 'EXEMPT' || plan.status === 'UNSUPPORTED') return { status: 'OK', note: plan.status };
    const identity = M.contracts.assetIdentity('plan-lint|1', 'SOLUTION_VISUAL', 'decisive-relation');
    let authored = plan;
    {
      const h = M.hidden.expandHiddenCurveLabels(authored); if (h.notes && h.notes.length) authored = h.plan;
    }
    if (authored.capability === 'piecewise-discontinuous-spike-v1' && authored.graphPlan?.referenceCurves !== undefined) authored = M.pair.expandDiscontinuousPair(authored);
    if (authored.capability === 'construction-spike-v1') authored = M.vec.expandPlaneVectors(authored);
    if (authored.capability === 'construction-spike-v1' && M.plane.defaultHangulLabelKinds) authored = M.plane.defaultHangulLabelKinds(authored); // 한글 낱말이 든 라벨은 TEXT (render-plan 과 같은 규칙, 엔진에 있을 때만)

    const cap = authored.capability;
    // ---- 독립 도형(검증 함수가 곧 거절 조건)
    if (cap === M.sdg.FIGURE_CAPABILITY) { stage = 'set-diagram'; M.sdg.checkSetDiagramPlan(authored); return deepStandalone(M, authored, identity, 'sdg', ctx); }
    if (cap === M.scf.FIGURE_CAPABILITY) { stage = 'stat-chart'; M.scf.checkStatChartPlan(authored); return deepStandalone(M, authored, identity, 'scf', ctx); }
    if (cap === M.cfv.FIGURE_CAPABILITY) { stage = 'container-fill'; M.cfv.checkContainerFillPlan(authored); return { status: 'OK' }; }
    if (cap === M.lpf.FIGURE_CAPABILITY) { stage = 'lattice-path'; M.lpf.checkLatticePathPlan(authored); return deepStandalone(M, authored, identity, 'lpf', ctx); }
    if (cap === M.ell.FIGURE_CAPABILITY) {
      stage = 'ellipse';
      const model = await M.ell.solveEllipseFigure(authored);
      if (ctx.deep) {
        // 가장 작은 글자 크기에서도 라벨 자리가 없으면 어떤 표시 크기에서도 없다(ellipse-figure-v1.mjs:823 renderEllipseSvg 는 Chrome 없이 배치한다).
        // 실제 글자 크기는 Chrome 측정(표시 배율)으로 정해지므로, 가능한 가장 작은 값(기본 최소 20px, 넓은 그림은 폭에 따른 하한)만 쓴다. 이 크기에서 통과해도 렌더에서 NO_ROOM 이 날 수 있다.
        stage = 'compose';
        const width = M.ell.ellipseFigureSize(model).width, baseFontPx = Math.max(20, Math.ceil(112.5 * width / 284.53) / 10);
        try { await M.ell.renderEllipseSvg({ plan: authored, model, identity, typographyPolicy: { baseFontPx, displayScale: 0.47 } }); }
        catch (e) { if (e && e.status === 'ELLIPSE_LABEL_NO_ROOM') throw new Refusal('ELLIPSE_LABEL_NO_ROOM', 'compose', { labelId: e.detail && e.detail.label, via: 'minFont' + baseFontPx }); throw e; }
      }
      return { status: 'OK' };
    }
    // ---- 패널(복합·수직선·입체·이차부등식 사슬)
    if (cap === 'composite-panels-v1' || cap === M.chain.CHAIN_CAPABILITY || cap === M.nlf.FIGURE_CAPABILITY || cap === M.sol.SOLID_CAPABILITY) {
      stage = (cap === M.chain.CHAIN_CAPABILITY || cap === M.nlf.FIGURE_CAPABILITY || cap === M.sol.SOLID_CAPABILITY) ? 'chain' : 'composite-panels';
      const current = cap === M.chain.CHAIN_CAPABILITY ? M.chain.expandInequalityChain(authored) : cap === M.nlf.FIGURE_CAPABILITY ? M.nlf.expandNumberLineFigure(authored) : cap === M.sol.SOLID_CAPABILITY ? M.sol.expandSolidFigure(authored) : authored;
      stage = 'composite-panels';
      const checked = M.comp.compositePanels(current), sizes = [];
      if (current.linkedExpLogDetail) await M.comp.checkLinkedExpLogDetail(current);
      for (const panel of checked) {
        const pp = panel.plan;
        if (M.comp.isPlanePanel(pp)) {
          stage = 'model';
          const m = await host.call({ action: 'construction', graph: pp.mathPlan }, 90000);
          if (m.status !== 'OK') fail(m.result.code, 'model', { panel: panel.index });
          const panelPlan = { ...pp, caption: pp.caption ?? M.comp.captionText(panel.caption) };
          stage = 'spec';
          const spec = M.phase2.specFor(panelPlan, m.result, identity.assetId);
          await deepSpec(M, panelPlan, spec, m.result, identity, ctx, panel.index);
          sizes.push({ width: spec.viewport.width, height: spec.viewport.height });
          continue;
        }
        if (M.comp.isSetPanel(pp)) { stage = 'set-diagram'; const solved = M.sdg.solveDiagram(pp.diagram); sizes.push(M.sdg.setDiagramSize(solved, { compact: true })); continue; }
        if (M.comp.isStatPanel(pp)) { stage = 'stat-chart'; const solved = M.scf.solveStatPanel(pp.chart); sizes.push(M.scf.statChartSize(solved)); continue; }
        if (M.comp.isSolidPanel(pp)) { stage = 'chain'; const solved = M.sol.solveSolidFigure(pp); sizes.push(M.sol.figurePanelSize(solved)); continue; }
        if (M.comp.isNumberLinePanel(pp)) { stage = 'chain'; const solved = M.chain.solveNumberLine(pp.numberLine); sizes.push(M.chain.numberLinePanelSize(solved)); continue; }
        stage = 'frame';
        const f = await host.call({ action: 'frame_graph', graphPlan: pp.graphPlan });
        if (f.status !== 'OK') fail(f.result.code, 'frame', { panel: panel.index, hintData: f.result.hintData });
        const panelPlan = { ...pp, caption: pp.caption ?? M.comp.captionText(panel.caption), graphPlan: f.result.graphPlan };
        stage = 'model';
        const m = await host.call({ action: 'graph', graphPlan: panelPlan.graphPlan });
        if (m.status !== 'OK') fail(m.result.code, 'model', { panel: panel.index });
        stage = 'spec';
        const spec = M.phase2.specFor(panelPlan, m.result, identity.assetId);
        await deepSpec(M, panelPlan, spec, m.result, identity, ctx, panel.index);
        sizes.push({ width: spec.viewport.width, height: spec.viewport.height });
      }
      const size = M.comp.compositeStackSize(sizes, M.comp.compositeSharedRowCount(checked), M.comp.compositePanelLayout(checked, current), M.comp.COMPOSITE_CAPTION_ROW);
      // 합성 그림 전체 크기가 화면 표시 한계를 넘으면 measure 단계에서 UNSUPPORTED_DISPLAY_ENVELOPE 가 난다(production/composite-candidate-svg-v1.mjs:43 주석, display-envelope.mjs:38).
      // 2026-11-23 재산정: 옛 문턱(폭 828·높이 820, 2026-11-20 일괄 렌더)은 해설 그림 배율을 단 폭 94%까지 올리는 후보(solutionImageScaleCandidates의 largestWhole)가 생기기 전 값이라 지금은 828x820도 통과한다.
      // 지금 한계는 식으로 나온다: 해설 칸 안쪽 폭 298px(대상 문항 상자 측정값)의 94% = 297px 안에 그림이 들어가고, 기본 글자 크기 상한 32가 11.25px(하한 11 + 여유 .25)를 만들려면 표시 배율이 11.25/32 = 0.3516 이상이어야 한다.
      // 그래서 폭·높이가 297/0.3516 = 845 이하면 후보가 있고(실제 측정이 최종 판정), 846 이상이면 어떤 배율로도 불가능하다. 글자 하한 자체를 푸는 작업(claude/svg-display-text-floor-off)이 들어가면 이 줄은 필요 없어진다.
      if (ctx.deep && (size.width > DISPLAY_LIMIT_PX || size.height > DISPLAY_LIMIT_PX)) throw new Refusal('UNSUPPORTED_DISPLAY_ENVELOPE', 'measure', { size });
      return { status: 'OK', size };
    }
    // ---- 그래프(graphPlan) / 작도(mathPlan)
    let plan2 = authored;
    stage = 'frame';
    if (authored.graphPlan) {
      const f = await host.call({ action: 'frame_graph', graphPlan: authored.graphPlan });
      if (f.status !== 'OK') fail(f.result.code, 'frame', { hintData: f.result.hintData });
      plan2 = { ...authored, graphPlan: f.result.graphPlan };
    }
    stage = 'model';
    const m = await host.call(plan2.graphPlan ? { action: 'graph', graphPlan: plan2.graphPlan } : { action: 'construction', graph: plan2.mathPlan }, plan2.graphPlan ? undefined : 90000);
    if (m.status !== 'OK') fail(m.result.code, 'model');
    stage = 'spec';
    const spec = M.phase2.specFor(plan2, m.result, identity.assetId);
    await deepSpec(M, plan2, spec, m.result, identity, ctx, null);
    return { status: 'OK' };
  } catch (e) {
    if (e instanceof Refusal && e.code === 'WORKER_TIMEOUT') return { status: 'SKIP', stage: e.stage, code: 'WORKER_TIMEOUT', reason: 'lint 시간 초과(모델 계산이 오래 걸림). 렌더에서도 시간 초과가 날 수 있다.' };
    if (e instanceof Refusal || isDomainCode(e) || (e && typeof e.status === 'string') || (e && e.stage)) {
      const code = codeOf(e);
      const st = e instanceof Refusal ? e.stage : (e && e.stage) || stage;
      const extra = { panel: e && e.panel, labelId: e && e.labelId, labelText: e && e.labelText, hintData: e && e.hintData, errors: e && e.errors, via: e && e.via };
      return { status: 'FAIL', stage: st, code, ...(extra.panel !== undefined ? { panel: extra.panel } : {}), ...(Object.values(extra).some(v => v !== undefined) ? { detail: extra } : {}), ...codes.explain(code, { plan, err: e, M, E, stage: st, extra }) };
    }
    return { status: 'SKIP', stage, code: 'LINT_INTERNAL_ERROR', reason: `lint 내부 오류(plan 문제가 아닐 수 있다): ${String(e && e.stack || e).split('\n').slice(0, 2).join(' / ')}` };
  }
}

// ---- 깊은 검사 1: 그래프·작도 spec 으로 python prepare 를 돌리고 라벨을 MathJax 로 조판한다(render 의 compose 단계 앞부분, Chrome 불필요)
// 출처: production/construction-candidate-svg-v1.mjs:31(reserveCurveBranches) 144-170(spec 후 accessibilityDescription 검사, prepare, 라벨 조판)
function reserveCurveBranches(spec) {
  const taken = new Set((spec.objects ?? []).map(o => o?.branch).filter(v => typeof v === 'string'));
  let index = 1;
  const objects = (spec.objects ?? []).map(o => {
    if (typeof o?.branch !== 'string' || !(o.branch.startsWith('CURVE_') || o.branch.startsWith('EMPH_'))) return o;
    let r; do { r = 'REF_MC' + String(index++); } while (taken.has(r));
    taken.add(r); return { ...o, branch: r };
  });
  return { ...spec, objects };
}
const GRAPH_CAPABILITIES = new Set(['polynomial-spike-v1', 'piecewise-polynomial-spike-v1', 'rational-spike-v1', 'sqrt-affine-spike-v1', 'absolute-value-spike-v1', 'piecewise-affine-spike-v1', 'exponential-affine-spike-v1', 'logarithmic-affine-spike-v1', 'trigonometric-spike-v1', 'exp-log-pair-spike-v1', 'piecewise-discontinuous-spike-v1', 'multi-curve-figure-v1']); // construction-candidate-svg-v1.mjs:20
async function deepSpec(M, plan, spec, model, identity, ctx, panelIndex) {
  const panel = panelIndex ?? undefined;
  // construction-candidate-svg-v1.mjs:137-142 독립 관찰자가 모델 곡선을 plan 과 대조한다(MODEL_PLAN_MISMATCH). spec 다음, prepare 앞.
  if (ctx.deep && GRAPH_CAPABILITIES.has(plan.capability) && plan.graphPlan && !plan.mathPlan && typeof model?.svg === 'string') {
    const { aspectPolicy, ...frame } = model.transform || {}; void aspectPolicy;
    const b = await ctx.host.call({ action: 'modelBinding', graphPlan: plan.graphPlan, svg: model.svg, transform: frame }, 60000);
    if (b.status !== 'OK') throw new Refusal(b.result.code, 'compose', { panel, via: 'modelBinding' });
    if (b.result.status !== 'PASS') throw new Refusal((b.result.errors && b.result.errors[0]) || 'MODEL_PLAN_MISMATCH', 'compose', { panel, via: 'MODEL_PLAN_MISMATCH', errors: b.result.errors });
  }
  // construction-candidate-svg-v1.mjs:147-154
  if (Object.hasOwn(plan, 'accessibilityDescription')) {
    const d = plan.accessibilityDescription;
    if (typeof d !== 'string' || !d.trim() || d.length > 500 || /[\r\n]/.test(d)) throw new Refusal('INVALID_ACCESSIBILITY_DESCRIPTION', 'spec', { panel });
  }
  if (spec.title === undefined) throw new Refusal('PLAN_CAPTION_REQUIRED', 'spec', { panel });
  if (!ctx.deep) return;
  const prep = await ctx.host.call({ action: 'prepare', spec: reserveCurveBranches(spec) });
  if (prep.status !== 'OK') throw new Refusal(prep.result.code, 'compose', { panel });
  const labels = prep.result.labels;
  if (!ctx.typeset) ctx.typeset = M.typo.typesetter();
  for (const label of labels) {
    if (label.kind === 'CONDITION_BOX') throw new Refusal('UNSUPPORTED_MULTILINE_LABEL', 'compose', { labelId: label.id, panel });
    const numericTick = label.kind === 'GRAPH_ANNOTATION' && /^[-−\d.]+$/.test(label.text);
    try {
      ctx.typeset({ id: label.id, owner: label.target || label.id, factRole: 'DERIVED_INTERMEDIATE', fontPx: 24,
        ...(Array.isArray(label.parts) ? { kind: 'MIXED', parts: label.parts } : label.math || label.kind === 'POINT_NAME' || numericTick ? { kind: 'MATH', tex: label.tex || label.text.replaceAll('−', '-') } : { kind: 'TEXT', text: label.text, ...(label.weight === 'MATH' ? { weight: 'MATH' } : {}) }) }, identity);
    } catch (e) {
      if (!isDomainCode(e)) throw e;
      throw new Refusal(e.message, 'compose', { labelId: label.id, labelText: label.tex || label.text, panel });
    }
  }
  // visual_engine/svg_composer.py:144-146 같은 (종류, 대상, 글)의 라벨이 둘이면 DUPLICATE_SEMANTIC_LABEL
  const seen = new Set();
  for (const label of labels) {
    const key = [label.kind, label.owner ?? label.target ?? null, label.text].join('|');
    if (seen.has(key)) throw new Refusal('DUPLICATE_SEMANTIC_LABEL', 'compose', { labelId: label.id, labelText: label.text, panel });
    seen.add(key);
  }
  // verify-rendered-layout.mjs:410-412 사람이 읽을 값(점 이름·좌표·식·눈금 등)이 하나도 없는 그림은 PUBLICATION_TEXT_NOT_READY (축 이름 x, y 만으로는 안 된다)
  const READABLE = new Set(['POINT_NAME', 'ANGLE_LABEL', 'LENGTH_LABEL', 'AREA_LABEL', 'COORDINATE_LABEL', 'EQUATION_LABEL', 'TICK_LABEL']);
  if (!labels.some(l => READABLE.has(l.kind))) throw new Refusal('PUBLICATION_TEXT_NOT_READY', 'compose', { panel });
}
// ---- 깊은 검사 2: 독립 도형(set/stat/lattice)의 spec 라벨을 조판한다(자리 배치는 Chrome 측정이라 하지 않는다)
async function deepStandalone(M, plan, identity, which, ctx) {
  return { status: 'OK' };
}

// ---------------------------------------------------------------- 입력 모으기·출력
function collectPlanFiles(inputs) {
  const out = [];
  const walk = p => {
    const st = fs.statSync(p);
    if (st.isDirectory()) { for (const n of fs.readdirSync(p).sort()) { const q = path.join(p, n); const s2 = fs.statSync(q); if (s2.isDirectory()) walk(q); else if (/^plan\.json$|^q\d+-solution(-\d+)?\.json$/.test(n)) out.push(q); } }
    else out.push(p);
  };
  for (const p of inputs) { if (!fs.existsSync(p)) { console.error('경로가 없다: ' + p); process.exit(2); } walk(p); }
  return out;
}
function labelOf(file) {
  const parts = file.replace(/\\/g, '/').split('/');
  const base = parts[parts.length - 1];
  if (base === 'plan.json') return parts[parts.length - 2];
  return base.replace(/\.json$/, '');
}
const one = r => r.status === 'SKIP' ? `SKIP ${r.code}: ${r.reason}` : `${r.code}: ${r.reason}${r.fix ? ' → ' + r.fix : ''}`;
const notesOf = r => (r.notes && r.notes.length ? r.notes.map(n => '\n    안내: ' + n).join('') : '');
const lineOf = r => (r.status === 'OK' ? 'OK' : r.problems ? r.problems.map((p, i) => (i ? '    └ 그 필드를 지운 뒤 다음에 걸리는 것: ' : '') + one(p)).join('\n') : one(r)) + notesOf(r);

// 허용 밖 필드로 거절되면 그 필드를 지운 사본을 다시 검사해 다음 단계 오류까지 한 번에 알려 준다(고친 뒤 새 오류가 연달아 나오는 것을 줄인다).
const stripPath = (plan, pth, keys) => {
  const c = JSON.parse(JSON.stringify(plan)); let node = c;
  for (const t of [...String(pth).matchAll(/[^.\[\]]+|\[\d+\]/g)].map(m => m[0])) { node = t[0] === '[' ? node && node[Number(t.slice(1, -1))] : node && node[t]; }
  if (node && typeof node === 'object') for (const k of keys) delete node[k];
  return c;
};
// 거절은 아니지만 작성자가 한 번 확인할 곳(plan 은 그대로 렌더된다). 지금은 하나: 도(°) 라벨이 괄호 없는 합·차일 때.
// 엔진은 "x+20" 을 x+20° 로 그린다(x 가 각의 크기, 예 x=30° 이면 맞는 표기). x 가 단순한 수라면 (x+20)° 라야 해서 plan 에 "(x+20)" 로 써야 한다. 어느 쪽인지는 문항이 정하므로 엔진은 바꾸지 않는다.
const topLevelSum = text => { let depth = 0; for (let i = 0; i < text.length; i++) { const ch = text[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (depth === 0 && i > 0 && (ch === '+' || ch === '-') && !/[(+\-*/^=<>]/.test(text[i - 1])) return true; } return false; };
const noteIsObj = v => v !== null && typeof v === "object" && !Array.isArray(v), noteQuote = s => "\"" + String(s) + "\"";
function planNotes(plan) {
  const notes = [];
  const walk = (node, key) => {
    if (Array.isArray(node)) { for (const x of node) walk(x, key); return; }
    if (!noteIsObj(node)) return;
    if ((key === 'angles' || key === 'arcs') && typeof node.label === 'string' && (node.labelKind === undefined || node.labelKind === 'DEGREE') && node.unit === undefined && !/[()°]/.test(node.label) && topLevelSum(node.label.replace(/\s+/g, ''))) {
      const text = node.label.replace(/\s+/g, '');
      notes.push(`${key}[${node.id}] label ${noteQuote(node.label)} 는 ${text}° 로 그려진다(합·차의 끝에만 °). 문항이 x 를 각의 크기(x=30° 꼴)로 쓰면 이대로 맞고, x 가 단순한 수면 "(${text})" 로 써서 (${text})° 로 그린다. 문항 표기대로 정한다.`);
    }
    for (const k of Object.keys(node)) walk(node[k], k);
  };
  walk(plan, '');
  return notes;
}
async function lintPlanAll(plan, ctx) {
  const result = await lintPlanAllCore(plan, ctx), notes = planNotes(plan);
  return notes.length ? { ...result, notes } : result;
}
async function lintPlanAllCore(plan, ctx) {
  const problems = []; let cur = plan, ok = { status: 'OK' };
  for (let round = 0; round < 5; round++) {
    const r = await lintPlan(cur, ctx);
    if (r.status === 'OK') { ok = r; break; }
    problems.push(r);
    if (r.status === 'FAIL' && r.unknownKeys) { cur = stripPath(cur, r.unknownKeys.path, r.unknownKeys.keys); continue; }
    break;
  }
  if (!problems.length) return ok;
  const first = problems.find(p => p.status === 'FAIL') || problems[0];
  const slim = p => ({ status: p.status, stage: p.stage, code: p.code, reason: p.reason, fix: p.fix, ...(p.detail ? { detail: p.detail } : {}), ...(p.unknownKeys ? { unknownKeys: p.unknownKeys } : {}) });
  return problems.length > 1 ? { ...first, problems: problems.map(slim) } : first;
}

async function lintFiles(files, opts = {}) {
  const E = makeEngine(path.resolve(opts.engine || DEFAULT_REPO));
  const jobs = Math.max(1, opts.jobs || 1);
  const hosts = Array.from({ length: jobs }, () => new Host(E));
  const deep = !opts.shallow;
  await loadMods(E);
  const results = new Array(files.length); let next = 0;
  await Promise.all(hosts.map(async host => {
    const ctx = { E, host, deep, typeset: null };
    for (;;) {
      const i = next++; if (i >= files.length) return;
      const t0 = Date.now(); let r;
      try { r = await lintPlanAll(JSON.parse(fs.readFileSync(files[i], 'utf8')), ctx); }
      catch (e) { r = (e instanceof SyntaxError) ? { status: 'FAIL', stage: 'read-plan', code: 'PLAN_JSON_INVALID', ...codes.explain('PLAN_JSON_INVALID', {}) } : { status: 'SKIP', code: 'LINT_INTERNAL_ERROR', reason: String(e && e.message || e) }; }
      results[i] = { file: files[i], label: labelOf(files[i]), ms: Date.now() - t0, ...r };
    }
  }));
  hosts.forEach(h => h.close());
  return results;
}

async function main() {
  const argv = process.argv.slice(2), inputs = [], o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') o.json = true; else if (a === '--shallow') o.shallow = true; else if (a === '--quiet') o.quiet = true;
    else if (a === '--engine') o.engine = argv[++i]; else if (a === '--jobs') o.jobs = Number(argv[++i]);
    else if (a.startsWith('--')) { console.error('모르는 옵션: ' + a); process.exit(2); } else inputs.push(a);
  }
  if (!inputs.length) { console.error('usage: plan-lint.cjs <plan.json | 폴더>… [--json] [--shallow] [--quiet] [--jobs N] [--engine <저장소>]'); process.exit(2); }
  const files = collectPlanFiles(inputs);
  const results = await lintFiles(files, o);
  let bad = 0;
  for (const r of results) {
    if (r.status === 'FAIL') bad++;
    if (o.json) { const { M, ...rest } = r; console.log(JSON.stringify(rest)); continue; }
    if (r.status === 'OK' && o.quiet && !(r.notes && r.notes.length)) continue;
    console.log(`${r.label}: ${lineOf(r)}`);
  }
  if (!o.json) console.error(`plan-lint: ${results.length}개 중 FAIL ${bad}, SKIP ${results.filter(r => r.status === 'SKIP').length}, OK ${results.filter(r => r.status === 'OK').length}`);
  process.exit(bad ? 1 : 0);
}

// plan 객체를 메모리에서 반복해서 검사하는 검사기(plan-autofix 가 쓴다). close() 를 꼭 부른다.
async function createLinter(opts = {}) {
  const E = makeEngine(path.resolve(opts.engine || DEFAULT_REPO));
  await loadMods(E);
  const host = new Host(E), ctx = { E, host, deep: !opts.shallow, typeset: null };
  return { lint: plan => lintPlanAll(plan, ctx), close: () => host.close() };
}

module.exports = { createLinter, lintFiles, lintPlan, planNotes, collectPlanFiles, labelOf, _internal: { makeEngine, loadMods, Host, reserveCurveBranches } };
if (require.main === module) main().catch(e => { console.error(e); process.exit(2); });
