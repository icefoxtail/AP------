const fs=require("node:fs"),path=require("node:path"),p=path.join(__dirname,"author-create.mjs");let s=fs.readFileSync(p,"utf8");
s=s.replace("4:{answer:'①',unit:'continuity',category:'연속함숫값의 결정',level:'하',bucket:2","4:{answer:'①',unit:'continuity',category:'연속함숫값의 결정',level:'중',bucket:2");
s=s.replace("7:{answer:'④',unit:'tangent',category:'기울기가 주어진 접선의 방정식',level:'하',bucket:2","7:{answer:'④',unit:'tangent',category:'기울기가 주어진 접선의 방정식',level:'중',bucket:2");
s=s.replace("8:{answer:'③',unit:'application',category:'평균값 정리의 값 결정',level:'하',bucket:2","8:{answer:'③',unit:'application',category:'평균값 정리의 값 결정',level:'중',bucket:2");
fs.writeFileSync(p,s,"utf8");
