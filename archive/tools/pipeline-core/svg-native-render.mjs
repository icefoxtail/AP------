import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

// Runs out of process because the provider's byte-bound projection is synchronous.
const require = createRequire(process.env.APMATH_NODE_MODULES
  ? path.join(process.env.APMATH_NODE_MODULES, '..', 'package.json') : import.meta.url);
const sharp = require('sharp');
const svg = fs.readFileSync(0);
const text = svg.toString('utf8');
if (!/<svg\b/i.test(text) || /<!ENTITY|<!DOCTYPE|<script\b|<foreignObject\b/i.test(text)
  || /(?:href\s*=\s*["'](?!#)|url\(\s*["']?(?!#))/i.test(text)) {
  throw new Error('SVG_NATIVE_STANDALONE_REQUIRED');
}
const png = await sharp(svg, { density: 144, limitInputPixels: 40_000_000 }).png().toBuffer();
process.stdout.write(png);
