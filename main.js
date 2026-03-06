document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Toggle icon between bars and times
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnToggleBtn = mobileBtn.contains(event.target);

        // If the menu is active, and click was outside both the menu and the toggle button
        if (navLinks.classList.contains('active') && !isClickInsideMenu && !isClickOnToggleBtn) {
            navLinks.classList.remove('active');

            // Reset the icon to bars
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');

            // Reset color logic based on scroll position
            if (window.scrollY > 50) {
                icon.style.color = 'var(--primary-blue)';
            } else {
                icon.style.color = 'var(--white)';
            }
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    // Select all elements that have an animation class
    const observerElements = document.querySelectorAll('.animate-up, .fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger CSS transition
                entry.target.classList.add('visible');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observerElements.forEach(el => {
        observer.observe(el);
    });

    // Trigger hero animations immediately on load
    setTimeout(() => {
        document.querySelectorAll('.hero .animate-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 4. Form Submission (Send to Formspree via AJAX)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';

            // Gather form data
            const formData = new FormData(form);

            try {
                // Send data to Formspree
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerText = 'Message Sent!';
                    btn.style.backgroundColor = '#10B981'; // Success Green
                    form.reset();
                } else {
                    btn.innerText = 'Check Details & Try Again';
                    btn.style.backgroundColor = '#E11D48'; // Error Red
                }
            } catch (error) {
                btn.innerText = 'Network Error';
                btn.style.backgroundColor = '#E11D48'; // Error Red
            }

            // Reset button after 3 seconds
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.style.opacity = '1';
            }, 3000);
        });
    }
});
