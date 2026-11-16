#!/usr/bin/env python3
"""Exact, renamed Noto subset; no source or review data is processed."""
from pathlib import Path
import argparse,hashlib,json
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
parser=argparse.ArgumentParser(description='Reproduce the exact 52-glyph AP Enclosed Latin font subset')
parser.add_argument('--source-font',type=Path,required=True)
parser.add_argument('--source-license',type=Path,required=True)
parser.add_argument('--output-dir',type=Path,required=True)
args=parser.parse_args()
src=args.source_font;lic=args.source_license;out=args.output_dir
out.mkdir(parents=True,exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
stable=lambda x:json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False)
assert sha(src.read_bytes())=='b76b0433203017ca80401b2ee0dd69350349871c4b19d504c34dbdd80541690a','source font hash differs'
assert sha(lic.read_bytes())=='849f4ea9c214fa4ac3593b770c699f387534b11ce671264c1b10d85bdcb5997b','source licence hash differs'
assert __import__('fontTools').__version__=='4.57.0','use recorded FontTools version for exact reproduction'
old=TTFont(src,fontNumber=1,recalcTimestamp=False)
font=TTFont(src,fontNumber=1,recalcTimestamp=False)
points=list(range(0x24B6,0x24EA))
opt=subset.Options()
opt.layout_features=[]
opt.name_IDs=['*']
opt.name_languages=['*']
opt.notdef_outline=False
opt.recalc_timestamp=False
sub=subset.Subsetter(options=opt)
sub.populate(unicodes=points)
sub.subset(font)
renames={1:'AP Enclosed Latin',2:'Regular',3:'AP Enclosed Latin Regular; Noto subset U24B6-U24E9',4:'AP Enclosed Latin Regular',6:'APEnclosedLatin-Regular',16:'AP Enclosed Latin',17:'Regular'}
for rec in font['name'].names:
 if rec.nameID in renames:rec.string=renames[rec.nameID].encode(rec.getEncoding())
if 'CFF ' in font:
 cff=font['CFF '].cff
 cff.fontNames=['APEnclosedLatin-Regular']
 for top in cff.topDictIndex:
  top.FamilyName='AP Enclosed Latin';top.FullName='AP Enclosed Latin Regular'
font.flavor='woff2'
target=out/'APEnclosedLatin-Regular.woff2'
font.save(target)
new=TTFont(target,recalcTimestamp=False)
assert set(new.getBestCmap())==set(points)
assert len(new.getGlyphOrder())==53
assert new['head'].unitsPerEm==old['head'].unitsPerEm
oldgs=old.getGlyphSet();newgs=new.getGlyphSet();rows=[]
for cp in points:
 a=old.getBestCmap()[cp];b=new.getBestCmap()[cp]
 pa=DecomposingRecordingPen(oldgs);pb=DecomposingRecordingPen(newgs)
 oldgs[a].draw(pa);newgs[b].draw(pb)
 assert pa.value==pb.value,(hex(cp),'outline')
 assert old['hmtx'][a]==new['hmtx'][b],(hex(cp),'advance')
 assert new['hmtx'][b][0]>0 and len(pb.value)>0
 rows.append({'codepoint':f'U+{cp:04X}','glyphId':new.getGlyphID(b),'advanceWidth':new['hmtx'][b][0],'leftSideBearing':new['hmtx'][b][1],'outlineSha256':sha(stable(pa.value).encode())})
s=lic.read_text();start=s.index('License: SIL-1.1\n',s.index('License: GPL-3+'))
end=s.index('\nLicense: GPL-3+',start)
terms=s[start:end].splitlines()[1:]
terms='\n'.join('' if l==' .' else l[1:] if l.startswith(' ') else l for l in terms).strip()+'\n'
license_text='AP Enclosed Latin is a renamed subset of Noto Sans CJK KR Regular.\n\n'+old['name'].getDebugName(0)+'\nSource distribution also credits 2010-2012, Google Corporation.\n\n'+terms
(out/'LICENSE.txt').write_text(license_text)
proof={'schemaVersion':'archive-enclosed-latin-font-subset-v1','fontFamily':'AP Enclosed Latin','postScriptName':'APEnclosedLatin-Regular','unicodeRange':'U+24B6-24E9','unicodeCount':52,'glyphCount':53,'unitsPerEm':new['head'].unitsPerEm,'source':{'fileName':src.name,'faceIndex':1,'family':old['name'].getDebugName(1),'sha256':sha(src.read_bytes()),'bytes':src.stat().st_size,'version':old['name'].getDebugName(5)},'generator':{'fontToolsVersion':__import__('fontTools').__version__,'layoutFeatures':[],'recalcTimestamp':False,'outlineAndAdvancePreserved':True,'fallbackCoverageOutsideRange':False},'output':{'path':'archive/vendor/ap-enclosed-latin/APEnclosedLatin-Regular.woff2','sha256':sha(target.read_bytes()),'bytes':target.stat().st_size},'license':{'path':'archive/vendor/ap-enclosed-latin/LICENSE.txt','sha256':sha((out/'LICENSE.txt').read_bytes()),'sourceDistributionSha256':sha(lic.read_bytes())},'glyphs':rows}
(out/'subset-manifest.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:proof[k] for k in ['fontFamily','unicodeCount','glyphCount','output','license']}))
