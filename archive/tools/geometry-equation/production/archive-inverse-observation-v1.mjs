import fs from 'node:fs';
import path from 'node:path';
import {canonicalPointNameText} from './point-names.mjs';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha,canonicalJson,safePath} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {assetIdentity} from './contracts.mjs';
import {specFor} from './phase2.mjs';
import {compositePanels,captionText,COMPOSITE_SVG_VERSION,compositeHeaderLabels,isNumberLinePanel} from './composite-candidate-svg-v1.mjs';
import {numberLineSpec,numberLineLabelTexts} from './quadratic-inequality-chain-v1.mjs';

export const PACKET_VERSION='archive-inverse-observation-packet-v1';
export const RECORD_VERSION='archive-inverse-observation-record-v1';
export const FREEZE_VERSION='archive-inverse-observation-freeze-v1';
export const BINDING_VERSION='archive-inverse-observation-binding-v1';
const CAPTURE_VERSION='construction-archive-capture-v1',COMPOSED_VERSION='construction-candidate-svg-v1';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const HASH=/^sha256:[0-9a-f]{64}$/;
const PNG_SIGNATURE=Buffer.from('89504e470d0a1a0a','hex');
const CAPTURE_SCOPE='.tmp/archive/';// where captureArchiveCandidate writes
const OBSERVATION_FILE='observation.json',FREEZE_FILE='observation.freeze.json',PACKET_FILE='packet.json';
const MANIFEST_FILES=['context.png','image.png','instructions.md','observation.schema.json'];
const PACKET_INPUT_NAMES=[...MANIFEST_FILES,PACKET_FILE].sort();// what an observer may say it read
const ALLOWED_NAMES=new Set([...PACKET_INPUT_NAMES,OBSERVATION_FILE,FREEZE_FILE]);
const AGENT_KINDS=['codex','claude-code','antigravity','other'];// descriptive only: nothing below branches on it
const ISOLATIONS=['INSTRUCTED_NOT_ENFORCED','ENFORCED'];
const GEOMETRY_TOLERANCE=1e-9;// relative; the model values are float64 approximations of exact numbers
export const OBSERVATION_LIMITS=Object.freeze({fileBytes:262144,text:120,free:500,model:100,sessionRef:200,inputName:200,inputsRead:20,through:50,labels:200,segments:200,lines:100,circles:50,rightAngles:50,otherMarks:100,readability:100,unobservable:100});
const LIMITS=OBSERVATION_LIMITS;
const CATEGORIES=['labels','segments','lines','circles','rightAngles'];

// Neutral on purpose: it names no figure, label, plan, count or verdict. Every observer, whatever the tool, is given exactly this text.
export const INSTRUCTIONS=`# 역관측 지침

이 디렉터리는 학생 화면에서 캡처한 그림의 관측 packet이다.
파일: image.png (그림만), context.png (그림과 주변 화면), observation.schema.json (기록 형식), packet.json.
당신은 그림에 실제로 보이는 것을 있는 그대로 옮겨 적는 관측자다. 어떤 도구와 모델이 맡아도 같은 지침을 따른다.

## 쓰는 방법
1. image.png와 context.png를 직접 열어 본다. 그림에 대한 항목(labels, segments, lines, circles, rightAngles, otherMarks)은 image.png의 그림에서만 읽는다.
   context.png는 그림이 주변 화면 안에서 어떻게 놓여 읽히는지(겹침, 잘림, 크기)를 볼 때 쓴다. 주변의 본문이나 해설 글자는 labels에 적지 않는다. 그림이 주변과 겹치거나 가려지는 문제는 readability에 적는다.
2. 이 디렉터리에 observation.json 한 개를 한 번만 쓴다. 형식은 observation.schema.json을 그대로 따른다.
3. schemaVersion에는 스키마의 상수를, packetSha256에는 packet.json의 packetSha256 값을 그대로 적는다.
4. observer에는 agentKind(codex, claude-code, antigravity, other 중 하나), model, sessionRef(이 세션을 알아볼 수 있는 짧은 참조), isolation, inputsRead(실제로 연 packet 파일 이름 목록)를 적는다.
   격리는 이 지침으로만 요청된 것이고 시스템이 강제하지 않으므로 isolation은 INSTRUCTED_NOT_ENFORCED로 적는다. 시스템이 강제했다고 확인한 경우에만 ENFORCED로 적는다.
5. observedAt에는 지금 시각을 ISO 8601로 적는다.

## 무엇을 적는가
- labels: 그림에 보이는 글자 label을 보이는 그대로, 나타난 횟수만큼 한 항목씩 적는다. 같은 글자가 두 곳에 있으면 두 항목이다. 축 이름, 눈금 숫자, 점 이름, 좌표, 길이나 식 label을 모두 포함한다. 수식은 한 줄의 글자로 적는다(분수는 1/2, 제곱근은 √(3), 거듭제곱은 x^(2), 곱셈은 ·처럼). 번역하거나 고쳐 쓰지 않는다.
- segments: label이 붙은 두 끝점 사이에 이어진 선분마다 between에 두 끝점의 label 두 개를 적는다. 끝점 label은 그 점의 이름 label(labels에 적은 글자)이다.
- lines: 화면 양쪽으로 길게 뻗은 직선마다, 그 직선 위에 보이는 label 붙은 점의 label을 through에 모두 적는다. 지나는 label 점이 없으면 빈 목록이다.
- circles: 원마다 중심 점의 label을 center에(중심에 label 붙은 점이 없으면 null), 원 위에 보이는 label 붙은 점의 label을 through에 모두 적는다.
- rightAngles: 직각 표시마다 꼭짓점 점의 label을 at에 적는다.
- otherMarks: 위 어디에도 속하지 않는 표식을 말로 설명한다. 좌표축과 눈금 표시는 lines에 쓰지 말고 여기에 설명한다(축 이름과 눈금 숫자는 labels에 적는다). 점선, 화살표, 호, 음영 등도 여기에 적는다.
- readability: 읽기 어려운 곳(겹친 글자, 선에 가린 글자, 너무 작은 글자 등)을 issue로, 해당 label을 target으로(없으면 null) 적는다.
- unobservable: 판독하지 못했거나 판단할 수 없었던 것을 적는다. 끝점에 label이 없어 이름을 붙일 수 없는 선분이 그 예다.

## 하지 말 것
- 이 디렉터리 밖의 파일, 저장소, SVG 소스, 이전 대화를 보거나 쓰지 않는다. 이 packet의 파일만으로 적는다.
- PASS/FAIL, 맞다/틀리다 같은 판정을 쓰지 않는다. 스키마에 없는 필드를 만들지 않는다.
- 좌표, 길이, 각도를 화면에서 추정해 적지 않는다. 그림에 글자로 적힌 값을 옮기는 것은 labels의 일이다.
- 그려져 있어야 할 것을 짐작해서 보태거나 고치지 않는다. 이상해 보여도 그려진 그대로 적는다.
- observation.json을 쓴 뒤에는 고치지 않는다. 쓰는 즉시 해시로 고정되며, 고친 기록은 거부된다.
`;

const text=max=>({type:'string',minLength:1,maxLength:max});
const array=(items,max,extra={})=>({type:'array',items,maxItems:max,...extra});
const object=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const nullable=schema=>({anyOf:[schema,{type:'null'}]});
export const OBSERVATION_SCHEMA=Object.freeze({
  $schema:'https://json-schema.org/draft/2020-12/schema',title:RECORD_VERSION,
  ...object({
    schemaVersion:{const:RECORD_VERSION},
    packetSha256:{type:'string',pattern:'^sha256:[0-9a-f]{64}$',description:'copy of packetSha256 in packet.json'},
    observer:object({
      agentKind:{enum:AGENT_KINDS},model:text(LIMITS.model),sessionRef:text(LIMITS.sessionRef),isolation:{enum:ISOLATIONS},
      inputsRead:array(text(LIMITS.inputName),LIMITS.inputsRead,{minItems:1,uniqueItems:true,description:'names of the packet files actually opened'})
    }),
    observedAt:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{1,9})?(Z|[+-]\\d{2}:\\d{2})$',description:'ISO 8601'},
    labels:array(object({text:text(LIMITS.text)}),LIMITS.labels),
    segments:array(object({between:array(text(LIMITS.text),2,{minItems:2})}),LIMITS.segments),
    lines:array(object({through:array(text(LIMITS.text),LIMITS.through,{uniqueItems:true})}),LIMITS.lines),
    circles:array(object({center:nullable(text(LIMITS.text)),through:array(text(LIMITS.text),LIMITS.through,{uniqueItems:true})}),LIMITS.circles),
    rightAngles:array(object({at:text(LIMITS.text)}),LIMITS.rightAngles),
    otherMarks:array(object({description:text(LIMITS.free)}),LIMITS.otherMarks),
    readability:array(object({issue:text(LIMITS.free),target:nullable(text(LIMITS.text))}),LIMITS.readability),
    unobservable:array(object({description:text(LIMITS.free)}),LIMITS.unobservable)
  })
});
const SCHEMA_TEXT=JSON.stringify(OBSERVATION_SCHEMA,null,2)+'\n';

// Internal control flow only: every domain outcome is returned as a status; anything else is a defect and propagates.
class Stop extends Error{constructor(status,detail=null){super(status);this.status=status;this.detail=detail;}}
const flags=()=>({numericAccuracy:'OUT_OF_SCOPE_PRIMITIVE_OBSERVER',qualification:'NOT_RUN',publication:'NOT_RUN',productionAuthorized:false});
const refuse=(schemaVersion,error)=>{if(!(error instanceof Stop))throw error;return {schemaVersion,status:error.status,detail:error.detail,...flags()};};
const isPlain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const sameJson=(a,b)=>canonicalJson(a)===canonicalJson(b);
const compareKeys=(a,b)=>{const x=canonicalJson(a),y=canonicalJson(b);return x<y?-1:x>y?1:0;};
// A domain refusal is a plain Error whose message is an UPPER_SNAKE code (optionally ':detail'); TypeError and friends are defects.
const isDomainCode=error=>error?.constructor===Error&&/^[A-Z][A-Z0-9_]*(?::|$)/.test(error.message);

/**
 * The only text normalization used when comparing what an observer wrote with what the spec displays: Unicode NFC, removal of all white space,
 * the minus/hyphen look-alikes U+2010, U+2011, U+2212, U+FE63, U+FF0D mapped to ASCII '-', and a radical over one token written either way:
 * √(2) or √(a) becomes √2 or √a, only when no Unicode letter, digit or '(' follows (√(2)x and √(2)π stay as written). Nothing else (no case folding, no NFKC, no en or em dash).
 */
export const normalizeObservedText=value=>canonicalPointNameText(value.normalize('NFC')).replace(/\s+/gu,'').replace(/[‐‑−﹣－]/gu,'-').replace(/√\(([0-9]+|[A-Za-z])\)(?![\p{L}\p{N}(])/gu,'√$1');
const norm=normalizeObservedText;

// --- capture ---------------------------------------------------------------------------------------------------------------------------------
// A packet is made only from an ARCHIVE_BOUND capture without a caller hook. With `files` the two screenshots and the raw Archive row are also read and checked
// against the lineage.
function checkCapture(capture,{files=false}={}){
  const bad=(reason,extra)=>{throw new Stop('CAPTURE_INPUT_INVALID',{reason,...extra});};
  if(!isPlain(capture))bad('NOT_AN_OBJECT');
  if(capture.schemaVersion!==CAPTURE_VERSION)bad('SCHEMA_VERSION');
  if(capture.status!=='ARCHIVE_BOUND')bad('STATUS_NOT_ARCHIVE_BOUND');
  if(capture.evidenceIntegrity!=='NO_CALLER_HOOK')bad('EVIDENCE_NOT_NO_CALLER_HOOK');
  if(!isPlain(capture.checks)||!Object.keys(capture.checks).length||!Object.values(capture.checks).every(value=>value==='PASS'))bad('CHECKS_NOT_PASS');
  const lineage=capture.lineage;
  if(!isPlain(lineage))bad('LINEAGE_MISSING');
  for(const field of ['l1SvgSha256','assetResponseSha256','archiveRowSha256'])if(!HASH.test(lineage[field]))bad('LINEAGE_HASH_INVALID',{field});
  const shots=lineage.screenshotSha256s;
  if(!isPlain(shots)||!HASH.test(shots.image)||!HASH.test(shots.context)||!Object.values(shots).every(value=>HASH.test(value)))bad('LINEAGE_HASH_INVALID',{field:'screenshotSha256s'});
  if(lineage.assetResponseSha256!==lineage.l1SvgSha256)bad('ASSET_RESPONSE_NOT_L1_BYTES');// the Archive must have received exactly the L1 bytes
  const binding={l1SvgSha256:lineage.l1SvgSha256,assetResponseSha256:lineage.assetResponseSha256,archiveRowSha256:lineage.archiveRowSha256,screenshotSha256s:{...shots}};
  const bytes={};
  // a file the capture names must sit under .tmp/archive/ (where captureArchiveCandidate writes) and hash to what the lineage says
  const bound=(label,relative,sha,extra)=>{
    if(typeof relative!=='string'||!relative)bad(label+'_PATH_INVALID',extra);
    if(!relative.startsWith(CAPTURE_SCOPE))bad(label+'_PATH_SCOPE',extra);
    let data;
    try{const file=safePath(root,relative);if(!fs.statSync(file).isFile())throw new Error('NOT_A_FILE');data=fs.readFileSync(file);}
    catch(error){bad(label+'_UNREADABLE',{...extra,code:String(error?.code??error?.message??error)});}
    if(bytesSha(data)!==sha)bad(label+'_SHA_MISMATCH',extra);
    return data;
  };
  if(files){
    for(const name of ['image','context']){
      bytes[name]=bound('SCREENSHOT',capture.paths?.screenshots?.[name],shots[name],{name});
      if(!bytes[name].subarray(0,8).equals(PNG_SIGNATURE))bad('SCREENSHOT_NOT_PNG',{name});
    }
    bound('ARCHIVE_ROW',capture.paths?.archiveRow,lineage.archiveRowSha256,{});
  }
  return {binding,bytes};
}

// --- packet ----------------------------------------------------------------------------------------------------------------------------------
const packetDirOf=value=>{if(typeof value!=='string'||!value)throw new Stop('PACKET_DIR_INVALID');return path.resolve(value);};
const writeNew=(file,data)=>fs.writeFileSync(file,data,{flag:'wx'});

/**
 * Write a new packet directory for one ARCHIVE_BOUND capture: the two captured PNGs byte for byte, the neutral instructions, the record schema and packet.json
 * (the manifest and its hash). Nothing about the plan, the expected facts or any verdict goes in. The directory must not exist.
 */
export async function prepareInverseObservationPacket({capture,packetDir}={}){
  try{
    const {binding,bytes}=checkCapture(capture,{files:true}),dir=packetDirOf(packetDir);
    fs.mkdirSync(path.dirname(dir),{recursive:true});
    try{fs.mkdirSync(dir);}catch(error){if(error.code==='EEXIST')throw new Stop('PACKET_DIR_EXISTS',{packetDir:dir});throw error;}
    const bodies={'context.png':bytes.context,'image.png':bytes.image,'instructions.md':Buffer.from(INSTRUCTIONS,'utf8'),'observation.schema.json':Buffer.from(SCHEMA_TEXT,'utf8')};
    const files=MANIFEST_FILES.map(name=>({name,bytes:bodies[name].length,sha256:bytesSha(bodies[name])}));
    for(const {name,sha256} of files){
      writeNew(path.join(dir,name),bodies[name]);
      if(bytesSha(fs.readFileSync(path.join(dir,name)))!==sha256)throw new Stop('PACKET_WRITE_MISMATCH',{name});
    }
    const manifest={schemaVersion:PACKET_VERSION,files,captureBinding:binding,instructionsSha256:files.find(file=>file.name==='instructions.md').sha256,schemaSha256:files.find(file=>file.name==='observation.schema.json').sha256};
    const packetSha256=objectSha(manifest);
    writeNew(path.join(dir,PACKET_FILE),JSON.stringify({packetSha256,manifest},null,2)+'\n');
    return {schemaVersion:PACKET_VERSION,status:'PACKET_READY',detail:null,packetDir:dir,packetSha256,manifest,...flags()};
  }catch(error){return refuse(PACKET_VERSION,error);}
}

function exactKeys(value,keys){return isPlain(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));}
// Everything a packet is: no file other than the manifest files, packet.json and (once they exist) the observer record and its freeze; every manifest file
// byte-equal to its entry; the manifest equal to its hash; and the two PNGs equal to the screenshots the capture bound.
function readPacket(dir){
  const bad=(reason,extra)=>{throw new Stop('PACKET_TAMPERED',{reason,...extra});};
  let stat;
  try{stat=fs.lstatSync(dir);}catch{bad('PACKET_DIR_MISSING');}
  if(!stat.isDirectory())bad('PACKET_DIR_MISSING');
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(!entry.isFile())bad('NOT_A_REGULAR_FILE',{name:entry.name});
    if(!ALLOWED_NAMES.has(entry.name))bad('EXTRA_FILE',{name:entry.name});
  }
  const packetPath=path.join(dir,PACKET_FILE);
  if(!fs.existsSync(packetPath))bad('PACKET_JSON_MISSING');
  const invalid=why=>bad('PACKET_JSON_INVALID',{why});
  let packet;
  try{if(fs.statSync(packetPath).size>1048576)invalid('TOO_LARGE');packet=JSON.parse(fs.readFileSync(packetPath,'utf8'));}
  catch(error){if(error instanceof Stop)throw error;invalid('NOT_JSON');}
  if(!exactKeys(packet,['packetSha256','manifest'])||!HASH.test(packet.packetSha256))invalid('PACKET_KEYS');
  const manifest=packet.manifest;
  if(!exactKeys(manifest,['schemaVersion','files','captureBinding','instructionsSha256','schemaSha256'])||manifest.schemaVersion!==PACKET_VERSION||!HASH.test(manifest.instructionsSha256)||!HASH.test(manifest.schemaSha256))invalid('MANIFEST_KEYS');
  if(!Array.isArray(manifest.files)||manifest.files.length!==MANIFEST_FILES.length||manifest.files.some((file,index)=>!exactKeys(file,['name','bytes','sha256'])||file.name!==MANIFEST_FILES[index]||!Number.isSafeInteger(file.bytes)||file.bytes<0||!HASH.test(file.sha256)))invalid('MANIFEST_FILES');
  const binding=manifest.captureBinding;
  if(!exactKeys(binding,['l1SvgSha256','assetResponseSha256','archiveRowSha256','screenshotSha256s'])||!['l1SvgSha256','assetResponseSha256','archiveRowSha256'].every(key=>HASH.test(binding[key]))||!isPlain(binding.screenshotSha256s)||!HASH.test(binding.screenshotSha256s.image)||!HASH.test(binding.screenshotSha256s.context)||!Object.values(binding.screenshotSha256s).every(value=>HASH.test(value)))invalid('CAPTURE_BINDING_SHAPE');
  let digest;
  try{digest=objectSha(manifest);}catch{invalid('MANIFEST_NOT_CANONICAL');}
  if(digest!==packet.packetSha256)bad('PACKET_SHA_MISMATCH',{recorded:packet.packetSha256,computed:digest});
  const files=new Map();
  for(const entry of manifest.files){
    let bytes;
    try{bytes=fs.readFileSync(path.join(dir,entry.name));}catch{bad('FILE_MISSING',{name:entry.name});}
    if(bytes.length!==entry.bytes||bytesSha(bytes)!==entry.sha256)bad('FILE_SHA_MISMATCH',{name:entry.name});
    files.set(entry.name,{...entry,data:bytes});
  }
  if(manifest.instructionsSha256!==files.get('instructions.md').sha256||manifest.schemaSha256!==files.get('observation.schema.json').sha256)invalid('MANIFEST_INCONSISTENT');
  for(const [name,key] of [['image.png','image'],['context.png','context']])if(files.get(name).sha256!==binding.screenshotSha256s[key])bad('IMAGE_NOT_CAPTURE',{name});
  return {packetSha256:packet.packetSha256,manifest};
}

// --- freeze ----------------------------------------------------------------------------------------------------------------------------------
// One read: the bytes that are hashed are the bytes that are used.
function readObservationFile(file){
  if(typeof file!=='string'||!file)return {error:'UNREADABLE'};
  try{
    const stat=fs.lstatSync(file);
    if(!stat.isFile())return {error:'UNREADABLE'};
    if(stat.size>LIMITS.fileBytes)return {error:'TOO_LARGE'};
    const bytes=fs.readFileSync(file);
    return bytes.length>LIMITS.fileBytes?{error:'TOO_LARGE'}:{bytes};
  }catch(error){return {error:error?.code==='ENOENT'?'MISSING':'UNREADABLE'};}
}
const packetDirOfExisting=value=>{if(typeof value!=='string'||!value)throw new Stop('PACKET_TAMPERED',{reason:'PACKET_DIR_MISSING'});return path.resolve(value);};

/**
 * Freeze the observer's record: the SHA-256 of its raw bytes, the time and the packet hash go into a new observation.freeze.json (exclusive create).
 * The content is not judged here. A second freeze, of the same or of a changed record, is refused: observation.freeze.json is never overwritten.
 */
export async function freezeInverseObservation({packetDir,observationPath}={}){
  try{
    const dir=packetDirOfExisting(packetDir),packet=readPacket(dir),freezePath=path.join(dir,FREEZE_FILE);
    if(fs.existsSync(freezePath))throw new Stop('FREEZE_EXISTS',{path:freezePath});
    const observation=readObservationFile(observationPath);
    if(!observation.bytes)throw new Stop('OBSERVATION_INVALID',{reason:observation.error==='TOO_LARGE'?'TOO_LARGE':'FILE_UNREADABLE',path:'$'});
    const observationSha256=bytesSha(observation.bytes);
    const body=Buffer.from(JSON.stringify({schemaVersion:FREEZE_VERSION,packetSha256:packet.packetSha256,observationSha256,observationBytes:observation.bytes.length,frozenAt:new Date().toISOString()},null,2)+'\n','utf8');
    try{writeNew(freezePath,body);}catch(error){if(error.code==='EEXIST')throw new Stop('FREEZE_EXISTS',{path:freezePath});throw error;}
    return {schemaVersion:FREEZE_VERSION,status:'FROZEN',detail:null,freezeRef:{path:freezePath,bytes:body.length,sha256:bytesSha(body)},packetSha256:packet.packetSha256,observationSha256,...flags()};
  }catch(error){return refuse(FREEZE_VERSION,error);}
}
function readFreeze(dir,packet){
  const freezePath=path.join(dir,FREEZE_FILE);
  if(!fs.existsSync(freezePath))throw new Stop('OBSERVATION_NOT_FROZEN',{reason:'NO_FREEZE_FILE'});
  let bytes,freeze;
  try{
    bytes=fs.readFileSync(freezePath);freeze=JSON.parse(bytes.toString('utf8'));
    if(!exactKeys(freeze,['schemaVersion','packetSha256','observationSha256','observationBytes','frozenAt'])||freeze.schemaVersion!==FREEZE_VERSION||!HASH.test(freeze.packetSha256)||!HASH.test(freeze.observationSha256)||!Number.isSafeInteger(freeze.observationBytes)||typeof freeze.frozenAt!=='string')throw new Error('FREEZE_SHAPE');
  }catch{throw new Stop('OBSERVATION_NOT_FROZEN',{reason:'FREEZE_UNREADABLE'});}
  if(freeze.packetSha256!==packet.packetSha256)throw new Stop('OBSERVATION_NOT_FROZEN',{reason:'FREEZE_FOR_OTHER_PACKET',freezePacketSha256:freeze.packetSha256,packetSha256:packet.packetSha256});
  return {freeze,freezeSha256:bytesSha(bytes)};
}

// --- the observer's record -------------------------------------------------------------------------------------------------------------------
const CONTROL=/[\u0000-\u001f\u007f]/u,FREE_CONTROL=/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;
const ISO=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;
// Exactly the schema above, nothing more: unknown fields (a verdict among them), missing fields, wrong types and over-long or over-large values are refused with the path.
function validateRecord(value){
  const fail=(reason,at,extra)=>{throw new Stop('OBSERVATION_INVALID',{reason,path:at,...extra});};
  const exact=(item,keys,at)=>{
    if(!isPlain(item))fail('NOT_AN_OBJECT',at);
    for(const key of Object.keys(item))if(!keys.includes(key))fail('UNKNOWN_FIELD',at+'.'+key);
    for(const key of keys)if(!Object.hasOwn(item,key))fail('MISSING_FIELD',at+'.'+key);
  };
  const string=(item,at,max,{free=false,identifier=false}={})=>{
    if(typeof item!=='string')fail('TYPE',at);
    if(!item.length)fail('EMPTY',at);
    if(item.length>max)fail('TOO_LONG',at);
    if((free?FREE_CONTROL:CONTROL).test(item))fail('CONTROL_CHAR',at);
    if(identifier&&!norm(item))fail('EMPTY_AFTER_NORMALIZATION',at);
  };
  const identifier=(item,at)=>string(item,at,LIMITS.text,{identifier:true});
  const list=(item,at,max,min=0)=>{if(!Array.isArray(item))fail('TYPE',at);if(item.length>max)fail('TOO_MANY',at);if(item.length<min)fail('TOO_FEW',at);};
  const members=(item,at,max)=>{list(item,at,max);item.forEach((entry,index)=>identifier(entry,at+'['+index+']'));if(new Set(item.map(norm)).size!==item.length)fail('DUPLICATE',at);};
  const each=(item,at,max,keys,check)=>{list(item,at,max);item.forEach((entry,index)=>{const here=at+'['+index+']';exact(entry,keys,here);check(entry,here);});};
  exact(value,['schemaVersion','packetSha256','observer','observedAt','labels','segments','lines','circles','rightAngles','otherMarks','readability','unobservable'],'$');
  if(value.schemaVersion!==RECORD_VERSION)fail('SCHEMA_VERSION','$.schemaVersion');
  if(typeof value.packetSha256!=='string'||!HASH.test(value.packetSha256))fail('FORMAT','$.packetSha256');
  const observer=value.observer;
  exact(observer,['agentKind','model','sessionRef','isolation','inputsRead'],'$.observer');
  if(!AGENT_KINDS.includes(observer.agentKind))fail('ENUM','$.observer.agentKind');
  string(observer.model,'$.observer.model',LIMITS.model);string(observer.sessionRef,'$.observer.sessionRef',LIMITS.sessionRef);
  if(!ISOLATIONS.includes(observer.isolation))fail('ENUM','$.observer.isolation');
  list(observer.inputsRead,'$.observer.inputsRead',LIMITS.inputsRead,1);
  observer.inputsRead.forEach((name,index)=>string(name,'$.observer.inputsRead['+index+']',LIMITS.inputName));
  if(new Set(observer.inputsRead).size!==observer.inputsRead.length)fail('DUPLICATE','$.observer.inputsRead');
  if(typeof value.observedAt!=='string'||!ISO.test(value.observedAt)||Number.isNaN(Date.parse(value.observedAt)))fail('FORMAT','$.observedAt');
  each(value.labels,'$.labels',LIMITS.labels,['text'],(entry,at)=>identifier(entry.text,at+'.text'));
  each(value.segments,'$.segments',LIMITS.segments,['between'],(entry,at)=>{
    if(!Array.isArray(entry.between))fail('TYPE',at+'.between');
    if(entry.between.length!==2)fail('LENGTH',at+'.between');
    entry.between.forEach((end,index)=>identifier(end,at+'.between['+index+']'));
  });
  each(value.lines,'$.lines',LIMITS.lines,['through'],(entry,at)=>members(entry.through,at+'.through',LIMITS.through));
  each(value.circles,'$.circles',LIMITS.circles,['center','through'],(entry,at)=>{if(entry.center!==null)identifier(entry.center,at+'.center');members(entry.through,at+'.through',LIMITS.through);});
  each(value.rightAngles,'$.rightAngles',LIMITS.rightAngles,['at'],(entry,at)=>identifier(entry.at,at+'.at'));
  each(value.otherMarks,'$.otherMarks',LIMITS.otherMarks,['description'],(entry,at)=>string(entry.description,at+'.description',LIMITS.free,{free:true}));
  each(value.readability,'$.readability',LIMITS.readability,['issue','target'],(entry,at)=>{string(entry.issue,at+'.issue',LIMITS.free,{free:true});if(entry.target!==null)identifier(entry.target,at+'.target');});
  each(value.unobservable,'$.unobservable',LIMITS.unobservable,['description'],(entry,at)=>string(entry.description,at+'.description',LIMITS.free,{free:true}));
  return value;
}
function parseRecord(bytes){
  let value;
  try{value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}// a leading UTF-8 BOM is dropped by the decoder; the hash is of the raw bytes either way
  catch{throw new Stop('OBSERVATION_INVALID',{reason:'NOT_JSON',path:'$'});}
  return validateRecord(value);
}
// One comparable form for what was seen and for what the spec displays: normalized, sets as sorted unique lists, segment ends as sorted pairs.
const sortItems=(category,items)=>category==='labels'?[...items].sort():[...items].sort(compareKeys);
function observedItems(record){
  const set=names=>[...new Set(names.map(norm))].sort();
  return {
    labels:record.labels.map(label=>norm(label.text)),
    segments:record.segments.map(segment=>segment.between.map(norm).sort()),
    lines:record.lines.map(line=>({through:set(line.through)})),
    circles:record.circles.map(circle=>({center:circle.center===null?null:norm(circle.center),through:set(circle.through)})),
    rightAngles:record.rightAngles.map(angle=>({at:norm(angle.at)}))
  };
}

// --- expectation -----------------------------------------------------------------------------------------------------------------------------
// The spec that L1 built the SVG from, recomputed and compared with the lineage the caller hands in. Nothing is compared yet.
function checkExpectationLineage({capture,composed,plan,model,identity}){
  const bad=(reason,extra)=>{throw new Stop('EXPECTATION_LINEAGE_MISMATCH',{reason,...extra});};
  const composite=composed?.schemaVersion===COMPOSITE_SVG_VERSION;
  if(!isPlain(composed)||(composed.schemaVersion!==COMPOSED_VERSION&&!composite)||composed.status!=='COMPOSED'||!isPlain(composed.lineage)||typeof composed.svg!=='string'||!composed.svg)bad('COMPOSED_INPUT_INVALID');
  if(composed.lineage.svgSha256!==bytesSha(Buffer.from(composed.svg,'utf8')))bad('COMPOSED_SVG_SHA');
  const digest=(value,reason)=>{try{return objectSha(value);}catch{return bad(reason);}};
  if(digest(plan,'PLAN_NOT_CANONICAL')!==composed.lineage.planSha256)bad('PLAN_SHA');
  if(digest(model,'MODEL_NOT_CANONICAL')!==composed.lineage.modelSha256)bad('MODEL_SHA');
  // the same rule as L1: the identity is exactly what assetIdentity derives from its own questionUid, surface and visualRole
  if(!isPlain(identity))bad('IDENTITY_INVALID');
  let derived;
  try{derived=assetIdentity(identity.questionUid,identity.surface,identity.visualRole);}catch{bad('IDENTITY_INVALID');}
  const fields=[...Object.keys(derived).filter(key=>identity[key]!==derived[key]),...Object.keys(identity).filter(key=>!Object.hasOwn(derived,key))];
  if(fields.length)bad('IDENTITY_INVALID',{fields});
  let spec;
  if(composite){
    // A composite figure: every panel's spec is re-derived from its own plan and model and must be the spec that panel was composed from.
    let panels;
    try{panels=compositePanels(plan);}catch(error){bad('SPEC_NOT_DERIVABLE',{code:error.status??error.message});}
    if(!isPlain(model)||!Array.isArray(model.panels)||model.panels.length!==panels.length||!Array.isArray(composed.lineage.panelSpecSha256s))bad('COMPOSITE_MODEL_INVALID');
    // The per-panel records must be the panels this plan describes: plan, spec and SVG of each, as composed.
    if(!Array.isArray(composed.panels)||composed.panels.length!==panels.length||!Array.isArray(composed.lineage.panelSvgSha256s)||composed.panels.some((record,i)=>record?.lineage?.planSha256!==objectSha(panels[i].plan)||record.lineage.specSha256!==composed.lineage.panelSpecSha256s[i]||record.lineage.svgSha256!==composed.lineage.panelSvgSha256s[i]))bad('COMPOSITE_PANEL_LINEAGE');
    const specs=panels.map((panel,i)=>{let panelSpec;try{panelSpec=isNumberLinePanel(panel.plan)?numberLineSpec(panel.plan,model.panels[i]):specFor(panel.plan,model.panels[i],identity.assetId);}catch(error){if(!isDomainCode(error))throw error;bad('SPEC_NOT_DERIVABLE',{code:error.message,panel:i});}if(objectSha(panelSpec)!==composed.lineage.panelSpecSha256s[i])bad('SPEC_SHA',{panel:i});return panelSpec;});
    spec={composite:true,panels:panels.map((panel,i)=>({plan:panel.plan,caption:panel.caption,spec:specs[i]})),checked:panels,models:model.panels,assetId:identity.assetId};
  }else{
    if(plan?.graphPlan&&Object.hasOwn(plan.graphPlan,'compositeHeader'))bad('COMPOSITE_HEADER_OUTSIDE_COMPOSITE');
    try{spec=specFor(plan,model,identity.assetId);}catch(error){if(!isDomainCode(error))throw error;bad('SPEC_NOT_DERIVABLE',{code:error.message});}
    if(objectSha(spec)!==composed.lineage.specSha256)bad('SPEC_SHA');
  }
  if(composed.lineage.svgSha256!==capture.lineage.l1SvgSha256)bad('SVG_NOT_CAPTURED');
  return spec;
}
const near=(a,b)=>Math.abs(a[0]-b[0])<=GEOMETRY_TOLERANCE*(1+Math.abs(a[0])+Math.abs(a[1]))&&Math.abs(a[1]-b[1])<=GEOMETRY_TOLERANCE*(1+Math.abs(a[0])+Math.abs(a[1]));
const onLine=([a,b,c],[x,y])=>Math.abs(a*x+b*y+c)<=GEOMETRY_TOLERANCE*(Math.abs(a*x)+Math.abs(b*y)+Math.abs(c)+1);
const onCircle=(center,radius,point)=>Math.abs(Math.hypot(point[0]-center[0],point[1]-center[1])-radius)<=GEOMETRY_TOLERANCE*(radius+1);

/**
 * What the spec displays, in the categories an observer is asked for. Labels come from the engine's own prepare() of the spec (the inventory L1 typeset:
 * it includes the axis names and tick texts that spec.axes asks for). Segments, lines, circles and right angles come from the spec objects the engine
 * really draws (their ids are among the prepared primitives); the labelled points on a line or a circle are computed from the spec's POINT objects.
 */
// A composite figure expects every panel's figure plus one caption label per panel (its math and text parts read as one phrase). A three-panel
// stack also writes each panel's formula in its caption row (a separate label) and the shared line equations once above the stack.
async function deriveCompositeExpectation(spec){
  const merged=Object.fromEntries(CATEGORIES.map(category=>[category,[]]));
  let header;
  try{header=await compositeHeaderLabels(spec.checked,spec.models,spec.assetId);}catch(error){throw new Stop('EXPECTATION_UNAVAILABLE',{reason:'COMPOSITE_HEADER_LABELS',code:error.status??error.message});}
  for(const [i,panel] of spec.panels.entries()){
    // A number-line panel shows only labels (its dots and band are the number-line observer's): the header, end, tick, integer and axis texts.
    const expected=isNumberLinePanel(panel.plan)?{labels:numberLineLabelTexts(panel.spec).map(norm),segments:[],lines:[],circles:[],rightAngles:[]}:await deriveExpectation({plan:panel.plan,spec:panel.spec});
    for(const category of CATEGORIES)merged[category].push(...expected[category]);
    merged.labels.push(norm(captionText(panel.caption)));
    if(header)merged.labels.push(norm(header.formulas[i].text));
  }
  for(const label of header?.shared??[])merged.labels.push(norm(label.text));
  // A caption and its formula share one row: an observer may read them as one phrase. That phrase stands for the two labels.
  const mergeable=header?spec.panels.map((panel,i)=>[norm(captionText(panel.caption)),norm(header.formulas[i].text)]):[];
  return {...Object.fromEntries(CATEGORIES.map(category=>[category,sortItems(category,merged[category])])),mergeable};
}
async function deriveExpectation({plan,spec}){
  const bad=(reason,extra)=>{throw new Stop('EXPECTATION_UNAVAILABLE',{reason,...extra});};
  let prepared;
  try{
    const response=await pythonWorker({action:'prepare',spec});
    if(response?.status!=='OK')bad('PREPARE_NOT_OK',{workerStatus:response?.status??null,code:response?.result?.code??null});
    prepared=response.result;
  }catch(error){if(error instanceof Stop)throw error;bad('PREPARE_WORKER_ERROR',{code:String(error?.message??error)});}
  if(!Array.isArray(prepared?.labels)||!Array.isArray(prepared.prepared?.primitives))bad('PREPARE_RESULT_SHAPE');
  const names=new Map(),labels=[];
  for(const label of prepared.labels){
    if(typeof label?.text!=='string'||!norm(label.text))bad('LABEL_TEXT_MISSING',{labelId:label?.id??null});
    labels.push(norm(label.text));
    if(label.kind==='POINT_NAME')names.set(label.target,norm(label.text));
  }
  // A dot with only a coordinate label (a graph key point) is read by that label: the observer is told to name points by their label.
  for(const label of prepared.labels)if(label.kind==='COORDINATE_LABEL'&&!names.has(label.target))names.set(label.target,norm(label.text));
  const drawn=new Set(prepared.prepared.primitives.map(primitive=>primitive.id));
  const nameOf=id=>{const name=names.get(id);if(name===undefined)bad('POINT_NAME_MISSING',{pointId:id});return name;};
  // A point the spec draws without a name on purpose (name null) cannot end an observable segment or carry a named right angle: skip those.
  const unnamed=new Set(spec.objects.filter(object=>object.kind==='POINT'&&object.name===null).map(object=>object.id));
  const points=spec.objects.filter(object=>object.kind==='POINT'&&names.has(object.id)).map(object=>({name:names.get(object.id),at:object.at}));
  const squares=new Set(spec.displayFacts?.squareAngleIds??[]);
  const expected={labels,segments:[],lines:[],circles:[],rightAngles:[]};
  for(const object of spec.objects){
    switch(object.kind){
      case 'POINT':case 'POINT_NAME':case 'COORDINATE_LABEL':case 'EQUATION_LABEL':case 'LENGTH_LABEL':break;// the dot and the texts: covered by the label inventory
      case 'FUNCTION_GRAPH':break;// the curve itself is not an observation category (its accuracy is the graph observer's); its texts are in the label inventory
      case 'LINE':case 'AUXILIARY_LINE':
        if(drawn.has(object.id))expected.lines.push({through:[...new Set(points.filter(point=>onLine(object.coefficients,point.at)).map(point=>point.name))].sort()});
        break;
      case 'SEGMENT':{
        if(!drawn.has(object.id))break;
        const segment=plan.displaySegments?.find(item=>item.id===object.id);
        if(!Array.isArray(segment?.refs)||segment.refs.length!==2)bad('SEGMENT_ENDS_UNKNOWN',{objectId:object.id});
        if(segment.refs.some(id=>unnamed.has(id)))break;
        expected.segments.push(segment.refs.map(nameOf).sort());
        break;
      }
      case 'CIRCLE':{
        if(!drawn.has(object.id))break;
        const centred=points.filter(point=>near(point.at,object.center));
        if(centred.length>1)bad('CIRCLE_CENTER_AMBIGUOUS',{objectId:object.id});
        expected.circles.push({center:centred[0]?.name??null,through:[...new Set(points.filter(point=>onCircle(object.center,object.radius,point.at)).map(point=>point.name))].sort()});
        break;
      }
      case 'ANGLE_MARK':
        if(!drawn.has(object.id))break;
        if(!squares.has(object.id)||!Array.isArray(object.refs)||object.refs.length!==3)bad('UNSUPPORTED_SPEC_OBJECT',{kind:object.kind,objectId:object.id});
        if(!unnamed.has(object.refs[1]))expected.rightAngles.push({at:nameOf(object.refs[1])});
        break;
      default:bad('UNSUPPORTED_SPEC_OBJECT',{kind:object.kind,objectId:object.id??null});
    }
  }
  return Object.fromEntries(CATEGORIES.map(category=>[category,sortItems(category,expected[category])]));
}

// matched / missing / unexpected by occurrence: the same item twice on one side needs the same item twice on the other.
function compare(expected,observed){
  const result={matched:{},missing:{},unexpected:{}};
  for(const category of CATEGORIES){
    const tally=items=>{const map=new Map();for(const item of items){const key=canonicalJson(item),entry=map.get(key);if(entry)entry.count++;else map.set(key,{item,count:1});}return map;};
    const want=tally(expected[category]),have=tally(observed[category]),matched=[],missing=[],unexpected=[];
    for(const key of new Set([...want.keys(),...have.keys()])){
      const expectedCount=want.get(key)?.count??0,observedCount=have.get(key)?.count??0,item=(want.get(key)??have.get(key)).item;
      for(let index=0;index<Math.min(expectedCount,observedCount);index++)matched.push(item);
      for(let index=observedCount;index<expectedCount;index++)missing.push(item);
      for(let index=expectedCount;index<observedCount;index++)unexpected.push(item);
    }
    result.matched[category]=sortItems(category,matched);result.missing[category]=sortItems(category,missing);result.unexpected[category]=sortItems(category,unexpected);
  }
  return result;
}

// --- bind ------------------------------------------------------------------------------------------------------------------------------------
/**
 * Compare a frozen observation with what the spec displays and return a receipt. In order: the capture (a hook capture is no evidence), the packet's integrity,
 * the freeze, the record's schema, that it belongs to this packet and read only packet files, the lineage of the expectation, then the comparison.
 * A discrepancy is reported as it is: this function never turns it into a match, and numeric accuracy stays with the primitive observer.
 */
export async function bindInverseObservation({capture,composed,plan,model,identity,packetDir,observationPath}={}){
  try{
    const {binding}=checkCapture(capture);
    const dir=packetDirOfExisting(packetDir),packet=readPacket(dir);
    if(!sameJson(packet.manifest.captureBinding,binding))throw new Stop('PACKET_TAMPERED',{reason:'CAPTURE_BINDING_MISMATCH'});
    const {freeze,freezeSha256}=readFreeze(dir,packet);
    const observation=readObservationFile(observationPath);
    if(!observation.bytes)throw new Stop('OBSERVATION_CHANGED_AFTER_FREEZE',{reason:'OBSERVATION_FILE_'+observation.error,frozen:freeze.observationSha256,current:null});
    const observationSha256=bytesSha(observation.bytes);
    if(observationSha256!==freeze.observationSha256||observation.bytes.length!==freeze.observationBytes)throw new Stop('OBSERVATION_CHANGED_AFTER_FREEZE',{reason:'OBSERVATION_BYTES_CHANGED',frozen:freeze.observationSha256,current:observationSha256});
    const record=parseRecord(observation.bytes);
    if(record.packetSha256!==packet.packetSha256)throw new Stop('OBSERVATION_PACKET_MISMATCH',{recorded:record.packetSha256,packetSha256:packet.packetSha256});
    const outside=record.observer.inputsRead.filter(name=>!PACKET_INPUT_NAMES.includes(name));
    if(outside.length)throw new Stop('OBSERVER_INPUT_OUT_OF_PACKET',{names:outside});
    const spec=checkExpectationLineage({capture,composed,plan,model,identity});
    const expected=spec.composite?await deriveCompositeExpectation(spec):await deriveExpectation({plan,spec}),observed=observedItems(record);
    if(expected.mergeable?.length)observed.labels=sortItems('labels',observed.labels.flatMap(label=>{const pair=expected.mergeable.find(([caption,formula])=>label===caption+formula);return pair?[...pair]:[label];}));
    const {matched,missing,unexpected}=compare(expected,observed);
    const consistent=CATEGORIES.every(category=>!missing[category].length&&!unexpected[category].length);
    return {
      schemaVersion:BINDING_VERSION,status:consistent?'OBSERVED_CONSISTENT':'OBSERVED_DISCREPANCY',detail:null,
      packetSha256:packet.packetSha256,observationSha256,freezeSha256,observer:record.observer,captureBinding:packet.manifest.captureBinding,expectationSha256:objectSha(expected),
      matched,missing,unexpected,readabilityIssues:record.readability,unobservable:record.unobservable,otherMarks:record.otherMarks,
      isolationEnforcementVerified:false,...flags()
    };
  }catch(error){return refuse(BINDING_VERSION,error);}
}
