import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readBoundFile, bytesSha } from './canonical.mjs';

const mimeFor = relative => ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[path.extname(relative).toLowerCase()] || 'application/octet-stream');
const svgNativeCache = new Map();

export function visualAssetPayload(root, ref) {
  const bytes = readBoundFile(root, ref);
  if (path.extname(ref.path).toLowerCase() === '.svg') {
    const cached = svgNativeCache.get(bytesSha(bytes));
    if (cached) return { ...ref, ...cached };
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('./svg-native-render.mjs', import.meta.url))], { input: bytes, maxBuffer: 32 * 1024 * 1024, timeout: 30000 });
    if (result.error || result.status !== 0) throw new Error(`SVG_NATIVE_RENDER_FAILED:${ref.path}:${result.error?.message || result.stderr?.toString()}`);
    const png = result.stdout;
    if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('SVG_NATIVE_PNG_REQUIRED');
    const native = { mimeType: 'image/png', nativeSha256: bytesSha(png), nativeRenderer: 'sharp-svg-144dpi-v1', dataUrl: `data:image/png;base64,${png.toString('base64')}` };
    svgNativeCache.set(bytesSha(bytes), native);
    return { ...ref, ...native };
  }
  return { ...ref, mimeType: mimeFor(ref.path), dataUrl: `data:${mimeFor(ref.path)};base64,${bytes.toString('base64')}` };
}

export const sourceVisualAssetPayload = visualAssetPayload;
