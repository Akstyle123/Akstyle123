async(page)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://api.github.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:3002/');await page.waitForSelector('.welcome-skip');await page.click('.welcome-skip');await page.waitForSelector('.welcome-intro',{state:'detached'});
 await page.waitForSelector('.stat-box strong[aria-label]');
 const lc=await page.evaluate(()=>window.__BUNDLED_DATA__.profile.leetcode);
 if(lc.source!=='leetcode-graphql'||lc.solved!==lc.easy+lc.medium+lc.hard)throw Error('Invalid bundled fetched data');
 if(await page.locator('#hero-solved').textContent()!==lc.solved+' solved')throw Error('Stale hero count');
 if(!(await page.locator('[data-stats-tab=leetcode]').textContent()).includes('auto-updated'))throw Error('Missing auto label');
 await page.locator('#stats').scrollIntoViewIfNeeded();
 if(await page.locator('.stat-box strong').first().getAttribute('aria-label')!==String(lc.solved))throw Error('Stale solved counter');
 if(!(await page.locator('#stats-note').textContent()).includes('public data fetched'))throw Error('Missing provenance');
 if(!(await page.locator('.dashboard-pills>a').first().textContent()).includes(Number(lc.rank).toLocaleString()))throw Error('Stale rank');
 await page.locator('.breakdown-row').first().click();if(!(await page.locator('#dialog-body').textContent()).includes('public data fetched'))throw Error('Stale chart dialog');await page.keyboard.press('Escape');
 await page.locator('[data-beyond="0"]').click();if(await page.locator('.heatmap-caption strong').textContent()!==String(lc.activeDays))throw Error('Stale activity');
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(120);if(await page.evaluate(()=>document.documentElement.scrollWidth)!==width)throw Error('Overflow '+width);}
 await page.setViewportSize({width:1440,height:1000});await page.locator('#stats').screenshot({path:'/home/user/leetcode-auto-dashboard.png'});
 if(errors.length)throw Error(errors.join(';'));
}
