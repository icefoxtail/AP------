const fs=require("node:fs"),path=require("node:path"),p=path.join(__dirname,"author-create.mjs");let s=fs.readFileSync(p,"utf8");
s=s.replace("5:{answer:'③',unit:'derivative'","5:{answer:'③',unit:'derivativeFunction'");
s=s.replace("12:{answer:'②',unit:'application'","12:{answer:'②',unit:'tangent'");
s=s.replace("16:{answer:'④',unit:'derivative'","16:{answer:'④',unit:'derivativeFunction'");
const a=s.indexOf("19:{answer:String.raw"),b=s.indexOf("\n};",a);if(a<0||b<0)throw Error("Q19_META_LOCUS");let q19=s.slice(a,b).replace("unit:'application'","unit:'tangent'").replace("tpl:'TPL_TANGENT_CONSTRUCTION'","tpl:'TPL_TANGENCY_RELATION_GEOMETRY'");s=s.slice(0,a)+q19+s.slice(b);
const q12=s.indexOf("12:{answer:'②'"),q13=s.indexOf("\n13:{answer:",q12);let chunk=s.slice(q12,q13).replace("tpl:'TPL_TANGENT_CONSTRUCTION'","tpl:'TPL_TANGENCY_RELATION_GEOMETRY'");s=s.slice(0,q12)+chunk+s.slice(q13);
fs.writeFileSync(p,s,"utf8");
