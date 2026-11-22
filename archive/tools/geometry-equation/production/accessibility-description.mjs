// The optional top-level plan field `accessibilityDescription` of the standalone figure engines (stat, set, lattice, container): one short Korean plain-text line, at most 500 characters,
// written into the SVG <desc>. Absent field = nothing changes (the figure's bytes stay as they were). The observers check the written <desc> with their own copy of this rule.
export const ACCESSIBILITY_DESCRIPTION_MAX=500;
/** The plan's description, or undefined when the plan has none. Throws the same code the other engines use for a value that is not one non-blank line of at most 500 characters. */
export function readAccessibilityDescription(plan){
  if(!Object.hasOwn(plan,'accessibilityDescription'))return undefined;
  const value=plan.accessibilityDescription;
  if(typeof value!=='string'||!value.trim()||value.length>ACCESSIBILITY_DESCRIPTION_MAX||/[\r\n]/.test(value))throw Error('INVALID_ACCESSIBILITY_DESCRIPTION');
  return value;
}
