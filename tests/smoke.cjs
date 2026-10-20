const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    // Test deterministic offline fallback, not GitHub availability/rate limits.
    await page.route('https://api.github.com/**',r=>r.abort());
    await page.goto(pathToFileURL(path.resolve(__dirname,'../standalone.html')).href);
    await page.waitForSelector('.cert-card');
    assert.equal(await page.locator('.project-card').count(),16);
    assert.equal(await page.locator('.cert-card').count(),10);
    assert.equal(await page.locator('img[src$=".svg"]').count(),0);
    await page.click('[data-terminal="1"]');assert.match(await page.locator('#terminal-body').innerText(),/what-i-build/);
    await page.click('.stack-tools [data-stack="React"]');assert.equal(await page.locator('#detail-dialog').evaluate(d=>d.open),true);await page.keyboard.press('Escape');
    await page.fill('#project-search','compiler');assert.equal(await page.locator('.project-card').count(),1);await page.fill('#project-search','');
    await page.click('[data-filter="Android"]');assert.equal(await page.locator('.project-card').count(),4);await page.click('[data-filter="All"]');
    await page.click('[data-lab="6"]');assert.equal(await page.locator('#qr-result img').count(),1);await page.keyboard.press('Escape');
    await page.click('[data-lab="13"]');for(const key of ['1','2','*','8','='])await page.click(`[data-calc="${key}"]`);assert.equal(await page.locator('#calc-display').inputValue(),'96');await page.keyboard.press('Escape');
    await page.click('[data-lab="12"]');for(const n of [0,3,1,4,2])await page.click(`[data-game-cell="${n}"]`);assert.equal(await page.locator('#game-status').innerText(),'X wins!');await page.keyboard.press('Escape');
    await page.click('[data-lab="15"]');await page.fill('#new-task','Smoke test task');await page.keyboard.press('Enter');assert.equal(await page.locator('.local-task').count(),1);await page.click('[data-toggle-task="0"]');assert.equal(await page.locator('.local-task .done').count(),1);await page.click('[data-delete-task="0"]');assert.equal(await page.locator('.local-task').count(),0);await page.keyboard.press('Escape');
    await page.click('[data-stats-tab="github"]');assert.match(await page.locator('#chart-center').innerText(),/OWN REPOS/);
    await page.click('[data-cert-filter="hr"]');assert.equal(await page.locator('.cert-card').count(),8);
    await page.click('[data-cert="2"]');assert.match(await page.locator('#dialog-body a').getAttribute('href'),/hackerrank.com/);await page.keyboard.press('Escape');
    await page.keyboard.press('Control+k');assert.equal(await page.locator('#command-dialog').evaluate(d=>d.open),true);await page.keyboard.press('Escape');
    for(const width of [320,375,390,650,768,1024,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);}
    assert.deepEqual(errors,[]);
    console.log('PASS: native panels, 16 projects, 10 certs, tabs, search/filter, technology dialog, QR generation, calculator, tic-tac-toe, task CRUD, charts, verification links, keyboard navigation, offline fallback, 7 viewport widths, zero runtime errors.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
