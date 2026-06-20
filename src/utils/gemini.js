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

// Attempt to load key from localStorage on start
const savedKey = localStorage.getItem("awaaz_gemini_key");
if (savedKey) {
  initGemini(savedKey);
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a profile extraction parser. Extract these fields from the user's speech transcript if present:
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
 * Keyword-based heuristic parser for local fallback operations (Supports Hi, En, Ta, Te keywords)
 */
function parseProfileLocally(text) {
  const t = text.toLowerCase();
  const profile = getEmptyProfile();

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
                   t.includes("வியாபாரி") || t.includes("கடை") ||
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
