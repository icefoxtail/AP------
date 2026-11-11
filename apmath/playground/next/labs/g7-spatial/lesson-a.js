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
    count({ label: '옆모서리', shape: '삼각기둥', ref: 's0', refName: 'AD', n: 3, yaw: -20, total: 9, meet: 4, par: 2, parCue: 'AD와 평행한 BE, CF 두 개를 제외해요.' })
  ];
  lessons['s1-3'] = [
    count({ label: '다리기준', shape: '사다리꼴기둥', ref: 'AB', refName: 'AB', n: 4, yaw: -35, total: 12, meet: 4, ext: 1, par: 1,
      trapCue: '같은 사다리꼴의 CD는 끝점이 닿지 않아도 더 살펴야 해요.',
      extendCue: 'AB와 CD는 같은 평면 위예요. 평행하지 않아 늘여 봐요.',
      parCue: 'AB와 평행한 모서리는 반대쪽 밑면의 EF 하나예요.' }),
    count({ label: '긴밑변', shape: '사다리꼴기둥', ref: 'DA', refName: 'DA', n: 4, yaw: -35, total: 12, meet: 4, par: 3,
      parCue: 'DA와 평행한 BC, FG, HE 세 모서리를 제외해요.' }),
    count({ label: '옆모서리', shape: '사다리꼴기둥', ref: 'AE', refName: 'AE', n: 4, yaw: -35, total: 12, meet: 4, par: 3,
      parCue: 'AE와 평행한 BF, CG, DH 세 개를 제외해요.' })
  ];
  lessons['s1-4'] = [
    count({ label: '밑면기준', shape: '정육각기둥', ref: 't0', refName: 'AB', n: 6, yaw: -44, total: 18, meet: 4, ext: 2, par: 3,
      trapCue: '같은 밑면의 이웃하지 않은 모서리도 늘이거나 비교해요.',
      extendCue: 'AB와 같은 밑면의 CD, EF는 늘이면 만나는 방향이에요.',
      parCue: 'AB와 평행한 DE, GH, JK 세 개를 제외해요.' }),
    count({ label: '옆모서리', shape: '정육각기둥', ref: 's0', refName: 'AG', n: 6, yaw: -44, total: 18, meet: 4, par: 5,
      parCue: '나머지 옆모서리 다섯 개는 모두 AG와 평행해요.' })
  ];
  lessons['s1-5'] = [
    count({ label: '밑면기준', shape: '사각뿔', ref: 'AB', refName: 'AB', n: 4, yaw: -32, total: 8, meet: 4, par: 1,
      parCue: 'AB와 평행한 것은 밑면의 반대 모서리 CD 하나예요.' }),
    count({ label: '옆모서리', shape: '사각뿔', ref: 'VA', refName: 'VA', n: 4, yaw: -32, total: 8, meet: 5, par: 0,
      meetCue: 'V에서 3개, A에서 2개가 만나 총 5개를 제외해요.',
      parCue: 'VA와 평행한 모서리는 없어요. 옆모서리끼리는 V에서 만나요.' })
  ];
  lessons['s1-6'] = [
    count({ label: '밑면기준', shape: '정사면체', ref: 'AB', refName: 'AB', n: 3, yaw: -43, total: 6, meet: 4, par: 0,
      task: '기준 모서리와 끝점을 공유하지 않는 마주 보는 모서리를 찾아보세요' }),
    count({ label: '옆모서리', shape: '정사면체', ref: 'VA', refName: 'VA', n: 3, yaw: -43, total: 6, meet: 4, par: 0,
      task: '다른 기준 모서리에서도 마주 보는 모서리만 남는지 확인해 보세요' })
  ];
  lessons['s1-7'] = [
    count({ label: '밑면기준', shape: '오각기둥', ref: 't0', refName: 'AB', n: 5, yaw: -34, total: 15, meet: 4, ext: 2, par: 1,
      open: 'n은 밑면의 변의 수로 지금 5예요. 기준 AB를 따라가요.',
      trapCue: '같은 오각형 위의 CD와 DE도 연장해서 살펴보아요.',
      extendCue: 'AB와 같은 밑면의 CD, DE는 늘이면 만나는 방향이에요.',
      parCue: 'AB와 평행한 것은 반대쪽 밑면의 FG 하나예요.',
      task: 'n을 6으로 바꾸고 같은 밑면에서 평행한 모서리가 늘어나는지 보세요' }),
    count({ label: '옆모서리', shape: '오각기둥', ref: 's0', refName: 'AF', n: 5, yaw: -34, total: 15, meet: 4, par: 4,
      open: 'n은 밑면의 변의 수로 지금 5예요. 옆모서리 AF를 봐요.',
      parCue: 'AF를 뺀 나머지 옆모서리 네 개는 모두 평행해요.',
      task: 'n을 바꾸고 옆모서리를 기준으로 꼬인 위치의 개수를 비교해 보세요' }),
    make('두모서리', '두 모서리의 위치 관계 판별', '꼬인 위치', '화면의 겹침 대신 실제 만남과 평행을 차례로 확인해요', '둘째 모서리를 BG로 바꾸고 AB와 만나는지 확인해 보세요', [
      ch('기준 모서리와 비교 모서리', 12, [
        { at: 0, say: '오각기둥에서 기준 AB와 비교할 옆모서리 DI를 보세요.', set: begin('t0', 'pair', 's3'), to: { spTrace: 1 }, dur: 4 },
        { at: 5.5, say: '화면에서 선이 겹쳐 보이는 것만으로 판단하지 않아요.' }
      ], start({ n: 5, yaw: -34 })),
      ch('두 직선이 만나는가', 12, [
        { at: 0, say: 'DI는 밑면 ABCDE와 점 D에서만 만나요.', step: 1 },
        { at: 5.5, say: 'D는 AB 위에 없으므로 AB를 늘여도 DI와 만나지 않아요.', set: { spMeetReady: true } }
      ]),
      ch('평행한지도 확인해요', 12, [
        { at: 0, say: 'AB는 밑면 위, DI는 위아래 방향이라 평행하지 않아요.', step: 2, set: { spParallelReady: true } },
        { at: 5.5, say: 'AB와 DI는 만나지도 평행하지도 않아 꼬인 위치예요.', step: 3, set: { spShowAnswer: true } }
      ])
    ])
  ];
})();
