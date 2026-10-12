const fs=require("node:fs"),path=require("node:path"),p=path.join(__dirname,"author-create.mjs");let s=fs.readFileSync(p,"utf8");
s=s.replace("11:{answer:'⑤',unit:'derivativeFunction',category:'함수 관계식에서 도함수 결정',level:'상',bucket:4","11:{answer:'⑤',unit:'derivativeFunction',category:'함수 관계식에서 도함수 결정',level:'중',bucket:3");
s=s.replace("17:{answer:'49',unit:'derivative',category:'미분계수의 정의를 이용한 계산',level:'중',bucket:3","17:{answer:'49',unit:'derivative',category:'미분계수의 정의를 이용한 계산',level:'중',bucket:2");
s=s.replace("18:{answer:'116',unit:'limit',category:'극한과 연속 조건으로 다항함수 결정',level:'상',bucket:5","18:{answer:'116',unit:'limit',category:'극한과 연속 조건으로 다항함수 결정',level:'상',bucket:4");
const a=s.indexOf("19:{answer:String.raw"),b=s.indexOf("\n};",a);if(a<0||b<0)throw Error("Q19_LOCUS");let c=s.slice(a,b).replace("level:'상',bucket:5","level:'상',bucket:4");s=s.slice(0,a)+c+s.slice(b);
fs.writeFileSync(p,s,"utf8");
