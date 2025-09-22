import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = ['/next.svg', '/vercel.svg'];
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize font loading
    const optimizeFonts = () => {
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          console.log('Fonts loaded');
        });
      }
    };

    // Reduce layout shift
    const preventLayoutShift = () => {
      // Add dimensions to images to prevent layout shift
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.style.width && !img.style.height) {
          img.style.width = img.width ? `${img.width}px` : 'auto';
          img.style.height = img.height ? `${img.height}px` : 'auto';
        }
      });
    };

    // Run optimizations
    preloadCriticalResources();
    optimizeFonts();
    preventLayoutShift();

    // Monitor LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP Element:', lastEntry.element);
          console.log('LCP Time:', lastEntry.startTime, 'ms');
          
          // Report LCP to analytics if needed
          if (window.gtag) {
            window.gtag('event', 'LCP', {
              event_category: 'Performance',
              value: Math.round(lastEntry.startTime),
            });
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
