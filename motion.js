/* Native CSS/DOM/canvas motion layer. No SVG panels or screenshots. */
(()=>{
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const brands=window.PROFILE_VISUALS?.brands||{};
 const aliases={'TS':'TypeScript','JS':'JavaScript','Node':'Node.js','Tailwind CSS':'Tailwind','CSS3':'CSS'};
 const brand=name=>brands[aliases[name]||name]||'';
 const motionOff=()=>reduced.matches||document.body.classList.contains('motion-paused');
 let virtualTime=0,lastTime=0,pending=false,lastInteraction=0;
 const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');e.target.querySelectorAll('.odometer-track').forEach(track=>{track.style.animationName='none';requestAnimationFrame(()=>track.style.removeProperty('animation-name'));});observer.unobserve(e.target);}}},{threshold:.05}):null;
 function htmlCodeBars(){return Array.from({length:7},(_,i)=>`<div class="code-bar-line"><small>${i+1}</small>${Array.from({length:i===6?1:3},(_,j)=>`<i style="--bar-color:${['#ff6680','#63a6ff','#22e1ff','#45638b'][(i+j)%4]};--bar-width:${[12,25,38,20,31,10][(i+j*2)%6]}%;--bar-delay:${i*.12+j*.04}s"></i>`).join('')}</div>`).join('');}
 function decorate(){
  const role=$('#role-text');if(role&&role.dataset.currentRole!==role.textContent){role.dataset.currentRole=role.textContent;if(!motionOff())role.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});}
  for(const panel of $$('.panel:not([data-visual-panel])')){panel.dataset.visualPanel='true';let edge=document.createElement('span');edge.className='panel-edge';edge.setAttribute('aria-hidden','true');let shine=document.createElement('span');shine.className='panel-shine';shine.style.setProperty('--sweep-delay',-(Math.random()*8)+'s');shine.setAttribute('aria-hidden','true');panel.append(edge,shine);if(!panel.classList.contains('hero')){panel.classList.add('motion-reveal');if(observer)observer.observe(panel);else panel.classList.add('is-visible');}}
  for(const button of $$('[data-stack]:not([data-brand-ready])')){button.dataset.brandReady='true';const name=button.dataset.stack,svg=brand(name);if(!svg)continue;if(button.classList.contains('pill')){button.innerHTML=svg+'<span>'+name.replace(' CSS','').replace('CSS3','CSS')+'</span>';}else if(button.classList.contains('orbit-node'))button.innerHTML=svg;}
  for(const p of $$('.terminal-body p:not([data-typed])')){p.dataset.typed='true';const siblings=[...p.parentElement.children];p.style.setProperty('--line-delay',siblings.indexOf(p)*.7+'s');}
  for(const cell of $$('.heatmap button:not([data-lit])')){cell.dataset.lit='true';cell.style.setProperty('--cell-delay',(Math.random()*1.5)+'s');}
  for(const panel of $$('.project-card:not([data-preview-upgraded])')){
   panel.dataset.previewUpgraded='true';const trigger=panel.querySelector('.project-preview');const id=Number(trigger?.dataset.projectOpen??trigger?.dataset.lab);
   window.NativeReference?.upgradeProject(panel,id);
  }
  for(const strong of $$('.stat-box strong:not([data-odometer])')){strong.dataset.odometer='true';const value=strong.textContent.trim();strong.setAttribute('aria-label',value);strong.innerHTML='<span class="sr-only">'+value+'</span>'+[...value].map((c,i)=>/\d/.test(c)?`<span class="odometer-digit" aria-hidden="true"><span class="odometer-track" style="--digit:${Number(c)};--digit-delay:${i*.11}s">${Array.from({length:Number(c)+1},(_,n)=>'<span>'+n+'</span>').join('')}</span></span>`:'<span aria-hidden="true">'+c+'</span>').join('');}
  const colors=['#2f7bff','#8b5cff','#22e1ff','#ff2d55','#ffc24b','#2dff9a'];
  for(const button of $$('[data-year]:not([data-milestone-enhanced])')){button.dataset.milestoneEnhanced='true';const index=Number(button.dataset.year);button.style.setProperty('--milestone-color',colors[index]);let p=document.createElement('span');p.className='milestone-copy';p.innerHTML=['J D College of Engineering<br>& Management, Nagpur','Machine-learning training<br>with ShapeAI','NPTEL Java · IIT Kharagpur<br>CodSoft & Prodigy internships','Salesforce Intern · SmartBridge<br>Full-Stack Intern · Pragmatyc','B.Tech in IT, Class of 2025<br>LeetCode 365 & 500-day badges','Shipping AI-powered products<br>Open to full-time roles'][index];button.append(p);}
  for(const item of $$('.topic-item:not([data-topic-enhanced])')){item.dataset.topicEnhanced='true';let value=Number(item.querySelector('span')?.textContent)||100;item.style.setProperty('--topic-width',Math.min(95,value/550*100)+'%');item.style.setProperty('--topic-color',item.parentElement.children.length%2?'#8b5cff':'#2f7bff');}
  window.NativeReference?.hydrate();
  const status=$('#data-status');if(status)status.title=status.textContent;
  const seal=$('.seal-ring');if(seal&&!seal.children.length){let text='VERIFIED CREDENTIALS · VERIFIED CREDENTIALS · ';seal.innerHTML=[...text].map((c,i)=>`<span style="--angle:${i/text.length*360}deg">${c===' '?'&nbsp;':c}</span>`).join('');}
  for(const card of $$('.cert-card:not([data-shine-ready])')){card.dataset.shineReady='true';card.style.setProperty('--cert-delay',-(Math.random()*6)+'s');}
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;decorate();});}
 function fitHero(){const title=$('.name-lockup h1'),copy=$('.hero-copy');if(!title||!copy)return;if(innerWidth<=650){const canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.font='800 100px Display';const ratio=c.measureText('KATHOKE').width;title.style.fontSize=(copy.clientWidth/ratio*100*.985)+'px';}else title.style.removeProperty('font-size');}
 function canvasFrame(canvas){if(!canvas)return null;const r=canvas.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return null;const ratio=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*ratio),h=Math.round(r.height*ratio);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}let c=canvas.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,r.width,r.height);return {c,w:r.width,h:r.height};}
 const signatureGeometry=(window.PROFILE_VISUALS?.signature||[]).map(d=>{const measure=document.createElementNS('http://www.w3.org/2000/svg','path');measure.setAttribute('d',d);return {path:new Path2D(d),length:measure.getTotalLength()};});
 function penEase(p){let low=0,high=1,u=.5;for(let i=0;i<12;i++){u=(low+high)/2;const x=3*(1-u)*(1-u)*u*.5+3*(1-u)*u*u*.3+u*u*u;if(x<p)low=u;else high=u;}return 3*(1-u)*u*u+u*u*u;}
 let signatureEpoch=null,signatureWasOff=false;
 const signatureTotal=signatureGeometry.reduce((sum,g)=>sum+g.length,0);
 function drawSignature(t){
  if($('.welcome-intro'))return;
  const canvas=$('#signature-canvas'),f=canvasFrame(canvas);if(!f)return;
  const still=motionOff();if(signatureEpoch===null||(!still&&signatureWasOff))signatureEpoch=t;signatureWasOff=still;
  const {c,w,h}=f,phase=(t-signatureEpoch)/1000%12,scale=Math.min((w-24)/649.76672,(h-24)/134.93813);
  const ink=c.createLinearGradient(0,0,w,0);ink.addColorStop(0,'#63a6ff');ink.addColorStop(.5,'#22e1ff');ink.addColorStop(1,'#8b5cff');
  c.save();c.translate(w/2-288.81664*scale,h/2+22.66906*scale);c.scale(scale,scale);c.lineCap='round';c.lineJoin='round';
  const fade=still?1:phase<9.5?1:Math.max(0,(11-phase)/1.5);let start=0,complete=0;
  for(const item of signatureGeometry){const duration=item.length/signatureTotal*6,local=phase-start,progress=still?1:Math.max(0,Math.min(1,local/duration));start+=duration;if(progress<=0)continue;
   if(progress===1){complete++;if(still||phase>=6){c.setLineDash([]);c.globalAlpha=fade*(still?1:Math.min(1,(phase-6)/.5));c.fillStyle=ink;c.shadowColor='#2f7bff';c.shadowBlur=!still&&phase>=6.25?7+Math.sin((phase-6.25)*2)*3:0;c.fill(item.path,'evenodd');c.shadowBlur=0;}}
   c.globalAlpha=fade;c.lineWidth=1.6;c.strokeStyle=ink;c.setLineDash([item.length,item.length]);c.lineDashOffset=item.length*(1-penEase(progress));c.stroke(item.path);
  }
  canvas.dataset.stage=still?'static':phase<6?'drawing':phase<6.25?'ink':phase<9.5?'glow':'fade';canvas.dataset.glowing=String(!still&&phase>=6.25&&phase<11);canvas.dataset.writtenGlyphs=complete;canvas.dataset.signaturePhase=phase.toFixed(2);c.restore();
 }

 function drawWave(t){const f=canvasFrame($('#footer-wave'));if(!f)return;for(const [color,phase,amplitude]of[['#2f7bff',0,3],['#ff2d55',Math.PI,2]]){f.c.beginPath();for(let x=0;x<f.w;x+=2){let y=f.h*.65+Math.sin((x+t*.025)/60+phase)*amplitude;if(!x)f.c.moveTo(x,y);else f.c.lineTo(x,y);}f.c.strokeStyle=color;f.c.globalAlpha=.4;f.c.lineWidth=1;f.c.stroke();}f.c.globalAlpha=1;}
 function moveNodes(t){const orbit=$('.stack-orbit');if(!orbit)return;const rect=orbit.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;const nodes=$$('.orbit-node');nodes.forEach((node,i)=>{const ring=i%3;const rx=[92,173,244][ring],ry=[75,105,138][ring];const direction=ring===1?-1:1;const ringCount=[Math.ceil(nodes.length/3),Math.ceil((nodes.length-1)/3),Math.ceil((nodes.length-2)/3)][ring];let a=Math.floor(i/3)/ringCount*Math.PI*2+ring*.35+t/[20000,30000,40000][ring]*Math.PI*2*direction;let x=Math.cos(a)*rx,y=Math.sin(a)*ry;const tilt=-.24;const xx=x*Math.cos(tilt)-y*Math.sin(tilt),yy=x*Math.sin(tilt)+y*Math.cos(tilt);node.style.left=`calc(48% + ${xx.toFixed(2)}px)`;node.style.top=`calc(52.2% + ${yy.toFixed(2)}px)`;node.style.transform='translate(-50%,-50%)';});}
 function profileMotion(t){
  const hero=$('.hero-visual'),img=$('#hero-photo'),scan=$('.hero-visual>.scanline'),dot=$('.profile-traveler'),ring=$('.hero-visual .o3');
  if(!hero||!img||!scan)return;
  const hr=hero.getBoundingClientRect();if(hr.bottom<0||hr.top>innerHeight)return;
  const r=img.getBoundingClientRect();scan.style.left=(r.left-hr.left)+'px';scan.style.top=(r.top-hr.top)+'px';scan.style.width=r.width+'px';scan.style.height=r.height+'px';scan.style.setProperty('--portrait-height',r.height+'px');
  if(scan.dataset.maskSrc!==img.src){scan.dataset.maskSrc=img.src;scan.style.setProperty('--portrait-mask',`url("${img.src}")`);}
  if(dot&&ring){const a=t/9000*Math.PI*2,rx=ring.offsetWidth/2,ry=ring.offsetHeight/2,x=Math.cos(a)*rx,y=Math.sin(a)*ry,tilt=-13*Math.PI/180;dot.style.left=(ring.offsetLeft+x*Math.cos(tilt)-y*Math.sin(tilt))+'px';dot.style.top=(ring.offsetTop+x*Math.sin(tilt)+y*Math.cos(tilt))+'px';}
 }
 function frame(time){const delta=lastTime?Math.min(100,time-lastTime):0;lastTime=time;if(!document.hidden&&!motionOff())virtualTime+=delta;moveNodes(virtualTime);profileMotion(virtualTime);drawSignature(virtualTime);drawWave(virtualTime);requestAnimationFrame(frame);}
 function init(){
  const traveler=document.createElement('span');traveler.className='profile-traveler';traveler.setAttribute('aria-hidden','true');$('.hero-visual')?.append(traveler);
  let button=document.createElement('button');button.id='motion-toggle';button.className='motion-button';button.type='button';button.title='Pause or resume animations';button.setAttribute('aria-label','Pause animations');button.setAttribute('aria-pressed','false');button.innerHTML='<i data-lucide="pause"></i>';$('.utilities')?.append(button);button.addEventListener('click',()=>{let paused=document.body.classList.toggle('motion-paused');button.setAttribute('aria-pressed',paused);button.setAttribute('aria-label',paused?'Resume animations':'Pause animations');button.innerHTML='<i data-lucide="'+(paused?'play':'pause')+'"></i>';window.lucide?.createIcons();});
  const stars=$('.hero-particles');if(stars)stars.innerHTML=Array.from({length:32},(_,i)=>`<i style="--px:${(i*37%97)+1}%;--py:${(i*23%83)+6}%;--twinkle:${2.5+(i%6)*.35}s;--delay:${-(i%7)*.4}s"></i>`).join('');
  const greeting=$('.greeting');if(greeting)greeting.innerHTML='<b>&gt;</b><span class="hero-type">Hi there, I’m</span><span class="cursor">▌</span>';
  let lead=document.createElement('p');lead.className='contact-lead';lead.textContent='SDE, full-stack or a wild idea. My inbox is open.';$('.contact-items')?.prepend(lead);
  const year=$('#footer-year');if(year)year.textContent=new Date().getFullYear();
  decorate();new MutationObserver(schedule).observe($('main'),{childList:true,subtree:true});
  addEventListener('resize',fitHero);document.fonts.ready.then(fitHero);window.lucide?.createIcons();
  document.addEventListener('pointerdown',e=>{if(e.isTrusted)lastInteraction=Date.now();},{passive:true});document.addEventListener('keydown',()=>lastInteraction=Date.now());

  setInterval(()=>{if(motionOff()||document.hidden)return;const message=$('.pass-now>span');if(message){const items=['Open to SDE & Full-Stack roles','Building AI-powered dev tools','Solving LeetCode daily in Java'];let i=items.indexOf(message.textContent);message.textContent=items[(i+1)%items.length];}},6000);
  requestAnimationFrame(frame);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
