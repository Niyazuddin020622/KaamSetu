import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Zap } from 'lucide-react';

const FAQS = [
  {
    q: "KaamSetu क्या है और यह कैसे काम करता है?",
    a: "KaamSetu भारत का विश्वसनीय कुशल कारीगर नेटवर्क है। यह होम और बिजनेस ओनर्स को सीधे वेरिफाइड प्लंबर, वेल्डर, इलेक्ट्रीशियन, कारपेंटर, पेंटर और मिस्त्री से जोड़ता है। ग्राहक बिना किसी बिचौलिये के सीधे फोन कॉल या व्हाट्सएप से बात कर सकते हैं।"
  },
  {
    q: "क्या KaamSetu पर बुकिंग करने पर कोई कमीशन या फीस लगती है?",
    a: "बिल्कुल नहीं! KaamSetu 100% 0% कमीशन मॉडल पर काम करता है। कारीगर को कॉल करना और बुक करना बिल्कुल फ्री है। आप काम पूरा होने के बाद तय किए गए रेट के अनुसार सीधे कारीगर को UPI (GooglePay, PhonePe) या कैश में भुगतान करते हैं।"
  },
  {
    q: "कारीगर वेरिफाइड हैं या नहीं, यह कैसे तय होता है?",
    a: "KaamSetu पर लिस्टेड कारीगरों का मोबाइल नंबर, आधार पहचान और उनके पिछले काम का अनुभव वेरिफाई किया जाता है। जिन प्रोफाइल पर 'Verified Pro' ग्रीन बैज लगा है, उनके दस्तावेज और कौशल की जांच की गई होती है।"
  },
  {
    q: "अगर मुझे तुरंत इमरजेंसी में प्लंबर या इलेक्ट्रीशियन चाहिए तो क्या करें?",
    a: "होमपेज पर '🚨 तुरंत इमरजेंसी' का फिल्टर ऑन करें। आपको वो कारीगर सबसे ऊपर दिखेंगे जो 15 से 30 मिनट के अंदर आपके घर पहुंचने के लिए उपलब्ध हैं।"
  },
  {
    q: "कारीगर के रूप में KaamSetu से कैसे जुड़ें?",
    a: "होमपेज या नीचे दिए गए 'कारीगर जुड़ें' (Join as Worker) बटन पर क्लिक करें। अपना नाम, फोन नंबर, ट्रेड (जैसे प्लंबर/वेल्डर), फोटो और रेट दर्ज करें। एडमिन अप्रूवल के बाद आपकी प्रोफाइल तुरंत लाइव हो जाएगी।"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>अक्सर पूछे जाने वाले सवाल (FAQs)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            KaamSetu के बारे में सब कुछ जानें
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ग्राहकों और कारीगरों के प्रमुख सवालों के सीधे व स्पष्ट जवाब
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="card-clean overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-amber-600 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs shrink-0 font-extrabold">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">क्या आपका कोई और सवाल है?</p>
              <p className="text-[11px] text-slate-500">हमारी टीम से सीधे बात करें: +91 8825135461</p>
            </div>
          </div>
          <a
            href="tel:+918825135461"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 shadow-xs"
          >
            हेल्पलाइन कॉल करें
          </a>
        </div>

      </div>
    </section>
  );
}

