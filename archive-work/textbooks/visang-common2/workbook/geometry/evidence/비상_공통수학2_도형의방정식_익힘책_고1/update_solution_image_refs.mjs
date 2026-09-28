import fs from 'node:fs';
import vm from 'node:vm';

const file='archive-work/textbooks/visang-common2/workbook/geometry/js/비상_공통수학2_도형의방정식_익힘책_고1.js';
const context={window:{}};
vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
const set='비상_공통수학2_도형의방정식_익힘책_고1';
const names={
  1:'q01_geometry_core_final.svg',
  2:'q02_geometry_core_final.svg',
  4:'q04_geometry_core_final.svg',
  5:'q05_geometry_core_final.svg',
  6:'q06_geometry_core_final.svg',
  7:'q07_geometry_core_final.svg',
  8:'q08_geometry_core_final.svg',
  9:'q09_geometry_core_final.svg',
  10:'q10_geometry_core_final.svg',
  12:'q12_geometry_core_final.svg',
  13:'q13_geometry_core_final.svg',
  14:'q14_geometry_core_final2.svg'
};
for(const [displayNo,fileName] of Object.entries(names)){
  context.window.questionBank[Number(displayNo)-1].solutionImage='assets/images/'+set+'/'+fileName;
}
const newline=String.fromCharCode(10);
fs.writeFileSync(file,'window.examTitle = '+JSON.stringify(context.window.examTitle)+';'+newline+newline+'window.questionBank = '+JSON.stringify(context.window.questionBank,null,2)+';'+newline,'utf8');
console.log(JSON.stringify({refs:Object.entries(names)},null,2));
