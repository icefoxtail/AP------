import fs from 'node:fs';import crypto from 'node:crypto';
const path='archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q14-solution.svg';
const beforeBytes=fs.readFileSync(path);let text=beforeBytes.toString('utf8');
const before=crypto.createHash('sha256').update(beforeBytes).digest('hex');
const replacements=[{from:'&amp;lt;',to:'&lt;',expected:4}];
const changes=[];for(const r of replacements){const count=text.split(r.from).length-1;if(count!==r.expected)throw new Error(`SVG_ENTITY_COUNT_${r.from}_${count}`);text=text.split(r.from).join(r.to);changes.push({entity:r.from,replacedWith:r.to,count});}
fs.writeFileSync(path,text,'utf8');const after=crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
fs.writeFileSync(process.argv[2],JSON.stringify({schemaVersion:'JS_ARCHIVE_R1_ASSET_REPAIR_V1',examUid:'24_매산여고_1학기_중간_고2_수학I',qid:14,ref:'assets/images/24_매산여고_1학기_중간_고2_수학I/q14-solution.svg',reason:'Double-escaped comparison operators displayed literal &lt;/&gt; strings in SVG title/labels.',beforeSha256:before,afterSha256:after,changes},null,2)+String.fromCharCode(10));console.log(JSON.stringify({beforeSha256:before,afterSha256:after,changes},null,2));


