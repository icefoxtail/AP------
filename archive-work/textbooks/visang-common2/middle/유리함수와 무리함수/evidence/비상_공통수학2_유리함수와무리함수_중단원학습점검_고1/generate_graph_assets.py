from pathlib import Path
from PIL import Image
import math, html
root=Path('archive-work/textbooks/visang-common2/middle/유리함수와 무리함수/assets/images/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1')
root.mkdir(parents=True, exist_ok=True)
# Keep the exact textbook graph as a problem dependency. Coordinates are in the full-page render.
page=Image.open('archive-work/textbooks/visang-common2/middle/유리함수와 무리함수/evidence/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1/problem-36.png')
page.crop((295,1240,475,1410)).save(root/'q08_source-graph.png')

def graph_svg(name, panels, title, width=920, height=390):
    gap=24; panelw=(width-gap*(len(panels)-1))/len(panels); top=44; bottom=42; pad_x=46
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img"><title>{html.escape(title)}</title>',
           '<rect width="100%" height="100%" fill="#fff"/>',
           '<style>text{font-family:Arial,"Noto Sans KR",sans-serif;fill:#222}.axis{stroke:#333;stroke-width:1.5}.grid{stroke:#ddd;stroke-width:1}.asymptote{stroke:#777;stroke-width:1.4;stroke-dasharray:7 6}.curve{fill:none;stroke:#6c3a91;stroke-width:3}.tick{font-size:13px}.label{font-size:17px;font-style:italic}.pt{fill:#6c3a91}</style>']
    for i,p in enumerate(panels):
        x0=i*(panelw+gap); plotx0=x0+pad_x; plotx1=x0+panelw-15; ploty0=top; ploty1=height-bottom
        xmin,xmax,ymin,ymax=p['range']; sx=lambda x:plotx0+(x-xmin)/(xmax-xmin)*(plotx1-plotx0); sy=lambda y:ploty1-(y-ymin)/(ymax-ymin)*(ploty1-ploty0)
        parts.append(f'<text x="{x0+panelw/2:.1f}" y="25" text-anchor="middle" font-size="18">{html.escape(p["caption"])}</text>')
        for xv in range(math.ceil(xmin),math.floor(xmax)+1):
            if abs(xv)>1e-9:
                parts.append(f'<line class="grid" x1="{sx(xv):.2f}" y1="{ploty0}" x2="{sx(xv):.2f}" y2="{ploty1}"/>')
            if xv%2==0 or xv in (-1,1): parts.append(f'<text class="tick" x="{sx(xv):.2f}" y="{sy(0)+19:.2f}" text-anchor="middle">{xv}</text>')
        for yv in range(math.ceil(ymin),math.floor(ymax)+1):
            if yv!=0: parts.append(f'<line class="grid" x1="{plotx0}" y1="{sy(yv):.2f}" x2="{plotx1}" y2="{sy(yv):.2f}"/>')
        if xmin<=0<=xmax: parts.append(f'<line class="axis" x1="{sx(0):.2f}" y1="{ploty0}" x2="{sx(0):.2f}" y2="{ploty1}"/><text class="label" x="{sx(0)+7:.1f}" y="{ploty0+17}">y</text>')
        if ymin<=0<=ymax: parts.append(f'<line class="axis" x1="{plotx0}" y1="{sy(0):.2f}" x2="{plotx1}" y2="{sy(0):.2f}"/><text class="label" x="{plotx1-2:.1f}" y="{sy(0)-7:.1f}">x</text>')
        if 'asym' in p:
            ax,ay=p['asym']; parts += [f'<line class="asymptote" x1="{sx(ax):.2f}" y1="{ploty0}" x2="{sx(ax):.2f}" y2="{ploty1}"/>',f'<line class="asymptote" x1="{plotx0}" y1="{sy(ay):.2f}" x2="{plotx1}" y2="{sy(ay):.2f}"/>']
        for interval in p.get('intervals',[(xmin,xmax)]):
            pts=[]
            for j in range(501):
                x=interval[0]+(interval[1]-interval[0])*j/500
                y=p['fn'](x)
                if ymin<y<ymax: pts.append(f'{sx(x):.2f},{sy(y):.2f}')
                elif pts:
                    parts.append(f'<polyline class="curve" points="{" ".join(pts)}"/>'); pts=[]
            if pts: parts.append(f'<polyline class="curve" points="{" ".join(pts)}"/>')
        for x,y in p.get('points',[]): parts.append(f'<circle class="pt" cx="{sx(x):.2f}" cy="{sy(y):.2f}" r="4"/>')
    parts.append('</svg>')
    (root/name).write_text('\n'.join(parts),encoding='utf-8')

graph_svg('q02_rational-graphs.svg',[
 {'caption':'(1)  y = 1/(x−1) + 2','range':(-3,5,-2,6),'asym':(1,2),'fn':lambda x:1/(x-1)+2,'intervals':[(-3,.83),(1.17,5)],'points':[(0,1),(2,3)]},
 {'caption':'(2)  y = −2 + 3/(x+1)','range':(-5,3,-7,3),'asym':(-1,-2),'fn':lambda x:-2+3/(x+1),'intervals':[(-5,-1.35),(-.65,3)],'points':[(0,1)]}], '유리함수 그래프와 점근선')
graph_svg('q04_radical-graphs.svg',[
 {'caption':'(1)  y = −√(x−1) + 2','range':(0,7,-2,4),'fn':lambda x:2-math.sqrt(x-1),'intervals':[(1,7)],'points':[(1,2),(5,0)]},
 {'caption':'(2)  y = √(4−2x) − 1','range':(-5,2,-1.5,4),'fn':lambda x:math.sqrt(4-2*x)-1,'intervals':[(-5,2)],'points':[(2,-1),(0,1)]}], '무리함수 그래프의 끝점과 범위')

# Compare the threshold line with the decreasing radical graph: m=1 meets at the
# endpoint (3,1), while m=2 stays above it throughout x>=3.
w,h=760,440; left,right,top,bottom=76,730,48,380
xmin,xmax,ymin,ymax=2,8,-2,7
sx=lambda x:left+(x-xmin)/(xmax-xmin)*(right-left)
sy=lambda y:bottom-(y-ymin)/(ymax-ymin)*(bottom-top)
parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 440" role="img"><title>Intersection threshold for m</title>',
 '<rect width="760" height="440" fill="#fff"/>','<style>text{font-family:Arial,"Noto Sans KR",sans-serif;fill:#222;font-size:15px}.axis{stroke:#333;stroke-width:1.6}.grid{stroke:#ddd}.curve{fill:none;stroke-width:3}.pt{fill:#222}</style>']
for x in range(2,9):
 parts.append(f'<line class="grid" x1="{sx(x):.1f}" y1="{top}" x2="{sx(x):.1f}" y2="{bottom}"/><text x="{sx(x):.1f}" y="{sy(0)+21:.1f}" text-anchor="middle">{x}</text>')
for y in range(-2,8):
 parts.append(f'<line class="grid" x1="{left}" y1="{sy(y):.1f}" x2="{right}" y2="{sy(y):.1f}"/><text x="{sx(3)-10:.1f}" y="{sy(y)+5:.1f}" text-anchor="end">{y}</text>')
parts += [f'<line class="axis" x1="{left}" y1="{sy(0):.1f}" x2="{right}" y2="{sy(0):.1f}"/>',f'<line class="axis" x1="{sx(0):.1f}" y1="{top}" x2="{sx(0):.1f}" y2="{bottom}"/>',f'<text x="{right-4}" y="{sy(0)-8:.1f}">x</text>',f'<text x="{sx(0)+8:.1f}" y="{top+12}">y</text>']
def poly(fn,a,b,color):
 pts=[]
 for j in range(501):
  x=a+(b-a)*j/500; y=fn(x)
  if ymin<=y<=ymax: pts.append(f'{sx(x):.2f},{sy(y):.2f}')
 return f'<polyline class="curve" stroke="{color}" points="{" ".join(pts)}"/>'
parts += [poly(lambda x:1-math.sqrt(x-3),3,8,'#6c3a91'),poly(lambda x:x-2,2,8,'#567ea9'),poly(lambda x:2*x-2,2,4.5,'#d54b4b'),
 f'<circle class="pt" cx="{sx(3):.2f}" cy="{sy(1):.2f}" r="5"/>',
 f'<text x="{sx(4.2):.1f}" y="{sy(1-math.sqrt(1.2))-12:.1f}" fill="#6c3a91">y = −√(x−3)+1</text>',
 f'<text x="{sx(6.1):.1f}" y="{sy(4.1)-10:.1f}" fill="#567ea9">m=1: y=x−2</text>',
 f'<text x="{sx(4.1):.1f}" y="{sy(6.2)-8:.1f}" fill="#d54b4b">m=2: y=2x−2</text>',
 f'<text x="{sx(3)+8:.1f}" y="{sy(1)+20:.1f}">(3,1)</text>','</svg>']
(root/'q12_intersection-threshold.svg').write_text('\n'.join(parts),encoding='utf-8')
