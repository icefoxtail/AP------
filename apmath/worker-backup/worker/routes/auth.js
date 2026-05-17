export async function handleAuth(request, env, ctx = {}) {
  const {
    headers,
    path = [],
    method = request.method,
    helpers = {}
  } = ctx;
  const {
    sha256hex,
    verifyAuth,
    createTeacherSession,
    revokeTeacherSession,
    getBearerToken,
    cleanupExpiredTeacherSessions
  } = helpers;

  if (path[1] !== 'auth') return null;

  if (path[2] === 'login' && method === 'POST') {
    const { login_id, password } = await request.json();
    const hash = await sha256hex(password);
    const teacher = await env.DB.prepare(
      'SELECT id, login_id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(login_id, hash).first();

    if (!teacher) {
      return new Response(JSON.stringify({ success: false, message: '?꾩씠???먮뒗 鍮꾨?踰덊샇 ?ㅻ쪟' }), {
        status: 401,
        headers
      });
    }

    if (cleanupExpiredTeacherSessions) {
      await cleanupExpiredTeacherSessions(env).catch(() => {});
    }

    const session = createTeacherSession
      ? await createTeacherSession(env, teacher)
      : { session_token: '', expires_at: '' };

    return new Response(JSON.stringify({
      success: true,
      id: teacher.id,
      name: teacher.name,
      role: teacher.role,
      login_id: teacher.login_id,
      session_token: session.session_token,
      expires_at: session.expires_at
    }), { headers });
  }

  if (path[2] === 'logout' && method === 'POST') {
    const token = getBearerToken ? getBearerToken(request) : '';
    if (token && revokeTeacherSession) {
      await revokeTeacherSession(env, token).catch(() => {});
    }
    return new Response(JSON.stringify({ success: true }), { headers });
  }

  if (path[2] === 'change-password' && method === 'POST') {
    const teacher = await verifyAuth(request, env);
    if (!teacher) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers
      });
    }

    const { new_password } = await request.json();
    const hash = await sha256hex(new_password);

    await env.DB.prepare(
      'UPDATE teachers SET password_hash = ? WHERE id = ?'
    ).bind(hash, teacher.id).run();

    return new Response(JSON.stringify({ success: true }), { headers });
  }

  return null;
}
