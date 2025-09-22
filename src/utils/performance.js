// Performance monitoring utilities

export const measurePerformance = (name, fn) => {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
  return fn();
};

export const reportWebVitals = (metric) => {
  console.log('Web Vital:', metric);
  
  // Send to analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
  
  // Send to custom analytics endpoint
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // You can send to your analytics service here
    // Example: sendToAnalytics(metric);
  }
};

export const preloadImage = (src) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
};

export const preloadRoute = (href) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
};

// Performance observer for additional metrics
export const observePerformance = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance Entry:', entry);
      }
    });
    
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    
    return observer;
  }
  return null;
};
