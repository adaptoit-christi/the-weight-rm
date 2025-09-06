// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// SEO Implementation for Blog Page - The Weight RM

import { setSEODefaults, addBreadcrumbSchema, addArticleSchema } from 'public/seoUtils.js';
import wixData from 'wix-data';

$w.onReady(function () {
    // SEO Configuration for Blog Page
    setSEODefaults({
        title: "Health & Weight Management Blog - Expert Tips & Advice",
        description: "Stay informed with expert health and weight management advice from The Weight RM. Read our latest blog posts on fitness, nutrition, and wellness tips.",
        keywords: "health blog, weight management tips, fitness advice, nutrition articles, wellness blog",
        ogType: "blog"
    });

    // Breadcrumb Schema
    addBreadcrumbSchema([
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Blog",
            url: "/blog"
        }
    ]);

    // If this is a specific blog post (check URL parameters or page context)
    // You would typically get this from your blog post data
    const currentPost = getCurrentBlogPost(); // Implement this function based on your blog setup
    
    if (currentPost) {
        // Update SEO for specific blog post
        setSEODefaults({
            title: currentPost.title,
            description: currentPost.excerpt || currentPost.description,
            keywords: currentPost.tags ? currentPost.tags.join(', ') : "health, weight management, fitness",
            ogType: "article",
            ogImage: currentPost.featuredImage
        });

        // Add Article Schema for individual blog posts
        addArticleSchema({
            headline: currentPost.title,
            description: currentPost.excerpt || currentPost.description,
            author: currentPost.author || "The Weight RM Team",
            datePublished: currentPost.publishedDate,
            dateModified: currentPost.modifiedDate,
            image: currentPost.featuredImage,
            wordCount: currentPost.wordCount,
            articleSection: "Health & Wellness",
            keywords: currentPost.tags
        });

        // Update breadcrumb for specific post
        addBreadcrumbSchema([
            {
                name: "Home",
                url: "/"
            },
            {
                name: "Blog",
                url: "/blog"
            },
            {
                name: currentPost.title,
                url: currentPost.url
            }
        ]);
    } else {
        // Blog listing page - add Blog schema
        const blogSchema = {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "The Weight RM Health Blog",
            "description": "Expert advice on weight management, fitness, and healthy living",
            "url": "/blog",
            "publisher": {
                "@type": "Organization",
                "name": "The Weight RM"
            },
            "inLanguage": "en-US"
        };

        import('wix-seo-frontend').then(wixSeo => {
            wixSeo.structuredData([blogSchema]);
        });
    }

    // Your existing blog functionality
    loadBlogPosts();
});

// Function to get current blog post data
function getCurrentBlogPost() {
    // This would typically come from your CMS or URL parameters
    // Example implementation:
    /*
    const postId = wixLocation.query.postId;
    if (postId) {
        return wixData.query("BlogPosts")
            .eq("_id", postId)
            .find()
            .then((results) => {
                return results.items[0];
            });
    }
    */
    return null; // Return null for blog listing page
}

// Function to load and display blog posts
function loadBlogPosts() {
    // Your existing blog loading logic
    // Example:
    /*
    wixData.query("BlogPosts")
        .limit(10)
        .descending("publishedDate")
        .find()
        .then((results) => {
            // Display blog posts
            $w("#blogRepeater").data = results.items;
        });
    */
}
