'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const source = pathToFileURL(path.join(__dirname, '..', 'archive', 'tools', 'geometry-equation', 'production', 'stat-chart-v1.mjs')).href;

test('frequency polygon accepts three named series at score midpoints', async () => {
  const { checkStatChartPlan, statChartSpec } = await import(source);
  const chart = {
    kind: 'FREQUENCY_POLYGON',
    boundaries: ['5/2', '7/2', '9/2', '11/2', '13/2', '15/2'],
    xTickMode: 'MIDPOINT',
    series: [
      { name: '1반', frequencies: [2, 5, 4, 3, 1] },
      { name: '2반', frequencies: [2, 3, 6, 3, 1] },
      { name: '3반', frequencies: [1, 3, 4, 5, 2] }
    ]
  };
  const plan = { capability: 'stat-chart-figure-v1', chart, caption: '세 반의 점수 도수분포다각형' };
  const model = checkStatChartPlan(plan);
  assert.equal(model.series.length, 3);
  const spec = statChartSpec(plan, model, {});
  assert.deepEqual(spec.prims.filter(p => p.role === 'polygon').map(p => p.cls), ['poly0', 'poly1', 'poly2']);
  assert.deepEqual(spec.labels.filter(p => p.role === 'x-tick').map(p => p.plain), ['3', '4', '5', '6', '7']);

  assert.throws(() => checkStatChartPlan({ ...plan, chart: { ...chart, series: [...chart.series, { name: '4반', frequencies: [1, 1, 1, 1, 1] }] } }), /STAT_SERIES_INVALID/);
  assert.throws(() => checkStatChartPlan({ ...plan, chart: { ...chart, kind: 'HISTOGRAM' } }), /STAT_X_TICK_MODE_INVALID/);
});

test('grouped bar compares three exact frequency series without merging their bars', async () => {
  const {checkStatChartPlan, statChartSpec} = await import(source);
  const chart={
    kind:'GROUPED_BAR', boundaries:['1/2','3/2','5/2','7/2','9/2','11/2'],xTickMode:'MIDPOINT',
    series:[
      {name:'A',frequencies:[4,2,2,2,4]},
      {name:'B',frequencies:[2,3,4,3,2]},
      {name:'C',frequencies:[1,2,8,2,1]}
    ]
  };
  const plan={capability:'stat-chart-figure-v1',chart,caption:'A, B, C의 공책 권수 분포'};
  const model=checkStatChartPlan(plan);
  const spec=statChartSpec(plan,model,{});
  const bars=spec.prims.filter(p=>p.role==='bar');
  assert.equal(bars.length,15);
  assert.deepEqual(new Set(bars.map(p=>p.cls)),new Set(['gbar0','gbar1','gbar2']));
  assert.deepEqual(spec.labels.filter(p=>p.role==='x-tick').map(p=>p.plain),['1','2','3','4','5']);
  assert.throws(()=>checkStatChartPlan({...plan,chart:{...chart,series:[chart.series[0]]}}),/STAT_GROUPED_BAR_INVALID/);
});
