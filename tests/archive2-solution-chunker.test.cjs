'use strict';

const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),mixed=fs.readFileSync(path.join(root,'archive/mixed_engine.html'),'utf8');
const begin=mixed.indexOf('function makeSolutionHtmlChunks(html) {');
const close=mixed.indexOf('\n}\n\nfunction makeLongSolutionShell',begin);
assert.ok(begin>=0&&close>begin,'solution chunker source exists');
const chunkerSource=mixed.slice(begin,close+2);

function closingTag(source,start,tag){
 let depth=1,cursor=start;
 const matcher=new RegExp(`<\\/?${tag}\\b[^>]*>`,'ig');matcher.lastIndex=start;
 for(const match of source.slice(start).matchAll(matcher)){
  const token=match[0],at=start+match.index;
  if(/^<\//.test(token))depth--;else if(!/\/\s*>$/.test(token))depth++;
  if(depth===0)return at+token.length;
  cursor=at+token.length;
 }
 return source.length;
}
function parseTopLevel(source){
 const nodes=[];let text='',i=0;
 const flush=()=>{if(text){nodes.push({nodeType:3,textContent:text});text='';}};
 while(i<source.length){
  const rest=source.slice(i),br=/^<br\s*\/?>/i.exec(rest);
  if(br){flush();nodes.push({nodeType:1,tagName:'BR',outerHTML:br[0]});i+=br[0].length;continue;}
  const opening=/^<([a-z][\w-]*)\b[^>]*>/i.exec(rest);
  if(opening){
   flush();const tag=opening[1],end=closingTag(source,i+opening[0].length,tag),outerHTML=source.slice(i,end);
   nodes.push({nodeType:1,tagName:tag.toUpperCase(),outerHTML});i=end;continue;
  }
  text+=source[i++];
 }
 flush();return nodes;
}
const esc=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const document={createElement(tag){
 let value='';
 const node={tagName:String(tag).toUpperCase(),nodeType:1,
  set innerHTML(next){value=String(next||'');node._childNodes=parseTopLevel(value);},
  get childNodes(){return {forEach:fn=>(node._childNodes||[]).forEach(fn)};},
  set textContent(next){value=esc(next);},
  get textContent(){return value;},
  get outerHTML(){return `<${String(tag)}>${value}</${String(tag)}>`;}
 };
 return node;
}};
const chunkContext=vm.createContext({document,Node:{TEXT_NODE:3,ELEMENT_NODE:1}});
const makeSolutionHtmlChunks=vm.runInContext(`(${chunkerSource})`,chunkContext,{timeout:2000});

test('display math with BR/newline inside the delimiters remains one complete typeset atom',()=>{
 const display='$$(x+2)^2+m^2x^2=4<br>\\Longleftrightarrow x\\bigl((1+m^2)x+4\\bigr)=0.$$';
 const chunks=makeSolutionHtmlChunks(`앞 문장<br>${display}<br>뒤 문장`);
 const expected=display.replace(/<br\s*\/?>/gi,' ');
 assert.ok(chunks.includes(expected),`complete display equation kept in one chunk: ${JSON.stringify(chunks)}`);
 assert.equal(chunks.some(chunk=>/^\$\$/.test(chunk)&&!chunk.includes('$$',2)),false,'no unmatched display opening delimiter');
 assert.equal(chunks.some(chunk=>/\$\$$/.test(chunk)&&!chunk.startsWith('$$')),false,'no unmatched display closing delimiter');
 assert.equal(chunks.filter(chunk=>chunk==='<br>').length,2,'plain BR paging boundaries remain separate');
});

test('inline formulas stay atomic when neighboring prose is split into chunks',()=>{
 const chunks=makeSolutionHtmlChunks('앞 문장 $a+b$ 뒤 문장');
 assert.ok(chunks.includes('$a+b$'));
 assert.equal(chunks.join('').includes('$a+b$'),true);
});

test('nested semantic markup and existing MathJax output remain intact',()=>{
 const nested='<span class="sol-sec-label"><strong>풀이:</strong> $x$</span>';
 const mathjax='<mjx-container class="MathJax"><mjx-math>x</mjx-math><mjx-assistive-mml><math><semantics><mi>x</mi></semantics></math></mjx-assistive-mml></mjx-container>';
 assert.ok(makeSolutionHtmlChunks(nested).includes(nested));
 assert.ok(makeSolutionHtmlChunks(mathjax).includes(mathjax));
});

test('long plain solutions still page and the strict unrendered-math detector remains active',()=>{
 const words=Array.from({length:400},(_,i)=>`word${i}`).join(' '),chunks=makeSolutionHtmlChunks(words);
 assert.ok(chunks.length>1);assert.ok(chunks.join('').includes('word0'));assert.ok(chunks.join('').includes('word399'));
 const renderLoop=require(path.join(root,'archive/mathjax_render_loop.js'));
 assert.equal(renderLoop.unrenderedMathCount({textContent:'unrendered $x+1$'}),1);
 assert.equal(renderLoop.unrenderedMathCount({textContent:'rendered plain text'}),0);
});
