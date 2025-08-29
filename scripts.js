// JavaScript Functionality
// Most of the Code I got them by googling which has enabled me to start learning how 
// to have animations on website which I ninitaialy thought was possible by react
// Global Variables
let currentPage = 'home';
const pages = ['home','about','projects','contact'];

// DOM Elements
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {

    // Initialize navigation
    initializeNavigation();
    
    // Initialize animations
    initializeAnimations();
    
    // Add scroll effects
    initializeScrollEffects();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Create particles effect
    createParticles();
});
// Navigation System
function initializeNavigation() {
    // Add click events to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
        });
    });
    
    // Menu Icon
    function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
}

    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        const page = e.state ? e.state.page : 'home';
        showPage(page);
        updateActiveNav(page);
    });
        
    // Set initial state
    history.replaceState({ page: 'home' }, '', '#home');
}
function navigateToPage(targetPage) {
    if (pages.includes(targetPage) && targetPage !== currentPage) {
        showPage(targetPage);
        updateActiveNav(targetPage);
        history.pushState({ page: targetPage }, '', `#${targetPage}`);
        currentPage = targetPage;
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
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
        
        // Trigger fade-in animations
        const fadeElements = targetPage.querySelectorAll('.fade-in');
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationDelay = `${index * 0.1}s`;
                el.classList.add('fade-in');
            }, 100);
        });
    }
}

function updateActiveNav(pageId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}
// Mobile Menu Toggle
function initializeMobileMenu() {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}   
// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset > 50;
        navbar.classList.toggle('scrolled', scrolled);
    });
}

// Animation System
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Contact Form Handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}
// Business Card Download Functions
function downloadBusinessCard(format) {
    let filename, mimeType;
    
    switch(format) {
        case 'pdf':
            filename = 'Kelvin_Developer_BusinessCard.pdf';
            mimeType = 'application/pdf';
            break;
        case 'jpg':
            filename = 'Kelvin_Developer_BusinessCard.jpg';
            mimeType = 'image/jpeg';
            break;
        case 'vcard':
            filename = 'Kelvin_Developer.vcf';
            mimeType = 'text/vcard';
            // Generate vCard content
            generateVCard();
            return;
        default:
            return;
    }
    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual business card file path after creating the business card
    link.download = filename;   
    
    showNotification(`${format.toUpperCase()} business card download started!`, 'info');
    
    // In a real implementation, you would download the actual file
    // For this purposes, it just show the notification
}

function generateVCard() {
    // Generate vCard format contact info
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:Kelvin Developer
ORG:Freelance Developer
TITLE:Front-end Developer
EMAIL:kevrith@gmail.com
TEL:+254 718 864 578
URL:https://kevrith.github.io/Portfolio/
ADR:;;Nairobi;Nairobi County;;00100;Kenya
NOTE:Front-end Developer specializing in web development and software development
END:VCARD`;
    
    // Create download
    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kelvin_Developer.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('vCard downloaded successfully!', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            backdrop-filter: blur(10px);
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        ">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" 
               style="color: var(--accent-primary); margin-right: 0.5rem;"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    const notificationEl = notification.firstElementChild;
    
    // Slide in
    setTimeout(() => {
        notificationEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notificationEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth Scrolling for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('data-page')) return; // Skip navigation links
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Navigate with arrow keys
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
});

// Performance Optimization
// Lazy load images when they come into viewport
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add some interactive particles effect for the hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return; // Exit if hero section doesn't exist yet
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent-primary);
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.2};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s infinite linear;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}

// Enhanced Button Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add click effect to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation keyframes dynamically
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

// Theme Toggle (for potential future enhancement)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isDark = !document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
});

// Enhanced Mobile Experience
function handleTouchInteractions() {
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchY;
        
        // Add subtle parallax effect on mobile scroll
        if (Math.abs(touchDiff) > 50) {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${touchDiff * 0.1}px)`;
            }
        }
    });
}

// Initialize touch interactions on mobile
if ('ontouchstart' in window) {
    handleTouchInteractions();
}

// Console Branding
console.log('%c🚀 Portfolio website loaded successfully!', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%c💼 Built with HTML5, CSS3, and Vanilla JavaScript', 'color: #4ecdc4; font-size: 14px;');
console.log('%c📱 Fully responsive and optimized for all devices', 'color: #ff6b6b; font-size: 14px;');

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToPage,
        showNotification,
        downloadCV,
        downloadBusinessCard,
        generateVCard
    };
}