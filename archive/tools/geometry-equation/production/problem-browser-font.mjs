import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bytesSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {dependencyLock} from './dependencies.mjs';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
export async function observeProblemKoreanFont(page){
  const metadataPath='.tmp/svg-problem/browser-font.json',metadata=JSON.parse(fs.readFileSync(path.join(root,metadataPath)));
  if(metadata.status!=='FONTCONFIG_HASH_VERIFIED'||metadata.fontSha256!==dependencyLock.font.sha256||bytesSha(fs.readFileSync(metadata.matched))!==dependencyLock.font.sha256)throw Error('VERIFIED_BROWSER_FONT_SETUP_REQUIRED');
  const id='geometry-korean-platform-font-probe';
  await page.evaluate(({id,family,text})=>{const node=document.createElement('span');node.id=id;node.lang='ko';node.textContent=text;node.style.cssText='position:fixed;left:-10000px;top:0;font-size:20px';node.style.fontFamily='"'+family+'"';document.body.appendChild(node);},{id,family:metadata.family,text:metadata.koreanSample});
  const cdp=await page.context().newCDPSession(page);
  try{
    await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root:document}=await cdp.send('DOM.getDocument'),{nodeId}=await cdp.send('DOM.querySelector',{nodeId:document.nodeId,selector:'#'+id});
    const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    if(!fonts.some(f=>f.familyName===metadata.family&&f.glyphCount>0))throw Error('ACTUAL_KOREAN_PLATFORM_FONT_REQUIRED');
    const found=await page.evaluate(()=>{
      const root=document.getElementById('print-area');if(!root)return false;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let text;
      while((text=walker.nextNode()))if(/[가-힣]/.test(text.nodeValue??'')){
        const parent=text.parentElement;if(parent?.getBoundingClientRect().width>0&&parent.getBoundingClientRect().height>0){parent.setAttribute('data-geometry-korean-observed','1');return true;}
      }
      return false;
    });
    if(!found)throw Error('ACTUAL_KOREAN_UI_TEXT_REQUIRED');
    const {nodeId:uiNode}=await cdp.send('DOM.querySelector',{nodeId:document.nodeId,selector:'[data-geometry-korean-observed="1"]'});
    const {fonts:uiPlatformFonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:uiNode});
    if(!uiPlatformFonts.some(f=>f.familyName===metadata.family&&f.glyphCount>0))throw Error('ACTUAL_KOREAN_UI_PLATFORM_FONT_REQUIRED');
    return {status:'PASS',runtime:'chromium-cdp-platform-fonts',fontSha256:metadata.fontSha256,fontconfigRef:fileRef(root,metadataPath),family:metadata.family,platformFonts:fonts,uiPlatformFonts,koreanGlyphCoverage:metadata.glyphCoverage};
  }finally{await cdp.detach();await page.evaluate(id=>{document.getElementById(id)?.remove();document.querySelector('[data-geometry-korean-observed="1"]')?.removeAttribute('data-geometry-korean-observed');},id);}
}
