"""Rebuild local PDF assets without modifying the originals. Requires Poppler."""
from pathlib import Path
import json, re, shutil, subprocess
root=Path(__file__).resolve().parent.parent
out=root/'public/documents';out.mkdir(parents=True,exist_ok=True)
manifest=[]
for p in sorted(root.glob('*.pdf')):
    chapter=int(p.name[:2]); kind='course' if 'Cours' in p.name else 'bac'
    id=f'{chapter}-{kind}'
    shutil.copy2(p,out/f'{id}.pdf')
    result=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,check=True)
    pages=result.stdout.split('\f')
    if not pages[-1].strip():pages.pop()
    manifest.append(dict(id=id,chapter=chapter,kind=kind,name=p.name,url=f'/documents/{id}.pdf',pages=pages))
(root/'src/data/sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f'{len(manifest)} PDF préparés, {sum(len(d["pages"]) for d in manifest)} pages. Originaux conservés.')
