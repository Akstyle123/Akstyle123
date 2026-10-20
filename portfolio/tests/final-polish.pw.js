async (page) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://api.github.com/**',r=>r.abort());
 await page.addInitScript(()=>{window.greetingSeen=[];new MutationObserver(()=>{const e=document.querySelector('.welcome-word');if(e&&window.greetingSeen.at(-1)!==e.textContent)window.greetingSeen.push(e.textContent);}).observe(document,{childList:true,subtree:true});});
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:3002/');await page.waitForSelector('.welcome-word');
 const bg=await page.locator('.welcome-intro').evaluate(e=>getComputedStyle(e).backgroundColor);if(bg!=='rgb(242, 240, 248)')throw Error('Wrong greeting background');
 await page.screenshot({path:'/home/user/v63-greeting.png'});await page.waitForSelector('.welcome-intro',{state:'detached'});
 const words=await page.evaluate(()=>window.greetingSeen);const expected=['Hello 👋','Bonjour 🇫🇷','Ciao 🇮🇹','Olà 🇵🇹','やあ 🇯🇵','Hallå 🇸🇪','Guten tag 🇩🇪','नमस्ते 🇮🇳','Hello 👋'];if(JSON.stringify(words)!==JSON.stringify(expected))throw Error('Greeting mismatch '+JSON.stringify(words));
 await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);
 if(await page.locator('#signature-canvas').getAttribute('data-glowing')!=='false')throw Error('Glow before writing finished');
 await page.locator('#signature-canvas').screenshot({path:'/home/user/v63-signature-writing.png'});
 await page.waitForFunction(()=>{const e=document.querySelector('#signature-canvas');return e.dataset.stage==='glow'&&Number(e.dataset.writtenGlyphs)===12;},null,{timeout:18000});
 await page.locator('#signature-canvas').screenshot({path:'/home/user/v63-signature-complete.png'});
 await page.locator('#connect').screenshot({path:'/home/user/v63-contact.png'});
 if(await page.locator('.scene-envelope').count()!==1)throw Error('Missing contact illustration');
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(120);if(await page.evaluate(()=>document.documentElement.scrollWidth)!==width)throw Error('Overflow '+width);}
 await page.setViewportSize({width:390,height:844});await page.locator('#connect').screenshot({path:'/home/user/v63-contact-mobile.png'});
 await page.click('#theme-toggle');await page.waitForTimeout(450);await page.locator('#connect').screenshot({path:'/home/user/v63-contact-light.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForSelector('.welcome-intro',{state:'detached'});await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(120);
 if(Number(await page.locator('#signature-canvas').getAttribute('data-written-glyphs'))!==12)throw Error('Reduced motion signature unreadable');
 if(errors.length)throw Error(errors.join(';'));await page.evaluate(()=>document.body.dataset.finalPolishTests='passed');
}
