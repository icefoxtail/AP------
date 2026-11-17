'use strict';
// 테스트 목록(tests/test-inventory.json)의 elsewhere 항목이 사실인지 확인할 때 쓰는 도우미.
// 워크플로 .yml 에서 `paths:` / `paths-ignore:` 는 "언제 돌릴지"를 정하는 트리거일 뿐 실행이 아니다.
// 그래서 그 목록 줄을 뺀 본문에서만 테스트를 찾는다.

// `paths:` / `paths-ignore:` 블록(한 줄 [..] 형식과 여러 줄 목록 형식)을 지운 본문을 돌려준다.
function stripPathFilters(text) {
  const lines = String(text).split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const key = /^(\s*)paths(?:-ignore)?:\s*(.*)$/.exec(line);
    if (!key) { out.push(line); continue; }
    const indent = key[1].length;
    const rest = key[2].trim();
    if (rest.startsWith('[')) {
      // 한 줄 또는 여러 줄에 걸친 [ ... ] 목록
      let open = (rest.match(/\[/g) || []).length - (rest.match(/\]/g) || []).length;
      while (open > 0 && i + 1 < lines.length) {
        i += 1;
        open += (lines[i].match(/\[/g) || []).length - (lines[i].match(/\]/g) || []).length;
      }
      continue;
    }
    if (rest) continue; // 그 밖의 한 줄 값
    // 줄바꿈 목록: 키보다 깊게 들여쓴 줄, 또는 키와 같은 들여쓰기의 `- ` 줄, 빈 줄, 주석 줄
    while (i + 1 < lines.length) {
      const next = lines[i + 1];
      const nextIndent = /^(\s*)/.exec(next)[1].length;
      const blank = !next.trim() || next.trim().startsWith('#');
      if (blank || nextIndent > indent || (nextIndent === indent && next.trim().startsWith('-'))) i += 1;
      else break;
    }
  }
  return out.join('\n');
}

const escapeRe = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 경로 경계: 앞은 줄 시작·공백·따옴표·`/`(체크아웃 접두)·`=(:` , 뒤는 끝·공백·따옴표·`),;|&`.
// `scene-smoke-semantic-calibration.test.mjs` 안의 `calibration.test.mjs` 같은 부분 문자열은 앞 글자가 `-`라서 걸러진다.
function mentions(body, target) {
  const re = new RegExp(`(?:^|[\\s'"/=(:])${escapeRe(target)}(?=$|[\\s'"),;|&])`, 'm');
  return re.test(body);
}

// 본문이 항목(정확한 경로 또는 `*` 패턴)을 실제로 언급하는가.
// 패턴은 같은 문자열이 있거나, 그 패턴을 감싸는 디렉터리 패턴(`디렉터리/*`)이 있으면 인정한다.
function referencesEntry(body, match) {
  if (mentions(body, match)) return true;
  if (!match.includes('*')) return false;
  const dir = match.slice(0, match.lastIndexOf('/'));
  if (dir && !dir.includes('*')) return mentions(body, `${dir}/*`) || mentions(body, `${dir}/**`);
  return false;
}

module.exports = { stripPathFilters, mentions, referencesEntry };
