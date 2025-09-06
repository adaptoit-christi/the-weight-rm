// Performance Optimization Utilities for The Weight RM
// Focused on mobile performance improvements

import wixWindow from 'wix-window';

// Performance configuration
export const PERFORMANCE_CONFIG = {
    // Lazy loading thresholds
    lazyLoadOffset: 200, // pixels before element enters viewport
    
    // Image optimization settings
    imageOptimization: {
        quality: 80, // JPEG quality (1-100)
        format: 'auto', // auto, webp, jpg, png
        progressive: true
    },
    
    // JavaScript loading delays
    loadDelays: {
        nonCritical: 2000, // ms delay for non-critical scripts
        analytics: 3000,   // ms delay for analytics
        socialWidgets: 4000 // ms delay for social media widgets
    },
    
    // Connection-based optimizations
    connectionTypes: {
        '4g': { imageQuality: 80, loadDelay: 0 },
        '3g': { imageQuality: 60, loadDelay: 1000 },
        '2g': { imageQuality: 40, loadDelay: 2000 },
        'slow-2g': { imageQuality: 30, loadDelay: 3000 }
    }
};

// Detect user's connection speed
export function getConnectionInfo() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        return {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
        };
    }
    return { effectiveType: '4g', saveData: false }; // fallback
}

// Optimize loading based on connection
export function optimizeForConnection() {
    const connection = getConnectionInfo();
    const config = PERFORMANCE_CONFIG.connectionTypes[connection.effectiveType] || 
                  PERFORMANCE_CONFIG.connectionTypes['4g'];
    
    // Apply connection-based optimizations
    if (connection.saveData || connection.effectiveType.includes('2g')) {
        // Aggressive optimization for slow connections
        disableNonEssentialAnimations();
        reduceImageQuality(30);
        delayNonCriticalResources(3000);
    } else if (connection.effectiveType === '3g') {
        // Moderate optimization for 3G
        reduceImageQuality(60);
        delayNonCriticalResources(1000);
    }
    
    return config;
}

// Image lazy loading with intersection observer
export function initializeLazyLoading() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        loadAllImages();
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: `${PERFORMANCE_CONFIG.lazyLoadOffset}px`
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Load image with optimization
function loadImage(img) {
    const connection = getConnectionInfo();
    const src = img.dataset.src;
    
    if (src) {
        // Apply connection-based image optimization
        const optimizedSrc = optimizeImageUrl(src, connection);
        
        img.src = optimizedSrc;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        
        // Add load event listener for fade-in effect
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }
}

// Optimize image URL based on connection
function optimizeImageUrl(src, connection) {
    if (src.includes('static.wixstatic.com')) {
        // Wix image optimization parameters
        const quality = PERFORMANCE_CONFIG.connectionTypes[connection.effectiveType]?.imageQuality || 80;
        
        // Add Wix image optimization parameters
        const separator = src.includes('?') ? '&' : '?';
        return `${src}${separator}quality=${quality}&format=webp`;
    }
    
    return src; // Return original if not a Wix image
}

// Fallback for browsers without IntersectionObserver
function loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
    });
}

// Reduce image quality for slow connections
function reduceImageQuality(quality) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.src && img.src.includes('static.wixstatic.com')) {
            const url = new URL(img.src);
            url.searchParams.set('quality', quality.toString());
            img.src = url.toString();
        }
    });
}

// Disable non-essential animations on slow connections
function disableNonEssentialAnimations() {
    // Add CSS to disable animations
    const style = document.createElement('style');
    style.innerHTML = `
        .performance-optimized * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
    document.body.classList.add('performance-optimized');
}

// Delay loading of non-critical resources
export function delayNonCriticalResources(delay = 2000) {
    setTimeout(() => {
        loadAnalytics();
        loadSocialWidgets();
        loadChatWidgets();
    }, delay);
}

// Load analytics scripts after delay
function loadAnalytics() {
    // Google Analytics
    if (!window.gtag && window.GA_MEASUREMENT_ID) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', window.GA_MEASUREMENT_ID);
        };
    }
}

// Load social media widgets after delay
function loadSocialWidgets() {
    // Facebook SDK
    if (document.querySelector('.fb-like, .fb-share-button') && !window.FB) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
        document.head.appendChild(script);
    }
    
    // Twitter widgets
    if (document.querySelector('.twitter-tweet') && !window.twttr) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://platform.twitter.com/widgets.js';
        document.head.appendChild(script);
    }
}

// Load chat widgets after delay
function loadChatWidgets() {
    // Add your chat widget loading code here
    // Example: Intercom, Zendesk Chat, etc.
}

// Critical resource hints for faster loading
export function addResourceHints() {
    const head = document.head;
    
    // Preconnect to external domains
    const preconnectDomains = [
        'https://static.wixstatic.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com'
    ];
    
    preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        head.appendChild(link);
    });
    
    // DNS prefetch for other domains
    const dnsPrefetchDomains = [
        'https://connect.facebook.net',
        'https://platform.twitter.com',
        'https://www.googletagmanager.com'
    ];
    
    dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        head.appendChild(link);
    });
}

// Performance monitoring
export function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
    
    // Monitor page load times
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domContentLoadTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log('Performance Metrics:', {
            pageLoadTime: `${pageLoadTime}ms`,
            domContentLoadTime: `${domContentLoadTime}ms`,
            connection: getConnectionInfo()
        });
        
        // Send to analytics if page load > 3 seconds
        if (pageLoadTime > 3000) {
            console.warn('Slow page load detected:', pageLoadTime + 'ms');
            // Send to your analytics platform
        }
    });
}

// Optimize Wix-specific performance
export function optimizeWixPerformance() {
    // Defer Wix non-critical features
    if (window.wixDevelopersAnalytics) {
        // Delay analytics initialization
        setTimeout(() => {
            window.wixDevelopersAnalytics.register();
        }, PERFORMANCE_CONFIG.loadDelays.analytics);
    }
    
    // Optimize Wix media loading
    const wixImages = document.querySelectorAll('wix-image img');
    wixImages.forEach(img => {
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
}

// Service Worker registration for caching
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}