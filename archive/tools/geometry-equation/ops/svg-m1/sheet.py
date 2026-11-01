# usage: python3 sheet.py out.png run_dir [run_dir...]  — contact sheet of <run>/q*/figure.png with ord labels (main's visual check)
import sys,glob,os,re
from PIL import Image,ImageDraw
out=sys.argv[1]; files=[]
for d in sys.argv[2:]:
    files+=sorted(glob.glob(d+'/q*/figure.png'),key=lambda p:int(re.search(r'/q(\d+)/',p).group(1)))
W=380; cells=[]
for f in files:
    im=Image.open(f).convert('RGB'); r=W/im.width; im=im.resize((W,int(im.height*r)))
    c=Image.new('RGB',(W,im.height+22),'white'); c.paste(im,(0,22)); ImageDraw.Draw(c).text((4,4),re.search(r'/(q\d+)/',f).group(1),fill='red'); cells.append(c)
cols=3; rows=[cells[i:i+cols] for i in range(0,len(cells),cols)]
H=sum(max(c.height for c in r) for r in rows); sheet=Image.new('RGB',(W*cols,H),'white'); y=0
for r in rows:
    for i,c in enumerate(r): sheet.paste(c,(i*W,y))
    y+=max(c.height for c in r)
sheet.save(out); print(out,len(cells))
