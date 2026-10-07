import fs from 'node:fs';
import crypto from 'node:crypto';
const [file, expectedSha] = process.argv.slice(2);
const bytes=fs.readFileSync(file);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=sha(bytes);
if(before!==expectedSha)throw Error('SOURCE_SHA_MISMATCH:'+before);
let src=bytes.toString('utf8');
const hits=[...src.matchAll(/["']?id["']?\s*:\s*19\s*[,}]/g)];
if(hits.length!==1)throw Error('QID19_PROPERTY_COUNT:'+hits.length);
const idAt=hits[0].index;
const start=src.lastIndexOf('{',idAt);
if(start<0)throw Error('QID_OBJECT_START');
let depth=0,state='code',quote='',escape=false,end=-1;
const tick=String.fromCharCode(96);
for(let i=start;i<src.length;i++){
 const c=src[i],n=src[i+1];
 if(state==='line'){if(c==='\n')state='code';continue;}
 if(state==='block'){if(c==='*'&&n==='/'){state='code';i++;}continue;}
 if(state==='string'){if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(c===quote)state='code';continue;}
 if(state==='template'){if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(c===tick)state='code';continue;}
 if(c==='/'&&n==='/'){state='line';i++;continue;}
 if(c==='/'&&n==='*'){state='block';i++;continue;}
 if(c==='"'||c==="'"){state='string';quote=c;continue;}
 if(c===tick){state='template';continue;}
 if(c==='{')depth++;
 else if(c==='}'){depth--;if(depth===0){end=i+1;break;}}
}
if(end<0)throw Error('QID_OBJECT_END');
let block=src.slice(start,end);
const changes={
 standardUnitKey:'H15-SA-05',
 standardUnit:'이차방정식',
 subUnitKey:'H15-SA-05-EQUATION_FUNCTION_RELATION',
 subUnit:'이차방정식과 이차함수의 관계',
 problemTypeKey:'PT_H1_QUADRATIC_GRAPH_INTERSECTION',
 templateKey:'TPL_H1_QUADRATIC_INTERSECTION_TANGENCY'
};
for(const [key,value] of Object.entries(changes)){
 const re=new RegExp('((?:\\b|["\\x27])'+key+'(?:["\\x27])?\\s*:\\s*)(null|"(?:\\\\.|[^"\\\\])*"|\\x27(?:\\\\.|[^\\x27\\\\])*\\x27)');
 const m=block.match(re);
 if(!m)throw Error('FIELD_MISSING:'+key);
 const count=[...block.matchAll(new RegExp(re.source,'g'))].length;
 if(count!==1)throw Error('FIELD_COUNT:'+key+':'+count);
 block=block.replace(re,'$1'+JSON.stringify(value));
}
src=src.slice(0,start)+block+src.slice(end);
fs.writeFileSync(file,src,'utf8');
console.log(JSON.stringify({beforeSha256:before,afterSha256:sha(Buffer.from(src)),qid:19,changedFields:Object.keys(changes)}));
