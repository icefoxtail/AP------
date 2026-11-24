// 시험지 JS의 그림 경로 정본 형태: `assets/images/<시험지>/<파일>` (archive/ 폴더 기준).
// 파일이 디스크에서는 `archive/assets/images/...`에 있어도 JS에는 `archive/`를 붙여 쓰지 않는다.
// 이유: 같은 실수(JS에 저장소 루트 기준 경로를 적음)가 세 번 반복돼(#2774·#2798·#2804) 사후 수리가 필요했다.
// 쓰는 곳: tools/check-staged-exam-image-paths.mjs(pre-commit), tools/harness/verify_similar_exam.mjs(유사 출고 관문),
// tests/image-path-guard.test.js. 다른 게시·반입 도구가 경로를 쓸 때도 canonicalExamImageRef를 거치게 한다.

// 앞에 `/`, `./`, `../` 가 붙거나 `AP------/`가 붙은 `archive/assets/...` 도 같은 실수로 본다.
const PREFIXED = /^(?:(?:\.{1,2}|AP------)?\/)*(?:AP------\/)?archive\/(assets\/.*)$/;

// 정본 형태로 고친 경로. 이미 정본이거나 그림 경로가 아니면 그대로 돌려준다.
export function canonicalExamImageRef(ref) {
  if (typeof ref !== 'string') return ref;
  const match = PREFIXED.exec(ref.trim());
  return match ? match[1] : ref;
}

// 텍스트(JS 소스 한 줄, JSON 문자열 등) 안의 `archive/assets/...` 로 시작하는 그림 경로를 모두 찾는다.
// 따옴표·`=`·괄호·공백 바로 뒤에서 시작하는 것만 잡는다(`https://호스트/archive/assets/…` 같은 외부 주소는 제외).
const FIND = /(?<![A-Za-z0-9_\-./:~])((?:\.{1,2}\/)*\/?archive\/assets\/[^\s"'\\<>)`,;]+)/g;

export function findPrefixedImageRefs(text) {
  const found = [];
  const source = String(text ?? '');
  FIND.lastIndex = 0;
  let match;
  while ((match = FIND.exec(source))) {
    found.push({ ref: match[1], index: match.index, fixed: canonicalExamImageRef(match[1]) });
  }
  return found;
}

// 시험지 JS 소스에서 찾은 위반을 줄 번호·문항 번호·필드 이름과 함께 돌려준다.
// 학생 화면이 그림 주소로 쓰는 곳만 본다: 이름에 image가 든 필드(image, images[], solutionImage …)와 본문 <img src>.
// sourceAssetPaths 같은 "원본 파일 위치 기록" 필드는 디스크 경로(archive/ 포함)가 맞으므로 보지 않는다.
// `onlyLines`(Set<number>, 1부터)를 주면 그 줄만 검사한다.
export function scanExamSource(source, { onlyLines } = {}) {
  const lines = String(source ?? '').split('\n');
  const hits = [];
  let currentId = null;
  let arrayKey = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const idMatch = /^\s*["']?id["']?\s*:\s*(\d+)\s*,?\s*$/.exec(line);
    if (idMatch) currentId = Number(idMatch[1]);
    const arrayOpen = /^\s*["']?([A-Za-z_]\w*)["']?\s*:\s*\[\s*$/.exec(line);
    if (arrayOpen) arrayKey = arrayOpen[1];
    else if (/^\s*\]/.test(line)) arrayKey = null;
    if (onlyLines && !onlyLines.has(i + 1)) continue;
    if (line.indexOf('archive/assets/') < 0) continue;
    for (const found of findPrefixedImageRefs(line)) {
      const field = fieldOf(line, found.index, arrayKey);
      if (field) hits.push({ line: i + 1, id: currentId, field, ref: found.ref, fixed: found.fixed });
    }
  }
  return hits;
}

// 위반으로 볼 필드 이름. 학생 화면 그림이 아니면 null.
function fieldOf(line, index, arrayKey) {
  const before = line.slice(0, index);
  if (/<img\b[^>]*\bsrc\s*=\s*\\*["']?$/i.test(before)) return '본문 <img src>';
  const named = /["']?([A-Za-z_]\w*)["']?\s*:\s*\[?\s*["']?$/.exec(before);
  if (named) return /image/i.test(named[1]) ? named[1] : null;
  if (/^\s*["']?$/.test(before)) return arrayKey && /image/i.test(arrayKey) ? `${arrayKey}[]` : null;
  return null;
}

export function describeHit(hit) {
  const where = hit.id == null ? '' : ` 문항 ${hit.id}`;
  return `${hit.line}줄${where} (${hit.field}): ${hit.ref} → ${hit.fixed}`;
}

// 파싱된 문항 객체 하나에서 같은 위반을 찾는다(출고 관문용). 이름에 image가 든 필드(image, images[], solutionImage …)와
// 모든 문자열 필드·보기 안의 <img src>를 본다. sourceAssetPaths 같은 원본 위치 기록은 보지 않는다.
export function findPrefixedImageRefsInQuestion(question) {
  const hits = [];
  const add = (field, ref) => {
    if (typeof ref !== 'string') return;
    const fixed = canonicalExamImageRef(ref);
    if (fixed !== ref) hits.push({ field, ref, fixed });
  };
  const inline = (field, value) => {
    if (typeof value !== 'string' || value.indexOf('<img') < 0) return;
    for (const match of value.matchAll(/<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1/gi)) add(`${field} <img src>`, match[2]);
  };
  for (const [key, value] of Object.entries(question || {})) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (/image/i.test(key)) add(key, item);
      inline(key, item);
    }
  }
  return hits;
}
