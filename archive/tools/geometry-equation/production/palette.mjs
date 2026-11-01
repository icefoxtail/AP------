// Colour groups of plane and coordinate figures (C1): the five colours that say "the same colour = the same thing" (equal areas, equal angles,
// corresponding or equal sides). `fill` and `opacity` are the tint of a region or an angle sector and are the SAME values as a solid figure's
// highlight fills (solid-figure-v1.mjs HIGHLIGHT_FILLS: BLUE is its LIGHT blue); `line` is the darker line colour of the same hue, used for
// segments, angle arcs and marks (at least 3:1 against a white page). The gray LIGHT / MEDIUM fills of older figures are not part of this table.
// The python engine (visual_engine/engine.py PALETTE) and both observers keep their own copy of the table; tests/test_palette_c1.py ties the copies.
export const PALETTE_NAMES=['BLUE','WARM','GREEN','ROSE','VIOLET'];
export const PALETTE={
  BLUE:{fill:'#7fa6e8',opacity:0.32,line:'#1f5fa8'},
  WARM:{fill:'#f2a65a',opacity:0.42,line:'#b85c00'},
  GREEN:{fill:'#6fcf97',opacity:0.42,line:'#2e7d32'},
  ROSE:{fill:'#e98aa8',opacity:0.42,line:'#b8325f'},
  VIOLET:{fill:'#a78bdb',opacity:0.42,line:'#6b46b3'}
};
export const isPaletteName=value=>typeof value==='string'&&PALETTE_NAMES.includes(value);
// stroke width of a coloured segment (a plain segment is 1.6, an emphasised one 3.0)
export const COLORED_SEGMENT_WIDTH=2.4;
