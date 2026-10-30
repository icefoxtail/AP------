// AP Math Lab 2.0 · manifest.json 생성기 (의존성 없음)
// 실행: node apmath/playground/next/tools/gen-manifest.mjs
// kit/apl-catalog.js(실험실 목록의 단일 출처)에서 playground/manifest.json 을 다시 만듭니다.
// 실험실을 더하거나 고친 뒤 한 번 실행하면 됩니다. 날짜·해시를 넣지 않아 같은 카탈로그면 결과가 늘 같고,
// 다시 실행해도 diff가 생기지 않습니다. catalog.test.mjs 가 manifest.json 이 카탈로그와 같은지 검사합니다.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAYGROUND = path.resolve(NEXT, '..');
export const MANIFEST = path.join(PLAYGROUND, 'manifest.json');

export function loadCatalog() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(NEXT, 'kit/apl-catalog.js'), 'utf8'), ctx);
  return ctx.window.APLab.catalog;
}

// 카탈로그 경로에는 ?v=… 같은 꼬리표가 붙을 수 있어, 실제 파일 경로만 남깁니다.
export const filePath = (p) => decodeURIComponent(p.split(/[?#]/)[0]);

export function buildManifest(cat) {
  return {
    site: 'AP Math Playground',
    version: cat.version,
    source: 'next/kit/apl-catalog.js',
    generator: 'next/tools/gen-manifest.mjs',
    lab_count: cat.labs.length,
    courses: cat.courses.map((c) => ({ id: c.id, name: c.name, lab_count: cat.labs.filter((l) => l.course === c.id).length })),
    labs: cat.labs.map((l) => ({
      id: l.id,
      grade: l.course, // 예전 manifest 와 같은 키를 유지(값은 course 와 같음)
      course: l.course,
      unit: l.unit,
      title: l.title,
      path: filePath(l.legacy),
      ...(l.next ? { next: filePath(l.next) } : {})
    }))
  };
}

export const renderManifest = (cat) => JSON.stringify(buildManifest(cat), null, 2) + '\n';

// 직접 실행했을 때만 파일을 씁니다 (테스트가 import 할 때는 아무것도 쓰지 않음).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cat = loadCatalog();
  const out = renderManifest(cat);
  const same = fs.existsSync(MANIFEST) && fs.readFileSync(MANIFEST, 'utf8') === out;
  if (!same) fs.writeFileSync(MANIFEST, out);
  console.log(`manifest.json: 실험실 ${cat.labs.length}개 · 카탈로그 ${cat.version} ${same ? '(변경 없음)' : '(갱신함)'}`);
}
