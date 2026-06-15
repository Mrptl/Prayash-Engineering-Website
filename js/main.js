document.addEventListener('DOMContentLoaded', function () {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth scroll to top with easing animation
    function smoothScrollToTop() {
        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
            return;
        }

        const startPosition = window.pageYOffset;
        const duration = 800; // Animation duration in ms
        let startTime = null;

        // Easing function for smooth deceleration
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);

            window.scrollTo(0, startPosition * (1 - easeProgress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Add click event to scroll button
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollToTop();
        });

        const toggleScrollTopButton = function () {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleScrollTopButton, { passive: true });
        toggleScrollTopButton();
    }

    // --- Scroll Animations & Interactivity ---
    const animatedElements = document.querySelectorAll('.stats-bar, .section-header, .hero-content, .footer-grid, .top-bar, .stat-item');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        animatedElements.forEach((el) => {
            el.classList.add('is-visible');
        });
    } else {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('stat-item')) {
                        animateValue(entry.target.querySelector('h3'));
                    }
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            // Add staggering effect
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
            observer.observe(el);
        });
    }

    // Stats Animation Logic
    function animateValue(obj) {
        if (!obj) return;
        const text = obj.innerText;
        const finalValue = parseInt(text.replace(/[^0-9]/g, ''));
        if (isNaN(finalValue)) return;

        const suffix = text.replace(/[0-9]/g, '');
        let startTimestamp = null;
        const duration = 2000;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * finalValue) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Preloader Dismissal ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const dismissLoader = () => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }
        };

        // Dismiss loader on window load (assets loaded)
        window.addEventListener('load', dismissLoader);

        // Fallback safety timeout (max 2.5 seconds loading window)
        setTimeout(dismissLoader, 2500);
    }
});

// Footer Inquiry Form Handler (lightweight mailto fallback for all pages)
// The main RFQ form on contact.html is handled by its own inline script.
document.querySelectorAll('.footer-inquiry-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name    = form.querySelector('[name="footer_name"]')?.value  || '';
        const email   = form.querySelector('[name="footer_email"]')?.value || '';
        const message = form.querySelector('[name="footer_message"]')?.value || '';
        const subject = encodeURIComponent(`Quick Inquiry from Website: ${name}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:info@prayashengineering.com?subject=${subject}&body=${body}`;
        const btn = form.querySelector('button[type="submit"]');
        const statusEl = form.querySelector('.footer-form-status');
        if (statusEl) {
            statusEl.textContent = 'Redirecting to email client…';
            statusEl.style.color = '#4ade80';
        }
        if (btn) btn.textContent = 'Opening email…';
        setTimeout(function () { form.reset(); if (btn) btn.textContent = 'Send Inquiry'; if (statusEl) statusEl.textContent = ''; }, 4000);
    });
});



// FAQ Accordion Handler
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Hamburger Menu Logic
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navOverlay = document.querySelector('.nav-overlay');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}


