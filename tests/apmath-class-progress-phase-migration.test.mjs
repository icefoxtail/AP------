import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationPath = path.join(
    repoRoot,
    'apmath/worker-backup/worker/migrations/20260918_class_progress_phases.sql'
);

test('phase migration creates a durable, date-unique table with only the five phase keys', () => {
    assert.equal(fs.existsSync(migrationPath), true, 'phase migration file exists');
    const db = new DatabaseSync(':memory:');
    try {
        db.exec(fs.readFileSync(migrationPath, 'utf8'));

        const columns = db.prepare('PRAGMA table_info(class_progress_phases)').all().map(row => row.name);
        assert.deepEqual(columns, [
            'id', 'class_id', 'effective_date', 'phase',
            'updated_by_teacher_id', 'updated_by_teacher_name', 'created_at', 'updated_at'
        ]);
        const index = db.prepare("PRAGMA index_list('class_progress_phases')").all()
            .find(row => row.name === 'idx_class_progress_phases_class_effective');
        assert.ok(index, 'class/date index exists');

        db.prepare(`INSERT INTO class_progress_phases (id, class_id, effective_date, phase)
            VALUES (?, ?, ?, ?)`).run('phase-a', 'c1', '2026-09-01', 'semester2_midterm');
        assert.throws(() => db.prepare(`INSERT INTO class_progress_phases (id, class_id, effective_date, phase)
            VALUES (?, ?, ?, ?)`).run('phase-b', 'c1', '2026-09-01', 'regular'));
        assert.throws(() => db.prepare(`INSERT INTO class_progress_phases (id, class_id, effective_date, phase)
            VALUES (?, ?, ?, ?)`).run('phase-c', 'c1', '2026-09-02', 'exam'));
    } finally {
        db.close();
    }
});
