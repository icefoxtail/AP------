// Access-Control-Allow-Origin은 index.js의 withCorsOrigin()이 응답 직전에 요청 Origin 검증 후 덮어쓴다.
export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://icefoxtail.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Student-Token'
};

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch (e) {
    return {};
  }
}
