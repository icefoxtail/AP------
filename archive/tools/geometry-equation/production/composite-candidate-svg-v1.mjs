import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {composeConstructionCandidate} from './construction-candidate-svg-v1.mjs';
import {specFor} from './phase2.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {NUMBER_LINE_CAPABILITY,composeNumberLinePanel} from './quadratic-inequality-chain-v1.mjs';
import {captionMathValid} from './number-line-v1.mjs';
import {SOLID_CAPABILITY,GRID_PANEL_WIDTH,composeSolidFigurePanel} from './solid-figure-v1.mjs';
import {isPlaneFigure} from './plane-marks.mjs';
import {FIGURE_CAPABILITY as SET_DIAGRAM_CAPABILITY,solveDiagram as solveSetDiagram,composeSetDiagramFigure} from './set-diagram-v1.mjs';
import {FIGURE_CAPABILITY as STAT_CHART_CAPABILITY,solveStatPanel,composeStatChartFigure} from './stat-chart-v1.mjs';
export const isNumberLinePanel=plan=>plan?.capability===NUMBER_LINE_CAPABILITY;
export const isSolidPanel=plan=>plan?.capability===SOLID_CAPABILITY;
// A Venn or mapping panel (G13b; mapping since the 대응도 composite): a set-diagram-figure-v1 plan, 2-6 of them in the same two-column grid; never mixed with the other panel kinds.
export const isSetPanel=plan=>plan?.capability===SET_DIAGRAM_CAPABILITY;
// A statistics panel (G16): a stat-chart-figure-v1 dot plot drawn compact, 2-4 of them in the same two-column grid; never mixed with the other panel kinds.
export const isStatPanel=plan=>plan?.capability===STAT_CHART_CAPABILITY;
// A normal-curve panel (G19) is a stat panel whose chart is a NORMAL_CURVE: it is drawn at its standalone size (about 548 wide) and 2-3 of them are stacked in one column (never the two-column grid, never mixed with dot or scatter panels).
export const isStatNormalPanel=plan=>isStatPanel(plan)&&plan.chart?.kind==='NORMAL_CURVE';
// A plane-figure panel: the same axis-free PLANE_FIGURE_v1 construction plan authors already use for one figure.
export const isPlanePanel=plan=>plan?.capability==='construction-spike-v1'&&plan.graphPlan===undefined&&isPlaneFigure(plan);
// A grid panel is a plane figure or a solid figure (solid-figure-v1 solids or net): they share one two-column grid of equal cells.
export const isGridPanel=plan=>isPlanePanel(plan)||isSolidPanel(plan)||isSetPanel(plan)||isStatPanel(plan);

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
// A grid of Venn panels is 2 to 6 panels (two columns, up to three rows; an odd last panel sits in the left cell): each is narrowed to a compact panel so two of them and the gap stay inside
// the 848-unit width the solution column allows. More rows make the canvas taller, never the panels smaller; COMPOSITE_MAX_DISPLAY_HEIGHT_PX still decides whether a tall grid fits.
export const COMPOSITE_MIN_SET_PANELS=2,COMPOSITE_MAX_SET_PANELS=6;
// A grid of statistics panels is 2 to 4 compact dot plots (420 units wide each, the same 848-unit width as the Venn grid).
export const COMPOSITE_MIN_STAT_PANELS=2,COMPOSITE_MAX_STAT_PANELS=4;
// A stack of normal-curve panels is 2 or 3 panels (one column): each is a full bell curve with its tick row, so a taller stack would not fit one Archive page.
export const COMPOSITE_MAX_STAT_NORMAL_PANELS=3;
export const compositeGridColumns=count=>Math.min(Math.max(count,1),2);
// Shared rows above a three-panel stack (line equations every panel draws the same): 34 apart, then a gap before the first caption.
export const COMPOSITE_SHARED_ROW=56;// a shared line equation may carry a full-size fraction (about 41 px high)
const TWO_PANEL_PLOT_HEIGHT=300,THREE_PANEL_PLOT_HEIGHT=220;
const SHARED_ROWS_GAP=10;
// The stack must fit one Archive page: a figure taller than 640 CSS px (the solution image max-height) never settles in the paged view.
export const COMPOSITE_MAX_DISPLAY_HEIGHT_PX=640;
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
// A caption's math part is plain ASCII math (k=-2, a=1, a=1/8, x<0): what an observer can transcribe back exactly.
const CAPTION_MATH=/^[A-Za-z0-9=+\-<>.,()\/^{}]{1,24}$/;// ^ and { } write an exponent (V=8a^5b^3): MathJax sets the superscript, the observer reads the TeX back

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
  // Venn panels (set-diagram-figure-v1) form their own grid: all of them, 2 to 6, and nothing else. Codes carry the full name so a failed render shows them.
  const linearStack=plan.linearStack===true;
  if(plan.linearStack!==undefined&&plan.linearStack!==true)bad('LINEAR_STACK_INVALID');
  if(linearStack&&(plan.chain!==undefined||plan.panels.length!==3||!plan.panels.every(p=>{
    const g=p?.plan?.graphPlan,c=g?.pieces?.[0]?.coefficients;
    return p?.plan?.capability==='piecewise-polynomial-spike-v1'&&g?.family==='piecewise-polynomial'&&g.pieces.length===1&&Array.isArray(c)&&c.length===2&&c[1]!=='0'&&!(g.breakpoints?.length)&&g.overviewCanvasHeight===undefined&&g.compositeHeader===undefined;
  })))bad('LINEAR_STACK_INVALID');
  // A multi-curve graph is accepted only as the exact two-case stack that preserves each panel's own graph model and observer.
  // It cannot be mixed with another panel family or generalized to a different panel count here.
  const isMultiCurveCandidate=panel=>panel?.plan?.capability==='multi-curve-figure-v1'||panel?.plan?.graphPlan?.family==='multi-curve';
  const multiCurveCandidates=plan.panels.map(isMultiCurveCandidate),multiCurveStack=multiCurveCandidates.some(Boolean);
  if(multiCurveStack){
    if(plan.chain!==undefined)bad('CHAIN');
    if(plan.panels.length!==2)bad('COMPOSITE_MULTI_CURVE_PANEL_COUNT');
    for(let index=0;index<plan.panels.length;index++){
      const panel=plan.panels[index];
      if(!multiCurveCandidates[index]||panel?.plan?.capability!=='multi-curve-figure-v1'||panel?.plan?.graphPlan?.family!=='multi-curve')bad('COMPOSITE_MULTI_CURVE_PANEL_MIXED_'+index);
    }
  }
  const setPanels=plan.panels.map(panel=>isSetPanel(panel?.plan)),setGrid=setPanels.some(Boolean);
  if(setGrid){
    if(plan.chain!==undefined)bad('CHAIN');
    if(!setPanels.every(Boolean)){const first=setPanels.indexOf(true);throw new Stop('COMPOSITE_SET_PANEL_MIXED_'+first,{reason:'SET_PANEL_MIXED_'+first});}
    if(plan.panels.length<COMPOSITE_MIN_SET_PANELS||plan.panels.length>COMPOSITE_MAX_SET_PANELS)throw new Stop('COMPOSITE_SET_PANEL_COUNT',{reason:'SET_PANEL_COUNT'});
  }
  // Statistics panels (stat-chart-figure-v1) likewise form their own grid: all of them, 2 to 4, and nothing else.
  const statPanels=plan.panels.map(panel=>isStatPanel(panel?.plan)),statGrid=!setGrid&&statPanels.some(Boolean);
  if(statGrid){
    if(plan.chain!==undefined)bad('CHAIN');
    if(!statPanels.every(Boolean)){const first=statPanels.indexOf(true);throw new Stop('COMPOSITE_STAT_PANEL_MIXED_'+first,{reason:'STAT_PANEL_MIXED_'+first});}
    if(plan.panels.length<COMPOSITE_MIN_STAT_PANELS||plan.panels.length>COMPOSITE_MAX_STAT_PANELS)throw new Stop('COMPOSITE_STAT_PANEL_COUNT',{reason:'STAT_PANEL_COUNT'});
    // Normal-curve panels (G19) stack in one column and take only each other: 2 or 3 of them.
    const normalPanels=plan.panels.map(panel=>isStatNormalPanel(panel?.plan));
    if(normalPanels.some(Boolean)){
      if(!normalPanels.every(Boolean)){const first=normalPanels.indexOf(false);throw new Stop('COMPOSITE_STAT_NORMAL_PANEL_MIXED_'+first,{reason:'STAT_NORMAL_PANEL_MIXED_'+first});}
      if(plan.panels.length>COMPOSITE_MAX_STAT_NORMAL_PANELS)throw new Stop('COMPOSITE_STAT_PANEL_COUNT',{reason:'STAT_NORMAL_PANEL_COUNT'});
    }
  }
  const planePanels=plan.panels.map(panel=>isPlanePanel(panel?.plan)),solidPanels=plan.panels.map(panel=>isSolidPanel(panel?.plan));
  // The one-panel stack a standalone solid figure expands to (chain solid-figure-v1) keeps its own path; any other set of plane and solid panels is a grid.
  const solidChain=plan.chain===SOLID_CAPABILITY;
  const grid=!setGrid&&!statGrid&&!solidChain&&planePanels.length>0&&plan.panels.every((panel,index)=>planePanels[index]||solidPanels[index]);
  const withSolid=grid&&solidPanels.some(Boolean);
  if(grid){
    // A grid: no chain marker, 2-5 plane panels (2-6 when a solid panel is among them), every panel a PLANE_FIGURE_v1 construction plan or a solid figure.
    if(plan.chain!==undefined)bad('CHAIN');
    if(plan.panels.length<2||plan.panels.length>(withSolid?COMPOSITE_MAX_SOLID_GRID_PANELS:COMPOSITE_MAX_PLANE_PANELS))bad('PANELS');
  }else if(!setGrid&&!statGrid){
    // A plane or solid panel is never mixed into a graph/number-line stack: the layouts use different geometry units.
    if(planePanels.some(Boolean))bad('PANEL_PLANE_MIXED_'+planePanels.indexOf(true));
    if(!solidChain&&solidPanels.some(Boolean))bad('PANEL_SOLID_MIXED_'+solidPanels.indexOf(true));
    if(plan.panels.length<(plan.chain==='number-line-figure-v1'||plan.chain===SOLID_CAPABILITY?1:2)||plan.panels.length>MAX_PANELS)bad('PANELS');
  }
  // columns (opt-in): 1 stacks plane or Venn panels in one column (each at its own width, the way graph panels stack); 2 is the default grid. Only a plane-figure or Venn composite takes it.
  if(plan.columns!==undefined){
    if(plan.columns!==1&&plan.columns!==2)bad('COLUMNS_INVALID');
    if(!(setGrid||(grid&&!withSolid)))bad('COLUMNS_UNSUPPORTED');
  }
  // Three panels with their own formula headers cannot fit the 640 CSS px stack: each formula moves to its caption row and a line every
  // panel draws identically (same id, slope and intercept) is written once above the stack (phase2 compositeHeader / COMPOSITE_PANEL_CANVAS).
  const three=!grid&&!setGrid&&!statGrid&&plan.panels.length===3,lineKey=line=>JSON.stringify([line.id,line.slope,line.intercept]);
  const checked=plan.panels.map((panel,index)=>{
    const caption=panel?.caption;
    if(!caption||typeof caption!=='object'||Array.isArray(caption)||Object.keys(caption).some(key=>!['math','text','weight'].includes(key))||(!caption.math&&!caption.text)
      ||(caption.math!==undefined&&(typeof caption.math!=='string'||!(CAPTION_MATH.test(caption.math)||captionMathValid(caption.math))))||(caption.text!==undefined&&(typeof caption.text!=='string'||!caption.text||caption.text.length>24))
      ||(caption.weight!==undefined&&(caption.weight!=='MATH'||!caption.text)))bad('PANEL_CAPTION_'+index);
    if(setGrid){
      // A set panel is only {capability,diagram} (a VENN or MAPPING diagram): the composite owns the figure's caption, conditions and quote, the grid owns the panel width.
      const panelPlan=panel.plan,code=reason=>new Stop('PANEL_'+index+':'+reason,{reason:'PANEL_'+index+':'+reason});
      if(Object.keys(panelPlan).some(key=>!['capability','diagram'].includes(key)))throw code('SET_PANEL_PLAN_INVALID');
      if(!panelPlan.diagram||typeof panelPlan.diagram!=='object'||!['VENN','MAPPING'].includes(panelPlan.diagram.kind))throw code('SET_PANEL_KIND_UNSUPPORTED');
      // A mapping panel (대응도) is drawn compact in the two-column grid only with two columns (X to Y); X to Y to Z is 660 wide and stands in a one-column composite (columns:1).
      if(panelPlan.diagram.kind==='MAPPING'&&Array.isArray(panelPlan.diagram.columns)&&panelPlan.diagram.columns.length>2&&plan.columns!==1)throw code('SET_PANEL_MAPPING_COLUMNS_UNSUPPORTED');
      try{solveSetDiagram(panelPlan.diagram);}catch(error){if(!isDomainCode(error))throw error;throw code(error.message);}
      return {index,plan:panelPlan,caption};
    }
    if(statGrid){
      // A statistics panel is only {capability,chart} (a DOT_PLOT chart): the composite owns the figure's caption, conditions and quote, the grid owns the panel width.
      const panelPlan=panel.plan,code=reason=>new Stop('PANEL_'+index+':'+reason,{reason:'PANEL_'+index+':'+reason});
      if(Object.keys(panelPlan).some(key=>!['capability','chart'].includes(key)))throw code('STAT_PANEL_PLAN_INVALID');
      try{solveStatPanel(panelPlan.chart);}catch(error){if(!isDomainCode(error))throw error;throw code(error.message);}
      return {index,plan:panelPlan,caption};
    }
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
    if(!numberLine&&!solid&&(!panel?.plan||!['polynomial-spike-v1','piecewise-polynomial-spike-v1','piecewise-discontinuous-spike-v1',...(multiCurveStack?['multi-curve-figure-v1']:[])].includes(panel.plan.capability)||!panel.plan.graphPlan||typeof panel.plan.graphPlan!=='object'))bad('PANEL_PLAN_'+index);
    if(numberLine||solid)return {index,plan:panel.plan,caption};
    // compositeHeader is the composite's own field: an author never writes it, and a two-panel stack keeps the standard formula header.
    if(!three&&Object.hasOwn(panel.plan.graphPlan,'compositeHeader'))bad('PANEL_COMPOSITE_HEADER_'+index);
    if(three&&!linearStack){
      const coefficients=panel.plan.graphPlan.coefficients,lines=panel.plan.graphPlan.lines??[];
      const degree=Array.isArray(coefficients)?coefficients.reduce((highest,value,k)=>value==='0'?highest:k,0):-1;
      if(degree!==2||panel.plan.graphPlan.overviewCanvasHeight!==undefined||!Array.isArray(lines)||lines.some(line=>typeof line?.id!=='string'))bad('PANEL_NOT_THREE_PANEL_COMPATIBLE_'+index);
    }
    return {index,plan:panel.plan,caption};
  });
  if(grid||setGrid||statGrid)return checked;
  const sharedLines=three&&!linearStack?(checked[0].plan.graphPlan.lines??[]).filter(line=>checked.every(item=>(item.plan.graphPlan.lines??[]).some(other=>lineKey(other)===lineKey(line)))).map(line=>line.id):[];
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
    return {...item,plan:{...item.plan,graphPlan:{...item.plan.graphPlan,plotHeightLimit,...(three&&!linearStack?{compositeHeader:{formula:'CAPTION',sharedLines}}:twoCubic?{overviewHeaderBand:true}:{})}}};
  });
}
/** The stack or grid layout of the checked panels: graph/number-line stacks (and the one solid panel) and normal-curve panels (G19) stay one column; plane, solid, Venn, dot and scatter panels become a grid, unless the plan says columns:1 (plane or Venn panels stacked in one column). */
export const compositePanelLayout=(checked,plan)=>checked.length>1&&checked.every(item=>isGridPanel(item.plan))&&!checked.every(item=>isStatNormalPanel(item.plan))&&plan?.columns!==1
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
// The composite's accessible name, the same source and defaults a single figure uses (spec title = plan caption; description = plan.accessibilityDescription, else a fixed sentence per figure kind).
const xmlText=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// Default <desc> per figure kind (plan.chain), used only when the plan has no accessibilityDescription. Never a value, a scale note or a '?'.
const DEFAULT_DESCRIPTION={
  'number-line-figure-v1':'수직선 위에 범위를 나타낸 그림이다.',
  [SOLID_CAPABILITY]:'입체도형과 주어진 길이·위치를 나타낸 그림이다.',
  'quadratic-inequality-chain-v1':'그래프로 조건을 나타낸 그림이다.',
  plane:'점과 도형의 관계를 확인한다.'
};
export function compositeAccessibleNames(plan){
  const text=value=>typeof value==='string'&&value.trim()&&value.length<=500&&!/[\r\n]/.test(value)?value:null;
  if(plan?.accessibilityDescription!==undefined&&!text(plan.accessibilityDescription))throw new Stop('SPEC_ERROR',{code:'INVALID_ACCESSIBILITY_DESCRIPTION'});
  const title=text(plan?.caption)??'해설 도형',description=plan?.accessibilityDescription??DEFAULT_DESCRIPTION[plan?.chain]??DEFAULT_DESCRIPTION.plane;
  return `<title id="visual-title">${xmlText(title)}</title><desc id="visual-desc">${xmlText(description)}</desc>`;
}
export async function composeCompositeCandidate({plan,panels,identity,typographyPolicy,repairContext=null,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,panelSpecSha256s:[],panelSvgSha256s:[],captionFragmentSha256s:[],sharedRowFragmentSha256s:[],svgSha256:null,renderedLayoutSha256:null};
  const state={svg:null,panels:[],renderedLayout:{status:'NOT_RUN'},layout:null};
  const outcome=(status,detail=null)=>({schemaVersion:COMPOSITE_SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage,panelSpecSha256s:[...lineage.panelSpecSha256s],panelSvgSha256s:[...lineage.panelSvgSha256s],captionFragmentSha256s:[...lineage.captionFragmentSha256s],sharedRowFragmentSha256s:[...lineage.sharedRowFragmentSha256s]},panels:state.panels,renderedLayout:state.renderedLayout,layout:state.layout,layoutRepairs:[],productionAuthorized:false,qualification:'NOT_RUN'});
  let ownBrowser=null;
  const chrome=async()=>browser??(ownBrowser??=await launchBrowser());
  try{
    if(Array.isArray(panels)&&panels.some(p=>p.plan?.problemSourceEdgeStyles)&&(identity?.surface!=='PROBLEM_VISUAL'||plan?.chain!==SOLID_CAPABILITY||panels.length!==1))throw new Stop('PROBLEM_SOURCE_STROKE_STANDALONE_REQUIRED');
    const checked=compositePanels(plan);
    const panelLayout=compositePanelLayout(checked,plan);
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
        :isSetPanel(panel.plan)?await composeSetDiagramFigure({plan:given.plan,model:given.model,identity,typographyPolicy,browser:await chrome(),compact:true})
        :isStatPanel(panel.plan)?await composeStatChartFigure({plan:given.plan,model:given.model,identity,typographyPolicy,browser:await chrome()})
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
        try{fragments.push(typeset({id:`p${panel.index+1}-caption-${kind.toLowerCase()}`,owner:`panel-${panel.index+1}`,factRole:'GIVEN',fontPx:typographyPolicy.baseFontPx,panelId:`p${panel.index+1}`,...(kind==='MATH'?{kind,tex:value.includes('\\frac')?'\\displaystyle '+value:value}:{kind,text:value,...(panel.caption.weight==='MATH'?{weight:'MATH'}:{})})},identity));}
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
          const halves=[text.slice(0,k).trim(),text.slice(k+1).trim()].map((value,n)=>typeset({id:`p${panel.index+1}-caption-text-${n+1}`,owner:`panel-${panel.index+1}`,factRole:'GIVEN',fontPx:typographyPolicy.baseFontPx,panelId:`p${panel.index+1}`,kind:'TEXT',text:value,...(panel.caption.weight==='MATH'?{weight:'MATH'}:{})},identity));
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
    if(stackHeight*typographyPolicy.displayScale>COMPOSITE_MAX_DISPLAY_HEIGHT_PX)throw new Stop('COMPOSITE_TOO_TALL',{displayHeightPx:stackHeight*typographyPolicy.displayScale,limitPx:COMPOSITE_MAX_DISPLAY_HEIGHT_PX,panels:parts.length,layout:panelLayout.kind});
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
    // Same accessible name as a single figure: <title> from the plan caption, <desc> from accessibilityDescription (else the per-kind default), bound by aria-labelledby.
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}" viewBox="0 0 ${width} ${y}" role="img" aria-labelledby="visual-title visual-desc" data-composite="${COMPOSITE_CAPABILITY}">${compositeAccessibleNames(plan)}${body}</svg>`;
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
