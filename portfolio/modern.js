/* Cosmic edition — local GSAP, automatic state machines and depth-aware canvas. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),G=window.gsap;
const off=()=>reduced.matches||document.body.classList.contains('motion-paused');
let clock=0,last=0,portraitAge=0,beyondAge=0,portraitBusy=false,beyondIndex=0,terminalIndex=0,terminalTimeline,wasOff=false,ready=false,scheduled=false;
let cfg={};
const enterObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){if(!off()&&G)G.fromTo(e.target,{y:14},{y:0,duration:.75,ease:'power3.out',clearProps:'transform',overwrite:'auto'});enterObserver.unobserve(e.target);}}),{threshold:.12}):null;
function cardEnhance(){
 for(const el of $$('.project-card,.achievement-card,.cert-card,.stat-box,.contact-item,.timeline button,.stack-group .pill')){
  if(el.dataset.cosmicCard)continue;el.dataset.cosmicCard='true';
  const aura=document.createElement('i');aura.className='card-aura';aura.setAttribute('aria-hidden','true');el.append(aura);
  if(el.matches('.project-card,.timeline button'))enterObserver?.observe(el);
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--pointer-x',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--pointer-y',((e.clientY-r.top)/r.height*100)+'%');
   if(!off()&&cfg.tilt!==false&&e.pointerType==='mouse'&&el.matches('.project-card')&&G){G.to(el,{rotationX:(.5-(e.clientY-r.top)/r.height)*3,rotationY:((e.clientX-r.left)/r.width-.5)*3,transformPerspective:900,duration:.45,ease:'power2.out',overwrite:'auto'});}
  },{passive:true});
  el.addEventListener('pointerleave',()=>{if(G)G.to(el,{rotationX:0,rotationY:0,y:0,duration:.55,overwrite:'auto'});});
 }
 let navChanged=false;
 for(const a of $$('.navigation nav>a:not([data-cosmic-nav])')){navChanged=true;a.dataset.cosmicNav='true';const icon=['user-round','orbit','layers','route','chart-no-axes-combined','badge-check','send'][$$('.navigation nav>a').indexOf(a)];a.insertAdjacentHTML('afterbegin',`<i data-lucide="${icon}" class="nav-symbol"></i>`);}
 if(navChanged)window.lucide?.createIcons();
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;cardEnhance();});}
function animateTerminal(index){
 terminalIndex=Number(index);$('#terminal-body').dataset.phase='typing';terminalTimeline?.kill();const lines=$$('#terminal-body p');
 if(off()||!G){$('#terminal-body').dataset.phase='static';for(const p of lines){p.style.opacity='1';p.style.visibility='visible';p.style.clipPath='none';}return;}
 G.set(lines,{autoAlpha:0,clipPath:'inset(0 0% 0 0)'});
 const tl=terminalTimeline=G.timeline({onComplete:()=>window.terminal((terminalIndex+1)%3)});
 for(let i=0;i<lines.length;i++){
  const p=lines[i],at=Math.floor(i/2)*1.45+(i%2?.88:0);
  if(p.classList.contains('response'))tl.to(p,{autoAlpha:1,duration:.22},at);
  else tl.fromTo(p,{autoAlpha:1,clipPath:'inset(0 100% 0 0)'},{autoAlpha:1,clipPath:'inset(0 0% 0 0)',duration:p.classList.contains('idle-prompt')?.12:.7,ease:'steps(22)'},at);
 }
 tl.call(()=>$('#terminal-body').dataset.phase='hold');
 tl.to(lines,{opacity:1,duration:cfg.terminalHoldSeconds||3.4});
 tl.call(()=>$('#terminal-body').dataset.phase='clear');
 tl.to(lines,{autoAlpha:0,duration:.32,stagger:0},'>');
 $('#terminal-body').dataset.cycle=String(index);
}
function animateBeyond(index){
 beyondIndex=Number(index);beyondAge=0;const visual=$('#beyond-visual');
 if(index===2){const network=visual.querySelector('.member-network');if(network)for(let i=0;i<6;i++){const packet=document.createElement('i');packet.className='community-packet';packet.style.cssText=`--packet-angle:${-90+i*60}deg;--packet-delay:${i*.4}s`;network.append(packet);}}
 if(!off()&&G){G.fromTo(visual.querySelector('img'),{x:-12,opacity:.75},{x:0,opacity:1,duration:.7,ease:'power3.out'});G.fromTo(visual.querySelectorAll('.heatmap-wrap,.source-writing,.member-network'),{x:18,opacity:.3},{x:0,opacity:1,duration:.65,ease:'power3.out'});G.fromTo($('.beyond-description'),{y:8,opacity:.5},{y:0,opacity:1,duration:.55});
  if(index===0)G.fromTo(visual.querySelectorAll('.heatmap button'),{scale:.55,opacity:.12},{scale:1,opacity:1,duration:.4,stagger:.019,ease:'power2.out'});
 }
 $('#beyond-visual').dataset.slide=String(index);
}
function portraitNext(){
 const buttons=$$('[data-portrait]');if(buttons.length<2||portraitBusy)return;const i=buttons.findIndex(b=>b.classList.contains('active')),next=buttons[(i+1)%buttons.length],img=$('#hero-photo');portraitBusy=true;
 const swap=()=>{next.click();portraitAge=0;if(G&&!off())G.to(img,{opacity:1,duration:.48,ease:'power2.out',onComplete:()=>portraitBusy=false});else{img.style.opacity='1';portraitBusy=false;}};
 if(G&&!off())G.to(img,{opacity:0,duration:.18,onComplete:swap});else swap();
}
function pauseSync(){const state=off();if(state===wasOff)return;wasOff=state;
 if(G)G.globalTimeline.paused(state);
 if(state){for(const p of $$('#terminal-body p')){p.style.opacity='1';p.style.visibility='visible';p.style.clipPath='none';}$('#hero-photo').style.opacity='1';}
 else{portraitBusy=false;window.terminal(terminalIndex);}
}
function canvasFrame(canvas){const r=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1.5),w=Math.max(1,Math.round(r.width*ratio)),h=Math.max(1,Math.round(r.height*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const c=canvas.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,r.width,r.height);return {c,w:r.width,h:r.height};}
function drawSpace(t){const canvas=$('#cosmic-sky');if(!canvas)return;const {c,w,h}=canvasFrame(canvas),light=document.body.classList.contains('light'),count=innerWidth<650?65:(cfg.spaceStars||120);
 for(let i=0;i<count;i++){const x=((i*137.508+t*(i%3+1)*.0007)%1000)/1000*w,y=((i*79.731+t*.00045)%1000)/1000*h,alpha=.2+(Math.sin(t*.0006+i)*.5+.5)*.5;c.fillStyle=light?`rgba(47,94,170,${alpha*.6})`:`rgba(173,204,255,${alpha})`;c.beginPath();c.arc(x,y,i%11===0?1.5:.7,0,Math.PI*2);c.fill();if(i%11===0){c.strokeStyle=light?'#3c73bc22':'#87bbff30';c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.moveTo(x,y-4);c.lineTo(x,y+4);c.stroke();}}
 const phase=t%13000/13000;if(phase<.12&&!reduced.matches){const x=w*(.15+phase*4),y=h*(.1+phase*2);const g=c.createLinearGradient(x-90,y-40,x,y);g.addColorStop(0,'transparent');g.addColorStop(1,light?'#2f7bff66':'#a2dfffaa');c.strokeStyle=g;c.lineWidth=1;c.beginPath();c.moveTo(x-90,y-40);c.lineTo(x,y);c.stroke();}
}
function drawHeroOrbit(t){
 const hero=$('.hero-visual');if(!hero)return;const r=hero.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 for(const [name,front]of[['hero-orbit-back',false],['hero-orbit-front',true]]){
  const canvas=$('#'+name);if(!canvas)continue;const {c,w,h}=canvasFrame(canvas),cx=w*.5,cy=h*.61,rx=w*.47,ry=h*.13,tilt=-13*Math.PI/180;
  const point=a=>{const x=Math.cos(a)*rx,y=Math.sin(a)*ry;return [cx+x*Math.cos(tilt)-y*Math.sin(tilt),cy+x*Math.sin(tilt)+y*Math.cos(tilt)];};
  c.beginPath();for(let i=0;i<=100;i++){const a=(front?0:Math.PI)+i/100*Math.PI,[x,y]=point(a);if(!i)c.moveTo(x,y);else c.lineTo(x,y);}c.strokeStyle=front?'#22e1ff88':'#2f7bff55';c.lineWidth=front?1.2:1;c.shadowColor='#22e1ff';c.shadowBlur=front?6:0;c.stroke();
  // Dashed energy lanes, moving packets and tapered ion trails, split by depth.
  c.shadowBlur=0;c.setLineDash([2,12]);c.lineDashOffset=-t/110;c.strokeStyle=front?'#87dfff55':'#736bff44';c.stroke();c.setLineDash([]);
  for(let j=0;j<3;j++){const angle=t/(7000+j*2300)*Math.PI*2+j*2.1;
   for(let k=12;k>=0;k--){const q=angle-k*.022;if((Math.sin(q)>=0)!==front)continue;const [px,py]=point(q);c.globalAlpha=(1-k/13)*.65;c.fillStyle=['#66efff','#9e88ff','#a1caff'][j];c.shadowColor=c.fillStyle;c.shadowBlur=k===0?12:0;c.beginPath();c.arc(px,py,k===0?2.3:1.15,0,Math.PI*2);c.fill();}c.globalAlpha=1;
  }
  const a=t/9000*Math.PI*2,[x,y]=point(a);if((Math.sin(a)>=0)===front){c.fillStyle='#c5f7ff';c.shadowBlur=12;c.beginPath();c.arc(x,y,3,0,Math.PI*2);c.fill();const ripple=t%1800/1800;c.strokeStyle=`rgba(34,225,255,${1-ripple})`;c.beginPath();c.arc(x,y,3+ripple*10,0,Math.PI*2);c.stroke();}
 }
}
let paint=0;
function frame(time){const delta=last?Math.min(time-last,100):0;last=time;pauseSync();if(!document.hidden&&!off()){clock+=delta;portraitAge+=delta;beyondAge+=delta;
 if(portraitAge>=(cfg.portraitSeconds||4.8)*1000)portraitNext();
 if(beyondAge>=(cfg.beyondSeconds||5.5)*1000)window.beyond((beyondIndex+1)%3);
 }
 if((paint++%2===0)||off()){drawSpace(clock);drawHeroOrbit(clock);}
 requestAnimationFrame(frame);
}
function init(){if(ready)return;if(!$('#terminal-body p')||!window.terminal||!window.beyond){requestAnimationFrame(init);return;}ready=true;
 cfg=(window.__BUNDLED_DATA__?.profile||(typeof profile==='object'?profile:{})).animation||{};
 const backdrop=document.createElement('div');backdrop.className='cosmic-backdrop';backdrop.setAttribute('aria-hidden','true');backdrop.innerHTML='<div class="cosmic-nebula"></div><canvas id="cosmic-sky"></canvas>';document.body.prepend(backdrop);
 for(const name of ['hero-orbit-back','hero-orbit-front']){const c=document.createElement('canvas');c.id=name;c.setAttribute('aria-hidden','true');$('.hero-visual').append(c);}
 const baseTerminal=window.terminal;window.terminal=function(index){baseTerminal(index);animateTerminal(index);};
 const baseJourney=window.journey;window.journey=function(index){baseJourney(index);if(!off()&&G)G.fromTo($('#journey-detail').children,{y:8,opacity:.4},{y:0,opacity:1,duration:.5,stagger:.07,ease:'power3.out'});};
 const baseBeyond=window.beyond;window.beyond=function(index){baseBeyond(index);animateBeyond(index);};
 window.terminal(0);window.beyond(0);cardEnhance();new MutationObserver(schedule).observe($('main'),{childList:true,subtree:true});
 document.addEventListener('click',e=>{if(e.target.closest('[data-portrait]')){portraitAge=0;}if(e.target.closest('#motion-toggle'))setTimeout(pauseSync,0);});
 reduced.addEventListener('change',pauseSync);wasOff=!off();pauseSync();
 window.CosmicUI={portraitNext,refresh:cardEnhance,config:cfg,get state(){return {portraitAge,beyondAge,terminalIndex,beyondIndex,paused:off()};}};
 requestAnimationFrame(frame);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
/* V6.1 finishing layer: opening greeting and small, self-contained SVG UI art. */
(()=>{
 const $=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 const disabled=()=>reduce.matches||document.body.classList.contains('motion-paused');
 const intro=document.createElement('div');intro.className='welcome-intro';intro.innerHTML='<div class="welcome-orbit" aria-hidden="true"></div><p class="welcome-caption">AYUSH KATHOKE / WELCOME</p><div class="welcome-word" aria-live="off">Hello 👋</div><div class="welcome-progress" aria-hidden="true"><i></i></div><button class="welcome-skip" type="button">Skip intro ↗</button>';
 document.body.append(intro);document.body.classList.add('intro-active');const main=$('main');if(main)main.inert=true;
 let closed=false,timers=[];
 function finish(){if(closed)return;closed=true;timers.forEach(clearTimeout);document.body.classList.remove('intro-active');if(main)main.inert=false;intro.classList.add('leaving');setTimeout(()=>{intro.remove();document.dispatchEvent(new CustomEvent('portfolio:greeting-finished'));},reduce.matches?0:1200);}
 intro.querySelector('button').addEventListener('click',finish);
 const words=['Hello 👋','Bonjour 🇫🇷','Ciao 🇮🇹','Olà 🇵🇹','やあ 🇯🇵','Hallå 🇸🇪','Guten tag 🇩🇪','नमस्ते 🇮🇳','Hello 👋'];
 window.PortfolioGreetingSequence=words;
 if(!reduce.matches)words.slice(1).forEach((word,i)=>timers.push(setTimeout(()=>{if(!closed){const label=intro.querySelector('.welcome-word');label.textContent=word;if(!disabled())label.animate([{opacity:.65,transform:'translateY(9px)',filter:'blur(1px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});}},(i+1)*300)));
 timers.push(setTimeout(finish,reduce.matches?400:4500));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')finish();});
 const svg=(body,cl='')=>`<svg class="ui-illustration ${cl}" viewBox="0 0 180 100" fill="none" aria-hidden="true">${body}</svg>`;
 const launch=svg('<ellipse cx="93" cy="52" rx="70" ry="32" stroke="currentColor" opacity=".2" stroke-dasharray="3 6"/><path d="M45 72L81 38M70 78L96 53" stroke="currentColor" opacity=".3"/><g class="launch-craft"><path d="M72 55C81 29 108 20 129 20C129 43 116 67 92 74L72 55Z" stroke="currentColor" stroke-width="2"/><circle cx="107" cy="41" r="7" stroke="currentColor" stroke-width="2"/><path d="M76 48L60 50L57 65L76 62M99 68L99 83L85 87L86 70" stroke="currentColor"/><path class="launch-flame" d="M70 65L53 83L78 74" stroke="#8b5cff" stroke-width="3" stroke-linecap="round"/></g><circle class="art-pulse" cx="145" cy="58" r="3" fill="currentColor"/><path d="M30 30h10m-5-5v10M142 80h8m-4-4v8" stroke="currentColor"/>');
 const craft=svg('<path d="M90 12L124 32V70L90 90L56 70V32L90 12Z" stroke="currentColor" opacity=".3"/><g class="craft-layer"><path d="M90 24L131 47L90 70L49 47L90 24Z" fill="#347dff12" stroke="currentColor" stroke-width="2"/><path d="M49 58L90 81L131 58M49 70L90 93L131 70" stroke="currentColor" opacity=".5"/><path d="M79 42L72 47L79 52M101 42L108 47L101 52M94 39L87 55" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g><circle class="art-pulse" cx="28" cy="35" r="3" fill="#8b5cff"/><circle class="art-pulse" cx="151" cy="72" r="3" fill="currentColor"/>');
 const signal=svg('<ellipse cx="90" cy="51" rx="78" ry="38" stroke="currentColor" opacity=".16" stroke-dasharray="3 5"/><g class="contact-envelope"><rect x="53" y="27" width="74" height="49" rx="9" fill="#347dff12" stroke="currentColor" stroke-width="2"/><path d="M56 33L90 56L124 33M56 70L78 50M124 70L102 50" stroke="currentColor" stroke-width="1.5"/><circle class="art-pulse" cx="127" cy="28" r="7" fill="#22e1ff"/></g><path class="message-signal" d="M10 54H30L38 41L45 65L53 52M129 52H142L150 42L158 57H172" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M27 19h8m-4-4v8M147 78h8m-4-4v8" stroke="#8b5cff"/>','contact-signal');
 function enrich(){if(!window.CosmicUI){requestAnimationFrame(enrich);return;}
  $('.section-banner')?.insertAdjacentHTML('beforeend','<div class="banner-illustration">'+launch+'</div>');$('.more-banner')?.insertAdjacentHTML('beforeend','<div class="banner-illustration">'+craft+'</div>');
  const lead=$('.contact-lead');
  if(lead){const scene=document.createElement('div');scene.className='contact-scene';scene.setAttribute('aria-hidden','true');scene.innerHTML=`<svg viewBox="0 0 640 190" fill="none" class="contact-scene-art"><defs><linearGradient id="contact-energy"><stop stop-color="#347dff"/><stop offset="1" stop-color="#22e1ff"/></linearGradient></defs><ellipse cx="320" cy="98" rx="145" ry="69" stroke="#347dff" opacity=".18"/><ellipse class="scene-orbit" cx="320" cy="98" rx="177" ry="79" stroke="#22e1ff" opacity=".22" stroke-dasharray="3 9"/><path class="scene-route" d="M120 97H219M421 97H520" stroke="url(#contact-energy)" stroke-width="2" stroke-dasharray="8 9"/><g class="scene-window left-window"><rect x="24" y="49" width="121" height="96" rx="12" fill="#347dff0c" stroke="#347dff88"/><path d="M24 72H145" stroke="#347dff55"/><circle cx="38" cy="61" r="2" fill="#22e1ff"/><circle cx="47" cy="61" r="2" fill="#8b5cff"/><path d="M62 92L52 103L62 114M105 92L115 103L105 114M89 86L77 120" stroke="#6bacff" stroke-width="3" stroke-linecap="round"/></g><g class="scene-envelope"><rect x="226" y="42" width="188" height="116" rx="17" fill="#347dff10" stroke="url(#contact-energy)" stroke-width="2"/><path d="M232 51L320 111L408 51M232 147L285 93M408 147L355 93" stroke="#22e1ff" stroke-width="2"/><circle class="scene-notification" cx="410" cy="45" r="13" fill="#22e1ff"/><path d="M404 45L408 49L416 41" stroke="#071525" stroke-width="2" stroke-linecap="round"/></g><g class="scene-window right-window"><rect x="495" y="49" width="121" height="96" rx="12" fill="#8b5cff0c" stroke="#8b5cff88"/><path d="M495 72H616" stroke="#8b5cff55"/><circle cx="508" cy="61" r="2" fill="#8b5cff"/><path d="M527 91H583M527 103H568M527 115H576" stroke="#b29cff" stroke-width="3" stroke-linecap="round"/></g><circle class="scene-packet" r="4" fill="#22e1ff"><animateMotion dur="3s" repeatCount="indefinite" path="M145 97H226"/></circle><circle class="scene-packet" r="4" fill="#a98aff"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M414 97H495"/></circle><path d="M185 26h12m-6-6v12M453 160h12m-6-6v12" stroke="#8b5cff" opacity=".7"/></svg><span class="scene-caption">YOUR NEXT IDEA. OUR NEXT CONVERSATION.</span>`;lead.before(scene);}

  $('.role')?.insertAdjacentHTML('beforeend','<span class="role-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>');
  if(fine.matches){const cursor=document.createElement('div');cursor.className='interactive-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);let x=0,y=0,sx=0,sy=0,visible=false,hover=false;
   document.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;hover=!!e.target.closest('a,button,input,select,[role="tab"]');if(!visible){sx=x;sy=y;visible=true;}},{passive:true});
   document.addEventListener('pointerout',e=>{if(!e.relatedTarget)visible=false;});
   document.addEventListener('pointerdown',e=>{if(disabled())return;const ripple=document.createElement('i');ripple.className='cursor-ripple';ripple.style.left=e.clientX+'px';ripple.style.top=e.clientY+'px';document.body.append(ripple);setTimeout(()=>ripple.remove(),700);});
   const tick=()=>{sx+=(x-sx)*.24;sy+=(y-sy)*.24;cursor.style.transform=`translate3d(${sx}px,${sy}px,0)`;cursor.classList.toggle('over-control',hover);cursor.style.opacity=visible&&!disabled()?'1':'0';requestAnimationFrame(tick);};requestAnimationFrame(tick);
  }
 }
 enrich();window.PortfolioIntro={finish};
})();
