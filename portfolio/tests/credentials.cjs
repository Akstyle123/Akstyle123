const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const data=require('../data/profile.json');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://api.github.com/**',r=>r.abort());
  await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);await page.waitForSelector('[data-native-credential]');await page.evaluate(()=>document.fonts.ready);
  const expected=['#2f7bff','#22e1ff','#2dff9a','#2dff9a','#22e1ff','#22e1ff','#22e1ff','#2f7bff','#ffc24b','#8b5cff'];
  assert.deepEqual(await page.locator('.cert-card').evaluateAll(a=>a.map(e=>e.style.getPropertyValue('--cert-color'))),expected);
  assert.equal(await page.locator('.credential-verified').count(),2);assert.equal(await page.locator('.credential-ribbon').count(),4);
  assert.equal(await page.locator('.credential-icon').count(),10);assert.equal(await page.locator('.credential-issuer-icon').count(),8);
  assert.equal(await page.locator('.credential-shine').count(),10);
  assert.equal(await page.locator('.credential-gold-ring').first().evaluate(e=>getComputedStyle(e).animationDuration),'36s');
  assert.equal(await page.locator('.cert-card:not(.nptel) .badge-symbol').first().evaluate(e=>getComputedStyle(e,':before').animationDuration),'24s');
  assert.equal(await page.locator('.credential-shine').first().evaluate(e=>getComputedStyle(e,':after').animationDuration),'6s');
  for(let i=0;i<10;i++){
   await page.locator(`[data-cert="${i}"]`).click();
   assert.equal(await page.locator('#dialog-body .dialog-actions a').first().getAttribute('href'),data.certifications[i].url);
   const id=data.certifications[i].url.split('/certificates/')[1]||new URL(data.certifications[i].url).searchParams.get('q');
   assert.ok((await page.locator('#dialog-body .verify-id').textContent()).includes(id));
   await page.locator('#close-dialog').click();
  }
  await page.locator('#certs').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  let a=await page.locator('.credential-gold-ring').first().evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(180);
  assert.notEqual(await page.locator('.credential-gold-ring').first().evaluate(e=>getComputedStyle(e).transform),a,'NPTEL ring must really rotate');
  await page.locator('.hero').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  assert.equal(await page.locator('#hero-photo').evaluate(e=>getComputedStyle(e).animationDuration),'7s');
  assert.equal(await page.locator('.scanline').evaluate(e=>getComputedStyle(e,':before').animationDuration),'9s');
  a=await page.locator('.profile-traveler').getAttribute('style');await page.waitForTimeout(180);
  assert.notEqual(await page.locator('.profile-traveler').getAttribute('style'),a,'Profile orbit light must travel');
  let mask=await page.locator('.scanline').evaluate(e=>getComputedStyle(e).maskImage);assert.ok(mask.includes('data:image/webp'));
  await page.locator('[data-portrait]:not(.active)').first().click();await page.waitForTimeout(80);
  assert.notEqual(await page.locator('.scanline').evaluate(e=>getComputedStyle(e).maskImage),mask,'Scan mask must follow the selected portrait');
  await page.locator('#motion-toggle').click();await page.mouse.move(0,0);a=await page.locator('.profile-traveler').getAttribute('style');await page.waitForTimeout(180);
  assert.equal(await page.locator('.profile-traveler').getAttribute('style'),a,'Pause must freeze profile traveler');
  await page.locator('#certs').scrollIntoViewIfNeeded();a=await page.locator('.credential-gold-ring').first().evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(180);
  assert.equal(await page.locator('.credential-gold-ring').first().evaluate(e=>getComputedStyle(e).transform),a,'Pause must freeze certificate rings');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.credential-gold-ring').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await page.locator('.scanline').evaluate(e=>getComputedStyle(e).display),'none');
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:950});await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);}
  assert.deepEqual(errors,[]);
  console.log('PASS: 10 source-colored/icon-matched credentials, 2 verified pills, 4 shaped ribbons, 10 shines; 24/36/6s effects; all 10 real issuer links/IDs; 7s portrait/9s masked scan; moving orbit light; selected-photo mask; pause/reduced-motion; 4 widths; zero runtime errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
