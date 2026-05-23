/* Zycomayura Info Tech Pvt Ltd - Interactive Scripts */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar scroll
    const navbar = document.querySelector('.navbar');
    const onScroll = () => navbar && navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();

    // 2. Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(l =>
            l.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            })
        );
    }

    // 3. Active page link
    const page = (window.location.pathname.split('/').pop()) || 'index.html';
    document.querySelectorAll(`.nav-link[href="${page}"], .dropdown-item[href="${page}"]`).forEach(l => {
        l.classList.add('active');
        const dd = l.closest('.nav-dropdown');
        if (dd) { const p = dd.querySelector('.nav-link'); if (p) p.classList.add('active'); }
    });

    // 4. Animated counters
    const counters = document.querySelectorAll('.stat-num');
    if (counters.length) {
        const animateCounter = el => {
            const target = parseInt(el.dataset.target) || 0;
            const suffix = el.dataset.suffix || '';
            let cur = 0;
            const step = target / 45;
            const interval = setInterval(() => {
                cur += step;
                if (cur >= target) { el.textContent = target + suffix; clearInterval(interval); }
                else el.textContent = Math.floor(cur) + suffix;
            }, 30);
        };
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
        }, { threshold: 0.5 });
        counters.forEach(c => obs.observe(c));
    }

    // 5. Portfolio filters (supports both .filter-btn/.port-card and .portfolio-filter-btn/.portfolio-item)
    const filterBtns = document.querySelectorAll('.filter-btn, .portfolio-filter-btn');
    const portItems = document.querySelectorAll('.port-card, .portfolio-item');
    if (filterBtns.length && portItems.length) {
        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            portItems.forEach(item => {
                const cats = (item.dataset.category || '').split(' ');
                if (f === 'all' || cats.includes(f)) {
                    item.style.display = '';
                    item.style.animation = 'fadeIn 0.45s ease both';
                } else item.style.display = 'none';
            });
        }));
    }

    // 6. FAQ accordion (supports both .faq-item and .faq-card variants)
    const faqItems = document.querySelectorAll('.faq-item, .faq-card');
    faqItems.forEach(card => {
        const btn = card.querySelector('.faq-q, .faq-header-btn');
        const panel = card.querySelector('.faq-a, .faq-panel');
        if (btn && panel) {
            btn.addEventListener('click', () => {
                const open = card.classList.contains('active');
                faqItems.forEach(c => {
                    c.classList.remove('active');
                    const p = c.querySelector('.faq-a, .faq-panel');
                    if (p) p.style.maxHeight = null;
                });
                if (!open) { card.classList.add('active'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
            });
        }
    });

    // 7. Tech tabs
    const techBtns = document.querySelectorAll('.tech-tab');
    const techGrid = document.querySelector('.tech-grid');
    if (techBtns.length && techGrid) {
        const data = {
            frontend: [
                { n: 'React', i: 'fab fa-react' }, { n: 'Angular', i: 'fab fa-angular' },
                { n: 'Vue.js', i: 'fab fa-vuejs' }, { n: 'HTML5', i: 'fab fa-html5' },
                { n: 'CSS3', i: 'fab fa-css3-alt' }, { n: 'JavaScript', i: 'fab fa-js-square' }
            ],
            backend: [
                { n: 'Node.js', i: 'fab fa-node-js' }, { n: 'PHP', i: 'fab fa-php' },
                { n: 'Python', i: 'fab fa-python' }, { n: 'Java', i: 'fab fa-java' },
                { n: '.NET', i: 'fas fa-code' }
            ],
            mobile: [
                { n: 'Flutter', i: 'fas fa-mobile-alt' }, { n: 'React Native', i: 'fab fa-react' },
                { n: 'Kotlin', i: 'fab fa-android' }, { n: 'Swift', i: 'fab fa-apple' }
            ],
            database: [
                { n: 'MySQL', i: 'fas fa-database' }, { n: 'PostgreSQL', i: 'fas fa-database' },
                { n: 'MongoDB', i: 'fas fa-leaf' }
            ]
        };
        const render = cat => {
            techGrid.innerHTML = '';
            (data[cat] || []).forEach(t => {
                const d = document.createElement('div');
                d.className = 'tech-item animate-fade-in-up';
                d.innerHTML = `<i class="${t.i}"></i><span>${t.n}</span>`;
                techGrid.appendChild(d);
            });
        };
        techBtns.forEach(b => b.addEventListener('click', () => {
            techBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            render(b.dataset.cat);
        }));
    }

    // 8. Toast notification
    const toast = (msg, ok = true) => {
        const t = document.createElement('div');
        Object.assign(t.style, {
            position: 'fixed', bottom: '28px', left: '28px',
            background: ok ? 'var(--color-primary-light)' : '#dc2626',
            border: ok ? '1px solid var(--color-accent)' : '1px solid #fca5a5',
            color: '#fff', padding: '14px 22px', borderRadius: '10px',
            fontSize: '0.92rem', fontWeight: '500', zIndex: '9999',
            boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '10px',
            animation: 'fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1) both'
        });
        t.innerHTML = `<i class="fa ${ok ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 4000);
    };

    // 9. Contact form
    const cf = document.getElementById('contactForm');
    if (cf) cf.addEventListener('submit', e => {
        e.preventDefault();
        const n = document.getElementById('formName')?.value.trim();
        const em = document.getElementById('formEmail')?.value.trim();
        const msg = document.getElementById('formMessage')?.value.trim();
        if (!n || !em || !msg) return toast('Please fill all required fields.', false);
        toast(`Thank you, ${n}! Our team will contact you within 24 hours.`);
        cf.reset();
    });

    // 10. Newsletter
    const nf = document.getElementById('newsletterForm');
    if (nf) nf.addEventListener('submit', e => {
        e.preventDefault();
        const inp = nf.querySelector('input[type="email"]');
        if (inp && inp.value.trim()) { toast('Subscribed! Welcome to Zycomayura insights.'); nf.reset(); }
        else toast('Please enter a valid email.', false);
    });

    // 11. Career form
    const crf = document.getElementById('careerForm');
    if (crf) crf.addEventListener('submit', e => {
        e.preventDefault();
        const n = document.getElementById('applicantName')?.value.trim();
        const em = document.getElementById('applicantEmail')?.value.trim();
        const pos = document.getElementById('applicantPosition')?.value;
        if (!n || !em || !pos) return toast('Please complete all required fields.', false);
        toast(`Application submitted! Our HR team will review your profile for ${pos}.`);
        crf.reset();
    });

    // 12. Scroll-reveal animation for sections
    const revealEls = document.querySelectorAll('section .section-header, section .grid-3, section .grid-4, section .split-grid, section .stats-grid, section .why-container, section .portfolio-gallery, section .pricing-container, section .blog-grid, section .faq-container, section .faq-list, section .jobs-list, section .contact-grid');
    if (revealEls.length) {
        revealEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; });
        const revealObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; revealObs.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => revealObs.observe(el));
    }

    // 13. Scroll-to-top button
    const topBtn = document.createElement('button');
    topBtn.innerHTML = '<i class="fa fa-chevron-up"></i>';
    Object.assign(topBtn.style, {
        position: 'fixed', bottom: '100px', right: '28px', zIndex: '998',
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'var(--gradient-accent)', color: 'white', border: 'none',
        cursor: 'pointer', fontSize: '1rem', boxShadow: 'var(--shadow-blue)',
        opacity: '0', pointerEvents: 'none', transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    document.body.appendChild(topBtn);
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { topBtn.style.opacity = '1'; topBtn.style.pointerEvents = 'auto'; }
        else { topBtn.style.opacity = '0'; topBtn.style.pointerEvents = 'none'; }
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
