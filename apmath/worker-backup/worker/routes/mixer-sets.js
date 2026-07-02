import { makeId } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

// 믹서(archive/mixer.html) 출력물의 localStorage 핸드오프를 대체하는 서버 저장 (엔진 통합 Phase 4).
// 오답 클리닉(wrong-clinics.js)의 packet/set 패턴을 단순화한 버전 — 배포 대상/권한 모델 없이
// "임의 문항 배열 + 메타"를 불투명 키로 저장/조회만 한다. 생성은 의도적으로 비로그인도 허용한다
// (기존 믹서 "일반 시험지 출력"이 로그인 없이도 동작했던 것과 동일한 UX를 유지하기 위함).
const ROUTE = 'mixer-sets';
const MAX_QUESTIONS = 300;
const MAX_PAYLOAD_BYTES = 600000; // JSON 문자열 기준 대략 상한 (D1 텍스트 컬럼/응답 크기 감안)

function text(value, fallback = '') {
  const raw = value === undefined || value === null ? fallback : value;
  return String(raw ?? '').trim();
}

function safeJson(value, fallback = null) {
  if (value === undefined) return JSON.stringify(fallback);
  try {
    return JSON.stringify(value ?? fallback);
  } catch (e) {
    return JSON.stringify(fallback);
  }
}

function parseJson(value, fallback = null) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function ok(data = {}) {
  return jsonResponse({ success: true, ...data });
}

function fail(message, status = 400, extra = {}) {
  return jsonResponse({ success: false, message, ...extra }, status);
}

function randomKey(prefix) {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `${prefix}_${out}`;
}

async function ensureMixerSetsTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS mixer_sets (
      id TEXT PRIMARY KEY,
      public_key TEXT UNIQUE NOT NULL,
      title TEXT,
      qpp INTEGER,
      question_count INTEGER,
      questions_json TEXT NOT NULL,
      meta_json TEXT,
      created_by TEXT,
      created_by_name TEXT,
      created_at TEXT DEFAULT (datetime('now', '+9 hours')),
      status TEXT DEFAULT 'active'
    )
  `).run();
}

async function createMixerSet(request, env, teacher) {
  const body = await request.json().catch(() => ({}));
  const questions = Array.isArray(body.questions) ? body.questions : [];
  if (!questions.length) return fail('저장할 문항이 없습니다.');
  if (questions.length > MAX_QUESTIONS) return fail(`문항 수가 너무 많습니다(최대 ${MAX_QUESTIONS}개).`);

  const meta = (body.meta && typeof body.meta === 'object') ? body.meta : {};
  const questionsJson = safeJson(questions, []);
  const metaJson = safeJson(meta, {});
  if (questionsJson.length + metaJson.length > MAX_PAYLOAD_BYTES) return fail('데이터 크기가 너무 큽니다.');

  await ensureMixerSetsTable(env);

  const id = makeId('mxs');
  const key = randomKey('MIX');
  await env.DB.prepare(`
    INSERT INTO mixer_sets (
      id, public_key, title, qpp, question_count, questions_json, meta_json, created_by, created_by_name, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `).bind(
    id,
    key,
    text(meta.identityTitle || meta.title || meta.customTitle),
    Number.isFinite(Number(meta.qpp)) ? Math.trunc(Number(meta.qpp)) : null,
    questions.length,
    questionsJson,
    metaJson,
    text(teacher?.id),
    text(teacher?.name)
  ).run();

  return ok({
    key,
    print: {
      engine_url: `https://icefoxtail.github.io/AP------/archive/mixed_engine.html?key=${encodeURIComponent(key)}`
    }
  });
}

async function getMixerSet(env, key) {
  await ensureMixerSetsTable(env);
  const row = await env.DB.prepare(`
    SELECT questions_json, meta_json
    FROM mixer_sets
    WHERE public_key = ? AND COALESCE(status, 'active') = 'active'
  `).bind(key).first();
  if (!row) return null;
  return {
    questions: parseJson(row.questions_json, []) || [],
    meta: parseJson(row.meta_json, {}) || {}
  };
}

export async function handleMixerSets(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const key = path[2];
  if (resource !== ROUTE) return null;

  if (method === 'POST' && !key) return createMixerSet(request, env, teacher);
  if (method === 'GET' && key) {
    const data = await getMixerSet(env, key);
    if (!data) return fail('믹서 세트를 찾을 수 없습니다.', 404);
    return ok(data);
  }
  return null;
}
