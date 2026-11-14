const AXES=[0,1,2];
const FOOTPRINT=[
  [1,1,1],
  [0,1,1],[2,1,1],
  [1,0,1],[1,2,1],
  [1,1,0],[1,1,2],
];

// The centre cube and six arms are seven cells on the same grid. Only
// faces with no neighbour belong to the boundary. The exposed quads in
// any one plane meet at most at vertices, so none have a coplanar seam.
export function orthogonalSquarePrismBoundary(side,length){
  const levels=[-length/2,-side/2,side/2,length/2];
  const occupied=new Set(FOOTPRINT.map(cell=>cell.join(',')));
  const corners=new Set(),cycles=[];
  for(const cell of FOOTPRINT)for(const axis of AXES)for(const step of [-1,1]){
    const neighbour=[...cell];
    neighbour[axis]+=step;
    if(occupied.has(neighbour.join(',')))continue;
    const u=(axis+1)%3,v=(axis+2)%3;
    const cycle=[[0,0],[1,0],[1,1],[0,1]].map(([du,dv])=>{
      const corner=[...cell];
      corner[axis]+=step===1?1:0;
      corner[u]+=du;
      corner[v]+=dv;
      const key=corner.join(',');
      corners.add(key);
      return key;
    });
    cycles.push(step===1?cycle:cycle.reverse());
  }
  // Grid keys sort by X, Y, Z and have only single-digit coordinates.
  const keys=[...corners].sort();
  const indices=new Map(keys.map((key,index)=>[key,index]));
  return {
    points:keys.map(key=>key.split(',').map(i=>levels[Number(i)])),
    faces:cycles.map((cycle,index)=>({id:'f'+index,idx:cycle.map(key=>indices.get(key))})),
  };
}
