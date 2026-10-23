import assert from 'node:assert/strict';
import { add2, angleDegrees, areParallel, arePerpendicular, classify3DLines, congruenceCriterion, intersectLinear, linePlaneIntersection3D, midpoint, rotate2, triangleMeasures } from '../src/geometry-core/math.ts';

const near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<=eps,`${a} != ${b}`);
const A={x:0,y:0},B={x:4,y:0},C={x:2,y:0},D={x:2,y:3};
assert.deepEqual(midpoint(A,B),C);
assert.equal(areParallel({x:2,y:0},{x:-4,y:0}),true);
assert.equal(arePerpendicular({x:4,y:0},{x:0,y:5}),true);
near(angleDegrees(B,C,D),90);
assert.equal(intersectLinear(A,B,{x:2,y:-1},{x:2,y:1}).kind,'point');
assert.equal(intersectLinear(A,B,{x:0,y:2},{x:4,y:2}).kind,'parallel');
assert.equal(intersectLinear(A,B,{x:1,y:0},{x:3,y:0}).kind,'coincident');
const segmentOverlap=intersectLinear(A,B,{x:1,y:0},{x:3,y:0},'segment','segment');
assert.equal(segmentOverlap.kind,'overlap');if(segmentOverlap.kind==='overlap'){near(segmentOverlap.from.x,1);near(segmentOverlap.to.x,3)}
const oppositeRays=intersectLinear(A,B,B,A,'ray','ray');
assert.equal(oppositeRays.kind,'overlap');if(oppositeRays.kind==='overlap'){near(oppositeRays.from.x,0);near(oppositeRays.to.x,4)}
assert.equal(intersectLinear(A,B,{x:-2,y:0},{x:-3,y:0},'ray','ray').kind,'none');
assert.equal(intersectLinear(A,B,{x:5,y:-1},{x:5,y:1},'segment','segment').kind,'none');
assert.equal(intersectLinear(A,A,A,A).kind,'point');
assert.equal(intersectLinear(A,A,{x:1,y:2},{x:2,y:3}).kind,'none');

const triangle=[{x:0,y:0},{x:4,y:0},{x:1,y:3}];
const moved=triangle.map(p=>add2({x:8,y:-3},rotate2(p,1.2)));
const m1=triangleMeasures(triangle),m2=triangleMeasures(moved);
near(m1.angles.reduce((s,x)=>s+x,0),180);
assert.equal(congruenceCriterion(m1,m2),'SSS');
const enlarged=triangle.map(p=>({x:p.x*1.1,y:p.y*1.1}));
assert.equal(congruenceCriterion(m1,triangleMeasures(enlarged)),'none');
assert.equal(congruenceCriterion(triangleMeasures([{x:0,y:0},{x:1,y:0},{x:2,y:0}]),m1),'none');

assert.equal(classify3DLines({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:0,z:0},{x:0,y:1,z:0}),'intersecting');
assert.equal(classify3DLines({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:2,z:0},{x:1,y:2,z:0}),'parallel');
assert.equal(classify3DLines({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:1},{x:0,y:1,z:2}),'skew');
assert.equal(classify3DLines({x:0,y:0,z:0},{x:1,y:0,z:0},{x:2,y:0,z:0},{x:4,y:0,z:0}),'coincident');
assert.equal(classify3DLines({x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:1,y:0,z:0}),'degenerate');
const hit=linePlaneIntersection3D({x:0,y:0,z:2},{x:0,y:0,z:-1},{x:0,y:0,z:0},{x:0,y:0,z:1});
assert.equal(hit.kind,'point');if(hit.kind==='point')near(hit.point.z,0);
assert.equal(linePlaneIntersection3D({x:0,y:0,z:1},{x:1,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:1}).kind,'parallel');
assert.equal(linePlaneIntersection3D({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:1}).kind,'contained');

console.log('PASS · 2D intersections/angles, degenerate cases, triangle congruence, 3D line-plane relations');
