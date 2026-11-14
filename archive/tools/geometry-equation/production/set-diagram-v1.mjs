import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {Stop,isDomainCode,esc,overlaps} from './quadratic-inequality-chain-v1.mjs';
import {PALETTE,PALETTE_NAMES,isPaletteName} from './palette.mjs';

// A standalone set figure (set-diagram-figure-v1): a Venn diagram of 1-3 sets with the elements the author places and a shaded
// region given as a set expression, and a finite mapping diagram of 2-4 columns with the declared arrows. The author gives only
// the set data (which elements belong to which sets, the correspondence); the engine works out each atomic region, the exact
// geometry of the region to shade from the plan's set expression, and places every element in its own region. The independent
// observer (set_diagram_observer.py) re-derives the regions and the expression from the same plan with its own code and reads
// the FINAL SVG: it samples the shaded paths, checks every element label's region and every arrow's ends, never trusting the
// engine's own numbers.
export const FIGURE_CAPABILITY='set-diagram-figure-v1';
// Korean accessible name of the figure (title and description, bound by aria-labelledby), the same ids the other figure engines write; fixed text per kind, so it never depends on plan prose.
const ACCESSIBLE_NAMES={
  VENN:['벤 다이어그램','집합 사이의 포함 관계와 원소가 속한 영역을 벤 다이어그램으로 나타낸 그림이다.'],
  MAPPING:['대응 그림','두 집합의 원소 사이의 대응 관계를 화살표로 나타낸 그림이다.'],
  MEMBERSHIP_TABLE:['집합의 원소 표','각 원소가 어느 집합에 속하는지 표로 나타낸 그림이다.']
};
const accessibleNames=kind=>{const [title,desc]=ACCESSIBLE_NAMES[kind];return `<title id="visual-title">${title}</title><desc id="visual-desc">${desc}</desc>`;};
export const MODEL_VERSION='SET_DIAGRAM_MODEL_v1',SPEC_VERSION='SET_DIAGRAM_SPEC_v1',SVG_VERSION='set-diagram-svg-v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('set-diagram-observer-worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const bad=code=>{throw Error(code);};
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
const px2=value=>String(Math.round(value*100)/100);
const HANGUL=/[\uAC00-\uD7A3]/;

// --- text -----------------------------------------------------------------------------------------------------------------------------------
const cleanText=(value,max,code)=>{
  if(typeof value!=='string'||value.length<1||value.length>max||/[\u0000-\u001f<>&"\\]/.test(value))bad(code);
  return value;
};
const SET_INTERVALISH=/[<≤≥>∈⊂⊃∩∪ᶜ=^]/;
const SET_RANGEISH=/\d\s*[-~,]\s*\d/;
const elementText=(raw,max,code)=>{
  if(!isPlain(raw)||Object.keys(raw).some(key=>!['text','math'].includes(key)))bad(code);
  if(typeof raw.text!=='string'||raw.text.length<1||raw.text.length>max||/[\u0000-\u001f<>&"]/.test(raw.text))bad(code);
  const text=raw.text;
  if(raw.math!==undefined&&typeof raw.math!=='boolean')bad(code);
  const math=raw.math===true||(!HANGUL.test(text)&&/^[A-Za-z0-9+\-./]+$/.test(text));
  if(process.env.SET_DEBUG)console.log('EL',JSON.stringify(text),'raw.math',raw.math,'math',math,'backslash',text.includes(String.fromCharCode(92)));
  if(!math&&(SET_INTERVALISH.test(text)||SET_RANGEISH.test(text)||text.includes(String.fromCharCode(92))))bad('SET_ELEMENT_TEXT_UNSUPPORTED');
  if(math&&/[<>]/.test(text))bad('SET_ELEMENT_TEXT_UNSUPPORTED');
  return {text,math};
};
// (EXT-20261109-c) one font: a name or element without Korean letters (A, 10, AB, g(0), f(x)) is math like every other letter and number of the figure
// (EXT-20261109-g) up to 8 characters, the length cleanText allows a name: f(f(x)) (7) used to fall back to the thin plain-text face
const labelMath=text=>!HANGUL.test(text)&&/^[A-Za-z0-9()]{1,8}$/.test(text);
// (EXT-20261112) a Unicode superscript/subscript (4k², x₁, 10⁻²) is typeset as the TeX it stands for. MathJax would draw it as a font-fallback <text> glyph that is neither an outline nor a labelled box: the rendered check then read it as a nameless label at under 11 px (LABEL_OVERLAP::element-N + PUBLICATION_FONT_BELOW_11_CSS_PX:). Only the typeset copy changes: data-tex and the observer keep the author's text.
const SCRIPT_DIGITS={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-','₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'-'};
export const setDiagramTypesetTex=tex=>tex.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/gu,run=>'^{'+[...run].map(ch=>SCRIPT_DIGITS[ch]).join('')+'}').replace(/[₀-₉₊₋]+/gu,run=>'_{'+[...run].map(ch=>SCRIPT_DIGITS[ch]).join('')+'}');

// --- set expressions: ∪ ∩ - and a postfix complement (ᶜ, ^c, ^C), with U the universal set --------------------------------
function parseShade(raw,setIds){
  if(typeof raw!=='string'||raw.length<1||raw.length>80||/[\u0000-\u001f<>&"\\]/.test(raw))bad('SET_SHADE_INVALID');
  const text=raw.replace(/\^C/g,'ᶜ').replace(/\^c/g,'ᶜ').replace(/\s+/g,'');
  const ids=new Set(setIds);
  let i=0;
  const peek=()=>text[i];
  const take=()=>text[i++];
  const expr=()=>{
    let value=term();
    while(peek()==='∪'||peek()==='-'){
      const op=take(),right=term();
      const left=value;
      value=op==='∪'?(mask=>left(mask)||right(mask)):(mask=>left(mask)&&!right(mask));
    }
    return value;
  };
  const term=()=>{
    let value=factor();
    while(peek()==='∩'){
      take();
      const left=value,right=factor();
      value=mask=>left(mask)&&right(mask);
    }
    return value;
  };
  const factor=()=>{
    let value=atom();
    while(peek()==='ᶜ'){take();const inner=value;value=mask=>!inner(mask);}
    return value;
  };
  const atom=()=>{
    const ch=take();
    if(ch===undefined)bad('SET_SHADE_INVALID');
    if(ch==='('){
      const value=expr();
      if(take()!==')')bad('SET_SHADE_INVALID');
      return value;
    }
    if(ch==='U')return ()=>true;
    if(ids.has(ch)){
      const index=setIds.indexOf(ch);
      return mask=>((mask>>index)&1)===1;
    }
    return bad('SET_SHADE_INVALID');
  };
  const fn=expr();
  if(i!==text.length)bad('SET_SHADE_INVALID');
  return {expression:raw,fn};
}

// --- headcounts (opt-in): a set or the universe may state how many members it has, written beside its name -----------------------------------
// count is a non-negative integer (a string such as "19", or the same integer as a number), countUnit a short unit such as 명 or 개. The count is only
// text next to the name (M (19명), or n(M)=19 with countStyle "n"): the regions themselves still come from the elements and the set expression.
const COUNT_UNIT_MAX=3;
const countOf=raw=>{
  if(raw===undefined)return undefined;
  if(typeof raw==='number'){if(!Number.isInteger(raw)||raw<0||raw>9999)bad('SET_COUNT_INVALID');return String(raw);}
  if(typeof raw!=='string'||!/^(0|[1-9]\d{0,3})$/.test(raw))bad('SET_COUNT_INVALID');
  return raw;
};
const unitOf=(raw,count)=>{
  if(raw===undefined)return null;
  if(count===undefined||typeof raw!=='string')bad('SET_COUNT_INVALID');
  cleanText(raw,COUNT_UNIT_MAX,'SET_COUNT_INVALID');
  return raw;
};
export const countLabelText=(style,count,unit)=>style==='n'?(unit||null):`(${count}${unit??''})`;
const countNameTex=(name,count)=>`n(${name})=${count}`;

// --- exact regions: the atomic cells of 1-3 sets -------------------------------------------------------------------------------------------
function solveVenn(venn){
  onlyKeys(venn,['kind','sets','elements','shade','subset','disjoint','universe','countStyle','labelGap','showUniverse','universeLabelOutside'],'SET_DIAGRAM_PLAN_INVALID');
  if(venn.showUniverse!==undefined&&typeof venn.showUniverse!=='boolean')bad('SET_SHOW_UNIVERSE_INVALID');
  const hideUniverse=venn.showUniverse===false;
  if(hideUniverse&&venn.universe!==undefined)bad('SET_HIDDEN_UNIVERSE_DECLARED');
  if(!Array.isArray(venn.sets)||venn.sets.length<1||venn.sets.length>3)bad(venn.sets?.length>3?'SET_COUNT_UNSUPPORTED':'SET_DIAGRAM_PLAN_INVALID');
  const sets=venn.sets.map(raw=>{
    onlyKeys(raw,['id','name','count','countUnit'],'SET_DIAGRAM_PLAN_INVALID');
    if(typeof raw.id!=='string'||!/^[A-Z]$/.test(raw.id)||raw.id==='U')bad('SET_ID_INVALID');
    if(raw.name!==undefined)cleanText(raw.name,8,'SET_NAME_INVALID');
    const count=countOf(raw.count);
    return {id:raw.id,name:raw.name??raw.id,...(count!==undefined?{count,countUnit:unitOf(raw.countUnit,count)}:(unitOf(raw.countUnit,count),{}))};
  });
  const ids=sets.map(s=>s.id);
  if(new Set(ids).size!==ids.length)bad('SET_ID_INVALID');
  let subset=null,chain=null,disjoint=null;
  if(venn.subset!==undefined&&venn.disjoint!==undefined)bad('SET_LAYOUT_UNSUPPORTED');
  if(venn.subset!==undefined){
    // B⊂A of two sets (inner first), or since G17 the chain A⊂B⊂C of three sets (innermost first)
    if(!Array.isArray(venn.subset)||venn.subset.length!==sets.length||sets.length<2||venn.subset.some(id=>!ids.includes(id))||new Set(venn.subset).size!==venn.subset.length)bad('SET_LAYOUT_UNSUPPORTED');
    if(sets.length===2)subset={inner:ids.indexOf(venn.subset[0]),outer:ids.indexOf(venn.subset[1])};
    else chain=venn.subset.map(id=>ids.indexOf(id));
  }
  // disjoint (G17): [["A","B"]] draws the two sets apart, with no region in common (one pair of two sets, or one pair among three)
  if(venn.disjoint!==undefined){
    if(sets.length<2||!Array.isArray(venn.disjoint)||venn.disjoint.length!==1)bad('SET_LAYOUT_UNSUPPORTED');
    const pair=venn.disjoint[0];
    if(!Array.isArray(pair)||pair.length!==2||pair.some(id=>!ids.includes(id))||pair[0]===pair[1])bad('SET_LAYOUT_UNSUPPORTED');
    disjoint=pair.map(id=>ids.indexOf(id)).sort((a,b)=>a-b);
  }
  // a cell the chosen layout leaves without any area (outside the inner set but inside it, or in two disjoint sets): no element and no shading can be there
  const cellPossible=mask=>{
    if(subset&&(mask&(1<<subset.inner))&&!(mask&(1<<subset.outer)))return false;
    if(chain&&chain.slice(0,-1).some((set,k)=>(mask&(1<<set))&&!(mask&(1<<chain[k+1]))))return false;
    if(disjoint&&(mask&(1<<disjoint[0]))&&(mask&(1<<disjoint[1])))return false;
    return true;
  };
  // the whole (universe) may carry a headcount too; a set can never have more members than the whole, nor an inner set more than its outer set
  let universe;
  if(venn.universe!==undefined){
    onlyKeys(venn.universe,['name','count','countUnit'],'SET_DIAGRAM_PLAN_INVALID');
    if(venn.universe.name!==undefined&&(cleanText(venn.universe.name,8,'SET_NAME_INVALID'),venn.universe.name!=='U'))bad('SET_NAME_INVALID');
    const count=countOf(venn.universe.count);
    const unit=unitOf(venn.universe.countUnit,count);
    if(count!==undefined)universe={name:'U',count,countUnit:unit};
  }
  let countStyle;
  if(venn.countStyle!==undefined){
    if(venn.countStyle!=='paren'&&venn.countStyle!=='n')bad('SET_COUNT_INVALID');
    if(!sets.some(set=>set.count!==undefined)&&universe===undefined)bad('SET_COUNT_INVALID');
    countStyle=venn.countStyle;
    // n(M)=19 is a formula: the set must be named by one letter or digit
    if(countStyle==='n'&&sets.some(set=>set.count!==undefined&&!labelMath(set.name)))bad('SET_COUNT_INVALID');
  }
  // labelGap (opt-in): a set's name stands at least this many px clear of every circle's line (and, for the inner set of a subset pair, wholly inside the outer circle).
  if(venn.universeLabelOutside!==undefined&&(venn.universeLabelOutside!==true||venn.universe!==undefined||hideUniverse))bad('SET_UNIVERSE_LABEL_OUTSIDE_INVALID');
  let labelGap;
  if(venn.labelGap!==undefined){
    if(!Number.isInteger(venn.labelGap)||venn.labelGap<2||venn.labelGap>12)bad('SET_LABEL_GAP_INVALID');
    labelGap=venn.labelGap;
  }
  if(universe)for(const set of sets)if(set.count!==undefined&&Number(set.count)>Number(universe.count))bad('SET_COUNT_INVALID');
  if(subset&&sets[subset.inner].count!==undefined&&sets[subset.outer].count!==undefined&&Number(sets[subset.inner].count)>Number(sets[subset.outer].count))bad('SET_COUNT_INVALID');
  if(chain)for(let k=0;k+1<chain.length;k++)if(sets[chain[k]].count!==undefined&&sets[chain[k+1]].count!==undefined&&Number(sets[chain[k]].count)>Number(sets[chain[k+1]].count))bad('SET_COUNT_INVALID');
  const n=sets.length,cellCount=1<<n;
  const elements=[];
  if(venn.elements!==undefined){
    if(!Array.isArray(venn.elements)||venn.elements.length>12)bad('SET_TOO_MANY_ELEMENTS');
    const seen=new Set();
    venn.elements.forEach((raw,index)=>{
      if(!isPlain(raw)||Object.keys(raw).some(key=>!['text','math','in'].includes(key)))bad('SET_ELEMENT_INVALID');
      const {text,math}=elementText({text:raw.text,math:raw.math},32,'SET_ELEMENT_INVALID');
      if(!Array.isArray(raw.in)||raw.in.length>n||new Set(raw.in).size!==raw.in.length)bad('SET_ELEMENT_INVALID');
      for(const id of raw.in)if(!ids.includes(id))bad('SET_ELEMENT_SET_UNKNOWN');
      let mask=0;for(const id of raw.in)mask|=1<<ids.indexOf(id);
      if(hideUniverse&&mask===0)bad('SET_HIDDEN_UNIVERSE_OUTSIDE_ELEMENT');
      if(!cellPossible(mask))bad('SET_ELEMENT_REGION_EMPTY');
      const key=text+'|'+raw.in.join(',');
      if(seen.has(key))bad('SET_ELEMENT_DUPLICATE');
      seen.add(key);
      elements.push({index,text,math,in:ids.filter(id=>raw.in.includes(id)),cell:mask});
    });
  }
  let shade=null;
  if(venn.shade!==undefined&&venn.shade!==null){
    const parsed=parseShade(venn.shade,ids);
    if(hideUniverse&&parsed.fn(0))bad('SET_HIDDEN_UNIVERSE_OUTSIDE_SHADE');
    const selected=[];
    for(let mask=0;mask<cellCount;mask++)if(parsed.fn(mask))selected.push(mask);
    if(!selected.length||(disjoint||chain)&&!selected.some(cellPossible))bad('SET_SHADE_EMPTY');
    shade={expression:venn.shade,cells:selected};
  }
  const cells=[];
  for(let mask=0;mask<cellCount;mask++){
    const members=ids.filter((id,k)=>((mask>>k)&1)===1);
    cells.push({mask,region:members.length?members.join('∩'):'OUTSIDE',members,shade:shade?shade.cells.includes(mask):false,
      elements:elements.filter(e=>e.cell===mask).map(e=>e.index)});
  }
  return {schemaVersion:MODEL_VERSION,kind:'VENN',layout:subset?'SUBSET':chain?'CHAIN':disjoint?'DISJOINT':'OVERLAP',sets,subset,...(chain?{chain}:{}),...(disjoint?{disjoint}:{}),elements,cells,shade,...(hideUniverse?{showUniverse:false}:{}),...(universe?{universe}:{}),...(countStyle?{countStyle}:{}),...(labelGap?{labelGap}:{}),...(venn.universeLabelOutside?{universeLabelOutside:true}:{})};
}
// A mapping element is a short Hangul/alphanumeric text (up to 4 characters, as always) or, since G17, a signed number, a fraction or a short root
// (-2, 1/2, -1/2, √2, 2√3; up to 6 characters). The typed hyphen-minus is shown as the real minus sign U+2212; the figure writes it as a math label.
const MAPPING_NUMBER=/^[-\u2212]?(?:\d{1,2}(?:\/\d{1,2})?|\d{0,2}\u221a\d{1,2})$/;
export const mappingElementTex=text=>text.replace(/\u2212/g,'-').replace(/\u221a(\d+)/g,'\\sqrt{$1}');
function mappingElement(value){
  const text0=cleanText(value,6,'MAPPING_ELEMENT_TEXT_UNSUPPORTED');
  if(text0.length<=4&&(HANGUL.test(text0)||/^[A-Za-z0-9]+$/.test(text0)))return {text:text0,math:labelMath(text0)};
  if(!MAPPING_NUMBER.test(text0))bad('MAPPING_ELEMENT_TEXT_UNSUPPORTED');
  const text=text0.replace(/-/g,'\u2212');
  return {text,math:true,tex:mappingElementTex(text)};
}
function solveMapping(diagram){
  onlyKeys(diagram,['kind','columns','arrows','highlight','arrowGroups','highlightPaths'],'SET_DIAGRAM_PLAN_INVALID');
  if(!Array.isArray(diagram.columns)||diagram.columns.length<2||diagram.columns.length>4)bad(diagram.columns?.length>4?'MAPPING_COLUMN_COUNT_UNSUPPORTED':'MAPPING_COLUMNS_INVALID');
  const columnIds=new Set();
  const columns=diagram.columns.map(raw=>{
    onlyKeys(raw,['id','name','elements'],'MAPPING_COLUMNS_INVALID');
    if(typeof raw.id!=='string'||!/^[A-Z][0-9]?$/.test(raw.id)||columnIds.has(raw.id))bad('MAPPING_COLUMNS_INVALID');
    columnIds.add(raw.id);
    if(raw.name!==undefined)cleanText(raw.name,8,'MAPPING_COLUMNS_INVALID');
    if(!Array.isArray(raw.elements)||raw.elements.length<1)bad('MAPPING_COLUMNS_INVALID');
    if(raw.elements.length>8)bad('MAPPING_TOO_MANY_ELEMENTS');
    const seen=new Set();
    const elements=raw.elements.map((value,index)=>{
      const entry=mappingElement(value);
      if(seen.has(entry.text))bad('MAPPING_COLUMNS_INVALID');
      seen.add(entry.text);
      return {index,...entry};
    });
    return {id:raw.id,name:raw.name??raw.id,elements};
  });
  const at=(value,code)=>{
    if(!isPlain(value)||Object.keys(value).some(key=>!['column','element'].includes(key)))bad(code);
    const column=value.column,element=value.element;
    if(!Number.isInteger(column)||column<0||column>=columns.length)bad(code);
    if(!Number.isInteger(element)||element<0||element>=columns[column].elements.length)bad(code);
    return {column,element};
  };
  if(!Array.isArray(diagram.arrows)||diagram.arrows.length<1)bad('MAPPING_NEEDS_ARROWS');
  if(diagram.arrows.length>24)bad('MAPPING_ARROW_INVALID');
  const seen=new Set();
  const arrows=diagram.arrows.map((raw,index)=>{
    onlyKeys(raw,['from','to','style'],'MAPPING_ARROW_INVALID');
    const from=at(raw.from,'MAPPING_ARROW_INVALID'),to=at(raw.to,'MAPPING_ARROW_INVALID');
    if(Math.abs(from.column-to.column)!==1)bad('MAPPING_ARROW_DIRECTION_UNSUPPORTED');
    if(raw.style!==undefined&&!['SOLID','DASHED'].includes(raw.style))bad('MAPPING_ARROW_INVALID');
    const key=`${from.column}:${from.element}>${to.column}:${to.element}`;
    if(seen.has(key))bad('MAPPING_ARROW_DUPLICATE');
    seen.add(key);
    return {index,from,to,style:raw.style??'SOLID'};
  });
  let highlight={arrows:[],elements:[]};
  if(diagram.highlight!==undefined){
    onlyKeys(diagram.highlight,['arrows','elements'],'MAPPING_HIGHLIGHT_INVALID');
    const hi=diagram.highlight;
    if(hi.arrows!==undefined){
      if(!Array.isArray(hi.arrows)||hi.arrows.length>arrows.length||new Set(hi.arrows).size!==hi.arrows.length)bad('MAPPING_HIGHLIGHT_INVALID');
      for(const k of hi.arrows)if(!Number.isInteger(k)||k<0||k>=arrows.length)bad('MAPPING_HIGHLIGHT_INVALID');
      highlight.arrows=[...hi.arrows].sort((a,b)=>a-b);
    }
    if(hi.elements!==undefined){
      if(!Array.isArray(hi.elements)||hi.elements.length>24)bad('MAPPING_HIGHLIGHT_INVALID');
      const keys=new Set();
      highlight.elements=hi.elements.map(value=>{
        const spot=at(value,'MAPPING_HIGHLIGHT_INVALID');
        const key=`${spot.column}:${spot.element}`;
        if(keys.has(key))bad('MAPPING_HIGHLIGHT_INVALID');
        keys.add(key);return spot;
      });
    }
  }
  // arrowGroups (G17): a name (f, g, ...) written between two adjacent columns above the arrows that go from `from` to `to` (column ids), and an optional C1 palette colour for those arrows
  const GROUP_ERR='MAPPING_ARROW_GROUP_INVALID',columnIndex=id=>columns.findIndex(c=>c.id===id);
  let groups=[];
  if(diagram.arrowGroups!==undefined){
    if(!Array.isArray(diagram.arrowGroups)||diagram.arrowGroups.length<1||diagram.arrowGroups.length>columns.length-1)bad(GROUP_ERR);
    const pairs=new Set();
    groups=diagram.arrowGroups.map((raw,index)=>{
      onlyKeys(raw,['name','from','to','color'],GROUP_ERR);
      const name=cleanText(raw.name,8,GROUP_ERR);
      const from=columnIndex(raw.from),to=columnIndex(raw.to);
      if(from<0||to<0||Math.abs(from-to)!==1)bad(GROUP_ERR);
      if(raw.color!==undefined&&!isPaletteName(raw.color))bad(GROUP_ERR);
      const pair=Math.min(from,to);
      if(pairs.has(pair))bad(GROUP_ERR);
      pairs.add(pair);
      const mine=arrows.filter(a=>a.from.column===from&&a.to.column===to).map(a=>a.index);
      if(!mine.length)bad('MAPPING_ARROW_GROUP_EMPTY');
      return {index,name,from,to,color:raw.color??null,arrows:mine};
    });
  }
  // highlightPaths (G17): up to 4 entries {path:[element text in column startColumn(default 0), in the next column, ...],color?,startColumn?} draw the arrows along a composite path heavy and in its colour; every step must be a declared arrow
  let paths=[];
  if(diagram.highlightPaths!==undefined){
    const PATH_ERR='MAPPING_PATH_INVALID';
    if(!Array.isArray(diagram.highlightPaths)||diagram.highlightPaths.length<1||diagram.highlightPaths.length>4)bad(PATH_ERR);
    const used=new Set();
    paths=diagram.highlightPaths.map(raw=>{
      onlyKeys(raw,['path','color','startColumn'],PATH_ERR);
      const start=raw.startColumn===undefined?0:raw.startColumn;
      if(!Number.isInteger(start)||start<0)bad(PATH_ERR);
      if(!Array.isArray(raw.path)||raw.path.length<2||start+raw.path.length>columns.length||raw.path.some(t=>typeof t!=='string'))bad(PATH_ERR);
      if(raw.color!==undefined&&!isPaletteName(raw.color))bad(PATH_ERR);
      const cells=raw.path.map((text,k)=>{
        const column=start+k,element=columns[column].elements.findIndex(e=>e.text===text.replace(/-/g,'\u2212'));
        if(element<0)bad(PATH_ERR);
        return {column,element};
      });
      const steps=[];
      for(let k=0;k+1<cells.length;k++){
        const arrow=arrows.find(a=>a.from.column===cells[k].column&&a.from.element===cells[k].element&&a.to.column===cells[k+1].column&&a.to.element===cells[k+1].element);
        if(!arrow)bad('MAPPING_PATH_ARROW_MISSING');
        if(used.has(arrow.index))bad(PATH_ERR);
        used.add(arrow.index);steps.push(arrow.index);
      }
      return {cells,arrows:steps,color:raw.color??null};
    });
  }
  // A function assigns at most one image to each element: report it, the figure itself draws exactly the declared arrows.
  const out=new Map();
  for(const arrow of arrows){const key=`${arrow.from.column}:${arrow.from.element}`;out.set(key,(out.get(key)??0)+1);}
  return {schemaVersion:MODEL_VERSION,kind:'MAPPING',columns,arrows,highlight,...(groups.length?{arrowGroups:groups}:{}),...(paths.length?{highlightPaths:paths}:{}),isFunction:[...out.values()].every(count=>count===1)};
}
function solveTable(diagram){
  // An explicit membership table: every finite element is a row and every set a column. This is the faithful figure for a
  // four-set question over a finite universe, where overlapping-circles geometry cannot show all 16 regions.
  onlyKeys(diagram,['kind','sets','elements'],'SET_DIAGRAM_PLAN_INVALID');
  if(!Array.isArray(diagram.sets)||diagram.sets.length<2||diagram.sets.length>4)bad(diagram.sets?.length>4?'SET_COUNT_UNSUPPORTED':'SET_DIAGRAM_PLAN_INVALID');
  const sets=diagram.sets.map(raw=>{
    onlyKeys(raw,['id','name'],'SET_DIAGRAM_PLAN_INVALID');
    if(typeof raw.id!=='string'||!/^[A-Z]$/.test(raw.id)||raw.id==='U')bad('SET_ID_INVALID');
    if(raw.name!==undefined)cleanText(raw.name,8,'SET_NAME_INVALID');
    return {id:raw.id,name:raw.name??raw.id};
  });
  const ids=sets.map(s=>s.id);
  if(new Set(ids).size!==ids.length)bad('SET_ID_INVALID');
  if(!Array.isArray(diagram.elements)||diagram.elements.length<1)bad('SET_ELEMENT_INVALID');
  if(diagram.elements.length>12)bad('SET_TOO_MANY_ELEMENTS');
  const texts=new Set();
  const elements=diagram.elements.map((raw,index)=>{
    if(!isPlain(raw)||Object.keys(raw).some(key=>!['text','math','in'].includes(key)))bad('SET_ELEMENT_INVALID');
    const {text,math}=elementText({text:raw.text,math:raw.math},32,'SET_ELEMENT_INVALID');
    if(texts.has(text))bad('SET_ELEMENT_DUPLICATE');
    texts.add(text);
    if(!Array.isArray(raw.in)||raw.in.length>ids.length||new Set(raw.in).size!==raw.in.length)bad('SET_ELEMENT_INVALID');
    for(const id of raw.in)if(!ids.includes(id))bad('SET_ELEMENT_SET_UNKNOWN');
    return {index,text,math,in:ids.filter(id=>raw.in.includes(id))};
  });
  return {schemaVersion:MODEL_VERSION,kind:'MEMBERSHIP_TABLE',sets,elements};
}
export function solveDiagram(diagram){
  if(!isPlain(diagram))bad('SET_DIAGRAM_PLAN_INVALID');
  switch(diagram.kind){
    case 'VENN':return solveVenn(diagram);
    case 'MAPPING':return solveMapping(diagram);
    case 'MEMBERSHIP_TABLE':return solveTable(diagram);
    default:return bad('SET_KIND_UNSUPPORTED');
  }
}

// --- layout --------------------------------------------------------------------------------------------------------------------------------
const VENN_LAYOUTS={
  1:{size:{width:360,height:280},rect:{x:52,y:50,w:256,h:196},circles:[{cx:180,cy:148,r:74}]},
  2:{size:{width:470,height:330},rect:{x:56,y:54,w:358,h:236},circles:[{cx:180,cy:172,r:96},{cx:290,cy:172,r:96}]},
  3:{size:{width:480,height:390},rect:{x:48,y:38,w:384,h:312},circles:[{cx:240,cy:150,r:90},{cx:190,cy:232,r:90},{cx:290,cy:232,r:90}]}
};
// A figure with headcount labels gets room for them: a band above the circles (the universe headcount on the first line, the set names with their counts
// on the next) and a margin on each side. A panel of a composite (compact) keeps the band but not the side margins, and every Venn panel is trimmed to
// COMPACT_WIDTH so two of them and the gap fit the 848-unit width the Archive solution column allows (the panel width cap is 420).
const COUNT_ROOM={top:52,side:34},COMPACT_WIDTH=410,GROUP_GAP=5;
const hasCounts=model=>model.sets.some(set=>set.count!==undefined)||model.universe!==undefined;
function vennLayout(model,opts={}){
  const base=VENN_LAYOUTS[model.sets.length];
  let rect={...base.rect},circles=base.circles.map(c=>({...c})),size={...base.size};
  if(model.layout==='SUBSET'){
    circles[model.subset.outer]={cx:236,cy:172,r:94};
    circles[model.subset.inner]={cx:258,cy:166,r:54};
  }
  // G17: A⊂B⊂C drawn as three nested circles (innermost first in model.chain), each inside the next with room for a name and an element between the lines
  if(model.layout==='CHAIN'){
    circles[model.chain[2]]={cx:240,cy:194,r:140};
    circles[model.chain[1]]={cx:262,cy:218,r:92};
    circles[model.chain[0]]={cx:286,cy:236,r:48};
  }
  // G17: two sets drawn apart (no common region); with a third set, the disjoint pair stands at the bottom and the third set overlaps both from above
  if(model.layout==='DISJOINT'){
    if(model.sets.length===2){
      circles[0]={cx:142,cy:172,r:76};circles[1]={cx:328,cy:172,r:76};
    }else{
      const [i,j]=model.disjoint,k=[0,1,2].find(x=>x!==i&&x!==j);
      circles[i]={cx:140,cy:262,r:80};circles[j]={cx:340,cy:262,r:80};circles[k]={cx:240,cy:180,r:88};
    }
  }
  if(hasCounts(model)){
    const side=opts.compact?0:COUNT_ROOM.side,top=COUNT_ROOM.top;
    circles=circles.map(c=>({...c,cx:c.cx+side,cy:c.cy+top}));
    rect={...rect,w:rect.w+2*side,h:rect.h+top};
    size={width:size.width+2*side,height:size.height+top};
  }
  if(opts.compact&&size.width>COMPACT_WIDTH){
    const dx=(COMPACT_WIDTH-size.width)/2;
    rect={...rect,x:rect.x+dx};circles=circles.map(c=>({...c,cx:c.cx+dx}));size={...size,width:COMPACT_WIDTH};
  }
  return {size,rect,circles};
}
const MAPPING_ROW=34,MAPPING_PAD=22,MAPPING_TOP=50,MAPPING_RX=72;
// A two-column mapping panel of a composite (compact) is COMPACT_WIDTH wide like a Venn panel, so two of them and the gap fit the 848-unit width the Archive solution column allows;
// a three-column mapping keeps its own width (it only stands in a one-column composite), and a standalone mapping is never compact.
function mappingLayout(model,opts={}){
  const rows=model.columns.map(c=>c.elements.length),rowMax=Math.max(...rows);
  const narrow=opts.compact&&model.columns.length===2;
  const four=model.columns.length===4;// X to Y to Z to W (three functions f, g, h): narrower ovals so the figure stays inside the 848-unit width
  const width=narrow?COMPACT_WIDTH:four?816:model.columns.length===2?460:660;
  const centers=narrow?[105,width-105]:four?[84,300,516,732]:model.columns.length===2?[120,width-120]:[110,width/2,width-110];
  const ovalH=rowMax*MAPPING_ROW+2*MAPPING_PAD,top=MAPPING_TOP,height=top+ovalH+24;
  return {size:{width,height},top,ovalH,rowMax,
    // G17: every oval has the height of the longest column; a shorter column's elements keep the row spacing and sit centred vertically in their oval
    columns:model.columns.map((column,index)=>({cx:centers[index],cy:top+ovalH/2,ry:ovalH/2,rx:MAPPING_RX,
      nameY:MAPPING_TOP-18,elementY:top+ovalH/2-(rows[index]-1)*MAPPING_ROW/2}))};
}
const TABLE_MARGIN=18,TABLE_HEADER=42,TABLE_ROW=40,TABLE_ELEMENT_COL=96,TABLE_SET_COL=56;
function tableLayout(model){
  const columnCount=model.sets.length,rowCount=model.elements.length;
  const width=TABLE_MARGIN*2+TABLE_ELEMENT_COL+columnCount*TABLE_SET_COL;
  const height=TABLE_MARGIN*2+TABLE_HEADER+rowCount*TABLE_ROW;
  const x0=TABLE_MARGIN,y0=TABLE_MARGIN,x1=width-TABLE_MARGIN,y1=height-TABLE_MARGIN;
  const vertical=[x0,x0+TABLE_ELEMENT_COL];
  for(let k=1;k<=columnCount;k++)vertical.push(x0+TABLE_ELEMENT_COL+k*TABLE_SET_COL);
  const horizontal=[y0,y0+TABLE_HEADER];
  for(let k=1;k<=rowCount;k++)horizontal.push(y0+TABLE_HEADER+k*TABLE_ROW);
  return {size:{width,height},columnCount,rowCount,frame:{x:x0,y:y0,width:x1-x0,height:y1-y0},vertical,horizontal};
}

// --- geometry helpers -----------------------------------------------------------------------------------------------------------------------
const norm2=(x,y,c)=>((x-c.cx)/c.r)**2+((y-c.cy)/c.r)**2;
const circleMargin=(x,y,c)=>Math.abs(Math.sqrt(norm2(x,y,c))-1)*c.r;
function boxEllipseRelation(box,c){
  const x0=box.x,x1=box.x+box.width,y0=box.y,y1=box.y+box.height;
  const cx=Math.max(x0,Math.min(c.cx,x1)),cy=Math.max(y0,Math.min(c.cy,y1));
  const min=norm2(cx,cy,c);
  const max=Math.max(norm2(x0,y0,c),norm2(x0,y1,c),norm2(x1,y0,c),norm2(x1,y1,c));
  if(min<1&&max>1)return 'CROSSES';
  return min>=1?'OUTSIDE':'INSIDE';
}
// A box lies wholly in one atomic cell: every set is either wholly inside (bit 1) or wholly outside (bit 0), with 3 px clearance.
function boxInCell(box,cell,circles,rect,clear=3){
  if(box.x<rect.x+clear-2||box.y<rect.y+clear-2||box.x+box.width>rect.x+rect.w-clear+2||box.y+box.height>rect.y+rect.h-clear+2)return false;
  for(let i=0;i<circles.length;i++){
    const c=circles[i],relation=boxEllipseRelation(box,c);
    if(relation==='CROSSES')return false;
    if(relation==='INSIDE'&&((cell>>i)&1)!==1)return false;
    if(relation==='OUTSIDE'&&((cell>>i)&1)===1)return false;
  }
  return true;
}
function cellClearance(box,cell,circles,rect){
  let best=Infinity;
  for(let i=0;i<circles.length;i++){
    const c=circles[i],relation=boxEllipseRelation(box,c);
    if(relation==='CROSSES')return -Infinity;
    const inside=relation==='INSIDE',want=((cell>>i)&1)===1;
    if(inside!==want)return -Infinity;
    const probes=[[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height],[box.x+box.width/2,box.y+box.height/2]];
    for(const [x,y] of probes)best=Math.min(best,circleMargin(x,y,c));
  }
  best=Math.min(best,box.x-rect.x,box.y-rect.y,rect.x+rect.w-box.x-box.width,rect.y+rect.h-box.y-box.height);
  return best;
}

// The smallest distance (px) from a box to any circle's line, measured the way the independent observer measures it (-Infinity when the box crosses a line or sits in the wrong cell).
// The observer refuses an element label nearer than ELEMENT_LINE_MARGIN to a line (SD_ELEMENT_REGION), so the engine must keep that room too.
const ELEMENT_LINE_MARGIN=2.5,ELEMENT_ROW_MARGIN=3.5,ELEMENT_ROW_GAP=8;
function observerMargin(box,cell,circles){
  let best=Infinity;
  for(let i=0;i<circles.length;i++){
    const c=circles[i];
    const cx=Math.max(box.x,Math.min(c.cx,box.x+box.width)),cy=Math.max(box.y,Math.min(c.cy,box.y+box.height));
    const low=norm2(cx,cy,c);
    const high=Math.max(norm2(box.x,box.y,c),norm2(box.x+box.width,box.y,c),norm2(box.x,box.y+box.height,c),norm2(box.x+box.width,box.y+box.height,c));
    if(low<1&&high>1)return -Infinity;
    const inside=low<1;
    if(inside!==(((cell>>i)&1)===1))return -Infinity;
    best=Math.min(best,inside?(1-Math.sqrt(high))*c.r:(Math.sqrt(low)-1)*c.r);
  }
  return best;
}

// The contour of one atomic cell within the universal rectangle (marching squares on the exact membership field).
const MARCH_STEP=2,MARCH_PAD=4.3;
function cellContours(cell,circles,rect){
  const x0=rect.x-MARCH_PAD,y0=rect.y-MARCH_PAD,x1=rect.x+rect.w+MARCH_PAD,y1=rect.y+rect.h+MARCH_PAD;
  const nx=Math.ceil((x1-x0)/MARCH_STEP)+1,ny=Math.ceil((y1-y0)/MARCH_STEP)+1;
  const field=(x,y)=>{
    let value=Math.min(x-rect.x,rect.x+rect.w-x,y-rect.y,rect.y+rect.h-y);
    for(let i=0;i<circles.length;i++){
      const c=circles[i],g=1-norm2(x,y,c);
      value=Math.min(value,(((cell>>i)&1)===1?g:-g)*c.r/2);
    }
    return value;
  };
  const grid=[];for(let j=0;j<ny;j++){const row=[];for(let i=0;i<nx;i++){const v=field(x0+i*MARCH_STEP,y0+j*MARCH_STEP);row.push(Math.abs(v)<1e-9?1e-9:v);}grid.push(row);}
  const at=(i,j)=>grid[j][i];
  const segments=[];
  const edge=(i,j,k)=>{
    switch(k){
      case 0:{const a=at(i,j),b=at(i+1,j),t=a/(a-b);return [x0+(i+t)*MARCH_STEP,y0+j*MARCH_STEP];} // top
      case 1:{const b=at(i+1,j),c=at(i+1,j+1),t=b/(b-c);return [x0+(i+1)*MARCH_STEP,y0+(j+t)*MARCH_STEP];} // right
      case 2:{const d=at(i,j+1),c=at(i+1,j+1),t=d/(d-c);return [x0+(i+t)*MARCH_STEP,y0+(j+1)*MARCH_STEP];} // bottom
      default:{const a=at(i,j),d=at(i,j+1),t=a/(a-d);return [x0+i*MARCH_STEP,y0+(j+t)*MARCH_STEP];} // left
    }
  };
  for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){
    const tl=at(i,j),tr=at(i+1,j),br=at(i+1,j+1),bl=at(i,j+1);
    const index=(tl>=0?1:0)|(tr>=0?2:0)|(br>=0?4:0)|(bl>=0?8:0);
    if(index===0||index===15)continue;
    const T=()=>edge(i,j,0),R=()=>edge(i,j,1),B=()=>edge(i,j,2),L=()=>edge(i,j,3);
    const push=(a,b)=>segments.push([a,b]);
    switch(index){
      case 1:push(L(),T());break;case 2:push(T(),R());break;case 3:push(L(),R());break;case 4:push(R(),B());break;
      case 6:push(T(),B());break;case 7:push(L(),B());break;case 8:push(B(),L());break;case 9:push(T(),B());break;
      case 11:push(R(),B());break;case 12:push(L(),R());break;case 13:push(T(),R());break;case 14:push(L(),T());break;
      case 5:{
        const center=field(x0+(i+.5)*MARCH_STEP,y0+(j+.5)*MARCH_STEP);
        if(center>=0){push(T(),R());push(B(),L());}else{push(L(),T());push(R(),B());}
        break;
      }
      case 10:{
        const center=field(x0+(i+.5)*MARCH_STEP,y0+(j+.5)*MARCH_STEP);
        if(center>=0){push(L(),T());push(R(),B());}else{push(T(),R());push(B(),L());}
        break;
      }
      default:break;
    }
  }
  // stitch the segments into closed loops
  const key=point=>point[0].toFixed(6)+','+point[1].toFixed(6);
  const nodes=new Map();
  for(const [a,b] of segments){
    for(const point of [a,b]){
      const k=key(point);
      if(!nodes.has(k))nodes.set(k,{point,links:[]});
    }
    nodes.get(key(a)).links.push(key(b));
    nodes.get(key(b)).links.push(key(a));
  }
  const used=new Set(),loops=[];
  for(const startKey of [...nodes.keys()]){
    if(used.has(startKey))continue;
    const start=nodes.get(startKey);
    if(start.links.length!==2)continue;
    const loop=[start.point];
    let previous=null,current=startKey,closed=false;
    for(let guard=0;guard<=nodes.size+2;guard++){
      used.add(current);
      const node=nodes.get(current);
      const next=node.links[0]===previous?node.links[1]:node.links[0];
      if(next===undefined||next===startKey){closed=next===startKey;break;}
      if(used.has(next))break;
      previous=current;current=next;
      loop.push(nodes.get(current).point);
    }
    if(closed&&loop.length>=3){
      const closedLoop=[...loop,loop[0]];
      const simplified=simplifyLoop(closedLoop,0.12);
      simplified.pop();
      if(simplified.length>=3)loops.push(simplified);
    }
  }
  return loops.filter(loop=>Math.abs(loopArea(loop))>0.5);
}
const loopArea=loop=>{let sum=0;for(let i=0;i<loop.length;i++){const [x1,y1]=loop[i],[x2,y2]=loop[(i+1)%loop.length];sum+=x1*y2-x2*y1;}return sum/2;};
function simplifyLoop(points,eps){
  if(points.length<4)return points;
  const keep=new Array(points.length).fill(false);keep[0]=keep[points.length-1]=true;
  const stack=[[0,points.length-1]];
  while(stack.length){
    const [a,b]=stack.pop();
    if(b<=a+1)continue;
    const [ax,ay]=points[a],[bx,by]=points[b];
    const dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy);
    let farthest=-1,index=-1;
    for(let i=a+1;i<b;i++){
      const [x,y]=points[i];
      const d=length<1e-9?Math.hypot(x-ax,y-ay):Math.abs(dy*(x-ax)-dx*(y-ay))/length;
      if(d>farthest){farthest=d;index=i;}
    }
    if(farthest>eps){keep[index]=true;stack.push([a,index],[index,b]);}
  }
  return points.filter((_,i)=>keep[i]);
}

// A shaded cell with a hole (the complement of a set: the universal rectangle with the circles cut out) is one path of several loops. The rendered-layout
// check samples a path along its length, and between two loops it joins the end of one loop (its first point: the loop closes) to the first point of the next with
// a straight line that is not drawn but is measured: that line may cross a label (the universal name, a set name) and fail with LABEL_GEOMETRY_COLLISION. Where
// the default start points make such a line hit a label, each loop starts at another of its own points so the joining lines run clear of every label. A path
// whose joining lines already miss all labels keeps its bytes.
const JUMP_MARGIN=2,JUMP_CANDIDATES=48;
const segmentTouchesBox=(a,b,box,pad)=>{
  const x=box.x-pad,y=box.y-pad,w=box.width+2*pad,h=box.height+2*pad,dx=b[0]-a[0],dy=b[1]-a[1];
  let t0=0,t1=1;
  for(const [p,q] of [[-dx,a[0]-x],[dx,x+w-a[0]],[-dy,a[1]-y],[dy,y+h-a[1]]]){
    if(Math.abs(p)<1e-12){if(q<0)return false;continue;}
    const t=q/p;
    if(p<0)t0=Math.max(t0,t);else t1=Math.min(t1,t);
    if(t0>t1)return false;
  }
  return true;
};
// The test for "the default line hits a label" is the rendered check's own (the box as it is, no margin), so a figure that renders today keeps its bytes; the replacement
// start points are searched with JUMP_MARGIN of air around every label first (and with none if no start point leaves that much).
export function routeShadeJumps(spec,placed){
  const boxes=placed.map(item=>item.box),clear=(a,b,pad)=>!boxes.some(box=>segmentTouchesBox(a,b,box,pad));
  for(const prim of spec.prims){
    if(prim.role!=='shade'||prim.t!=='path')continue;
    const mask=Number(prim.id.slice('shade-'.length)),loops=cellContours(mask,spec.layout.circles,spec.layout.rect);
    if(loops.length<2)continue;
    if(loops.slice(1).every((loop,k)=>clear(loops[k][0],loop[0],0)))continue;
    const candidates=loops.map(loop=>{const step=Math.max(1,Math.ceil(loop.length/JUMP_CANDIDATES)),list=[];for(let i=0;i<loop.length;i+=step)list.push(i);return list;});
    let starts=null;
    for(const pad of [JUMP_MARGIN,0]){
      const chosen=[],search=k=>{
        if(k===loops.length)return true;
        for(const index of candidates[k]){
          if(k>0&&!clear(loops[k-1][chosen[k-1]],loops[k][index],pad))continue;
          chosen[k]=index;
          if(search(k+1))return true;
        }
        return false;
      };
      if(search(0)){starts=chosen;break;}
    }
    if(!starts)continue;
    const rotated=loops.map((loop,k)=>[...loop.slice(starts[k]),...loop.slice(0,starts[k])]);
    prim.d=rotated.map(loop=>'M '+loop.map(([x,y])=>px2(x)+' '+px2(y)).join(' L ')+' Z').join(' ');
  }
}

// --- spec: primitives and labels (element placement happens after typesetting) ---------------------------------------------------------------
const ARROW_COLOR_WIDTH=1.8;
const STYLE={
  universal:'fill="none" stroke="#111" stroke-width="1.2"',
  set:'fill="none" stroke="#111" stroke-width="1.4"',
  oval:'fill="#fff" stroke="#111" stroke-width="1.4"',
  shade:'fill="#cfcfcf" stroke="none" fill-rule="evenodd"',
  arrow:'stroke="#111" stroke-width="1.4" fill="none"',
  arrowHi:'stroke="#111" stroke-width="2.4" fill="none"',
  head:'fill="#111" stroke="none"',
  elementHi:'fill="#ececec" stroke="none"',
  tableFrame:'fill="none" stroke="#111" stroke-width="1.4"',
  grid:'stroke="#111" stroke-width="0.8"',
  mark:'fill="#111" stroke="none"',
  leader:'stroke="#444" stroke-width="1.1" fill="none"'
};
// coloured arrows (G17): a group's arrows in a C1 palette line colour a little heavier than plain, a highlighted path as heavy as a highlighted arrow
for(const name of PALETTE_NAMES){
  STYLE[`arrowC_${name}`]=`stroke="${PALETTE[name].line}" stroke-width="${ARROW_COLOR_WIDTH}" fill="none"`;
  STYLE[`arrowHiC_${name}`]=`stroke="${PALETTE[name].line}" stroke-width="2.4" fill="none"`;
  STYLE[`headC_${name}`]=`fill="${PALETTE[name].line}" stroke="none"`;
}
const rect=(id,role,cls,x,y,width,height,data={},layer=30)=>({t:'rect',id,role,cls,x:r6(x),y:r6(y),width:r6(width),height:r6(height),data,layer});
const ellipse=(id,role,cls,cx,cy,rx,ry,data={},layer=30)=>({t:'ellipse',id,role,cls,cx:r6(cx),cy:r6(cy),rx:r6(rx),ry:r6(ry),data,layer});
const DISPLAY='\\displaystyle ';
const math=(id,role,owner,tex,plain,ax,ay,x,y,extra={})=>({id,role,owner,kind:'MATH',tex,plain,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
const textLabel=(id,role,owner,text,ax,ay,x,y,extra={})=>({id,role,owner,kind:'TEXT',text,plain:text,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
const elementLabel=(id,role,owner,value,ax,ay,x,y,extra={})=>value.math?math(id,role,owner,value.tex??value.text,value.text,ax,ay,x,y,extra):textLabel(id,role,owner,value.text,ax,ay,x,y,extra);

function vennSpec(model,layout){
  const prims=[],labels=[];
  const {rect:U,circles,size}=layout;
  if(model.showUniverse!==false)prims.push(rect('universal','universal','universal',U.x,U.y,U.w,U.h,{},20));
  model.sets.forEach((set,index)=>{
    const c=circles[index];
    prims.push(ellipse(`set-${set.id}`,'set','set',c.cx,c.cy,c.r,c.r,{set:set.id},25));
  });
  const shaded=new Set(model.shade?model.shade.cells:[]);
  for(let mask=0;mask<model.cells.length;mask++){
    if(!shaded.has(mask))continue;
    const loops=cellContours(mask,circles,U);
    if(!loops.length)continue;
    const d=loops.map(loop=>'M '+loop.map(([x,y])=>px2(x)+' '+px2(y)).join(' L ')+' Z').join(' ');
    prims.push({t:'path',id:`shade-${mask}`,role:'shade',cls:'shade',d,data:{cell:model.cells[mask].region},layer:24});
  }
  const style=model.countStyle??'paren',universe=model.universe;
  // U (40명) in the corner: the headcount is a separate text label set right after the name (resolveVenn); n(U)=40 replaces the name instead
  if(model.showUniverse!==false)labels.push(universe&&style==='n'
    ?math('universal-name','universal-name','universal',countNameTex('U',universe.count),countNameTex('U',universe.count),'start','middle',U.x+12,U.y+13,{})
    :math('universal-name','universal-name','universal','U','U','start',
      model.universeLabelOutside?'bottom':'middle',U.x+12,U.y+(model.universeLabelOutside?-6:13),{}));
  if(universe){
    const text=countLabelText(style,universe.count,universe.countUnit);
    if(text)labels.push(textLabel('universal-count','universal-count','universal',text,'start','middle',U.x+12,U.y+13,{}));
  }
  for(const set of model.sets){
    const counted=set.count!==undefined;
    const nameLabel=counted&&style==='n'
      ?Object.assign(math(`set-name-${set.id}`,'set-name',`set-${set.id}`,countNameTex(set.name,set.count),countNameTex(set.name,set.count),'center','middle',0,0,{set:set.id}),{placement:'set'})
      :labelMath(set.name)
        ?Object.assign(math(`set-name-${set.id}`,'set-name',`set-${set.id}`,set.name,set.name,'center','middle',0,0,{set:set.id}),{placement:'set'})
        :Object.assign(textLabel(`set-name-${set.id}`,'set-name',`set-${set.id}`,set.name,'center','middle',0,0,{set:set.id}),{placement:'set'});
    if(counted)nameLabel.counted=true;
    labels.push(nameLabel);
    if(counted){
      const text=countLabelText(style,set.count,set.countUnit);
      if(text)labels.push(Object.assign(textLabel(`set-count-${set.id}`,'set-count',`set-${set.id}`,text,'start','top',0,0,{set:set.id}),{placement:'set-count'}));
    }
  }
  for(const element of model.elements){
    labels.push(Object.assign(elementLabel(`element-${element.index}`,'element',`element-${element.index}`,element,'start','top',0,0,
      {element:element.index,cell:model.cells[element.cell].region}),{placement:'element',cellMask:element.cell}));
  }
  return {size,prims,labels,kind:'VENN',layout,setIds:model.sets.map(s=>s.id),vennLayoutKind:model.layout,subset:model.subset,...(model.chain?{chain:model.chain}:{}),geometry:{rect:{...U},circles:circles.map(c=>({...c}))},...(model.universe?{universeCounted:true}:{}),...(model.labelGap?{labelGap:model.labelGap}:{})};
}
function mappingSpec(model,layout){
  const prims=[],labels=[];
  const {size,top,ovalH,columns}=layout;
  const highlightedElements=new Set(model.highlight.elements.map(spot=>`${spot.column}:${spot.element}`));
  model.columns.forEach((column,index)=>{
    const g=columns[index];
    prims.push(ellipse(`oval-${column.id}`,'oval','oval',g.cx,g.cy,g.rx,g.ry,{column:index},20));
  });
  const elementBox={};
  model.columns.forEach((column,index)=>{
    const g=columns[index];
    column.elements.forEach((element,k)=>{
      const id=`element-${index}-${element.index}`;
      labels.push({...elementLabel(id,'element',`oval-${column.id}`,element,'center','middle',g.cx,g.elementY+k*MAPPING_ROW,
        {column:index,element:element.index}),columnIndex:index,elementIndex:element.index});
    });
    const name=labelMath(column.name)
      ?math(`column-name-${column.id}`,'column-name',`oval-${column.id}`,column.name,column.name,'center','middle',g.cx,g.nameY,{column:index})
      :textLabel(`column-name-${column.id}`,'column-name',`oval-${column.id}`,column.name,'center','middle',g.cx,g.nameY,{column:index});
    labels.push(name);
  });
  for(const group of model.arrowGroups??[]){
    const a=columns[group.from],b=columns[group.to],x=(a.cx+b.cx)/2;
    const id=`arrow-group-${group.index}`,owner=`oval-${model.columns[group.from].id}`;
    labels.push(labelMath(group.name)?math(id,'arrow-group-name',owner,group.name,group.name,'center','middle',x,a.nameY,{group:group.index}):textLabel(id,'arrow-group-name',owner,group.name,'center','middle',x,a.nameY,{group:group.index}));
  }
  // the colour of each arrow: its highlighted path's, else its group's (a path without a colour of its own keeps the group's colour)
  const arrowColor=new Map(),pathArrows=new Set();
  for(const group of model.arrowGroups??[])if(group.color)for(const k of group.arrows)arrowColor.set(k,group.color);
  for(const path of model.highlightPaths??[])for(const k of path.arrows){pathArrows.add(k);if(path.color)arrowColor.set(k,path.color);}
  for(const arrow of model.arrows){
    const key=`${arrow.from.column}:${arrow.from.element}`;
    const color=arrowColor.get(arrow.index)??null,heavy=model.highlight.arrows.includes(arrow.index)||pathArrows.has(arrow.index);
    prims.push({t:'polyline',id:`arrow-${arrow.index}`,role:'arrow',cls:color?(heavy?`arrowHiC_${color}`:`arrowC_${color}`):(heavy?'arrowHi':'arrow'),...(color?{color}:{}),
      points:[[0,0],[0,0],[0,0],[0,0]],dashed:arrow.style==='DASHED',
      data:{arrow:arrow.index,'from-column':arrow.from.column,'from-element':arrow.from.element,'to-column':arrow.to.column,'to-element':arrow.to.element},layer:40,resolved:false});
    void key;
  }
  for(const spot of model.highlight.elements){
    prims.push(rect(`element-highlight-${spot.column}-${spot.element}`,'element-highlight','elementHi',0,0,0,0,{column:spot.column,element:spot.element},35));
  }
  return {size,prims,labels,kind:'MAPPING',layout,geometry:{columns:columns.map(c=>({...c})),top,ovalH},elements:elementBox,highlightedElements};
}
function tableSpec(model,layout){
  const prims=[],labels=[];
  const {frame,vertical,horizontal}=layout;
  prims.push(rect('table-frame','table-frame','tableFrame',frame.x,frame.y,frame.width,frame.height,{},20));
  vertical.slice(1,-1).forEach((x,k)=>prims.push({t:'line',id:`grid-v-${k+1}`,role:'grid-v',cls:'grid',x1:r6(x),y1:r6(frame.y),x2:r6(x),y2:r6(frame.y+frame.height),data:{index:k+1},layer:22}));
  horizontal.slice(1,-1).forEach((y,k)=>prims.push({t:'line',id:`grid-h-${k+1}`,role:'grid-h',cls:'grid',x1:r6(frame.x),y1:r6(y),x2:r6(frame.x+frame.width),y2:r6(y),data:{index:k+1},layer:22}));
  const cellX=column=>[vertical[column],vertical[column+1]];
  const rowY=row=>[horizontal[row],horizontal[row+1]];
  const centre=(a,b)=>(a+b)/2;
  labels.push(textLabel('table-corner','table-corner','table','원소','center','middle',centre(...cellX(0)),centre(horizontal[0],horizontal[1]),{}));
  model.sets.forEach((set,column)=>{
    const x=centre(...cellX(column+1)),y=centre(horizontal[0],horizontal[1]);
    labels.push(labelMath(set.name)
      ?math(`col-set-${set.id}`,'col-set','table',set.name,set.name,'center','middle',x,y,{set:set.id})
      :textLabel(`col-set-${set.id}`,'col-set','table',set.name,'center','middle',x,y,{set:set.id}));
  });
  model.elements.forEach((element,row)=>{
    const x=centre(...cellX(0)),y=centre(...rowY(row+1));
    labels.push(elementLabel(`row-element-${element.index}`,'row-element','table',element,'center','middle',x,y,{element:element.index}));
    model.sets.forEach((set,column)=>{
      if(!element.in.includes(set.id))return;
      const cx=centre(...cellX(column+1)),cy=centre(...rowY(row+1));
      prims.push({t:'circle',id:`mark-${element.index}-${set.id}`,role:'membership',cls:'mark',cx:r6(cx),cy:r6(cy),r:5,data:{element:element.index,set:set.id},layer:30});
    });
  });
  return {size:layout.size,prims,labels,kind:'MEMBERSHIP_TABLE',layout,geometry:{frame:{...frame},vertical:[...vertical],horizontal:[...horizontal]}};
}
const sizeOf=(model,opts)=>model.kind==='VENN'?{...vennLayout(model,opts).size}:model.kind==='MAPPING'?{...mappingLayout(model,opts).size}:{...tableLayout(model).size};
// opts.compact: the Venn or two-column mapping panel of a composite (narrower, see vennLayout and mappingLayout); a table has no compact form
export const setDiagramSize=(model,opts={})=>({...sizeOf(model,opts)});
export function setDiagramSpec(plan,model,opts={}){
  if(plan?.capability!==FIGURE_CAPABILITY||!isPlain(plan.diagram))bad('SET_DIAGRAM_PLAN_INVALID');
  if(objectSha(solveDiagram(plan.diagram))!==objectSha(model))bad('SET_MODEL_MISMATCH');
  const spec=model.kind==='VENN'?vennSpec(model,vennLayout(model,opts)):model.kind==='MAPPING'?mappingSpec(model,mappingLayout(model,opts)):tableSpec(model,tableLayout(model));
  return {schemaVersion:SPEC_VERSION,...spec};
}
/** The spec of a Venn panel of a composite exactly as its lineage hashes it (what the composite's observation re-derives), and the texts its labels write. */
export const setDiagramPanelSpec=(plan,model)=>JSON.parse(JSON.stringify(setDiagramSpec(plan,model,{compact:true})));
export const setDiagramLabelTexts=spec=>spec.labels.map(label=>label.plain);

// --- placing the element labels and the set names inside their exact regions ---------------------------------------------------------------
function resolveVenn(spec,placed){
  const {layout,kind}=spec,{rect:U,circles}=layout;
  if(kind!=='VENN')return;
  const byLabel=new Map(placed.map(item=>[item.label.id,item]));
  const elementItems=placed.filter(item=>item.label.placement==='element');
  const otherBoxes=()=>placed.filter(item=>!item.label.placement||item.label.placement==='element').map(item=>item.box);
  // The universe headcount stands right after the universe name on the same line, and neither may touch a circle (a figure without it is left as it was).
  const universeName=placed.find(item=>item.label.id==='universal-name'),universeCount=placed.find(item=>item.label.id==='universal-count');
  if(spec.universeCounted){
    // the counted universe line sits wholly inside the rectangle, 5 px under its top edge, name and headcount centred on one line
    const line=Math.max(universeName.box.height,universeCount?universeCount.box.height:0),top=U.y+5;
    universeName.box={x:universeName.box.x,y:r6(top+(line-universeName.box.height)/2),width:universeName.box.width,height:universeName.box.height};
    universeName.label.anchor={x:r6(universeName.box.x),y:universeName.box.y,ax:'start',ay:'top'};
    if(universeCount){
      const x=universeName.box.x+universeName.box.width+GROUP_GAP,y=top+(line-universeCount.box.height)/2;
      universeCount.box={x:r6(x),y:r6(y),width:universeCount.box.width,height:universeCount.box.height};
      universeCount.label.anchor={x:r6(x),y:r6(y),ax:'start',ay:'top'};
    }
  }
  if(spec.universeCounted)for(const item of [universeName,universeCount])if(item&&circles.some(c=>boxEllipseRelation({x:item.box.x-4,y:item.box.y-4,width:item.box.width+8,height:item.box.height+8},c)!=='OUTSIDE'))bad('SET_COUNT_LABEL_NO_ROOM');
  // In a figure with headcounts the band above the circles belongs to the set names and their counts: an outside element never stands there (it would read as part of a name).
  const labelBand=spec.universeCounted||spec.labels.some(label=>label.counted)?Math.min(...circles.map(c=>c.cy-c.r))-2:-Infinity;
  const fixed=placed.filter(item=>!item.label.placement);
  const occupied=fixed.map(item=>({x:item.box.x-4,y:item.box.y-4,width:item.box.width+8,height:item.box.height+8}));
  const placeElements=()=>{for(const item of [...elementItems].sort((a,b)=>b.box.width*b.box.height-a.box.width*a.box.height)){
    const {width,height}=item.box,cell=item.label.cellMask;
    let best=null;
    for(let y=U.y+4;y+height<=U.y+U.h-4;y+=3)for(let x=U.x+4;x+width<=U.x+U.w-4;x+=3){
      const box={x,y,width,height};
      if(!boxInCell(box,cell,circles,U,4))continue;
      if(box.y<labelBand)continue;
      if(occupied.some(other=>overlaps({x:box.x-4,y:box.y-4,width:box.width+8,height:box.height+8},other)))continue;
      const clearance=cellClearance(box,cell,circles,U);
      if(!Number.isFinite(clearance))continue;
      const near=occupied.reduce((value,other)=>Math.min(value,Math.hypot(box.x+box.width/2-(other.x+other.width/2),box.y+box.height/2-(other.y+other.height/2))),Infinity);
      // A figure with headcounts keeps its elements low and away from the names above (an element that hugged a name would read as part of it).
      const score=Math.min(clearance,30)+(labelBand>-Infinity?(box.y-U.y)/U.h*40:Math.min(near,40)*0.6);
      if(!best||score>best.score+1e-9){best={x,y,score};}
    }
    if(!best)return false;
    item.box={x:best.x,y:best.y,width,height};
    item.label.anchor={x:r6(best.x),y:r6(best.y),ax:'start',ay:'top'};
    occupied.push({x:best.x-4,y:best.y-4,width:width+8,height:height+8});
  }return true;};
  // Elements of one region are packed together in centred rows (one per row first, then two, three... per row) when the one-by-one placement left no room
  // or left a label nearer to a circle's line than the observer allows: the labels of a region are laid out jointly, so the last one is not squeezed against the line.
  const placeElementRows=()=>{
    const groups=new Map();
    for(const item of elementItems){const key=item.label.cellMask;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);}
    const stackHeight=rows=>rows.reduce((sum,item)=>sum+item.box.height,0)+(rows.length-1)*ELEMENT_ROW_GAP;
    for(const items of [...groups.values()].sort((a,b)=>stackHeight(b)-stackHeight(a))){
      const cell=items[0].label.cellMask;
      let chosen=null;
      for(let perRow=1;perRow<=items.length&&!chosen;perRow++){
        const rows=[];for(let k=0;k<items.length;k+=perRow)rows.push(items.slice(k,k+perRow));
        const rowWidth=row=>row.reduce((sum,item)=>sum+item.box.width,0)+(row.length-1)*ELEMENT_ROW_GAP;
        const rowHeight=row=>Math.max(...row.map(item=>item.box.height));
        const total=rows.reduce((sum,row)=>sum+rowHeight(row),0)+(rows.length-1)*ELEMENT_ROW_GAP;
        let best=null;
        for(let top=U.y+4;top+total<=U.y+U.h-4;top+=2){
          if(top<labelBand)continue;
          for(let centre=U.x+4;centre<=U.x+U.w-4;centre+=2){
            const boxes=[];let y=top,ok=true,score=Infinity;
            for(const row of rows){
              let x=centre-rowWidth(row)/2;const high=rowHeight(row);
              for(const item of row){
                const box={x,y:y+(high-item.box.height)/2,width:item.box.width,height:item.box.height};
                const margin=observerMargin(box,cell,circles);
                if(!boxInCell(box,cell,circles,U,4)||margin<ELEMENT_ROW_MARGIN||occupied.some(other=>overlaps({x:box.x-4,y:box.y-4,width:box.width+8,height:box.height+8},other))){ok=false;break;}
                score=Math.min(score,margin);boxes.push({item,box});x+=item.box.width+ELEMENT_ROW_GAP;
              }
              if(!ok)break;y+=high+ELEMENT_ROW_GAP;
            }
            if(ok&&(!best||Math.min(score,30)>best.score+1e-9))best={boxes,score:Math.min(score,30)};
          }
        }
        if(best)chosen=best;
      }
      if(!chosen)return false;
      for(const {item,box} of chosen.boxes){
        item.box={x:r6(box.x),y:r6(box.y),width:box.width,height:box.height};
        item.label.anchor={x:r6(box.x),y:r6(box.y),ax:'start',ay:'top'};
        occupied.push({x:box.x-4,y:box.y-4,width:box.width+8,height:box.height+8});
      }
    }
    return true;
  };
  const placeAllElements=()=>{
    const mark=occupied.length,original=elementItems.map(item=>({box:{...item.box},anchor:{...item.label.anchor}}));
    const placedFirst=placeElements();
    if(placedFirst&&elementItems.every(item=>observerMargin(item.box,item.label.cellMask,circles)>=ELEMENT_LINE_MARGIN+0.05))return;
    occupied.length=mark;
    elementItems.forEach((item,k)=>{item.box={...original[k].box};item.label.anchor={...original[k].anchor};});
    if(!placeElementRows())bad('SET_ELEMENT_NO_ROOM');
  };
  const setItems=placed.filter(item=>item.label.placement==='set');
  const placeSetLabels=()=>{for(const item of setItems){
    const setIndex=spec.setIds.indexOf(item.label.extra.set);
    const c=circles[setIndex]??circles[0];
    const others=circles.filter((_,i)=>i!==setIndex);
    const direction=spec.setIds.length===1?{x:0,y:-1}
      :spec.vennLayoutKind==='SUBSET'?(setIndex===spec.subset.inner?{x:0.9,y:-0.44}:{x:-0.5,y:-0.87})
      :spec.vennLayoutKind==='CHAIN'?[{x:-0.8,y:-0.6},{x:-0.75,y:-0.66},{x:-0.5,y:-0.87}][spec.chain.indexOf(setIndex)]
      :spec.setIds.length===2?(setIndex===0?{x:-0.5,y:-0.87}:{x:0.5,y:-0.87})
      :(()=>{
        let dx=c.cx*others.length,dy=c.cy*others.length;
        for(const o of others){dx-=o.cx;dy-=o.cy;}
        const length=Math.hypot(dx,dy)||1;return {x:dx/length,y:dy/length};
      })();
    // A counted set is one group: the name, then its headcount label 5 px to the right, placed (and led out) together.
    const companion=placed.find(other=>other.label.placement==='set-count'&&other.label.extra.set===item.label.extra.set);
    const counted=item.label.counted===true;
    const width=item.box.width+(companion?GROUP_GAP+companion.box.width:0),height=Math.max(item.box.height,companion?companion.box.height:0);
    const nameAt=(x,y)=>({x,y:y+(height-item.box.height)/2,width:item.box.width,height:item.box.height});
    const countAt=(x,y)=>({x:x+item.box.width+GROUP_GAP,y:y+(height-companion.box.height)/2,width:companion.box.width,height:companion.box.height});
    // a counted group never crosses a circle's line: it is wholly outside its own circle and wholly in or wholly out of each other (the inner set of B⊂A is named inside A)
    const clear=box=>circles.every((other,i)=>{const relation=boxEllipseRelation({x:box.x-4,y:box.y-4,width:box.width+8,height:box.height+8},other);return i===setIndex?relation==='OUTSIDE':relation!=='CROSSES';});
    let chosen=null,leader=null;
    // labelGap (opt-in): the name keeps that many px clear of every circle's line and may go all round its circle to find such a place.
    const gap=spec.labelGap??0,grow=box=>({x:box.x-gap,y:box.y-gap,width:box.width+2*gap,height:box.height+2*gap});
    for(const angle of gap?[0,-14,14,-28,28,-42,42,-60,60,-90,90,-120,120,-150,150,180]:[0,-14,14,-28,28,-42,42,-60,60]){
      const rad=angle*Math.PI/180,dx=direction.x*Math.cos(rad)-direction.y*Math.sin(rad),dy=direction.x*Math.sin(rad)+direction.y*Math.cos(rad);
      for(let distance=c.r+10;distance<=c.r+80;distance+=2){
        const cx=c.cx+dx*distance,cy=c.cy+dy*distance,x=cx-width/2,y=cy-height/2;
        const box={x,y,width,height};
        if(x<U.x+4||y<U.y+4||x+width>U.x+U.w-4||y+height>U.y+U.h-4)continue;
        const relation=boxEllipseRelation(gap?grow(box):box,c);
        if(relation!=='OUTSIDE')continue;
        if(gap&&!circles.every((other,i)=>{if(i===setIndex)return true;const r=boxEllipseRelation(grow(box),other);return spec.vennLayoutKind==='SUBSET'&&setIndex===spec.subset.inner&&i===spec.subset.outer?r==='INSIDE':r!=='CROSSES';}))continue;
        const high=Math.max(norm2(x,y,c),norm2(x+width,y,c),norm2(x,y+height,c),norm2(x+width,y+height,c));
        if((Math.sqrt(high)-1)*c.r<6)continue;
        if(counted&&!clear(box))continue;
        if(occupied.some(other=>overlaps({x:x-4,y:y-4,width:width+8,height:height+8},other)))continue;
        chosen={x,y};break;
      }
      if(chosen)break;
    }
    // A counted group that would stand nearer to another circle's line than to its own reads as that circle's (the inner set of B⊂A named outside A): it is led out instead.
    if(chosen&&counted&&others.length){
      const name=nameAt(chosen.x,chosen.y),mx=name.x+name.width/2,my=name.y+name.height/2;
      const edge=o=>Math.abs(Math.hypot(mx-o.cx,my-o.cy)-o.r);
      if(edge(c)>Math.min(...others.map(edge))+4)chosen=null;
    }
    if(!chosen&&counted){
      // No room beside the circle: the group goes to the nearest free place outside every circle, and a short leader from its nearest edge ends on this circle.
      let best=null;
      for(let y=U.y+4;y+height<=U.y+U.h-4;y+=3)for(let x=U.x+4;x+width<=U.x+U.w-4;x+=3){
        const box={x,y,width,height};
        if(!clear(box)||occupied.some(other=>overlaps({x:x-4,y:y-4,width:width+8,height:height+8},other)))continue;
        const parts=[nameAt(x,y),...(companion?[countAt(x,y)]:[])];
        for(const part of parts){
          const px=Math.max(part.x,Math.min(c.cx,part.x+part.width)),py=Math.max(part.y,Math.min(c.cy,part.y+part.height));
          const distance=Math.hypot(px-c.cx,py-c.cy),length=distance-c.r;
          if(length<10||length>72||(best&&length>=best.length))continue;
          const ex=c.cx+(px-c.cx)/distance*c.r,ey=c.cy+(py-c.cy)/distance*c.r;
          let blocked=false;
          for(let k=1;k<20&&!blocked;k++){
            const sx=px+(ex-px)*k/20,sy=py+(ey-py)*k/20;
            // the leader keeps off every other circle's line, except that the inner set of B⊂A is reached across the outer circle's line
            if(circles.some((other,i)=>i!==setIndex&&!(spec.vennLayoutKind==='SUBSET'&&setIndex===spec.subset.inner&&i===spec.subset.outer)&&!(spec.vennLayoutKind==='CHAIN'&&spec.chain.indexOf(i)>spec.chain.indexOf(setIndex))&&((norm2(sx,sy,other)<1)!==(norm2(px,py,other)<1)||Math.abs(Math.sqrt(norm2(sx,sy,other))-1)*other.r<1.5)))blocked=true;
          }
          // nor does it run through the group's own other label or any label already placed
          if(!blocked&&[...occupied,...parts.filter(other=>other!==part).map(other=>({x:other.x-1,y:other.y-1,width:other.width+2,height:other.height+2}))].some(other=>segmentHitsBox([px,py],[ex,ey],other)))blocked=true;
          if(!blocked)best={x,y,length,leader:{x1:r6(px),y1:r6(py),x2:r6(ex),y2:r6(ey)}};
        }
      }
      if(best){chosen={x:best.x,y:best.y};leader=best.leader;}
    }
    if(!chosen)bad(counted?'SET_COUNT_LABEL_NO_ROOM':'SET_LABEL_NO_ROOM');
    const nameBox=nameAt(chosen.x,chosen.y);
    item.box={x:r6(nameBox.x),y:r6(nameBox.y),width:nameBox.width,height:nameBox.height};
    item.label.anchor={x:r6(nameBox.x),y:r6(nameBox.y),ax:'start',ay:'top'};
    if(companion){
      const countBox=countAt(chosen.x,chosen.y);
      companion.box={x:r6(countBox.x),y:r6(countBox.y),width:countBox.width,height:countBox.height};
      companion.label.anchor={x:r6(countBox.x),y:r6(countBox.y),ax:'start',ay:'top'};
    }
    if(leader)spec.prims.push({t:'line',id:`set-leader-${item.label.extra.set}`,role:'set-leader',cls:'leader',...leader,data:{set:item.label.extra.set},layer:42});
    occupied.push({x:chosen.x-4,y:chosen.y-4,width:width+8,height:height+8});
  }};
  // A figure with headcounts places the set names (with their counts) first, so a loose outside element cannot take the place a name needs; otherwise elements come first as always.
  if(labelBand>-Infinity){placeSetLabels();placeAllElements();}else{placeAllElements();placeSetLabels();}
  void byLabel;void otherBoxes;
}

function resolveMapping(spec,placed){
  if(spec.kind!=='MAPPING')return;
  const bySpot=new Map();
  for(const item of placed)if(item.label.role==='element')bySpot.set(`${item.label.extra.column}:${item.label.extra.element}`,item);
  // every element label sits wholly inside its own oval, and every column name above its oval
  const ovalRelation=(box,g)=>{
    const cx=Math.max(box.x,Math.min(g.cx,box.x+box.width)),cy=Math.max(box.y,Math.min(g.cy,box.y+box.height));
    const min=((cx-g.cx)/g.rx)**2+((cy-g.cy)/g.ry)**2;
    const max=Math.max(((box.x-g.cx)/g.rx)**2+((box.y-g.cy)/g.ry)**2,((box.x+box.width-g.cx)/g.rx)**2+((box.y-g.cy)/g.ry)**2,
      ((box.x-g.cx)/g.rx)**2+((box.y+box.height-g.cy)/g.ry)**2,((box.x+box.width-g.cx)/g.rx)**2+((box.y+box.height-g.cy)/g.ry)**2);
    if(min<1&&max>1)return 'CROSSES';
    return min>=1?'OUTSIDE':'INSIDE';
  };
  for(const item of placed)if(item.label.role==='element'){
    const g=spec.layout.columns[item.label.extra.column];
    if(ovalRelation(item.box,g)!=='INSIDE')bad('MAPPING_ELEMENT_OUT_OF_OVAL');
  }
  for(const item of placed)if(item.label.role==='column-name'||item.label.role==='arrow-group-name'){
    const g=spec.layout.columns[item.label.extra.column];
    if(item.box.y+item.box.height>spec.layout.top+2)bad('MAPPING_COLUMN_NAME_OVERLAPS_OVAL');
  }
  for(const prim of spec.prims.filter(p=>p.t==='rect'&&p.role==='element-highlight')){
    const item=bySpot.get(`${prim.data.column}:${prim.data.element}`);
    if(!item)bad('MAPPING_HIGHLIGHT_INVALID');
    prim.x=r6(item.box.x-4);prim.y=r6(item.box.y-4);prim.width=r6(item.box.width+8);prim.height=r6(item.box.height+8);
  }
  const allLabelBoxes=placed.map(item=>item.box);
  for(const prim of spec.prims.filter(p=>p.t==='polyline'&&p.role==='arrow')){
    const from=bySpot.get(`${prim.data['from-column']}:${prim.data['from-element']}`),to=bySpot.get(`${prim.data['to-column']}:${prim.data['to-element']}`);
    if(!from||!to)bad('MAPPING_ARROW_INVALID');
    const forward=prim.data['from-column']<prim.data['to-column'];
    const sy=from.box.y+from.box.height/2,ty=to.box.y+to.box.height/2;
    const sx=forward?from.box.x+from.box.width+4:from.box.x-4;
    const tx=forward?to.box.x-4:to.box.x+to.box.width+4;
    const stub=Math.max(12,Math.min(20,Math.abs(tx-sx)/5));
    const bend1=forward?sx+stub:sx-stub,bend2=forward?tx-stub:tx+stub;
    prim.points=[[r6(sx),r6(sy)],[r6(bend1),r6(sy)],[r6(bend2),r6(ty)],[r6(tx),r6(ty)]];
    prim.layer=40;prim.resolved=true;
    const head={t:'polygon',id:`arrow-head-${prim.data.arrow}`,role:'arrow-head',cls:prim.color?`headC_${prim.color}`:'head',
      points:forward?[[r6(tx),r6(ty)],[r6(tx-9),r6(ty-3.6)],[r6(tx-9),r6(ty+3.6)]]:[[r6(tx),r6(ty)],[r6(tx+9),r6(ty-3.6)],[r6(tx+9),r6(ty+3.6)]],
      data:{arrow:prim.data.arrow},layer:41};
    spec.prims.push(head);
    // an arrow never crosses another element label
    const segments=[[prim.points[0],prim.points[1]],[prim.points[1],prim.points[2]],[prim.points[2],prim.points[3]]];
    for(const [a,b] of segments)for(const item of placed.filter(entry=>entry.label.role==='element')){
      if(item===from||item===to)continue;
      if(segmentHitsBox(a,b,{x:item.box.x-2,y:item.box.y-2,width:item.box.width+4,height:item.box.height+4}))bad('MAPPING_ARROW_BLOCKS_LABEL');
    }
    void allLabelBoxes;
  }
}
function segmentHitsBox(a,b,box){
  const dx=b[0]-a[0],dy=b[1]-a[1];
  if(Math.abs(dx)<1e-9){
    if(a[0]<box.x||a[0]>box.x+box.width)return false;
    const lo=Math.min(a[1],b[1]),hi=Math.max(a[1],b[1]);return hi>box.y&&lo<box.y+box.height;
  }
  let t0=0,t1=1;
  for(const [p,q] of [[-dx,a[0]-box.x],[dx,box.x+box.width-a[0]],[-dy,a[1]-box.y],[dy,box.y+box.height-a[1]]]){
    if(Math.abs(p)<1e-9){if(q<0)return false;continue;}
    const t=q/p;
    if(p<0)t0=Math.max(t0,t);else t1=Math.min(t1,t);
    if(t0>t1)return false;
  }
  return t1>0&&t0<1;
}

// --- composing ------------------------------------------------------------------------------------------------------------------------------
const PLAIN_KEYS=['capability','diagram','caption','sourceConditions','newVisualInformation'];
export function checkSetDiagramPlan(plan){
  onlyKeys(plan,PLAIN_KEYS,'SET_DIAGRAM_PLAN_INVALID');
  if(plan.capability!==FIGURE_CAPABILITY)bad('SET_DIAGRAM_PLAN_INVALID');
  return solveDiagram(plan.diagram);
}
function printPrim(p){
  const data=Object.entries(p.data??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join(''),head=`id="${p.id}" data-role="${p.role}"${data}`,style=STYLE[p.cls];
  let tag;
  switch(p.t){
    case 'rect':tag=`<rect ${head} x="${px2(p.x)}" y="${px2(p.y)}" width="${px2(p.width)}" height="${px2(p.height)}" ${style}/>`;break;
    case 'ellipse':tag=`<ellipse ${head} cx="${px2(p.cx)}" cy="${px2(p.cy)}" rx="${px2(p.rx)}" ry="${px2(p.ry)}" ${style}/>`;break;
    case 'path':tag=`<path ${head} d="${p.d}" ${style}/>`;break;
    case 'polyline':tag=`<polyline ${head} points="${p.points.map(([x,y])=>px2(x)+','+px2(y)).join(' ')}" ${style}${p.dashed?' stroke-dasharray="7 5"':''}/>`;break;
    case 'polygon':tag=`<polygon ${head} points="${p.points.map(([x,y])=>px2(x)+','+px2(y)).join(' ')}" ${style}/>`;break;
    case 'line':tag=`<line ${head} x1="${px2(p.x1)}" y1="${px2(p.y1)}" x2="${px2(p.x2)}" y2="${px2(p.y2)}" ${style}/>`;break;
    case 'circle':tag=`<circle ${head} cx="${px2(p.cx)}" cy="${px2(p.cy)}" r="${px2(p.r)}" ${style}/>`;break;
    default:throw Error('SET_PRIMITIVE_UNKNOWN');
  }
  return `<g data-layer="${p.layer}">${tag}</g>`;
}
export async function composeSetDiagramFigure({plan,model,identity,typographyPolicy,browser,compact=false}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:status==='COMPOSED'?'construction-candidate-svg-v1':SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=setDiagramSpec(plan,model,{compact});}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='SET_MODEL_MISMATCH'?error.message:'SET_SPEC_ERROR',{code:error.message});}
    spec.setIds=model.kind==='VENN'?model.sets.map(s=>s.id):[];
    if(model.kind==='VENN'&&model.shade){
      const anyShade=spec.prims.some(p=>p.role==='shade');
      if(!anyShade)throw new Stop('SET_SPEC_ERROR',{code:'SET_SHADE_EMPTY'});
    }
    lineage.specSha256=objectSha(JSON.parse(JSON.stringify(spec)));
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,placed=[];
    for(const label of spec.labels){
      let fragment;
      try{fragment=typeset({id:label.id,owner:label.owner,factRole:label.role==='element'?'GIVEN':'DERIVED_INTERMEDIATE',fontPx:font,panelId:'set-diagram',...(label.kind==='MATH'?{kind:'MATH',tex:setDiagramTypesetTex(label.tex)}:{kind:'TEXT',text:label.text})},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('SET_TYPESET_ERROR',{labelId:label.id,code:error.message});}
      // a math label MathJax could not outline (a symbol outside its math fonts) leaves a <text> glyph: say which label it is instead of letting the rendered check report a nameless overlap
      if(label.kind==='MATH'&&/<text[\s>]/.test(fragment.svg))throw new Stop('SET_TYPESET_ERROR',{labelId:label.id,code:'MATH_GLYPH_NOT_OUTLINED',tex:label.tex});
      const {width,height}=fragment.intrinsic,{x,y,ax,ay}=label.anchor;
      placed.push({label,fragment,box:{x:r6(ax==='end'?x-width:ax==='center'?x-width/2:x),y:r6(ay==='bottom'?y-height:ay==='middle'?y-height/2:y),width,height}});
    }
    if(spec.kind==='VENN'){
      // every element's own region must be a real area of the drawn figure
      for(const element of model.elements){
        const loops=cellContours(element.cell,spec.layout.circles,spec.layout.rect);
        if(!loops.length)throw new Stop('SET_SPEC_ERROR',{code:'SET_ELEMENT_REGION_EMPTY'});
      }
      resolveVenn(spec,placed);
      routeShadeJumps(spec,placed);
    }else if(spec.kind==='MAPPING')resolveMapping(spec,placed);
    const {width,height}=spec.size;
    for(const item of placed){
      const b=item.box;
      if(b.x<6||b.y<6||b.x+b.width>width-6||b.y+b.height>height-6)throw new Stop(/^(set-count|universal-count)$/.test(item.label.role)||item.label.counted?'SET_COUNT_LABEL_NO_ROOM':item.label.placement==='set'?'SET_LABEL_NO_ROOM':'SET_LABEL_OUT_OF_BOUNDS',{labelId:item.label.id,box:b,size:{width,height}});
    }
    for(let i=0;i<placed.length;i++)for(const other of placed.slice(i+1))if(overlaps(placed[i].box,other.box))throw new Stop(placed[i].label.role==='element'||other.label.role==='element'?'SET_ELEMENT_NO_ROOM':'SET_LABELS_TOO_CLOSE',{labels:[placed[i].label.id,other.label.id]});
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    for(const prim of [...spec.prims].sort((a,b)=>a.layer-b.layer))body+=printPrim(prim);
    for(const {label,fragment,box} of placed){
      const extra=Object.entries(label.extra??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join('');
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="COORDINATE_LABEL" data-label-role="${label.role}" data-priority="0" data-font-px="${font}" data-owner="${label.owner}"${extra}${label.kind==='MATH'?` data-tex="${esc(label.tex)}"`:` data-text="${esc(label.text)}"`} data-fragment-sha="${fragment.fragmentSha256}" data-box="${r6(box.x)},${r6(box.y)},${r6(box.width)},${r6(box.height)}" transform="translate(${r6(box.x)} ${r6(box.y)})">${fragment.svg}</g></g>`;
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="visual-title visual-desc" data-set-diagram="${FIGURE_CAPABILITY}" data-kind="${model.kind}" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="6" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${accessibleNames(model.kind)}${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-set-diagram-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({diagram:plan.diagram,svg},{script:OBSERVER_SCRIPT,timeoutMs:30000});}catch(error){throw new Stop('WORKER_ERROR',{stage:'setDiagramAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'setDiagramAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('SET_DIAGRAM_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('SET_DIAGRAM_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
