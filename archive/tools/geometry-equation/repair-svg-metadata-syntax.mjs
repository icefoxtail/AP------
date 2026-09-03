import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.resolve(process.env.GEOMETRY_ARCHIVE_ROOT || path.join(ROOT, 'archive'));
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const SUMMARY_PATH = path.join(REPORTS, process.env.GEOMETRY_SVG_SUMMARY || 'svg_build_summary.json');
const LEDGER_PATH = path.join(REPORTS, process.env.GEOMETRY_SVG_LEDGER || 'repair_ledger_svg_metadata.json');

function main() {
  const ledger = fs.existsSync(LEDGER_PATH) ? JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')) : [];
  const sourceRows = ledger.length ? ledger : (JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8')).generatedAssets || []);
  const sourcePaths = [...new Set(sourceRows.map((row) => row.sourceJsPath))];
  const repaired = [];
  for (const sourceJsPath of sourcePaths) {
    const filePath = path.join(ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep));
    const lines = fs.readFileSync(filePath, 'utf8').split(/(?<=\n)/);
    let changed = 0;
    for (let index = 0; index < lines.length - 1; index += 1) {
      if (/"solution"\s*:/.test(lines[index]) && /"solutionImage"\s*:/.test(lines[index + 1]) && !lines[index].trimEnd().endsWith(',')) {
        const newline = lines[index].endsWith('\r\n') ? '\r\n' : lines[index].endsWith('\n') ? '\n' : '';
        const body = newline ? lines[index].slice(0, -newline.length) : lines[index];
        lines[index] = `${body},${newline}`;
        changed += 1;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, lines.join(''), 'utf8');
      repaired.push({ sourceJsPath, changedSolutionLines: changed });
    }
  }
  const report = { inspectedSourceFileCount: sourcePaths.length, repairedSourceFileCount: repaired.length, repaired };
  fs.writeFileSync(path.join(REPORTS, process.env.GEOMETRY_SYNTAX_REPORT || 'repair_svg_metadata_syntax.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();
