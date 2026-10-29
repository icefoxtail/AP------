// AP Math Lab 2.0 · 모든 장면 자동 렌더 검사 (Playwright 필요)
// 실행 예: (저장소 루트에서 정적 서버를 띄운 뒤)
//   python3 -m http.server 8765 &
//   node apmath/playground/next/tools/scene-smoke.mjs http://127.0.0.1:8765/apmath/playground/next/labs/
// 각 실험실의 모든 장면을 차례로 열어 ① 실행 오류 ② 빈 그림 ③ 깨진 패널을 찾습니다.
// 기존 실험실에서 오류 장면 5개(삼각비 4, 피타고라스 1)를 찾아낸 방법과 같은 원리입니다.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// playwright는 전역 설치(NODE_PATH)인 경우가 많아 require로 불러옵니다.
const { chromium } = createRequire(import.meta.url)('playwright');
const base = (process.argv[2] || 'http://127.0.0.1:8765/apmath/playground/next/labs/').replace(/\/?$/, '/');
const labsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs');
const pages = fs.readdirSync(labsDir).filter((f) => f.endsWith('.html'));

const browser = await chromium.launch();
let failed = 0;
for (const file of pages) {
  for (const theme of ['board', 'paper']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${base}${file}?theme=${theme}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab && window.lab.board);
    const rows = await page.evaluate(() => {
      const out = [];
      for (let i = 0; i < lab.list.length; i++) {
        lab.goScene(i);
        lab.render();
        const c = lab.board.canvas;
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let ink = 0;
        for (let k = 3; k < d.length; k += 4 * 31) if (d[k] > 30) ink++;
        out.push({ id: lab.scene.id, ink, guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim() });
      }
      return out;
    });
    const blank = rows.filter((r) => r.ink < 200);
    const noGuide = rows.filter((r) => !r.guide);
    const ok = !errors.length && !blank.length && !noGuide.length;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${file} [${theme}] 장면 ${rows.length}개` +
      (errors.length ? ` · 오류 ${errors.length}: ${errors[0].slice(0, 120)}` : '') +
      (blank.length ? ` · 빈 그림: ${blank.map((r) => r.id).join(', ')}` : '') +
      (noGuide.length ? ` · 안내 없음: ${noGuide.map((r) => r.id).join(', ')}` : ''));
    await page.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
