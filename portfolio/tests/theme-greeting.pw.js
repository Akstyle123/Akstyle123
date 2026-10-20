async(page)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://api.github.com/**',r=>r.abort());
 await page.addInitScript(()=>{window.greetingSeen=[];new MutationObserver(()=>{const e=document.querySelector('.welcome-word');if(e&&window.greetingSeen.at(-1)!==e.textContent)window.greetingSeen.push(e.textContent);}).observe(document,{childList:true,subtree:true});});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:3002/');await page.waitForSelector('.welcome-word');
 if(await page.locator('.welcome-intro').evaluate(e=>getComputedStyle(e).backgroundColor)!=='rgb(3, 7, 17)')throw Error('Dark greeting not matched');
 await page.screenshot({path:'/home/user/greeting-space-dark.png'});
 await page.waitForSelector('.welcome-intro',{state:'detached'});
 const expected=['Hello 👋','Bonjour 🇫🇷','Ciao 🇮🇹','Olà 🇵🇹','やあ 🇯🇵','Hallå 🇸🇪','Guten tag 🇩🇪','नमस्ते 🇮🇳','Hello 👋'];if(JSON.stringify(await page.evaluate(()=>greetingSeen))!==JSON.stringify(expected))throw Error('Greeting sequence changed');
 await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(900);if(await page.locator('#signature-canvas').getAttribute('data-glowing')!=='false')throw Error('Early glow');
 await page.waitForFunction(()=>{const e=document.querySelector('#signature-canvas');return e.dataset.glowing==='true'&&e.dataset.writtenGlyphs==='12';},null,{timeout:18000});
 await page.click('#theme-toggle');await page.goto('http://127.0.0.1:3002/');await page.waitForSelector('.welcome-word');
 if(await page.locator('.welcome-intro').evaluate(e=>getComputedStyle(e).backgroundColor)!=='rgb(240, 245, 255)')throw Error('Light greeting not matched');
 await page.screenshot({path:'/home/user/greeting-space-light.png'});await page.click('.welcome-skip');await page.waitForSelector('.welcome-intro',{state:'detached'});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:950});if(await page.evaluate(()=>document.documentElement.scrollWidth)!==width)throw Error('Overflow '+width);}
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForSelector('.welcome-intro',{state:'detached'});if(await page.locator('main').evaluate(e=>e.inert))throw Error('Main stayed inert');
 if(errors.length)throw Error(errors.join(';'));
}
