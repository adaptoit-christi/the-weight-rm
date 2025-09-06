// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Groups Page - The Weight RM

import { setSEODefaults, addServiceSchema, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Groups Page
    setSEODefaults({
        title: "Group Fitness Classes - Supportive Weight Management Community",
        description: "Join our supportive group fitness classes at The Weight RM. Small group training sessions with personalized attention for effective weight management and fitness.",
        keywords: "group fitness classes, small group training, weight management groups, fitness community, group workouts",
        ogType: "website"
    });

    // Service Schema for group fitness
    addServiceSchema({
        name: "Group Fitness Classes",
        description: "Small group fitness training sessions with community support",
        serviceType: "Group Fitness Training",
        audience: {
            "@type": "Audience",
            "audienceType": "Adults seeking weight management support"
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Group Class Options",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Beginner Weight Loss Group",
                        "description": "Supportive group for those starting their weight loss journey"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Advanced Fitness Group",
                        "description": "High-intensity group training for experienced participants"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Nutrition Support Group",
                        "description": "Group sessions focused on healthy eating and nutrition education"
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
            name: "Groups",
            url: "/groups"
        }
    ]);

    // Your existing groups functionality
    loadGroupClasses();
});

// Function to load group classes
function loadGroupClasses() {
    // Your existing group loading logic
}
