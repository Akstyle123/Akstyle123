async (page) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://api.github.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:3002/');await page.waitForSelector('.welcome-skip');
 if(!await page.locator('.voice-player').evaluate(e=>e.hidden))throw Error('Player visible before greeting');
 await page.click('.welcome-skip');await page.waitForSelector('.voice-player',{state:'visible'});
 await page.click('#voice-toggle');await page.waitForFunction(()=>PortfolioAudio.state==='missing');
 if(!(await page.locator('#voice-status').textContent()).includes('not added'))throw Error('Missing audio status unclear');
 // Silent test fixture is routed only in this test; it is not a shipped recording.
 await page.route('**/assets/introduction.mp3',r=>r.fulfill({path:'/home/user/audio-test-silence.wav',contentType:'audio/wav'}));
 await page.click('#voice-toggle');await page.waitForFunction(()=>PortfolioAudio.state==='playing');
 if(await page.locator('#voice-toggle').getAttribute('aria-pressed')!=='true')throw Error('Playing toggle incorrect');
 await page.click('#voice-toggle');
 if(await page.locator('#voice-introduction').evaluate(e=>!e.paused||e.currentTime!==0))throw Error('Stop must pause and rewind');
 await page.reload();await page.click('.welcome-skip');await page.waitForSelector('.voice-player',{state:'visible'});
 if(!(await page.locator('#voice-status').textContent()).includes('Audio off'))throw Error('Stop preference not saved');
 await page.click('#voice-toggle');await page.waitForFunction(()=>PortfolioAudio.state==='playing');
 await page.waitForFunction(()=>PortfolioAudio.state==='ended',null,{timeout:8000});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth)!==width)throw Error('Overflow at '+width);}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/home/user/audio-controls-mobile.png'});
 if(errors.length)throw Error(errors.join(';'));
 await page.evaluate(()=>document.body.dataset.audioTests='passed');
}
