const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(process.argv[2],'utf8'),box={window:{}}; vm.runInNewContext(src,box,{timeout:5000});
const rx=/(^rpm|problemType|template|crossConcept|condition|integration|standardCourse|standardUnit|subUnit|difficulty|level|category|reviewStatus|meta|tag)/i;
const rows=box.window.questionBank.map(q=>({qid:q.id,fields:Object.fromEntries(Object.entries(q).filter(([k])=>rx.test(k)))}));
fs.writeFileSync(process.argv[3],JSON.stringify({examTitle:box.window.examTitle,questionCount:rows.length,rows},null,2));