/* 꼬인 위치: 실제 입체의 모서리 이름·분류·원본문제에 결속한 해설. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g7-spatial'] = all['g7-spatial'] || {};
  const begin = (ref, mode = 'count', target = null) => ({ spShowAnswer: false, spMeetReady: false, spExtReady: false, spParallelReady: false, spLessonMode: mode, spRef: ref, spTgt: target, spSpin: false });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });
  const start = d => ({ spN: d.n, spSeed: 0, spYaw: d.yaw, spYawLast: d.yaw, spPitch: 24, spExt: 0, spTrace: 0 });
  function count(d) {
    const ext = d.ext || 0, meet = d.meet + ext, answer = d.total - 1 - meet - d.par;
    const chapters = [
      ch('기준과 구할 위치 관계', 12, [
        { at: 0, say: d.open || `${d.shape}의 모서리는 ${d.total}개예요. 기준 ${d.refName}를 따라가요.`, set: begin(d.ref), to: { spTrace: 1 }, dur: 4 },
        { at: 5.5, say: '꼬인 위치는 만나지도 평행하지도 않은 두 직선이에요.' }
      ], start(d)),
      ch('끝점에서 만나는 모서리', 12, [
        { at: 0, say: d.meetCue || `${d.refName}와 끝점에서 만나는 모서리 ${d.meet}개를 제외해요.`, step: 1, set: { spMeetReady: true } },
        { at: 5.5, say: ext ? d.trapCue || '떨어져 보이는 모서리도 같은 평면이면 늘여서 살펴요.' : '기준 모서리 자신도 세지 않으므로 하나를 빼요.' }
      ])
    ];
    if (ext) chapters.push(ch('늘여서 만나는지도 확인', 12, [
      { at: 0, say: d.extendCue, to: { spExt: 1 }, dur: 4 },
      { at: 5.5, say: `늘이면 만나는 ${ext}개도 제외해요. 만남은 모두 ${meet}개예요.`, set: { spExtReady: true } }
    ]));
    chapters.push(ch('평행도 제외하고 남은 것', 12, [
      { at: 0, say: d.parCue || (d.par ? `평행한 모서리 ${d.par}개도 꼬인 위치가 아니므로 제외해요.` : '평행한 모서리는 없으므로 더 제외할 것은 없어요.'), step: 2, set: { spParallelReady: true } },
      { at: 5.5, say: `$${d.total}-1-${meet}-${d.par}=${answer}$, 꼬인 위치는 ${answer}개예요.`, step: 3, set: { spShowAnswer: true } }
    ]));
    return make(d.label, `${d.refName} 기준으로 꼬인 모서리 세기`, `꼬인 위치 ${answer}개`, '기준 자신과 만남·평행을 제외하면 꼬인 위치가 남아요', d.task || '기준 모서리를 바꾸고 만남·평행·꼬인 위치로 다시 나누어 보세요', chapters);
  }

  lessons['s1-1'] = [
    count({ label: '밑면기준', shape: '직육면체', ref: 'AB', refName: 'AB', n: 4, yaw: -30, total: 12, meet: 4, par: 3 }),
    count({ label: '옆모서리', shape: '직육면체', ref: 'AE', refName: 'AE', n: 4, yaw: -30, total: 12, meet: 4, par: 3 })
  ];
  lessons['s1-2'] = [
    count({ label: '밑면기준', shape: '삼각기둥', ref: 't0', refName: 'AB', n: 3, yaw: -20, total: 9, meet: 4, par: 1, parCue: 'AB와 평행한 모서리는 반대쪽 밑면의 DE 하나예요.' }),
    count({ label: '옆모서리', shape: '삼각기둥', ref: 's0', refName: 'AD', n: 3, yaw: -20, total: 9, meet: 4, par: 2, parCue: 'AD와 평행한 나머지 옆모서리 BE, CF를 제외해요.' })
  ];
})();
