// SEO Utility Functions for The Weight RM
// API Reference: https://www.wix.com/velo/reference/wix-seo-frontend

import wixSeo from 'wix-seo-frontend';
import wixWindow from 'wix-window';

// Business Information Constants
export const BUSINESS_INFO = {
    name: "The Weight RM",
    description: "Professional weight management and fitness services",
    address: {
        streetAddress: "", // Add your address
        addressLocality: "", // Add your city
        addressRegion: "", // Add your state
        postalCode: "", // Add your zip
        addressCountry: "US"
    },
    phone: "", // Add your phone
    email: "", // Add your email
    website: "", // Add your website URL
    logo: "", // Add your logo URL
    socialMedia: {
        facebook: "",
        instagram: "",
        twitter: ""
    }
};

// SEO Configuration Helper
export function setSEODefaults(pageConfig) {
    const config = {
        siteName: "The Weight RM",
        separator: " | ",
        defaultDescription: "Transform your health with professional weight management, fitness coaching, and nutrition guidance at The Weight RM.",
        defaultKeywords: "weight management, fitness coaching, nutrition, health transformation, weight loss",
        ...pageConfig
    };

    // Set title with site name
    const fullTitle = config.title + config.separator + config.siteName;
    wixSeo.title(fullTitle);
    
    // Set meta description
    wixSeo.metaDescription(config.description || config.defaultDescription);
    
    // Set keywords
    const keywords = config.keywords ? 
        config.defaultKeywords + ", " + config.keywords : 
        config.defaultKeywords;
    wixSeo.metaKeywords(keywords);
    
    // Set canonical URL
    wixSeo.canonicalUrl(wixWindow.currentPage.url);
    
    // Open Graph tags
    wixSeo.metaTags([
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: config.description || config.defaultDescription },
        { property: 'og:type', content: config.ogType || 'website' },
        { property: 'og:url', content: wixWindow.currentPage.url },
        { property: 'og:site_name', content: config.siteName },
        { property: 'og:image', content: config.ogImage || BUSINESS_INFO.logo },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: config.description || config.defaultDescription },
        { name: 'twitter:image', content: config.ogImage || BUSINESS_INFO.logo },
        
        // Additional meta tags
        { name: 'robots', content: config.robots || 'index, follow' },
        { name: 'author', content: config.siteName },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
    ]);
}

// Local Business Schema
export function addLocalBusinessSchema(additionalData = {}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": BUSINESS_INFO.name,
        "description": BUSINESS_INFO.description,
        "url": BUSINESS_INFO.website,
        "logo": BUSINESS_INFO.logo,
        "telephone": BUSINESS_INFO.phone,
        "email": BUSINESS_INFO.email,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS_INFO.address.streetAddress,
            "addressLocality": BUSINESS_INFO.address.addressLocality,
            "addressRegion": BUSINESS_INFO.address.addressRegion,
            "postalCode": BUSINESS_INFO.address.postalCode,
            "addressCountry": BUSINESS_INFO.address.addressCountry
        },
        "sameAs": [
            BUSINESS_INFO.socialMedia.facebook,
            BUSINESS_INFO.socialMedia.instagram,
            BUSINESS_INFO.socialMedia.twitter
        ].filter(url => url), // Remove empty URLs
        ...additionalData
    };

    wixSeo.structuredData([schema]);
}

// Service Schema
export function addServiceSchema(serviceData) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceData.name,
        "description": serviceData.description,
        "provider": {
            "@type": "LocalBusiness",
            "name": BUSINESS_INFO.name,
            "url": BUSINESS_INFO.website
        },
        "areaServed": serviceData.areaServed || BUSINESS_INFO.address.addressLocality,
        "serviceType": serviceData.serviceType,
        ...serviceData
    };

    wixSeo.structuredData([schema]);
}

// Article Schema for Blog Posts
export function addArticleSchema(articleData) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.headline,
        "description": articleData.description,
        "author": {
            "@type": "Person",
            "name": articleData.author || "The Weight RM Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": BUSINESS_INFO.name,
            "logo": {
                "@type": "ImageObject",
                "url": BUSINESS_INFO.logo
            }
        },
        "datePublished": articleData.datePublished,
        "dateModified": articleData.dateModified || articleData.datePublished,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": wixWindow.currentPage.url
        },
        ...articleData
    };

    wixSeo.structuredData([schema]);
}

// FAQ Schema
export function addFAQSchema(faqData) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    wixSeo.structuredData([schema]);
}

// Breadcrumb Schema
export function addBreadcrumbSchema(breadcrumbs) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };

    wixSeo.structuredData([schema]);
}

// Person Schema for Team Members
export function addPersonSchema(personData) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": personData.name,
        "jobTitle": personData.jobTitle,
        "description": personData.description,
        "worksFor": {
            "@type": "Organization",
            "name": BUSINESS_INFO.name
        },
        "image": personData.image,
        "sameAs": personData.socialLinks || [],
        ...personData
    };

    wixSeo.structuredData([schema]);
}