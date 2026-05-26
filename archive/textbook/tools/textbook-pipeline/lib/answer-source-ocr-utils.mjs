import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { buildSourceInventory, classifySourceType, updatePipelineBookSummary } from "./source-crosscheck-utils.mjs";
import { ensureDir, readJson, writeJson } from "./report-utils.mjs";

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function rel(root, file) {
  return path.relative(root || process.cwd(), file).replaceAll(path.sep, "/");
}

function resolveWorkspacePath(cfg, value) {
  if (!value) return "";
  if (path.isAbsolute(value)) return value;
  return path.resolve(cfg.workspaceRoot || process.cwd(), value);
}

function fileStem(file) {
  return path.basename(file, path.extname(file)).replace(/[^\w.-]+/g, "_").slice(0, 80) || "answer_source";
}

async function walkFiles(root, predicate, out = []) {
  if (!root || !fs.existsSync(root)) return out;
  const entries = await fs.promises.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) await walkFiles(full, predicate, out);
    else if (!predicate || predicate(full)) out.push(full);
  }
  return out;
}

async function discoverKoreanAnswerPdfs(cfg) {
  const materialName = cfg.materialRoot ? path.basename(cfg.materialRoot) : "";
  const bookNeedles = uniq([
    cfg.bookId,
    materialName,
    materialName.replace(/[_\s]+generated$/i, ""),
  ].filter(Boolean).map((item) => String(item).toLowerCase()));
  const roots = uniq([
    cfg.materialRoot,
    cfg.materialRoot ? path.dirname(cfg.materialRoot) : "",
    cfg.archiveRoot,
  ].map((item) => item && path.resolve(item)));
  const pdfs = [];
  for (const root of roots) {
    pdfs.push(...await walkFiles(root, (file) => /\.pdf$/i.test(file)));
  }
  return uniq(pdfs).map((file) => {
    const base = path.basename(file);
    if (bookNeedles.length && !bookNeedles.some((needle) => base.toLowerCase().includes(needle))) return null;
    const sourceType = /빠른\s*정답|빠른정답/i.test(base) ? "quick_answer"
      : /해설/i.test(base) ? "solution_pdf"
        : /정답/i.test(base) ? "answer_pdf"
          : "";
    return sourceType ? { file: rel(cfg.workspaceRoot, file), source_type: sourceType } : null;
  }).filter(Boolean);
}

export function normalizeAnswerGlyph(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return "";
  const cyrillicChoiceMap = new Map([
    ["\u0401\u0437", "\u2460"],
    ["\u0401\u0438", "\u2461"],
    ["\u0401\u0439", "\u2462"],
    ["\u0401\u043a", "\u2463"],
    ["\u0401\u043b", "\u2464"],
  ]);
  if (cyrillicChoiceMap.has(text)) return cyrillicChoiceMap.get(text);
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code >= 0x2460 && code <= 0x2468) return ch;
  }
  const compact = text.replace(/\s+/g, "");
  if (/^0\d{3}$/.test(compact)) return "";
  if (/^[1-9]$/.test(compact)) return compact;
  if (/^[-+]?\d{1,4}$/.test(compact)) return compact;
  if (/^[-+]?\d{1,4}\/[1-9]\d{0,3}$/.test(compact)) return compact;
  if (/^[가-힣A-Za-z]$/.test(compact)) return compact;
  return "";
}

function questionNos(text) {
  const out = [];
  for (const match of String(text || "").matchAll(/\b(0\d{3})\b/g)) {
    const digits = match[1].replace(/\D/g, "");
    if (!digits) continue;
    out.push({ no: digits.padStart(4, "0"), index: match.index || 0 });
  }
  return out;
}

export function parseQuickAnswerText(text, source = "quick_answer_pdf") {
  const items = [];
  for (const line of String(text || "").split(/\r?\n/)) {
    const matches = [...line.matchAll(/\b(0\d{3}|\d{1,3})\b\s*([^\s,;]+)/g)];
    for (const match of matches) {
      const answer = normalizeAnswerGlyph(match[2]);
      if (!answer) continue;
      items.push({
        displayNo: match[1].replace(/\D/g, "").padStart(4, "0"),
        answer,
        rawAnswer: match[2],
        source,
        source_type: classifySourceType(source),
        extraction_method: "pdf_text",
      });
    }
  }
  return items;
}

export function parseOcrAnswerRows(page, source = "answer_pdf_ocr") {
  const rows = Array.isArray(page?.rows) ? page.rows : [];
  const items = [];
  for (const row of rows) {
    const nos = questionNos(row.text);
    if (!nos.length) continue;
    for (const no of nos) {
      const noX = Number(row.x || 0) + (no.index > 0 ? Number(row.w || 0) * 0.45 : 0);
      const nearby = rows
        .filter((candidate) => Math.abs(Number(candidate.y || 0) - Number(row.y || 0)) <= 16)
        .filter((candidate) => Number(candidate.x || 0) > noX + 18 && Number(candidate.x || 0) < noX + 140)
        .sort((a, b) => Number(a.x || 0) - Number(b.x || 0));
      const answerRow = nearby.find((candidate) => normalizeAnswerGlyph(candidate.text));
      const answer = normalizeAnswerGlyph(answerRow?.text);
      if (!answer) continue;
      items.push({
        displayNo: no.no,
        answer,
        rawAnswer: answerRow.text,
        pageNo: page.page ?? "",
        source,
        source_type: classifySourceType(source),
        extraction_method: "pymupdf_render_rapidocr",
        ocrBasis: {
          questionText: row.text,
          answerText: answerRow.text,
          x: Math.round(noX),
          y: Math.round(Number(row.y || 0)),
        },
      });
    }
  }
  return items;
}

function findPython(cfg) {
  const configured = cfg.pythonPath || process.env.TEXTBOOK_PIPELINE_PYTHON || "";
  const candidates = uniq([
    configured,
    path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "python", "python.exe"),
    "C:\\Python314\\python.exe",
    "python",
    "py",
  ]);
  return candidates.find(Boolean);
}

function runPython(python, args, options = {}) {
  return new Promise((resolve) => {
    const userSiteBase = process.env.APPDATA || (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, "AppData", "Roaming") : "");
    const userSite = userSiteBase
      ? path.join(userSiteBase, "Python", "Python314", "site-packages")
      : "";
    const localTarget = path.resolve(".codex_deps", "python314_site");
    const shouldUseLocalTarget = !String(python).toLowerCase().includes("codex-runtimes");
    const env = {
      ...process.env,
      ...(options.env || {}),
      PYTHONPATH: uniq([
        options.env?.PYTHONPATH,
        process.env.PYTHONPATH,
        shouldUseLocalTarget ? localTarget : "",
        userSite,
      ]).join(path.delimiter),
    };
    const child = spawn(python, args, { ...options, env, windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => { stdout += chunk; });
    child.stderr?.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => resolve({ ok: false, stdout, stderr: error.message }));
    child.on("close", (code) => resolve({ ok: code === 0, code, stdout, stderr }));
  });
}

async function writeExtractorScript(cfg) {
  const dir = path.join(cfg.workDir || cfg.reportsDir || process.cwd(), "answer_source_ocr");
  await ensureDir(dir);
  const file = path.join(dir, "extract_pdf_answer_source.py");
  const script = String.raw`
import json, sys, os

pdf_path, out_dir, max_pages_raw = sys.argv[1], sys.argv[2], sys.argv[3]
max_pages = int(max_pages_raw or "0")
os.makedirs(out_dir, exist_ok=True)
result = {"pdf": pdf_path, "text": "", "textCharCount": 0, "pypdfStatus": "not_run", "rapidocrStatus": "not_run", "pages": []}
try:
    from pypdf import PdfReader
    reader = PdfReader(pdf_path)
    texts = []
    limit = len(reader.pages) if max_pages <= 0 else min(len(reader.pages), max_pages)
    for i in range(limit):
        texts.append(reader.pages[i].extract_text() or "")
    result["text"] = "\n".join(texts)
    result["textCharCount"] = len(result["text"].strip())
    result["pypdfStatus"] = "ok"
except Exception as exc:
    result["pypdfStatus"] = "error:" + str(exc)

if result["textCharCount"] == 0:
    try:
        import fitz
        import rapidocr
        from rapidocr import RapidOCR
        rapid_root = os.path.dirname(rapidocr.__file__)
        rapid_models = os.path.join(rapid_root, "models")
        rapid_params = {
            "Det.model_path": os.path.join(rapid_models, "ch_PP-OCRv4_det_infer.onnx"),
            "Cls.model_path": os.path.join(rapid_models, "ch_ppocr_mobile_v2.0_cls_infer.onnx"),
            "Rec.model_path": os.path.join(rapid_models, "ch_PP-OCRv4_rec_infer.onnx"),
            "Rec.rec_keys_path": os.path.join(rapid_models, "ppocr_keys_v1.txt"),
        }
        engine = RapidOCR(params=rapid_params)
        doc = fitz.open(pdf_path)
        limit = len(doc) if max_pages <= 0 else min(len(doc), max_pages)
        for page_index in range(limit):
            page = doc[page_index]
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            image_path = os.path.join(out_dir, f"p{page_index+1:03d}.png")
            json_path = os.path.join(out_dir, f"p{page_index+1:03d}.json")
            pix.save(image_path)
            ocr_result = engine(image_path)
            rows = []
            boxes = [] if getattr(ocr_result, "boxes", None) is None else list(ocr_result.boxes)
            texts = [] if getattr(ocr_result, "txts", None) is None else list(ocr_result.txts)
            scores = [] if getattr(ocr_result, "scores", None) is None else list(ocr_result.scores)
            for box, text, score in zip(boxes, texts, scores):
                xs = [float(point[0]) for point in box]
                ys = [float(point[1]) for point in box]
                rows.append({"text": str(text), "score": float(score), "x": min(xs), "y": min(ys), "w": max(xs)-min(xs), "h": max(ys)-min(ys)})
            page_report = {"page": page_index + 1, "image": image_path, "rows": rows}
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(page_report, f, ensure_ascii=False, indent=2)
            result["pages"].append({"page": page_index + 1, "image": image_path, "json": json_path, "rowCount": len(rows)})
        result["rapidocrStatus"] = "ok"
    except Exception as exc:
        result["rapidocrStatus"] = "error:" + str(exc)

print(json.dumps(result, ensure_ascii=False))
`;
  await fs.promises.writeFile(file, script, "utf8");
  return file;
}

export async function buildAnswerSourceOcrReport(cfg, inventory = null) {
  const reportsDir = cfg.reportsDir || path.join(cfg.generatedRoot || process.cwd(), "reports");
  const sourceInventory = inventory || await readJson(path.join(reportsDir, "source_inventory_report.json"), null) || await buildSourceInventory(cfg);
  const materialName = cfg.materialRoot ? path.basename(cfg.materialRoot).toLowerCase() : "";
  const bookNeedles = uniq([cfg.bookId, materialName].filter(Boolean).map((item) => String(item).toLowerCase()));
  const belongsToBook = (file) => {
    if (!bookNeedles.length) return true;
    const base = path.basename(resolveWorkspacePath(cfg, file)).toLowerCase();
    return bookNeedles.some((needle) => base.includes(needle));
  };
  const pdfEntries = [
    ...(sourceInventory.quickAnswerPdfs || []).map((file) => ({ file, source_type: "quick_answer" })),
    ...(sourceInventory.answerPdfs || []).map((file) => ({ file, source_type: "answer_pdf" })),
    ...(sourceInventory.solutionPdfs || []).map((file) => ({ file, source_type: "solution_pdf" })),
  ].filter((entry) => belongsToBook(entry.file));
  for (const discovered of await discoverKoreanAnswerPdfs(cfg)) {
    if (!pdfEntries.some((entry) => resolveWorkspacePath(cfg, entry.file) === resolveWorkspacePath(cfg, discovered.file))) {
      pdfEntries.push(discovered);
    }
  }
  const python = findPython(cfg);
  const extractor = cfg.answerSourceOcrExtractorScript || await writeExtractorScript(cfg);
  const pagesRoot = path.join(reportsDir, "answer_source_ocr_pages");
  await ensureDir(pagesRoot);
  const items = [];
  const pdfReports = [];
  const maxPages = Number(cfg.answerSourceOcrMaxPages ?? 0);

  for (const entry of pdfEntries) {
    const pdfPath = resolveWorkspacePath(cfg, entry.file);
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      pdfReports.push({ pdf: entry.file, source_type: entry.source_type, status: "missing" });
      continue;
    }
    const outDir = path.join(pagesRoot, fileStem(pdfPath));
    await ensureDir(outDir);
    const result = await runPython(python, [extractor, pdfPath, outDir, String(maxPages)], { cwd: cfg.workspaceRoot || process.cwd() });
    if (!result.ok) {
      pdfReports.push({ pdf: rel(cfg.workspaceRoot, pdfPath), source_type: entry.source_type, status: "error", stderr: result.stderr });
      continue;
    }
    let parsed = null;
    try {
      parsed = JSON.parse(result.stdout);
    } catch (error) {
      const jsonStart = result.stdout.split(/\r?\n/).findLast((line) => line.trim().startsWith("{")) || "";
      try {
        parsed = JSON.parse(jsonStart);
      } catch {
        pdfReports.push({ pdf: rel(cfg.workspaceRoot, pdfPath), source_type: entry.source_type, status: "parse_error", stderr: result.stderr, stdout: result.stdout.slice(0, 500) });
        continue;
      }
    }
    const sourceName = entry.source_type === "quick_answer" ? "quick_answer_pdf"
      : entry.source_type === "solution_pdf" ? "solution_pdf_ocr"
        : "answer_pdf_ocr";
    const textItems = parseQuickAnswerText(parsed.text || "", sourceName).map((item) => ({
      ...item,
      source_type: entry.source_type,
      sourcePdf: rel(cfg.workspaceRoot, pdfPath),
    }));
    const pageItems = [];
    for (const page of parsed.pages || []) {
      const pageJsonPath = path.join(outDir, `p${String(page.page || 0).padStart(3, "0")}.json`);
      const pageJson = await readJson(pageJsonPath, null);
      if (!pageJson) continue;
      pageItems.push(...parseOcrAnswerRows(pageJson, sourceName).map((item) => ({
        ...item,
        source_type: entry.source_type,
        sourcePdf: rel(cfg.workspaceRoot, pdfPath),
        sourceImage: rel(cfg.workspaceRoot, page.image),
      })));
    }
    items.push(...textItems, ...pageItems);
    pdfReports.push({
      pdf: rel(cfg.workspaceRoot, pdfPath),
      source_type: entry.source_type,
      pypdfStatus: parsed.pypdfStatus,
      textCharCount: parsed.textCharCount,
      rapidocrStatus: parsed.rapidocrStatus,
      renderedPageCount: (parsed.pages || []).length,
      itemCount: textItems.length + pageItems.length,
      status: "ok",
    });
  }

  const report = {
    stage: "08D-answer-source-ocr",
    generatedAt: new Date().toISOString(),
    pdfCount: pdfEntries.length,
    itemCount: items.length,
    pypdfZeroFallbackCount: pdfReports.filter((item) => item.textCharCount === 0 && item.rapidocrStatus === "ok").length,
    rapidOcrPdfCount: pdfReports.filter((item) => item.rapidocrStatus === "ok").length,
    pdfReports,
    items,
    status: pdfEntries.length ? "ok" : "manual_review",
  };
  await writeJson(path.join(reportsDir, "answer_source_ocr_report.json"), report);
  await updatePipelineBookSummary(cfg, {
    answer_source_ocr_pdf_count: report.pdfCount,
    answer_source_ocr_item_count: report.itemCount,
    answer_source_ocr_pypdf_zero_fallback_count: report.pypdfZeroFallbackCount,
  });
  return report;
}
