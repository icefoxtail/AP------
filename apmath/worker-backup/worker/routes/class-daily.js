import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, isAdminUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';
import {
  CLASS_PROGRESS_TAXONOMY,
  CLASS_PROGRESS_TAXONOMY_VERSION
} from '../helpers/class-progress-taxonomy.js';

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    const teacher = await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
    return teacher || null;
  } catch (e) {
    return null;
  }
}

async function requireTeacher(request, env, teacher) {
  return teacher || await verifyAuth(request, env);
}

function todayKstDateString() {
  return new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
}

function normalizeProgressDate(value) {
  const date = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
}

const CLASS_PROGRESS_PHASES = new Set([
  'regular',
  'semester1_midterm',
  'semester1_final',
  'semester2_midterm',
  'semester2_final'
]);

function normalizeClassProgressPhaseDate(value) {
  const date = normalizeProgressDate(value);
  if (!date) return '';
  const timestamp = Date.parse(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp)) return '';
  return new Date(timestamp).toISOString().slice(0, 10) === date ? date : '';
}

function getClassProgressPhaseValue(value) {
  const phase = String(value || '').trim();
  return CLASS_PROGRESS_PHASES.has(phase) ? phase : 'regular';
}

function getProgressItemField(item, ...keys) {
  for (const key of keys) {
    if (item && item[key] !== undefined && item[key] !== null) return String(item[key]).trim();
  }
  return '';
}

function findCanonicalProgressItem(item) {
  const pathKey = getProgressItemField(item, 'canonical_path_key', 'canonicalPathKey');
  const curriculumKey = getProgressItemField(item, 'curriculum_key', 'curriculumKey');
  const courseKey = getProgressItemField(item, 'course_key', 'courseKey');
  const level = getProgressItemField(item, 'level_key', 'level');
  const match = CLASS_PROGRESS_TAXONOMY.find(row =>
    row.canonicalPathKey === pathKey &&
    (!curriculumKey || row.curriculumKey === curriculumKey) &&
    (!courseKey || row.courseKey === courseKey) &&
    (!level || row.level === level)
  );
  return match || null;
}

async function getAccessibleClassIds(env, teacher) {
  if (isAdminUser(teacher)) {
    const rows = await env.DB.prepare(
      'SELECT id FROM classes WHERE is_active != 0 OR is_active IS NULL'
    ).all();
    return Array.from(new Set((rows.results || []).map(row => row.id).filter(Boolean)));
  }

  const rows = await env.DB.prepare(
    'SELECT class_id FROM teacher_classes WHERE teacher_id = ?'
  ).bind(teacher.id).all();
  return Array.from(new Set((rows.results || []).map(row => row.class_id).filter(Boolean)));
}

async function getClassProgressRows(env, classIds, date) {
  if (!classIds.length) return { snapshots: [], items: [] };

  const markers = classIds.map(() => '?').join(',');
  const snapshotRows = await env.DB.prepare(`
    SELECT id, class_id, effective_date, updated_by_teacher_id, updated_by_teacher_name, created_at, updated_at
    FROM (
      SELECT s.*,
             ROW_NUMBER() OVER (
               PARTITION BY s.class_id
               ORDER BY s.effective_date DESC, s.updated_at DESC, s.id DESC
             ) AS row_num
      FROM class_progress_snapshots s
      WHERE s.class_id IN (${markers})
        AND s.effective_date <= ?
    )
    WHERE row_num = 1
    ORDER BY class_id ASC
  `).bind(...classIds, date).all();

  const snapshots = snapshotRows.results || [];
  if (!snapshots.length) return { snapshots: [], items: [] };

  const snapshotMarkers = snapshots.map(() => '?').join(',');
  const itemRows = await env.DB.prepare(`
    SELECT id, snapshot_id, class_id, curriculum_key, level_key, course_key,
           canonical_path_key, l1_snapshot, l2_snapshot, sort_order, created_at
    FROM class_progress_items
    WHERE snapshot_id IN (${snapshotMarkers})
    ORDER BY snapshot_id ASC, sort_order ASC, id ASC
  `).bind(...snapshots.map(row => row.id)).all();

  return { snapshots, items: itemRows.results || [] };
}

async function getLegacyProgressRows(env, classIds, date) {
  if (!classIds.length) return [];
  const markers = classIds.map(() => '?').join(',');
  const result = await env.DB.prepare(`
    SELECT id, class_id, date, special_note, teacher_name, updated_at
    FROM (
      SELECT r.*,
             ROW_NUMBER() OVER (
               PARTITION BY r.class_id
               ORDER BY r.date DESC, r.updated_at DESC, r.id DESC
             ) AS row_num
      FROM class_daily_records r
      WHERE r.class_id IN (${markers})
        AND r.date <= ?
        AND TRIM(COALESCE(r.special_note, '')) LIKE '[단원선택]%'
    )
    WHERE row_num = 1
    ORDER BY class_id ASC
  `).bind(...classIds, date).all();
  return result.results || [];
}

async function getClassProgressPhaseRow(env, classId, date) {
  return await env.DB.prepare(`
    SELECT id, class_id, effective_date, phase,
           updated_by_teacher_id, updated_by_teacher_name, created_at, updated_at
    FROM class_progress_phases
    WHERE class_id = ? AND effective_date <= ?
    ORDER BY effective_date DESC, updated_at DESC, id DESC
    LIMIT 1
  `).bind(classId, date).first();
}

async function getClassProgressPhaseRows(env, classIds, date) {
  if (!classIds.length) return [];
  const markers = classIds.map(() => '?').join(',');
  const result = await env.DB.prepare(`
    SELECT id, class_id, effective_date, phase,
           updated_by_teacher_id, updated_by_teacher_name, created_at, updated_at
    FROM (
      SELECT p.*,
             ROW_NUMBER() OVER (
               PARTITION BY p.class_id
               ORDER BY p.effective_date DESC, p.updated_at DESC, p.id DESC
             ) AS row_num
      FROM class_progress_phases p
      WHERE p.class_id IN (${markers})
        AND p.effective_date <= ?
    )
    WHERE row_num = 1
    ORDER BY class_id ASC
  `).bind(...classIds, date).all();
  const byClassId = new Map((result.results || []).map(row => [String(row.class_id), row]));
  return classIds.map(classId => {
    const row = byClassId.get(String(classId));
    if (row) return { ...row, phase: getClassProgressPhaseValue(row.phase) };
    return {
      id: null,
      class_id: String(classId),
      effective_date: null,
      phase: 'regular',
      updated_by_teacher_id: null,
      updated_by_teacher_name: null,
      created_at: null,
      updated_at: null
    };
  });
}

export async function getClassProgressInitialData(env, teacher, date = todayKstDateString()) {
  const classIds = await getAccessibleClassIds(env, teacher);
  const [rows, phases] = await Promise.all([
    getClassProgressRows(env, classIds, date),
    getClassProgressPhaseRows(env, classIds, date)
  ]);
  return {
    class_progress_date: date,
    class_progress_taxonomy_version: CLASS_PROGRESS_TAXONOMY_VERSION,
    class_progress_taxonomy: CLASS_PROGRESS_TAXONOMY,
    class_progress_snapshots: rows.snapshots,
    class_progress_items: rows.items,
    class_progress_phases: phases
  };
}

export async function handleClassDaily(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource === 'class-progress-taxonomy') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
    if (method !== 'GET') return jsonResponse({ success: false, error: 'method not allowed' }, 405);

    return jsonResponse({
      success: true,
      version: CLASS_PROGRESS_TAXONOMY_VERSION,
      items: CLASS_PROGRESS_TAXONOMY
    });
  }

  if (resource === 'class-progress-phase') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const classId = String(url.searchParams.get('class_id') || '').trim();
      const date = normalizeClassProgressPhaseDate(url.searchParams.get('date'));
      if (!classId || !date) {
        return jsonResponse({ success: false, error: 'class_id and valid date required' }, 400);
      }
      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const row = await getClassProgressPhaseRow(env, classId, date);
      return jsonResponse({
        success: true,
        class_id: classId,
        date,
        phase: getClassProgressPhaseValue(row?.phase),
        effective_date: row?.effective_date || null,
        updated_by_teacher_id: row?.updated_by_teacher_id || null,
        updated_by_teacher_name: row?.updated_by_teacher_name || null
      });
    }

    if (method === 'POST' || method === 'PUT') {
      let data;
      try {
        data = await request.json();
      } catch (error) {
        return jsonResponse({ success: false, error: 'invalid JSON body' }, 400);
      }

      const classId = String(data?.class_id || data?.classId || '').trim();
      const effectiveDate = normalizeClassProgressPhaseDate(data?.effective_date || data?.effectiveDate);
      const phase = String(data?.phase || '').trim();
      if (!classId || !effectiveDate) {
        return jsonResponse({ success: false, error: 'class_id and valid effective_date required' }, 400);
      }
      if (!CLASS_PROGRESS_PHASES.has(phase)) {
        return jsonResponse({ success: false, error: 'invalid phase' }, 422);
      }
      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const phaseId = `cpp_${(await sha256hex(`${classId}|${effectiveDate}`)).slice(0, 40)}`;
      await env.DB.prepare(`
        INSERT INTO class_progress_phases (
          id, class_id, effective_date, phase,
          updated_by_teacher_id, updated_by_teacher_name, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
        ON CONFLICT(class_id, effective_date) DO UPDATE SET
          phase = excluded.phase,
          updated_by_teacher_id = excluded.updated_by_teacher_id,
          updated_by_teacher_name = excluded.updated_by_teacher_name,
          updated_at = DATETIME('now')
      `).bind(
        phaseId,
        classId,
        effectiveDate,
        phase,
        currentTeacher.id || null,
        currentTeacher.name || null
      ).run();

      const row = await env.DB.prepare(`
        SELECT id, class_id, effective_date, phase,
               updated_by_teacher_id, updated_by_teacher_name, created_at, updated_at
        FROM class_progress_phases
        WHERE class_id = ? AND effective_date = ?
      `).bind(classId, effectiveDate).first();
      return jsonResponse({ success: true, ...row });
    }

    return jsonResponse({ success: false, error: 'method not allowed' }, 405);
  }

  if (resource === 'class-progress') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const classId = url.searchParams.get('class_id') || url.searchParams.get('class') || '';
      const date = normalizeProgressDate(url.searchParams.get('date')) || todayKstDateString();

      if (classId) {
        if (!(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        const rows = await getClassProgressRows(env, [classId], date);
        const snapshot = rows.snapshots[0] || null;
        const legacyRows = snapshot ? [] : await getLegacyProgressRows(env, [classId], date);
        return jsonResponse({
          success: true,
          class_id: classId,
          date,
          snapshot,
          items: rows.items,
          legacy_record: legacyRows[0] || null,
          taxonomy_version: CLASS_PROGRESS_TAXONOMY_VERSION
        });
      }

      const classIds = await getAccessibleClassIds(env, currentTeacher);
      const rows = await getClassProgressRows(env, classIds, date);
      const legacyRows = await getLegacyProgressRows(env, classIds, date);
      return jsonResponse({
        success: true,
        date,
        snapshots: rows.snapshots,
        items: rows.items,
        legacy_records: legacyRows,
        taxonomy_version: CLASS_PROGRESS_TAXONOMY_VERSION
      });
    }

    if (method === 'POST' || method === 'PUT') {
      const d = await request.json();
      const classId = String(d.class_id || d.classId || '').trim();
      const effectiveDate = normalizeProgressDate(d.effective_date || d.effectiveDate);
      if (!classId || !effectiveDate) {
        return jsonResponse({ success: false, error: 'class_id and effective_date required' }, 400);
      }

      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const rawItems = Array.isArray(d.items) ? d.items : (Array.isArray(d.progress) ? d.progress : []);
      if (rawItems.length > 500) {
        return jsonResponse({ success: false, error: 'too many progress items' }, 422);
      }

      const normalizedItems = [];
      const seenPaths = new Set();
      for (const item of rawItems) {
        const canonical = findCanonicalProgressItem(item);
        if (!canonical) {
          return jsonResponse({
            success: false,
            error: 'invalid canonical progress path',
            canonical_path_key: getProgressItemField(item, 'canonical_path_key', 'canonicalPathKey')
          }, 422);
        }
        if (seenPaths.has(canonical.canonicalPathKey)) {
          return jsonResponse({
            success: false,
            error: 'duplicate canonical progress path',
            canonical_path_key: canonical.canonicalPathKey
          }, 422);
        }
        seenPaths.add(canonical.canonicalPathKey);
        normalizedItems.push({
          ...canonical,
          sortOrder: Number.isFinite(Number(item.sort_order ?? item.sortOrder))
            ? Number(item.sort_order ?? item.sortOrder)
            : normalizedItems.length
        });
      }

      const existing = await env.DB.prepare(
        'SELECT id FROM class_progress_snapshots WHERE class_id = ? AND effective_date = ?'
      ).bind(classId, effectiveDate).first();
      // The deterministic id closes the first-write race: two concurrent writers for the
      // same class/date must target the same snapshot row and its child-item replacement.
      const deterministicSnapshotId = `cps_${(await sha256hex(`${classId}|${effectiveDate}`)).slice(0, 40)}`;
      const snapshotId = existing?.id || deterministicSnapshotId;
      const updatedById = currentTeacher.id || null;
      const updatedByName = currentTeacher.name || null;
      const statements = [
        env.DB.prepare(`
          INSERT INTO class_progress_snapshots (
            id, class_id, effective_date, updated_by_teacher_id, updated_by_teacher_name,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
          ON CONFLICT(class_id, effective_date) DO UPDATE SET
            updated_by_teacher_id = excluded.updated_by_teacher_id,
            updated_by_teacher_name = excluded.updated_by_teacher_name,
            updated_at = DATETIME('now')
        `).bind(snapshotId, classId, effectiveDate, updatedById, updatedByName),
        env.DB.prepare('DELETE FROM class_progress_items WHERE snapshot_id = ?').bind(snapshotId)
      ];

      normalizedItems.forEach((item, index) => {
        statements.push(env.DB.prepare(`
          INSERT INTO class_progress_items (
            id, snapshot_id, class_id, curriculum_key, level_key, course_key,
            canonical_path_key, l1_snapshot, l2_snapshot, sort_order, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
        `).bind(
          `cpi_${crypto.randomUUID()}`,
          snapshotId,
          classId,
          item.curriculumKey,
          item.level,
          item.courseKey,
          item.canonicalPathKey,
          item.l1,
          item.l2,
          item.sortOrder ?? index
        ));
      });

      await env.DB.batch(statements);
      const snapshot = await env.DB.prepare(
        'SELECT id, class_id, effective_date, updated_by_teacher_id, updated_by_teacher_name, created_at, updated_at FROM class_progress_snapshots WHERE class_id = ? AND effective_date = ?'
      ).bind(classId, effectiveDate).first();
      const items = await env.DB.prepare(`
        SELECT id, snapshot_id, class_id, curriculum_key, level_key, course_key,
               canonical_path_key, l1_snapshot, l2_snapshot, sort_order, created_at
        FROM class_progress_items
        WHERE snapshot_id = ?
        ORDER BY sort_order ASC, id ASC
      `).bind(snapshot?.id || snapshotId).all();

      return jsonResponse({
        success: true,
        class_id: classId,
        date: effectiveDate,
        snapshot,
        items: items.results || [],
        taxonomy_version: CLASS_PROGRESS_TAXONOMY_VERSION
      });
    }

    return jsonResponse({ success: false, error: 'method not allowed' }, 405);
  }

  if (resource === 'class-textbooks') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const classId = url.searchParams.get('class') || '';
      const status = url.searchParams.get('status') || '';

      if (classId) {
        if (!(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        let query = 'SELECT * FROM class_textbooks WHERE class_id = ?';
        const params = [classId];

        if (status) {
          query += ' AND status = ?';
          params.push(status);
        }

        query += ' ORDER BY sort_order ASC, created_at ASC';

        const res = await env.DB.prepare(query).bind(...params).all();
        return jsonResponse({ success: true, items: res.results });
      }

      if (isAdminUser(currentTeacher)) {
        const res = await env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all();
        return jsonResponse({ success: true, items: res.results });
      }

      const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
      const classIds = tcls.results.map(r => r.class_id);

      if (!classIds.length) {
        return jsonResponse({ success: true, items: [] });
      }

      const markers = classIds.map(() => '?').join(',');
      const res = await env.DB.prepare(`SELECT * FROM class_textbooks WHERE class_id IN (${markers}) ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC`).bind(...classIds).all();
      return jsonResponse({ success: true, items: res.results });
    }

    if (method === 'POST') {
      const d = await request.json();

      if (!d.class_id || !String(d.title || '').trim()) {
        return jsonResponse({ success: false, error: 'class_id and title required' }, 400);
      }

      if (!(await canAccessClass(currentTeacher, d.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const tid = `tx_${crypto.randomUUID()}`;
      const startDate = d.start_date || todayKstDateString();

      await env.DB.prepare(`
        INSERT INTO class_textbooks (
          id, class_id, title, status, start_date, end_date, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, 'active', ?, NULL, ?, DATETIME('now'), DATETIME('now'))
      `).bind(
        tid,
        d.class_id,
        String(d.title).trim(),
        startDate,
        Number(d.sort_order || 0)
      ).run();

      const item = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(tid).first();
      return jsonResponse({ success: true, item });
    }

    if (method === 'PATCH' && id) {
      const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

      if (!current) {
        return jsonResponse({ success: false, error: 'not found' }, 404);
      }

      if (!(await canAccessClass(currentTeacher, current.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const d = await request.json();
      const nextStatus = d.status || current.status || 'active';
      const today = todayKstDateString();

      let nextEndDate = d.end_date !== undefined ? d.end_date : current.end_date;
      if (nextStatus === 'completed' && !nextEndDate) nextEndDate = today;
      if (nextStatus === 'active' && d.clear_end_date === true) nextEndDate = null;

      await env.DB.prepare(`
        UPDATE class_textbooks
        SET title = ?,
            status = ?,
            start_date = ?,
            end_date = ?,
            sort_order = ?,
            updated_at = DATETIME('now')
        WHERE id = ?
      `).bind(
        String(d.title !== undefined ? d.title : current.title).trim(),
        nextStatus,
        d.start_date !== undefined ? d.start_date : current.start_date,
        nextEndDate,
        d.sort_order !== undefined ? Number(d.sort_order || 0) : Number(current.sort_order || 0),
        id
      ).run();

      const item = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();
      return jsonResponse({ success: true, item });
    }

    if (method === 'DELETE' && id) {
      const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

      if (!current) {
        return jsonResponse({ success: false, error: 'not found' }, 404);
      }

      if (!(await canAccessClass(currentTeacher, current.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      await env.DB.prepare('DELETE FROM class_textbooks WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true });
    }
  }

  if (resource === 'class-daily-records') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const classId = url.searchParams.get('class') || '';
      const date = url.searchParams.get('date') || todayKstDateString();

      if (classId) {
        if (!(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        const records = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ? ORDER BY created_at ASC').bind(classId, date).all();
        const progress = await env.DB.prepare(`
          SELECT *
          FROM class_daily_progress
          WHERE class_id = ?
            AND record_id IN (
              SELECT id FROM class_daily_records WHERE class_id = ? AND date = ?
            )
          ORDER BY created_at ASC
        `).bind(classId, classId, date).all();

        return jsonResponse({
          success: true,
          date,
          records: records.results,
          progress: progress.results
        });
      }

      let classIds = [];
      if (isAdminUser(currentTeacher)) {
        const allClasses = await env.DB.prepare('SELECT id FROM classes WHERE is_active != 0 OR is_active IS NULL').all();
        classIds = allClasses.results.map(r => r.id);
      } else {
        const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
        classIds = tcls.results.map(r => r.class_id);
      }

      if (!classIds.length) {
        return jsonResponse({ success: true, date, records: [], progress: [] });
      }

      const markers = classIds.map(() => '?').join(',');
      const records = await env.DB.prepare(`SELECT * FROM class_daily_records WHERE date = ? AND class_id IN (${markers}) ORDER BY class_id ASC, created_at ASC`).bind(date, ...classIds).all();
      const progress = await env.DB.prepare(`SELECT * FROM class_daily_progress WHERE record_id IN (SELECT id FROM class_daily_records WHERE date = ? AND class_id IN (${markers})) ORDER BY created_at ASC`).bind(date, ...classIds).all();

      return jsonResponse({
        success: true,
        date,
        records: records.results,
        progress: progress.results
      });
    }

    if (method === 'POST') {
      const d = await request.json();

      if (!d.class_id || !d.date) {
        return jsonResponse({ success: false, error: 'class_id and date required' }, 400);
      }

      if (!(await canAccessClass(currentTeacher, d.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const existing = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ?').bind(d.class_id, d.date).first();
      const recordId = existing?.id || `cdr_${crypto.randomUUID()}`;
      const teacherName = d.teacher_name || currentTeacher.name || '';
      const specialNote = d.special_note || '';

      const stmts = [];

      if (existing) {
        stmts.push(env.DB.prepare(`
          UPDATE class_daily_records
          SET teacher_name = ?,
              special_note = ?,
              updated_at = DATETIME('now')
          WHERE id = ?
        `).bind(teacherName, specialNote, recordId));
      } else {
        stmts.push(env.DB.prepare(`
          INSERT INTO class_daily_records (
            id, class_id, date, teacher_name, special_note, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
        `).bind(recordId, d.class_id, d.date, teacherName, specialNote));
      }

      stmts.push(env.DB.prepare('DELETE FROM class_daily_progress WHERE record_id = ?').bind(recordId));

      const progressItems = Array.isArray(d.progress) ? d.progress : [];

      for (const item of progressItems) {
        const textbookId = item.textbook_id || '';
        const progressText = String(item.progress_text || '').trim();

        if (!textbookId && !String(item.textbook_title_snapshot || '').trim()) continue;

        let titleSnapshot = String(item.textbook_title_snapshot || '').trim();

        if (textbookId) {
          const textbook = await env.DB.prepare('SELECT title FROM class_textbooks WHERE id = ? AND class_id = ?').bind(textbookId, d.class_id).first();
          if (textbook?.title) titleSnapshot = textbook.title;
        }

        if (!titleSnapshot) continue;

        stmts.push(env.DB.prepare(`
          INSERT INTO class_daily_progress (
            id, record_id, class_id, textbook_id, textbook_title_snapshot, progress_text, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
        `).bind(
          `cdp_${crypto.randomUUID()}`,
          recordId,
          d.class_id,
          textbookId || null,
          titleSnapshot,
          progressText
        ));
      }

      await env.DB.batch(stmts);

      const record = await env.DB.prepare('SELECT * FROM class_daily_records WHERE id = ?').bind(recordId).first();
      const progress = await env.DB.prepare('SELECT * FROM class_daily_progress WHERE record_id = ? ORDER BY created_at ASC').bind(recordId).all();

      return jsonResponse({
        success: true,
        record,
        progress: progress.results
      });
    }
  }

  return null;
}
