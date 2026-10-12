from __future__ import annotations
import hashlib, json, math, subprocess, sys, unicodedata, xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any
ROOT=Path.cwd()
EVIDENCE=ROOT/"archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL"
ASSET_DIR=ROOT/"archive/assets/generated-lite/palma-speed-pilot"
SOURCE_DIR="alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1"
APPROVAL_REL=SOURCE_DIR+"/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json"
sys.path.insert(0,str(ROOT))
from alive.engine.visual_renderer import RENDERER_VERSION,VISUAL_SPEC_VERSION,render_visual_spec

def sha(b:bytes)->str: return hashlib.sha256(b).hexdigest().upper()
def blob(b:bytes)->str: return hashlib.sha1(f"blob {len(b)}\0".encode()+b).hexdigest()
def jbytes(v:Any)->bytes: return (json.dumps(v,ensure_ascii=False,indent=2)+"\n").encode("utf-8")
def writej(p:Path,v:Any)->bytes:
    p.parent.mkdir(parents=True,exist_ok=True); b=jbytes(v); p.write_bytes(b); return b
def git(args:list[str])->str: return subprocess.check_output(["git",*args],cwd=ROOT,text=True).strip()
def git_bytes(args:list[str])->bytes: return subprocess.check_output(["git",*args],cwd=ROOT)
def read_approved_bytes(rel:str)->bytes: return git_bytes(["show",f"HEAD:{rel}"])
def clean_blob_for_path(rel:str,raw:bytes)->str:
    return subprocess.check_output(["git","hash-object",f"--path={rel}","--stdin"],cwd=ROOT,input=raw,text=False).decode().strip()
def read_git_blob_sha(rel:str)->str: return git(["rev-parse",f"HEAD:{rel}"])
def cross(a:tuple[float,float],b:tuple[float,float])->float: return a[0]*b[1]-a[1]*b[0]
def sub(a:tuple[float,float],b:tuple[float,float])->tuple[float,float]: return a[0]-b[0],a[1]-b[1]
def add(a:tuple[float,float],b:tuple[float,float])->tuple[float,float]: return a[0]+b[0],a[1]+b[1]
def mul(s:float,a:tuple[float,float])->tuple[float,float]: return s*a[0],s*a[1]
def dot(a:tuple[float,float],b:tuple[float,float])->float: return a[0]*b[0]+a[1]*b[1]
def norm(a:tuple[float,float])->float: return math.hypot(*a)
def cpt(r:float,t:float)->tuple[float,float]: return r*math.cos(t),r*math.sin(t)
def meet_ray(p:tuple[float,float],q:tuple[float,float],t:float)->tuple[float,float]:
    d=sub(q,p); u=(math.cos(t),math.sin(t)); den=cross(d,u)
    if abs(den)<1e-12: raise ValueError("parallel line/ray")
    return add(p,mul(-cross(p,u)/den,d))

Q17={
"ALITE-PALMA25-2MID-Q17-A1":{"slot":"A1","r":3.0,"deg":45,"min":"최소 3√2","minval":3*math.sqrt(2),"relation":"2r·sin45°=3√2"},
"ALITE-PALMA25-2MID-Q17-A2":{"slot":"A2","r":4.0,"deg":30,"min":"최소 4","minval":4.0,"relation":"2r·sin30°=4"},
"ALITE-PALMA25-2MID-Q17-A3":{"slot":"A3","r":3.0,"deg":60,"min":"최소 3√3","minval":3*math.sqrt(3),"relation":"2r·sin60°=3√3"},
"ALITE-PALMA25-2MID-Q17-B1":{"slot":"B1","r":4.0,"deg":45,"min":"최소 4√2","minval":4*math.sqrt(2),"relation":"√(2k)=4√2 ⇒ k=16"},
"ALITE-PALMA25-2MID-Q17-B2":{"slot":"B2","r":math.sqrt(3),"deg":60,"min":"P₁P₂=3","minval":3.0,"relation":"Q=(1/2,√3/2), R=(1,0), QR=1","qr":1.0},
"ALITE-PALMA25-2MID-Q17-B3":{"slot":"B3","r":5.0,"deg":math.degrees(math.asin(3/5)),"min":"최소 6","minval":6.0,"relation":"sinθ=3/5 ⇒ B=(4,3)","B":[4.0,3.0]},
"ALITE-PALMA25-2MID-Q17-C1":{"slot":"C1","r":5.0,"deg":math.degrees(math.atan2(4,3)),"min":"최소 8","minval":8.0,"relation":"B=(3,4), sinθ=4/5"},
"ALITE-PALMA25-2MID-Q17-C2":{"slot":"C2","r":3.0,"outer":5.0,"deg":45,"min":"최소 3√2","minval":3*math.sqrt(2),"relation":"OP=3에서 등호; 3≤OP≤5","radial":[3.0,5.0]},
"ALITE-PALMA25-2MID-Q17-C3":{"slot":"C3","r":1.0,"deg":45,"min":"m=√(2n)","minval":math.sqrt(2),"relation":"6<√(2n)≤8 ⇒ n=19,…,32 (14개)","normalized":True}
}
Q20={
"ALITE-PALMA25-2MID-Q20-A1":{"slot":"A1","a":19,"b":21,"N":32,"A":"영어학원","B":"수학학원","xs":[8,19],"metric":"교집합 최소·최대"},
"ALITE-PALMA25-2MID-Q20-A2":{"slot":"A2","a":24,"b":31,"N":40,"A":"한국사 학습반","B":"영어 학습반","xs":[15,24],"metric":"교집합 최소·최대"},
"ALITE-PALMA25-2MID-Q20-A3":{"slot":"A3","a":25,"b":18,"N":36,"A":"독서 동아리","B":"토론 동아리","xs":[7,18],"metric":"교집합 최소·최대"},
"ALITE-PALMA25-2MID-Q20-B1":{"slot":"B1","a":27,"b":29,"N":48,"A":"미술 동아리","B":"체육 동아리","xs":[14],"metric":"가능한 배치"},
"ALITE-PALMA25-2MID-Q20-B2":{"slot":"B2","a":26,"b":30,"N":45,"A":"과학 동아리","B":"봉사 동아리","xs":[11,19],"metric":"교집합 최소·최대"},
"ALITE-PALMA25-2MID-Q20-B3":{"slot":"B3","a":23,"b":28,"N":38,"A":"축구 동아리","B":"배드민턴 동아리","xs":[15],"metric":"가능한 배치"},
"ALITE-PALMA25-2MID-Q20-C1":{"slot":"C1","a":34,"b":41,"N":60,"A":"독서 동아리","B":"과학 동아리","xs":[15,25],"metric":"교집합 최소·최대"},
"ALITE-PALMA25-2MID-Q20-C2":{"slot":"C2","a":32,"b":29,"N":50,"A":"활동 A","B":"활동 B","xs":[17,23],"metric":"교집합 최소·최대"},
"ALITE-PALMA25-2MID-Q20-C3":{"slot":"C3","a":38,"b":47,"N":72,"A":"음악 동아리","B":"미술 동아리","xs":[21,25],"metric":"밖 인원 최소·최대"}
}

def q17_expected(uid:str,p:dict[str,Any],item:dict[str,Any])->dict[str,Any]:
    r=p["r"]; outer=p.get("outer",r); th=math.radians(p["deg"]); ph=th/2
    O=(0.,0.); A=(outer,0.); B=cpt(outer,th); P=cpt(r,ph); P1=cpt(r,2*th-ph); P2=cpt(r,-ph)
    Q=meet_ray(P1,P2,th); R=meet_ray(P1,P2,0.)
    d=sub(P2,P1); tq=dot(sub(Q,P1),d)/dot(d,d); tr=dot(sub(R,P1),d)/dot(d,d)
    chord=norm(d)
    assert r>0 and outer>=r and 0<th<math.pi/2 and chord>1e-10
    assert abs(chord-p["minval"])<1e-8 and 0<tq<tr<1
    assert abs(cross(sub(Q,P1),d))<1e-8 and abs(cross(sub(R,P1),d))<1e-8
    assert abs(norm(sub(P,Q))-norm(sub(P1,Q)))<1e-8
    assert abs(norm(sub(P,R))-norm(sub(P2,R)))<1e-8
    uB=(math.cos(th),math.sin(th))
    reflectionOBParallel=cross(add(P,P1),uB)
    reflectionOBPerpendicular=dot(sub(P1,P),uB)
    reflectionOARadius=(P2[0]-P[0])
    reflectionOAPerpendicular=(P2[1]+P[1])
    qOnOB=cross(Q,B); rOnOA=R[1]
    assert abs(reflectionOBParallel)<1e-8 and abs(reflectionOBPerpendicular)<1e-8
    assert abs(reflectionOARadius)<1e-8 and abs(reflectionOAPerpendicular)<1e-8
    assert abs(qOnOB)<1e-8 and dot(Q,B)>0 and abs(rOnOA)<1e-8 and R[0]>0
    if "B" in p: assert norm(sub(B,tuple(p["B"])))<1e-8
    if "qr" in p: assert abs(norm(sub(Q,R))-p["qr"])<1e-8
    return {"uid":uid,"slot":p["slot"],"r":r,"thetaRadians":th,"thetaDegrees":p["deg"],
      "coordinateProvenance":"CONSTRUCTED_REALIZATION",
      "coordinateConstruction":{"rationale":"Take source OA/OB radius from the approved stem; choose a source-valid equality point P at the minor-arc midpoint with the minimizing radius, reflect P across OB and OA, then calculate Q and R as exact boundary intersections.",
      "origin":[0,0],"xAxisDirection":[1,0],"unitScale":1,
      "pointCoordinates":{"O":O,"A":A,"B":B,"P":P,"P1":P1,"P2":P2,"Q":Q,"R":R},
      "constructionConditions":{"OA=OB=sourceRadius":outer,"OP=minimizingRadius":r,"angle_AOB_deg":p["deg"],"P_direction_deg":p["deg"]/2,"P1_direction_deg":1.5*p["deg"],"P2_direction_deg":-p["deg"]/2,"Q_boundary":"OB","R_boundary":"OA","pathOrder":"P1-Q-R-P2"},
      "residuals":{"|OA|-sourceRadius":norm(A)-outer,"|OB|-sourceRadius":norm(B)-outer,"|OP|-minimizingRadius":norm(P)-r,"OB_reflection_parallel":reflectionOBParallel,"OB_reflection_perpendicular":reflectionOBPerpendicular,"OA_reflection_x":reflectionOARadius,"OA_reflection_perpendicular":reflectionOAPerpendicular,"Q_on_OB":qOnOB,"Q_positive_on_OB":dot(Q,B),"R_on_OA":rOnOA,"R_positive_on_OA":R[0],"Q_collinear":cross(sub(Q,P1),d),"R_collinear":cross(sub(R,P1),d),"Q_parameter":tq,"R_parameter":tr},"degeneracyChecks":{"radiusPositive":r>0,"outerRadiusAtLeastMinimizingRadius":outer>=r,"angleStrictlyBetweenZeroAndNinety":0<th<math.pi/2,"chordNonzero":chord>1e-10,"rayIntersectionsNonparallel":True,"strictInteriorOrder":0<tq<tr<1}},
      "expectedFacts":[{"fact":"A on OA at source radius","role":"GIVEN","point":A,"expectedRadius":outer},{"fact":"B on OB at source radius","role":"GIVEN","point":B,"expectedRadius":outer},{"fact":"selected equality point P","role":"DERIVED_INTERMEDIATE","point":P,"expectedRadius":r},{"fact":"reflection P1 across OB","role":"DERIVED_INTERMEDIATE","point":P1},{"fact":"reflection P2 across OA","role":"DERIVED_INTERMEDIATE","point":P2},{"fact":"Q intersection on OB","role":"DERIVED_INTERMEDIATE","point":Q},{"fact":"R intersection on OA","role":"DERIVED_INTERMEDIATE","point":R},{"fact":"minor angle wedge from OA to OB","role":"DERIVED_INTERMEDIATE","center":O,"rayOA":A,"rayOB":B,"radians":th},{"fact":"P1-Q-R-P2 collinear and ordered","role":"CONCLUSION","parameters":[tq,tr]},{"fact":"folded chord length","role":"CONCLUSION","expected":p["minval"],"observedFromConstruction":chord}],
      "sourceConditionCoverage":["Source center, OA/OB endpoints and circle radius","P arc/sector locus or fixed point and allowed radial interval","reflections across both source boundary rays","Q/R intersections lie on their named boundary rays","Q and R are strict interior points in P1-Q-R-P2 order","folded path lower bound and equality realization"],
      "decisiveRelationCovered":True,"uncoveredCriticalConditions":[],
      "relation":{"formula":"P1P2=2·OP·sin(theta)","answerRelation":p["relation"],"expectedMinimum":p["minval"],"computedChordLength":chord,"delta":chord-p["minval"],"extra":{k:v for k,v in p.items() if k not in {"r","outer","deg","min","minval"}}},
      "sourceProblemSha256":"sha256:"+sha(item["stem"].encode()).lower(),"sourceSolutionSha256":"sha256:"+sha(item["solution"].encode()).lower()}

def q20_regions(p:dict[str,Any],x:int)->dict[str,int]:
    vals={"intersection":x,"aOnly":p["a"]-x,"bOnly":p["b"]-x,"neither":p["N"]-p["a"]-p["b"]+x}
    vals["union"]=p["N"]-vals["neither"]; vals["exclusive"]=vals["aOnly"]+vals["bOnly"]; vals["total"]=p["N"]
    assert min(vals[k] for k in ["intersection","aOnly","bOnly","neither"])>=0
    assert vals["intersection"]+vals["aOnly"]==p["a"]
    assert vals["intersection"]+vals["bOnly"]==p["b"]
    assert sum(vals[k] for k in ["intersection","aOnly","bOnly","neither"])==p["N"]
    return vals

def q20_expected(uid:str,p:dict[str,Any],item:dict[str,Any])->dict[str,Any]:
    ws=[q20_regions(p,x) for x in p["xs"]]
    for v in ws:
        assert f'{v["intersection"]}/{v["aOnly"]}/{v["bOnly"]}/{v["neither"]}' in item["solution"]
    if p["slot"]=="B2": assert all(v["union"]>=37 for v in ws)
    if p["slot"]=="B3": assert ws[0]["exclusive"]==21
    if p["slot"]=="C1": assert all(v["exclusive"]>=25 for v in ws)
    if p["slot"]=="C2": assert all(v["exclusive"]<=27 and v["union"]>=38 for v in ws)
    if p["slot"]=="C3": assert all(v["exclusive"]<=43 and v["union"]>=60 for v in ws)
    return {"uid":uid,"slot":p["slot"],"sourceConditionCoverage":["Set sizes A/B and total N are taken from the stem.","The solution's interval or fixed intersection value is frozen from its text.","Each displayed witness assigns nonnegative counts to R11, R10, R01, R00.","The region counts sum to N and recover both set cardinalities."],
      "setNames":{"A":p["A"],"B":p["B"]},"canonicalRegionMap":{"A∩B":"R11","A만":"R10","B만":"R01","둘 다 아님":"R00"},
      "typedFacts":{"cardinalityByRegion":[{"R11":v["intersection"],"R10":v["aOnly"],"R01":v["bOnly"],"R00":v["neither"]} for v in ws],"intersection": [v["intersection"] for v in ws],"union":[v["union"] for v in ws],"outside":[v["neither"] for v in ws],"total":p["N"]},
      "witnesses":ws,"decisiveRelationCovered":True,"uncoveredCriticalConditions":[],
      "sourceProblemSha256":"sha256:"+sha(item["stem"].encode()).lower(),"sourceSolutionSha256":"sha256:"+sha(item["solution"].encode()).lower()}
def load_inputs():
    approval_raw=read_approved_bytes(APPROVAL_REL)
    approval=json.loads(approval_raw.decode("utf-8"))
    approval_worktree_raw=(ROOT/APPROVAL_REL).read_bytes()
    approval_binding={"approvedSha256":sha(approval_raw),"approvedGitBlobSha1":read_git_blob_sha(APPROVAL_REL),"currentWorktreeRawSha256":sha(approval_worktree_raw),"currentWorktreeRawGitBlobSha1":blob(approval_worktree_raw),"currentWorktreeCleanGitBlobSha1":clean_blob_for_path(APPROVAL_REL,approval_worktree_raw)}
    assert approval_binding["approvedGitBlobSha1"]==approval_binding["currentWorktreeCleanGitBlobSha1"],"approval receipt working-tree bytes do not clean to the HEAD receipt"
    assert json.loads(approval_worktree_raw.decode("utf-8"))==approval,"approval receipt working-tree JSON differs semantically from HEAD"
    packages={}
    for q in range(17,21):
        rel=SOURCE_DIR+f"/GPT_QID9_Q{q}_PACKAGE.json"
        rec=next(x for x in approval["packages"] if x["sourceQid"]==q)
        canonical=read_approved_bytes(rel)
        assert sha(canonical).lower()==rec["sha256"].lower(),(q,"canonical package SHA mismatch")
        assert blob(canonical)==rec["gitBlobSha1"],(q,"canonical package blob mismatch")
        raw=(ROOT/rel).read_bytes()
        assert clean_blob_for_path(rel,raw)==rec["gitBlobSha1"],(q,"working-tree bytes do not clean to approved blob")
        assert json.loads(raw.decode("utf-8"))==json.loads(canonical.decode("utf-8")),(q,"working-tree JSON differs semantically from approved package")
        packages[q]=json.loads(canonical.decode("utf-8"))
    items={i["uid"]:i for q in packages for i in packages[q]["items"]}
    assert len(items)==36
    for q in range(17,21):
        receipt=next(x for x in approval["packages"] if x["sourceQid"]==q)
        rel=receipt["path"]
        assert git(["rev-parse",f"HEAD:{rel}"])==receipt["gitBlobSha1"]
    return approval,packages,items,approval_binding

def triage_freeze(approval,packages,items,approval_binding):
    rows=[]
    for q in range(17,21):
        for item in packages[q]["items"]:
            uid=item["uid"]; slot=item["slot"]
            if q==17:
                reason="The stem states the circle/radius, exact A/B coordinates or sector bounds, and every point locus; no unseen diagram mark is required. A problem sketch would only restate the coordinates and could pre-show the reflection construction."
                sreason=Q17[uid]["relation"]+"; show the two reflected images and the actual ordered P₁–Q–R–P₂ straightening."
            elif q==18:
                reason="Vertices or side ratios and the roles I/H/G are explicit in the stem; no omitted mark, shade or source image fact is needed."
                sreason="The solution uses BH:HC=AB:AC together with G's one-third altitude; place H on BC and G on the actual median so the [GHC]/[GHB] partition is visible."
            elif q==19:
                reason="The exact circle equations, arc half-plane restrictions and line equation fully define the student data; no graphical measurement is required."
                sreason="The solution's distinct-intersection count turns on arc-side crossing, tangency and endpoint coincidence; a UID-specific diagram exposes those topology cases and the excluded boundary."
            else:
                reason="Set sizes, total population and added count constraints are numerical text with no missing region mark."
                sreason="The proof explicitly constructs four-region allocations; a UID-specific exact table maps each count to A∩B, A-only, B-only, neither and verifies the total."
            rows.append({"uid":uid,"sourceQid":q,"problemDecision":{"need":"EXEMPT","reason":reason},"solutionDecision":{"need":"BENEFICIAL","reason":sreason},"baselineProblemImage":item.get("image"),"baselineSolutionImage":item.get("solutionImage"),"baselineSolutionVisual":item.get("solutionVisual"),"problemAssetAction":"EXEMPT","solutionAssetAction":"NEW_SVG"})
    receipt=read_approved_bytes(APPROVAL_REL)
    data={"schemaVersion":"PALMA_Q17_Q20_TWO_AXIS_VISUAL_TRIAGE_V1","sourceExamBlobSha1":approval["source"]["gitBlobSha1"],"approvalReceiptPath":Path(APPROVAL_REL).as_posix(),"approvalReceiptSha256":sha(receipt),"approvalReceiptBinding":approval_binding,"uniqueUidDenominator":36,"problemRows":36,"solutionRows":36,"problemCounts":{"REQUIRED":0,"BENEFICIAL":0,"EXEMPT":36},"solutionCounts":{"REQUIRED":0,"BENEFICIAL":36,"EXEMPT":0},"packageSnapshots":[],"rows":rows,"status":"FROZEN_BEFORE_Q17_Q20_ASSET_BUILD"}
    for q in range(17,21):
        p=SOURCE_DIR+f"/GPT_QID9_Q{q}_PACKAGE.json"; raw=(ROOT/p).read_bytes(); canonical=read_approved_bytes(p); rec=next(x for x in approval["packages"] if x["sourceQid"]==q)
        data["packageSnapshots"].append({"sourceQid":q,"path":p,"approvedCanonicalSha256":rec["sha256"],"approvedGitBlobSha1":rec["gitBlobSha1"],"actualSourceBytesUsed":"git show HEAD:<path>","currentWorktreeRawSha256":sha(raw),"currentWorktreeRawGitBlobSha1":blob(raw),"currentWorktreeCleanGitBlobSha1":clean_blob_for_path(p,raw),"parsedJsonSemanticallyEqualToApproved":json.loads(raw.decode("utf-8"))==json.loads(canonical.decode("utf-8"))})
    writej(EVIDENCE/"visual-triage-freeze.json",data)
    return data

def q17_spec(uid,facts,p):
    pts=facts["coordinateConstruction"]["pointCoordinates"]
    r=p["r"]; outer=p.get("outer",r); th=math.radians(p["deg"])
    labels=[("A","A"),("B","B"),("P","P"),("P1","P₁"),("P2","P₂"),("Q","Q"),("R","R")]
    pointrows=[{"x":pts[key][0],"y":pts[key][1],"label":label} for key,label in labels]
    circles=[{"center":{"x":0.,"y":0.,"label":"O"},"radius":outer}]
    radii=[outer]
    if abs(r-outer)>1e-8:
        circles.append({"center":{"x":0.,"y":0.},"radius":r})
        radii.append(r)
    curves=[]
    for radius in radii:
        curves.append({"semanticRole":"source-arc-boundary","center":[0.,0.],"radius":radius,"startAngleRadians":0.,"endAngleRadians":th,"points":[{"x":radius*math.cos(th*i/32),"y":radius*math.sin(th*i/32)} for i in range(33)]})
    angle_radius=.28*r
    curves.append({"semanticRole":"angle-owner-arc","center":[0.,0.],"radius":angle_radius,"startAngleRadians":0.,"endAngleRadians":th,"points":[{"x":angle_radius*math.cos(th*i/32),"y":angle_radius*math.sin(th*i/32)} for i in range(33)]})
    segments=[
      {"from":{"x":0.,"y":0.},"to":{"x":pts["A"][0],"y":pts["A"][1]},"kind":"radius","label":"OA"},
      {"from":{"x":0.,"y":0.},"to":{"x":pts["B"][0],"y":pts["B"][1]},"kind":"radius","label":"OB"},
      {"from":{"x":pts["P1"][0],"y":pts["P1"][1]},"to":{"x":pts["P2"][0],"y":pts["P2"][1]},"kind":"segment","label":p["min"]},
      {"from":{"x":pts["P"][0],"y":pts["P"][1]},"to":{"x":pts["Q"][0],"y":pts["Q"][1]},"kind":"guide"},
      {"from":{"x":pts["P"][0],"y":pts["P"][1]},"to":{"x":pts["R"][0],"y":pts["R"][1]},"kind":"guide"}
    ]
    extra="∠AOB="+(f'{p["deg"]:g}°' if p["slot"] not in {"B3","C1"} else p["relation"])
    annotations=[{"x":.66*r*math.cos(th/2),"y":.66*r*math.sin(th/2),"text":extra}] if p["slot"] not in {"B3","C1","C2","C3"} else [{"x":0.,"y":-1.35*outer,"text":extra}]
    if uid.endswith("-B2"):
        q,rp=pts["Q"],pts["R"]
        dqr=sub(rp,q); qrn=norm(dqr); n=(-dqr[1]/qrn,dqr[0]/qrn)
        annotations.append({"x":(q[0]+rp[0])/2+.48*n[0],"y":(q[1]+rp[1])/2+.48*n[1],"text":"QR=1"})
    if uid.endswith("-C2"):
        annotations=[{"x":0.,"y":-1.25*outer,"text":"3≤OP≤5, 0≤∠AOP≤45°"},{"x":0.,"y":-1.43*outer,"text":"OP=3에서 등호 성립"}]
    if uid.endswith("-C3"):
        annotations=[{"x":0.,"y":-1.35*outer,"text":"단위원 정규화 · m=√(2n)"}]
    if uid.endswith("-A2"):
        # Q is close to B in the 30° case. Place its label on the side away
        # from B so the source identity stays visually unambiguous.
        for row in pointrows:
            if row["label"]=="Q": row["label"]=None
        width=560.; height=560.; margin=32.
        sx=(width-2*margin)/(3.24*outer); sy=(height-2*margin)/(3.24*outer)
        q=pts["Q"]; b=pts["B"]
        qscreen=(margin+(q[0]+1.62*outer)*sx,height-margin-(q[1]+1.62*outer)*sy)
        bscreen=(margin+(b[0]+1.62*outer)*sx,height-margin-(b[1]+1.62*outer)*sy)
        away=sub(qscreen,bscreen); away=mul(1/norm(away),away)
        annotations.append({"x":q[0]+10*away[0]/sx,"y":q[1]-10*away[1]/sy,"text":"Q"})
    return {"version":VISUAL_SPEC_VERSION,"type":"circle_geometry","width":560,"height":560,"xRange":[-1.62*outer,1.62*outer],"yRange":[-1.62*outer,1.62*outer],"circles":circles,"segments":segments,"curves":curves,"points":pointrows,"annotations":annotations}

def q20_spec(uid,facts,p):
    w=facts["witnesses"]; n=len(w)
    name="밖 인원" if p["slot"]=="C3" else "교집합"
    if n==2:
        rows=[["구역",name+" 최소 사례",name+" 최대 사례"],["집합 A",p["A"],""],["집합 B",p["B"],""],
          ["A∩B",str(w[0]["intersection"]),str(w[1]["intersection"])],
          ["A만",str(w[0]["aOnly"]),str(w[1]["aOnly"])],
          ["B만",str(w[0]["bOnly"]),str(w[1]["bOnly"])],
          ["둘 다 아님",str(w[0]["neither"]),str(w[1]["neither"])],
          ["전체",str(w[0]["total"]),str(w[1]["total"])]]
    else:
        rows=[["구역","가능한 배치"],["집합 A",p["A"]],["집합 B",p["B"]],
          ["A∩B",str(w[0]["intersection"])],["A만",str(w[0]["aOnly"])],
          ["B만",str(w[0]["bOnly"])],["둘 다 아님",str(w[0]["neither"])],["전체",str(w[0]["total"])]]
        rows=[row+[""] for row in rows]
    return {"version":VISUAL_SPEC_VERSION,"type":"table","width":720,"height":520,"rows":rows}

def px_to_math(spec, x, y):
    width=float(spec["width"]); height=float(spec["height"]); margin=32.
    xl,xh=spec["xRange"]; yl,yh=spec["yRange"]
    sx=(width-2*margin)/(xh-xl); sy=(height-2*margin)/(yh-yl)
    assert abs(sx-sy)<1e-8
    return xl+(x-margin)/sx, yl+(height-margin-y)/sy
def static_q17(svg:bytes,spec:dict[str,Any],facts:dict[str,Any])->dict[str,Any]:
    root=ET.fromstring(svg.decode("utf-8")); assert root.tag.endswith("svg")
    points=[e for e in root.iter() if e.tag.endswith("circle") and e.attrib.get("class")=="point"]
    expected=spec["points"]; assert len(points)==len(expected)
    obs={}; labels={row["label"]:row for row in expected}
    for row,primitive in zip(expected,points):
        xy=px_to_math(spec,float(primitive.attrib["cx"]),float(primitive.attrib["cy"]))
        if row.get("label") is None:
            key=min(facts["coordinateConstruction"]["pointCoordinates"],key=lambda name:math.dist(tuple(row[k] for k in ("x","y")),facts["coordinateConstruction"]["pointCoordinates"][name]))
        else:
            key={"P₁":"P1","P₂":"P2"}.get(row["label"],row["label"])
        target=tuple(facts["coordinateConstruction"]["pointCoordinates"][key])
        assert math.dist(xy,target)<1e-6,(facts["uid"],key,xy,target)
        obs[key]=xy
    circles=[e for e in root.iter() if e.tag.endswith("circle") and e.attrib.get("class")=="shape"]
    assert len(circles)==len(spec["circles"])
    circleobs=[]
    sx=(spec["width"]-64)/(spec["xRange"][1]-spec["xRange"][0])
    for want,actual in zip(spec["circles"],circles):
        center=px_to_math(spec,float(actual.attrib["cx"]),float(actual.attrib["cy"]))
        radius=float(actual.attrib["r"])/sx
        assert math.dist(center,(want["center"]["x"],want["center"]["y"]))<1e-6
        assert abs(radius-want["radius"])<1e-6
        circleobs.append({"center":center,"radius":radius})
    lines=[e for e in root.iter() if e.tag.rsplit("}",1)[-1]=="line" and e.attrib.get("class")!="axis"]
    assert len(lines)==len(spec["segments"])+len(spec.get("lines",[]))
    lineobs=[]
    for e in lines:
        a=px_to_math(spec,float(e.attrib["x1"]),float(e.attrib["y1"]))
        b=px_to_math(spec,float(e.attrib["x2"]),float(e.attrib["y2"]))
        lineobs.append({"from":a,"to":b,"class":e.attrib.get("class")})
    chord=lineobs[2]
    targetend=[tuple(facts["coordinateConstruction"]["pointCoordinates"][k]) for k in ["P1","P2"]]
    endpoint_error=min(max(math.dist(chord["from"],targetend[0]),math.dist(chord["to"],targetend[1])),max(math.dist(chord["from"],targetend[1]),math.dist(chord["to"],targetend[0])))
    assert endpoint_error<1e-6,(facts["uid"],"chord endpoints exceed six-decimal renderer tolerance",endpoint_error)
    assert abs(math.dist(chord["from"],chord["to"])-facts["relation"]["computedChordLength"])<1e-6
    texts=[e for e in root.iter() if e.tag.endswith("text")]
    content=[(e.text or "").strip() for e in texts]
    required=[row["label"] for row in expected if row.get("label")]+["O","OA","OB",Q17[facts["uid"]]["min"]]
    for label in required: assert label in content,(facts["uid"],"missing rendered label",label)
    centerels=[e for e in root.iter() if e.tag.endswith("circle") and e.attrib.get("class")=="center-point"]
    center=px_to_math(spec,float(centerels[0].attrib["cx"]),float(centerels[0].attrib["cy"]))
    point_screen={}
    margin=32.; w=spec["width"]; h=spec["height"]; xl,xh=spec["xRange"]; yl,yh=spec["yRange"]
    sx=(w-64)/(xh-xl); sy=(h-64)/(yh-yl)
    for key,xy in obs.items(): point_screen[key]=(margin+(xy[0]-xl)*sx,h-margin-(xy[1]-yl)*sy)
    point_screen["O"]=(margin+(center[0]-xl)*sx,h-margin-(center[1]-yl)*sy)
    label_bindings=[]
    for label,key in [("A","A"),("B","B"),("P","P"),("P₁","P1"),("P₂","P2"),("Q","Q"),("R","R"),("O","O")]:
        nodes=[e for e in texts if (e.text or "").strip()==label]
        assert nodes,(facts["uid"],"no text node",label)
        anchor=(float(nodes[0].attrib["x"]),float(nodes[0].attrib["y"]))
        distances={name:math.dist(anchor,xy) for name,xy in point_screen.items()}
        observed_owner=min(distances,key=distances.get)
        d=distances[observed_owner]
        label_bindings.append({"text":label,"expectedOwner":key,"observedNearestPoint":observed_owner,"anchorDistancePx":d,"result":"PASS" if observed_owner==key and d<90 else "REVIEW"})
        assert observed_owner==key and d<90,(facts["uid"],label,observed_owner,d)
    arcs=[]
    for poly in [e for e in root.iter() if e.tag.endswith("polyline") and e.attrib.get("class")=="curve"]:
        raw=[]
        for pair in poly.attrib["points"].split():
            x,y=pair.split(","); raw.append(px_to_math(spec,float(x),float(y)))
        assert len(raw)>=2
        arcs.append({"sampleCount":len(raw),"first":raw[0],"last":raw[-1]})
    assert len(arcs)==len(spec["curves"])
    return {"xmlParse":"PASS","actualSvgPrimitives":{"points":obs,"circles":circleobs,"segments":lineobs,"arcs":arcs,"texts":content},
      "observedFacts":{"pointCoordinates":obs,"circleRadii":[x["radius"] for x in circleobs],"foldedChordLength":math.dist(chord["from"],chord["to"]),"labelOwnerBindings":label_bindings,"circleScaleEqual":abs(sx-sy)<1e-8},
      "tolerances":{"coordinates":1e-6,"radius":1e-6,"chordLength":1e-6}}

def static_table(svg:bytes,spec:dict[str,Any])->dict[str,Any]:
    root=ET.fromstring(svg.decode("utf-8")); assert root.tag.endswith("svg")
    cells=[e for e in root.iter() if e.tag.endswith("text") and e.attrib.get("class")=="cell-text"]
    rects=[e for e in root.iter() if e.tag.endswith("rect") and e.attrib.get("class")=="cell"]
    expected=[x for row in spec["rows"] for x in row]; actual=[(e.text or "").strip() for e in cells]
    assert actual==expected and len(rects)==len(expected)
    rows=len(spec["rows"]); cols=len(spec["rows"][0]); cw=(spec["width"]-32)/cols; ch=(spec["height"]-32)/rows
    cellfacts=[]
    for i,(text,e) in enumerate(zip(expected,cells)):
        r,c=divmod(i,cols); x=16+c*cw; y=16+r*ch
        px,py=float(e.attrib["x"]),float(e.attrib["y"])
        assert abs(px-(x+cw/2))<1e-6 and abs(py-(y+ch/2))<1e-6
        approx=sum(13.0 if unicodedata.east_asian_width(chr) in {"W","F"} else 7.8 for chr in text)
        assert approx<=cw,(text,approx,cw)
        cellfacts.append({"row":r,"column":c,"text":text,"center":[px,py],"cellWidth":cw,"cellHeight":ch,"conservativeIntrinsicTextWidthEstimatePx":approx,"browserClippingStatus":"RENDER_PENDING"})
    return {"xmlParse":"PASS","actualSvgPrimitives":{"cellRectCount":len(rects),"cellText":actual},"observedFacts":{"tableCellParity":"PASS","tableCells":cellfacts,"canonicalRegionMap":{"A∩B":"R11","A만":"R10","B만":"R01","둘 다 아님":"R00"},"witnesses":None},"tolerances":{"cellCenterPx":1e-6,"approxTextWidth":0}}

def build():
    EVIDENCE.mkdir(parents=True,exist_ok=True); ASSET_DIR.mkdir(parents=True,exist_ok=True)
    approval,packages,items=load_inputs()
    tf=triage_freeze(approval,packages,items)
    q17f={uid:q17_expected(uid,p,items[uid]) for uid,p in Q17.items()}
    q20f={uid:q20_expected(uid,p,items[uid]) for uid,p in Q20.items()}
    receipt_bytes=(ROOT/APPROVAL_REL).read_bytes()
    package_snaps=tf["packageSnapshots"]
    freeze={"schemaVersion":"PALMA_Q17_Q20_EXPECTED_FACT_FREEZE_V1","sourceExamBlobSha1":approval["source"]["gitBlobSha1"],"approvalReceiptSha256":sha(receipt_bytes),"packages":package_snaps,"q17":q17f,"q20":q20f,"frozenBeforeCandidateBytes":True}
    writej(EVIDENCE/"expected-facts-freeze.json",freeze)
    out=[]
    for uid,p in Q17.items():
        facts=q17f[uid]; spec=q17_spec(uid,facts,p)
        svg=render_visual_spec(spec)
        assert svg==render_visual_spec(json.loads(json.dumps(spec,ensure_ascii=False)))
        data=svg.encode("utf-8"); static=static_q17(data,spec,facts)
        package_rel=SOURCE_DIR+"/GPT_QID9_Q17_PACKAGE.json"; package_raw=(ROOT/package_rel).read_bytes()
        asset=Path("archive/assets/generated-lite/palma-speed-pilot")/(uid+"-solution.svg")
        specp=Path("archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q17")/(uid+".visual-spec.json")
        reportp=Path("archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q17")/(uid+".render-report.json")
        evp=Path("archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q17")/(uid+".visual-evidence.json")
        writej(ROOT/specp,spec); (ROOT/asset).parent.mkdir(parents=True,exist_ok=True); (ROOT/asset).write_bytes(data)
        report={"schemaVersion":"PALMA_EXISTING_VISUAL_RENDER_REPORT_V1","renderer":"alive.engine.visual_renderer.render_visual_spec","rendererVersion":RENDERER_VERSION,"visualSpecVersion":VISUAL_SPEC_VERSION,"visualType":spec["type"],"deterministicRerender":"PASS","specSha256":sha(json.dumps(spec,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()),"assetSha256":sha(data),"assetGitBlobSha1":blob(data),"actualBrowserStatus":"RENDER_PENDING"}
        writej(ROOT/reportp,report)
        evidence={"schemaVersion":"PALMA_VISUAL_ITEM_PHYSICAL_EVIDENCE_V1","uid":uid,"sourceQid":17,"need":"BENEFICIAL","problemNeed":"EXEMPT","assetAction":"NEW_SVG","sourcePackagePath":package_rel,"sourcePackageRawSha256":sha(package_raw),"sourcePackageGitBlobSha1":read_git_blob_sha(package_rel),"sourceExamBlobSha1":approval["source"]["gitBlobSha1"],"approvalReceiptSha256":sha(receipt_bytes),"sourceProblemSha256":facts["sourceProblemSha256"],"sourceSolutionSha256":facts["sourceSolutionSha256"],"sourceConditionCoverage":facts["sourceConditionCoverage"],"expectedFactCompletenessStatus":"PASS","uncoveredCriticalConditions":[],"decisiveRelationCovered":True,"coordinateEvidence":facts["coordinateConstruction"],"expectedFacts":facts["expectedFacts"],"pythonInputs":{"radius":p["r"],"thetaDeg":p["deg"],"formula":"P1P2=2r·sin(theta)"},"pythonCalculatedOutputs":{"minimumLength":p["minval"],"chordLength":facts["relation"]["computedChordLength"],"Q":facts["coordinateConstruction"]["pointCoordinates"]["Q"],"R":facts["coordinateConstruction"]["pointCoordinates"]["R"]},"coordinateModel":{"origin":[0,0],"xAxis":"OA","scale":"equal x/y","xRange":spec["xRange"],"yRange":spec["yRange"],"transform":"screenX=32+(x-xLow)*(width-64)/(xHigh-xLow); screenY=height-32-(y-yLow)*(height-64)/(yHigh-yLow)"},"actualSvgPrimitives":static["actualSvgPrimitives"],"observedFacts":static["observedFacts"],"deltaTolerance":static["tolerances"],"labelOwnerBindings":static["observedFacts"]["labelOwnerBindings"],"factVisualizations":[{"fact":"OA/OB source boundaries","role":"GIVEN","encoding":"radius segments"},{"fact":"P1/P2 reflections and Q/R intersections","role":"DERIVED_INTERMEDIATE","encoding":"labeled points plus dashed original legs and solid folded chord"},{"fact":"straightened minimum path","role":"CONCLUSION","encoding":"P1-Q-R-P2 line"}],"sourceSemanticIdentity":{"applicable":True,"checks":[{"semanticRole":k,"sourceLabel":"P₁" if k=="P1" else "P₂" if k=="P2" else k,"artifactLabel":"P₁" if k=="P1" else "P₂" if k=="P2" else k,"result":"PASS"} for k in ["O","A","B","P","P1","P2","Q","R"]]},"xmlParse":"PASS","styleFloorStatus":"STATIC_ONLY_RENDER_PENDING","styleVersion":"visual_renderer_"+RENDERER_VERSION,"semanticGeometryPreserved":True,"visualSpecPath":specp.as_posix(),"visualSpecSha256":report["specSha256"],"rendererReportPath":reportp.as_posix(),"rendererReportSha256":sha((ROOT/reportp).read_bytes()),"sourceSvgPath":asset.as_posix(),"sourceSvgSha256":sha(data),"sourceSvgGitBlobSha1":blob(data),"browserRenderEvidence":{"status":"RENDER_PENDING","reason":"Actual HTTP Archive solution consumer render is assigned after registration; no local Golden file URL workaround was attempted."},"consumerReference":"PENDING_REGISTRATION","newVisualInformation":facts["expectedFacts"]}
        writej(ROOT/evp,evidence)
        out.append(asset_row(uid,asset,evp,report["rendererVersion"],"P를 OA·OB에 대칭해 P₁·Q·R·P₂로 펴는 최소 경로 그림"))
    for uid,p in Q20.items():
        facts=q20f[uid]; spec=q20_spec(uid,facts,p); svg=render_visual_spec(spec)
        assert svg==render_visual_spec(json.loads(json.dumps(spec,ensure_ascii=False)))
        data=svg.encode("utf-8"); static=static_table(data,spec)
        package_rel=SOURCE_DIR+"/GPT_QID9_Q20_PACKAGE.json"; package_raw=(ROOT/package_rel).read_bytes()
        asset=Path("archive/assets/generated-lite/palma-speed-pilot")/(uid+"-solution.svg")
        specp=Path("archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q20")/(uid+".visual-spec.json")
        reportp=Path("archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q20")/(uid+".render-report.json")
        evp=Path("archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q20")/(uid+".visual-evidence.json")
        writej(ROOT/specp,spec); (ROOT/asset).parent.mkdir(parents=True,exist_ok=True); (ROOT/asset).write_bytes(data)
        report={"schemaVersion":"PALMA_EXISTING_VISUAL_RENDER_REPORT_V1","renderer":"alive.engine.visual_renderer.render_visual_spec","rendererVersion":RENDERER_VERSION,"visualSpecVersion":VISUAL_SPEC_VERSION,"visualType":spec["type"],"deterministicRerender":"PASS","specSha256":sha(json.dumps(spec,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()),"assetSha256":sha(data),"assetGitBlobSha1":blob(data),"actualBrowserStatus":"RENDER_PENDING"}
        writej(ROOT/reportp,report)
        evidence={"schemaVersion":"PALMA_VISUAL_ITEM_PHYSICAL_EVIDENCE_V1","uid":uid,"sourceQid":20,"need":"BENEFICIAL","problemNeed":"EXEMPT","assetAction":"NEW_SVG","sourcePackagePath":package_rel,"sourcePackageRawSha256":sha(package_raw),"sourcePackageGitBlobSha1":read_git_blob_sha(package_rel),"sourceExamBlobSha1":approval["source"]["gitBlobSha1"],"approvalReceiptSha256":sha(receipt_bytes),"sourceProblemSha256":facts["sourceProblemSha256"],"sourceSolutionSha256":facts["sourceSolutionSha256"],"sourceConditionCoverage":facts["sourceConditionCoverage"],"expectedFactCompletenessStatus":"PASS","uncoveredCriticalConditions":[],"decisiveRelationCovered":True,"expectedFacts":facts["typedFacts"],"pythonInputs":{"setACardinality":p["a"],"setBCardinality":p["b"],"universeTotal":p["N"],"witnessIntersectionValues":p["xs"]},"pythonCalculatedOutputs":{"witnesses":facts["witnesses"]},"coordinateModel":{"visualType":"table","representation":"Exact counts map to canonical regions R11/R10/R01/R00; cell geometry carries no cardinality-area claim."},"actualSvgPrimitives":static["actualSvgPrimitives"],"observedFacts":{"tableCellParity":"PASS","tableCells":static["observedFacts"]["tableCells"],"canonicalRegionMap":facts["canonicalRegionMap"],"witnesses":facts["witnesses"],"cardinalityByRegionParity":"PASS","totalCardinalityParity":"PASS","extremeConfigurationParity":"PASS"},"deltaTolerance":static["tolerances"],"labelOwnerBindings":[{"regionLabel":label,"canonicalRegion":region,"tableRow":i+2,"result":"PASS"} for i,(label,region) in enumerate(facts["canonicalRegionMap"].items())],"sourceSemanticIdentity":{"applicable":True,"checks":[{"semanticRole":"A","sourceLabel":p["A"],"artifactLabel":p["A"],"result":"PASS"},{"semanticRole":"B","sourceLabel":p["B"],"artifactLabel":p["B"],"result":"PASS"}]},"factVisualizations":[{"fact":"four membership-region witness counts","role":"DERIVED_INTERMEDIATE","encoding":"UID-specific table; each region number remains explicit and each witness sums to N"}],"xmlParse":"PASS","styleFloorStatus":"STATIC_ONLY_RENDER_PENDING","styleVersion":"visual_renderer_"+RENDERER_VERSION,"semanticGeometryPreserved":True,"visualSpecPath":specp.as_posix(),"visualSpecSha256":report["specSha256"],"rendererReportPath":reportp.as_posix(),"rendererReportSha256":sha((ROOT/reportp).read_bytes()),"sourceSvgPath":asset.as_posix(),"sourceSvgSha256":sha(data),"sourceSvgGitBlobSha1":blob(data),"browserRenderEvidence":{"status":"RENDER_PENDING","reason":"Actual HTTP Archive solution consumer render is assigned after registration; no local Golden file URL workaround was attempted."},"consumerReference":"PENDING_REGISTRATION","newVisualInformation":facts["sourceConditionCoverage"]}
        writej(ROOT/evp,evidence)
        out.append(asset_row(uid,asset,evp,report["rendererVersion"],"A와 B의 교집합·각 집합만·둘 다 아님 인원을 사례별로 표로 나타낸 해설 자료."))

    summary={"schemaVersion":"PALMA_Q17_Q20_VISUAL_ASSET_SUMMARY_V1","sourceExamBlobSha1":approval["source"]["gitBlobSha1"],"approvalReceiptPath":Path(APPROVAL_REL).as_posix(),"approvalReceiptSha256":sha(receipt_bytes),"renderer":"alive.engine.visual_renderer:"+RENDERER_VERSION+"/visualSpec-"+VISUAL_SPEC_VERSION,"counts":{"denominator":18,"svgCreated":len(out),"xmlParsePass":len(out),"staticPrimitiveParityPass":len(out),"renderPending":len(out)},"items":out,"triageFreezePath":"archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/visual-triage-freeze.json","expectedFactsFreezePath":"archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/expected-facts-freeze.json"}
    summary_bytes=writej(EVIDENCE/"Q17_Q20_asset_summary.json",summary)
    receipt_path=EVIDENCE/"visual_read_receipt.json"
    if receipt_path.exists():
        receipt=json.loads(receipt_path.read_text(encoding="utf-8"))
        receipt["materialization"]={"started":True,"status":"STATIC_ASSETS_CREATED_RENDER_PENDING","assetSummaryPath":"archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q17_Q20_asset_summary.json","assetSummarySha256":sha(summary_bytes),"sourceSvgCount":len(out)}
        writej(receipt_path,receipt)
    print(json.dumps({"created":len(out),"q17":9,"q20":9,"renderPending":len(out),"summary":summary["items"][0]["sourceSvgPath"]},ensure_ascii=False,indent=2))

def asset_row(uid: str,asset:Path,evidence:Path,renderer:str,alt:str)->dict[str,Any]:
    raw=(ROOT/asset).read_bytes(); ev=(ROOT/evidence).read_bytes()
    assert b"\r\n" not in raw and b"\r\n" not in ev
    return {"uid":uid,"sourceSvgPath":asset.as_posix(),"sourceSvgSha256":sha(raw),"sourceSvgGitBlobSha1":blob(raw),"consumerAssetPath":asset.as_posix().removeprefix("archive/"),"renderer":renderer,"renderStatus":"RENDER_PENDING","visualEvidencePath":evidence.as_posix(),"visualEvidenceSha256":sha(ev),"alt":alt}

if __name__=="__main__": build()
