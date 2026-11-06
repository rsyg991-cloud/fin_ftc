from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium
import zipfile, xml.etree.ElementTree as ET
base=Path('C:/Users/Rsaee/Downloads')
out=Path('work')
files=[base/'حضور الفعاليات.pdf',base/'Ftc User3.pdf',base/'PRD.pdf',next(base.glob('%D8%AF%D9%84%D9%8A%D9%84_*.pdf'))]
for i,p in enumerate(files):
 r=PdfReader(p)
 text='\n'.join(f'\nPAGE {j+1}\n'+(q.extract_text() or '') for j,q in enumerate(r.pages))
 (out/f'source{i}.txt').write_text(text,encoding='utf8')
 d=pdfium.PdfDocument(str(p))
 for j in range(len(d)):
  d[j].render(scale=1).to_pil().save(out/f'source{i}-{j+1}.png')
 print(i,p.name,'pages',len(r.pages),text[:1500])
p=base/'نسخة للجنة التقنية.xlsx'
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(p) as z:
 strings=[]
 if 'xl/sharedStrings.xml' in z.namelist():
  strings=[''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml'))]
 parts=[]
 for n in z.namelist():
  if n.startswith('xl/worksheets/sheet') and n.endswith('.xml'):
   rows=[]
   for row in ET.fromstring(z.read(n)).findall('.//m:row',ns):
    vals=[]
    for c in row:
     v=c.find('m:v',ns)
     t=v.text if v is not None else ''.join(c.itertext())
     if c.get('t')=='s':t=strings[int(t)]
     if t: vals.append(c.get('r')+': '+t)
    if vals:rows.append(' | '.join(vals))
   parts.append(n+'\n'+'\n'.join(rows))
 (out/'spreadsheet.txt').write_text('\n'.join(parts),encoding='utf8')
