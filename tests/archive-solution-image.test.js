const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const wrongPrintEngine = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');
const audit = fs.readFileSync(path.join(root, '.codex', 'skills', 'apmath-archive-exams', 'scripts', 'audit_archive_batch.mjs'), 'utf8');
const layout = fs.readFileSync(path.join(root, '.codex', 'skills', 'apmath-archive-exams', 'references', 'archive-layout.md'), 'utf8');

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} should be defined`);
  const nextFunction = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, nextFunction === -1 ? source.length : nextFunction);
}

function executeFunctions(source, names, globals = {}) {
  const context = vm.createContext({
    ...globals,
    encodeURIComponent,
    String
  });
  vm.runInContext(names.map(name => extractFunction(source, name)).join('\n'), context);
  return context;
}

function solutionMetaMarkup(answer, solutionImageHtml, solutionHtml) {
  return `<div class="sol-meta"><div class="sol-ans">[정답] ${answer}</div>${solutionImageHtml}<div class="sol-exp">${solutionHtml}</div></div>`;
}

function solutionMetaChildClasses(markup) {
  return [...markup.matchAll(/<[^/][^>]*\bclass="([^"]+)"[^>]*>/g)]
    .map(match => match[1])
    .filter(className => /(?:^|\s)sol-(?:ans|image-wrap|exp)(?:\s|$)/.test(className));
}

function makeSolutionBoxStub() {
  let html = '<div class="sol-meta"><div class="sol-ans">[정답] ③</div><span class="sol-image-wrap image-large"></span><div class="sol-exp">본문</div></div>';
  let exp = { innerHTML: '본문' };
  const shell = {
    classList: { add() {} },
    cloneNode() {
      return makeSolutionBoxStub();
    },
    querySelector(selector) {
      return selector === '.sol-exp' ? exp : null;
    },
    get innerHTML() {
      return html;
    },
    set innerHTML(value) {
      html = value;
      exp = { innerHTML: '' };
    }
  };
  return shell;
}

for (const [name, source] of [['engine', engine], ['mixed engine', mixedEngine]]) {
  const renderer = executeFunctions(source, [
    'withArchiveAssetCacheBuster',
    'escapeArchiveHtmlAttribute',
    'renderQuestionImageHTML',
    'renderSolutionImageHTML',
    'makeLongSolutionShell'
  ], { ARCHIVE_ASSET_CACHE_VERSION: 'test' });

  const expectedSizeClass = new Map([
    ['small', 'image-small'],
    ['medium', 'image-medium'],
    ['large', 'image-large'],
    ['full', 'image-full'],
    ['invalid', 'image-medium'],
    [undefined, 'image-medium']
  ]);

  const dataSvgImage = renderer.renderQuestionImageHTML({
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="10" height="10"%3E%3C/svg%3E',
    imageSize: 'medium'
  });
  assert.match(dataSvgImage, /q-image-wrap image-medium/);
  assert.match(dataSvgImage, /src="data:image\/svg\+xml,%3Csvg xmlns=&quot;http:\/\/www\.w3\.org\/2000\/svg&quot;/,
    `${name} should escape quotes inside data-SVG problem-image URLs`);

  for (const [size, expectedClass] of expectedSizeClass) {
    const rendered = renderer.renderSolutionImageHTML({
      id: 7,
      solutionImage: 'assets/images/fixture/q07-solution.svg',
      solutionImageAlt: '실행형 대체 텍스트',
      solutionImageCaption: '실행형 캡션',
      solutionImageSize: size
    });
    assert.match(rendered, new RegExp(`sol-image-wrap ${expectedClass}`), `${name} should normalize ${String(size)} size at runtime`);
    assert.match(rendered, /alt="실행형 대체 텍스트"/, `${name} should escape and render alternative text at runtime`);
    assert.equal((rendered.match(/sol-image-caption/g) || []).length, 1, `${name} should render one caption at runtime`);
  }

  const withImage = renderer.renderSolutionImageHTML({
    id: 3,
    solutionImage: 'assets/images/fixture/q03-solution.svg',
    solutionImageSize: 'large',
    solutionImageCaption: '캡션'
  });
  const withImageMarkup = solutionMetaMarkup('③', withImage, '본문');
  assert.deepStrictEqual(
    solutionMetaChildClasses(withImageMarkup),
    ['sol-ans', 'sol-image-wrap image-large', 'sol-exp'],
    `${name} executable renderer output should place answer, image, then body`
  );

  const withoutImage = renderer.renderSolutionImageHTML({ id: 3 });
  const withoutImageMarkup = solutionMetaMarkup('③', withoutImage, '본문');
  assert.deepStrictEqual(
    solutionMetaChildClasses(withoutImageMarkup),
    ['sol-ans', 'sol-exp'],
    `${name} executable renderer output should omit an optional solution image`
  );
  assert.equal(withoutImage, '', `${name} should keep solution images optional at runtime`);

  const captionless = renderer.renderSolutionImageHTML({
    id: 8,
    solutionImage: 'assets/images/fixture/q08-solution.png',
    solutionImageSize: 'medium'
  });
  assert.equal((captionless.match(/sol-image-caption/g) || []).length, 0, `${name} should omit a missing caption at runtime`);

  const continuation = renderer.makeLongSolutionShell(makeSolutionBoxStub(), 1, true);
  assert.match(continuation.innerHTML, /^<div class="sol-meta"><div class="sol-exp"><\/div><\/div>$/, `${name} continuation shell should contain only solution text`);
  assert.doesNotMatch(continuation.innerHTML, /sol-image-wrap|sol-ans/, `${name} continuation shell should repeat neither answer nor solution image`);

  assert.match(source, /box\.dataset\.solutionHtml = solutionHtml;/, `${name} should retain only solution text as split input`);
  assert.match(source, /<div class="sol-ans">\[정답\][\s\S]{0,240}\$\{solutionImageHtml\}[\s\S]{0,240}<div class="sol-exp">\$\{solutionHtml\}<\/div>/, `${name} should install executable renderer output in answer-image-body order`);
  assert.doesNotMatch(source, /formatSolutionHtml\((?:solutionText|solText)\) \+ renderSolutionImageHTML\(q\)/, `${name} should not append a solution image after solution text`);
  assert.match(source, /\.sol-image-wrap img/, `${name} should constrain solution images in print layout`);
}

const wrongPrintRenderer = executeFunctions(wrongPrintEngine, [
  'normalizeArchiveFile',
  'withArchiveAssetCacheBuster',
  'resolveArchiveAssetUrl',
  'getQuestionArchiveFile',
  'escapeHtml',
  'renderSolutionImageHTML',
  'makeLongSolutionShell'
], {
  ARCHIVE_BASE_URL: 'https://archive.example/archive/',
  ARCHIVE_ASSET_CACHE_VERSION: 'test'
});

for (const [src, expectedSuffix] of [
  ['assets/images/foo/q01-solution.svg', 'assets/images/foo/q01-solution.svg?v=test'],
  ['assets/images/foo/q01-solution.png', 'assets/images/foo/q01-solution.png?v=test']
]) {
  const url = wrongPrintRenderer.resolveArchiveAssetUrl(src, 'exams/original/high/h1/1mid/source.js');
  assert.equal(url, `https://archive.example/archive/${expectedSuffix}`, `wrong print should resolve ${src} against archive root at runtime`);
}

const wrongPrintImage = wrongPrintRenderer.renderSolutionImageHTML({
  id: 4,
  _sourceArchiveFile: 'exams/original/high/h1/1mid/source.js',
  solutionImage: 'assets/images/foo/q04-solution.png',
  solutionImageAlt: 'PNG 해설 이미지',
  solutionImageCaption: 'PNG 캡션',
  solutionImageSize: 'large'
});
assert.deepStrictEqual(
  solutionMetaChildClasses(solutionMetaMarkup('③', wrongPrintImage, '본문')),
  ['sol-ans', 'sol-image-wrap image-large', 'sol-exp'],
  'wrong print executable renderer output should place answer, image, then body'
);
assert.match(wrongPrintImage, /q04-solution\.png\?v=test/, 'wrong print should retain PNG solution-image paths');
assert.equal((wrongPrintImage.match(/sol-image-caption/g) || []).length, 1, 'wrong print should render a caption at runtime');
assert.equal(wrongPrintRenderer.renderSolutionImageHTML({ id: 4 }), '', 'wrong print should keep solution images optional at runtime');
const wrongPrintContinuation = wrongPrintRenderer.makeLongSolutionShell(makeSolutionBoxStub(), true);
assert.match(wrongPrintContinuation.innerHTML, /^<div class="sol-meta"><div class="sol-exp"><\/div><\/div>$/, 'wrong print continuation shell should contain only solution text');
assert.doesNotMatch(wrongPrintContinuation.innerHTML, /sol-image-wrap|sol-ans/, 'wrong print continuation shell should repeat neither answer nor solution image');
assert.match(wrongPrintEngine, /resolveArchiveAssetUrl\(q\.solutionImage, getQuestionArchiveFile\(q\)\)/, 'wrong print should invoke the archive resolver for solution images');
assert.match(wrongPrintEngine, /\.sol-image-wrap img/, 'wrong print should constrain solution images in print layout');

assert(audit.includes('missing solution image'), 'archive audit should reject missing solution-image assets');
assert(layout.includes('solutionImageSize') && layout.includes('rendered only in solution mode'), 'archive authoring contract should document the solution-only image fields');

console.log('archive solution image contract checks passed');
