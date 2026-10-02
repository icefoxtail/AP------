import fs from'node:fs';import vm from'node:vm';
const P='archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js',A='22_신흥중_2학기_기말_중3_기출';
const src=fs.readFileSync(P,'utf8'),box={window:{}};vm.createContext(box);vm.runInContext(src,box);const q=box.window.questionBank;
const before=q.map(x=>JSON.stringify([x.content,x.choices,x.answer,x.image]));
const d=JSON.parse(fs.readFileSync('archive/tmp/o68-create-patch.json','utf8'));
for(const x of q){if(d.solutions[x.id])x.solution=d.solutions[x.id];if(d.solutionImageQids.includes(x.id))x.solutionImage='assets/images/'+A+'/q'+x.id+'-solution.svg';if(d.exactMeta[x.id]){x.problemTypeKey=d.exactMeta[x.id][0];x.templateKey=d.exactMeta[x.id][1]}}
if(q.some((x,i)=>before[i]!==JSON.stringify([x.content,x.choices,x.answer,x.image])))throw Error('PROTECTED_PARITY_FAIL');
fs.writeFileSync(P,'window.examTitle = "'+A+'";\n\nwindow.questionBank = '+JSON.stringify(q,null,2)+';\n');
console.log(JSON.stringify({ok:true,questions:q.length,protectedParity:'22/22',visuals:d.solutionImageQids.length,meta:Object.keys(d.exactMeta).length}));