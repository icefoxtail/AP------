'use strict';

(function expose(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GeneratedMockSelection = api;
})(typeof globalThis === 'object' ? globalThis : this, function createSelectionApi() {
  const PURPOSES = Object.freeze([
    Object.freeze({ key: 'A', label: '유형 익히기', description: '원본의 핵심 풀이를 유지하며 같은 유형을 연습합니다.' }),
    Object.freeze({ key: 'B', label: '응용 넓히기', description: '조건이나 개념 연결을 바꾼 문제로 풀이를 확장합니다.' }),
    Object.freeze({ key: 'C', label: '심화 도전하기', description: '여러 판단이나 개념을 연결해 해결합니다.' })
  ]);
  const BUCKETS = Object.freeze([1, 2, 3, 4, 5]);

  // Some approved choices store one leading dollar as an inline-math opener; close only that display copy.
  function formatChoiceForDisplay(value) {
    const raw = String(value ?? '');
    if (!raw.startsWith('$')) return raw;
    let delimiters = 0;
    for (let index = 0; index < raw.length; index += 1) {
      if (raw[index] !== '$') continue;
      let slashes = 0;
      for (let before = index - 1; before >= 0 && raw[before] === '\\'; before -= 1) slashes += 1;
      if (slashes % 2 === 0) delimiters += 1;
    }
    return delimiters === 1 ? raw + '$' : raw;
  }

  // A/B/C comes only from the approved variant marker; it is independent of numeric difficulty.
  function classifyPurpose(row) {
    const explicit = String(row?.sourcePurposeGroup || row?.variantPurpose || row?.learningPurpose || '').trim().toUpperCase();
    if (PURPOSES.some(purpose => purpose.key === explicit)) return explicit;
    const match = String(row?.uid || '').match(/(?:^|-)Q\d+-([ABC])[1-3]$/);
    return match ? match[1] : null;
  }

  // Read the canonical numeric bucket across the index's flat, nested, and projected row shapes.
  function difficultyBucket(row) {
    const raw = row?.metaProjection?.difficultyBucket ?? row?.meta?.difficultyBucket ?? row?.difficultyBucket;
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    const value = Number(raw);
    return Number.isInteger(value) && BUCKETS.includes(value) ? value : null;
  }

  function randomIndex(length, random) {
    if (length <= 1) return 0;
    const value = Number(random());
    const normalized = Number.isFinite(value) ? Math.max(0, Math.min(0.999999999999, value)) : 0;
    return Math.floor(normalized * length);
  }

  function shuffled(values, random) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1, random);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function normalizePurposes(purposes) {
    return new Set((Array.isArray(purposes) ? purposes : [])
      .map(value => String(value || '').trim().toUpperCase())
      .filter(value => PURPOSES.some(purpose => purpose.key === value)));
  }

  function matchesCandidate(row, purposes, mode, difficulty) {
    if (!row || !Number.isInteger(Number(row.sourceQid)) || !purposes.has(classifyPurpose(row))) return false;
    if (mode === 'specified') return difficultyBucket(row) === Number(difficulty);
    return mode === 'random' || mode === 'mixed';
  }

  function groupsByQid(rows, purposes, mode, difficulty) {
    const groups = new Map();
    for (const row of Array.isArray(rows) ? rows : []) {
      if (!matchesCandidate(row, purposes, mode, difficulty)) continue;
      const qid = Number(row.sourceQid);
      if (!groups.has(qid)) groups.set(qid, new Map());
      const bucket = difficultyBucket(row);
      const bucketKey = bucket === null ? 'unknown' : String(bucket);
      if (!groups.get(qid).has(bucketKey)) groups.get(qid).set(bucketKey, []);
      groups.get(qid).get(bucketKey).push(row);
    }
    return groups;
  }

  function countedBuckets(rows) {
    const counts = {};
    for (const row of rows) {
      const bucket = difficultyBucket(row);
      const key = bucket === null ? 'unknown' : String(bucket);
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }

  function coverageResult(items, sourceCount, extra = {}) {
    const ordered = items.slice().sort((a, b) => Number(a.row.sourceQid) - Number(b.row.sourceQid));
    const coveredSourceQids = [...new Set(ordered.map(item => Number(item.row.sourceQid)))];
    const sourceTotal = Number.isInteger(Number(sourceCount)) && Number(sourceCount) > 0 ? Number(sourceCount) : 0;
    const covered = new Set(coveredSourceQids);
    const missingSourceQids = Array.from({ length: sourceTotal }, (_, index) => index + 1).filter(qid => !covered.has(qid));
    return {
      ...extra,
      items: ordered,
      sourceCount: sourceTotal,
      coveredSourceQids,
      missingSourceQids,
      coveredCount: coveredSourceQids.length,
      difficultyCounts: countedBuckets(ordered.map(item => item.row))
    };
  }

  function resultError(errorCode, sourceCount, details = {}) {
    return coverageResult([], sourceCount, { ok: false, errorCode, ...details });
  }

  function normalizeQuotas(quotas) {
    const result = {};
    for (const bucket of BUCKETS) {
      const raw = quotas?.[bucket] ?? 0;
      const value = Number(raw);
      if (!Number.isInteger(value) || value < 0) return null;
      result[bucket] = value;
    }
    return result;
  }

  function solveQuotaAssignment(groups, quotas, random) {
    const qids = [...groups.keys()].sort((a, b) => a - b);
    const memo = new Map();
    const keyOf = (index, remaining) => index + '|' + BUCKETS.map(bucket => remaining[bucket]).join(',');

    function solve(index, remaining) {
      const key = keyOf(index, remaining);
      if (memo.has(key)) return memo.get(key);
      if (index >= qids.length) {
        const terminal = { count: 0, assignment: [] };
        memo.set(key, terminal);
        return terminal;
      }
      const qid = qids[index];
      const group = groups.get(qid);
      const options = [null, ...BUCKETS.filter(bucket => remaining[bucket] > 0 && group.has(String(bucket)))];
      const branches = shuffled(options, random);
      let best = null;
      for (const bucket of branches) {
        const nextRemaining = { ...remaining };
        if (bucket !== null) nextRemaining[bucket] -= 1;
        const tail = solve(index + 1, nextRemaining);
        const candidate = {
          count: tail.count + (bucket === null ? 0 : 1),
          assignment: bucket === null ? tail.assignment : [{ qid, bucket }, ...tail.assignment]
        };
        if (!best || candidate.count > best.count) best = candidate;
        if (best.count === Object.values(remaining).reduce((sum, value) => sum + value, 0)) break;
      }
      memo.set(key, best);
      return best;
    }

    return solve(0, quotas);
  }

  function createMockSelection(rows, options = {}) {
    const sourceCount = Number(options.sourceCount) || 0;
    const purposes = normalizePurposes(options.purposes);
    const mode = String(options.mode || 'random');
    const random = typeof options.random === 'function' ? options.random : Math.random;
    if (!purposes.size) return resultError('NO_PURPOSE_SELECTED', sourceCount);
    if (!['specified', 'mixed', 'random'].includes(mode)) return resultError('INVALID_MODE', sourceCount);

    if (mode === 'specified') {
      const difficulty = Number(options.difficulty);
      if (!BUCKETS.includes(difficulty)) return resultError('INVALID_DIFFICULTY', sourceCount);
      const groups = groupsByQid(rows, purposes, mode, difficulty);
      const items = [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([, buckets]) => {
        const candidates = buckets.get(String(difficulty)) || [];
        return { row: candidates[randomIndex(candidates.length, random)], locked: false };
      });
      if (!items.length) return resultError('NO_ELIGIBLE_CANDIDATES', sourceCount, { requestedDifficulty: difficulty });
      return coverageResult(items, sourceCount, { ok: true, mode, requestedDifficulty: difficulty });
    }

    if (mode === 'random') {
      const groups = groupsByQid(rows, purposes, mode);
      const items = [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([, buckets]) => {
        const candidates = [...buckets.values()].flat();
        return { row: candidates[randomIndex(candidates.length, random)], locked: false };
      });
      if (!items.length) return resultError('NO_ELIGIBLE_CANDIDATES', sourceCount);
      return coverageResult(items, sourceCount, { ok: true, mode });
    }

    const quotas = normalizeQuotas(options.quotas);
    if (!quotas) return resultError('INVALID_QUOTAS', sourceCount);
    const total = BUCKETS.reduce((sum, bucket) => sum + quotas[bucket], 0);
    if (!total) return resultError('EMPTY_QUOTAS', sourceCount, { requestedQuotas: quotas });
    if (total > sourceCount) {
      return resultError('MIXED_QUOTA_UNAVAILABLE', sourceCount, {
        requestedQuotas: quotas,
        sourceCountShortfall: total - sourceCount
      });
    }

    const groups = groupsByQid(rows, purposes, 'mixed');
    const assignment = solveQuotaAssignment(groups, quotas, random);
    if (!assignment || assignment.count !== total) {
      const achieved = {};
      for (const entry of assignment?.assignment || []) achieved[entry.bucket] = (achieved[entry.bucket] || 0) + 1;
      const shortfallByDifficulty = Object.fromEntries(BUCKETS
        .map(bucket => [bucket, quotas[bucket] - (achieved[bucket] || 0)])
        .filter(([, count]) => count > 0));
      return resultError('MIXED_QUOTA_UNAVAILABLE', sourceCount, {
        requestedQuotas: quotas,
        shortfallByDifficulty,
        availableSourceQidsByDifficulty: Object.fromEntries(BUCKETS.map(bucket => [bucket,
          [...groups.values()].filter(group => group.has(String(bucket))).length
        ]))
      });
    }
    const items = assignment.assignment.map(({ qid, bucket }) => {
      const candidates = groups.get(qid).get(String(bucket));
      return { row: candidates[randomIndex(candidates.length, random)], locked: false };
    });
    return coverageResult(items, sourceCount, { ok: true, mode, requestedQuotas: quotas });
  }

  function rowEligible(row, purposes, mode, difficulty, mixedBucket) {
    if (!matchesCandidate(row, purposes, mode, difficulty)) return false;
    if (mode === 'mixed' && difficultyBucket(row) !== mixedBucket) return false;
    return true;
  }

  function replaceVariant(options = {}) {
    const { currentRow, selectedRows = [], rows = [] } = options;
    const purposes = normalizePurposes(options.purposes);
    const mode = String(options.mode || 'random');
    const random = typeof options.random === 'function' ? options.random : Math.random;
    if (!currentRow || !purposes.size || !rowEligible(currentRow, purposes, mode, options.difficulty,
      mode === 'mixed' ? difficultyBucket(currentRow) : null)) {
      return { ok: false, errorCode: 'CURRENT_SELECTION_INELIGIBLE', row: currentRow || null };
    }
    const occupied = new Set(selectedRows.filter(row => row && Number(row.sourceQid) !== Number(currentRow.sourceQid)).map(row => row.uid));
    const alternatives = (Array.isArray(rows) ? rows : []).filter(row =>
      Number(row?.sourceQid) === Number(currentRow.sourceQid) && row.uid !== currentRow.uid &&
      !occupied.has(row.uid) && rowEligible(row, purposes, mode, options.difficulty,
        mode === 'mixed' ? difficultyBucket(currentRow) : null)
    );
    if (!alternatives.length) return { ok: false, errorCode: 'NO_REPLACEMENT', row: currentRow };
    return { ok: true, row: alternatives[randomIndex(alternatives.length, random)] };
  }

  function regenerateUnlocked(options = {}) {
    const items = Array.isArray(options.items) ? options.items : [];
    const rows = Array.isArray(options.rows) ? options.rows : [];
    const purposes = normalizePurposes(options.purposes);
    const mode = String(options.mode || 'random');
    const random = typeof options.random === 'function' ? options.random : Math.random;
    const difficulty = options.difficulty;
    const oldItems = items.map(item => ({ row: item?.row, locked: item?.locked === true }));
    const ids = oldItems.map(item => item.row?.uid);
    if (!purposes.size || !oldItems.length || ids.some(id => !id) || new Set(ids).size !== ids.length) {
      return { ok: false, errorCode: 'INVALID_CURRENT_SELECTION', items: oldItems, unchangedSourceQids: [] };
    }
    if (oldItems.some(item => !rowEligible(item.row, purposes, mode, difficulty,
      mode === 'mixed' ? difficultyBucket(item.row) : null))) {
      return { ok: false, errorCode: 'CURRENT_SELECTION_INELIGIBLE', items: oldItems, unchangedSourceQids: [] };
    }

    const next = oldItems.map(item => ({ ...item }));
    const used = new Set();
    for (const item of next) if (item.locked) used.add(item.row.uid);
    const unchangedSourceQids = [];
    for (let index = 0; index < next.length; index += 1) {
      const item = next[index];
      if (item.locked) continue;
      const current = item.row;
      const bucket = mode === 'mixed' ? difficultyBucket(current) : null;
      const candidates = rows.filter(row => Number(row?.sourceQid) === Number(current.sourceQid) &&
        row.uid !== current.uid && !used.has(row.uid) &&
        rowEligible(row, purposes, mode, difficulty, bucket));
      if (candidates.length) {
        const replacement = candidates[randomIndex(candidates.length, random)];
        item.row = replacement;
        used.add(replacement.uid);
      } else if (!used.has(current.uid)) {
        used.add(current.uid);
        unchangedSourceQids.push(Number(current.sourceQid));
      } else {
        return { ok: false, errorCode: 'UID_COLLISION', items: oldItems, unchangedSourceQids };
      }
    }
    const selection = coverageResult(next, Number(options.sourceCount) || next.length, { ok: true, mode, unchangedSourceQids });
    return selection;
  }

  return Object.freeze({ PURPOSES, BUCKETS, classifyPurpose, difficultyBucket, formatChoiceForDisplay, createMockSelection, replaceVariant, regenerateUnlocked });
});
