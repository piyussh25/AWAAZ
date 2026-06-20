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
    hi: "Hindi"
  };

  const chosenLang = languageNames[language] || "English";
  
  if (schemesList.length === 0) {
    return language === "hi" 
      ? "मुझे आपकी जानकारी के अनुसार कोई उपयुक्त योजना नहीं मिली। कृपया अपनी जानकारी स्पष्ट रूप से बताएं।"
      : "I couldn't find any suitable schemes based on your information. Please try explaining your situation with more details.";
  }

  // Pick top 2 schemes to present clearly in the speech response
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
 * Keyword-based heuristic parser for local fallback operations (Hackathon Mode)
 */
function parseProfileLocally(text) {
  const t = text.toLowerCase();
  const profile = getEmptyProfile();

  // Extract Age
  const ageMatch = t.match(/(\d+)\s*(saal|years|year|age|sal|sal)/);
  if (ageMatch) {
    profile.age = parseInt(ageMatch[1], 10);
  } else {
    // Check general numbers
    const numMatches = t.match(/\b\d{2}\b/g);
    if (numMatches && numMatches.length > 0) {
      const num = parseInt(numMatches[0], 10);
      if (num > 10 && num < 90) {
        profile.age = num;
      }
    }
  }

  // Extract Gender
  if (t.includes("mahila") || t.includes("woman") || t.includes("female") || t.includes("ladki") || t.includes("aurat") || t.includes("mother") || t.includes("widow") || t.includes("vidhwa")) {
    profile.gender = "female";
  } else if (t.includes("man") || t.includes("male") || t.includes("aadmi") || t.includes("purush") || t.includes("ladka")) {
    profile.gender = "male";
  }

  // Extract Occupation
  if (t.includes("kisan") || t.includes("kheti") || t.includes("farmer") || t.includes("khet")) {
    profile.occupation = "farmer";
    profile.land_ownership = true;
  } else if (t.includes("vendor") || t.includes("thela") || t.includes("rehari") || t.includes("shop") || t.includes("dukan") || t.includes("vendor")) {
    profile.occupation = "vendor";
  } else if (t.includes("tailor") || t.includes("darzi") || t.includes("silai")) {
    profile.occupation = "tailor";
  } else if (t.includes("barber") || t.includes("nai") || t.includes("baal")) {
    profile.occupation = "barber";
  } else if (t.includes("laborer") || t.includes("majdoor") || t.includes("kamgar") || t.includes("construction") || t.includes("building") || t.includes("mitti")) {
    profile.occupation = "laborer";
  } else if (t.includes("ghar ka kaam") || t.includes("maid") || t.includes("cook") || t.includes("domestic")) {
    profile.occupation = "domestic_worker";
  } else if (t.includes("carpenter") || t.includes("sutar") || t.includes("lohar") || t.includes("artisan") || t.includes("vishwakarma") || t.includes("murtikar")) {
    profile.occupation = "artisan";
  } else if (t.includes("naukri nahi") || t.includes("unemployed") || t.includes("berozgar") || t.includes("no job")) {
    profile.occupation = "unemployed";
  }

  // Land Ownership
  if (t.includes("no land") || t.includes("landless") || t.includes("zameen nahi") || t.includes("bhoomiheen") || t.includes("apna khet nahi")) {
    profile.land_ownership = false;
  } else if (t.includes("have land") || t.includes("zameen hai") || t.includes("apna khet hai")) {
    profile.land_ownership = true;
  }

  // Marital Status
  if (t.includes("widow") || t.includes("vidhwa") || t.includes("pati nahi")) {
    profile.marital_status = "widow";
    profile.gender = "female";
  } else if (t.includes("married") || t.includes("shadi") || t.includes("patni") || t.includes("pati")) {
    profile.marital_status = "married";
  }

  // Income / BPL
  if (t.includes("bpl") || t.includes("ration card") || t.includes("garib") || t.includes("poor") || t.includes("poverty")) {
    profile.bpl = true;
  }
  
  if (t.includes("income tax") || t.includes("tax payer") || t.includes("tax deta hu")) {
    profile.is_income_tax_payer = true;
  }

  const incomeMatch = t.match(/(rs|rupees|inr|salary|income|kamata)\s*(\d+)/) || t.match(/(\d+)\s*(hazar|thousand|rupees|rs)/);
  if (incomeMatch) {
    let amt = parseInt(incomeMatch[1] || incomeMatch[2], 10);
    // If they say e.g. "8 hazar" or "8 thousand"
    if (t.includes("hazar") || t.includes("thousand")) {
      amt = amt * 1000;
    }
    if (amt > 100) profile.income_bracket = amt;
  }

  // Documents/Accounts
  if (t.includes("bank account") || t.includes("khata hai") || t.includes("bank khata")) {
    profile.has_bank_account = true;
  } else if (t.includes("no bank") || t.includes("khata nahi")) {
    profile.has_bank_account = false;
  }

  if (t.includes("aadhaar") || t.includes("adhar") || t.includes("aadhar")) {
    profile.has_aadhaar = true;
  } else if (t.includes("no adhar") || t.includes("no aadhaar") || t.includes("aadhaar nahi")) {
    profile.has_aadhaar = false;
  }

  return profile;
}

/**
 * Local fallback summarizer when Gemini is offline or key is missing
 */
function generateSummaryLocally(topMatches, language) {
  if (topMatches.length === 0) {
    return language === "hi"
      ? "मुझे कोई उपयुक्त योजना नहीं मिली। कृपया अपने काम और उम्र के बारे में और जानकारी दें।"
      : "I could not find any suitable schemes. Please specify your age, occupation, or details more clearly.";
  }

  let text = "";
  if (language === "hi") {
    text = "आपके लिए मुख्य योजनाएं इस प्रकार हैं: ";
    topMatches.forEach((m, i) => {
      const s = m.scheme;
      text += `${i + 1}. ${s.name}। `;
      if (m.status === "eligible") {
        text += `आप इसके लिए पात्र हैं। इसके फायदे हैं: ${s.benefits}। `;
      } else {
        text += `आप इसके लगभग पात्र हैं। `;
        if (m.missing.length > 0) {
          text += `इसके लिए आपको ${m.missing.join(", ")} की आवश्यकता होगी। `;
        }
      }
      text += `आवेदन के लिए आपको ${s.documents_needed.slice(0, 2).join(" और ")} चाहिए होगा। `;
    });
    text += "आवेदन करने के लिए अपने नजदीकी जन सेवा केंद्र पर जाएं।";
  } else {
    text = "Based on your details, here are the top schemes for you: ";
    topMatches.forEach((m, i) => {
      const s = m.scheme;
      text += `${i + 1}. ${s.name}. `;
      if (m.status === "eligible") {
        text += `You qualify for this. The benefits are: ${s.benefits}. `;
      } else {
        text += `You almost qualify. `;
        if (m.missing.length > 0) {
          text += `To qualify, you need to provide: ${m.missing.join(", ")}. `;
        }
      }
      text += `Required documents include ${s.documents_needed.slice(0, 2).join(" and ")}. `;
    });
    text += "You can apply online at the official portal or visit your nearest Common Service Centre.";
  }
  return text;
}
