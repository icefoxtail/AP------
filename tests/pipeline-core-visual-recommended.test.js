const test = require('node:test');
const assert = require('node:assert/strict');

test('pipeline-core preserves VISUAL_RECOMMENDED in the frozen denominator', async () => {
  const { denominatorInput } = await import('../archive/tools/pipeline-core/closure.mjs');
  const run = {
    schemaVersion: 'APMATH_PIPELINE_RUN_v1',
    pipeline: 'past-exam',
    runId: 'recommended-test',
    revision: 1,
    renderRuntime: null,
    inputs: [],
    questions: [{
      questionUid: 'source.js|exam|16',
      visual: {
        requirement: 'VISUAL_RECOMMENDED',
        adjudicationId: 'q16:v3',
        adjudicationStatus: 'RESOLVED',
        exemptReason: null,
        actualSolutionVisualAttached: false,
        problemVisualMathDependency: false,
        sharedVisualMathDependency: false
      }
    }]
  };
  const result = denominatorInput(run);
  assert.deepEqual(result.requiredUidSet, ['source.js|exam|16']);
});
