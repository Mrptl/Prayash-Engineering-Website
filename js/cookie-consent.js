/**
 * Cookie Consent Manager — Prayash Engineering
 * GDPR & Norwegian E-Commerce Act Compliance
 * Self-injecting: automatically creates banner HTML if not present in DOM.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'prayash_cookie_consent';
    var BANNER_ID   = 'cookieConsentBanner';

    function getConsent() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function setConsent(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    }

    function hideBanner() {
        var banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(function () { banner.style.display = 'none'; }, 500);
        }
    }

    function showBanner() {
        var banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.style.display = 'flex';
            // Defer to allow CSS transition
            setTimeout(function () { banner.classList.add('visible'); }, 50);
        }
    }

    /**
     * Injects the banner HTML into the page if it doesn't already exist.
     * This allows any page to simply include this script without duplicating markup.
     */
    function injectBannerIfMissing() {
        if (document.getElementById(BANNER_ID)) return; // Already in DOM

        var banner = document.createElement('div');
        banner.className  = 'cookie-consent';
        banner.id         = BANNER_ID;
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie Consent');
        banner.style.display = 'none';
        banner.innerHTML = [
            '<p>',
            '  We use cookies to enhance your experience and analyse site traffic.',
            '  By clicking <strong>Accept All</strong>, you consent to our use of cookies in accordance with our',
            '  <a href="privacy-policy.html">Privacy Policy</a> (GDPR &amp; Norwegian E-Commerce Act compliant).',
            '</p>',
            '<div class="cookie-consent-btns">',
            '  <button class="btn btn-cookie-essential" data-cookie-accept="essential">Essential Only</button>',
            '  <button class="btn btn-cookie-accept" data-cookie-accept="all">Accept All</button>',
            '</div>'
        ].join('');

        document.body.appendChild(banner);
    }

    function initConsent() {
        // Inject banner HTML if not already present
        injectBannerIfMissing();

        var existing = getConsent();
        if (existing) return; // Already consented — don't show banner

        var banner = document.getElementById(BANNER_ID);
        if (!banner) return;

        // Accept All button
        var btnAccept = banner.querySelector('[data-cookie-accept="all"]');
        if (btnAccept) {
            btnAccept.addEventListener('click', function () {
                setConsent('all');
                hideBanner();
                // Fire GA4 consent granted event if dataLayer exists
                if (window.dataLayer) {
                    window.dataLayer.push({ event: 'cookie_consent_granted', consent_type: 'all' });
                }
            });
        }

        // Essential Only button
        var btnEssential = banner.querySelector('[data-cookie-accept="essential"]');
        if (btnEssential) {
            btnEssential.addEventListener('click', function () {
                setConsent('essential');
                hideBanner();
                if (window.dataLayer) {
                    window.dataLayer.push({ event: 'cookie_consent_granted', consent_type: 'essential' });
                }
            });
        }

        showBanner();
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConsent);
    } else {
        initConsent();
    }
})();
