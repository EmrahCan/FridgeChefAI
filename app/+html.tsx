import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

export default function Root({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FridgeChef AI",
    "operatingSystem": "iOS, Android, Web",
    "applicationCategory": "FoodAndDrinkApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Buzdolabındaki kalan yemekleri ve sebzeleri yapay zekayla (Google Cloud Vision) analiz edip 15 dakikada sıfır israf gurme tarifler üreten akıllı mutfak asistanı.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* PRIMARY SEO META TAGS */}
        <title>FridgeChef AI — Buzdolabındaki Kalanları Gurme Lezzetlere Dönüştürün</title>
        <meta
          name="title"
          content="FridgeChef AI — Buzdolabındaki Kalanları Gurme Lezzetlere Dönüştürün"
        />
        <meta
          name="description"
          content="Buzdolabınızı fotoğraflayın, Google Cloud Vision yapay zekasıyla 10 saniyede sıfır israf gurme tarifler üretin. Sesli şef asistanı ve dolap tazelik radarı ile ev ekonominizi koruyun."
        />
        <meta
          name="keywords"
          content="sıfır israf, buzdolabı yapay zeka, yemek tarifleri, kalan yemekleri değerlendirme, akıllı mutfak asistanı, döngüsel gastronomi, zero waste ai, google cloud vision recipe"
        />
        <meta name="author" content="FridgeChef AI" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#041F1A" />

        {/* OPEN GRAPH / FACEBOOK / WHATSAPP / LINKEDIN */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fridgechef.ai/" />
        <meta
          property="og:title"
          content="FridgeChef AI — Akıllı Sıfır İsraf Gastronomi Asistanı"
        />
        <meta
          property="og:description"
          content="Buzdolabındaki kalanları yapay zekayla gurme lezzetlere dönüştürün. 10 saniyede şef kalitesinde sıfır israf menüler."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80"
        />

        {/* TWITTER / X CARDS */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fridgechef.ai/" />
        <meta
          property="twitter:title"
          content="FridgeChef AI — Sıfır İsraf Yapay Zeka Mutfak Asistanı"
        />
        <meta
          property="twitter:description"
          content="Buzdolabını fotoğrafla, yapay zekayla 10 saniyede gurme sıfır israf tarifler üret."
        />
        <meta
          property="twitter:image"
          content="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80"
        />

        {/* SCHEMA.ORG STRUCTURED JSON-LD DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #041F1A;
}
`;
