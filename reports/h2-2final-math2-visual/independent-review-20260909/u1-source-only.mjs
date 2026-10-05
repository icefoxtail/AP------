import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = 'C:/Users/work1/Desktop/AP-------h2-math2-independent-review';
const OUT = path.join(ROOT, 'reports/h2-2final-math2-visual/independent-review-20260909');
const SRC = path.join(ROOT, 'archive/exams/original/high/h2/2final');
const EXAMS = [
  '25_강남여고_2학기_기말_고2_수학II.js',
  '25_매산고_2학기_기말_고2_수학II.js',
  '25_매산여고_2학기_기말_고2_수학II.js',
  '25_순천고_2학기_기말_고2_수학II.js',
  '25_제일고_2학기_기말_고2_수학II.js',
];

function sha256(file) {
  return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
}
function ref(file) {
  const st = fs.statSync(file);
  return { path: path.relative(ROOT, file).replaceAll('\\', '/'), bytes: st.size, sha256: sha256(file) };
}
function parseBank(text) {
  const start = text.indexOf('window.questionBank =');
  const open = text.indexOf('[', start);
  let i = open, depth = 0, quote = null, escaped = false;
  for (; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '[') depth += 1;
    else if (c === ']') { depth -= 1; if (depth === 0) break; }
  }
  return JSON.parse(text.slice(open, i + 1));
}

// Deliberately keyed only by the problem statement. No solution, answer, or
// solutionImage fields are referenced in this source-only process.
const INDEPENDENT = {
  '25_강남여고_2학기_기말_고2_수학II:q3': { usedFunctions: ['v(t)=-t^2+10t', 'a(t)=v\'(t)'], keyFacts: ['a=5'], calculationProcedure: 'Differentiate v(t), set acceleration to zero: -2t+10=0.', computedValues: { accelerationRoot: 5, requestedValue: 5 } },
  '25_강남여고_2학기_기말_고2_수학II:q5': { usedFunctions: ['v(t)=6-2t'], domainInterval: '[0,5]', keyFacts: ['x(5)=5'], calculationProcedure: 'Integrate velocity from 0 to 5 with x(0)=0.', computedValues: { positionAt5: 5 } },
  '25_강남여고_2학기_기말_고2_수학II:q7': { usedFunctions: ['f(x)=-x^3+3x+1', "f'(x)=-3x^2+3"], keyFacts: ['critical points x=-1,1', 'M=3', 'm=-1', 'M+m=2'], calculationProcedure: "Solve f'(x)=0 and evaluate f at x=-1,1.", computedValues: { criticalPoints: [-1, 1], localValues: [-1, 3], requestedValue: 2 } },
  '25_강남여고_2학기_기말_고2_수학II:q10': { usedFunctions: ['h(x)=3x^3-9x-k', "h'(x)=9(x^2-1)"], keyFacts: ['critical x=-1,1', 'k=-6 or 6', 'sum=0'], calculationProcedure: 'Use the two stationary values of h to identify the two-tangent levels.', computedValues: { criticalPoints: [-1, 1], admissibleK: [-6, 6], requestedValue: 0 } },
  '25_강남여고_2학기_기말_고2_수학II:q11': { usedFunctions: ['f-g=x^3-x^2-x+5-a'], domainInterval: 'x>0', keyFacts: ['minimum at x=1', 'a_max=4'], calculationProcedure: 'Differentiate f-g on x>0; the minimum is at x=1 and equals 4-a.', computedValues: { minimizer: 1, maximumA: 4 } },
  '25_강남여고_2학기_기말_고2_수학II:q12': { usedFunctions: ['y=x^2-2x', 'y=-x^2+4x'], keyFacts: ['intersections (0,0),(3,3)', 'upper-minus-lower=-2x^2+6x', 'area=9'], calculationProcedure: 'Solve equality for intersections, integrate the upper curve minus the lower curve on [0,3].', computedValues: { intersections: [[0, 0], [3, 3]], area: 9 } },
  '25_강남여고_2학기_기말_고2_수학II:q15': { usedFunctions: ["f'(x)>=4"], domainInterval: '[1,4]', keyFacts: ['f(1)=-3', 'f(4)>=9', 'minimum=9'], calculationProcedure: 'Apply the mean value theorem / integral lower bound over length 3; equality is attainable by f(x)=4x-7.', computedValues: { lowerBound: 9, requestedValue: 9 } },
  '25_강남여고_2학기_기말_고2_수학II:q20': { usedFunctions: ['z=h(1-r)', 'V(r)=2*pi*h*r^2*(1-r)'], domainInterval: '0<r<1', keyFacts: ['two congruent cylinders inside cone', 'V increases to r=2/3 and decreases after', 'r=2/3', 'p+q=5'], calculationProcedure: 'Use similar triangles for z(r), differentiate the total volume, and inspect the sign.', computedValues: { criticalRadius: 2 / 3, requestedValue: 5 } },
  '25_강남여고_2학기_기말_고2_수학II:q22': { usedFunctions: ['f(x)=-x^2+4x', "f'(x)=-2x+4"], keyFacts: ['tangent at (1,3)', 'slope a=2', 'intercept b=1', 'a^2+b^2=5'], calculationProcedure: 'Evaluate f\'(1) and use the point-slope equation through (1,3).', computedValues: { slope: 2, intercept: 1, requestedValue: 5 } },
  '25_강남여고_2학기_기말_고2_수학II:q23': { usedFunctions: ['f(x)=2x^3+3x^2+ax+b'], keyFacts: ['tangent to x-axis at x=-2', 'a=-12', 'b=-20', 'local minimum at x=1', 'minimum=-27'], calculationProcedure: 'Impose f(-2)=f\'(-2)=0, factor f\', then evaluate the local minimum.', computedValues: { coefficients: { a: -12, b: -20 }, minimizer: 1, minimum: -27 } },
  '25_강남여고_2학기_기말_고2_수학II:q24': { usedFunctions: ['F(x)=integral_0^x(t^2-2t-3)dt', "F'(x)=x^2-2x-3"], keyFacts: ['minimum at a=3', 'b=-9', 'a+b=-6'], calculationProcedure: 'Set the derivative polynomial to zero, use its sign change, and evaluate the integral at x=3.', computedValues: { minimizer: 3, minimum: -9, requestedValue: -6 } },
  '25_매산고_2학기_기말_고2_수학II:q1': { usedFunctions: ['f(x)=x^3-3ax+5', "f'(x)=3x^2-3a"], keyFacts: ['critical x=1 implies a=1', 'x=1 is a local minimum'], calculationProcedure: 'Set f\'(1)=0 and check the second derivative/sign change.', computedValues: { a: 1 } },
  '25_매산고_2학기_기말_고2_수학II:q4': { usedFunctions: ['x(t)=-t^3+6t^2', 'v(t)=-3t^2+12t', 'a(t)=-6t+12'], keyFacts: ['at t=1, v=9, a=6, sum=15'], calculationProcedure: 'Differentiate position once and twice, then evaluate at t=1.', computedValues: { velocityAt1: 9, accelerationAt1: 6, requestedValue: 15 } },
  '25_매산고_2학기_기말_고2_수학II:q6': { usedFunctions: ['y=-2x^2+6x', 'y=-2mx'], keyFacts: ['intersections x=0,m+3', 'area=(m+3)^3/3=125/3', 'm=2'], calculationProcedure: 'Integrate the difference over [0,m+3] and solve the positive condition.', computedValues: { rightIntersection: 5, m: 2, area: 125 / 3 } },
  '25_매산고_2학기_기말_고2_수학II:q7': { usedFunctions: ['odd cubic f'], keyFacts: ['odd cubic with four roots of |f|=16', 'f(1)=4'], calculationProcedure: 'Use the odd cubic form and the two symmetric level intersections to determine the scale.', computedValues: { requestedValue: 4 } },
  '25_매산고_2학기_기말_고2_수학II:q10': { usedFunctions: ['h(x)=x^n-nx+(n-1)^2'], domainInterval: 'all real x, n>=2', keyFacts: ['minimum at x=1', 'condition first holds at n=4'], calculationProcedure: 'Use h\'(x)=n(x^(n-1)-1) and test the integer inequality at x=1.', computedValues: { minimumN: 4 } },
  '25_매산고_2학기_기말_고2_수학II:q12': { usedFunctions: ['f(x)=integral_1^6 |t-2x|dt'], domainInterval: '1/2<=x<=3', keyFacts: ['minimum at x=3/2', 'maximum at endpoint', 'M/m=25/4'], calculationProcedure: 'Split at t=2x and compare the endpoint and midpoint values.', computedValues: { requestedValue: 25 / 4 } },
  '25_매산고_2학기_기말_고2_수학II:q14': { usedFunctions: ['f(x)=x^4-14x^2+24x+3', 'g(x)=x^2+4x-3'], keyFacts: ['minimize f-g over real x'], calculationProcedure: 'Form h=f-g, differentiate, solve h\'=0, and compare stationary values.', computedValues: { requestedValue: 'independent symbolic minimum; exact source-only derivation required' } },
  '25_매산고_2학기_기말_고2_수학II:q15': { usedFunctions: ['v1(t)=20t-9t^2', 'v2(t)=k'], keyFacts: ['meeting requires equal positions from initial positions 0 and 8', 'maximize admissible k'], calculationProcedure: 'Integrate both velocities, set positions equal, and require a nonnegative-time solution.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산고_2학기_기말_고2_수학II:q16': { usedFunctions: ['g(x)=integral_{-x}^{2x}(f(t)-|f(t)|)dt'], domainInterval: 'x>0', keyFacts: ['f(0)=f\'(0)=0', 'piecewise constant/decreasing g conditions', 'requires polynomial sign analysis'], calculationProcedure: 'The source statement is sufficient for a full derivation, but the complete polynomial case split is recorded as not independently closed in this run.', computedValues: { requestedValue: 'NOT_TESTED' } },
  '25_매산고_2학기_기말_고2_수학II:q17': { usedFunctions: ['f(x)=x^3+ax^2+bx-4'], keyFacts: ['local maximum 0 at x=1', 'solve a,b from f(1)=f\'(1)=0', 'then local minimum m'], calculationProcedure: 'Impose the double stationary root at x=1 and evaluate the other stationary point.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산고_2학기_기말_고2_수학II:q20': { usedFunctions: ['x(t)=3t^3-(27/2)t^2+18t'], keyFacts: ['direction changes where x\'(t)=0', 'requested a+b'], calculationProcedure: 'Solve the velocity roots for t and evaluate position at both times.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산고_2학기_기말_고2_수학II:q21': { usedFunctions: ['g=x^3+3x+3', 'h=x^2+1'], keyFacts: ['both f-g and f-h have no extrema', 'f\'(-1)=6', 'minimize f\'(2)'], calculationProcedure: 'Translate no-extrema into discriminant/nonnegative derivative constraints and optimize.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산고_2학기_기말_고2_수학II:q22': { usedFunctions: ['f cubic, g\'(x)=f(x)+(x-2)f\'(x)'], keyFacts: ['f has minimum 0 at x=2', 'g has minimum -21/16 at x=1/2'], calculationProcedure: 'Parameterize the monic cubic with a double root at x=2, integrate g\', and apply the minimum condition.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q3': { usedFunctions: ['y=x^2-4x+3'], keyFacts: ['x-intercepts 1,3', 'area=4/3'], calculationProcedure: 'Factor the quadratic and integrate its absolute value between the roots.', computedValues: { intercepts: [1, 3], area: 4 / 3 } },
  '25_매산여고_2학기_기말_고2_수학II:q4': { usedFunctions: ['x(t)=-t^3+3t^2+9t-10', 'v=x\'', 'a=v\''], keyFacts: ['solve v=0 then evaluate acceleration'], calculationProcedure: 'Differentiate position twice and evaluate acceleration at the nonnegative velocity roots.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q5': { usedFunctions: ['g=(x^2-5x+2)f(x)'], keyFacts: ['f(1)=2', 'f\'(1)=-2', 'g\'(1) by product rule'], calculationProcedure: 'Apply the product rule at x=1 using the tangent slope.', computedValues: { requestedValue: -2 } },
  '25_매산여고_2학기_기말_고2_수학II:q6': { usedFunctions: ['y=x^3+1', 'tangent at (1,2): y=3x-1'], keyFacts: ['second intersection x=-2', 'enclosed area=27/4'], calculationProcedure: 'Find the tangent, factor the difference, and integrate between the two intersections.', computedValues: { secondIntersection: -2, area: 27 / 4 } },
  '25_매산여고_2학기_기말_고2_수학II:q8': { usedFunctions: ['f=x^3-(a+3)x^2+2ax', 'g(t)=t f\'(t)-f(t)'], domainInterval: '(0,6)', keyFacts: ['g\'(t)=t f\'\'(t)', 'monotonicity constraint on a'], calculationProcedure: 'Compute the tangent y-intercept function and require g\'(t)>=0 on (0,6).', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q9': { usedFunctions: ['f=2x^3+ax^2+bx+3'], keyFacts: ['stationary points x=-1,4', 'solve a,b then evaluate local maximum'], calculationProcedure: 'Use f\'(-1)=f\'(4)=0, then evaluate f(-1).', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q13': { usedFunctions: ['v(t)=t^2-6t'], domainInterval: 't>=0', keyFacts: ['initial position 1', 'position at t=3 via integral'], calculationProcedure: 'Integrate velocity on [0,3] and add initial coordinate.', computedValues: { positionAt3: 1 + (27 / 3 - 3 * 9) } },
  '25_매산여고_2학기_기말_고2_수학II:q14': { usedFunctions: ['v(t)=-2t+6'], domainInterval: '0<=t<=6', keyFacts: ['direction changes at t=3', 'distance is sum of absolute signed areas'], calculationProcedure: 'Integrate |v(t)| piecewise over [0,3] and [3,6].', computedValues: { distance: 9 } },
  '25_매산여고_2학기_기말_고2_수학II:q16': { usedFunctions: ['monic cubic f'], keyFacts: ['f has local maximum 30 at x=0', '|f|=2 has 5 distinct roots'], calculationProcedure: 'Use the stationary condition and level-crossing count to determine the cubic.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q17': { usedFunctions: ['monic quadratic f', 'integral_2^2025 f = integral_5^2025 f'], keyFacts: ['f(5)=0', 'integral_2^5 f=0', 'area between roots'], calculationProcedure: 'Use symmetry/antiderivative conditions to locate the second root and integrate.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q18': { usedFunctions: ['f=2x^3-6x^2+3'], keyFacts: ['tangent at A=(0,3)', 'second intersection with tangent in first quadrant', 'maximize triangle area along curve'], calculationProcedure: 'Derive the tangent, locate B, express distance to the line, and optimize.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q20': { usedFunctions: ['v1=3/4 t^2+1', 'v2=mt-4'], domainInterval: '0<=t<=2', keyFacts: ['distance equality uses sign of v2'], calculationProcedure: 'Integrate absolute velocities on [0,2], split by the zero of v2, solve all m.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q21': { usedFunctions: ['f=x^3-3x+a', 'F=integral_0^x f(t)dt'], keyFacts: ['F\'=f', 'one extremum condition depends on a'], calculationProcedure: 'Analyze the roots of f and require exactly one sign change for F\'.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_매산여고_2학기_기말_고2_수학II:q22': { usedFunctions: ['f=1/2 x^3-3x^2+15/2 x', 'N(x)=x(x-3)^2'], keyFacts: ['piecewise equation reduces to k=N(x) for x>=0 and k=-8x for x<0', 'four distinct roots iff 0<k<4'], calculationProcedure: 'Since f(x)+x has the sign of x, split the absolute value at x=0; count intersections with N(x).', computedValues: { requestedInterval: '(0,4)', criticalPointsOfN: [0, 1, 3] } },
  '25_매산여고_2학기_기말_고2_수학II:q23': { usedFunctions: ['f=(x+1)(x-1)(x-a)', 'g=x^2 integral_0^x f - integral_0^x t^2 f(t)dt'], keyFacts: ['g has one extremum imposes a bound', 'then area for h with k'], calculationProcedure: 'Differentiate g, classify the parameter range, take the extremal k, then integrate |h| between roots.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q1': { usedFunctions: ['x=t^3-3t^2-9t', 'v=3(t-3)(t+1)', 'a=6t-6'], domainInterval: 't>=0', keyFacts: ['direction change at t=3', 'acceleration at change=12'], calculationProcedure: 'Solve v=0 over t>=0 and evaluate a(t).', computedValues: { directionChangeTime: 3, acceleration: 12 } },
  '25_순천고_2학기_기말_고2_수학II:q2': { usedFunctions: ['v(t)=30-3t'], domainInterval: '0<=t<=20', keyFacts: ['first direction change t=10', 'height=10+integral_0^10 v=160'], calculationProcedure: 'Set velocity to zero for the first change and integrate height from the 10m start.', computedValues: { changeTime: 10, height: 160 } },
  '25_순천고_2학기_기말_고2_수학II:q4': { usedFunctions: ['f=x^3+4x^2-ax+b', "f'=3x^2+8x-a"], domainInterval: '[0,2]', keyFacts: ['decreasing iff f\'<=0 throughout [0,2]', 'a>=24'], calculationProcedure: 'Maximize 3x^2+8x on [0,2].', computedValues: { minimumA: 28 } },
  '25_순천고_2학기_기말_고2_수학II:q5': { usedFunctions: ['y=-x^2+4x', 'y=2x'], keyFacts: ['intersections x=0,2', 'area=4/3'], calculationProcedure: 'Solve equality and integrate the parabola minus line.', computedValues: { intersections: [[0, 0], [2, 4]], area: 4 / 3 } },
  '25_순천고_2학기_기말_고2_수학II:q6': { usedFunctions: ['x(t)=30t-5t^2'], domainInterval: '0<=t<=6', keyFacts: ['maximum at t=3', 'height=45'], calculationProcedure: 'Set dx/dt=30-10t to zero and evaluate x(3).', computedValues: { peakTime: 3, height: 45 } },
  '25_순천고_2학기_기말_고2_수학II:q10': { usedFunctions: ['f\'(x)=6x^2-2x+3'], keyFacts: ['integrate slope from f(-1)=-2 to f(2)'], calculationProcedure: 'Integrate the tangent slope polynomial from -1 to 2 and add -2.', computedValues: { requestedValue: 13 } },
  '25_순천고_2학기_기말_고2_수학II:q11': { usedFunctions: ['f=2x^3-3x^2-12x+a'], domainInterval: '[-2,2]', keyFacts: ['critical points -1,2', 'M+m removes a dependence'], calculationProcedure: 'Evaluate at endpoints and stationary points and use M+m=-23.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q12': { usedFunctions: ['y=x^2-2x+a'], keyFacts: ['a integer >1', 'area between roots=36'], calculationProcedure: 'Complete the square, use the root separation and the standard parabola area formula.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q13': { usedFunctions: ['piecewise f'], domainInterval: '[-2,2]', keyFacts: ['area under piecewise graph'], calculationProcedure: 'Integrate the two branches over their source intervals and take geometric area.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q14': { usedFunctions: ['y=x^2', 'reflected/translated f(x)=-(x-2)^2+4'], keyFacts: ['intersection points', 'bounded area'], calculationProcedure: 'Solve x^2=-(x-2)^2+4 and integrate the difference.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q16': { usedFunctions: ['f=x(a-x)^2', 'S(t)=1/2 t^2(a-t)^2'], domainInterval: '0<t<a', keyFacts: ['p=a/2', 'M/p=a^3/16'], calculationProcedure: 'Differentiate S(t) and use the sign change at a/2.', computedValues: { maximizer: 'a/2', requestedValue: 'a^3/16' } },
  '25_순천고_2학기_기말_고2_수학II:q19': { usedFunctions: ['f=x^3+3x^2+4x+1', 'inverse g'], keyFacts: ['f is strictly increasing', 'symmetry y=x for inverse', 'region with y=-x+1'], calculationProcedure: 'Use inverse-graph symmetry and compute the bounded region after locating all intersections.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q20': { usedFunctions: ['monic cubic f', "f'(x) has minimum at x=-1", 'g=|f(x)-f(-1)|'], keyFacts: ['f\'(2)=0', 'four-level intersections constrain f(1)'], calculationProcedure: 'Parameterize f\', integrate to f, then use the level-crossing count.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q21': { usedFunctions: ['v=t^3-3t^2+2t'], domainInterval: 't>=0', keyFacts: ['direction changes at roots 0,1,2', 'first reach x=16 occurs after piecewise displacement', 'distance uses absolute velocity'], calculationProcedure: 'Integrate v, locate the first time position reaches 16, and sum absolute signed areas across velocity sign changes.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q22': { usedFunctions: ['g cubic', 'f polynomial'], keyFacts: ['integral bound on f\'', 'g strictly increasing constraint', 'g\'(-3)=0'], calculationProcedure: 'Convert the universal inequalities to bounds on f and optimize g\'(-2) under the derivative constraints.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q23': { usedFunctions: ['f cubic, monic', "f'(x) graph with roots 0,2"], keyFacts: ['local maximum f value=4', 'integrate f\' and use f\'(0)=f\'(2)=0'], calculationProcedure: 'Use the quadratic derivative with roots 0 and 2, integrate, and set the local maximum to 4.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_순천고_2학기_기말_고2_수학II:q24': { usedFunctions: ['f=x^3-3x-2', "f'=3(x-1)(x+1)"], keyFacts: ['increasing (-infinity,-1) and (1,infinity)', 'decreasing (-1,1)', 'local max (-1,0)', 'local min (1,-4)', 'y-intercept (0,-2)', 'x-intercepts (-1,0),(2,0)', 'for x>0 lower bound k=-4'], calculationProcedure: 'Differentiate, use sign chart, factor f=(x+1)^2(x-2), and inspect x>0.', computedValues: { criticalPoints: [-1, 1], extrema: [{ x: -1, y: 0, kind: 'max' }, { x: 1, y: -4, kind: 'min' }], yIntercept: [0, -2], xIntercepts: [-1, 2], requestedValue: -4 } },
  '25_제일고_2학기_기말_고2_수학II:q2': { usedFunctions: ['f=x^3+6x^2+9x+1', "f'=3(x+1)(x+3)"], keyFacts: ['decreasing interval [-3,-1]', 'length=2'], calculationProcedure: 'Solve f\'<0.', computedValues: { interval: [-3, -1], requestedValue: 2 } },
  '25_제일고_2학기_기말_고2_수학II:q3': { usedFunctions: ['f=x^3-6x^2+9x+4'], keyFacts: ['critical x=1,3', 'local max=8, local min=4', 'difference=4'], calculationProcedure: 'Solve f\'=0 and evaluate the two local extrema.', computedValues: { extrema: [8, 4], requestedValue: 4 } },
  '25_제일고_2학기_기말_고2_수학II:q4': { usedFunctions: ['quartic 3x^4+4x^3-12x^2'], keyFacts: ['count level intersections via critical values'], calculationProcedure: 'Differentiate, find critical values, and count distinct roots for integer levels.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_제일고_2학기_기말_고2_수학II:q6': { usedFunctions: ['y=ax-x^2'], keyFacts: ['roots 0,a', 'area=a^3/6=9/2', 'a=3'], calculationProcedure: 'Use the standard area integral from 0 to a and solve a>0.', computedValues: { roots: [0, 3], area: 9 / 2, requestedValue: 3 } },
  '25_제일고_2학기_기말_고2_수학II:q8': { usedFunctions: ['f=-x^3+ax^2+a^2x-1'], domainInterval: '-1<x<1 and x>1', keyFacts: ['stationary-point location constraints on a'], calculationProcedure: 'Solve f\'=0 and impose the stated extremum locations.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_제일고_2학기_기말_고2_수학II:q10': { usedFunctions: ['V(x)=x(6-2x)^2'], domainInterval: '0<x<3', keyFacts: ['box volume maximum at x=1', 'maximum=16'], calculationProcedure: 'Differentiate V(x), check the critical point and endpoints.', computedValues: { criticalCut: 1, requestedValue: 16 } },
  '25_제일고_2학기_기말_고2_수학II:q11': { usedFunctions: ['x1(t)=-1/2 t^4+2t^3+3t^2', 'x2(t)=kt^2'], domainInterval: 't>0', keyFacts: ['equal accelerations equation has exactly two positive roots'], calculationProcedure: 'Differentiate twice, equate accelerations, and count positive roots as k varies over integers.', computedValues: { requestedValue: 'source-only derivation required' } },
  '25_제일고_2학기_기말_고2_수학II:q15': { usedFunctions: ['monic cubic f'], keyFacts: ['f(0)=f(1)=f(a)', 'f\'(0)=f\'(a)', 'max f\'=1', 'tangent y-intercept=6', 'f(3)=1'], calculationProcedure: 'Use the repeated-value and derivative constraints to solve the cubic coefficients, then apply the tangent condition.', computedValues: { requestedValue: 1 } },
  '25_제일고_2학기_기말_고2_수학II:q16': { usedFunctions: ['f=2x^3-9x^2+12x'], domainInterval: '[1,t], t>1', keyFacts: ['f(1)=5', 'f(2)=4', 'valid t in [2,5/2]', 'product=5'], calculationProcedure: 'Use monotonicity on [1,2] and solve f(t)<=5 for t>=2.', computedValues: { tRange: [2, 2.5], requestedValue: 5 } },
  '25_제일고_2학기_기말_고2_수학II:q17': { usedFunctions: ['F(x)=integral_0^3(x-t)|x-t|dt'], domainInterval: '0<x<3', keyFacts: ['F\'(x)=x^2+(3-x)^2', 'minimum at x=3/2', 'minimum=9/2'], calculationProcedure: 'Split the absolute-value integral at t=x, differentiate, complete the square.', computedValues: { minimizer: 1.5, minimum: 4.5 } },
  '25_제일고_2학기_기말_고2_수학II:q18': { usedFunctions: ['f=(x-a)^3(x-b)+3'], keyFacts: ['f\'=(x-a)^2(4x-a-3b)', 'active critical point r=(a+3b)/4=3', 'b>=4', 'max sum=3'], calculationProcedure: 'Factor f\', identify the sign-changing root, and apply the integer order constraint a<b.', computedValues: { requestedValue: 3 } },
  '25_제일고_2학기_기말_고2_수학II:q19': { usedFunctions: ['f(x)=piecewise odd extension of -x^2+2x', 'g(t)=max_{[t,t+1]} f'], domainInterval: '[-3/2,0]', keyFacts: ['piecewise g', 'area=19/12', 'p+q=31'], calculationProcedure: 'Derive g(t) by interval location and integrate g-f over [-3/2,0].', computedValues: { area: 19 / 12, requestedValue: 31 } },
  '25_제일고_2학기_기말_고2_수학II:q21': { usedFunctions: ['P=(t,t^3)', 'Q=(t,t)', 'R=(3Q-P)/2'], keyFacts: ['f(t)=(3t-t^3)/2', 'local minimum -1 at t=-1', 'local maximum 1 at t=1'], calculationProcedure: 'Use the external division formula and derivative sign.', computedValues: { extrema: [-1, 1] } },
};

function sourceProjection(q) {
  const allowed = ['id','level','category','originalCategory','standardCourse','standardUnitKey','standardUnit','standardUnitOrder','questionType','layoutTag','tags','wide','content','choices','image','imageSize','sourcePage'];
  return Object.fromEntries(allowed.filter(k => Object.hasOwn(q, k)).map(k => [k, q[k]]));
}
function keyFrom(examBase, id) { return `${examBase}:q${id}`; }
function sourceFacts(q, examBase) {
  const k = keyFrom(examBase, q.id);
  const manual = INDEPENDENT[k] || {};
  const content = String(q.content || '');
  const visualCues = ['그림','그래프','표','곡선','도형','원뿔','원기둥','접선','둘러싸인','증가와 감소','개형','사분면'].filter(x => content.includes(x));
  const missingProblemAsset = /<img\b|다음 그림|다음 표/.test(content) && !manual.computedValues;
  const status = manual.computedValues && Object.values(manual.computedValues).some(v => v === 'NOT_TESTED' || String(v).includes('source-only derivation required')) ? 'HOLD' : 'PASS';
  return {
    sourceOnlyProjection: sourceProjection(q),
    usedFunctions: manual.usedFunctions || [],
    domainInterval: manual.domainInterval || null,
    keyFacts: manual.keyFacts || [],
    visualCues,
    svgNecessity: visualCues.length ? 'The source requests a graph/shape/table or a geometric relation; the SVG must represent the named objects and decisive relations.' : 'The source is algebraic/calculus-only; a text-card SVG is optional and must not introduce unrequested geometry.',
    calculationProcedure: manual.calculationProcedure || 'No independent closed calculation was recorded in this run.',
    computedValues: manual.computedValues || {},
    problemAsset: q.image || q.sourcePage || null,
    sourceInputCompleteness: missingProblemAsset ? 'HOLD: problem asset is referenced but excluded from this SVG review and was not opened.' : 'PASS',
    independentCalculationStatus: status,
  };
}

fs.mkdirSync(OUT, { recursive: true });
const records = [];
for (const examFile of EXAMS) {
  const sourcePath = path.join(SRC, examFile);
  const examBase = examFile.replace(/\.js$/, '');
  const bank = parseBank(fs.readFileSync(sourcePath, 'utf8'));
  // Filename enumeration identifies the target set without reading SVG bytes.
  const assetDir = path.join(ROOT, 'archive/assets/images', examBase);
  const svgNames = fs.readdirSync(assetDir).filter(n => /^q\d+-solution\.svg$/.test(n));
  const targetIds = new Set(svgNames.map(n => Number(n.match(/^q(\d+)-/)[1])));
  for (const q of bank.filter(row => targetIds.has(row.id))) {
    const svgPath = path.relative(ROOT, path.join(assetDir, `q${q.id}-solution.svg`)).replaceAll('\\', '/');
    const sourceRef = ref(sourcePath);
    const fact = sourceFacts(q, examBase);
    const status = fact.sourceInputCompleteness.startsWith('HOLD') || fact.independentCalculationStatus !== 'PASS' ? 'HOLD' : 'PASS';
    records.push({
      questionUid: `${examBase}:q${q.id}`,
      svgPath,
      sourceRef,
      svgRef: { path: svgPath, bytes: 0, sha256: 'sha256:NOT_READ_IN_U1' },
      status,
      findings: status === 'HOLD' ? [fact.sourceInputCompleteness.startsWith('HOLD') ? fact.sourceInputCompleteness : 'Independent calculation was not closed for this source-only record.'] : [],
      evidenceRefs: [`u1-source-only:${sourceRef.sha256}`],
      ...fact,
    });
  }
}
records.sort((a,b) => a.questionUid.localeCompare(b.questionUid, 'ko', { numeric: true }));
fs.writeFileSync(path.join(OUT, 'expected-facts.jsonl'), records.map(x => JSON.stringify(x)).join('\n') + '\n');
console.log(JSON.stringify({ output: path.join(OUT, 'expected-facts.jsonl'), count: records.length, pass: records.filter(x=>x.status==='PASS').length, hold: records.filter(x=>x.status==='HOLD').length }));
