import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "KaamSetu - भारत का भरोसेमंद कारीगर नेटवर्क | Plumber, Welder, Electrician Near You",
  description = "सीधे कॉल करें या व्हाट्सएप करें। प्लंबर, वेल्डर, इलेक्ट्रीशियन, बढ़ई, पेंटर और राजमिस्त्री को 2 मिनट में ढूंढें। 0% कमीशन, डायरेक्ट फोन कॉल।",
  keywords = "plumber near me, welder near me, electrician near me, mistri, carpenter, painter, ahmedabad plumber, delhi electrician, kaamsetu, karigar",
  author = "KaamSetu Network",
  canonicalUrl = "https://kaamsetu06.vercel.app/",
  imageUrl = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&auto=format&fit=crop&q=80",
  city = null,
  category = null,
  faqs = null
}) {
  const dynamicTitle = category && city && city !== 'All'
    ? `${category} in ${city} - सीधे कॉल करें | KaamSetu 0% कमीशन`
    : city && city !== 'All'
    ? `Top Verified Workers in ${city} | KaamSetu - प्लंबर, वेल्डर, इलेक्ट्रीशियन`
    : category && category !== 'All'
    ? `Verified ${category} Near You | KaamSetu 0% Commission`
    : title;

  const dynamicDescription = category && city && city !== 'All'
    ? `${city} में भरोसेमंद ${category} खोजें। 0% कमीशन, सीधे फोन कॉल व व्हाट्सएप सुविधा। त्वरित सेवा व उचित रेट।`
    : city && city !== 'All'
    ? `${city} में वेरिफाइड प्लंबर, वेल्डर, इलेक्ट्रीशियन, बढ़ई व पेंटर से डायरेक्ट संपर्क करें। 0% कमीशन।`
    : description;

  // Default AEO FAQs for AI Answer Engines (Perplexity, ChatGPT, Google AI Overviews)
  const defaultFaqs = [
    {
      q: "KaamSetu क्या है?",
      a: "KaamSetu भारत का एक ओपन, 0% कमीशन कुशल कारीगर (ब्लू-कॉलर) नेटवर्क है जो ग्राहकों को सीधे प्लंबर, वेल्डर, इलेक्ट्रीशियन, कारपेंटर और मिस्त्री से जोड़ता है।"
    },
    {
      q: "KaamSetu पर कारीगर को सीधे कॉल कैसे करें?",
      a: "KaamSetu पर अपनी लोकेशन या कैटेगरी चुनें, कारीगर के कार्ड पर दिए गए 'कॉल करें' या 'व्हाट्सएप' बटन पर क्लिक करके सीधे बात करें।"
    },
    {
      q: "क्या KaamSetu पर बुकिंग या कॉल करने का कोई चार्ज लगता है?",
      a: "नहीं, KaamSetu ग्राहकों और कारीगरों दोनों के लिए 0% कमीशन प्लेटफॉर्म है। आप कारीगर को उसके काम के बाद सीधे भुगतान करते हैं।"
    }
  ];

  const activeFaqs = faqs || defaultFaqs;

  // JSON-LD Schema Construction
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://kaamsetu06.vercel.app/#website",
        "url": "https://kaamsetu06.vercel.app/",
        "name": "KaamSetu",
        "description": "भारत का भरोसेमंद कारीगर नेटवर्क"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://kaamsetu06.vercel.app/"
          },
          ...(city && city !== 'All' ? [{
            "@type": "ListItem",
            "position": 2,
            "name": city,
            "item": `https://kaamsetu06.vercel.app/city/${encodeURIComponent(city)}`
          }] : []),
          ...(category && category !== 'All' ? [{
            "@type": "ListItem",
            "position": city && city !== 'All' ? 3 : 2,
            "name": category,
            "item": `https://kaamsetu06.vercel.app/services/${encodeURIComponent(category)}`
          }] : [])
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": activeFaqs.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{dynamicTitle}</title>
      <meta name="title" content={dynamicTitle} />
      <meta name="description" content={dynamicDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Hindi, English" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={dynamicTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="KaamSetu" />
      <meta property="og:locale" content="hi_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={dynamicTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Schema for SEO, AEO & GEO */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
