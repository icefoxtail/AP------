import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {composeConstructionCandidate} from './construction-candidate-svg-v1.mjs';
import {specFor} from './phase2.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {NUMBER_LINE_CAPABILITY,composeNumberLinePanel} from './quadratic-inequality-chain-v1.mjs';
import {SOLID_CAPABILITY,GRID_PANEL_WIDTH,composeSolidFigurePanel} from './solid-figure-v1.mjs';
import {isPlaneFigure} from './plane-marks.mjs';
export const isNumberLinePanel=plan=>plan?.capability===NUMBER_LINE_CAPABILITY;
export const isSolidPanel=plan=>plan?.capability===SOLID_CAPABILITY;
// A plane-figure panel: the same axis-free PLANE_FIGURE_v1 construction plan authors already use for one figure.
export const isPlanePanel=plan=>plan?.capability==='construction-spike-v1'&&plan.graphPlan===undefined&&isPlaneFigure(plan);
// A grid panel is a plane figure or a solid figure (solid-figure-v1 solids or net): they share one two-column grid of equal cells.
export const isGridPanel=plan=>isPlanePanel(plan)||isSolidPanel(plan);

export const COMPOSITE_SVG_VERSION='composite-candidate-svg-v1';
export const COMPOSITE_CAPABILITY='composite-panels-v1';
// Layout of the stack, in SVG units: a top margin, then per panel one caption row and the panel itself; panels are 8 apart.
export const COMPOSITE_TOP_MARGIN=32;
export const COMPOSITE_CAPTION_ROW=44;
export const COMPOSITE_PANEL_GAP=8;
const SIDE_MARGIN=32,CAPTION_GAP=4,FORMULA_GAP=16,MAX_PANELS=3;
// A caption that does not fit in its row is not refused any more (E7): a plain-text caption wider than its cell breaks into two lines at a space, and a caption block
// taller than COMPOSITE_CAPTION_ROW makes every caption row of that figure as tall as the block plus CAPTION_ROW_PAD (a figure whose captions fit keeps the 44 row).
const CAPTION_LINE_GAP=2,CAPTION_ROW_PAD=4;
// A grid caption stays inside its own cell: 8 px of air on each side keeps two option captions from reading as one phrase.
const GRID_CAPTION_PAD=8;
// An all-plane stack is a grid: two or five option figures are the real cases (five options, two sub-items). The grid is never wider than
// two columns: the Archive displays the solution image in an about 298 CSS px column, and the 11 CSS px label floor inside the 32 px base
// font cap means the measured intrinsic width may not exceed about 848 SVG units. A panel is at least 384 units wide, so a three-column
// row (3*384+2*8 = 1168) is refused at measure with UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE; two columns (776) pass.
// Graph stacks never take this path.
export const COMPOSITE_MAX_PLANE_PANELS=5;
// A grid with a solid panel is at most six panels (three rows of the two-column grid): a solid panel is up to 400 units high, and what the page keeps (COMPOSITE_MAX_DISPLAY_HEIGHT_PX,
// the caption row of every row included) decides whether a tall set still fits: three rows of 400 + 44 + the top margin and gaps are 1380 units, about 520 px at the display scale of the
// 776-unit grid, so six solid panels fit; a grid that is too tall is refused with COMPOSITE_TOO_TALL.
export const COMPOSITE_MAX_SOLID_GRID_PANELS=6;
export const compositeGridColumns=count=>Math.min(Math.max(count,1),2);
// Shared rows above a three-panel stack (line equations every panel draws the same): 34 apart, then a gap before the first caption.
export const COMPOSITE_SHARED_ROW=56;// a shared line equation may carry a full-size fraction (about 41 px high)
const TWO_PANEL_PLOT_HEIGHT=300,THREE_PANEL_PLOT_HEIGHT=220;
const SHARED_ROWS_GAP=10;
// The stack must fit one Archive page: a figure taller than 640 CSS px (the solution image max-height) never settles in the paged view.
export const COMPOSITE_MAX_DISPLAY_HEIGHT_PX=640;
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
// A caption's math part is plain ASCII math (k=-2, a=1, a=1/8, x<0): what an observer can transcribe back exactly.
const CAPTION_MATH=/^[A-Za-z0-9=+\-<>.,()\/]{1,24}$/;

class Stop extends Error{constructor(status,detail=null){super(status);this.status=status;this.detail=detail;}}
const isDomainCode=error=>error?.constructor===Error&&/^[A-Z][A-Z0-9_]*(?::|$)/.test(error.message);
const digest=(value,reason)=>{try{return objectSha(value);}catch{throw new Stop('COMPOSITE_INPUT_NOT_CANONICAL',{reason});}};

/**
 * The panels of a composite plan, checked: 2-3 graph/number-line panels stacked (or the one solid panel of a standalone solid figure), or a grid of
 * 2-5 PLANE_FIGURE_v1 panels, or of 2-6 panels of which at least one is a solid figure (solid-figure-v1 solids or net) and the rest plane figures or solids.
 */
export function compositePanels(plan){
  const bad=reason=>{throw new Stop('COMPOSITE_PLAN_INVALID',{reason});};
  if(plan?.capability!==COMPOSITE_CAPABILITY||!Array.isArray(plan.panels))bad('PANELS');
  const planePanels=plan.panels.map(panel=>isPlanePanel(panel?.plan)),solidPanels=plan.panels.map(panel=>isSolidPanel(panel?.plan));
  // The one-panel stack a standalone solid figure expands to (chain solid-figure-v1) keeps its own path; any other set of plane and solid panels is a grid.
  const solidChain=plan.chain===SOLID_CAPABILITY;
  const grid=!solidChain&&planePanels.length>0&&plan.panels.every((panel,index)=>planePanels[index]||solidPanels[index]);
  const withSolid=grid&&solidPanels.some(Boolean);
  if(grid){
    // A grid: no chain marker, 2-5 plane panels (2-6 when a solid panel is among them), every panel a PLANE_FIGURE_v1 construction plan or a solid figure.
    if(plan.chain!==undefined)bad('CHAIN');
    if(plan.panels.length<2||plan.panels.length>(withSolid?COMPOSITE_MAX_SOLID_GRID_PANELS:COMPOSITE_MAX_PLANE_PANELS))bad('PANELS');
  }else{
    // A plane or solid panel is never mixed into a graph/number-line stack: the layouts use different geometry units.
    if(planePanels.some(Boolean))bad('PANEL_PLANE_MIXED_'+planePanels.indexOf(true));
    if(!solidChain&&solidPanels.some(Boolean))bad('PANEL_SOLID_MIXED_'+solidPanels.indexOf(true));
    if(plan.panels.length<(plan.chain==='number-line-figure-v1'||plan.chain===SOLID_CAPABILITY?1:2)||plan.panels.length>MAX_PANELS)bad('PANELS');
  }
  // Three panels with their own formula headers cannot fit the 640 CSS px stack: each formula moves to its caption row and a line every
  // panel draws identically (same id, slope and intercept) is written once above the stack (phase2 compositeHeader / COMPOSITE_PANEL_CANVAS).
  const three=!grid&&plan.panels.length===3,lineKey=line=>JSON.stringify([line.id,line.slope,line.intercept]);
  const checked=plan.panels.map((panel,index)=>{
    const caption=panel?.caption;
    if(!caption||typeof caption!=='object'||Array.isArray(caption)||Object.keys(caption).some(key=>!['math','text'].includes(key))||(!caption.math&&!caption.text)
      ||(caption.math!==undefined&&(typeof caption.math!=='string'||!CAPTION_MATH.test(caption.math)))||(caption.text!==undefined&&(typeof caption.text!=='string'||!caption.text||caption.text.length>24)))bad('PANEL_CAPTION_'+index);
    if(grid&&solidPanels[index]){
      // A solid panel is a plain solid-figure-v1 plan (solids or net): the figure's caption, conditions and quote belong to the composite, never to a panel.
      // The grid sets the panel width itself (two panels and the gap must fit the Archive solution column); an author never writes it.
      const panelPlan=panel.plan;
      if(['caption','solidCaption','sourceConditions','newVisualInformation','sourceQuote'].some(key=>Object.hasOwn(panelPlan,key)))bad('PANEL_SOLID_PLAN_'+index);
      if(panelPlan.panelWidth!==undefined&&panelPlan.panelWidth!==GRID_PANEL_WIDTH)bad('PANEL_SOLID_PLAN_'+index);
      return {index,plan:{...panelPlan,panelWidth:GRID_PANEL_WIDTH},caption};
    }
    if(grid){
      // Same schema bounds the single PLANE_FIGURE_v1 path enforces; the panel keeps its own model, marks and observer audits.
      const panelPlan=panel?.plan,math=panelPlan?.mathPlan;
      if(!panelPlan||typeof panelPlan!=='object'||Array.isArray(panelPlan)||panelPlan.capability!=='construction-spike-v1'||panelPlan.graphPlan!==undefined||!isPlaneFigure(panelPlan))bad('PANEL_PLAN_'+index);
      if(!math||typeof math!=='object'||Array.isArray(math)||math.schemaVersion!=='construction-spike-v1'||!Array.isArray(math.nodes)||!math.nodes.length)bad('PANEL_PLANE_MATH_'+index);
      if(math.nodes.some(node=>!node||typeof node!=='object'||typeof node.op!=='string'||node.op.startsWith('NORMALIZATION_')))bad('PANEL_PLANE_FRAME_HELPERS_'+index);
      if(!math.nodes.some(node=>node?.op==='SOURCE_POINT'))bad('PANEL_PLANE_SOURCE_POINT_'+index);
      if(panelPlan.coordinateCanvas!==undefined){
        const canvas=panelPlan.coordinateCanvas;
        if(!canvas||typeof canvas!=='object'||Array.isArray(canvas)||!Number.isSafeInteger(canvas.width)||canvas.width<384||canvas.width>720||!Number.isSafeInteger(canvas.height)||canvas.height<320||canvas.height>600)bad('PANEL_PLANE_CANVAS_'+index);
      }
      return {index,plan:panelPlan,caption};
    }
    const numberLine=isNumberLinePanel(panel?.plan),solid=isSolidPanel(panel?.plan);
    // A solid figure (solid-figure-v1) is the only panel of its stack.
    if(solid&&(plan.chain!==SOLID_CAPABILITY||plan.panels.length!==1))bad('SOLID_PANEL_PLACEMENT_'+index);
    // A number line (quadratic-inequality-chain-v1) is the last panel of a two-panel stack, under its quadratic graph.
    if(numberLine&&(three||index!==plan.panels.length-1||!panel.plan.numberLine||typeof panel.plan.numberLine!=='object'||Object.keys(panel.plan).some(key=>!['capability','numberLine','pointNames'].includes(key))))bad('NUMBER_LINE_PANEL_PLACEMENT_'+index);
    if(!numberLine&&!solid&&(!panel?.plan||panel.plan.capability!=='polynomial-spike-v1'||!panel.plan.graphPlan||typeof panel.plan.graphPlan!=='object'))bad('PANEL_PLAN_'+index);
    if(numberLine||solid)return {index,plan:panel.plan,caption};
    // compositeHeader is the composite's own field: an author never writes it, and a two-panel stack keeps the standard formula header.
    if(!three&&Object.hasOwn(panel.plan.graphPlan,'compositeHeader'))bad('PANEL_COMPOSITE_HEADER_'+index);
    if(three){
      const coefficients=panel.plan.graphPlan.coefficients,lines=panel.plan.graphPlan.lines??[];
      const degree=Array.isArray(coefficients)?coefficients.reduce((highest,value,k)=>value==='0'?highest:k,0):-1;
      if(degree!==2||panel.plan.graphPlan.overviewCanvasHeight!==undefined||!Array.isArray(lines)||lines.some(line=>typeof line?.id!=='string'))bad('PANEL_NOT_THREE_PANEL_COMPATIBLE_'+index);
    }
    return {index,plan:panel.plan,caption};
  });
  if(grid)return checked;
  const sharedLines=three?(checked[0].plan.graphPlan.lines??[]).filter(line=>checked.every(item=>(item.plan.graphPlan.lines??[]).some(other=>lineKey(other)===lineKey(line)))).map(line=>line.id):[];
  // Two cubic/quartic cases: their long formula has no room inside the panel beside the y-axis, so each panel keeps its own plot and gains
  // an 80 px header band above it where the formula is written (overviewHeaderBand -> phase2 CUBIC_COMPOSITE_PANEL_CANVAS).
  const degreeOf=item=>{const coefficients=item.plan?.graphPlan?.coefficients;return Array.isArray(coefficients)?coefficients.reduce((highest,value,k)=>value==='0'?highest:k,0):-1;};
  const twoCubic=!three&&checked.every(item=>!isNumberLinePanel(item.plan)&&degreeOf(item)>=3);
  // A panel's plot may be at most this high (graph_framing plotHeightLimit): one scale on both axes makes a tall shape narrower, not the stack
  // taller. Band rows the panel keeps (unshared line equations, band coordinates counted one per row) come out of that height.
  const bandRows=plan=>(Array.isArray(plan.graphPlan.lines)?plan.graphPlan.lines.filter(line=>!sharedLines.includes(line?.id)).length:0)
    +(plan.coordinatePlacement==='PANEL'?(plan.graphPlan.requiredPoints??[]).length:(Array.isArray(plan.coordinatePanel)?plan.coordinatePanel.length:0)+(plan.pointNames&&typeof plan.pointNames==='object'?Object.keys(plan.pointNames).filter(id=>!(plan.coordinatePanel??[]).includes(id)).length:0));
  return checked.map(item=>{
    if(isNumberLinePanel(item.plan)||isSolidPanel(item.plan))return item;
    const rows=bandRows(item.plan),plotHeightLimit=Math.max(120,(three?THREE_PANEL_PLOT_HEIGHT:TWO_PANEL_PLOT_HEIGHT)-(rows?26+56*rows:0));
    return {...item,plan:{...item.plan,graphPlan:{...item.plan.graphPlan,plotHeightLimit,...(three?{compositeHeader:{formula:'CAPTION',sharedLines}}:twoCubic?{overviewHeaderBand:true}:{})}}};
  });
}
/** The stack or grid layout of the checked panels: graph/number-line stacks (and the one solid panel) stay one column; plane and solid panels become a grid. */
export const compositePanelLayout=checked=>checked.length>1&&checked.every(item=>isGridPanel(item.plan))
  ?{kind:'GRID',columns:compositeGridColumns(checked.length),rows:Math.ceil(checked.length/compositeGridColumns(checked.length))}
  :{kind:'STACK',columns:1,rows:checked.length};
/** The stacked/gridded size for panels of the given sizes (top margin, caption row per panel, gaps between panels): what the Archive policy must be measured for. */
export const compositeStackSize=(sizes,sharedRows=0,layout={columns:1},captionRow=COMPOSITE_CAPTION_ROW)=>{
  const columns=layout?.columns??1,shared=sharedRows?sharedRows*COMPOSITE_SHARED_ROW+SHARED_ROWS_GAP:0;
  if(columns===1)return {width:Math.max(...sizes.map(size=>size.width)),height:COMPOSITE_TOP_MARGIN+shared+sizes.reduce((sum,size)=>sum+captionRow+size.height,0)+COMPOSITE_PANEL_GAP*(sizes.length-1),columns:1,rows:sizes.length};
  // A grid cell is as big as the largest panel of its row family: two panels share a column width and a row height, so no panel is
  // resized or distorted, and the smaller ones are centred in their cell.
  const cellWidth=Math.max(...sizes.map(size=>size.width)),cellHeight=Math.max(...sizes.map(size=>size.height)),rows=Math.ceil(sizes.length/columns);
  return {width:cellWidth*columns+COMPOSITE_PANEL_GAP*(columns-1),height:COMPOSITE_TOP_MARGIN+shared+rows*(captionRow+cellHeight)+COMPOSITE_PANEL_GAP*(rows-1),columns,rows,cellWidth,cellHeight};
};
/** The number of shared rows above the stack of checked panels (0 unless the panels carry a compositeHeader). */
export const compositeSharedRowCount=checked=>checked[0]?.plan?.graphPlan?.compositeHeader?.sharedLines?.length??0;
/**
 * The texts a three-panel composite writes outside its panels, from the engine's own labels of each panel drawn the standard way (with its
 * formula header): per panel the formula label, and the shared line equation labels (the same in every panel). Null without a compositeHeader.
 */
export async function compositeHeaderLabels(checked,models,assetId){
  if(!checked[0]?.plan?.graphPlan?.compositeHeader)return null;
  const perPanel=[];
  for(const panel of checked){
    const {compositeHeader,...graphPlan}=panel.plan.graphPlan;
    let spec;
    try{spec=specFor({...panel.plan,graphPlan},models[panel.index],assetId);}catch(error){if(!isDomainCode(error))throw error;throw new Stop('COMPOSITE_HEADER_SPEC_ERROR',{panel:panel.index,code:error.message});}
    let response;
    try{response=await pythonWorker({action:'prepare',spec});}catch(error){throw new Stop('COMPOSITE_HEADER_LABELS_UNAVAILABLE',{panel:panel.index,code:String(error?.message??error)});}
    if(response?.status!=='OK'||!Array.isArray(response.result?.labels))throw new Stop('COMPOSITE_HEADER_LABELS_UNAVAILABLE',{panel:panel.index,code:response?.result?.code??null});
    const byId=new Map(response.result.labels.map(label=>[label.id,label]));
    const pick=id=>{const label=byId.get(id);if(!label||typeof label.text!=='string'||!label.text)throw new Stop('COMPOSITE_HEADER_LABEL_MISSING',{panel:panel.index,labelId:id});return {id,text:label.text,math:!!label.math,tex:label.tex??null};};
    perPanel.push({formula:pick('formula'),lines:compositeHeader.sharedLines.map(lineId=>pick('line-'+lineId+'-equation'))});
  }
  if(perPanel.some(row=>JSON.stringify(row.lines)!==JSON.stringify(perPanel[0].lines)))throw new Stop('COMPOSITE_SHARED_LINE_TEXT_MISMATCH');
  return {formulas:perPanel.map(row=>row.formula),shared:perPanel[0].lines};
}
// The same fragment request L1 makes for a label (construction-candidate-svg-v1): math as TeX, text as outline text.
const headerFragment=(typeset,label,id,owner,typographyPolicy,identity)=>typeset({id,owner,factRole:'DERIVED_INTERMEDIATE',fontPx:typographyPolicy.baseFontPx,...(label.math?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
/** The plain text an observer reads for a caption: math then text, as one phrase. */
export const captionText=caption=>(caption.math??'')+(caption.text??'');

function rootSize(svg){
  const tag=svg.match(/<svg\b[^>]*>/)?.[0]??'',num=name=>Number(tag.match(new RegExp(`\\s${name}="([\\d.]+)"`))?.[1]);
  const width=num('width'),height=num('height');
  if(!(width>0&&height>0))throw new Stop('COMPOSITE_PANEL_SIZE_UNKNOWN');
  return {width,height};
}
/** The panel SVGs inside a composite, decoded from their data URIs in order: the bytes L1 audited, never re-serialized. */
export function compositePanelBytes(svg){
  return [...svg.matchAll(/<image id="p(\d+)-panel"[^>]*\shref="data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)"/g)].map(match=>({panel:Number(match[1]),bytes:Buffer.from(match[2],'base64')}));
}

/**
 * Compose each panel with L1 under one Archive typography policy (measured for the whole stacked size), typeset each caption, and stack
 * captions and panels top to bottom. Each panel is embedded as the exact bytes L1 audited (a data: URI image), so ids never collide and
 * captureArchiveCandidate can decode and re-hash them. Each panel keeps its own L1 static and rendered audits; this module adds the stack
 * and a rendered layout check of the stack (captions, panel boxes).
 */
export async function composeCompositeCandidate({plan,panels,identity,typographyPolicy,repairContext=null,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,panelSpecSha256s:[],panelSvgSha256s:[],captionFragmentSha256s:[],sharedRowFragmentSha256s:[],svgSha256:null,renderedLayoutSha256:null};
  const state={svg:null,panels:[],renderedLayout:{status:'NOT_RUN'},layout:null};
  const outcome=(status,detail=null)=>({schemaVersion:COMPOSITE_SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage,panelSpecSha256s:[...lineage.panelSpecSha256s],panelSvgSha256s:[...lineage.panelSvgSha256s],captionFragmentSha256s:[...lineage.captionFragmentSha256s],sharedRowFragmentSha256s:[...lineage.sharedRowFragmentSha256s]},panels:state.panels,renderedLayout:state.renderedLayout,layout:state.layout,layoutRepairs:[],productionAuthorized:false,qualification:'NOT_RUN'});
  let ownBrowser=null;
  const chrome=async()=>browser??(ownBrowser??=await launchBrowser());
  try{
    const checked=compositePanels(plan);
    const panelLayout=compositePanelLayout(checked);
    state.layout={kind:panelLayout.kind,columns:panelLayout.columns,rows:panelLayout.rows};
    if(!Array.isArray(panels)||panels.length!==checked.length||panels.some(panel=>!panel||typeof panel!=='object'||!panel.plan||!panel.model))throw new Stop('COMPOSITE_PANEL_MODELS_MISSING');
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('COMPOSITE_TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=digest(plan,'plan');lineage.modelSha256=digest({panels:panels.map(panel=>panel.model)},'model');lineage.typographyPolicySha256=digest(typographyPolicy,'typographyPolicy');
    const parts=[];
    for(const panel of checked){
      const given=panels[panel.index];
      if(digest(given.plan,'panelPlan')!==digest(panel.plan,'panelPlan'))throw new Stop('COMPOSITE_PANEL_PLAN_MISMATCH',{panel:panel.index});
      const composed=isNumberLinePanel(panel.plan)?await composeNumberLinePanel({plan:given.plan,model:given.model,identity,typographyPolicy,browser:await chrome()})
        :isSolidPanel(panel.plan)?await composeSolidFigurePanel({plan:given.plan,model:given.model,identity,typographyPolicy,browser:await chrome()})
        :await composeConstructionCandidate({plan:given.plan,model:given.model,identity,typographyPolicy,repairContext,browser:await chrome(),compositePanel:true});
      state.panels.push({index:panel.index,status:composed.status,detail:composed.detail,lineage:composed.lineage,layoutRepairs:composed.layoutRepairs,staticAudit:composed.staticAudit,renderedLayout:composed.renderedLayout});
      if(composed.status!=='COMPOSED')throw new Stop('COMPOSITE_PANEL_NOT_COMPOSED',{panel:panel.index,status:composed.status,detail:composed.detail});
      lineage.panelSpecSha256s.push(composed.lineage.specSha256);lineage.panelSvgSha256s.push(composed.lineage.svgSha256);
      parts.push({panel,svg:composed.svg,size:rootSize(composed.svg)});
    }
    // Captions: the math part as MathJax, the text part in the Korean outline font, side by side at the policy base font. In a three-panel
    // stack the panel's formula follows in the same row, a little apart, and the shared line equations are rows above the first caption.
    const typeset=typesetter(),captions=[],header=await compositeHeaderLabels(checked,panels.map(panel=>panel.model),identity.assetId);
    for(const {panel} of parts){
      const fragments=[];
      for(const [kind,value] of [['MATH',panel.caption.math],['TEXT',panel.caption.text]]){
        if(!value)continue;
        try{fragments.push(typeset({id:`p${panel.index+1}-caption-${kind.toLowerCase()}`,owner:`panel-${panel.index+1}`,factRole:'GIVEN',fontPx:typographyPolicy.baseFontPx,panelId:`p${panel.index+1}`,...(kind==='MATH'?{kind,tex:value}:{kind,text:value})},identity));}
        catch(error){if(!isDomainCode(error))throw error;throw new Stop('COMPOSITE_CAPTION_TYPESET_ERROR',{panel:panel.index,code:error.message});}
      }
      if(header){
        try{fragments.push({...headerFragment(typeset,header.formulas[panel.index],`p${panel.index+1}-caption-formula`,`panel-${panel.index+1}`,typographyPolicy,identity),formula:true});}
        catch(error){if(!isDomainCode(error))throw error;throw new Stop('COMPOSITE_CAPTION_TYPESET_ERROR',{panel:panel.index,code:error.message});}
      }
      lineage.captionFragmentSha256s.push(fragments.map(fragment=>fragment.fragmentSha256));
      captions.push(fragments);
    }
    const sharedRows=[];
    for(const label of header?.shared??[]){
      try{sharedRows.push(headerFragment(typeset,label,'shared-'+label.id,'composite',typographyPolicy,identity));}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('COMPOSITE_SHARED_ROW_TYPESET_ERROR',{labelId:label.id,code:error.message});}
    }
    lineage.sharedRowFragmentSha256s.push(...sharedRows.map(fragment=>fragment.fragmentSha256));
    if(panelLayout.kind==='GRID'&&sharedRows.length)throw new Stop('COMPOSITE_GRID_HEADER_UNSUPPORTED');
    // Captions that do not fit (E7): a plain-text caption wider than its cell/row breaks into two lines at a space; a caption block taller than the standard row
    // makes the caption rows of this figure taller. The cell width and the available caption width do not depend on the caption row.
    const sizeAtStandardRow=compositeStackSize(parts.map(part=>part.size),sharedRows.length,panelLayout);
    // A grid caption is centred in its cell and the rendered-layout check keeps every caption SIDE_MARGIN inside the figure's edge (the grid's cells are its two
    // outer columns), so the width a grid caption may have is the cell width less two side margins (it used to be less two GRID_CAPTION_PAD, which is looser:
    // a caption between the two widths was only caught later as TEXT_CLIPPED).
    const captionLimit=panelLayout.kind==='GRID'?sizeAtStandardRow.cellWidth-2*Math.max(GRID_CAPTION_PAD,SIDE_MARGIN):sizeAtStandardRow.width-2*SIDE_MARGIN;
    const lineWidth=line=>line.reduce((sum,fragment,k)=>sum+fragment.intrinsic.width+(k?fragment.formula?FORMULA_GAP:CAPTION_GAP:0),0);
    const lineHeight=line=>Math.max(...line.map(fragment=>fragment.intrinsic.height));
    const blockHeight=lines=>lines.length===1?lineHeight(lines[0]):lines.reduce((sum,line)=>sum+lineHeight(line),0)+CAPTION_LINE_GAP*(lines.length-1);
    const captionLines=captions.map((fragments,i)=>{
      const panel=parts[i].panel;
      if(lineWidth(fragments)<=captionLimit||header||panel.caption.math||!panel.caption.text)return [fragments];
      const text=panel.caption.text,middle=text.length/2;
      const spaces=[...text].map((character,k)=>character===' '?k:-1).filter(k=>k>0&&k<text.length-1).sort((a,b)=>Math.abs(a-middle)-Math.abs(b-middle)||a-b);
      for(const k of spaces){
        try{
          const halves=[text.slice(0,k).trim(),text.slice(k+1).trim()].map((value,n)=>typeset({id:`p${panel.index+1}-caption-text-${n+1}`,owner:`panel-${panel.index+1}`,factRole:'GIVEN',fontPx:typographyPolicy.baseFontPx,panelId:`p${panel.index+1}`,kind:'TEXT',text:value},identity));
          if(halves.every(fragment=>fragment.intrinsic.width<=captionLimit)){lineage.captionFragmentSha256s[i]=halves.map(fragment=>fragment.fragmentSha256);return halves.map(fragment=>[fragment]);}
        }catch(error){if(!isDomainCode(error))throw error;}
      }
      return [fragments];
    });
    const neededRow=Math.max(...captionLines.map(blockHeight)),captionRow=neededRow>COMPOSITE_CAPTION_ROW?Math.ceil(neededRow)+CAPTION_ROW_PAD:COMPOSITE_CAPTION_ROW;
    // One caption: its lines centred in `span` starting at `left`, in a row starting at `rowTop` (a one-line caption is centred in the row by each fragment's own height).
    const captionMarkup=(i,left,span,rowTop)=>{
      const lines=captionLines[i];let top=rowTop+(captionRow-blockHeight(lines))/2;
      let out=`<g id="p${i+1}-caption" data-role="caption" data-panel="${i+1}" data-font-px="${typographyPolicy.baseFontPx}">`;
      for(const line of lines){
        const rowHeight=lineHeight(line);let x=left+(span-lineWidth(line))/2;
        for(const fragment of line){
          const dy=lines.length===1?rowTop+(captionRow-fragment.intrinsic.height)/2:top+(rowHeight-fragment.intrinsic.height)/2;
          out+=`<g id="p${i+1}-${fragment.labelId}" transform="translate(${x} ${dy})" data-label-kind="CAPTION" data-owner="panel-${i+1}" data-fragment-sha="${fragment.fragmentSha256}">${fragment.svg}</g>`;
          x+=fragment.intrinsic.width+(line[line.indexOf(fragment)+1]?.formula?FORMULA_GAP:CAPTION_GAP);
        }
        top+=rowHeight+CAPTION_LINE_GAP;
      }
      return out+'</g>';
    };
    const {width,height:stackHeight,cellWidth,cellHeight}=compositeStackSize(parts.map(part=>part.size),sharedRows.length,panelLayout,captionRow);
    if(stackHeight*typographyPolicy.displayScale>COMPOSITE_MAX_DISPLAY_HEIGHT_PX)throw new Stop('COMPOSITE_TOO_TALL',{displayHeightPx:stackHeight*typographyPolicy.displayScale,limitPx:COMPOSITE_MAX_DISPLAY_HEIGHT_PX});
    let y=COMPOSITE_TOP_MARGIN,body='';
    if(sharedRows.length)body+=`<g id="shared-rows" data-role="shared-rows" data-font-px="${typographyPolicy.baseFontPx}">`;
    sharedRows.forEach((fragment,i)=>{
      if(fragment.intrinsic.width>width-2*SIDE_MARGIN||fragment.intrinsic.height>COMPOSITE_SHARED_ROW)throw new Stop('COMPOSITE_SHARED_ROW_TOO_LARGE',{row:i,width:fragment.intrinsic.width});
      body+=`<g id="${fragment.labelId}" transform="translate(${(width-fragment.intrinsic.width)/2} ${y+(COMPOSITE_SHARED_ROW-fragment.intrinsic.height)/2})" data-label-kind="CAPTION" data-owner="composite" data-fragment-sha="${fragment.fragmentSha256}">${fragment.svg}</g>`;
      y+=COMPOSITE_SHARED_ROW;
    });
    if(sharedRows.length)body+='</g>',y+=SHARED_ROWS_GAP;
    if(panelLayout.kind==='GRID'){
      // A grid: caption rows and panel boxes line up in equal cells; each panel keeps its audited SVG bytes and is only centred in its cell.
      // A caption may not reach into the next cell, or two option labels would read as one.
      const {columns}=panelLayout;
      parts.forEach((part,i)=>{
        const captionWidth=Math.max(...captionLines[i].map(lineWidth));
        if(captionWidth>captionLimit||captionLines[i].some(line=>lineHeight(line)>captionRow))throw new Stop('COMPOSITE_CAPTION_TOO_LARGE',{panel:i,width:captionWidth,limit:captionLimit});
        const column=i%columns,row=Math.floor(i/columns),cellX=column*(cellWidth+COMPOSITE_PANEL_GAP),rowY=COMPOSITE_TOP_MARGIN+row*(captionRow+cellHeight+COMPOSITE_PANEL_GAP);
        body+=captionMarkup(i,cellX,cellWidth,rowY);
        body+=`<image id="p${i+1}-panel" data-panel="${i+1}" data-panel-svg-sha="${lineage.panelSvgSha256s[i]}" x="${cellX+(cellWidth-part.size.width)/2}" y="${rowY+captionRow+(cellHeight-part.size.height)/2}" width="${part.size.width}" height="${part.size.height}" href="data:image/svg+xml;base64,${Buffer.from(part.svg,'utf8').toString('base64')}"/>`;
      });
      y=COMPOSITE_TOP_MARGIN+panelLayout.rows*(captionRow+cellHeight)+COMPOSITE_PANEL_GAP*(panelLayout.rows-1);
      if(y!==stackHeight)throw new Stop('COMPOSITE_STACK_SIZE_MISMATCH',{expected:stackHeight,actual:y});
    }else{
      parts.forEach((part,i)=>{
        const captionWidth=Math.max(...captionLines[i].map(lineWidth));
        if(captionWidth>width-2*SIDE_MARGIN||captionLines[i].some(line=>lineHeight(line)>captionRow))throw new Stop('COMPOSITE_CAPTION_TOO_LARGE',{panel:i,width:captionWidth});
        body+=captionMarkup(i,0,width,y);
        y+=captionRow;
        body+=`<image id="p${i+1}-panel" data-panel="${i+1}" data-panel-svg-sha="${lineage.panelSvgSha256s[i]}" x="${(width-part.size.width)/2}" y="${y}" width="${part.size.width}" height="${part.size.height}" href="data:image/svg+xml;base64,${Buffer.from(part.svg,'utf8').toString('base64')}"/>`;
        y+=part.size.height+(i<parts.length-1?COMPOSITE_PANEL_GAP:0);
      });
      if(y!==stackHeight)throw new Stop('COMPOSITE_STACK_SIZE_MISMATCH',{expected:stackHeight,actual:y});
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}" viewBox="0 0 ${width} ${y}" data-composite="${COMPOSITE_CAPABILITY}">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    const display={width:width*typographyPolicy.displayScale,height:y*typographyPolicy.displayScale};
    const page=await (await chrome()).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=digest({svgSha256:lineage.svgSha256,layout},'renderedLayout');
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('COMPOSITE_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
