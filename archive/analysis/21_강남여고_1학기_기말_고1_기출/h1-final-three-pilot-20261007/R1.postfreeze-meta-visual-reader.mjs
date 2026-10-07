import fs from 'node:fs'; import vm from 'node:vm'; import crypto from 'node:crypto';
const [src,out]=process.argv.slice(2), bytes=fs.readFileSync(src), box={window:{}};
vm.runInNewContext(bytes.toString('utf8'),box,{timeout:5000});
const bank=box.window.questionBank||box.window.questions;
const keep=/^(id|content|question|choices|image|solutionImage|imageSize|solutionImageSize|choiceColumns|layoutTag|wide|level|difficulty.*|L[1-4]|PT|TPL|mainTopic|subTopic|topic.*|.*Topic|.*Template|.*CrossConcept|.*Condition.*|tags)$/i;
const rows=bank.map(q=>Object.fromEntries(Object.entries(q).filter(([k])=>keep.test(k))));
fs.writeFileSync(out,JSON.stringify({sourceRawSha256:crypto.createHash('sha256').update(bytes).digest('hex'),rows},null,2)+'\n');
