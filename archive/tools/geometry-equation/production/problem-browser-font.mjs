import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bytesSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {dependencyLock} from './dependencies.mjs';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
export async function observeProblemKoreanFont(page){
  const observation={status:'NOT_RUN',runtime:'chromium-cdp-platform-fonts',platformFonts:[],uiPlatformFonts:[],probe:null,uiText:null};
  const metadataPath='.tmp/svg-problem/browser-font.json',id='geometry-korean-platform-font-probe';let cdp;
  try{
    const metadata=JSON.parse(fs.readFileSync(path.join(root,metadataPath)));
    Object.assign(observation,{fontSha256:metadata.fontSha256,fontconfigRef:fileRef(root,metadataPath),family:metadata.family,koreanGlyphCoverage:metadata.glyphCoverage});
    if(metadata.status!=='FONTCONFIG_HASH_VERIFIED'||metadata.fontSha256!==dependencyLock.font.sha256||bytesSha(fs.readFileSync(metadata.matched))!==dependencyLock.font.sha256)throw Error('VERIFIED_BROWSER_FONT_SETUP_REQUIRED');
    // Platform-font data concerns painted glyphs. An offscreen node queried immediately after insertion
    // can have no painted font inventory. Paint this small probe, collect the raw metrics, then remove it
    // before any source screenshot; do not replace a missing or mismatched font with a guessed result.
    observation.probe=await page.evaluate(async({id,family,text})=>{
      const node=document.createElement('span');node.id=id;node.lang='ko';node.textContent=text;
      node.style.cssText='position:fixed;left:8px;top:60px;z-index:2147483647;font-size:20px;font-weight:400;line-height:1.4;white-space:nowrap;background:white;color:black;visibility:visible;pointer-events:none';
      node.style.fontFamily='"'+family+'"';document.body.appendChild(node);
      const loaded=await document.fonts.load('20px "'+family+'"',text);await document.fonts.ready;
      node.getBoundingClientRect();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const r=node.getBoundingClientRect(),s=getComputedStyle(node);
      return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},inViewport:r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,fontStatus:document.fonts.status,fontCheck:document.fonts.check('20px "'+family+'"',text),loadedFontFaces:loaded.length,paintFrames:2};
    },{id,family:metadata.family,text:metadata.koreanSample});
    cdp=await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root:document}=await cdp.send('DOM.getDocument'),{nodeId}=await cdp.send('DOM.querySelector',{nodeId:document.nodeId,selector:'#'+id});
    const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    observation.platformFonts=fonts;observation.probe.nodeId=nodeId;
    observation.uiText=await page.evaluate(()=>{
      const root=document.getElementById('print-area');if(!root)return null;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let text;
      while((text=walker.nextNode()))if(/[가-힣]/.test(text.nodeValue??'')){
        const parent=text.parentElement,r=parent?.getBoundingClientRect();
        if(r?.width>0&&r.height>0&&r.bottom>0&&r.y<innerHeight&&r.right>0&&r.x<innerWidth){
          parent.setAttribute('data-geometry-korean-observed','1');const s=getComputedStyle(parent);
          return {tag:parent.tagName,text:text.nodeValue.slice(0,100),rect:{x:r.x,y:r.y,width:r.width,height:r.height},fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,fontStatus:document.fonts.status};
        }
      }
      return null;
    });
    if(observation.uiText){
      const {nodeId:uiNode}=await cdp.send('DOM.querySelector',{nodeId:document.nodeId,selector:'[data-geometry-korean-observed="1"]'});
      const {fonts:uiPlatformFonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:uiNode});observation.uiPlatformFonts=uiPlatformFonts;observation.uiText.nodeId=uiNode;
    }
    if(!observation.platformFonts.some(f=>f.familyName===metadata.family&&f.glyphCount>0))throw Error('ACTUAL_KOREAN_PLATFORM_FONT_REQUIRED');
    if(!observation.uiText)throw Error('ACTUAL_KOREAN_UI_TEXT_REQUIRED');
    if(!observation.uiPlatformFonts.some(f=>f.familyName===metadata.family&&f.glyphCount>0))throw Error('ACTUAL_KOREAN_UI_PLATFORM_FONT_REQUIRED');
    observation.status='PASS';
  }catch(error){observation.status='FAIL';observation.error={code:error.message,message:String(error.stack??error)};}
  finally{
    try{await cdp?.detach();await page.evaluate(id=>{document.getElementById(id)?.remove();document.querySelector('[data-geometry-korean-observed="1"]')?.removeAttribute('data-geometry-korean-observed');},id);}
    catch(error){observation.status='FAIL';observation.cleanupError=String(error);}
  }
  return observation;
}
