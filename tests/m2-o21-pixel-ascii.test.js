const fs=require('fs'),zlib=require('zlib');
function png(path){
 const b=fs.readFileSync(path); let p=8,w,h,bd,ct,pl=null,id=[];
 while(p<b.length){const n=b.readUInt32BE(p);const t=b.toString('ascii',p+4,p+8);const d=b.subarray(p+8,p+8+n);p+=12+n;
  if(t==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);bd=d[8];ct=d[9];}
  else if(t==='PLTE')pl=d; else if(t==='IDAT')id.push(d); else if(t==='IEND')break;}
 if(bd!==8)throw Error('bitdepth '+bd); const ch={0:1,2:3,3:1,4:2,6:4}[ct]; if(!ch)throw Error('ct '+ct);
 const raw=zlib.inflateSync(Buffer.concat(id)), stride=w*ch, pix=Buffer.alloc(h*stride); let off=0,prev=Buffer.alloc(stride);
 const paeth=(a,b,c)=>{const q=a+b-c,pa=Math.abs(q-a),pb=Math.abs(q-b),pc=Math.abs(q-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c};
 for(let y=0;y<h;y++){const f=raw[off++],row=raw.subarray(off,off+stride);off+=stride;const out=pix.subarray(y*stride,(y+1)*stride);
  for(let x=0;x<stride;x++){const a=x>=ch?out[x-ch]:0,bv=prev[x]||0,c=x>=ch?prev[x-ch]||0:0,v=row[x];
   out[x]=(v+(f===0?0:f===1?a:f===2?bv:f===3?Math.floor((a+bv)/2):paeth(a,bv,c)))&255;} prev=out;}
 const lum=(x,y)=>{const i=(y*w+x)*ch;if(ct===0||ct===4)return pix[i];if(ct===3){const j=pix[i]*3;return Math.round((pl[j]+pl[j+1]+pl[j+2])/3);}return Math.round((pix[i]+pix[i+1]+pix[i+2])/3)};
 return {w,h,lum};
}
const files=[['Q06','archive/assets/images/26_동산중_1학기_기말_중2_기출/q06.png'],['Q09','archive/assets/images/26_동산중_1학기_기말_중2_기출/q09.png'],['Q15','archive/assets/images/26_동산중_1학기_기말_중2_기출/q15.png'],['Q20','archive/assets/images/26_동산중_1학기_기말_중2_기출/q20.png']];
for(const [id,f] of files){const im=png(f),W=80,H=40;console.log('M2_O21_'+id+'_ASCII '+im.w+'x'+im.h);for(let yy=0;yy<H;yy++){let s='';for(let xx=0;xx<W;xx++){let sum=0,n=0;const x0=Math.floor(xx*im.w/W),x1=Math.max(x0+1,Math.floor((xx+1)*im.w/W)),y0=Math.floor(yy*im.h/H),y1=Math.max(y0+1,Math.floor((yy+1)*im.h/H));for(let y=y0;y<y1;y+=Math.max(1,Math.floor((y1-y0)/2)))for(let x=x0;x<x1;x+=Math.max(1,Math.floor((x1-x0)/2))){sum+=im.lum(x,y);n++;}const v=sum/n;s+=v<80?'#':v<150?'*':v<215?'.':' ';}console.log(s)}}
