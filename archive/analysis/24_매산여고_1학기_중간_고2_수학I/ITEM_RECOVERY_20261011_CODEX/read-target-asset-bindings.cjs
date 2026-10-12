const fs=require('fs');const ps=[
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/CREATE_20261010_CODEX/CREATE.archive-stage-validator.raw.json',
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/CREATE_20261010_CODEX/CREATE.completion.final.json',
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-clean-20261011/r1-stage-validator.raw.v2.json',
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r2-clean-20261011/r2-stage-validator.raw.v2.json',
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r2-clean-20261011/r2-completion.sealed.json',
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r3-20261011-codex/R3.validator.raw.json',
'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r3-20261011-codex/R3.evidence.final.json'];
function walk(x,out){if(!x||typeof x!=='object')return;if(Array.isArray(x)){for(const y of x)walk(y,out);return;}if(Object.values(x).some(v=>typeof v==='string'&&v.includes('q21-solution.svg')))out.push(x);for(const v of Object.values(x))walk(v,out)}
for(const p of ps){if(!fs.existsSync(p)){console.log('MISSING',p);continue;}let out=[];walk(JSON.parse(fs.readFileSync(p,'utf8')),out);console.log('FILE',p);for(const x of out)console.log(JSON.stringify(x));}
