/* V6 acceptance: real elapsed autoplay, native interaction, offline, and responsive flow. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});let errors=[];
 const load=async page=>{page.on('pageerror',e=>errors.push(e.message));await page.route('https://api.github.com/**',r=>r.abort());await page.goto(url);await page.waitForFunction(()=>window.CosmicUI);await page.evaluate(()=>document.fonts.ready);};
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050}});await load(page);
  assert.equal(await page.evaluate(()=>gsap.version),'3.13.0');
  assert.equal(await page.locator('.navigation .nav-symbol').count(),7);
  assert.equal(await page.locator('#hero-orbit-back,#hero-orbit-front').count(),2);
  assert.equal(await page.locator('#hero-orbit-back').evaluate(e=>getComputedStyle(e).zIndex),'1');
  assert.equal(await page.locator('#hero-photo').evaluate(e=>getComputedStyle(e).zIndex),'2');
  assert.equal(await page.locator('#hero-orbit-front').evaluate(e=>getComputedStyle(e).zIndex),'3');
  const first=await page.locator('[data-portrait].active').getAttribute('data-portrait');
  await page.waitForFunction(x=>document.querySelector('[data-portrait].active').dataset.portrait!==x,first,{timeout:7500});
  await page.waitForFunction(()=>CosmicUI.state.beyondIndex===1,null,{timeout:3500});
  await page.waitForFunction(()=>CosmicUI.state.terminalIndex===1,null,{timeout:6500});
  await page.waitForFunction(()=>CosmicUI.state.beyondIndex===2,null,{timeout:6000});
  assert.equal(await page.locator('.community-packet').count(),6);
  await page.click('[data-terminal="0"]');await page.waitForTimeout(300);
  let response=await page.locator('#terminal-body .response').evaluateAll(a=>a.map(e=>Number(getComputedStyle(e).opacity)));
  assert.ok(response.every(n=>n===0),'Responses should wait for their commands');
  await page.waitForFunction(()=>document.querySelector('#terminal-body').dataset.phase==='hold',null,{timeout:6000});
  assert.ok(await page.locator('#terminal-body p').evaluateAll(a=>a.every(e=>getComputedStyle(e).opacity==='1')));
  await page.waitForFunction(()=>document.querySelector('#terminal-body').dataset.phase==='clear',null,{timeout:4500});
  const clearing=await page.locator('#terminal-body p').evaluateAll(a=>a.map(e=>getComputedStyle(e).opacity));assert.equal(new Set(clearing).size,1,'All commands clear together');
  await page.locator('#stack').scrollIntoViewIfNeeded();await page.locator('.stack-orbit').hover();
  let pos=await page.locator('.orbit-node').first().getAttribute('style');await page.waitForTimeout(260);assert.notEqual(await page.locator('.orbit-node').first().getAttribute('style'),pos,'Orbit must continue under mouse');
  // First visit to the footer must start from a blank/partial capital A, not a complete name.
  await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(120);
  assert.ok(Number(await page.locator('#signature-canvas').getAttribute('data-written-glyphs'))<3);
  await page.waitForTimeout(2000);let written=Number(await page.locator('#signature-canvas').getAttribute('data-written-glyphs'));assert.ok(written>0&&written<12);
  await page.waitForTimeout(4400);assert.equal(Number(await page.locator('#signature-canvas').getAttribute('data-written-glyphs')),12);
  await page.locator('#signature-canvas').screenshot({path:'/home/user/v6-signature.png'});
  await page.click('[data-stats-tab="github"]');await page.waitForTimeout(2100);
  for(const width of [320,390,768,1000,1280,1440]){
   await page.setViewportSize({width,height:1050});await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
   const bounds=await page.evaluate(()=>{const rect=s=>{let r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};};return {panel:rect('#stats'),chart:rect('.chart-layout'),langs:rect('#stat-breakdown'),topics:rect('.topics-header'),note:rect('#stats-note')};});
   assert.ok(bounds.langs.bottom<=bounds.chart.bottom+1,`Languages inside chart at ${width}`);
   assert.ok(bounds.langs.bottom<bounds.topics.top,`Languages must not overlap topics at ${width}`);
   assert.ok(bounds.note.bottom<=bounds.panel.bottom,`Footnote inside dashboard at ${width}`);
  }
  await page.setViewportSize({width:1440,height:1050});await page.locator('#stats').screenshot({path:'/home/user/v6-stats-final.png'});
  await page.click('#theme-toggle');assert.ok(await page.locator('body').evaluate(e=>e.classList.contains('light')));
  assert.ok(await page.locator('#cosmic-sky').evaluate(e=>e.getContext('2d').getImageData(0,0,e.width,e.height).data.some((v,i)=>i%4===3&&v>0)));
  await page.locator('.hero').scrollIntoViewIfNeeded();await page.screenshot({path:'/home/user/v6-light.png'});
  // New issuers require JSON only; no SVG/reference-asset registration or hardcoded filters.
  await page.evaluate(()=>{profile.certifications.push({title:'Test-only dynamic credential',issuer:'Example Academy',type:'academy',color:'#22e1ff',icon:'award',period:'2026',credentialId:'TEST-ONLY',url:'https://example.com/credential'});renderCerts();});
  await page.waitForSelector('[data-cert-filter="academy"]');await page.click('[data-cert-filter="academy"]');assert.equal(await page.locator('.cert-card').count(),1);
  await page.waitForSelector('.cert-card[data-cosmic-card="true"]');await page.click('.cert-card');assert.match(await page.locator('#dialog-body').innerText(),/TEST-ONLY/);await page.keyboard.press('Escape');
  await page.click('#motion-toggle');const frozen=await page.locator('[data-portrait].active').getAttribute('data-portrait');await page.waitForTimeout(5100);assert.equal(await page.locator('[data-portrait].active').getAttribute('data-portrait'),frozen);
  assert.ok(await page.locator('#terminal-body p').evaluateAll(a=>a.every(e=>getComputedStyle(e).opacity==='1')));
  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await load(mobile);await mobile.locator('#stats').scrollIntoViewIfNeeded();await mobile.click('[data-stats-tab="github"]');await mobile.locator('#stats').screenshot({path:'/home/user/v6-mobile-stats.png'});
  assert.equal(await mobile.locator('.card-aura').first().evaluate(e=>getComputedStyle(e,'::before').animationName),'none');
  assert.ok(await mobile.locator('#terminal-body p').evaluateAll(a=>a.every(e=>getComputedStyle(e).opacity==='1')));
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
  await mobile.click('#theme-toggle');assert.ok(await mobile.locator('body').evaluate(e=>e.classList.contains('light')));
  assert.deepEqual(errors,[]);
  console.log('PASS V6: actual portrait/About/Think-Build-Ship autoplay; sequential terminal and simultaneous clearing; hover never stops orbit; layered hero; first-visible 12-glyph handwriting; six-width GitHub containment; both space themes; dynamic custom certificate/filter/glow/dialog; pause, reduced motion, mobile, offline, zero runtime errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
