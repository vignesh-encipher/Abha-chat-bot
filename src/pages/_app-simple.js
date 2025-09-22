import "../styles/optimized.css";
import { wrapper } from "../store/index";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Simple performance monitoring without web-vitals dependency
if (typeof window !== 'undefined') {
  // Monitor page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
    }
  });

  // Monitor paint metrics
  if ('PerformanceObserver' in window) {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`${entry.name}:`, entry.startTime, 'ms');
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });
  }
}

export default wrapper.withRedux(MyApp);
