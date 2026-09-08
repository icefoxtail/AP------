// Bounded expression grammar: no eval, property access, arbitrary calls or names.
const FUNCTION_NAMES = new Set(['sqrt', 'abs', 'exp', 'ln', 'log', 'log10', 'sin', 'cos', 'tan']);
const PI = Math.PI;

export function parseExpression(text) {
  if (typeof text !== 'string' || text.length > 500) throw new Error('FORMULA_SCHEMA');
  const tokens = text.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|\*\*|[A-Za-z][A-Za-z0-9]*|[()+\-*/^]/g) || [];
  if (tokens.join('') !== text.replace(/\s/g, '') || tokens.length > 100) throw new Error('UNSUPPORTED_FORMULA_TOKEN');
  let at = 0;
  const atom = () => {
    const token = tokens[at++];
    if (token === '(') { const value = add(); if (tokens[at++] !== ')') throw new Error('FORMULA_PAREN'); return value; }
    if (token === 'x') return { op: 'x' };
    if (FUNCTION_NAMES.has(token)) {
      if (tokens[at++] !== '(') throw new Error('FUNCTION_PAREN'); const value = add(); if (tokens[at++] !== ')') throw new Error('FUNCTION_PAREN'); return { op: token, value };
    }
    if (token !== undefined && Number.isFinite(Number(token)) && Math.abs(Number(token)) <= Number.MAX_SAFE_INTEGER) return { op: 'number', value: Number(token) };
    throw new Error('UNSUPPORTED_FORMULA');
  };
  const power = () => { let left = atom(); if (['**', '^'].includes(tokens[at])) { at++; left = { op: '**', left, right: unary() }; } return left; };
  const unary = () => ['+', '-'].includes(tokens[at]) ? { op: tokens[at++] === '+' ? 'positive' : 'negative', value: unary() } : power();
  const multiply = () => { let left = unary(); while (['*', '/'].includes(tokens[at])) { const op = tokens[at++]; left = { op, left, right: unary() }; } return left; };
  const add = () => { let left = multiply(); while (['+', '-'].includes(tokens[at])) { const op = tokens[at++]; left = { op, left, right: multiply() }; } return left; };
  const tree = add(); if (at !== tokens.length) throw new Error('FORMULA_TRAILING_TOKEN'); return tree;
}

function periodicCriticalPoints(low, high, offset, period) {
  const points = [];
  for (let k = Math.ceil((low - offset) / period); offset + k * period <= high; k++) points.push(offset + k * period);
  return points;
}

function trigonometricInterval(op, low, high) {
  if (high - low >= 2 * PI) return [-1, 1];
  const values = [Math[op](low), Math[op](high)];
  const offset = op === 'sin' ? PI / 2 : 0;
  for (const point of periodicCriticalPoints(low, high, offset, PI)) values.push(Math[op](point));
  return [Math.min(...values), Math.max(...values)];
}

function tangentInterval(low, high) {
  if (high - low >= PI) throw new Error('POLE_UNCERTAIN');
  if (periodicCriticalPoints(low, high, PI / 2, PI).length) throw new Error('POLE_UNCERTAIN');
  const values = [Math.tan(low), Math.tan(high)];
  if (values.some(value => !Number.isFinite(value))) throw new Error('POLE_UNCERTAIN');
  return [Math.min(...values), Math.max(...values)];
}

function interval(tree, low, high) {
  if (tree.op === 'number') return [tree.value, tree.value];
  if (tree.op === 'x') return [low, high];
  if (tree.value) {
    const [a, b] = interval(tree.value, low, high);
    if (tree.op === 'positive') return [a, b];
    if (tree.op === 'negative') return [-b, -a];
    if (tree.op === 'sqrt') { if (a < 0) throw new Error('DOMAIN_UNCERTAIN'); return [Math.sqrt(a), Math.sqrt(b)]; }
    if (tree.op === 'abs') return [a <= 0 && b >= 0 ? 0 : Math.min(Math.abs(a), Math.abs(b)), Math.max(Math.abs(a), Math.abs(b))];
    if (tree.op === 'exp') return [Math.exp(a), Math.exp(b)];
    if (tree.op === 'ln' || tree.op === 'log' || tree.op === 'log10') {
      if (a <= 0) throw new Error('DOMAIN_UNCERTAIN');
      const base10 = tree.op === 'log' || tree.op === 'log10';
      const fn = base10 ? Math.log10 : Math.log;
      return [fn(a), fn(b)];
    }
    if (tree.op === 'sin' || tree.op === 'cos') return trigonometricInterval(tree.op, a, b);
    if (tree.op === 'tan') return tangentInterval(a, b);
  }
  const [a, b] = interval(tree.left, low, high), [c, d] = interval(tree.right, low, high);
  if (tree.op === '+') return [a + c, b + d];
  if (tree.op === '-') return [a - d, b - c];
  if (tree.op === '*') {
    if (JSON.stringify(tree.left) === JSON.stringify(tree.right)) return [a <= 0 && b >= 0 ? 0 : Math.min(a*a,b*b), Math.max(a*a,b*b)];
    const products = [a*c,a*d,b*c,b*d]; return [Math.min(...products), Math.max(...products)];
  }
  if (tree.op === '/') { if (c <= 0 && d >= 0) throw new Error('POLE_UNCERTAIN'); const values = [a/c,a/d,b/c,b/d]; return [Math.min(...values), Math.max(...values)]; }
  if (tree.op === '**') {
    if (Math.abs(c) > 12 || (!Number.isInteger(c) && a < 0) || (c < 0 && a <= 0 && b >= 0)) throw new Error('POWER_DOMAIN_UNCERTAIN');
    if (c !== d && a <= 0) throw new Error('POWER_DOMAIN_UNCERTAIN');
    if (c === 0 && d === 0) return [1, 1];
    const values = [a**c, a**d, b**c, b**d];
    if (c <= 0 && d >= 0 && a <= 1 && b >= 1) values.push(1);
    if (c === d && Number.isInteger(c) && c > 0 && c % 2 === 0 && a <= 0 && b >= 0) values.push(0);
    return [Math.min(...values), Math.max(...values)];
  }
  throw new Error('UNSUPPORTED_EXPRESSION');
}

export function verifyBranch(branch, bounds) {
  try {
    const tree = parseExpression(branch.formula);
    for (const point of branch.points) {
      const [value] = interval(tree, point.x, point.x);
      if (!Number.isFinite(value) || Math.abs(value - point.y) > 1e-8 * Math.max(1, Math.abs(value))) return false;
    }
    const check = (left, right, depth = 0) => {
      try {
        const [low, high] = interval(tree, left, right);
        if (Number.isFinite(low) && Number.isFinite(high) && low >= bounds.yMin - 1e-8 && high <= bounds.yMax + 1e-8) return true;
      } catch { /* refine a conservative interval, never bridge a possible pole */ }
      if (depth >= 12 || right - left < 1e-12) return false;
      const mid = (left + right) / 2;
      return check(left, mid, depth + 1) && check(mid, right, depth + 1);
    };
    for (let i = 1; i < branch.points.length; i++) if (!check(branch.points[i-1].x, branch.points[i].x)) return false;
    return true;
  } catch { return false; }
}
