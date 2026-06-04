// EIE v21 damage inspection - read-only.
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

  const result = await window.EieApi.getTimetable(null, {
    status: 'active,imported,needs_review,hidden,archived'
  });

  const rows = asRows(result);
  const archivedOld = rows.filter(row => !cellId(row).startsWith('eie_truth_2604_') && text(row.status) === 'archived' && text(row.memo).includes(MARKER));
  const truthRows = rows.filter(row => cellId(row).startsWith('eie_truth_2604_'));

  const summary = {
    totalRowsLoaded: rows.length,
    archivedOldRowsWithV21Marker: archivedOld.length,
    truthRowsVisible: truthRows.length
  };

  console.table(summary);
  console.log('Archived old rows:', archivedOld);
  console.log('Truth rows visible:', truthRows);
})();
