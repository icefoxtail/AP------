// 학생 포털 서비스 워커: 시험지 문항 파일(archive/exams/*.js)은 네트워크 먼저(고치면 바로 반영), 못 받을 때만 캐시.
// 그림 등 다른 정적 파일의 캐시 먼저 동작은 그대로다. sw.js를 vm에서 실제로 돌려 확인한다(브라우저 SW 등록 없이).
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'apmath/student/sw.js'), 'utf8');

function makeWorker() {
  const handlers = {};
  const store = new Map();
  const net = { calls: [], bodies: new Map(), offline: false };
  const fakeResponse = (body) => ({ status: 200, type: 'basic', body, clone() { return fakeResponse(body); } });
  const caches = {
    open: async () => ({ put: async (req, res) => { store.set(req.url, res); }, addAll: async () => {} }),
    match: async (req) => store.get(typeof req === 'string' ? new URL(req, 'https://school.test/apmath/student/').href : req.url),
    keys: async () => [], delete: async () => true,
  };
  const sandbox = {
    self: { addEventListener: (name, fn) => { handlers[name] = fn; }, skipWaiting() {}, clients: { claim() {} } },
    caches, URL,
    fetch: async (req) => {
      const url = typeof req === 'string' ? req : req.url;
      net.calls.push(url);
      if (net.offline) throw new TypeError('offline');
      return fakeResponse(net.bodies.get(url) ?? 'default');
    },
  };
  vm.runInNewContext(source, sandbox);
  const request = (url) => ({ url, method: 'GET', mode: 'cors', destination: '', headers: {} });
  const ask = async (url) => {
    let answer;
    handlers.fetch({ request: request(url), respondWith: (promise) => { answer = promise; } });
    const response = await answer;
    return response?.body;
  };
  return { net, store, ask };
}

const EXAM = 'https://school.test/AP------/archive/exams/original/high/h1/1mid/25_%EA%B0%80%EA%B3%A0_%EA%B8%B0%EC%B6%9C.js';
const IMAGE = 'https://school.test/AP------/archive/assets/images/x/q1.png';

test('시험지 문항 파일은 캐시에 있어도 네트워크를 먼저 부르고 고쳐진 새 내용을 돌려준다', async () => {
  const w = makeWorker();
  w.net.bodies.set(EXAM, 'V1');
  assert.equal(await w.ask(EXAM), 'V1');
  w.net.bodies.set(EXAM, 'V2'); // 서버에서 시험지를 고침
  assert.equal(await w.ask(EXAM), 'V2', '한 번 받은 시험지가 새 내용으로 바뀐다');
  assert.equal(w.net.calls.filter((url) => url === EXAM).length, 2, '두 번 다 네트워크를 불렀다');
});

test('네트워크를 못 쓰면(오프라인) 마지막으로 받은 시험지를 캐시에서 돌려준다', async () => {
  const w = makeWorker();
  w.net.bodies.set(EXAM, 'V1');
  assert.equal(await w.ask(EXAM), 'V1');
  w.net.offline = true;
  assert.equal(await w.ask(EXAM), 'V1');
});

test('?v= 가 붙은 시험지 요청도 같은 규칙, 그림 같은 다른 정적 파일은 캐시 먼저 그대로', async () => {
  const w = makeWorker();
  w.net.bodies.set(EXAM + '?v=abc', 'V1');
  assert.equal(await w.ask(EXAM + '?v=abc'), 'V1');
  w.net.bodies.set(EXAM + '?v=abc', 'V2');
  assert.equal(await w.ask(EXAM + '?v=abc'), 'V2');
  w.net.bodies.set(IMAGE, 'IMG1');
  assert.equal(await w.ask(IMAGE), 'IMG1');
  w.net.bodies.set(IMAGE, 'IMG2');
  const before = w.net.calls.length;
  assert.equal(await w.ask(IMAGE), 'IMG1', '그림은 이전처럼 캐시 먼저');
  assert.equal(w.net.calls.length, before, '그림은 네트워크를 부르지 않는다');
});
