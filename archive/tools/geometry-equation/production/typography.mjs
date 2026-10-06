import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dependency,dependencyRoot,dependencyLock} from './dependencies.mjs';
import path from 'node:path';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function typesetter({fontPath=process.env.GEOMETRY_KOREAN_FONT || path.join(dependencyRoot,'NotoSansKR.ttf'),fontSha256=dependencyLock.font.sha256}={}) {
  const raw=fs.readFileSync(fontPath),actual=bytesSha(raw);
  if(!fontSha256 || fontSha256!==actual)throw Error('FONT_HASH_LOCK_REQUIRED');
  const font=dependency('opentype.js').parse(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength));
  const {mathjax}=dependency('mathjax-full/js/mathjax.js');
  const {TeX}=dependency('mathjax-full/js/input/tex.js');
  const {SVG}=dependency('mathjax-full/js/output/svg.js');
  const {liteAdaptor}=dependency('mathjax-full/js/adaptors/liteAdaptor.js');
  const {RegisterHTMLHandler}=dependency('mathjax-full/js/handlers/html.js');
  const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);
  const doc=mathjax.document('',{InputJax:new TeX(),OutputJax:new SVG({fontCache:'none'})});
  return function typeset(label, identity) {
    if(!label.id || !label.owner || !label.factRole || !identity.visualAssetKey || !Number.isFinite(label.fontPx) || label.fontPx<11)throw Error('OWNER_BOUND_LABEL_REQUIRED');
    const namespace='lb-'+objectSha({identity,panelId:label.panelId||'main',labelId:label.id,occurrence:label.occurrence||0,owner:label.owner,factRole:label.factRole,fontSha256:actual}).slice(7);
    let content,width,height,baseline;
    if(label.kind==='MATH'){
      if(typeof label.tex!=='string' || label.tex.length>2048 || /\\(?:href|html|includegraphics|require)/.test(label.tex))throw Error('UNSUPPORTED_TEX');
      const node=doc.convert(label.tex,{display:false});
      const svg=adaptor.firstChild(node);
      if(adaptor.outerHTML(svg).includes('data-mjx-error'))throw Error('MATHJAX_TYPESET_ERROR');
      const [x,y,w,h]=adaptor.getAttribute(svg,'viewBox').split(/\s+/).map(Number);
      width=w*label.fontPx/1000;height=h*label.fontPx/1000;baseline=-y*label.fontPx/1000;
      adaptor.setAttribute(svg,'width',width+'px');adaptor.setAttribute(svg,'height',height+'px');
      adaptor.setAttribute(svg,'x','0');adaptor.setAttribute(svg,'y','0');
      content=adaptor.outerHTML(svg);
    } else if(label.kind==='TEXT'){
      if(typeof label.text!=='string'||label.text.length>256)throw Error('INVALID_TEXT_LABEL');
      for(const ch of label.text)if(!/\s/.test(ch) && font.charToGlyphIndex(ch)===0)throw Error('MISSING_KOREAN_GLYPH');
      baseline=label.fontPx*font.ascender/font.unitsPerEm;
      const p=font.getPath(label.text,0,baseline,label.fontPx);
      const b=p.getBoundingBox();width=Math.max(font.getAdvanceWidth(label.text,label.fontPx),b.x2);height=Math.max(b.y2,baseline-label.fontPx*font.descender/font.unitsPerEm);
      content='<path d="'+p.toPathData(5)+'" fill="#111"/>';
    } else throw Error('UNSUPPORTED_LABEL_KIND');
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" id="'+namespace+'" data-owner="'+esc(label.owner)+'" data-fact-role="'+esc(label.factRole)+'">'+content+'</svg>';
    return {labelId:label.id,owner:label.owner,factRole:label.factRole,namespace,svg,fragmentSha256:bytesSha(Buffer.from(svg)),fontSha256:actual,intrinsic:{width,height,baseline},fontPx:label.fontPx,typesetter:'MathJax SVG / NotoSansKR outlines'};
  };
}
export function composeTypographyProbe(fragments,{gap=12}={}) {
  let top=12;const placed=fragments.map(f=>{const y=top;top+=f.intrinsic.height+gap;return '<g transform="translate(12 '+y+')" data-label-id="'+esc(f.labelId)+'">'+f.svg+'</g>';});
  const width=Math.max(...fragments.map(f=>f.intrinsic.width))+24;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+top+'" viewBox="0 0 '+width+' '+top+'"><rect width="100%" height="100%" fill="white"/>'+placed.join('')+'</svg>';
}
