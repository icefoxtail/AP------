import {bytesSha} from '../../pipeline-core/canonical.mjs';
import {esc} from './quadratic-inequality-chain-v1.mjs';
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
// Text with spaces, set on `lines` lines (the break chosen so that the longest line is shortest), as one fragment: the lines centred on one another, the label's box the whole block. Shared by the
// set-diagram element labels and the stat-chart tree node labels; panelId and factRole are what the one-line labels of the figure are typeset with.
export function wrapTextFragment(typeset,label,identity,fontPx,lines,{panelId,factRole,typesetExtra={}}){
  const words=label.text.split(/\s+/).filter(Boolean);
  if(words.length<2)return null;
  const count=Math.min(lines,words.length),cache=new Map();
  const part=(i,j)=>{const key=i+':'+j;if(!cache.has(key))cache.set(key,typeset({id:label.id,owner:label.owner,factRole,fontPx,panelId,occurrence:1+cache.size,kind:'TEXT',text:words.slice(i,j).join(' '),...typesetExtra},identity));return cache.get(key);};
  let best=null;
  const walk=(start,left,cuts)=>{
    if(left===1){const all=[...cuts,words.length];let from=0,widest=0;for(const to of all){widest=Math.max(widest,part(from,to).intrinsic.width);from=to;}if(!best||widest<best.widest-1e-9)best={widest,cuts:all};return;}
    for(let cut=start+1;cut<=words.length-left+1;cut++)walk(cut,left-1,[...cuts,cut]);
  };
  walk(0,count,[]);
  const rows=[];let from=0;for(const to of best.cuts){rows.push(part(from,to));from=to;}
  const width=Math.max(...rows.map(r=>r.intrinsic.width)),height=rows.reduce((sum,r)=>sum+r.intrinsic.height,0);
  let y=0;
  const inner=rows.map(r=>{const g='<g transform="translate('+r6((width-r.intrinsic.width)/2)+' '+r6(y)+')">'+r.svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')+'</g>';y+=r.intrinsic.height;return g;}).join('');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" data-outline-width="'+width+'" data-outline-height="'+height+'" id="'+rows[0].namespace+'" data-owner="'+esc(label.owner)+'" data-fact-role="'+factRole+'">'+inner+'</svg>';
  const lineRects=rows.map((r,i)=>({x:r6((width-r.intrinsic.width)/2),y:r6(rows.slice(0,i).reduce((sum,q)=>sum+q.intrinsic.height,0)),width:r6(r.intrinsic.width),height:r6(r.intrinsic.height)}));
  return {lines:lineRects,labelId:label.id,owner:label.owner,factRole,namespace:rows[0].namespace,svg,fragmentSha256:bytesSha(Buffer.from(svg)),fontSha256:rows[0].fontSha256,intrinsic:{width,height,baseline:rows[0].intrinsic.baseline},fontPx,typesetter:rows[0].typesetter};
}
