async (page) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://api.github.com/**',r=>r.abort());
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:3002/');
 await page.waitForSelector('.welcome-intro');
 await page.waitForFunction(()=>document.querySelector('.welcome-word').textContent.includes('नमस्ते'));
 await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.welcome-word')).opacity)>.85);
 await page.screenshot({path:'/home/user/v61-welcome.png'});
 await page.waitForSelector('.welcome-intro',{state:'detached'});
 await page.waitForSelector('.role-signal');
 if(await page.locator('main').evaluate(e=>e.inert))throw Error('Intro did not release page');
 if(await page.locator('.banner-illustration').count()!==2)throw Error('Missing banner artwork');
 if(await page.locator('.contact-signal').count()!==1)throw Error('Missing contact waveform');
 const layers=await page.evaluate(()=>{const z=s=>Number(getComputedStyle(document.querySelector(s)).zIndex);return z('.hero-top')<z('.hero-body')&&z('.contact-floor')<z('.connect-portrait>img');});
 if(!layers)throw Error('Line/image layer ordering is wrong');
 await page.mouse.move(550,450);await page.waitForTimeout(200);
 if(await page.locator('.interactive-cursor').evaluate(e=>getComputedStyle(e).opacity)!=='1')throw Error('Desktop cursor inactive');
 await page.locator('.footer').scrollIntoViewIfNeeded();
 await page.waitForTimeout(2200);
 if(await page.locator('#signature-canvas').getAttribute('data-glowing')!=='false')throw Error('Signature glows before writing is finished');
 await page.waitForFunction(()=>{const c=document.querySelector("#signature-canvas");return c.dataset.glowing==="true"&&Number(c.dataset.writtenGlyphs)===12;},null,{timeout:18000});
 if(await page.locator('#signature-canvas').getAttribute('data-glowing')!=='true')throw Error('Completed signature is not glowing');
 await page.locator('#signature-canvas').screenshot({path:'/home/user/v61-signature.png'});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:1000});await page.waitForTimeout(150);
  if(await page.evaluate(()=>document.documentElement.scrollWidth)!==width)throw Error('Horizontal overflow at '+width);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('.section-banner').screenshot({path:'/home/user/v61-banner.png'});
 await page.locator('#connect').screenshot({path:'/home/user/v61-contact.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForSelector('.welcome-intro',{state:'detached'});
 if(await page.locator('.interactive-cursor').evaluate(e=>getComputedStyle(e).display)!=='none')throw Error('Reduced-motion cursor not hidden');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();await page.waitForSelector('.welcome-skip');await page.click('.welcome-skip');await page.waitForSelector('.welcome-intro',{state:'detached'});
 if(errors.length)throw Error(errors.join(';'));
 await page.evaluate(()=>{document.body.dataset.polishTests='passed';});
}
