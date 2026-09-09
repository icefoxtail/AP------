import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const work=path.join(repo,"archive/_generated/nightly-h1-2sem/20260908/work/24_yeoyang_2final");
const title="24_여양고_2학기_기말_고1_기출"; const file=path.join(work,"fresh-extract-final",`${title}.js`);
let text=await fs.readFile(file,"utf8"); text=text.replaceAll("assets/q020_visual.png",`assets/images/${title}/q20.png`); await fs.writeFile(file,text,"utf8");
const dir=path.join(work,"fresh-extract-final","assets","images",title); await fs.mkdir(dir,{recursive:true}); await fs.copyFile(path.join(work,"extraction","assets","q020_visual.png"),path.join(dir,"q20.png")); console.log(file);
