import {useEffect} from 'react';

// Progressive enhancement: content stays visible even without animation support.
// Observers only watch new content; no scroll listeners or animation library.
const revealTargets = [
 '.section-head', '.intro-section>div:not(.values)', '.values>div',
 '.drink-card', '.package-card', '.surprise-banner>div', '.digital-copy',
 '.phone-stage', '.process-grid>div', '.gallery>div', '.final-cta',
 '.page-title', '.discovery-layout', '.event-mode-card', '.order-tracking',
 '.stat-card', '.dashboard-columns>.surface', '.dashboard-feature',
 '.admin-main>.surface', '.booking-panel', '.extras-grid>div',
].join(',');

export function useMotion(path:string) {
 useEffect(()=>{
  const root=document.getElementById('conteudo');
  if(!root || !('IntersectionObserver' in window) || !Element.prototype.animate)return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let dispose=()=>{};
  const configure=()=>{
   dispose();
   if(preference.matches)return;
   const compact=window.matchMedia('(max-width: 600px)').matches;
   const seen=new WeakSet<Element>();
   const owned=new Set<HTMLElement>();
   const active=new Set<Animation>();
   const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
     if(!entry.isIntersecting)continue;
     const element=entry.target as HTMLElement;
     observer.unobserve(element);
     element.dataset.motion='visible';
     if(element.contains(document.activeElement))continue;
     const parent=element.parentElement;
     const grouped=parent?.matches('.drink-grid,.package-grid,.values,.process-grid,.stats-grid,.extras-grid');
     const index=grouped?Array.from(parent!.children).indexOf(element):0;
     const animation=element.animate([
      {opacity:0,transform:`translateY(${compact?12:22}px)`},
      {opacity:1,transform:'translateY(0)'},
     ],{
      duration:compact?360:620,
      delay:grouped?(index%(compact?2:4))*(compact?35:55):0,
      easing:'cubic-bezier(.22,1,.36,1)',
      fill:'backwards',
     });
     active.add(animation);
     const remove=()=>active.delete(animation);
     animation.addEventListener('finish',remove,{once:true});
     animation.addEventListener('cancel',remove,{once:true});
    }
   },{threshold:.08,rootMargin:'0px 0px -16px 0px'});
   const watch=(node:Element)=>{
    const elements=[...(node.matches(revealTargets)?[node]:[]),...node.querySelectorAll(revealTargets)];
    for(const element of elements){
     if(!(element instanceof HTMLElement)||seen.has(element))continue;
     seen.add(element);owned.add(element);
     element.dataset.motion='observed';
     observer.observe(element);
    }
   };
   watch(root);
   const additions=new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes){
     if(node instanceof Element)watch(node);
    }
   });
   additions.observe(root,{childList:true,subtree:true});
   dispose=()=>{
    observer.disconnect();additions.disconnect();
    for(const animation of active)animation.cancel();
    active.clear();
    for(const element of owned)delete element.dataset.motion;
    owned.clear();
   };
  };
  configure();
  preference.addEventListener('change',configure);
  return()=>{dispose();preference.removeEventListener('change',configure);};
 },[path]);
}
