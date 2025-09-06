// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Contact Us Page - The Weight RM

import { setSEODefaults, addLocalBusinessSchema, addBreadcrumbSchema, addFAQSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // SEO Configuration for Contact Us Page
    setSEODefaults({
        title: "Contact The Weight RM - Schedule Your Consultation",
        description: "Contact The Weight RM to schedule your free consultation. Get directions, hours, and contact information for professional weight management services.",
        keywords: "contact weight rm, fitness consultation, weight management appointment, health coaching contact",
        ogType: "website"
    });

    // Enhanced Local Business Schema with detailed contact info
    addLocalBusinessSchema({
        "@type": ["LocalBusiness", "HealthAndBeautyBusiness", "Gym"],
        "priceRange": "$$",
        "openingHours": [
            "Mo-Fr 06:00-20:00",
            "Sa 07:00-18:00",
            "Su 08:00-16:00"
        ],
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
        "currenciesAccepted": "USD",
        "hasMap": true,
        "isAccessibleForFree": false,
        "smokingAllowed": false,
        "amenityFeature": [
            {
                "@type": "LocationFeatureSpecification",
                "name": "Free Parking",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification", 
                "name": "WiFi",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Air Conditioning",
                "value": true
            }
        ],
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "", // Add your latitude
            "longitude": "" // Add your longitude
        }
    });

    // Breadcrumb Schema
    addBreadcrumbSchema([
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Contact Us",
            url: "/contact-us"
        }
    ]);

    // FAQ Schema for common contact questions
    addFAQSchema([
        {
            question: "What are your hours of operation?",
            answer: "We are open Monday-Friday 6:00 AM - 8:00 PM, Saturday 7:00 AM - 6:00 PM, and Sunday 8:00 AM - 4:00 PM."
        },
        {
            question: "Do you offer free consultations?",
            answer: "Yes, we offer complimentary initial consultations to discuss your health and fitness goals."
        },
        {
            question: "How can I schedule an appointment?",
            answer: "You can schedule an appointment by calling us, using our online booking system, or visiting us in person."
        },
        {
            question: "Do you accept insurance?",
            answer: "Please contact us directly to discuss insurance coverage and payment options for our services."
        }
    ]);

    // Your existing JavaScript code here
    // Contact form handling, map integration, etc.
});
