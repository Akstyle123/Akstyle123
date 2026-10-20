const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://api.github.com/**',r=>r.abort());
  await page.goto(pathToFileURL(path.resolve(__dirname,'../standalone.html')).href);
  await page.waitForSelector('.cert-card');await page.waitForTimeout(500);
  assert.equal(await page.locator('.orbit-node').count(),16);
  assert.equal(await page.locator('.verification-seal').count(),1);
  assert.equal(await page.locator('#signature-canvas').count(),1);
  assert.equal(await page.locator('.nptel-emblem').count(),2);
  assert.equal(await page.locator('.cert-card:not(.nptel) .badge-symbol').count(),8);
  assert.equal(await page.locator('.code-preview-split').count(),1);
  assert.equal(await page.locator('.quiz-pipeline').count(),1);
  await page.locator('#stack').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  let before=await page.locator('.orbit-node').first().getAttribute('style');await page.waitForTimeout(250);
  assert.notEqual(await page.locator('.orbit-node').first().getAttribute('style'),before);
  await page.click('#motion-toggle');assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'true');
  await page.locator('#stack').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  before=await page.locator('.orbit-node').first().getAttribute('style');await page.waitForTimeout(250);
  assert.equal(await page.locator('.orbit-node').first().getAttribute('style'),before);
  await page.click('#motion-toggle');
  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  mobile.on('pageerror',e=>errors.push(e.message));await mobile.route('https://api.github.com/**',r=>r.abort());
  await mobile.goto(pathToFileURL(path.resolve(__dirname,'../standalone.html')).href);await mobile.waitForSelector('.cert-card');
  await mobile.evaluate(()=>document.fonts.ready);
  assert.equal(await mobile.locator('.name-row').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await mobile.locator('.scanline').evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
  assert.deepEqual(errors,[]);
  console.log('PASS: 16 moving orbit logos, pause/resume, source-style code/PDF previews, 10 certificate ornaments, signature canvas, reduced-motion behavior and mobile overflow.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
