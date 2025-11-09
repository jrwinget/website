/**
 * UI Enhancements for The Friction Point blog
 * Adds modern UX features: reading progress, back-to-top, lazy loading
 */

(function() {
  'use strict';

  // ============================================
  // Reading Progress Indicator
  // ============================================
  function initReadingProgress() {
    // Only show on blog posts (pages with articles)
    const article = document.querySelector('article, main');
    if (!article) return;

    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Reading progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    document.body.prepend(progressBar);

    // Update progress on scroll
    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      progressBar.style.transform = `scaleX(${progress / 100})`;
      progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial update
    updateProgress();
  }

  // ============================================
  // Back to Top Button
  // ============================================
  function initBackToTop() {
    // Create button element
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('title', 'Back to top');
    document.body.appendChild(button);

    // Show/hide button based on scroll position
    function toggleButton() {
      if (window.scrollY > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }

    // Scroll to top on click
    button.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/hide on scroll (throttled)
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          toggleButton();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    toggleButton();
  }

  // ============================================
  // Lazy Loading Images
  // ============================================
  function initLazyLoading() {
    // Add loading="lazy" to all images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });

    // Add loaded class when image finishes loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            if (img.complete) {
              img.classList.add('loaded');
            } else {
              img.addEventListener('load', () => {
                img.classList.add('loaded');
              });
            }

            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
      });
    }
  }

  // ============================================
  // External Link Indicators
  // ============================================
  function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    const currentDomain = window.location.hostname;

    links.forEach(link => {
      const linkDomain = new URL(link.href).hostname;

      // Check if link is external
      if (linkDomain !== currentDomain) {
        // Add external link indicator
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        // Add screen reader text
        const srText = document.createElement('span');
        srText.className = 'visually-hidden';
        srText.textContent = ' (opens in new tab)';
        link.appendChild(srText);
      }
    });
  }

  // ============================================
  // Enhanced Focus Indicators
  // ============================================
  function initFocusEnhancements() {
    // Add keyboard navigation class to body when tab is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    // Remove class on mouse click
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });
  }

  // ============================================
  // Form Submission Handling
  // ============================================
  function initFormEnhancements() {
    const forms = document.querySelectorAll('form[netlify]');

    forms.forEach(form => {
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      form.addEventListener('submit', function() {
        button.disabled = true;
        button.innerHTML = 'Subscribing...';
      });
    });
  }

  // ============================================
  // Initialize All Features
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize features
    initReadingProgress();
    initBackToTop();
    initLazyLoading();
    initExternalLinks();
    initFocusEnhancements();
    initFormEnhancements();
  }

  // Start initialization
  init();
})();
