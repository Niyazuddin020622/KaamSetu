import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "KaamSetu - भारत का भरोसेमंद कारीगर नेटवर्क | Plumber, Welder, Electrician Near You",
  description = "सीधे कॉल करें या व्हाट्सएप करें। प्लंबर, वेल्डर, इलेक्ट्रीशियन, बढ़ई, पेंटर और राजमिस्त्री को 2 मिनट में ढूंढें। Zero commission, direct phone calling.",
  keywords = "plumber, welder, electrician, mistri, carpenter, painter, ahmedabad, delhi ncr, noida, gurugram, worker near me, kaamsetu, karigar",
  author = "Niyazuddin Ansari",
  canonicalUrl = "https://kaamsetu.in"
}) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Hindi, English" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#020617" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="KaamSetu" />
      <meta property="og:locale" content="hi_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@nansari06" />

      {/* Security & Mobile Performance */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Helmet>
  );
}
