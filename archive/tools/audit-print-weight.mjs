#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function walk(dir, predicate) {
    const output = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) output.push(...walk(fullPath, predicate));
        else if (predicate(fullPath)) output.push(fullPath);
    }
    return output;
}

function pngDimensions(buffer) {
    if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function jpegDimensions(buffer) {
    if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
    let offset = 2;
    while (offset + 8 < buffer.length) {
        if (buffer[offset] !== 0xff) { offset += 1; continue; }
        const marker = buffer[offset + 1];
        offset += 2;
        if (marker === 0xd8 || marker === 0xd9) continue;
        const length = buffer.readUInt16BE(offset);
        if (length < 2 || offset + length > buffer.length) break;
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
            return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
        }
        offset += length;
    }
    return null;
}

function imageDimensions(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        return pngDimensions(buffer) || jpegDimensions(buffer);
    } catch (error) {
        return null;
    }
}

function imageReferences(source) {
    const references = [];
    const pattern = /(?:^|[,{]\s*)(?:["']?(image|solutionImage)["']?)\s*:\s*(["'])(.*?)\2/gm;
    for (const match of source.matchAll(pattern)) references.push({ field: match[1], value: match[3] });
    return references;
}

function audit(repoRoot) {
    const archiveRoot = path.join(repoRoot, 'archive');
    const examsRoot = path.join(archiveRoot, 'exams', 'original');
    const dimensionCache = new Map();
    const rows = [];

    for (const examPath of walk(examsRoot, filePath => filePath.endsWith('.js'))) {
        const source = fs.readFileSync(examPath, 'utf8');
        const references = imageReferences(source);
        if (!references.length) continue;

        let referencedPixels = 0;
        let missing = 0;
        const uniquePaths = new Set();
        for (const reference of references) {
            const assetPath = path.resolve(archiveRoot, reference.value.replaceAll('/', path.sep));
            uniquePaths.add(assetPath);
            if (!dimensionCache.has(assetPath)) dimensionCache.set(assetPath, imageDimensions(assetPath));
            const dimensions = dimensionCache.get(assetPath);
            if (dimensions) referencedPixels += dimensions.width * dimensions.height;
            else if (!fs.existsSync(assetPath)) missing += 1;
        }

        let uniquePixels = 0;
        for (const assetPath of uniquePaths) {
            const dimensions = dimensionCache.get(assetPath);
            if (dimensions) uniquePixels += dimensions.width * dimensions.height;
        }

        rows.push({
            exam: path.relative(examsRoot, examPath).replaceAll(path.sep, '/'),
            references: references.length,
            uniqueAssets: uniquePaths.size,
            repeatedReferences: references.length - uniquePaths.size,
            referencedMegapixels: Number((referencedPixels / 1e6).toFixed(1)),
            estimatedDecodedMB: Math.round((referencedPixels * 4) / (1024 * 1024)),
            uniqueDecodedMB: Math.round((uniquePixels * 4) / (1024 * 1024)),
            missing
        });
    }

    return rows.sort((a, b) => b.estimatedDecodedMB - a.estimatedDecodedMB);
}

function parseArgs(argv) {
    const args = { repo: path.resolve(import.meta.dirname, '..', '..'), top: 20, json: false };
    for (let index = 0; index < argv.length; index += 1) {
        if (argv[index] === '--repo') args.repo = path.resolve(argv[++index]);
        else if (argv[index] === '--top') args.top = Math.max(1, Number.parseInt(argv[++index], 10) || 20);
        else if (argv[index] === '--json') args.json = true;
    }
    return args;
}

const args = parseArgs(process.argv.slice(2));
const rows = audit(args.repo).slice(0, args.top);
if (args.json) process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
else console.table(rows);

export { audit, imageDimensions, imageReferences, pngDimensions, jpegDimensions };
