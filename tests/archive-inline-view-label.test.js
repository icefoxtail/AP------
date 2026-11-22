const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
// normalizeViewBlocks 본문은 engine.html·mixed_engine.html이 같이 쓰는 render-text.js에 있다.
const engine = fs.readFileSync(path.join(root, 'archive', 'render-text.js'), 'utf8');
const protocol = fs.readFileSync(
  path.join(root, 'docs', 'rules', '02_PIPELINES', '코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md'),
  'utf8'
);

test('view blocks are recognized only at a string or line boundary', () => {
  // 구현 문자열이 아니라 동작을 본다: 줄 맨 앞의 [보기]는 박스가 되고, 발문 중간의 "[보기]에서"는 박스가 되지 않는다.
  const vm = require('node:vm');
  const context = { console };
  vm.createContext(context);
  vm.runInContext(engine, context, { filename: 'archive/render-text.js' });
  const body = 'ㄱ. 첫째 설명이 충분히 길어서 박스가 되어야 한다고 생각한다 ㄴ. 둘째 설명도 충분히 길게 쓰는 것이 필요하다고 본다 ㄷ. 셋째 설명';
  const boxed = context.APRenderText.normalizeViewBlocks('다음 물음에 답하시오.<br>[보기]<br>' + body);
  assert.ok(boxed.includes('<div class="question-note-box"><b>[보기]</b>'), '줄 맨 앞 [보기]는 박스가 되어야 한다');
  const inline = context.APRenderText.normalizeViewBlocks('다음 [보기]에서 옳은 것은? [보기] ' + body);
  assert.ok(!inline.includes('<b>[보기]</b>'), '발문 중간의 [보기]를 박스 제목으로 승격하면 안 된다');
});

test('archive has no inline bracketed view labels', () => {
  const result = spawnSync(process.execPath, ['archive/tools/view-label-lint.mjs', '--json'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout || result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.failures, 0);
});

test('lint follows the renderer block boundary and ignores ordinary inline references', async () => {
  const { findInlineViewLabels } = await import('../archive/tools/view-label-lint.mjs');
  const normalInline = [
    '다음 <보기>에서 옳은 것을 고르시오.',
    '다음 <보기> 중 옳은 것을 고르시오.',
    '옳은 것을 [보기]에서 고르시오.',
    '옳은 것을 &lt;보기&gt;에서 고르시오.'
  ];
  for (const content of normalInline) {
    assert.deepEqual(findInlineViewLabels(content), [], content);
  }

  const promotedAtBlockBoundary = [
    '<보기>에서 이 설명은 보기 블록 안의 긴 문장으로 렌더링되어 표지의 잘못된 위치를 찾게 한다. 조건과 결론을 포함하여 화면에서 박스 승격 여부를 검증하는 충분한 길이의 내용이다.',
    '발문\n<보기> 중 이 설명은 보기 블록 안의 긴 문장으로 렌더링되어 표지의 잘못된 위치를 찾게 한다. 조건과 결론을 포함하여 화면에서 박스 승격 여부를 검증하는 충분한 길이의 내용이다.',
    '발문<br><보기>에서 이 설명은 보기 블록 안의 긴 문장으로 렌더링되어 표지의 잘못된 위치를 찾게 한다. 조건과 결론을 포함하여 화면에서 박스 승격 여부를 검증하는 충분한 길이의 내용이다.',
    '발문<br />[보기]에서 이 설명은 보기 블록 안의 긴 문장으로 렌더링되어 표지의 잘못된 위치를 찾게 한다. 조건과 결론을 포함하여 화면에서 박스 승격 여부를 검증하는 충분한 길이의 내용이다.'
  ];
  for (const content of promotedAtBlockBoundary) {
    assert.equal(findInlineViewLabels(content).length, 1, content);
  }

  assert.deepEqual(findInlineViewLabels('<보기>에서 짧은 문장.'), []);

  // A div's own label stays inside its explicit authored box; its preceding
  // inline reference is not a block boundary and must not be flagged.
  assert.deepEqual(
    findInlineViewLabels('다음 <보기>에서 고르시오.<div class="box-content"><b><보 기></b></div>'),
    []
  );
});

test('protocol distinguishes inline words from standalone view labels', () => {
  assert.match(protocol, /INLINE VIEW LABEL LOCK/);
  assert.match(protocol, /조사가 붙어 문장 성분으로 쓰인 경우[^\n]*평문 `보기`/);
  assert.match(protocol, /node archive\/tools\/view-label-lint\.mjs/);
});
