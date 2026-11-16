import {inflateSync} from 'node:zlib';

const SIGNATURE=Buffer.from('89504e470d0a1a0a','hex');
const MAX_DIMENSION=1600;
const bad=()=>{throw Error('SCHEMATIC_UNSUPPORTED_SOURCE_PNG');};
function paeth(a,b,c){
  const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);
  return pa<=pb&&pa<=pc?a:pb<=pc?b:c;
}

// The supported authority format is non-interlaced, opaque 8-bit grayscale or RGB PNG.
export function schematicRaster(bytes){
  if(bytes.length>8000000||!bytes.subarray(0,8).equals(SIGNATURE))bad();
  let width=0,height=0,channels=0,done=false;
  const pieces=[];
  for(let at=8;at+12<=bytes.length;){
    const size=bytes.readUInt32BE(at),name=bytes.toString('ascii',at+4,at+8);
    if(size>bytes.length-at-12)bad();
    const chunk=bytes.subarray(at+8,at+8+size);
    at+=size+12;
    if(name==='IHDR'){
      if(width||size!==13||at!==33)bad();
      width=chunk.readUInt32BE(0);height=chunk.readUInt32BE(4);
      channels=chunk[9]===0?1:chunk[9]===2?3:0;
      if(Math.min(width,height)<100||Math.max(width,height)>MAX_DIMENSION||!channels||
        chunk[8]!==8||chunk[10]||chunk[11]||chunk[12])bad();
    }else if(name==='IDAT'){
      if(!width)bad();
      pieces.push(chunk);
    }else if(name==='IEND'){
      if(size||at!==bytes.length)bad();
      done=true;break;
    }else if(!/^[a-z]/.test(name)||name==='tRNS'||name==='acTL')bad();
  }
  if(!done||!pieces.length)bad();
  const stride=width*channels,length=(stride+1)*height;
  let source;
  try{source=inflateSync(Buffer.concat(pieces),{maxOutputLength:length});}catch{bad();}
  if(source.length!==length)bad();
  const ink=new Uint8Array(width*height);
  let prev=new Uint8Array(stride),offset=0;
  for(let y=0;y<height;y++){
    const filter=source[offset++];
    if(filter>4)bad();
    const row=new Uint8Array(stride);
    for(let i=0;i<stride;i++){
      const left=i<channels?0:row[i-channels],above=prev[i],diagonal=i<channels?0:prev[i-channels];
      const prediction=[0,left,above,(left+above)>>1,paeth(left,above,diagonal)][filter];
      row[i]=source[offset++]+prediction;
    }
    for(let x=0;x<width;x++){
      const i=x*channels;
      ink[y*width+x]=channels===1?+(row[i]<205):+(299*row[i]+587*row[i+1]+114*row[i+2]<205000);
    }
    prev=row;
  }
  return {width,height,nearInk(x,y){
    x=Math.round(x);y=Math.round(y);
    for(let v=Math.max(0,y-5);v<=Math.min(height-1,y+5);v++){
      for(let u=Math.max(0,x-5);u<=Math.min(width-1,x+5);u++){
        if((u-x)**2+(v-y)**2<=25&&ink[v*width+u])return true;
      }
    }
    return false;
  }};
}

export function inkCoverage(points,raster){
  let hits=0,total=0,gap=0,longestGap=0;
  for(let i=1;i<points.length;i++){
    const [x,y]=points[i-1],[u,v]=points[i],steps=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)/2));
    for(let j=0;j<=steps;j++){
      total++;
      if(raster.nearInk(x+(u-x)*j/steps,y+(v-y)*j/steps)){hits++;gap=0;}
      else longestGap=Math.max(longestGap,++gap);
    }
  }
  return {ratio:hits/total,longestGap};
}
