// Access-Control-Allow-Origin은 index.js의 withCorsOrigin()이 응답 직전에 요청 Origin 검증 후 덮어쓴다.
const CORS = {
  'Access-Control-Allow-Origin': 'https://icefoxtail.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS,
      ...extraHeaders
    }
  });
}

export function errorResponse(message, status = 500, extra = {}) {
  return jsonResponse({ success: false, error: message, ...extra }, status);
}
