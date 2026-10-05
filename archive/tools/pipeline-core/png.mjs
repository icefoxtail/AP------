import { inflateSync } from 'node:zlib';

export function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function verifyViewportPng(bytes, width, height) {
  if (!Buffer.isBuffer(bytes) || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return false;
  let offset = 8, ihdr = null, ended = false;
  const idat = [];
  try {
    while (offset < bytes.length) {
      const length = bytes.readUInt32BE(offset);
      if (offset + length + 12 > bytes.length) return false;
      const type = bytes.subarray(offset + 4, offset + 8).toString();
      const data = bytes.subarray(offset + 8, offset + 8 + length);
      if (crc32(bytes.subarray(offset + 4, offset + 8 + length)) !== bytes.readUInt32BE(offset + 8 + length)) return false;
      if (type === 'IHDR') {
        if (ihdr || offset !== 8 || length !== 13) return false;
        ihdr = data;
      }
      if (type === 'IDAT') idat.push(data);
      offset += length + 12;
      if (type === 'IEND') { ended = length === 0 && offset === bytes.length; break; }
    }
    if (!ended || !ihdr || !idat.length || ihdr.readUInt32BE(0) !== width || ihdr.readUInt32BE(4) !== height || ihdr[8] !== 8 || ![2, 6].includes(ihdr[9]) || ihdr[10] !== 0 || ihdr[11] !== 0 || ihdr[12] !== 0) return false;
    const rowLength = width * (ihdr[9] === 6 ? 4 : 3) + 1;
    const expected = rowLength * height;
    if (expected > 150_000_000) return false;
    const image = inflateSync(Buffer.concat(idat), { maxOutputLength: expected });
    return image.length === expected && Array.from({ length: height }, (_, row) => image[row * rowLength]).every(filter => filter <= 4);
  } catch { return false; }
}
