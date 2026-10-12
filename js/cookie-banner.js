/**
 * Ireneo Kunda Complex - Cookie Consent Banner
 * Minimal CMP for GDPR / AdSense policy compliance.
 * Shows banner on first visit. Records accept/reject in localStorage.
 * Links to the Privacy Policy. Pure vanilla JS, no dependencies.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'ikc_cookie_consent';
    var banner = null;

    function getExistingChoice() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function recordChoice(choice) {
        try {
            localStorage.setItem(STORAGE_KEY, choice);
        } catch (e) {
            /* localStorage unavailable - ignore silently */
        }
    }

    function dismiss() {
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
            // Remove from DOM after the fade-out transition
            window.setTimeout(function () {
                if (banner && banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                    banner = null;
                }
            }, 350);
        }
    }

    function buildBanner() {
        // Don't run if browser is too old
        if (!document.body || !document.body.appendChild) return;

        banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookie consent');

        banner.innerHTML =
            '<div class="cookie-banner-inner">' +
                '<div class="cookie-banner-text">' +
                    '<p><strong>We use cookies.</strong> This site uses cookies and similar ' +
                    'technologies, including third-party cookies from Google AdSense, to operate, analyze ' +
                    'traffic, and personalize content. By clicking <em>Accept</em>, you consent to our use ' +
                    'of cookies. You can manage your preferences anytime in our ' +
                    '<a href="privacy-policy.html">Privacy Policy</a>.</p>' +
                '</div>' +
                '<div class="cookie-banner-actions">' +
                    '<button type="button" class="cookie-btn cookie-btn-secondary" data-cookie-action="reject">Reject</button>' +
                    '<button type="button" class="cookie-btn cookie-btn-primary" data-cookie-action="accept">Accept</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        // Trigger slide-up animation after mount
        window.setTimeout(function () {
            if (banner) banner.classList.add('cookie-banner-visible');
        }, 50);

        // Wire up the buttons with event delegation
        banner.addEventListener('click', function (event) {
            var target = event.target;
            if (target && target.getAttribute('data-cookie-action')) {
                var action = target.getAttribute('data-cookie-action');
                if (action === 'accept' || action === 'reject') {
                    recordChoice(action);
                    dismiss();
                }
            }
        });
    }

    function init() {
        var existing = getExistingChoice();
        if (existing === 'accept' || existing === 'reject') {
            // User has already made a choice - do nothing
            return;
        }
        buildBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
