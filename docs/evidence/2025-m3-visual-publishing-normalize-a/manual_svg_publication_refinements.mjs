import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const changed = [];
const skipped = [];
function p(file) { return path.join(ROOT, file); }
function contentOf(body) { return body.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").trim(); }
function attrsGet(attrs, name) { return new RegExp(`(?:^|\\s)${name}=(['"])([\\s\\S]*?)\\1`, 'i').exec(attrs)?.[2] ?? null; }
function attrsSet(attrs, name, value) { const m = new RegExp(`\\s${name}=(['"])[\\s\\S]*?\\1`, 'i'); const v = String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;'); return m.test(attrs) ? attrs.replace(m, ` ${name}="${v}"`) : `${attrs} ${name}="${v}"`; }
function setText(file, target, occurrence, value, updates = {}) {
  const filePath = p(file); let svg = fs.readFileSync(filePath, 'utf8'); let seen = 0, applied = false;
  svg = svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi, (whole, rawAttrs, body) => {
    if (contentOf(body) !== target || (occurrence != null && seen !== occurrence)) { if (contentOf(body) === target) seen += 1; return whole; }
    seen += 1; applied = true;
    if (value == null) return '';
    let attrs = rawAttrs;
    for (const [name, next] of Object.entries(updates)) {
      if (name === 'fontRole' || name === 'tone') continue;
      attrs = attrsSet(attrs, name, next);
    }
    let outputBody = value;
    if (updates.fontRole === 'MATH_VALUE') {
      const classes = (attrsGet(attrs, 'class') || '').split(/\s+/).filter(Boolean).filter(x => !['ap-pub-text','ap-pub-variable','ap-pub-numeric'].includes(x));
      for (const c of ['ap-pub-label','ap-pub-math','ap-pub-numeric']) if (!classes.includes(c)) classes.push(c);
      attrs = attrsSet(attrs, 'class', classes.join(' '));
      attrs = attrsSet(attrs, 'data-publication-font-role', 'MATH_VALUE');
      attrs = attrsSet(attrs, 'data-publication-tone', updates.tone || 'neutral');
    } else if (updates.fontRole === 'MATH_VARIABLE') {
      const classes = (attrsGet(attrs, 'class') || '').split(/\s+/).filter(Boolean).filter(x => !['ap-pub-text','ap-pub-numeric'].includes(x));
      for (const c of ['ap-pub-label','ap-pub-math','ap-pub-variable']) if (!classes.includes(c)) classes.push(c);
      attrs = attrsSet(attrs, 'class', classes.join(' '));
      attrs = attrsSet(attrs, 'data-publication-font-role', 'MATH_VARIABLE');
      attrs = attrsSet(attrs, 'data-publication-tone', updates.tone || 'neutral');
    }
    return `<text${attrs}>${outputBody}</text>`;
  });
  if (!applied) { skipped.push({ file, target, reason: 'ALREADY_CHANGED_OR_TEXT_VARIANT' }); return; }
  fs.writeFileSync(filePath, svg, 'utf8');
  changed.push({ file, target, value, updates: { ...updates } });
}

function transformTextById(file, id, value, attrs = {}) {
  const filePath = p(file); let svg = fs.readFileSync(filePath, 'utf8'), applied = false;
  svg = svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi, (whole, rawAttrs, body) => {
    if (attrsGet(rawAttrs, 'id') !== id) return whole;
    applied = true;
    if (value == null) return '';
    let next = rawAttrs;
    for (const [name, v] of Object.entries(attrs)) next = attrsSet(next, name, v);
    return `<text${next}>${value}</text>`;
  });
  if (!applied) { skipped.push({ file, id, reason: 'ALREADY_CHANGED_OR_TEXT_VARIANT' }); return; }
  fs.writeFileSync(filePath, svg, 'utf8');
  changed.push({ file, id, value, attrs });
}

function editSvg(file, fn) { const filePath=p(file); let svg=fs.readFileSync(filePath,'utf8'); svg=fn(svg); fs.writeFileSync(filePath,svg,'utf8'); }

// Wangwoon q8: preserve the 45° triangle and base split; remove two result labels already stated in prose.
const wangwoon8='archive/assets/images/25_왕운중_2학기_중간_중3_수학/q8-solution.svg';
setText(wangwoon8,'AH=4',null,null);
setText(wangwoon8,'AC=2√13',null,null);
setText(wangwoon8,'BH=4',null,'BH=4, HC=6',{x:190,y:260,'text-anchor':'middle'});
setText(wangwoon8,'HC=6',null,null);
setText(wangwoon8,'H',null,'H',{x:166,y:225});
editSvg(wangwoon8,svg=>svg.replace('viewBox="0 0 380 270"','viewBox="0 0 380 280"'));

// Wangwoon q16: replace a long equal-side sentence with one short owner-bound length on each side.
const wangwoon16='archive/assets/images/25_왕운중_2학기_중간_중3_수학/q16-solution.svg';
setText(wangwoon16,'AB = BC = CA = 12',null,'12',{x:139,y:153,'text-anchor':'middle','data-publication-font-role':'MATH_VALUE'});
editSvg(wangwoon16,svg=>svg.includes('id="label-side-BC-12"')?svg:svg.replace('</g>\n<style id="apmath-publication-style">',
  '<text id="label-side-BC-12" data-label-kind="length" data-owner-segment="seg-BC" x="281" y="153" text-anchor="middle" class="ap-pub-label ap-pub-math ap-pub-numeric" data-publication-font-role="MATH_VALUE" data-publication-tone="neutral">12</text><text id="label-side-CA-12" data-label-kind="length" data-owner-segment="seg-CA" x="210" y="78" text-anchor="middle" class="ap-pub-label ap-pub-math ap-pub-numeric" data-publication-font-role="MATH_VALUE" data-publication-tone="neutral">12</text></g>\n<style id="apmath-publication-style">'));

// Wangwoon q17: place the segment value at the midpoint of QB.
const wangwoon17='archive/assets/images/25_왕운중_2학기_중간_중3_수학/q17-solution.svg';
setText(wangwoon17,'QB=3',null,'QB=3',{x:250,y:111,'text-anchor':'middle'});

// Wangwoon q18: the remaining BC calculation line is repeated verbatim in the written solution.
setText('archive/assets/images/25_왕운중_2학기_중간_중3_수학/q18-solution.svg','BC: 34−t + (t−8)=26',null,null);

// Pungdeok q16: use the unused right-hand canvas as a clean value key; geometry and point owners stay fixed.
const pungdeok16='archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q16-solution.svg';
for(const value of ['6 cm','3 cm','r−3','r'])setText(pungdeok16,value,null,null);
editSvg(pungdeok16,svg=>svg.includes('AD=DB=6')?svg:svg.replace('</svg>',
  '<text x="280" y="94" class="ap-pub-label ap-pub-math ap-pub-variable" data-publication-font-role="MATH_VARIABLE" data-publication-tone="neutral">AD=DB=6</text><text x="280" y="132" class="ap-pub-label ap-pub-math ap-pub-variable" data-publication-font-role="MATH_VARIABLE" data-publication-tone="neutral">DC=3</text><text x="280" y="170" class="ap-pub-label ap-pub-math ap-pub-variable" data-publication-font-role="MATH_VARIABLE" data-publication-tone="neutral">OD=r−3</text><text x="280" y="208" class="ap-pub-label ap-pub-math ap-pub-variable" data-publication-font-role="MATH_VARIABLE" data-publication-tone="neutral">OC=r</text></svg>'));

// Pungdeok q22: given ground distance is sufficient; the duplicate derived equal tangent segment is in the solution.
transformTextById('archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q22-solution.svg','label-length-BD',null);

// Pungdeok q25: keep given/result values close to their owner segments and remove prose-repeated intermediate 1 and 2.
const pungdeok25='archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q25-solution.svg';
setText(pungdeok25,'1',null,null);
setText(pungdeok25,'2',null,null);
setText(pungdeok25,'PC=7',null,'PC=7',{x:358,y:115,'text-anchor':'middle'});
setText(pungdeok25,'PD=6',null,'PD=6',{x:374,y:169,'text-anchor':'middle'});
setText(pungdeok25,'CD=3',null,'CD=3',{x:273,y:143,'text-anchor':'middle'});

// Yeonhyang arc values stay visually associated with their arcs without repeating the word “호”.
const yeon7='archive/assets/images/25_연향중_2학기_기말_중3_기출/q7-solution.svg';
setText(yeon7,'호 AC=60°',null,'60°',{fontRole:'MATH_VALUE'});
setText(yeon7,'호 BD=60°',null,'60°',{fontRole:'MATH_VALUE'});
setText('archive/assets/images/25_연향중_2학기_기말_중3_기출/q11-solution.svg','합 130°',null,'130°',{fontRole:'MATH_VALUE'});
const yeon22='archive/assets/images/25_연향중_2학기_기말_중3_기출/q22-solution.svg';
setText(yeon22,'호 AB=120°',null,'120°',{fontRole:'MATH_VALUE'});
setText(yeon22,'호 CD=60°',null,'60°',{fontRole:'MATH_VALUE'});
setText(yeon22,'호 AC=x',null,'x',{fontRole:'MATH_VARIABLE'});
setText(yeon22,'호 BD=y',null,'y',{fontRole:'MATH_VARIABLE'});

// Geumdang arc captions shorten to the values displayed on the corresponding arc; copied derivations are removed.
setText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q1-solution.svg','x=113°',null,null);
setText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q2-solution.svg','호 AB = 60°',null,'60°',{fontRole:'MATH_VALUE'});
const geum4='archive/assets/images/25_금당중_2학기_기말_중3_기출/q4-solution.svg';
setText(geum4,'호 AB = 72°',null,'72°',{fontRole:'MATH_VALUE'});
setText(geum4,'호 CD = 96°',null,'96°',{fontRole:'MATH_VALUE'});
setText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q5-solution.svg','AB는 지름 → 호 AB = 180°',null,null);
const geum8='archive/assets/images/25_금당중_2학기_기말_중3_기출/q8-solution.svg';
setText(geum8,'x=25°',null,'x',{fontRole:'MATH_VARIABLE',tone:'blue'});
setText(geum8,'y=25°',null,'y',{fontRole:'MATH_VARIABLE',tone:'blue'});
setText(geum8,'호 AD = 50°',null,null);
setText(geum8,'호 CD = 50°',null,null);
setText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q21-solution.svg','BC ∥ AT',null,null);
setText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q21-solution.svg','∠BAT = ∠ABC = ∠ACB',null,null);
const geum22='archive/assets/images/25_금당중_2학기_기말_중3_기출/q22-solution.svg';
setText(geum22,'AB=32',null,'32',{fontRole:'MATH_VALUE'});
setText(geum22,'BC=16',null,'16',{fontRole:'MATH_VALUE'});
setText(geum22,'AC=16√3',null,'16√3',{fontRole:'MATH_VALUE'});

// Sinheung arc labels use compact mathematical values; the solution text carries the derivation.
const sin6='archive/assets/images/25_신흥중_2학기_기말_중3_기출/q6-solution.svg';
setText(sin6,'호 AE = 32 cm',null,'32 cm',{fontRole:'MATH_VALUE'});
setText(sin6,'호 BE = 13 cm',null,'13 cm',{fontRole:'MATH_VALUE'});
const sin7='archive/assets/images/25_신흥중_2학기_기말_중3_기출/q7-solution.svg';
editSvg(sin7,svg=>{
  svg=svg.replace('viewBox="0 0 420 310"','viewBox="-110 -190 530 510"');
  const screen=47,title=56,print=22;
  return svg.replace(/(<style id="apmath-publication-style">[\s\S]*?text\.ap-pub-label\{font-size:)\d+(px!important)/,`$1${screen}$2`)
    .replace(/(text\.ap-pub-title\{font-size:)\d+(px!important)/,`$1${title}$2`)
    .replace(/(text\.ap-pub-label\{font-size:\d+px!important\}[\s\S]*?@media print\{text\.ap-pub-label\{font-size:)\d+(px!important)/,`$1${print}$2`);
});
const sin11='archive/assets/images/25_신흥중_2학기_기말_중3_기출/q11-solution.svg';
setText(sin11,'호 AB = 160°',null,'160°',{fontRole:'MATH_VALUE'});
setText(sin11,'호 BC = 120°',null,'120°',{fontRole:'MATH_VALUE'});
setText(sin11,'호 CA = 80°',null,'80°',{fontRole:'MATH_VALUE'});
setText('archive/assets/images/25_신흥중_2학기_기말_중3_기출/q22-solution.svg','반지름 = 3√2',null,'3√2',{fontRole:'MATH_VALUE'});

// Round two: keep residual dense values short and position them near their intended owner.
setText(wangwoon16,'12',0,'12',{x:132,y:145,'text-anchor':'middle',fontRole:'MATH_VALUE'});
setText(wangwoon17,'QB=3',null,'QB=3',{x:250,y:55,'text-anchor':'middle'});
for (const [text,y] of [['AD=DB=6',94],['DC=3',132],['OD=r−3',170],['OC=r',208]]) {
  setText(pungdeok16,text,null,text,{x:410,y,'text-anchor':'end'});
}
setText(pungdeok25,'PC=7',null,'7',{x:360,y:118,'text-anchor':'middle',fontRole:'MATH_VALUE'});
setText(pungdeok25,'PD=6',null,'6',{x:380,y:170,'text-anchor':'middle',fontRole:'MATH_VALUE'});
setText(pungdeok25,'CD=3',null,'3',{x:275,y:143,'text-anchor':'middle',fontRole:'MATH_VALUE'});
setText('archive/assets/images/25_연향중_2학기_기말_중3_기출/q11-solution.svg','130°',null,'130°',{x:400,y:155,'text-anchor':'middle',fontRole:'MATH_VALUE'});
setText(yeon22,'60°',null,'60°',{x:170,y:280,'text-anchor':'middle',fontRole:'MATH_VALUE'});
setText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q2-solution.svg','60°',null,null);
setText(geum8,'x',0,'x',{x:260,y:128,'text-anchor':'middle',fontRole:'MATH_VARIABLE',tone:'blue'});
setText(geum8,'y',0,'y',{x:355,y:190,'text-anchor':'middle',fontRole:'MATH_VARIABLE',tone:'blue'});

fs.writeFileSync(path.join(ROOT,'docs/evidence/2025-m3-visual-publishing-normalize-a/manual_svg_refinements.json'),JSON.stringify({schemaVersion:'APMATH_M3_MANUAL_SVG_STYLE_REFINEMENTS_v1',refinements:changed,alreadyChangedTargets:skipped},null,2)+'\n','utf8');
console.log(JSON.stringify({refinements:changed.length,alreadyChangedTargets:skipped.length},null,2));
