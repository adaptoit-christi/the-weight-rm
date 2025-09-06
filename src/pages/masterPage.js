// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Master Page SEO & Performance Configuration - The Weight RM

import wixSeo from 'wix-seo-frontend';
import { BUSINESS_INFO } from 'public/seoUtils.js';
import { 
    optimizeForConnection, 
    initializeLazyLoading, 
    delayNonCriticalResources, 
    addResourceHints,
    initializePerformanceMonitoring,
    optimizeWixPerformance 
} from 'public/performanceUtils.js';

$w.onReady(function () {
    // Performance optimizations (run first for faster loading)
    initializePerformanceOptimizations();
    
    // Global SEO settings applied to all pages
    configureMasterSEO();
    
    // Add global structured data
    addGlobalSchema();

    // Your existing master page functionality
});

function initializePerformanceOptimizations() {
    // Add resource hints for faster loading
    addResourceHints();
    
    // Optimize based on user's connection speed
    optimizeForConnection();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Optimize Wix-specific performance
    optimizeWixPerformance();
    
    // Delay non-critical resources to improve load time
    delayNonCriticalResources(2000);
    
    // Start performance monitoring
    initializePerformanceMonitoring();
    
    // Add performance CSS for smooth loading
    addPerformanceCSS();
}

function configureMasterSEO() {
    // Global meta tags that apply to all pages
    wixSeo.metaTags([
        // Viewport (crucial for mobile SEO)
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        
        // Language and locale
        { name: 'language', content: 'en-US' },
        { property: 'og:locale', content: 'en_US' },
        
        // Site verification tags (add your verification codes)
        // { name: 'google-site-verification', content: 'your-google-verification-code' },
        // { name: 'msvalidate.01', content: 'your-bing-verification-code' },
        
        // Global Open Graph settings
        { property: 'og:site_name', content: BUSINESS_INFO.name },
        { property: 'og:image', content: BUSINESS_INFO.logo },
        
        // Twitter Card defaults
        { name: 'twitter:site', content: '@theweightrm' },
        { name: 'twitter:creator', content: '@theweightrm' },
        
        // Additional meta tags
        { name: 'application-name', content: BUSINESS_INFO.name },
        { name: 'theme-color', content: '#your-brand-color' }, // Add your brand color
        { name: 'msapplication-navbutton-color', content: '#your-brand-color' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ]);
}

function addGlobalSchema() {
    // Organization Schema (appears on every page)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": BUSINESS_INFO.name,
        "description": BUSINESS_INFO.description,
        "url": BUSINESS_INFO.website,
        "logo": {
            "@type": "ImageObject",
            "url": BUSINESS_INFO.logo
        },
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": BUSINESS_INFO.phone,
                "contactType": "customer service",
                "availableLanguage": "English"
            }
        ],
        "sameAs": [
            BUSINESS_INFO.socialMedia.facebook,
            BUSINESS_INFO.socialMedia.instagram,
            BUSINESS_INFO.socialMedia.twitter
        ].filter(url => url), // Remove empty URLs
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Weight Management Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Weight Management",
                        "category": "Health and Fitness"
                    }
                }
            ]
        }
    };

    // Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": BUSINESS_INFO.name,
        "url": BUSINESS_INFO.website,
        "description": BUSINESS_INFO.description,
        "publisher": {
            "@type": "Organization",
            "name": BUSINESS_INFO.name
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": BUSINESS_INFO.website + "/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        },
        "mainEntity": {
            "@type": "LocalBusiness",
            "name": BUSINESS_INFO.name,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": BUSINESS_INFO.address.streetAddress,
                "addressLocality": BUSINESS_INFO.address.addressLocality,
                "addressRegion": BUSINESS_INFO.address.addressRegion,
                "postalCode": BUSINESS_INFO.address.postalCode,
                "addressCountry": BUSINESS_INFO.address.addressCountry
            },
            "telephone": BUSINESS_INFO.phone,
            "email": BUSINESS_INFO.email
        }
    };

    // Add both schemas to the page
    wixSeo.structuredData([organizationSchema, websiteSchema]);
}

function addPerformanceCSS() {
    // Add CSS for performance optimizations
    const style = document.createElement('style');
    style.innerHTML = `
        /* Lazy loading image styles */
        img.lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        /* Optimize font loading */
        @font-face {
            font-display: swap;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Optimize scrolling performance */
        * {
            -webkit-overflow-scrolling: touch;
        }
        
        /* Loading states */
        .loading-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* Critical CSS for above-the-fold content */
        .hero-section {
            min-height: 50vh;
            background-attachment: scroll; /* Better mobile performance than fixed */
        }
        
        /* Optimize button interactions */
        button, .button, [role="button"] {
            touch-action: manipulation;
            cursor: pointer;
        }
        
        /* Improve tap targets for mobile */
        @media (max-width: 768px) {
            button, .button, a, [role="button"] {
                min-height: 44px;
                min-width: 44px;
            }
        }
    `;
    document.head.appendChild(style);
}
