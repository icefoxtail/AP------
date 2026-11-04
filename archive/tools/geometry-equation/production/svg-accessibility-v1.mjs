// Metadata-only serialization for existing engine SVGs missing title/description.
// No geometry is parsed into numbers or reserialized.
import crypto from 'node:crypto';
import language from '../../svg-language-contract.cjs';

export const ACCESSIBILITY_CERTIFICATE_SCHEMA='APMATH_SVG_ACCESSIBILITY_METADATA_ONLY_v1';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fail=code=>{throw Error('SVG_ACCESSIBILITY_UPGRADE_'+code);};
const allowed=new Set(['role','aria-labelledby']);
const xml=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const bytesOf=value=>Buffer.isBuffer(value)?value:Buffer.from(value,'utf8');

function attributes(tag){
  const result=[];let at=tag.match(/^<[^\s/>]+/)[0].length;
  while(at<tag.length-1){
    const start=at,space=tag.slice(at).match(/^\s*/)[0];at+=space.length;
    if(tag.slice(at).match(/^\/?\s*>$/))break;
    if(!space)fail('INVALID_ATTRIBUTE');
    const match=tag.slice(at).match(/^([A-Za-z_][\w.:-]*)\s*=\s*(["'])([\s\S]*?)\2/);
    if(!match||result.some(row=>row.name===match[1]))fail('INVALID_ATTRIBUTE');
    at+=match[0].length;result.push({name:match[1],value:match[3],start,end:at});
  }
  return result;
}

function rootAndBody(source){
  let at=0,root=null,closed=false;const stack=[],ids=new Set();
  while(at<source.length){
    const next=source.indexOf('<',at),text=source.slice(at,next<0?source.length:next);
    if(!stack.length&&text.replace(/^\uFEFF/,'').trim())fail('TEXT_OUTSIDE_ROOT');
    if(next<0)break;
    if(source.startsWith('<!--',next)){const end=source.indexOf('-->',next+4);if(end<0)fail('INVALID_COMMENT');at=end+3;continue;}
    if(source.startsWith('<![CDATA[',next)){const end=source.indexOf(']]>',next+9);if(end<0||!stack.length)fail('INVALID_CDATA');at=end+3;continue;}
    if(source.startsWith('<?',next)){const end=source.indexOf('?>',next+2);if(end<0||root||!/^<\?xml\s/.test(source.slice(next,end)))fail('PROCESSING_INSTRUCTION');at=end+2;continue;}
    if(source.startsWith('<!',next))fail('DECLARATION_UNSUPPORTED');
    let end=next+1,quote=null;
    for(;end<source.length;end++){const c=source[end];if(quote){if(c===quote)quote=null;}else if(c==='"'||c==="'")quote=c;else if(c==='>')break;}
    if(end>=source.length)fail('UNTERMINATED_TAG');
    const tag=source.slice(next,end+1),close=tag.match(/^<\/([A-Za-z_][\w.:-]*)\s*>$/);
    if(close){if(stack.pop()!==close[1])fail('UNBALANCED_XML');if(!stack.length)closed=true;}
    else{
      const match=tag.match(/^<([A-Za-z_][\w.:-]*)(?=[\s/>])/);if(!match)fail('INVALID_TAG');
      const name=match[1],local=name.split(':').at(-1).toLowerCase(),attrs=attributes(tag);
      // Adding siblings can affect CSS selectors or scripts. Those inputs need a
      // separate render; this byte-preserving route deliberately refuses them.
      if(['script','style','link'].includes(local))fail('DYNAMIC_RENDERING_UNSUPPORTED');
      if(attrs.some(a=>/^on/i.test(a.name)))fail('DYNAMIC_RENDERING_UNSUPPORTED');
      if(['title','desc'].includes(local))fail('METADATA_ALREADY_PRESENT');
      for(const a of attrs)if(a.name==='id'){if(ids.has(a.value))fail('DUPLICATE_ID');ids.add(a.value);}
      if(!stack.length){if(root||closed||name!=='svg'||/\/\s*>$/.test(tag))fail('ROOT_UNSUPPORTED');root={start:next,end:end+1,tag,attrs};}
      if(!/\/\s*>$/.test(tag))stack.push(name);
    }
    at=end+1;
  }
  if(!root||!closed||stack.length)fail('UNBALANCED_XML');
  if(root.attrs.some(a=>['aria-label','aria-describedby'].includes(a.name)))fail('CONFLICTING_ROOT_ARIA');
  return {...root,ids};
}

function withoutAccessibility(tag){
  let result=tag;for(const a of attributes(tag).filter(a=>allowed.has(a.name)).reverse())result=result.slice(0,a.start)+result.slice(a.end);
  return result;
}

export function upgradeSvgAccessibility(input,{expectedSha256,title,description}={}){
  const before=bytesOf(input),beforeSha256=sha(before);
  if(typeof expectedSha256!=='string'||!/^([a-f0-9]{64}|sha256:[a-f0-9]{64})$/i.test(expectedSha256)||expectedSha256.toLowerCase().replace(/^sha256:/,'')!==beforeSha256)fail('INPUT_SHA_MISMATCH');
  const source=before.toString('utf8');if(!Buffer.from(source,'utf8').equals(before))fail('INVALID_UTF8');
  for(const [value,max] of [[title,500],[description,1500]])if(typeof value!=='string'||!value.trim()||value.length>max||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)||Buffer.from(value,'utf8').toString('utf8')!==value)fail('INVALID_TEXT');
  const root=rootAndBody(source),titleId='apms-a11y-'+beforeSha256.slice(0,16)+'-title',descriptionId='apms-a11y-'+beforeSha256.slice(0,16)+'-desc';
  if(root.ids.has(titleId)||root.ids.has(descriptionId))fail('ID_COLLISION');
  const plainRoot=withoutAccessibility(root.tag),trailing=plainRoot.match(/\s*>$/)[0];
  const upgradedRoot=plainRoot.slice(0,-trailing.length)+` role="img" aria-labelledby="${titleId} ${descriptionId}"`+trailing;
  const metadata=`<title id="${titleId}">${xml(title)}</title><desc id="${descriptionId}">${xml(description)}</desc>`;
  const prefix=source.slice(0,root.start),body=source.slice(root.end),after=Buffer.from(prefix+upgradedRoot+metadata+body,'utf8');
  const prefixBytes=Buffer.from(prefix),bodyBytes=Buffer.from(body),plainRootBytes=Buffer.from(plainRoot);
  const afterBody=after.subarray(Buffer.byteLength(prefix+upgradedRoot+metadata));
  if(!bodyBytes.equals(afterBody)||withoutAccessibility(upgradedRoot)!==plainRoot||!after.subarray(0,prefixBytes.length).equals(prefixBytes))fail('VISIBLE_BYTES_CHANGED');
  language.assertSvgStudentLanguage(after.toString('utf8'));
  const certificate={schemaVersion:ACCESSIBILITY_CERTIFICATE_SCHEMA,transformation:'ADD_ROOT_ACCESSIBILITY_METADATA_ONLY',beforeSvgSha256:beforeSha256,afterSvgSha256:sha(after),beforeByteLength:before.length,afterByteLength:after.length,
    metadata:{title,description,titleId,descriptionId},
    preservation:{bodySha256:sha(bodyBytes),bodyByteLength:bodyBytes.length,nonAccessibilityRootSha256:sha(plainRootBytes),prefixSha256:sha(prefixBytes),bodyBytesUnchanged:true,nonAccessibilityRootBytesUnchanged:true,prefixBytesUnchanged:true,geometryStylesDimensionsAndEmbeddedBytesUnchanged:true},
    allowedRootAttributes:[...allowed],
    reviewCarryForward:{eligibility:'VISIBLE_BYTES_UNCHANGED',eligibleAxes:['mathematics','geometry','visibleLayout','fontMeasurements'],requires:['Existing review bound to beforeSvgSha256','Independent title/description review','Final afterSvgSha256 readback'],priorReviewAndRenderResultsModified:false},
    actualRenderRun:false};
  return {svg:after,certificate};
}

export function verifySvgAccessibilityUpgrade(before,after,certificate){
  if(certificate?.schemaVersion!==ACCESSIBILITY_CERTIFICATE_SCHEMA)fail('CERTIFICATE_SCHEMA');
  const rebuilt=upgradeSvgAccessibility(before,{expectedSha256:certificate.beforeSvgSha256,...certificate.metadata});
  if(!bytesOf(after).equals(rebuilt.svg)||JSON.stringify(certificate)!==JSON.stringify(rebuilt.certificate))fail('CERTIFICATE_MISMATCH');
  return {status:'METADATA_ONLY_VERIFIED',beforeSvgSha256:certificate.beforeSvgSha256,afterSvgSha256:certificate.afterSvgSha256};
}
