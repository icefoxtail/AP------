# usage: sheet.py <pub key> <out prefix>
import sys,glob
from PIL import Image,ImageDraw
k,S=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(f'.tmp/work/pub/{k}/q*/figure.png'))
W,H=640,420
for part in range(0,len(fs),9):
    sh=Image.new('RGB',(W*3,H*3),'white');d=ImageDraw.Draw(sh)
    for i,f in enumerate(fs[part:part+9]):
        im=Image.open(f).convert('RGB');im.thumbnail((W-8,H-24))
        x,y=(i%3)*W,(i//3)*H;sh.paste(im,(x+4,y+20));d.text((x+6,y+4),f.split('pub/')[1][:28],fill='red')
    sh.save(f'{S}_{part//9}.png')
print(len(fs))
