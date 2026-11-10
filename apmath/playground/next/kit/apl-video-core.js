/* ==========================================================================
   AP Math Lab Kit · 영상 대본 계산부 (apl-video-core.js)
   화면(DOM)을 전혀 쓰지 않는 순수 계산입니다. 재생기(apl-player.js)와 단위 테스트(tools/video.test.mjs)가 같은 코드를 씁니다.

   영상은 따로 그린 동영상이 아니라, 실험실 그림을 「대본」대로 움직이는 것입니다. 대본 = 시간순 cue 목록.
     {
       length: 12,                              // 전체 길이(초). 8~15 (쇼츠: 영상 하나에 핵심 하나)
       title:  '중심각이 2배면 호는?',            // (선택) 영상 제목(20자 이하, 질문형·핵심형). 재생이 시작되면 위쪽에 크게 떴다가 작은 머리글로 남음. 생략하면 장면 제목
       start:  { f1_ss2_t: 0 },                 // (선택) 시작할 때 맞출 숫자 상태값(움직이지 않는 값도 가능). 자막이 말하는 값은 여기에 적어 그림과 맞춥니다. 생략하면 장면에 들어갔을 때의 값
       summary: '$S=\\frac12 rl$',               // 끝 화면 한 줄 요약
       task:    '중심각을 움직여 보세요',          // 끝 화면 「이제 직접 해 보세요」
       cues: [
         { at: 0,  say: '자막', to: { key: 1 }, dur: 6, ease: 'smooth', set: { key: true }, step: 2, part: 'ref' },
         ...
       ]
     }
   cue 한 칸의 필드(모두 at 외에는 선택):
     at    이 칸이 시작하는 시각(초). 첫 칸은 0, 칸마다 커져야 함
     dur   to 의 움직임이 걸리는 시간(초). 생략하면 다음 칸이 시작할 때까지(마지막 칸은 length 까지)
     to    숫자 상태값을 목표값까지 부드럽게 바꿈 { 상태값이름: 목표값 }. 같은 이름의 앞선 움직임이 끝난 뒤에 시작해야 함
     set   (숫자가 아니어도 되는) 상태값을 이 시각에 바로 바꿈 { 이름: 값 }
     ease  smooth(기본) | linear | in | out
     snap  to 로 움직이는 동안 값을 (그 움직임의 시작값 기준) snap 의 배수로 반올림해 계단식으로 넘깁니다. 예: snap 15 → 90, 105, 120 … 180.
           움직이는 동안 호·넓이·각이 소수(94.91°, 6.33π)로 보이는 장면에서 깨끗한 값만 지나가게 할 때 씁니다. 끝 값은 정확히 to 입니다
     say   자막. **굵게**, $수식$ 가능
     step  정리 탭 단계 번호(s.step)를 바꿈. 탐구 화면에서 단계를 읽는 장면에서만 의미가 있음
     part  그림에서 강조할 부분 이름(s.part). 장면의 view().parts[].id 와 같은 값. null 이면 강조 해제

   [해설(lesson)] 여러 장(chapter)을 이어 붙여 정답까지 한 번에 보여 주는 형식. 장 하나는 위 대본 그대로(쇼츠 규칙 8~15초 적용)이고, 해설은 장 2~6개입니다.
     {
       title:   '부채꼴 넓이는 왜 ½rl?',     // 해설 제목(20자 이하). 정답이 들어가면 안 됨
       tab:     'review',                    // (선택) 재생 동안 정리 탭 상태로 그림을 그림(단계·보조선이 켜지는 장면만). 생략하면 탐구 탭
       answer:  '$12\pi$',                  // (선택) 정답. 마지막 장 이전의 자막·제목에 나오면 검사 실패
       summary: '…', task: '…',              // 끝 화면(해설 전체에 하나)
       chapters: [ 대본, 대본, … ]            // 각 장은 title 필수. 첫 장의 start 가 해설의 시작값, 둘째 장부터의 start 는 그 장이 시작하는 순간의 즉시 설정
     }
   validateLesson / compileLesson 이 검사·이어 붙이기를 합니다(compileLesson 결과는 compile 결과와 같은 모양 + chapters:[{at,length,title}]).
   ========================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    const A = (root.APLab = root.APLab || {});
    A.videoCore = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 쇼츠 규칙(선생님 지적 2026-11-03: 24초·22초 샘플이 늘어진다): 8~15초, 자막 2~3줄, 한 줄 40자(휴대폰 화면 2줄 이내), 첫 1초 안에 그림이 움직이기 시작
  const LIMITS = { minLen: 8, maxLen: 15, minSay: 2, maxSay: 3, maxSayChars: 40, minSayGap: 2.5, maxSummaryChars: 40, maxTaskChars: 90, maxTitleChars: 20, maxFirstMoveAt: 1 };
  const LESSON_LIMITS = { minChapters: 2, maxChapters: 6 };
  const LESSON_FIELDS = ['title', 'tab', 'answer', 'summary', 'task', 'chapters'];
  const LESSON_TABS = ['review'];
  const EASE = {
    smooth: (x) => x * x * (3 - 2 * x),
    linear: (x) => x,
    in: (x) => x * x,
    out: (x) => 1 - (1 - x) * (1 - x)
  };
  const CUE_FIELDS = ['at', 'dur', 'to', 'set', 'ease', 'snap', 'say', 'step', 'part'];
  const SCRIPT_FIELDS = ['length', 'title', 'start', 'summary', 'task', 'cues'];
  const EPS = 1e-9;
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

  /** 자막의 화면 글자 수(수식 하나는 4자로 셈) */
  function plainLen(say) {
    return String(say == null ? '' : say).replace(/\*\*/g, '').replace(/\$[^$]*\$/g, 'xxxx').trim().length;
  }

  /**
   * 대본을 검사해 {errors, warnings} 를 돌려줍니다. 던지지 않습니다.
   * opts.chapter: 해설의 한 장으로 검사(summary·task 는 해설 전체에 하나라 장에서는 선택, title 은 필수)
   * opts.first === false: 해설의 둘째 장 이후 — 「첫 1초 안에 움직임」 규칙을 적용하지 않음(조건을 짚고 단계만 바꾸는 장이 있을 수 있음)
   */
  function validate(script, opts) {
    opts = opts || {};
    const errors = [];
    const warnings = [];
    const err = (m) => errors.push(m);
    if (!script || typeof script !== 'object') return { errors: ['대본이 객체가 아닙니다'], warnings };
    Object.keys(script).forEach((k) => { if (!SCRIPT_FIELDS.includes(k)) err(`알 수 없는 대본 필드: ${k}`); });
    const L = script.length;
    if (!isNum(L)) err('length(초)가 숫자가 아닙니다');
    else if (L < LIMITS.minLen || L > LIMITS.maxLen) err(`length ${L}초: ${LIMITS.minLen}~${LIMITS.maxLen}초여야 합니다`);
    if (script.start != null) {
      if (typeof script.start !== 'object') err('start 는 객체여야 합니다');
      else for (const [k, v] of Object.entries(script.start)) if (!isNum(v)) err(`start.${k} 가 숫자가 아닙니다`);
    }
    const textOk = (name, max) => {
      const v = script[name];
      if (typeof v !== 'string' || !v.trim()) err(`${name} 가 비어 있습니다`);
      else if (plainLen(v) > max) err(`${name} 가 너무 깁니다(${plainLen(v)}자 > ${max}자)`);
    };
    if (script.title != null) {
      if (typeof script.title !== 'string' || !script.title.trim()) err('title 이 비어 있습니다(없애거나 글자를 쓰세요)');
      else if (script.title.trim().length > LIMITS.maxTitleChars) err(`title 이 너무 깁니다(${script.title.trim().length}자 > ${LIMITS.maxTitleChars}자)`);
      else if (/[<$]|\*\*/.test(script.title)) err('title 은 글자만 씁니다(HTML 태그·수식·**굵게** 불가)');
    }
    if (opts.chapter) {
      if (script.title == null) err('장에는 title 이 있어야 합니다');
      ['summary', 'task'].forEach((n) => { if (script[n] != null) textOk(n, n === 'summary' ? LIMITS.maxSummaryChars : LIMITS.maxTaskChars); });
    } else {
      textOk('summary', LIMITS.maxSummaryChars);
      textOk('task', LIMITS.maxTaskChars);
    }
    const cues = script.cues;
    if (!Array.isArray(cues) || !cues.length) {
      err('cues 가 비어 있습니다');
      return { errors, warnings };
    }
    let prevAt = -1;
    const says = [];
    const lastEnd = {}; // 상태값 → 마지막 to 움직임이 끝나는 시각
    cues.forEach((c, i) => {
      const w = `cues[${i}]`;
      if (!c || typeof c !== 'object') { err(`${w} 가 객체가 아닙니다`); return; }
      Object.keys(c).forEach((k) => { if (!CUE_FIELDS.includes(k)) err(`${w}: 알 수 없는 필드 ${k}`); });
      if (!isNum(c.at)) { err(`${w}.at 이 숫자가 아닙니다`); return; }
      if (i === 0 && c.at !== 0) err('첫 칸의 at 은 0 이어야 합니다');
      if (c.at <= prevAt + EPS) err(`${w}.at(${c.at})이 앞 칸보다 커야 합니다`);
      if (isNum(L) && c.at >= L - EPS) err(`${w}.at(${c.at})이 length(${L}) 이상입니다`);
      prevAt = c.at;
      const nextAt = i + 1 < cues.length && cues[i + 1] && isNum(cues[i + 1].at) ? cues[i + 1].at : L;
      const dur = c.dur != null ? c.dur : nextAt - c.at;
      if (c.dur != null && (!isNum(c.dur) || c.dur <= 0)) err(`${w}.dur 는 0보다 큰 숫자여야 합니다`);
      else if (isNum(L) && isNum(dur) && c.at + dur > L + 1e-6) err(`${w}: at+dur(${(c.at + dur).toFixed(2)})가 length(${L})를 넘습니다`);
      if (c.snap != null) {
        if (!isNum(c.snap) || c.snap <= 0) err(`${w}.snap 은 0보다 큰 숫자여야 합니다`);
        else if (c.to == null) err(`${w}.snap 은 to 와 함께만 씁니다`);
      }
      if (c.ease != null && !EASE[c.ease]) err(`${w}.ease 는 ${Object.keys(EASE).join('|')} 중 하나여야 합니다`);
      if (c.to != null) {
        if (typeof c.to !== 'object' || Array.isArray(c.to)) err(`${w}.to 는 객체여야 합니다`);
        else for (const [k, v] of Object.entries(c.to)) {
          if (!isNum(v)) err(`${w}.to.${k} 가 숫자가 아닙니다(숫자가 아니면 set 을 쓰세요)`);
          if (lastEnd[k] != null && c.at < lastEnd[k] - EPS) err(`${w}.to.${k}: 앞선 움직임(${lastEnd[k].toFixed(2)}초에 끝남)과 겹칩니다`);
          lastEnd[k] = c.at + dur;
        }
      }
      if (c.to != null && c.step !== undefined) warnings.push(`${w}: 같은 칸에 to 와 step 을 함께 쓰지 않는 것이 안전합니다(값이 바뀌면 장면이 step 을 0으로 되돌릴 수 있음. 값은 앞 칸에서 먼저 맞추세요)`);
      if (c.set != null && (typeof c.set !== 'object' || Array.isArray(c.set))) err(`${w}.set 은 객체여야 합니다`);
      if (c.step != null && !(Number.isInteger(c.step) && c.step >= 0)) err(`${w}.step 은 0 이상의 정수여야 합니다`);
      if (c.part != null && typeof c.part !== 'string') err(`${w}.part 는 문자열(또는 null)이어야 합니다`);
      if (c.say != null) {
        if (typeof c.say !== 'string' || !c.say.trim()) err(`${w}.say 가 비어 있습니다`);
        else {
          if (plainLen(c.say) > LIMITS.maxSayChars) err(`${w}.say 가 너무 깁니다(${plainLen(c.say)}자 > ${LIMITS.maxSayChars}자): ${c.say.slice(0, 20)}…`);
          if (/<[a-z]/i.test(c.say)) err(`${w}.say 에 HTML 태그를 쓸 수 없습니다(굵게는 **글자**)`);
          says.push({ at: c.at, i });
        }
      }
    });
    // 소개 줄 금지: 첫 칸 근처에서 그림이 바로 움직여야 합니다(to 로 움직이는 칸이 maxFirstMoveAt 초 안에 시작)
    if (opts.first !== false && !cues.some((c) => c && c.to && isNum(c.at) && c.at <= LIMITS.maxFirstMoveAt + EPS)) err(`첫 ${LIMITS.maxFirstMoveAt}초 안에 그림이 움직이기 시작해야 합니다(첫 칸에 to 를 두세요. 소개만 하는 칸 금지)`);
    if (says.length < LIMITS.minSay || says.length > LIMITS.maxSay) err(`자막 ${says.length}줄: ${LIMITS.minSay}~${LIMITS.maxSay}줄이어야 합니다`);
    if (cues[0] && !cues[0].say) err('첫 칸(at 0)에 자막이 있어야 합니다');
    for (let k = 0; k < says.length; k++) {
      const end = k + 1 < says.length ? says[k + 1].at : L;
      if (isNum(end) && end - says[k].at < LIMITS.minSayGap - EPS) err(`자막 cues[${says[k].i}] 이 ${(end - says[k].at).toFixed(1)}초만 보입니다(${LIMITS.minSayGap}초 이상)`);
    }
    return { errors, warnings };
  }

  /** 대본을 계산하기 쉬운 모양으로 풀어 둡니다(검증을 통과한 대본을 전제). */
  function compile(script) {
    const L = script.length;
    const cues = script.cues.map((c, i) => {
      const nextAt = i + 1 < script.cues.length ? script.cues[i + 1].at : L;
      return { at: c.at, dur: c.dur != null ? c.dur : nextAt - c.at, ease: EASE[c.ease] ? c.ease : 'smooth', say: c.say || null, snap: c.snap > 0 ? c.snap : null, to: c.to || null, set: c.set || null, step: c.step, part: c.part, index: i };
    });
    const tracks = {}; // 상태값 → [{t0, t1, to, ease}]
    const setKeys = new Set();
    let usesStep = false, usesPart = false;
    cues.forEach((c) => {
      if (c.to) for (const [k, v] of Object.entries(c.to)) (tracks[k] = tracks[k] || []).push({ t0: c.at, t1: c.at + c.dur, to: v, ease: c.ease, snap: c.snap });
      if (c.set) Object.keys(c.set).forEach((k) => setKeys.add(k));
      if (c.step !== undefined) usesStep = true;
      if (c.part !== undefined) usesPart = true;
    });
    // start 에만 있고 to 로 움직이지 않는 숫자 상태값도 영상이 시작할 때 그 값으로 맞춥니다(자막이 말하는 값과 그림을 같게)
    Object.keys(script.start || {}).forEach((k) => { if (!tracks[k]) tracks[k] = []; });
    const says = cues.filter((c) => c.say).map((c) => ({ at: c.at, text: c.say, cue: c.index }));
    says.forEach((s, k) => { s.end = k + 1 < says.length ? says[k + 1].at : L; });
    return { length: L, title: typeof script.title === 'string' && script.title.trim() ? script.title.trim() : null, start: script.start || {}, summary: script.summary, task: script.task, cues, tracks, setKeys: [...setKeys], usesStep, usesPart, says };
  }

  /* ------------------------------ 해설(lesson): 여러 장을 이어 붙임 ------------------------------ */
  /** 정답 비교용: 수식 기호·공백을 걷어 내고 π 표기를 통일합니다. */
  function normAnswer(text) {
    return String(text == null ? '' : text).replace(/\\pi(?![a-z])/g, 'π').replace(/\\(?:text|mathrm|left|right)/g, '').replace(/\\[,;!]/g, '').replace(/[$\\{}*\s]/g, '').toLowerCase();
  }

  /** 해설을 검사해 {errors, warnings}. 장마다 validate(opts.chapter)를 적용하고, 장 수·정답 조기 노출을 봅니다. 던지지 않습니다. */
  function validateLesson(lesson) {
    const errors = [];
    const warnings = [];
    const err = (m) => errors.push(m);
    if (!lesson || typeof lesson !== 'object') return { errors: ['해설이 객체가 아닙니다'], warnings };
    Object.keys(lesson).forEach((k) => { if (!LESSON_FIELDS.includes(k)) err(`알 수 없는 해설 필드: ${k}`); });
    if (typeof lesson.title !== 'string' || !lesson.title.trim()) err('해설 title 이 비어 있습니다');
    else if (lesson.title.trim().length > LIMITS.maxTitleChars) err(`해설 title 이 너무 깁니다(${lesson.title.trim().length}자 > ${LIMITS.maxTitleChars}자)`);
    else if (/[<$]|\*\*/.test(lesson.title)) err('해설 title 은 글자만 씁니다(HTML 태그·수식·**굵게** 불가)');
    if (lesson.tab != null && !LESSON_TABS.includes(lesson.tab)) err(`tab 은 ${LESSON_TABS.join('|')} 중 하나여야 합니다`);
    if (lesson.answer != null && (typeof lesson.answer !== 'string' || !normAnswer(lesson.answer))) err('answer 는 비어 있지 않은 글이어야 합니다');
    [['summary', LIMITS.maxSummaryChars], ['task', LIMITS.maxTaskChars]].forEach(([n, max]) => {
      const v = lesson[n];
      if (typeof v !== 'string' || !v.trim()) err(`${n} 가 비어 있습니다`);
      else if (plainLen(v) > max) err(`${n} 가 너무 깁니다(${plainLen(v)}자 > ${max}자)`);
    });
    const ch = lesson.chapters;
    if (!Array.isArray(ch)) { err('chapters 가 배열이 아닙니다'); return { errors, warnings }; }
    if (ch.length < LESSON_LIMITS.minChapters || ch.length > LESSON_LIMITS.maxChapters) err(`장 ${ch.length}개: ${LESSON_LIMITS.minChapters}~${LESSON_LIMITS.maxChapters}개여야 합니다(더 길면 해설을 둘로 나누세요)`);
    ch.forEach((c, i) => {
      const v = validate(c, { chapter: true, first: i === 0 });
      v.errors.forEach((m) => err(`chapters[${i}]: ${m}`));
      v.warnings.forEach((m) => warnings.push(`chapters[${i}]: ${m}`));
    });
    // 정답은 마지막 장에서만: 해설 제목, 마지막 장 이전의 장 제목·자막에 나오면 안 됩니다
    const ans = lesson.answer != null ? normAnswer(lesson.answer) : '';
    if (ans) {
      if (normAnswer(lesson.title).includes(ans)) err('해설 title 에 정답이 들어 있습니다');
      ch.forEach((c, i) => {
        if (!c || i === ch.length - 1) return;
        if (normAnswer(c.title).includes(ans)) err(`chapters[${i}].title 에 정답이 마지막 장보다 먼저 나옵니다`);
        (c.cues || []).forEach((q, k) => { if (q && q.say && normAnswer(q.say).includes(ans)) err(`chapters[${i}].cues[${k}].say 에 정답이 마지막 장보다 먼저 나옵니다`); });
      });
    }
    return { errors, warnings };
  }

  /**
   * 장들을 시간 순서로 이어 붙여 compile 결과와 같은 모양으로 돌려줍니다(+ chapters, answer, tab, kind).
   * 둘째 장 이후의 start 는 그 장이 시작하는 시각의 즉시 설정(길이 0 구간)이 됩니다. 검증을 통과한 해설을 전제로 합니다.
   */
  function compileLesson(lesson) {
    let off = 0;
    const cues = [], tracks = {}, says = [], setKeys = new Set(), marks = [];
    let usesStep = false, usesPart = false, start = {};
    lesson.chapters.forEach((script, ci) => {
      const c = compile(script);
      if (ci === 0) start = c.start;
      else for (const [k, v] of Object.entries(c.start)) (tracks[k] = tracks[k] || []).push({ t0: off, t1: off, to: v, ease: 'linear', snap: null });
      const cueBase = cues.length;
      c.cues.forEach((q) => cues.push({ ...q, at: q.at + off, index: cues.length, ch: ci }));
      for (const [k, segs] of Object.entries(c.tracks)) {
        tracks[k] = tracks[k] || [];
        segs.forEach((g) => tracks[k].push({ ...g, t0: g.t0 + off, t1: g.t1 + off }));
      }
      c.says.forEach((q) => says.push({ at: q.at + off, text: q.text, cue: q.cue + cueBase, ch: ci }));
      c.setKeys.forEach((k) => setKeys.add(k));
      usesStep = usesStep || c.usesStep;
      usesPart = usesPart || c.usesPart;
      marks.push({ at: off, length: c.length, title: c.title || '' });
      off += c.length;
    });
    says.forEach((q, k) => { q.end = k + 1 < says.length ? says[k + 1].at : off; });
    return {
      kind: 'lesson', length: off, title: typeof lesson.title === 'string' && lesson.title.trim() ? lesson.title.trim() : null, start,
      summary: lesson.summary, task: lesson.task, answer: lesson.answer || null, tab: lesson.tab || null,
      cues, tracks, setKeys: [...setKeys], usesStep, usesPart, says, chapters: marks
    };
  }

  /** 시각 t 가 속한 장의 번호. */
  function chapterAt(cs, t) {
    const ch = cs.chapters || [];
    let k = 0;
    ch.forEach((c, i) => { if (c.at <= t + EPS) k = i; });
    return k;
  }

  /** 시각 t 에서 숫자 상태값 하나의 값. base 는 영상이 시작할 때의 값. */
  function trackValue(segs, startVal, t) {
    let v = startVal;
    for (const g of segs) {
      if (t >= g.t1 - EPS) { v = g.to; continue; }
      if (t <= g.t0) break;
      const x = EASE[g.ease]((t - g.t0) / (g.t1 - g.t0));
      const from = v;
      v = from + (g.to - from) * x;
      if (g.snap) { // 시작값 기준 snap 의 배수로 반올림(to 를 넘지 않게)
        const n = Math.round((v - from) / g.snap);
        v = from + n * g.snap;
        v = g.to >= from ? Math.min(g.to, Math.max(from, v)) : Math.max(g.to, Math.min(from, v));
        v = Math.round(v * 1e9) / 1e9;
      }
      break;
    }
    return v;
  }

  /**
   * 시각 t 의 상태. base = { nums: {이름: 시작값}, sets: {이름: 시작값}, step, part } (영상이 시작할 때의 값)
   * 되감기·건너뛰기를 해도 같은 시각이면 항상 같은 값입니다.
   */
  function stateAt(cs, t, base) {
    const nums = {};
    for (const [k, segs] of Object.entries(cs.tracks)) {
      const start0 = cs.start[k] != null ? cs.start[k] : base.nums[k];
      nums[k] = trackValue(segs, start0, t);
    }
    const sets = {};
    cs.setKeys.forEach((k) => { sets[k] = base.sets ? base.sets[k] : undefined; });
    let step = base.step, part = base.part;
    for (const c of cs.cues) {
      if (c.at > t + EPS) break;
      if (c.set) Object.assign(sets, c.set);
      if (c.step !== undefined) step = c.step;
      if (c.part !== undefined) part = c.part;
    }
    let say = -1;
    cs.says.forEach((s, k) => { if (s.at <= t + EPS) say = k; });
    return { nums, sets, step, part, say };
  }

  /** 다음/이전 자막의 시작 시각(없으면 null). */
  function nextSayAt(cs, t) {
    const s = cs.says.find((x) => x.at > t + 0.05);
    return s ? s.at : null;
  }
  function prevSayAt(cs, t) {
    let cur = -1;
    cs.says.forEach((s, k) => { if (s.at <= t + EPS) cur = k; });
    if (cur < 0) return 0;
    if (t - cs.says[cur].at > 1.0 || cur === 0) return cs.says[cur].at;
    return cs.says[cur - 1].at;
  }

  return { LIMITS, LESSON_LIMITS, EASE, validate, validateLesson, compile, compileLesson, chapterAt, normAnswer, stateAt, trackValue, nextSayAt, prevSayAt, plainLen };
});
