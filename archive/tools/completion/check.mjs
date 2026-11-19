#!/usr/bin/env node
// Read-only completeness inventory, not mathematics or visual correctness QA.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import runtime from '../../../tools/4slot/build-4slot-runtime.cjs';
import { loadActiveMetaRegistry } from '../meta-foundation/active-registry.mjs';
import { questionAssetReferences, localAssetPath } from '../archive-content-inputs.mjs';
import { sourceFingerprint } from '../meta-foundation/source-delta.mjs';
import { classifyItem, summarize, COLUMNS } from './lib.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const key = r => `${r.sourceArchiveFile}#${r.sourceOrdinal}`;
const group = rows => { const out = new Map(); for(const r of rows || []) { const k=key(r); if(!out.has(k))out.set(k,[]);out.get(k).push(r); } return out; };
export function parseArgs(args) {
  const o={exams:[],scope:null,all:false,format:'tsv',out:null,require:null};
  for(let i=0;i<args.length;i++) {
    const a=args[i]; if(a==='--all'){o.all=true;continue;} if(a==='--help'){o.help=true;continue;}
    if(!['--exam','--scope','--format','--out','--require'].includes(a))throw Error('Unknown argument: '+a);
    const v=args[++i];if(!v||v.startsWith('--'))throw Error('Missing value: '+a);
    if(a==='--exam')o.exams.push(v);else o[a.slice(2)]=v;
  }
  if(!['json','tsv'].includes(o.format))throw Error('--format must be json or tsv');
  if(o.require && o.require!=='complete')throw Error('--require must be complete');
  if(!o.help && Number(o.all)+Number(o.scope!==null)+Number(o.exams.length>0)!==1)throw Error('Choose exactly one of --exam (repeatable), --scope, --all');
  return o;
}
const inside=(root,p)=>{const r=path.relative(root,p);return r===''||(!r.startsWith('..'+path.sep)&&r!=='..'&&!path.isAbsolute(r));};
export function outputPath(out,root=ROOT) {
  const p=path.resolve(out), realRoot=fs.realpathSync(root);
  // Resolve the closest existing ancestor, including symlinks, before writing.
  let ancestor=p;while(!fs.existsSync(ancestor)){const up=path.dirname(ancestor);if(up===ancestor)throw Error('Output ancestor unavailable');ancestor=up;}
  const actual=path.resolve(fs.realpathSync(ancestor),path.relative(ancestor,p));
  if(inside(path.resolve(root),p)||inside(realRoot,actual))throw Error('Output must be outside repository');
  // Also reject any *other* checkout (including this worktree common root).
  try { execFileSync('git',['-C',fs.statSync(ancestor).isDirectory()?ancestor:path.dirname(ancestor),'rev-parse','--show-toplevel'],{stdio:['ignore','pipe','ignore']});throw Error('Output must be outside repository'); }
  catch(e){if(e.message==='Output must be outside repository')throw e;}
  return p;
}
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(e=>e.isSymbolicLink()?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const normalize=p=>p.replaceAll('\\','/').replace(/^archive\/exams\//,'');
export function selectFiles(o,root=ROOT) {
  const base=path.join(root,'archive/exams');
  const validate=rel=>{if(!rel||path.isAbsolute(rel)||rel.split('/').some(x=>x==='..'||x==='.'||!x))throw Error('Unsafe exam path');return rel;};
  if(o.exams.length)return [...new Set(o.exams.map(x=>validate(normalize(x))))].sort().map(rel=>{if(!rel.endsWith('.js'))throw Error('Exam must be .js');const p=path.join(base,rel);if(!inside(fs.realpathSync(base),fs.realpathSync(p)))throw Error('Exam symlink escapes repository');return rel;});
  const scope=o.scope===null?'':validate(normalize(o.scope));
  const files=walk(base).filter(f=>f.endsWith('.js')).map(f=>path.relative(base,f).split(path.sep).join('/')).filter(f=>f.startsWith(scope));
  if(!files.length)throw Error('No exam files matched');return files;
}
// XML/root validity of SVG text, same non-network ElementTree parser as verify-archive-content-scope.mjs,
// restricted to XML/root validity (not visual/semantic SVG checks). One python process validates a whole
// batch; a broken SVG is reported only when the parser itself raised ParseError (or the root is not svg).
const XML_SCRIPT = "import sys,json,base64,xml.etree.ElementTree as E\nout=[]\nfor b in json.load(sys.stdin):\n    try:\n        r=E.fromstring(base64.b64decode(b))\n        out.append(r.tag.split('}')[-1]=='svg')\n    except E.ParseError:\n        out.append(False)\n    except Exception:\n        out.append(None)\nprint(json.dumps(out))";
export const PYTHON_CANDIDATES = Object.freeze([['python3'], ['python']]);
const b64 = s => Buffer.from(s).toString('base64');
let pythonCommand = null;
// Runs the real batch script on known inputs, so a Microsoft Store stub or a broken install is detected here
// and never turned into "every SVG is broken".
export function probePython(candidates = PYTHON_CANDIDATES) {
  const failures = [];
  for (const [cmd, ...pre] of candidates) {
    const p = spawnSync(cmd, [...pre, '-I', '-c', XML_SCRIPT], { input: JSON.stringify([b64('<svg/>'), b64('<svg><g></svg>')]), encoding: 'utf8', timeout: 20000 });
    let ok = false;
    try { ok = !p.error && p.status === 0 && JSON.stringify(JSON.parse(p.stdout)) === '[true,false]'; } catch { ok = false; }
    if (ok) return [cmd, ...pre];
    failures.push(`${cmd}: ${p.error ? p.error.code || p.error.message : 'exit ' + p.status}`);
  }
  throw Error('PYTHON_UNAVAILABLE: python3/python cannot parse XML (' + failures.join('; ') + '). SVG validity cannot be checked on this machine; this is an environment problem, not an SVG defect.');
}
const getPython = () => pythonCommand ||= probePython();
const xmlResults = new Map();
const sha1 = b => crypto.createHash('sha1').update(b).digest('hex');
export function validateXmlBatch(buffers, chunkSize = 300) {
  const todo = [...new Map(buffers.map(b => [sha1(b), b])).entries()].filter(([k]) => !xmlResults.has(k));
  if (!todo.length) return;
  const [cmd, ...pre] = getPython();
  for (let i = 0; i < todo.length; i += chunkSize) {
    const chunk = todo.slice(i, i + chunkSize), input = JSON.stringify(chunk.map(([, b]) => b.toString('base64')));
    let timeout = 30000 + 200 * chunk.length, p;
    for (let attempt = 0; attempt < 2; attempt++) {
      p = spawnSync(cmd, [...pre, '-I', '-c', XML_SCRIPT], { input, encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024 });
      if (!p.error || p.error.code !== 'ETIMEDOUT') break;
      timeout *= 2;
    }
    let out;
    try { out = JSON.parse(p.stdout); } catch { out = null; }
    if (p.error || p.status !== 0 || !Array.isArray(out) || out.length !== chunk.length || out.includes(null)) throw Error('XML_CHECK_FAILED: python could not evaluate SVG batch (' + (p.error ? p.error.code || p.error.message : 'exit ' + p.status) + ')');
    chunk.forEach(([k], j) => xmlResults.set(k, out[j] === true));
  }
}
function xmlValid(input, collector) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input));
  const k = sha1(buf);
  if (collector) { collector.set(k, buf); return true; }
  if (!xmlResults.has(k)) validateXmlBatch([buf]);
  return xmlResults.get(k);
}
const deepStrings = (v, out = [], seen = new Set()) => {
  if (typeof v === 'string') out.push(v);
  else if (v && typeof v === 'object' && !seen.has(v)) { seen.add(v); for (const x of Array.isArray(v) ? v : Object.values(v)) deepStrings(x, out, seen); }
  return out;
};
// Depth-aware <svg>…</svg> extraction (nested svg stays in its outer element); self-closing <svg …/> is whole.
function extractSvgs(s) {
  const out = [], re = /<svg\b[^>]*?(\/?)>|<\/svg\s*>/gi;
  let depth = 0, start = -1, opened = 0, m;
  while ((m = re.exec(s))) {
    if (m[0][1] === '/') { if (depth > 0 && --depth === 0) { out.push(s.slice(start, re.lastIndex)); start = -1; } }
    else if (m[1] === '/') { opened++; if (depth === 0) out.push(m[0]); }
    else { opened++; if (depth++ === 0) start = m.index; }
  }
  if (depth > 0) out.push(s.slice(start));
  if ((s.match(/<svg\b/gi) || []).length > opened) out.push('<svg>');
  return out;
}
const imgSrc = tag => { const m = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i); const v = m ? (m[1] ?? m[2] ?? (m[3] || '').replace(/\/+$/, '')) : ''; return v.trim(); };
export function figureFacts(question, root, cache = new Map(), collector = null) {
  const refs = questionAssetReferences(question).filter(r => !r.startsWith('#'));
  for (const k of ['images', 'solutionImages']) for (const r of question[k] || []) if (typeof r === 'string') refs.push(r);
  const inline = [], missing = [], broken = [], remote = [];
  let tags = 0;
  for (const v of deepStrings(question)) {
    inline.push(...extractSvgs(v));
    for (const t of v.match(/<img\b[^>]*>/gi) || []) { tags++; const src = imgSrc(t); if (src) refs.push(src); else missing.push('IMG_NO_SRC'); }
  }
  for (const k of ['svg', 'figureSvg', 'solutionFigureSvg']) if (typeof question[k] === 'string' && question[k].trim() && !extractSvgs(question[k]).length) inline.push(question[k]);
  for (const ref of new Set(refs)) {
    if (/^data:/i.test(ref)) {
      const m = ref.match(/^data:(image\/[a-z0-9.+-]+)(;base64)?,([\s\S]*)$/i);
      try {
        if (!m) throw Error('INVALID_DATA_IMAGE');
        const bytes = m[2] ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]));
        if (!bytes.length) throw Error('EMPTY_DATA_IMAGE');
        if (m[1].toLowerCase() === 'image/svg+xml' && !xmlValid(bytes, collector)) broken.push('DATA_SVG');
      } catch (e) { if (/^XML_CHECK_FAILED|^PYTHON_UNAVAILABLE/.test(e.message)) throw e; missing.push('INVALID_DATA_IMAGE'); }
      continue;
    }
    let rel; try { rel = localAssetPath(ref); } catch { missing.push(ref); continue; }
    if (!rel) { remote.push(ref); continue; }
    if (!cache.has(rel)) {
      const full = path.join(root, rel); let state = 'OK';
      if (!fs.existsSync(full) || !fs.statSync(full).isFile() || fs.statSync(full).size === 0) state = 'FILE_MISSING';
      else if (!inside(fs.realpathSync(root), fs.realpathSync(full))) state = 'FILE_MISSING';
      else if (/\.svg$/i.test(full) && !xmlValid(fs.readFileSync(full), collector)) state = 'BROKEN_SVG';
      cache.set(rel, state);
    }
    if (cache.get(rel) === 'FILE_MISSING') missing.push(rel);
    if (cache.get(rel) === 'BROKEN_SVG') broken.push(rel);
  }
  for (const svg of inline) if (!xmlValid(svg, collector)) broken.push('INLINE_SVG');
  // Remote existence cannot be established by this read-only local inventory; fail closed.
  const state = missing.length || remote.length ? 'FILE_MISSING' : broken.length ? 'BROKEN_SVG' : refs.length || inline.length || tags ? 'OK' : 'NOT_NEEDED';
  return { state, missing, broken, unverifiedRemote: remote };
}
// Validates every SVG of a bank in one python process before the per-question pass.
export function prefetchSvgValidation(bank, root) {
  const collector = new Map(), cache = new Map();
  for (const q of bank) figureFacts(q, root, cache, collector);
  validateXmlBatch([...collector.values()]);
}
export function buildReport(o,root=ROOT) {
  const start=performance.now(), files=selectFiles(o,root);
  getPython();
  const metadata=read(path.join(root,'archive/data/question_metadata.json')), identity=read(path.join(root,'archive/data/question_identity_map.json'));
  const byMeta=group(metadata.records),byId=group(identity.records),uidCounts=new Map();for(const r of identity.records||[])uidCounts.set(r.questionUid,(uidCounts.get(r.questionUid)||0)+1);
  const registry=loadActiveMetaRegistry(root);
  const tags=read(path.join(root,'archive/data/master_tables/js_archive_tag_master.json'));
  const unitLabels=new Map(),subUnitLabels=new Map();for(const r of tags){if(r.status!=='active')continue;if(r.keyType==='standardUnitKey')unitLabels.set(r.key,{label:r.labelKo});if(r.keyType==='subUnitKey')subUnitLabels.set(r.key,{label:r.subUnit||r.labelKo,parent:r.standardUnitKey});}
  const saved=read(path.join(root,runtime.OUTPUT));
  // Reuse the production read-only builder, including payload/asset freshness and continuity
  // exceptions. Never call run(--write); never turn a freshly eligible row into REGISTERED.
  const live=runtime.build(root,{previous:saved}).index;
  const registered=group(saved.records),fresh=group(live.records);
  const pending=new Map();for(const p of live.pending||[]){const k=p.path+'#'+(p.ordinal||'*');if(!pending.has(k))pending.set(k,[]);pending.get(k).push(p.reason);}
  const assetCache=new Map(),rows=[],byExam=[];
  for(const file of files) {
    const full=path.join(root,'archive/exams',file),raw=fs.readFileSync(full),bank=runtime.loadBank(raw);
    prefetchSvgValidation(bank,root);
    const compactPath='archive/data/item-4slot/'+file.replace(/\.js$/,'.4slot.json'),compactFull=path.join(root,compactPath);
    const compact=fs.existsSync(compactFull)?read(compactFull):null;
    const written=new Map((compact?.items||[]).map(it=>[it.ordinal,it]));
    const oldFile=(saved.files||[]).find(f=>f.path===compactPath);
    const examRows=[];
    for(let i=0;i<bank.length;i++) {
      const q=bank[i],ordinal=i+1,k=file+'#'+ordinal,ids=byId.get(k)||[],metas=byMeta.get(k)||[];
      const id=ids[0],meta=metas.length===1?metas[0]:{};
      const identityValid=ids.length===1&&uidCounts.get(id.questionUid)===1&&metas.length===1&&meta.questionUid===id.questionUid;
      const display=Number(q.id)||Number(q.number)||ordinal;
      const reasons=[...(pending.get(compactPath+'#'+display)||[]),...(pending.get(compactPath+'#*')||[])];
      const liveRows=fresh.get(k)||[],savedRows=registered.get(k)||[];
      let fourSlot='MISSING';
      if(written.has(display)) {
        if(reasons.some(r=>/STALE|BASELINE|SOURCE_UID|IDENTITY|NUMBER_MISMATCH/.test(r)))fourSlot='STALE';
        else if(identityValid && oldFile?.compactSha256 === runtime.sha(fs.readFileSync(compactFull)) && liveRows.some(r=>r.questionUid===id.questionUid) && savedRows.some(r=>r.questionUid===id.questionUid && r.compactPath===compactPath))fourSlot='REGISTERED';
        else fourSlot='WRITTEN';
      }
      const facts=figureFacts(q,root,assetCache);
      const result=classifyItem({question:q,meta,unitLabels,subUnitLabels,registry,figure:facts.state,fourSlot,identityValid,fourSlotReasons:reasons});
      // Exact source fingerprints are reused; no inferred reapproval or forced normalization.
      const sourceFingerprintMatches = meta.sourceFingerprint === sourceFingerprint(q);
      const row={sourceArchiveFile:file,sourceOrdinal:ordinal,sourceQuestionNo:String(q.id??q.number??ordinal),questionUid:id?.questionUid||null,...result,sourceFingerprintMatches,figureDetails:facts,fourSlotReasons:reasons};
      rows.push(row);examRows.push(row);
    }
    byExam.push({sourceArchiveFile:file,...summarize(examRows)});
  }
  const warnings=reportWarnings(registry.errors,registry.status,rows);
  return {schemaVersion:'archive-completion-check-v1',warnings,note:'칸별 부족 수는 서로 겹칩니다. overall 합계는 전체 문항 수와 같습니다. 수학적 정확성과 그림-문제 일치는 판정하지 않습니다.',elapsedSeconds:(performance.now()-start)/1000,sourceMutation:false,registryDiagnostics:registry.errors,limitations:['Remote assets are not fetched and are reported FILE_MISSING with unverifiedRemote detail.','Source fingerprints are compared only; no historical classification or mathematical judgment is inferred.'],summary:{exams:files.length,...summarize(rows)},byExam,rows};
}
// Environment problems that make a result untrustworthy; shown in summary head, stderr and --require failures.
export function reportWarnings(registryErrors,registryStatus,rows) {
  const w=[];
  if((registryErrors||[]).length||(registryStatus&&registryStatus!=='ACTIVE'))w.push('REGISTRY_UNAVAILABLE: the active meta registry could not be read ('+((registryErrors||[]).join(', ')||registryStatus)+'). The type column is REGISTRY_UNAVAILABLE for rows with type keys and no row can be COMPLETE. This is an environment problem, not a data defect.');
  if(!rows.length)w.push('NO_QUESTIONS: the selection contains no questions, so nothing was verified.');
  return w;
}
export function requireFailure(r) {
  const bad=r.rows.filter(x=>x.overall!=='COMPLETE').length;
  if(!bad&&r.rows.length)return null;
  return `--require complete FAILED: ${bad} of ${r.rows.length} questions are not COMPLETE`+((r.warnings||[]).length?' ['+r.warnings.join(' | ')+']':'');
}
export function formatReport(r,format) {
  if(format==='json')return JSON.stringify(r,null,2)+'\n';
  const lines=['# '+r.note,...(r.warnings||[]).map(w=>'# WARNING\t'+w),'# SUMMARY\t'+JSON.stringify(r.summary),'# REGISTRY_DIAGNOSTICS\t'+JSON.stringify(r.registryDiagnostics)];
  for(const e of r.byExam)lines.push('# EXAM\t'+JSON.stringify(e));
  const cols=['sourceArchiveFile','sourceOrdinal','questionUid',...COLUMNS,'inlineDiffers'];lines.push(cols.join('\t'));
  for(const row of r.rows)lines.push(cols.map(k=>Array.isArray(row[k])?row[k].join(','):String(row[k]??'').replace(/[\t\r\n]/g,' ')).join('\t'));
  return lines.join('\n')+'\n';
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {const o=parseArgs(process.argv.slice(2));if(o.help){console.log('Read-only, not mathematical/visual QA. --exam archive/exams/...js (repeatable) | --scope original/middle/m3/1 | --all; --format json|tsv; --out OUTSIDE_REPOSITORY; --require complete (also fails on an empty selection). Columns: stem/answer: OK|MISSING|BOILERPLATE(placeholder); solution: OK|MISSING|BOILERPLATE; figure: OK|NOT_NEEDED|FILE_MISSING|BROKEN_SVG; unit: APPROVED|RECORDED|LABEL_MISMATCH|MISSING; difficulty: APPROVED|NUMBER_ONLY|INVALID|MISSING; type: APPROVED|RECORDED|HOLD|INVALID|REGISTRY_UNAVAILABLE|MISSING; fourSlot: REGISTERED|WRITTEN|STALE|MISSING; overall: COMPLETE|PENDING_REGISTER|IN_PROGRESS|BLOCKED. Needs a working python3/python (XML parser).');}
  else {const out=o.out?outputPath(o.out):null;const r=buildReport(o);const data=formatReport(r,o.format);if(out)fs.writeFileSync(out,data,{encoding:'utf8',flag:'w'});else process.stdout.write(data);for(const w of r.warnings)console.error('COMPLETION_CHECK WARNING: '+w);if(o.require==='complete'){const why=requireFailure(r);if(why){console.error('COMPLETION_CHECK: '+why);process.exitCode=1;}}}}
  catch(e){console.error('COMPLETION_CHECK: '+e.message);process.exitCode=2;}
}
