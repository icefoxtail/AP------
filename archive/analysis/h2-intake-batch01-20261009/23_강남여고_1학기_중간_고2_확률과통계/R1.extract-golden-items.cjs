const fs=require('fs'),vm=require('vm');
const file=process.argv[2], wanted=new Set([2,3]);
const bytes=fs.readFileSync(file), sandbox={window:{}};
vm.runInNewContext(bytes.toString('utf8'),sandbox,{timeout:5000});
const qs=sandbox.window.questionBank.filter(q=>wanted.has(Number(q.id))).map(q=>({id:q.id,content:q.content,choices:q.choices,answer:q.answer,solution:q.solution,decisiveStep:q.decisiveStep,solutionImage:q.solutionImage,visualDisposition:q.visualDisposition,layoutTag:q.layoutTag,wide:q.wide}));
console.log(JSON.stringify({title:sandbox.window.examTitle,sha256:require('crypto').createHash('sha256').update(bytes).digest('hex'),path:process.argv[3],items:qs},null,2));