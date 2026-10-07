const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const js=process.argv[2],assetDir=process.argv[3];const s={window:{}};vm.runInNewContext(fs.readFileSync(js,'utf8'),s);const b=s.window.questionBank;
b.find(q=>q.id===10).content=`다음 그림에서 $\\widehat{AB}=\\widehat{AD}=\\widehat{CD}$이고, $\\angle BPC=30^\\circ$일 때, $2\\angle x$의 크기를 구하면? (5점)`;
b.find(q=>q.id===11).content=`다음 그림에서 $\\widehat{AB}$의 길이는 원의 둘레의 길이의 $\\dfrac15$이고, $\\widehat{AB}:\\widehat{CD}=3:4$일 때, $\\angle APB$의 크기를 구하면? (4점)`;
b.find(q=>q.id===22).content=b.find(q=>q.id===22).content.replace('(2) $\\\\overline{OD}:\\\\overline{HC}', '\\n(2) $\\\\overline{OD}:\\\\overline{HC}').replace('(3) $\\\\overline{AG}', '\\n(3) $\\\\overline{AG}');
fs.writeFileSync(js,`window.examTitle = ${JSON.stringify(s.window.examTitle)};\nwindow.questionBank = ${JSON.stringify(b,null,2)};\n`,'utf8');
const p21=path.join(assetDir,'q21-solution.svg');let svg=fs.readFileSync(p21,'utf8').replace('x="370" y="142"','x="460" y="164"');fs.writeFileSync(p21,svg,'utf8');
const p22=path.join(assetDir,'q22-solution.svg');svg=fs.readFileSync(p22,'utf8').replace('<text x="388" y="320" font-size="18" font-family="sans-serif">E</text>','<text x="388" y="320" font-size="18" font-family="sans-serif">E</text><circle cx="320" cy="180" r="4" fill="#111"/><text x="302" y="170" font-size="18" font-family="sans-serif">F</text>');fs.writeFileSync(p22,svg,'utf8');
console.log('source and visual loci patched')
