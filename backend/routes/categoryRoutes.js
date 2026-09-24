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
  }
];

// GET /api/categories - Get all categories with real-time worker count
router.get('/', async (req, res) => {
  try {
    // Count active workers per category
    const counts = await Worker.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => {
      countMap[c._id] = c.count;
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
