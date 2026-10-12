from pathlib import Path
p=Path(r'C:\Users\USER\Desktop\AP------\archive\analysis\codex-r1-24-suncheon-math1-20261011\R1.final-production-rebind\build-parity.mjs')
s=p.read_text(encoding='utf-8-sig')
old="""const wrapper=repair.wrapperSourceBytesBefore;const unwrapped=wrapper.slice(3,-4);if(!a.student.content.includes(wrapper))throw Error('Q07_OLD_WRAPPER_MISSING');const normalized=a.student.content.replace(wrapper,unwrapped);"""
new="""const oldContent=a.student.content;const start=oldContent.indexOf('<p><img src=\"'+ref+'\"');if(start<0)throw Error('Q07_OLD_WRAPPER_MISSING');const innerStart=start+3;const close=oldContent.indexOf('</p>',innerStart);if(close<0)throw Error('Q07_WRAPPER_CLOSE_MISSING');const imageMarkup=oldContent.slice(innerStart,close);if(!imageMarkup.startsWith('<img src=\"'+ref+'\"')||!imageMarkup.endsWith('>'))throw Error('Q07_WRAPPER_CONTENT_UNEXPECTED');const normalized=oldContent.slice(0,start)+imageMarkup+oldContent.slice(close+4);const wrapper='<p> … </p>';"""
if old not in s: raise SystemExit('old snippet missing')
p.write_text(s.replace(old,new),encoding='utf-8')
