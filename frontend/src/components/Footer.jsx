import React from 'react';
import { Hammer, ShieldCheck, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  const categories = [
    'Plumber', 
    'Welder', 
    'Electrician', 
    'Carpenter', 
    'Painter', 
    'Mason (Mistri)', 
    'AC & Appliance', 
    'Mechanic'
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Hammer className="w-5 h-5 transform -rotate-12" />
              </div>
              <span className="text-xl font-black text-white">KaamSetu</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              भारत का अपना भरोसेमंद कारीगर नेटवर्क। नल, वेल्डिंग, बिजली, लकड़ी और राजमिस्त्री के काम के लिए सीधे लोकल कारीगरों से संपर्क करें।
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% आधार व पुलिस वेरिफाइड कारीगर</span>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">कारीगर सेवाएं (Services)</h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors text-slate-300 font-medium"
                  >
                    {cat} कारीगर खोजें
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Major Cities Covered - Ahmedabad Highlighted */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">शहर (Cities Covered)</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-amber-300 font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Ahmedabad (अहमदाबाद - SG Highway, Maninagar, Satellite)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Delhi NCR (South Delhi, Rohini, Dwarka)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Noida & Greater Noida</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Gurugram, Faridabad, Ghaziabad</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Mumbai, Pune, Bengaluru</span>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">सीधा संपर्क / Direct Support</h4>
            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                किसी भी समस्या या तुरंत कारीगर मंगाने के लिए हमें कॉल करें:
              </p>
              
              {/* Phone */}
              <a 
                href="tel:+918825135461" 
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-sm bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30 transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 8825135461</span>
              </a>

              {/* Email */}
              <a 
                href="mailto:ansariniyazuddin87@gmail.com" 
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-xs bg-sky-500/10 p-2.5 rounded-xl border border-sky-500/30 transition-colors break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>ansariniyazuddin87@gmail.com</span>
              </a>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-semibold text-center">
                ⚡ 24x7 इमरजेंसी सहायता सेवा चालू है
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar with Developer Credit & Portfolio Link */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} KaamSetu. सभी अधिकार सुरक्षित।</p>
          
          {/* Developer Credit */}
          <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Developed by</span>
              <a 
                href="https://nansari06.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 transition-colors"
              >
                <span>Niyazuddin Ansari</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

