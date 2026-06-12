const DEFAULT_ALLOWED_ORIGINS = ['https://icefoxtail.github.io'];

// Access-Control-Allow-Origin은 index.js의 withCorsOrigin()이 응답 직전에 요청 Origin 검증 후 덮어쓴다.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': DEFAULT_ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Max-Age': '86400'
};

// 요청 Origin이 허용 목록(env.ALLOWED_ORIGINS 콤마 구분 또는 기본값) 또는 localhost일 때만 해당 Origin을 반환한다.
export function resolveAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin') || '';
  const configured = String(env?.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowList = configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
  if (allowList.includes(origin)) return origin;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return allowList[0];
}

export function withCorsOrigin(response, request, env) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', resolveAllowedOrigin(request, env));
  newHeaders.append('Vary', 'Origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers: newHeaders });
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
  });
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}
