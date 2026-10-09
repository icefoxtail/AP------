import fs from 'node:fs';
const [oldPath,newPath] = process.argv.slice(2);
const oldRows = JSON.parse(fs.readFileSync(oldPath,'utf8')).rows;
const newRows = JSON.parse(fs.readFileSync(newPath,'utf8')).rows;
const changed=[];
for (let i=0;i<oldRows.length;i++) {
  const a={...oldRows[i]},b={...newRows[i]};
  if (JSON.stringify(a.tags)!==JSON.stringify(b.tags)) changed.push(a.qid);
  delete a.tags; delete b.tags;
  if (JSON.stringify(a)!==JSON.stringify(b)) throw new Error('unexpected non-tag qid mutation:'+oldRows[i].qid);
}
if (JSON.stringify(changed)!==JSON.stringify([1,9,19])) throw new Error('unexpected tag qids '+JSON.stringify(changed));
process.stdout.write(JSON.stringify({studentBodyAndAllNonTagFieldsUnchanged:true,changedTagQids:changed},null,2));
