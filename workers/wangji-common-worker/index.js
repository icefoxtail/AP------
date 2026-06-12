// wangji-common-worker: 왕지 공통 학생관리 overlay/link/index 전용 워커.
// /api/wangji, /api/wangji/* 만 처리한다. AP/EIE 원본 DB·워커와 무관하며 원본 write 없음.
import { handleWangji } from './routes/wangji.js';
import { jsonResponse, optionsResponse, withCorsOrigin } from './helpers/response.js';

export default {
  async fetch(request, env) {
    const response = await handleRequest(request, env);
    return withCorsOrigin(response, request, env);
  }
};

async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') return optionsResponse();

  const url = new URL(request.url);
  if (url.pathname === '/api/wangji' || url.pathname.startsWith('/api/wangji/')) {
    try {
      return await handleWangji(request, env);
    } catch (error) {
      console.error('wangji-common-worker error', error);
      return jsonResponse({ success: false, error: 'internal error' }, 500);
    }
  }

  return jsonResponse({ success: false, error: 'not found' }, 404);
}
