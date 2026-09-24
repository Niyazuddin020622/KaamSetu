import React from 'react';
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
  Layers 
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
  'General Helper / Labour': 'मजदूर / हेल्पर'
};

export default function CategoryChips({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  totalWorkers = 0 
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>कारीगर चुनें</span>
            <span className="text-xs sm:text-sm font-semibold text-amber-400">(Choose Trade)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            अपनी पसंद के काम पर क्लिक करें और पास के कारीगर देखें
          </p>
        </div>
      </div>

      {/* Horizontally scrollable category pills with touch momentum */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {/* 'All' Category Chip */}
        <button
          onClick={() => onSelectCategory('All')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
            selectedCategory === 'All'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
              : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>सभी कारीगर (All)</span>
          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-black ${
            selectedCategory === 'All' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
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
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{hindiLabel} ({cat.name})</span>
              {cat.activeWorkers !== undefined && (
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-black ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
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
