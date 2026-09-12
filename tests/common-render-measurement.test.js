const test = require('node:test');
const assert = require('node:assert/strict');
const { measureProfiles } = require('../archive/exam-render-executor.js');
function boxes() {
    return [30, 80, 150].map(height => {
        const classes = new Set();
        return { box: { classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
            get scrollHeight() { return classes.has('fit-tight') ? height - 10 : height; } }, classes };
    });
}
test('common staging measurement preserves legacy raw/tight profiles with one batch layout barrier', async () => {
    const legacy = boxes(), batch = boxes(); let oldBarriers = 0, newBarriers = 0;
    await measureProfiles(legacy, { raf: async () => { oldBarriers++; } });
    await measureProfiles(batch, { measurementMode: () => 'batch', raf: async () => { newBarriers++; } });
    assert.deepEqual(batch.map(i => i.profile), legacy.map(i => i.profile));
    assert.equal(oldBarriers, 3); assert.equal(newBarriers, 1);
    assert.ok(batch.every(i => i.classes.size === 0));
});
test('cancellation or a failed layout barrier restores all temporary measurement classes', async () => {
    for (const mode of ['batch', 'legacy']) {
        const items = boxes();
        await assert.rejects(measureProfiles(items, { measurementMode: () => mode, raf: async () => { throw Error('ABORTED'); } }), /ABORTED/);
        assert.ok(items.every(i => i.classes.size === 0));
    }
});
