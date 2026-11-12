(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ArchiveStudentSvgRefresh = api;
})(globalThis, function () {
  const indexRequests = new Map();
  const indexPath = group => `data/student-svg-refresh-v1/${group}.json`;

  function groupForFile(file) {
    const original = file.match(/^original\/(high|middle)\/([hm][1-3])\//);
    if (original) return `${original[1]}-${original[2]}`;
    if (file.startsWith('textbooks/')) return 'textbooks';
    if (file.startsWith('similar/')) return 'similar';
    return 'other';
  }
  // Each row carries a content fingerprint and two visual field groups.
  const groups = [
    ['image', 'imageAlt', 'imageSize'],
    ['solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'solutionImageLayout'],
  ];
  const svgPath = /^assets\/(?:[^/?#\\]+\/)*[^/?#\\]+\.svg$/i;
  const fieldText = value => typeof value === 'string' ? value.replace(/\r\n/g, '\n') : value ?? null;

  function identityContent(question) {
    return JSON.stringify([
      fieldText(question.content),
      Array.isArray(question.choices) ? question.choices.map(fieldText) : null,
      fieldText(question.answer),
    ]);
  }

  function normalizeSourceFile(value) {
    return String(value ?? '').trim().replaceAll('\\', '/').replace(/^(?:\.\/)?(?:archive\/)?(?:exams\/)?/, '');
  }

  function sourceFileCandidates(file) {
    const legacy = file.match(/^(.*\/)(mid|final)\/([^/]+)$/);
    const semester = legacy?.[3].match(/(?:^|_)([12])학기(?:_|$)/)?.[1];
    return semester ? [`${legacy[1]}${semester}${legacy[2]}/${legacy[3]}`, file] : [file];
  }

  function candidates(question, sourceFile, index) {
    const uid = question.generatedUid || question.uid || question.questionUid ||
      question.source_question_uid || question._sourceQuestionUid;
    const generated = uid ? { group: 'generated', keys: [`g:${uid}`] } : null;
    if (question.sourceKind === 'generated' || question.generatedUid || question.sourceShard) return generated;
    const resolved = uid && globalThis.resolveQuestionIdentityReference?.({ questionUid: uid });
    const file = normalizeSourceFile(question.sourceArchiveFile || question._sourceFile ||
      question.source_archive_file || question.sourceFile || resolved?.sourceArchiveFile || sourceFile);
    if (!file) return generated;
    const number = question._sourceQuestionNo ?? question.sourceQuestionNo ?? question.source_question_no ?? question.id;
    const ordinal = question.sourceOrdinal ?? question._sourceQuestionOrdinal ??
      question.source_question_ordinal ?? resolved?.sourceOrdinal ?? (sourceFile ? index + 1 : null);
    return { group: groupForFile(file), keys: [
      ...(uid ? [`u:${uid}`] : []),
      ...sourceFileCandidates(file).flatMap(candidate => [
        ...(number == null ? [] : [`n:${candidate}#${number}`]),
        ...(ordinal == null ? [] : [`o:${candidate}#${ordinal}`]),
      ]),
    ] };
  }

  function normalizeSvgPath(value) {
    if (typeof value !== 'string') return null;
    const asset = value.trim().replace(/^(?:\.\/)?(?:archive\/)?/, '').split(/[?#]/, 1)[0];
    if (!svgPath.test(asset) || /%(?:2e|2f|5c)/i.test(asset) || asset.split('/').some(part => part === '.' || part === '..'))
      return null;
    return asset;
  }

  async function loadIndex(group, fetcher, baseUrl) {
    const signal = AbortSignal.timeout(2500);
    const response = await fetcher(new URL(indexPath(group), baseUrl), { cache: 'no-cache', signal });
    if (!response.ok) return null;
    const index = await response.json();
    return index?.version === 1 && index.keys && Array.isArray(index.rows) ? index : null;
  }

  async function refresh(questions, envelope, options = {}) {
    if (envelope?.sourceKind !== 'assignment' || !envelope.assignmentId || !Array.isArray(questions)) return questions;
    const sourceFile = envelope.meta?.sourceArchiveFile || (envelope.sourceId?.startsWith('MIXED:') ? '' : envelope.sourceId);
    const references = questions.map((question, index) => candidates(question, sourceFile, index));
    const neededGroups = new Set(references.filter(Boolean).map(ref => ref.group));
    if (!neededGroups.size) return questions;
    const cryptoApi = options.crypto || globalThis.crypto;
    if (!cryptoApi?.subtle) return questions;
    try {
      const fetcher = options.fetcher || fetch;
      const baseUrl = options.baseUrl || document.baseURI;
      const indexes = new Map(await Promise.all([...neededGroups].map(async group => {
        const request = () => loadIndex(group, fetcher, baseUrl).catch(() => null);
        if (options.fetcher || options.baseUrl) return [group, await request()];
        if (!indexRequests.has(group)) indexRequests.set(group, request());
        return [group, await indexRequests.get(group)];
      })));
      const refreshed = await Promise.all(questions.map(async (question, position) => {
        const ref = references[position];
        const index = ref && indexes.get(ref.group);
        if (!index) return question;
        const rows = ref.keys.map(key => Object.hasOwn(index.keys, key) ? index.rows[index.keys[key]] : null).filter(Boolean);
        if (!rows.length) return question;
        const digest = await cryptoApi.subtle.digest('SHA-256', new TextEncoder().encode(identityContent(question)));
        const signature = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        const matches = [...new Set(rows.filter(item => item[0] === signature))];
        const row = matches[0];
        if (!row || matches.some(item => JSON.stringify(item) !== JSON.stringify(row))) return question;
        const result = { ...question };
        for (const [groupIndex, fields] of groups.entries()) {
          const visual = row[groupIndex + 1];
          if (!Array.isArray(visual) || !normalizeSvgPath(visual[0]) || !/^[a-f0-9]{64}$/.test(visual[1])) continue;
          result[fields[0]] = `${normalizeSvgPath(visual[0])}?v=${visual[1]}`;
          for (const [i, field] of fields.slice(1).entries()) {
            if (typeof visual[i + 2] === 'string') result[field] = visual[i + 2];
            else delete result[field];
          }
        }
        return result;
      }));
      return refreshed.some((question, index) => question !== questions[index]) ? refreshed : questions;
    } catch {
      return questions;
    }
  }
  return { indexPath, groupForFile, groups, identityContent, normalizeSourceFile, normalizeSvgPath, refresh };
});
