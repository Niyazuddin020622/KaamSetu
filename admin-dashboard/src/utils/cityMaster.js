/**
 * KaamSetu City Master List Data for Admin Dashboard
 */

export const CITIES = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    hindiName: 'अहमदाबाद',
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    isPrimary: true,
    tier: 1,
    pincodePrefixes: ['380', '382'],
    popularAreas: [
      'SG Highway',
      'Satellite',
      'Maninagar',
      'Bopal',
      'Vastrapur',
      'Navrangpura',
      'Bodakdev',
      'Chandkheda',
      'Naroda',
      'Prahlad Nagar',
      'Gota',
      'Nikol',
      'Thaltej',
      'Paldi',
      'C G Road',
      'Ashram Road'
    ]
  },
  {
    id: 'surat',
    name: 'Surat',
    hindiName: 'सूरत',
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    tier: 1,
    pincodePrefixes: ['394', '395'],
    popularAreas: [
      'Adajan',
      'Vesu',
      'Varachha',
      'Katargam',
      'Piplod',
      'Rander',
      'Ring Road',
      'Athwa Lines'
    ]
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    hindiName: 'वडोदरा',
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    tier: 2,
    pincodePrefixes: ['390', '391'],
    popularAreas: ['Alkapuri', 'Manjalpur', 'Sayajigunj', 'Gotri', 'Karelibaug', 'Fatehgunj']
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    hindiName: 'राजकोट',
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    tier: 2,
    pincodePrefixes: ['360'],
    popularAreas: ['Kalawad Road', 'Yagnik Road', 'University Road', 'Mavdi', 'Gondal Road']
  },
  {
    id: 'new-delhi',
    name: 'New Delhi',
    hindiName: 'दिल्ली',
    state: 'Delhi NCR',
    stateHindi: 'दिल्ली एनसीआर',
    isPrimary: true,
    tier: 1,
    pincodePrefixes: ['110'],
    popularAreas: [
      'Connaught Place',
      'Rohini',
      'Dwarka',
      'Karol Bagh',
      'Laxmi Nagar',
      'Saket',
      'Lajpat Nagar',
      'Janakpuri',
      'Pitampura'
    ]
  },
  {
    id: 'noida',
    name: 'Noida',
    hindiName: 'नोएडा',
    state: 'Uttar Pradesh / NCR',
    stateHindi: 'उत्तर प्रदेश / एनसीआर',
    tier: 1,
    pincodePrefixes: ['201301', '201302', '201303', '201304', '201305', '201307', '2013'],
    popularAreas: ['Sector 18', 'Sector 62', 'Sector 15', 'Sector 76', 'Sector 137', 'Sector 50']
  },
  {
    id: 'greater-noida',
    name: 'Greater Noida',
    hindiName: 'ग्रेटर नोएडा',
    state: 'Uttar Pradesh / NCR',
    stateHindi: 'उत्तर प्रदेश / एनसीआर',
    tier: 2,
    pincodePrefixes: ['201306', '201308', '201310'],
    popularAreas: ['Pari Chowk', 'Gaur City', 'Alpha 1', 'Beta 2', 'Knowledge Park']
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    hindiName: 'गुरुग्राम',
    state: 'Haryana / NCR',
    stateHindi: 'हरियाणा / एनसीआर',
    tier: 1,
    pincodePrefixes: ['122'],
    popularAreas: ['Cyber City', 'DLF Phase 1-5', 'Golf Course Road', 'Sohna Road', 'Sector 14', 'Sector 56']
  },
  {
    id: 'faridabad',
    name: 'Faridabad',
    hindiName: 'फरीदाबाद',
    state: 'Haryana / NCR',
    stateHindi: 'हरियाणा / एनसीआर',
    tier: 2,
    pincodePrefixes: ['121'],
    popularAreas: ['Sector 15', 'Sector 16', 'NIT', 'Ballabgarh', 'Green Field']
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad',
    hindiName: 'गाजियाबाद',
    state: 'Uttar Pradesh / NCR',
    stateHindi: 'उत्तर प्रदेश / एनसीआर',
    tier: 2,
    pincodePrefixes: ['2010'],
    popularAreas: ['Indirapuram', 'Vaishali', 'Vasundhara', 'Raj Nagar Extension']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    hindiName: 'मुंबई',
    state: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    isPrimary: true,
    tier: 1,
    pincodePrefixes: ['400'],
    popularAreas: ['Andheri', 'Bandra', 'Borivali', 'Dadar', 'Powai', 'Malad', 'Goregaon', 'Juhu', 'Kurla']
  },
  {
    id: 'navi-mumbai',
    name: 'Navi Mumbai',
    hindiName: 'नवी मुंबई',
    state: 'Maharashtra',
    tier: 2,
    pincodePrefixes: ['4007', '4102'],
    popularAreas: ['Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Panvel']
  },
  {
    id: 'thane',
    name: 'Thane',
    hindiName: 'ठाणे',
    state: 'Maharashtra',
    tier: 2,
    pincodePrefixes: ['4006'],
    popularAreas: ['Ghodbunder Road', 'Majiwada', 'Vartak Nagar', 'Naupada']
  },
  {
    id: 'pune',
    name: 'Pune',
    hindiName: 'पुणे',
    state: 'Maharashtra',
    tier: 1,
    pincodePrefixes: ['411'],
    popularAreas: ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Wakad', 'Baner', 'Hadapsar', 'Shivaji Nagar']
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    hindiName: 'बेंगलुरु',
    state: 'Karnataka',
    tier: 1,
    pincodePrefixes: ['560', '562'],
    popularAreas: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Electronic City', 'Jayanagar']
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    hindiName: 'हैदराबाद',
    state: 'Telangana',
    tier: 1,
    pincodePrefixes: ['500', '501'],
    popularAreas: ['Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally']
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    hindiName: 'जयपुर',
    state: 'Rajasthan',
    tier: 2,
    pincodePrefixes: ['302'],
    popularAreas: ['Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park']
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    hindiName: 'लखनऊ',
    state: 'Uttar Pradesh',
    tier: 2,
    pincodePrefixes: ['226'],
    popularAreas: ['Gomti Nagar', 'Hazratganj', 'Alambagh', 'Indira Nagar', 'Mahanagar']
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    hindiName: 'कानपुर',
    state: 'Uttar Pradesh',
    tier: 2,
    pincodePrefixes: ['208'],
    popularAreas: ['Kakadeo', 'Civil Lines', 'Swaroop Nagar', 'Kalyanpur']
  },
  {
    id: 'patna',
    name: 'Patna',
    hindiName: 'पटना',
    state: 'Bihar',
    tier: 2,
    pincodePrefixes: ['800', '801'],
    popularAreas: ['Kankarbagh', 'Boring Road', 'Bailey Road', 'Raja Bazar', 'Danapur']
  },
  {
    id: 'indore',
    name: 'Indore',
    hindiName: 'इंदौर',
    state: 'Madhya Pradesh',
    tier: 2,
    pincodePrefixes: ['452'],
    popularAreas: ['Vijay Nagar', 'Palasia', 'Bhawarkua', 'Rajwada']
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    hindiName: 'भोपाल',
    state: 'Madhya Pradesh',
    tier: 2,
    pincodePrefixes: ['462'],
    popularAreas: ['MP Nagar', 'Arera Colony', 'Kolar Road']
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    hindiName: 'कोलकाता',
    state: 'West Bengal',
    tier: 1,
    pincodePrefixes: ['700', '711'],
    popularAreas: ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge']
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    hindiName: 'चंडीगढ़',
    state: 'Chandigarh',
    tier: 2,
    pincodePrefixes: ['160'],
    popularAreas: ['Sector 17', 'Sector 35', 'Sector 22', 'Sector 43']
  }
];

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

export function getCityByName(cityName) {
  if (!cityName) return null;
  const clean = cityName.trim().toLowerCase();
  return CITIES.find(
    (c) => c.name.toLowerCase() === clean || c.hindiName.toLowerCase() === clean
  ) || null;
}

export function getCityAreas(cityName) {
  const city = getCityByName(cityName);
  return city ? city.popularAreas : [];
}

export function getCityFromPincode(pincode) {
  if (!pincode) return null;
  const pinStr = pincode.toString().replace(/[^0-9]/g, '');
  if (pinStr.length < 3) return null;

  let bestMatch = null;
  let maxPrefixLength = 0;

  for (const city of CITIES) {
    for (const prefix of city.pincodePrefixes) {
      if (pinStr.startsWith(prefix) && prefix.length > maxPrefixLength) {
        maxPrefixLength = prefix.length;
        bestMatch = city;
      }
    }
  }

  return bestMatch;
}

export default CITIES;
