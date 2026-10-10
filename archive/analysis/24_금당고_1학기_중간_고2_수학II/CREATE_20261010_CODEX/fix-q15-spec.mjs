import fs from 'node:fs';
const p=process.argv.at(-1),j=JSON.parse(fs.readFileSync(p,'utf8'));
for(const c of j.circles)delete c.label;
j.annotations=[
{x:1.75,y:1.5,text:'r=12/5: 접함'},
{x:2.45,y:2.15,text:'r=3: 꼭짓점 B'},
{x:3.35,y:3.15,text:'r=4: 꼭짓점 A'},
{x:1.1,y:2.1,text:'OH=12/5'}
];
fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n','utf8');
