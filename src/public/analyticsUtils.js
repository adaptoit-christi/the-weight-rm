// Analytics Utility Functions for The Weight RM
// Enhanced Google Analytics tracking with conversion events

// Track booking interactions
export function trackBookingEvent(eventType, serviceType = '', value = 0) {
    if (window.gtag) {
        window.gtag('event', eventType, {
            event_category: 'Booking',
            event_label: serviceType,
            value: value,
            send_to: 'AW-17246592812'
        });
    }
}

// Track form submissions
export function trackFormSubmission(formType, formName = '') {
    if (window.gtag) {
        window.gtag('event', 'form_submit', {
            event_category: 'Form',
            event_label: formType,
            form_name: formName,
            send_to: 'AW-17246592812'
        });
    }
}

// Track phone number clicks
export function trackPhoneClick() {
    if (window.gtag) {
        window.gtag('event', 'phone_call', {
            event_category: 'Contact',
            event_label: 'Phone Click',
            send_to: 'AW-17246592812'
        });
    }
}

// Track email clicks
export function trackEmailClick() {
    if (window.gtag) {
        window.gtag('event', 'email_click', {
            event_category: 'Contact',
            event_label: 'Email Click',
            send_to: 'AW-17246592812'
        });
    }
}

// Track service interest
export function trackServiceInterest(serviceName) {
    if (window.gtag) {
        window.gtag('event', 'service_interest', {
            event_category: 'Services',
            event_label: serviceName,
            send_to: 'AW-17246592812'
        });
    }
}

// Track membership plan views
export function trackMembershipView(planName) {
    if (window.gtag) {
        window.gtag('event', 'membership_view', {
            event_category: 'Membership',
            event_label: planName,
            send_to: 'AW-17246592812'
        });
    }
}

// Track blog engagement
export function trackBlogEngagement(action, postTitle = '') {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: 'Blog',
            event_label: postTitle,
            send_to: 'AW-17246592812'
        });
    }
}

// Track conversion events (for Google Ads)
export function trackConversion(conversionAction, value = 0) {
    if (window.gtag) {
        window.gtag('event', 'conversion', {
            send_to: 'AW-17246592812/' + conversionAction,
            value: value,
            currency: 'USD'
        });
    }
}

// Track custom events
export function trackCustomEvent(eventName, category, label = '', value = 0) {
    if (window.gtag) {
        window.gtag('event', eventName, {
            event_category: category,
            event_label: label,
            value: value,
            send_to: 'AW-17246592812'
        });
    }
}

// Initialize enhanced ecommerce tracking (for future use)
export function trackPurchase(transactionId, items = [], value = 0) {
    if (window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: 'USD',
            items: items,
            send_to: 'AW-17246592812'
        });
    }
}

// Track scroll depth for engagement
export function initializeScrollTracking() {
    let scrollDepths = [25, 50, 75, 90];
    let trackedDepths = [];
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                trackedDepths.push(depth);
                trackCustomEvent('scroll', 'Engagement', `${depth}%`, depth);
            }
        });
    });
}

// Track time on page
export function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (timeSpent > 10) { // Only track if user spent more than 10 seconds
            trackCustomEvent('time_on_page', 'Engagement', document.title, timeSpent);
        }
    });
}