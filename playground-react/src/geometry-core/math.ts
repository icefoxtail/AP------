export type Point2 = { x:number; y:number };
export type Point3 = { x:number; y:number; z:number };
export type Vector2 = Point2;
export type Vector3 = Point3;
export const GEOMETRY_EPSILON = 1e-9;

const tolerance=(...values:number[])=>GEOMETRY_EPSILON*Math.max(1,...values.map(Math.abs));
export const add2=(a:Point2,b:Vector2):Point2=>({x:a.x+b.x,y:a.y+b.y});
export const sub2=(a:Point2,b:Point2):Vector2=>({x:a.x-b.x,y:a.y-b.y});
export const scale2=(a:Vector2,k:number):Vector2=>({x:a.x*k,y:a.y*k});
export const rotate2=(a:Vector2,radians:number):Vector2=>({x:a.x*Math.cos(radians)-a.y*Math.sin(radians),y:a.x*Math.sin(radians)+a.y*Math.cos(radians)});
export const dot2=(a:Vector2,b:Vector2)=>a.x*b.x+a.y*b.y;
export const cross2=(a:Vector2,b:Vector2)=>a.x*b.y-a.y*b.x;
export const length2=(a:Vector2)=>Math.hypot(a.x,a.y);
export const distance2=(a:Point2,b:Point2)=>length2(sub2(a,b));
export const midpoint=(a:Point2,b:Point2):Point2=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
export const lerp2=(a:Point2,b:Point2,t:number):Point2=>add2(a,scale2(sub2(b,a),t));
export function normalize2(v:Vector2):Vector2|null{const n=length2(v);return n<=tolerance(v.x,v.y)?null:scale2(v,1/n)}
export function angleDegrees(a:Point2,vertex:Point2,b:Point2):number|null{
  const u=normalize2(sub2(a,vertex)),v=normalize2(sub2(b,vertex));
  if(!u||!v)return null;
  return Math.acos(Math.max(-1,Math.min(1,dot2(u,v))))*180/Math.PI;
}
export function arePerpendicular(a:Vector2,b:Vector2):boolean{
  const ua=normalize2(a),ub=normalize2(b);return !!ua&&!!ub&&Math.abs(dot2(ua,ub))<=tolerance(ua.x,ua.y,ub.x,ub.y);
}
export function areParallel(a:Vector2,b:Vector2):boolean{
  const ua=normalize2(a),ub=normalize2(b);return !!ua&&!!ub&&Math.abs(cross2(ua,ub))<=tolerance(ua.x,ua.y,ub.x,ub.y);
}

export type LinearDomain='line'|'ray'|'segment';
export type IntersectionResult={kind:'point';point:Point2;t:number;u:number}|{kind:'overlap';from?:Point2;to?:Point2;unboundedStart:boolean;unboundedEnd:boolean}|{kind:'parallel'|'coincident'|'none'};
function inDomain(t:number,domain:LinearDomain,eps:number){return domain==='line'||(domain==='ray'?t>=-eps:t>=-eps&&t<=1+eps)}
export function intersectLinear(a:Point2,b:Point2,c:Point2,d:Point2,domainA:LinearDomain='line',domainB:LinearDomain='line'):IntersectionResult{
  const r=sub2(b,a),s=sub2(d,c),rr=dot2(r,r),ss=dot2(s,s),q=sub2(c,a),lr=Math.sqrt(rr),ls=Math.sqrt(ss),lq=length2(q),paramEps=GEOMETRY_EPSILON;
  const lenEps=GEOMETRY_EPSILON*Math.max(1,lr,ls,lq);
  if(lr<=lenEps&&ls<=lenEps)return distance2(a,c)<=lenEps?{kind:'point',point:{...a},t:0,u:0}:{kind:'none'};
  if(lr<=lenEps){const u=ss===0?0:dot2(sub2(a,c),s)/ss,crossTolerance=GEOMETRY_EPSILON*Math.max(1,ls*distance2(a,c));return Math.abs(cross2(sub2(a,c),s))<=crossTolerance&&inDomain(u,domainB,paramEps)?{kind:'point',point:{...a},t:0,u}:{kind:'none'};}
  if(ls<=lenEps){const t=dot2(sub2(c,a),r)/rr,crossTolerance=GEOMETRY_EPSILON*Math.max(1,lr*distance2(c,a));return Math.abs(cross2(sub2(c,a),r))<=crossTolerance&&inDomain(t,domainA,paramEps)?{kind:'point',point:{...c},t,u:0}:{kind:'none'};}
  const den=cross2(r,s),denTolerance=GEOMETRY_EPSILON*Math.max(1,lr*ls),crossTolerance=GEOMETRY_EPSILON*Math.max(1,lq*lr),collinear=Math.abs(cross2(q,r))<=crossTolerance;
  if(Math.abs(den)<=denTolerance){
    if(!collinear)return {kind:'parallel'};
    const tc=dot2(q,r)/rr,td=dot2(sub2(d,a),r)/rr;
    const interval=(domain:LinearDomain,t0:number,t1:number):[number,number]=>domain==='line'?[-Infinity,Infinity]:domain==='segment'?[Math.min(t0,t1),Math.max(t0,t1)]:t1>=t0?[t0,Infinity]:[-Infinity,t0];
    const [loA,hiA]=interval(domainA,0,1),[loB,hiB]=interval(domainB,tc,td),lo=Math.max(loA,loB),hi=Math.min(hiA,hiB);
    if(lo>hi+paramEps)return {kind:'none'};
    if(Number.isFinite(lo)&&Number.isFinite(hi)&&Math.abs(hi-lo)<=paramEps){const t=(lo+hi)/2,point=add2(a,scale2(r,t)),u=dot2(sub2(point,c),s)/ss;return {kind:'point',point,t,u};}
    const unboundedStart=!Number.isFinite(lo),unboundedEnd=!Number.isFinite(hi);
    if(unboundedStart&&unboundedEnd)return {kind:'coincident'};
    return {kind:'overlap',from:unboundedStart?undefined:add2(a,scale2(r,lo)),to:unboundedEnd?undefined:add2(a,scale2(r,hi)),unboundedStart,unboundedEnd};
  }
  const t=cross2(q,s)/den,u=cross2(q,r)/den;
  if(!inDomain(t,domainA,paramEps)||!inDomain(u,domainB,paramEps))return {kind:'none'};
  return {kind:'point',point:add2(a,scale2(r,t)),t,u};
}

export function projectPointToLine(p:Point2,a:Point2,b:Point2):Point2|null{
  const d=sub2(b,a),den=dot2(d,d);if(den<=tolerance(d.x,d.y)**2)return null;
  return add2(a,scale2(d,dot2(sub2(p,a),d)/den));
}
export function pointOnSegment(p:Point2,a:Point2,b:Point2,eps=GEOMETRY_EPSILON):boolean{
  const d=sub2(b,a),q=sub2(p,a),tol=eps*Math.max(1,length2(d));
  return Math.abs(cross2(d,q))<=tol&&dot2(q,d)>=-tol&&dot2(sub2(p,b),d)<=tol;
}
export const isEqualLength=(a:number,b:number,relativeEpsilon=1e-8)=>Math.abs(a-b)<=relativeEpsilon*Math.max(1,Math.abs(a),Math.abs(b));

export type TriangleCongruenceCriterion='SSS'|'SAS'|'ASA'|'RHS'|'none';
export type TriangleMeasures={sides:[number,number,number];angles:[number,number,number]};
export function triangleMeasures(points:[Point2,Point2,Point2]):TriangleMeasures{
  const [a,b,c]=points;
  const ab=distance2(a,b),bc=distance2(b,c),ca=distance2(c,a);
  const safeAngle=(x:number,y:number,z:number)=>angleDegrees(x===1?a:x===2?b:c,y===1?a:y===2?b:c,z===1?a:z===2?b:c)??0;
  return {sides:[ab,bc,ca],angles:[safeAngle(2,1,3),safeAngle(1,2,3),safeAngle(1,3,2)]};
}
export function congruenceCriterion(a:TriangleMeasures,b:TriangleMeasures,relativeEpsilon=1e-8):TriangleCongruenceCriterion{
  const valid=(t:TriangleMeasures)=>t.sides.every(x=>x>relativeEpsilon)&&t.sides[0]+t.sides[1]>t.sides[2]+relativeEpsilon&&t.sides[1]+t.sides[2]>t.sides[0]+relativeEpsilon&&t.sides[2]+t.sides[0]>t.sides[1]+relativeEpsilon&&Math.abs(t.angles.reduce((sum,x)=>sum+x,0)-180)<relativeEpsilon*1000;
  if(!valid(a)||!valid(b))return 'none';
  const eqL=(i:number,j:number)=>isEqualLength(a.sides[i],b.sides[j],relativeEpsilon);
  const eqA=(i:number,j:number)=>Math.abs(a.angles[i]-b.angles[j])<=relativeEpsilon*180;
  if([0,1,2].every(i=>eqL(i,i)))return 'SSS';
  if(eqL(0,0)&&eqL(1,1)&&eqA(1,1))return 'SAS';
  if(eqA(0,0)&&eqL(0,0)&&eqA(1,1))return 'ASA';
  if(Math.abs(a.angles[1]-90)<=relativeEpsilon*180&&Math.abs(b.angles[1]-90)<=relativeEpsilon*180&&eqL(0,0)&&eqL(2,2))return 'RHS';
  return 'none';
}

export const add3=(a:Point3,b:Vector3):Point3=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
export const sub3=(a:Point3,b:Point3):Vector3=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
export const dot3=(a:Vector3,b:Vector3)=>a.x*b.x+a.y*b.y+a.z*b.z;
export const cross3=(a:Vector3,b:Vector3):Vector3=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
export const length3=(a:Vector3)=>Math.hypot(a.x,a.y,a.z);
export function classify3DLines(a:Point3,b:Point3,c:Point3,d:Point3):'coincident'|'parallel'|'intersecting'|'skew'|'degenerate'{
  const u=sub3(b,a),v=sub3(d,c),lu=length3(u),lv=length3(v);if(lu<=GEOMETRY_EPSILON||lv<=GEOMETRY_EPSILON)return 'degenerate';
  const parallel=length3(cross3(u,v))<=GEOMETRY_EPSILON*lu*lv;
  if(parallel)return length3(cross3(sub3(c,a),u))<=GEOMETRY_EPSILON*lu*Math.max(1,length3(sub3(c,a)))?'coincident':'parallel';
  const volume=Math.abs(dot3(sub3(c,a),cross3(u,v)));
  return volume<=GEOMETRY_EPSILON*lu*lv*Math.max(1,length3(sub3(c,a)))?'intersecting':'skew';
}
export function linePlaneIntersection3D(origin:Point3,direction:Vector3,planePoint:Point3,normal:Vector3):{kind:'point';point:Point3;t:number}|{kind:'parallel'|'contained'|'degenerate'}{
  const den=dot3(direction,normal),num=dot3(sub3(planePoint,origin),normal),scale=Math.max(1,length3(direction)*length3(normal));
  if(length3(direction)<=GEOMETRY_EPSILON||length3(normal)<=GEOMETRY_EPSILON)return {kind:'degenerate'};
  if(Math.abs(den)<=GEOMETRY_EPSILON*scale)return Math.abs(num)<=GEOMETRY_EPSILON*Math.max(1,length3(normal)*length3(sub3(planePoint,origin)))?{kind:'contained'}:{kind:'parallel'};
  const t=num/den;return {kind:'point',point:add3(origin,{x:direction.x*t,y:direction.y*t,z:direction.z*t}),t};
}
