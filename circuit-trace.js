(() => {
  'use strict';

  const STYLE_ID = 'circuit-trace-styles';
  const SVG_ID = 'circuit-trace-bg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = window.matchMedia('(max-width: 700px)').matches;

  const traces = [
    'M40 8 V24 H17 V42 H7',
    'M96 4 V18 H82 V35 H62 V55',
    'M6 70 H23 V58 H39 V42 H58',
    'M97 74 H79 V61 H68 V45',
    'M12 92 V78 H28 V68 H48 V54',
    'M91 94 V80 H73 V70 H54 V57',
    'M31 0 V12 H45 V26',
    'M68 100 V88 H55 V77 H43',
    'M18 32 H30 V20 H48 V9',
    'M84 30 H72 V17 H57 V7'
  ];
  const nodes = [
    [40,24],[17,42],[82,35],[62,55],[23,58],[39,42],[79,61],[68,45],
    [28,68],[48,54],[73,70],[54,57],[31,12],[45,26],[55,77],[43,88],
    [30,20],[48,9],[72,17],[57,7]
  ];

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #circuit-trace-bg{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.19;overflow:hidden;transform:translate3d(var(--trace-depth-x,0px),var(--trace-depth-y,0px),0);transition:opacity .3s ease}
      #circuit-trace-bg .trace-base{fill:none;stroke:rgba(0,234,255,.11);stroke-width:1;stroke-linecap:round;stroke-linejoin:round}
      #circuit-trace-bg .trace-draw{fill:none;stroke:rgba(0,234,255,.48);stroke-width:1.15;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 2px rgba(0,234,255,.14));stroke-dasharray:1;stroke-dashoffset:1;opacity:.6}
      #circuit-trace-bg .trace-node{fill:rgba(0,234,255,.38);filter:drop-shadow(0 0 2px rgba(0,234,255,.15));transform-box:fill-box;transform-origin:center}
      #circuit-trace-bg .trace-node.trace-pulse{animation:trace-node-pulse 3.8s ease-in-out infinite}
      #circuit-trace-bg .trace-via{fill:rgba(0,234,255,.035);stroke:rgba(0,234,255,.22);stroke-width:1}
      #circuit-trace-bg .trace-draw.trace-pulse-line{animation:trace-line-pulse 5.8s ease-in-out infinite}
      .shell{position:relative;z-index:1}
      @keyframes trace-node-pulse{0%,100%{opacity:.35;transform:scale(.85)}50%{opacity:.95;transform:scale(1.2);filter:drop-shadow(0 0 4px rgba(0,234,255,.42))}}
      @keyframes trace-line-pulse{0%,100%{opacity:.35}50%{opacity:.85;filter:drop-shadow(0 0 4px rgba(0,234,255,.28))}}
      @media(max-width:700px){#circuit-trace-bg{opacity:.10}#circuit-trace-bg .trace-draw{stroke-width:.9;filter:none}#circuit-trace-bg .trace-node{filter:none}#circuit-trace-bg .trace-draw:nth-of-type(even),#circuit-trace-bg .trace-base:nth-of-type(even){opacity:.35}}
      @media(prefers-reduced-motion:reduce){#circuit-trace-bg{transform:none!important;transition:none!important}#circuit-trace-bg .trace-draw{stroke-dashoffset:0!important;opacity:.45}#circuit-trace-bg .trace-node,#circuit-trace-bg .trace-pulse-line{animation:none!important;filter:none!important}}
    `;
    document.head.appendChild(style);
  };

  const createSvg = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.id = SVG_ID;
    svg.setAttribute('viewBox','0 0 100 100');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('aria-hidden','true');

    const visibleTraces = mobile ? traces.filter((_, index) => index % 2 === 0) : traces;
    visibleTraces.forEach((d, index) => {
      const base = document.createElementNS('http://www.w3.org/2000/svg','path');
      base.setAttribute('class','trace-base');
      base.setAttribute('d',d);
      svg.appendChild(base);

      const draw = document.createElementNS('http://www.w3.org/2000/svg','path');
      draw.setAttribute('class','trace-draw');
      draw.setAttribute('d',d);
      draw.setAttribute('pathLength','1');
      if (!reduceMotion && index % 3 === 0) {
        draw.classList.add('trace-pulse-line');
        draw.style.animationDelay = (index * -0.7) + 's';
      }
      svg.appendChild(draw);
    });

    const visibleNodes = mobile ? nodes.filter((_, index) => index % 3 === 0) : nodes;
    visibleNodes.forEach(([x,y], index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('class','trace-node');
      circle.setAttribute('cx',x);
      circle.setAttribute('cy',y);
      circle.setAttribute('r', mobile ? '.55' : '.75');
      if (!reduceMotion && index % 2 === 0) {
        circle.classList.add('trace-pulse');
        circle.style.animationDelay = (index * -0.31) + 's';
      }
      svg.appendChild(circle);

      const ring = document.createElementNS('http://www.w3.org/2000/svg','circle');
      ring.setAttribute('class','trace-via');
      ring.setAttribute('cx',x);
      ring.setAttribute('cy',y);
      ring.setAttribute('r',mobile ? '1.25' : '1.7');
      svg.appendChild(ring);
    });
    return svg;
  };

  const init = () => {
    if (document.getElementById(SVG_ID)) return;
    addStyles();
    const svg = createSvg();
    document.body.prepend(svg);

    const paths = [...svg.querySelectorAll('.trace-draw')];
    const lengths = paths.map(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      return length;
    });

    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      paths.forEach((path, index) => {
        const start = index * (mobile ? .075 : .045);
        const local = Math.min(1, Math.max(0, (progress - start) / .62));
        path.style.strokeDashoffset = String(lengths[index] * (1 - local));
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    update();
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});

    // Tiny pointer-driven depth shift on desktop only; no pointer tracking on touch devices.
    if (!reduceMotion && finePointer && !mobile) {
      let frame = 0;
      window.addEventListener('pointermove', event => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const x = (event.clientX / Math.max(1,window.innerWidth) - .5) * -5;
          const y = (event.clientY / Math.max(1,window.innerHeight) - .5) * -5;
          svg.style.setProperty('--trace-depth-x', x.toFixed(2) + 'px');
          svg.style.setProperty('--trace-depth-y', y.toFixed(2) + 'px');
          frame = 0;
        });
      }, {passive:true});
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
