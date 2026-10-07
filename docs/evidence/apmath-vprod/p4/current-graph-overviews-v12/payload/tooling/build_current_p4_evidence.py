from pathlib import Path
import hashlib, json, os, re, subprocess, sys

ROOT = Path.cwd()
EXAM = "25_효천고_2학기_중간_고1_기출"
PKG = Path("docs/evidence/apmath-vprod/p4/current-graph-overviews-v12")
NODE = Path(".tmp/archive/full-node-suite-final-20261007-excluding-q10-cancel") / EXAM / "visual-engine/production/node-full-suite.log"
PY = Path(".tmp/archive/phase4-current-final-regressions-20261007") / EXAM / "visual-engine/production/regression/python-full.log"
COMPOSITE = "sha256:eb5a0accc3ea8f17a7b19e743f892821b3f751b31dfb8ad23151684a1158edc6"
CAPS = {
 "construction-spike-v1":"sha256:74829255bf7f184ef7d2bf6495e4bdac099895948cd774e6bd4c6b2dfd071bac",
 "polynomial-spike-v1":"sha256:5f34a2daf393e7ca648a8df94e154d46177d88fd6bf3ea7c4f5b65b006431901",
 "rational-spike-v1":"sha256:bebca17515d89dca7b54ec871b18aced465d9c8e9ed195915db514c7b92bc904",
 "sqrt-affine-spike-v1":"sha256:8a8594e6cd6acafa34c8f0bf34ee1576d4f4acd24309efea69bdf6c1aa237de2",
 "absolute-value-spike-v1":"sha256:40d1a94a1c4e4fe3553087a23c10ec5c24c882c14e5cd2c40beb0dfabf2a095a",
 "piecewise-affine-spike-v1":"sha256:b3939e60e06f7df3b67639004e9d496ece50506d31fa272f31f1f687355b3893",
 "exponential-affine-spike-v1":"sha256:2bf07cb6221288b4297e8b3ef08c08dfa9e3bf97fdc9c0d07b158d3ed32691b5",
 "logarithmic-affine-spike-v1":"sha256:869b8e0ae6c87d426f1d5f5111876b769b43727a2d65dbfb4e4257f1f427c22d",
 "trigonometric-spike-v1":"sha256:47acc1c7aae65feb942d4062ee00da1213809203e180e554ba0457e7209430f2"}
FIXTURES = [
 ("absolute-value","phase4-absolute-value-eedce998-6957-4c48-9364-7357ccf9d313","absolute-value-publication-result.json","absolute-value-spike-v1"),
 ("construction-v1","phase4-construction-v1-7e0b820a-c586-4d62-be71-77ad94599d3c","construction-v1-publication-result.json","construction-spike-v1"),
 ("cubic","phase4-poly34-cubic-e9db3182-1349-439b-9fb1-048e66b8f851","cubic-publication-result.json","polynomial-spike-v1"),
 ("quartic","phase4-poly34-quartic-31bf62bb-97fd-4361-aca5-d8212bb34f95","quartic-publication-result.json","polynomial-spike-v1"),
 ("exponential","phase4-exponential-a1854d8d-ee2d-4a6e-bb67-06a61fcf34da","exp-log-publication-result.json","exponential-affine-spike-v1"),
 ("logarithmic","phase4-logarithmic-be028dcc-ae99-40fd-8dc3-0889444467c5","exp-log-publication-result.json","logarithmic-affine-spike-v1"),
 ("piecewise","phase4-piecewise-affine-43c52926-38e9-424b-9b72-cc5abd004d4d","piecewise-affine-publication-result.json","piecewise-affine-spike-v1"),
 ("rational-pole","phase4-rational-pole-9a79f059-94fe-44ed-a4a6-7b0c2a350a2c","pole-publication-result.json","rational-spike-v1"),
 ("rational-hole","phase4-rational-hole-4a3914af-7fd4-47bb-9f9b-73b956c1bce3","hole-publication-result.json","rational-spike-v1"),
 ("sqrt-affine","phase4-sqrt-affine-68ed4314-9f35-4f2a-a073-27b16358acce","sqrt-affine-publication-result.json","sqrt-affine-spike-v1"),
 ("trig-sine","phase4-trig-sine-086fb8a7-bcec-4b7e-8ba8-c2ddbc5b777a","trig-publication-result.json","trigonometric-spike-v1"),
 ("trig-cosine","phase4-trig-cosine-0c754c53-6120-49a6-85fd-a5a92707e8d5","trig-publication-result.json","trigonometric-spike-v1"),
 ("trig-tangent","phase4-trig-tangent-288e4288-7e35-4a19-bb5d-46b2ce8371c4","trig-publication-result.json","trigonometric-spike-v1")]
Q1P=Path(".tmp/archive/visual-ed741b36-d931-4999-9850-f76d9af07473/25_효천고_2학기_중간_고1_기출/visual-engine/production/stages/RESULT/5078d485bb2a50e765278f7f2c21f64a5143280b823a17ee6470e7118ed7ab3d/result.json")
Q1C=Path(".tmp/archive/visual-ed741b36-d931-4999-9850-f76d9af07473/25_효천고_2학기_중간_고1_기출/visual-engine/production/stages/RESULT/27a9944bdcaf9c38be49adcc2f201719ab68e5ed38b0260cf78aba4306ffec97/result.json")
CFP=Path(".tmp/archive/visual-356c630c-ca80-4baa-8c43-4015bfa41fd2/25_삼산중_2학기_기말_중2_기출/visual-engine/production/stages/RESULT/45a781ac2dfc538045fe67d6e18c3cbf192602108c2cbe2ee9d004f6ae8ab95d/result.json")
CFC=Path(".tmp/archive/visual-356c630c-ca80-4baa-8c43-4015bfa41fd2/25_삼산중_2학기_기말_중2_기출/visual-engine/production/stages/RESULT/6c21b2f3bb03ac29a4c3e93ab94b27c8f54d4b20c749399a73677600268de43f/result.json")
Q10I=Path(".tmp/archive/archive-cancel-48c79495-458a-4745-9190-7dda665675df/25_연향중_1학기_기말_중3_기출c/visual-engine/production/stages/RESULT/d62963c62a5e1c519773a7dad664b2d496f435bc36f7585f900822fde6ee1e31/result.json")
P3E=Path("docs/evidence/apmath-vprod/p3e/measured-panel-repair-v11")
Q10L=P3E/"measured-panel-repair-ledger.json"
Q10R=P3E/"candidate-results/q10-graph-current-policy-result.json"
Q10RS=Path(".tmp/archive/visual-d06883b9-68da-48da-ae13-239d90b83c90/25_연향중_1학기_기말_중3_기출c/visual-engine/production/stages/RESULT/a1cf58ebcb70af8919ddb61e569b3f65638a83016df5bdf27e5bcaf03a39bb93/result.json")

def H(data): return "sha256:"+hashlib.sha256(data).hexdigest()
def U(value): return str(value).removeprefix("sha256:").lower()
def HP(value):
 p=Path(value); p=p if p.is_absolute() else ROOT/p; s=str(p)
 if os.name=="nt" and len(s)>240 and not s.startswith("\\\\?\\"):
  s=("\\\\?\\UNC\\"+s[2:]) if s.startswith("\\\\") else ("\\\\?\\"+s)
 return Path(s)
def RP(value):
 s=str(value).replace("\\","/")
 if s.startswith("//?/"): s=s[4:]
 r=str(ROOT).replace("\\","/")
 return s[len(r)+1:] if s.startswith(r+"/") else s
def RB(value): return HP(value).read_bytes()
def RJ(value): return json.loads(RB(value).decode("utf-8-sig"))
def SR(value):
 b=RB(value); return {"path":RP(value),"bytes":len(b),"sha256":H(b)}

def preflight():
 if HP(PKG).exists(): raise RuntimeError("PACKAGE_PATH_ALREADY_EXISTS")
 nt=RB(NODE).decode("utf-8",errors="replace"); pt=RB(PY).decode("utf-8",errors="replace")
 ns={k:int(re.search(p,nt).group(1)) for k,p in {"tests":r"ℹ tests (\d+)","passed":r"ℹ pass (\d+)","failed":r"ℹ fail (\d+)"}.items()}
 pn=int(re.search(r"Ran (\d+) tests",pt).group(1))
 if ns!={"tests":158,"passed":158,"failed":0} or pn!=186 or not re.search(r"\nOK\s*$",pt): raise RuntimeError("REGRESSION_SUMMARY_MISMATCH")
 fixtures={}
 for name,rid,leaf,cap in FIXTURES:
  base=Path(".tmp/archive")/rid/EXAM/"visual-engine/production"; p=base/leaf; r=RJ(p)
  if r.get("classification")!="CONTROLLED_SYNTHETIC_CONTENT_FIXTURE" or r.get("productionAuthorized") is not False: raise RuntimeError("FIXTURE_AUTHORITY:"+name)
  pf=r.get("archivePreflight",{}); pfstatus=pf.get("status",pf.get("captureStatus"))
  if r.get("actualArchive",{}).get("status")!="PASS" or pfstatus!="PASS": raise RuntimeError("FIXTURE_CAPTURE:"+name)
  if len(r.get("profileAudits",[]))!=4 or len(r.get("profileScreenshots",[]))!=4: raise RuntimeError("FIXTURE_PROFILE_COUNT:"+name)
  if not any(a.get("sizeClass")==r.get("selectedSizeClass") and a.get("status")=="PASS" for a in r["profileAudits"]): raise RuntimeError("FIXTURE_SELECTED_PROFILE:"+name)
  svg=r["candidateSvgRef"]
  if svg.get("sha256")!=r.get("candidateSvgSha256") or H(RB(svg["path"]))!=svg["sha256"]: raise RuntimeError("FIXTURE_SVG_SHA:"+name)
  for stage in ("archivePreflight","actualArchive"):
   caprow=r[stage]; capture_path=Path(caprow["run"]); root=capture_path if capture_path.is_absolute() else ROOT/capture_path
   if not root.is_dir(): raise RuntimeError("CAPTURE_ROOT:"+name+":"+stage)
   if not list(root.rglob("*.png")): raise RuntimeError("CAPTURE_IMAGE:"+name+":"+stage)
  actual=r["actualArchive"]
  if actual.get("network",{}).get("policy")!="LOCAL_ONLY" or actual.get("network",{}).get("externalRequests") or actual.get("mathJaxSource")!="local" or actual.get("mathJaxCdnFallback") is not False or not actual.get("loadedAsset",{}).get("loaded"):
   raise RuntimeError("ACTUAL_ARCHIVE_LOCAL_OR_ASSET_MISMATCH:"+name)
  fixtures[name]=(base,p,r,cap)
 for name,priorp,currentp,count in (("q1",Q1P,Q1C,0),("coordinate-free",CFP,CFC,3)):
  prior,cur=RJ(priorp),RJ(currentp)
  if prior.get("status")!="EXPERIMENTAL_LOCATOR_COMPLETE" or len(prior.get("repairLedger",[]))!=count: raise RuntimeError("IMPACT_PRIOR:"+name)
  if cur.get("status")!="UNRESOLVED" or cur.get("error")!="INVALID_SOURCE_CONDITION_BINDING" or len(cur.get("repairLedger",[]))!=count or cur.get("actualArchive") is not None: raise RuntimeError("IMPACT_CURRENT:"+name)
  if cur.get("repairLedger",[])!=prior.get("repairLedger",[]): raise RuntimeError("IMPACT_BUDGET_CHANGED:"+name)
 incident=RJ(Q10I)
 if incident.get("status")!="UNRESOLVED" or incident.get("errorCode")!="ARCHIVE_CAPTURE_CANCELLED" or len(incident.get("repairLedger",[]))!=1: raise RuntimeError("Q10_ISOLATED_ATTEMPT")
 aborted=RJ(incident["archiveAbortEvidenceRef"])
 if aborted.get("status")!="ABORTED": raise RuntimeError("Q10_ABORT_PROOF")
 stages=[RJ(s["path"]).get("stage") for s in incident.get("stages",[])]
 if any(x in ("DISPLAY_ENVELOPE_CAPTURE","ARCHIVE_CAPTURE","CAPTURE","ACTUAL_ARCHIVE_CAPTURE") for x in stages): raise RuntimeError("Q10_INCIDENT_HAS_CAPTURE")
 qledger=RJ(Q10L); qrows=[x for x in qledger.get("candidateReplays",[]) if x.get("candidate")=="q10-graph"]
 if len(qrows)!=1: raise RuntimeError("Q10_CANONICAL_ROW")
 q10=qrows[0]
 if q10.get("status")!="UNRESOLVED" or q10.get("error")!="REPAIR_BUDGET_EXHAUSTED" or len(q10.get("repairLedger",[]))!=3: raise RuntimeError("Q10_NOT_3_OF_3")
 if RB(Q10R)!=RB(Q10RS) or U(H(RB(Q10R)))!=U(q10["currentResultRef"]["sha256"]): raise RuntimeError("Q10_CANONICAL_RESULT_SHA")
 return fixtures,ns,pn,q10,incident,stages

fixtures,ns,pn,q10,incident,incident_stages=preflight()
if "--preflight" in sys.argv:
 print(json.dumps({"preflight":"PASS","fixtures":len(fixtures),"node":ns,"pythonTests":pn,"q10CanonicalRows":3,"q10IncidentRows":1,"q10IncidentStages":incident_stages},indent=2)); raise SystemExit(0)

HP(PKG).mkdir(parents=True,exist_ok=False)
entries=[]
def add_file(src,dest,kind,users):
 data=RB(src); target=Path(dest); out=HP(PKG/target); out.parent.mkdir(parents=True,exist_ok=True); out.write_bytes(data)
 ref={"path":target.as_posix(),"bytes":len(data),"sha256":H(data)}
 entries.append({"originalRef":{"path":RP(src),"bytes":len(data),"sha256":H(data)},"pathInPackage":ref["path"],"bytes":ref["bytes"],"sha256":ref["sha256"],"classification":kind,"usedBy":users})
 return ref
def add_tree(src,dest,kind,user):
 base=HP(src)
 if not base.is_dir(): raise RuntimeError("TREE_MISSING:"+str(src))
 out=[]
 for f in base.rglob("*"):
  if f.is_symlink(): raise RuntimeError("EVIDENCE_SYMLINK:"+str(f))
  if f.is_file(): out.append(add_file(Path(src)/f.relative_to(base),Path(dest)/f.relative_to(base),kind,[user]))
 return out
def write_json(path,obj):
 data=(json.dumps(obj,ensure_ascii=False,indent=2)+"\n").encode("utf-8"); target=HP(PKG/path); target.parent.mkdir(parents=True,exist_ok=True); target.write_bytes(data)
 return {"path":Path(path).as_posix(),"bytes":len(data),"sha256":H(data)}

fixture_records={}
for name,(base,result_path,result,cap) in fixtures.items():
 target=Path("payload/fixtures")/name
 add_tree(base,target/"phase2-run","CURRENT_PHASE4_FIXTURE_RUN",name+":phase2")
 add_tree(result["archivePreflight"]["run"],target/"archive-preflight","ACTUAL_ARCHIVE_PREFLIGHT",name+":preflight")
 add_tree(result["actualArchive"]["run"],target/"actual-archive","ACTUAL_ARCHIVE_SELECTED_PROFILE",name+":actual")
 result_ref=add_file(result_path,target/"fixture-result.json","CONTROLLED_SYNTHETIC_FIXTURE_RESULT",[name+":result"])
 svg_ref=add_file(result["candidateSvgRef"]["path"],target/"candidate-final.svg","FINAL_CANDIDATE_SVG",[name+":svg"])
 if svg_ref["sha256"]!=result["candidateSvgSha256"]: raise RuntimeError("COPIED_SVG_SHA:"+name)
 fixture_records[name]={"classification":result["classification"],"productionAuthorized":False,"runId":result["runId"],"examUid":EXAM,"capability":cap,"capabilityFingerprint":CAPS[cap],"selectedSizeClass":result["selectedSizeClass"],"profileAudits":result["profileAudits"],"candidateSvgSha256":result["candidateSvgSha256"],"candidateSvgPackageRef":svg_ref,"resultPackageRef":result_ref,"resultSourceRef":SR(result_path),"archivePreflight":result["archivePreflight"],"actualArchive":result["actualArchive"],"frozenFragmentMeasurement":result.get("frozenFragmentMeasurement")}

nref=add_file(NODE,"payload/regression/node-full-suite.txt","FULL_NODE_REGRESSION_LOG",["final-regression"])
pref=add_file(PY,"payload/regression/python-full-suite.txt","FULL_PYTHON_REGRESSION_LOG",["final-regression"])
reg={"schemaVersion":"APMATH_FINAL_FROZEN_SCOPE_REGRESSION_v1","compositeScopeFingerprint":COMPOSITE,
 "node":{"command":"node --test --test-concurrency=1 all geometry-equation tests except archive-cancel-recovery.test.mjs","exitCode":0,"tests":158,"passed":158,"failed":0,"excludedTestFile":"archive/tools/geometry-equation/tests/archive-cancel-recovery.test.mjs","exclusionReason":"This test enters q10 Phase 2. It was excluded to preserve the canonical shared 3/3 ledger; the P3D cancellation package remains evidence for cancellation behavior.","log":nref},
 "python":{"command":"python -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_*.py' -v","exitCode":0,"tests":186,"passed":186,"failed":0,"log":pref},"q10Replayed":False}
regref=write_json("regression-summary.json",reg); entries.append({"originalRef":regref,"pathInPackage":regref["path"],"bytes":regref["bytes"],"sha256":regref["sha256"],"classification":"REGRESSION_SUMMARY","usedBy":["final-regression"]})

impacts=[]
for name,priorp,currentp,count in (("geometry-q1",Q1P,Q1C,0),("coordinate-free-q1",CFP,CFC,3)):
 prior,cur=RJ(priorp),RJ(currentp); dest=Path("payload/phase3-impact")/name
 prior_ref=add_file(priorp,dest/"prior-result.json","HISTORICAL_PHASE3_RESULT",[name+":prior"])
 cur_ref=add_file(currentp,dest/"final-result.json","FINAL_PHASE3_IMPACT_RESULT",[name+":current"])
 man_ref=add_file(currentp.parent/"manifest.json",dest/"result-manifest.json","FINAL_PHASE3_RESULT_RECEIPT",[name+":receipt"])
 impacts.append({"candidate":name,"questionUid":cur["identity"]["questionUid"],"priorStatus":prior["status"],"priorFingerprint":prior.get("fingerprint"),"priorRepairCount":len(prior["repairLedger"]),"priorRepairLedger":prior["repairLedger"],"priorResultRef":prior_ref,"finalCompositeScopeFingerprint":COMPOSITE,"finalResultFingerprint":cur.get("fingerprint"),"finalStatus":cur["status"],"error":cur["error"],"repairCount":len(cur["repairLedger"]),"repairLedger":cur["repairLedger"],"actualArchive":None,"productionAuthorized":False,"resultRef":cur_ref,"resultManifestRef":man_ref,"classification":"EXPERIMENTAL_LOCATOR_REPLAY_UNRESOLVED_NOT_QUALIFIED"})
imp=write_json("phase3-impact-ledger.json",{"schemaVersion":"APMATH_PHASE3_FINAL_FINGERPRINT_IMPACT_v1","classification":"EXPERIMENTAL_LOCATOR_IMPACT_ONLY_NOT_QUALIFICATION","compositeScopeFingerprint":COMPOSITE,"policy":"One replay each; no retry; preserve existing shared ledgers; q10 excluded.","candidates":impacts}); entries.append({"originalRef":imp,"pathInPackage":imp["path"],"bytes":imp["bytes"],"sha256":imp["sha256"],"classification":"PHASE3_IMPACT_LEDGER","usedBy":["phase3-current-status"]})

incident_ref=add_file(Q10I,"payload/q10-attempts/isolated-cancellation-result.json","ISOLATED_Q10_CANCELLATION_RESULT",["q10:isolated"])
incident_manifest=add_file(Q10I.parent/"manifest.json","payload/q10-attempts/isolated-cancellation-manifest.json","ISOLATED_Q10_CANCELLATION_RECEIPT",["q10:isolated"])
abort=add_file(incident["archiveAbortEvidenceRef"],"payload/q10-attempts/ABORTED.json","ISOLATED_Q10_CLEANUP_PROOF",["q10:isolated"])
canon_ledger=add_file(Q10L,"payload/q10-attempts/canonical-p3e-v11-ledger.json","CANONICAL_Q10_THREE_ROW_LEDGER",["q10:canonical"])
canon_result=add_file(Q10R,"payload/q10-attempts/canonical-q10-result.json","CANONICAL_Q10_CURRENT_RESULT",["q10:canonical"])
q10disp={"schemaVersion":"APMATH_Q10_ATTEMPT_DISPOSITION_v1","canonical":{"status":q10["status"],"error":q10["error"],"repairCount":3,"repairLimit":3,"repairLedger":q10["repairLedger"],"resultRef":canon_result,"p3eLedgerRef":canon_ledger,"replayed":False},
 "isolatedCancellation":{"classification":"ACCIDENTAL_ISOLATED_UNRESOLVED_ATTEMPT_NOT_CONTINUATION","status":incident["status"],"errorCode":incident["errorCode"],"runId":incident["runId"],"questionUid":incident["identity"]["questionUid"],"repairCount":1,"repairLedger":incident["repairLedger"],"captureReceiptCount":0,"stages":incident_stages,"cleanup":incident.get("archiveCleanup"),"resultRef":incident_ref,"resultManifestRef":incident_manifest,"abortProofRef":abort,"effectOnCanonicalLedger":"NONE; remains 3/3; no reset or support claim"}}
q10ref=write_json("q10-attempt-disposition.json",q10disp); entries.append({"originalRef":q10ref,"pathInPackage":q10ref["path"],"bytes":q10ref["bytes"],"sha256":q10ref["sha256"],"classification":"Q10_ATTEMPT_DISPOSITION","usedBy":["phase3-q10-status"]})

refs={
 "phase3Exit":Path("docs/evidence/apmath-vprod/phase3-exit-v1/phase3-exit-ledger.json"),
 "p3eV11Ledger":Q10L,"p3eV11Q10Result":Q10R,
 "p3dOffline":Path("docs/evidence/apmath-vprod/p3d/provider-timeout-offline-runtime-v7/provider-offline-runtime-ledger.json"),
 "cubicCheckpointLedger":Path("docs/evidence/apmath-vprod/p4/cubic-quartic-overview-v4/phase4-ledger.json"),
 "cubicCheckpointManifest":Path("docs/evidence/apmath-vprod/p4/cubic-quartic-overview-v4/evidence-manifest.json"),
 "rationalCheckpointLedger":Path("docs/evidence/apmath-vprod/p4/rational-linear-over-linear-v1/phase4-ledger.json"),
 "rationalCheckpointManifest":Path("docs/evidence/apmath-vprod/p4/rational-linear-over-linear-v1/evidence-manifest.json"),
 "priorPackageV9AttemptLedger":Path("docs/evidence/apmath-vprod/p4/current-graph-overviews-v9/attempt-ledger.json"),
 "phase3Report":Path("docs/reports/APMath_Visual_Production_Phase3-5_20261006.md"),
 "phase4Matrix":Path("docs/reports/APMath_Visual_Production_Phase4_Capability_Matrix_20261006.md")}
external_packages={}; external_sources={}
for key,path in refs.items():
 external_packages[key]=add_file(path,Path("payload/checkpoints")/(key+path.suffix),"EXTERNAL_CHECKPOINT_REFERENCE",[key])
 external_sources[key]=SR(path)
for key,path in (("q1Prior",Q1P),("q1Current",Q1C),("coordinateFreePrior",CFP),("coordinateFreeCurrent",CFC),("q10Incident",Q10I)): external_sources[key]=SR(path)

changes=set()
for cmd in (["git","diff","--name-only"],["git","ls-files","--others","--exclude-standard"]):
 changes.update(subprocess.check_output(cmd,cwd=ROOT,text=True,encoding="utf-8").splitlines())
required={"archive/engine.html","archive/tools/geometry-equation/record-visual-browser-evidence.mjs","archive/tools/geometry-equation/verify-rendered-layout.mjs","archive/tools/geometry-equation/visual-browser-runtime.mjs"}
codepaths=sorted(p for p in changes|required if (p.startswith("archive/tools/geometry-equation/") or p in required) and HP(p).is_file())
code_refs=[SR(p) for p in codepaths]

partial_v10=Path("docs/evidence/apmath-vprod/p4/current-graph-overviews-v10")
partial_v11=Path("docs/evidence/apmath-vprod/p4/current-graph-overviews-v11")
partial_attempts=[
 {"path":partial_v10.as_posix(),"status":"INCOMPLETE_UNVERIFIED_SOURCE_REFERENCE_CHECK","reason":"The v10 build wrote payload/index/manifest, then its final verifier resolved package-local checkpoint paths from repository root and failed. The directory is preserved unchanged.","fileCount":276,"bytes":11728445,"manifestRef":SR(partial_v10/"evidence-manifest.json")},
 {"path":partial_v11.as_posix(),"status":"INCOMPLETE_UNMANIFESTED_BUILD","reason":"The copied builder stopped at a NameError after the fixture payload was copied. The directory is preserved unchanged.","fileCount":272,"bytes":11152711}]
staging_validation={"path":".tmp/archive/phase4-current-package-build-v12-20261007/stage-package","status":"PASS_MANIFEST_INDEX_CODE_AND_EXTERNAL_REF_VERIFICATION","manifestFiles":276,"indexEntries":275,"manifestSha256":"sha256:96469dfa7ce386a6f1b2e2c4eef7c3dd55e94d23b453f0927f94befa08078fbf"}
attempt_ref=write_json("attempt-ledger.json",{"schemaVersion":"APMATH_PHASE4_PACKAGE_ATTEMPTS_v1","currentPackage":"current-graph-overviews-v12","stagingValidation":staging_validation,"attempts":partial_attempts})
entries.append({"originalRef":attempt_ref,"pathInPackage":attempt_ref["path"],"bytes":attempt_ref["bytes"],"sha256":attempt_ref["sha256"],"classification":"PACKAGE_ATTEMPT_LEDGER","usedBy":["preserved-package-build-attempts"]})
phase4={"schemaVersion":"APMATH_PHASE4_CURRENT_GRAPH_OVERVIEWS_v2","classification":"EXPERIMENTAL_CONTROLLED_FIXTURE_ONLY_NOT_PUBLICATION_SUPPORTED","status":"BOUNDED_FIXTURES_CURRENT_WITH_QUALIFICATION_DEBT",
 "compositeScopeFingerprint":COMPOSITE,"capabilityCount":9,"capabilityFingerprints":CAPS,"fixtures":fixture_records,
 "phase3Impact":{"path":imp["path"],"sha256":imp["sha256"],"candidates":impacts},
 "q10Disposition":{"path":q10ref["path"],"sha256":q10ref["sha256"],"canonicalRepairs":3,"isolatedCancellationRows":1,"notReplayed":True},
 "regression":{"path":regref["path"],"sha256":regref["sha256"],"node":"158/158; archive-cancel-recovery.test.mjs excluded","python":"186/186"},
 "constructionV1Operations":["POINT","LINE","MIDPOINT","PERPENDICULAR_FOOT","PARALLEL_THROUGH","ANGLE_BISECTOR_INTERNAL_EXTERNAL","CIRCLE_THROUGH_3","CIRCLE_THROUGH_POINT","TANGENT_AT_POINT","EXTERNAL_POINT_TANGENT_CONTACTS","LINE_INTERSECTION","CIRCLE_LINE_INTERSECTION","CIRCLE_CIRCLE_INTERSECTION","SELECT_POINT_BRANCH","SEGMENT_LENGTH","SCALAR_SQUARE","SCALAR_RATIO"],
 "constructionConditionAudits":["INCIDENCE_POINT_ON_LINE","DISTANCE_EQUALS","EQUAL_DISTANCE","MIDPOINT_RATIO","PERPENDICULAR","PARALLEL","CIRCLE_MEMBERSHIP","TANGENCY_AT_POINT","ORIENTED_SIDE"],
 "openBoundaries":["canonical UID v2 authority","general constraint solving","arbitrary conics","family-specific unsupported grammar and degeneracies in matrix","owner relocation controlled-fixture-only trigger"],
 "phase5":{"status":"BLOCKED_INPUT_REQUIRED","authority":"canonical UID v2 source registry and lineage","qualifiedUidCount":0,"seal":False,"active":False,"mergeToMain":False},
 "publicationSupported":False,"productionAuthorized":False,"active":False,"phase3ExitLedgerRef":external_sources["phase3Exit"],"externalCheckpointRefs":external_sources,"codeRefs":code_refs,"packageAttempts":{"path":attempt_ref["path"],"sha256":attempt_ref["sha256"],"preservedPartialBuilds":2}}
pref=write_json("phase4-ledger.json",phase4); entries.append({"originalRef":pref,"pathInPackage":pref["path"],"bytes":pref["bytes"],"sha256":pref["sha256"],"classification":"PACKAGE_LEDGER","usedBy":["bounded-phase4-scope"]})
builder=Path(".tmp/archive/phase4-current-package-final-v12-20261007")/EXAM/"visual-engine/production/build_current_p4_evidence.py"
bref=add_file(builder,"payload/tooling/build_current_p4_evidence.py","PACKAGE_BUILDER_SOURCE",["package-reproducibility"])
idx=write_json("evidence-index.json",{"schemaVersion":"APMATH_PHASE4_CURRENT_GRAPH_OVERVIEWS_INDEX_v2","classification":phase4["classification"],"entries":entries,"codeRefs":code_refs,"externalTrackedRefs":external_sources,"externalPackageRefs":external_packages,"builderSourceRef":bref,"fixtureNames":list(fixture_records),"qualifiedUidCount":0})
files=[]
for f in HP(PKG).rglob("*"):
 if f.is_file() and f.relative_to(HP(PKG)).as_posix()!="evidence-manifest.json":
  b=f.read_bytes(); files.append({"path":f.relative_to(HP(PKG)).as_posix(),"bytes":len(b),"sha256":H(b)})
files.sort(key=lambda x:x["path"])
manifest={"schemaVersion":"APMATH_PHASE4_CURRENT_GRAPH_OVERVIEWS_MANIFEST_v2","classification":phase4["classification"],"compositeScopeFingerprint":COMPOSITE,"files":files}
mref=write_json("evidence-manifest.json",manifest)
for row in files:
 b=RB(PKG/row["path"])
 if len(b)!=row["bytes"] or H(b)!=row["sha256"]: raise RuntimeError("MANIFEST_VERIFY:"+row["path"])
for row in entries:
 b=RB(PKG/row["pathInPackage"])
 if len(b)!=row["bytes"] or H(b)!=row["sha256"]: raise RuntimeError("INDEX_VERIFY:"+row["pathInPackage"])
for ref in code_refs+list(external_sources.values()):
 b=RB(ref["path"])
 if len(b)!=ref["bytes"] or H(b)!=ref["sha256"]: raise RuntimeError("SOURCE_REF_VERIFY:"+ref["path"])
print(json.dumps({"status":"PASS","package":PKG.as_posix(),"manifestFiles":len(files),"manifestBytes":sum(x["bytes"] for x in files),"manifestSha256":H(RB(PKG/"evidence-manifest.json")),"indexEntries":len(entries),"codeRefs":len(code_refs),"externalRefs":len(external_sources),"fixtures":{k:{"runId":v["runId"],"selected":v["selectedSizeClass"]} for k,v in fixture_records.items()},"q1":"UNRESOLVED / INVALID_SOURCE_CONDITION_BINDING / 0 repairs","coordinateFree":"UNRESOLVED / INVALID_SOURCE_CONDITION_BINDING / 3 repairs","q10Canonical":"UNRESOLVED / REPAIR_BUDGET_EXHAUSTED / 3 of 3","q10Isolated":"ARCHIVE_CAPTURE_CANCELLED / 1 isolated row / no capture","node":"158/158 excluding q10 cancellation test","python":"186/186","compositeScopeFingerprint":COMPOSITE},ensure_ascii=False,indent=2))
