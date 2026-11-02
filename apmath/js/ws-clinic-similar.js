/* APMS M7 클리닉 — 유사문항 보기 (W 등급 작업 화면). 껍데기와 반·탭 전환은 ws-clinic-shell.js.
 * 1단계: 왼쪽에 반 취약 단원 목록. 단원을 누르면 옛 단원 상세 모달(openWeakUnitDetail)이 열린다.
 */
let wsClinicSimilar = null;

function wsClinicGetWeakUnitsForClass(classId) {
    return computeClassWeakUnits(classId);
}

async function wsClinicOpenSimilar(classId) {
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    if (!cls) {
        toast('반 정보를 찾을 수 없습니다.', 'warn');
        return false;
    }
    const token = wsClinicShow(classId, 'similar', wsClinicLoadingHtml('반 오답 단원을 확인하는 중입니다.'));
    const studentIds = new Set((state.db.class_students || [])
        .filter(row => String(row.class_id) === String(classId))
        .map(row => String(row.student_id)));
    const sessions = (state.db.exam_sessions || [])
        .filter(session => studentIds.has(String(session.student_id)) && String(session.archive_file || '').trim());
    try {
        await ensureBlueprintsForSessions(sessions);
    } catch (e) {
        console.warn('[ws-clinic] blueprint load failed:', e);
    }
    if (!wsClinicIsCurrent(token)) return false;

    const units = wsClinicGetWeakUnitsForClass(classId);
    const context = { targetType: 'class', targetId: classId, targetLabel: cls.name || '반' };
    wsClinicSimilar = { classId: String(classId), className: cls.name || '반', units, context, token };
    const view = document.getElementById('ws-clinic-view');
    if (!view) return false;
    view.innerHTML = wsClinicSimilarListHtml(wsClinicSimilar);
    return true;
}

function wsClinicSimilarListHtml(data) {
    const header = `
        <div class="apms-workspace__list ws-clinic-list" id="ws-clinic-list">
            <div class="apms-unified-context">
                <div class="apms-unified-context__name">${apEscapeHtml(data.className)}</div>
                <div class="apms-unified-context__meta">${data.units.length ? `취약 단원 ${data.units.length}개 · 오답이 많은 순서입니다. 단원을 누르면 유사문항을 찾습니다.` : '제출된 OMR 오답과 단원 정보가 있어야 유사문항 추천 기준을 만들 수 있습니다.'}</div>
            </div>`;
    if (!data.units.length) {
        return `${header}<div class="ws-clinic-empty">아직 추천 가능한 오답 단원이 없습니다.</div></div><div class="apms-workspace__detail ws-clinic-detail" id="ws-clinic-detail"></div>`;
    }
    const items = data.units.map((unit, index) => {
        const meta = [unit.unitKey, unit.studentCount ? `${unit.studentCount}명` : '', `오답 ${unit.count}회`].filter(Boolean).join(' · ');
        return `<button type="button" class="apms-workspace__item ws-clinic-unit" aria-current="false" onclick="wsClinicOpenUnit(${index})"><span class="ws-clinic-unit__name">${index + 1}. ${apEscapeHtml(unit.label)}</span><span class="ws-clinic-unit__meta">${apEscapeHtml(meta)}</span></button>`;
    }).join('');
    return `${header}${items}</div><div class="apms-workspace__detail ws-clinic-detail" id="ws-clinic-detail"><div class="ws-clinic-empty">왼쪽에서 단원을 고르세요.</div></div>`;
}

function wsClinicOpenUnit(index) {
    const data = wsClinicSimilar;
    const unit = data && data.units[Number(index)];
    if (!unit) return;
    const key = makeWeakUnitDetailKey(unit, 'class', `${data.className} 유사문항`, data.context);
    openWeakUnitDetail(key);
}
