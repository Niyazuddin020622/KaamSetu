import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  PhoneCall, 
  ThumbsUp, 
  Users, 
  Zap,
  Phone
} from 'lucide-react';

export default function TrustSection({ onSelectCategory, onOpenRegister }) {
  const steps = [
    {
      num: '01',
      title: 'काम का प्रकार चुनें',
      subtitle: 'Choose Trade Category',
      desc: 'प्लंबर, वेल्डर, इलेक्ट्रीशियन, बढ़ई, पेंटर या राजमिस्त्री में से अपनी जरूरत के अनुसार कारीगर चुनें।',
      icon: Search,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400'
    },
    {
      num: '02',
      title: 'रेट और फोटो देखें',
      subtitle: 'Compare Rates & Ratings',
      desc: 'कारीगर का प्रति घंटे का रेट, अनुभव, ग्राहकों की रेटिंग और पिछले काम की जानकारी देखें।',
      icon: ThumbsUp,
      color: 'from-sky-500/20 to-blue-500/20 text-sky-400'
    },
    {
      num: '03',
      title: 'सीधे फोन या व्हाट्सएप करें',
      subtitle: 'Direct Call or Book in 1-Click',
      desc: 'बिना किसी बिचौलिये या कमीशन के कारीगर के मोबाइल पर सीधे बात करें या अपनी सुविधा अनुसार बुक करें।',
      icon: PhoneCall,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400'
    }
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/25 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>सरल, सुरक्षित और सीधा संपर्क</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            यह कैसे काम करता है?
            <span className="text-slate-400 text-sm sm:text-lg font-bold block mt-1">
              (How KaamSetu Works for Everyone)
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            कोई दलाली नहीं, कोई कमीशन नहीं। मेहनत का पूरा पैसा कारीगर को, सही काम ग्राहक को।
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} border border-white/5 flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-slate-700 group-hover:text-amber-400/50 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white mb-0.5">
                  {step.title}
                </h3>
                <span className="text-xs font-bold text-amber-400 block mb-2">
                  {step.subtitle}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Join as Worker Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-600/10 border border-amber-500/30 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 text-center md:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-400/20 text-amber-300">
              <Users className="w-3.5 h-3.5" />
              <span>कारीगर भाइयों के लिए (For Tradesmen)</span>
            </div>
            <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-white">
              क्या आप प्लंबर, वेल्डर या मिस्त्री हैं? KaamSetu से जुड़ें
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              अपने नजदीकी इलाके से सीधे काम के फोन पाएं। आपकी मेहनत की 100% कमाई आपकी। कोई कमीशन नहीं।
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 shrink-0 text-center"
          >
            कारीगर बनें (Join as Worker)
          </button>
        </div>

      </div>
    </section>
  );
}
