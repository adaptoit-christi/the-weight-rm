// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Cart Page - The Weight RM

import { setSEODefaults, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Cart Page
    setSEODefaults({
        title: "Shopping Cart - The Weight RM",
        description: "Review your selected weight management services and products before checkout at The Weight RM.",
        keywords: "shopping cart, fitness services, weight management checkout",
        ogType: "website",
        robots: "noindex, nofollow" // Cart pages shouldn't be indexed
    });

    // Breadcrumb Schema
    addBreadcrumbSchema([
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Cart",
            url: "/cart"
        }
    ]);

    // Your existing cart functionality
    initializeCart();
});

// Initialize cart functionality
function initializeCart() {
    // Your existing cart logic here
}
