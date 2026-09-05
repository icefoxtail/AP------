import fs from 'node:fs';
import path from 'node:path';
import { sha256, readJson, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const corpus = readJson(path.join(root, 'specs/phase2-missing-visual-corpus-v1.json'));
const results = [];
for (const item of corpus.cases) {
  const assetPath = path.join(repoRoot, 'archive/assets/images', item.examId, `q${String(item.qid).padStart(2, '0')}-solution.svg`);
  const svg = render(item);
  fs.mkdirSync(path.dirname(assetPath), { recursive: true });
  fs.writeFileSync(assetPath, svg, 'utf8');
  results.push({ questionUid: item.questionUid, assetPath: path.relative(repoRoot, assetPath).replaceAll('\\', '/'), artifactSha: sha256(svg), factHash: sha256(item.fact), visualType: item.visualType });
}
const report = { generatorVersion: 'logic-visual-phase2-missing-svg-v1', corpusSha: sha256(corpus), generatedCount: results.length, results, reportSha: sha256(results) };
writeJson(path.join(root, 'reports/phase2-missing-visual-generation.json'), report);
console.log(JSON.stringify({ generatedCount: results.length, reportSha: report.reportSha }, null, 2));

function render(item) {
  const safeTitle = esc(item.title);
  const safeDesc = esc(item.note.replaceAll('\n', ' · '));
  const body = item.visualType === 'PROOF_FLOW' ? proofFlow(item) : item.visualType === 'TRUTH_SET_VENN' ? venn(item) : item.visualType === 'TRUTH_SET_NUMBER_LINE' ? numberLine(item) : caseTable(item);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 430" width="760" height="430" role="img" aria-labelledby="title desc"><title id="title">${safeTitle}</title><desc id="desc">${safeDesc}</desc><style>text{font-family:"Noto Sans KR","Malgun Gothic",Arial,sans-serif;fill:#172033}.muted{fill:#56657a}.math{font-family:Georgia,"Times New Roman",serif}</style><rect width="760" height="430" fill="#f8fafc"/>${body}</svg>`;
}

function proofFlow(item) {
  const steps = item.fact.proofSteps;
  let body = `<text x="28" y="38" font-size="22" font-weight="700">${esc(item.title)}</text><text x="28" y="67" class="muted" font-size="15">증명 단계와 모순·등호 조건을 순서대로 확인한다.</text>`;
  const x = 52, w = 656, h = Math.min(42, Math.max(30, 300 / steps.length)), gap = 6, start = 98;
  steps.forEach((step, index) => {
    const y = start + index * (h + gap);
    body += `<g class="logic-proof-step"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${index === steps.length - 1 ? '#dcfce7' : '#ffffff'}" stroke="${index === steps.length - 1 ? '#16a34a' : '#cbd5e1'}"/><text x="${x + 18}" y="${y + h / 2 + 6}" class="step-label" font-size="16" font-weight="${index === steps.length - 1 ? '700' : '400'}">${index + 1}. ${esc(step)}</text></g>`;
    if (index < steps.length - 1) body += `<line x1="380" y1="${y + h}" x2="380" y2="${y + h + gap}" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow)"/>`;
  });
  return `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#2563eb"/></marker></defs>${body}`;
}

function venn(item) {
  const formulas = item.fact.truthSetRegions ?? [];
  const labels = item.fact.boundaryTopology?.map((x) => x.label).filter(Boolean) ?? ['P', 'Q'];
  let body = `<text x="28" y="38" font-size="22" font-weight="700">${esc(item.title)}</text><text x="28" y="67" class="muted" font-size="15">${esc(item.note.split('\n')[0])}</text><rect x="36" y="96" width="320" height="250" rx="14" fill="#fff" stroke="#cbd5e1"/>`;
  const centers = labels.length >= 3 ? [[150,215],[230,180],[230,250]] : [[150,220],[250,220]];
  labels.forEach((label, index) => { const [cx, cy] = centers[index] ?? [200 + index * 40, 220]; body += `<circle cx="${cx}" cy="${cy}" r="78" fill="${index === 0 ? '#bfdbfe' : index === 1 ? '#fed7aa' : '#dcfce7'}" fill-opacity=".45" stroke="${index === 0 ? '#2563eb' : index === 1 ? '#ea580c' : '#16a34a'}" stroke-width="3"/><text x="${cx}" y="${cy - 82}" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>`; });
  body += `<rect x="390" y="96" width="334" height="250" rx="14" fill="#fff" stroke="#cbd5e1"/><text x="412" y="128" font-size="16" font-weight="700">논리 관계</text>`;
  formulas.forEach((formula, index) => { body += `<text x="412" y="${170 + index * 42}" class="math" font-size="20">${esc(formula)}</text>`; });
  return body;
}

function numberLine(item) {
  const components = item.fact.intervalComponents ?? [];
  let body = `<text x="28" y="38" font-size="22" font-weight="700">${esc(item.title)}</text><text x="28" y="67" class="muted" font-size="15">${esc(item.note.split('\n')[0])}</text>`;
  const x0 = 120, x1 = 680;
  components.forEach((component, index) => {
    const y = 145 + index * 74;
    const a = x0 + 60, b = x1 - 80;
    body += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#64748b" stroke-width="2"/><line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="${index ? '#16a34a' : '#2563eb'}" stroke-width="10" stroke-linecap="round"/><circle cx="${a}" cy="${y}" r="8" fill="${component.fromEndpoint?.kind === 'OPEN' ? '#fff' : index ? '#16a34a' : '#2563eb'}" stroke="${index ? '#16a34a' : '#2563eb'}" stroke-width="3"/><circle cx="${b}" cy="${y}" r="8" fill="${component.toEndpoint?.kind === 'OPEN' ? '#fff' : index ? '#16a34a' : '#2563eb'}" stroke="${index ? '#16a34a' : '#2563eb'}" stroke-width="3"/><text x="76" y="${y + 6}" font-size="16" font-weight="700">${index + 1}</text><text x="${a}" y="${y + 28}" text-anchor="middle" class="muted" font-size="13">${esc(component.from)}${component.fromEndpoint?.kind === 'OPEN' ? ' 미포함' : ' 포함'}</text><text x="${b}" y="${y + 28}" text-anchor="middle" class="muted" font-size="13">${esc(component.to)}${component.toEndpoint?.kind === 'OPEN' ? ' 미포함' : ' 포함'}</text>`;
  });
  return body;
}

function caseTable(item) {
  const rows = item.fact.caseRows ?? [];
  let body = `<text x="28" y="38" font-size="22" font-weight="700">${esc(item.title)}</text><text x="28" y="67" class="muted" font-size="15">${esc(item.note.split('\n')[0])}</text><rect x="42" y="96" width="676" height="${rows.length * 50 + 34}" rx="12" fill="#fff" stroke="#cbd5e1"/>`;
  rows.forEach((row, index) => { const y = 130 + index * 50; body += `<line x1="42" y1="${y}" x2="718" y2="${y}" stroke="#e2e8f0"/><text x="68" y="${y + 30}" class="case-label" font-size="16" font-weight="700">${esc(row.caseId)}</text><text x="280" y="${y + 30}" class="muted" font-size="15">${esc(item.note.split('\n')[index + 1] ?? '')}</text>`; });
  return body;
}

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
