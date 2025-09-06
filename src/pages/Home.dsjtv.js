// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Home Page - The Weight RM

import { setSEODefaults, addLocalBusinessSchema, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Home Page
    setSEODefaults({
        title: "Professional Weight Management & Fitness Coaching",
        description: "Transform your health with expert weight management, personalized fitness coaching, and nutrition guidance. Book your consultation today at The Weight RM.",
        keywords: "weight loss programs, fitness coaching, nutrition counseling, health transformation, personal training",
        ogType: "website",
        ogImage: "/images/home-hero.jpg" // Update with actual image path
    });

    // Local Business Schema
    addLocalBusinessSchema({
        "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
        "priceRange": "$$",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Weight Management Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Personal Training",
                        "description": "One-on-one fitness coaching sessions"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Nutrition Counseling",
                        "description": "Personalized nutrition planning and guidance"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Group Fitness Classes",
                        "description": "Small group fitness sessions and support"
                    }
                }
            ]
        },
        "makesOffer": [
            {
                "@type": "Offer",
                "name": "Free Consultation",
                "description": "Complimentary initial health and fitness assessment",
                "price": "0",
                "priceCurrency": "USD"
            }
        ]
    });

    // Breadcrumb Schema
    addBreadcrumbSchema([
        {
            name: "Home",
            url: "/"
        }
    ]);

    // Performance optimizations for Home page
    initializeHomePageOptimizations();
    
    // Your existing JavaScript code here
    // To select an element by ID use: $w('#elementID')
});

// Home page specific performance optimizations
function initializeHomePageOptimizations() {
    // Optimize hero section loading
    optimizeHeroSection();
    
    // Lazy load below-the-fold content
    lazyLoadContent();
    
    // Optimize form interactions
    optimizeFormPerformance();
    
    // Preload critical resources
    preloadCriticalResources();
}

function optimizeHeroSection() {
    // Ensure hero content loads first
    const heroSection = $w('#heroSection');
    if (heroSection) {
        // Add loading skeleton while content loads
        heroSection.html = `
            <div class="loading-skeleton" style="height: 300px; width: 100%; margin-bottom: 20px;"></div>
            <div class="loading-skeleton" style="height: 40px; width: 60%; margin-bottom: 10px;"></div>
            <div class="loading-skeleton" style="height: 20px; width: 80%;"></div>
        `;
        
        // Load actual content after a brief delay
        setTimeout(() => {
            loadHeroContent();
        }, 100);
    }
}

function loadHeroContent() {
    // Replace with actual hero content
    const heroSection = $w('#heroSection');
    if (heroSection) {
        heroSection.html = `
            <h1>Transform Your Health at The Weight RM</h1>
            <p>Professional weight management, fitness coaching, and nutrition guidance</p>
            <button id="ctaButton">Book Your Free Consultation</button>
        `;
        
        // Add click handler for CTA button
        $w('#ctaButton').onClick(() => {
            // Navigate to booking page
            wixLocation.to('/book-online');
        });
    }
}

function lazyLoadContent() {
    // Lazy load testimonials, service cards, etc.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Load content based on element type
                if (element.classList.contains('testimonials-section')) {
                    loadTestimonials();
                } else if (element.classList.contains('services-section')) {
                    loadServices();
                } else if (element.classList.contains('team-section')) {
                    loadTeamMembers();
                }
                
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '100px' // Load content 100px before it comes into view
    });
    
    // Observe sections for lazy loading
    document.querySelectorAll('.testimonials-section, .services-section, .team-section').forEach(section => {
        observer.observe(section);
    });
}

function loadTestimonials() {
    // Load testimonials content
    console.log('Loading testimonials...');
    // Your testimonial loading logic here
}

function loadServices() {
    // Load services content
    console.log('Loading services...');
    // Your services loading logic here
}

function loadTeamMembers() {
    // Load team members content
    console.log('Loading team members...');
    // Your team loading logic here
}

function optimizeFormPerformance() {
    // Optimize contact forms, newsletter signup, etc.
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Add debouncing to form inputs
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Validate input after user stops typing
                    validateInput(input);
                }, 300);
            });
        });
    });
}

function validateInput(input) {
    // Basic input validation
    if (input.type === 'email') {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        input.setCustomValidity(isValid ? '' : 'Please enter a valid email address');
    }
}

function preloadCriticalResources() {
    // Preload images that will be needed soon
    const criticalImages = [
        '/images/hero-background.jpg',
        '/images/service-1.jpg',
        '/images/service-2.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}
