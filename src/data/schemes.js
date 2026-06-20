export const schemes = [
  {
    scheme_id: "pm_kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Agriculture & Farmers",
    eligibility: {
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: ["farmer", "agricultural_laborer"],
      land_ownership: true,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee", "income_tax_payer"]
    },
    benefits: "₹6,000 per year paid in three equal installments of ₹2,000 directly into the bank accounts of farming families.",
    documents_needed: ["Aadhaar Card", "Land Ownership Documents (Khatauni/Patta)", "Bank Account Passbook", "Mobile Number linked to Aadhaar"],
    apply_url: "https://pmkisan.gov.in/",
    language_summary: {
      en: "PM-KISAN offers ₹6,000 yearly to farming families who own cultivable land. It is paid in 3 installments of ₹2,000 each.",
      hi: "पीएम-किसान योजना के तहत खेती योग्य जमीन वाले किसान परिवारों को सालाना ₹6,000 की वित्तीय सहायता दी जाती है, जो ₹2,000 की 3 किश्तों में मिलती है।"
    }
  },
  {
    scheme_id: "e_shram",
    name: "e-Shram Card (National Database of Unorganized Workers)",
    category: "Social Security & Employment",
    eligibility: {
      min_age: 16,
      max_age: 59,
      gender: null,
      occupations: ["laborer", "construction_worker", "domestic_worker", "vendor", "farmer", "artisan", "rickshaw_puller", "tailor", "barber"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee", "provident_fund_member", "esic_member"]
    },
    benefits: "Accidental insurance cover of ₹2 Lakhs for death or permanent disability, and ₹1 Lakh for partial disability. Direct access to various social security schemes.",
    documents_needed: ["Aadhaar Card", "Active Mobile Number", "Savings Bank Account Details"],
    apply_url: "https://eshram.gov.in/",
    language_summary: {
      en: "e-Shram card provides accidental insurance of ₹2 Lakhs and links unorganized workers to social security benefits.",
      hi: "ई-श्रम कार्ड असंगठित क्षेत्र के श्रमिकों को ₹2 लाख का दुर्घटना बीमा और अन्य सामाजिक सुरक्षा योजनाओं का सीधा लाभ देता है।"
    }
  },
  {
    scheme_id: "ayushman_bharat",
    name: "Ayushman Bharat (PM-JAY)",
    category: "Health & Medical",
    eligibility: {
      min_age: null,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: 10000,
      bpl: true,
      disability_status: null,
      exclusions: ["government_employee", "car_owner", "income_tax_payer"]
    },
    benefits: "Free health insurance cover of up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization in empanelled hospitals.",
    documents_needed: ["Aadhaar Card", "Ration Card (BPL)", "Pehchan Patra / Family Identity card", "Income Certificate"],
    apply_url: "https://dashboard.pmjay.gov.in/",
    language_summary: {
      en: "Ayushman Bharat provides free hospital treatment of up to ₹5 Lakhs per year for poor families.",
      hi: "आयुष्मान भारत योजना के तहत गरीब परिवारों को हर साल ₹5 लाख तक का मुफ्त इलाज सरकारी और सूचीबद्ध अस्पतालों में मिलता है।"
    }
  },
  {
    scheme_id: "pmay_g",
    name: "Pradhan Mantri Awas Yojana (Gramin/Urban)",
    category: "Housing",
    eligibility: {
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: false,
      max_income: 25000,
      bpl: true,
      disability_status: null,
      exclusions: ["government_employee", "pucca_house_owner", "motorized_vehicle_owner"]
    },
    benefits: "Financial assistance of ₹1.2 Lakhs in plains and ₹1.3 Lakhs in hilly/difficult areas for building a new pucca house.",
    documents_needed: ["Aadhaar Card", "Bank Account Details", "Ration Card / BPL Proof", "Land Availability Certificate / House Site document"],
    apply_url: "https://pmayg.nic.in/",
    language_summary: {
      en: "PMAY provides financial assistance of up to ₹1.3 Lakhs to homeless families or those living in kutcha houses to build a pucca house.",
      hi: "प्रधानमंत्री आवास योजना के तहत बेघर परिवारों या कच्चे मकानों में रहने वाले लोगों को पक्का घर बनाने के लिए ₹1.2 लाख से ₹1.3 लाख की मदद दी जाती है।"
    }
  },
  {
    scheme_id: "ujjwala_yojana",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    category: "Women & LPG",
    eligibility: {
      min_age: 18,
      max_age: null,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: true,
      disability_status: null,
      exclusions: ["lpg_connection_holder"]
    },
    benefits: "A free LPG connection (cylinder, regulator, and pipe) and the first cylinder refill completely free of cost.",
    documents_needed: ["Aadhaar Card of the applicant woman", "Ration Card (BPL/Antyodaya)", "Bank Account details", "Address proof"],
    apply_url: "https://www.pmuy.gov.in/",
    language_summary: {
      en: "Ujjwala Yojana provides a free LPG gas connection and first cylinder refill to adult women from poor/BPL households.",
      hi: "उज्ज्वला योजना के तहत गरीब (BPL) परिवारों की महिलाओं को मुफ्त एलपीजी गैस कनेक्शन और पहली गैस रिफिल मुफ्त दी जाती है।"
    }
  },
  {
    scheme_id: "sukanya_samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Women & Child Development",
    eligibility: {
      min_age: 0,
      max_age: 10,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "High-interest savings account (currently 8.2%) with tax benefits to secure the girl child's education and marriage expenses.",
    documents_needed: ["Birth Certificate of the Girl Child", "Aadhaar Card of Parent/Guardian", "Address Proof of Parent/Guardian", "Photos of Child and Parent"],
    apply_url: "https://www.indiapost.gov.in/",
    language_summary: {
      en: "A high-interest savings scheme for a girl child under 10 years, offering tax savings and funds for her education and marriage.",
      hi: "10 वर्ष से कम उम्र की बेटियों के लिए उच्च ब्याज वाली बचत योजना है, जो उनकी पढ़ाई और शादी के खर्चों के लिए पैसे जोड़ने में मदद करती है।"
    }
  },
  {
    scheme_id: "pm_vishwakarma",
    name: "PM Vishwakarma Scheme",
    category: "Business & Skill Development",
    eligibility: {
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: ["artisan", "carpenter", "blacksmith", "potter", "sculptor", "cobbler", "tailor", "mason", "weaver", "barber", "washerman"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Skill training, tool kit incentive of ₹15,000, collateral-free business loans up to ₹3 Lakhs at a concessional interest rate of 5%.",
    documents_needed: ["Aadhaar Card", "Mobile Number linked to Aadhaar", "Bank Account Details", "Artisan/Trade Certificate or Self-Declaration"],
    apply_url: "https://pmvishwakarma.gov.in/",
    language_summary: {
      en: "PM Vishwakarma supports traditional artisans with tool kits, skill training, and low-interest loans up to ₹3 Lakhs.",
      hi: "पीएम विश्वकर्मा योजना पारंपरिक कारीगरों (जैसे बढ़ई, दर्जी, लोहार) को ₹15,000 की टूलकिट प्रोत्साहन, प्रशिक्षण और ₹3 लाख तक का सस्ता लोन देती है।"
    }
  },
  {
    scheme_id: "pm_svanidhi",
    name: "PM SVANidhi (Micro Credit Scheme for Street Vendors)",
    category: "Business & Skill Development",
    eligibility: {
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: ["vendor", "street_vendor", "hawker"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Collateral-free working capital loan of ₹10,000 for the first term, followed by ₹20,000 and ₹50,000 for subsequent timely repayments. Interest subsidy of 7%.",
    documents_needed: ["Aadhaar Card", "Voter Identity Card", "Certificate of Vending or Letter of Recommendation from local municipal body", "Bank Account Details"],
    apply_url: "https://pmsvanidhi.mohua.gov.in/",
    language_summary: {
      en: "PM SVANidhi provides collateral-free loans starting from ₹10,000 to help street vendors restart their business.",
      hi: "पीएम स्वनिधि योजना रेहड़ी-पटरी और ठेला लगाने वाले दुकानदारों को अपना व्यवसाय बढ़ाने के लिए ₹10,000 से लेकर ₹50,000 तक का बिना गारंटी का लोन देती है।"
    }
  },
  {
    scheme_id: "pm_matru_vandana",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "Women & Child Development",
    eligibility: {
      min_age: 19,
      max_age: null,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Cash incentive of ₹5,000 in installments directly to the bank account for pregnant women and lactating mothers for the first living child.",
    documents_needed: ["Aadhaar Card of the Mother & Husband", "Bank Passbook of Mother", "MCP Card (Mother & Child Protection Card)", "Birth Certificate of the Child"],
    apply_url: "https://pmmvy.wcd.gov.in/",
    language_summary: {
      en: "PMMVY provides ₹5,000 cash assistance to pregnant women and lactating mothers for their first child to support nutrition.",
      hi: "प्रधानमंत्री मातृ वंदना योजना के तहत पहली बार गर्भवती होने वाली महिलाओं को पोषण के लिए ₹5,000 की नकद सहायता सीधे बैंक खाते में दी जाती है।"
    }
  },
  {
    scheme_id: "atal_pension",
    name: "Atal Pension Yojana (APY)",
    category: "Social Security & Pension",
    eligibility: {
      min_age: 18,
      max_age: 40,
      gender: null,
      occupations: ["laborer", "construction_worker", "domestic_worker", "vendor", "farmer", "artisan", "self_employed", "unemployed"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["income_tax_payer"]
    },
    benefits: "Guaranteed minimum monthly pension of ₹1,000 to ₹5,000 after attaining the age of 60, depending on the subscriber's contribution.",
    documents_needed: ["Aadhaar Card", "Active Mobile Number", "Savings Bank Account linked to Aadhaar"],
    apply_url: "https://www.npscra.nsdl.co.in/",
    language_summary: {
      en: "Atal Pension Yojana offers a guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60 for unorganized workers who contribute early.",
      hi: "अटल पेंशन योजना 18 से 40 वर्ष के असंगठित क्षेत्र के लोगों के लिए है, जो उनके अंशदान के आधार पर 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 की मासिक पेंशन की गारंटी देती है।"
    }
  },
  {
    scheme_id: "pm_shram_yogi_maandhan",
    name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
    category: "Social Security & Pension",
    eligibility: {
      min_age: 18,
      max_age: 40,
      gender: null,
      occupations: ["laborer", "construction_worker", "domestic_worker", "vendor", "artisan", "rickshaw_puller", "tailor", "washerman"],
      land_ownership: null,
      max_income: 15000,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee", "provident_fund_member", "esic_member", "income_tax_payer"]
    },
    benefits: "Guaranteed monthly pension of ₹3,000 after attaining the age of 60 years. If the subscriber dies, the spouse is entitled to 50% family pension.",
    documents_needed: ["Aadhaar Card", "Savings Bank Account Passbook", "Mobile Number linked to Aadhaar"],
    apply_url: "https://maandhan.in/shramyogi",
    language_summary: {
      en: "PM-SYM gives a monthly pension of ₹3,000 to unorganized workers earning under ₹15,000 once they reach 60 years of age.",
      hi: "पीएम श्रम योगी मान-धन योजना ₹15,000 से कम कमाने वाले असंगठित श्रमिकों के लिए है, जो 60 साल के होने पर ₹3,000 की मासिक पेंशन देती है।"
    }
  },
  {
    scheme_id: "pm_mudra_yojana",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    category: "Business & Skill Development",
    eligibility: {
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: ["self_employed", "businessman", "shopkeeper", "vendor", "artisan"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Collateral-free loans up to ₹10 Lakhs for micro-enterprises under three categories: Shishu (up to ₹50,000), Kishor (up to ₹5 Lakhs), and Tarun (up to ₹10 Lakhs).",
    documents_needed: ["Aadhaar Card", "Voter Card / PAN Card", "Proof of Business Address", "Quotation of machinery/items to be bought"],
    apply_url: "https://www.mudra.org.in/",
    language_summary: {
      en: "MUDRA Yojana offers collateral-free loans up to ₹10 Lakhs to start or expand small shops, businesses, and enterprises.",
      hi: "मुद्रा योजना के तहत छोटे दुकानदारों और व्यापारियों को अपना काम शुरू करने या बढ़ाने के लिए ₹10 लाख तक का बिना गारंटी का व्यापार ऋण मिलता है।"
    }
  },
  {
    scheme_id: "nsap_old_age_pension",
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    category: "Social Security & Pension",
    eligibility: {
      min_age: 60,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: true,
      disability_status: null,
      exclusions: []
    },
    benefits: "Monthly pension of ₹200 for persons aged 60-79 years, and ₹500 per month for persons aged 80 years and above. States often add extra matching amounts.",
    documents_needed: ["Aadhaar Card", "BPL Certificate / Ration Card", "Age Proof Certificate", "Bank Account Details"],
    apply_url: "https://nsap.nic.in/",
    language_summary: {
      en: "IGNOAPS provides monthly pension to elderly citizens (60+) who belong to households below the poverty line.",
      hi: "राष्ट्रीय वृद्धावस्था पेंशन योजना के तहत 60 वर्ष या उससे अधिक उम्र के बीपीएल (BPL) परिवारों के बुजुर्गों को हर महीने पेंशन राशि दी जाती है।"
    }
  },
  {
    scheme_id: "nsap_widow_pension",
    name: "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
    category: "Social Security & Pension",
    eligibility: {
      min_age: 40,
      max_age: 79,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: true,
      disability_status: null,
      marital_status: "widow",
      exclusions: []
    },
    benefits: "Monthly pension of ₹300 for widows aged 40-79 years. States typically add extra matching amounts (sometimes totaling ₹1000-₹3000/month).",
    documents_needed: ["Aadhaar Card", "Death Certificate of Husband", "BPL Certificate / Ration Card", "Bank Account Details", "Age Proof"],
    apply_url: "https://nsap.nic.in/",
    language_summary: {
      en: "IGNWPS provides monthly pension to widows aged 40-79 who belong to households below the poverty line.",
      hi: "राष्ट्रीय विधवा पेंशन योजना के तहत 40 से 79 वर्ष की बीपीएल परिवारों की विधवा महिलाओं को हर महीने वित्तीय पेंशन दी जाती है।"
    }
  }
];
