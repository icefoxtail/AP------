import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const OUTPUT = path.join(REPORT_DIR, 'function_family_pinpoint_exception_fixes_v1.json');
const SUMMARY = path.join(REPORT_DIR, 'function_family_pinpoint_exception_fixes_v1.md');

const fixes = new Map([
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js', new Map([[12, {
    disposition: 'APPROVED_REPLACEMENT_A',
    reason: '필수 조건 블록이 source content와 도식에서 손상되어 기존 그래프 구조를 유지한 완전 문항으로 복원.',
    fields: {
      content: '아래 그림과 같은 함수 $y=f(x)$와 그 역함수 $y=f^{-1}(x)$의 그래프가 다음 조건을 모두 만족시킨다. 점 $A=(2,3)$이고, $3-f^{-1}(2)=7$이다. 이때 삼각형 $ABD$의 넓이를 구하시오. (단, $B$는 $A$의 대칭점이고, $C,D$는 각각 $y=f^{-1}(x)$와 $y=f(x)$ 위에서 $y=x$에 대한 서로 대응하는 점이다.) [4.4점]',
    },
  }]]),],
  ['original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js', new Map([[16, {
    disposition: 'APPROVED_REPLACEMENT_A',
    reason: '역함수 존재의 domain/codomain 누락을 실수 전체→실수 전체로 최소 정상화.',
    fields: {
      content: '두 실수 $a,b$와 두 함수 $f(x)=-x^2-2x+1$, $g(x)=x^2-2x-1$에 대하여 실수 전체에서 실수 전체로 정의된 함수 $h(x)$를 $h(x)=\\begin{cases}f(x)&(x\\lt a)\\\\g(x+b)&(x\\ge a)\\end{cases}$라 하자. 함수 $h$가 역함수를 갖도록 하는 $a,b$의 모든 순서쌍 $(a,b)$만을 원소로 하는 집합을 $A$라고 할 때, 다음 보기에서 옳은 것만을 있는 대로 고른 것은? [5.2점]<br>ㄱ. $n\\gt1$일 때, $(n,k)\\in A$를 만족시키는 실수 $k$는 존재하지 않는다.<br>ㄴ. $(-3,-4)\\in A$<br>ㄷ. 집합 $\\{m+l\\mid(m,l)\\in A$이고 $m,l$은 정수$\\}$의 모든 원소의 합은 4이다.',
    },
  }]]),],
  ['original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js', new Map([[17, {
    disposition: 'SOURCE_RESTORED_FROM_SOURCE_IMAGE',
    reason: 'q17 source image의 세 조건을 content에 충실하게 복원.',
    fields: {
      content: '집합 $A=\\{1,2,3,4\\}$, $B=\\{2,3,4,5\\}$에 대하여 함수 $f:A\\to B$, $g:B\\to A$가 다음 조건을 만족시킨다. (가) $f(3)=5$, $g(2)=3$이다. (나) 어떤 $x\\in B$에 대하여 $g(x)=x$이다. (다) 모든 $x\\in A$에 대하여 $(f\\circ g\\circ f)(x)=x+1$이다. $f(1)g(3)$의 값을 구하시오. [4.3점]',
    },
  }]]),],
  ['original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js', new Map([[17, {
    disposition: 'APPROVED_REPLACEMENT_A',
    reason: '저장 계산값 48을 포함하도록 선택지만 최소 교체하여 객관식 계약을 복구.',
    fields: {
      choices: ['$12$', '$24$', '$34$', '$38$', '$48$'],
      answer: '⑤',
      solution: '[키포인트] 양변에 $f$를 적용하면 $a$가 자기 자신으로 돌아오거나 다른 원소와 서로 바뀌는 두 경우로 나눌 수 있다.\\n조건 정리: $f$는 다섯 원소의 일대일대응이고 $f(f(a))=a$이다.\\n풀이 방향: $f(a)=a$인 경우와 $f(a)\\ne a$인 경우를 나누어 센다.\\n정석 풀이: $f(a)=a$이면 나머지 네 원소의 대응은 임의로 정할 수 있으므로 $4!=24$가지이다. $f(a)\\ne a$이면 $f(a)$가 될 원소를 네 개 중 하나로 고르고 그 원소는 다시 $a$로 가야 한다. 나머지 세 원소의 대응은 $3!$가지이므로 $4\\times3!=24$가지이다. 따라서 전체는 $24+24=48$가지이다. 따라서 정답은 ⑤이다.',
    },
  }]]),],
  ['original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', new Map([[1, {
    disposition: 'SOURCE_RESTORED_FROM_SOURCE_IMAGE',
    reason: 'q01 대응도식의 다섯 선택지를 text reconstruction으로 보존.',
    fields: {
      choices: ['도식 1', '도식 2', '도식 3', '도식 4', '도식 5'],
    },
  }]]),],
  ['original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js', new Map([[4, {
    disposition: 'SOURCE_RESTORED_FROM_SOURCE_IMAGE',
    reason: 'q04 그래프도식의 다섯 선택지를 faithful text reconstruction으로 보존.',
    fields: {
      choices: ['점 $(1,1),(2,2),(2,4),(3,1),(4,3)$', '위로 열린 V자 그래프', '좌측 직선, $x$축 위의 수평 선분, 우측 직선으로 이어지는 그래프', '$x$축 위쪽의 반원 그래프', '위로 열린 포물선 그래프'],
    },
  }]]),],
  ['original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js', new Map([[18, {
    disposition: 'APPROVED_REPLACEMENT_A',
    reason: '공집합 정의역 허용 여부를 최소 조건으로 명시하여 저장 해설의 69를 유효화.',
    fields: {
      content: '전체집합 $U=\\{a,b,c,d\\}$의 두 부분집합 $A$, $B$에 대하여 (단, $A$, $B$는 공집합이 아니다.) 함수 $f:A\\to B$가 일대일대응이 되도록 하는 집합 $A$, $B$의 순서쌍 $(A,B)$의 개수는? [4.8점]',
    },
  }]]),],
  ['original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js', new Map([[18, {
    disposition: 'APPROVED_REPLACEMENT_A',
    reason: '모든 실수 a에서 단일 r을 요구하던 결함을 a=1의 동일 solutionGraph 구조로 최소 정상화.',
    fields: {
      content: '$a=1$일 때 함수<br>$f(x)=\\dfrac{3x-5}{x-2}$<br>의 그래프와 중심이 $(2,3)$이고 반지름의 길이가 $r$인 원이 서로 다른 두 점에서 만날 때, $r$의 값은? [4.8점]',
      solution: '[키포인트] 유리함수를 점근선의 교점 기준으로 옮겨 원과의 교점 개수를 판정한다.\\n조건 정리: $f(x)=\\dfrac{3x-5}{x-2}=3+\\dfrac1{x-2}$이고 유리함수의 중심은 $(2,3)$이다.\\n풀이 방향: $X=x-2$, $Y=y-3$으로 좌표를 옮긴다.\\n정석 풀이: 유리함수는 $Y=\\dfrac1X$, 즉 $XY=1$이다. 원은 $X^2+Y^2=r^2$가 된다. $XY=1$인 점에서는 $X^2+Y^2\\ge2XY=2$이고, 등호는 $(X,Y)=(1,1),(-1,-1)$에서 성립한다. 따라서 $r^2<2$이면 교점이 없고, $r^2=2$이면 서로 다른 두 점에서 만나며, $r^2>2$이면 네 점에서 만난다. 그러므로 $r^2=2$, $r=\\sqrt2$이다. 따라서 정답은 ⑤이다.',
    },
  }]]),],
]);

function loadBank(sourceFile) {
  const filePath = path.join(ROOT, 'archive', 'exams', sourceFile.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
}

function objectRanges(text) {
  const arrayStart = text.indexOf('[', text.indexOf('window.questionBank'));
  const ranges = [];
  let depth = 0; let objectStart = -1; let inString = false; let escaped = false;
  for (let i = arrayStart + 1; i < text.length; i += 1) {
    const char = text[i];
    if (inString) { if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === '"') inString = false; continue; }
    if (char === '"') { inString = true; continue; }
    if (char === '{') { if (depth === 0) objectStart = i; depth += 1; }
    else if (char === '}') { depth -= 1; if (depth === 0) { ranges.push({ start: objectStart, end: i + 1, text: text.slice(objectStart, i + 1) }); objectStart = -1; } }
    else if (char === ']' && depth === 0) break;
  }
  return ranges;
}

function scanValueEnd(text, start) {
  const first = text[start];
  if (first === '"') {
    let escaped = false;
    for (let i = start + 1; i < text.length; i += 1) { if (escaped) escaped = false; else if (text[i] === '\\') escaped = true; else if (text[i] === '"') return i + 1; }
  }
  if (first === '[') {
    let depth = 0; let inString = false; let escaped = false;
    for (let i = start; i < text.length; i += 1) { const char = text[i]; if (inString) { if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === '"') inString = false; continue; } if (char === '"') { inString = true; continue; } if (char === '[') depth += 1; else if (char === ']' && --depth === 0) return i + 1; }
  }
  throw new Error(`unsupported JSON value at ${start}`);
}

function replaceField(objectText, field, value) {
  const marker = `"${field}"`;
  const key = objectText.indexOf(marker);
  if (key < 0) throw new Error(`field not found: ${field}`);
  const colon = objectText.indexOf(':', key + marker.length);
  let valueStart = colon + 1;
  while (/\s/.test(objectText[valueStart] || '')) valueStart += 1;
  const valueEnd = scanValueEnd(objectText, valueStart);
  const eol = objectText.includes('\r\n') ? '\r\n' : '\n';
  let encoded = JSON.stringify(value, null, Array.isArray(value) ? 2 : 0);
  if (Array.isArray(value)) encoded = encoded.split('\n').map((line, index) => index === 0 ? line : `    ${line}`).join(eol);
  return objectText.slice(0, valueStart) + encoded + objectText.slice(valueEnd);
}

function main() {
  const changes = [];
  for (const [sourceFile, byId] of fixes) {
    const sourcePath = path.join(ROOT, 'archive', 'exams', sourceFile.replaceAll('/', path.sep));
    const original = fs.readFileSync(sourcePath, 'utf8');
    let updated = original;
    const ranges = objectRanges(original);
    for (const [id, fix] of byId) {
      const range = ranges.find(candidate => Number(candidate.text.match(/"id"\s*:\s*(\d+)/)?.[1]) === Number(id));
      if (!range) throw new Error(`question not found: ${sourceFile} #${id}`);
      let objectText = range.text;
      for (const [field, value] of Object.entries(fix.fields)) objectText = replaceField(objectText, field, value);
      const changed = objectText !== range.text;
      changes.push({ qKey: `${sourceFile}_${id}`, disposition: fix.disposition, reason: fix.reason, fields: Object.keys(fix.fields), changed });
      if (changed) {
        updated = updated.slice(0, range.start) + objectText + updated.slice(range.end);
      }
    }
    if (updated !== original) fs.writeFileSync(sourcePath, updated, 'utf8');
  }
  const output = { reportType: 'FUNCTION_FAMILY_PINPOINT_EXCEPTION_FIXES_V1', generatedAt: new Date().toISOString(), status: 'PINPOINT_EXCEPTION_FIX_PASS', plannedExceptionRows: changes.length, appliedFieldChanges: changes.filter(row => row.changed).length, changes, approvedReplacementA: changes.filter(row => row.disposition === 'APPROVED_REPLACEMENT_A').length, sourceRestored: changes.filter(row => row.disposition === 'SOURCE_RESTORED_FROM_SOURCE_IMAGE').length, outOfScopeMutation: 0, note: 'Only the listed exception fields were changed. Existing unit, subunit, problem type, format, solutionGraph, decision count, and difficulty metadata were retained.' };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY, ['# 함수계열 기존 SOURCE_DATA_EXCEPTION 핀포인트 처리 v1', '', `- status: **${output.status}**`, `- planned exception rows: ${output.plannedExceptionRows}`, `- applied field changes in this run: ${output.appliedFieldChanges}`, `- APPROVED_REPLACEMENT_A: ${output.approvedReplacementA}`, `- source restored from image: ${output.sourceRestored}`, `- out-of-scope mutation: ${output.outOfScopeMutation}`, '', ...changes.map(row => `- ${row.qKey}: ${row.disposition} — ${row.fields.join(', ')} — ${row.changed ? 'changed' : 'already applied'}`), ''].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, plannedExceptionRows: output.plannedExceptionRows, appliedFieldChanges: output.appliedFieldChanges, approvedReplacementA: output.approvedReplacementA, sourceRestored: output.sourceRestored, outOfScopeMutation: output.outOfScopeMutation }, null, 2));
}

main();
