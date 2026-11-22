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

test('보기 칸이 그림뿐이면 그림이 곧 보기다: 순서 변경·다른 그림은 불일치, 해설만 변경은 일치', async () => {
  const imgs = ['<img src="q12_choice1.png">', '<img src="q12_choice2.png">', '<p><img src="q12_choice3.png"></p>'];
  const q = { content: '옳은 그래프는?', choices: imgs, solution: '해설' };
  assert.deepEqual(bindingPayload(q).choices, ['<img src="q12_choice1.png">', '<img src="q12_choice2.png">', '<p><img src="q12_choice3.png"></p>']);
  await differ(q, { ...q, choices: [imgs[1], imgs[0], imgs[2]] }, '순서 변경');
  await differ(q, { ...q, choices: [imgs[0], '<img src="other.png">', imgs[2]] }, '다른 그림');
  await differ(q, { ...q, choices: [imgs[0], imgs[1]] }, '개수');
  await same(q, { ...q, solution: '다른 해설', answer: '③', level: '상' }, '해설·정답·메타');
  await same(q, { ...q, choices: imgs.map((s) => ' ' + s + '\r\n') }, '공백·줄바꿈');
  // 맨 앞 ① 기호는 지우고 그림은 남긴다.
  await same(q, { ...q, choices: ['① <img src="q12_choice1.png">', '②<img src="q12_choice2.png">', '③ <p><img src="q12_choice3.png"></p>'] }, '기호');
  // 글자가 있는 보기에서는 기존 규칙대로 그림을 가린다.
  await same({ content: 'q', choices: ['① 가 <img src="a.png">'] }, { content: 'q', choices: ['가 <img src="b.png">'] });
});

test('보기가 전부 비었거나 기호뿐인데 문항에 그림이 있으면 그림을 지문에 넣는다', async () => {
  const q = { content: '그래프로 옳은 것은?', choices: ['①', '②', '③', '④', '⑤'], image: 'q3.png', solution: '해설' };
  const payload = bindingPayload(q);
  assert.deepEqual(payload.choices, ['', '', '', '', '']);
  assert.equal(payload.image, 'q3.png');
  assert.ok(!('stemMedia' in payload));
  await differ(q, { ...q, image: 'q3b.png' }, 'image 변경');
  await differ(q, { ...q, image: undefined, images: ['x.png'] }, 'images');
  await same(q, { ...q, solution: '다른 해설', answer: '②' }, '해설');
  // 그림이 없으면 기존대로(image·images를 지문에 넣지 않는다).
  const noImage = { content: '값은?', choices: ['①', '②', '③'] };
  assert.ok(!('image' in bindingPayload(noImage)) && !('stemMedia' in bindingPayload(noImage)));
  await same(noImage, { ...noImage, solution: '다른 해설' });
  await differ(noImage, { ...noImage, choices: ['①', '②'] }, '개수는 여전히 지문');
  // 빈 배열은 보기가 없는 서술형이므로 image를 넣지 않는다.
  assert.ok(!('image' in bindingPayload({ content: 'q', choices: [], image: 'a.png' })));
  // 발문 원문에 그림 태그가 있으면 그것도 지문에 넣는다.
  const inline = { content: '다음 그림에서 <img src="a.png"> 옳은 것은?', choices: ['', ''] };
  assert.equal(bindingPayload(inline).stemMedia, '다음 그림에서 <img src="a.png"> 옳은 것은?');
  await differ(inline, { ...inline, content: '다음 그림에서 <img src="b.png"> 옳은 것은?' }, '발문 속 그림');
  // 발문에 그림 태그가 없고 보기가 비었으면 stemMedia 없이 image만.
  assert.ok(!('stemMedia' in bindingPayload({ content: 'q', choices: ['①'], images: ['a.png'] })));
});

test('모양이 이상한 보기: 배열이 아니면 오류, 원소는 안정적으로 문자열화', async () => {
  assert.equal(bindingPayload({ content: 'q', choices: null }).choices, null);
  assert.equal(bindingPayload({ content: 'q', choices: undefined }).choices, null);
  assert.throws(() => bindingPayload({ content: 'q', choices: '① 1 ② 2' }), /choices/);
  assert.throws(() => bindingPayload({ content: 'q', choices: { 0: '1' } }), /choices/);
  await assert.rejects(() => bindingFingerprint({ content: 'q', choices: 'x' }), /choices/);
  await differ({ content: 'q', choices: [{ a: 1 }] }, { content: 'q', choices: [{ a: 2 }] }, '객체 원소');
  await same({ content: 'q', choices: [{ a: 1, b: [2, { d: 4, c: 3 }] }] }, { content: 'q', choices: [{ b: [2, { c: 3, d: 4 }], a: 1 }] }, '키 순서');
  await differ({ content: 'q', choices: [[1, 2]] }, { content: 'q', choices: [[2, 1]] }, '배열 원소');
  assert.deepEqual(bindingPayload({ content: 'q', choices: [3, true, null, undefined, 'x'] }).choices, ['3', 'true', '', '', 'x']);
});

test('닫히지 않은 <svg>·<figure>, 대문자 <IMG>, $p<q$ 같은 경계 규칙', async () => {
  await differ({ content: '<svg viewBox="0 0 1 1"> 처음 발문' }, { content: '<svg viewBox="0 0 1 1"> 바뀐 발문' }, '닫히지 않은 svg');
  await differ({ content: '<figure> 처음 발문' }, { content: '<figure> 바뀐 발문' }, '닫히지 않은 figure');
  await differ({ content: '그림 <picture> 처음 발문' }, { content: '그림 <picture> 바뀐 발문' }, '닫히지 않은 picture');
  await same({ content: '식 <IMG SRC="a.png"> 값은?' }, { content: '식 <IMG SRC="b.png" ALT="x"> 값은?' }, '대문자 IMG 교체');
  await same({ content: '식 <Img src="a.png"> 값은?' }, { content: '식 <img src="b.png"> 값은?' }, '대소문자 혼용');
  await differ({ content: '두 명제 $p<q$ 일 때' }, { content: '두 명제 $p<r$ 일 때' }, '$p<q$');
  await differ({ content: '$p<q$ 이고 $x>1$' }, { content: '$p<q$ 이고 $x>2$' }, '부등호 뒤 글자');
});
