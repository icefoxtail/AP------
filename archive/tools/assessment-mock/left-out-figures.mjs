// 사이트(Pages)에 싣지 않는 그림을 JSON { paths, names }로 출력한다. archive 폴더 기준 상대경로.
//   paths: 사이트 포장이 빼는 그림 파일 = 원본 품질 보류 문항의 의존 파일 중 정본 입력 목록(manifest)에 오른 것
//          (tools/build-archive-pages-site.mjs의 buildOnly 중 assets/ 아래와 같다. planPagesSite를 부르면 30초가 걸려 같은 입력으로 바로 구한다)
//   names: 그 파일 이름(basename). 그림은 사이트에 같은 이름으로 실리지 않으므로(R2에서 내려받는다) 이름만으로도 걸러야 한다.
// tests/archive-pages-site-reach.test.mjs는 실행 코드(모의고사 자료 파일 포함)가 이 경로나 이 이름을 쓰면 실패한다.
// build-scoped-mock.cjs가 모의고사 후보에서 이런 그림을 쓰는 문항을 빼는 데 쓴다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { sourceQualityHoldDependencyPaths } = await import(pathToFileURL(path.join(root, 'archive/tools/source-quality-holds.mjs')).href);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'), 'utf8'));
const listed = new Set(manifest.files.map(row => 'archive/' + String(row?.path)));
const left = sourceQualityHoldDependencyPaths(root).filter(p => p.startsWith('archive/assets/') && listed.has(p));
process.stdout.write(JSON.stringify({
  paths: left.map(p => p.slice('archive/'.length)),
  names: [...new Set(left.map(p => path.posix.basename(p)))],
}));
