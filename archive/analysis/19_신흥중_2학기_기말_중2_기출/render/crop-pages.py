from PIL import Image
import os
base='.tmp/archive/archive2-m2-codex-20261006-03/19_신흥중_2학기_기말_중2_기출/render/attempt-05'
out='.tmp/archive/archive2-m2-codex-20261006-03/19_신흥중_2학기_기말_중2_기출/render/review-crops'
configs={'exam':([117,1258,2399,3539,4680,5821],1033),'sol':([127,1296,2439,3581,4724,5867,7009],1115),'ans':([127],1090)}
os.makedirs(out,exist_ok=True)
for mode,(tops,height) in configs.items():
 im=Image.open(f'{base}/{mode}/desktop/full.png').convert('RGB')
 for i,top in enumerate(tops,1):
  im.crop((300,max(0,top-15),1140,min(im.height,top+height))).save(f'{out}/{mode}-desktop-page-{i}.png')
for mode in ['exam','sol','ans']:
 im=Image.open(f'{base}/{mode}/mobile/full.png').convert('RGB')
 # default mobile-fit output is a scaled page; crop first and last visible page bands.
 h=530
 tops=[25] if mode=='ans' else ([25,1258,2399,3539,4680,5821] if mode=='exam' else [14,1155,2297,3439,5582,6725,7867])
 for i,top in enumerate(tops,1):
  if top<im.height: im.crop((0,top,min(im.width,390),min(im.height,top+h))).save(f'{out}/{mode}-mobile-page-{i}.png')
