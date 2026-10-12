const fs=require("node:fs"),path=require("node:path"),d=__dirname;
function edit(q,fn){const p=path.join(d,"q"+q+"-solution.json"),j=JSON.parse(fs.readFileSync(p,"utf8"));fn(j);fs.writeFileSync(p,JSON.stringify(j,null,2)+"\n","utf8");}
edit(12,j=>{j.lines[1].kind="tangent";});
edit(15,j=>{j.lines=[];j.segments.push({from:{x:0,y:0},to:{x:1.44,y:1.92},kind:"perpendicular",label:"OH=12/5"});j.rightAngles=[{vertex:{x:1.44,y:1.92},alongA:{x:0,y:0},alongB:{x:4,y:0}}];});
edit(19,j=>{j.lines[1].kind="tangent";j.segments.push({from:{x:2*Math.sqrt(5)-1,y:5-Math.sqrt(5)},to:{x:2*Math.sqrt(5)-1,y:0},kind:"radius",label:"CT=r"});const h=2*Math.sqrt(5)-1,r=5-Math.sqrt(5);j.rightAngles=[{vertex:{x:1,y:4},alongA:{x:h,y:r},alongB:{x:2,y:6}},{vertex:{x:h,y:0},alongA:{x:h,y:r},alongB:{x:h+1,y:0}}];});
