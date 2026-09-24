const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Worker = require('./models/Worker');
const Booking = require('./models/Booking');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/worker_finder_db';

const sampleWorkers = [
  {
    name: 'Rajesh Kumar Mistri',
    phone: '+91 98765 43210',
    email: 'rajesh.plumber@kaamsetu.in',
    category: 'Plumber',
    subSkills: ['Pipe Fitting', 'Bathroom Sanitary', 'Overhead Tank Cleaning', 'Water Motor Pump Fix', 'Leakage Detection'],
    experienceYears: 8,
    hourlyRate: 349,
    dailyRate: 1800,
    city: 'New Delhi',
    area: 'Lajpat Nagar / South Ext',
    pincode: '110024',
    bio: '8+ years of dedicated plumbing expertise. Fast response for tap leakages, concealed pipe repairs, geyser installation, and booster pumps. Always carry standard spare parts and tools.',
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Master Plumber',
    rating: 4.9,
    reviewCount: 47,
    completedJobs: 132,
    languages: ['Hindi', 'Punjabi', 'Basic English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Aakash Verma',
        rating: 5,
        comment: 'Rajesh ji arrived within 30 minutes! Fixed our emergency kitchen sink overflow very cleanly. Reasonable charges.',
        date: new Date('2026-03-10')
      },
      {
        customerName: 'Pooja Mehra',
        rating: 5,
        comment: 'Very polite and knowledgeable. Installed complete bathroom fittings and shower mixer flawlessly.',
        date: new Date('2026-02-18')
      }
    ]
  },
  {
    name: 'Amit Sharma',
    phone: '+91 98112 87654',
    email: 'amit.welder@kaamsetu.in',
    category: 'Welder',
    subSkills: ['Arc Welding', 'MIG / TIG Welding', 'Main Gate Fabrication', 'Iron Grill Repair', 'Tin Shed Construction', 'Stainless Steel Railings'],
    experienceYears: 10,
    hourlyRate: 499,
    dailyRate: 2400,
    city: 'New Delhi',
    area: 'Rohini & Pitampura',
    pincode: '110085',
    bio: 'Certified industrial welder with 10 years experience. Specialize in custom iron gates, safety window grills, staircase railings, and heavy shed fabrication. Bring our own portable welding machine and safety gear.',
    avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Certified Welder',
    rating: 4.9,
    reviewCount: 38,
    completedJobs: 98,
    languages: ['Hindi', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Sunil Gupta',
        rating: 5,
        comment: 'Replaced broken hinges on our heavy main gate and welded extra security bars. Strong weld finish with anti-rust coat.',
        date: new Date('2026-03-01')
      },
      {
        customerName: 'Vikas Malhotra',
        rating: 5,
        comment: 'Brought portable welding machine on scooter and finished balcony grill modification in 2 hours. Top notch!',
        date: new Date('2026-02-11')
      }
    ]
  },
  {
    name: 'Mohammad Farooq',
    phone: '+91 97180 54321',
    email: 'farooq.welding@kaamsetu.in',
    category: 'Welder',
    subSkills: ['Iron Gate Repair', 'Rooftop Tin Shed', 'Heavy Structural Welding', 'Metal Shutter Fix', 'Gas Cutting'],
    experienceYears: 12,
    hourlyRate: 449,
    dailyRate: 2200,
    city: 'Noida',
    area: 'Sector 62 / Indirapuram',
    pincode: '201309',
    bio: 'Expert in residential and commercial iron fabrication. Shutter repairs, gate hinges reinforcement, rooftop solar frame welding, and window guards. Honest rates and guaranteed strong weld.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Fabrication Expert',
    rating: 4.8,
    reviewCount: 29,
    completedJobs: 84,
    languages: ['Hindi', 'Urdu'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Deepak Tyagi',
        rating: 5,
        comment: 'Fixed our shop roller shutter that was stuck and welded a new padlock plate. Saved us from huge replacement cost.',
        date: new Date('2026-02-24')
      }
    ]
  },
  {
    name: 'Suresh Patel',
    phone: '+91 99234 11223',
    email: 'suresh.electric@kaamsetu.in',
    category: 'Electrician',
    subSkills: ['Short Circuit Troubleshooting', 'MCB & Distribution Box', 'House Wiring', 'Ceiling Fan & Chandelier', 'Inverter Setup'],
    experienceYears: 7,
    hourlyRate: 299,
    dailyRate: 1600,
    city: 'New Delhi',
    area: 'Dwarka / Janakpuri',
    pincode: '110075',
    bio: 'Government-certified wireman. Specialised in emergency power outage troubleshooting, load balancing, smart home switches, inverter/UPS installation, and concealed lighting.',
    avatar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Govt Certified',
    rating: 4.9,
    reviewCount: 64,
    completedJobs: 178,
    languages: ['Hindi', 'Gujarati', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Dr. Neha Kapoor',
        rating: 5,
        comment: 'Found the tripping fault that 2 other electricians failed to identify. Very thorough and safety-conscious.',
        date: new Date('2026-03-14')
      }
    ]
  },
  {
    name: 'Dinesh Vishwakarma',
    phone: '+91 98450 67890',
    email: 'dinesh.carpenter@kaamsetu.in',
    category: 'Carpenter',
    subSkills: ['Modular Kitchen Cabinets', 'Godrej Lock Repair', 'Door & Window Frame', 'Bed & Wardrobe Assembly', 'Wood Polish & Varnishing'],
    experienceYears: 14,
    hourlyRate: 399,
    dailyRate: 2200,
    city: 'Gurugram',
    area: 'DLF Phase 3 / Cyber City',
    pincode: '122002',
    bio: 'Master carpenter from traditional artisan family. Handle everything from luxury wooden furniture repair, hydraulic bed fittings, door alignment, to premium PU polishing.',
    avatar: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Master Artisan',
    rating: 5.0,
    reviewCount: 52,
    completedJobs: 140,
    languages: ['Hindi', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Rohan Singhania',
        rating: 5,
        comment: 'Superb precision work on our sliding wardrobe doors. Smooth as butter now. Highly recommend Dinesh ji!',
        date: new Date('2026-03-05')
      }
    ]
  },
  {
    name: 'Babu Lal Painter',
    phone: '+91 97890 12345',
    email: 'babulal.paints@kaamsetu.in',
    category: 'Painter',
    subSkills: ['Interior Emulsion', 'Exterior Weatherproof Paint', 'Putty Smoothing', 'Wall Dampness Waterproofing', 'Stencil & Texture Design'],
    experienceYears: 9,
    hourlyRate: 320,
    dailyRate: 1500,
    city: 'New Delhi',
    area: 'Saket & Malviya Nagar',
    pincode: '110017',
    bio: 'Professional painting contractor with dedicated team. Clean work with floor plastic masking, no paint drip messes. Specialize in dampness sealing and modern Royale finishes.',
    avatar: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Top Rated',
    rating: 4.8,
    reviewCount: 41,
    completedJobs: 110,
    languages: ['Hindi', 'Bhojpuri'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Kavita Chawla',
        rating: 5,
        comment: 'Finished our 3BHK accent walls in record time with immaculate neatness. Cleared all tape and sheets before leaving.',
        date: new Date('2026-02-28')
      }
    ]
  },
  {
    name: 'Ramphal Mistri',
    phone: '+91 96540 88990',
    email: 'ramphal.mason@kaamsetu.in',
    category: 'Mason (Mistri)',
    subSkills: ['Tile & Granite Laying', 'Brick Wall Construction', 'Plaster & Cement Work', 'Bathroom Waterproofing', 'Civil Demolition & Repair'],
    experienceYears: 16,
    hourlyRate: 450,
    dailyRate: 2000,
    city: 'New Delhi',
    area: 'Karol Bagh & Patel Nagar',
    pincode: '110005',
    bio: 'Senior mason with 16 years civil construction and home remodeling experience. Perfection in floor tile alignment, slope setting for water drain, and crack repairs.',
    avatar: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Civil Veteran',
    rating: 4.8,
    reviewCount: 35,
    completedJobs: 165,
    languages: ['Hindi'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Harish Bansal',
        rating: 5,
        comment: 'Fixed our balcony tile slope so rainwater no longer collects. Very hardworking and honest mistri.',
        date: new Date('2026-02-15')
      }
    ]
  },
  {
    name: 'Wasim Akram',
    phone: '+91 98991 76543',
    email: 'wasim.acrepair@kaamsetu.in',
    category: 'AC & Appliance',
    subSkills: ['Split AC Jet Service', 'Gas Leakage & Refill', 'Compressor Replacement', 'Washing Machine PCB Fix', 'Geyser Coil Repair'],
    experienceYears: 6,
    hourlyRate: 399,
    dailyRate: 2100,
    city: 'Noida',
    area: 'Sector 50 / 76',
    pincode: '201301',
    bio: 'HVAC technician specializing in Daikin, Voltas, LG, and Blue Star AC systems. Foam jet cleaning, original refrigerant charging (R32 / R410), and circuit board diagnosis.',
    avatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'HVAC Certified',
    rating: 4.9,
    reviewCount: 73,
    completedJobs: 210,
    languages: ['Hindi', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Anand Shrivastav',
        rating: 5,
        comment: 'Jet pump wash made the AC cooling like brand new. Checked pressure with digital gauge right in front of me.',
        date: new Date('2026-03-12')
      }
    ]
  },
  {
    name: 'Santosh Rawat',
    phone: '+91 95400 33445',
    email: 'santosh.mechanic@kaamsetu.in',
    category: 'Mechanic',
    subSkills: ['Doorstep Bike Servicing', 'Car Battery Jumpstart', 'Puncture Repair (Tubeless)', 'Brake Pad Replacement', 'Oil & Filter Change'],
    experienceYears: 7,
    hourlyRate: 349,
    dailyRate: 1700,
    city: 'Gurugram',
    area: 'Sohna Road / Sector 49',
    pincode: '122018',
    bio: 'Mobile mechanic on wheels with complete emergency tool kit and jumpstart cables. Quick roadside assistance and doorstep scheduled maintenance for two-wheelers and cars.',
    avatar: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Fast Responder',
    rating: 4.9,
    reviewCount: 56,
    completedJobs: 145,
    languages: ['Hindi', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Manish Rawat',
        rating: 5,
        comment: 'Car battery died in the office basement. Santosh reached in 25 mins and jumpstarted with professional cables. Lifesaver!',
        date: new Date('2026-03-08')
      }
    ]
  },
  {
    name: 'Anita Devi & Team',
    phone: '+91 98105 99887',
    email: 'anita.cleaning@kaamsetu.in',
    category: 'Cleaner & Housekeeping',
    subSkills: ['Kitchen Chimney & Tile Degreasing', 'Bathroom Acid & Stain Removal', 'Sofa Fabric Wet Shampoo', 'Post-Construction Deep Cleaning', 'Balcony Pressure Wash'],
    experienceYears: 5,
    hourlyRate: 349,
    dailyRate: 1600,
    city: 'New Delhi',
    area: 'Mayur Vihar / Preet Vihar',
    pincode: '110091',
    bio: 'Team of trained deep cleaning experts. Using Taski eco-friendly chemicals and industrial vacuum machines. Sparkling clean bathroom, kitchen, and upholstery transformation guaranteed.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Sanitization Pro',
    rating: 4.9,
    reviewCount: 62,
    completedJobs: 190,
    languages: ['Hindi'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Ritu Sachdeva',
        rating: 5,
        comment: 'Made our greasy 4-year-old kitchen look brand new! Very polite and thorough team.',
        date: new Date('2026-03-02')
      }
    ]
  },
  {
    name: 'Bhavin Patel',
    phone: '+91 98250 12345',
    email: 'bhavin.welder@kaamsetu.in',
    category: 'Welder',
    subSkills: ['MIG Welding', 'SS Railings', 'Main Gate Fabrication', 'Factory Sheds', 'Window Grill Fitting'],
    experienceYears: 11,
    hourlyRate: 450,
    dailyRate: 2300,
    city: 'Ahmedabad',
    area: 'SG Highway & Maninagar',
    pincode: '380015',
    bio: 'Experienced industrial and domestic fabricator in Ahmedabad. 11+ years creating heavy iron security gates, balcony railings, stainless steel staircases, and warehouse sheds. Quick response across Ahmedabad.',
    avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Certified Welder',
    rating: 4.9,
    reviewCount: 42,
    completedJobs: 112,
    languages: ['Gujarati', 'Hindi', 'Basic English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Kirit Shah',
        rating: 5,
        comment: 'Fabricated our bungalow entrance gate and balcony railings. Superb finishing and strong welds.',
        date: new Date('2026-03-12')
      }
    ]
  },
  {
    name: 'Jignesh Prajapati',
    phone: '+91 98980 67890',
    email: 'jignesh.plumber@kaamsetu.in',
    category: 'Plumber',
    subSkills: ['Water Line Leakage', 'Bath Fitting & Jaquar', 'Water Tank Fitting', 'Motor Pump Installation', 'Drain Clean'],
    experienceYears: 9,
    hourlyRate: 320,
    dailyRate: 1700,
    city: 'Ahmedabad',
    area: 'Navrangpura & Satellite',
    pincode: '380009',
    bio: 'Ahmedabad specialist plumber. Fast doorstep arrival for concealed pipe repair, water motor pump repairs, bathroom faucets, geyser piping, and drainage unblocking. Clear rates without extra overheads.',
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Master Plumber',
    rating: 4.9,
    reviewCount: 51,
    completedJobs: 148,
    languages: ['Gujarati', 'Hindi'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Chirag Dave',
        rating: 5,
        comment: 'Solved our underground tank motor air-lock issue in 20 minutes. Very punctual and honest mistri.',
        date: new Date('2026-03-15')
      }
    ]
  }
];

const sampleBookings = [

  {
    workerName: 'Rajesh Kumar Mistri',
    workerCategory: 'Plumber',
    workerPhone: '+91 98765 43210',
    customerName: 'Prashant Mishra',
    customerPhone: '+91 99100 23456',
    customerAddress: 'Flat 402, Lotus Apartments, Lajpat Nagar 4',
    city: 'New Delhi',
    area: 'Lajpat Nagar',
    serviceRequired: 'Plumbing Service',
    jobDescription: 'Kitchen sink pipe leaking continuously under counter, needs urgent gasket and pipe replacement.',
    preferredDate: '2026-03-24',
    preferredTimeSlot: 'Morning (9 AM - 12 PM)',
    urgency: 'Today',
    status: 'accepted',
    estimatedCost: 349,
    notes: 'Please bring standard 1.5 inch flexible waste pipe.'
  },
  {
    workerName: 'Amit Sharma',
    workerCategory: 'Welder',
    workerPhone: '+91 98112 87654',
    customerName: 'Kunal Grover',
    customerPhone: '+91 98111 67890',
    customerAddress: 'House 14B, Sector 9, Rohini',
    city: 'New Delhi',
    area: 'Rohini',
    serviceRequired: 'Welder Service',
    jobDescription: 'Main parking iron gate bottom hinge cracked and dragging on the road. Need re-welding.',
    preferredDate: '2026-03-25',
    preferredTimeSlot: 'Afternoon (12 PM - 3 PM)',
    urgency: 'Tomorrow / Scheduled',
    status: 'pending',
    estimatedCost: 499,
    notes: 'Power outlet is available in the driveway.'
  }
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Worker.deleteMany({});
    await Booking.deleteMany({});

    // Insert Workers
    const createdWorkers = await Worker.insertMany(sampleWorkers);
    console.log(`Successfully seeded ${createdWorkers.length} Workers.`);

    // Attach worker ID to sample bookings
    sampleBookings[0].worker = createdWorkers[0]._id;
    sampleBookings[1].worker = createdWorkers[1]._id;

    await Booking.insertMany(sampleBookings);
    console.log(`Successfully seeded sample bookings.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData, sampleWorkers, sampleBookings };
