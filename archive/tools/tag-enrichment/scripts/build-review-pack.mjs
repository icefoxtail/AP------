import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const TOOL_DIR = path.join(ROOT_DIR, "archive", "tools", "tag-enrichment");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "tag-enrichment", "reports");

const REVIEW_FILES = [
  { source: path.join(REPORT_DIR, "exam-bank-inventory.summary.md"), name: "exam-bank-inventory.summary.md" },
  { source: path.join(REPORT_DIR, "tag-candidates.summary.md"), name: "tag-candidates.summary.md" },
  { source: path.join(REPORT_DIR, "validation-summary.md"), name: "validation-summary.md" },
  { source: path.join(REPORT_DIR, "tag-candidates.auto_high.json"), name: "tag-candidates.auto_high.json" },
  { source: path.join(REPORT_DIR, "tag-candidates.review_required.json"), name: "tag-candidates.review_required.json" },
  { source: path.join(TOOL_DIR, "data", "tag-master.seed.json"), name: "tag-master.seed.json" },
  { source: path.join(TOOL_DIR, "data", "pattern-rules.seed.json"), name: "pattern-rules.seed.json" },
  { source: path.join(TOOL_DIR, "README.md"), name: "README.md" },
];

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function crc32(buffer) {
  let table = crc32.table;
  if (!table) {
    table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let value = i;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      table[i] = value >>> 0;
    }
    crc32.table = table;
  }
  let crc = 0xffffffff;
  for (const byte of buffer) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUInt32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function writeUInt16(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value & 0xffff, 0);
  return buffer;
}

function createZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name.replaceAll("\\", "/"), "utf8");
    const sourceBuffer = fs.readFileSync(entry.source);
    const compressed = zlib.deflateRawSync(sourceBuffer, { level: 9 });
    const crc = crc32(sourceBuffer);

    const localHeader = Buffer.concat([
      writeUInt32(0x04034b50),
      writeUInt16(20),
      writeUInt16(0x0800),
      writeUInt16(8),
      writeUInt16(dosTime),
      writeUInt16(dosDate),
      writeUInt32(crc),
      writeUInt32(compressed.length),
      writeUInt32(sourceBuffer.length),
      writeUInt16(nameBuffer.length),
      writeUInt16(0),
      nameBuffer,
    ]);
    localParts.push(localHeader, compressed);

    const centralHeader = Buffer.concat([
      writeUInt32(0x02014b50),
      writeUInt16(20),
      writeUInt16(20),
      writeUInt16(0x0800),
      writeUInt16(8),
      writeUInt16(dosTime),
      writeUInt16(dosDate),
      writeUInt32(crc),
      writeUInt32(compressed.length),
      writeUInt32(sourceBuffer.length),
      writeUInt16(nameBuffer.length),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt32(0),
      writeUInt32(offset),
      nameBuffer,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length + compressed.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.concat([
    writeUInt32(0x06054b50),
    writeUInt16(0),
    writeUInt16(0),
    writeUInt16(entries.length),
    writeUInt16(entries.length),
    writeUInt32(centralSize),
    writeUInt32(offset),
    writeUInt16(0),
  ]);

  return Buffer.concat([...localParts, ...centralParts, end]);
}

function yyyymmdd(date = new Date()) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

export function buildReviewPack() {
  const missing = REVIEW_FILES.filter((entry) => !fs.existsSync(entry.source));
  if (missing.length) {
    throw new Error(`Missing review files: ${missing.map((entry) => entry.name).join(", ")}`);
  }
  const downloads = path.join(process.env.USERPROFILE || os.homedir(), "Downloads");
  fs.mkdirSync(downloads, { recursive: true });
  const outputPath = path.join(downloads, `js_archive_tag_enrichment_review_pack_${yyyymmdd()}.zip`);
  const zipBuffer = createZip(REVIEW_FILES);
  fs.writeFileSync(outputPath, zipBuffer);
  return {
    generatedAt: new Date().toISOString(),
    outputPath,
    includedFiles: REVIEW_FILES.map((entry) => entry.name),
    bytes: zipBuffer.length,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = buildReviewPack();
  console.log(`Review pack: ${result.outputPath}`);
}
