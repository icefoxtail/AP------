import fs from 'node:fs';
import path from 'node:path';
import { relativeRepoPath, sha256 } from './io.mjs';

function decodeEntities(text) {
  return text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'");
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
  return match?.[1] ?? null;
}

function number(value) {
  const result = Number.parseFloat(value);
  return Number.isFinite(result) ? result : null;
}

function extractTexts(svg) {
  return [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)].map((match) => ({
    x: number(attr(match[1], 'x') ?? '0'),
    y: number(attr(match[1], 'y') ?? '0'),
    text: decodeEntities(match[2].replace(/<tspan\b[^>]*>/gi, '').replace(/<\/tspan>/gi, '').replace(/<[^>]+>/g, '').trim())
  })).filter((item) => item.text);
}

function extractCircles(svg) {
  return [...svg.matchAll(/<(circle|ellipse)\b([^>]*)>/gi)].map((match) => ({
    shape: match[1].toLowerCase(),
    cx: number(attr(match[2], 'cx') ?? '0'),
    cy: number(attr(match[2], 'cy') ?? '0'),
    r: number(attr(match[2], 'r') ?? attr(match[2], 'rx') ?? '0'),
    fill: attr(match[2], 'fill'),
    stroke: attr(match[2], 'stroke'),
    fillOpacity: attr(match[2], 'fill-opacity'),
    strokeWidth: number(attr(match[2], 'stroke-width') ?? '1')
  }));
}

function extractLines(svg) {
  return [...svg.matchAll(/<line\b([^>]*)>/gi)].map((match) => ({
    x1: number(attr(match[1], 'x1') ?? '0'), x2: number(attr(match[1], 'x2') ?? '0'),
    y1: number(attr(match[1], 'y1') ?? '0'), y2: number(attr(match[1], 'y2') ?? '0'),
    stroke: attr(match[1], 'stroke'), strokeWidth: number(attr(match[1], 'stroke-width') ?? '1'),
    strokeLinecap: attr(match[1], 'stroke-linecap')
  }));
}

function extractLabels(texts) {
  return texts.filter((item) => /^(A|B|C|Aᶜ|Bᶜ|P|Q|R|U|x|y|O)$/.test(item.text)).map((item) => item.text);
}

function parseNumberLine(svg, texts, lines, circles) {
  const thick = lines.filter((line) => line.strokeWidth >= 8 && Math.abs(line.y2 - line.y1) < 1 && Math.abs(line.x2 - line.x1) > 80);
  if (!thick.length) return null;
  const axisRows = [...new Set(lines.filter((line) => line.strokeWidth <= 3 && Math.abs(line.y2 - line.y1) < 1).map((line) => line.y1))];
  const ticks = lines.filter((line) => line.strokeWidth <= 3 && Math.abs(line.x2 - line.x1) < 1 && Math.abs(line.y2 - line.y1) >= 8);
  const labels = ticks.map((tick) => {
    const nearby = texts.filter((text) => Math.abs((text.x ?? 0) - tick.x1) <= 7 && text.y > tick.y1).sort((a, b) => a.y - b.y)[0];
    return nearby ? { x: tick.x1, value: nearby.text } : null;
  }).filter(Boolean);
  const components = thick.map((line) => {
    const rowCircles = circles.filter((circle) => Math.abs((circle.cy ?? 0) - line.y1) <= 5 && Math.abs((circle.cx ?? 0) - line.x1) <= 14 || Math.abs((circle.cy ?? 0) - line.y1) <= 5 && Math.abs((circle.cx ?? 0) - line.x2) <= 14);
    const endpoint = (x) => {
      const marker = rowCircles.find((circle) => Math.abs((circle.cx ?? 0) - x) <= 10);
      return marker ? { kind: marker.fill === 'none' || marker.fill === '#fff' || marker.fill === '#ffffff' ? 'OPEN' : 'CLOSED' } : { kind: 'UNMARKED' };
    };
    const mapValue = (x) => {
      const exact = labels.find((label) => Math.abs(label.x - x) <= 8);
      return exact?.value ?? x;
    };
    return { from: mapValue(line.x1), to: mapValue(line.x2), fromEndpoint: endpoint(line.x1), toEndpoint: endpoint(line.x2) };
  });
  return { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_NUMBER_LINE', intervalComponents: components, axisRows, requiredLabels: extractLabels(texts) };
}

function parseVenn(texts, circles, svg) {
  const setCircles = circles.filter((circle) => (circle.shape === 'circle' || circle.shape === 'ellipse') && circle.r >= 40 && circle.r <= 150 && circle.strokeWidth >= 1.5);
  if (setCircles.length < 2) return null;
  const labels = extractLabels(texts);
  const formulaTexts = texts.filter((text) => /[∩∪△ᶜ⊆⊂♥]/.test(text.text) && !/[가-힣]/.test(text.text)).map((text) => text.text);
  const clipRefs = [...svg.matchAll(/clip-path=["']url\(#([^)]*)\)/gi)].map((match) => match[1]);
  const maskRefs = [...svg.matchAll(/mask=["']url\(#([^)]*)\)/gi)].map((match) => match[1]);
  const coincidentBoundaries = setCircles.length === 2 && setCircles[0].cx === setCircles[1].cx && setCircles[0].cy === setCircles[1].cy;
  const highlightTopology = maskRefs.length ? 'clip-mask-highlight' : coincidentBoundaries ? 'coincident-boundaries' : 'unresolved-region-highlight';
  return {
    factSchemaVersion: 'LOGIC_VISUAL_FACT_v1',
    visualType: setCircles.length >= 3 ? 'SET_REGION_VENN_3' : 'SET_REGION_VENN_2',
    boundaryTopology: setCircles.map((circle) => ({ cx: circle.cx, cy: circle.cy, r: circle.r })),
    requiredLabels: labels,
    highlightedExpressions: formulaTexts,
    highlightTopology,
    clipTopology: clipRefs.sort(),
    maskTopology: maskRefs.sort()
  };
}

function parseGraphOrTable(texts, circles, lines) {
  const pointCount = circles.filter((circle) => circle.shape === 'circle' && circle.r <= 8).length;
  if (pointCount >= 4 && texts.some((text) => text.text === 'x') && texts.some((text) => text.text === 'y')) {
    return { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_GRAPH_DEFINED', pointCount, axisLabels: ['x', 'y'], requiredLabels: extractLabels(texts) };
  }
  const rowText = texts.filter((text) => /\b(강제|금지|자유|case|경우|진리|A|B)\b/i.test(text.text));
  return { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', visualType: 'SET_FORCE_FORBID_FREE', forcedElements: [], forbiddenElements: [], freeElements: [], requiredLabels: rowText.map((item) => item.text) };
}

export function extractObservedFact(svg) {
  const texts = extractTexts(svg);
  const circles = extractCircles(svg);
  const lines = extractLines(svg);
  return parseNumberLine(svg, texts, lines, circles) ?? parseVenn(texts, circles, svg) ?? parseGraphOrTable(texts, circles, lines);
}

export function buildArtifactOnlyBundle(repoRoot, items) {
  return {
    bundleType: 'V2_ARTIFACT_ONLY_LOGIC_VISUAL_OBSERVATION',
    contractVersion: 'v1',
    items: items.map((item) => {
      const assetPath = item.solutionImage ? path.join(repoRoot, 'archive', item.solutionImage) : null;
      const exists = Boolean(assetPath && fs.existsSync(assetPath));
      return {
        questionUid: item.questionUid,
        artifactPath: item.solutionImage,
        artifactExists: exists,
        artifactSha: exists ? sha256(fs.readFileSync(assetPath)) : null,
        artifactMedium: exists ? 'svg' : 'none',
        observedFact: exists ? extractObservedFact(fs.readFileSync(assetPath, 'utf8')) : null,
        observedExtractionMethod: exists ? 'svg_boolean' : null,
        assetIdentity: exists ? relativeRepoPath(repoRoot, assetPath) : null
      };
    })
  };
}
