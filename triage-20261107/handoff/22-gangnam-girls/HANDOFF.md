# 22 강남여고 SVG 렌더 인계

- 인계 상태: `READY_FOR_REVIEW`
- 입력 브랜치: `codex/svg-triage-20261107`
- 렌더 시작 시 입력 브랜치 HEAD: `a1c71f56d9c40071ab84e221bc12c9f371ef90e5`
- 렌더 시작 시 `QUEUE.md` blob: `918f9d4091c9f16ceee1aa68529a5d90a7a8ed01`
- 인계 직전 입력 브랜치 재확인 HEAD: 25626f53c7d0ace4c3f040ae3cce77ef7fd0738c (해당 10문항 입력 blob은 렌더 기준과 동일)
- 구현 브랜치: `codex/svg-review-22-gangnam-girls-20261108`
- 결과 요약: FIGURE 9문항은 공식 엔진 `ARCHIVE_BOUND`/`full`; Q22는 `NOT_RUN`입니다. `RENDERED`는 엔진 렌더 결과이며 독립 검수나 게시 승인을 뜻하지 않습니다.
- PNG와 실행 로그는 Git에 넣지 않았습니다. 기존 운영 SVG와 원본 JS도 수정하지 않았습니다.

## 문항 상태

| Q | 판정 | 상태 | 막힌 이유 |
|---|---|---|---|
| 03 | FIGURE | RENDERED | — |
| 05 | FIGURE | RENDERED | — |
| 06 | FIGURE | RENDERED | — |
| 10 | FIGURE | RENDERED | — |
| 11 | FIGURE | RENDERED | 엔진 결과는 성공. 이번 run의 학생용 after/context/page 캡처는 `NOT_RUN` |
| 14 | FIGURE | RENDERED | — |
| 15 | FIGURE | RENDERED | 이전 timeout 횟수는 `UNKNOWN`으로 보존 |
| 18 | FIGURE | RENDERED | — |
| 20 | FIGURE | RENDERED | — |
| 22 | FIGURE | NOT_RUN | 이번 인계 범위에서 렌더를 실행하지 않음. 입력 3종만 포함 |

EXEMPT: Q01, Q02, Q04, Q07, Q08, Q09, Q12, Q13, Q16, Q17, Q19, Q21, Q23, Q24.

## 렌더·수정 기록

- Q03: 기록된 7회 중 7회째가 성공했습니다. 앞선 오류와 visual fail은 `.tmp/svg-worker-queue/22-gangnam-girls/q03/`에 보존되어 있습니다. 마지막 receipt의 `sourceQuestionRowSha256`는 `null`이며, 별도 addendum과 원문 행 대조를 독립 검수에서 확인해야 합니다.
- Q05: 1회째 경로 오류 후 2회째 성공했습니다. 기존 `q05-solution.svg`는 보존했고, 신규 후보와 비교는 독립 검수에서 해야 합니다.
- Q06: 1회째 성공했습니다. 기존 판정의 source-row parity는 `PASS`; DOM 연동·자격 검증·게시 검증은 `NOT_RUN`입니다.
- Q10: 1회째 성공했습니다.
- Q11: 이번 기록에서 1회째 `TEMPORARY_ROOT_REDIRECT`, 2회째 `LAYOUT_INVENTORY_INCOMPLETE:curve-f-start-coordinates`, 3회째 성공입니다. 3회째에는 중복되는 시작점 좌표 라벨을 숨겼습니다. 과거 다른 실행 이력은 `UNKNOWN`입니다.
- Q14: `SET_ELEMENT_NO_ROOM` 두 번 후 3회째 성공했습니다. 시작 receipt의 queue SHA 누락은 당시 addendum에 보완 기록되어 있습니다.
- Q15: 세 번의 레이아웃/콜아웃 실패 후 4회째 성공했습니다. 과거 timeout 횟수는 `UNKNOWN`입니다. 기존 `q15-solution.svg`는 보존했습니다.
- Q18: 6회째가 성공했습니다. 이전 attempt 기록과 기존 `q18-solution.svg`는 보존했고, 기존 자산과의 비교는 검수 대기입니다.
- Q20: 첫 multi-curve 시도 실패 후 두 번째 rational-graph 후보가 성공했습니다.
- Q22: 공식 renderer는 호출하지 않았습니다. 인계 입력 plan 초안에는 `hideLabels:start`와 일치하도록 양 축의 `-8` tick을 제거한 상태가 포함되어 있지만, 렌더 성공으로 취급하지 않습니다. 기존 `q22-solution.svg`는 보존했습니다.

공식 결과 외의 독립 검수, DOM 통합, qualification, publication은 전부 `NOT_RUN`입니다. Q05·Q11·Q15·Q18·Q22의 기존 자산을 교체하지 않았습니다.

## 입력 원본 blob SHA-1

아래는 입력 브랜치의 원본 `item.json`, `plan.json`, `publish.json` blob입니다. Q11·Q22의 인계 plan에는 렌더 후보 수정을 포함했으며, 그 SHA-256은 다음 절에 기록했습니다.

| Q | item | plan | publish |
|---|---|---|---|
| 03 | `79538e2e336010f81bbe96ad96073708a5222bec` | `9ed638b7fc1fff36ef6c6c5a68b6c34c6b27c3b6` | `26cdbd76b4a1aca22a2b12a02b8d0da5812a2045` |
| 05 | `8abb8c7e1f9aebcfd5f59dfd91c771789b1d8f38` | `80a25827c85e23ce56a88b977bafb65f941cd109` | `c72811a7278663bcc424ccbab785e60fdb3d7c3f` |
| 06 | `a13cbce998f92108f47e7bb81c3cb3752a277a0d` | `df95110b6458454cc730f84f4b6b5f89434aa89f` | `b5a19ce5d354ac03bc564edf2c5358a54e883a4f` |
| 10 | `5764778bc6377feb4a577754fc3c1644dcecbcb7` | `6efe116ac579a3f02550771d4fc1424e15ebef31` | `96c3fee962abab3884de8801c0ce6b51cedce81c` |
| 11 | `145fbd8a29abf7a93f6f35b74ff50bb2002468cf` | `dfe99cd406471807387053caf9e031f609378b68` | `b200192be17a7cdda39dbae840f659a1c5e91bdf` |
| 14 | `a7ad2db74d3ba7c8893c10757bdc41e035e65e5b` | `abf4853ab93e154d846aa9a4402ef8c7b5194282` | `39d6e37fff07c8ef4b3a07ba05ce024d920533f5` |
| 15 | `3c81eefbfd2df3500bc3e9aa78563c150947a93d` | `ec5fd050d5997b18ccdba3ff5f528e2d54b4bdab` | `e6071e51567abe63ffb65ce70aa2c76066fe2752` |
| 18 | `fb33b46304f4870a1f5d50a66b6edb8b9fbe2035` | `8a40bcb400b14ca0147b7ea498094abbdaf4f8c1` | `537c904bf6a55e9e88dcbd54cd13fa150c2bf0c6` |
| 20 | `89ddd5780723f5a3407e624c6be3b27eadc56862` | `c1b2390c6b628dca1f92f254814bac712a35e9a5` | `c4ef727023e77a835f4ece2c50d1e4920bc8a37d` |
| 22 | `6df4247fe8b84f956180a8ee586a1ab0ff3fe6c3` | `f4d2bddd77caf1d6b3f85728393baa7351493891` | `ca4c3a94d6c26f0312647af5ad4017c16b027e46` |

## 인계 파일 SHA-256

| Q | item.json | plan.json | publish.json | figure-solution.svg | figure-result.json |
|---|---|---|---|---|---|
| 03 | `090462a007e7f86a64a65d340400f6ff0eea71b51d4e7f77415ca2a638750374` | `7e7912d699d3ed64697f7c2ea762bef24dd0ef4b9f6b9972d94f871dc6262747` | `17215e400e34ded4dbbbcdb48c04f51824220c6875fa530126e27c4543f06722` | `dc37b0bb5fd67a8109f5cad75760ae39bc2712b85b97fe5be08a7ea2fd02b528` | `474133621126abf0f327bc1c64789e3359ae67dfa75ab678ebbcd1708f6722c0` |
| 05 | `c1488df2ff9657817a7dbfb6d14bd5d0f4a4fd83db3f58da6c56e914c9c509de` | `802503118b4c5d886630d7792c0a42a4ab7454b946ea19af2a58dfaab8fe9f45` | `9475a1c73b898bac7709c3478fbcef0b376a903e575306105fed989ad881ae1d` | `c26307d148f288e1b98f70a5b3517b0b36ae7fc330e39df8cc7033835f91663b` | `78f5ccdaf384e5587c6ffacb4acf6d49faa984c918aa9fa326911d79953b1340` |
| 06 | `cb4d5e84e28fcc219aab5a826cb115ef49b1a3ad38671629d09a79a70bd5be2c` | `a35b731bdcb17bd181b43f2ead713dd77f2ab42ebb66e59be935d7f858b779df` | `69d9fea2814f6e22a96e75bb428a20c10d91bfb3498c23b0cee97922417f2c5e` | `9aa107b3168da17f4a28de677ebdfb069adcbd2f3f10fcc4a41a9b23d0c2f3ca` | `5525c5f893480ac78075783ee7b0f4150c62acb9bc320a0535d65178e802418a` |
| 10 | `a61f5501a2087a579a74cf2c2350b664d56604049550b9ccec385c1c331befe5` | `520dd7001800553af4da436e54e47a24d64e1fd31b522811ce516b9ccf5aee7a` | `e80d0eeb244a50b6f95f7d17e1800f11d2bba46ef1093e21afb430eb06283c9c` | `eacc89dc40d894fd41fcdcc3e256e58d9843c4e549904c7122c9fe2cf283af43` | `9cab0360f78a46d0be89822420f20bc2b41ac60db73340c3a9334ed849a25333` |
| 11 | `5ab457342aae68c00eddf35cf65765ae95aeac639975e7fade5e59fee85dde7a` | `14a7fd6359924684ab0168a415855044a6d5078379cc26cc48fc4c02c1aad715` | `c2acaa7a72d861dfd8518425797a2c5b19bd75e8ebb29aca52be77a310410bfe` | `4c4e41c882c90c79222a58dc2e7d5d05482f4caab14b966a26c5e9aa17d727af` | `424a734876a1d6468565d31ee99eea1d11ad48c92dc9546e8200cdc15e8a46d6` |
| 14 | `0bd1da0c9dedf2f6c0c8de6bd385b5ba711acfcdfbbe76e8cbce7bc7b932ac6f` | `c4b33d0f347e9227a63597d77abd9850299e697d10522260b0b0bc6cf3317fa7` | `dcfc374c491a8ec7a53a87dfe5b2bdeea9a2e7530b96193b3037c38bbb578384` | `8ee80e2703f93bae52f73db0f602608a5ca6275f9008932f41ebf4be48c70b24` | `ba31c91bb1b2f5e3139676e9d66f1ce28957dd2af02274bcb1adfe9687e14e52` |
| 15 | `0f8656dc452fc3a0e162381aa9d322b1054a5d7891ee694ce5ed24c476466ba1` | `e2c73b60212806800f386e43b2dc38619582fea03f3ddd16f0d6982448730554` | `3f91c9eefb31eecf6a379a11fc2cfb1545b3aee626b012066905cb23ab657076` | `e814923d9b1df3701458b5ef3eb88d5c4f2e83af43e283294d509c1941cb0dbd` | `13004aab5be09ab2f16789abe7e5685fc06682bf057790c424722a897dfe8d89` |
| 18 | `22a92c94178cae5b925f0066eb0ac240d3adeeeccb80b9f207348d5370e687d0` | `780b42250e0260837aa3678176b6528ebb8b5b572c02cd6c83c3b707a6425b96` | `0921fb6dfe8668d039ba5b0e477f54fe7863289babc35b302246ac7cb5f159a9` | `f07c18082c0cd1b424cf787996006cfc1a163e045addbe23c40c8e4dd2ffd11c` | `e7b7aac83eae3d1c6a97b5300674809439fe19294c9555af83dc2212ed18eef9` |
| 20 | `2bc4df4ea98392ddcb340918412d72fb9300b844ff0f83827496ca422e4247cd` | `b48ec960665fd3520173ca68c294f305c3f2741390e3fd6978f6ff261ffcbcfe` | `b8c6bba8c4fe8a3c7f81ceae331591771dfbbe6eed50759e098fd8997c8cedfe` | `e0ce0b4b4131456e74437b23fffacd5029ff2124962ee940827935fd6ed74087` | `aa1232511246dad4ba21724f626a16b078f29159dfec240e87763f2bde840038` |
| 22 | `d6e5d97a8c793db5f2a3f983773f359c556a3d2bd67dcd1101ed28a47fecfde8` | `411d287d426860cb7c007642e16cf03fed71388b7d446baf391cb58429bc4c42` | `c4b31c913a1e1e04147cdd712607fe11c6b0354f31f24a4f73d0d28ea8f2cea3` | `NOT_RUN` | `NOT_RUN` |

## 미실행 검증

- 독립 수학·시각 검수: `NOT_RUN` (검수자에게 병렬 분할 요청 예정)
- Q11 학생용 Archive after/context/page 캡처: `NOT_RUN`
- DOM 연동, qualification, publication: 전 문항 `NOT_RUN`
- 테스트 및 게시: 이 인계 범위에서 `NOT_RUN`