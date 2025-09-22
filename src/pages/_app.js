import "../styles/optimized.css";
import { wrapper } from "../store/index";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Simple performance monitoring without web-vitals dependency
if (typeof window !== 'undefined') {
  // Monitor LCP specifically
  let lcpValue = 0;
  
  // Use PerformanceObserver for LCP
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.startTime;
        console.log('LCP detected:', lcpValue, 'ms');
        
        // Report if LCP is too high
        if (lcpValue > 2500) {
          console.warn('LCP is too high:', lcpValue, 'ms (should be < 2500ms)');
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }
  }
  
  // Monitor page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
    }
  });
}

export default wrapper.withRedux(MyApp);
