// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Membership Plans Page - The Weight RM

import { setSEODefaults, addServiceSchema, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Membership Plans Page
    setSEODefaults({
        title: "Membership Plans - Affordable Weight Management Programs",
        description: "Choose the perfect membership plan for your weight management journey. Flexible options for personal training, nutrition counseling, and group fitness at The Weight RM.",
        keywords: "membership plans, fitness membership, weight management programs, gym membership, personal training packages",
        ogType: "website"
    });

    // Service Schema for membership offerings
    addServiceSchema({
        name: "Fitness Membership Plans",
        description: "Comprehensive weight management and fitness membership options",
        serviceType: "Health and Fitness Membership",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Membership Options",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Basic Membership",
                    "description": "Access to group fitness classes and basic facilities",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "priceCurrency": "USD",
                        "eligibleTransactionVolume": {
                            "@type": "PriceSpecification",
                            "unitText": "MONTH"
                        }
                    }
                },
                {
                    "@type": "Offer",
                    "name": "Premium Membership",
                    "description": "Includes personal training sessions and nutrition counseling",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "priceCurrency": "USD",
                        "eligibleTransactionVolume": {
                            "@type": "PriceSpecification",
                            "unitText": "MONTH"
                        }
                    }
                },
                {
                    "@type": "Offer",
                    "name": "VIP Membership",
                    "description": "All-inclusive package with unlimited services and priority booking",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "priceCurrency": "USD",
                        "eligibleTransactionVolume": {
                            "@type": "PriceSpecification",
                            "unitText": "MONTH"
                        }
                    }
                }
            ]
        }
    });

    // Breadcrumb Schema
    addBreadcrumbSchema([
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Membership Plans",
            url: "/membership-plans"
        }
    ]);

    // Your existing membership functionality
    loadMembershipPlans();
});

// Function to load membership plans
function loadMembershipPlans() {
    // Your existing membership loading logic
}
