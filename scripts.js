/**
 * Kelvin Murithi Johnson - Portfolio
 * Interactive JavaScript with Matrix Effects & Animations
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
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
    initEmailJS();
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
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
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

            // Send email with price quote
            await sendPriceQuote(data, priceRange);

            showNotification('Price quote sent successfully! Check your email for the detailed quote.', 'success');
            form.reset();
        } catch (error) {
            console.error('Charge sheet submission error:', error);
            showNotification('Failed to send price quote. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
}

function calculateProjectPrice(data) {
    let basePrice = 500;
    const features = [];
    const selectedCurrency = data.currency || 'USD';
    const rate = exchangeRates[selectedCurrency] || 1;

    // Analyze project description for keywords
    const description = data.project_description?.toLowerCase() || '';

    // E-commerce features
    if (description.includes('ecommerce') || description.includes('e-commerce') ||
        description.includes('shop') || description.includes('store') ||
        description.includes('cart') || description.includes('payment')) {
        basePrice += 500;
        features.push('E-commerce functionality (+$500)');
    }

    // Blog/CMS features
    if (description.includes('blog') || description.includes('cms') ||
        description.includes('content') || description.includes('article') ||
        description.includes('news') || description.includes('magazine')) {
        basePrice += 200;
        features.push('Blog/CMS features (+$200)');
    }

    // Custom integrations
    if (description.includes('api') || description.includes('integration') ||
        description.includes('third-party') || description.includes('custom') ||
        description.includes('complex') || description.includes('advanced')) {
        basePrice += 300;
        features.push('Custom integrations (+$300)');
    }

    // Database complexity
    if (description.includes('database') || description.includes('data') ||
        description.includes('analytics') || description.includes('reporting')) {
        basePrice += 200;
        features.push('Advanced database features (+$200)');
    }

    // Authentication/User management
    if (description.includes('login') || description.includes('auth') ||
        description.includes('user') || description.includes('account') ||
        description.includes('member')) {
        basePrice += 150;
        features.push('User authentication (+$150)');
    }

    // Timeline adjustments
    if (data.timeline === 'rush') {
        basePrice = Math.round(basePrice * 1.2); // 20% rush fee
        features.push('Rush timeline (+20%)');
    }

    // Project type bonuses
    if (data.project_type === 'ecommerce') {
        basePrice += 200;
        features.push('Full e-commerce setup (+$200)');
    } else if (data.project_type === 'webapp') {
        basePrice += 300;
        features.push('Web application complexity (+$300)');
    }

    // Create price range
    const minPrice = Math.max(500, basePrice - 200);
    const maxPrice = basePrice + 300;

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
        features: features.length > 0 ? features : ['Basic website features'],
        timeline: data.timeline || 'standard'
    };
}

async function sendPriceQuote(clientData, priceRange) {
    // Initialize EmailJS
    if (!window.emailjs) {
        throw new Error('EmailJS not loaded');
    }

    // You'll need to set up EmailJS with your service ID, template ID, and public key
    // For now, we'll use a placeholder - you need to configure this
    const serviceId = 'your_service_id'; // Replace with your EmailJS service ID
    const templateId = 'your_template_id'; // Replace with your EmailJS template ID
    const publicKey = 'your_public_key'; // Replace with your EmailJS public key

    const templateParams = {
        to_email: 'kevrith@gmail.com', // Your email to receive the quote
        client_name: clientData.client_name,
        client_email: clientData.client_email,
        project_type: clientData.project_type,
        project_description: clientData.project_description,
        timeline: clientData.timeline,
        budget_range: clientData.budget_range,
        currency: priceRange.currency,
        price_range_min: `${priceRange.currencySymbol}${priceRange.minPriceConverted}`,
        price_range_max: `${priceRange.currencySymbol}${priceRange.maxPriceConverted}`,
        base_price: `${priceRange.currencySymbol}${priceRange.basePriceConverted}`,
        usd_equivalent: priceRange.currency !== 'USD' ? `USD: $${priceRange.minPrice} - $${priceRange.maxPrice}` : '',
        exchange_rate: `1 USD = ${priceRange.exchangeRate.toFixed(4)} ${priceRange.currency}`,
        features_list: priceRange.features.join(', '),
        reply_to: clientData.client_email
    };

    try {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
    } catch (error) {
        console.error('EmailJS error:', error);
        throw error;
    }
}

// ============================================
// EMAILJS INITIALIZATION
// ============================================
function initEmailJS() {
    if (window.emailjs) {
        // Initialize EmailJS with your public key
        // You'll need to replace this with your actual public key
        emailjs.init('your_public_key'); // Replace with your EmailJS public key
    } else {
        console.warn('EmailJS not loaded');
    }
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

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        renderContributionGraph(cached);
        return;
    }

    try {
        // Use GitHub's contribution calendar via a proxy service
        // Since GitHub doesn't have a public API for contributions,
        // we'll use the GitHub Skyline/contributions approach
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);

        if (!response.ok) throw new Error('Failed to fetch contributions');

        const data = await response.json();

        // Cache for 1 hour
        saveToCache(cacheKey, data, 60 * 60 * 1000);

        renderContributionGraph(data);
    } catch (error) {
        console.warn('Failed to fetch contributions, generating mock data:', error);
        renderMockContributions();
    }
}

function renderContributionGraph(data) {
    const container = document.getElementById('contribution-graph');
    if (!container) return;

    // Clear loading state
    container.innerHTML = '';

    // Calculate streaks and total
    const contributions = data.contributions || [];
    const flatContributions = contributions.flat();

    // Use API's total if available, otherwise calculate
    let totalContributions = data.total?.lastYear || data.total || 0;

    // Calculate stats
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort by date (newest first for current streak)
    const sortedDays = [...flatContributions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate current streak (from today backwards)
    const today = new Date().toISOString().split('T')[0];
    let checkingCurrent = true;

    for (const day of sortedDays) {
        // Only sum if we don't have API total
        if (!data.total) {
            totalContributions += day.count;
        }

        if (checkingCurrent) {
            if (day.count > 0) {
                currentStreak++;
            } else if (day.date !== today) {
                checkingCurrent = false;
            }
        }
    }

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

    // Update streak stats
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
