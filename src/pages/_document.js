import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
        
        {/* Optimized font loading with preconnect and display swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Load only necessary font weights */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/next.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/vercel.svg" as="image" type="image/svg+xml" />
        
        {/* Inline critical CSS to reduce render delay */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            * { box-sizing: border-box; padding: 0; margin: 0; }
            html, body { max-width: 100vw; overflow-x: hidden; font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; }
            body { color: rgb(0, 0, 0); background: linear-gradient(to bottom, transparent, rgb(255, 255, 255)) rgb(214, 219, 220); }
            .main { display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 6rem; min-height: 100vh; }
            .description { display: flex; justify-content: inherit; align-items: inherit; font-size: 0.85rem; max-width: 1100px; width: 100%; z-index: 2; font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace; }
            .description p { position: relative; margin: 0; padding: 1rem; background-color: rgba(238, 240, 241, 0.5); border: 1px solid rgba(172, 175, 176, 0.3); border-radius: 12px; }
            .code { font-weight: 700; font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace; }
            .center { display: flex; justify-content: center; align-items: center; position: relative; padding: 4rem 0; }
            .logo { position: relative; }
            .grid { display: grid; grid-template-columns: repeat(4, minmax(25%, auto)); width: 1100px; max-width: 100%; }
            .card { padding: 1rem 1.2rem; border-radius: 12px; background: rgba(180, 185, 188, 0); border: 1px solid rgba(131, 134, 135, 0); transition: background 200ms, border 200ms; }
            .card span { display: inline-block; transition: transform 200ms; }
            .card h2 { font-weight: 600; margin-bottom: 0.7rem; }
            .card p { margin: 0; opacity: 0.6; font-size: 0.9rem; line-height: 1.5; max-width: 30ch; }
            @media (max-width: 700px) { .main { padding: 4rem 1rem; } .grid { grid-template-columns: 1fr; margin-bottom: 120px; max-width: 320px; text-align: center; } .card { padding: 1rem 2.5rem; } .card h2 { margin-bottom: 0.5rem; } }
            @media (prefers-color-scheme: dark) { body { color: rgb(255, 255, 255); background: linear-gradient(to bottom, transparent, rgb(0, 0, 0)) rgb(0, 0, 0); } }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
