/* Local voice recording only. No synthetic substitute or remote voice service. */
(()=>{
 const key='ayush-introduction-audio',player=document.createElement('audio');
 player.id='voice-introduction';player.preload='none';player.setAttribute('aria-label','Ayush’s spoken introduction');
 player.src=window.__ASSETS__?.['introduction.mp3']||'assets/introduction.mp3';
 const widget=document.createElement('aside');widget.className='voice-player';widget.hidden=true;widget.setAttribute('aria-label','Introduction audio controls');
 widget.innerHTML='<span class="voice-levels" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div class="voice-copy"><strong>Meet Ayush</strong><span id="voice-status" role="status">Listen to my introduction</span></div><button type="button" id="voice-toggle" aria-controls="voice-introduction" aria-describedby="voice-status" aria-label="Play introduction" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5L19 12L9 19V5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg><span>Play</span></button>';
 document.body.append(player,widget);
 const button=widget.querySelector('button'),status=widget.querySelector('#voice-status');let pending=false,request=0,started=false;
 function save(value){try{localStorage.setItem(key,value);}catch{}}
 function preferred(){try{return localStorage.getItem(key)!=='off';}catch{return true;}}
 function show(state,message){widget.dataset.state=state;const active=state==='playing'||state==='loading';button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',active?'Stop introduction':'Play introduction');button.querySelector('span').textContent=active?'Stop':'Play';button.querySelector('path').setAttribute('d',active?'M6 6H18V18H6V6Z':'M9 5L19 12L9 19V5Z');status.textContent=message;}
 function stop(message='Introduction stopped'){request++;pending=false;player.pause();try{player.currentTime=0;}catch{}show('idle',message);}
 async function play(manual=false){const id=++request;pending=true;if(manual)save('on');show('loading','Loading introduction…');
  // Retry a recording added since a previous missing-file result.
  if(player.error)player.load();
  try{await player.play();if(id!==request){player.pause();return;}pending=false;show('playing','Playing your introduction');}
  catch(error){if(id!==request)return;pending=false;if(error.name==='NotAllowedError')show('ready','Tap Play to hear my introduction');else if(error.name!=='AbortError')show('missing','Recording not added yet');else show('idle','Listen to my introduction');}
 }
 button.addEventListener('click',()=>{if(pending||!player.paused){save('off');stop();}else play(true);});
 player.addEventListener('ended',()=>{request++;pending=false;show('ended','Thanks for listening · Play again');});
 player.addEventListener('error',()=>{if(!widget.hidden){request++;pending=false;show('missing','Recording not added yet');}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&(pending||!player.paused))stop('Paused while you were away · Play again');});
 function afterGreeting(){if(started)return;started=true;widget.hidden=false;if(preferred())play();else show('idle','Audio off · Play when you’re ready');}
 document.addEventListener('portfolio:greeting-finished',afterGreeting,{once:true});
 // Guard for source pages where the greeting has already completed.
 if(document.readyState==='complete'&&!document.querySelector('.welcome-intro'))afterGreeting();
 window.PortfolioAudio={play:()=>play(true),stop,get state(){return widget.dataset.state;}};
})();
