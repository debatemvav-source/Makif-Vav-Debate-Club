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
        
        // Footer
        contactEmail: document.getElementById('contact-email'),
        contactIg: document.getElementById('contact-ig')
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Fetch Content
    try {
        const response = await fetch('content.json');
        content = await response.json();
        
        // Drive Sync Override
        if (content.general.driveApiUrl && content.general.driveApiUrl.trim() !== "") {
            try {
                const apiUrl = content.general.driveApiUrl + (content.general.driveApiUrl.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
                const driveRes = await fetch(apiUrl);
                const driveData = await driveRes.json();
                if (driveData && !driveData.error) {
                    if (driveData.logo) content.general.logo = driveData.logo;
                    if (driveData.hero) content.home.heroImage = driveData.hero;
                    if (driveData.about && driveData.about.length > 0) content.about.images = driveData.about;
                    if (driveData.gallery && driveData.gallery.length > 0) content.gallery.images = driveData.gallery;
                }
            } catch(e) { console.error("Drive sync failed", e); }
        }
        
        renderContent();
        initScrollAnimations();
    } catch (error) {
        console.error("Failed to load content.json", error);
    }

    // Navigation
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Update active button
            elements.navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show target section
            elements.sections.forEach(sec => {
                if(sec.id === targetId) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });

            // Close mobile menu
            if(window.innerWidth <= 768) {
                elements.navMenu.classList.remove('show');
                elements.mobileBtn.textContent = '☰';
                elements.mobileBtn.style.transform = 'rotate(0deg)';
            }
        });
    });

    // CTA button click
    elements.heroCta.addEventListener('click', () => {
        document.getElementById('nav-about').click();
    });

    // Mobile Menu
    elements.mobileBtn.addEventListener('click', () => {
        elements.navMenu.classList.toggle('show');
        if(elements.navMenu.classList.contains('show')) {
            elements.mobileBtn.textContent = '✕';
            elements.mobileBtn.style.transform = 'rotate(90deg)';
        } else {
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
        document.getElementById('nav-faq').textContent = content.nav.faq;

        // Home
        if (content.home.heroImage) {
            elements.heroSection.style.backgroundImage = `url('${content.home.heroImage}')`;
        }
        // Typewriter Effect for Hero Title
        elements.heroTitle.innerHTML = '';
        const titleText = content.home.heroTitle || '';
        let typeIndex = 0;
        function typeWriter() {
            if (typeIndex < titleText.length) {
                elements.heroTitle.innerHTML = titleText.substring(0, typeIndex + 1) + '<span class="typewriter-cursor">|</span>';
                typeIndex++;
                setTimeout(typeWriter, Math.random() * 50 + 50);
            } else {
                elements.heroTitle.innerHTML = titleText + '<span class="typewriter-cursor blink">|</span>';
            }
        }
        setTimeout(typeWriter, 600);
        elements.heroSubtitle.textContent = content.home.heroSubtitle;
        elements.heroCta.textContent = content.home.cta;
        elements.featuresTitle.textContent = content.home.featuresTitle;
        
        elements.featuresGrid.className = 'timeline-container';
        elements.featuresGrid.innerHTML = `
            <div class="timeline-line-bg"></div>
            <div class="timeline-line-progress" id="timeline-progress"></div>
            ${content.home.features.map((f, index) => `
                <div class="timeline-item ${index % 2 === 0 ? 'right' : 'left'}">
                    <div class="timeline-dot" data-index="${index}">${index + 1}</div>
                    <div class="timeline-content-wrapper reveal delay-${index % 2 + 1}">
                        <div class="timeline-ribbon">
                            <span class="feature-icon">${f.icon}</span>
                            <h3 class="feature-title">${f.title}</h3>
                        </div>
                        <p class="feature-desc">${f.description}</p>
                    </div>
                </div>
            `).join('')}
        `;

        // About
        elements.aboutTitle.textContent = content.about.title;
        elements.aboutContainer.innerHTML = content.about.paragraphs.map((p, index) => {
            const isReverse = index % 2 !== 0;
            const imgSrc = content.about.images && content.about.images[index] ? content.about.images[index] : '';
            const imgHtml = imgSrc ? `<div class="about-item-img reveal"><img src="${imgSrc}" alt="About image"></div>` : '';
            return `
                <div class="about-item ${isReverse ? 'reverse' : ''}">
                    <div class="about-item-text reveal">
                        <h3>${p.subtitle}</h3>
                        <p>${p.text}</p>
                    </div>
                    ${imgHtml}
                </div>
            `;
        }).join('');
        
        // Testimonials
        if (content.testimonials) {
            const allTestimonials = [...content.testimonials.items, ...content.testimonials.items];
            elements.testimonialsTitle.textContent = content.testimonials.title;
            elements.testimonialsGrid.innerHTML = allTestimonials.map(t => `
                <div class="testimonial-card">
                    <p class="testimonial-quote">"${t.quote}"</p>
                    <h4 class="testimonial-name">${t.name}</h4>
                </div>
            `).join('');
        }

        // Gallery
        elements.galleryTitle.textContent = content.gallery.title;
        elements.galleryDesc.textContent = content.gallery.description;
        
        const galleryGrid = document.getElementById('gallery-grid');
        
        function setupMasonryGallery(imageArray) {
            if (!imageArray || imageArray.length === 0) {
                galleryGrid.innerHTML = '<p style="text-align:center; padding: 2rem; width: 100%;">אין תמונות בגלריה כרגע.</p>';
                return;
            }
            
            galleryGrid.innerHTML = imageArray.map((img, index) => `
                <div class="masonry-item reveal delay-${(index % 3) + 1}" data-index="${index}">
                    <img src="${img}" alt="Debate Moment ${index + 1}">
                </div>
            `).join('');
            
            // Lightbox Logic
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const closeBtn = document.getElementById('lightbox-close');
            const prevBtn = document.getElementById('lightbox-prev');
            const nextBtn = document.getElementById('lightbox-next');
            let currentIndex = 0;
            
            function openLightbox(index) {
                currentIndex = index;
                lightboxImg.src = imageArray[currentIndex];
                lightbox.classList.add('show');
            }
            
            function closeLightbox() {
                lightbox.classList.remove('show');
            }
            
            function showNext() {
                currentIndex = (currentIndex + 1) % imageArray.length;
                lightboxImg.src = imageArray[currentIndex];
            }
            
            function showPrev() {
                currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
                lightboxImg.src = imageArray[currentIndex];
            }
            
            // Event Listeners
            galleryGrid.querySelectorAll('.masonry-item').forEach(item => {
                item.addEventListener('click', () => openLightbox(parseInt(item.getAttribute('data-index'))));
            });
            
            closeBtn.addEventListener('click', closeLightbox);
            nextBtn.addEventListener('click', showNext);
            prevBtn.addEventListener('click', showPrev);
            
            // Close on background click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('show')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showPrev(); // RTL reversed
                if (e.key === 'ArrowLeft') showNext();  // RTL reversed
            });
        }

        setupMasonryGallery(content.gallery.images);

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
                    // Start drawing when the top of the container reaches the middle of the screen
                    const startPos = rect.top - (windowHeight / 2);
                    let drawPercentage = -startPos / rect.height;
                    if (drawPercentage < 0) drawPercentage = 0;
                    if (drawPercentage > 1) drawPercentage = 1;
                    timelineProgress.style.height = (drawPercentage * 100) + "%";
                    
                    // Activate timeline items when the line passes them
                    document.querySelectorAll('.timeline-item').forEach(item => {
                        const itemRect = item.getBoundingClientRect();
                        // Item is active if its center is above the middle of the screen
                        if (itemRect.top + (itemRect.height / 2) < windowHeight / 2 + 50) {
                            item.classList.add('timeline-active');
                        } else {
                            item.classList.remove('timeline-active');
                        }
                    });
                }
            });
        }
        
        // Particles Generation
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 20 + 10; // 10px to 30px
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particlesContainer.appendChild(particle);
            }
        }

    }
});
