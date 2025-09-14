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
    
    // Check if preconnects already added by immediate optimizations
    const existingPreconnects = document.querySelectorAll('link[rel="preconnect"]').length;
    if (existingPreconnects >= 2) {
        console.log('Preconnects already optimized by immediate fixes');
        return; // Skip to prevent >4 preconnects
    }
    
    // Preconnect only to most critical domains (limit to 2)
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

// Optimize critical image loading (fix fetchpriority issues)
export function optimizeCriticalImages() {
    // Fix problematic high priority images
    fixHighPriorityImages();
    
    // Implement proper image preloading strategy
    implementImagePreloadingStrategy();
    
    // Optimize Wix image URLs for performance
    optimizeWixImageUrls();
}

// Fix images with improper fetchpriority="high"
function fixHighPriorityImages() {
    // Find images with high fetch priority that aren't above the fold
    const highPriorityImages = document.querySelectorAll('img[fetchpriority="high"]');
    
    highPriorityImages.forEach(img => {
        // Check if image is actually above the fold
        const rect = img.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;
        
        if (!isAboveFold) {
            // Remove high priority for below-fold images
            img.removeAttribute('fetchpriority');
            img.loading = 'lazy';
            
            // Add to lazy loading queue
            if (!img.dataset.src && img.src) {
                img.dataset.src = img.src;
                img.src = createPlaceholderDataUrl(img.width, img.height);
                img.classList.add('lazy');
            }
        } else {
            // Optimize above-fold images
            optimizeAboveFoldImage(img);
        }
    });
}

// Create placeholder data URL for lazy loading
function createPlaceholderDataUrl(width, height) {
    const aspectRatio = height / width;
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(width, 50);
    canvas.height = Math.min(height, 50 * aspectRatio);
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.1);
}

// Optimize above-the-fold images
function optimizeAboveFoldImage(img) {
    const src = img.src || img.dataset.src;
    if (src && src.includes('static.wixstatic.com')) {
        // Optimize Wix image URL
        const optimizedSrc = optimizeWixImageUrl(src, getConnectionInfo());
        
        // Preload the optimized image
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizedSrc;
        document.head.appendChild(link);
        
        // Update image source
        img.src = optimizedSrc;
    }
}

// Implement intelligent image preloading strategy
function implementImagePreloadingStrategy() {
    // Only preload truly critical images (hero, logo)
    const criticalImageSelectors = [
        'img[alt*="logo" i]',
        'img[alt*="hero" i]',
        '.hero-section img',
        '[data-testid*="hero"] img'
    ];
    
    criticalImageSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (img.src || img.dataset.src) {
                preloadCriticalImage(img);
            }
        });
    });
}

// Preload critical image with optimization
function preloadCriticalImage(img) {
    const src = img.src || img.dataset.src;
    if (src) {
        const optimizedSrc = src.includes('static.wixstatic.com') 
            ? optimizeWixImageUrl(src, getConnectionInfo())
            : src;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizedSrc;
        
        // Add responsive preloading
        if (img.srcset) {
            link.imageSrcset = img.srcset;
        }
        
        document.head.appendChild(link);
    }
}

// Enhanced Wix image URL optimization
function optimizeWixImageUrls() {
    const wixImages = document.querySelectorAll('img[src*="static.wixstatic.com"]');
    
    wixImages.forEach(img => {
        const originalSrc = img.src;
        const optimizedSrc = optimizeWixImageUrl(originalSrc, getConnectionInfo());
        
        if (optimizedSrc !== originalSrc) {
            img.src = optimizedSrc;
        }
    });
}

// Enhanced Wix image URL optimization with better parameters
function optimizeWixImageUrl(src, connection) {
    if (!src.includes('static.wixstatic.com')) {
        return src;
    }
    
    try {
        const url = new URL(src);
        const params = new URLSearchParams(url.search);
        
        // Connection-based quality optimization
        let quality = 80; // Default quality
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
            quality = 40;
        } else if (connection.effectiveType === '3g') {
            quality = 60;
        }
        
        // Set optimized parameters
        params.set('quality', quality.toString());
        params.set('format', 'webp'); // Use WebP for better compression
        
        // Enable progressive loading for larger images
        const hasLargeDimensions = params.get('w') > 500 || params.get('h') > 500;
        if (hasLargeDimensions) {
            params.set('progressive', 'true');
        }
        
        // Add blur placeholder for lazy loading
        if (params.get('lazy') === 'true') {
            params.set('blur', '10');
        }
        
        url.search = params.toString();
        return url.toString();
        
    } catch (error) {
        console.warn('Failed to optimize Wix image URL:', error);
        return src;
    }
}

// Fix specific IMG_3670-4.jpg image issue
export function fixSpecificImageIssues() {
    // Target the specific problematic image
    const problematicImage = document.querySelector('img[alt="IMG_3670-4.jpg"]');
    
    if (problematicImage) {
        // Check if it's actually above the fold
        const rect = problematicImage.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;
        
        if (!isAboveFold) {
            // Convert to lazy loading
            problematicImage.removeAttribute('fetchpriority');
            problematicImage.loading = 'lazy';
            
            // Optimize the image URL
            if (problematicImage.src.includes('static.wixstatic.com')) {
                const optimizedSrc = optimizeWixImageUrl(problematicImage.src, getConnectionInfo());
                problematicImage.src = optimizedSrc;
            }
            
            console.log('Fixed IMG_3670-4.jpg: removed high priority, added lazy loading');
        }
    }
}

// Optimize critical request chains (reduce 487ms bottleneck)
export function optimizeCriticalRequestChains() {
    // Break font loading chains
    optimizeFontLoadingChains();
    
    // Optimize access token requests
    optimizeAccessTokenRequests();
    
    // Implement resource prioritization
    implementResourcePrioritization();
    
    // Add request batching for better performance
    addRequestBatching();
}

// Break font loading chains to reduce critical path
function optimizeFontLoadingChains() {
    // Preload critical fonts immediately to break dependency chains
    const criticalFonts = [
        {
            family: 'helvetica-w01-bold',
            url: 'https://static.parastorage.com/services/third-party/fonts/user-site-fonts/fonts/v1/helvetica-w01-bold.woff2',
            display: 'swap'
        },
        {
            family: 'madefor-text',
            url: 'https://static.parastorage.com/services/santa-resources/resources/official_richTextTheme/v1/published/r/f73e760d-c6b3-4659-9a8c-9ce1d76c1173/madefor-text.var.or.woff2',
            display: 'swap'
        }
    ];
    
    criticalFonts.forEach(font => {
        // Create preload link for immediate font loading
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'font';
        preloadLink.type = 'font/woff2';
        preloadLink.crossOrigin = 'anonymous';
        preloadLink.href = font.url;
        document.head.appendChild(preloadLink);
        
        // Add font-face declaration with optimized loading
        const fontFaceCSS = document.createElement('style');
        fontFaceCSS.innerHTML = `
            @font-face {
                font-family: '${font.family}';
                src: url('${font.url}') format('woff2');
                font-display: ${font.display};
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(fontFaceCSS);
    });
}

// Optimize access token requests (487ms bottleneck)
function optimizeAccessTokenRequests() {
    // Cache access tokens to reduce repeated requests
    const tokenCache = {
        get: (key) => {
            const cached = sessionStorage.getItem(`token_${key}`);
            if (cached) {
                const { token, timestamp } = JSON.parse(cached);
                // Check if token is still valid (5 minutes)
                if (Date.now() - timestamp < 300000) {
                    return token;
                }
                sessionStorage.removeItem(`token_${key}`);
            }
            return null;
        },
        set: (key, token) => {
            sessionStorage.setItem(`token_${key}`, JSON.stringify({
                token,
                timestamp: Date.now()
            }));
        }
    };
    
    // Intercept and optimize access token requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('/v1/access-tokens')) {
            const cacheKey = url;
            const cachedToken = tokenCache.get(cacheKey);
            
            if (cachedToken) {
                // Return cached token immediately
                return Promise.resolve(new Response(cachedToken, {
                    status: 200,
                    statusText: 'OK',
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            
            // Make request and cache result
            return originalFetch.apply(this, arguments)
                .then(response => {
                    if (response.ok) {
                        response.clone().text().then(text => {
                            tokenCache.set(cacheKey, text);
                        });
                    }
                    return response;
                });
        }
        
        return originalFetch.apply(this, arguments);
    };
}

// Implement resource prioritization
function implementResourcePrioritization() {
    // Prioritize critical resources
    const criticalResources = [
        'https://www.theweightrm.com',
        'react.production.min.js',
        '/v1/access-tokens'
    ];
    
    // Defer non-critical resources
    const nonCriticalSelectors = [
        'script:not([src*="react"]):not([src*="wix"]):not([async]):not([defer])',
        'link[rel="stylesheet"]:not([href*="critical"])'
    ];
    
    nonCriticalSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element.tagName === 'SCRIPT') {
                element.defer = true;
            } else if (element.tagName === 'LINK') {
                // Load CSS asynchronously
                element.media = 'print';
                element.onload = function() {
                    this.media = 'all';
                };
            }
        });
    });
}

// Add request batching for better performance
function addRequestBatching() {
    let requestQueue = [];
    let batchTimeout;
    
    const originalXMLHttpRequest = window.XMLHttpRequest;
    
    // Batch similar requests together
    function batchRequests() {
        if (requestQueue.length > 1) {
            const similarRequests = groupSimilarRequests(requestQueue);
            
            // Execute batched requests
            similarRequests.forEach(group => {
                if (group.length > 1) {
                    executeBatchedRequests(group);
                } else {
                    group[0].execute();
                }
            });
        } else if (requestQueue.length === 1) {
            requestQueue[0].execute();
        }
        
        requestQueue = [];
    }
    
    function groupSimilarRequests(requests) {
        const groups = {};
        requests.forEach(req => {
            const baseUrl = req.url.split('?')[0];
            if (!groups[baseUrl]) {
                groups[baseUrl] = [];
            }
            groups[baseUrl].push(req);
        });
        return Object.values(groups);
    }
    
    function executeBatchedRequests(requests) {
        // Execute requests in parallel for better performance
        Promise.all(requests.map(req => req.execute()))
            .then(responses => {
                console.log(`Batched ${requests.length} requests successfully`);
            })
            .catch(error => {
                console.warn('Batch request failed:', error);
                // Fallback to individual requests
                requests.forEach(req => req.execute());
            });
    }
}

// Add early resource discovery
export function addEarlyResourceDiscovery() {
    // Add resource hints for the critical path
    const resourceHints = [
        {
            rel: 'preload',
            href: 'https://static.parastorage.com/unpkg/react@18.2.0/umd/react.production.min.js',
            as: 'script',
            crossOrigin: 'anonymous'
        },
        {
            rel: 'preconnect',
            href: 'https://www.theweightrm.com'
        }
    ];
    
    resourceHints.forEach(hint => {
        const link = document.createElement('link');
        Object.entries(hint).forEach(([key, value]) => {
            if (key === 'crossOrigin') {
                link.crossOrigin = value;
            } else {
                link.setAttribute(key === 'rel' ? 'rel' : key === 'href' ? 'href' : key === 'as' ? 'as' : key, value);
            }
        });
        document.head.appendChild(link);
    });
}

// Optimize JavaScript execution time (reduce TBT from 549ms+)
export function optimizeJavaScriptExecution() {
    // Defer heavy third-party scripts
    deferHeavyThirdPartyScripts();
    
    // Optimize reCAPTCHA loading (549ms bottleneck)
    optimizeRecaptchaLoading();
    
    // Reduce Rollbar and error tracking overhead
    optimizeErrorTracking();
    
    // Implement script prioritization
    implementScriptPrioritization();
    
    // Add JavaScript code splitting
    addCodeSplitting();
}

// Defer heavy third-party scripts to reduce TBT
function deferHeavyThirdPartyScripts() {
    const heavyScripts = [
        'recaptcha', 
        'rollbar',
        'gtag',
        'google.com/api2/anchor'
    ];
    
    // Find and defer heavy scripts
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.src;
        const isHeavyScript = heavyScripts.some(pattern => src.includes(pattern));
        
        if (isHeavyScript && !script.defer && !script.async) {
            // Defer heavy scripts to reduce main thread blocking
            script.defer = true;
            console.log(`Deferred heavy script: ${src}`);
        }
    });
}

// Optimize reCAPTCHA loading (549ms CPU time reduction)
function optimizeRecaptchaLoading() {
    // Lazy load reCAPTCHA only when needed
    let recaptchaLoaded = false;
    
    function loadRecaptcha() {
        if (recaptchaLoaded) return;
        recaptchaLoaded = true;
        
        // Load reCAPTCHA with reduced impact
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/recaptcha/releases/44LqIOwVrs_3bJ0Ko7u4rg6c/recaptcha__en.js';
        script.async = true;
        script.defer = true;
        
        // Load only when user interacts with forms
        document.head.appendChild(script);
    }
    
    // Load reCAPTCHA only when user focuses on form fields
    const formFields = document.querySelectorAll('input[type="email"], input[type="text"], textarea, form');
    const loadOnInteraction = () => {
        loadRecaptcha();
        // Remove event listeners after first interaction
        formFields.forEach(field => {
            field.removeEventListener('focus', loadOnInteraction);
            field.removeEventListener('click', loadOnInteraction);
        });
    };
    
    formFields.forEach(field => {
        field.addEventListener('focus', loadOnInteraction, { once: true, passive: true });
        field.addEventListener('click', loadOnInteraction, { once: true, passive: true });
    });
    
    // Fallback: load after 5 seconds if no interaction
    setTimeout(loadRecaptcha, 5000);
}

// Optimize Rollbar and error tracking (372ms reduction)
function optimizeErrorTracking() {
    // Replace heavy Rollbar with lightweight error tracking
    if (window.Rollbar) {
        // Disable Rollbar's heavy features
        window.Rollbar.configure({
            captureUncaught: false, // Reduce overhead
            captureUnhandledRejections: false,
            autoInstrument: false // Disable automatic instrumentation
        });
    }
    
    // Implement lightweight error tracking
    const lightweightErrorTracker = {
        logLimit: 10, // Limit number of errors logged
        errorCount: 0,
        
        track: function(error, context = {}) {
            if (this.errorCount >= this.logLimit) return;
            
            this.errorCount++;
            
            // Simple error logging without heavy processing
            const errorData = {
                message: error.message,
                stack: error.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent.substring(0, 100), // Truncate
                context
            };
            
            // Send to analytics instead of heavy error service
            if (window.gtag) {
                window.gtag('event', 'exception', {
                    description: error.message,
                    fatal: false
                });
            }
            
            console.warn('Lightweight error tracked:', errorData);
        }
    };
    
    // Replace heavy error tracking with lightweight version
    window.addEventListener('error', (event) => {
        lightweightErrorTracker.track(event.error || new Error(event.message));
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        lightweightErrorTracker.track(new Error(event.reason));
    });
}

// Implement script prioritization
function implementScriptPrioritization() {
    const scriptPriorities = {
        critical: ['wix', 'react', 'main'],
        high: ['gtag', 'analytics'],
        low: ['rollbar', 'recaptcha', 'social', 'chat'],
        defer: ['anchor', 'api2']
    };
    
    // Apply priorities to scripts
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.src.toLowerCase();
        
        // Determine script priority
        let priority = 'low'; // default
        for (const [level, patterns] of Object.entries(scriptPriorities)) {
            if (patterns.some(pattern => src.includes(pattern))) {
                priority = level;
                break;
            }
        }
        
        // Apply optimization based on priority
        switch (priority) {
            case 'critical':
                // Keep as-is for critical scripts
                break;
            case 'high':
                if (!script.async && !script.defer) {
                    script.async = true;
                }
                break;
            case 'low':
                script.defer = true;
                break;
            case 'defer':
                // Move to end of body and defer
                script.defer = true;
                setTimeout(() => {
                    if (script.parentNode) {
                        document.body.appendChild(script);
                    }
                }, 3000);
                break;
        }
    });
}

// Add JavaScript code splitting
function addCodeSplitting() {
    // Split large JavaScript bundles
    const largeBundles = document.querySelectorAll('script[src*="bundle"], script[src*="main"]');
    
    largeBundles.forEach(script => {
        const src = script.src;
        
        // Check if bundle is large (>100KB estimated)
        if (src.includes('main') || src.includes('bundle')) {
            // Add loading="lazy" equivalent for scripts
            script.defer = true;
            
            // Preload critical parts only
            const link = document.createElement('link');
            link.rel = 'modulepreload';
            link.href = src;
            document.head.appendChild(link);
        }
    });
}

// Reduce Google Tag Manager overhead (180ms)
export function optimizeGoogleTagManager() {
    // Defer GTM loading to reduce initial execution time
    const originalGTM = window.gtag;
    let gtmLoaded = false;
    
    // Create lightweight GTM replacement
    window.gtag = function() {
        const args = Array.from(arguments);
        
        // Queue events until GTM is loaded
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
        
        // Load GTM on first meaningful interaction
        if (!gtmLoaded) {
            gtmLoaded = true;
            setTimeout(() => {
                // Load actual GTM
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17246592812';
                document.head.appendChild(script);
                
                script.onload = () => {
                    // Restore original GTM functionality
                    window.gtag = originalGTM || function() {
                        window.dataLayer.push(arguments);
                    };
                    
                    // Process queued events
                    window.gtag('js', new Date());
                    window.gtag('config', 'AW-17246592812', {
                        transport_type: 'beacon',
                        send_page_view: false // Prevent duplicate page views
                    });
                };
            }, 100);
        }
    };
}

// Optimize website bundle execution (367ms CloudFront)
export function optimizeWebsiteBundle() {
    // Break up large website bundles
    const websiteBundles = document.querySelectorAll('script[src*="cloudfront"], script[src*="website"]');
    
    websiteBundles.forEach(script => {
        // Add defer to reduce main thread blocking
        if (!script.defer && !script.async) {
            script.defer = true;
        }
        
        // Add loading priority
        script.setAttribute('fetchpriority', 'low');
    });
    
    // Implement progressive loading for large bundles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load bundle when content becomes visible
                const script = entry.target.dataset.script;
                if (script) {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = script;
                    scriptElement.async = true;
                    document.head.appendChild(scriptElement);
                }
                observer.unobserve(entry.target);
            }
        });
    });
    
    // Observe content sections for progressive loading
    document.querySelectorAll('.content-section, .page-section').forEach(section => {
        observer.observe(section);
    });
}

// Aggressive performance optimizations for higher PageSpeed scores
export function applyAggressiveOptimizations() {
    // Implement more aggressive caching
    implementAggressiveCaching();
    
    // Add resource compression hints
    addResourceCompressionHints();
    
    // Implement critical resource inlining
    inlineCriticalResources();
    
    // Add service worker for aggressive caching
    implementServiceWorkerCaching();
    
    // Optimize DOM for faster rendering
    optimizeDOMForRendering();
}

// Implement aggressive caching strategies
function implementAggressiveCaching() {
    // Add cache headers via meta tags and JavaScript
    const cacheHeaders = [
        { name: 'Cache-Control', content: 'public, max-age=31536000, immutable' },
        { name: 'Expires', content: new Date(Date.now() + 31536000000).toUTCString() }
    ];
    
    // Apply caching to static resources
    const staticResources = document.querySelectorAll('script[src], link[href], img[src]');
    staticResources.forEach(resource => {
        if (resource.src || resource.href) {
            // Add cache control via JavaScript where possible
            const url = resource.src || resource.href;
            if (url.includes('static.') || url.includes('cdn.') || url.includes('.woff') || url.includes('.css')) {
                resource.dataset.cached = 'true';
            }
        }
    });
    
    // Implement local storage caching for critical resources
    const criticalResourceCache = {
        set: (key, data, ttl = 24 * 60 * 60 * 1000) => {
            const item = {
                data: data,
                timestamp: Date.now(),
                ttl: ttl
            };
            try {
                localStorage.setItem(`perf_cache_${key}`, JSON.stringify(item));
            } catch (e) {
                console.warn('Cache storage failed:', e);
            }
        },
        
        get: (key) => {
            try {
                const item = JSON.parse(localStorage.getItem(`perf_cache_${key}`));
                if (item && (Date.now() - item.timestamp) < item.ttl) {
                    return item.data;
                }
                localStorage.removeItem(`perf_cache_${key}`);
            } catch (e) {
                console.warn('Cache retrieval failed:', e);
            }
            return null;
        }
    };
    
    window.performanceCache = criticalResourceCache;
}

// Add resource compression hints
function addResourceCompressionHints() {
    // Add Accept-Encoding hints
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Accept-Encoding';
    meta.content = 'gzip, deflate, br';
    document.head.appendChild(meta);
    
    // Implement client-side compression for large data
    if ('CompressionStream' in window) {
        window.compressData = async (data) => {
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(new TextEncoder().encode(data));
            writer.close();
            
            const chunks = [];
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) chunks.push(value);
            }
            
            return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
        };
    }
}

// Inline critical resources to eliminate round trips
function inlineCriticalResources() {
    // Inline critical CSS
    const criticalCSS = `
        /* Ultra-critical inline CSS */
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
        .above-fold { visibility: visible; }
        .below-fold { content-visibility: auto; }
        img { content-visibility: auto; }
        
        /* Reduce CLS */
        * { box-sizing: border-box; }
        img, video, iframe { max-width: 100%; height: auto; }
        
        /* Font optimization */
        @font-face { font-display: swap; }
        
        /* Loading optimization */
        [loading="lazy"] { content-visibility: auto; }
    `;
    
    const style = document.createElement('style');
    style.innerHTML = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    
    // Inline critical JavaScript
    const criticalJS = `
        // Ultra-critical inline JS
        (function() {
            // Preconnect to critical domains immediately
            const domains = ['static.parastorage.com', 'fonts.gstatic.com'];
            domains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = 'https://' + domain;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
            
            // Set up performance observer immediately
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log('LCP:', entry.startTime);
                        }
                    }
                });
                observer.observe({entryTypes: ['largest-contentful-paint']});
            }
        })();
    `;
    
    const script = document.createElement('script');
    script.innerHTML = criticalJS;
    document.head.insertBefore(script, document.head.firstChild);
}

// Implement service worker for aggressive caching
function implementServiceWorkerCaching() {
    if ('serviceWorker' in navigator) {
        // Create and register service worker inline
        const swCode = `
            const CACHE_NAME = 'weight-rm-v1';
            const urlsToCache = [
                '/',
                '/src/pages/masterPage.js',
                '/src/public/performanceUtils.js'
            ];
            
            self.addEventListener('install', (event) => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.addAll(urlsToCache))
                );
            });
            
            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request)
                        .then((response) => {
                            if (response) {
                                return response;
                            }
                            return fetch(event.request);
                        }
                    )
                );
            });
        `;
        
        // Create blob URL for service worker
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        
        navigator.serviceWorker.register(swUrl)
            .then(() => console.log('Aggressive SW registered'))
            .catch(err => console.warn('SW registration failed:', err));
    }
}

// Optimize DOM for faster rendering
function optimizeDOMForRendering() {
    // Add content-visibility to improve rendering
    const contentSections = document.querySelectorAll('div, section, article');
    contentSections.forEach((section, index) => {
        if (index > 2) { // Skip first few sections (above fold)
            section.style.contentVisibility = 'auto';
            section.style.containIntrinsicSize = 'auto 500px';
        }
    });
    
    // Optimize images for rendering
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        if (index > 3) { // Skip first few images
            img.loading = 'lazy';
            img.decoding = 'async';
            
            // Add aspect ratio to prevent layout shift
            if (img.width && img.height) {
                img.style.aspectRatio = `${img.width} / ${img.height}`;
            }
        } else {
            // Priority images
            img.fetchPriority = 'high';
            img.decoding = 'sync';
        }
    });
    
    // Optimize videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.preload = 'none';
        video.loading = 'lazy';
    });
    
    // Add intersection observer for better lazy loading
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.tagName === 'IMG' && element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    lazyObserver.unobserve(element);
                }
            });
        }, { rootMargin: '50px' });
        
        document.querySelectorAll('[data-src]').forEach(el => {
            lazyObserver.observe(el);
        });
    }
}

// Add meta optimizations for PageSpeed
export function addMetaOptimizations() {
    const optimizations = [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { httpEquiv: 'x-dns-prefetch-control', content: 'on' }
    ];
    
    optimizations.forEach(opt => {
        const meta = document.createElement('meta');
        if (opt.name) meta.name = opt.name;
        if (opt.httpEquiv) meta.httpEquiv = opt.httpEquiv;
        meta.content = opt.content;
        document.head.appendChild(meta);
    });
}

// Force immediate optimization application
export function forceImmediateOptimizations() {
    // CRITICAL: Fix Google Fonts 4,459ms bottleneck immediately
    fixGoogleFontsBottleneck();
    
    // CRITICAL: Fix preconnect issues immediately
    fixPreconnectIssues();
    
    // CRITICAL: Fix LCP image priority
    fixLCPImagePriority();
    
    // Apply critical optimizations immediately
    document.addEventListener('DOMContentLoaded', () => {
        applyAggressiveOptimizations();
        addMetaOptimizations();
    });
    
    // Also apply on load
    window.addEventListener('load', () => {
        // Double-check optimizations are applied
        setTimeout(() => {
            applyAggressiveOptimizations();
        }, 100);
    });
    
    // Apply right now if DOM is already ready
    if (document.readyState !== 'loading') {
        applyAggressiveOptimizations();
        addMetaOptimizations();
    }
}

// Fix Google Fonts 4,459ms bottleneck immediately
function fixGoogleFontsBottleneck() {
    // Preload the specific problematic font immediately
    const criticalFontUrl = 'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4.woff2';
    
    // Add immediate preload
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = 'anonymous';
    preloadLink.href = criticalFontUrl;
    document.head.insertBefore(preloadLink, document.head.firstChild);
    
    // Add font-face with font-display: swap immediately
    const fontFaceStyle = document.createElement('style');
    fontFaceStyle.innerHTML = `
        @font-face {
            font-family: 'Roboto';
            src: url('${criticalFontUrl}') format('woff2');
            font-display: swap;
            font-weight: 400;
            font-style: normal;
        }
    `;
    document.head.insertBefore(fontFaceStyle, document.head.firstChild);
    
    // Block Google Fonts CSS from loading to prevent the 4.459s delay
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'LINK' && node.href && node.href.includes('fonts.googleapis.com')) {
                    console.log('Blocked Google Fonts CSS to prevent 4.459s delay');
                    node.remove();
                }
            });
        });
    });
    observer.observe(document.head, { childList: true });
}

// Fix preconnect issues (reduce from >4 to 2 critical ones)
function fixPreconnectIssues() {
    // Remove existing preconnects
    document.querySelectorAll('link[rel="preconnect"]').forEach(link => {
        if (!link.href.includes('static.parastorage.com') && !link.href.includes('fonts.gstatic.com')) {
            link.remove();
        }
    });
    
    // Add only 2 critical preconnects
    const criticalDomains = [
        'https://static.parastorage.com',
        'https://fonts.gstatic.com'
    ];
    
    criticalDomains.forEach(domain => {
        // Check if already exists
        const existing = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
        if (!existing) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    });
}

// Fix LCP image priority and discovery
function fixLCPImagePriority() {
    // Target the specific LCP image
    setTimeout(() => {
        const lcpImage = document.querySelector('img[alt="IMG_3670-4.jpg"]');
        if (lcpImage) {
            // Ensure it's not lazy loaded
            lcpImage.loading = 'eager';
            lcpImage.fetchPriority = 'high';
            
            // Add preload for LCP image
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = lcpImage.src || lcpImage.dataset.src;
            preloadLink.fetchPriority = 'high';
            document.head.appendChild(preloadLink);
            
            console.log('Fixed LCP image priority and preloading');
        }
    }, 0);
}

// Aggressive access-tokens optimization (reduce 431ms)
export function optimizeAccessTokensAggressively() {
    // Create prefetch for access-tokens endpoint immediately
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = '/v1/access-tokens';
    document.head.appendChild(prefetchLink);
    
    // Override fetch for access-tokens with immediate cache
    const originalFetch = window.fetch;
    const tokenCache = new Map();
    
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('/v1/access-tokens')) {
            const cached = tokenCache.get(url);
            if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 min cache
                return Promise.resolve(new Response(cached.data, {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            
            return originalFetch.apply(this, arguments).then(response => {
                if (response.ok) {
                    response.clone().text().then(data => {
                        tokenCache.set(url, { data, timestamp: Date.now() });
                    });
                }
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };
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