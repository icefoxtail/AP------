import { jsonResponse } from '../helpers/response.js';

function stubResponse(data) {
  return jsonResponse({
    success: true,
    stub: true,
    ...data,
    generated_at: new Date().toISOString()
  });
}

export async function handleEie(request, env, teacher, path, url) {
  void url;
  const method = request.method;
  if (method !== 'GET') {
    return jsonResponse({ success: false, error: 'method not allowed' }, 405);
  }

  const section = path[2] || '';
  const action = path[3] || '';

  if (section === 'import' && action === 'latest') {
    return stubResponse({
      data: null,
      latest_import: null,
      message: 'EIE latest import endpoint is reserved for Round 1 parser integration.'
    });
  }

  if (section === 'timetable') {
    return stubResponse({
      data: [],
      timetable_cells: [],
      message: 'EIE timetable endpoint is a Round 0 stub.'
    });
  }

  if (section === 'student-seeds') {
    return stubResponse({
      data: [],
      student_seeds: [],
      message: 'EIE student seed endpoint is a Round 0 stub.'
    });
  }

  return null;
}
