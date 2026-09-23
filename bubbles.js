// Hero background: slow, soft water bubbles on a canvas.
// Lightweight by design: no library, pauses off-screen / in background tabs,
// and never runs for visitors who prefer reduced motion.
(() => {
    const hero = document.querySelector('.hero');
    const canvas = document.querySelector('.hero-bubbles');
    if (!hero || !canvas || !canvas.getContext) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;
    let bubbles = [];
    let color = '79, 209, 238';
    let running = false, visible = true, last = 0, frame = 0;

    // Resolve the themed --water colour (canvas can't read CSS variables directly)
    const readColor = () => {
        const m = getComputedStyle(canvas).color.match(/\d+(\.\d+)?/g);
        if (m) color = m.slice(0, 3).join(', ');
    };

    const rand = (min, max) => min + Math.random() * (max - min);

    const makeBubble = (initial) => {
        // Mostly small bubbles, with the occasional larger one
        const r = Math.random() < 0.8 ? rand(2.5, 7) : rand(8, 16);
        return {
            x: rand(0, width),
            y: initial ? rand(0, height) : height + r + rand(0, 60),
            r,
            speed: rand(10, 28) * (0.6 + r / 12),   // px per second; larger bubbles rise a bit faster
            drift: rand(6, 18),                     // side-to-side wobble in px
            phase: rand(0, Math.PI * 2),
            wobble: rand(0.4, 1.1),
            alpha: rand(0.45, 0.85)
        };
    };

    const resize = () => {
        const rect = hero.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.max(14, Math.min(48, Math.round((width * height) / 22000)));
        while (bubbles.length < count) bubbles.push(makeBubble(true));
        bubbles.length = count;
    };

    const draw = (b, t) => {
        const x = b.x + Math.sin(t * b.wobble + b.phase) * b.drift;
        // Fade in from the bottom and out towards the top
        const p = b.y / height;
        const fade = Math.min(1, (1 - p) * 4) * Math.min(1, p * 3);
        const a = b.alpha * Math.max(0, fade);
        if (a <= 0.01) return;

        // Bubble body: clear centre, tinted rim
        const g = ctx.createRadialGradient(x, b.y, b.r * 0.2, x, b.y, b.r);
        g.addColorStop(0, `rgba(${color}, ${a * 0.06})`);
        g.addColorStop(0.7, `rgba(${color}, ${a * 0.3})`);
        g.addColorStop(1, `rgba(${color}, ${a * 0.8})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Small highlight
        if (b.r > 3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.7})`;
            ctx.beginPath();
            ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.18, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const tick = (now) => {
        if (!running) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const t = now / 1000;

        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < bubbles.length; i++) {
            const b = bubbles[i];
            b.y -= b.speed * dt;
            if (b.y < -b.r * 2) bubbles[i] = makeBubble(false);
            else draw(b, t);
        }
        frame = requestAnimationFrame(tick);
    };

    const start = () => {
        if (running || !visible || document.hidden) return;
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
    };
    const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
    };

    readColor();
    resize();
    new ResizeObserver(resize).observe(hero);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColor);

    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
    }).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    start();
})();
