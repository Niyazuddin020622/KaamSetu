/**
 * KaamSetu City Master Data (Backend)
 * All India Standardized Cities Master
 */

const CITIES = [
  {
    "id": "ahmedabad",
    "name": "Ahmedabad",
    "hindiName": "अहमदाबाद",
    "slug": "ahmedabad",
    "tier": 1,
    "isPrimary": true,
    "state": "Gujarat",
    "stateHindi": "गुजरात",
    "stateCode": "GJ",
    "region": "West",
    "pincodes": {
      "exact": [
        "380001",
        "380006",
        "380009",
        "380015",
        "380051",
        "380054",
        "380058",
        "382424",
        "382481"
      ],
      "prefixes": [
        "380",
        "382"
      ],
      "samplePincode": "380015"
    },
    "pincodePrefixes": [
      "380",
      "382"
    ],
    "popularAreas": [
      "SG Highway",
      "Satellite",
      "Maninagar",
      "Bopal",
      "Vastrapur",
      "Navrangpura",
      "Bodakdev",
      "Chandkheda",
      "Naroda",
      "Prahlad Nagar",
      "Gota",
      "Nikol",
      "Thaltej",
      "Paldi",
      "C G Road",
      "Ashram Road",
      "Isanpur",
      "Ghatlodiya"
    ],
    "aliases": [
      "Amdavad",
      "Karnavati",
      "अमदावाद",
      "अहमदाबाद",
      "Ahmedabad City"
    ],
    "coordinates": {
      "latitude": 23.0225,
      "longitude": 72.5714,
      "defaultZoom": 12
    },
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Gujarati",
    "topServices": [
      "plumber",
      "electrician",
      "welder",
      "carpenter",
      "painter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 35
  },
  {
    "id": "surat",
    "name": "Surat",
    "hindiName": "सूरत",
    "slug": "surat",
    "tier": 1,
    "isPrimary": false,
    "state": "Gujarat",
    "stateHindi": "गुजरात",
    "stateCode": "GJ",
    "region": "West",
    "pincodes": {
      "exact": [
        "395001",
        "395003",
        "395007",
        "395009",
        "394210",
        "394221"
      ],
      "prefixes": [
        "395",
        "394"
      ],
      "samplePincode": "395007"
    },
    "pincodePrefixes": [
      "394",
      "395"
    ],
    "popularAreas": [
      "Adajan",
      "Vesu",
      "Varachha",
      "Katargam",
      "Piplod",
      "Rander",
      "Ring Road",
      "Athwa Lines",
      "City Light",
      "Udhna",
      "Pandesara"
    ],
    "aliases": [
      "Suryapur",
      "Diamond City",
      "सूरत"
    ],
    "coordinates": {
      "latitude": 21.1702,
      "longitude": 72.8311,
      "defaultZoom": 12
    },
    "languages": [
      "Gujarati",
      "Hindi"
    ],
    "primaryLanguage": "Gujarati",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "carpenter",
      "fabricator"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "vadodara",
    "name": "Vadodara",
    "hindiName": "वडोदरा",
    "slug": "vadodara",
    "tier": 2,
    "isPrimary": false,
    "state": "Gujarat",
    "stateHindi": "गुजरात",
    "stateCode": "GJ",
    "region": "West",
    "pincodes": {
      "exact": [
        "390001",
        "390007",
        "390011",
        "390020"
      ],
      "prefixes": [
        "390",
        "391"
      ],
      "samplePincode": "390007"
    },
    "pincodePrefixes": [
      "390",
      "391"
    ],
    "popularAreas": [
      "Alkapuri",
      "Manjalpur",
      "Sayajigunj",
      "Gotri",
      "Karelibaug",
      "Fatehgunj",
      "Akota",
      "Waghodia Road",
      "Vasna Road"
    ],
    "aliases": [
      "Baroda",
      "बरोडा",
      "वडोदरा",
      "Sanskari Nagari"
    ],
    "coordinates": {
      "latitude": 22.3072,
      "longitude": 73.1812,
      "defaultZoom": 12
    },
    "languages": [
      "Gujarati",
      "Hindi"
    ],
    "primaryLanguage": "Gujarati",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "rajkot",
    "name": "Rajkot",
    "hindiName": "राजकोट",
    "slug": "rajkot",
    "tier": 2,
    "isPrimary": false,
    "state": "Gujarat",
    "stateHindi": "गुजरात",
    "stateCode": "GJ",
    "region": "West",
    "pincodes": {
      "exact": [
        "360001",
        "360002",
        "360004",
        "360005"
      ],
      "prefixes": [
        "360"
      ],
      "samplePincode": "360005"
    },
    "pincodePrefixes": [
      "360"
    ],
    "popularAreas": [
      "Kalawad Road",
      "Yagnik Road",
      "University Road",
      "Mavdi",
      "Gondal Road",
      "150 Feet Ring Road",
      "Kothariya"
    ],
    "aliases": [
      "राजकोट",
      "Rangilu Rajkot"
    ],
    "coordinates": {
      "latitude": 22.3039,
      "longitude": 70.8022,
      "defaultZoom": 12
    },
    "languages": [
      "Gujarati",
      "Hindi"
    ],
    "primaryLanguage": "Gujarati",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "new-delhi",
    "name": "New Delhi",
    "hindiName": "दिल्ली",
    "slug": "new-delhi",
    "tier": 1,
    "isPrimary": true,
    "state": "Delhi NCR",
    "stateHindi": "दिल्ली / एनसीआर",
    "stateCode": "DL",
    "region": "North",
    "pincodes": {
      "exact": [
        "110001",
        "110005",
        "110019",
        "110024",
        "110034",
        "110075",
        "110085",
        "110092"
      ],
      "prefixes": [
        "110"
      ],
      "samplePincode": "110001"
    },
    "pincodePrefixes": [
      "110"
    ],
    "popularAreas": [
      "Connaught Place",
      "Rohini",
      "Dwarka",
      "Karol Bagh",
      "Laxmi Nagar",
      "Saket",
      "Lajpat Nagar",
      "Janakpuri",
      "Pitampura",
      "Hauz Khas",
      "Vasant Kunj",
      "Mayur Vihar",
      "Uttam Nagar",
      "Shahdara"
    ],
    "aliases": [
      "Delhi",
      "Dilli",
      "नई दिल्ली",
      "NCT of Delhi",
      "Central Delhi"
    ],
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.209,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter",
      "welder",
      "ac repair"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 40
  },
  {
    "id": "noida",
    "name": "Noida",
    "hindiName": "नोएडा",
    "slug": "noida",
    "tier": 1,
    "isPrimary": true,
    "state": "Uttar Pradesh / NCR",
    "stateHindi": "उत्तर प्रदेश / एनसीआर",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "201301",
        "201302",
        "201303",
        "201304",
        "201305",
        "201307",
        "201309",
        "201313",
        "201314",
        "201316",
        "201317"
      ],
      "prefixes": [
        "201301",
        "201302",
        "201303",
        "201304",
        "201305",
        "201307",
        "201309",
        "201313",
        "201314"
      ],
      "samplePincode": "201301"
    },
    "pincodePrefixes": [
      "201301",
      "201302",
      "201303",
      "201304",
      "201305",
      "201307",
      "201309",
      "201313",
      "201314"
    ],
    "popularAreas": [
      "Sector 18",
      "Sector 62",
      "Sector 15",
      "Sector 76",
      "Sector 137",
      "Sector 50",
      "Sector 128",
      "Noida Expressway",
      "Atta Market"
    ],
    "aliases": [
      "New Okhla",
      "NOIDA",
      "Gautam Buddha Nagar",
      "नोएडा"
    ],
    "coordinates": {
      "latitude": 28.5355,
      "longitude": 77.391,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "welder",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "greater-noida",
    "name": "Greater Noida",
    "hindiName": "ग्रेटर नोएडा",
    "slug": "greater-noida",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh / NCR",
    "stateHindi": "उत्तर प्रदेश / एनसीआर",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "201306",
        "201308",
        "201310",
        "201312",
        "201315",
        "201318"
      ],
      "prefixes": [
        "201306",
        "201308",
        "201310",
        "201312",
        "201315",
        "201318"
      ],
      "samplePincode": "201310"
    },
    "pincodePrefixes": [
      "201306",
      "201308",
      "201310",
      "201312",
      "201315",
      "201318"
    ],
    "popularAreas": [
      "Pari Chowk",
      "Gaur City",
      "Alpha 1",
      "Beta 2",
      "Knowledge Park",
      "Surajpur",
      "Ecotech",
      "Delta 1",
      "Greater Noida West",
      "Noida Extension"
    ],
    "aliases": [
      "Gr Noida",
      "Greater Noida West",
      "Noida Extension",
      "ग्रेटर नोएडा"
    ],
    "coordinates": {
      "latitude": 28.4744,
      "longitude": 77.504,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "mason",
      "welder",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "gurugram",
    "name": "Gurugram",
    "hindiName": "गुरुग्राम",
    "slug": "gurugram",
    "tier": 1,
    "isPrimary": false,
    "state": "Haryana / NCR",
    "stateHindi": "हरियाणा / एनसीआर",
    "stateCode": "HR",
    "region": "North",
    "pincodes": {
      "exact": [
        "122001",
        "122002",
        "122003",
        "122018",
        "122051"
      ],
      "prefixes": [
        "122"
      ],
      "samplePincode": "122002"
    },
    "pincodePrefixes": [
      "122"
    ],
    "popularAreas": [
      "Cyber City",
      "DLF Phase 1-5",
      "Golf Course Road",
      "Sohna Road",
      "Sector 14",
      "Sector 56",
      "Sector 29",
      "Sector 45",
      "Palam Vihar",
      "MG Road"
    ],
    "aliases": [
      "Gurgaon",
      "गुड़गांव",
      "गुरुग्राम",
      "Millennium City"
    ],
    "coordinates": {
      "latitude": 28.4595,
      "longitude": 77.0266,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "faridabad",
    "name": "Faridabad",
    "hindiName": "फरीदाबाद",
    "slug": "faridabad",
    "tier": 2,
    "isPrimary": false,
    "state": "Haryana / NCR",
    "stateHindi": "हरियाणा / एनसीआर",
    "stateCode": "HR",
    "region": "North",
    "pincodes": {
      "exact": [
        "121001",
        "121002",
        "121003",
        "121007"
      ],
      "prefixes": [
        "121"
      ],
      "samplePincode": "121002"
    },
    "pincodePrefixes": [
      "121"
    ],
    "popularAreas": [
      "Sector 15",
      "Sector 16",
      "NIT 1-5",
      "Ballabgarh",
      "Green Field",
      "Badkhal Lake",
      "Neharpar"
    ],
    "aliases": [
      "फरीदाबाद",
      "NIT Faridabad"
    ],
    "coordinates": {
      "latitude": 28.4089,
      "longitude": 77.3178,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "ghaziabad",
    "name": "Ghaziabad",
    "hindiName": "गाजियाबाद",
    "slug": "ghaziabad",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh / NCR",
    "stateHindi": "उत्तर प्रदेश / एनसीआर",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "201001",
        "201002",
        "201010",
        "201012",
        "201014"
      ],
      "prefixes": [
        "2010"
      ],
      "samplePincode": "201014"
    },
    "pincodePrefixes": [
      "2010"
    ],
    "popularAreas": [
      "Indirapuram",
      "Vaishali",
      "Vasundhara",
      "Raj Nagar Extension",
      "Crossings Republik",
      "Kaushambi",
      "Govindpuram"
    ],
    "aliases": [
      "गाजियाबाद",
      "Indirapuram",
      "Vaishali"
    ],
    "coordinates": {
      "latitude": 28.6692,
      "longitude": 77.4538,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "mason",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "mumbai",
    "name": "Mumbai",
    "hindiName": "मुंबई",
    "slug": "mumbai",
    "tier": 1,
    "isPrimary": true,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "400001",
        "400050",
        "400053",
        "400076",
        "400092"
      ],
      "prefixes": [
        "400"
      ],
      "samplePincode": "400050"
    },
    "pincodePrefixes": [
      "400"
    ],
    "popularAreas": [
      "Andheri",
      "Bandra",
      "Borivali",
      "Dadar",
      "Powai",
      "Malad",
      "Goregaon",
      "Juhu",
      "Kurla",
      "Chembur",
      "Colaba",
      "Ghatkopar",
      "Kandivali",
      "Santacruz"
    ],
    "aliases": [
      "Bombay",
      "बंबई",
      "मुंबई",
      "Mumbai City"
    ],
    "coordinates": {
      "latitude": 19.076,
      "longitude": 72.8777,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 35
  },
  {
    "id": "navi-mumbai",
    "name": "Navi Mumbai",
    "hindiName": "नवी मुंबई",
    "slug": "navi-mumbai",
    "tier": 2,
    "isPrimary": false,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "400703",
        "400705",
        "400706",
        "410206",
        "410210"
      ],
      "prefixes": [
        "4007",
        "4102"
      ],
      "samplePincode": "400703"
    },
    "pincodePrefixes": [
      "4007",
      "4102"
    ],
    "popularAreas": [
      "Vashi",
      "Nerul",
      "Belapur",
      "Kharghar",
      "Panvel",
      "Airoli",
      "Kopar Khairane",
      "Seawoods"
    ],
    "aliases": [
      "New Bombay",
      "नवी मुंबई",
      "Vashi",
      "Panvel"
    ],
    "coordinates": {
      "latitude": 19.033,
      "longitude": 73.0297,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "thane",
    "name": "Thane",
    "hindiName": "ठाणे",
    "slug": "thane",
    "tier": 2,
    "isPrimary": false,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "400601",
        "400602",
        "400607",
        "400615"
      ],
      "prefixes": [
        "4006"
      ],
      "samplePincode": "400601"
    },
    "pincodePrefixes": [
      "4006"
    ],
    "popularAreas": [
      "Ghodbunder Road",
      "Majiwada",
      "Vartak Nagar",
      "Naupada",
      "Kolshet Road",
      "Hiranandani Estate"
    ],
    "aliases": [
      "Thana",
      "ठाणे"
    ],
    "coordinates": {
      "latitude": 19.2183,
      "longitude": 72.9781,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "pune",
    "name": "Pune",
    "hindiName": "पुणे",
    "slug": "pune",
    "tier": 1,
    "isPrimary": false,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "411001",
        "411014",
        "411038",
        "411057"
      ],
      "prefixes": [
        "411"
      ],
      "samplePincode": "411014"
    },
    "pincodePrefixes": [
      "411"
    ],
    "popularAreas": [
      "Kothrud",
      "Hinjewadi",
      "Viman Nagar",
      "Wakad",
      "Baner",
      "Hadapsar",
      "Aundh",
      "Magarpatta",
      "Pimpri-Chinchwad"
    ],
    "aliases": [
      "Poona",
      "पुणे",
      "Pimpri Chinchwad"
    ],
    "coordinates": {
      "latitude": 18.5204,
      "longitude": 73.8567,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "welder",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 35
  },
  {
    "id": "bengaluru",
    "name": "Bengaluru",
    "hindiName": "बेंगलुरु",
    "slug": "bengaluru",
    "tier": 1,
    "isPrimary": false,
    "state": "Karnataka",
    "stateHindi": "कर्नाटक",
    "stateCode": "KA",
    "region": "South",
    "pincodes": {
      "exact": [
        "560001",
        "560034",
        "560066",
        "560100",
        "560102"
      ],
      "prefixes": [
        "560",
        "562"
      ],
      "samplePincode": "560034"
    },
    "pincodePrefixes": [
      "560",
      "562"
    ],
    "popularAreas": [
      "Koramangala",
      "Indiranagar",
      "Whitefield",
      "HSR Layout",
      "Electronic City",
      "Jayanagar",
      "BTM Layout",
      "Marathahalli",
      "Hebbal"
    ],
    "aliases": [
      "Bangalore",
      "बंगलौर",
      "बेंगलुरु",
      "Silicon Valley of India"
    ],
    "coordinates": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "defaultZoom": 12
    },
    "languages": [
      "Kannada",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Kannada",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 40
  },
  {
    "id": "hyderabad",
    "name": "Hyderabad",
    "hindiName": "हैदराबाद",
    "slug": "hyderabad",
    "tier": 1,
    "isPrimary": false,
    "state": "Telangana",
    "stateHindi": "तेलंगाना",
    "stateCode": "TS",
    "region": "South",
    "pincodes": {
      "exact": [
        "500001",
        "500032",
        "500081",
        "500084"
      ],
      "prefixes": [
        "500",
        "501"
      ],
      "samplePincode": "500081"
    },
    "pincodePrefixes": [
      "500",
      "501"
    ],
    "popularAreas": [
      "Hitech City",
      "Gachibowli",
      "Banjara Hills",
      "Jubilee Hills",
      "Kukatpally",
      "Madhapur",
      "Secunderabad",
      "Ameerpet",
      "Kondapur"
    ],
    "aliases": [
      "Cyberabad",
      "हैदराबाद",
      "Secunderabad",
      "City of Pearls"
    ],
    "coordinates": {
      "latitude": 17.385,
      "longitude": 78.4867,
      "defaultZoom": 12
    },
    "languages": [
      "Telugu",
      "Hindi",
      "English",
      "Urdu"
    ],
    "primaryLanguage": "Telugu",
    "topServices": [
      "electrician",
      "plumber",
      "welder",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 35
  },
  {
    "id": "jaipur",
    "name": "Jaipur",
    "hindiName": "जयपुर",
    "slug": "jaipur",
    "tier": 2,
    "isPrimary": false,
    "state": "Rajasthan",
    "stateHindi": "राजस्थान",
    "stateCode": "RJ",
    "region": "North",
    "pincodes": {
      "exact": [
        "302001",
        "302017",
        "302020",
        "302033"
      ],
      "prefixes": [
        "302"
      ],
      "samplePincode": "302017"
    },
    "pincodePrefixes": [
      "302"
    ],
    "popularAreas": [
      "Vaishali Nagar",
      "Malviya Nagar",
      "Mansarovar",
      "C-Scheme",
      "Raja Park",
      "Jagatpura",
      "Tonk Road"
    ],
    "aliases": [
      "Pink City",
      "जयपुर"
    ],
    "coordinates": {
      "latitude": 26.9124,
      "longitude": 75.7873,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Rajasthani",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "mason",
      "painter",
      "electrician",
      "plumber",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "lucknow",
    "name": "Lucknow",
    "hindiName": "लखनऊ",
    "slug": "lucknow",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "226001",
        "226010",
        "226016",
        "226024"
      ],
      "prefixes": [
        "226"
      ],
      "samplePincode": "226010"
    },
    "pincodePrefixes": [
      "226"
    ],
    "popularAreas": [
      "Gomti Nagar",
      "Hazratganj",
      "Alambagh",
      "Indira Nagar",
      "Mahanagar",
      "Aliganj",
      "Jankipuram"
    ],
    "aliases": [
      "City of Nawabs",
      "लखनऊ"
    ],
    "coordinates": {
      "latitude": 26.8467,
      "longitude": 80.9462,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "mason",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "kanpur",
    "name": "Kanpur",
    "hindiName": "कानपुर",
    "slug": "kanpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "208001",
        "208002",
        "208012",
        "208024"
      ],
      "prefixes": [
        "208"
      ],
      "samplePincode": "208001"
    },
    "pincodePrefixes": [
      "208"
    ],
    "popularAreas": [
      "Kakadeo",
      "Civil Lines",
      "Swaroop Nagar",
      "Govind Nagar",
      "Kidwai Nagar",
      "Kalyanpur"
    ],
    "aliases": [
      "Cawnpore",
      "कानपुर"
    ],
    "coordinates": {
      "latitude": 26.4499,
      "longitude": 80.3319,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "patna",
    "name": "Patna",
    "hindiName": "पटना",
    "slug": "patna",
    "tier": 2,
    "isPrimary": false,
    "state": "Bihar",
    "stateHindi": "बिहार",
    "stateCode": "BR",
    "region": "East",
    "pincodes": {
      "exact": [
        "800001",
        "800013",
        "800020",
        "800024"
      ],
      "prefixes": [
        "800",
        "801"
      ],
      "samplePincode": "800001"
    },
    "pincodePrefixes": [
      "800",
      "801"
    ],
    "popularAreas": [
      "Kankarbagh",
      "Boring Road",
      "Bailey Road",
      "Raja Bazar",
      "Danapur",
      "Patliputra Colony"
    ],
    "aliases": [
      "Pataliputra",
      "पटना"
    ],
    "coordinates": {
      "latitude": 25.5941,
      "longitude": 85.1376,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Bhojpuri",
      "Maithili",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "mason",
      "carpenter",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "indore",
    "name": "Indore",
    "hindiName": "इंदौर",
    "slug": "indore",
    "tier": 2,
    "isPrimary": false,
    "state": "Madhya Pradesh",
    "stateHindi": "मध्य प्रदेश",
    "stateCode": "MP",
    "region": "Central",
    "pincodes": {
      "exact": [
        "452001",
        "452010",
        "452016"
      ],
      "prefixes": [
        "452"
      ],
      "samplePincode": "452010"
    },
    "pincodePrefixes": [
      "452"
    ],
    "popularAreas": [
      "Vijay Nagar",
      "Palasia",
      "Bhawarkua",
      "Rajwada",
      "Rau",
      "Annapurna Road"
    ],
    "aliases": [
      "इंदौर",
      "Mini Mumbai"
    ],
    "coordinates": {
      "latitude": 22.7196,
      "longitude": 75.8577,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "bhopal",
    "name": "Bhopal",
    "hindiName": "भोपाल",
    "slug": "bhopal",
    "tier": 2,
    "isPrimary": false,
    "state": "Madhya Pradesh",
    "stateHindi": "मध्य प्रदेश",
    "stateCode": "MP",
    "region": "Central",
    "pincodes": {
      "exact": [
        "462001",
        "462016",
        "462023"
      ],
      "prefixes": [
        "462"
      ],
      "samplePincode": "462016"
    },
    "pincodePrefixes": [
      "462"
    ],
    "popularAreas": [
      "MP Nagar",
      "Arera Colony",
      "Kolar Road",
      "Hoshangabad Road",
      "Shahpura"
    ],
    "aliases": [
      "भोपाल",
      "City of Lakes"
    ],
    "coordinates": {
      "latitude": 23.2599,
      "longitude": 77.4126,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "mason",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "kolkata",
    "name": "Kolkata",
    "hindiName": "कोलकाता",
    "slug": "kolkata",
    "tier": 1,
    "isPrimary": false,
    "state": "West Bengal",
    "stateHindi": "पश्चिम बंगाल",
    "stateCode": "WB",
    "region": "East",
    "pincodes": {
      "exact": [
        "700001",
        "700091",
        "700156"
      ],
      "prefixes": [
        "700",
        "711"
      ],
      "samplePincode": "700091"
    },
    "pincodePrefixes": [
      "700",
      "711"
    ],
    "popularAreas": [
      "Salt Lake",
      "New Town",
      "Park Street",
      "Howrah",
      "Gariahat",
      "Dum Dum",
      "Ballygunge"
    ],
    "aliases": [
      "Calcutta",
      "कलकत्ता",
      "कोलकाता",
      "City of Joy"
    ],
    "coordinates": {
      "latitude": 22.5726,
      "longitude": 88.3639,
      "defaultZoom": 12
    },
    "languages": [
      "Bengali",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Bengali",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "mason",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 35
  },
  {
    "id": "chandigarh",
    "name": "Chandigarh",
    "hindiName": "चंडीगढ़",
    "slug": "chandigarh",
    "tier": 2,
    "isPrimary": false,
    "state": "Chandigarh",
    "stateHindi": "चंडीगढ़ / ट्राइसिटी",
    "stateCode": "CH",
    "region": "North",
    "pincodes": {
      "exact": [
        "160017",
        "160022",
        "160036",
        "160055"
      ],
      "prefixes": [
        "160"
      ],
      "samplePincode": "160017"
    },
    "pincodePrefixes": [
      "160"
    ],
    "popularAreas": [
      "Sector 17",
      "Sector 35",
      "Sector 22",
      "Sector 43",
      "Manimajra",
      "Mohali Phase 7",
      "Panchkula Sector 20"
    ],
    "aliases": [
      "The City Beautiful",
      "चंडीगढ़",
      "Mohali",
      "Panchkula",
      "Tricity"
    ],
    "coordinates": {
      "latitude": 30.7333,
      "longitude": 76.7794,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Punjabi",
      "English"
    ],
    "primaryLanguage": "Punjabi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "chennai",
    "name": "Chennai",
    "hindiName": "चेन्नई",
    "slug": "chennai",
    "tier": 1,
    "isPrimary": false,
    "state": "Tamil Nadu",
    "stateHindi": "तमिलनाडु",
    "stateCode": "TN",
    "region": "South",
    "pincodes": {
      "exact": [
        "600001",
        "600017",
        "600028",
        "600040",
        "600042",
        "600096"
      ],
      "prefixes": [
        "600"
      ],
      "samplePincode": "600017"
    },
    "pincodePrefixes": [
      "600"
    ],
    "popularAreas": [
      "T. Nagar",
      "Anna Nagar",
      "Adyar",
      "Velachery",
      "Mylapore",
      "OMR",
      "Guindy",
      "Tambaram",
      "Nungambakkam",
      "Besant Nagar"
    ],
    "aliases": [
      "Madras",
      "मद्रास",
      "चेन्नई"
    ],
    "coordinates": {
      "latitude": 13.0827,
      "longitude": 80.2707,
      "defaultZoom": 12
    },
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "primaryLanguage": "Tamil",
    "topServices": [
      "plumber",
      "electrician",
      "welder",
      "carpenter",
      "ac_technician"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 35
  },
  {
    "id": "coimbatore",
    "name": "Coimbatore",
    "hindiName": "कोयंबटूर",
    "slug": "coimbatore",
    "tier": 2,
    "isPrimary": false,
    "state": "Tamil Nadu",
    "stateHindi": "तमिलनाडु",
    "stateCode": "TN",
    "region": "South",
    "pincodes": {
      "exact": [
        "641001",
        "641002",
        "641012",
        "641018"
      ],
      "prefixes": [
        "641"
      ],
      "samplePincode": "641012"
    },
    "pincodePrefixes": [
      "641"
    ],
    "popularAreas": [
      "Gandhipuram",
      "RS Puram",
      "Peelamedu",
      "Saibaba Colony",
      "Saravanampatti",
      "Singanallur"
    ],
    "aliases": [
      "Kovai",
      "कोयंबटूर"
    ],
    "coordinates": {
      "latitude": 11.0168,
      "longitude": 76.9558,
      "defaultZoom": 12
    },
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "primaryLanguage": "Tamil",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mechanic",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "madurai",
    "name": "Madurai",
    "hindiName": "मदुरै",
    "slug": "madurai",
    "tier": 2,
    "isPrimary": false,
    "state": "Tamil Nadu",
    "stateHindi": "तमिलनाडु",
    "stateCode": "TN",
    "region": "South",
    "pincodes": {
      "exact": [
        "625001",
        "625002",
        "625020"
      ],
      "prefixes": [
        "625"
      ],
      "samplePincode": "625020"
    },
    "pincodePrefixes": [
      "625"
    ],
    "popularAreas": [
      "KK Nagar",
      "Anna Nagar",
      "Simmakkal",
      "Goripalayam",
      "Tallakulam",
      "Mattuthavani"
    ],
    "aliases": [
      "मदुरै",
      "Temple City"
    ],
    "coordinates": {
      "latitude": 9.9252,
      "longitude": 78.1198,
      "defaultZoom": 12
    },
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "primaryLanguage": "Tamil",
    "topServices": [
      "plumber",
      "mason",
      "electrician",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "ludhiana",
    "name": "Ludhiana",
    "hindiName": "लुधियाना",
    "slug": "ludhiana",
    "tier": 2,
    "isPrimary": false,
    "state": "Punjab",
    "stateHindi": "पंजाब",
    "stateCode": "PB",
    "region": "North",
    "pincodes": {
      "exact": [
        "141001",
        "141002",
        "141008",
        "141012"
      ],
      "prefixes": [
        "141"
      ],
      "samplePincode": "141001"
    },
    "pincodePrefixes": [
      "141"
    ],
    "popularAreas": [
      "Model Town",
      "Sarabha Nagar",
      "Civil Lines",
      "Ferozepur Road",
      "BRS Nagar",
      "Dugri",
      "Ghumar Mandi"
    ],
    "aliases": [
      "Ludhiana City",
      "लुधियाना"
    ],
    "coordinates": {
      "latitude": 30.901,
      "longitude": 75.8573,
      "defaultZoom": 12
    },
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Punjabi",
    "topServices": [
      "welder",
      "electrician",
      "mechanic",
      "carpenter",
      "plumber"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "amritsar",
    "name": "Amritsar",
    "hindiName": "अमृतसर",
    "slug": "amritsar",
    "tier": 2,
    "isPrimary": false,
    "state": "Punjab",
    "stateHindi": "पंजाब",
    "stateCode": "PB",
    "region": "North",
    "pincodes": {
      "exact": [
        "143001",
        "143002",
        "143005"
      ],
      "prefixes": [
        "143"
      ],
      "samplePincode": "143001"
    },
    "pincodePrefixes": [
      "143"
    ],
    "popularAreas": [
      "Ranjit Avenue",
      "Lawrence Road",
      "Mall Road",
      "Majitha Road",
      "Chheharta",
      "Putlighar"
    ],
    "aliases": [
      "अमृतसर",
      "Holy City"
    ],
    "coordinates": {
      "latitude": 31.634,
      "longitude": 74.8723,
      "defaultZoom": 12
    },
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Punjabi",
    "topServices": [
      "plumber",
      "electrician",
      "welder",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "jalandhar",
    "name": "Jalandhar",
    "hindiName": "जालंधर",
    "slug": "jalandhar",
    "tier": 2,
    "isPrimary": false,
    "state": "Punjab",
    "stateHindi": "पंजाब",
    "stateCode": "PB",
    "region": "North",
    "pincodes": {
      "exact": [
        "144001",
        "144002",
        "144003",
        "144008"
      ],
      "prefixes": [
        "144"
      ],
      "samplePincode": "144001"
    },
    "pincodePrefixes": [
      "144"
    ],
    "popularAreas": [
      "Model Town",
      "Jalandhar Cantt",
      "Rama Mandi",
      "Urban Estate",
      "Civil Lines",
      "BMC Chowk"
    ],
    "aliases": [
      "जालंधर",
      "Jullundur"
    ],
    "coordinates": {
      "latitude": 31.326,
      "longitude": 75.5762,
      "defaultZoom": 12
    },
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Punjabi",
    "topServices": [
      "electrician",
      "welder",
      "plumber",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "mohali",
    "name": "Mohali",
    "hindiName": "मोहाली",
    "slug": "mohali",
    "tier": 2,
    "isPrimary": false,
    "state": "Punjab",
    "stateHindi": "पंजाब",
    "stateCode": "PB",
    "region": "North",
    "pincodes": {
      "exact": [
        "160055",
        "160059",
        "160062",
        "160071"
      ],
      "prefixes": [
        "160"
      ],
      "samplePincode": "160059"
    },
    "pincodePrefixes": [
      "160"
    ],
    "popularAreas": [
      "Phase 3B2",
      "Phase 7",
      "Phase 5",
      "Sector 70",
      "Sector 82",
      "Aerocity",
      "Kharar Road"
    ],
    "aliases": [
      "SAS Nagar",
      "मोहाली",
      "Sahibzada Ajit Singh Nagar"
    ],
    "coordinates": {
      "latitude": 30.7046,
      "longitude": 76.7179,
      "defaultZoom": 12
    },
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Punjabi",
    "topServices": [
      "plumber",
      "electrician",
      "painter",
      "carpenter",
      "ac_technician"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "varanasi",
    "name": "Varanasi",
    "hindiName": "वाराणसी",
    "slug": "varanasi",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "221001",
        "221002",
        "221005",
        "221010"
      ],
      "prefixes": [
        "221"
      ],
      "samplePincode": "221002"
    },
    "pincodePrefixes": [
      "221"
    ],
    "popularAreas": [
      "Sigra",
      "Lanka",
      "Varanasi Cantt",
      "Bhelupur",
      "Shivpur",
      "Godowlia",
      "Mahmoorganj",
      "Pandeypur"
    ],
    "aliases": [
      "Banaras",
      "Kashi",
      "बनारस",
      "काशी",
      "वाराणसी"
    ],
    "coordinates": {
      "latitude": 25.3176,
      "longitude": 82.9739,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "mason",
      "painter",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "agra",
    "name": "Agra",
    "hindiName": "आगरा",
    "slug": "agra",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "282001",
        "282002",
        "282005",
        "282007"
      ],
      "prefixes": [
        "282"
      ],
      "samplePincode": "282002"
    },
    "pincodePrefixes": [
      "282"
    ],
    "popularAreas": [
      "Sanjay Place",
      "Kamla Nagar",
      "Tajganj",
      "Dayal Bagh",
      "Sikandra",
      "Fatehabad Road",
      "Shahganj"
    ],
    "aliases": [
      "आगरा",
      "Taj City"
    ],
    "coordinates": {
      "latitude": 27.1767,
      "longitude": 78.0081,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "mason",
      "welder",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "prayagraj",
    "name": "Prayagraj",
    "hindiName": "प्रयागराज",
    "slug": "prayagraj",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "211001",
        "211002",
        "211003",
        "211008"
      ],
      "prefixes": [
        "211"
      ],
      "samplePincode": "211001"
    },
    "pincodePrefixes": [
      "211"
    ],
    "popularAreas": [
      "Civil Lines",
      "Katra",
      "Georgetown",
      "Dhoomanganj",
      "Naini",
      "Tagore Town",
      "Kareli"
    ],
    "aliases": [
      "Allahabad",
      "इलाहाबाद",
      "प्रयागराज"
    ],
    "coordinates": {
      "latitude": 25.4358,
      "longitude": 81.8463,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "painter",
      "mason",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "meerut",
    "name": "Meerut",
    "hindiName": "मेरठ",
    "slug": "meerut",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "250001",
        "250002",
        "250004"
      ],
      "prefixes": [
        "250"
      ],
      "samplePincode": "250001"
    },
    "pincodePrefixes": [
      "250"
    ],
    "popularAreas": [
      "Shastri Nagar",
      "Ganga Nagar",
      "Abu Lane",
      "Modipuram",
      "Civil Lines",
      "Pallavpuram"
    ],
    "aliases": [
      "मेरठ"
    ],
    "coordinates": {
      "latitude": 28.9845,
      "longitude": 77.7064,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "gorakhpur",
    "name": "Gorakhpur",
    "hindiName": "गोरखपुर",
    "slug": "gorakhpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "273001",
        "273008",
        "273012"
      ],
      "prefixes": [
        "273"
      ],
      "samplePincode": "273001"
    },
    "pincodePrefixes": [
      "273"
    ],
    "popularAreas": [
      "Golghar",
      "Taramandal",
      "Rapti Nagar",
      "Civil Lines",
      "Mohaddipur",
      "Medical College Road"
    ],
    "aliases": [
      "गोरखपुर"
    ],
    "coordinates": {
      "latitude": 26.7606,
      "longitude": 83.3732,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "mason",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "ayodhya",
    "name": "Ayodhya",
    "hindiName": "अयोध्या",
    "slug": "ayodhya",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttar Pradesh",
    "stateHindi": "उत्तर प्रदेश",
    "stateCode": "UP",
    "region": "North",
    "pincodes": {
      "exact": [
        "224123",
        "224001",
        "224133"
      ],
      "prefixes": [
        "224"
      ],
      "samplePincode": "224123"
    },
    "pincodePrefixes": [
      "224"
    ],
    "popularAreas": [
      "Ramkot",
      "Naya Ghat",
      "Civil Lines",
      "Faizabad Chowk",
      "Devkali",
      "Rikabganj"
    ],
    "aliases": [
      "Faizabad",
      "अयोध्या",
      "फैजाबाद"
    ],
    "coordinates": {
      "latitude": 26.7922,
      "longitude": 82.1998,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Awadhi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "mason",
      "carpenter",
      "electrician",
      "plumber",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "jabalpur",
    "name": "Jabalpur",
    "hindiName": "जबलपुर",
    "slug": "jabalpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Madhya Pradesh",
    "stateHindi": "मध्य प्रदेश",
    "stateCode": "MP",
    "region": "Central",
    "pincodes": {
      "exact": [
        "482001",
        "482002",
        "482004"
      ],
      "prefixes": [
        "482"
      ],
      "samplePincode": "482001"
    },
    "pincodePrefixes": [
      "482"
    ],
    "popularAreas": [
      "Civil Lines",
      "Wright Town",
      "Napier Town",
      "Vijay Nagar",
      "Madan Mahal",
      "Gwarighat"
    ],
    "aliases": [
      "जबलपुर",
      "Sanskardhani"
    ],
    "coordinates": {
      "latitude": 23.1815,
      "longitude": 79.9864,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "gwalior",
    "name": "Gwalior",
    "hindiName": "ग्वालियर",
    "slug": "gwalior",
    "tier": 2,
    "isPrimary": false,
    "state": "Madhya Pradesh",
    "stateHindi": "मध्य प्रदेश",
    "stateCode": "MP",
    "region": "Central",
    "pincodes": {
      "exact": [
        "474001",
        "474006",
        "474009",
        "474011"
      ],
      "prefixes": [
        "474"
      ],
      "samplePincode": "474001"
    },
    "pincodePrefixes": [
      "474"
    ],
    "popularAreas": [
      "City Centre",
      "Lashkar",
      "Morar",
      "Thatipur",
      "Phoolbagh",
      "Padav"
    ],
    "aliases": [
      "ग्वालियर"
    ],
    "coordinates": {
      "latitude": 26.2183,
      "longitude": 78.1828,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "mason",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "ujjain",
    "name": "Ujjain",
    "hindiName": "उज्जैन",
    "slug": "ujjain",
    "tier": 2,
    "isPrimary": false,
    "state": "Madhya Pradesh",
    "stateHindi": "मध्य प्रदेश",
    "stateCode": "MP",
    "region": "Central",
    "pincodes": {
      "exact": [
        "456001",
        "456006",
        "456010"
      ],
      "prefixes": [
        "456"
      ],
      "samplePincode": "456001"
    },
    "pincodePrefixes": [
      "456"
    ],
    "popularAreas": [
      "Freeganj",
      "Mahakal Marg",
      "Nanakheda",
      "Rishi Nagar",
      "Sethji ki Kothi",
      "Dewas Road"
    ],
    "aliases": [
      "उज्जैन",
      "Mahakal Nagari"
    ],
    "coordinates": {
      "latitude": 23.1765,
      "longitude": 75.7885,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Malvi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "mason",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "gaya",
    "name": "Gaya",
    "hindiName": "गया",
    "slug": "gaya",
    "tier": 2,
    "isPrimary": false,
    "state": "Bihar",
    "stateHindi": "बिहार",
    "stateCode": "BR",
    "region": "East",
    "pincodes": {
      "exact": [
        "823001",
        "823002",
        "823003"
      ],
      "prefixes": [
        "823"
      ],
      "samplePincode": "823001"
    },
    "pincodePrefixes": [
      "823"
    ],
    "popularAreas": [
      "Civil Lines",
      "AP Colony",
      "White House Compound",
      "Bodh Gaya Road",
      "Delha",
      "Rampur"
    ],
    "aliases": [
      "गया",
      "Bodhgaya"
    ],
    "coordinates": {
      "latitude": 24.7914,
      "longitude": 85.0002,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Magahi",
      "Bhojpuri"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "mason",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "muzaffarpur",
    "name": "Muzaffarpur",
    "hindiName": "मुजफ्फरपुर",
    "slug": "muzaffarpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Bihar",
    "stateHindi": "बिहार",
    "stateCode": "BR",
    "region": "East",
    "pincodes": {
      "exact": [
        "842001",
        "842002",
        "842003"
      ],
      "prefixes": [
        "842"
      ],
      "samplePincode": "842001"
    },
    "pincodePrefixes": [
      "842"
    ],
    "popularAreas": [
      "Mithanpura",
      "Aamgola",
      "Motijheel",
      "Bhagwanpur",
      "Zero Mile",
      "Kalambagh Road",
      "Brahmpura"
    ],
    "aliases": [
      "मुजफ्फरपुर"
    ],
    "coordinates": {
      "latitude": 26.1209,
      "longitude": 85.3647,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Maithili",
      "Bhojpuri"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "bhagalpur",
    "name": "Bhagalpur",
    "hindiName": "भागलपुर",
    "slug": "bhagalpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Bihar",
    "stateHindi": "बिहार",
    "stateCode": "BR",
    "region": "East",
    "pincodes": {
      "exact": [
        "812001",
        "812002",
        "812007"
      ],
      "prefixes": [
        "812"
      ],
      "samplePincode": "812001"
    },
    "pincodePrefixes": [
      "812"
    ],
    "popularAreas": [
      "Adampur",
      "Tilkamanjhi",
      "Zero Mile",
      "Barari",
      "Nathnagar",
      "Khawaspur"
    ],
    "aliases": [
      "Silk City",
      "भागलपुर"
    ],
    "coordinates": {
      "latitude": 25.2425,
      "longitude": 86.9842,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Angika",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "mason",
      "welder"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "darbhanga",
    "name": "Darbhanga",
    "hindiName": "दरभंगा",
    "slug": "darbhanga",
    "tier": 2,
    "isPrimary": false,
    "state": "Bihar",
    "stateHindi": "बिहार",
    "stateCode": "BR",
    "region": "East",
    "pincodes": {
      "exact": [
        "846001",
        "846003",
        "846004"
      ],
      "prefixes": [
        "846"
      ],
      "samplePincode": "846001"
    },
    "pincodePrefixes": [
      "846"
    ],
    "popularAreas": [
      "Laheriasarai",
      "Mirzapur",
      "Benta",
      "Donar",
      "Allalpatti",
      "Tower Chowk"
    ],
    "aliases": [
      "दरभंगा"
    ],
    "coordinates": {
      "latitude": 26.1542,
      "longitude": 85.8918,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Maithili",
      "Urdu"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "mason",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "nagpur",
    "name": "Nagpur",
    "hindiName": "नागपुर",
    "slug": "nagpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "440001",
        "440010",
        "440012",
        "440022",
        "440025"
      ],
      "prefixes": [
        "440"
      ],
      "samplePincode": "440010"
    },
    "pincodePrefixes": [
      "440"
    ],
    "popularAreas": [
      "Dharampeth",
      "Sadar",
      "Ramdaspeth",
      "Wardha Road",
      "Sitabuldi",
      "Manish Nagar",
      "Pratap Nagar"
    ],
    "aliases": [
      "नागपुर",
      "Orange City"
    ],
    "coordinates": {
      "latitude": 21.1458,
      "longitude": 79.0882,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "nashik",
    "name": "Nashik",
    "hindiName": "नासिक",
    "slug": "nashik",
    "tier": 2,
    "isPrimary": false,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "422001",
        "422005",
        "422007",
        "422009"
      ],
      "prefixes": [
        "422"
      ],
      "samplePincode": "422005"
    },
    "pincodePrefixes": [
      "422"
    ],
    "popularAreas": [
      "College Road",
      "Gangapur Road",
      "Indira Nagar",
      "Panchavati",
      "Mumbai Naka",
      "Satpur",
      "Ambad"
    ],
    "aliases": [
      "Nasik",
      "नासिक",
      "नाशिक"
    ],
    "coordinates": {
      "latitude": 19.9975,
      "longitude": 73.7898,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "fabricator",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "aurangabad",
    "name": "Chhatrapati Sambhajinagar",
    "hindiName": "छत्रपति संभाजीनगर",
    "slug": "aurangabad",
    "tier": 2,
    "isPrimary": false,
    "state": "Maharashtra",
    "stateHindi": "महाराष्ट्र",
    "stateCode": "MH",
    "region": "West",
    "pincodes": {
      "exact": [
        "431001",
        "431003",
        "431005"
      ],
      "prefixes": [
        "431"
      ],
      "samplePincode": "431001"
    },
    "pincodePrefixes": [
      "431"
    ],
    "popularAreas": [
      "Cidco",
      "Garkheda",
      "Samarth Nagar",
      "Waluj",
      "Seven Hills",
      "Prozone Road"
    ],
    "aliases": [
      "Aurangabad",
      "औरंगाबाद",
      "संभाजीनगर"
    ],
    "coordinates": {
      "latitude": 19.8762,
      "longitude": 75.3433,
      "defaultZoom": 12
    },
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Marathi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mechanic"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "bhubaneswar",
    "name": "Bhubaneswar",
    "hindiName": "भुवनेश्वर",
    "slug": "bhubaneswar",
    "tier": 2,
    "isPrimary": false,
    "state": "Odisha",
    "stateHindi": "ओडिशा",
    "stateCode": "OD",
    "region": "East",
    "pincodes": {
      "exact": [
        "751001",
        "751007",
        "751012",
        "751024"
      ],
      "prefixes": [
        "751"
      ],
      "samplePincode": "751007"
    },
    "pincodePrefixes": [
      "751"
    ],
    "popularAreas": [
      "Saheed Nagar",
      "Nayapalli",
      "Patia",
      "Chandrasekharpur",
      "Khandagiri",
      "Jayadev Vihar",
      "Unit 4",
      "Baramunda"
    ],
    "aliases": [
      "Bhubaneshwar",
      "भुवनेश्वर"
    ],
    "coordinates": {
      "latitude": 20.2961,
      "longitude": 85.8245,
      "defaultZoom": 12
    },
    "languages": [
      "Odia",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Odia",
    "topServices": [
      "plumber",
      "electrician",
      "painter",
      "carpenter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "cuttack",
    "name": "Cuttack",
    "hindiName": "कटक",
    "slug": "cuttack",
    "tier": 2,
    "isPrimary": false,
    "state": "Odisha",
    "stateHindi": "ओडिशा",
    "stateCode": "OD",
    "region": "East",
    "pincodes": {
      "exact": [
        "753001",
        "753008",
        "753012"
      ],
      "prefixes": [
        "753"
      ],
      "samplePincode": "753001"
    },
    "pincodePrefixes": [
      "753"
    ],
    "popularAreas": [
      "Badambadi",
      "CDA Sector 9",
      "Buxi Bazar",
      "Ranihat",
      "Link Road",
      "Choudhury Bazar"
    ],
    "aliases": [
      "कटक",
      "Silver City"
    ],
    "coordinates": {
      "latitude": 20.4625,
      "longitude": 85.8828,
      "defaultZoom": 12
    },
    "languages": [
      "Odia",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Odia",
    "topServices": [
      "plumber",
      "electrician",
      "welder",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "rourkela",
    "name": "Rourkela",
    "hindiName": "राउरकेला",
    "slug": "rourkela",
    "tier": 2,
    "isPrimary": false,
    "state": "Odisha",
    "stateHindi": "ओडिशा",
    "stateCode": "OD",
    "region": "East",
    "pincodes": {
      "exact": [
        "769001",
        "769004",
        "769012"
      ],
      "prefixes": [
        "769"
      ],
      "samplePincode": "769001"
    },
    "pincodePrefixes": [
      "769"
    ],
    "popularAreas": [
      "Sector 5",
      "Chhend Colony",
      "Civil Township",
      "Udit Nagar",
      "Panposh",
      "Koel Nagar"
    ],
    "aliases": [
      "राउरकेला",
      "Steel City"
    ],
    "coordinates": {
      "latitude": 22.2604,
      "longitude": 84.8536,
      "defaultZoom": 12
    },
    "languages": [
      "Odia",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Odia",
    "topServices": [
      "welder",
      "electrician",
      "mechanic",
      "plumber"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "raipur",
    "name": "Raipur",
    "hindiName": "रायपुर",
    "slug": "raipur",
    "tier": 2,
    "isPrimary": false,
    "state": "Chhattisgarh",
    "stateHindi": "छत्तीसगढ़",
    "stateCode": "CG",
    "region": "Central",
    "pincodes": {
      "exact": [
        "492001",
        "492006",
        "492010",
        "492015"
      ],
      "prefixes": [
        "492"
      ],
      "samplePincode": "492001"
    },
    "pincodePrefixes": [
      "492"
    ],
    "popularAreas": [
      "Telibandha",
      "Shankar Nagar",
      "Pandri",
      "VIP Road",
      "Samta Colony",
      "Tatibandh",
      "Devendra Nagar",
      "Pachpedi Naka"
    ],
    "aliases": [
      "रायपुर"
    ],
    "coordinates": {
      "latitude": 21.2514,
      "longitude": 81.6296,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Chhattisgarhi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "welder",
      "painter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "bhilai",
    "name": "Bhilai",
    "hindiName": "भिलाई",
    "slug": "bhilai",
    "tier": 2,
    "isPrimary": false,
    "state": "Chhattisgarh",
    "stateHindi": "छत्तीसगढ़",
    "stateCode": "CG",
    "region": "Central",
    "pincodes": {
      "exact": [
        "490001",
        "490006",
        "490020"
      ],
      "prefixes": [
        "490"
      ],
      "samplePincode": "490006"
    },
    "pincodePrefixes": [
      "490"
    ],
    "popularAreas": [
      "Sector 6",
      "Nehru Nagar",
      "Supela",
      "Civic Centre",
      "Smriti Nagar",
      "Power House",
      "Junwani"
    ],
    "aliases": [
      "भिलाई",
      "Bhilai Nagar",
      "Durg-Bhilai"
    ],
    "coordinates": {
      "latitude": 21.1938,
      "longitude": 81.3509,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Chhattisgarhi",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "welder",
      "electrician",
      "mechanic",
      "plumber",
      "fabricator"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "bilaspur",
    "name": "Bilaspur",
    "hindiName": "बिलासपुर",
    "slug": "bilaspur",
    "tier": 2,
    "isPrimary": false,
    "state": "Chhattisgarh",
    "stateHindi": "छत्तीसगढ़",
    "stateCode": "CG",
    "region": "Central",
    "pincodes": {
      "exact": [
        "495001",
        "495004",
        "495006"
      ],
      "prefixes": [
        "495"
      ],
      "samplePincode": "495001"
    },
    "pincodePrefixes": [
      "495"
    ],
    "popularAreas": [
      "Vyas Nagar",
      "Mangla",
      "Link Road",
      "Sarkanda",
      "Rajkishore Nagar",
      "Torwa",
      "Civil Lines"
    ],
    "aliases": [
      "बिलासपुर"
    ],
    "coordinates": {
      "latitude": 22.0797,
      "longitude": 82.1409,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Chhattisgarhi"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "electrician",
      "plumber",
      "mason",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "ranchi",
    "name": "Ranchi",
    "hindiName": "राँची",
    "slug": "ranchi",
    "tier": 2,
    "isPrimary": false,
    "state": "Jharkhand",
    "stateHindi": "झारखंड",
    "stateCode": "JH",
    "region": "East",
    "pincodes": {
      "exact": [
        "834001",
        "834002",
        "834004",
        "834008"
      ],
      "prefixes": [
        "834"
      ],
      "samplePincode": "834001"
    },
    "pincodePrefixes": [
      "834"
    ],
    "popularAreas": [
      "Lalpur",
      "Morabadi",
      "Hinoo",
      "Harmu",
      "Doranda",
      "Ratu Road",
      "Bariatu",
      "Kanke Road"
    ],
    "aliases": [
      "रांची",
      "City of Waterfalls"
    ],
    "coordinates": {
      "latitude": 23.3441,
      "longitude": 85.3096,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Nagpuri",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  },
  {
    "id": "jamshedpur",
    "name": "Jamshedpur",
    "hindiName": "जमशेदपुर",
    "slug": "jamshedpur",
    "tier": 2,
    "isPrimary": false,
    "state": "Jharkhand",
    "stateHindi": "झारखंड",
    "stateCode": "JH",
    "region": "East",
    "pincodes": {
      "exact": [
        "831001",
        "831002",
        "831004",
        "831011"
      ],
      "prefixes": [
        "831"
      ],
      "samplePincode": "831001"
    },
    "pincodePrefixes": [
      "831"
    ],
    "popularAreas": [
      "Bistupur",
      "Sakchi",
      "Telco",
      "Kadma",
      "Sonari",
      "Mango",
      "Golmuri",
      "Baridih"
    ],
    "aliases": [
      "Tatanagar",
      "टाटानगर",
      "जमशेदपुर"
    ],
    "coordinates": {
      "latitude": 22.8046,
      "longitude": 86.2029,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Bengali",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "welder",
      "electrician",
      "plumber",
      "mechanic",
      "carpenter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "dehradun",
    "name": "Dehradun",
    "hindiName": "देहरादून",
    "slug": "dehradun",
    "tier": 2,
    "isPrimary": false,
    "state": "Uttarakhand",
    "stateHindi": "उत्तराखंड",
    "stateCode": "UK",
    "region": "North",
    "pincodes": {
      "exact": [
        "248001",
        "248006",
        "248009"
      ],
      "prefixes": [
        "248"
      ],
      "samplePincode": "248001"
    },
    "pincodePrefixes": [
      "248"
    ],
    "popularAreas": [
      "Rajpur Road",
      "Jakhan",
      "Clement Town",
      "Ballupur",
      "Dharampur",
      "Sahastradhara Road",
      "Vasant Vihar"
    ],
    "aliases": [
      "देहरादून"
    ],
    "coordinates": {
      "latitude": 30.3165,
      "longitude": 78.0322,
      "defaultZoom": 12
    },
    "languages": [
      "Hindi",
      "Garhwali",
      "English"
    ],
    "primaryLanguage": "Hindi",
    "topServices": [
      "plumber",
      "electrician",
      "carpenter",
      "painter"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 25
  },
  {
    "id": "guwahati",
    "name": "Guwahati",
    "hindiName": "गुवाहाटी",
    "slug": "guwahati",
    "tier": 2,
    "isPrimary": false,
    "state": "Assam",
    "stateHindi": "असम",
    "stateCode": "AS",
    "region": "East",
    "pincodes": {
      "exact": [
        "781001",
        "781005",
        "781006"
      ],
      "prefixes": [
        "781"
      ],
      "samplePincode": "781001"
    },
    "pincodePrefixes": [
      "781"
    ],
    "popularAreas": [
      "GS Road",
      "Paltan Bazar",
      "Dispur",
      "Zoo Road",
      "Jalukbari",
      "Chandmari",
      "Ulubari"
    ],
    "aliases": [
      "Gauhati",
      "गुवाहाटी"
    ],
    "coordinates": {
      "latitude": 26.1445,
      "longitude": 91.7362,
      "defaultZoom": 12
    },
    "languages": [
      "Assamese",
      "Bengali",
      "Hindi",
      "English"
    ],
    "primaryLanguage": "Assamese",
    "topServices": [
      "electrician",
      "plumber",
      "carpenter",
      "mason"
    ],
    "isServiceable": true,
    "launchStatus": "active",
    "coverageRadiusKm": 30
  }
];

function getCityFromPincode(pincode) {
  if (!pincode) return null;
  const pinStr = pincode.toString().replace(/[^0-9]/g, '');
  if (pinStr.length < 3) return null;

  if (pinStr.length === 6) {
    for (const city of CITIES) {
      if (city.pincodes && Array.isArray(city.pincodes.exact)) {
        if (city.pincodes.exact.includes(pinStr)) {
          return city;
        }
      }
    }
  }

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

function getCityByName(query) {
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

function getCityAreas(cityName) {
  const city = getCityByName(cityName);
  return city ? city.popularAreas : [];
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

function getNearbyCities(latitude, longitude, maxRadiusKm = 40) {
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

function isPincodeServiceable(pincode) {
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

function getCityOptions(includeAll = false) {
  const options = CITIES.map((c) => ({
    value: c.name,
    label: `${c.name} (${c.hindiName}) - ${c.state}`,
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

module.exports = {
  CITIES,
  getCityFromPincode,
  getCityByName,
  getCityAreas,
  calculateDistance,
  getNearbyCities,
  isPincodeServiceable,
  getCityOptions
};
