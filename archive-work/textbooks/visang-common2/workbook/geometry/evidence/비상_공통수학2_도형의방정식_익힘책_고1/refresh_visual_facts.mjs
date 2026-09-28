import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root='archive-work/textbooks/visang-common2/workbook/geometry';
const setKey='비상_공통수학2_도형의방정식_익힘책_고1';
const jsPath=path.join(root,'js','비상_공통수학2_도형의방정식_익힘책_고1.js');
const factsDir=path.join(root,'evidence',setKey,'pipeline-core','expected-facts');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(jsPath,'utf8'),context);
const bank=context.window.questionBank;
for(const file of fs.readdirSync(factsDir).filter(name=>/^q\d+_expected\.json$/.test(name))){
  const index=Number(file.match(/^q(\d+)/)[1])-1;
  const fact=JSON.parse(fs.readFileSync(path.join(factsDir,file),'utf8'));
  fact.questionUid=String(bank[index].id);
  if(index===3){
    fact.semantic={
      points:[
        {id:'P',x:0,y:1},{id:'H',x:-2,y:-2},{id:'A',x:3,y:-1},
        {id:'B',x:1,y:-4},{id:'H2',x:2,y:4},{id:'C',x:5,y:2}
      ],
      circles:[],
      segments:[
        {id:'L',start:'P',end:'A'},{id:'M',start:'H',end:'B'},
        {id:'N',start:'P',end:'H'},{id:'M2',start:'H2',end:'C'},
        {id:'N2',start:'P',end:'H2'}
      ],
      relations:[
        {from:'L',to:'M',relation:'parallel'},
        {from:'N',to:'L',relation:'perpendicular'},
        {from:'L',to:'M2',relation:'parallel'},
        {from:'N2',to:'L',relation:'perpendicular'}
      ],
      scalePolicy:'EXACT_EQUAL_UNITS'
    };
  }
  if(index===4){
    fact.semantic={
      points:[{id:'E',x:-4,y:1},{id:'D',x:8,y:-7}],
      circles:[{id:'circleC',x:2,y:-3,radius:4}],
      segments:[{id:'ED',start:'E',end:'D'}],
      relations:[{from:'E',to:'D',relation:'segment'}],
      scalePolicy:'EXACT_EQUAL_UNITS'
    };
  }
  if(index===7){
    fact.semantic={
      points:[{id:'C',x:5,y:-3},{id:'M',x:5,y:1},{id:'A',x:8,y:1},{id:'B',x:2,y:1}],
      circles:[{id:'circleC',x:5,y:-3,radius:5}],
      segments:[{id:'AB',start:'A',end:'B'},{id:'CM',start:'C',end:'M'},{id:'AM',start:'A',end:'M'}],
      relations:[{from:'CM',to:'AB',relation:'perpendicular'}],
      scalePolicy:'EXACT_EQUAL_UNITS'
    };
  }
  if(index===8){
    fact.semantic={
      points:[{id:'O',x:0,y:0},{id:'T',x:5,y:0},{id:'P',x:1.8,y:2.4},{id:'Q',x:1.8,y:-2.4}],
      circles:[{id:'circleO',x:0,y:0,radius:3}],
      segments:[{id:'OP',start:'O',end:'P'},{id:'PT',start:'P',end:'T'},{id:'OQ',start:'O',end:'Q'},{id:'QT',start:'Q',end:'T'},{id:'PQ',start:'P',end:'Q'}],
      relations:[{from:'OP',to:'PT',relation:'perpendicular'},{from:'OQ',to:'QT',relation:'perpendicular'}],
      scalePolicy:'SCHEMATIC_DECLARED'
    };
  }
  fs.writeFileSync(path.join(factsDir,file),JSON.stringify(fact,null,2),'utf8');
}
console.log(JSON.stringify({questionCount:bank.length,visualFactCount:fs.readdirSync(factsDir).filter(f=>f.endsWith('_expected.json')).length,setKey}));
