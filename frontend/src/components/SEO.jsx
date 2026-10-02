import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "KaamSetu - भारत का भरोसेमंद कारीगर नेटवर्क | Plumber, Welder, Electrician Near You",
  description = "सीधे कॉल करें या व्हाट्सएप करें। प्लंबर, वेल्डर, इलेक्ट्रीशियन, बढ़ई, पेंटर और राजमिस्त्री को 2 मिनट में ढूंढें। 0% कमीशन, डायरेक्ट फोन कॉल।",
  keywords = "plumber, welder, electrician, mistri, carpenter, painter, ahmedabad, delhi ncr, noida, gurugram, worker near me, kaamsetu, karigar, blue collar workers",
  author = "KaamSetu / Niyazuddin Ansari",
  canonicalUrl = "https://kaamsetu06.vercel.app/",
  imageUrl = "https://kaamsetu06.vercel.app/favicon.svg",
  city = null,
  category = null
}) {
  const dynamicTitle = category && city && city !== 'All'
    ? `${category} in ${city} - तुरंत बुक करें | KaamSetu 0% कमीशन`
    : city && city !== 'All'
    ? `Top Verified Workers in ${city} | KaamSetu - प्लंबर, वेल्डर, इलेक्ट्रीशियन`
    : title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{dynamicTitle}</title>
      <meta name="title" content={dynamicTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Hindi, English" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#020617" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={dynamicTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="KaamSetu" />
      <meta property="og:locale" content="hi_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={dynamicTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@kaamsetu" />

      {/* Mobile Performance */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Helmet>
  );
}
