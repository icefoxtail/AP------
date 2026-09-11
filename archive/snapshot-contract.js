(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APArchiveSnapshotContract = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function () {
    'use strict';
    const roots = new WeakMap();
    const countMath = root => window.APRenderLoop.unrenderedMathCount(root);
    function layout(root) {
        return [...root.querySelectorAll('.page')].map(page => {
            const body = page.querySelector('.page-body');
            return { width: page.offsetWidth, height: page.offsetHeight, bodyWidth: body.clientWidth, bodyHeight: body.clientHeight,
                overflowX: page.scrollWidth > page.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1,
                overflowY: body.scrollHeight > body.clientHeight + 2 };
        });
    }
    function assets(root) {
        return [...root.querySelectorAll('img')].map(image => ({ node: image, src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight }));
    }
    function allAssetsComplete(items) {
        return items.every(item => item.node.complete && item.node.naturalWidth === item.width && item.width > 0 && item.node.naturalHeight === item.height && (item.node.currentSrc || item.node.src) === item.src);
    }
    function freeze(snapshot, ctx) {
        const geometry = layout(snapshot.rootNode);
        const images = assets(snapshot.rootNode);
        const noMath = !snapshot.rootNode.querySelector('mjx-container') && countMath(snapshot.rootNode) === 0;
        const common = {
            S01: ctx.state === 'SUCCEEDED', S02: snapshot.key === ctx.snapshotKey,
            S03: snapshot.sessionId === ctx.requestedTargetSessionId, S04: !!ctx.candidate.source.sourceArchiveFile,
            S05: snapshot.rootNode === ctx.targetArea, S06: true,
            S07: document.fonts.status === 'loaded', S08: noMath || !!window.MathJax?.typesetPromise,
            S09: noMath || ctx.metrics.mathJaxCalls > 0, S10: countMath(snapshot.rootNode) === 0,
            S11: allAssetsComplete(images), S12: geometry.every(p => !p.overflowX && !p.overflowY),
            S13: ctx.result.evidence.state === 'RENDER_READY', S14: geometry.length === snapshot.pageCount,
            S15: allAssetsComplete(images), S16: ctx.sideEffectsAllowed === false,
            S17: ctx.result.evidence.events.length === 5, S18: !ctx.abortSignal.aborted
        };
        if (Object.values(common).some(pass => !pass)) throw new Error('SNAPSHOT_COMMON_HARD_GATE:' + Object.keys(common).filter(k => !common[k]).join(','));
        snapshot.commonHardGateEvidence = Object.freeze(common);
        snapshot.geometry = geometry;
        snapshot.assets = images;
        snapshot.buildState = ctx.buildState;
        snapshot.diagnostics = ctx.diagnostics;
        snapshot.fingerprints = ctx.candidate.fingerprints;
        snapshot.sourceArchiveFile = ctx.candidate.source.sourceArchiveFile;
        snapshot.fontStatus = document.fonts.status;
        snapshot.mathRuntimeReady = noMath ? 'NOT_REQUIRED' : 'PASS';
        snapshot.mathTypesetComplete = noMath ? 'NOT_REQUIRED' : 'PASS';
        roots.set(snapshot.rootNode, snapshot);
    }
    function canReuse(snapshot, ctx) {
        return roots.get(snapshot.rootNode) === snapshot && snapshot.sessionId === ctx.requestedTargetSessionId &&
            snapshot.sourceArchiveFile === ctx.candidate.source.sourceArchiveFile && snapshot.key === ctx.snapshotKey &&
            Object.values(snapshot.commonHardGateEvidence || {}).length === 18 && Object.values(snapshot.commonHardGateEvidence).every(Boolean) &&
            document.fonts.status === 'loaded' && allAssetsComplete(snapshot.assets) && countMath(snapshot.rootNode) === 0;
    }
    function preflight(snapshot, candidate) {
        const root = snapshot?.rootNode, actual = root ? layout(root) : [];
        const fingerprints = candidate.fingerprints;
        const equalFingerprint = key => snapshot?.fingerprints[key] === fingerprints[key];
        const gates = {
            P01: !!snapshot, P02: snapshot?.status === 'ACTIVE', P03: snapshot?.sessionId === candidate.source.targetSessionId,
            P04: snapshot?.sourceArchiveFile === candidate.source.sourceArchiveFile,
            P05: snapshot?.key === window.APRenderStateNormalizer.computeSnapshotKey(candidate),
            P06: root === document.getElementById('print-area') && roots.get(root) === snapshot,
            P07: actual.length > 0 && actual.length === snapshot?.pageCount,
            P08: snapshot?.mathRuntimeReady === 'NOT_REQUIRED' || !!window.MathJax?.typesetPromise,
            P09: ['PASS', 'NOT_REQUIRED'].includes(snapshot?.mathTypesetComplete), P10: !!root && countMath(root) === 0,
            P11: document.fonts.status === 'loaded', P12: equalFingerprint('font'), P13: equalFingerprint('asset'),
            P14: !!snapshot && allAssetsComplete(snapshot.assets) && assets(root).length === snapshot.assets.length,
            P15: equalFingerprint('pageLayout') && JSON.stringify(actual) === JSON.stringify(snapshot?.geometry),
            P16: actual.every(p => !p.overflowY), P17: actual.every(p => !p.overflowX),
            P18: equalFingerprint('qrPolicy'), P19: equalFingerprint('qrPayload'), P20: equalFingerprint('printHeader'),
            P21: equalFingerprint('profile') && equalFingerprint('executor'),
            P22: !!snapshot && Object.values(snapshot.commonHardGateEvidence).every(Boolean),
            P23: !!snapshot && snapshot.readinessEvidence.events.length === 5 && snapshot.sessionId === candidate.source.targetSessionId
        };
        return { pass: Object.values(gates).every(Boolean), gates };
    }
    return Object.freeze({ freeze, canReuse, preflight });
}));
