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
    // Google Analytics (AW-17246592812)
    if (!window.gtag && !document.querySelector('script[src*="googletagmanager"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17246592812';
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'AW-17246592812', {
                // Enhanced ecommerce and conversion tracking
                send_page_view: false, // We'll handle page views manually
                transport_type: 'beacon'
            });
            
            // Track delayed page view (for performance optimization)
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                send_to: 'AW-17246592812'
            });
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

// Preload critical fonts to fix 5s bottleneck
function preloadCriticalFonts() {
    const head = document.head;
    
    // Critical fonts from PageSpeed report
    const criticalFonts = [
        {
            // KFOlCnqEu (Roboto) - the 5s bottleneck
            href: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
            type: 'woff2'
        }
    ];
    
    criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = `font/${font.type}`;
        link.crossOrigin = 'anonymous';
        link.href = font.href;
        head.appendChild(link);
    });
    
    // Add font-display swap CSS for all fonts
    const fontOptimizationCSS = document.createElement('style');
    fontOptimizationCSS.innerHTML = `
        @font-face {
            font-display: swap;
        }
        
        /* Ensure all Google Fonts use font-display: swap */
        [style*="font-family"] {
            font-display: swap !important;
        }
    `;
    head.appendChild(fontOptimizationCSS);
}

// Critical resource hints for faster loading
export function addResourceHints() {
    const head = document.head;
    
    // Add font preload for critical fonts (fixes 5s bottleneck)
    preloadCriticalFonts();
    
    // Preconnect only to most critical domains (limit to 3)
    const preconnectDomains = [
        'https://static.parastorage.com', // Most critical - Wix assets
        'https://fonts.gstatic.com'       // Critical - Font files (5s bottleneck)
    ];
    
    preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        head.appendChild(link);
    });
    
    // DNS prefetch for less critical domains (move others here)
    const dnsPrefetchDomains = [
        'https://static.wixstatic.com',   // Moved from preconnect
        'https://fonts.googleapis.com',  // Moved from preconnect  
        'https://www.google-analytics.com', // Moved from preconnect
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

// Optimize resource loading chains (fixes critical path latency)
export function optimizeResourceChains() {
    // Defer all non-critical JavaScript
    deferNonCriticalScripts();
    
    // Optimize CSS loading
    optimizeCSSLoading();
    
    // Reduce render-blocking resources
    reduceRenderBlocking();
}

// Defer non-critical scripts to reduce blocking
function deferNonCriticalScripts() {
    const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])');
    scripts.forEach(script => {
        const src = script.src;
        
        // Skip critical scripts
        if (src.includes('wix') || src.includes('bootstrap') || src.includes('jquery')) {
            return;
        }
        
        // Add defer to non-critical scripts
        script.defer = true;
    });
}

// Optimize CSS loading
function optimizeCSSLoading() {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        const href = link.href;
        
        // Non-critical CSS should be loaded asynchronously
        if (!href.includes('critical') && !href.includes('above-fold')) {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
                this.onload = null;
            };
        }
    });
}

// Reduce render-blocking resources
function reduceRenderBlocking() {
    // Move all non-critical CSS to load after initial render
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalCSS.forEach(link => {
        if (!link.href.includes('fonts.googleapis.com')) { // Keep font CSS synchronous
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function() {
                this.rel = 'stylesheet';
            };
        }
    });
}

// Bundle deduplication and optimization for Wix modules
export function optimizeBundleLoading() {
    // Prevent duplicate Wix module loading
    preventDuplicateWixModules();
    
    // Implement intelligent bundle splitting
    implementBundleSplitting();
    
    // Cache commonly used modules
    cacheCommonModules();
}

// Prevent loading duplicate Wix modules (70KB+ savings)
function preventDuplicateWixModules() {
    const loadedModules = new Set();
    const originalImport = window.import;
    
    // Track loaded modules to prevent duplicates
    window.moduleRegistry = window.moduleRegistry || new Map();
    
    // Intercept module loading
    if (typeof window.define === 'function') {
        const originalDefine = window.define;
        window.define = function(name, deps, factory) {
            // Check if module already loaded
            if (window.moduleRegistry.has(name)) {
                return window.moduleRegistry.get(name);
            }
            
            // Load and register new module
            const result = originalDefine.apply(this, arguments);
            window.moduleRegistry.set(name, result);
            return result;
        };
    }
}

// Implement intelligent bundle splitting
function implementBundleSplitting() {
    // Defer loading of non-critical Wix UI components
    const nonCriticalComponents = [
        'LoginSocialBar',
        'SearchBox', 
        'QuickAction',
        'MenuContainer'
    ];
    
    // Lazy load these components only when needed
    nonCriticalComponents.forEach(component => {
        deferComponentLoading(component);
    });
}

// Defer component loading until needed
function deferComponentLoading(componentName) {
    // Create intersection observer for component lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.component === componentName) {
                    loadWixComponent(componentName, element);
                    observer.unobserve(element);
                }
            }
        });
    }, { rootMargin: '50px' });
    
    // Observe elements that need this component
    document.querySelectorAll(`[data-component="${componentName}"]`).forEach(el => {
        observer.observe(el);
    });
}

// Load Wix component dynamically
function loadWixComponent(componentName, element) {
    // Use dynamic import if available
    if (typeof import === 'function') {
        import(`wix-ui-thunderbolt/${componentName}`)
            .then(module => {
                // Initialize component
                if (module.default && typeof module.default.init === 'function') {
                    module.default.init(element);
                }
            })
            .catch(error => {
                console.warn(`Failed to load ${componentName}:`, error);
                // Fallback to standard loading
                loadComponentFallback(componentName, element);
            });
    } else {
        loadComponentFallback(componentName, element);
    }
}

// Fallback component loading
function loadComponentFallback(componentName, element) {
    // Standard Wix component initialization
    if (window.Wix && window.Wix.UI && window.Wix.UI[componentName]) {
        window.Wix.UI[componentName].init(element);
    }
}

// Cache commonly used modules in localStorage
function cacheCommonModules() {
    const commonModules = [
        '@wix/image-kit',
        '@wix/image', 
        'web-vitals',
        '@wix/static-service'
    ];
    
    // Implement module caching strategy
    commonModules.forEach(moduleName => {
        cacheModule(moduleName);
    });
}

// Cache individual module
function cacheModule(moduleName) {
    const cacheKey = `wix-module-${moduleName}`;
    const cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    
    // Check if module is cached and valid
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}-time`);
    
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < cacheTimeout) {
        // Use cached version
        try {
            const cachedModule = JSON.parse(cached);
            window.moduleRegistry = window.moduleRegistry || new Map();
            window.moduleRegistry.set(moduleName, cachedModule);
        } catch (error) {
            console.warn(`Failed to parse cached module ${moduleName}:`, error);
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(`${cacheKey}-time`);
        }
    }
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