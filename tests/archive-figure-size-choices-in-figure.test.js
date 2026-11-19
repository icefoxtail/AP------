const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { choicesAreFigure } = require(path.join(__dirname, '..', 'archive', 'figure-size.js'));

const base = { questionType: '객관식', answer: '③', content: '다음 중 함수의 그래프인 것은?', image: 'assets/images/x/q01.png' };

test('보기 칸이 비었고 답이 ①~⑤ 꼴이며 그림이 있으면 보기가 그림 안에 든 문항이다', () => {
  assert.equal(choicesAreFigure({ ...base, choices: [] }), true);
  assert.equal(choicesAreFigure({ ...base, choices: undefined }), true);
  assert.equal(choicesAreFigure({ ...base, answer: '①, ④', choices: [] }), true);
  assert.equal(choicesAreFigure({ ...base, image: undefined, content: '그래프 <img src="a.png" alt="①②">는?', choices: [] }), true);
});

test('서술형·단답형(답이 ①~⑤ 꼴이 아님)은 거짓이다', () => {
  assert.equal(choicesAreFigure({ ...base, answer: '12', choices: [] }), false);
  assert.equal(choicesAreFigure({ ...base, answer: 'ㄱ, ㄹ', choices: [] }), false);
  assert.equal(choicesAreFigure({ ...base, questionType: '서술형', choices: [] }), false);
  assert.equal(choicesAreFigure({ ...base, answer: '', choices: [] }), false);
});

test('보기가 글자로 있으면 거짓이다', () => {
  assert.equal(choicesAreFigure({ ...base, choices: ['1', '2', '3', '4', '5'] }), false);
  assert.equal(choicesAreFigure({ ...base, choices: ['x'] }), false);
  assert.equal(choicesAreFigure({ ...base, content: '다음 중 옳은 것은? ① 가 ② 나 ③ 다', choices: [] }), false);
});

test('그림이 없으면 거짓이다', () => {
  assert.equal(choicesAreFigure({ ...base, image: undefined, choices: [] }), false);
});

test('기존 판정은 그대로다: 기호뿐인 보기 + 그림, choicesEmbeddedInImage', () => {
  assert.equal(choicesAreFigure({ ...base, answer: '3', choices: ['①', '②', '③', '④', '⑤'] }), true);
  assert.equal(choicesAreFigure({ answer: '3', content: 'q', choices: ['①', '②', '③', '④', '⑤'] }), false);
  assert.equal(choicesAreFigure({ answer: '3', content: 'q', choicesEmbeddedInImage: true, choices: [] }), true);
});
