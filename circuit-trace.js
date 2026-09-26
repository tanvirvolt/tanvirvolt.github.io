(() => {
  'use strict';

  const STYLE_ID = 'circuit-trace-styles';
  const SVG_ID = 'circuit-trace-bg';

  const addStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #circuit-trace-bg{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.28;overflow:visible}
      #circuit-trace-bg .trace-base{fill:none;stroke:rgba(0,234,255,.14);stroke-width:1;stroke-linecap:round;stroke-linejoin:round}
      #circuit-trace-bg .trace-draw{fill:none;stroke:rgba(0,234,255,.55);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 3px rgba(0,234,255,.18));stroke-dasharray:1;stroke-dashoffset:1}
      #circuit-trace-bg .trace-node{fill:rgba(0,234,255,.65);filter:drop-shadow(0 0 4px rgba(0,234,255,.28))}
      #circuit-trace-bg .trace-via{fill:rgba(0,234,255,.08);stroke:rgba(0,234,255,.32);stroke-width:1}
      .shell{position:relative;z-index:1}
      @media(max-width:700px){#circuit-trace-bg{opacity:.18}#circuit-trace-bg .trace-draw{stroke-width:1}}
      @media(prefers-reduced-motion:reduce){#circuit-trace-bg .trace-draw{stroke-dashoffset:0!important}}
    `;
    document.head.appendChild(style);
  };

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

  const createSvg = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.id = SVG_ID;
    svg.setAttribute('viewBox','0 0 100 100');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('aria-hidden','true');

    traces.forEach((d) => {
      const base = document.createElementNS('http://www.w3.org/2000/svg','path');
      base.setAttribute('class','trace-base');
      base.setAttribute('d',d);
      svg.appendChild(base);

      const draw = document.createElementNS('http://www.w3.org/2000/svg','path');
      draw.setAttribute('class','trace-draw');
      draw.setAttribute('d',d);
      draw.setAttribute('pathLength','1');
      svg.appendChild(draw);
    });

    nodes.forEach(([x,y]) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('class','trace-node');
      circle.setAttribute('cx',x);
      circle.setAttribute('cy',y);
      circle.setAttribute('r','.75');
      svg.appendChild(circle);

      const ring = document.createElementNS('http://www.w3.org/2000/svg','circle');
      ring.setAttribute('class','trace-via');
      ring.setAttribute('cx',x);
      ring.setAttribute('cy',y);
      ring.setAttribute('r','1.7');
      svg.appendChild(ring);
    });

    return svg;
  };

  const init = () => {
    if (document.getElementById(SVG_ID)) return;
    addStyles();
    document.body.prepend(createSvg());

    const paths = [...document.querySelectorAll('#circuit-trace-bg .trace-draw')];
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      paths.forEach((path, index) => {
        const start = index * 0.045;
        const local = Math.min(1, Math.max(0, (progress - start) / 0.62));
        const length = path.getTotalLength();
        path.style.strokeDashoffset = String(length * (1 - local));
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
    window.addEventListener('resize', update, {passive:true});
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
