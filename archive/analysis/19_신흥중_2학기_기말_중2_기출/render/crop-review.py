from PIL import Image
import numpy as np, os
base='.tmp/archive/archive2-m2-codex-20261006-03/19_신흥중_2학기_기말_중2_기출/render/attempt-05'
out='.tmp/archive/archive2-m2-codex-20261006-03/19_신흥중_2학기_기말_중2_기출/render/review-crops'
os.makedirs(out,exist_ok=True)
for mode in ['exam','sol','ans']:
 for view in ['desktop','mobile']:
  p=f'{base}/{mode}/{view}/full.png'
  im=Image.open(p).convert('RGB'); a=np.array(im); h,w=a.shape[:2]
  x0,x1=(300,1140) if view=='desktop' else (0,w)
  thresh=600 if view=='desktop' else max(220,int(w*.75))
  counts=(a[:,x0:x1,:].mean(2)<80).sum(1)
  inds=np.where(counts>thresh)[0].tolist(); groups=[]
  for y in inds:
   if not groups or y-groups[-1][-1]>4: groups.append([y])
   else: groups[-1].append(y)
  rows=[int(round(sum(g)/len(g))) for g in groups if len(g)>=1]
  # Select widely separated page boundary rows; keep top and bottom lines, ignore dense content.
  bounds=[]
  for y in rows:
   if not bounds or y-bounds[-1]>300: bounds.append(y)
   elif counts[y]>counts[bounds[-1]]: bounds[-1]=y
  # content pagination gives alternating page top/bottom rules, pair them in order
  print(mode,view,(w,h),'rows',rows[:30],'bounds',bounds)
  for i in range(0,len(bounds)-1,2):
   top=max(0,bounds[i]-6); bottom=min(h,bounds[i+1]+8)
   if bottom-top<200: continue
   im.crop((x0,top,x1,bottom)).save(f'{out}/{mode}-{view}-page-{i//2+1}.png')
