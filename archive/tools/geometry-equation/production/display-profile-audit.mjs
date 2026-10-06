import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';

/** Capture one final SVG independently at each Archive-measured CSS image size. */
export async function captureDisplayProfiles({svg,profiles}){
  if(typeof svg!=='string'||!svg.includes('<svg')||!Array.isArray(profiles)||!profiles.length)throw Error('DISPLAY_PROFILE_CAPTURE_INPUT_INVALID');
  const browser=await launchBrowser(),browserVersion=browser.version(),rows=[];
  try{
    for(const profile of profiles){
      const display=profile?.imageRect;
      if(!display||![display.width,display.height].every(value=>Number.isFinite(value)&&value>0))throw Error('DISPLAY_PROFILE_SIZE_INVALID:'+profile?.sizeClass);
      const page=await browser.newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
      try{
        const capture=await captureAtDisplaySize(page,svg,{width:display.width,height:display.height});
        const layout=analyzeRenderedLayout(capture);
        const screenshot=Buffer.from(await page.screenshot({type:'png'}));
        rows.push({
          sizeClass:profile.sizeClass,
          status:layout.status,
          synthetic:false,
          runtime:capture.runtime,
          browserVersion,
          screenshot,
          screenshotViewport:page.viewportSize(),
          imageRect:capture.svg,
          capture,
          layout
        });
      }finally{await page.close();}
    }
  }finally{await browser.close();}
  return {status:rows.every(row=>row.status==='PASS')?'PASS':'FAIL',synthetic:false,runtime:'playwright-chromium',browserVersion,rows};
}
