from pathlib import Path
import json, sys
sys.path.insert(0,str(Path.cwd()))
from alive.engine.visual_renderer import render_visual_spec
plans=Path(__file__).resolve().parent
out=Path(sys.argv[1])
for n in (304,333,334,470,471,472,473,474):
 folder=plans/str(n);spec=json.loads((folder/'spec.json').read_text(encoding='utf-8'));svg=render_visual_spec(spec)
 if n==304:
  width,height=spec['width'],spec['height'];xr,yr=spec['xRange'],spec['yRange'];curve=[(p['x'],p['y']) for p in spec['curves'][0]['points']]
  shade=[(0,0),(8,0),(8,3/8)]+list(reversed(curve))+[(0,8)]
  tx=lambda x:32+(x-xr[0])*(width-64)/(xr[1]-xr[0]);ty=lambda y:height-32-(y-yr[0])*(height-64)/(yr[1]-yr[0])
  points=' '.join(f'{tx(x):.3f},{ty(y):.3f}' for x,y in shade);at=svg.find('<line x1=');assert at>=0;svg=svg[:at]+f'<polygon points="{points}" fill="#e2e6eb" stroke="none"/>'+svg[at:]
 target=out/str(n);target.mkdir(parents=True,exist_ok=True);(target/'base.svg').write_text(svg,encoding='utf-8')
