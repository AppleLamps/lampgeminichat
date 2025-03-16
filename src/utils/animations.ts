
/**
 * Animation utilities using intersection observer for scroll-based animations
 */

export function setupScrollAnimations() {
  // Only run in the browser
  if (typeof window === 'undefined') return;

  // Setup the intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Add animation classes when element is in view
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // Use viewport
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );

  // Observe all elements with the animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  return observer;
}

// Animation classes that can be applied
export const ANIMATIONS = {
  FADE_IN: 'animate-fade-in',
  SLIDE_UP: 'animate-slide-up',
  SLIDE_DOWN: 'animate-slide-down',
  SCALE_IN: 'animate-scale-in',
  BLUR_IN: 'animate-blur-in',
};

// Helper function to add animation delay to staggered elements
export function getStaggeredDelay(index: number, baseDelay = 50): string {
  return `${baseDelay * index}ms`;
}
