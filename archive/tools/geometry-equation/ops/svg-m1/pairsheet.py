# usage: python3 pairsheet.py out.png <exam-js-basename> run_dir [run_dir...] — each row: question image | solution figure (main's check against the source)
import sys,glob,os,re
from PIL import Image,ImageDraw
out,exam=sys.argv[1],sys.argv[2]; files=[]
for d in sys.argv[3:]:
    files+=glob.glob(d+'/q*/figure.png')
files.sort(key=lambda p:int(re.search(r'/q(\d+)/',p).group(1)))
W=360; rows=[]
for f in files:
    o=int(re.search(r'/q(\d+)/',f).group(1))
    base=f'/home/user/AP------/archive/assets/images/{exam}/'
    qs=[p for p in [base+f'q{o:02d}.png',base+f'q{o}.png',base+f'Q{o}.png',base+f'q{o:03d}_visual.png'] if os.path.exists(p)]
    if not qs:
        for sv in [base+f'q{o}.svg',base+f'Q{o}.svg',base+f'q{o:02d}.svg']:
            if os.path.exists(sv):
                tmp=f'/tmp/claude-0/qimg-{exam}-{o}.png'
                if not os.path.exists(tmp): os.system(f"node /home/user/AP------/.tmp/svg-m1/svg2png.cjs '{sv}' '{tmp}' 520 >/dev/null 2>&1")
                if os.path.exists(tmp): qs=[tmp]
                break
    cells=[]
    for p in ([qs[0]] if qs else [])+[f]:
        im=Image.open(p).convert('RGB'); im=im.resize((W,int(im.height*W/im.width))); cells.append(im)
    h=max(c.height for c in cells)+20; row=Image.new('RGB',(W*2,h),'white')
    for i,c in enumerate(cells): row.paste(c,(i*W if len(cells)==2 else W,20))
    ImageDraw.Draw(row).text((4,2),f'q{o}',fill='red'); rows.append(row)
H=sum(r.height for r in rows); s=Image.new('RGB',(W*2,H),'white'); y=0
for r in rows: s.paste(r,(0,y)); y+=r.height
s.save(out); print(out,len(rows))
