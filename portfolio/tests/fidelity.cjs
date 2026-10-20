/* Whole-page regression checks against the original source geometry/content. */
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://api.github.com/**',r=>r.abort());
  await page.goto(pathToFileURL(path.resolve(__dirname,'../standalone.html')).href);
  await page.waitForSelector('[data-reference-card="15"]');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('[data-reference-card]').count(),16);
  for(const [selector,height] of Object.entries({'.hero':660,'.about-panel':700,'.beyond-panel':700,'.stack-section':700,'.section-banner':176,'.more-banner':176,'.journey-section':660,'.dashboard':830,'.achievement-section':580,'.certification-header':196,'.connect':850,'.footer':330})){
   const actual=await page.locator(selector).evaluate(e=>e.getBoundingClientRect().height);
   assert.ok(Math.abs(actual-height)<1,`${selector}: source ${height}, actual ${actual}`);
  }
  for(const [selector,w,h] of [['.featured-grid .project-card',588,392],['.more-grid .project-card',588,239.12],['.cert-card.nptel',588,294],['.cert-card:not(.nptel)',288,343.38]]){
   for(const r of await page.locator(selector).evaluateAll(a=>a.map(e=>({w:e.offsetWidth,h:e.getBoundingClientRect().height})))){
    assert.ok(Math.abs(r.w-w)<1&&Math.abs(r.h-h)<1,selector+' card proportion');
   }
  }
  assert.equal(await page.locator('#coding-links>a').count(),6);
  assert.equal(await page.locator('#contact-buttons>a').count(),7);
  assert.equal(await page.locator('#achievements #coding-links').count(),0,'Coding buttons belong outside the panel');
  assert.equal(await page.locator('.timeline .milestone-icon').count(),6);
  for(let i=0;i<3;i++){
   await page.locator(`[data-beyond="${i}"]`).click();
   assert.equal(await page.locator('#beyond-visual>img').count(),1,'Portrait must persist in every About slide');
   assert.equal(await page.locator('.beyond-handle').count(),1);
  }
  await page.locator('[data-beyond="0"]').click();assert.equal(await page.locator('.heatmap button').count(),84);
  const ai=await page.locator('.ai-universe').evaluate(e=>e.getBoundingClientRect().width);
  assert.ok(ai>170,'AI illustration must not collapse to zero width');
  await page.locator('#motion-toggle').click();
  for(const selector of ['#stack','#journey','#stats','#achievements','#connect','.footer']){
   await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(50);
   assert.equal(await page.locator(selector).evaluate(e=>getComputedStyle(e).opacity),'1','Paused sections must stay readable: '+selector);
  }
  for(const track of await page.locator('.odometer-track').all()){
   const value=await track.evaluate(e=>({digit:+getComputedStyle(e).getPropertyValue('--digit'),y:new DOMMatrixReadOnly(getComputedStyle(e).transform).m42}));
   assert.ok(Math.abs(value.y+value.digit*60)<1,'Paused odometer must show actual value, not zero');
  }
  const terminal=await page.locator('.terminal-body .response').evaluateAll(a=>a.map(e=>getComputedStyle(e).opacity));
  assert.ok(terminal.every(x=>x==='1'),'Paused terminal replies should remain readable');
  await page.locator('#motion-toggle').click();
  await page.locator('#stats').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  const before=await page.locator('.ai-orb').evaluate(e=>getComputedStyle(e).transform);
  await page.waitForTimeout(150);
  assert.notEqual(await page.locator('.ai-orb').evaluate(e=>getComputedStyle(e).transform),before,'Miniatures must actually animate');
  // The application never embeds a complete original SVG card or section.
  assert.equal(await page.locator('img[src*="github-profile/assets"],object,embed,iframe').count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: complete 16-preview/3-slide audit; original desktop panel/card proportions; 6 coding + 7 contact buttons; 84 heatmap cells; 6 journey icons; readable paused sections/counters/terminal; moving miniature; no whole-panel SVGs.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
