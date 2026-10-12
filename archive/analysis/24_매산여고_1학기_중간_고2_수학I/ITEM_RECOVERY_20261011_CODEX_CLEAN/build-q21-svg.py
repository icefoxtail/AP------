from pathlib import Path
import json, math, hashlib, xml.etree.ElementTree as ET

root = Path.cwd()
freeze_path = root / 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-replacement-freeze.json'
before_path = root / 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-before-snapshot.json'
svg_rel = 'archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-recovery.svg'
evidence_rel = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-visual-geometry-evidence.json'
freeze = json.loads(freeze_path.read_text(encoding='utf-8'))
before = json.loads(before_path.read_text(encoding='utf-8'))
solution = freeze['student']['solution']
solution_sha = hashlib.sha256(solution.encode('utf-8')).hexdigest()

# Function: h(x)=3+2*cos(pi/2*(x-1)); render the assigned domain [4,8].
W, H = 760, 400
x_min, x_max = 3.5, 8.5
y_min, y_max = 0.0, 6.0
plot_left, plot_right = 100.0, 700.0
plot_top, plot_bottom = 80.0, 320.0
sx = (plot_right - plot_left) / (x_max - x_min)
sy = (plot_bottom - plot_top) / (y_max - y_min)
def px(x): return plot_left + (x - x_min) * sx
def py(y): return plot_bottom - (y - y_min) * sy
def h(x): return 3 + 2 * math.cos(math.pi / 2 * (x - 1))

samples = 160
curve = []
for i in range(samples + 1):
    x = 4 + 4 * i / samples
    curve.append((x, h(x), px(x), py(h(x))))
path_d = 'M ' + ' L '.join(f'{xv:.3f} {yv:.3f}' for _, _, xv, yv in curve)

# Use SVG primitives derived from the coordinate model and the exact function.
points = {x: h(x) for x in [4, 5, 6, 7, 8]}
colors = {'ink': '#172033', 'curve': '#2563eb', 'max': '#d97706', 'min': '#059669', 'guide': '#94a3b8', 'panel': '#f8fafc'}
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="760" height="400" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="한 주기에서의 최댓값과 최솟값"
 data-graph-style-version="AP_GRAPH_PRINT_V1_1_DRAFT" data-graph-preset="SOLUTION_GRAPH" data-axis-scale-mode="UNEQUAL_UNIT_DECLARED" data-visual-provenance="q21-direct-replacement-function-facts">
 <rect x="0" y="0" width="760" height="400" rx="18" fill="#ffffff"/>
 <text x="52" y="42" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="21" font-weight="700" fill="{colors['ink']}">한 주기에서의 최댓값과 최솟값</text>
 <text x="700" y="62" text-anchor="end" font-family="STIX Two Math, Cambria Math, serif" font-size="17" font-style="italic" fill="{colors['ink']}">h(x)</text>
 <rect x="70" y="74" width="650" height="276" rx="12" fill="{colors['panel']}"/>
 <line x1="{plot_left}" y1="{py(3):.1f}" x2="{plot_right}" y2="{py(3):.1f}" stroke="{colors['guide']}" stroke-width="1.1" stroke-dasharray="5 5"/>
 <text x="82" y="{py(3)-7:.1f}" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="13" fill="#475569">중심선 3</text>
 <line x1="{plot_left}" y1="{plot_bottom}" x2="{plot_right+10}" y2="{plot_bottom}" stroke="{colors['ink']}" stroke-width="1.5"/>
 <path d="M {plot_right+10} {plot_bottom} l -8 -4 l 0 8 z" fill="{colors['ink']}"/>
 <text x="{plot_right+18}" y="{plot_bottom+5}" font-family="STIX Two Math, Cambria Math, serif" font-size="16" font-style="italic" fill="{colors['ink']}">x</text>
 <line x1="{plot_left}" y1="{plot_top}" x2="{plot_left}" y2="{plot_bottom}" stroke="{colors['ink']}" stroke-width="1.4"/>
 <text x="{plot_left-8}" y="{plot_top-10}" text-anchor="end" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="14" fill="{colors['ink']}">h(x)</text>
 <line x1="{plot_left}" y1="{py(5):.1f}" x2="{plot_right}" y2="{py(5):.1f}" stroke="#e2e8f0" stroke-width="0.8"/>
 <line x1="{plot_left}" y1="{py(1):.1f}" x2="{plot_right}" y2="{py(1):.1f}" stroke="#e2e8f0" stroke-width="0.8"/>
 <line x1="{px(5):.1f}" y1="{py(5):.1f}" x2="{px(5):.1f}" y2="{plot_bottom}" stroke="{colors['max']}" stroke-width="1.0" stroke-dasharray="4 4"/>
 <line x1="{px(7):.1f}" y1="{py(1):.1f}" x2="{px(7):.1f}" y2="{plot_bottom}" stroke="{colors['min']}" stroke-width="1.0" stroke-dasharray="4 4"/>
 <path d="{path_d}" fill="none" stroke="{colors['curve']}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
'''
# Extremum and endpoint points are exact graph samples.
for x in [4, 8]:
    svg += f' <circle cx="{px(x):.1f}" cy="{py(points[x]):.1f}" r="4.0" fill="#ffffff" stroke="{colors["curve"]}" stroke-width="1.8" data-point="endpoint-{x}"/>\n'
svg += f''' <circle cx="{px(5):.1f}" cy="{py(points[5]):.1f}" r="5.3" fill="{colors['max']}" stroke="#ffffff" stroke-width="1.8" data-point="maximum-5-5"/>
 <circle cx="{px(7):.1f}" cy="{py(points[7]):.1f}" r="5.3" fill="{colors['min']}" stroke="#ffffff" stroke-width="1.8" data-point="minimum-7-1"/>
 <text x="{px(5)+12:.1f}" y="{py(5)-15:.1f}" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="16" font-weight="700" fill="{colors['max']}">최댓값 5</text>
 <text x="{px(7)+12:.1f}" y="{py(1)+24:.1f}" font-family="Malgun Gothic, Noto Sans KR, sans-serif" font-size="16" font-weight="700" fill="{colors['min']}">최솟값 1</text>
'''
for x in [4, 5, 6, 7, 8]:
    svg += f' <line x1="{px(x):.1f}" y1="{plot_bottom-4}" x2="{px(x):.1f}" y2="{plot_bottom+4}" stroke="{colors["ink"]}" stroke-width="1.1"/>\n'
    svg += f' <text x="{px(x):.1f}" y="{plot_bottom+25}" text-anchor="middle" font-family="STIX Two Math, Cambria Math, serif" font-size="14" fill="{colors["ink"]}">{x}</text>\n'
for y in [1, 3, 5]:
    svg += f' <line x1="{plot_left-4}" y1="{py(y):.1f}" x2="{plot_left+4}" y2="{py(y):.1f}" stroke="{colors["ink"]}" stroke-width="1.1"/>\n'
    svg += f' <text x="{plot_left-10}" y="{py(y)+5:.1f}" text-anchor="end" font-family="STIX Two Math, Cambria Math, serif" font-size="14" fill="{colors["ink"]}">{y}</text>\n'
svg += '</svg>\n'
svg_bytes = svg.encode('utf-8')
svg_path = root / svg_rel
svg_path.write_bytes(svg_bytes)
ET.fromstring(svg_bytes)

expected = {4: 3.0, 5: 5.0, 6: 3.0, 7: 1.0, 8: 3.0}
observed = {x: h(x) for x in expected}
peak = max(curve, key=lambda item: item[1])
trough = min(curve, key=lambda item: item[1])
# The uniform sampling includes x=5 and x=7 exactly; expected points and labels are bound by explicit data-point ids.
assert abs(peak[0] - 5) < 1e-12 and abs(peak[1] - 5) < 1e-12
assert abs(trough[0] - 7) < 1e-12 and abs(trough[1] - 1) < 1e-12
assert all(abs(observed[x] - expected[x]) < 1e-12 for x in expected)
# Pixel-space maximum chord error bound for cosine sampling: A*sy*omega^2*dx^2/8.
step = 4 / samples
max_chord_error_bound_px = 2 * sy * (math.pi / 2) ** 2 * step ** 2 / 8
assert max_chord_error_bound_px <= 0.35

svg_sha = hashlib.sha256(svg_bytes).hexdigest()
evidence = {
  'schemaVersion': 'ITEM_RECOVERY_Q21_VISUAL_GEOMETRY_EVIDENCE_V1',
  'qid': 21,
  'sourceRawSha256': before['artifactRawSha256'],
  'solutionSha256': solution_sha,
  'svgPath': svg_rel.replace('archive/', ''),
  'svgSha256': svg_sha,
  'svgByteLength': len(svg_bytes),
  'xmlParse': 'PASS',
  'visualDisposition': 'ADD_NEW_VISUAL',
  'pythonInputs': {'A': 3, 'B': 2, 'omega': 'pi/2', 'phaseShift': 1, 'domain': [4, 8], 'sampleCount': samples, 'canvas': [W, H]},
  'pythonCalculatedOutputs': {'maxPoint': [5, 5], 'minPoint': [7, 1], 'endpointValues': [3, 3], 'period': 4, 'maxChordErrorBoundPx': max_chord_error_bound_px},
  'coordinateModel': {'px': '100 + 120*(x-3.5)', 'py': '320 - 40*y', 'originX': 100, 'originY': 320, 'sx': 120, 'sy': 40, 'xWindow': [3.5, 8.5], 'yWindow': [0, 6]},
  'sourceConditionCoverage': ['exact formula h(x)=3+2cos(pi/2*(x-1))', 'closed interval 4<=x<=8', 'amplitude 2 and centerline 3'],
  'decisiveRelationCovered': True,
  'uncoveredCriticalConditions': [],
  'expectedFactCompletenessStatus': 'PASS',
  'expectedFacts': [
    {'role':'GIVEN','fact':'h(4)=3','coordinate':[4,3]},
    {'role':'CONCLUSION','fact':'unique maximum h(5)=5','coordinate':[5,5]},
    {'role':'DERIVED_INTERMEDIATE','fact':'h(6)=3','coordinate':[6,3]},
    {'role':'CONCLUSION','fact':'unique minimum h(7)=1','coordinate':[7,1]},
    {'role':'GIVEN','fact':'h(8)=3','coordinate':[8,3]},
  ],
  'actualSvgPrimitives': {'functionPathSamples': samples+1, 'functionPathD': path_d, 'extremumMarkers': [{'id':'maximum-5-5','cx':px(5),'cy':py(5)},{'id':'minimum-7-1','cx':px(7),'cy':py(1)}], 'endpointMarkers':[{'id':'endpoint-4','cx':px(4),'cy':py(3)},{'id':'endpoint-8','cx':px(8),'cy':py(3)}]},
  'observedFacts': [
    {'fact':'maximum sample','observed':[peak[0],peak[1]],'expected':[5,5],'delta':[peak[0]-5,peak[1]-5]},
    {'fact':'minimum sample','observed':[trough[0],trough[1]],'expected':[7,1],'delta':[trough[0]-7,trough[1]-1]},
    {'fact':'equal endpoint heights','observed':[observed[4],observed[8]],'expected':[3,3],'delta':[0,0]},
  ],
  'factVisualizations': [
    {'fact':'given domain','role':'GIVEN','encoding':'interval x=4..8'},
    {'fact':'maximum at (5,5)','role':'CONCLUSION','encoding':'orange point plus vertical dashed guide'},
    {'fact':'minimum at (7,1)','role':'CONCLUSION','encoding':'green point plus vertical dashed guide'},
    {'fact':'endpoint values both 3','role':'DERIVED_INTERMEDIATE','encoding':'open outlined endpoint markers on curve'},
  ],
  'sourceSemanticIdentity': {'applicable':False,'checks':[]},
  'actualRender': 'NOT_RUN_ITEM_RECOVERY; next R3 owns student-engine render review',
}
(root / evidence_rel).write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'svgPath':svg_rel,'svgSha256':svg_sha,'svgBytes':len(svg_bytes),'solutionSha256':solution_sha,'maxChordErrorBoundPx':max_chord_error_bound_px,'geometryEvidence':evidence_rel,'xmlParse':'PASS'}, ensure_ascii=False))

