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
        aboutContent1: document.getElementById('about-content1'),
        aboutContent2: document.getElementById('about-content2'),
        aboutContent3: document.getElementById('about-content3'),
        aboutImg1: document.getElementById('about-img1'),
        aboutImg2: document.getElementById('about-img2'),
        aboutImg3: document.getElementById('about-img3'),
        
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
        renderContent();
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
        document.getElementById('nav-gallery').textContent = content.nav.gallery;
        document.getElementById('nav-faq').textContent = content.nav.faq;

        // Home
        if (content.home.heroImage) {
            elements.heroSection.style.backgroundImage = `url('${content.home.heroImage}')`;
            elements.heroSection.style.backgroundSize = 'cover';
            elements.heroSection.style.backgroundPosition = 'top center';
            elements.heroSection.style.backgroundRepeat = 'no-repeat';
        }
        elements.heroTitle.textContent = content.home.heroTitle;
        elements.heroSubtitle.textContent = content.home.heroSubtitle;
        elements.heroCta.textContent = content.home.cta;
        elements.featuresTitle.textContent = content.home.featuresTitle;
        
        elements.featuresGrid.innerHTML = content.home.features.map(f => `
            <div class="glass-card">
                <div class="feature-icon">${f.icon}</div>
                <h3 class="feature-title">${f.title}</h3>
                <p class="feature-desc">${f.description}</p>
            </div>
        `).join('');

        // About
        elements.aboutTitle.textContent = content.about.title;
        elements.aboutContent1.textContent = content.about.content1;
        elements.aboutContent2.textContent = content.about.content2;
        elements.aboutContent3.textContent = content.about.content3;
        
        if(content.about.images && content.about.images.length > 0) {
            if(content.about.images[0]) { elements.aboutImg1.src = content.about.images[0]; elements.aboutImg1.style.display = 'block'; }
            if(content.about.images[1]) { elements.aboutImg2.src = content.about.images[1]; elements.aboutImg2.style.display = 'block'; }
            if(content.about.images[2]) { elements.aboutImg3.src = content.about.images[2]; elements.aboutImg3.style.display = 'block'; }
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

        if (content.gallery.driveGalleryApi && content.gallery.driveGalleryApi.trim() !== "") {
            galleryContainer.innerHTML = '<div style="text-align:center; padding: 5rem; color: var(--text-secondary);">טוען תמונות מעודכנות...</div>';
            fetch(content.gallery.driveGalleryApi)
                .then(res => res.json())
                .then(data => {
                    if (data && data.images && data.images.length > 0) {
                        setupSlideshow(data.images);
                    } else {
                        setupSlideshow(content.gallery.images);
                    }
                })
                .catch(err => {
                    console.error("Failed to load drive images:", err);
                    setupSlideshow(content.gallery.images); // Fallback
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
    }
});
