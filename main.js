// Site-wide behaviour. Content is fully visible without JS; this only enhances.
(() => {
    // 1. Header border once the page scrolls
    const header = document.querySelector('[data-header]');
    const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // 2. Mobile navigation
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');

    const setMenu = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
    };

    if (toggle && nav) {
        toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
        nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
        });
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
        });
        window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
    }

    // 3. "Enquire" links pre-select the product in the contact form
    const productSelect = document.getElementById('f-product');
    document.querySelectorAll('[data-product]').forEach((link) => {
        link.addEventListener('click', () => {
            if (productSelect) productSelect.value = link.dataset.product;
        });
    });

    // 4. Social media links: paste each profile URL between the quotes.
    //    Icons without a URL stay visible but aren't clickable.
    const socialLinks = {
        linkedin: '',
        instagram: '',
        facebook: '',
        x: '',
        whatsapp: 'https://wa.me/971581670324'
    };
    document.querySelectorAll('[data-social]').forEach((link) => {
        const url = socialLinks[link.dataset.social];
        if (!url) return;
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
    });

    // 5. Current year in footer
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    // 6. Contact form: submit to Formspree without leaving the page
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');

    const setStatus = (message, type) => {
        status.textContent = message;
        status.className = 'form-status' + (type ? ` is-${type}` : '');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        button.disabled = true;
        setStatus('Sending…');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                form.reset();
                setStatus("Thanks! We've received your enquiry and will be in touch shortly.", 'success');
            } else {
                setStatus('Something went wrong. Please check your details, or email info@saspumps.com.', 'error');
            }
        } catch {
            setStatus('Network error. Please try again, or call +971 58 167 0324.', 'error');
        } finally {
            button.disabled = false;
        }
    });
})();
