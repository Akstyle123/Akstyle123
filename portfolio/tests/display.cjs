/* Display regressions: default entry works alone; no sections hidden by an iframe observer. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const http=require('node:http');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'ayush-open-test-'));
 const file=path.join(temp,'index.html');fs.copyFileSync(path.join(root,'index.html'),file);
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(path.join(root,'index.html')));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const context=await browser.newContext({offline:true,viewport:{width:1280,height:1000}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};});
  await page.goto(pathToFileURL(file).href);await page.waitForSelector('[data-reference-card="15"]');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.project-card').count(),16);assert.equal(await page.locator('.cert-card').count(),10);
  for(const state of await page.locator('.panel').evaluateAll(a=>a.map(e=>({class:e.className,opacity:+getComputedStyle(e).opacity,display:getComputedStyle(e).display})))){
   assert.ok(state.opacity>=.85&&state.display!=='none','Panel hidden with inactive observer: '+state.class);
  }
  const images=await page.locator('.hero img,.beyond-visual>img,.pass-card>img,.connect-portrait>img').evaluateAll(a=>a.map(e=>({ok:e.complete&&e.naturalWidth>0,src:e.getAttribute('src').slice(0,24)})));
  assert.equal(images.length,4);assert.ok(images.every(x=>x.ok),'Every portrait must load without an assets directory');
  await page.locator('[data-beyond="1"]').click();assert.equal(await page.locator('.source-writing').count(),1);
  await page.locator('[data-beyond="2"]').click();assert.equal(await page.locator('.beyond-members').count(),1);
  assert.deepEqual(errors,[]);await context.close();
  const live=await browser.newPage({viewport:{width:390,height:844}}),liveErrors=[];live.on('pageerror',e=>liveErrors.push(e.message));
  await live.route('https://api.github.com/**',r=>r.abort());
  await live.goto('http://127.0.0.1:'+server.address().port+'/');await live.waitForSelector('.cert-card');await live.evaluate(()=>document.fonts.ready);
  assert.equal(await live.locator('.project-card').count(),16);assert.equal(await live.evaluate(()=>document.documentElement.scrollWidth),390);
  assert.deepEqual(liveErrors,[]);
  console.log('PASS: index.html opens alone with zero network/asset dependencies; all 16 projects, 10 certs and 4 portraits render; every panel remains visible without observer callbacks; all 3 About states work; live HTTP mobile entry renders with no overflow or runtime errors.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
