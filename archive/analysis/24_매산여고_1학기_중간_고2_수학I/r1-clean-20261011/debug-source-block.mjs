import fs from 'node:fs';import vm from 'node:vm';
const p='archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js',s=fs.readFileSync(p,'utf8'),w={};vm.runInNewContext(s,{window:w});
const st=s.indexOf('"id": 24,'),en=s.indexOf('\n  }',st),section=s.slice(st,en);const i=section.indexOf('difficultyConfidence');
console.log(JSON.stringify({q24keys:Object.keys(w.questionBank.find(q=>q.id===24)),span:[st,en],len:section.length,contains:i>=0,context:i>=0?section.slice(i-80,i+100):null,afterMarker:s.slice(st,st+200),arrayEnd:s.indexOf('];',st)}));
