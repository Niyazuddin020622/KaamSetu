import React, { useRef } from 'react';
import { 
  Wrench, 
  Flame, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Boxes, 
  Cpu, 
  Car, 
  Sparkles, 
  Users, 
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sprout,
  Bug,
  LayoutGrid,
  Maximize2,
  Sun,
  Key,
  Navigation
} from 'lucide-react';

const ICON_MAP = {
  'Wrench': Wrench,
  'Flame': Flame,
  'Zap': Zap,
  'Hammer': Hammer,
  'Paintbrush': Paintbrush,
  'Boxes': Boxes,
  'Cpu': Cpu,
  'Car': Car,
  'Sparkles': Sparkles,
  'Users': Users,
  'ShieldCheck': ShieldCheck,
  'Sprout': Sprout,
  'Bug': Bug,
  'LayoutGrid': LayoutGrid,
  'Maximize2': Maximize2,
  'Sun': Sun,
  'Key': Key,
  'Navigation': Navigation,
  'Default': Layers
};

const HINDI_MAP = {
  'Plumber': 'प्लंबर',
  'Welder': 'वेल्डर',
  'Electrician': 'इलेक्ट्रीशियन',
  'Carpenter': 'बढ़ई',
  'Painter': 'पेंटर',
  'Mason (Mistri)': 'राजमिस्त्री',
  'AC & Appliance': 'एसी रिपेयर',
  'Mechanic': 'मैकेनिक',
  'Cleaner & Housekeeping': 'सफाई कर्मी',
  'General Helper / Labour': 'मजदूर / हेल्पर',
  'CCTV & Security': 'सीसीटीवी व सुरक्षा',
  'Gardener (Mali)': 'माली / बागवानी',
  'Pest Control': 'पेस्ट कंट्रोल',
  'POP & False Ceiling': 'पीओपी / सीलिंग',
  'Glass & Aluminium': 'ग्लास व एल्युमिनियम',
  'Solar Technician': 'सोलर पैनल',
  'Locksmith (Chabi Wala)': 'ताला-चाबी',
  'Driver': 'ड्राइवर'
};

export default function CategoryChips({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  totalWorkers = 0 
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-2 sm:py-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div>
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
            <span>कारीगर चुनें</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">(Choose Trade)</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            अपनी पसंद के काम पर क्लिक करें और पास के कारीगर देखें
          </p>
        </div>

        {/* Scroll Arrows on Tablet & Desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-xs active:scale-95"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-xs active:scale-95"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable category pills with touch momentum */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* 'All' Category Chip */}
        <button
          onClick={() => onSelectCategory('All')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
            selectedCategory === 'All'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>सभी (All)</span>
          <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold ${
            selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {totalWorkers}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || ICON_MAP['Default'];
          const isSelected = selectedCategory === cat.name;
          const hindiLabel = HINDI_MAP[cat.name] || cat.hindiName || cat.name;

          return (
            <button
              key={cat.id || cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>{hindiLabel} ({cat.name})</span>
              {cat.activeWorkers !== undefined && (
                <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.activeWorkers}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
