/* ══════════════════════════════════════════════════════
   WAFA HADDAD — NUTRITIONNISTE
   Main Script — redesigned
   ══════════════════════════════════════════════════════
   0.  Theme toggle (dark / light)
   1.  Navbar scroll + hamburger
   2.  Scroll reveal (IntersectionObserver)
   3.  Hero parallax (portrait column)
   4.  Floating WhatsApp button
   5.  Smooth scroll (navbar offset)
   6.  Active nav link highlight
   7.  Contact form submit
   ══════════════════════════════════════════════════════ */

'use strict';


/* ── 0. THEME TOGGLE ───────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY   = 'wh-theme';

/**
 * Apply a theme ('light' or 'dark') to <html data-theme="…">
 * and persist it in localStorage.
 */
function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
}

// On load: use saved preference, or respect the OS preference
(function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
        applyTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
})();

// Toggle on click
themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);

    // Tiny spring animation on the button
    themeToggle.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.82)' }, { transform: 'scale(1)' }],
        { duration: 300, easing: 'cubic-bezier(.22,.68,0,1.2)' }
    );
});

/* ── 1. NAVBAR ─────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function onNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});


/* ── 2. SCROLL REVEAL ──────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


/* ── 3. IMAGE BLUR REVEAL ──────────────────────────────── */
const imgEls = document.querySelectorAll('img:not(.nav-logo-icon)');
const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('img-sharp');
            imgObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

imgEls.forEach(img => {
    img.classList.add('img-blur');
    if (img.complete) {
        img.classList.add('img-sharp');
    } else {
        imgObserver.observe(img);
    }
});


/* ── 4. HERO PARALLAX ──────────────────────────────────── */
const heroVisual = document.getElementById('heroVisual');

if (heroVisual && window.matchMedia('(min-width: 900px)').matches) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                // Subtle upward drift on the portrait column
                heroVisual.style.transform = `translateY(${scrolled * 0.22}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}


/* ── 4. FLOATING WHATSAPP ──────────────────────────────── */
const floatingWa = document.getElementById('floatingWa');

function onFloatingWaScroll() {
    floatingWa.classList.toggle('visible', window.scrollY > window.innerHeight * 0.55);
}
window.addEventListener('scroll', onFloatingWaScroll, { passive: true });


/* ── 5. SMOOTH SCROLL (navbar offset) ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});


/* ── 6. ACTIVE NAV LINK ────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a =>
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
            );
        }
    });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ── 7. CONTACT FORM → WhatsApp ────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

const WA_NUMBER = '21621716595';

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

        const firstName = contactForm.firstName.value.trim();
        const lastName  = contactForm.lastName.value.trim();
        const phone     = contactForm.phone.value.trim();
        const objective = contactForm.objective.options[contactForm.objective.selectedIndex].text;
        const message   = contactForm.message.value.trim();

        const objectiveLabel = contactForm.objective.value ? objective : '—';

        let text = `Bonjour Wafa, je souhaite prendre rendez-vous.\n\n`;
        text += `👤 Nom : ${firstName} ${lastName}\n`;
        text += `📞 Téléphone : ${phone}\n`;
        text += `🎯 Objectif : ${objectiveLabel}`;
        if (message) text += `\n💬 Message : ${message}`;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spin" width="17" height="17" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Ouverture WhatsApp…`;

        setTimeout(() => {
            window.open(
                `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
                '_blank',
                'noopener,noreferrer'
            );
            contactForm.style.display = 'none';
            formSuccess.classList.add('visible');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 600);
    });
}


/* ── 8. SERVICE ITEMS — expand on hover (accessibility) ── */
// Adds keyboard focus support alongside CSS hover
document.querySelectorAll('.svc-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = item.querySelector('.svc-link');
            if (link) link.click();
        }
    });
});


/* ── 9. SERVICE CARDS FLIP ───────────────────────────────── */
document.querySelectorAll('.svc-flip').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('.svc-back-cta')) return;
        card.classList.toggle('flipped');
    });
});

/* ── 10. VIDEO: autoplay on scroll into view ──────────────── */
const videoEl = document.querySelector('.video-wrapper video');
if (videoEl) {
    videoEl.muted = true;
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videoEl.play();
            } else {
                videoEl.pause();
            }
        });
    }, { threshold: 0.5 });
    videoObserver.observe(videoEl);
}

/* ── 11. IMAGE PROTECTION ────────────────────────────────── */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart',   e => e.preventDefault());
});
// Block keyboard shortcut Save (Ctrl/Cmd+S) — mild deterrent
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault();
});


/* ── 10. MARQUEE: pause on reduced-motion preference ──────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const track = document.querySelector('.marquee-track');
    if (track) track.style.animationPlayState = 'paused';

    // Also disable hero clip-path animation
    const heroVis = document.getElementById('heroVisual');
    if (heroVis) heroVis.style.animation = 'none';
}
