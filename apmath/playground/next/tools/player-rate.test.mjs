// 공통 원클릭 재생 속도 회귀 검사: 실제 재생기의 기본 속도·느리게 전환·프레임 시간
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const playerSource = fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8');

function makePlayer() {
  const sandbox = {
    window: { APLab: { videoCore: {}, h: () => ({}), icon: () => '', labHooks: [] } },
    location: { search: '', hash: '' },
    URLSearchParams,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {}
  };
  vm.runInNewContext(playerSource, sandbox, { filename: 'apl-player.js' });
  const Player = sandbox.window.APLab.Player;
  assert.equal(typeof Player, 'function', 'real player class is registered');
  // Constructor를 실행하되 실제 DOM은 건드리지 않는 작은 하네스.
  for (const method of ['_build', '_wrap', '_bind', '_syncEntry']) Player.prototype[method] = () => {};
  Player.prototype._readExplored = () => false;
  return new Player({ teach: true });
}

test('원클릭 영상/해설 기본 2배, 느리게 1배 후 다시 2배로 복귀', () => {
  const player = makePlayer();
  assert.equal(player.rate, 2, 'every new player defaults to 2x');
  const attrs = {}, classes = {};
  player.ui = { slow: {
    setAttribute: (name, val) => { attrs[name] = val; },
    classList: { toggle: (name, on) => { classes[name] = on; } },
    innerHTML: ''
  } };
  player.setRate(1);
  assert.equal(player.rate, 1);
  assert.equal(attrs['aria-pressed'], 'true');
  assert.equal(classes.on, true);
  assert.match(player.ui.slow.innerHTML, /1배/);
  assert.equal(player.ui.slow.title, '기본 속도로 보기 (2배)');
  player.setRate(2);
  assert.equal(player.rate, 2);
  assert.equal(attrs['aria-pressed'], 'false');
  assert.equal(classes.on, false);
  assert.match(player.ui.slow.innerHTML, /느리게/);
  assert.equal(player.ui.slow.title, '천천히 보기 (1배)');
  assert.match(playerSource, /this\.setRate\(this\.rate === DEFAULT_PLAYBACK_RATE \? SLOW_PLAYBACK_RATE : DEFAULT_PLAYBACK_RATE\)/,
    'slow toggle returns to the true 2x default');
});

test('시간 진행 0.1초 → 기본 0.2초, 느리게 0.1초; 화면 공개 타임라인 동기화', () => {
  const player = makePlayer();
  let applied = 0;
  player.ui = { slow: {
    setAttribute: () => {}, classList: { toggle: () => {} }, innerHTML: ''
  } };
  player.state = 'playing';
  player.cs = { length: 12 };
  player._last = 1000;
  player._tick = () => {};
  player.apply = () => { applied += 1; };
  player._frame(1100);
  assert.ok(Math.abs(player.t - 0.2) < 1e-9, `default timeline advance ${player.t}`);
  player.setRate(1);
  player._frame(1200);
  assert.ok(Math.abs(player.t - 0.3) < 1e-9, `slow timeline advance ${player.t}`);
  assert.equal(applied, 2, 'every timeline advance redraws current figure and caption');
});
