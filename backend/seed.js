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
  },
  {
    name: 'Suresh Rathore',
    phone: '+91 98254 99112',
    email: 'suresh.cctv@kaamsetu.in',
    category: 'CCTV & Security',
    subSkills: ['CCTV Camera Setup', 'Wi-Fi Video Doorbell', 'Mobile Live View Setup', 'Biometric Machine', 'Hard Disk & Power Supply Fix'],
    experienceYears: 6,
    hourlyRate: 349,
    dailyRate: 1800,
    city: 'Ahmedabad',
    area: 'Satellite',
    pincode: '380015',
    bio: 'Certified CP PLUS and Hikvision CCTV installation expert. 6+ years experience in commercial & home security surveillance, DVR configuration and remote mobile setup.',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Security Pro',
    rating: 4.9,
    reviewCount: 38,
    completedJobs: 94,
    languages: ['Hindi', 'Gujarati', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Mehul Shah',
        rating: 5,
        comment: 'Installed 4 IP cameras and connected seamlessly to my phone in under 2 hours. Very clean concealed wiring.',
        date: new Date('2026-03-12')
      }
    ]
  },
  {
    name: 'Ram Sevak Mali',
    phone: '+91 98251 44556',
    email: 'ramsevak.gardener@kaamsetu.in',
    category: 'Gardener (Mali)',
    subSkills: ['Lawn Grass Cutting', 'Plant Pruning & Trimming', 'Potting & Fertilizer', 'Drip Watering Setup', 'Terrace Garden Care'],
    experienceYears: 12,
    hourlyRate: 299,
    dailyRate: 1200,
    city: 'Ahmedabad',
    area: 'Bopal & South Bopal',
    pincode: '380058',
    bio: '12+ years experience in villa and terrace garden maintenance. Specialised in organic composting, lawn mowing and exotic seasonal flower care.',
    avatar: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Senior Mali',
    rating: 4.8,
    reviewCount: 42,
    completedJobs: 110,
    languages: ['Hindi', 'Gujarati'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Snehal Patel',
        rating: 5,
        comment: 'Transformed our terrace garden completely. Brought great organic manure and trimmed all hedges neatly.',
        date: new Date('2026-03-08')
      }
    ]
  },
  {
    name: 'Manoj Pest Solutions',
    phone: '+91 98112 55443',
    email: 'manoj.pest@kaamsetu.in',
    category: 'Pest Control',
    subSkills: ['Termite / Deemak Treatment', 'Cockroach Gel Treatment', 'Bed Bugs Removal', 'Rodent / Rat Control', 'Full Home Disinfection'],
    experienceYears: 7,
    hourlyRate: 499,
    dailyRate: 2200,
    city: 'New Delhi',
    area: 'Lajpat Nagar & Defence Colony',
    pincode: '110024',
    bio: 'Government certified odourless pest control solutions. Safe for kids and pets. 1-year warranty on anti-termite wood drilling and cockroach eradication.',
    avatar: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Certified Pest Specialist',
    rating: 4.9,
    reviewCount: 56,
    completedJobs: 140,
    languages: ['Hindi', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Anil Kapoor',
        rating: 5,
        comment: 'Completely eradicated kitchen cockroaches within 48 hours without any bad smell. Highly recommended.',
        date: new Date('2026-03-05')
      }
    ]
  },
  {
    name: 'Mohammad Farooq',
    phone: '+91 98711 77889',
    email: 'farooq.ceiling@kaamsetu.in',
    category: 'POP & False Ceiling',
    subSkills: ['Gypsum False Ceiling', 'POP Molding & Borders', 'PVC Wall & Ceiling Panels', 'Grid Ceiling Tiles', 'Crack & Ceiling Repair'],
    experienceYears: 9,
    hourlyRate: 449,
    dailyRate: 2000,
    city: 'New Delhi',
    area: 'Okhla & Jasola',
    pincode: '110025',
    bio: 'Master craftsman in Saint-Gobain Gyproc false ceilings, LED profile groove designs, and moisture-resistant PVC wall claddings.',
    avatar: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Master Ceiling Contractor',
    rating: 4.8,
    reviewCount: 31,
    completedJobs: 78,
    languages: ['Hindi', 'Urdu'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Tariq Anwar',
        rating: 5,
        comment: 'Outstanding drawing room false ceiling with cove lighting channel. Very crisp lines and laser leveling.',
        date: new Date('2026-02-28')
      }
    ]
  },
  {
    name: 'Dinesh Panchal',
    phone: '+91 98250 88776',
    email: 'dinesh.glass@kaamsetu.in',
    category: 'Glass & Aluminium',
    subSkills: ['Aluminium Sliding Window', 'Toughened Glass Partition', 'Shower Glass Cubicle', 'Mosquito Net Fitting', 'Balcony Glass Railing'],
    experienceYears: 11,
    hourlyRate: 399,
    dailyRate: 1900,
    city: 'Ahmedabad',
    area: 'Maninagar',
    pincode: '380008',
    bio: 'Specialist in Jindal aluminium domal sections, 12mm toughened office partitions, glass shower cubicles, and magnetic mosquito nets.',
    avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Fabrication Expert',
    rating: 4.9,
    reviewCount: 45,
    completedJobs: 115,
    languages: ['Hindi', 'Gujarati'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Harish Vora',
        rating: 5,
        comment: 'Replaced all balcony sliding rollers and installed high quality mosquito net frames. Smooth sliding now.',
        date: new Date('2026-03-01')
      }
    ]
  },
  {
    name: 'Harsh Vardhan',
    phone: '+91 98240 66778',
    email: 'harsh.solar@kaamsetu.in',
    category: 'Solar Technician',
    subSkills: ['Rooftop Solar Installation', 'Solar Inverter Setup', 'Solar Plate Deep Wash', 'Wiring & Fault Repair', 'Solar Water Heater Fix'],
    experienceYears: 5,
    hourlyRate: 499,
    dailyRate: 2400,
    city: 'Ahmedabad',
    area: 'SG Highway & Gota',
    pincode: '380060',
    bio: 'MNRE trained solar rooftop technician. Expert in on-grid net metering, high-pressure solar panel cleaning, inverter tripping fixes, and solar water heaters.',
    avatar: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: false,
    badge: 'Certified Solar Pro',
    rating: 4.9,
    reviewCount: 29,
    completedJobs: 65,
    languages: ['Hindi', 'Gujarati', 'English'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Nitin Desai',
        rating: 5,
        comment: 'Fixed our 5kW solar inverter communication error and did a thorough panel jet wash. Generation jumped 18%.',
        date: new Date('2026-03-14')
      }
    ]
  },
  {
    name: 'Kanhaiya Locksmith',
    phone: '+91 98103 33221',
    email: 'kanhaiya.keys@kaamsetu.in',
    category: 'Locksmith (Chabi Wala)',
    subSkills: ['Emergency Lock Opening', 'Duplicate Key Making', 'Godrej Lock Replacement', 'Smart Digital Door Lock', 'Car Key Duplicate'],
    experienceYears: 15,
    hourlyRate: 199,
    dailyRate: 1100,
    city: 'New Delhi',
    area: 'Connaught Place & Karol Bagh',
    pincode: '110001',
    bio: '15+ years trusted locksmith. 24x7 emergency locked door unlocking without damaging the door or frame. Digital fingerprint locks and duplicate computer keys.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Master Locksmith',
    rating: 5.0,
    reviewCount: 68,
    completedJobs: 210,
    languages: ['Hindi', 'Punjabi'],
    toolsProvided: true,
    reviews: [
      {
        customerName: 'Deepak Sethi',
        rating: 5,
        comment: 'Got locked out of our flat at 11 PM. Kanhaiya ji reached in 25 mins and safely unlocked the Godrej lock without damage.',
        date: new Date('2026-03-16')
      }
    ]
  },
  {
    name: 'Kuldeep Singh',
    phone: '+91 98188 44332',
    email: 'kuldeep.driver@kaamsetu.in',
    category: 'Driver',
    subSkills: ['Personal Car Driver (Hourly)', 'Outstation Round Trip', 'Automatic / Luxury Car', 'Late Night Emergency Drop', 'Wedding / Event Driver'],
    experienceYears: 10,
    hourlyRate: 399,
    dailyRate: 1500,
    city: 'New Delhi',
    area: 'Saket & Hauz Khas',
    pincode: '110017',
    bio: 'Professional verified commercial badge driver with clean police verification. Skilled with automatic, manual, SUV, and luxury sedans (BMW/Mercedes/Audi). Non-smoker and punctual.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    isVerified: true,
    isAvailable: true,
    emergencyAvailable: true,
    badge: 'Top Rated Driver',
    rating: 4.9,
    reviewCount: 52,
    completedJobs: 130,
    languages: ['Hindi', 'Punjabi', 'English'],
    toolsProvided: false,
    reviews: [
      {
        customerName: 'Rohit Khanna',
        rating: 5,
        comment: 'Hired Kuldeep for a Delhi to Jaipur round trip. Extremely smooth driving, very polite, and very safe for family.',
        date: new Date('2026-03-11')
      }
    ]
  }
];

const sampleBookings = [
  {
    workerName: 'Rajesh Kumar Mistri',
    workerCategory: 'Plumber',
    workerPhone: '+91 98765 43210',
    workerAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80',
    customerName: 'Prashant Mishra',
    customerPhone: '+91 99100 23456',
    customerAddress: 'Flat 402, Lotus Apartments, Lajpat Nagar 4',
    city: 'New Delhi',
    area: 'Lajpat Nagar',
    serviceRequired: 'Plumbing Service',
    jobDescription: 'Kitchen sink pipe leaking continuously under counter, needs urgent gasket and pipe replacement.',
    preferredDate: '2026-03-24',
    preferredDay: 'मंगलवार (Tuesday)',
    preferredTimeSlot: 'Morning (9 AM - 12 PM)',
    urgency: 'Today',
    status: 'accepted',
    estimatedCost: 349,
    notes: 'Please bring standard 1.5 inch flexible waste pipe.'
  },
  {
    workerName: 'Rajesh Kumar Mistri',
    workerCategory: 'Plumber',
    workerPhone: '+91 98765 43210',
    workerAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80',
    customerName: 'Aakash Verma',
    customerPhone: '+91 98101 22334',
    customerAddress: 'B-12, Ground Floor, Defence Colony',
    city: 'New Delhi',
    area: 'Defence Colony',
    serviceRequired: 'Bathroom Sanitary & Tap Leakage',
    jobDescription: 'Master bathroom mixer tap replacement and overhead tank ball-valve repair.',
    preferredDate: '2026-03-20',
    preferredDay: 'शुक्रवार (Friday)',
    preferredTimeSlot: 'Morning (10:00 AM - 01:00 PM)',
    urgency: 'Emergency (Within 2 Hours)',
    status: 'completed',
    completedDate: '2026-03-20',
    estimatedCost: 450,
    notes: 'Work completed smoothly. Replaced 2 brass valves.'
  },
  {
    workerName: 'Rajesh Kumar Mistri',
    workerCategory: 'Plumber',
    workerPhone: '+91 98765 43210',
    workerAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80',
    customerName: 'Pooja Mehra',
    customerPhone: '+91 98711 44556',
    customerAddress: 'House 88, Near Metro Pillar 42, South Ext 1',
    city: 'New Delhi',
    area: 'South Ext 1',
    serviceRequired: 'Water Motor Pump Repair',
    jobDescription: 'Crompton 1 HP water booster pump making buzzing sound and not pulling water to rooftop.',
    preferredDate: '2026-03-15',
    preferredDay: 'रविवार (Sunday)',
    preferredTimeSlot: 'Afternoon (12 PM - 3 PM)',
    urgency: 'Today',
    status: 'completed',
    completedDate: '2026-03-15',
    estimatedCost: 650,
    notes: 'Replaced condenser and restored water flow.'
  },
  {
    workerName: 'Amit Sharma',
    workerCategory: 'Welder',
    workerPhone: '+91 98112 87654',
    workerAvatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    customerName: 'Kunal Grover',
    customerPhone: '+91 98111 67890',
    customerAddress: 'House 14B, Sector 9, Rohini',
    city: 'New Delhi',
    area: 'Rohini',
    serviceRequired: 'Main Parking Gate Re-welding',
    jobDescription: 'Main parking iron gate bottom hinge cracked and dragging on the road. Need heavy re-welding.',
    preferredDate: '2026-03-25',
    preferredDay: 'बुधवार (Wednesday)',
    preferredTimeSlot: 'Afternoon (12 PM - 3 PM)',
    urgency: 'Tomorrow / Scheduled',
    status: 'in_progress',
    estimatedCost: 550,
    notes: 'Power outlet is available in the driveway.'
  },
  {
    workerName: 'Amit Sharma',
    workerCategory: 'Welder',
    workerPhone: '+91 98112 87654',
    workerAvatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    customerName: 'Sunil Gupta',
    customerPhone: '+91 98105 88990',
    customerAddress: 'Plot 45, Near Aggarwal Sweets, Pitampura',
    city: 'New Delhi',
    area: 'Pitampura',
    serviceRequired: 'Window Safety Grill Modification',
    jobDescription: 'Added 4 extra iron safety bars and anti-theft locks on ground floor window frames.',
    preferredDate: '2026-03-18',
    preferredDay: 'बुधवार (Wednesday)',
    preferredTimeSlot: 'Morning (9 AM - 12 PM)',
    urgency: 'Today',
    status: 'completed',
    completedDate: '2026-03-18',
    estimatedCost: 950,
    notes: 'Arc welding completed with red-oxide primer coating.'
  },
  {
    workerName: 'Vikram Solanki',
    workerCategory: 'Plumber',
    workerPhone: '+91 98250 12345',
    workerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98251 77665',
    customerAddress: '401, Shivalik Heights, Opp. Iscon Temple, SG Highway',
    city: 'Ahmedabad',
    area: 'SG Highway',
    serviceRequired: 'Bathroom Concealed Pipe Leakage',
    jobDescription: 'Wall seepage near shower area. Located leak with pressure test and replaced broken elbow joint.',
    preferredDate: '2026-03-22',
    preferredDay: 'रविवार (Sunday)',
    preferredTimeSlot: 'Morning (9 AM - 12 PM)',
    urgency: 'Emergency (Within 2 Hours)',
    status: 'completed',
    completedDate: '2026-03-22',
    estimatedCost: 750,
    notes: 'Fixed CPVC joint and sealed tile gaps.'
  },
  {
    workerName: 'Vikram Solanki',
    workerCategory: 'Plumber',
    workerPhone: '+91 98250 12345',
    workerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    customerName: 'Chirag Dave',
    customerPhone: '+91 97240 55678',
    customerAddress: 'B-7, Tulsi Bungalows, Judges Bungalow Road, Bodakdev',
    city: 'Ahmedabad',
    area: 'Bodakdev',
    serviceRequired: 'Underground Water Tank Motor Air-lock',
    jobDescription: 'Submersible water pump air-lock removal and float valve replacement in overhead tank.',
    preferredDate: '2026-03-15',
    preferredDay: 'रविवार (Sunday)',
    preferredTimeSlot: 'Morning (8:30 AM - 11 AM)',
    urgency: 'Today',
    status: 'completed',
    completedDate: '2026-03-15',
    estimatedCost: 400,
    notes: 'Punctual service, air-lock cleared in 20 minutes.'
  },
  {
    workerName: 'Mohammad Farooq',
    workerCategory: 'Welder',
    workerPhone: '+91 97180 54321',
    workerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    customerName: 'Deepak Saxena',
    customerPhone: '+91 98990 11223',
    customerAddress: 'Shop 12, Main Market, Sector 62',
    city: 'Noida',
    area: 'Sector 62',
    serviceRequired: 'Commercial Metal Shutter Repair',
    jobDescription: 'Rolling shutter spring replacement and side rail welding for sweet shop entrance.',
    preferredDate: '2026-03-21',
    preferredDay: 'शनिवार (Saturday)',
    preferredTimeSlot: 'Evening (4 PM - 7 PM)',
    urgency: 'Emergency (Within 2 Hours)',
    status: 'completed',
    completedDate: '2026-03-21',
    estimatedCost: 1200,
    notes: 'Heavy duty spring replaced. Shutter working smooth.'
  },
  {
    workerName: 'Sanjay Prajapati',
    workerCategory: 'Mason (Mistri)',
    workerPhone: '+91 97241 23456',
    workerAvatar: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    customerName: 'Vikram Shah',
    customerPhone: '+91 98240 33445',
    customerAddress: 'Plot 104, Pushkar Tenements, Maninagar East',
    city: 'Ahmedabad',
    area: 'Maninagar',
    serviceRequired: 'Flooring & Plaster Renovation',
    jobDescription: 'Balcony tile leveling and waterproofing plaster work on outer damp wall.',
    preferredDate: '2026-03-19',
    preferredDay: 'गुरुवार (Thursday)',
    preferredTimeSlot: 'Full Day (9 AM - 6 PM)',
    urgency: 'Tomorrow / Scheduled',
    status: 'completed',
    completedDate: '2026-03-19',
    estimatedCost: 1800,
    notes: 'Dr. Fixit waterproofing chemical used with cement paste.'
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

    // Map sampleBookings to corresponding workers by name
    const workerMap = new Map();
    createdWorkers.forEach(w => workerMap.set(w.name, w._id));

    const enrichedBookings = sampleBookings.map(b => {
      const matchedWorkerId = workerMap.get(b.workerName) || createdWorkers[0]._id;
      return {
        ...b,
        worker: matchedWorkerId
      };
    });

    await Booking.insertMany(enrichedBookings);
    console.log(`Successfully seeded ${enrichedBookings.length} rich sample bookings with complete work & hiring history.`);

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
