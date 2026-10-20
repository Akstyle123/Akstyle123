"""Create one standalone HTML with local styles, libraries, images, fonts & data.
The normal multi-file source remains editable. Run: python scripts/bundle.py
"""
from pathlib import Path
import base64
import json
import re
ROOT=Path(__file__).resolve().parents[1]

def uri(file):
    ext=file.suffix
    mime={'.webp':'image/webp','.ttf':'font/ttf','.jpg':'image/jpeg','.png':'image/png','.mp3':'audio/mpeg'}[ext]
    return 'data:'+mime+';base64,'+base64.b64encode(file.read_bytes()).decode()

def replace_assets(text, assets):
    for name,data in assets.items():text=text.replace('assets/'+name,data)
    return text

def build():
    assets={f.name:uri(f) for f in (ROOT/'assets').iterdir() if f.suffix in ['.webp','.ttf','.mp3']}
    page=(ROOT/'source.html').read_text()
    css=(ROOT/'styles.css').read_text()
    for name,data in assets.items():css=css.replace('assets/'+name,data)
    page=page.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
    page=page.replace('<link rel="stylesheet" href="fidelity.css">','<style>'+replace_assets((ROOT/'fidelity.css').read_text(),assets)+'</style>')
    page=page.replace('<link rel="stylesheet" href="reference.css">','<style>'+replace_assets((ROOT/'reference.css').read_text(),assets)+'</style>')
    page=page.replace('<link rel="stylesheet" href="credentials.css">','<style>'+replace_assets((ROOT/'credentials.css').read_text(),assets)+'</style>')
    page=page.replace('<link rel="stylesheet" href="modern.css">','<style>'+replace_assets((ROOT/'modern.css').read_text(),assets)+'</style>')
    for script in ['website/lucide.min.js','website/chart.umd.js','website/qrcode.js','website/visual-data.js','reference.js','motion.js','app.js','website/gsap.min.js','modern.js','audio.js']:
        page=page.replace(f'<script src="{script}" defer></script>','')
    for name,data in assets.items():page=page.replace('assets/'+name,data)
    bundled={'profile':json.loads((ROOT/'data/profile.json').read_text()),'github':json.loads((ROOT/'data/github.json').read_text())}
    code='window.__BUNDLED_DATA__='+json.dumps(bundled)+';window.__ASSETS__='+json.dumps(assets)+';\n'
    for script in ['website/lucide.min.js','website/chart.umd.js','website/qrcode.js','website/visual-data.js','reference.js','motion.js','app.js','website/gsap.min.js','modern.js','audio.js']:
        s=(ROOT/script).read_text()
        for name,data in assets.items():s=s.replace('assets/'+name,data)
        code+=s+'\n;\n'
    # Avoid accidental HTML script termination in any bundled source/data string.
    code=re.sub(r'</script',r'<\\/script',code,flags=re.I)
    page=page.replace('</body>','<script>'+code+'</script></body>')
    (ROOT/'standalone.html').write_text(page)
    (ROOT/'index.html').write_text(page)
    print(f'Built self-contained index.html + standalone.html: {len(page):,} characters')

if __name__=='__main__':build()
