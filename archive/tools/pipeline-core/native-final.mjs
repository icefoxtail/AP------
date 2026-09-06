import path from 'node:path';
import { requireClosure } from './integration.mjs';
import { writeNewJson } from './canonical.mjs';

export function nativeFinal(root, pipeline, identities, argv = process.argv) {
  const closure = requireClosure(root, pipeline, argv, [], identities);
  const report = { ...closure, publicationStatus: 'NOT_PUBLISHED', legacyEvidencePreserved: true, note: 'Current scope-bound quality closure. This receipt is not production authorization or a replacement for Common Core promotion/rollback/final seal.' };
  const outIndex = argv.indexOf('--out');
  if (outIndex >= 0) {
    if (!argv[outIndex + 1]) throw new Error('--out requires a new JSON path');
    const target = path.resolve(argv[outIndex + 1]);
    for (const protectedRoot of ['archive/exams', 'archive/assets']) if (target.startsWith(`${path.resolve(root, protectedRoot)}${path.sep}`)) throw new Error('PRODUCTION_REPORT_OUTPUT_FORBIDDEN');
    writeNewJson(target, report);
  }
  console.log(JSON.stringify(report, null, 2));
  return report;
}
