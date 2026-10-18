(() => {
  'use strict';
  const root=document.getElementById('thesis-visuals');
  if(!root) return;
  const canvas=root.querySelector('canvas');
  const ctx=canvas&&canvas.getContext('2d');
  if(!ctx) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modeButtons=[...root.querySelectorAll('[data-mode]')];
  const speedSlider=root.querySelector('#tv-speed');
  const speedValue=root.querySelector('#tv-speed-value');
  const canvasWrap=root.querySelector('.tv-visual-canvas');
  let mode='field',phase=0,raf=0,last=0,width=0,height=0,dpr=1;
  const cyan='#00eaff',muted='rgba(180,205,222,.7)';
  const resize=()=>{
    const rect=canvasWrap.getBoundingClientRect();
    dpr=Math.min(window.devicePixelRatio||1,2);
    width=Math.max(280,rect.width);height=Math.max(210,Math.min(300,width*.56));
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  };
  const line=(x1,y1,x2,y2,color=cyan,w=1,dash=[])=>{
    ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);
  };
  const text=(s,x,y,color=muted,size=11,align='left')=>{
    ctx.fillStyle=color;ctx.font='600 '+size+'px system-ui,sans-serif';ctx.textAlign=align;ctx.fillText(s,x,y);
  };
  const drawField=()=>{
    const cx=width*.5,cy=height*.53,r=Math.min(width*.25,height*.34);
    for(let i=0;i<3;i++){
      const a=phase+i*2*Math.PI/3;
      const x=cx+Math.cos(a)*r*.84,y=cy+Math.sin(a)*r*.84;
      line(cx,cy,x,y,'rgba(0,234,255,.3)',1.2);
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle=cyan;ctx.fill();
      text(['A','B','C'][i],x+Math.cos(a)*13,y+Math.sin(a)*13,cyan,10,'center');
    }
    const resultant=phase;
    const ex=cx+Math.cos(resultant)*r,ey=cy+Math.sin(resultant)*r;
    line(cx,cy,ex,ey,cyan,3);
    ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
    text('Resultant field',cx,cy-r-15,'#fff',11,'center');
    text('Illustrative rotating-field concept',width/2,height-10,muted,10,'center');
  };
  const drawDQ=()=>{
    const cx=width*.5,cy=height*.53,r=Math.min(width*.28,height*.34),a=phase*.7;
    line(22,cy,width-22,cy,'rgba(180,205,222,.35)',1);
    line(cx,height-24,cx,20,'rgba(180,205,222,.35)',1);
    line(cx,cy,cx+Math.cos(a)*r,cy-Math.sin(a)*r,cyan,2.5);
    line(cx,cy,cx+Math.cos(a+Math.PI/2)*r*.75,cy-Math.sin(a+Math.PI/2)*r*.75,'#a78bfa',2);
    text('α',width-22,cy-8,muted,11,'right');text('β',cx+8,22,muted,11);
    text('d-axis',cx+Math.cos(a)*r*.68,cy-Math.sin(a)*r*.68-8,cyan,10);
    text('q-axis',cx+Math.cos(a+Math.PI/2)*r*.66,cy-Math.sin(a+Math.PI/2)*r*.66-8,'#a78bfa',10);
    text('Conceptual coordinate-frame view',width/2,height-10,muted,10,'center');
  };
  const drawPWM=()=>{
    const left=28,right=width-16,top=30,row=height*.22,gap=height*.23;
    text('Illustrative switching states (not measured data)',left,16,muted,10);
    for(let phaseIndex=0;phaseIndex<3;phaseIndex++){
      const y=top+phaseIndex*gap;
      text(['A','B','C'][phaseIndex],left,y+4,cyan,10);
      line(left+18,y,right,y,'rgba(180,205,222,.2)',1);
      const n=48,period=(right-(left+18))/n;
      for(let i=0;i<n;i++){
        const t=(i/n)*Math.PI*2+phaseIndex*2*Math.PI/3+phase;
        const on=Math.sin(t)>.25*Math.sin((i%8)/8*Math.PI*2);
        const x=left+18+i*period;
        if(on) line(x,y-7,x,y+7,'rgba(0,234,255,.85)',Math.max(1,period*.7));
      }
    }
    text('Time →',right,height-10,muted,10,'right');
  };
  const drawSpeed=()=>{
    const left=42,right=width-16,top=26,bottom=height-32;
    line(left,bottom,right,bottom,'rgba(180,205,222,.4)',1);
    line(left,top,left,bottom,'rgba(180,205,222,.4)',1);
    text('Speed (illustrative)',left,15,muted,10);
    text('Time →',right,height-10,muted,10,'right');
    const ref=0.68,actual=0.68*(1-Math.exp(-phase*.0-1));
    const yRef=top+(1-ref)*(bottom-top);
    line(left,yRef,right,yRef,'#a78bfa',1.6,[5,4]);
    ctx.beginPath();
    for(let i=0;i<=100;i++){
      const t=i/100,x=left+t*(right-left);
      const response=ref*(1-Math.exp(-t*7));
      const y=bottom-response*(bottom-top);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=cyan;ctx.lineWidth=2.2;ctx.stroke();
    text('Reference',right-4,yRef-7,'#a78bfa',10,'right');
    text('Illustrative response',left+6,top+16,cyan,10);
  };
  function draw(){
    if(!ctx)return;
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='rgba(4,14,25,.35)';ctx.fillRect(0,0,width,height);
    if(mode==='field')drawField();
    else if(mode==='dq')drawDQ();
    else if(mode==='pwm')drawPWM();
    else drawSpeed();
  }
  const loop=now=>{
    if(!last)last=now;
    const delta=Math.min(50,now-last);last=now;
    if(!reduced){phase+=delta*.0007*(Number(speedSlider.value)/50);draw();}
    raf=requestAnimationFrame(loop);
  };
  modeButtons.forEach(btn=>btn.addEventListener('click',()=>{
    mode=btn.dataset.mode;
    modeButtons.forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    draw();
  }));
  speedSlider.addEventListener('input',()=>{
    speedValue.textContent=speedSlider.value+'%';
    if(reduced) { phase+=.08;draw(); }
  });
  if(!reduced) raf=requestAnimationFrame(loop);
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvasWrap);
  else window.addEventListener('resize',resize,{passive:true});
  resize();
  window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
})();
