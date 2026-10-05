const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

const CATEGORIES_DATA = [
  {
    id: 'plumber',
    name: 'Plumber',
    hindiName: 'प्लंबर (नल व पाइप फिटर)',
    icon: 'Wrench',
    tagline: 'Leakages, bathroom fittings, pipe lines & tank cleaning',
    startingRate: 299,
    popularTasks: ['Tap & Pipe Leakage', 'Bathroom Fitting', 'Water Tank Cleaning', 'Drainage Blockage', 'Motor Installation']
  },
  {
    id: 'welder',
    name: 'Welder',
    hindiName: 'वेल्डर (फैब्रिकेशन व वेल्डिंग)',
    icon: 'Flame',
    tagline: 'Arc, MIG/TIG welding, iron gates, grills, sheds & metal repair',
    startingRate: 399,
    popularTasks: ['Gate & Grill Repair', 'Iron Shed Fabrication', 'Stairs Railing Welding', 'Metal Frame Fixing', 'Heavy Equipment Repair']
  },
  {
    id: 'electrician',
    name: 'Electrician',
    hindiName: 'इलेक्ट्रीशियन (बिजली मिस्त्री)',
    icon: 'Zap',
    tagline: 'Short circuits, wiring, switchboards, MCB, fans & lighting',
    startingRate: 249,
    popularTasks: ['Wiring & Short Circuit', 'Fan & Light Installation', 'MCB Box Setup', 'Inverter Connection', 'Appliance Power Line']
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    hindiName: 'बढ़ई (लकड़ी का काम)',
    icon: 'Hammer',
    tagline: 'Furniture repair, door locks, modular cabinets, shelves & polish',
    startingRate: 349,
    popularTasks: ['Door Lock & Hinges', 'Bed & Cupboard Repair', 'Custom Shelves & Tables', 'Kitchen Cabinet Repair', 'Wood Polish']
  },
  {
    id: 'painter',
    name: 'Painter',
    hindiName: 'पेंटर (रंगाई व पुट्टी)',
    icon: 'Paintbrush',
    tagline: 'Wall painting, waterproofing, putty, texture, stencil & wood coat',
    startingRate: 499,
    popularTasks: ['Full House Painting', 'Waterproof Damp Proofing', 'Wall Texture & Stencil', 'Putty & Primer Finishing', 'Metal & Wood Paint']
  },
  {
    id: 'mason',
    name: 'Mason (Mistri)',
    hindiName: 'राजमिस्त्री (चिनाई व प्लास्टर)',
    icon: 'Boxes',
    tagline: 'Tile fixing, brick work, plastering, floor repairs & renovation',
    startingRate: 599,
    popularTasks: ['Tiles & Marble Fixing', 'Wall Brickwork & Plaster', 'Floor Repair / PCC', 'Bathroom Waterproofing', 'Civil Renovation']
  },
  {
    id: 'ac-appliance',
    name: 'AC & Appliance',
    hindiName: 'एसी व उपकरण रिपेयर',
    icon: 'Cpu',
    tagline: 'AC gas refill, servicing, washing machine, fridge & geyser repair',
    startingRate: 399,
    popularTasks: ['AC Deep Jet Servicing', 'Gas Charging / Leakage', 'Washing Machine Repair', 'Geyser Installation & Fix', 'Refrigerator Repair']
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    hindiName: 'मैकेनिक (ऑटो रिपेयर)',
    icon: 'Car',
    tagline: '2-Wheeler / 4-Wheeler breakdown, puncture, engine tuning & service',
    startingRate: 299,
    popularTasks: ['Breakdown On-Road Assistance', 'Brake & Clutch Repair', 'Oil Change & Tuning', 'Puncture & Tyre Fix', 'Electrical Checkup']
  },
  {
    id: 'cleaner',
    name: 'Cleaner & Housekeeping',
    hindiName: 'सफाई कर्मी',
    icon: 'Sparkles',
    tagline: 'Deep home cleaning, sofa & carpet shampoo, kitchen grease removal',
    startingRate: 299,
    popularTasks: ['Kitchen Deep Cleaning', 'Bathroom Disinfection', 'Sofa & Carpet Wash', 'Full Home Deep Clean', 'Move-in / Move-out Cleaning']
  },
  {
    id: 'helper',
    name: 'General Helper / Labour',
    hindiName: 'हेल्पर व मजदूर',
    icon: 'Users',
    tagline: 'Loading, unloading, construction helper, garden maintenance & shifting',
    startingRate: 350,
    popularTasks: ['Furniture Shifting Helper', 'Loading / Unloading', 'Garden Clearance', 'Debris / Malwa Removal', 'General Household Assistance']
  },
  {
    id: 'cctv-security',
    name: 'CCTV & Security',
    hindiName: 'सीसीटीवी व सुरक्षा (CCTV & Security)',
    icon: 'ShieldCheck',
    tagline: 'CCTV installation, DVR/NVR setup, video doorbell & biometrics',
    startingRate: 349,
    popularTasks: ['CCTV Camera Setup', 'Offline Signal Fix', 'Wi-Fi Video Doorbell', 'Biometric Machine', 'Mobile Live View Setup']
  },
  {
    id: 'gardener',
    name: 'Gardener (Mali)',
    hindiName: 'माली (बागवानी व लॉन केयर)',
    icon: 'Sprout',
    tagline: 'Lawn mowing, hedge trimming, pot planting, fertilizer & drip irrigation',
    startingRate: 299,
    popularTasks: ['Lawn Grass Cutting', 'Plant Pruning & Trimming', 'Potting & Fertilizer', 'Drip Watering Setup', 'Terrace Garden Care']
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    hindiName: 'पेस्ट कंट्रोल (कीट व दीमक नियंत्रण)',
    icon: 'Bug',
    tagline: 'Termite, cockroach, bed bug, rodent treatment & disinfection spray',
    startingRate: 499,
    popularTasks: ['Termite / Deemak Treatment', 'Cockroach Gel Treatment', 'Bed Bugs Removal', 'Rodent / Rat Control', 'Full Home Disinfection']
  },
  {
    id: 'pop-false-ceiling',
    name: 'POP & False Ceiling',
    hindiName: 'पीओपी व फॉल्स सीलिंग',
    icon: 'LayoutGrid',
    tagline: 'Gypsum false ceiling, POP molding, PVC panels & decorative wall panels',
    startingRate: 449,
    popularTasks: ['Gypsum False Ceiling', 'POP Molding & Borders', 'PVC Wall & Ceiling Panels', 'Grid Ceiling Tiles', 'Crack & Ceiling Repair']
  },
  {
    id: 'glass-aluminium',
    name: 'Glass & Aluminium',
    hindiName: 'ग्लास व एल्युमिनियम फैब्रिकेशन',
    icon: 'Maximize2',
    tagline: 'Aluminium sliding windows, toughened glass partitions & mosquito mesh',
    startingRate: 399,
    popularTasks: ['Aluminium Sliding Window', 'Toughened Glass Partition', 'Shower Glass Cubicle', 'Mosquito Net Fitting', 'Balcony Glass Railing']
  },
  {
    id: 'solar-technician',
    name: 'Solar Technician',
    hindiName: 'सोलर पैनल टेक्निशियन',
    icon: 'Sun',
    tagline: 'Rooftop solar installation, inverter wiring, solar plate jet wash & repair',
    startingRate: 499,
    popularTasks: ['Rooftop Solar Installation', 'Solar Inverter Setup', 'Solar Plate Deep Wash', 'Wiring & Fault Repair', 'Solar Water Heater Fix']
  },
  {
    id: 'locksmith',
    name: 'Locksmith (Chabi Wala)',
    hindiName: 'ताला-चाबी कारीगर (Locksmith)',
    icon: 'Key',
    tagline: 'Emergency lockout, duplicate keys, Godrej lock change & smart locks',
    startingRate: 199,
    popularTasks: ['Emergency Lock Opening', 'Duplicate Key Making', 'Godrej Lock Replacement', 'Smart Digital Door Lock', 'Car Key Duplicate']
  },
  {
    id: 'driver',
    name: 'Driver',
    hindiName: 'ड्राइवर (ऑन-डिमांड व पर्सनल)',
    icon: 'Navigation',
    tagline: 'Personal car driver, outstation round-trip, commercial & event driving',
    startingRate: 399,
    popularTasks: ['Personal Car Driver (Hourly)', 'Outstation Round Trip', 'Late Night Emergency Drop', 'Automatic / Luxury Car', 'Wedding / Event Driver']
  }
];

// Helper to canonicalize category names across legacy strings & variations
function normalizeCategory(catStr) {
  if (!catStr) return '';
  const s = String(catStr).toLowerCase().replace(/\s+/g, ' ').trim();
  
  if (s.includes('helper') || s.includes('labour') || s.includes('labor') || s.includes('मजदूर') || s.includes('हेल्पर')) {
    return 'General Helper / Labour';
  }
  if (s.includes('cctv') || s.includes('security')) {
    return 'CCTV & Security';
  }
  if (s.includes('garden') || s.includes('mali') || s.includes('माली')) {
    return 'Gardener (Mali)';
  }
  if (s.includes('pest')) {
    return 'Pest Control';
  }
  if (s.includes('ceiling') || s.includes('pop')) {
    return 'POP & False Ceiling';
  }
  if (s.includes('glass') || s.includes('aluminium') || s.includes('aluminum')) {
    return 'Glass & Aluminium';
  }
  if (s.includes('solar')) {
    return 'Solar Technician';
  }
  if (s.includes('locksmith') || s.includes('chabi') || s.includes('key')) {
    return 'Locksmith (Chabi Wala)';
  }
  if (s.includes('driver') || s.includes('ड्राइवर')) {
    return 'Driver';
  }
  if (s.includes('plumb') || s.includes('प्लंबर')) return 'Plumber';
  if (s.includes('weld') || s.includes('वेल्डर')) return 'Welder';
  if (s.includes('electr') || s.includes('बिजली')) return 'Electrician';
  if (s.includes('carpent') || s.includes('बढ़ई')) return 'Carpenter';
  if (s.includes('paint') || s.includes('पेंटर')) return 'Painter';
  if (s.includes('mason') || s.includes('mistri') || s.includes('मिस्त्री')) return 'Mason (Mistri)';
  if (s.includes('ac') || s.includes('appliance')) return 'AC & Appliance';
  if (s.includes('mechanic') || s.includes('मैकेनिक')) return 'Mechanic';
  if (s.includes('clean') || s.includes('housekeep') || s.includes('सफाई')) return 'Cleaner & Housekeeping';

  const found = CATEGORIES_DATA.find(c => c.name.toLowerCase() === s || c.id === s);
  return found ? found.name : catStr;
}

// GET /api/categories - Get all categories with real-time worker count
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const match = {};
    if (city && city !== 'All') {
      match.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // Fetch all workers matching city without discarding isAvailable: false
    const workers = await Worker.find(match, 'category isAvailable city').lean();

    const countMap = {};
    workers.forEach(w => {
      const canonical = normalizeCategory(w.category);
      countMap[canonical] = (countMap[canonical] || 0) + 1;
    });

    const enrichedCategories = CATEGORIES_DATA.map(cat => ({
      ...cat,
      activeWorkers: countMap[cat.name] || 0
    }));

    res.json({
      success: true,
      data: enrichedCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
});

module.exports = router;
