// Labels of a number line that stand so close on one line that they read as one number or as a subtraction ("−3" "−2" -> "−3−2", "−2" "−2<x<9" -> "−2−2<x<9").
// The producer keeps at least RUN_GAP px between neighbouring labels of one line (boxes are the glyph boxes: their paths touch the edges); number_line_observer.py re-checks the final SVG with its own
// constants (LABEL_GAP_MIN_PX 5, the same meaning as SC_NORMAL_TICK_NUMBERS_CLOSE of the statistics observer). A label that takes a role in RUN_SKIP is not a number of the axis.
export const RUN_GAP=6;
export const PIECE_SEPARATED_GAP=32;     // the pieces of a set ("−3<x<−2," "−2<x<9") stand this far apart, the earlier one ends with a comma
export const SET_SHIFT_MAX=60;           // a piece label may stand at most this far off the centre of its band (it stays over the band)
export const SET_OVER_BAND_INSET=6;
export const RUN_SKIP=new Set(['note','ratio','row-label','span-label','source-name','variable','header']);

/** The horizontal gap between two boxes {x,y,width,height} that stand on one line (their heights overlap); null when they do not, negative when they overlap. */
export const lineGap=(a,b)=>Math.min(a.y+a.height,b.y+b.height)<=Math.max(a.y,b.y)?null:b.x>=a.x?b.x-(a.x+a.width):a.x-(b.x+b.width);

/** Two placed labels ({label:{role},box}) that run together: on one line and closer than RUN_GAP (an overlap included). */
export function runTogether(a,b,gap=RUN_GAP){
  if(RUN_SKIP.has(a.label.role)||RUN_SKIP.has(b.label.role))return false;
  const g=lineGap(a.box,b.box);
  return g!==null&&g<gap;
}

/**
 * Integer labels (role 'integer', in row `rowN` when given) that run together fall back to the two ends (integerLabels ENDS): the middle labels are removed from `placed`.
 * Returns true when it did so; the caller sets the mode and then checks the ends again.
 */
export function dropMiddleIntegers(placed,rowN){
  const ints=placed.filter(item=>item.label.role==='integer'&&(rowN===undefined||item.label.row===rowN)).sort((a,b)=>a.box.x-b.box.x);
  if(ints.length<3||!ints.some((item,i)=>i&&runTogether(ints[i-1],item)))return false;
  for(const item of ints.slice(1,-1))placed.splice(placed.indexOf(item),1);
  return true;
}
