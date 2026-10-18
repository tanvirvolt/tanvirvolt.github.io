(() => {
  'use strict';
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const addStyles=()=>{
    if(document.getElementById('scroll-navigation-styles'))return;
    const style=document.createElement('style');
    style.id='scroll-navigation-styles';
    style.textContent=`
      #scroll-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:1001;pointer-events:none;background:rgba(0,234,255,.055);overflow:hidden}
      #scroll-progress span{display:block;width:100%;height:100%;transform:scaleX(0);transform-origin:left center;background:linear-gradient(90deg,#00aeca,#00eaff 65%,#9bf7ff);box-shadow:0 0 9px rgba(0,234,255,.5);will-change:transform}
      #nav a{position:relative;transition:color .22s ease,background-color .22s ease}
      #nav a:after{content:'';position:absolute;left:12px;right:12px;bottom:5px;height:2px;border-radius:2px;background:var(--cyan,#00eaff);transform:scaleX(0);transform-origin:left;opacity:0;transition:transform .25s ease,opacity .25s ease}
      #nav a.is-active{color:var(--cyan,#00eaff);background:rgba(0,234,255,.055)}
      #nav a.is-active:after{transform:scaleX(1);opacity:1}
      .reveal.v2-stagger{--v2-stagger-gap:75ms}
      .reveal.v2-stagger>*{transition-delay:var(--item-delay,0ms)}
      .reveal.v2-stagger.is-revealed>*{opacity:1;transform:translate3d(0,0,0)}
      .reveal.v2-stagger:not(.is-revealed)>*:not(script):not(style){opacity:0;transform:translate3d(0,14px,0)}
      @media(max-width:767px){#scroll-progress{height:2px}#nav a:after{left:8px;right:8px;bottom:2px}.reveal.v2-stagger{--v2-stagger-gap:45ms}}
      @media(prefers-reduced-motion:reduce){#scroll-progress span,#nav a,#nav a:after,.reveal.v2-stagger>*{transition:none!important;animation:none!important}.reveal.v2-stagger:not(.is-revealed)>*{opacity:1!important;transform:none!important}}
    `;
    document.head.appendChild(style);
  };

  const init=()=>{
    const nav=document.getElementById('nav');
    if(!nav||document.documentElement.dataset.scrollNavigationReady==='true')return;
    document.documentElement.dataset.scrollNavigationReady='true';
    addStyles();

    let progress=document.getElementById('scroll-progress');
    if(!progress){
      progress=document.createElement('div');progress.id='scroll-progress';
      progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>';document.body.prepend(progress);
    }
    const progressBar=progress.querySelector('span');
    const navLinks=[...nav.querySelectorAll('a[href^="#"]')];
    const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
    let ticking=false,activeId='';

    const updateProgress=()=>{
      const doc=document.documentElement;
      const max=Math.max(0,doc.scrollHeight-window.innerHeight);
      const ratio=max?Math.min(1,Math.max(0,window.scrollY/max)):0;
      progressBar.style.transform='scaleX('+ratio+')';ticking=false;
    };
    const requestUpdate=()=>{
      if(ticking)return;ticking=true;window.requestAnimationFrame(updateProgress);
    };
    const setActive=id=>{
      if(!id||activeId===id)return;activeId=id;
      navLinks.forEach(link=>{
        const active=link.getAttribute('href')==='#'+id;
        link.classList.toggle('is-active',active);
        if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate,{passive:true});
    window.addEventListener('load',requestUpdate,{once:true});
    updateProgress();

    // Reveal each eligible section and its direct content once; existing reveal classes remain compatible.
    const revealTargets=[...document.querySelectorAll('.reveal')];
    revealTargets.forEach(section=>{
      if(section.dataset.staggerReady==='true')return;
      section.dataset.staggerReady='true';
      const children=[...section.children].filter(el=>!['SCRIPT','STYLE'].includes(el.tagName));
      if(children.length<2)return;
      section.classList.add('v2-stagger');
      children.forEach((child,i)=>child.style.setProperty('--item-delay',reduceMotion?'0ms':(Math.min(i,5)*75)+'ms'));
    });

    if('IntersectionObserver'in window&&!reduceMotion){
      const revealObserver=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
      revealTargets.forEach(section=>revealObserver.observe(section));
    }else{
      revealTargets.forEach(section=>section.classList.add('is-revealed'));
    }

    if('IntersectionObserver'in window){
      const activeObserver=new IntersectionObserver(entries=>{
        const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
        if(visible[0])setActive(visible[0].target.id);
      },{rootMargin:'-22% 0px -60% 0px',threshold:[0,.1,.25,.45,.65]});
      sections.forEach(section=>activeObserver.observe(section));
    }
    navLinks.forEach(link=>link.addEventListener('click',()=>{
      const id=link.getAttribute('href').slice(1);setActive(id);requestUpdate();
    }));
    if(window.scrollY<120&&document.getElementById('home'))setActive('home');
    else{
      let current=sections[0]?.id;
      sections.forEach(section=>{if(section.getBoundingClientRect().top<=window.innerHeight*.35)current=section.id;});
      if(current)setActive(current);
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
