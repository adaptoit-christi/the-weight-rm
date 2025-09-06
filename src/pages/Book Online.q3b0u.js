// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Book Online Page - The Weight RM

import { setSEODefaults, addServiceSchema, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Book Online Page
    setSEODefaults({
        title: "Book Online - Schedule Your Weight Management Consultation",
        description: "Book your appointment online at The Weight RM. Schedule personal training, nutrition counseling, and group fitness sessions. Easy online booking available 24/7.",
        keywords: "book appointment online, fitness consultation booking, weight management appointment, personal trainer booking",
        ogType: "website"
    });

    // Service Schema for booking services
    addServiceSchema({
        name: "Online Appointment Booking",
        description: "Convenient online booking system for all weight management and fitness services",
        serviceType: "Health and Fitness Services",
        provider: {
            "@type": "LocalBusiness",
            "name": "The Weight RM"
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Bookable Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Personal Training Session",
                        "description": "One-on-one fitness coaching session"
                    },
                    "availability": "https://schema.org/InStock",
                    "validFrom": new Date().toISOString()
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Nutrition Consultation",
                        "description": "Personalized nutrition planning session"
                    },
                    "availability": "https://schema.org/InStock",
                    "validFrom": new Date().toISOString()
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Group Fitness Class",
                        "description": "Small group fitness training session"
                    },
                    "availability": "https://schema.org/InStock",
                    "validFrom": new Date().toISOString()
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
            name: "Book Online",
            url: "/book-online"
        }
    ]);

    // Your existing booking functionality
    initializeBookingSystem();
});

// Initialize booking system
function initializeBookingSystem() {
    // Your existing booking logic here
    // Service selection, calendar integration, etc.
}
