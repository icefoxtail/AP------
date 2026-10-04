const fs=require('fs');
const path=require('path');
const zlib=require('zlib');

function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
function decodePng(file){
  const buf=fs.readFileSync(file);
  if(buf.slice(1,4).toString()!=='PNG') throw new Error('not png');
  let off=8,w,h,bitDepth,colorType,palette=null,idats=[];
  while(off<buf.length){
    const len=buf.readUInt32BE(off); const type=buf.slice(off+4,off+8).toString();
    const data=buf.slice(off+8,off+8+len); off+=12+len;
    if(type==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);bitDepth=data[8];colorType=data[9];if(data[12]!==0)throw new Error('interlaced');}
    else if(type==='PLTE') palette=data;
    else if(type==='IDAT') idats.push(data);
    else if(type==='IEND') break;
  }
  if(bitDepth!==8) throw new Error('bitDepth '+bitDepth);
  const channels={0:1,2:3,3:1,4:2,6:4}[colorType]; if(!channels)throw new Error('colorType '+colorType);
  const raw=zlib.inflateSync(Buffer.concat(idats)); const stride=w*channels; const rows=[]; let p=0, prev=Buffer.alloc(stride);
  for(let y=0;y<h;y++){
    const f=raw[p++], src=raw.slice(p,p+stride); p+=stride; const cur=Buffer.alloc(stride);
    for(let x=0;x<stride;x++){const a=x>=channels?cur[x-channels]:0,b=prev[x]||0,c=x>=channels?(prev[x-channels]||0):0;let v=src[x];
      if(f===1)v=(v+a)&255; else if(f===2)v=(v+b)&255; else if(f===3)v=(v+Math.floor((a+b)/2))&255; else if(f===4)v=(v+paeth(a,b,c))&255; else if(f!==0)throw new Error('filter '+f); cur[x]=v;}
    rows.push(cur); prev=cur;
  }
  function lum(x,y){const row=rows[y],i=x*channels; let r,g,b;
    if(colorType===0||colorType===4){r=g=b=row[i];}
    else if(colorType===2||colorType===6){r=row[i];g=row[i+1];b=row[i+2];}
    else {const idx=row[i]*3;r=palette[idx];g=palette[idx+1];b=palette[idx+2];}
    return (r*299+g*587+b*114)/1000;
  }
  return {w,h,lum};
}
function ascii(img,maxW=160,maxH=80){
  const scale=Math.max(img.w/maxW,img.h/maxH,1), outW=Math.ceil(img.w/scale),outH=Math.ceil(img.h/scale), chars=' ░▒▓█'; let out=[];
  for(let oy=0;oy<outH;oy++){let line=''; for(let ox=0;ox<outW;ox++){let dark=0,n=0;
    const x0=Math.floor(ox*scale),x1=Math.min(img.w,Math.ceil((ox+1)*scale)),y0=Math.floor(oy*scale),y1=Math.min(img.h,Math.ceil((oy+1)*scale));
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){dark+=Math.max(0,220-img.lum(x,y))/220;n++;}
    const d=n?dark/n:0; line+=chars[Math.min(4,Math.floor(d*12))];} out.push(line.replace(/\s+$/,''));}
  while(out.length&&out[0].trim()==='')out.shift(); while(out.length&&out[out.length-1].trim()==='')out.pop();
  return out.join('\n');
}
const root=path.resolve(__dirname,'..');
const base='archive/assets/images/26_팔마중_1학기_기말_중2_기출';
for(const name of ['q09.png','q11.png','q13.png','q16.png']){
  const img=decodePng(path.join(root,base,name));
  console.log('\n=== O17 '+name+' '+img.w+'x'+img.h+' ===');
  console.log(ascii(img));
  console.log('=== END '+name+' ===');
}
console.log('O17 source pixel ASCII render PASS');