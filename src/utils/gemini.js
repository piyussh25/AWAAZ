import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

/**
 * Initializes the Gemini API client with the provided API key.
 */
export function initGemini(apiKey) {
  if (apiKey) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      localStorage.setItem("awaaz_gemini_key", apiKey);
      return true;
    } catch (e) {
      console.error("Failed to initialize Gemini Client", e);
      return false;
    }
  }
  return false;
}

// ============================================================================
// API KEY CONFIGURATION
// 1. Paste your key here to hardcode it directly in the codebase:
const HARDCODED_GEMINI_KEY = ""; 
// 2. Or, create a ".env" file in the project root containing: VITE_GEMINI_API_KEY=your_key
// ============================================================================

const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
const savedKey = localStorage.getItem("awaaz_gemini_key");

const activeKey = envKey || HARDCODED_GEMINI_KEY || savedKey;
if (activeKey) {
  initGemini(activeKey);
}

/**
 * Parses user input/transcript into structured JSON profile parameters.
 * Uses a keyword-based fallback if no Gemini client is initialized.
 */
export async function parseUserProfile(transcript, language = "en") {
  if (!transcript || transcript.trim() === "") {
    return getEmptyProfile();
  }

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a profile extraction parser. Extract these fields from the user's speech transcript if present:
- state: ("uttar_pradesh", "tamil_nadu", "telangana", "maharashtra", "bihar", "west_bengal", "karnataka", "rajasthan", "gujarat", "madhya_pradesh", "delhi", "kerala", "andhra_pradesh", "punjab", "haryana", "odisha", or null)
- age: (integer number or null)
- gender: ("male" or "female" or "other" or null)
- occupation: ("farmer", "laborer", "construction_worker", "domestic_worker", "vendor", "artisan", "rickshaw_puller", "tailor", "barber", "washerman", "self_employed", "unemployed", "student" or null)
- land_ownership: (boolean or null) (true if they own farming land, false if they explicitly state they don't have land/are landless, null if not mentioned)
- income_bracket: (approximate monthly income in Rupees as a number, or null)
- has_bank_account: (boolean or null)
- has_aadhaar: (boolean or null)
- marital_status: ("married", "single", "widow", or null)
- disability_status: (boolean or null)
- bpl: (boolean or null) (true if they mention a BPL card, yellow/red ration card, or being extremely poor, false if they say APL or rich, null if not mentioned)
- is_income_tax_payer: (boolean or null)
- is_epfo_member: (boolean or null) (EPFO/provident fund)
- is_esic_member: (boolean or null)
- owns_pucca_house: (boolean or null) (true if they own a solid concrete house, false if they live in raw/mud/kutcha house, null if not mentioned)
- has_lpg_connection: (boolean or null)

Transcript: "${transcript}"

Return ONLY a valid JSON object matching the keys listed above. Do not include markdown code block syntax (like \`\`\`json) or any other text. Output strict, parseable JSON. If a value is unknown, use null.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = result.response.text();
      const cleaned = responseText.trim().replace(/^```json/, "").replace(/```$/, "");
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("Gemini parsing failed, running local keyword fallback...", e);
      return parseProfileLocally(transcript);
    }
  } else {
    console.log("No Gemini API key. Parsing locally using keyword rules...");
    return parseProfileLocally(transcript);
  }
}

/**
 * Parses a single field answer dynamically using Gemini or local rules
 */
export async function parseSingleField(fieldId, answerText, language = "en") {
  if (!answerText || answerText.trim() === "") {
    return null;
  }

  // 1. Try local parsing first (0ms latency, extremely fast!)
  const localVal = parseSingleFieldLocally(fieldId, answerText);
  if (localVal !== null) {
    console.log(`[Local Parser] Instantly matched ${fieldId}:`, localVal);
    return localVal;
  }

  // 2. Fall back to Gemini if local parsing couldn't determine the value
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      let fieldDescription = "";
      if (fieldId === "age") fieldDescription = "an integer number or null. E.g. 35";
      else if (fieldId === "gender") fieldDescription = "'male', 'female', or 'other'.";
      else if (fieldId === "state") fieldDescription = "one of: 'uttar_pradesh', 'tamil_nadu', 'telangana', 'maharashtra', 'bihar', 'west_bengal', 'karnataka', 'rajasthan', 'gujarat', 'madhya_pradesh', 'delhi', 'kerala', 'andhra_pradesh', 'punjab', 'haryana', 'odisha', or 'other'. Translate states like UP to 'uttar_pradesh', TN to 'tamil_nadu', etc.";
      else if (fieldId === "occupation") fieldDescription = "one of: 'farmer', 'laborer', 'construction_worker', 'domestic_worker', 'vendor', 'artisan', 'rickshaw_puller', 'tailor', 'barber', 'washerman', 'self_employed', 'unemployed', 'student', or null.";
      else if (fieldId === "land_ownership") fieldDescription = "boolean (true if they own agricultural/farming land, false if they are landless/have no land, null if not clear).";
      else if (fieldId === "income_bracket") fieldDescription = "approximate monthly income in Rupees as a number (e.g. 12000), or null.";
      else if (fieldId === "bpl") fieldDescription = "boolean (true if they have BPL card/ration card/are poor, false if APL/rich, null otherwise).";
      else if (fieldId === "has_aadhaar") fieldDescription = "boolean (true if they have Aadhaar card, false if not, null otherwise).";
      else if (fieldId === "has_bank_account") fieldDescription = "boolean (true if they have a bank account, false if not, null otherwise).";
      else fieldDescription = "a boolean, number, string, or null.";

      const prompt = `You are a helper parsing a single field from user conversation.
Field to extract: "${fieldId}"
Expected type/values: ${fieldDescription}

User response: "${answerText}"
Language: "${language}"

Analyze the user's response and output ONLY a JSON object with the single key "${fieldId}". Do not write any other text or markdown block backticks. E.g., if the field is age and the answer is 40, output {"age": 40}. If unknown or invalid, output {"${fieldId}": null}.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = result.response.text();
      const cleaned = responseText.trim().replace(/^```json/, "").replace(/```$/, "");
      const parsed = JSON.parse(cleaned);
      return parsed[fieldId] !== undefined ? parsed[fieldId] : null;
    } catch (e) {
      console.warn(`Gemini single-field parsing failed for ${fieldId}, running local fallback...`, e);
      return parseSingleFieldLocally(fieldId, answerText);
    }
  } else {
    return parseSingleFieldLocally(fieldId, answerText);
  }
}

/**
 * Generates an audio-friendly vernacular explanation of the matched schemes.
 */
export async function generateVernacularSummary(schemesList, userProfile, language = "en") {
  const languageNames = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu"
  };

  const chosenLang = languageNames[language] || "English";
  
  if (schemesList.length === 0) {
    if (language === "hi") return "मुझे आपकी जानकारी के अनुसार कोई उपयुक्त योजना नहीं मिली।";
    if (language === "ta") return "உங்கள் விவரங்களின்படி பொருத்தமான திட்டங்கள் எதுவும் கிடைக்கவில்லை.";
    if (language === "te") return "మీ వివరాల ప్రకారం సరిపోయే పథకాలు ఏవీ లభించలేదు.";
    return "I couldn't find any suitable schemes based on your information.";
  }

  const topSchemes = schemesList.slice(0, 2);
  const schemesText = topSchemes.map(s => {
    return `Scheme: ${s.scheme.name}
Status: ${s.status === "eligible" ? "You qualify!" : "You almost qualify"}
Benefits: ${s.scheme.benefits}
Needed Documents: ${s.scheme.documents_needed.join(", ")}
Explanation: ${s.reasons.join(". ")}`;
  }).join("\n\n");

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a warm, local community helper talking to a rural citizen in India. 
Translate and explain the following matched schemes to the user in simple, friendly, and direct conversational ${chosenLang}. 
Use extremely simple words that a person with no formal education would understand. 
Focus on:
1. What the schemes are (in 1 sentence each).
2. What money/benefits they will receive.
3. The absolute key documents they need to prepare (like Aadhaar, bank passbook, etc.).

If a scheme is a "near_match" (status: You almost qualify), explain in a positive way what document or details they are missing to get it.

User Profile: ${JSON.stringify(userProfile)}
Matched Schemes data:
${schemesText}

Write a direct spoken address (script) of about 100-150 words. Do not include greetings like "Hello" or signatures at the end, just start explaining. Do not use special characters or markdown formatting (like stars, hashes, or bullet points) since this text will be read aloud by Text-to-Speech.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      console.warn("Gemini vernacular summary generation failed, running local fallback...", e);
      return generateSummaryLocally(topSchemes, language);
    }
  } else {
    return generateSummaryLocally(topSchemes, language);
  }
}

/**
 * Initial empty profile template
 */
export function getEmptyProfile() {
  return {
    state: null,
    age: null,
    gender: null,
    occupation: null,
    land_ownership: null,
    income_bracket: null,
    has_bank_account: null,
    has_aadhaar: null,
    marital_status: null,
    disability_status: null,
    bpl: null,
    is_income_tax_payer: null,
    is_epfo_member: null,
    is_esic_member: null,
    owns_pucca_house: null,
    has_lpg_connection: null
  };
}

/**
 * Converts written numbers (like "thirty five") to digits
 */
function convertWordsToNumbers(text) {
  const words = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    hundred: 100, thousand: 1000, lakh: 100000
  };
  
  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/[\s\-]+/);
  
  let currentVal = 0;
  let totalVal = 0;
  let matchedAny = false;

  for (let token of tokens) {
    if (/^\d+$/.test(token)) {
      currentVal += parseInt(token, 10);
      matchedAny = true;
    } else if (words[token] !== undefined) {
      matchedAny = true;
      const val = words[token];
      if (val === 100) {
        currentVal = (currentVal || 1) * 100;
      } else if (val === 1000 || val === 100000) {
        totalVal += (currentVal || 1) * val;
        currentVal = 0;
      } else {
        currentVal += val;
      }
    }
  }
  
  totalVal += currentVal;
  return matchedAny ? totalVal : null;
}

/**
 * Heuristic fallback parser for single fields
 */
function parseSingleFieldLocally(fieldId, text) {
  const t = text.toLowerCase().trim();
  
  if (fieldId === "age") {
    // 1. Try words to number first (e.g. "thirty five")
    const wordNum = convertWordsToNumbers(t);
    if (wordNum !== null && wordNum > 0 && wordNum < 120) {
      return wordNum;
    }
    // 2. Try raw digits
    const ageMatch = t.match(/(\d+)/);
    if (ageMatch) {
      const num = parseInt(ageMatch[1], 10);
      if (num > 0 && num < 120) return num;
    }
    return null;
  }
  
  if (fieldId === "gender") {
    if (t.includes("female") || t.includes("mahila") || t.includes("aurat") || t.includes("woman") || t.includes("girl") || t.includes("lady") || t.includes("stri") || t.includes("stree") || t.includes("பெண்") || t.includes("மகி") || t.includes("స్త్రీ") || t.includes("మహిళ")) {
      return "female";
    }
    if (t.includes("male") || t.includes("purush") || t.includes("aadmi") || t.includes("man") || t.includes("boy") || t.includes("gentleman") || t.includes("ஆண்") || t.includes("மగ") || t.includes("పురుషుడు")) {
      return "male";
    }
    return null;
  }
  
  if (fieldId === "state") {
    if (t.includes("uttar pradesh") || t.includes("up") || t.includes("उत्तर प्रदेश")) return "uttar_pradesh";
    if (t.includes("tamil nadu") || t.includes("tn") || t.includes("तमिलनाडु") || t.includes("தமிழ்நாடு")) return "tamil_nadu";
    if (t.includes("telangana") || t.includes("तेलंगाना") || t.includes("తెలంగాణ")) return "telangana";
    if (t.includes("maharashtra") || t.includes("महाराष्ट्र") || t.includes("మహారాష్ట్ర")) return "maharashtra";
    if (t.includes("bihar") || t.includes("बिहार") || t.includes("బీహార్")) return "bihar";
    if (t.includes("bengal") || t.includes("पश्चिम बंगाल")) return "west_bengal";
    if (t.includes("karnataka") || t.includes("कर्नाटक") || t.includes("కర్ణాటక")) return "karnataka";
    if (t.includes("rajasthan") || t.includes("राजस्थान")) return "rajasthan";
    if (t.includes("gujarat") || t.includes("गुजरात")) return "gujarat";
    if (t.includes("madhya pradesh") || t.includes("mp") || t.includes("मध्य प्रदेश")) return "madhya_pradesh";
    if (t.includes("delhi") || t.includes("दिल्ली")) return "delhi";
    if (t.includes("kerala") || t.includes("केरल") || t.includes("கேரளா")) return "kerala";
    if (t.includes("andhra") || t.includes("आंध्र") || t.includes("ఆంధ్రప్రదేశ్")) return "andhra_pradesh";
    if (t.includes("punjab") || t.includes("पंजाब")) return "punjab";
    if (t.includes("haryana") || t.includes("हरियाणा")) return "haryana";
    if (t.includes("odisha") || t.includes("ओडिशा")) return "odisha";
    return "other";
  }
  
  if (fieldId === "occupation") {
    if (t.includes("farmer") || t.includes("kisan") || t.includes("kheti") || t.includes("कृषि") || t.includes("விவசாயி") || t.includes("రైతు")) return "farmer";
    if (t.includes("laborer") || t.includes("majdoor") || t.includes("kamgar") || t.includes("कामगार") || t.includes("मजदूर") || t.includes("தொழிலாளி") || t.includes("కూలి")) return "laborer";
    if (t.includes("construction") || t.includes("building") || t.includes("राजमिस्त्री") || t.includes("मिस्त्री")) return "construction_worker";
    if (t.includes("domestic") || t.includes("house help") || t.includes("कामवाली") || t.includes("बाई")) return "domestic_worker";
    if (t.includes("vendor") || t.includes("street") || t.includes("thela") || t.includes("rehari") || t.includes("दुकानदार") || t.includes("फेरीवाला") || t.includes("வியாபாரி")) return "vendor";
    if (t.includes("artisan") || t.includes("craftsman") || t.includes("carpenter") || t.includes("blacksmith") || t.includes("कारीगर")) return "artisan";
    if (t.includes("tailor") || t.includes("darzi") || t.includes("दर्जी") || t.includes("தையல்காரர்")) return "tailor";
    if (t.includes("barber") || t.includes("nai") || t.includes("नाई") || t.includes("மங்கல") || t.includes("మంగలి")) return "barber";
    if (t.includes("washerman") || t.includes("dhobi") || t.includes("धोबी") || t.includes("சலவை")) return "washerman";
    if (t.includes("student") || t.includes("छात्र") || t.includes("மாணவர்")) return "student";
    if (t.includes("unemployed") || t.includes("बेरोजगार") || t.includes("काम नहीं है")) return "unemployed";
    return null;
  }
  
  if (fieldId === "land_ownership") {
    if (t.includes("yes") || t.includes("have") || t.includes("hai") || t.includes("own") || t.includes("हाँ") || t.includes("हा") || t.includes("जमीन है") || t.includes("நிலம் இருக்கு") || t.includes("భూమి ఉంది")) return true;
    if (t.includes("no") || t.includes("don't") || t.includes("nahi") || t.includes("landless") || t.includes("नहीं") || t.includes("ना") || t.includes("जमीन नहीं") || t.includes("நிலம் இல்லை") || t.includes("భూమి లేదు")) return false;
    return null;
  }
  
  if (fieldId === "income_bracket") {
    // 1. Try words to number first (e.g. "ten thousand")
    const wordNum = convertWordsToNumbers(t);
    if (wordNum !== null && wordNum >= 0) {
      return wordNum;
    }
    // 2. Try raw digits
    const moneyMatch = t.match(/(\d+)/);
    if (moneyMatch) {
      return parseInt(moneyMatch[1], 10);
    }
    return null;
  }
  
  if (fieldId === "bpl") {
    if (t.includes("bpl") || t.includes("ration") || t.includes("yes") || t.includes("poor") || t.includes("garib") || t.includes("हाँ") || t.includes("हा") || t.includes("राशन") || t.includes("गरीब") || t.includes("ரேஷன்") || t.includes("పేద")) return true;
    if (t.includes("apl") || t.includes("no") || t.includes("rich") || t.includes("tax") || t.includes("नहीं") || t.includes("ना")) return false;
    return null;
  }
  
  if (fieldId === "has_aadhaar") {
    if (t.includes("both") || t.includes("दोनों") || t.includes("aadhaar") || t.includes("aadhar") || t.includes("yes") || t.includes("have") || t.includes("हाँ") || t.includes("हा") || t.includes("आधार")) {
      return true;
    }
    if (t.includes("none") || t.includes("no") || t.includes("don't") || t.includes("नहीं") || t.includes("na") || t.includes("bank only") || t.includes("केवल बैंक")) {
      return false;
    }
    return null;
  }
  
  if (fieldId === "has_bank_account") {
    if (t.includes("both") || t.includes("दोनों") || t.includes("bank") || t.includes("account") || t.includes("khata") || t.includes("yes") || t.includes("have") || t.includes("हाँ") || t.includes("हा") || t.includes("खाता") || t.includes("ఖాతా")) {
      return true;
    }
    if (t.includes("none") || t.includes("no") || t.includes("don't") || t.includes("नहीं") || t.includes("na") || t.includes("aadhaar only") || t.includes("aadhar only") || t.includes("केवल आधार")) {
      return false;
    }
    return null;
  }
  return null;
}

/**
 * Keyword-based heuristic parser for local fallback operations (Supports Hi, En, Ta, Te keywords)
 */
function parseProfileLocally(text) {
  const t = text.toLowerCase();
  const profile = getEmptyProfile();

  // Extract State
  if (t.includes("uttar pradesh") || t.includes("up") || t.includes("उत्तर प्रदेश")) profile.state = "uttar_pradesh";
  else if (t.includes("tamil nadu") || t.includes("tn") || t.includes("தமிழ்நாடு")) profile.state = "tamil_nadu";
  else if (t.includes("telangana") || t.includes("తెలంగాణ")) profile.state = "telangana";
  else if (t.includes("maharashtra") || t.includes("महाराष्ट्र")) profile.state = "maharashtra";
  else if (t.includes("bihar") || t.includes("बिहार")) profile.state = "bihar";
  else if (t.includes("bengal") || t.includes("पश्चिम बंगाल")) profile.state = "west_bengal";
  else if (t.includes("karnataka") || t.includes("कर्नाटक")) profile.state = "karnataka";
  else if (t.includes("rajasthan") || t.includes("राजस्थान")) profile.state = "rajasthan";
  else if (t.includes("gujarat") || t.includes("गुजरात")) profile.state = "gujarat";
  else if (t.includes("madhya pradesh") || t.includes("mp") || t.includes("मध्य प्रदेश")) profile.state = "madhya_pradesh";
  else if (t.includes("delhi") || t.includes("दिल्ली")) profile.state = "delhi";
  else if (t.includes("kerala") || t.includes("केरल")) profile.state = "kerala";
  else if (t.includes("andhra") || t.includes("आंध्र")) profile.state = "andhra_pradesh";
  else if (t.includes("punjab") || t.includes("पंजाब")) profile.state = "punjab";
  else if (t.includes("haryana") || t.includes("हरियाणा")) profile.state = "haryana";
  else if (t.includes("odisha") || t.includes("ओडिशा")) profile.state = "odisha";

  // Extract Age
  const ageMatch = t.match(/(\d+)\s*(saal|years|year|age|sal|sal|വയസ്സ്|வயது|వయస్సు)/);
  if (ageMatch) {
    profile.age = parseInt(ageMatch[1], 10);
  } else {
    const numMatches = t.match(/\b\d{2}\b/g);
    if (numMatches && numMatches.length > 0) {
      const num = parseInt(numMatches[0], 10);
      if (num > 10 && num < 90) {
        profile.age = num;
      }
    }
  }

  // Extract Gender
  if (
    t.includes("mahila") || t.includes("woman") || t.includes("female") || t.includes("ladki") || t.includes("aurat") || 
    t.includes("mother") || t.includes("widow") || t.includes("vidhwa") ||
    t.includes("பெண்") || t.includes("தாய்") || t.includes("மனைவி") ||
    t.includes("మహిళ") || t.includes("స్త్రీ") || t.includes("తల్లి")
  ) {
    profile.gender = "female";
  } else if (
    t.includes("man") || t.includes("male") || t.includes("aadmi") || t.includes("purush") || t.includes("ladka") ||
    t.includes("ஆண்") || t.includes("புருஷன்") ||
    t.includes("మగ") || t.includes("పురుషుడు")
  ) {
    profile.gender = "male";
  }

  // Extract Occupation
  const isFarmer = t.includes("kisan") || t.includes("kheti") || t.includes("farmer") || t.includes("khet") ||
                   t.includes("விவசாயி") || t.includes("விவசாயம்") ||
                   t.includes("రైతు") || t.includes("వ్యవసాయం");
  
  const isLaborer = t.includes("laborer") || t.includes("majdoor") || t.includes("kamgar") || t.includes("construction") || t.includes("building") ||
                    t.includes("தொழிலாளி") || t.includes("வேலை") ||
                    t.includes("కూలి") || t.includes("పని");

  const isVendor = t.includes("vendor") || t.includes("thela") || t.includes("rehari") || t.includes("shop") || t.includes("dukan") ||
                   t.includes("விபயாரி") || t.includes("கடை") ||
                   t.includes("వ్యాపారి") || t.includes("దుకాణం");

  const isArtisan = t.includes("carpenter") || t.includes("sutar") || t.includes("lohar") || t.includes("artisan") || t.includes("vishwakarma") ||
                    t.includes("கைவினைஞர்") || t.includes("நெசவாளர்") ||
                    t.includes("చేతివృత్తి") || t.includes("విశ్వకర్మ");

  if (isFarmer) {
    profile.occupation = "farmer";
    profile.land_ownership = true;
  } else if (isVendor) {
    profile.occupation = "vendor";
  } else if (isLaborer) {
    profile.occupation = "laborer";
  } else if (isArtisan) {
    profile.occupation = "artisan";
  } else if (t.includes("tailor") || t.includes("darzi") || t.includes("தையல்காரர்") || t.includes("Tailor")) {
    profile.occupation = "tailor";
  } else if (t.includes("barber") || t.includes("nai") || t.includes("மங்கல") || t.includes("మంగలి")) {
    profile.occupation = "barber";
  } else if (t.includes("washerman") || t.includes("dhobi")) {
    profile.occupation = "washerman";
  } else if (t.includes("widow") || t.includes("vidhwa") || t.includes("விதவை") || t.includes("వితంతువు")) {
    profile.marital_status = "widow";
    profile.gender = "female";
  }

  // Land Ownership
  if (t.includes("no land") || t.includes("landless") || t.includes("zameen nahi") || t.includes("bhoomiheen") || t.includes("apna khet nahi") ||
      t.includes("நிலம் இல்லை") || t.includes("பூமி இல்லை") ||
      t.includes("భూమి లేదు") || t.includes("సొంత పొలం లేదు")) {
    profile.land_ownership = false;
  } else if (t.includes("have land") || t.includes("zameen hai") || t.includes("apna khet hai") ||
             t.includes("நிலம் இருக்கு") || t.includes("சொந்த நிலம்") ||
             t.includes("భూమి ఉంది") || t.includes("సొంత పొలం ఉంది")) {
    profile.land_ownership = true;
  }

  // Marital Status
  if (t.includes("widow") || t.includes("vidhwa") || t.includes("pati nahi") || t.includes("விதவை") || t.includes("వితంతువు")) {
    profile.marital_status = "widow";
    profile.gender = "female";
  } else if (t.includes("married") || t.includes("shadi") || t.includes("patni") || t.includes("pati") || t.includes("திருமணம்") || t.includes("పెళ్లి")) {
    profile.marital_status = "married";
  }

  // Income / BPL
  if (t.includes("bpl") || t.includes("ration card") || t.includes("garib") || t.includes("poor") || t.includes("poverty") ||
      t.includes("ஏழை") || t.includes("ரேஷன் கார்டு") ||
      t.includes("పేద") || t.includes("రేషన్ కార్డ్")) {
    profile.bpl = true;
  }

  // Documents
  if (t.includes("bank account") || t.includes("khata hai") || t.includes("bank khata") ||
      t.includes("வங்கி கணக்கு") || t.includes("பேங்க் கணக்கு") ||
      t.includes("బ్యాంక్ ఖాతా") || t.includes("ఖాతా ఉంది")) {
    profile.has_bank_account = true;
  }
  if (t.includes("aadhaar") || t.includes("adhar") || t.includes("aadhar") || t.includes("ஆதார்") || t.includes("ఆధార్")) {
    profile.has_aadhaar = true;
  }

  return profile;
}

/**
 * Local fallback summarizer supporting English, Hindi, Tamil, and Telugu
 */
function generateSummaryLocally(topMatches, language) {
  if (topMatches.length === 0) {
    if (language === "hi") return "मुझे कोई उपयुक्त योजना नहीं मिली। कृपया और जानकारी दें।";
    if (language === "ta") return "பொருத்தமான திட்டங்கள் எதுவும் கிடைக்கவில்லை. மேலும் விவரங்களை வழங்கவும்.";
    if (language === "te") return "తగిన పథకాలు ఏవీ లభించలేదు. దయచేసి మరింత సమాచారం ఇవ్వండి.";
    return "I could not find any suitable schemes. Please specify details more clearly.";
  }

  let text = "";
  
  if (language === "hi") {
    text = "आपके लिए योजनाएं इस प्रकार हैं: ";
    topMatches.forEach((m, i) => {
      const s = m.scheme;
      text += `${i + 1}. ${s.name}। `;
      if (m.status === "eligible") {
        text += `फायदे हैं: ${s.benefits}। `;
      } else {
        text += `आप लगभग पात्र हैं। `;
        if (m.missing.length > 0) text += `आवश्यकता है: ${m.missing.join(", ")}। `;
      }
    });
  } 
  else if (language === "ta") {
    text = "உங்களுக்கான திட்டங்கள் பின்வருமாறு: ";
    topMatches.forEach((m, i) => {
      const s = m.scheme;
      text += `${i + 1}. ${s.name}. `;
      if (m.status === "eligible") {
        text += `பயன்கள்: ${s.benefits}. `;
      } else {
        text += `நீங்கள் கிட்டத்தட்ட தகுதியுடையவர். `;
        if (m.missing.length > 0) text += `தேவை: ${m.missing.join(", ")}. `;
      }
    });
  } 
  else if (language === "te") {
    text = "మీకు సరిపోయే పథకాలు ఇవిగోండి: ";
    topMatches.forEach((m, i) => {
      const s = m.scheme;
      text += `${i + 1}. ${s.name}. `;
      if (m.status === "eligible") {
        text += `ప్రయోజనాలు: ${s.benefits}. `;
      } else {
        text += `మీరు దాదాపు అర్హులు. `;
        if (m.missing.length > 0) text += `కావాల్సినవి: ${m.missing.join(", ")}. `;
      }
    });
  } 
  else {
    text = "Here are the top schemes for you: ";
    topMatches.forEach((m, i) => {
      const s = m.scheme;
      text += `${i + 1}. ${s.name}. `;
      if (m.status === "eligible") {
        text += `Benefits: ${s.benefits}. `;
      } else {
        text += `You almost qualify. `;
        if (m.missing.length > 0) text += `Required: ${m.missing.join(", ")}. `;
      }
    });
  }

  return text;
}

/**
 * Generates a detailed welfare eligibility analysis report using Gemini in structured JSON format
 */
export async function generateDetailedAIReport(schemesList, userProfile, language = "en") {
  const languageNames = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu"
  };
  const chosenLang = languageNames[language] || "English";
  const actionableSchemes = schemesList.filter(s => s.status === "eligible" || s.status === "near_match").slice(0, 8);

  if (!genAI) {
    // Generate structured local JSON fallback so the UI cards populate perfectly
    const fallbackData = {
      executive_summary: language === "hi" 
        ? "स्थानीय पात्रता विश्लेषण के आधार पर, यहाँ आपके लिए अनुशंसित कल्याणकारी योजनाएँ दी गई हैं।"
        : "Based on local eligibility matching, here are your recommended welfare schemes.",
      schemes: actionableSchemes.map(s => ({
        name: s.scheme.name,
        category: s.scheme.category || (language === "hi" ? "कल्याण" : "Welfare"),
        status: s.status,
        readiness_score: s.status === "eligible" ? 100 : 75,
        ai_quote: s.scheme.language_summary[language] || s.scheme.language_summary.en,
        benefits: [s.scheme.benefits],
        eligibility_analysis: s.reasons.join(". "),
        requirements: s.missing.map(m => language === "hi" ? `पुष्टि करें: ${m}` : `Confirm: ${m}`),
        documents: s.scheme.documents_needed || [],
        steps: s.scheme.apply_steps[language] || s.scheme.apply_steps.en || []
      }))
    };
    return JSON.stringify(fallbackData);
  }

  if (actionableSchemes.length === 0) {
    const emptyData = {
      executive_summary: language === "hi" ? "आपके प्रोफ़ाइल के आधार पर कोई उपयुक्त योजना नहीं मिली।" : "No suitable schemes found based on your profile details.",
      schemes: []
    };
    return JSON.stringify(emptyData);
  }

  const schemesText = actionableSchemes.map((s, idx) => {
    return `${idx + 1}. Scheme Name: ${s.scheme.name}
   - ID: ${s.scheme.scheme_id}
   - Category: ${s.scheme.category || "General"}
   - Status: ${s.status === "eligible" ? "Fully Eligible" : "Near Match"}
   - Description: ${s.scheme.language_summary[language] || s.scheme.language_summary.en}
   - Benefits: ${s.scheme.benefits}
   - Documents: ${s.scheme.documents_needed.join(", ")}
   - Missing Requirements: ${s.missing.join(", ") || "None"}
   - Reasons: ${s.reasons.join(". ")}`;
  }).join("\n\n");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a professional welfare policy advisor for the Government of India.
Analyze the user profile and their matched schemes to generate a structured, personalized analysis report in JSON format.
The language of all descriptive text, lists, and quotes MUST be in **${chosenLang}** (except official English terms/names where appropriate).

User Profile details:
${JSON.stringify(userProfile, null, 2)}

Top Matched Welfare Schemes for this user:
${schemesText}

Your response must be a single, valid JSON object with NO markdown block wrappers (do NOT include \`\`\`json, do NOT include backticks).
JSON Structure:
{
  "executive_summary": "A warm, brief 2-3 sentence introduction summarizing their potential eligibility in ${chosenLang}.",
  "schemes": [
    {
      "scheme_id": "The exact 'ID' value provided in the Matched Welfare Schemes list (e.g., 'pm_jay', 'pm_kisan')",
      "name": "Exact Name of Scheme in ${chosenLang}",
      "category": "Category like 'Health & Medical', 'Agriculture & Farmers', 'Social Security & Pension', 'Education & Skill Development', etc. translated appropriately if chosenLang is not English, or in English as per standards.",
      "status": "eligible" or "near_match",
      "readiness_score": 85, // A percentage score (1-100) based on how close their profile is
      "ai_quote": "A single sentence summary quote of the scheme's main benefit in ${chosenLang}.",
      "benefits": ["bullet point benefit 1 in ${chosenLang}", "bullet point benefit 2 in ${chosenLang}"],
      "eligibility_analysis": "A brief 1-2 sentence statement of why they qualify or what matches/does not match in ${chosenLang}.",
      "requirements": ["required action/qualification 1 in ${chosenLang}", "required action/qualification 2 in ${chosenLang}"],
      "documents": ["document 1 in ${chosenLang}", "document 2 in ${chosenLang}"],
      "steps": ["step 1 to apply in ${chosenLang}", "step 2 to apply in ${chosenLang}"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating detailed AI report:", error);
    throw error;
  }
}

