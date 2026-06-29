export const schemes = [
  {
    scheme_id: "pm_kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Agriculture & Farmers",
    eligibility: {
      state: null,
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
      hi: "पीएम-किसान योजना के तहत खेती योग्य जमीन वाले किसान परिवारों को सालाना ₹6,000 की वित्तीय सहायता दी जाती है, जो ₹2,000 की 3 किश्तों में मिलती है।",
      ta: "विारखंड किसानों को वर्ष में ₹6,000 वित्तीय सहायता दी जाती है।",
      te: "రైతులకు ప్రతిసంవత్సరం ₹6,000 ఆర్థిక సాయం అందించే కేంద్ర ప్రభుత్వ పథకం. ఇది ₹2,000 చొప్పున 3 విడతల్లో అందుతుంది."
    },
    apply_steps: {
      en: [
        "Go to the PM-KISAN portal (pmkisan.gov.in).",
        "Click on 'New Farmer Registration' under the Farmers Corner.",
        "Enter your Aadhaar number and select your state.",
        "Fill in your personal, land, and bank details.",
        "Upload the land registration copy (Khatauni) and save."
      ],
      hi: [
        "पीएम-किसान पोर्टल (pmkisan.gov.in) पर जाएं।",
        "Farmers Corner के तहत 'New Farmer Registration' पर क्लिक करें।",
        "अपना आधार नंबर डालें और अपने राज्य का चयन करें।",
        "अपने व्यक्तिगत, भूमि और बैंक विवरण भरें।",
        "भूमि पंजीकरण की प्रति (खतौनी) अपलोड करें और सहेजें।"
      ],
      ta: [
        "PM-KISAN இணையதளத்திற்குச் செல்லவும் (pmkisan.gov.in).",
        "'New Farmer Registration' என்பதைத் தேர்ந்தெடுக்கவும்.",
        "ஆதார் எண் மற்றும் மாநிலத்தைத் தேர்வு செய்யவும்.",
        "தனிப்பட்ட மற்றும் நில விவரங்களை நிரப்பவும்.",
        "நில ஆவணங்களை (பட்டா) பதிவேற்றி சமர்ப்பிக்கவும்."
      ],
      te: [
        "PM-KISAN పోర్టల్ (pmkisan.gov.in) కి వెళ్ళండి.",
        "'New Farmer Registration' పై క్లిక్ చేయండి.",
        "మీ ఆధార్ నంబర్ ఎంటర్ చేసి, రాష్ట్రాన్ని ఎంచుకోండి.",
        "వ్యక్తిగత, భూమి మరియు బ్యాంక్ వివరాలను పూరించండి.",
        "భూమి పట్టా పత్రాన్ని అప్‌లోడ్ చేసి సేవ్ చేయండి."
      ]
    }
  },
  {
    scheme_id: "e_shram",
    name: "e-Shram Card (National Database of Unorganized Workers)",
    category: "Social Security & Employment",
    eligibility: {
      state: null,
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
      hi: "ई-श्रम कार्ड असंगठित क्षेत्र के श्रमिकों को ₹2 लाख का दुर्घटना बीमा और अन्य सामाजिक सुरक्षा योजनाओं का सीधा लाभ देता है।",
      ta: "அமைப்புசாரா தொழிலாளர்களுக்கு ₹2 லட்சம் விபத்து காப்பீடும் சமூக பாதுகாப்பு அடையாளமும் வழங்கும் மத்திய அரசு அட்டை.",
      te: "అసంఘటిత రంగ కార్మికులకు ₹2 లక్షల ప్రమాద బీమా మరియు సామాజిక భద్రత కల్పించే కేంద్ర ప్రభుత్వ ఈ-శ్రమ్ కార్డ్."
    },
    apply_steps: {
      en: [
        "Open the official e-Shram portal (eshram.gov.in).",
        "Click on 'Register on e-Shram'.",
        "Enter your mobile number linked with Aadhaar and enter OTP.",
        "Provide Aadhaar and complete biometric/OTP verification.",
        "Fill in personal, qualification, occupation, and bank details, then download your UAN card."
      ],
      hi: [
        "आधिकारिक ई-श्रम पोर्टल (eshram.gov.in) खोलें।",
        "'Register on e-Shram' पर क्लिक करें।",
        "आधार से लिंक मोबाइल नंबर दर्ज करें और OTP डालें।",
        "अपना आधार विवरण प्रदान करें और OTP सत्यापित करें।",
        "व्यक्तिगत, योग्यता, व्यवसाय और बैंक विवरण भरें, फिर अपना UAN कार्ड डाउनलोड करें।"
      ],
      ta: [
        "e-Shram இணையதளத்திற்குச் செல்லவும் (eshram.gov.in).",
        "'Register on e-Shram' என்பதை கிளிக் செய்யவும்.",
        "ஆதாருடன் இணைக்கப்பட்ட கைபேசி எண்ணை உள்ளிட்டு OTP பெறவும்.",
        "ஆதார் விவரங்களை உள்ளிட்டு சரிபார்க்கவும்.",
        "தொழில் மற்றும் வங்கி விவரங்களை பூர்த்தி செய்து UAN அட்டையை பதிவிறக்கவும்."
      ],
      te: [
        "అధికారిక ఈ-శ్రమ్ పోర్టల్ (eshram.gov.in) ఓపెన్ చేయండి.",
        "'Register on e-Shram' పై క్లిక్ చేయండి.",
        "ఆధార్‌తో లింక్ అయిన మొబైల్ నంబర్ ఎంటర్ చేసి OTP నమోదు చేయండి.",
        "ఆధార్ వివరాలను నమోదు చేసి OTP వెరిఫై చేయండి.",
        "వ్యక్తిగత, వృత్తి మరియు బ్యాంక్ వివరాలను పూరించి UAN కార్డ్ డౌన్‌లోడ్ చేసుకోండి."
      ]
    }
  },
  {
    scheme_id: "ayushman_bharat",
    name: "Ayushman Bharat (PM-JAY)",
    category: "Health & Medical",
    eligibility: {
      state: null,
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
      hi: "आयुष्मान भारत योजना के तहत गरीब परिवारों को हर साल ₹5 लाख तक का मुफ्त इलाज सरकारी और सूचीबद्ध अस्पतालों में मिलता है।",
      ta: "ஏழைக் குடும்பங்களுக்கு ஆண்டுக்கு ₹5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை அளிக்கும் காப்பீட்டுத் திட்டம்.",
      te: "పేద కుటుంబాలకు సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత వైద్య చికిత్స అందించే ఆరోగ్య బీమా పథకం."
    },
    apply_steps: {
      en: [
        "Go to your nearest Common Service Centre (CSC) or empanelled hospital.",
        "Verify your eligibility using your Ration card or PM-JAY letter.",
        "Submit your Aadhaar card and identity documents for e-KYC.",
        "Once verified, collect your Ayushman Golden Card.",
        "Present the card at any empanelled hospital for cashless treatment."
      ],
      hi: [
        "अपने नजदीकी जन सेवा केंद्र (CSC) या सूचीबद्ध अस्पताल में जाएं।",
        "अपने राशन कार्ड या पीएम-जेएवाई पत्र का उपयोग करके अपनी पात्रता की जांच करें।",
        "ई-केवाईसी के लिए अपना आधार कार्ड और पहचान दस्तावेज जमा करें।",
        "सत्यापन के बाद, अपना आयुष्मान गोल्डन कार्ड प्राप्त करें।",
        "कैशलेस इलाज के लिए किसी भी सूचीबद्ध अस्पताल में यह कार्ड दिखाएं।"
      ],
      ta: [
        "அருகிலுள்ள பொது சேவை மையம் (CSC) அல்லது அரசு மருத்துவமனைக்குச் செல்லவும்.",
        "ரேஷன் கார்டு மூலம் உங்கள் தகுதியைச் சரிபார்க்கவும்.",
        "ஆதார் மற்றும் அடையாள ஆவணங்களைச் சமர்ப்பித்து e-KYC செய்யவும்.",
        "சரிபார்ப்பிற்குப் பிறகு, ஆயுஷ்மான் தங்க அட்டையைப் பெறவும்.",
        "இலவச சிகிச்சைக்கு இந்த அட்டையைப் பயன்படுத்தவும்."
      ],
      te: [
        "సమీప కామన్ సర్వీస్ సెంటర్ (CSC) లేదా గుర్తింపు పొందిన ఆసుపత్రికి వెళ్ళండి.",
        "మీ రేషన్ కార్డ్ ద్వారా అర్హతను వెరిఫై చేసుకోండి.",
        "e-KYC కోసం మీ ఆధార్ కార్డ్ మరియు గుర్తింపు పత్రాలను సమర్పించండి.",
        "ధృవీకరణ పూర్తయిన తర్వాత ఆయుష్మాన్ గోల్డెన్ కార్డ్ పొందండి.",
        "ఉచిత వైద్యం కోసం గుర్తింపు పొందిన ఆసుపత్రిలో ఈ కార్డ్ చూపించండి."
      ]
    }
  },
  {
    scheme_id: "pmay_g",
    name: "Pradhan Mantri Awas Yojana (Gramin/Urban)",
    category: "Housing",
    eligibility: {
      state: null,
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
      hi: "प्रधानमंत्री आवास योजना के तहत बेघर परिवारों या कच्चे मकानों में रहने वाले लोगों को पक्का घर बनाने के लिए ₹1.2 लाख से ₹1.3 लाख की मदद दी जाती है।",
      ta: "வீடற்ற ஏழைக் குடும்பங்கள் சொந்தமாக பக்கா வீடு கட்ட ₹1.2 லட்சம் முதல் ₹1.3 லட்சம் வரை வழங்கும் திட்டம்.",
      te: "సొంత ఇల్లు లేని పేదలకు పక్కా ఇల్లు నిర్మించుకోవడానికి ₹1.2 నుండి ₹1.3 లక్షల వరకు అందించే కేంద్ర పథకం."
    },
    apply_steps: {
      en: [
        "Contact your local Gram Panchayat (for Gramin) or Municipal Office (for Urban).",
        "Fill out the PMAY application form with family details.",
        "Submit your Aadhaar, bank details, and proof of housing status (e.g. photo of kutcha house).",
        "A field officer will visit your site for physical verification.",
        "Approved names will be added to the beneficiary list, and funds will be released in stages."
      ],
      hi: [
        "अपनी स्थानीय ग्राम पंचायत (ग्रामीण के लिए) या नगर पालिका कार्यालय (शहरी के लिए) से संपर्क करें।",
        "परिवार के विवरण के साथ पीएमएवाई आवेदन पत्र भरें।",
        "अपना आधार, बैंक विवरण और कच्चे मकान का प्रमाण (जैसे कच्चे मकान की फोटो) जमा करें।",
        "एक क्षेत्रीय अधिकारी भौतिक सत्यापन के लिए आपकी जगह का दौरा करेगा।",
        "स्वीकृत नाम लाभार्थी सूची में जोड़े जाएंगे, और धन किश्तों में जारी किया जाएगा।"
      ],
      ta: [
        "உள்ளூர் கிராம பஞ்சாயத்து அல்லது நகராட்சி அலுவலகத்தை அணுகவும்.",
        "PMAY விண்ணப்பப் படிவத்தை குடும்ப விவரங்களுடன் நிரப்பவும்.",
        "ஆதார், வங்கி विवरण மற்றும் தற்போதைய குடிசை வீட்டின் புகைப்படத்தை சமர்ப்பிக்கவும்.",
        "அதிகாரி நேரில் வந்து சரிபார்ப்பு நடத்துவார்.",
        "அனுமதி கிடைத்த பின் நிதி தவணைகளாக உங்கள் கணக்கில் செலுத்தப்படும்."
      ],
      te: [
        "మీ స్థానిక గ్రామ పంచాయతీ లేదా మున్సిపల్ కార్యాలయాన్ని సంప్రదించండి.",
        "కుటుంబ వివరాలతో కూడిన PMAY దరఖాస్తు ఫారమ్ పూరించండి.",
        "ఆధార్, బ్యాంక్ వివరాలు మరియు ప్రస్తుత ఇంటి ఫోటోను సమర్పించండి.",
        "అధికారి వచ్చి మీ నివాస స్థలాన్ని ప్రత్యక్షంగా వెరిఫై చేస్తారు.",
        "ధృవీకరించబడిన తర్వాత నిధులు విడతల వారీగా విడుదల చేయబడతాయి."
      ]
    }
  },
  {
    scheme_id: "ujjwala_yojana",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    category: "Women & LPG",
    eligibility: {
      state: null,
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
      hi: "उज्ज्वला योजना के तहत गरीब (BPL) परिवारों की महिलाओं को मुफ्त एलपीजी गैस कनेक्शन और पहली गैस रिफिल मुफ्त दी जाती है।",
      ta: "வறுமைக் கோட்டிற்கு கீழ் உள்ள ஏழைப் பெண்களுக்கு இலவச கேஸ் இணைப்பு மற்றும் முதல் சிலிண்டர் வழங்கும் திட்டம்.",
      te: "దారిద్ర్య రేఖకు దిగువన ఉన్న మహిళలకు ఉచిత గ్యాస్ కనెక్షన్ మరియు మొదటి సిలిండర్ అందించే పథకం."
    },
    apply_steps: {
      en: [
        "Visit your nearest LPG distributor (Indane, HP, or Bharat Gas).",
        "Ask for the Ujjwala Yojana application form.",
        "Submit the form along with Aadhaar, BPL Ration card, and bank details.",
        "The distributor will verify your BPL status in the government database.",
        "Once verified, the free LPG gas cylinder, stove, and regulator will be issued."
      ],
      hi: [
        "अपने नजदीकी एलपीजी वितरक (इंडेन, एचपी, या भारत गैस) के पास जाएं।",
        "उज्ज्वला योजना आवेदन पत्र मांगें।",
        "आधार, बीपीएल राशन कार्ड और बैंक विवरण के साथ फॉर्म जमा करें।",
        "वितरक सरकारी डेटाबेस में आपकी बीपीएल स्थिति का सत्यापन करेगा।",
        "सत्यापन के बाद, मुफ्त एलपीजी गैस सिलेंडर, स्टोव और रेगुलेटर जारी किया जाएगा।"
      ],
      ta: [
        "அருகிலுள்ள எரிவாயு விநியோகஸ்தரை (Indane, HP, or Bharat) அணுகவும்.",
        "உஜ்வலா திட்ட விண்ணப்பப் படிவத்தைப் பெறவும்.",
        "ஆதார், பிபிஎல் ரேஷன் கார்டு மற்றும் வங்கி விவரங்களைச் சமர்ப்பிக்கவும்.",
        "விநியோகஸ்தர் தகுதியைச் சரிபார்த்த பிறகு எரிவாயு இணைப்பு வழங்குவார்."
      ],
      te: [
        "సమీప గ్యాస్ డిస్ట్రిబ్యూటర్ (Indane, HP, లేదా Bharat Gas) ని సంప్రదించండి.",
        "ఉజ్జ్వల యోజన దరఖాస్తు ఫారమ్‌ను అడగండి.",
        "ఆధార్, BPL రేషన్ కార్డ్ మరియు బ్యాంక్ వివరాలతో ఫారమ్ సమర్పించండి.",
        "డిస్ట్రిబ్యూటర్ మీ వివరాలను ప్రభుత్వ డేటాబేస్‌తో సరిపోల్చుతారు.",
        "ధృవీకరణ తర్వాత ఉచిత గ్యాస్ కనెక్షన్, స్టవ్ మరియు రెగ్యులేటర్ అందుతాయి."
      ]
    }
  },
  {
    scheme_id: "sukanya_samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Women & Child Development",
    eligibility: {
      state: null,
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
      hi: "10 वर्ष से कम उम्र की बेटियों के लिए उच्च ब्याज वाली बचत योजना है, जो उनकी पढ़ाई और शादी के खर्चों के लिए पैसे जोड़ने में मदद करती है।",
      ta: "10 வயதுக்குட்பட்ட பெண் குழந்தைகளின் எதிர்கால கல்வி மற்றும் திருமண செலவுகளுக்காக அதிக வட்டி தரும் சேமிப்புத் திட்டம்.",
      te: "10 సంవత్సరాల లోపు ఆడపిల్లల భవిష్యత్తు, చదువు మరియు వివాహ ఖర్చుల కోసం అధిక వడ్డీ అందించే పొదుపు పథకం."
    },
    apply_steps: {
      en: [
        "Go to any nearby Post Office or authorized commercial bank.",
        "Request the Sukanya Samriddhi account opening form.",
        "Attach the girl child's birth certificate and parent's Aadhaar.",
        "Deposit the initial opening amount (minimum ₹250).",
        "Collect your account passbook to track future deposits."
      ],
      hi: [
        "किसी भी नजदीकी डाकघर या अधिकृत बैंक में जाएं।",
        "सुकन्या समृद्धि खाता खोलने का फॉर्म मांगें।",
        "बेटी का जन्म प्रमाण पत्र और माता-पिता का आधार संलग्न करें।",
        "प्रारंभिक खाता खोलने की राशि जमा करें (न्यूनतम ₹250)।",
        "भविष्य की जमा राशि को ट्रैक करने के लिए अपनी खाता पासबुक प्राप्त करें।"
      ],
      ta: [
        "அருகிலுள்ள தபால் நிலையம் அல்லது வங்கிக்குச் செல்லவும்.",
        "சுகன்யா சம்ரித்தி கணக்கு தொடங்கும் படிவத்தைப் பெறவும்.",
        "குழந்தையின் பிறப்புச் சான்றிதழ் மற்றும் பெற்றோரின் ஆதாரை இணைக்கவும்.",
        "ஆரம்ப வைப்புத் தொகையை (குறைந்தது ₹250) செலுத்தவும்.",
        "கணக்கு புத்தகத்தைப் பெற்று தொடர்ந்து சேமிக்கவும்."
      ],
      te: [
        "సమీప పోస్ట్ ఆఫీస్ లేదా ప్రభుత్వ బ్యాంకుకు వెళ్ళండి.",
        "సుకున్య సమరిద్ది ఖాతా దరఖాస్తు ఫారమ్ తీసుకోండి.",
        "ఆడపిల్ల జన్మ ధృవీకరణ పత్రం మరియు తల్లిదండ్రుల ఆధార్ జతచేయండి.",
        "కనీస ప్రారంభ డిపాజిట్ (రూ. 250) చెల్లించండి.",
        "భవిష్యత్తు పొదుపు వివరాల కోసం ఖాతా పాస్‌బుక్ తీసుకోండి."
      ]
    }
  },
  {
    scheme_id: "pm_vishwakarma",
    name: "PM Vishwakarma Scheme",
    category: "Business & Skill Development",
    eligibility: {
      state: null,
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
      hi: "पीएम विश्वकर्मा योजना पारंपरिक कारीगरों (जैसे बढ़ई, दर्जी, लोहार) को ₹15,000 की टूलकिट प्रोत्साहन, प्रशिक्षण और ₹3 लाख तक का सस्ता लोन देती है।",
      ta: "பாரம்பரிய கைவினைஞர்களுக்கு பயிற்சி, ₹15,000 உபகரண உதவி மற்றும் குறைந்த வட்டியில் ₹3 லட்சம் வரை தொழில் கடன் வழங்கும் திட்டம்.",
      te: "చేతివృత్తుల వారికి శిక్షణ, ₹15,000 విలువైన పరికరాలు మరియు 5% వడ్డీతో ₹3 లక్షల వరకు వ్యాపార రుణం అందించే పథకం."
    },
    apply_steps: {
      en: [
        "Register online via the PM Vishwakarma portal (pmvishwakarma.gov.in) using CSC credentials.",
        "Complete your mobile number and Aadhaar authentication.",
        "Select your trade/craft and fill in personal and bank details.",
        "The Gram Panchayat/Urban Local Body will verify your artisan status.",
        "After approval, undergo 5-7 days basic training and receive a toolkit voucher worth ₹15,000."
      ],
      hi: [
        "CSC (जन सेवा केंद्र) के माध्यम से पीएम विश्वकर्मा पोर्टल (pmvishwakarma.gov.in) पर पंजीकरण करें।",
        "अपना मोबाइल नंबर और आधार प्रमाणीकरण पूरा करें।",
        "अपने व्यापार/शिल्प का चयन करें और व्यक्तिगत व बैंक विवरण भरें।",
        "ग्राम पंचायत/शहरी निकाय आपके कारीगर होने की पुष्टि करेगा।",
        "मंजूरी के बाद, 5-7 दिनों का बुनियादी प्रशिक्षण लें और ₹15,000 का टूलकिट वाउचर प्राप्त करें।"
      ],
      ta: [
        "CSC பொது சேவை மையம் மூலமாக pmvishwakarma.gov.in இணையதளத்தில் பதிவு செய்யவும்.",
        "ஆதார் மற்றும் கைபேசி எண்ணை சரிபார்க்கவும்.",
        "உங்கள் கைவினைத் தொழிலைத் தேர்ந்தெடுத்து விவரங்களை சமர்ப்பிக்கவும்.",
        "உள்ளூர் பஞ்சாயத்து மூலமாக உங்களது கைவினைத் தொழில் சரிபார்க்கப்படும்.",
        "பயிற்சி பெற்ற பின் ₹15,000 மதிப்பிலான கருவிகள் வாங்குவதற்கான கூப்பனைப் பெறலாம்."
      ],
      te: [
        "కామన్ సర్వీస్ సెంటర్ (CSC) ద్వారా pmvishwakarma.gov.in లో రిజిస్టర్ చేసుకోండి.",
        "మొబైల్ మరియు ఆధార్ నంబర్ వెరిఫికేషన్ పూర్తి చేయండి.",
        "మీ వృత్తిని ఎంచుకుని వ్యక్తిగత, బ్యాంక్ వివరాలను నమోదు చేయండి.",
        "గ్రామ పంచాయతీ ద్వారా మీ చేతివృత్తి వివరాలు ధృవీకరించబడతాయి.",
        "శిక్షణ పూర్తయిన తర్వాత రూ. 15,000 విలువైన పరికరాల వోచర్ పొందుతారు."
      ]
    }
  },
  {
    scheme_id: "pm_svanidhi",
    name: "PM SVANidhi (Micro Credit Scheme for Street Vendors)",
    category: "Business & Skill Development",
    eligibility: {
      state: null,
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
      hi: "पीएम स्वनिधि योजना रेहड़ी-पटरी और ठेला लगाने वाले दुकानदारों को अपना व्यवसाय बढ़ाने के लिए ₹10,000 से लेकर ₹50,000 तक का बिना गारंटी का लोन देती है।",
      ta: "சாலையோர வியாபாரிகள் தங்கள் தொழிலை தொடங்க ₹10,000 முதல் ₹50,000 வரை பிணையில்லா கடன் வழங்கும் திட்டம்.",
      te: "వీధి వ్యాపారులకు వారి వ్యాపారం పెంచుకోవడానికి ₹10,000 నుండి ₹50,000 వరకు ఎలాంటి గ్యారెంటీ లేని రుణం అందించే పథకం."
    },
    apply_steps: {
      en: [
        "Access the PM SVANidhi website (pmsvanidhi.mohua.gov.in).",
        "Click on 'Apply Loan 10K'.",
        "Enter your mobile number and Aadhaar details to verify.",
        "Enter your Vending Certificate details or Letter of Recommendation (LOR) from the municipality.",
        "Choose a nearby bank for loan disbursement and submit."
      ],
      hi: [
        "पीएम स्वनिधि वेबसाइट (pmsvanidhi.mohua.gov.in) पर जाएं।",
        "'Apply Loan 10K' पर क्लिक करें।",
        "सत्यापन के लिए अपना मोबाइल नंबर और आधार विवरण दर्ज करें।",
        "नगर पालिका द्वारा जारी वेंडिंग प्रमाण पत्र या सिफारिश पत्र (LOR) विवरण दर्ज करें।",
        "ऋण संवितरण के लिए नजदीकी बैंक चुनें और सबमिट करें।"
      ],
      ta: [
        "PM SVANidhi இணையதளத்திற்குச் செல்லவும் (pmsvanidhi.mohua.gov.in).",
        "'Apply Loan 10K' என்பதை கிளிக் செய்யவும்.",
        "கைபேசி எண் மற்றும் ஆதார் எண் கொண்டு சரிபார்க்கவும்.",
        "சாலையோர வியாபாரி என்பதற்கான சான்றிதழ் அல்லது நகராட்சி பரிந்துரை கடிதத்தை பதிவேற்றவும்.",
        "வங்கியைத் தேர்ந்தெடுத்து கடனுக்காக விண்ணப்பிக்கவும்."
      ],
      te: [
        "PM SVANidhi వెబ్‌సైట్ (pmsvanidhi.mohua.gov.in) ఓపెన్ చేయండి.",
        "'Apply Loan 10K' పై క్లిక్ చేయండి.",
        "మొబైల్ మరియు ఆధార్ ద్వారా వెరిఫికేషన్ చేయండి.",
        "మున్సిపాలిటీ జారీ చేసిన వీధి వ్యాపారి గుర్తింపు పత్రం (LOR) నమోదు చేయండి.",
        "మీకు కావలసిన బ్యాంకును ఎంచుకుని లోన్ కోసం దరఖాస్తు చేయండి."
      ]
    }
  },
  {
    scheme_id: "pm_matru_vandana",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "Women & Child Development",
    eligibility: {
      state: null,
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
      hi: "प्रधानमंत्री मातृ वंदना योजना के तहत पहली बार गर्भवती होने वाली महिलाओं को पोषण के लिए ₹5,000 की नकद सहायता सीधे बैंक खाते में दी जाती है।",
      ta: "கர்ப்பிணிப் பெண்களின் ஊட்டச்சத்துக்காக முதல் குழந்தை பிறப்பின் போது ₹5,000 நிதியுதவி வழங்கும் திட்டம்.",
      te: "గర్భిణీ స్త్రీలకు పోషకాహారం కోసం మొదటి బిడ్డ పుట్టినప్పుడు ₹5,000 ఆర్థిక సహాయం అందించే పథకం."
    },
    apply_steps: {
      en: [
        "Go to the local Anganwadi Centre or healthcare facility.",
        "Get the PMMVY Form 1A (for registration) and Form 1B (for subsequent installments).",
        "Fill in personal and bank details, and attach your MCP Card copy.",
        "The Anganwadi worker will submit details on the PMMVY-CAS portal.",
        "Upon verification, money will be directly transferred into the beneficiary's bank account."
      ],
      hi: [
        "स्थानीय आंगनवाड़ी केंद्र या स्वास्थ्य केंद्र में जाएं।",
        "पीएममवीवाई फॉर्म 1A (पंजीकरण के लिए) और फॉर्म 1B (अगली किश्तों के लिए) प्राप्त करें।",
        "व्यक्तिगत और बैंक विवरण भरें, और अपने एमसीपी (MCP) कार्ड की प्रति संलग्न करें।",
        "आंगनवाड़ी कार्यकर्ता PMMVY-CAS पोर्टल पर आपका विवरण दर्ज करेगी।",
        "सत्यापन के बाद, राशि सीधे आपके बैंक खाते में जमा कर दी जाएगी।"
      ],
      ta: [
        "உள்ளூர் அங்கன்வாடி மையம் அல்லது சுகாதார நிலையத்திற்குச் செல்லவும்.",
        "PMMVY படிவம் 1A-ஐப் பெற்று பூர்த்தி செய்யவும்.",
        "தனிப்பட்ட விவரங்களுடன் MCP கார்டு நகலையும் இணைக்கவும்.",
        "அங்கன்வாடி ஊழியர் ஆன்லைனில் விவரங்களைப் பதிவு செய்வார்.",
        "விவரங்கள் சரிபார்க்கப்பட்டதும், வங்கி கணக்கிற்கு பணம் மாற்றப்படும்."
      ],
      te: [
        "స్థానిక అంగన్‌వాడీ కేంద్రం లేదా ప్రాథమిక ఆరోగ్య కేంద్రానికి వెళ్ళండి.",
        "PMMVY ఫారమ్ 1A ను తీసుకుని పూరించండి.",
        "మీ బ్యాంక్ వివరాలతో పాటు MCP కార్డ్ కాపీని జతచేయండి.",
        "అంగన్‌వాడీ కార్యకర్త PMMVY పోర్టల్‌లో మీ వివరాలను అప్‌లోడ్ చేస్తారు.",
        "ధృవీకరణ తర్వాత మీ బ్యాంక్ ఖాతాలో డబ్బులు జమ అవుతాయి."
      ]
    }
  },
  {
    scheme_id: "atal_pension",
    name: "Atal Pension Yojana (APY)",
    category: "Social Security & Pension",
    eligibility: {
      state: null,
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
      hi: "अटल पेंशन योजना 18 से 40 वर्ष के असंगठित क्षेत्र के लोगों के लिए है, जो उनके अंशदान के आधार पर 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 की मासिक पेंशन की गारंटी देती है।",
      ta: "அமைப்புசாரா தொழிலாளர்கள் 60 வயதிற்குப் பிறகு ₹1,000 முதல் ₹5,000 வரை மாத ஓய்வூதியம் பெற உதவும் திட்டம்.",
      te: "అసంఘటిత రంగ కార్మికులు 60 ఏళ్ల తర్వాత ₹1,000 నుండి ₹5,000 వరకు నెలవారీ పెన్షన్ పొందే పొదుపు పథకం."
    },
    apply_steps: {
      en: [
        "Visit the bank branch where you have your savings account.",
        "Fill out the APY registration form with choice of pension (₹1,000 to ₹5,000).",
        "Provide Aadhaar and mobile number linked to bank account.",
        "Set up auto-debit facility from your savings account for monthly contributions.",
        "You will receive an APY PRAN card via post."
      ],
      hi: [
        "उस बैंक शाखा में जाएं जहां आपका बचत खाता है।",
        "पेंशन के विकल्प (₹1,000 से ₹5,000) के साथ एपीवाई पंजीकरण फॉर्म भरें।",
        "बैंक खाते से लिंक आधार और मोबाइल नंबर प्रदान करें।",
        "मासिक अंशदान के लिए अपने बैंक खाते से ऑटो-डेबिट (Auto-Debit) विकल्प सेट करें।",
        "आपको डाक के माध्यम से एपीवाई प्रान (PRAN) कार्ड प्राप्त होगा।"
      ],
      ta: [
        "உங்களது சேமிப்பு கணக்கு உள்ள வங்கி கிளைக்குச் செல்லவும்.",
        "மாத ஓய்வூதிய அளவைத் (₹1,000 - ₹5,000) தேர்வு செய்து APY படிவத்தை நிரப்பவும்.",
        "ஆதார் மற்றும் கைபேசி எண்ணை வங்கியிடம் வழங்கவும்.",
        "மாதாந்திர பங்களிப்புக்காக ஆட்டோ-டெபிட் வசதியை அமைக்கவும்.",
        "விண்ணப்பம் முடிந்த பின் PRAN அட்டை உங்களுக்கு அஞ்சல் மூலம் வரும்."
      ],
      te: [
        "మీకు ఖాతా ఉన్న బ్యాంకు బ్రాంచ్‌కు వెళ్ళండి.",
        "మీకు కావలసిన పెన్షన్ మొత్తాన్ని (రూ. 1,000 నుండి రూ. 5,000) ఎంచుకుని APY ఫారమ్ పూరించండి.",
        "బ్యాంకు ఖాతాకు లింక్ అయిన ఆధార్ మరియు మొబైల్ నంబర్ వివరాలు ఇవ్వండి.",
        "నెలవారీ కంట్రిబ్యూషన్ కోసం బ్యాంకు ఖాతాకు ఆటో-డెబిట్ ఆప్షన్ సెట్ చేసుకోండి.",
        "కొద్ది రోజుల్లో పోస్ట్ ద్వారా APY PRAN కార్డ్ అందుతుంది."
      ]
    }
  },
  {
    scheme_id: "pm_shram_yogi_maandhan",
    name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
    category: "Social Security & Pension",
    eligibility: {
      state: null,
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
      hi: "पीएम श्रम योगी मान-धन योजना ₹15,000 से कम कमाने वाले असंगठित श्रमिकों के लिए है, जो 60 साल के होने पर ₹3,000 की मासिक पेंशन देती है।",
      ta: "மாத வருமானம் ₹15,000க்கு கீழ் உள்ள தொழிலாளர்களுக்கு 60 வயதிற்குப் பிறகு ₹3,000 மாத ஓய்வூதியம் வழங்கும் திட்டம்.",
      te: "నెలవారీ ఆదాయం ₹15,000 లోపు ఉన్న కార్మికులకు 60 ఏళ్ల తర్వాత ₹3,000 పెన్షన్ అందించే పథకం."
    },
    apply_steps: {
      en: [
        "Visit your nearest Common Service Centre (CSC).",
        "Provide your Aadhaar card and Bank Account passbook to the CSC operator.",
        "The operator will calculate your monthly contribution (based on age, from ₹55 to ₹200).",
        "Make the first contribution in cash; subsequent ones will be auto-debited.",
        "Sign the auto-debit consent form and collect your Shram Yogi Card."
      ],
      hi: [
        "अपने नजदीकी जन सेवा केंद्र (CSC) पर जाएं।",
        "CSC संचालक को अपना आधार कार्ड और बैंक खाता पासबुक दिखाएं।",
        "संचालक आपकी उम्र के आधार पर मासिक योगदान (₹55 से ₹200 तक) की गणना करेगा।",
        "पहला योगदान नकद में दें; इसके बाद का ऑटो-डेबिट हो जाएगा।",
        "ऑटो-डेबिट सहमति फॉर्म पर हस्ताक्षर करें और श्रम योगी कार्ड प्राप्त करें।"
      ],
      ta: [
        "அருகிலுள்ள பொது சேவை மையத்திற்குச் (CSC) செல்லவும்.",
        "ஆதார் கார்டு மற்றும் வங்கி கணக்கு புத்தகத்தை சமர்ப்பிக்கவும்.",
        "வயதுக்கு ஏற்ப கணக்கிடப்படும் மாதாந்திர தொகையை (₹55 முதல் ₹200 வரை) செலுத்தவும்.",
        "முதல் மாத பங்களிப்பை செலுத்த வேண்டும்; அடுத்தடுத்த மாதங்கள் தானாகவே கழித்துக்கொள்ளப்படும்.",
        "பதிவு முடிந்ததும் ஷ்ரம் யோகி அட்டையைப் பெற்றுக் கொள்ளவும்."
      ],
      te: [
        "సమీప కామన్ సర్వీస్ సెంటర్ (CSC) కి వెళ్ళండి.",
        "ఆపరేటర్‌కు మీ ఆధార్ కార్డ్ మరియు బ్యాంక్ పాస్‌బుక్ ఇవ్వండి.",
        "వయస్సును బట్టి నెలవారీ కంట్రిబ్యూషన్ (రూ. 55 నుండి రూ. 200) సిస్టమ్ లెక్కిస్తుంది.",
        "మొదటి నెల కంట్రిబ్యూషన్ చెల్లించండి; తదుపరివి బ్యాంక్ ఖాతా నుండి కట్ అవుతాయి.",
        "ఆటో-డెబిట్ అనుమతి పత్రం పై సంతకం చేసి శ్రమ యోగి కార్డ్ తీసుకోండి."
      ]
    }
  },
  {
    scheme_id: "pm_mudra_yojana",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    category: "Business & Skill Development",
    eligibility: {
      state: null,
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
      hi: "मुद्रा योजना के तहत छोटे दुकानदारों और व्यापारियों को अपना काम शुरू करने या बढ़ाने के लिए ₹10 लाख तक का बिना गारंटी का व्यापार ऋण मिलता है।",
      ta: "சிறு மற்றும் குறு தொழில் தொடங்க ₹50,000 முதல் ₹10 லட்சம் வரை பிணையில்லா கடன் வழங்கும் திட்டம்.",
      te: "చిన్న వ్యాపారాలు ప్రారంభించడానికి ₹50,000 నుండి ₹10 లక్షల వరకు ఎలాంటి గ్యారెంటీ లేని రుణం అందించే పథకం."
    },
    apply_steps: {
      en: [
        "Prepare a business proposal showing planned activities and equipment needed.",
        "Visit any commercial bank, rural bank, or microfinance institution.",
        "Request the Mudra Loan application form (Shishu, Kishor, or Tarun).",
        "Submit documents including identity proof, business address proof, and equipment quotations.",
        "The bank will process the request and disburse the collateral-free loan."
      ],
      hi: [
        "योजनाबद्ध गतिविधियों और आवश्यक उपकरणों को दर्शाने वाला एक व्यावसायिक प्रस्ताव तैयार करें।",
        "किसी भी व्यावसायिक बैंक, ग्रामीण बैंक या सूक्ष्म वित्त संस्थान में जाएं।",
        "मुद्रा ऋण आवेदन पत्र (शिशु, किशोर या तरुण) मांगें।",
        "पहचान प्रमाण, व्यावसायिक पता प्रमाण और उपकरणों के कोटेशन सहित दस्तावेज जमा करें।",
        "बैंक आपके अनुरोध की जांच करेगा और बिना गारंटी का ऋण वितरित करेगा।"
      ],
      ta: [
        "உங்களது தொழில் திட்டம் மற்றும் உபகரணங்களின் விலை பட்டியலை தயார் செய்யவும்.",
        "ஏதேனும் ஒரு பொதுத்துறை அல்லது கிராமிய வங்கிக்குச் செல்லவும்.",
        "முத்ரா கடன் (Mudra Loan) விண்ணப்பப் படிவத்தை பெற்று நிரப்பவும்.",
        "அடையாள சான்று, தொழில் முகவரி சான்று போன்ற ஆவணங்களைச் சமர்ப்பிக்கவும்.",
        "வங்கி விவரங்களை பரிசீலித்து பிணையில்லா கடனை அனுமதிக்கும்."
      ],
      te: [
        "మీ వ్యాపార ప్రణాళిక మరియు అవసరమైన యంత్రాల ధరల పట్టిక సిద్ధం చేసుకోండి.",
        "ఏదైనా ప్రభుత్వ లేదా గ్రామీణ బ్యాంకును సంప్రదించండి.",
        "ముద్ర లోన్ (Mudra Loan) దరఖాస్తు ఫారమ్ తీసుకోండి.",
        "గుర్తింపు కార్డు, వ్యాపార చిరునామా పత్రాలతో పాటు ఫారమ్ సమర్పించండి.",
        "బ్యాంకు వారు మీ దరఖాస్తును వెరిఫై చేసి గ్యారెంటీ లేని రుణం మంజూరు చేస్తారు."
      ]
    }
  },
  {
    scheme_id: "nsap_old_age_pension",
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    category: "Social Security & Pension",
    eligibility: {
      state: null,
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
      hi: "राष्ट्रीय वृद्धावस्था पेंशन योजना के तहत 60 वर्ष या उससे अधिक उम्र के बीपीएल (BPL) परिवारों के बुजुर्गों को हर महीने पेंशन राशि दी जाती है।",
      ta: "வறுமைக் கோட்டிற்கு கீழ் உள்ள 60 வயதுக்கு மேற்பட்ட முதியவர்களுக்கு அரசு வழங்கும் மாதாந்திர முதியோர் ஓய்வூதியத் திட்டம்.",
      te: "దారిద్ర్య రేఖకు దిగువన ఉన్న 60 సంవత్సరాలు పైబడిన వృద్ధులకు అందించే నెలవారీ వృద్ధాప్య పెన్షన్ పథకం."
    },
    apply_steps: {
      en: [
        "Visit your local Gram Panchayat office (in villages) or Social Welfare Office (in towns).",
        "Obtain the Old Age Pension application form.",
        "Attach your age proof (birth cert or school cert), Aadhaar, BPL Ration Card, and bank details.",
        "Submit the form to the Block Development Officer (BDO) or Social Welfare Officer.",
        "After verification, monthly pension payments will start via Direct Benefit Transfer."
      ],
      hi: [
        "अपने स्थानीय ग्राम पंचायत कार्यालय (गाँवों में) या समाज कल्याण कार्यालय (शहरों में) में जाएँ।",
        "वृद्धावस्था पेंशन आवेदन पत्र प्राप्त करें।",
        "अपनी आयु का प्रमाण, आधार, बीपीएल राशन कार्ड और बैंक विवरण संलग्न करें।",
        "फॉर्म ब्लॉक विकास अधिकारी (BDO) या समाज कल्याण अधिकारी के पास जमा करें।",
        "सत्यापन के बाद, मासिक पेंशन सीधे बैंक खाते में जमा होना शुरू हो जाएगी।"
      ],
      ta: [
        "வட்டார வளர்ச்சி அலுவலகம் (BDO) அல்லது சமூக நலத்துறை அலுவலகத்தை அணுகவும்.",
        "முதியோர் ஓய்வூதிய விண்ணப்பப் படிவத்தைப் பெறவும்.",
        "வயது சான்று, ஆதார், பிபிஎல் கார்டு மற்றும் வங்கி கணக்கு நகலை இணைக்கவும்.",
        "பூர்த்தி செய்த விண்ணப்பத்தை அதிகாரியிடம் சமர்ப்பிக்கவும்.",
        "சரிபார்ப்பிற்குப் பிறகு, ஓய்வூதியத் தொகை உங்கள் கணக்கில் வரவு வைக்கப்படும்."
      ],
      te: [
        "మీ స్థానిక గ్రామ పంచాయతీ లేదా సాంఘిక సంక్షేమ శాఖ కార్యాలయానికి వెళ్ళండి.",
        "వృద్ధాప్య పెన్షన్ దరఖాస్తు ఫారమ్ తీసుకోండి.",
        "వయస్సు ధృవీకరణ పత్రం, ఆధార్, BPL కార్డు మరియు బ్యాంక్ వివరాలు జతచేయండి.",
        "ఫారమ్‌ను BDO లేదా సంక్షేమ అధికారికి సమర్పించండి.",
        "ధృవీకరణ పూర్తయిన తర్వాత నెలవారీ పెన్షన్ నేరుగా బ్యాంక్ ఖాతాలో పడుతుంది."
      ]
    }
  },
  {
    scheme_id: "nsap_widow_pension",
    name: "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
    category: "Social Security & Pension",
    eligibility: {
      state: null,
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
      hi: "राष्ट्रीय विधवा पेंशन योजना के तहत 40 से 79 वर्ष की बीपीएल परिवारों की विधवा महिलाओं को हर महीने वित्तीय पेंशन दी जाती है।",
      ta: "வறுமைக் கோட்டிற்கு கீழ் உள்ள 40 முதல் 79 வயதுடைய கணவனை இழந்த பெண்களுக்கு அரசு வழங்கும் விதவை ஓய்வூதியத் திட்டம்.",
      te: "దారిద్ర్య రేఖకు దిగువన ఉన్న 40 నుండి 79 సంవత్సరాల వయస్సు గల వితంతువులకు అందించే నెలవారీ పెన్షన్ పథకం."
    },
    apply_steps: {
      en: [
        "Go to the local Social Welfare Office or nearest CSC.",
        "Get the Widow Pension application form.",
        "Fill in details and attach husband's death certificate, age proof, Aadhaar, and BPL card.",
        "Submit the application to the local Tehsildar or Welfare Officer.",
        "Your status will be verified, and monthly pension will be credited to your bank account."
      ],
      hi: [
        "स्थानीय समाज कल्याण कार्यालय या नजदीकी जन सेवा केंद्र (CSC) पर जाएं।",
        "विधवा पेंशन आवेदन पत्र प्राप्त करें।",
        "विवरण भरें और पति का मृत्यु प्रमाण पत्र, आयु प्रमाण, आधार और बीपीएल कार्ड संलग्न करें।",
        "आवेदन पत्र स्थानीय तहसीलदार या कल्याण अधिकारी के पास जमा करें।",
        "आपके विवरण का सत्यापन होगा, और मासिक पेंशन सीधे आपके खाते में आने लगेगी।"
      ],
      ta: [
        "அருகிலுள்ள சமூக நலத்துறை அலுவலகம் அல்லது CSC மையத்திற்குச் செல்லவும்.",
        "விதவை ஓய்வூதிய விண்ணப்பப் படிவத்தைப் பெறவும்.",
        "விவரங்களை நிரப்பி, கணவரின் இறப்புச் சான்றிதழ், ஆதார், பிபிஎல் கார்டு இணைக்கவும்.",
        "பூர்த்தி செய்த விண்ணப்பத்தை வட்டாட்சியர் அல்லது நலத்துறை அதிகாரியிடம் சமர்ப்பிக்கவும்.",
        "சரிபார்க்கப்பட்ட பின் ஓய்வூதிய நிதி உங்கள் வங்கிக் கணக்கில் வரவு வைக்கப்படும்."
      ],
      te: [
        "స్థానిక సాంఘిక సంక్షేమ కార్యాలయం లేదా CSC కేంద్రానికి వెళ్ళండి.",
        "వితంతు పెన్షన్ దరఖాస్తు ఫారమ్ తీసుకోండి.",
        "భర్త మరణ ధృవీకరణ పత్రం, వయస్సు ధృవీకరణ, ఆధార్ మరియు BPL కార్డ్ జతచేయండి.",
        "దరఖాస్తును తహశీల్దార్ లేదా సంక్షేమ అధికారికి సమర్పించండి.",
        "వెరిఫికేషన్ తర్వాత పెన్షన్ నేరుగా బ్యాంక్ ఖాతాలో జమ చేయబడుతుంది."
      ]
    }
  },

  // ==================== STATE SPECIFIC SCHEMES ====================

  {
    scheme_id: "up_kanya_vivah",
    name: "UP Shramik Kanya Vivah Sahayata Yojana",
    category: "Social Welfare & Marriage",
    eligibility: {
      state: "uttar_pradesh",
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: ["laborer", "construction_worker"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Financial assistance of ₹51,000 for the marriage of daughters of registered unorganized/construction workers in UP.",
    documents_needed: ["Aadhaar Card of Parent & Daughter", "UP Labour Card (BOCW Registration)", "Daughter's Age Proof (18+)", "Marriage Invitation Card / Marriage Certificate", "Bank Account Passbook of Parent"],
    apply_url: "https://upbocw.in/",
    language_summary: {
      en: "Uttar Pradesh government offers ₹51,000 financial aid for the marriage of daughters of registered construction workers.",
      hi: "उत्तर प्रदेश सरकार पंजीकृत निर्माण श्रमिकों की बेटियों की शादी के लिए ₹51,000 की वित्तीय सहायता प्रदान करती है।"
    },
    apply_steps: {
      en: [
        "Ensure your UP BOCW Board Labour registration is active for at least 1 year.",
        "Visit the UP Labour Portal (upbocw.in).",
        "Login with your registration number and click on 'Apply for Scheme'.",
        "Select 'UP Shramik Kanya Vivah Sahayata Yojana'.",
        "Fill details, upload daughter's age proof, marriage card, and submit."
      ],
      hi: [
        "सुनिश्चित करें कि आपका यूपी बीओसीडब्ल्यू बोर्ड श्रम पंजीकरण कम से कम 1 वर्ष पुराना हो।",
        "उत्तर प्रदेश श्रम विभाग पोर्टल (upbocw.in) पर जाएं।",
        "पंजीकरण संख्या के साथ लॉगिन करें और 'योजना आवेदन' पर क्लिक करें।",
        "श्रामिक कन्या विवाह सहायता योजना का चयन करें।",
        "विवरण भरें, बेटी की उम्र का प्रमाण और शादी का कार्ड अपलोड करें, फिर सबमिट करें।"
      ]
    }
  },
  {
    scheme_id: "tn_pudhumai_penn",
    name: "Tamil Nadu Pudhumai Penn Scheme",
    category: "Women Education",
    eligibility: {
      state: "tamil_nadu",
      min_age: 17,
      max_age: 25,
      gender: ["female"],
      occupations: ["student"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Financial assistance of ₹1,000 per month deposited directly into the bank accounts of girl students for pursuing higher education.",
    documents_needed: ["Aadhaar Card", "School Certificates (studied from 6th to 12th in Tamil Nadu Govt schools)", "College Admission/ID Card", "Bank Passbook"],
    apply_url: "https://penkalvi.tn.gov.in/",
    language_summary: {
      en: "Tamil Nadu government provides ₹1,000 monthly to girl students who studied in government schools to support their higher education.",
      ta: "அரசுப் பள்ளிகளில் படித்த மாணவிகளின் உயர்கல்விக்காக தமிழக அரசு வழங்கும் மாதந்தோறும் ₹1,000 வழங்கும் மூவலூர் ராமாமிர்தம் அம்மையார் புதுமைப் பெண் திட்டம்."
    },
    apply_steps: {
      en: [
        "Visit the Pudhumai Penn portal (penkalvi.tn.gov.in) or apply through your college.",
        "Submit details of your education showing study in government schools from Class 6 to 12.",
        "Upload Aadhaar, college admission details, and bank account passbook copy.",
        "The college principal verifies the government school certificates.",
        "Once approved by the Social Welfare Department, ₹1,000 monthly credits begin."
      ],
      ta: [
        "புதுமை பெண் இணையதளத்திற்குச் செல்லவும் (penkalvi.tn.gov.in) அல்லது உங்கள் கல்லூரி மூலமாக விண்ணப்பிக்கவும்.",
        "6 முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான சான்றிதழ்களை வழங்கவும்.",
        "ஆதார், கல்லூரி சேர்க்கை விவரம் மற்றும் வங்கி புத்தக நகலை பதிவேற்றவும்.",
        "கல்லூரி முதல்வர் உங்கள் சான்றிதழ்களை சரிபார்ப்பார்.",
        "சமூக நலத்துறையின் ஒப்புதலுக்குப் பின் மாதம் ₹1,000 உங்கள் கணக்கில் வரவு வைக்கப்படும்."
      ]
    }
  },
  {
    scheme_id: "ts_rythu_bandhu",
    name: "Telangana Rythu Bandhu Scheme",
    category: "Agriculture & Farmers",
    eligibility: {
      state: "telangana",
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: ["farmer"],
      land_ownership: true,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Investment support of ₹5,000 per acre per crop season (₹10,000/year) directly transferred into farmers' bank accounts for purchasing seeds, fertilizer, etc.",
    documents_needed: ["Pattadar Dharani Passbook", "Aadhaar Card", "Bank Account Details", "Mobile Number linked to Aadhaar"],
    apply_url: "https://dharani.telangana.gov.in/",
    language_summary: {
      en: "Telangana government provides land-owning farmers ₹5,000 per acre per season for agricultural investment support.",
      te: "తెలంగాణ ప్రభుత్వం భూమి కలిగిన రైతులకు వ్యవసాయ పెట్టుబడి సహాయం కింద ఎకరానికి ₹5,000 చొప్పున ప్రతి సీజన్‌కు అందిస్తుంది."
    },
    apply_steps: {
      en: [
        "Ensure your agricultural land is registered on the Telangana Dharani Portal.",
        "Contact the local Agriculture Extension Officer (AEO) or Mandal Revenue Office.",
        "Submit your Dharani Pattadar Passbook details, Aadhaar, and Bank passbook.",
        "The AEO verifies the land registration status.",
        "Funds are credited directly to your bank account twice a year."
      ],
      te: [
        "మీ వ్యవసాయ భూమి తెలంగాణ ధరణి పోర్టల్‌లో నమోదై ఉండేలా చూసుకోండి.",
        "స్థానిక వ్యవసాయ విస్తరణ అధికారి (AEO) లేదా మండల రెవెన్యూ కార్యాలయాన్ని సంప్రదించండి.",
        "మీ ధరణి పట్టాదారు పాస్‌బుక్, ఆధార్ మరియు బ్యాంక్ పాస్‌బుక్ సమర్పించండి.",
        "AEO మీ భూమి వివరాలను ధృవీకరిస్తారు.",
        "సంవత్సరానికి రెండుసార్లు పెట్టుబడి సాయం నేరుగా మీ బ్యాంక్ ఖాతాలో జమ అవుతుంది."
      ]
    }
  },
  {
    scheme_id: "mh_ladli_behna",
    name: "Maharashtra Majhi Ladki Bahin Yojana",
    category: "Women Empowerment",
    eligibility: {
      state: "maharashtra",
      min_age: 21,
      max_age: 65,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: 20000,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee", "income_tax_payer"]
    },
    benefits: "Monthly financial assistance of ₹1,500 deposited directly into the bank accounts of eligible women in Maharashtra.",
    documents_needed: ["Aadhaar Card", "Domicile Certificate of Maharashtra", "Income Certificate (Annual family income under ₹2.5 Lakhs)", "Ration Card (Yellow/Orange)", "Bank Account Details"],
    apply_url: "https://ladkibahin.maharashtra.gov.in/",
    language_summary: {
      en: "Maharashtra government provides ₹1,500 monthly to women from lower income groups (under ₹2.5 Lakhs/year).",
      hi: "महाराष्ट्र सरकार कम आय वाले परिवारों की पात्र महिलाओं को हर महीने ₹1,500 की वित्तीय सहायता प्रदान करती है।"
    },
    apply_steps: {
      en: [
        "Download the Nari Shakti Doot mobile app or visit the official Ladki Bahin portal.",
        "Register with your mobile number and fill in the application form.",
        "Upload your Aadhaar card, Maharashtra Domicile, and Family Income Certificate.",
        "Provide bank account details linked with your Aadhaar Card.",
        "Submit the application and track the approval status."
      ],
      hi: [
        "नारी शक्ति दूत मोबाइल ऐप डाउनलोड करें या आधिकारिक लाडकी बहिन पोर्टल पर जाएं।",
        "अपने मोबाइल नंबर के साथ पंजीकरण करें और आवेदन पत्र भरें।",
        "अपना आधार कार्ड, महाराष्ट्र अधिवास (Domicile) और पारिवारिक आय प्रमाण पत्र अपलोड करें।",
        "अपने आधार से लिंक बैंक खाते का विवरण प्रदान करें।",
        "आवेदन जमा करें और मंजूरी की स्थिति की जांच करें।"
      ]
    }
  },
  {
    scheme_id: "br_swayam_bhatta",
    name: "Bihar Swayam Sahayata Bhatta Yojana",
    category: "Social Security & Employment",
    eligibility: {
      state: "bihar",
      min_age: 20,
      max_age: 25,
      gender: null,
      occupations: ["unemployed"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Unemployment allowance of ₹1,000 per month for a maximum of 2 years to help job-seeking youth from Bihar.",
    documents_needed: ["Aadhaar Card", "Bihar Resident Proof (Domicile)", "Educational Qualification Certificates (12th Pass minimum)", "Unemployment Declaration", "Bank Account Details"],
    apply_url: "https://www.7nishchay-yuvaupmission.bihar.gov.in/",
    language_summary: {
      en: "Bihar government provides a monthly unemployment allowance of ₹1,000 for up to 2 years to 12th pass job-seeking youth.",
      hi: "बिहार सरकार 12वीं पास बेरोजगार युवाओं को नौकरी खोजने में मदद के लिए 2 साल तक ₹1,000 प्रति माह का बेरोजगारी भत्ता देती है।"
    },
    apply_steps: {
      en: [
        "Visit the Bihar Youth Mission portal (7nishchay-yuvaupmission.bihar.gov.in).",
        "Register under 'New User' and select 'Swayam Sahayata Bhatta Yojana'.",
        "Fill in personal information and upload educational certificates (minimum 12th pass).",
        "Submit resident proof and bank details.",
        "Visit the District Registration and Counseling Centre (DRCC) for document physical verification."
      ],
      hi: [
        "बिहार युवा मिशन पोर्टल (7nishchay-yuvaupmission.bihar.gov.in) पर जाएं।",
        "'New User' पंजीकरण करें और 'स्वयं सहायता भत्ता योजना' चुनें।",
        "व्यक्तिगत जानकारी भरें और शैक्षणिक प्रमाणपत्र (न्यूनतम 12वीं पास) अपलोड करें।",
        "निवास प्रमाण और बैंक विवरण जमा करें।",
        "दस्तावेज सत्यापन के लिए अपने जिला पंजीकरण और परामर्श केंद्र (DRCC) का दौरा करें।"
      ]
    }
  },
  {
    scheme_id: "wb_lakshmir_bhandar",
    name: "West Bengal Lakshmir Bhandar Scheme",
    category: "Women Empowerment",
    eligibility: {
      state: "west_bengal",
      min_age: 25,
      max_age: 60,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Financial support of ₹1,000 per month for General category and ₹1,200 per month for SC/ST category women heads of families in West Bengal.",
    documents_needed: ["Aadhaar Card", "Swasthya Sathy Card (Health Card)", "SC/ST Certificate (if applicable)", "Bank Account linked to Aadhaar", "West Bengal Domicile proof"],
    apply_url: "https://socialsecurity.wb.gov.in/",
    language_summary: {
      en: "West Bengal provides ₹1,000 (General) or ₹1,200 (SC/ST) monthly assistance to female heads of households."
    },
    apply_steps: {
      en: [
        "Collect the Lakshmir Bhandar application form from the 'Duare Sarkar' camp.",
        "Fill out the form with Swasthya Sathy Card details and Aadhaar number.",
        "Attach caste certificate (SC/ST) for higher benefits.",
        "Submit the form along with bank passbook copy at the Duare Sarkar camp.",
        "Upon verification, monthly pension credits will begin."
      ]
    }
  },
  {
    scheme_id: "ka_gruha_lakshmi",
    name: "Karnataka Gruha Lakshmi Scheme",
    category: "Women Empowerment",
    eligibility: {
      state: "karnataka",
      min_age: 18,
      max_age: null,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee", "income_tax_payer"]
    },
    benefits: "Monthly financial assistance of ₹2,000 directly transferred to the bank accounts of women heads of households in Karnataka.",
    documents_needed: ["Aadhaar Card of Woman Head & Husband", "Ration Card (BPL/Antyodaya/APL)", "Bank Passbook of applicant", "Mobile Number linked to Aadhaar"],
    apply_url: "https://sevasindhu.karnataka.gov.in/",
    language_summary: {
      en: "Karnataka government provides ₹2,000 monthly to the female head of every eligible household in the state."
    },
    apply_steps: {
      en: [
        "Go to the nearest Karnataka One, Bangalore One, or Grama One center.",
        "Provide your Ration Card number and Aadhaar card of the woman head.",
        "The operator submits the application on the Seva Sindhu portal.",
        "Your bank account must be Aadhaar-seeded.",
        "The government credits ₹2,000 directly to the bank account."
      ]
    }
  },
  {
    scheme_id: "rj_chiranjeevi",
    name: "Rajasthan Chiranjeevi Swasthya Bima Yojana",
    category: "Health & Medical",
    eligibility: {
      state: "rajasthan",
      min_age: null,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Cashless health insurance cover up to ₹25 Lakhs per family per year for indoor medical treatments in Rajasthan.",
    documents_needed: ["Jan Aadhaar Card / Rajasthan Bhamashah Card", "Aadhaar Card", "Mobile Number linked to Jan Aadhaar"],
    apply_url: "https://chiranjeevi.rajasthan.gov.in/",
    language_summary: {
      en: "Rajasthan provides health insurance coverage up to ₹25 Lakhs per year for all residents (free for BPL/marginal, small fee for others).",
      hi: "राजस्थान सरकार सभी निवासियों को ₹25 लाख तक का कैशलेस स्वास्थ्य बीमा प्रदान करती है (गरीबों के लिए मुफ्त, दूसरों के लिए मामूली शुल्क)।"
    },
    apply_steps: {
      en: [
        "Go to the official Chiranjeevi Yojana portal or nearest E-Mitra kiosk.",
        "Register using your Jan Aadhaar Card number.",
        "If you belong to a free category (BPL, small farmer), your registration is free.",
        "Others must pay a nominal annual premium of ₹850.",
        "Collect the policy document for cashless hospital admissions."
      ],
      hi: [
        "आधिकारिक चिरंजीवी योजना पोर्टल पर जाएं या नजदीकी ई-मित्र (E-Mitra) केंद्र पर जाएं।",
        "अपने जन आधार कार्ड नंबर का उपयोग करके पंजीकरण करें।",
        "यदि आप मुफ्त श्रेणी (बीपीएल, लघु किसान) से हैं, तो पंजीकरण निःशुल्क है।",
        "अन्य लोगों को ₹850 का मामूली वार्षिक प्रीमियम देना होगा।",
        "कैशलेस अस्पताल में भर्ती होने के लिए पॉलिसी दस्तावेज़ प्राप्त करें।"
      ]
    }
  },
  {
    scheme_id: "gj_ma_yojana",
    name: "Gujarat Mukhyamantri Amrutam (MA) Yojana",
    category: "Health & Medical",
    eligibility: {
      state: "gujarat",
      min_age: null,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: 10000,
      bpl: true,
      disability_status: null,
      exclusions: []
    },
    benefits: "Cashless health insurance cover up to ₹5 Lakhs per family per year for tertiary medical procedures.",
    documents_needed: ["Aadhaar Card", "Gujarat Domicile Proof", "Ration Card (BPL)", "Income Certificate (Annual family income under ₹1.2 Lakhs)"],
    apply_url: "https://www.magujarat.com/",
    language_summary: {
      en: "Gujarat government provides free cashless medical treatment up to ₹5 Lakhs per year for BPL and lower-income families."
    },
    apply_steps: {
      en: [
        "Visit your District Civic Centre or nearest Taluka kiosk.",
        "Collect the MA Yojana application form.",
        "Attach BPL Ration Card, Income Certificate, and Aadhaar card.",
        "Biometric fingerprinting and family photos will be captured at the centre.",
        "Receive the MA Card on the spot to start cashless treatment."
      ]
    }
  },
  {
    scheme_id: "mp_ladli_behna",
    name: "Madhya Pradesh Ladli Behna Yojana",
    category: "Women Empowerment",
    eligibility: {
      state: "madhya_pradesh",
      min_age: 21,
      max_age: 60,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: 20000,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee", "income_tax_payer"]
    },
    benefits: "Monthly assistance of ₹1,250 deposited directly into the bank accounts of married women in Madhya Pradesh.",
    documents_needed: ["Samagra ID (Family & Member ID)", "Aadhaar Card", "Mobile Number linked to Samagra", "Bank account linked with Aadhaar"],
    apply_url: "https://cmladlibahna.mp.gov.in/",
    language_summary: {
      en: "Madhya Pradesh government provides ₹1,250 monthly support to married, divorced, or widowed women from low income groups.",
      hi: "मध्य प्रदेश सरकार निम्न और मध्यम वर्ग की विवाहित, तलाकशुदा या विधवा महिलाओं को प्रति माह ₹1,250 की सहायता देती है।"
    },
    apply_steps: {
      en: [
        "Complete your e-KYC on the Samagra portal.",
        "Attend the ward/village level camp organised by the local administration.",
        "Submit your Samagra ID, Aadhaar Card, and bank account details.",
        "A photo will be clicked live at the camp for verification.",
        "Collect your receipt. Funds are credited on the 10th of every month."
      ],
      hi: [
        "समग्र (Samagra) पोर्टल पर अपना ई-केवाईसी पूरा करें।",
        "स्थानीय प्रशासन द्वारा आयोजित वार्ड/ग्राम स्तर के शिविर में भाग लें।",
        "अपनी समग्र आईडी, आधार कार्ड और बैंक खाते का विवरण जमा करें।",
        "सत्यापन के लिए शिविर में लाइव फोटो खींची जाएगी।",
        "रसीद प्राप्त करें। हर महीने की 10 तारीख को पैसा बैंक खाते में भेजा जाता है।"
      ]
    }
  },
  {
    scheme_id: "dl_ladli",
    name: "Delhi Ladli Scheme",
    category: "Women & Child Development",
    eligibility: {
      state: "delhi",
      min_age: 0,
      max_age: 18,
      gender: ["female"],
      occupations: ["student"],
      land_ownership: null,
      max_income: 8000,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Financial assistance in the form of fixed deposits at various stages of girl child's life (up to ₹1 Lakh total on completing Class 12).",
    documents_needed: ["Delhi Domicile Proof (last 3 years)", "Income Certificate (Annual income under ₹1 Lakh)", "Birth Certificate of girl child", "Aadhaar Card of Parent & Child"],
    apply_url: "http://www.wcddel.in/",
    language_summary: {
      en: "Delhi government registers girl children born in Delhi to low-income families and creates long term fixed deposits to secure education.",
      hi: "दिल्ली सरकार कम आय वाले परिवारों में जन्मी बालिकाओं के नाम पर सावधि जमा (Fixed Deposit) करती है, जो कक्षा 12 पास करने पर मिलती है।"
    },
    apply_steps: {
      en: [
        "Obtain the Delhi Ladli application form from the Government school or local WCD office.",
        "Fill the form and attach Delhi resident proof (last 3 years), income certificate, and birth certificate.",
        "Submit the application within 1 year of the child's birth or at the time of admission in Class 1, 6, 9, 10 or 12.",
        "The funds are managed by SBILIFE and mature when the girl turns 18 and passes Class 10/12.",
        "Upon maturity, submit a claim form to WCD to transfer funds to the girl's bank account."
      ],
      hi: [
        "सरकारी स्कूल या स्थानीय महिला एवं बाल विकास विभाग (WCD) कार्यालय से दिल्ली लाडली आवेदन पत्र प्राप्त करें।",
        "फॉर्म भरें और पिछले 3 वर्षों का दिल्ली निवास प्रमाण, आय प्रमाण पत्र और जन्म प्रमाण पत्र संलग्न करें।",
        "बच्ची के जन्म के 1 वर्ष के भीतर या कक्षा 1, 6, 9, 10 या 12 में प्रवेश के समय आवेदन जमा करें।",
        "राशि का प्रबंधन SBILIFE द्वारा किया जाता है और बच्ची के 18 वर्ष की होने और 10/12वीं पास करने पर परिपक्व होती है।",
        "परिपक्वता पर, राशि को लड़की के बैंक खाते में स्थानांतरित करने के लिए दावा फॉर्म जमा करें।"
      ]
    }
  },
  {
    scheme_id: "kl_karunya",
    name: "Kerala Karunya Benevolent Fund",
    category: "Health & Medical",
    eligibility: {
      state: "kerala",
      min_age: null,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: 8000,
      bpl: true,
      disability_status: null,
      exclusions: []
    },
    benefits: "Financial aid up to ₹3 Lakhs for poor families in Kerala for treatment of cancer, heart disease, kidney diseases, and palliative care.",
    documents_needed: ["Karunya Card / Health Card", "Aadhaar Card", "Ration Card (BPL)", "Medical Certificate/Treatment Plan from Govt Hospital"],
    apply_url: "https://karunya.kerala.gov.in/",
    language_summary: {
      en: "Kerala government provides financial medical aid up to ₹3 Lakhs for cancer, kidney, and heart treatments for lower-income groups."
    },
    apply_steps: {
      en: [
        "Get a medical certificate and treatment cost estimate from an empanelled government or private hospital in Kerala.",
        "Download the Karunya application form from the portal.",
        "Submit the form along with BPL ration card, Aadhaar, and treatment certificate to the District Lottery Officer.",
        "The application will be evaluated by the medical board.",
        "Sanctioned funds will be paid directly to the hospital handling your treatment."
      ]
    }
  },
  {
    scheme_id: "ap_ysr_cheyutha",
    name: "Andhra Pradesh YSR Cheyutha",
    category: "Women Empowerment",
    eligibility: {
      state: "andhra_pradesh",
      min_age: 45,
      max_age: 60,
      gender: ["female"],
      occupations: null,
      land_ownership: null,
      max_income: 10000,
      bpl: true,
      disability_status: null,
      exclusions: ["government_employee", "income_tax_payer"]
    },
    benefits: "Financial assistance of ₹75,000 (over four years, i.e., ₹18,750 per year) to women belonging to SC/ST/BC/Minority communities.",
    documents_needed: ["Aadhaar Card", "Caste Certificate", "Age Proof (45-60)", "Ration Card (BPL)", "Bank Account Details"],
    apply_url: "https://navasakam.ap.gov.in/",
    language_summary: {
      en: "Andhra Pradesh provides ₹18,750 yearly to women aged 45-60 from backward classes and minority groups to establish small businesses."
    },
    apply_steps: {
      en: [
        "Contact your local Grama/Ward Sachivalayam (Volunteer).",
        "The volunteer will register your details during the survey.",
        "Provide Aadhaar card, Caste Certificate, and Bank details.",
        "Your details will be verified via Navasakam portal.",
        "Once approved, the funds will be credited annually to your bank account."
      ]
    }
  },
  {
    scheme_id: "pb_mai_bhago",
    name: "Punjab Mai Bhago Vidya Scheme",
    category: "Education",
    eligibility: {
      state: "punjab",
      min_age: 14,
      max_age: 18,
      gender: ["female"],
      occupations: ["student"],
      land_ownership: null,
      max_income: null,
      bpl: null,
      disability_status: null,
      exclusions: []
    },
    benefits: "Free distribution of bicycles to high school girl students to promote education and ease travel.",
    documents_needed: ["School Admission Proof (Class 9-12)", "Aadhaar Card", "Punjab Resident Certificate"],
    apply_url: "http://punjab.gov.in/",
    language_summary: {
      en: "Punjab government distributes free bicycles to girl students studying in Classes 9th to 12th in government schools."
    },
    apply_steps: {
      en: [
        "No individual online application is required.",
        "Headmasters of Government High/Senior Secondary schools compile the list of girl students in Classes 9 to 12.",
        "The list is submitted to the District Education Officer.",
        "Verify your name in the school-level Mai Bhago beneficiary list.",
        "Bicycles are distributed directly inside the school campus during the distribution camps."
      ]
    }
  },
  {
    scheme_id: "hr_ladli_allowance",
    name: "Haryana Ladli Social Security Allowance",
    category: "Social Security",
    eligibility: {
      state: "haryana",
      min_age: 45,
      max_age: 60,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: 15000,
      bpl: null,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Monthly financial allowance of ₹2,750 to parents who have only daughters (no sons) to support them in their middle age.",
    documents_needed: ["Aadhaar Card of Parents", "Domicile Certificate of Haryana", "Family ID (Parivar Pehchan Patra)", "Birth Certificates of daughters", "Bank account details of mother"],
    apply_url: "https://socialjusticehry.gov.in/",
    language_summary: {
      en: "Haryana government provides a monthly social security allowance of ₹2,750 to parents who only have daughters.",
      hi: "हरियाणा सरकार उन माता-पिता को प्रति माह ₹2,750 का सामाजिक सुरक्षा भत्ता देती है जिनकी केवल बेटियां हैं (कोई बेटा नहीं)।"
    },
    apply_steps: {
      en: [
        "Visit the nearest Saral Kendra or Atal Seva Kendra in Haryana.",
        "Request the application for Ladli Social Security Allowance Scheme.",
        "Provide your Parivar Pehchan Patra (Family ID) and Aadhaar details.",
        "Submit daughter's birth certificates proving you have only girl child(ren).",
        "After verification by the Social Justice Department, monthly payments will be credited."
      ],
      hi: [
        "हरियाणा में अपने नजदीकी सरल केंद्र या अटल सेवा केंद्र पर जाएं।",
        "लाडली सामाजिक सुरक्षा भत्ता योजना के लिए आवेदन का अनुरोध करें।",
        "अपना परिवार पहचान पत्र (Family ID) और आधार विवरण प्रदान करें।",
        "बेटियों के जन्म प्रमाण पत्र जमा करें जिससे साबित हो कि आपके केवल बेटियां हैं।",
        "सामाजिक न्याय विभाग द्वारा सत्यापन के बाद, मासिक भुगतान क्रेडिट किया जाएगा।"
      ]
    }
  },
  {
    scheme_id: "od_biju_swasthya",
    name: "Odisha Biju Swasthya Kalyan Yojana (BSKY)",
    category: "Health & Medical",
    eligibility: {
      state: "odisha",
      min_age: null,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: null,
      bpl: true,
      disability_status: null,
      exclusions: ["government_employee", "income_tax_payer"]
    },
    benefits: "Cashless healthcare assurance up to ₹5 Lakhs per family and ₹10 Lakhs for women members of the family in empanelled private hospitals.",
    documents_needed: ["National Food Security Act (NFSA) Card / State Food Security Card (Ration Card)", "Aadhaar Card"],
    apply_url: "https://bsky.odisha.gov.in/",
    language_summary: {
      en: "Odisha provides cashless healthcare up to ₹5 Lakhs (₹10 Lakhs for women) in private hospitals for all ration card holders."
    },
    apply_steps: {
      en: [
        "No separate registration or application is needed.",
        "If you hold an NFSA or SFSA Ration Card in Odisha, you are automatically enrolled.",
        "Present your BSKY Health Card or Ration Card at the helpdesk of any empanelled hospital.",
        "Provide your Aadhaar card for biometric verification.",
        "The hospital treats you cashlessly, and the billing is settled by the BSKY state board."
      ]
    }
  },

  // Generative State Scheme fallback for "other" states
  {
    scheme_id: "generic_state_welfare",
    name: "State Welfare Assistance Scheme",
    category: "Social Welfare",
    eligibility: {
      state: "other",
      min_age: 18,
      max_age: null,
      gender: null,
      occupations: null,
      land_ownership: null,
      max_income: 15000,
      bpl: true,
      disability_status: null,
      exclusions: ["government_employee"]
    },
    benefits: "Direct financial assistance and local subsidies according to your State's specific welfare department guidelines.",
    documents_needed: ["Aadhaar Card", "Ration Card (BPL)", "Local Residence Proof (Domicile)", "Bank Account Details"],
    apply_url: "https://www.india.gov.in/",
    language_summary: {
      en: "Provides general state-level financial aid and subsidies for lower-income households in your respective state.",
      hi: "आपके संबंधित राज्य में कम आय वाले परिवारों के लिए सामान्य राज्य-स्तरीय वित्तीय सहायता और सब्सिडी प्रदान करता है।"
    },
    apply_steps: {
      en: [
        "Visit your state government's official web portal.",
        "Look for the 'Social Welfare Schemes' or 'Citizen Services' department.",
        "Fill in the application form using your state-specific identity cards.",
        "Attach local residence proof (domicile) and bank passbook.",
        "Submit and wait for local administration approval."
      ],
      hi: [
        "अपने राज्य सरकार के आधिकारिक वेब पोर्टल पर जाएं।",
        "'सामाजिक कल्याण योजनाएं' या 'नागरिक सेवाएं' विभाग खोजें।",
        "अपने राज्य-विशिष्ट पहचान पत्रों का उपयोग करके आवेदन पत्र भरें।",
        "स्थानीय निवास प्रमाण (मूल निवास) और बैंक पासबुक संलग्न करें।",
        "जमा करें और स्थानीय प्रशासन की स्वीकृति की प्रतीक्षा करें।"
      ]
    }
  }
];
