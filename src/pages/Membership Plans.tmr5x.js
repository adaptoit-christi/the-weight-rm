// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Content updates for Membership Plans Page - The Weight RM

import { setSEODefaults, addServiceSchema, addBreadcrumbSchema } from 'public/seoUtils.js';

$w.onReady(function () {
    // Update page content
    updatePageContent();

    // SEO Configuration for Membership Plans Page
    setSEODefaults({
        title: "Gym Membership Plans - The Weight RM Torrance | South Bay Fitness",
        description: "Join The Weight RM in Torrance! Flexible gym membership plans for South Bay residents. Semi-Private Training, HYROX Conditioning, and Gym Classes.",
        keywords: "gym membership Torrance, South Bay fitness membership, personal training plans, Torrance gym rates, fitness center membership, HYROX training",
        ogType: "website"
    });

    // Service Schema for membership offerings
    addServiceSchema({
        name: "Fitness Membership Plans",
        description: "Science-backed training programs with personalized coaching",
        serviceType: "Health and Fitness Membership",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Membership Options",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Semi-Private Training - 16 Sessions AutoPay",
                    "description": "16 sessions every 4 weeks with personalized coaching",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "600.00",
                        "priceCurrency": "USD",
                        "eligibleTransactionVolume": {
                            "@type": "PriceSpecification",
                            "unitText": "4 WEEKS"
                        }
                    }
                },
                {
                    "@type": "Offer",
                    "name": "Semi-Private Training - 12 Sessions AutoPay",
                    "description": "12 sessions every 4 weeks with personalized coaching",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "480.00",
                        "priceCurrency": "USD",
                        "eligibleTransactionVolume": {
                            "@type": "PriceSpecification",
                            "unitText": "4 WEEKS"
                        }
                    }
                },
                {
                    "@type": "Offer",
                    "name": "HYROX Conditioning Classes",
                    "description": "Functional conditioning to build endurance, power, and grit",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "priceCurrency": "USD"
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
});

function updatePageContent() {
    // Update all text elements on the page
    $w("Text").forEach(element => {
        const text = element.text;

        // Update hero title
        if (text && (text.includes("Membership Plans") || text.includes("Affordable Weight Management"))) {
            element.text = "Train Smarter. Stay Consistent. Get Strong.";
        }

        // Update hero description
        if (text && text.includes("Choose the perfect membership plan")) {
            element.text = "Science-backed programs and direct coaching for real strength results — choose the plan that fits your goals and schedule.";
        }

        // Add pricing effective date
        if (text && text.includes("Flexible options")) {
            element.text = "Pricing Effective January 1, 2026";
        }

        // Update Semi-Private Training description
        if (text && text.includes("Access to group fitness classes")) {
            element.text = "Small-group strength coaching (2–6 people). Personalized programs. Shared accountability.";
        }

        // Update HYROX description
        if (text && text.includes("Includes personal training sessions")) {
            element.text = "Functional conditioning designed to build real endurance, power, and grit — HYROX-style training that pushes your limits.";
        }

        // Update pricing values for 2026
        // 16 Sessions AutoPay
        if (text && text === "$480") {
            element.text = "$600";
        }

        // 12 Sessions AutoPay
        if (text && text === "$420") {
            element.text = "$480";
        }

        // 8 Sessions AutoPay
        if (text && text === "$320") {
            element.text = "$360";
        }

        // Update per-session rates
        if (text && text === "$30/session") {
            element.text = "$37.50/session";
        }

        if (text && text === "$35/session") {
            element.text = "$40/session";
        }

        if (text && text === "$40/session") {
            element.text = "$45/session";
        }

        // Update package pricing
        if (text && text === "$576") {
            element.text = "$680";
        }

        if (text && text === "$468") {
            element.text = "$525";
        }

        if (text && text === "$360") {
            element.text = "$400";
        }

        // Update package per-session rates
        if (text && text === "$36/session") {
            element.text = "$42.50/session";
        }

        if (text && text === "$39/session") {
            element.text = "$43.75/session";
        }

        if (text && text === "$45/session" && !text.includes("AutoPay")) {
            element.text = "$50/session";
        }
    });

    // Add AutoPay notice
    console.log("Membership page content updated with 2026 pricing");
}
