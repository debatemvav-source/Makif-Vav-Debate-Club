document.addEventListener('DOMContentLoaded', async () => {
    // State
    let content = null;

    // Elements
    const elements = {
        // Nav
        navLogo: document.getElementById('nav-logo'),
        navTitle: document.getElementById('nav-title'),
        navButtons: document.querySelectorAll('.nav-link'),
        mobileBtn: document.getElementById('mobile-menu-btn'),
        navMenu: document.querySelector('nav'),
        themeToggle: document.getElementById('theme-toggle'),
        sections: document.querySelectorAll('.page-section'),
        
        // Home
        heroSection: document.getElementById('hero-section'),
        heroTitle: document.getElementById('hero-title'),
        heroSubtitle: document.getElementById('hero-subtitle'),
        heroCta: document.getElementById('hero-cta'),
        featuresTitle: document.getElementById('features-title'),
        featuresGrid: document.getElementById('features-grid'),
        
        // About
        aboutTitle: document.getElementById('about-title'),
        aboutContainer: document.getElementById('about-container'),
        
        // Testimonials
        testimonialsTitle: document.getElementById('testimonials-title'),
        testimonialsGrid: document.getElementById('testimonials-grid'),
        
        // Gallery
        galleryTitle: document.getElementById('gallery-title'),
        galleryDesc: document.getElementById('gallery-desc'),
        galleryGrid: document.getElementById('gallery-grid'),
        
        // FAQ
        faqTitle: document.getElementById('faq-title'),
        faqContainer: document.getElementById('faq-container'),

        // Teams
        teamsTitle: document.getElementById('teams-title'),
        teamsContainer: document.getElementById('teams-container'),

        // Staff
        staffTitle: document.getElementById('staff-title'),
        staffContainer: document.getElementById('staff-container'),
        
        // Footer
        contactEmail: document.getElementById('contact-email'),
        contactIg: document.getElementById('contact-ig')
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Fetch Content
    try {
        const response = await fetch('content.json');
        content = await response.json();
        renderContent();
        initScrollAnimations();
    } catch (error) {
        console.error('Error loading content:', error);
    }

    // Navigation Logic
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            elements.navButtons.forEach(b => b.classList.remove('active'));
            elements.sections.forEach(s => s.classList.remove('active'));
            
            // Add active classes
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Close mobile menu if open
            elements.navMenu.classList.remove('show');
            elements.mobileBtn.textContent = '☰';
            elements.mobileBtn.style.transform = 'rotate(0deg)';
        });
    });

    // Mobile Menu Toggle
    elements.mobileBtn.addEventListener('click', () => {
        elements.navMenu.classList.toggle('show');
        const isShowing = elements.navMenu.classList.contains('show');
        elements.mobileBtn.textContent = isShowing ? '✕' : '☰';
        elements.mobileBtn.style.transform = isShowing ? 'rotate(90deg)' : 'rotate(0deg)';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && elements.navMenu.classList.contains('show')) {
            elements.navMenu.classList.remove('show');
            elements.mobileBtn.textContent = '☰';
            elements.mobileBtn.style.transform = 'rotate(0deg)';
        }
    });

    // Logo click redirects to home
    elements.navLogo.addEventListener('click', () => {
        document.getElementById('nav-home').click();
    });
    elements.navTitle.addEventListener('click', () => {
        document.getElementById('nav-home').click();
    });

    // Theme Toggle
    elements.themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Render Content Function
    function renderContent() {
        if(!content) return;

        // General
        document.title = content.general.title;
        if (content.general.logo) {
            elements.navLogo.src = content.general.logo;
            elements.navLogo.style.display = 'block';
        }
        elements.navTitle.textContent = content.general.title.split(' ')[0] + ' ' + content.general.title.split(' ')[1]; // Just "מועדון הדיבייט"
        
        elements.contactEmail.href = 'mailto:' + content.general.email;
        elements.contactEmail.textContent = 'אימייל: ' + content.general.email;
        
        elements.contactIg.href = 'https://instagram.com/' + content.general.instagram.replace('@', '');
        elements.contactIg.textContent = 'אינסטגרם: ' + content.general.instagram;

        // Nav labels
        document.getElementById('nav-home').textContent = content.nav.home;
        document.getElementById('nav-about').textContent = content.nav.about;
        document.getElementById('nav-testimonials').textContent = content.nav.testimonials;
        document.getElementById('nav-gallery').textContent = content.nav.gallery;
        document.getElementById('nav-teams').textContent = content.nav.teams || 'נבחרות העבר';
        document.getElementById('nav-staff').textContent = content.nav.staff || 'צוות המועדון';
        document.getElementById('nav-faq').textContent = content.nav.faq;

        // Home
        if (content.home.heroImage) {
            elements.heroSection.style.backgroundImage = `url('${content.home.heroImage}')`;
        }
        elements.heroTitle.textContent = content.home.heroTitle;
        elements.heroSubtitle.textContent = content.home.heroSubtitle;
        elements.heroCta.textContent = content.home.cta;
        elements.featuresTitle.textContent = content.home.featuresTitle;
        
        elements.featuresGrid.className = 'timeline-container';
        elements.featuresGrid.innerHTML = `
            <div class="timeline-line-bg"></div>
            <div class="timeline-line-progress" id="timeline-progress"></div>
        ` + content.home.features.map((feature, index) => {
            const side = index % 2 === 0 ? 'right' : 'left';
            return `
            <div class="timeline-item ${side} reveal">
                <div class="timeline-dot">${index + 1}</div>
                <div class="timeline-content-wrapper">
                    <div class="timeline-ribbon">
                        <div class="feature-icon">${feature.icon}</div>
                        <h3 class="feature-title">${feature.title}</h3>
                    </div>
                    <p class="feature-desc">${feature.description}</p>
                </div>
            </div>
        `}).join('');

        elements.heroCta.addEventListener('click', () => {
            document.getElementById('nav-about').click();
        });

        // About
        elements.aboutTitle.textContent = content.about.title;
        elements.aboutContainer.innerHTML = content.about.paragraphs.map((p, index) => {
            const isReverse = index % 2 !== 0 ? 'reverse' : '';
            const img = content.about.images && content.about.images[index] ? content.about.images[index] : '';
            return `
            <div class="about-item reveal ${isReverse}">
                <div class="about-item-text">
                    <h3>${p.subtitle}</h3>
                    <p>${p.text}</p>
                </div>
                ${img ? `<div class="about-item-img"><img src="${img}" alt="${p.subtitle}"></div>` : ''}
            </div>
        `}).join('');

        // Testimonials
        elements.testimonialsTitle.textContent = content.testimonials.title;
        if (content.testimonials.items && content.testimonials.items.length > 0) {
            const loopItems = [...content.testimonials.items, ...content.testimonials.items, ...content.testimonials.items];
            elements.testimonialsGrid.innerHTML = loopItems.map(t => `
                <div class="testimonial-card">
                    <p class="testimonial-quote">"${t.quote}"</p>
                    <h4 class="testimonial-name">${t.name}</h4>
                </div>
            `).join('');
        }

        // Gallery
        elements.galleryTitle.textContent = content.gallery.title;
        elements.galleryDesc.textContent = content.gallery.description;
        
        const galleryContainer = document.getElementById('gallery-slideshow');
        
        function setupSlideshow(imageArray) {
            if (!imageArray || imageArray.length === 0) {
                galleryContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">אין תמונות בגלריה כרגע.</p>';
                return;
            }
            galleryContainer.innerHTML = imageArray.map((img, index) => `
                <img src="${img}" alt="Debate Club Moment" class="slide ${index === 0 ? 'active' : ''}">
            `).join('');
            
            const slides = galleryContainer.querySelectorAll('.slide');
            let currentSlide = 0;
            if(window.galleryInterval) clearInterval(window.galleryInterval);
            
            if (slides.length > 1) {
                window.galleryInterval = setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 4000);
            }
        }

        if (content.general.driveApiUrl) {
            fetch(content.general.driveApiUrl)
                .then(res => res.json())
                .then(data => {
                    // הגלריה
                    if (data && data.gallery && data.gallery.length > 0) {
                        setupSlideshow(data.gallery);
                    } else {
                        setupSlideshow(content.gallery.images);
                    }
                    
                    // תמונות בודדות
                    if (data.logo) document.getElementById('nav-logo').src = data.logo;
                    if (data.hero) elements.heroSection.style.backgroundImage = `url('${data.hero}')`;
                    
                    // אודות
                    if (data.about && data.about.length > 0) {
                        const aboutImgs = document.querySelectorAll('.about-item-img img');
                        aboutImgs.forEach((img, i) => {
                            if (data.about[i]) img.src = data.about[i];
                        });
                    }
                    
                    // נבחרות מהדרייב
                    if (data.teams && data.teams.length > 0) {
                        const teamImgs = document.querySelectorAll('.team-image');
                        teamImgs.forEach((img, i) => {
                            if (data.teams[i]) img.src = data.teams[i];
                        });
                    }

                    // צוות מהדרייב
                    if (data.staff && data.staff.length > 0) {
                        const staffImgs = document.querySelectorAll('.staff-img-col img');
                        staffImgs.forEach((img, i) => {
                            if (data.staff[i]) img.src = data.staff[i];
                        });
                    }
                })
                .catch(err => {
                    console.error('Failed to load images from Google Drive:', err);
                    setupSlideshow(content.gallery.images);
                });
        } else {
            setupSlideshow(content.gallery.images);
        }

        // FAQ
        elements.faqTitle.textContent = content.faq.title;
        elements.faqContainer.innerHTML = content.faq.questions.map((item, index) => `
            <div class="qa-pair" style="animation-delay: ${index * 0.1}s">
                <div class="chat-message chat-question">
                    <div class="chat-bubble user-bubble">${item.q}</div>
                </div>
                <div class="chat-message chat-answer">
                    <div class="chat-bubble bot-bubble">${item.a}</div>
                </div>
            </div>
        `).join('');

        // Teams
        if (content.teams && elements.teamsTitle && elements.teamsContainer) {
            elements.teamsTitle.textContent = content.teams.title;
            elements.teamsContainer.innerHTML = content.teams.items.map((team, index) => {
                const isReverse = index % 2 !== 0 ? 'reverse' : '';
                return `
                <div class="team-showcase-item reveal ${isReverse}">
                    <div class="team-year-col">
                        <div class="year-badge">${team.years}</div>
                        <p class="team-desc">${team.description || ''}</p>
                    </div>
                    <div class="team-image-col">
                        <img src="${team.image}" alt="נבחרת ${team.years}" class="team-image">
                    </div>
                </div>
            `}).join('');
        }

        // Staff
        if (content.staff && elements.staffTitle && elements.staffContainer) {
            elements.staffTitle.textContent = content.staff.title;
            const staffOrder = ['mentor', 'captain', 'seniors', 'juniors'];
            let staffHtml = '';
            staffOrder.forEach((key, index) => {
                const person = content.staff[key];
                if (person) {
                    const isReverse = index % 2 !== 0 ? 'reverse' : '';
                    staffHtml += `
                        <div class="staff-block reveal ${isReverse}">
                            <div class="staff-img-col">
                                <img src="${person.image}" alt="${person.title}">
                            </div>
                            <div class="staff-text-col">
                                <h3 class="staff-role">${person.title}</h3>
                                <blockquote class="staff-quote">
                                    <span class="quote-mark">"</span>
                                    ${person.word}
                                    <span class="quote-mark">"</span>
                                </blockquote>
                            </div>
                        </div>
                    `;
                }
            });
            elements.staffContainer.innerHTML = staffHtml;
        }
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('active');
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal, .about-item, .testimonial-card, .qa-pair').forEach(el => observer.observe(el));
        
        // Scroll Progress Bar
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + "%";
                
                // Timeline Glowing Line
                const timelineContainer = document.querySelector('.timeline-container');
                const timelineProgress = document.getElementById('timeline-progress');
                if (timelineContainer && timelineProgress) {
                    const rect = timelineContainer.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const startPos = rect.top - (windowHeight / 2);
                    let drawPercentage = -startPos / rect.height;
                    if (drawPercentage < 0) drawPercentage = 0;
                    if (drawPercentage > 1) drawPercentage = 1;
                    timelineProgress.style.height = (drawPercentage * 100) + "%";
                    
                    document.querySelectorAll('.timeline-item').forEach(item => {
                        const itemRect = item.getBoundingClientRect();
                        if (itemRect.top + (itemRect.height / 2) < windowHeight / 2 + 50) {
                            item.classList.add('timeline-active');
                        } else {
                            item.classList.remove('timeline-active');
                        }
                    });
                }
            });
        }
    }
});
