import fs from "node:fs";
import path from "node:path";
import { listFiles, ensureDir } from "./report-utils.mjs";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n);
  return b;
}

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n >>> 0);
  return b;
}

export async function zipDirectory(srcDir, destZip) {
  const files = await listFiles(srcDir);
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const file of files) {
    const data = await fs.promises.readFile(file);
    const name = path.relative(srcDir, file).replaceAll("\\", "/");
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc),
      u32(data.length), u32(data.length), u16(nameBuf.length), u16(0), nameBuf, data,
    ]);
    const central = Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc),
      u32(data.length), u32(data.length), u16(nameBuf.length), u16(0), u16(0), u16(0),
      u16(0), u32(0), u32(offset), nameBuf,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const centralDir = Buffer.concat(centrals);
  const end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
    u32(centralDir.length), u32(offset), u16(0),
  ]);
  await ensureDir(path.dirname(destZip));
  await fs.promises.writeFile(destZip, Buffer.concat([...locals, centralDir, end]));
  return { fileCount: files.length, zip: destZip };
}

