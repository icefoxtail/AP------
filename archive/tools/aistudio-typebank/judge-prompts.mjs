// DeepSeek 에 주는 지시서 두 가지. (1) 정답 독립 풀이: 문제만 보여 주고 푼 답을 받는다. (2) 메타 판정: CrossConcept·Condition·결합 패턴·난이도·4칸.
// PT/TPL/L4 후보는 대응표에서 스크립트가 이미 정했으므로 판정 대상이 아니다(여러 L4 후보 중 고르기만 한다).
import fs from 'node:fs';
import { REPO } from './geo-map.mjs';
import { SUBJECTS } from './common.mjs';

export function solveRequest({ stem, items, outPath, requestSha, cfg = SUBJECTS.geo }) {
  const body = items.map(q => `### 문항 ${q.id}\n${q.content}\n\n보기:\n${q.choices.map((c, i) => `${'①②③④⑤'[i]} ${c}`).join('\n')}`).join('\n\n');
  return `# 정답 독립 풀이 (${stem})

너는 고등학교 2022 개정 「${cfg.course}」 문제를 푸는 풀이자다. 아래 문항을 **직접 풀어** 답을 구한다. 저장된 정답·해설은 보지 못한다(일부러 가렸다).
- 그림이 \`[그림: …]\` 로 글로 적혀 있다. 그 설명만으로 풀어라. 설명이 부족해 풀 수 없으면 solved 를 "?" 로 쓰고 이유를 note 에 적는다.
- 객관식은 보기 번호(①~⑤)로 답한다.

## 출력
파일 쓰기 도구로 아래 경로에 JSON 을 쓴다: ${outPath}
형식(다른 글 금지):
{"requestSha":"${requestSha}","items":[{"qid":1,"solved":"②","work":"풀이 2~4줄(이 문항의 숫자·식)","note":""}]}
모든 문항(${items.map(q => q.id).join(', ')})을 넣는다. 다 쓴 뒤 마지막 줄에 DONE 이라고만 답한다.

## 문항
${body}
`;
}

export function judgeRequest({ stem, info, items, menus, dict, outPath, requestSha, onlyErrors = null, cfg = SUBJECTS.geo }) {
  const cc = [...menus.cc].map(([k, v]) => `${k}\t${v}`).join('\n');
  const cond = [...menus.cond].map(([k, v]) => `${k}\t${v}`).join('\n');
  const terms = dict.terms.filter(t => t.status !== 'RETIRED').map(t => `${t.ko}\t${t.kind}`).join('\n');
  const body = items.map(q => `### 문항 ${q.id}  (AI 스튜디오 난이도 참고값 ${q.difficultyBucket})\n[발문]\n${q.content}\n\n[보기]\n${q.choices.map((c, i) => `${'①②③④⑤'[i]} ${c}`).join('\n')}\n\n[저장 정답] ${q.answer}\n\n[해설]\n${q.solution}`).join('\n\n---\n\n');
  const fixBlock = onlyErrors ? `\n## 이번에 고칠 것\n앞 판정에서 검사기가 거른 문항만 다시 쓴다. 지적 사항을 모두 고친다.\n${onlyErrors}\n` : '';
  return `# 메타 판정 (${stem})

너는 고등학교 2022 개정 「${cfg.course}」 문항의 메타 작성자다. 아래 문항마다 **발문과 해설을 직접 읽고** 판정한다. 키·용어는 아래 목록 안에서만 고른다. 근거 없이 채우지 않는다(맞는 것이 없으면 비우고 제안으로 남긴다).
이 유형: ${info.type}  (대응표 PT ${info.pt}, 핵심: ${info.gist})
${fixBlock}
## 판정할 칸 (문항마다)
1. \`rpmRecordId\`: 이 문항의 결정적 단계가 속한 RPM 행. 후보 = ${(info.candidates || info.l4Ids.map(id => ({ id, path: '' }))).map(c => (c.path ? `${c.id}(${c.path})` : c.id)).join(', ')} 중 하나. 후보가 하나면 그것.
2. \`primaryMethod\`: 풀이 방법을 한 문장(10~60자). \`decisiveStep\`: 이 문항의 숫자·식으로 쓴 결정적 한 단계(10~80자).
3. \`crossConceptKeys\`: 해설의 정답 경로에서 **실제로 쓰이는**, 이 유형 자신의 개념 밖의 개념 키(아래 목록, 0~3개). 유형 자신의 개념(포물선 문제의 "포물선" 등)은 넣지 않는다. 쓰이지 않으면 [].
4. \`conditionKeys\`: 발문에 명시된 값·부호·범위·종류 제한(아래 목록, 0~2개). 없으면 [].
5. \`integrationPattern\`: NONE(한 개념으로 해결) · SEQUENTIAL(앞 결과를 뒤 단계에 순서대로 사용) · INTERDEPENDENT(둘 이상의 개념이 서로 의존) · REINTERPRETATION(한 개념의 결과를 다른 개념 언어로 재해석) · CASE_BRANCH(경우·범위 분기) · DEEP_COMPOSITE(여러 구조가 반복 상호 의존) 중 하나.
6. 난이도: \`difficultyBucket\` 1~5 정수(참고값을 확인해 맞으면 그대로, 아니면 고친다), \`difficultyConfidence\`(high|medium|low), \`difficultyBoundaryFlag\`(NONE|B12|B23|B34|B45, 두 단계 사이면 낮은 쪽이 앞), \`difficultyReason\`(이 문항의 숫자·식으로 한 문장). 정의·공식을 바로 쓰면 1. 풀이 줄 수·계산량만으로 올리지 않는다. 애매하면 낮게 잡고 경계 플래그를 쓴다.
7. 4칸 \`slots\`: given(주어진 대상·조건 용어), goal(구하는 것; 대입·계산·치환 같은 방법어는 쓰지 않는다), method(해설의 결정적 풀이 단계를 모두 덮는 방법 용어. \`사칙연산\` 금지), condition(수 범위·부호·"모든"·"서로 다른" 같은 제약). 항목은 \`{"term":"사전 용어","src":"stem|choices|solution","quote":"원문에서 그대로 복사한 4자 이상 구절"}\` 이고 method 항목에는 \`"evidenceType":"NAMED"\`(원문에 이름이 있음) 또는 \`"IMPLIED"\`(+\`"justification"\` 한 문장)을 붙인다. goal·method 는 비울 수 없다. 한 칸에 같은 용어를 두 번 쓰지 않는다.
   - 인용은 한 글자도 바꾸지 않는다(복사). LaTeX 역슬래시는 JSON 안에서 \\\\ 로 쓴다. 5~40자 짧은 구절이 안전하다. \`$\`가 걸리면 닫는 \`$\`까지 옮긴다. src 가 stem 이면 [발문]에서, solution 이면 [해설]에서 가져온다.
   - 용어는 아래 사전의 말만 쓴다(\`ko\` 그대로). 정확한 개념이 사전에 없으면 가까운 말로 바꾸지 말고 \`newTerms\` 에 \`{"term":"","kind":"대상|방법|조건|행위","parent":"사전 용어","note":"왜 필요한가"}\` 로 선언한 뒤 그 이름을 slots 에 쓴다.
   - \`format\`: 객관식이면 보통 "단일 정답"(옳은 것/옳지 않은 것 고르기, 보기(ㄱㄴㄷ) 판정이면 그에 맞는 값: 단일 정답 | 옳은 것 고르기 | 옳지 않은 것 고르기 | 보기(ㄱㄴㄷ) 판정).
8. \`newKeyProposals\`: CrossConcept·Condition 목록에 맞는 키가 없어 비웠을 때만 \`{"kind":"CC|COND","key":"CC_…","label":"한글 이름","why":"해설의 어느 단계에 쓰였나"}\`. 억지로 가까운 키에 붙이지 않는다.
9. \`answerDoubt\`: 풀어 보니 저장 정답·해설이 틀렸거나 보기가 모호하면 이유를 쓴다(없으면 "").
- 이유 문장에는 이 문항의 숫자·식을 넣는다. 다른 문항의 문장을 복사하지 않는다.

## 출력
파일 쓰기 도구로 아래 경로에 JSON 을 쓴다: ${outPath}
{"requestSha":"${requestSha}","items":[{"qid":1,"rpmRecordId":"","primaryMethod":"","decisiveStep":"","crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"NONE","difficultyBucket":2,"difficultyConfidence":"medium","difficultyBoundaryFlag":"NONE","difficultyReason":"","format":"단일 정답","slots":{"given":[],"goal":[],"method":[],"condition":[]},"newTerms":[],"newKeyProposals":[],"answerDoubt":""}]}
대상 문항 ${items.map(q => q.id).join(', ')} 를 모두 넣는다. 다 쓴 뒤 마지막 줄에 DONE 이라고만 답한다.

## CrossConcept 목록 (키\\t이름)
${cc}

## Condition 목록 (키\\t이름)
${cond}

## 4칸 용어 사전 (용어\\t종류)
${terms}

## 문항
${body}
`;
}

export function loadDictionary() {
  return JSON.parse(fs.readFileSync(`${REPO}/docs/architecture/4slot/term-dictionary-v1.6.json`, 'utf8'));
}


/**
 * 묶음 판정 요청: 같은 단원의 여러 유형 문항 30개 안팎을 한 번에 보낸다. 문항마다 발문·보기·정답만 보낸다(해설·그림·원본·이전 판정은 보내지 않고, 다시 풀지 않는다).
 * 유형·PT/TPL/L4·정답은 이미 정해진 값이라 묻지 않고, 비어 있는 칸(CrossConcept·Condition·결합 패턴·난이도·4칸)만 문항마다 받는다.
 * 같은 유형의 문항도 원문이 서로 달라 조건·결합 개념이 다를 수 있으므로 유형 공통값을 복사하지 않는다.
 * groups: [{ stem, info, items, errors? }]  errors: { qid: [메시지…] } 가 있으면 그 문항만 다시 쓴다.
 */
export function judgeBatchRequest({ groups, menus, dict, outPath, requestSha, cfg = SUBJECTS.geo }) {
  const cc = [...menus.cc].map(([k, v]) => `${k}\t${v}`).join('\n');
  const cond = [...menus.cond].map(([k, v]) => `${k}\t${v}`).join('\n');
  const terms = dict.terms.filter(t => t.status !== 'RETIRED').map(t => `${t.ko}\t${t.kind}`).join('\n');
  const body = groups.map(g => {
    const qs = g.items.map(q => `#### 문항 ${q.id}${g.errors?.[q.id] ? '  ← 다시 쓸 문항' : ''}\n[발문]\n${q.content}\n[보기] ${q.choices.map((c, i) => `${'①②③④⑤'[i]} ${c}`).join('  ')}\n[정답] ${q.answer}${g.errors?.[q.id] ? `\n[검사기 지적] ${g.errors[q.id].join(' / ')}` : ''}`).join('\n\n');
    return `### 유형 stem=${g.stem}\n유형: ${g.info.type}\n대상 문항: ${g.items.map(q => q.id).join(', ')}\n\n${qs}`;
  }).join('\n\n=========\n\n');
  const outShape = '{"requestSha":"' + requestSha + '","items":[{"stem":"…","qid":1,"crossConceptKeys":[],"conditionKeys":[],"integrationPattern":"NONE","difficultyBucket":2,"difficultyConfidence":"medium","difficultyBoundaryFlag":"NONE","difficultyReason":"","slots":{"given":[],"goal":[],"method":[],"condition":[]},"newTerms":[],"newKeyProposals":[]}]}';
  return `# 메타 고르기 묶음 (${groups.length}유형, 문항 ${groups.reduce((n, g) => n + g.items.length, 0)}개)

너는 고등학교 2022 개정 「${cfg.course}」 문항의 메타를 **고르는** 사람이다. **문제를 풀지 않는다. 계산·검산을 하지 않는다. 읽고 메타만 고른다.** 정답은 이미 주어져 있고(검증됨), 유형·PT/TPL도 정해져 있다. 문항에는 발문·보기·정답만 있다.
각 문항은 책의 서로 다른 원문을 하나씩 바꾼 문항이라 **같은 유형이어도 조건·결합 개념이 다를 수 있다. 문항마다 따로 고른다(앞 문항 값을 복사하지 않는다).** 키·용어는 아래 목록(후보 표) 안에서 **고르기만** 한다. 맞는 것이 없으면 비우고 제안(newKeyProposals·newTerms)으로 남긴다. 근거 없이 채우지 않는다.

## 문항마다 고를 칸 (이것만 쓴다)
1. \`crossConceptKeys\`: 발문·보기로 보아 풀이에 **쓰이는**, 이 유형 자신의 개념 밖의 개념 키(아래 목록, 0~3개). 유형 자신의 개념은 넣지 않는다. 없으면 [].
2. \`conditionKeys\`: 발문에 명시된 값·부호·범위·종류 제한(아래 목록, 0~2개). 없으면 [].
3. \`integrationPattern\`: NONE(한 개념으로 해결) · SEQUENTIAL(앞 결과를 뒤 단계에 순서대로 사용) · INTERDEPENDENT(둘 이상의 개념이 서로 의존) · REINTERPRETATION(한 개념의 결과를 다른 개념 언어로 재해석) · CASE_BRANCH(경우·범위 분기) · DEEP_COMPOSITE(여러 구조가 반복 상호 의존) 중 하나.
4. 난이도: \`difficultyBucket\` 1~5 정수(하/중/상은 쓰지 않는다), \`difficultyConfidence\`(high|medium|low), \`difficultyBoundaryFlag\`(NONE|B12|B23|B34|B45, 두 단계 사이면 낮은 쪽이 앞이고 bucket 은 그 둘 중 하나), \`difficultyReason\`(발문의 숫자·식을 넣은 한 문장, 8자 이상). 정의·공식을 바로 쓰면 1. 식 길이·계산량만으로 올리지 않는다. 애매하면 낮게 잡고 경계 플래그를 쓴다.
5. 4칸 \`slots\`: given(주어진 대상·조건 용어), goal(구하는 것; 대입·계산·치환 같은 방법어는 쓰지 않는다), method(발문이 요구하는 풀이의 방법 용어. \`사칙연산\` 금지), condition(수 범위·부호·"모든"·"서로 다른" 같은 제약). 항목은 \`{"term":"사전 용어","src":"stem|choices","quote":"발문·보기에서 그대로 복사한 구절"}\` 이다(src 는 stem 또는 choices 뿐). method 항목에는 \`"evidenceType":"NAMED"\`(발문·보기에 그 방법의 이름이 있음) 또는 \`"IMPLIED"\`(이름은 없으나 이 문제가 요구함, \`"justification"\` 한 문장 필수; quote 는 그 방법을 부르는 발문 구절)을 붙인다. goal·method 는 비울 수 없다. 한 칸에 같은 용어를 두 번 쓰지 않는다.
   - 인용은 한 글자도 바꾸지 않는다(복사). LaTeX 역슬래시는 JSON 안에서 \\ 로 쓴다. 5~40자 짧은 구절이 안전하다. \`$\`가 걸리면 닫는 \`$\`까지 옮긴다.
   - 용어는 아래 사전의 말만 쓴다(\`ko\` 그대로). 정확한 개념이 사전에 없으면 가까운 말로 바꾸지 말고 \`newTerms\` 에 \`{"term":"","kind":"대상|방법|조건|행위","parent":"사전 용어","note":"왜 필요한가"}\` 로 선언한 뒤 그 이름을 slots 에 쓴다.
6. \`newKeyProposals\`: CrossConcept·Condition 목록에 맞는 키가 없어 비웠을 때만 \`{"kind":"CC|COND","key":"CC_…","label":"한글 이름","why":"발문의 어느 부분 때문인가"}\`.
- 이유 문장에는 이 문항의 숫자·식을 넣는다. 다른 문항의 문장을 복사하지 않는다.
- "다시 쓸 문항" 표시가 있는 문항은 [검사기 지적]을 모두 고쳐서 그 문항만 다시 쓴다(다른 문항은 넣지 않는다).

## 출력
파일 쓰기 도구로 아래 경로에 JSON 하나를 쓴다: ${outPath}
${outShape}
items 에 모든 대상 문항을 넣는다(\`stem\` 은 그 문항이 속한 유형 stem). 다른 칸은 쓰지 않는다. 다 쓴 뒤 마지막 줄에 DONE 이라고만 답한다.

## CrossConcept 목록 (키\t이름)
${cc}

## Condition 목록 (키\t이름)
${cond}

## 4칸 용어 사전 (용어\t종류)
${terms}

## 문항 묶음
${body}
`;
}
