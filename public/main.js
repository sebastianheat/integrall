const toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#menu');toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');menu.classList.toggle('open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});
const form=document.querySelector('#contact-form');if(form){const requested=new URLSearchParams(location.search).get('servicio');if([...form.service.options].some(o=>o.value===requested))form.service.value=requested;let started=Date.now();form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const status=document.querySelector('#form-status'),button=form.querySelector('button[type=submit]');button.disabled=true;status.dataset.error='false';status.textContent='Enviando su consulta…';try{const data=Object.fromEntries(new FormData(form));data.started=started;const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.error||'No pudimos enviar su consulta. Inténtelo nuevamente.');status.textContent='Gracias. Su consulta fue enviada a Gabriela. Nos pondremos en contacto con usted.';form.reset();started=Date.now()}catch(error){status.dataset.error='true';status.textContent=error.message+' También puede escribir a gcarrasco@integrall.cl o contactarnos por WhatsApp.'}finally{button.disabled=false}})}

const video=document.querySelector('#property-video');
const videoToggle=document.querySelector('.video-toggle');
if(video&&videoToggle){
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused=false;
  const saveData=Boolean(navigator.connection?.saveData);
  function syncVideoButton(){
    const label=video.paused?'Reproducir video':'Pausar video';
    videoToggle.setAttribute('aria-label',label+' de propiedades');
    videoToggle.querySelector('.video-toggle-label').textContent=label;
    videoToggle.firstElementChild.textContent=video.paused?'▷':'Ⅱ';
  }
  function loadVideo(){
    const source=video.querySelector('source');
    if(!source.hasAttribute('src')){source.src=source.dataset.src;video.load();}
  }
  async function playVideo(){loadVideo();try{await video.play();}catch{}syncVideoButton();}
  video.addEventListener('play',syncVideoButton);
  video.addEventListener('pause',syncVideoButton);
  videoToggle.addEventListener('click',()=>{if(video.paused){userPaused=false;playVideo();}else{userPaused=true;video.pause();}});
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)video.pause();else if(!userPaused&&!saveData)playVideo();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!userPaused&&!reducedMotion.matches&&!saveData)playVideo();});
  if(!reducedMotion.matches&&!saveData)playVideo();
}
