import fs from 'node:fs';
const p=process.argv[2],s=fs.readFileSync(p,'utf8');let out='',i=0;
while(i<s.length){
 if(s.startsWith('String.raw`',i)){out+='`';i+='String.raw`'.length;let chunk='';while(i<s.length&&s[i]!=='`'){
  if(s[i]==='\\'){let j=i;while(s[j]==='\\')j++;const n=j-i;if(n===4){chunk+='\\\\';i=j;continue;}if(n===2&&s[j]==='n'){chunk+='\\n';i=j+1;continue;}chunk+='\\'.repeat(n);i=j;continue;}
  chunk+=s[i++];
 }out+=chunk;if(s[i]==='`'){out+='`';i++;}continue;}
 if(s[i]==='\\'){let j=i;while(s[j]==='\\')j++;const n=j-i;if(n===4){out+='\\\\';i=j;continue;}out+='\\'.repeat(n);i=j;continue;}
 out+=s[i++];
}
fs.writeFileSync(p,out,'utf8');console.log('normalized',p,'bytes',Buffer.byteLength(out));
