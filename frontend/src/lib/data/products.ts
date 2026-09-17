export interface LabDetails {
  protein: string;
  fat: string;
  carbohydrates: string;
  moisture: string;
  purityPercentage: number;
  adulterants: string;
  nablReportNo: string;
  testedDate: string;
  grade: string;
}

export interface RawProduct {
  id: string;
  name: string;
  hindiName: string;
  category: "vegetables" | "grains-pulses" | "spices" | "dairy-oils" | "meats-dryfruits";
  pricePerUnit: number;
  unit: "kg" | "Litre" | "Dozen";
  moq: number;
  stockAvailable: number;
  fpoSource: {
    name: string;
    location: string;
    certificateId: string;
  };
  labDetails: LabDetails;
  shelfLife: string;
  expiryDays: number;
  image: string;
  description: string;
}

export const RAW_PRODUCTS: RawProduct[] = [
  // --- VEGETABLES (Price List items + Organic Farm Produce) ---
  {
    id: "raw-veg-01",
    name: "Organic Potato",
    hindiName: "आलू (Pure Farm Harvest)",
    category: "vegetables",
    pricePerUnit: 13.5,
    unit: "kg",
    moq: 50,
    stockAvailable: 2500,
    fpoSource: {
      name: "Jaipur Farmers Producer Org",
      location: "Chomu, Rajasthan",
      certificateId: "FPO-RAJ-2026-081"
    },
    labDetails: {
      protein: "2.0g / 100g",
      fat: "0.1g / 100g",
      carbohydrates: "17.5g / 100g",
      moisture: "79.0%",
      purityPercentage: 99.9,
      adulterants: "0% Heavy Metals, 0% Chemical Ripeners",
      nablReportNo: "NABL-LAB-2026-POT-01",
      testedDate: "2026-08-08",
      grade: "Grade A+ Export Quality"
    },
    shelfLife: "30 Days in Cool Dark Ambient Storage",
    expiryDays: 30,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    description: "Farm-fresh unpeeled organic raw potatoes, naturally matured without hormones or chemical accelerators."
  },
  {
    id: "raw-veg-02",
    name: "Fresh Okra",
    hindiName: "भिंडी (Tender Lady Finger)",
    category: "vegetables",
    pricePerUnit: 60,
    unit: "kg",
    moq: 20,
    stockAvailable: 800,
    fpoSource: {
      name: "Alwar Agro Cooperative",
      location: "Alwar, Rajasthan",
      certificateId: "FPO-RAJ-2026-092"
    },
    labDetails: {
      protein: "1.9g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "7.5g / 100g",
      moisture: "89.5%",
      purityPercentage: 99.8,
      adulterants: "0% Malathion, 0% Synthetic Dyes",
      nablReportNo: "NABL-LAB-2026-OKR-02",
      testedDate: "2026-08-09",
      grade: "A Grade Tender"
    },
    shelfLife: "6 Days at 4°C - 8°C Cold Chain",
    expiryDays: 6,
    image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80",
    description: "Tender green organic raw bhindi sourced directly from regional FPO farms."
  },
  {
    id: "raw-veg-03",
    name: "Red Vine Tomatoes",
    hindiName: "टमाटर (Desi Vine Harvest)",
    category: "vegetables",
    pricePerUnit: 34.5,
    unit: "kg",
    moq: 40,
    stockAvailable: 1500,
    fpoSource: {
      name: "Nashik Horticultural FPO",
      location: "Nashik, Maharashtra",
      certificateId: "FPO-MAH-2026-044"
    },
    labDetails: {
      protein: "0.9g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "3.9g / 100g",
      moisture: "94.5%",
      purityPercentage: 99.9,
      adulterants: "0% Calcium Carbide, 0% Rhodamine B",
      nablReportNo: "NABL-LAB-2026-TOM-03",
      testedDate: "2026-08-09",
      grade: "Grade A+ High Lycopene"
    },
    shelfLife: "8 Days at 8°C Cold Storage",
    expiryDays: 8,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    description: "Naturally vine-ripened raw tomatoes rich in natural acidity and pulp, tested pesticide-free."
  },
  {
    id: "raw-veg-04",
    name: "Organic Carrots",
    hindiName: "गाजर (Red Crunchy Raw)",
    category: "vegetables",
    pricePerUnit: 52.5,
    unit: "kg",
    moq: 30,
    stockAvailable: 1200,
    fpoSource: {
      name: "Sikar Organic Vegetable FPO",
      location: "Sikar, Rajasthan",
      certificateId: "FPO-RAJ-2026-105"
    },
    labDetails: {
      protein: "0.9g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "9.6g / 100g",
      moisture: "88.0%",
      purityPercentage: 99.7,
      adulterants: "0% Chemical Colors, 0% Heavy Metals",
      nablReportNo: "NABL-LAB-2026-CAR-04",
      testedDate: "2026-08-08",
      grade: "Grade A High Beta-Carotene"
    },
    shelfLife: "14 Days at 4°C Refrigerated",
    expiryDays: 14,
    image: "https://images.unsplash.com/photo-1598170845058-12ef4a457539?auto=format&fit=crop&w=600&q=80",
    description: "Crisp raw organic carrots cultivated without synthetic growth regulators."
  },
  {
    id: "raw-veg-05",
    name: "Purple Brinjal / Eggplant",
    hindiName: "बैंगन (Fresh Purple)",
    category: "vegetables",
    pricePerUnit: 60,
    unit: "kg",
    moq: 25,
    stockAvailable: 900,
    fpoSource: {
      name: "Jaipur Farmers Producer Org",
      location: "Jaipur Rural, Rajasthan",
      certificateId: "FPO-RAJ-2026-088"
    },
    labDetails: {
      protein: "1.0g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "5.9g / 100g",
      moisture: "92.0%",
      purityPercentage: 99.8,
      adulterants: "0% Organophosphates, 0% Wax Coating",
      nablReportNo: "NABL-LAB-2026-BRN-05",
      testedDate: "2026-08-09",
      grade: "Grade A Glossy Raw"
    },
    shelfLife: "7 Days Ambient Cool Storage",
    expiryDays: 7,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    description: "Glossy purple raw brinjals harvested early morning for maximum freshness."
  },
  {
    id: "raw-veg-06",
    name: "Fresh Cauliflower",
    hindiName: "गोभी (Whole Curd)",
    category: "vegetables",
    pricePerUnit: 105,
    unit: "kg",
    moq: 20,
    stockAvailable: 600,
    fpoSource: {
      name: "Kota Agri Farmer Producer Co",
      location: "Kota, Rajasthan",
      certificateId: "FPO-RAJ-2026-112"
    },
    labDetails: {
      protein: "1.9g / 100g",
      fat: "0.3g / 100g",
      carbohydrates: "5.0g / 100g",
      moisture: "92.0%",
      purityPercentage: 99.9,
      adulterants: "0% Bleach Residue, 0% Insecticides",
      nablReportNo: "NABL-LAB-2026-CAU-06",
      testedDate: "2026-08-09",
      grade: "Grade A Tight Curd"
    },
    shelfLife: "7 Days at 4°C Storage",
    expiryDays: 7,
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80",
    description: "Firm white raw cauliflower heads free from synthetic post-harvest bleaching."
  },
  {
    id: "raw-veg-07",
    name: "Red Onions",
    hindiName: "प्याज (Dry Shell Raw)",
    category: "vegetables",
    pricePerUnit: 37,
    unit: "kg",
    moq: 50,
    stockAvailable: 3000,
    fpoSource: {
      name: "Nashik Onion Producer FPO",
      location: "Lasalgaon, Maharashtra",
      certificateId: "FPO-MAH-2026-012"
    },
    labDetails: {
      protein: "1.1g / 100g",
      fat: "0.1g / 100g",
      carbohydrates: "9.3g / 100g",
      moisture: "89.0%",
      purityPercentage: 99.9,
      adulterants: "0% Fungal Degradation, 0% Chemical Sprout Inhibitors",
      nablReportNo: "NABL-LAB-2026-ONI-07",
      testedDate: "2026-08-07",
      grade: "Grade A+ Export Quality"
    },
    shelfLife: "45 Days Dry Ventilated Storage",
    expiryDays: 45,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=600&q=80",
    description: "Dry cured red raw onions with high pungency and solid layers, ideal for hotel kitchens."
  },
  {
    id: "raw-veg-08",
    name: "Organic Garlic Bulbs",
    hindiName: "लहसुन (Whole Raw Bulbs)",
    category: "vegetables",
    pricePerUnit: 180,
    unit: "kg",
    moq: 15,
    stockAvailable: 500,
    fpoSource: {
      name: "Mandsaur Spices & Agri FPO",
      location: "Mandsaur, MP",
      certificateId: "FPO-MP-2026-055"
    },
    labDetails: {
      protein: "6.4g / 100g",
      fat: "0.5g / 100g",
      carbohydrates: "33.0g / 100g",
      moisture: "59.0%",
      purityPercentage: 99.8,
      adulterants: "0% Chlorine Bleach, 0% Synthetic Sprouting Agents",
      nablReportNo: "NABL-LAB-2026-GAR-08",
      testedDate: "2026-08-06",
      grade: "Grade A High Allicin"
    },
    shelfLife: "90 Days Dry Ventilated Storage",
    expiryDays: 90,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80",
    description: "Pungent white raw garlic bulbs naturally shade-cured with high allicin content."
  },
  {
    id: "raw-veg-09",
    name: "Raw Ginger Root",
    hindiName: "अदरक (Fresh Farm Ginger)",
    category: "vegetables",
    pricePerUnit: 140,
    unit: "kg",
    moq: 15,
    stockAvailable: 600,
    fpoSource: {
      name: "Wayanad Organic Spices FPO",
      location: "Wayanad, Kerala",
      certificateId: "FPO-KER-2026-019"
    },
    labDetails: {
      protein: "1.8g / 100g",
      fat: "0.8g / 100g",
      carbohydrates: "17.8g / 100g",
      moisture: "79.0%",
      purityPercentage: 99.9,
      adulterants: "0% Acid Wash, 0% Sulphur Dioxide Bleach",
      nablReportNo: "NABL-LAB-2026-GIN-09",
      testedDate: "2026-08-08",
      grade: "Grade A High Gingerol"
    },
    shelfLife: "30 Days at 12°C Storage",
    expiryDays: 30,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    description: "Fibrous fresh raw ginger root free from chemical acid-wash processing."
  },
  {
    id: "raw-veg-10",
    name: "Organic Baby Spinach",
    hindiName: "पालक (Whole Leaf Raw)",
    category: "vegetables",
    pricePerUnit: 45,
    unit: "kg",
    moq: 15,
    stockAvailable: 400,
    fpoSource: {
      name: "Jaipur Greens FPO",
      location: "Jaipur, Rajasthan",
      certificateId: "FPO-RAJ-2026-141"
    },
    labDetails: {
      protein: "2.9g / 100g",
      fat: "0.4g / 100g",
      carbohydrates: "3.6g / 100g",
      moisture: "91.4%",
      purityPercentage: 99.7,
      adulterants: "0% Lead / Cadmium Toxicity, 0% Nitrates",
      nablReportNo: "NABL-LAB-2026-SPI-10",
      testedDate: "2026-08-09",
      grade: "Grade A Iron-Rich"
    },
    shelfLife: "4 Days at 4°C Cold Storage",
    expiryDays: 4,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    description: "Fresh tender whole leaf raw spinach harvested from certified hydro-monitored soil."
  },
  {
    id: "raw-veg-11",
    name: "Green Bell Capsicum",
    hindiName: "शिमला मिर्च (Whole Raw)",
    category: "vegetables",
    pricePerUnit: 70,
    unit: "kg",
    moq: 20,
    stockAvailable: 750,
    fpoSource: {
      name: "Polyhouse Growers FPO",
      location: "Polyhouse Cluster, Ajmer",
      certificateId: "FPO-RAJ-2026-155"
    },
    labDetails: {
      protein: "1.0g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "4.6g / 100g",
      moisture: "92.0%",
      purityPercentage: 99.8,
      adulterants: "0% Paraffin Wax, 0% Pesticide Residue",
      nablReportNo: "NABL-LAB-2026-CAP-11",
      testedDate: "2026-08-09",
      grade: "Grade A Thick Wall"
    },
    shelfLife: "10 Days at 8°C Cold Chain",
    expiryDays: 10,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
    description: "Thick-walled green raw capsicum grown in controlled organic polyhouse farms."
  },
  {
    id: "raw-veg-12",
    name: "Fresh Green Chillies",
    hindiName: "हरी मिर्च (Spicy Raw)",
    category: "vegetables",
    pricePerUnit: 65,
    unit: "kg",
    moq: 10,
    stockAvailable: 500,
    fpoSource: {
      name: "Guntur Pepper Growers FPO",
      location: "Guntur, AP",
      certificateId: "FPO-AP-2026-022"
    },
    labDetails: {
      protein: "2.0g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "9.4g / 100g",
      moisture: "88.0%",
      purityPercentage: 99.9,
      adulterants: "0% Chemical Green Dye, 0% Synthetic Preservatives",
      nablReportNo: "NABL-LAB-2026-GCH-12",
      testedDate: "2026-08-09",
      grade: "Grade A High Capsaicin"
    },
    shelfLife: "10 Days at 6°C Storage",
    expiryDays: 10,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
    description: "Sharp and pungent fresh raw green chillies, tested 100% free of artificial green polish."
  },
  {
    id: "raw-veg-13",
    name: "Green Cabbage",
    hindiName: "पत्ता गोभी (Whole Head)",
    category: "vegetables",
    pricePerUnit: 28,
    unit: "kg",
    moq: 30,
    stockAvailable: 1100,
    fpoSource: {
      name: "Jaipur Farmers Producer Org",
      location: "Jaipur Rural, Rajasthan",
      certificateId: "FPO-RAJ-2026-089"
    },
    labDetails: {
      protein: "1.3g / 100g",
      fat: "0.1g / 100g",
      carbohydrates: "5.8g / 100g",
      moisture: "92.2%",
      purityPercentage: 99.9,
      adulterants: "0% Pesticides, 0% Synthetic Sprays",
      nablReportNo: "NABL-LAB-2026-CAB-13",
      testedDate: "2026-08-08",
      grade: "Grade A Compact Head"
    },
    shelfLife: "14 Days at 4°C Storage",
    expiryDays: 14,
    image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80",
    description: "Compact solid heads of raw green cabbage harvested directly from bio-monitored fields."
  },
  {
    id: "raw-veg-14",
    name: "Organic Broccoli",
    hindiName: "ब्रोकोली (Green Floret Head)",
    category: "vegetables",
    pricePerUnit: 160,
    unit: "kg",
    moq: 15,
    stockAvailable: 350,
    fpoSource: {
      name: "Himalayan Organic Producers",
      location: "Solan, HP",
      certificateId: "FPO-HP-2026-077"
    },
    labDetails: {
      protein: "2.8g / 100g",
      fat: "0.4g / 100g",
      carbohydrates: "6.6g / 100g",
      moisture: "89.0%",
      purityPercentage: 99.8,
      adulterants: "0% Synthetic Sprays, 0% Heavy Metals",
      nablReportNo: "NABL-LAB-2026-BRO-14",
      testedDate: "2026-08-09",
      grade: "Grade A+ Export Broccoli"
    },
    shelfLife: "7 Days at 2°C - 4°C Cold Storage",
    expiryDays: 7,
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80",
    description: "Deep green organic raw broccoli heads rich in sulforaphane, cold-chain shipped."
  },
  {
    id: "raw-veg-15",
    name: "Organic Beetroot",
    hindiName: "चुकंदर (Deep Red Root)",
    category: "vegetables",
    pricePerUnit: 48,
    unit: "kg",
    moq: 25,
    stockAvailable: 800,
    fpoSource: {
      name: "Sikar Organic Vegetable FPO",
      location: "Sikar, Rajasthan",
      certificateId: "FPO-RAJ-2026-108"
    },
    labDetails: {
      protein: "1.6g / 100g",
      fat: "0.2g / 100g",
      carbohydrates: "9.6g / 100g",
      moisture: "87.0%",
      purityPercentage: 99.9,
      adulterants: "0% Synthetic Dye, 0% Nitrate Runoff",
      nablReportNo: "NABL-LAB-2026-BET-15",
      testedDate: "2026-08-07",
      grade: "Grade A Nitrate-Monitored"
    },
    shelfLife: "25 Days in Cool Dark Storage",
    expiryDays: 25,
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
    description: "Deep crimson organic raw beetroots packed with natural nitrites and antioxidants."
  },

  // --- GRAINS, FLOURS & PULSES (Staples) ---
  {
    id: "raw-grain-01",
    name: "Pure Whole Wheat Aata",
    hindiName: "चक्की आटा (100% Whole Grain)",
    category: "grains-pulses",
    pricePerUnit: 42.5,
    unit: "kg",
    moq: 100,
    stockAvailable: 10000,
    fpoSource: {
      name: "Malwa Wheat Producer FPO",
      location: "Sehore, Madhya Pradesh",
      certificateId: "FPO-MP-2026-012"
    },
    labDetails: {
      protein: "12.8g / 100g",
      fat: "1.8g / 100g",
      carbohydrates: "71.2g / 100g",
      moisture: "10.5%",
      purityPercentage: 99.9,
      adulterants: "0% Maida Bleach, 0% Chalk Powder, 0% Talc",
      nablReportNo: "NABL-LAB-2026-WHT-01",
      testedDate: "2026-08-06",
      grade: "Grade A Sharbati Grain"
    },
    shelfLife: "90 Days Dry Storage",
    expiryDays: 90,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    description: "Stone-ground whole wheat raw flour milled from premium Sharbati wheat grains."
  },
  {
    id: "raw-grain-02",
    name: "Aged Royal Basmati Rice",
    hindiName: "बास्मती चावल (Raw 1121 Grain)",
    category: "grains-pulses",
    pricePerUnit: 115,
    unit: "kg",
    moq: 50,
    stockAvailable: 5000,
    fpoSource: {
      name: "Taraori Basmati Growers Co-op",
      location: "Karnal, Haryana",
      certificateId: "FPO-HAR-2026-033"
    },
    labDetails: {
      protein: "8.5g / 100g",
      fat: "0.6g / 100g",
      carbohydrates: "78.0g / 100g",
      moisture: "11.2%",
      purityPercentage: 99.9,
      adulterants: "0% Plastic Grains, 0% Mineral Oil Polish",
      nablReportNo: "NABL-LAB-2026-BAS-02",
      testedDate: "2026-08-05",
      grade: "1121 Extra Long Grain (8.35mm)"
    },
    shelfLife: "365 Days Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    description: "2-year naturally aged raw 1121 Basmati rice grains with distinct natural aroma."
  },
  {
    id: "raw-pulse-03",
    name: "Organic Yellow Moong Dal",
    hindiName: "मूंग दाल (Unpolished Raw)",
    category: "grains-pulses",
    pricePerUnit: 125,
    unit: "kg",
    moq: 50,
    stockAvailable: 3500,
    fpoSource: {
      name: "Bundelkhand Pulses FPO",
      location: "Jhansi, UP",
      certificateId: "FPO-UP-2026-088"
    },
    labDetails: {
      protein: "24.2g / 100g",
      fat: "1.2g / 100g",
      carbohydrates: "59.8g / 100g",
      moisture: "9.8%",
      purityPercentage: 99.8,
      adulterants: "0% Metanil Yellow, 0% Polish Oils",
      nablReportNo: "NABL-LAB-2026-MNG-03",
      testedDate: "2026-08-04",
      grade: "Grade A High Protein"
    },
    shelfLife: "180 Days Dry Storage",
    expiryDays: 180,
    image: "https://images.unsplash.com/photo-1585996877915-7034c4422c54?auto=format&fit=crop&w=600&q=80",
    description: "100% unpolished raw split yellow moong dal naturally sun-dried without chemical dyes."
  },
  {
    id: "raw-pulse-04",
    name: "Organic Chana Dal",
    hindiName: "चना दाल (Desi Unpolished)",
    category: "grains-pulses",
    pricePerUnit: 98,
    unit: "kg",
    moq: 50,
    stockAvailable: 4000,
    fpoSource: {
      name: "Rajasthan Gram Growers FPO",
      location: "Bikaner, Rajasthan",
      certificateId: "FPO-RAJ-2026-202"
    },
    labDetails: {
      protein: "22.5g / 100g",
      fat: "5.3g / 100g",
      carbohydrates: "57.8g / 100g",
      moisture: "10.0%",
      purityPercentage: 99.9,
      adulterants: "0% Khesari Dal Mixing, 0% Artificial Colors",
      nablReportNo: "NABL-LAB-2026-CHN-04",
      testedDate: "2026-08-07",
      grade: "Grade A Unpolished"
    },
    shelfLife: "180 Days Dry Storage",
    expiryDays: 180,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    description: "Unpolished raw Bengal gram lentils high in fiber and plant protein."
  },
  {
    id: "raw-pulse-05",
    name: "Organic Toor / Arhar Dal",
    hindiName: "तुअर दाल (Desi Raw)",
    category: "grains-pulses",
    pricePerUnit: 165,
    unit: "kg",
    moq: 50,
    stockAvailable: 3000,
    fpoSource: {
      name: "Latur Pulses Producer FPO",
      location: "Latur, Maharashtra",
      certificateId: "FPO-MAH-2026-091"
    },
    labDetails: {
      protein: "22.3g / 100g",
      fat: "1.7g / 100g",
      carbohydrates: "62.0g / 100g",
      moisture: "9.5%",
      purityPercentage: 99.8,
      adulterants: "0% Yellow Dye #5, 0% Soapstone Powder",
      nablReportNo: "NABL-LAB-2026-TOR-05",
      testedDate: "2026-08-06",
      grade: "Grade A+ Unpolished"
    },
    shelfLife: "180 Days Dry Storage",
    expiryDays: 180,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    description: "Pure unpolished raw pigeon pea pulse with authentic nutty flavor."
  },
  {
    id: "raw-pulse-06",
    name: "Whole Black Urad Dal",
    hindiName: "उड़द साबुत (Dal Makhani Raw)",
    category: "grains-pulses",
    pricePerUnit: 140,
    unit: "kg",
    moq: 40,
    stockAvailable: 2500,
    fpoSource: {
      name: "Malwa Agri Cooperative",
      location: "Ujjain, MP",
      certificateId: "FPO-MP-2026-089"
    },
    labDetails: {
      protein: "24.0g / 100g",
      fat: "1.4g / 100g",
      carbohydrates: "59.6g / 100g",
      moisture: "10.2%",
      purityPercentage: 99.9,
      adulterants: "0% Black Dye Coating, 0% Mineral Oil",
      nablReportNo: "NABL-LAB-2026-URD-06",
      testedDate: "2026-08-08",
      grade: "Grade A Bold Grain"
    },
    shelfLife: "180 Days Dry Storage",
    expiryDays: 180,
    image: "https://images.unsplash.com/photo-1585996877915-7034c4422c54?auto=format&fit=crop&w=600&q=80",
    description: "Bold whole black raw urad beans ideal for authentic slow-cooked dal preparations."
  },
  {
    id: "raw-pulse-07",
    name: "Red Rajma (Kidney Beans)",
    hindiName: "राजमा (Jammu Dark Red)",
    category: "grains-pulses",
    pricePerUnit: 155,
    unit: "kg",
    moq: 30,
    stockAvailable: 2000,
    fpoSource: {
      name: "Bhaderwah Organic Rajma FPO",
      location: "Doda, Jammu & Kashmir",
      certificateId: "FPO-JK-2026-015"
    },
    labDetails: {
      protein: "23.6g / 100g",
      fat: "0.8g / 100g",
      carbohydrates: "60.0g / 100g",
      moisture: "10.0%",
      purityPercentage: 99.8,
      adulterants: "0% Synthetic Red Color, 0% Chemical Wax",
      nablReportNo: "NABL-LAB-2026-RAJ-07",
      testedDate: "2026-08-07",
      grade: "Grade A+ Bhaderwah Variety"
    },
    shelfLife: "240 Days Dry Storage",
    expiryDays: 240,
    image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=600&q=80",
    description: "Authentic dark red raw kidney beans sourced from Jammu hill valley cooperatives."
  },
  {
    id: "raw-pulse-08",
    name: "Kabuli Chana (Chickpeas)",
    hindiName: "काबुली चना (Bold 12mm)",
    category: "grains-pulses",
    pricePerUnit: 135,
    unit: "kg",
    moq: 40,
    stockAvailable: 2200,
    fpoSource: {
      name: "Indore Chickpea Exporters FPO",
      location: "Indore, MP",
      certificateId: "FPO-MP-2026-114"
    },
    labDetails: {
      protein: "20.5g / 100g",
      fat: "6.0g / 100g",
      carbohydrates: "61.0g / 100g",
      moisture: "9.6%",
      purityPercentage: 99.9,
      adulterants: "0% Sulphur Bleach, 0% Insect Infestation",
      nablReportNo: "NABL-LAB-2026-KAB-08",
      testedDate: "2026-08-08",
      grade: "12mm Super Bold"
    },
    shelfLife: "240 Days Dry Storage",
    expiryDays: 240,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    description: "Jumbo 12mm white raw chickpeas with uniform size and tender cooking texture."
  },
  {
    id: "raw-grain-09",
    name: "Pure Gram Flour (Besan)",
    hindiName: "शुद्ध बेसन (Pure Chana Flour)",
    category: "grains-pulses",
    pricePerUnit: 88,
    unit: "kg",
    moq: 50,
    stockAvailable: 3000,
    fpoSource: {
      name: "Rajasthan Gram Growers FPO",
      location: "Bikaner, Rajasthan",
      certificateId: "FPO-RAJ-2026-205"
    },
    labDetails: {
      protein: "21.8g / 100g",
      fat: "5.0g / 100g",
      carbohydrates: "58.0g / 100g",
      moisture: "9.2%",
      purityPercentage: 99.9,
      adulterants: "0% Pea Flour Adulteration, 0% Metanil Yellow",
      nablReportNo: "NABL-LAB-2026-BSN-09",
      testedDate: "2026-08-08",
      grade: "Grade A 100% Pure Chana"
    },
    shelfLife: "90 Days Dry Storage",
    expiryDays: 90,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    description: "Pure unadulterated raw gram flour milled exclusively from de-husked Bengal gram."
  },
  {
    id: "raw-grain-10",
    name: "Organic Whole Rolled Oats",
    hindiName: "ओट्स (Raw Whole Grain)",
    category: "grains-pulses",
    pricePerUnit: 140,
    unit: "kg",
    moq: 20,
    stockAvailable: 1500,
    fpoSource: {
      name: "Punjab Grain Producers FPO",
      location: "Ludhiana, Punjab",
      certificateId: "FPO-PUN-2026-044"
    },
    labDetails: {
      protein: "13.5g / 100g",
      fat: "6.8g / 100g",
      carbohydrates: "66.0g / 100g",
      moisture: "8.5%",
      purityPercentage: 99.8,
      adulterants: "0% Preservatives, 0% Glyphosate",
      nablReportNo: "NABL-LAB-2026-OAT-10",
      testedDate: "2026-08-06",
      grade: "Grade A Whole Grain"
    },
    shelfLife: "180 Days Dry Storage",
    expiryDays: 180,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    description: "Clean unflavored raw whole rolled oats tested glyphosate-free."
  },

  // --- SPICES (Whole & Ground Spices from Price list) ---
  {
    id: "raw-spice-01",
    name: "Pure Haldi Powder",
    hindiName: "हल्दी (High Curcumin 5.2%)",
    category: "spices",
    pricePerUnit: 345,
    unit: "kg",
    moq: 10,
    stockAvailable: 1500,
    fpoSource: {
      name: "Lakadong Turmeric Growers FPO",
      location: "Jaintia Hills, Meghalaya",
      certificateId: "FPO-MEG-2026-004"
    },
    labDetails: {
      protein: "7.8g / 100g",
      fat: "9.9g / 100g",
      carbohydrates: "65.0g / 100g",
      moisture: "8.0%",
      purityPercentage: 99.9,
      adulterants: "0% Lead Chromate, 0% Metanil Yellow, 0% Chalk",
      nablReportNo: "NABL-LAB-2026-HAL-01",
      testedDate: "2026-08-08",
      grade: "5.2% High Curcumin Grade A+"
    },
    shelfLife: "365 Days Ambient Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-pure raw turmeric powder with natural 5.2% curcumin content, zero chemical dyes."
  },
  {
    id: "raw-spice-02",
    name: "Pure Dhaniya Powder",
    hindiName: "धनिया (Cold Ground Coriander)",
    category: "spices",
    pricePerUnit: 280,
    unit: "kg",
    moq: 15,
    stockAvailable: 1200,
    fpoSource: {
      name: "Ramganj Mandi Spice FPO",
      location: "Kota, Rajasthan",
      certificateId: "FPO-RAJ-2026-301"
    },
    labDetails: {
      protein: "12.3g / 100g",
      fat: "17.7g / 100g",
      carbohydrates: "55.0g / 100g",
      moisture: "7.5%",
      purityPercentage: 99.8,
      adulterants: "0% Dung/Starch Adulteration, 0% Added Volatile Oils",
      nablReportNo: "NABL-LAB-2026-DHN-02",
      testedDate: "2026-08-07",
      grade: "Grade A High Essential Oil"
    },
    shelfLife: "365 Days Ambient Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Cold-milled raw coriander powder retaining its rich aromatic essential oils."
  },
  {
    id: "raw-spice-03",
    name: "Pure Red Mirch Powder",
    hindiName: "लाल मिर्च (Stemless Red Chilli)",
    category: "spices",
    pricePerUnit: 350,
    unit: "kg",
    moq: 10,
    stockAvailable: 1400,
    fpoSource: {
      name: "Guntur Chilli Producers FPO",
      location: "Guntur, Andhra Pradesh",
      certificateId: "FPO-AP-2026-019"
    },
    labDetails: {
      protein: "12.0g / 100g",
      fat: "15.0g / 100g",
      carbohydrates: "56.0g / 100g",
      moisture: "8.2%",
      purityPercentage: 99.9,
      adulterants: "0% Sudan Red Dye, 0% Brick Dust, 0% Aflatoxins",
      nablReportNo: "NABL-LAB-2026-MRC-03",
      testedDate: "2026-08-08",
      grade: "Grade A High ASTA Color & Heat"
    },
    shelfLife: "365 Days Ambient Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
    description: "Vibrant stemless red chilli raw powder tested 100% free of carcinogenic Sudan dyes."
  },
  {
    id: "raw-spice-04",
    name: "Whole Cumin Seeds (Jeera)",
    hindiName: "जीरा (Unpolished Whole Seeds)",
    category: "spices",
    pricePerUnit: 390,
    unit: "kg",
    moq: 10,
    stockAvailable: 1000,
    fpoSource: {
      name: "Unjha Cumin Exporters FPO",
      location: "Unjha, Gujarat",
      certificateId: "FPO-GUJ-2026-055"
    },
    labDetails: {
      protein: "17.8g / 100g",
      fat: "22.3g / 100g",
      carbohydrates: "44.2g / 100g",
      moisture: "7.0%",
      purityPercentage: 99.9,
      adulterants: "0% Grass Seed Mixing, 0% Charcoal Dye",
      nablReportNo: "NABL-LAB-2026-JRA-04",
      testedDate: "2026-08-06",
      grade: "Grade A Machine Cleaned 99.5%"
    },
    shelfLife: "365 Days Ambient Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Machine-cleaned whole unpolished raw cumin seeds with high thymol aroma."
  },
  {
    id: "raw-spice-05",
    name: "Whole Black Pepper",
    hindiName: "काली मिर्च (Tellicherry Garbled)",
    category: "spices",
    pricePerUnit: 780,
    unit: "kg",
    moq: 5,
    stockAvailable: 400,
    fpoSource: {
      name: "Malabar Spices Cooperative",
      location: "Idukki, Kerala",
      certificateId: "FPO-KER-2026-012"
    },
    labDetails: {
      protein: "10.4g / 100g",
      fat: "3.3g / 100g",
      carbohydrates: "64.0g / 100g",
      moisture: "10.0%",
      purityPercentage: 99.8,
      adulterants: "0% Papaya Seed Mixing, 0% Mineral Oil Wax",
      nablReportNo: "NABL-LAB-2026-PEP-05",
      testedDate: "2026-08-05",
      grade: "TGSEB Tellicherry Garbled Extra Bold"
    },
    shelfLife: "730 Days Ambient Dry Storage",
    expiryDays: 730,
    image: "https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=600&q=80",
    description: "Extra bold garbled raw Tellicherry black peppercorns rich in natural piperine."
  },
  {
    id: "raw-spice-06",
    name: "Green Cardamom (Elaichi)",
    hindiName: "छोटी इलायची (8mm Bold Pods)",
    category: "spices",
    pricePerUnit: 2400,
    unit: "kg",
    moq: 2,
    stockAvailable: 150,
    fpoSource: {
      name: "Cardamom Planters FPO",
      location: "Munnar, Kerala",
      certificateId: "FPO-KER-2026-089"
    },
    labDetails: {
      protein: "10.8g / 100g",
      fat: "6.7g / 100g",
      carbohydrates: "68.0g / 100g",
      moisture: "9.5%",
      purityPercentage: 99.9,
      adulterants: "0% Chemical Green Polish, 0% Exhausted Pods",
      nablReportNo: "NABL-LAB-2026-ELA-06",
      testedDate: "2026-08-08",
      grade: "8mm Super Bold Green"
    },
    shelfLife: "365 Days Airtight Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    description: "Naturally dried 8mm bold green raw cardamom pods packed with sweet volatile oils."
  },
  {
    id: "raw-spice-07",
    name: "Whole Cloves (Laung)",
    hindiName: "लौंग (Bold Head Cloves)",
    category: "spices",
    pricePerUnit: 920,
    unit: "kg",
    moq: 3,
    stockAvailable: 300,
    fpoSource: {
      name: "Tamil Nadu Spices FPO",
      location: "Kanyakumari, Tamil Nadu",
      certificateId: "FPO-TN-2026-044"
    },
    labDetails: {
      protein: "6.0g / 100g",
      fat: "13.0g / 100g",
      carbohydrates: "65.0g / 100g",
      moisture: "8.0%",
      purityPercentage: 99.8,
      adulterants: "0% Exhausted Clove Stems, 0% Synthetic Eugenol",
      nablReportNo: "NABL-LAB-2026-CLV-07",
      testedDate: "2026-08-07",
      grade: "Grade A Hand-picked Bold"
    },
    shelfLife: "730 Days Dry Storage",
    expiryDays: 730,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Aromatic raw whole cloves with intact heads high in natural eugenol oil."
  },
  {
    id: "raw-spice-08",
    name: "Yellow Mustard Seeds",
    hindiName: "पीली सरसों (Whole Raw)",
    category: "spices",
    pricePerUnit: 110,
    unit: "kg",
    moq: 20,
    stockAvailable: 1800,
    fpoSource: {
      name: "Rajasthan Mustard Growers FPO",
      location: "Bharatpur, Rajasthan",
      certificateId: "FPO-RAJ-2026-402"
    },
    labDetails: {
      protein: "26.0g / 100g",
      fat: "36.2g / 100g",
      carbohydrates: "28.0g / 100g",
      moisture: "7.0%",
      purityPercentage: 99.9,
      adulterants: "0% Argemone Seeds Mixing, 0% Chemical Color",
      nablReportNo: "NABL-LAB-2026-MST-08",
      testedDate: "2026-08-07",
      grade: "Grade A Cleaned"
    },
    shelfLife: "365 Days Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Cleaned raw yellow mustard seeds tested 100% free of toxic Argemone adulterants."
  },
  {
    id: "raw-spice-09",
    name: "Whole Royal Garam Masala Mix",
    hindiName: "साबुत गरम मसाला (11 Whole Spices)",
    category: "spices",
    pricePerUnit: 650,
    unit: "kg",
    moq: 5,
    stockAvailable: 500,
    fpoSource: {
      name: "Wayanad Organic Spices FPO",
      location: "Wayanad, Kerala",
      certificateId: "FPO-KER-2026-033"
    },
    labDetails: {
      protein: "11.2g / 100g",
      fat: "14.5g / 100g",
      carbohydrates: "58.0g / 100g",
      moisture: "8.5%",
      purityPercentage: 99.9,
      adulterants: "0% Spent Spice Waste, 0% Synthetic Aromas",
      nablReportNo: "NABL-LAB-2026-GMM-09",
      testedDate: "2026-08-08",
      grade: "Grade A Master Blend"
    },
    shelfLife: "365 Days Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Hand-blended 11 raw unground whole spices (Cinnamon, Star Anise, Mace, Cardamom, Cloves, etc.)."
  },
  {
    id: "raw-spice-10",
    name: "Pure Cinnamon Sticks (Dalchini)",
    hindiName: "दालचीनी (Ceylon Quill Rolls)",
    category: "spices",
    pricePerUnit: 580,
    unit: "kg",
    moq: 5,
    stockAvailable: 450,
    fpoSource: {
      name: "Kerala Tree Spices FPO",
      location: "Pathanamthitta, Kerala",
      certificateId: "FPO-KER-2026-101"
    },
    labDetails: {
      protein: "4.0g / 100g",
      fat: "1.2g / 100g",
      carbohydrates: "80.0g / 100g",
      moisture: "9.0%",
      purityPercentage: 99.8,
      adulterants: "0% Cassia Bark Adulteration, 0% Coumarin Toxicity",
      nablReportNo: "NABL-LAB-2026-CIN-10",
      testedDate: "2026-08-06",
      grade: "True Ceylon C4 Quill"
    },
    shelfLife: "730 Days Dry Storage",
    expiryDays: 730,
    image: "https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=600&q=80",
    description: "Fragile sweet raw Ceylon cinnamon quills low in toxic coumarin compared to cheap Cassia."
  },

  // --- DAIRY & OILS ---
  {
    id: "raw-dairy-01",
    name: "Organic Pure Paneer",
    hindiName: "जैविक पनीर (100% Pure Milk)",
    category: "dairy-oils",
    pricePerUnit: 350,
    unit: "kg",
    moq: 10,
    stockAvailable: 800,
    fpoSource: {
      name: "Alwar Dairy Cooperative",
      location: "Alwar, Rajasthan",
      certificateId: "FPO-RAJ-2026-012"
    },
    labDetails: {
      protein: "18.5g / 100g",
      fat: "22.0g / 100g",
      carbohydrates: "2.4g / 100g",
      moisture: "53.0%",
      purityPercentage: 100.0,
      adulterants: "0% Urea, 0% Starch, 0% Detergent, 0% Palm Oil",
      nablReportNo: "NABL-LAB-2026-PAN-01",
      testedDate: "2026-08-09",
      grade: "NABL 100% Pure Dairy"
    },
    shelfLife: "10 Days at 4°C Cold Storage",
    expiryDays: 10,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    description: "Pure fresh unadulterated raw organic paneer block crafted from whole A2 cow milk."
  },
  {
    id: "raw-oil-02",
    name: "Cold-Pressed Kachi Ghani Mustard Oil",
    hindiName: "सरसों तेल (Kachi Ghani Mustard Oil)",
    category: "dairy-oils",
    pricePerUnit: 210,
    unit: "Litre",
    moq: 15,
    stockAvailable: 2500,
    fpoSource: {
      name: "Bharatpur Mustard Mills FPO",
      location: "Bharatpur, Rajasthan",
      certificateId: "FPO-RAJ-2026-512"
    },
    labDetails: {
      protein: "0.0g / 100g",
      fat: "99.8g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "0.1%",
      purityPercentage: 99.9,
      adulterants: "0% Argemone Oil, 0% Mineral Oil, 0% Chemical Solvents",
      nablReportNo: "NABL-LAB-2026-OIL-02",
      testedDate: "2026-08-08",
      grade: "Grade A Kachi Ghani 0.27% Allyl Isothiocyanate"
    },
    shelfLife: "365 Days Ambient Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    description: "Pungent traditional cold-pressed raw mustard oil extracted at low RPM, chemical solvent-free."
  },
  {
    id: "raw-dairy-03",
    name: "Pure A2 Cow Milk",
    hindiName: "A2 गाय का दूध (Unpasteurized Chilled Raw)",
    category: "dairy-oils",
    pricePerUnit: 75,
    unit: "Litre",
    moq: 20,
    stockAvailable: 1000,
    fpoSource: {
      name: "Gir Cow Breed Conservation FPO",
      location: "Pushkar, Rajasthan",
      certificateId: "FPO-RAJ-2026-001"
    },
    labDetails: {
      protein: "3.4g / 100g",
      fat: "4.5g / 100g",
      carbohydrates: "4.8g / 100g",
      moisture: "87.0%",
      purityPercentage: 100.0,
      adulterants: "0% Oxytocin, 0% Antibiotics, 0% Synthetic Water",
      nablReportNo: "NABL-LAB-2026-MIL-03",
      testedDate: "2026-08-10",
      grade: "100% Certified A2 Beta-Casein"
    },
    shelfLife: "2 Days at 2°C Cold Chain",
    expiryDays: 2,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    description: "Raw unpasteurized chilled A2 cow milk sourced from grass-fed indigenous Gir cows."
  },
  {
    id: "raw-dairy-04",
    name: "Pure Vedic Desi Ghee",
    hindiName: "देसी घी (Bilona Hand-Churned)",
    category: "dairy-oils",
    pricePerUnit: 1100,
    unit: "kg",
    moq: 5,
    stockAvailable: 600,
    fpoSource: {
      name: "Vedic Dairy Farmers FPO",
      location: "Mathura, UP",
      certificateId: "FPO-UP-2026-077"
    },
    labDetails: {
      protein: "0.0g / 100g",
      fat: "99.7g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "0.2%",
      purityPercentage: 100.0,
      adulterants: "0% Vanaspati, 0% Animal Fat, 0% Artificial Aroma",
      nablReportNo: "NABL-LAB-2026-GHE-04",
      testedDate: "2026-08-07",
      grade: "Grade A+ Traditional Bilona"
    },
    shelfLife: "365 Days Cool Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    description: "Golden aromatic raw A2 ghee crafted using traditional curd-churning Bilona method."
  },
  {
    id: "raw-dairy-05",
    name: "Fresh Whole Milk Curd (Dahi)",
    hindiName: "ताजा दही (Set Raw Curd)",
    category: "dairy-oils",
    pricePerUnit: 65,
    unit: "kg",
    moq: 15,
    stockAvailable: 700,
    fpoSource: {
      name: "Alwar Dairy Cooperative",
      location: "Alwar, Rajasthan",
      certificateId: "FPO-RAJ-2026-014"
    },
    labDetails: {
      protein: "3.5g / 100g",
      fat: "4.2g / 100g",
      carbohydrates: "4.5g / 100g",
      moisture: "86.5%",
      purityPercentage: 99.9,
      adulterants: "0% Gelatin Thickener, 0% Starch",
      nablReportNo: "NABL-LAB-2026-CRD-05",
      testedDate: "2026-08-09",
      grade: "Grade A Probiotic"
    },
    shelfLife: "5 Days at 4°C Storage",
    expiryDays: 5,
    image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80",
    description: "Thick natural set curd prepared from pure unadulterated whole milk."
  },
  {
    id: "raw-oil-06",
    name: "Cold-Pressed Sunflower Oil",
    hindiName: "सूरजमुखी का तेल (Wood Pressed)",
    category: "dairy-oils",
    pricePerUnit: 195,
    unit: "Litre",
    moq: 15,
    stockAvailable: 1500,
    fpoSource: {
      name: "Deccan Oilseeds Growers FPO",
      location: "Latur, Maharashtra",
      certificateId: "FPO-MAH-2026-118"
    },
    labDetails: {
      protein: "0.0g / 100g",
      fat: "99.9g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "0.1%",
      purityPercentage: 99.9,
      adulterants: "0% Hexane Solvent, 0% Mineral Oil",
      nablReportNo: "NABL-LAB-2026-SFO-06",
      testedDate: "2026-08-06",
      grade: "High Oleic Wood-Pressed"
    },
    shelfLife: "270 Days Ambient Storage",
    expiryDays: 270,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    description: "Light unrefined wood-pressed raw sunflower oil high in Vitamin E."
  },
  {
    id: "raw-oil-07",
    name: "Cold-Pressed Sesame (Til) Oil",
    hindiName: "तिल का तेल (Gingelly Raw Oil)",
    category: "dairy-oils",
    pricePerUnit: 340,
    unit: "Litre",
    moq: 10,
    stockAvailable: 800,
    fpoSource: {
      name: "Tamil Nadu Sesame Growers FPO",
      location: "Villupuram, Tamil Nadu",
      certificateId: "FPO-TN-2026-088"
    },
    labDetails: {
      protein: "0.0g / 100g",
      fat: "99.8g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "0.1%",
      purityPercentage: 99.9,
      adulterants: "0% Palm Oil Blending, 0% Solvents",
      nablReportNo: "NABL-LAB-2026-SES-07",
      testedDate: "2026-08-07",
      grade: "Grade A Cold-Pressed"
    },
    shelfLife: "365 Days Cool Dry Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    description: "Rich nutty cold-pressed sesame oil extracted from black sesame seeds."
  },
  {
    id: "raw-oil-08",
    name: "Virgin Coconut Oil",
    hindiName: "नारियल तेल (Raw Extra Virgin)",
    category: "dairy-oils",
    pricePerUnit: 380,
    unit: "Litre",
    moq: 10,
    stockAvailable: 900,
    fpoSource: {
      name: "Coconut Farmers Producers FPO",
      location: "Pollachi, Tamil Nadu",
      certificateId: "FPO-TN-2026-112"
    },
    labDetails: {
      protein: "0.0g / 100g",
      fat: "99.9g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "0.1%",
      purityPercentage: 99.9,
      adulterants: "0% Chemical Bleaching, 0% Deodorization",
      nablReportNo: "NABL-LAB-2026-COC-08",
      testedDate: "2026-08-08",
      grade: "Cold Extracted Extra Virgin"
    },
    shelfLife: "365 Days Ambient Storage",
    expiryDays: 365,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    description: "Pure unrefined extra virgin raw coconut oil cold-extracted from fresh coconut milk."
  },

  // --- DRY FRUITS, NUTS & RAW MEATS ---
  {
    id: "raw-nut-01",
    name: "Whole Jumbo Cashews (W240)",
    hindiName: "काजू (W240 King Size)",
    category: "meats-dryfruits",
    pricePerUnit: 890,
    unit: "kg",
    moq: 5,
    stockAvailable: 600,
    fpoSource: {
      name: "Goa Cashew Growers Cooperative",
      location: "Panaji, Goa",
      certificateId: "FPO-GOA-2026-011"
    },
    labDetails: {
      protein: "18.2g / 100g",
      fat: "43.8g / 100g",
      carbohydrates: "30.1g / 100g",
      moisture: "4.5%",
      purityPercentage: 99.9,
      adulterants: "0% Sulphur Bleach, 0% Insect Damage",
      nablReportNo: "NABL-LAB-2026-CSH-01",
      testedDate: "2026-08-05",
      grade: "W240 Super King Grade"
    },
    shelfLife: "180 Days Sealed Storage",
    expiryDays: 180,
    image: "https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=600&q=80",
    description: "Unpolished whole raw W240 jumbo cashew nuts with creamy natural flavor."
  },
  {
    id: "raw-nut-02",
    name: "California Almonds (Badam)",
    hindiName: "बादाम (Raw Whole Kernels)",
    category: "meats-dryfruits",
    pricePerUnit: 720,
    unit: "kg",
    moq: 5,
    stockAvailable: 800,
    fpoSource: {
      name: "Kashmir Almond Producers FPO",
      location: "Pulwama, J&K",
      certificateId: "FPO-JK-2026-044"
    },
    labDetails: {
      protein: "21.2g / 100g",
      fat: "49.9g / 100g",
      carbohydrates: "21.6g / 100g",
      moisture: "4.0%",
      purityPercentage: 99.8,
      adulterants: "0% Oil Extraction, 0% Chemical Polish",
      nablReportNo: "NABL-LAB-2026-ALM-02",
      testedDate: "2026-08-06",
      grade: "Grade A High Oil Almonds"
    },
    shelfLife: "240 Days Sealed Dry Storage",
    expiryDays: 240,
    image: "https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=600&q=80",
    description: "Raw unpolished almond kernels packed with Vitamin E and healthy monounsaturated fats."
  },
  {
    id: "raw-nut-03",
    name: "Golden Raisins (Kishmish)",
    hindiName: "किसमिश (Seedless Golden)",
    category: "meats-dryfruits",
    pricePerUnit: 320,
    unit: "kg",
    moq: 10,
    stockAvailable: 1000,
    fpoSource: {
      name: "Sangli Grape Growers FPO",
      location: "Sangli, Maharashtra",
      certificateId: "FPO-MAH-2026-221"
    },
    labDetails: {
      protein: "3.1g / 100g",
      fat: "0.5g / 100g",
      carbohydrates: "79.0g / 100g",
      moisture: "15.0%",
      purityPercentage: 99.9,
      adulterants: "0% Sulphur Dioxide Overuse, 0% Added Sugar",
      nablReportNo: "NABL-LAB-2026-RSN-03",
      testedDate: "2026-08-07",
      grade: "Grade A Green/Golden Seedless"
    },
    shelfLife: "270 Days Dry Storage",
    expiryDays: 270,
    image: "https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=600&q=80",
    description: "Sweet seedless raw golden raisins sun-dried naturally from seedless grapes."
  },
  {
    id: "raw-meat-04",
    name: "Farm Fresh Raw Chicken",
    hindiName: "चिकन (Whole Raw Dressed)",
    category: "meats-dryfruits",
    pricePerUnit: 220,
    unit: "kg",
    moq: 15,
    stockAvailable: 500,
    fpoSource: {
      name: "Jaipur Poultry Farmers FPO",
      location: "Jaipur Rural, Rajasthan",
      certificateId: "FPO-RAJ-2026-601"
    },
    labDetails: {
      protein: "27.1g / 100g",
      fat: "3.6g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "68.0%",
      purityPercentage: 100.0,
      adulterants: "0% Antibiotic Residues, 0% Growth Steroids, 0% Formalin",
      nablReportNo: "NABL-LAB-2026-CHK-04",
      testedDate: "2026-08-10",
      grade: "Tested Antibiotic-Free Grade A"
    },
    shelfLife: "3 Days at 0°C - 2°C Cold Storage",
    expiryDays: 3,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80",
    description: "Dressed whole raw farm chicken, NABL tested 100% free of antibiotics and growth steroids."
  },
  {
    id: "raw-meat-05",
    name: "Fresh Raw Mutton",
    hindiName: "मटन (Dressed Goat Meat)",
    category: "meats-dryfruits",
    pricePerUnit: 740,
    unit: "kg",
    moq: 10,
    stockAvailable: 300,
    fpoSource: {
      name: "Ajmer Livestock Producers FPO",
      location: "Ajmer, Rajasthan",
      certificateId: "FPO-RAJ-2026-712"
    },
    labDetails: {
      protein: "25.6g / 100g",
      fat: "8.2g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "65.0%",
      purityPercentage: 100.0,
      adulterants: "0% Hormonal Injections, 0% Synthetic Colors",
      nablReportNo: "NABL-LAB-2026-MUT-05",
      testedDate: "2026-08-10",
      grade: "Grade A Tender Goat Meat"
    },
    shelfLife: "2 Days at 0°C Cold Storage",
    expiryDays: 2,
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
    description: "Tender raw goat meat harvested from free-range pastured herds."
  },
  {
    id: "raw-meat-06",
    name: "Free Range Farm Eggs",
    hindiName: "देसी अंडे (Brown Organic Eggs)",
    category: "meats-dryfruits",
    pricePerUnit: 90,
    unit: "Dozen",
    moq: 10,
    stockAvailable: 800,
    fpoSource: {
      name: "Rajasthan Organic Poultry FPO",
      location: "Tonk, Rajasthan",
      certificateId: "FPO-RAJ-2026-809"
    },
    labDetails: {
      protein: "6.3g / egg",
      fat: "5.0g / egg",
      carbohydrates: "0.4g / egg",
      moisture: "75.0%",
      purityPercentage: 100.0,
      adulterants: "0% Antibiotics, 0% Salmonella Toxicity",
      nablReportNo: "NABL-LAB-2026-EGG-06",
      testedDate: "2026-08-09",
      grade: "Grade A Brown Free-Range"
    },
    shelfLife: "21 Days Cool Storage",
    expiryDays: 21,
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80",
    description: "Nutritious brown raw eggs laid by free-roaming organic-fed hens."
  },
  {
    id: "raw-meat-07",
    name: "Fresh River Fish Fillet (Rohu)",
    hindiName: "रोहू मछली (Cleaned Raw Fillet)",
    category: "meats-dryfruits",
    pricePerUnit: 310,
    unit: "kg",
    moq: 10,
    stockAvailable: 250,
    fpoSource: {
      name: "Chambal Fisheries Cooperative",
      location: "Kota, Rajasthan",
      certificateId: "FPO-RAJ-2026-901"
    },
    labDetails: {
      protein: "19.8g / 100g",
      fat: "2.4g / 100g",
      carbohydrates: "0.0g / 100g",
      moisture: "76.0%",
      purityPercentage: 100.0,
      adulterants: "0% Formalin Preservation, 0% Heavy Metals (Mercury/Lead)",
      nablReportNo: "NABL-LAB-2026-FSH-07",
      testedDate: "2026-08-10",
      grade: "Grade A Formalin-Free"
    },
    shelfLife: "2 Days at 0°C Ice Storage",
    expiryDays: 2,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    description: "Cleaned fresh raw river fish fillet tested 0% formalin chemical preservative."
  }
];
