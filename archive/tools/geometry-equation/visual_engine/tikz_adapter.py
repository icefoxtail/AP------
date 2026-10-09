"""Optional structured vector draft. Compilation never grants visual PASS."""
from pathlib import Path
import hashlib
import shutil
import subprocess
from .math_expression import parse,serialize

def text(value):
    escapes={'\\':r'\textbackslash{}','{':r'\{','}':r'\}','%':r'\%','&':r'\&','#':r'\#','_':r'\_','$':r'\$','^':r'\textasciicircum{}','~':r'\textasciitilde{}'}
    return ''.join(escapes.get(c,c) for c in value)

def draft(prepared,layout):
    """Draw Python-prepared coordinates without a second geometry authority."""
    rows=[r'\documentclass{standalone}',r'\usepackage{fontspec}',
          r'\IfFontExistsTF{Malgun Gothic}{\setmainfont{Malgun Gothic}}{\setmainfont{Latin Modern Roman}}',
          r'\usepackage{amsmath}',r'\usepackage{tikz}',r'\begin{document}',r'\begin{tikzpicture}[x=1pt,y=-1pt]']
    coord=lambda p:'('+f'{p[0]:.9f},{p[1]:.9f}'+')'
    for p in sorted(prepared['primitives'],key=lambda v:v['layer']):
        if p['kind']=='line':rows.append(r'\draw '+coord(p['from'])+' -- '+coord(p['to'])+';')
        elif p['kind']=='circle':rows.append(r'\draw '+coord(p['at'])+f' circle[radius={p["radius"]:.9f}pt];')
        elif p['kind'] in {'polyline','polygon'}:
            rows.append(r'\draw '+' -- '.join(coord(v) for v in p['points'])+(' -- cycle' if p['kind']=='polygon' else '')+';')
        else:raise ValueError('TIKZ_UNSUPPORTED_PRIMITIVE')
    for label in layout['labels']:
        if label.get('sourceMath'):content='$'+serialize(parse(label['sourceMath']))+'$'
        elif label.get('renderedLines'):content=r'\shortstack[l]{'+r'\\'.join('$'+serialize(parse(v['text']))+'$' if v['math'] else text(v['text']) for v in label['renderedLines'])+'}'
        elif label.get('lines'):content=r'\shortstack[l]{'+r'\\'.join(text(v) for v in label['lines'])+'}'
        else:content=text(label['text'])
        rows.append(r'\node[anchor=base west] at '+coord(label['baseline'])+' {'+content+'};')
    rows.extend([r'\end{tikzpicture}',r'\end{document}'])
    return '\n'.join(rows)+'\n'

def compile_candidate(source,output_dir):
    candidate_root=Path(__file__).resolve().parents[4]/'.tmp/archive'
    output_dir=Path(output_dir).resolve()
    relative=output_dir.relative_to(candidate_root.resolve()) if output_dir.is_relative_to(candidate_root.resolve()) else None
    if relative is None or len(relative.parts)<3 or relative.parts[0] in {'.','..'} or relative.parts[1] in {'.','..'}:raise ValueError('PRODUCTION_WRITE_FORBIDDEN')
    xelatex,dvisvgm=shutil.which('xelatex'),shutil.which('dvisvgm')
    if not xelatex or not dvisvgm:
        return {'backend':'TIKZ','status':'DISABLED_MISSING_OPTIONAL_TOOLCHAIN','publishable':False}
    output_dir.mkdir(parents=True,exist_ok=True)
    (output_dir/'draft.tex').write_text(source,encoding='utf-8')
    commands=[[xelatex,'-no-shell-escape','-no-pdf','-interaction=nonstopmode','-halt-on-error','draft.tex'],[dvisvgm,'--no-fonts','--output=draft.svg','draft.xdv']]
    for index,cmd in enumerate(commands):
        result=subprocess.run(cmd,cwd=output_dir,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=120)
        (output_dir/f'compile-{index}.log').write_text(result.stdout+result.stderr,encoding='utf-8')
        if result.returncode:return {'backend':'TIKZ','status':'COMPILE_FAIL','publishable':False,'exit':result.returncode}
    return {'backend':'TIKZ','status':'CANDIDATE_REQUIRES_COMMON_QA','publishable':False,
            'svgSha256':hashlib.sha256((output_dir/'draft.svg').read_bytes()).hexdigest(),
            'requiredGates':['ACTUAL_SVG_PARITY','DISPLAYED_MATH_PARITY','RENDERED_LAYOUT','ARCHIVE_RENDER']}
