/**
 * Kelvin Murithi Johnson - Portfolio
 * Interactive JavaScript with Matrix Effects & Animations
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // =============================================
    // EMAIL CONFIGURATION - Web3Forms (FREE)
    // =============================================
    // To set up email:
    // 1. Go to https://web3forms.com
    // 2. Enter your email address and click "Create Access Key"
    // 3. Check your email and copy the access key
    // 4. Replace 'YOUR_WEB3FORMS_ACCESS_KEY' below with your key
    // =============================================
    email: {
        web3formsKey: '56befb88-24db-457c-828e-55c43878fbb9',
        recipientEmail: 'kevrith@gmail.com'
    },
    github: {
        username: 'kevrith',
        cacheKey: 'github_stats_cache',
        cacheDuration: 30 * 60 * 1000 // 30 minutes
    },
    typing: {
        roles: [
            'Full-Stack Developer',
            'Python Architect',
            'API Engineer',
            'Backend Developer',
            'Flask Specialist',
            'React Developer'
        ],
        typeSpeed: 80,
        deleteSpeed: 50,
        pauseDuration: 2000
    },
    loader: {
        messages: [
            '> Initializing system...',
            '> Loading dependencies...',
            '> Starting Flask server...',
            '> Connecting to PostgreSQL...',
            '> Fetching GitHub stats...',
            '> Building UI components...',
            '> System ready!'
        ],
        messageDelay: 300
    },
    matrix: {
        fontSize: 14,
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|<>~`',
        speed: 50
    }
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loader-text'),
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    matrixCanvas: document.getElementById('matrix-canvas'),
    cursorGlow: document.getElementById('cursor-glow'),
    typingText: document.getElementById('typing-text'),
    currentYear: document.getElementById('current-year'),
    contactForm: document.getElementById('contact-form'),
    chargeSheetForm: document.getElementById('charge-sheet-form')
};

// ============================================
// STATE
// ============================================
let currentPage = 'home';
const pages = ['home', 'about', 'skills', 'projects', 'contact', 'charge-sheet'];
let exchangeRates = { USD: 1 }; // Exchange rates relative to USD, default to USD only if API fails

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initMatrixRain();
    initCursorGlow();
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initAnimations();
    initTypingEffect();
    initSkillLevels();
    initCounterAnimation();
    initContactForm();
    initChargeSheetForm();
    initEmailService();
    setCurrentYear();
    fetchExchangeRate();
    fetchGitHubStats();
    fetchGitHubContributions();
});

// ============================================
// LOADER
// ============================================
function initLoader() {
    let messageIndex = 0;
    let currentText = '';

    function typeMessage() {
        if (messageIndex < CONFIG.loader.messages.length) {
            const message = CONFIG.loader.messages[messageIndex];
            currentText += message + '\n';
            elements.loaderText.textContent = currentText;

            messageIndex++;
            setTimeout(typeMessage, CONFIG.loader.messageDelay);
        } else {
            setTimeout(hideLoader, 500);
        }
    }

    typeMessage();
}

function hideLoader() {
    elements.loader.classList.add('hidden');
    document.body.style.overflow = 'auto';

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('#home .animate-in').forEach((el, index) => {
            setTimeout(() => el.classList.add('visible'), index * 100);
        });
    }, 300);
}

// ============================================
// MATRIX RAIN EFFECT
// ============================================
function initMatrixRain() {
    const canvas = elements.matrixCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let columns, drops;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        columns = Math.floor(canvas.width / CONFIG.matrix.fontSize);
        drops = Array(columns).fill(1);
    }

    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Green text
        ctx.fillStyle = '#00ff88';
        ctx.font = `${CONFIG.matrix.fontSize}px JetBrains Mono, monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = CONFIG.matrix.characters[Math.floor(Math.random() * CONFIG.matrix.characters.length)];
            const x = i * CONFIG.matrix.fontSize;
            const y = drops[i] * CONFIG.matrix.fontSize;

            ctx.fillText(char, x, y);

            // Reset drop randomly after reaching bottom
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setInterval(draw, CONFIG.matrix.speed);
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
function initCursorGlow() {
    const glow = elements.cursorGlow;
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        // Smooth follow effect
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;

        requestAnimationFrame(updateGlow);
    }

    updateGlow();

    // Hide on mobile
    if ('ontouchstart' in window) {
        glow.style.display = 'none';
    }
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, [data-page]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetPage = link.getAttribute('data-page');
            if (targetPage && pages.includes(targetPage)) {
                e.preventDefault();
                navigateToPage(targetPage);
            }
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || 'home';
        showPage(page);
        updateActiveNav(page);
    });

    // Set initial state
    history.replaceState({ page: 'home' }, '', '#home');
}

function navigateToPage(targetPage) {
    if (targetPage === currentPage) return;

    showPage(targetPage);
    updateActiveNav(targetPage);
    history.pushState({ page: targetPage }, '', `#${targetPage}`);
    currentPage = targetPage;

    // Close mobile menu
    elements.navMenu?.classList.remove('active');
    elements.mobileMenuToggle?.classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');

        // Trigger animations
        setTimeout(() => {
            targetPage.querySelectorAll('.animate-in').forEach((el, index) => {
                setTimeout(() => el.classList.add('visible'), index * 100);
            });
        }, 100);

        // Animate skill levels if on skills page
        if (pageId === 'skills') {
            animateSkillLevels();
        }

        // Animate counters if on home page
        if (pageId === 'home') {
            animateCounters();
        }
    }
}

function updateActiveNav(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const toggle = elements.mobileMenuToggle;
    const menu = elements.navMenu;

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        }
    });

    // Close menu on navigation
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Navbar background
        if (currentScroll > 50) {
            elements.navbar?.classList.add('scrolled');
        } else {
            elements.navbar?.classList.remove('scrolled');
        }
    });
}

// ============================================
// ANIMATIONS (Intersection Observer)
// ============================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill levels when visible
                if (entry.target.classList.contains('skill-category')) {
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    skillItems.forEach(item => item.classList.add('animated'));
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
    const element = elements.typingText;
    if (!element) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = CONFIG.typing.roles[roleIndex];

        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? CONFIG.typing.deleteSpeed : CONFIG.typing.typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = CONFIG.typing.pauseDuration;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % CONFIG.typing.roles.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    // Start after loader
    setTimeout(type, 3000);
}

// ============================================
// SKILL LEVELS
// ============================================
function initSkillLevels() {
    document.querySelectorAll('.skill-level').forEach(level => {
        const skillLevel = level.getAttribute('data-level');
        level.style.setProperty('--level', `${skillLevel}%`);
    });
}

function animateSkillLevels() {
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animated');
        }, index * 50);
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    // Animate on first load
    setTimeout(animateCounters, 3500);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function updateCounter() {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        updateCounter();
    });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form = elements.contactForm;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.classList.add('loading');

        try {
            // Check if email is configured
            if (!isEmailConfigured()) {
                showNotification('Email service not configured. Please contact me directly at kevrith@gmail.com', 'info');
                // Open email client as fallback
                const formData = new FormData(form);
                const mailtoLink = `mailto:kevrith@gmail.com?subject=${encodeURIComponent(formData.get('subject'))}&body=${encodeURIComponent(`From: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`)}`;
                window.location.href = mailtoLink;
                return;
            }

            const formData = new FormData(form);

            // Web3Forms API key from config
            const WEB3FORMS_KEY = CONFIG.email.web3formsKey;

            // Create Web3Forms submission
            const web3FormData = new FormData();
            web3FormData.append('access_key', WEB3FORMS_KEY);
            web3FormData.append('subject', `Portfolio Contact: ${formData.get('subject')} from ${formData.get('name')}`);
            web3FormData.append('from_name', formData.get('name'));
            web3FormData.append('reply_to', formData.get('email'));

            const message = `
📬 NEW CONTACT MESSAGE
━━━━━━━━━━━━━━━━━━━━━━

👤 From: ${formData.get('name')}
📧 Email: ${formData.get('email')}
📋 Subject: ${formData.get('subject')}

💬 Message:
${formData.get('message')}

━━━━━━━━━━━━━━━━━━━━━━
Sent from your portfolio website
            `.trim();

            web3FormData.append('message', message);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: web3FormData
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
}

// ============================================
// CHARGE SHEET FORM
// ============================================
function initChargeSheetForm() {
    const form = elements.chargeSheetForm;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.classList.add('loading');

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Calculate price
            const priceRange = calculateProjectPrice(data);

            // Check if email is configured
            if (!isEmailConfigured()) {
                // Still show the quote modal but warn about email
                showQuoteModal(data, priceRange);
                showNotification('Quote calculated! Email service not configured - please contact me directly.', 'info');
                form.reset();
                return;
            }

            // Send email with price quote
            await sendPriceQuote(data, priceRange);

            showNotification('Price quote sent successfully!', 'success');
            form.reset();
        } catch (error) {
            console.error('Charge sheet submission error:', error);
            // Still show the quote even if email fails
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const priceRange = calculateProjectPrice(data);
            showQuoteModal(data, priceRange);
            showNotification('Quote calculated but email failed. Please contact me directly at kevrith@gmail.com', 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
}

function calculateProjectPrice(data) {
    let basePrice = 300; // Start lower for basic sites
    const features = [];
    const detectedFeatures = [];
    const selectedCurrency = data.currency || 'USD';
    const rate = exchangeRates[selectedCurrency] || 1;

    // Analyze project description for keywords
    const description = data.project_description?.toLowerCase() || '';

    // Project type base pricing
    const projectTypePricing = {
        'business': { base: 400, name: 'Business Website' },
        'ecommerce': { base: 800, name: 'E-commerce Store' },
        'blog': { base: 350, name: 'Blog/CMS' },
        'portfolio': { base: 300, name: 'Portfolio Site' },
        'webapp': { base: 700, name: 'Web Application' },
        'other': { base: 400, name: 'Custom Project' }
    };

    if (data.project_type && projectTypePricing[data.project_type]) {
        basePrice = projectTypePricing[data.project_type].base;
        features.push(`${projectTypePricing[data.project_type].name} base (+$${projectTypePricing[data.project_type].base})`);
    }

    // E-commerce features detection
    const ecommerceKeywords = ['ecommerce', 'e-commerce', 'shop', 'store', 'cart', 'payment', 'checkout', 'products', 'inventory', 'orders', 'shipping', 'mpesa', 'm-pesa', 'paypal', 'stripe'];
    if (ecommerceKeywords.some(kw => description.includes(kw))) {
        basePrice += 400;
        features.push('E-commerce functionality (+$400)');
        detectedFeatures.push('Shopping cart & checkout');
    }

    // Payment integration
    const paymentKeywords = ['payment', 'pay', 'mpesa', 'm-pesa', 'paypal', 'stripe', 'credit card', 'debit', 'transaction'];
    if (paymentKeywords.some(kw => description.includes(kw)) && !features.includes('E-commerce functionality (+$400)')) {
        basePrice += 200;
        features.push('Payment integration (+$200)');
        detectedFeatures.push('Payment gateway');
    }

    // Blog/CMS features
    const blogKeywords = ['blog', 'cms', 'content', 'article', 'news', 'magazine', 'posts', 'editor', 'publish'];
    if (blogKeywords.some(kw => description.includes(kw))) {
        basePrice += 150;
        features.push('Blog/CMS features (+$150)');
        detectedFeatures.push('Content management');
    }

    // API/Custom integrations
    const apiKeywords = ['api', 'integration', 'third-party', 'webhook', 'external', 'connect', 'sync', 'automate'];
    if (apiKeywords.some(kw => description.includes(kw))) {
        basePrice += 250;
        features.push('API integrations (+$250)');
        detectedFeatures.push('Third-party integrations');
    }

    // Database complexity
    const dbKeywords = ['database', 'data', 'analytics', 'reporting', 'dashboard', 'statistics', 'charts', 'graphs', 'metrics'];
    if (dbKeywords.some(kw => description.includes(kw))) {
        basePrice += 200;
        features.push('Database & analytics (+$200)');
        detectedFeatures.push('Data management');
    }

    // Authentication/User management
    const authKeywords = ['login', 'auth', 'user', 'account', 'member', 'register', 'signup', 'sign up', 'profile', 'password', 'session'];
    if (authKeywords.some(kw => description.includes(kw))) {
        basePrice += 150;
        features.push('User authentication (+$150)');
        detectedFeatures.push('User accounts & login');
    }

    // Admin panel/Dashboard
    const adminKeywords = ['admin', 'dashboard', 'panel', 'manage', 'backend', 'control'];
    if (adminKeywords.some(kw => description.includes(kw))) {
        basePrice += 200;
        features.push('Admin dashboard (+$200)');
        detectedFeatures.push('Admin control panel');
    }

    // Booking/Scheduling
    const bookingKeywords = ['booking', 'appointment', 'schedule', 'calendar', 'reservation', 'slots'];
    if (bookingKeywords.some(kw => description.includes(kw))) {
        basePrice += 250;
        features.push('Booking system (+$250)');
        detectedFeatures.push('Appointment scheduling');
    }

    // Multi-language
    const langKeywords = ['multi-language', 'multilingual', 'translation', 'languages', 'localization', 'i18n'];
    if (langKeywords.some(kw => description.includes(kw))) {
        basePrice += 150;
        features.push('Multi-language support (+$150)');
        detectedFeatures.push('Multiple languages');
    }

    // SEO optimization
    const seoKeywords = ['seo', 'search engine', 'google', 'ranking', 'optimization', 'meta'];
    if (seoKeywords.some(kw => description.includes(kw))) {
        basePrice += 100;
        features.push('SEO optimization (+$100)');
        detectedFeatures.push('Search engine optimization');
    }

    // Responsive/Mobile
    const mobileKeywords = ['responsive', 'mobile', 'tablet', 'phone', 'adaptive'];
    if (mobileKeywords.some(kw => description.includes(kw))) {
        // Responsive is standard, but add note
        detectedFeatures.push('Mobile responsive (included)');
    }

    // Real-time features
    const realtimeKeywords = ['real-time', 'realtime', 'live', 'chat', 'notification', 'socket', 'websocket'];
    if (realtimeKeywords.some(kw => description.includes(kw))) {
        basePrice += 300;
        features.push('Real-time features (+$300)');
        detectedFeatures.push('Live updates/chat');
    }

    // Complexity keywords
    const complexKeywords = ['complex', 'advanced', 'custom', 'unique', 'special', 'sophisticated'];
    if (complexKeywords.some(kw => description.includes(kw))) {
        basePrice += 150;
        features.push('Custom complexity (+$150)');
    }

    // Page count estimation from description
    const pageMatch = description.match(/(\d+)\s*(pages?|sections?)/i);
    if (pageMatch) {
        const pageCount = parseInt(pageMatch[1]);
        if (pageCount > 5) {
            const extraPages = pageCount - 5;
            const pagesCost = extraPages * 30;
            basePrice += pagesCost;
            features.push(`${extraPages} additional pages (+$${pagesCost})`);
        }
    }

    // Timeline adjustments
    let timelineMultiplier = 1;
    let timelineNote = '';
    if (data.timeline === 'rush') {
        timelineMultiplier = 1.3; // 30% rush fee
        timelineNote = 'Rush delivery (3-7 days): +30%';
    } else if (data.timeline === 'standard') {
        timelineMultiplier = 1.1; // 10% for faster delivery
        timelineNote = 'Standard delivery (1-2 weeks): +10%';
    } else {
        timelineNote = 'Flexible timeline (2-4 weeks): Standard rate';
    }

    basePrice = Math.round(basePrice * timelineMultiplier);
    if (timelineMultiplier > 1) {
        features.push(timelineNote);
    }

    // Create price range (±15% for negotiation)
    const minPrice = Math.max(250, Math.round(basePrice * 0.85));
    const maxPrice = Math.round(basePrice * 1.15);

    // Convert prices to selected currency
    const convertToSelectedCurrency = (usd) => Math.round(usd * rate);

    // Get currency symbol
    const getCurrencySymbol = (currency) => {
        const symbols = {
            USD: '$',
            EUR: '€',
            KES: 'KSh',
            GBP: '£',
            CAD: 'C$',
            AUD: 'A$',
            JPY: '¥',
            CHF: 'CHF'
        };
        return symbols[currency] || currency;
    };

    // Format number with commas
    const formatNumber = (num) => num.toLocaleString();

    return {
        basePrice,
        minPrice,
        maxPrice,
        basePriceConverted: convertToSelectedCurrency(basePrice),
        minPriceConverted: convertToSelectedCurrency(minPrice),
        maxPriceConverted: convertToSelectedCurrency(maxPrice),
        currency: selectedCurrency,
        currencySymbol: getCurrencySymbol(selectedCurrency),
        exchangeRate: rate,
        features: features.length > 0 ? features : ['Basic website setup (+$300)'],
        detectedFeatures: detectedFeatures,
        timeline: data.timeline || 'flexible',
        timelineNote: timelineNote,
        projectType: data.project_type,
        formatNumber
    };
}

async function sendPriceQuote(clientData, priceRange) {
    // Web3Forms API key from config
    const WEB3FORMS_KEY = CONFIG.email.web3formsKey;

    // Format the price breakdown for the email
    const priceBreakdown = priceRange.features.map(f => `  • ${f}`).join('\n');
    const detectedFeatures = priceRange.detectedFeatures?.length > 0
        ? priceRange.detectedFeatures.map(f => `  • ${f}`).join('\n')
        : '  • Basic website features';

    // Get project type display name
    const projectTypeNames = {
        'business': 'Business Website',
        'ecommerce': 'E-commerce Store',
        'blog': 'Blog/CMS',
        'portfolio': 'Portfolio Site',
        'webapp': 'Web Application',
        'other': 'Custom Project'
    };

    const projectTypeName = projectTypeNames[clientData.project_type] || 'Custom Project';

    // Create detailed message for you (the developer)
    const developerMessage = `
🎯 NEW PROJECT QUOTE REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENT INFORMATION
   Name: ${clientData.client_name}
   Email: ${clientData.client_email}

📋 PROJECT DETAILS
   Type: ${projectTypeName}
   Timeline: ${priceRange.timelineNote}
   Client Budget: ${clientData.budget_range || 'Not specified'}

📝 PROJECT DESCRIPTION
${clientData.project_description}

💰 CALCULATED PRICE QUOTE
━━━━━━━━━━━━━━━━━━━━━━━━━
   Currency: ${priceRange.currency}
   ${priceRange.currency !== 'USD' ? `Exchange Rate: 1 USD = ${priceRange.exchangeRate.toFixed(2)} ${priceRange.currency}\n` : ''}

   💵 PRICE RANGE: ${priceRange.currencySymbol}${priceRange.minPriceConverted.toLocaleString()} - ${priceRange.currencySymbol}${priceRange.maxPriceConverted.toLocaleString()}
   ${priceRange.currency !== 'USD' ? `   (USD: $${priceRange.minPrice.toLocaleString()} - $${priceRange.maxPrice.toLocaleString()})` : ''}

   Base Price: ${priceRange.currencySymbol}${priceRange.basePriceConverted.toLocaleString()}

📊 PRICE BREAKDOWN
${priceBreakdown}

🔍 DETECTED FEATURES
${detectedFeatures}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply to: ${clientData.client_email}
Submitted: ${new Date().toLocaleString()}
    `.trim();

    // Send email to developer (you)
    const developerFormData = new FormData();
    developerFormData.append('access_key', WEB3FORMS_KEY);
    developerFormData.append('subject', `💼 New Quote Request: ${projectTypeName} from ${clientData.client_name}`);
    developerFormData.append('from_name', 'Portfolio Quote System');
    developerFormData.append('to_email', CONFIG.email.recipientEmail);
    developerFormData.append('reply_to', clientData.client_email);
    developerFormData.append('message', developerMessage);

    // Also store the quote data for reference
    const quoteData = {
        timestamp: Date.now(),
        client: clientData,
        quote: priceRange,
        message: developerMessage
    };

    try {
        // Send to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: developerFormData
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to send email');
        }

        // Store quote locally for backup
        saveQuoteLocally(quoteData);

        // Show the quote to the user in a modal
        showQuoteModal(clientData, priceRange);

        return result;
    } catch (error) {
        console.error('Email sending error:', error);
        // Still save locally even if email fails
        saveQuoteLocally(quoteData);
        throw error;
    }
}

// Save quote to localStorage as backup
function saveQuoteLocally(quoteData) {
    try {
        const quotes = JSON.parse(localStorage.getItem('quote_submissions') || '[]');
        quotes.push(quoteData);
        // Keep only last 50 quotes
        if (quotes.length > 50) quotes.shift();
        localStorage.setItem('quote_submissions', JSON.stringify(quotes));
    } catch (e) {
        console.warn('Failed to save quote locally:', e);
    }
}

// Show quote result modal to the user
function showQuoteModal(clientData, priceRange) {
    // Remove existing modal if any
    const existingModal = document.getElementById('quote-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'quote-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeQuoteModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeQuoteModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <i class="fas fa-check-circle"></i>
                <h2>Quote Sent Successfully!</h2>
            </div>
            <div class="modal-body">
                <p class="modal-greeting">Thank you, <strong>${clientData.client_name}</strong>!</p>
                <p>Your project quote request has been submitted. Here's your estimated price range:</p>

                <div class="quote-price-display">
                    <span class="price-label">Estimated Price Range</span>
                    <span class="price-value">${priceRange.currencySymbol}${priceRange.minPriceConverted.toLocaleString()} - ${priceRange.currencySymbol}${priceRange.maxPriceConverted.toLocaleString()}</span>
                    ${priceRange.currency !== 'USD' ? `<span class="price-usd">(USD $${priceRange.minPrice.toLocaleString()} - $${priceRange.maxPrice.toLocaleString()})</span>` : ''}
                </div>

                <div class="quote-features">
                    <h4>Price includes:</h4>
                    <ul>
                        ${priceRange.features.map(f => `<li><i class="fas fa-check"></i> ${f.replace(/\(\+\$[\d,]+\)/g, '')}</li>`).join('')}
                    </ul>
                </div>

                <p class="modal-note">
                    <i class="fas fa-envelope"></i>
                    I'll review your requirements and get back to you at <strong>${clientData.client_email}</strong> within 24-48 hours with a detailed proposal.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeQuoteModal()">
                    <span class="btn-text">Got it!</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
}

// Close quote modal
function closeQuoteModal() {
    const modal = document.getElementById('quote-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => modal.remove(), 300);
    }
}

// ============================================
// WEB3FORMS CONFIGURATION
// ============================================
// To set up email functionality:
// 1. Go to https://web3forms.com
// 2. Enter your email (kevrith@gmail.com) and click "Create Access Key"
// 3. Copy the access key and replace 'YOUR_WEB3FORMS_ACCESS_KEY' in CONFIG.email.web3formsKey
// 4. That's it! No backend needed, emails will be sent directly to your inbox

function initEmailService() {
    // Check if Web3Forms key is configured
    if (CONFIG.email.web3formsKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        console.warn('⚠️ Web3Forms not configured! Forms will not send emails.');
        console.log('📧 To set up email:');
        console.log('   1. Go to https://web3forms.com');
        console.log('   2. Enter your email and get your access key');
        console.log('   3. Replace YOUR_WEB3FORMS_ACCESS_KEY in scripts.js CONFIG');
    } else {
        console.log('📧 Email service ready (Web3Forms)');
    }
}

// Check if email is configured before sending
function isEmailConfigured() {
    return CONFIG.email.web3formsKey && CONFIG.email.web3formsKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(13, 13, 20, 0.95);
            border: 1px solid ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#00d4ff'};
            border-radius: 8px;
            padding: 16px 24px;
            color: #e4e4e7;
            backdrop-filter: blur(10px);
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Space Grotesk', sans-serif;
        ">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"
               style="color: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#00d4ff'}; font-size: 1.25rem;"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);
    const notificationEl = notification.firstElementChild;

    // Slide in
    requestAnimationFrame(() => {
        notificationEl.style.transform = 'translateX(0)';
    });

    // Slide out and remove
    setTimeout(() => {
        notificationEl.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// UTILITIES
// ============================================
function setCurrentYear() {
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    // Navigate with Alt + Arrow keys
    if (e.altKey) {
        const currentIndex = pages.indexOf(currentPage);

        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            navigateToPage(pages[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
            e.preventDefault();
            navigateToPage(pages[currentIndex + 1]);
        }
    }

    // Close mobile menu with Escape
    if (e.key === 'Escape') {
        elements.navMenu?.classList.remove('active');
        elements.mobileMenuToggle?.classList.remove('active');
    }
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('data-page')) return;

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// ============================================
// GITHUB API INTEGRATION
// ============================================
async function fetchGitHubStats() {
    const { username, cacheKey, cacheDuration } = CONFIG.github;

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        updateGitHubUI(cached);
        return;
    }

    try {
        // Fetch user profile data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        // Fetch recent events to detect achievements
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);
        const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];

        // Calculate stats
        const stats = {
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            avatarUrl: userData.avatar_url,
            bio: userData.bio,
            location: userData.location,
            blog: userData.blog,
            createdAt: userData.created_at,
            achievements: detectAchievements(userData, eventsData),
            fetchedAt: Date.now()
        };

        // Cache the results
        saveToCache(cacheKey, stats, cacheDuration);

        // Update UI
        updateGitHubUI(stats);

    } catch (error) {
        console.warn('GitHub API fetch failed, using fallback values:', error);
        // Use fallback values if API fails
        updateGitHubUI({
            publicRepos: 150,
            followers: 3,
            achievements: getDefaultAchievements()
        });
    }
}

function detectAchievements(userData, events) {
    const achievements = [];
    const accountAge = (Date.now() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24 * 365);

    // Pull Shark - Based on pull request activity
    const prEvents = events.filter(e => e.type === 'PullRequestEvent' && e.payload?.action === 'opened');
    if (prEvents.length >= 2) {
        achievements.push({
            name: 'Pull Shark',
            icon: 'fa-code-pull-request',
            description: `Opened ${prEvents.length}+ pull requests`,
            level: prEvents.length >= 16 ? 'x3' : prEvents.length >= 4 ? 'x2' : ''
        });
    }

    // YOLO - Pushing without PR review (commits directly to default branch)
    const pushEvents = events.filter(e => e.type === 'PushEvent');
    if (pushEvents.length > 0) {
        achievements.push({
            name: 'YOLO',
            icon: 'fa-bolt',
            description: 'Pushed without review'
        });
    }

    // Quickdraw - Fast issue/PR closing
    const issueEvents = events.filter(e => e.type === 'IssuesEvent' || e.type === 'PullRequestEvent');
    if (issueEvents.length > 0) {
        achievements.push({
            name: 'Quickdraw',
            icon: 'fa-crosshairs',
            description: 'Fast responder'
        });
    }

    // Arctic Code Vault Contributor (if account is old enough and has significant repos)
    if (accountAge >= 1 && userData.public_repos >= 10) {
        achievements.push({
            name: 'Arctic Code Vault',
            icon: 'fa-snowflake',
            description: 'Contributed to archived code'
        });
    }

    // Starstruck - If user has repos with stars
    if (userData.public_repos >= 50) {
        achievements.push({
            name: 'Galaxy Brain',
            icon: 'fa-brain',
            description: 'Answered discussions helpfully'
        });
    }

    // Pair Extraordinaire - Collaborative commits
    const coAuthoredCommits = events.filter(e =>
        e.type === 'PushEvent' &&
        e.payload?.commits?.some(c => c.message?.toLowerCase().includes('co-authored'))
    );
    if (coAuthoredCommits.length > 0) {
        achievements.push({
            name: 'Pair Extraordinaire',
            icon: 'fa-user-group',
            description: 'Collaborated on commits'
        });
    }

    return achievements.length > 0 ? achievements : getDefaultAchievements();
}

function getDefaultAchievements() {
    return [
        { name: 'Pull Shark', icon: 'fa-code-pull-request', description: 'Opened pull requests', level: 'x2' },
        { name: 'YOLO', icon: 'fa-bolt', description: 'Pushed without review' },
        { name: 'Quickdraw', icon: 'fa-crosshairs', description: 'Fast responder' }
    ];
}

function updateGitHubUI(stats) {
    // Update repository count
    const repoCountEl = document.querySelector('[data-stat="repos"]');
    if (repoCountEl) {
        repoCountEl.setAttribute('data-count', stats.publicRepos);
        animateCounter(repoCountEl, stats.publicRepos);
    }

    // Update followers count
    const followersCountEl = document.querySelector('[data-stat="followers"]');
    if (followersCountEl) {
        followersCountEl.setAttribute('data-count', stats.followers);
        animateCounter(followersCountEl, stats.followers);
    }

    // Update achievements in About section
    const achievementsContainer = document.getElementById('github-achievements');
    if (achievementsContainer && stats.achievements) {
        achievementsContainer.innerHTML = stats.achievements.map(achievement => `
            <div class="achievement-item" title="${achievement.description}">
                <i class="fas ${achievement.icon}"></i>
                <span>${achievement.name}${achievement.level ? ` (${achievement.level})` : ''}</span>
            </div>
        `).join('');
    }

    // Update "View All Repositories" button text
    const viewAllBtn = document.querySelector('.projects-cta .btn-text');
    if (viewAllBtn) {
        viewAllBtn.textContent = `View All ${stats.publicRepos} Repositories`;
    }
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    update();
}

// ============================================
// GITHUB CONTRIBUTIONS & STREAK
// ============================================
async function fetchGitHubContributions() {
    const { username } = CONFIG.github;
    const cacheKey = 'github_contributions_cache';
    const cacheDuration = 5 * 60 * 1000; // 5 minutes for fresher data

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        renderContributionGraph(cached);
        return;
    }

    try {
        // Fetch from multiple sources for accuracy
        const [jogruberResponse, githubEventsResponse] = await Promise.allSettled([
            fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
            fetch(`https://api.github.com/users/${username}/events/public?per_page=100`)
        ]);

        let contributionData = null;
        let eventsData = [];

        // Try primary API first
        if (jogruberResponse.status === 'fulfilled' && jogruberResponse.value.ok) {
            contributionData = await jogruberResponse.value.json();
        }

        // Get events data for real-time contribution info
        if (githubEventsResponse.status === 'fulfilled' && githubEventsResponse.value.ok) {
            eventsData = await githubEventsResponse.value.json();
        }

        // If we got contribution data, enhance it with real-time events
        if (contributionData) {
            // Build a map of recent contributions from events (real-time data)
            const recentContributions = new Map();

            eventsData.forEach(event => {
                const eventDate = event.created_at.split('T')[0];
                const current = recentContributions.get(eventDate) || 0;

                // Count different contribution types
                if (event.type === 'PushEvent' && event.payload?.commits) {
                    recentContributions.set(eventDate, current + event.payload.commits.length);
                } else if (['CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent'].includes(event.type)) {
                    recentContributions.set(eventDate, current + 1);
                }
            });

            // Store events data for streak calculation (convert Map to object for caching)
            contributionData.recentEvents = Object.fromEntries(recentContributions);
            contributionData.fetchedAt = Date.now();
            contributionData.isLive = true;

            // Cache for 5 minutes
            saveToCache(cacheKey, contributionData, cacheDuration);

            renderContributionGraph(contributionData);
        } else {
            throw new Error('No contribution data available');
        }
    } catch (error) {
        console.warn('Failed to fetch contributions:', error);
        renderMockContributions();
    }
}

// Auto-refresh contributions every 15 minutes when page is visible
function startContributionsAutoRefresh() {
    const refreshInterval = 15 * 60 * 1000; // 15 minutes

    setInterval(() => {
        if (!document.hidden) {
            // Clear cache to force refresh
            localStorage.removeItem('github_contributions_cache');
            fetchGitHubContributions();
        }
    }, refreshInterval);

    // Also refresh when page becomes visible after being hidden
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const cached = getFromCache('github_contributions_cache');
            // Refresh if cache is older than 5 minutes
            if (!cached || (Date.now() - cached.fetchedAt > 5 * 60 * 1000)) {
                localStorage.removeItem('github_contributions_cache');
                fetchGitHubContributions();
            }
        }
    });
}

// Start auto-refresh on page load
document.addEventListener('DOMContentLoaded', startContributionsAutoRefresh);

function renderContributionGraph(data) {
    const container = document.getElementById('contribution-graph');
    if (!container) return;

    // Clear loading state
    container.innerHTML = '';

    // Calculate streaks and total from actual contribution data
    const contributions = data.contributions || [];
    const flatContributions = contributions.flat();

    // Calculate total from actual daily contributions (most accurate)
    let totalContributions = 0;
    flatContributions.forEach(day => {
        totalContributions += day.count || 0;
    });

    // If API provides a total object, use that as reference but prefer calculated
    // The API's total.lastYear sometimes differs from actual sum
    if (data.total && typeof data.total === 'object' && data.total.lastYear) {
        // Use calculated total as it reflects actual contributions in the data
        console.log(`GitHub Contributions - Calculated: ${totalContributions}, API reported: ${data.total.lastYear}`);
    }

    // Calculate stats
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (from today backwards, checking consecutive days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper to get date N days ago
    const getDaysAgo = (n) => {
        const d = new Date(today);
        d.setDate(d.getDate() - n);
        return d.toISOString().split('T')[0];
    };

    // Build a map of date -> count for quick lookup
    // Start with the API data
    const contributionMap = new Map();
    flatContributions.forEach(day => {
        contributionMap.set(day.date, day.count);
    });

    // IMPORTANT: Merge with real-time events data (this is more accurate for recent days)
    // The Events API is real-time, while the contributions API may lag
    if (data.recentEvents && data.recentEvents instanceof Map) {
        data.recentEvents.forEach((count, date) => {
            // Use the higher value between API and events (events may have more recent data)
            const existingCount = contributionMap.get(date) || 0;
            if (count > existingCount) {
                contributionMap.set(date, count);
            }
        });
    } else if (data.recentEvents) {
        // Handle if it was serialized as object (from cache)
        Object.entries(data.recentEvents).forEach(([date, count]) => {
            const existingCount = contributionMap.get(date) || 0;
            if (count > existingCount) {
                contributionMap.set(date, count);
            }
        });
    }

    // Calculate current streak by checking consecutive days from today
    let daysBack = 0;

    while (true) {
        const checkDate = getDaysAgo(daysBack);
        const count = contributionMap.get(checkDate) || 0;

        if (count > 0) {
            currentStreak++;
        } else if (daysBack === 0) {
            // Today has no contributions yet - check from yesterday
            daysBack++;
            continue;
        } else {
            // Hit a day with no contributions - streak ends
            break;
        }

        daysBack++;

        // Safety limit - don't go back more than a year
        if (daysBack > 365) break;
    }

    // Log for debugging
    console.log(`GitHub Streak calculated: ${currentStreak} days (checked from ${getDaysAgo(0)} backwards)`);

    // Calculate longest streak
    const chronological = [...flatContributions].sort((a, b) => new Date(a.date) - new Date(b.date));
    for (const day of chronological) {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    // Update streak stats with actual calculated values
    updateStreakStats(currentStreak, longestStreak, totalContributions);

    // Render graph - get last 52 weeks
    const weeks = getLastNWeeks(flatContributions, 52);

    weeks.forEach(week => {
        const weekEl = document.createElement('div');
        weekEl.className = 'graph-week';

        week.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'graph-day';
            dayEl.setAttribute('data-level', getContributionLevel(day.count));
            dayEl.setAttribute('data-date', day.date);
            dayEl.setAttribute('data-count', day.count);

            // Add tooltip on hover
            dayEl.addEventListener('mouseenter', showTooltip);
            dayEl.addEventListener('mouseleave', hideTooltip);

            weekEl.appendChild(dayEl);
        });

        container.appendChild(weekEl);
    });
}

function getLastNWeeks(contributions, n) {
    const weeks = [];
    const today = new Date();
    const contributionMap = new Map();

    // Create a map for quick lookup
    contributions.forEach(c => contributionMap.set(c.date, c.count));

    // Start from n weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (n * 7) + (7 - startDate.getDay()));

    let currentWeek = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        currentWeek.push({
            date: dateStr,
            count: contributionMap.get(dateStr) || 0
        });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add remaining days
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return weeks;
}

function getContributionLevel(count) {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
}

function updateStreakStats(current, longest, total) {
    const currentEl = document.getElementById('current-streak');
    const longestEl = document.getElementById('longest-streak');
    const totalEl = document.getElementById('total-contributions');

    if (currentEl) animateCounter(currentEl, current);
    if (longestEl) animateCounter(longestEl, longest);
    if (totalEl) animateCounter(totalEl, total);
}

function renderMockContributions() {
    const container = document.getElementById('contribution-graph');
    if (!container) return;

    container.innerHTML = '';

    // Generate mock data for 52 weeks
    for (let week = 0; week < 52; week++) {
        const weekEl = document.createElement('div');
        weekEl.className = 'graph-week';

        for (let day = 0; day < 7; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'graph-day';

            // Random contribution level with some patterns
            const isWeekend = day === 0 || day === 6;
            const randomLevel = isWeekend
                ? Math.floor(Math.random() * 2)
                : Math.floor(Math.random() * 5);

            dayEl.setAttribute('data-level', randomLevel);

            const date = new Date();
            date.setDate(date.getDate() - ((52 - week) * 7 + (6 - day)));
            dayEl.setAttribute('data-date', date.toISOString().split('T')[0]);
            dayEl.setAttribute('data-count', randomLevel * 2);

            dayEl.addEventListener('mouseenter', showTooltip);
            dayEl.addEventListener('mouseleave', hideTooltip);

            weekEl.appendChild(dayEl);
        }

        container.appendChild(weekEl);
    }

    // Set fallback stats based on actual GitHub profile
    updateStreakStats(7, 21, 708);
}

// Tooltip functions
let tooltipEl = null;

function showTooltip(e) {
    const day = e.target;
    const date = day.getAttribute('data-date');
    const count = day.getAttribute('data-count');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'graph-tooltip';
        document.body.appendChild(tooltipEl);
    }

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    tooltipEl.innerHTML = `<span class="count">${count} contributions</span> on ${formattedDate}`;
    tooltipEl.style.display = 'block';

    const rect = day.getBoundingClientRect();
    tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
    tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 8}px`;
}

function hideTooltip() {
    if (tooltipEl) {
        tooltipEl.style.display = 'none';
    }
}

// ============================================
// CACHE UTILITIES
// ============================================
function saveToCache(key, data, duration) {
    try {
        const cacheData = {
            data,
            expiry: Date.now() + duration
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (e) {
        console.warn('Failed to save to cache:', e);
    }
}

function getFromCache(key) {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, expiry } = JSON.parse(cached);
        if (Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    } catch (e) {
        console.warn('Failed to read from cache:', e);
        return null;
    }
}

// ============================================
// CURRENCY EXCHANGE RATE
// ============================================
async function fetchExchangeRate() {
    const cacheKey = 'exchange_rates';
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        exchangeRates = cached;
        return;
    }

    try {
        // Fetch exchange rates from exchangerate-api.com (USD as base)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Failed to fetch exchange rates');

        const data = await response.json();

        // Store rates for all supported currencies
        exchangeRates = {
            USD: 1, // Base currency
            EUR: data.rates.EUR || 0.85,
            KES: data.rates.KES || 130,
            GBP: data.rates.GBP || 0.75,
            CAD: data.rates.CAD || 1.25,
            AUD: data.rates.AUD || 1.35,
            JPY: data.rates.JPY || 110,
            CHF: data.rates.CHF || 0.90
        };

        // Cache the rates for 24 hours
        saveToCache(cacheKey, exchangeRates, cacheDuration);

        console.log('Exchange rates fetched:', exchangeRates);
    } catch (error) {
        console.warn('Failed to fetch exchange rates, using fallback rates:', error);
        // Fallback rates
        exchangeRates = {
            USD: 1,
            EUR: 0.85,
            KES: 130,
            GBP: 0.75,
            CAD: 1.25,
            AUD: 1.35,
            JPY: 110,
            CHF: 0.90
        };
    }
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   👋 Hey there, curious developer!                        ║
║                                                           ║
║   I'm Kelvin Murithi Johnson                              ║
║   Full-Stack Developer | Python Architect | API Engineer  ║
║                                                           ║
║   🚀 Tech Stack: Python, Flask, React, TypeScript,        ║
║      PostgreSQL, REST APIs & more!                        ║
║                                                           ║
║   📧 Let's connect: kevrith@gmail.com                     ║
║   🐙 GitHub: github.com/kevrith                           ║
║                                                           ║
║   🟢 Available for hire | Open to remote work             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'color: #00ff88; font-family: monospace; font-size: 12px;');

console.log('%c🔍 Inspecting my portfolio? I like your style!', 'color: #00d4ff; font-size: 14px;');
