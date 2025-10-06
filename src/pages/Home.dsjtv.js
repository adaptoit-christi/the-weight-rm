// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Content updates for Home Page - The Weight RM

import { setSEODefaults, addLocalBusinessSchema, addBreadcrumbSchema } from 'public/seoUtils.js';
import wixLocation from 'wix-location';

$w.onReady(function () {
    // Update page content
    updatePageContent();

    // SEO Configuration for Home Page
    setSEODefaults({
        title: "The Weight RM - Premium Gym & Personal Training in Torrance, South Bay CA",
        description: "Premier fitness gym and personal training in Torrance, South Bay. Expert trainers, state-of-the-art equipment, and personalized workout programs. Join Torrance's top-rated gym today!",
        keywords: "Torrance gym, South Bay gym, personal training Torrance, fitness center South Bay, weight training Torrance, strength training gym, Semi-Private Training, HYROX",
        ogType: "website",
        ogImage: "/images/home-hero.jpg"
    });

    // Local Business Schema
    addLocalBusinessSchema({
        "@type": ["LocalBusiness", "HealthAndBeautyBusiness", "Gym"],
        "priceRange": "$$",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Training Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Semi-Private Training",
                        "description": "Small-group strength coaching (2-6 people) with personalized programs"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "HYROX Conditioning",
                        "description": "Functional conditioning designed to build endurance, power, and grit"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Gym Classes",
                        "description": "Open gym sessions and group conditioning classes"
                    }
                }
            ]
        },
        "makesOffer": [
            {
                "@type": "Offer",
                "name": "Free Consultation",
                "description": "Complimentary initial fitness consultation",
                "price": "0",
                "priceCurrency": "USD"
            }
        ]
    });

    // Breadcrumb Schema
    addBreadcrumbSchema([
        {
            name: "Home",
            url: "/"
        }
    ]);
});

function updatePageContent() {
    // Update hero tagline - look for text containing "Control the Controllables" or similar
    $w("Text").forEach(element => {
        const text = element.text;

        // Update main tagline
        if (text && (text.includes("Control the Controllables") || text.includes("Empower Growth"))) {
            element.text = "Built by Work, Backed by Science.";
        }

        // Update hero description if it mentions weight management generically
        if (text && text.includes("Transform your health") && text.includes("weight management")) {
            element.text = "South Bay's premier fitness center offering science-backed personal training in Torrance. One-on-one and semi-private coaching for people ready to transform their strength.";
        }

        // Update "How We Train" to show the three training methods
        if (text && text.includes("Personal Training") && !text.includes("Semi-Private")) {
            element.text = "Semi-Private Training";
        }

        if (text && text.includes("Nutrition Counseling")) {
            element.text = "HYROX Conditioning";
        }

        if (text && text.includes("Group Fitness Classes") && !text.includes("Gym Classes")) {
            element.text = "Gym Classes";
        }
    });

    // Add "Who We Help" and "What We Do" sections programmatically if possible
    // Note: This requires knowing container IDs, so we'll update via text replacement for now
}
