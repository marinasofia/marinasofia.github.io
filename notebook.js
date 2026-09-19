'use strict';
(() => {
  const book=document.querySelector('#book-object');
  const cover=book.querySelector('.cover-front');
  const pen=book.querySelector('.writing-pen');
  const ink=book.querySelector('#ink-window');
  const picker=book.querySelector('.journal-picker');
  const left=book.querySelector('.journal-left');
  const close=document.querySelector('.replay-journal');
  const skip=document.querySelector('.skip-drawing');
  const hint=document.querySelector('.closed-hint');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const length=ink.getTotalLength();
  let frame=0,timer=0,opened=false;
  ink.style.strokeDasharray=length;
  ink.style.strokeDashoffset=length;
  function parkPen(){
    pen.style.left='89%';pen.style.top='35%';
    pen.style.transform='rotate(15deg)';
  }
  function finishDrawing(){
    cancelAnimationFrame(frame);clearTimeout(timer);
    ink.style.strokeDashoffset=0;
    book.classList.remove('is-drawing');book.classList.add('ink-done');
    skip.hidden=true;parkPen();
  }
  function draw(){
    if(!opened)return;
    book.classList.add('is-drawing');skip.hidden=false;
    const started=performance.now();
    function tick(now){
      if(!opened)return;
      const fraction=Math.min(1,(now-started)/1450);
      const point=ink.getPointAtLength(length*fraction);
      ink.style.strokeDashoffset=length*(1-fraction);
      // The point of the photographed nib follows the same path as the ink.
      pen.style.left=`${point.x/960*100-1.31}%`;
      pen.style.top=`${point.y/640*100-45}%`;
      pen.style.transform=`rotate(${-24+Math.sin(fraction*Math.PI*3)*3}deg)`;
      if(fraction<1)frame=requestAnimationFrame(tick);else finishDrawing();
    }
    frame=requestAnimationFrame(tick);
  }
  function openBook(){
    if(opened)return;opened=true;
    book.classList.add('is-open');cover.setAttribute('aria-expanded','true');
    cover.tabIndex=-1;picker.inert=false;left.inert=false;
    close.hidden=false;hint.hidden=true;
    if(reduced.matches){finishDrawing();picker.querySelector('button').focus({preventScroll:true});}
    else timer=setTimeout(()=>{draw();if(document.activeElement===cover)picker.querySelector("button").focus({preventScroll:true});},650);
  }
  function closeBook(){
    opened=false;cancelAnimationFrame(frame);clearTimeout(timer);
    book.classList.remove('is-open','is-drawing','ink-done');
    cover.setAttribute('aria-expanded','false');cover.tabIndex=0;
    picker.inert=true;left.inert=true;close.hidden=true;skip.hidden=true;hint.hidden=false;
    ink.style.strokeDashoffset=length;pen.removeAttribute('style');cover.focus({preventScroll:true});
  }
  cover.addEventListener('click',openBook);close.addEventListener('click',closeBook);skip.addEventListener('click',finishDrawing);
  reduced.addEventListener('change',()=>{if(opened&&reduced.matches)finishDrawing();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&book.classList.contains('is-drawing'))finishDrawing();});
  window.addEventListener('resize',()=>{if(book.classList.contains('is-drawing'))finishDrawing();});
  const landing=document.querySelector('.journal-landing');
  function enterPortfolio(id){
    const target=document.getElementById(id);
    if(!target)return;
    if(opened)finishDrawing();
    landing.hidden=true;
    history.pushState(null,'','#'+id);
    target.setAttribute('tabindex','-1');
    target.scrollIntoView({behavior:'instant',block:'start'});
    target.focus({preventScroll:true});
  }
  function returnToNotebook(){
    landing.hidden=false;
    openBook();
    history.pushState(null,'','#studio');
    landing.scrollIntoView({behavior:'instant',block:'start'});
    picker.querySelector('button').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>enterPortfolio('project-'+button.dataset.openProject)));
  landing.querySelectorAll('a[href="#work"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();enterPortfolio('work');}));
  document.querySelector('[data-return-notebook]').addEventListener('click',event=>{event.preventDefault();returnToNotebook();});
  function restoreLocation(){
    const hash=location.hash;
    landing.hidden=Boolean(hash&&hash!=='#studio'&&hash!=='#entrance');
    if(hash==='#studio')openBook();
    const target=document.getElementById(hash.slice(1));
    if(target)target.scrollIntoView({behavior:'instant',block:'start'});
  }
  window.addEventListener('popstate',restoreLocation);
  window.addEventListener('hashchange',restoreLocation);
  restoreLocation();
})();
