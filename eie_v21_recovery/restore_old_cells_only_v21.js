// EIE v21 recovery - restore old timetable cells only.
// Purpose:
// - DO NOT touch truth cells (eie_truth_2604_*).
// - Restore only old timetable cells that v21 archived with memo marker.
// Run in the real EIE timetable page Console after login.

(async () => {
  const MARKER = '[archived by EIE truth rebuild v21]';

  function asRows(result) {
    if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
    if (Array.isArray(result?.cells)) return result.cells;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.rows)) return result.rows;
    return [];
  }

  function cellId(row) {
    return String(row?.id || row?.cell_id || '').trim();
  }

  function text(value) {
    return String(value == null ? '' : value);
  }

  if (!window.EieApi?.getTimetable || !window.EieApi?.updateTimetableCell) {
    throw new Error('EieApi is not ready. Open the real EIE timetable page and run again.');
  }

  const first = await window.EieApi.getTimetable(null, {
    status: 'active,imported,needs_review,hidden,archived'
  });

  const rows = asRows(first);

  const restoreTargets = rows.filter(row => {
    const id = cellId(row);
    const status = text(row?.status);
    const memo = text(row?.memo);
    return id && !id.startsWith('eie_truth_2604_') && status === 'archived' && memo.includes(MARKER);
  });

  const truthRowsVisible = rows.filter(row => cellId(row).startsWith('eie_truth_2604_'));

  console.table({
    totalRowsLoaded: rows.length,
    oldRowsToRestore: restoreTargets.length,
    truthRowsVisibleNoTouch: truthRowsVisible.length
  });

  if (!restoreTargets.length) {
    alert('No old v21-archived rows found to restore. Nothing was changed.');
    return;
  }

  const ok = window.confirm(
    [
      'EIE v21 recovery',
      '',
      `Restore old timetable rows: ${restoreTargets.length}`,
      `Truth rows will NOT be touched: ${truthRowsVisible.length}`,
      '',
      'Proceed?'
    ].join('\n')
  );

  if (!ok) {
    console.log('Recovery cancelled.');
    return;
  }

  const report = {
    started_at: new Date().toISOString(),
    marker: MARKER,
    restored: [],
    failures: [],
    truth_rows_visible_not_touched: truthRowsVisible.map(row => cellId(row)).filter(Boolean)
  };

  for (const row of restoreTargets) {
    const id = cellId(row);
    const cleanedMemo = text(row?.memo)
      .replace(MARKER, '')
      .replace(/\s+/g, ' ')
      .trim();

    try {
      await window.EieApi.updateTimetableCell(id, {
        status: 'active',
        memo: cleanedMemo
      });
      report.restored.push(id);
    } catch (error) {
      report.failures.push({
        id,
        error: error?.message || String(error)
      });
    }
  }

  try {
    const refreshed = await window.EieApi.getTimetable(null, {
      status: 'active,imported,needs_review,hidden'
    });
    const refreshedRows = asRows(refreshed);
    if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(refreshedRows);
    if (window.EieRouter?.open) window.EieRouter.open('timetable');
    report.refreshed_count = refreshedRows.length;
  } catch (error) {
    report.refresh_error = error?.message || String(error);
  }

  report.finished_at = new Date().toISOString();

  console.log('EIE v21 recovery report:', report);

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `eie_v21_recovery_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);

  alert(`Recovery finished.\nRestored: ${report.restored.length}\nFailures: ${report.failures.length}`);
})().catch(error => {
  console.error('EIE v21 recovery failed:', error);
  alert(error?.message || String(error));
});
