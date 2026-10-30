/* ==========================================================================
   AP Math Lab Kit · 기존 실험실 호환층 (apl-compat.js)
   기존 "마스터 실험실" 계열(중등 도형 16개)이 공통으로 쓰던 그리기 함수
   pline · ppoly · pdot · pright · ptick · pangle · ptag · drawMiniOverlayBox · drawBottomTapeBanner
   를 같은 이름·같은 인자로 제공하되, 실제 그리기는 새 무대 엔진(APLab.Board)이 맡습니다.

   - 좌표: 기존 코드의 화면 좌표(cx, cy 중심, y 아래쪽)를 그대로 '설계 좌표'로 씁니다.
     (기존 render 함수에 cx = cy = 0, state.scale = 1 을 넘기면 됩니다)
   - 색: 기존 헥사·rgba 색이 테마 의미색으로 자동 변환됩니다(칠판·종이 모두 대응).
   - 미니 상자·하단 띠: 캔버스에 덮어 그리지 않고 셸의 카드·테이프(DOM)로 옮겨 그림을 가리지 않습니다.
   ========================================================================== */
(function () {
  'use strict';
  const APLab = window.APLab;
  APLab.compat = APLab.compat || {};

  /**
   * @param {() => APLab.Board} getBoard 현재 프레임의 무대
   * @param {{card?: object, tape?: object}} sink 미니 상자·하단 띠를 받아 둘 객체(프레임마다 비움)
   */
  APLab.compat.master = function (getBoard, sink) {
    const B = () => getBoard();
    const dashOf = (d) => (Array.isArray(d) && d.length ? d : null);
    return {
      pline(a, b, color = '#fbbf24', width = 2.6, dash = [], glow = false, partIdx = undefined) {
        B().seg(a, b, { color, width, dash: dashOf(dash), glow, part: partIdx });
      },
      ppoly(pts, fill = 'rgba(52,211,153,0.20)', stroke = '#34d399', width = 2.8, partIdx = undefined) {
        B().poly(pts, { fill: fill || null, color: stroke || null, stroke: !!stroke, width, part: partIdx });
      },
      pdot(p, text = '', col = '#ffffff', refCenter = null, customOff = null) {
        const o = { color: col, r: 5.2, label: text, baseline: 'alphabetic' };
        if (customOff) { o.dx = customOff.x; o.dy = customOff.y; o.align = 'left'; }
        else if (refCenter) { o.toward = refCenter; }
        B().point(p, o);
      },
      pright(v, p1, p2, size = 12, col = '#fbbf24') {
        B().right(v, p1, p2, { size, color: col });
      },
      ptick(p1, p2, count = 1, col = '#fbbf24', size = 6.5) {
        B().ticks(p1, p2, { count, color: col, size });
      },
      pangle(v, p1, p2, col = '#fbbf24', r = 26, rings = 1, label = '') {
        B().angle(v, p1, p2, { color: col, r, rings, label, size: 12 });
      },
      ptag(x, y, msg, color = '#fef08a', size = 13) {
        B().text({ x, y }, msg, { color, size, align: 'center', baseline: 'alphabetic', weight: 800 });
      },
      /** 기존 코드의 ctx.arc(...) 블록 대체: 화면 각도(시계 방향) 그대로 */
      parc(center, radius, a0, a1, color = 'rgba(255,255,255,0.45)', width = 2.4, dash = null) {
        B().arc(center, radius, a0, a1, { color, width, dash: dashOf(dash) });
      },
      drawMiniOverlayBox(rect, title, lines) {
        sink.card = { title, lines: (lines || []).map((l) => ({ text: l.txt, color: l.col })) };
      },
      drawBottomTapeBanner(rect, titleStr, segments) {
        sink.tape = { title: titleStr, segments: (segments || []).map((s) => ({ text: s.text, weight: s.weight, color: s.color })) };
      }
    };
  };
})();
