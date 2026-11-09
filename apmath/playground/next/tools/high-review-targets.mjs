// Bounded repair targets requested by the independent visual reviewers.
// State fixtures are screenshot evidence, never native-interaction or visual PASS.
// The caller binds returned PNGs to its source manifest and keeps coverage debts open.
import { createHash } from 'node:crypto';

const commonRuns = new Set(['pc-paper', 'mobile-board']);
const algebraRuns = new Set(['pc-paper', 'mobile-paper', 'mobile-board']);
const criticalSine = new Set(['adv-5', 'adv-6', 'adv-8']);
const commonTargets = {
  'common-circle-eq': new Set(['stdDef', 'generalForm', 'diamEnds', 'apolloCircle', 'midpointLocus', 'apolloMaxAngle', 'foldCircleArc', 'bisectAreaBoth', 'laserReflectTan', 'chordLength', 'dVsR', 'maxMinDist', 'equilMaxMin', 'extCommonTan', 'intCommonTan', 'pappusMinSq']),
  'common-functions': new Set(['bas-5', 'bas-7', 'adv-4', 'adv-3', 'b9-2', 'b9-3', 'b9-4', 'b9-5', 'bas-10', 'adv-1', 'bas-14']),
  'common-irrational': new Set(['i1', 'i2', 'i3']),
  'common-rational': new Set(['r1', 'r3', 'r4'])
};
export function reviewTargetApplicable(labId, sceneId, runName) {
  if (commonTargets[labId]) return commonRuns.has(runName) && commonTargets[labId].has(sceneId);
  if (labId === 'alg-sequence') return algebraRuns.has(runName);
  if (labId === 'alg-sine-cosine-law') return algebraRuns.has(runName) || runName === 'pc-board' && criticalSine.has(sceneId);
  return false;
}

export function neighboringSliderValues(value, min = 0, max = 1, increment = 0.005) {
  const n = (value - min) / increment;
  return [min + (Math.ceil(n - 1e-10) - 1) * increment, min + (Math.floor(n + 1e-10) + 1) * increment]
    .filter(x => x >= min - 1e-10 && x <= max + 1e-10)
    .map(x => Number(x.toFixed(12)));
}

const exactSine = {
  'bas-1': [0.375], 'bas-2': [0.3], 'bas-3': [7 / 11], 'bas-4': [5 / 7],
  'bas-5': [0, 1 / 3, 2 / 3], 'bas-6': [0.5], 'bas-7': [0.375],
  'bas-8': [0.25, 7 / 12, 11 / 12], 'adv-1': [0.5140022745367996, 2 / 3],
  'adv-2': [2 / 9, 0.5, 7 / 9], 'adv-3': [0.6752486272731244],
  'adv-4': [0.9422923904768286], 'adv-7': [2 / 7, 4 / 7, 6 / 7]
};

// Called only for candidate capture mode by high-lab-browser-audit.mjs.
export async function captureReviewTargets({ page, item, scene, run, settle, measure, capture }) {
  if (!reviewTargetApplicable(item.id, scene.id, run.name)) return [];
  const entries = [];
  let serial = 0;
  const hash = value => createHash('sha256').update(value).digest('hex');
  const snapshot = async () => page.evaluate(() => {
    const text = lab.refs.problemText?.cloneNode(true);
    text?.querySelectorAll('button').forEach(b => b.remove());
    return {
      scene: String(lab.scene.id), tab: lab.tab, step: lab.s.step, revealed: !!lab.s.revealed,
      state: JSON.parse(JSON.stringify(lab.s)),
      conditionText: text?.textContent.replace(/\s+/g, ' ').trim() || '',
      variantIndex: typeof lab.scene.vary?.idx === 'function' ? lab.scene.vary.idx() : null,
      camera: { focus: lab.board.focus, aspect: lab.board.aspect, k: lab.board.k, ky: lab.board.ky },
      activePresets: [...document.querySelectorAll('.apl-presets .apl-chip.on')].map(e => e.textContent.trim())
    };
  });
  const shot = async (label, fixture = {}, method = 'state-fixture', more = {}) => {
    const state = 'target-' + label + '-' + (++serial);
    await measure(scene, state);
    const actual = await snapshot();
    if (actual.scene !== scene.id) throw Error('Target scene mismatch: ' + scene.id + ' / ' + actual.scene);
    const file = await capture(scene, state, true);
    if (!file) throw Error('Target capture returned no PNG: ' + state);
    entries.push({ file, state, method, fixture, actual, conditionSHA256: hash(actual.conditionText),
      visualVerdict: 'AWAITING_INDEPENDENT_REVIEW', nativeInteractionPass: false, ...more });
    return actual;
  };
  const debt = (label, reason, fixture = {}) => entries.push({ state: 'target-' + label + '-debt', status: 'COVERAGE_DEBT', method: 'not-captured', fixture, reason, nativeInteractionPass: false });
  const limitation = (label, reason, fixture = {}) => entries.push({ state: 'target-' + label + '-limitation', status: 'LIMITATION', method: 'scope-note', fixture, reason, nativeInteractionPass: false });
  const configure = async ({ tab = 'explore', step = 'final', values = {}, reset = true } = {}) => {
    await page.evaluate(({ index, id, tab, step, values, reset }) => {
      if (reset) lab.goScene(index);
      if (String(lab.scene.id) !== id) throw Error('Wrong target scene');
      lab._tween = null;
      for (const [key, value] of Object.entries(values)) {
        if (!(key in lab.s) && !(key in lab.params)) throw Error('Unknown target state key: ' + key);
        lab.s[key] = value;
      }
      lab.s.playing = false;
      lab.s.revealed = false;
      lab.setTab(tab);
      const steps = typeof lab.scene.steps === 'function' ? lab.scene.steps(lab.s, lab) : lab.scene.steps;
      const wantedStep = step === 'final' ? steps?.length || 0 : step;
      lab.setStep(wantedStep);
      if (lab.tab !== tab || lab.s.step !== wantedStep) throw Error('Target tab/step is unavailable');
      lab.invalidate(true);
    }, { index: scene.index, id: scene.id, tab, step, values, reset });
    await settle();
  };
  const setSliders = async (values, expected = values) => {
    const results = [];
    for (const [key, value] of Object.entries(values)) {
      const control = await page.evaluate(key => {
        const c = lab._ctls?.[key];
        if (!c?.input.checkVisibility()) throw Error('Target slider is not visible: ' + key);
        return { label: c.input.getAttribute('aria-label'), min: Number(c.input.min), max: Number(c.input.max), increment: Number(c.input.step) };
      }, key);
      await page.getByRole('slider', { name: control.label, exact: true }).fill(String(value));
      await settle();
      results.push({ key, requested: value, control });
    }
    const actual = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, lab.s[k]])), Object.keys(expected));
    for (const [key, value] of Object.entries(expected)) if (!Number.isFinite(actual[key]) || Math.abs(actual[key] - value) > 1e-8)
      throw Error('Target slider state mismatch: ' + key + ' wanted ' + value + ' got ' + actual[key]);
    return { inputs: results, actual };
  };
  const clickPreset = async ({ label, t, index }) => {
    const selected = await page.evaluate(({ label, t, index }) => {
      const all = (typeof lab.scene.presets === 'function' ? lab.scene.presets(lab.s, lab) : lab.scene.presets) || [];
      const i = index != null ? index : all.findIndex(p => label != null ? p.label === label : p.set && Math.abs(p.set.t - t) < 1e-12);
      if (i < 0 || !all[i]) throw Error('Missing target preset: ' + (label ?? t ?? index));
      return { index: i, label: all[i].label, set: all[i].set || null };
    }, { label, t, index });
    const buttons = page.locator('.apl-presets .apl-chip:visible');
    if (selected.index >= await buttons.count()) throw Error('Target preset has no visible button: ' + selected.label);
    await buttons.nth(selected.index).click();
    await settle();
    if (selected.set) {
      const actual = await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, lab.s[k]])), Object.keys(selected.set));
      for (const [key, value] of Object.entries(selected.set)) if (typeof value === 'number' ? !Number.isFinite(actual[key]) || Math.abs(actual[key] - value) > 1e-10 : actual[key] !== value)
        throw Error('Target preset did not reach its value: ' + key);
    }
    return selected;
  };
  const clickAction = async id => {
    const index = await page.evaluate(id => {
      const actions = (typeof lab.scene.actions === 'function' ? lab.scene.actions(lab.s, lab) : lab.scene.actions) || [];
      return actions.findIndex(a => a.id === id);
    }, id);
    const buttons = page.locator('.apl-actions-row button:visible');
    if (index < 0 || index >= await buttons.count()) throw Error('Missing visible target action: ' + id);
    await buttons.nth(index).click(); await settle();
  };
  const openSolutions = async () => {
    const cards = page.locator('#apl-pane-review details.apl-acc');
    for (let i = 0, n = await cards.count(); i < n; i++) {
      if (await cards.nth(i).getAttribute('open') === null) await cards.nth(i).locator('summary').click();
    }
    await settle();
  };
  const newProblem = async () => {
    await configure({ tab: 'problem', step: 0, reset: false });
    const before = (await snapshot()).conditionText;
    const button = page.locator('#apl-pane-problem .apl-newprob:visible');
    if (await button.count() !== 1) throw Error('Missing standard new-problem button for target');
    await button.click(); await settle();
    const after = await snapshot();
    if (after.conditionText === before || after.step !== 0 || after.revealed) throw Error('Target new-problem transition did not reset/change');
    return after;
  };
  const reviewSteps = async (label, steps, fixture = {}) => {
    for (const step of steps) {
      await configure({ tab: 'review', step, reset: false });
      await shot(label + '-step' + step, fixture);
    }
  };
  const exploreSliders = async (label, fixtures, step = 'final') => {
    for (const values of fixtures) {
      await configure({ step });
      const ui = await setSliders(values);
      await shot(label, values, 'visible-slider-input', { ui });
    }
  };

  if (item.id === 'common-circle-eq') {
    const id = scene.id;
    if (['chordLength', 'dVsR', 'maxMinDist', 'equilMaxMin'].includes(id)) {
      for (const d of [2, 3, 6]) {
        await configure({ values: { fold: 1 } });
        const radius = await clickPreset({ label: 'r=3' }), distance = await clickPreset({ label: 'd=' + d });
        const actual = await snapshot();
        if (actual.state.r !== 3 || actual.state.d !== d) throw Error('Circle radius/distance chip did not apply');
        await shot('circle-distance-' + d, { r: 3, d, fold: 1 }, 'visible-preset-clicks-and-stage-fixture', { ui: [radius, distance] });
      }
    } else {
      const theta = Math.atan2(2, 3);
      const fixtures = id === 'stdDef' ? [{ theta: 0 }, { theta: 0.72 }]
        : id === 'generalForm' ? [{ fold: 0 }, { fold: 0.5 }, { fold: 1 }]
        : id === 'diamEnds' ? [{ fold: 0, theta }, { fold: 0, theta: theta + Math.PI }]
        : id === 'apolloCircle' ? [{ fold: 0, theta: 0 }, { fold: 0, theta: Math.PI }]
        : ['extCommonTan', 'intCommonTan'].includes(id) ? [{ fold: 0.5 }, { fold: 1 }]
        : id === 'pappusMinSq' ? [{ fold: 0.9 }, { fold: 1 }] : [{}];
      for (const values of fixtures) {
        await configure({ values });
        await shot('circle-repair', values);
      }
    }
  } else if (item.id === 'common-functions') {
    const id = scene.id;
    if (['bas-5', 'bas-7', 'adv-4', 'adv-3'].includes(id)) {
      let condition;
      for (const t of [0, 1]) {
        await configure(); const ui = await setSliders({ t });
        await shot('function-explore-t' + t, { t }, 'visible-slider-input', { ui });
        await configure({ tab: 'problem', step: 0, reset: false });
        const actual = await shot('function-fixed-after-t' + t, { previousExploreT: t }, 'tab-state-transition');
        if (condition != null && condition !== actual.conditionText) throw Error('Target fixed question changed between exploration endpoints');
        condition = actual.conditionText;
        await configure({ tab: 'review', step: 'final', reset: false }); await openSolutions();
        await shot('function-review-after-t' + t, { previousExploreT: t }, 'tab-state-transition');
      }
    } else if (id === 'b9-2') await exploreSliders('piecewise-horizontal', [{ f2a: 2 }, { f2a: 3 }]);
    else if (id === 'b9-3') {
      await configure();
      await clickPreset({ label: '거꾸로 f⁻¹' }); await clickPreset({ label: '2번' });
      const ui = await setSliders({ f3s: 6 });
      await shot('inverse-path', { f3m: 1, f3n: 2, f3s: 6 }, 'visible-preset-and-slider-input', { ui });
    } else if (id === 'b9-4') await exploreSliders('self-inverse-constant', [{ f4a: 1, f4b: -2, f4c: -2 }]);
    else if (id === 'b9-5') {
      // The exploration has a fixed X; a coincident A/B input is a generated
      // fixed question. Select it using the visible generator, not an answer.
      await configure({ tab: 'problem', step: 0 });
      let found = false, count = 0;
      for (; count <= 64; count++) {
        found = await page.evaluate(() => {
          const p = lab.scene.vary?.cur()?.P;
          return !!p && p.X.some(x => -x * x + p.al === -p.k * x);
        });
        if (found || count === 64) break;
        await newProblem();
      }
      if (!found) debt('coincident-output', 'No coincident A/B input found within 64 visible generated questions; current exploration has no such input.', { generatedQuestions: count });
      else {
        await shot('coincident-output-problem', { generatedQuestions: count }, 'visible-generator-condition-selection');
        await configure({ tab: 'review', step: 'final', reset: false }); await openSolutions();
        await shot('coincident-output-review', { generatedQuestions: count }, 'visible-generator-condition-selection');
      }
    } else if (id === 'bas-10' || id === 'adv-1') {
      await configure({ tab: 'review', step: 'final' }); await openSolutions();
      await shot('corrected-area-solution', { solutionDetails: 'all-open' }, 'visible-solution-disclosure');
    } else if (id === 'bas-14') await exploreSliders('root-directions', [{ t: 0.6 }, { t: 1 }]);
  } else if (item.id === 'common-irrational') {
    const cases = scene.id === 'i1' ? [['y=−√(−ax)'], ['y=−√(−ax)', '네 방향 한꺼번에']]
      : scene.id === 'i2' ? [['m = −1'], ['m = 1', '끝점을 지나는 위치'], ['m = 1', '접하는 위치']]
      : [['y=x 밖에서도 (감소)']];
    for (const labels of cases) {
      await configure(); const ui = [];
      for (const label of labels) ui.push(await clickPreset({ label }));
      await shot('root-preset', { labels }, 'visible-preset-clicks', { ui });
    }
  } else if (item.id === 'common-rational') {
    if (scene.id === 'r1') {
      for (const values of [{ m1: 0, rk: 0 }, { m1: 0, rk: -4 }, { m1: 1, fa: 6, fb: 0.5, fc: -6 }]) {
        await configure({ values }); await shot('rational-degenerate-quadrants', values);
      }
    } else if (scene.id === 'r3') {
      await exploreSliders('vertical-line', [{ s3th: -90 }, { s3th: 90 }]);
      await configure(); const ui = await clickPreset({ label: '접선 보이기' });
      await shot('tangent-overlay', { preset: ui.label }, 'visible-preset-click', { ui });
    } else {
      for (const label of ['k = 0 (상수)', '점근선이 끝점 [1, 5]', '점근선 포함 [−1, 3]', '격자점 세기']) {
        await configure(); const ui = await clickPreset({ label });
        await shot('interval-boundary', { preset: label }, 'visible-preset-click', { ui });
      }
    }
  } else if (item.id === 'alg-sequence') {
    const id = scene.id, type = id.split('-')[0];
    if (type === 'type1') {
      await exploreSliders('true-coordinates', [0, 0.5, -0.5].map(type1_dSlope => ({ type1_dSlope, type1_zeroN: 4.5 })));
      for (const action of ['cont', 'abs', 'stems']) for (let i = 0; i < 2; i++) {
        await clickAction(action); await shot('sequence-toggle-' + action + '-' + i, { action }, 'visible-action-click');
      }
    } else if (type === 'type2') {
      await exploreSliders('discrete-maximum', [{ type2_pIdx: 3, type2_qIdx: 6 }, { type2_pIdx: 3, type2_qIdx: 7 }]);
      await configure();
      const ui = await setSliders({ type2_qIdx: 5, type2_pIdx: 5 }, { type2_qIdx: 5, type2_pIdx: 4 });
      await shot('ordered-indices', { attemptedP: 5, q: 5 }, 'visible-slider-input', { ui });
    } else if (type === 'type3') {
      await configure({ tab: 'problem', step: 0 });
      if (id === 'type3-1') {
        let found = false, n = 0;
        for (; n <= 32; n++) {
          found = await page.evaluate(() => lab.scene.vary?.cur()?.params?.zeroSumN === 10);
          if (found || n === 32) break;
          await newProblem();
        }
        if (!found) debt('sum-r-bound', 'The N=10 fixed condition was not found within 32 visible generations.');
      }
      await reviewSteps('signed-sums', [0, 1, 2, 3]);
    } else if (type === 'type4') await exploreSliders('first-term', [{ type4_pCoeff: 1.5, type4_qCoeff: 2, type4_constC: 3 }, { type4_pCoeff: 1.5, type4_qCoeff: 2, type4_constC: 0 }, { type4_pCoeff: 1.5, type4_qCoeff: -2, type4_constC: -3 }]);
    else if (type === 'type5') await exploreSliders('blocks', [{ type5_block1: 2, type5_blockRatio: 1.5 }, { type5_block1: 15, type5_blockRatio: 3.5 }]);
    else if (type === 'type6') await exploreSliders('telescope', [6, 7, 10].map(type6_termCountN => ({ type6_termCountN })));
    else if (type === 'type7') {
      await page.evaluate(() => { const i = lab.list.findIndex(s => s.id === 'type1-0'); if (i < 0) throw Error('Missing abs source scene'); lab.goScene(i); lab.setStep(3); }); await settle();
      const enabled = await page.evaluate(() => !!lab.s.abs);
      if (!enabled) await clickAction('abs');
      await configure();
      if (await page.evaluate(() => !!lab.s.abs)) throw Error('Unavailable absolute-value state survived scene entry');
      await shot('absolute-mode-reset', { priorScene: 'type1-0', priorAbs: true }, 'visible-action-and-scene-state-transition');
      await exploreSliders('period-remainder', [30, 31, 32].map(type7_limitN => ({ type7_startA1: 0.5, type7_limitN })));
    } else if (type === 'type8') {
      await configure({ tab: 'review', step: 0 }); await reviewSteps('branch-stages', [0, 1, 2, 3]);
      await exploreSliders('branch-threshold', [4, 8].map(k => ({ type8_targetA4: k, type8_threshK: k })));
    } else if (id === 'br-tree') {
      await configure({ step: 0 }); await shot('manual-tree-start', { br_level: 0 });
      await setSliders({ br_m: 4 });
      for (let level = 1; level <= 5; level++) {
        await clickAction('br-next');
        if (await page.evaluate(() => lab.s.br_level) !== level) throw Error('Manual tree expansion skipped a level');
        await shot('manual-tree-level' + level, { br_m: 4, br_level: level }, 'visible-action-click');
      }
      for (const index of [0, 1, 2]) {
        const ui = await clickPreset({ index }); await shot('manual-tree-family', { index }, 'visible-preset-click', { ui });
      }
    } else if (id === 'cyc-table') {
      await configure({ step: 0 }); await shot('cycle-before-input', { cy_n: 1 });
      // The reviewed default first repeats at term 8; preserve term 7 and 8.
      for (let n = 2; n <= 8; n++) {
        await clickAction('cy-next');
        if (await page.evaluate(() => lab.s.cy_n) !== n) throw Error('Cycle next-term input failed');
        if (n >= 7) await shot('cycle-term' + n, { cy_n: n }, 'visible-action-click');
      }
      await setSliders({ cy_n: 14 }); await shot('cycle-filled', { cy_n: 14 }, 'visible-slider-input');
      await clickAction('cy-reset'); await shot('cycle-reset', { cy_n: 1 }, 'visible-action-click');
      for (const cy_a1 of [-1, 0, 1]) { await setSliders({ cy_a1 }); await shot('cycle-sign-boundary', { cy_a1 }, 'visible-slider-input'); }
    } else if (id === 'pt-tri-diff') {
      for (const index of [2, 3]) {
        await configure();
        const selected = await page.evaluate(index => {
          if (typeof lab.scene.vary?.set !== 'function') throw Error('Missing finite area variant selector');
          lab.scene.vary.set(index); lab._buildReview(); lab.invalidate(true);
          const q = lab.scene.vary.cur(); return { index, j: q.j, N: q.N };
        }, index);
        await reviewSteps('area-difference', [0, 1, 2, 3], selected);
      }
      await exploreSliders('area-difference-explore', [{ pa_n: 1 }, { pa_n: 9 }]);
    } else if (id === 'pt-tri-sum') {
      for (const index of [0, 1]) for (const pb_n of [1, 3]) {
        await configure(); const ui = await clickPreset({ index }); await setSliders({ pb_n });
        await shot('area-sum-family', { index, pb_n }, 'visible-preset-and-slider-input', { ui });
      }
      limitation('area-sum-drag-path', 'Bounded repaired states are captured. The existing audit tests native mouse/touch handle input separately; no exhaustive continuous trajectory claim.');
    } else if (id === 'fig-repeat') {
      for (const index of [0, 1, 2]) {
        await configure(); const ui = await clickPreset({ index });
        for (const fr_n of [1, 8]) {
          await setSliders({ fr_n });
          for (const step of [0, 2, 3]) {
            await configure({ step, reset: false });
            await shot('finite-repeat', { index, fr_n, step }, 'visible-preset-and-slider-with-stage-fixture', { ui });
          }
        }
      }
    } else throw Error('Unclassified sequence visual target: ' + id);
  } else {
    const id = scene.id;
    if (exactSine[id]) {
      await configure();
      for (const t of exactSine[id]) {
        const ui = await clickPreset({ t });
        await shot('sine-exact', { t }, 'visible-preset-click', { ui });
        for (const near of neighboringSliderValues(t)) {
          const input = await setSliders({ t: near });
          await shot('sine-neighbor', { exactT: t, t: near }, 'visible-slider-input', { ui: input });
        }
      }
    } else if (criticalSine.has(id)) {
      const values = id === 'adv-5' ? [0.3174842066280403, 0.5, 0.6825157933719597]
        : id === 'adv-6' ? [0.25, 0.65, 0.85, 0.645, 0.655] : [0, 0.5, 0.995, 1];
      const steps = id === 'adv-8' ? [0, 2, 3] : [0, 1, 2, 3];
      for (const t of values) {
        await configure({ values: { t } });
        for (const step of steps) {
          await configure({ step, reset: false });
          await shot('sine-critical-stage', { t, step });
        }
      }
      await configure({ values: { t: 0.5 } });
      const before = await shot('sine-before-fixed', { t: 0.5 });
      await newProblem();
      await reviewSteps('sine-generated-fixed', [1, 2, 3], { generated: true });
      await configure({ tab: 'explore', step: 3, reset: false });
      const back = await shot('sine-return-explore', { previousT: before.state.t }, 'tab-state-transition');
      if (Math.abs(back.state.t - before.state.t) > 1e-10) throw Error('Sine exploration parameter did not survive fixed-problem transition');
      limitation('sine-continuous-drag-path', 'Endpoint/intermediate fixtures are captured. The existing audit tests native mouse/touch handle input separately; these images do not certify every continuous value.', { scene: id });
    } else if (id === 'ext-1' || id === 'ext-2') {
      await configure();
      const count = await page.evaluate(() => lab.scene.presets(lab.s, lab).length);
      for (let index = 0; index < count; index++) {
        const ui = await clickPreset({ index }); await shot('arc-preset', { index }, 'visible-preset-click', { ui });
      }
      const phB = Math.atan2(-4, -3), span = 2 * Math.PI - 0.32;
      const phaseT = phi => (phi - phB - 0.16) / span;
      const tc = phaseT(Math.atan2(-4, 3));
      for (const t of id === 'ext-1' ? [...neighboringSliderValues(tc), tc] : [phaseT(-Math.PI / 2), phaseT(0), phaseT(Math.PI / 2)]) {
        await configure({ values: { t } }); await shot('arc-boundary', { t, exactCEndpoint: id === 'ext-1' && t === tc });
      }
      entries.push({ state: 'target-excluded-B-endpoint', status: 'NOT_APPLICABLE', method: 'source-bounded-fixture', fixture: { excludedAngularMargin: 0.16 }, reason: 'The public t range excludes the B endpoint on both sides; no native coincidence claim.', nativeInteractionPass: false });
    } else throw Error('Unclassified sine visual target: ' + id);
  }
  return entries;
}
