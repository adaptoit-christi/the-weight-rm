// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Checkout Page - The Weight RM

import { setSEODefaults, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Checkout Page
    setSEODefaults({
        title: "Secure Checkout - The Weight RM",
        description: "Complete your purchase securely for weight management services at The Weight RM. Safe and encrypted payment processing.",
        keywords: "secure checkout, fitness payment, weight management purchase",
        ogType: "website",
        robots: "noindex, nofollow" // Checkout pages shouldn't be indexed
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
        },
        {
            name: "Checkout",
            url: "/checkout"
        }
    ]);

    // Your existing checkout functionality
    initializeCheckout();
});

// Initialize secure checkout
function initializeCheckout() {
    // Your existing checkout logic here
    // Payment processing, form validation, etc.
}
