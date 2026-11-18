import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const reader = require('../archive/exam-source-reader.js');
const binding = require('../archive/question-binding.js');
const { normalizeBindingText, bindingPayload, bindingSerialize, bindingFingerprint } = binding;

const base = () => ({
  content: '다음 식의 값을 구하시오. 2x+3',
  choices: ['① 1', '② 2', '③ 3', '④ 4', '⑤ 5'],
  answer: '③',
  solution: '2x+3에 대입한다.',
  image: 'figs/a.png',
});

const same = async (a, b, message) => assert.equal(await bindingFingerprint(a), await bindingFingerprint(b), message);
const differ = async (a, b, message) => assert.notEqual(await bindingFingerprint(a), await bindingFingerprint(b), message);

test('readStemForBinding: content → question → stem 순서로 비어 있지 않은 문자열을 고른다', () => {
  assert.equal(reader.readStemForBinding({ content: 'C', question: 'Q', stem: 'S' }), 'C');
  assert.equal(reader.readStemForBinding({ content: '', question: 'Q', stem: 'S' }), 'Q');
  assert.equal(reader.readStemForBinding({ content: '  ', question: null, stem: 'S' }), 'S');
  assert.equal(reader.readStemForBinding({ content: 7, question: 'Q' }), 'Q');
  assert.equal(reader.readStemForBinding({}), '');
  assert.equal(reader.readStemForBinding(null), '');
  // 기존 내보내기는 그대로다.
  assert.equal(reader.readQuestionBody({ question: 'Q', stem: 'S' }), 'Q');
  assert.equal(typeof reader.readQuestionArray, 'function');
  assert.equal(typeof reader.readExamTitle, 'function');
  assert.ok(Array.isArray(reader.SOURCE_GLOBALS));
});

test('발문 한 글자 변경은 불일치', async () => {
  await differ(base(), { ...base(), content: '다음 식의 값을 구하시오. 2x+4' });
});

test('보기 한 글자·순서·개수 변경은 불일치', async () => {
  await differ(base(), { ...base(), choices: ['① 1', '② 2', '③ 3', '④ 4', '⑤ 6'] }, '한 글자');
  await differ(base(), { ...base(), choices: ['② 2', '① 1', '③ 3', '④ 4', '⑤ 5'] }, '순서');
  await differ(base(), { ...base(), choices: ['① 1', '② 2', '③ 3', '④ 4'] }, '개수');
  await differ(base(), { ...base(), choices: undefined }, '보기 유무');
});

test('해설·정답·그림·다른 메타가 바뀌어도 일치', async () => {
  const b = base();
  await same(b, { ...b, solution: '완전히 다른 해설' }, '해설');
  await same(b, { ...b, answer: '④' }, '정답');
  await same(b, { ...b, image: 'figs/b.png' }, 'image');
  await same(b, { ...b, images: ['x.png', 'y.png'] }, 'images');
  await same(b, { ...b, solutionImage: 'sol.svg' }, 'solutionImage');
  await same(b, { ...b, figureSvg: '<svg viewBox="0 0 1 1"></svg>' }, 'figureSvg');
  await same(b, { ...b, level: '상', standardUnitKey: 'U1', problemTypeKey: 'PT_X', anything: { nested: [1, 2] } }, '메타 필드');
});

test('발문이 question 필드뿐인 문항에서 한 글자 변경은 불일치', async () => {
  const q = { question: '원의 반지름이 3일 때 넓이를 구하시오.', choices: ['① 6', '② 9'] };
  await differ(q, { ...q, question: '원의 반지름이 4일 때 넓이를 구하시오.' });
  assert.equal(bindingPayload(q).stem, '원의 반지름이 3일 때 넓이를 구하시오.');
  const stemOnly = { stem: '스템 필드 발문' };
  await differ(stemOnly, { stem: '스템 필드 발문!' });
});

test('같은 글을 content와 question 사이로 옮겨도 일치', async () => {
  const text = '두 점 A, B 사이의 거리를 구하시오.';
  const choices = ['① 1', '② 2'];
  await same({ content: text, choices }, { question: text, choices });
  await same({ content: text, choices }, { stem: text, choices });
  await same({ content: text, question: '다른 필드', choices }, { content: text, choices });
});

test('공백·CRLF·<br>과 줄바꿈 차이는 일치', async () => {
  const a = { content: '첫째 줄\n둘째  줄', choices: ['① 가', '② 나'] };
  await same(a, { ...a, content: '  첫째 줄\r\n둘째 줄\t' }, '공백·CRLF');
  await same(a, { ...a, content: '첫째 줄<br>둘째 줄' }, '<br>');
  await same(a, { ...a, content: '첫째 줄<br/>둘째 줄' }, '<br/>');
  await same(a, { ...a, content: '첫째 줄<BR />둘째 줄' }, '<BR />');
  // NFC: 조합형 한글 자모는 완성형과 같다.
  await same({ content: '한' }, { content: '한' });
});

test('발문 안의 그림 태그 교체·제거는 일치', async () => {
  const withImg = { content: '<p>그림과 같이 삼각형이 있다.</p><p><img src="a.png" alt="그림 A"></p>', choices: ['① 1', '② 2'] };
  await same(withImg, { ...withImg, content: '<p>그림과 같이 삼각형이 있다.</p><p><img src="b.png" alt="다른 설명" width="200"></p>' }, 'img 교체');
  await same(withImg, { ...withImg, content: '<p>그림과 같이 삼각형이 있다.</p>' }, '<p><img></p> 통째 제거');
  await same(withImg, { ...withImg, content: '<p>그림과 같이 삼각형이 있다.</p><p><img src="x>y.png"></p>' }, '속성 값 안의 >');
  await same(withImg, { ...withImg, content: '<p>그림과 같이 삼각형이 있다.</p><svg viewBox="0 0 9 9"><path d="M0 0L9 9"/></svg>' }, 'svg로 교체');
  await same(withImg, { ...withImg, content: '<p>그림과 같이 삼각형이 있다.</p><figure><img src="c.png"><figcaption>설명</figcaption></figure>' }, 'figure로 교체');
  await same(withImg, { ...withImg, content: '<p>그림과 같이 삼각형이 있다.</p><picture><source srcset="d.webp"><img src="d.png"></picture>' }, 'picture로 교체');
  await differ(withImg, { ...withImg, content: '<p>그림과 같이 사각형이 있다.</p><p><img src="a.png"></p>' }, '그림 밖의 글자는 지문에 든다');
});

test('수식의 a<b, x<3은 지워지지 않아 발문 수정이 드러난다', async () => {
  const q = { content: 'a<b 이고 x<3 일 때 a+x 의 최댓값은?', choices: ['① 1', '② 2'] };
  await differ(q, { ...q, content: 'a<b 이고 x<4 일 때 a+x 의 최댓값은?' });
  await differ(q, { ...q, content: 'a<c 이고 x<3 일 때 a+x 의 최댓값은?' });
  const text = normalizeBindingText(q.content);
  assert.ok(text.includes('<b'), text);
  assert.ok(text.includes('<3'), text);
  // 그림 태그가 섞여 있어도 수식은 남는다.
  assert.equal(normalizeBindingText('x<3 <img src="a.png"> y>2'), 'x<3 y>2');
});

test('보기 앞의 ① 기호는 지우고, 1.5 같은 숫자는 그대로 둔다', async () => {
  const withMark = { content: '값은?', choices: ['① 1.5', '② 2.5'] };
  await same(withMark, { content: '값은?', choices: ['1.5', '2.5'] });
  await same(withMark, { content: '값은?', choices: ['①1.5', '②  2.5'] });
  assert.deepEqual(bindingPayload(withMark).choices, ['1.5', '2.5']);
  assert.deepEqual(bindingPayload({ content: 'q', choices: ['1) 가', '(2) 나', '3. 다'] }).choices, ['1) 가', '(2) 나', '3. 다']);
  // 한 개만 지운다.
  assert.deepEqual(bindingPayload({ content: 'q', choices: ['①②'] }).choices, ['②']);
  assert.equal(bindingPayload({ content: 'q' }).choices, null);
});

test('choicesEmbeddedInImage 문항은 image·images 변경이 불일치', async () => {
  const q = { content: '보기에서 옳은 것은?', choicesEmbeddedInImage: true, image: 'choices-a.png' };
  await differ(q, { ...q, image: 'choices-b.png' }, 'image');
  await differ(q, { ...q, images: ['x.png'] }, 'images');
  await differ(q, { content: q.content, sourcePayload: { choicesEmbeddedInImage: true }, image: 'choices-b.png' }, 'sourcePayload 쪽 표시');
  const viaPayload = { content: q.content, sourcePayload: { choicesEmbeddedInImage: true }, image: 'choices-a.png' };
  await same(q, viaPayload, '표시 위치만 다르면 일치');
  // 표시가 없으면 그림은 지문에 들지 않는다.
  await same({ content: q.content, image: 'a.png' }, { content: q.content, image: 'b.png' });
  await same({ ...q, solution: '해설' }, { ...q, solution: '다른 해설' }, '해설은 여전히 무관');
});

test('발문 필드가 전부 비면 명시적 오류', async () => {
  for (const q of [{}, { content: '', question: '', stem: '' }, { content: '   ', choices: ['① 1'] }, { content: 7 }]) {
    assert.throws(() => bindingPayload(q), /발문/);
    await assert.rejects(() => bindingFingerprint(q), /발문/);
  }
  assert.throws(() => bindingPayload(null), /문항/);
});

test('직렬화는 키 순서가 고정되고 버전이 text-v1이다', () => {
  assert.equal(binding.VERSION, 'text-v1');
  assert.equal(bindingSerialize({ choices: ['① b'], content: 'a', zzz: 1 }), '{"v":"text-v1","stem":"a","choices":["b"]}');
  assert.equal(
    bindingSerialize({ content: 'a', choices: ['① b'], choicesEmbeddedInImage: true, images: [{ z: 1, a: 2 }], image: 'p.png' }),
    '{"v":"text-v1","stem":"a","choices":["b"],"image":"p.png","images":[{"a":2,"z":1}]}');
});

// 골든 벡터: 고정 입력 → 고정 직렬화 → 고정 SHA-256(hex). 브라우저(Web Crypto)와 node(crypto)가 같은 값을 내야 한다.
const GOLDEN = [
  {
    name: '기본 객관식',
    question: { content: '다음 식의 값을 구하시오.', choices: ['① 1', '② 2', '③ 3'], answer: '②', solution: '해설' },
    serialized: '{"v":"text-v1","stem":"다음 식의 값을 구하시오.","choices":["1","2","3"]}',
  },
  {
    name: '중등: question 필드 + 그림 태그 + 부등호 + br',
    question: { question: '<p>a<b 일 때</p><br><p><img src="a.png"></p>\r\n값은?', choices: null },
    serialized: '{"v":"text-v1","stem":"<p>a<b 일 때</p>값은?","choices":null}',
  },
  {
    name: '보기가 그림 안에 든 문항',
    question: { stem: '옳은 것은?', choicesEmbeddedInImage: true, image: 'c.png', images: ['c.png', 'd.png'] },
    serialized: '{"v":"text-v1","stem":"옳은 것은?","choices":null,"image":"c.png","images":["c.png","d.png"]}',
  },
];

test('골든 벡터: 직렬화와 SHA-256이 고정값이고 node crypto와 같다', async () => {
  const expectedHashes = [];
  for (const g of GOLDEN) {
    assert.equal(bindingSerialize(g.question), g.serialized, g.name);
    const viaNode = createHash('sha256').update(g.serialized, 'utf8').digest('hex');
    assert.equal(await bindingFingerprint(g.question), viaNode, g.name);
    expectedHashes.push(viaNode);
  }
  assert.deepEqual(expectedHashes, GOLDEN_HASHES);
});

const GOLDEN_HASHES = [
  '272f768f7596d1e20a43399c66be62f5bc84467f40301f4dfb36a7bf6bac1bc3',
  '4f80008be4d65feef87eb2bdf78c18b93be58bb68b8ee83d166315465fba11c8',
  'd949b3d17937a406e258ed681015bf522a8cecdddcc17d9f5420a242e98482b9',
];

test('발문이 그림뿐이면 그림이 곧 문제다: 그림 src·image 변경은 불일치, 해설 변경은 일치', async () => {
  const q = { content: '<p><img src="a.png"></p>', choices: ['① 1', '② 2'], solution: '해설', image: 'a-fig.png' };
  assert.equal(bindingPayload(q).stem, '');
  assert.equal(bindingPayload(q).stemMedia, '<p><img src="a.png"></p>');
  await differ(q, { ...q, content: '<p><img src="b.png"></p>' }, '인라인 그림 src');
  await differ(q, { ...q, image: 'b-fig.png' }, 'image');
  await differ(q, { ...q, images: ['x.png'] }, 'images');
  await same(q, { ...q, solution: '완전히 다른 해설', answer: '②', level: '상' }, '해설·정답·메타');
  await same({ ...q, content: '<p> <img src="a.png"> </p>' }, { ...q, content: '\n<p>  <img src="a.png">\r\n</p>  ' }, '공백·줄바꿈 차이');
  await same(q, { ...q, content: '', question: '<p><img src="a.png"></p>' }, 'question 필드로 이동');
  assert.equal(bindingSerialize(q),
    '{"v":"text-v1","stem":"","stemMedia":"<p><img src=\\"a.png\\"></p>","choices":["1","2"],"image":"a-fig.png","images":null}');
});

test('발문에 글자가 한 자라도 있으면 기존 규칙대로 그림을 가린다', async () => {
  const q = { content: '<p>그림을 보시오.</p><p><img src="a.png"></p>', choices: ['① 1', '② 2'], image: 'a-fig.png' };
  const p = bindingPayload(q);
  assert.equal(p.stem, '<p>그림을 보시오.</p>');
  assert.ok(!('stemMedia' in p) && !('image' in p) && !('images' in p));
  await same(q, { ...q, content: '<p>그림을 보시오.</p><p><img src="b.png"></p>', image: 'b-fig.png' });
  await same({ content: '.', choices: null }, { content: '.<img src="a.png">', choices: null, image: 'z.png' });
});
