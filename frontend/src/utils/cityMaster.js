/**
 * KaamSetu City Master Data (Frontend)
 * 
 * Standardized city structure:
 * City
 *  ├── 1. Basic Info (id, name, hindiName, slug, tier, isPrimary)
 *  ├── 2. State Info (state, stateHindi, stateCode, region)
 *  ├── 3. Pincode Mapping (exact, prefixes, samplePincode)
 *  ├── 4. Popular Areas (popularAreas)
 *  ├── 5. Aliases & Search Keywords (aliases)
 *  ├── 6. Coordinates (latitude, longitude, defaultZoom for Maps/Radius)
 *  ├── 7. Languages (languages, primaryLanguage)
 *  ├── 8. Services (topServices)
 *  ├── 9. Serviceability (isServiceable, launchStatus, coverageRadiusKm)
 *  └── 10. Search/Location Helpers (Haversine distance, exact & prefix lookup)
 */

export const CITIES = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    hindiName: 'अहमदाबाद',
    slug: 'ahmedabad',
    tier: 1,
    isPrimary: true,
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    stateCode: 'GJ',
    region: 'West',
    pincodes: {
      exact: ['380001', '380006', '380009', '380015', '380051', '380054', '380058', '382424', '382481'],
      prefixes: ['380', '382'],
      samplePincode: '380015'
    },
    pincodePrefixes: ['380', '382'],
    popularAreas: [
      'SG Highway', 'Satellite', 'Maninagar', 'Bopal', 'Vastrapur', 
      'Navrangpura', 'Bodakdev', 'Chandkheda', 'Naroda', 'Prahlad Nagar', 
      'Gota', 'Nikol', 'Thaltej', 'Paldi', 'C G Road', 'Ashram Road', 'Isanpur', 'Ghatlodiya'
    ],
    aliases: ['Amdavad', 'Karnavati', 'अमदावाद', 'अहमदाबाद', 'Ahmedabad City'],
    coordinates: { latitude: 23.0225, longitude: 72.5714, defaultZoom: 12 },
    languages: ['Gujarati', 'Hindi', 'English'],
    primaryLanguage: 'Gujarati',
    topServices: ['plumber', 'electrician', 'welder', 'carpenter', 'painter', 'mason'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 35
  },
  {
    id: 'surat',
    name: 'Surat',
    hindiName: 'सूरत',
    slug: 'surat',
    tier: 1,
    isPrimary: false,
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    stateCode: 'GJ',
    region: 'West',
    pincodes: {
      exact: ['395001', '395003', '395007', '395009', '394210', '394221'],
      prefixes: ['395', '394'],
      samplePincode: '395007'
    },
    pincodePrefixes: ['394', '395'],
    popularAreas: [
      'Adajan', 'Vesu', 'Varachha', 'Katargam', 'Piplod', 
      'Rander', 'Ring Road', 'Athwa Lines', 'City Light', 'Udhna', 'Pandesara'
    ],
    aliases: ['Suryapur', 'Diamond City', 'सूरत'],
    coordinates: { latitude: 21.1702, longitude: 72.8311, defaultZoom: 12 },
    languages: ['Gujarati', 'Hindi'],
    primaryLanguage: 'Gujarati',
    topServices: ['welder', 'electrician', 'plumber', 'carpenter', 'fabricator'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 30
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    hindiName: 'वडोदरा',
    slug: 'vadodara',
    tier: 2,
    isPrimary: false,
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    stateCode: 'GJ',
    region: 'West',
    pincodes: {
      exact: ['390001', '390007', '390011', '390020'],
      prefixes: ['390', '391'],
      samplePincode: '390007'
    },
    pincodePrefixes: ['390', '391'],
    popularAreas: [
      'Alkapuri', 'Manjalpur', 'Sayajigunj', 'Gotri', 'Karelibaug', 
      'Fatehgunj', 'Akota', 'Waghodia Road', 'Vasna Road'
    ],
    aliases: ['Baroda', 'बरोडा', 'वडोदरा', 'Sanskari Nagari'],
    coordinates: { latitude: 22.3072, longitude: 73.1812, defaultZoom: 12 },
    languages: ['Gujarati', 'Hindi'],
    primaryLanguage: 'Gujarati',
    topServices: ['electrician', 'plumber', 'carpenter', 'mason'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    hindiName: 'राजकोट',
    slug: 'rajkot',
    tier: 2,
    isPrimary: false,
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    stateCode: 'GJ',
    region: 'West',
    pincodes: {
      exact: ['360001', '360002', '360004', '360005'],
      prefixes: ['360'],
      samplePincode: '360005'
    },
    pincodePrefixes: ['360'],
    popularAreas: [
      'Kalawad Road', 'Yagnik Road', 'University Road', 'Mavdi', 
      'Gondal Road', '150 Feet Ring Road', 'Kothariya'
    ],
    aliases: ['राजकोट', 'Rangilu Rajkot'],
    coordinates: { latitude: 22.3039, longitude: 70.8022, defaultZoom: 12 },
    languages: ['Gujarati', 'Hindi'],
    primaryLanguage: 'Gujarati',
    topServices: ['welder', 'electrician', 'plumber', 'mason'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'new-delhi',
    name: 'New Delhi',
    hindiName: 'दिल्ली',
    slug: 'new-delhi',
    tier: 1,
    isPrimary: true,
    state: 'Delhi NCR',
    stateHindi: 'दिल्ली / एनसीआर',
    stateCode: 'DL',
    region: 'North',
    pincodes: {
      exact: ['110001', '110005', '110019', '110024', '110034', '110075', '110085', '110092'],
      prefixes: ['110'],
      samplePincode: '110001'
    },
    pincodePrefixes: ['110'],
    popularAreas: [
      'Connaught Place', 'Rohini', 'Dwarka', 'Karol Bagh', 'Laxmi Nagar', 
      'Saket', 'Lajpat Nagar', 'Janakpuri', 'Pitampura', 'Hauz Khas', 
      'Vasant Kunj', 'Mayur Vihar', 'Uttam Nagar', 'Shahdara'
    ],
    aliases: ['Delhi', 'Dilli', 'नई दिल्ली', 'NCT of Delhi', 'Central Delhi'],
    coordinates: { latitude: 28.6139, longitude: 77.2090, defaultZoom: 12 },
    languages: ['Hindi', 'English', 'Punjabi'],
    primaryLanguage: 'Hindi',
    topServices: ['plumber', 'electrician', 'carpenter', 'painter', 'welder', 'ac repair'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 40
  },
  {
    id: 'noida',
    name: 'Noida',
    hindiName: 'नोएडा',
    slug: 'noida',
    tier: 1,
    isPrimary: true,
    state: 'Uttar Pradesh / NCR',
    stateHindi: 'उत्तर प्रदेश / एनसीआर',
    stateCode: 'UP',
    region: 'North',
    // Exact validated pincodes have priority. Removed broad '2013' prefix to prevent collision with Greater Noida
    pincodes: {
      exact: [
        '201301', '201302', '201303', '201304', '201305', '201307', 
        '201309', '201313', '201314', '201316', '201317'
      ],
      prefixes: ['201301', '201302', '201303', '201304', '201305', '201307', '201309', '201313', '201314'],
      samplePincode: '201301'
    },
    pincodePrefixes: ['201301', '201302', '201303', '201304', '201305', '201307', '201309', '201313', '201314'],
    popularAreas: [
      'Sector 18', 'Sector 62', 'Sector 15', 'Sector 76', 'Sector 137', 
      'Sector 50', 'Sector 128', 'Noida Expressway', 'Atta Market'
    ],
    aliases: ['New Okhla', 'NOIDA', 'Gautam Buddha Nagar', 'नोएडा'],
    coordinates: { latitude: 28.5355, longitude: 77.3910, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['plumber', 'electrician', 'carpenter', 'welder', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'greater-noida',
    name: 'Greater Noida',
    hindiName: 'ग्रेटर नोएडा',
    slug: 'greater-noida',
    tier: 2,
    isPrimary: false,
    state: 'Uttar Pradesh / NCR',
    stateHindi: 'उत्तर प्रदेश / एनसीआर',
    stateCode: 'UP',
    region: 'North',
    // Specific Greater Noida pincodes
    pincodes: {
      exact: ['201306', '201308', '201310', '201312', '201315', '201318'],
      prefixes: ['201306', '201308', '201310', '201312', '201315', '201318'],
      samplePincode: '201310'
    },
    pincodePrefixes: ['201306', '201308', '201310', '201312', '201315', '201318'],
    popularAreas: [
      'Pari Chowk', 'Gaur City', 'Alpha 1', 'Beta 2', 'Knowledge Park', 
      'Surajpur', 'Ecotech', 'Delta 1', 'Greater Noida West', 'Noida Extension'
    ],
    aliases: ['Gr Noida', 'Greater Noida West', 'Noida Extension', 'ग्रेटर नोएडा'],
    coordinates: { latitude: 28.4744, longitude: 77.5040, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['electrician', 'plumber', 'mason', 'welder', 'carpenter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 30
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    hindiName: 'गुरुग्राम',
    slug: 'gurugram',
    tier: 1,
    isPrimary: false,
    state: 'Haryana / NCR',
    stateHindi: 'हरियाणा / एनसीआर',
    stateCode: 'HR',
    region: 'North',
    pincodes: {
      exact: ['122001', '122002', '122003', '122018', '122051'],
      prefixes: ['122'],
      samplePincode: '122002'
    },
    pincodePrefixes: ['122'],
    popularAreas: [
      'Cyber City', 'DLF Phase 1-5', 'Golf Course Road', 'Sohna Road', 
      'Sector 14', 'Sector 56', 'Sector 29', 'Sector 45', 'Palam Vihar', 'MG Road'
    ],
    aliases: ['Gurgaon', 'गुड़गांव', 'गुरुग्राम', 'Millennium City'],
    coordinates: { latitude: 28.4595, longitude: 77.0266, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['plumber', 'electrician', 'carpenter', 'painter', 'welder'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 30
  },
  {
    id: 'faridabad',
    name: 'Faridabad',
    hindiName: 'फरीदाबाद',
    slug: 'faridabad',
    tier: 2,
    isPrimary: false,
    state: 'Haryana / NCR',
    stateHindi: 'हरियाणा / एनसीआर',
    stateCode: 'HR',
    region: 'North',
    pincodes: {
      exact: ['121001', '121002', '121003', '121007'],
      prefixes: ['121'],
      samplePincode: '121002'
    },
    pincodePrefixes: ['121'],
    popularAreas: [
      'Sector 15', 'Sector 16', 'NIT 1-5', 'Ballabgarh', 'Green Field', 'Badkhal Lake', 'Neharpar'
    ],
    aliases: ['फरीदाबाद', 'NIT Faridabad'],
    coordinates: { latitude: 28.4089, longitude: 77.3178, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['welder', 'electrician', 'plumber', 'mason'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad',
    hindiName: 'गाजियाबाद',
    slug: 'ghaziabad',
    tier: 2,
    isPrimary: false,
    state: 'Uttar Pradesh / NCR',
    stateHindi: 'उत्तर प्रदेश / एनसीआर',
    stateCode: 'UP',
    region: 'North',
    pincodes: {
      exact: ['201001', '201002', '201010', '201012', '201014'],
      prefixes: ['2010'],
      samplePincode: '201014'
    },
    pincodePrefixes: ['2010'],
    popularAreas: [
      'Indirapuram', 'Vaishali', 'Vasundhara', 'Raj Nagar Extension', 
      'Crossings Republik', 'Kaushambi', 'Govindpuram'
    ],
    aliases: ['गाजियाबाद', 'Indirapuram', 'Vaishali'],
    coordinates: { latitude: 28.6692, longitude: 77.4538, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['electrician', 'plumber', 'mason', 'carpenter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    hindiName: 'मुंबई',
    slug: 'mumbai',
    tier: 1,
    isPrimary: true,
    state: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    stateCode: 'MH',
    region: 'West',
    pincodes: {
      exact: ['400001', '400050', '400053', '400076', '400092'],
      prefixes: ['400'], // Thane (4006) and Navi Mumbai (4007) are prioritized by longer prefix
      samplePincode: '400050'
    },
    pincodePrefixes: ['400'],
    popularAreas: [
      'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Powai', 
      'Malad', 'Goregaon', 'Juhu', 'Kurla', 'Chembur', 'Colaba', 'Ghatkopar', 'Kandivali', 'Santacruz'
    ],
    aliases: ['Bombay', 'बंबई', 'मुंबई', 'Mumbai City'],
    coordinates: { latitude: 19.0760, longitude: 72.8777, defaultZoom: 12 },
    languages: ['Marathi', 'Hindi', 'English'],
    primaryLanguage: 'Marathi',
    topServices: ['plumber', 'electrician', 'carpenter', 'painter', 'welder'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 35
  },
  {
    id: 'navi-mumbai',
    name: 'Navi Mumbai',
    hindiName: 'नवी मुंबई',
    slug: 'navi-mumbai',
    tier: 2,
    isPrimary: false,
    state: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    stateCode: 'MH',
    region: 'West',
    pincodes: {
      exact: ['400703', '400705', '400706', '410206', '410210'],
      prefixes: ['4007', '4102'],
      samplePincode: '400703'
    },
    pincodePrefixes: ['4007', '4102'],
    popularAreas: [
      'Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Panvel', 
      'Airoli', 'Kopar Khairane', 'Seawoods'
    ],
    aliases: ['New Bombay', 'नवी मुंबई', 'Vashi', 'Panvel'],
    coordinates: { latitude: 19.0330, longitude: 73.0297, defaultZoom: 12 },
    languages: ['Marathi', 'Hindi', 'English'],
    primaryLanguage: 'Marathi',
    topServices: ['electrician', 'plumber', 'carpenter', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 30
  },
  {
    id: 'thane',
    name: 'Thane',
    hindiName: 'ठाणे',
    slug: 'thane',
    tier: 2,
    isPrimary: false,
    state: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    stateCode: 'MH',
    region: 'West',
    pincodes: {
      exact: ['400601', '400602', '400607', '400615'],
      prefixes: ['4006'],
      samplePincode: '400601'
    },
    pincodePrefixes: ['4006'],
    popularAreas: [
      'Ghodbunder Road', 'Majiwada', 'Vartak Nagar', 'Naupada', 'Kolshet Road', 'Hiranandani Estate'
    ],
    aliases: ['Thana', 'ठाणे'],
    coordinates: { latitude: 19.2183, longitude: 72.9781, defaultZoom: 12 },
    languages: ['Marathi', 'Hindi', 'English'],
    primaryLanguage: 'Marathi',
    topServices: ['plumber', 'electrician', 'carpenter', 'mason'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'pune',
    name: 'Pune',
    hindiName: 'पुणे',
    slug: 'pune',
    tier: 1,
    isPrimary: false,
    state: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    stateCode: 'MH',
    region: 'West',
    pincodes: {
      exact: ['411001', '411014', '411038', '411057'],
      prefixes: ['411'],
      samplePincode: '411014'
    },
    pincodePrefixes: ['411'],
    popularAreas: [
      'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Wakad', 'Baner', 
      'Hadapsar', 'Aundh', 'Magarpatta', 'Pimpri-Chinchwad'
    ],
    aliases: ['Poona', 'पुणे', 'Pimpri Chinchwad'],
    coordinates: { latitude: 18.5204, longitude: 73.8567, defaultZoom: 12 },
    languages: ['Marathi', 'Hindi', 'English'],
    primaryLanguage: 'Marathi',
    topServices: ['electrician', 'plumber', 'carpenter', 'welder', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 35
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    hindiName: 'बेंगलुरु',
    slug: 'bengaluru',
    tier: 1,
    isPrimary: false,
    state: 'Karnataka',
    stateHindi: 'कर्नाटक',
    stateCode: 'KA',
    region: 'South',
    pincodes: {
      exact: ['560001', '560034', '560066', '560100', '560102'],
      prefixes: ['560', '562'],
      samplePincode: '560034'
    },
    pincodePrefixes: ['560', '562'],
    popularAreas: [
      'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 
      'Electronic City', 'Jayanagar', 'BTM Layout', 'Marathahalli', 'Hebbal'
    ],
    aliases: ['Bangalore', 'बंगलौर', 'बेंगलुरु', 'Silicon Valley of India'],
    coordinates: { latitude: 12.9716, longitude: 77.5946, defaultZoom: 12 },
    languages: ['Kannada', 'Hindi', 'English'],
    primaryLanguage: 'Kannada',
    topServices: ['plumber', 'electrician', 'carpenter', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 40
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    hindiName: 'हैदराबाद',
    slug: 'hyderabad',
    tier: 1,
    isPrimary: false,
    state: 'Telangana',
    stateHindi: 'तेलंगाना',
    stateCode: 'TS',
    region: 'South',
    pincodes: {
      exact: ['500001', '500032', '500081', '500084'],
      prefixes: ['500', '501'],
      samplePincode: '500081'
    },
    pincodePrefixes: ['500', '501'],
    popularAreas: [
      'Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 
      'Kukatpally', 'Madhapur', 'Secunderabad', 'Ameerpet', 'Kondapur'
    ],
    aliases: ['Cyberabad', 'हैदराबाद', 'Secunderabad', 'City of Pearls'],
    coordinates: { latitude: 17.3850, longitude: 78.4867, defaultZoom: 12 },
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    primaryLanguage: 'Telugu',
    topServices: ['electrician', 'plumber', 'welder', 'carpenter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 35
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    hindiName: 'जयपुर',
    slug: 'jaipur',
    tier: 2,
    isPrimary: false,
    state: 'Rajasthan',
    stateHindi: 'राजस्थान',
    stateCode: 'RJ',
    region: 'North',
    pincodes: {
      exact: ['302001', '302017', '302020', '302033'],
      prefixes: ['302'],
      samplePincode: '302017'
    },
    pincodePrefixes: ['302'],
    popularAreas: [
      'Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'C-Scheme', 
      'Raja Park', 'Jagatpura', 'Tonk Road'
    ],
    aliases: ['Pink City', 'जयपुर'],
    coordinates: { latitude: 26.9124, longitude: 75.7873, defaultZoom: 12 },
    languages: ['Hindi', 'Rajasthani', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['mason', 'painter', 'electrician', 'plumber', 'welder'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 30
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    hindiName: 'लखनऊ',
    slug: 'lucknow',
    tier: 2,
    isPrimary: false,
    state: 'Uttar Pradesh',
    stateHindi: 'उत्तर प्रदेश',
    stateCode: 'UP',
    region: 'North',
    pincodes: {
      exact: ['226001', '226010', '226016', '226024'],
      prefixes: ['226'],
      samplePincode: '226010'
    },
    pincodePrefixes: ['226'],
    popularAreas: [
      'Gomti Nagar', 'Hazratganj', 'Alambagh', 'Indira Nagar', 
      'Mahanagar', 'Aliganj', 'Jankipuram'
    ],
    aliases: ['City of Nawabs', 'लखनऊ'],
    coordinates: { latitude: 26.8467, longitude: 80.9462, defaultZoom: 12 },
    languages: ['Hindi', 'Urdu', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['plumber', 'electrician', 'carpenter', 'mason', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 30
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    hindiName: 'कानपुर',
    slug: 'kanpur',
    tier: 2,
    isPrimary: false,
    state: 'Uttar Pradesh',
    stateHindi: 'उत्तर प्रदेश',
    stateCode: 'UP',
    region: 'North',
    pincodes: {
      exact: ['208001', '208002', '208012', '208024'],
      prefixes: ['208'],
      samplePincode: '208001'
    },
    pincodePrefixes: ['208'],
    popularAreas: [
      'Kakadeo', 'Civil Lines', 'Swaroop Nagar', 'Govind Nagar', 'Kidwai Nagar', 'Kalyanpur'
    ],
    aliases: ['Cawnpore', 'कानपुर'],
    coordinates: { latitude: 26.4499, longitude: 80.3319, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['welder', 'electrician', 'plumber', 'mason'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'patna',
    name: 'Patna',
    hindiName: 'पटना',
    slug: 'patna',
    tier: 2,
    isPrimary: false,
    state: 'Bihar',
    stateHindi: 'बिहार',
    stateCode: 'BR',
    region: 'East',
    pincodes: {
      exact: ['800001', '800013', '800020', '800024'],
      prefixes: ['800', '801'],
      samplePincode: '800001'
    },
    pincodePrefixes: ['800', '801'],
    popularAreas: [
      'Kankarbagh', 'Boring Road', 'Bailey Road', 'Raja Bazar', 'Danapur', 'Patliputra Colony'
    ],
    aliases: ['Pataliputra', 'पटना'],
    coordinates: { latitude: 25.5941, longitude: 85.1376, defaultZoom: 12 },
    languages: ['Hindi', 'Bhojpuri', 'Maithili', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['electrician', 'plumber', 'mason', 'carpenter', 'welder'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'indore',
    name: 'Indore',
    hindiName: 'इंदौर',
    slug: 'indore',
    tier: 2,
    isPrimary: false,
    state: 'Madhya Pradesh',
    stateHindi: 'मध्य प्रदेश',
    stateCode: 'MP',
    region: 'Central',
    pincodes: {
      exact: ['452001', '452010', '452016'],
      prefixes: ['452'],
      samplePincode: '452010'
    },
    pincodePrefixes: ['452'],
    popularAreas: [
      'Vijay Nagar', 'Palasia', 'Bhawarkua', 'Rajwada', 'Rau', 'Annapurna Road'
    ],
    aliases: ['इंदौर', 'Mini Mumbai'],
    coordinates: { latitude: 22.7196, longitude: 75.8577, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['electrician', 'plumber', 'carpenter', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    hindiName: 'भोपाल',
    slug: 'bhopal',
    tier: 2,
    isPrimary: false,
    state: 'Madhya Pradesh',
    stateHindi: 'मध्य प्रदेश',
    stateCode: 'MP',
    region: 'Central',
    pincodes: {
      exact: ['462001', '462016', '462023'],
      prefixes: ['462'],
      samplePincode: '462016'
    },
    pincodePrefixes: ['462'],
    popularAreas: [
      'MP Nagar', 'Arera Colony', 'Kolar Road', 'Hoshangabad Road', 'Shahpura'
    ],
    aliases: ['भोपाल', 'City of Lakes'],
    coordinates: { latitude: 23.2599, longitude: 77.4126, defaultZoom: 12 },
    languages: ['Hindi', 'English'],
    primaryLanguage: 'Hindi',
    topServices: ['electrician', 'plumber', 'mason', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    hindiName: 'कोलकाता',
    slug: 'kolkata',
    tier: 1,
    isPrimary: false,
    state: 'West Bengal',
    stateHindi: 'पश्चिम बंगाल',
    stateCode: 'WB',
    region: 'East',
    pincodes: {
      exact: ['700001', '700091', '700156'],
      prefixes: ['700', '711'],
      samplePincode: '700091'
    },
    pincodePrefixes: ['700', '711'],
    popularAreas: [
      'Salt Lake', 'New Town', 'Park Street', 'Howrah', 'Gariahat', 'Dum Dum', 'Ballygunge'
    ],
    aliases: ['Calcutta', 'कलकत्ता', 'कोलकाता', 'City of Joy'],
    coordinates: { latitude: 22.5726, longitude: 88.3639, defaultZoom: 12 },
    languages: ['Bengali', 'Hindi', 'English'],
    primaryLanguage: 'Bengali',
    topServices: ['electrician', 'plumber', 'carpenter', 'mason', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 35
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    hindiName: 'चंडीगढ़',
    slug: 'chandigarh',
    tier: 2,
    isPrimary: false,
    state: 'Chandigarh',
    stateHindi: 'चंडीगढ़ / ट्राइसिटी',
    stateCode: 'CH',
    region: 'North',
    pincodes: {
      exact: ['160017', '160022', '160036', '160055'],
      prefixes: ['160'],
      samplePincode: '160017'
    },
    pincodePrefixes: ['160'],
    popularAreas: [
      'Sector 17', 'Sector 35', 'Sector 22', 'Sector 43', 'Manimajra', 'Mohali Phase 7', 'Panchkula Sector 20'
    ],
    aliases: ['The City Beautiful', 'चंडीगढ़', 'Mohali', 'Panchkula', 'Tricity'],
    coordinates: { latitude: 30.7333, longitude: 76.7794, defaultZoom: 12 },
    languages: ['Hindi', 'Punjabi', 'English'],
    primaryLanguage: 'Punjabi',
    topServices: ['plumber', 'electrician', 'carpenter', 'painter'],
    isServiceable: true,
    launchStatus: 'active',
    coverageRadiusKm: 25
  }
];

// ─────────────────────────────────────────────────────────────
// 10. Search & Location Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Priority-Based Pincode Lookup:
 * 1. Checks exact validated 6-digit PIN codes first (highest priority)
 * 2. Falls back to longest-matching prefix to avoid ambiguous broad matches
 * @param {string|number} pincode 
 * @returns {object|null} Matched City object
 */
export function getCityFromPincode(pincode) {
  if (!pincode) return null;
  const pinStr = pincode.toString().replace(/[^0-9]/g, '');
  if (pinStr.length < 3) return null;

  // Priority 1: Exact 6-digit validated match
  if (pinStr.length === 6) {
    for (const city of CITIES) {
      if (city.pincodes && Array.isArray(city.pincodes.exact)) {
        if (city.pincodes.exact.includes(pinStr)) {
          return city;
        }
      }
    }
  }

  // Priority 2: Longest prefix match
  let bestMatch = null;
  let maxPrefixLength = 0;

  for (const city of CITIES) {
    const prefixes = city.pincodes?.prefixes || city.pincodePrefixes || [];
    for (const prefix of prefixes) {
      if (pinStr.startsWith(prefix) && prefix.length > maxPrefixLength) {
        maxPrefixLength = prefix.length;
        bestMatch = city;
      }
    }
  }

  return bestMatch;
}

/**
 * Find city by Name, Hindi Name, Slug, or Alias
 */
export function getCityByName(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase();

  return CITIES.find((c) => {
    if (c.name.toLowerCase() === clean) return true;
    if (c.hindiName.toLowerCase() === clean) return true;
    if (c.slug && c.slug.toLowerCase() === clean) return true;
    if (c.id && c.id.toLowerCase() === clean) return true;
    if (c.aliases && c.aliases.some((alias) => alias.toLowerCase() === clean)) return true;
    return false;
  }) || null;
}

/**
 * Returns popular areas for a given city
 */
export function getCityAreas(cityName) {
  const city = getCityByName(cityName);
  return city ? city.popularAreas : [];
}

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in Kilometers
 * Powers: "mere aas-paas plumber" & "10 km ke andar electrician"
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Distance in km rounded to 1 decimal place
}

/**
 * Find nearby serviceable cities within a given radius (km) of user GPS coordinates
 */
export function getNearbyCities(latitude, longitude, maxRadiusKm = 40) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return [];

  return CITIES
    .map((city) => {
      const dist = calculateDistance(
        latitude, 
        longitude, 
        city.coordinates.latitude, 
        city.coordinates.longitude
      );
      return { ...city, distanceKm: dist };
    })
    .filter((city) => city.distanceKm <= (maxRadiusKm || city.coverageRadiusKm))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Check if a pincode is serviceable by KaamSetu
 */
export function isPincodeServiceable(pincode) {
  const city = getCityFromPincode(pincode);
  if (!city) {
    return { serviceable: false, city: null, matchType: 'none', areas: [] };
  }
  const pinStr = pincode.toString().replace(/[^0-9]/g, '');
  const isExact = Boolean(city.pincodes?.exact?.includes(pinStr));
  return {
    serviceable: city.isServiceable,
    city,
    matchType: isExact ? 'exact' : 'prefix',
    areas: city.popularAreas
  };
}

/**
 * Returns formatted options for dropdowns/selectors
 */
export function getCityOptions(includeAll = false) {
  const options = CITIES.map((c) => ({
    value: c.name,
    label: `${c.name} (${c.hindiName})`,
    short: c.name,
    state: c.state
  }));

  if (includeAll) {
    return [
      { value: 'All', label: 'All Cities (सभी शहर)', short: 'सभी शहर', state: 'All' },
      ...options
    ];
  }
  return options;
}

/**
 * SEO Helper: Generates localized title, description, and keywords for city landing pages
 */
export function getCitySEOData(cityQuery, tradeName = 'कारीगर') {
  const city = getCityByName(cityQuery);
  if (!city) return null;

  return {
    title: `${city.name} में वेरिफाइड ${tradeName} खोजें | KaamSetu ${city.hindiName}`,
    description: `${city.name} (${city.hindiName}) के मुख्य इलाकों जैसे ${city.popularAreas.slice(0, 4).join(', ')} में 100% वेरिफाइड प्लंबर, इलेक्ट्रीशियन, वेल्डर और मिस्त्री को सीधे कॉल करें। 0% कमीशन।`,
    keywords: [
      `${tradeName} in ${city.name}`,
      `plumber in ${city.name}`,
      `electrician in ${city.name}`,
      `welder in ${city.name}`,
      ...city.popularAreas.slice(0, 6).map((area) => `${tradeName} in ${area}`)
    ],
    canonicalSlug: city.slug,
    coordinates: city.coordinates
  };
}

export default CITIES;
