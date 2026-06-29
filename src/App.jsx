import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Award, ClipboardList, ArrowLeft, CheckCircle2, AlertTriangle,
  Gauge, ChevronDown, Mic, Globe, Star, Users, Heart,
  Home as HomeIcon, BookOpen, Info, FileText, ShieldCheck, MessageCircle,
  Settings as SettingsIcon, Loader2, ExternalLink
} from "lucide-react";
import { schemes } from "./data/schemes";
import { matchSchemes } from "./utils/matchingEngine";
import { parseUserProfile, generateVernacularSummary, getEmptyProfile, generateDetailedAIReport } from "./utils/gemini";
import VoiceAssistant from "./components/VoiceAssistant";
import UserProfile from "./components/UserProfile";
import SchemeCard from "./components/SchemeCard";
import ConsolidatedDocs from "./components/ConsolidatedDocs";
import Settings from "./components/Settings";

const LANGS = [
  { code: "hi", label: "हिन्दी", english: "Hindi" },
  { code: "en", label: "English", english: "English" },
  { code: "ta", label: "தமிழ்", english: "Tamil" },
  { code: "te", label: "తెలుగు", english: "Telugu" },
];

function pick(obj, lang) {
  return obj?.[lang] || obj?.en || "";
}

export default function App() {
  const [language, setLanguage] = useState("hi");
  const [userProfile, setUserProfile] = useState(getEmptyProfile());
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [activeTab, setActiveTab] = useState("ai_report");
  const [currentPage, setCurrentPage] = useState("home"); // home | results | guide | about
  const [langOpen, setLangOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const langRef = useRef(null);
  const [aiReport, setAiReport] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matchedSchemesList = useMemo(() => matchSchemes(userProfile, schemes), [userProfile]);

  const stats = useMemo(() => {
    const eligibleCount = matchedSchemesList.filter(s => s.status === "eligible").length;
    const nearMatchCount = matchedSchemesList.filter(s => s.status === "near_match").length;
    const actionable = matchedSchemesList.filter(s => s.status === "eligible" || s.status === "near_match");
    const avgReadiness = actionable.length > 0
      ? Math.round(actionable.reduce((sum, s) => sum + s.score, 0) / actionable.length)
      : 0;
    return { eligible: eligibleCount, nearMatch: nearMatchCount, total: eligibleCount + nearMatchCount, avgReadiness };
  }, [matchedSchemesList]);

  const filteredSchemes = useMemo(() => {
    if (activeTab === "eligible") return matchedSchemesList.filter((s) => s.status === "eligible");
    if (activeTab === "near_match") return matchedSchemesList.filter((s) => s.status === "near_match");
    return matchedSchemesList;
  }, [matchedSchemesList, activeTab]);

  const handleTranscriptReceived = useCallback(async (transcript) => {
    setIsProcessing(true);
    setAiResponse("");
    try {
      const parsedFields = await parseUserProfile(transcript, language);
      const mergedProfile = { ...userProfile };
      Object.keys(parsedFields).forEach((key) => {
        if (parsedFields[key] !== null && parsedFields[key] !== undefined) mergedProfile[key] = parsedFields[key];
      });
      setUserProfile(mergedProfile);
      const newMatches = matchSchemes(mergedProfile, schemes);
      const actionableMatches = newMatches.filter((m) => m.status === "eligible" || m.status === "near_match");
      const guidanceAudioText = await generateVernacularSummary(actionableMatches, mergedProfile, language);
      setAiResponse(guidanceAudioText);
    } catch (error) {
      console.error("Redirection pipeline error:", error);
      setAiResponse(language === "hi"
        ? "माफ़ कीजिये, आपकी आवाज़ को समझने में त्रुटि हुई।"
        : "Apologies, there was an issue processing your voice data.");
    } finally {
      setIsProcessing(false);
    }
  }, [language, userProfile]);

  const handleReadyToShowResults = useCallback(() => setCurrentPage("results"), []);

  const handleCompleteQuestionnaire = useCallback(async (finalProfile) => {
    setIsProcessing(true);
    setIsGeneratingReport(true);
    setAiResponse("");
    setAiReport("");
    let matchedResultsList = [];
    try {
      matchedResultsList = matchSchemes(finalProfile, schemes);
    } catch (err) {
      console.error("Local matching failed:", err);
    }

    try {
      const actionableMatches = matchedResultsList.filter((m) => m.status === "eligible" || m.status === "near_match");
      
      // 15-second safety timeout wrapper to prevent getting stuck
      const withTimeout = (promise, ms) => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("API Timeout")), ms);
          promise.then(
            res => { clearTimeout(timer); resolve(res); },
            err => { clearTimeout(timer); reject(err); }
          );
        });
      };

      const [guidanceAudioText, reportMarkdown] = await withTimeout(
        Promise.all([
          generateVernacularSummary(actionableMatches, finalProfile, language),
          generateDetailedAIReport(matchedResultsList, finalProfile, language)
        ]),
        15000
      );
      
      setAiResponse(guidanceAudioText);
      setAiReport(reportMarkdown);
    } catch (e) {
      console.error("Error generating final questionnaire summary:", e);
      // Fallback: Generate the structured JSON locally so the UI cards still render beautifully!
      const actionableMatches = matchedResultsList.filter((m) => m.status === "eligible" || m.status === "near_match");
      const fallbackData = {
        executive_summary: language === "hi" 
          ? "नेटवर्क कनेक्शन धीमा होने के कारण स्थानीय रूप से तैयार की गई रिपोर्ट। कृपया अपनी योजना पात्रता विवरण नीचे देखें।"
          : "Report generated locally due to a slow network connection. Please review your scheme eligibility details below.",
        schemes: actionableMatches.map(s => ({
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
      setAiReport(JSON.stringify(fallbackData));
      
      // Also generate local audio response
      setAiResponse(language === "hi" 
        ? "नमस्ते, नेटवर्क कनेक्शन धीमा होने के कारण हमने आपकी योजनाओं की सूची स्थानीय रूप से तैयार कर दी है।"
        : "Hello, we have prepared your matching schemes locally due to a slow network connection.");
    } finally {
      setIsProcessing(false);
      setIsGeneratingReport(false);
    }
  }, [language]);

  const handleProfileChange = (updatedProfile) => { setUserProfile(updatedProfile); setAiResponse(""); };
  const handleResetProfile = () => {
    setUserProfile(getEmptyProfile());
    setAiReport("");
    setAiResponse(""); setActiveTab("ai_report"); setCurrentPage("home");
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await generateDetailedAIReport(filteredSchemes, userProfile, language);
      setAiReport(report);
    } catch (error) {
      console.error("Failed to generate AI report", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  function parseBoldText(text) {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 700 }}>{part}</strong> : part));
  }

  function renderMarkdown(mdText) {
    if (!mdText) return null;
    return mdText.split("\n").map((line, idx) => {
      let text = line.trim();
      if (text.startsWith("###")) {
        return <h4 key={idx} style={{ fontSize: "1.1rem", fontWeight: 700, margin: "1.25rem 0 0.5rem 0", color: "var(--accent-primary)" }}>{text.replace(/^###\s*/, "")}</h4>;
      }
      if (text.startsWith("##")) {
        return <h3 key={idx} style={{ fontSize: "1.25rem", fontWeight: 700, margin: "1.5rem 0 0.6rem 0", color: "var(--accent-primary)" }}>{text.replace(/^##\s*/, "")}</h3>;
      }
      if (text.startsWith("#")) {
        return <h2 key={idx} style={{ fontSize: "1.4rem", fontWeight: 800, margin: "1.75rem 0 0.75rem 0", color: "var(--accent-primary)" }}>{text.replace(/^#\s*/, "")}</h2>;
      }
      if (text.startsWith("-") || text.startsWith("*")) {
        const content = text.replace(/^[\-\*]\s*/, "");
        return <li key={idx} style={{ marginLeft: "1.5rem", marginBottom: "0.4rem", listStyleType: "disc" }}>{parseBoldText(content)}</li>;
      }
      if (/^\d+\./.test(text)) {
        const content = text.replace(/^\d+\.\s*/, "");
        return <li key={idx} style={{ marginLeft: "1.5rem", marginBottom: "0.4rem", listStyleType: "decimal" }}>{parseBoldText(content)}</li>;
      }
      if (text === "") return <div key={idx} style={{ height: "0.5rem" }} />;
      return <p key={idx} style={{ margin: "0 0 0.6rem 0", lineHeight: "1.6" }}>{parseBoldText(line)}</p>;
    });
  }

  function renderAIReportDashboard(reportText) {
    if (!reportText) return null;

    const reportLabels = {
      hi: {
        title: "कल्याण सलाहकार पात्रता रिपोर्ट",
        summary: "मुख्य निष्कर्ष",
        eligible: "पूर्णतः पात्र (Fully Eligible)",
        nearMatch: "निकटतम पात्र (Near Match)",
        score: "तैयारी स्कोर",
        benefits: "योजना के लाभ:",
        analysis: "पात्रता विश्लेषण:",
        reqs: "आवेदन करने के लिए आवश्यक योग्यता:",
        docs: "दस्तावेज़ चेकलिस्ट:",
        steps: "आवेदन करने की प्रक्रिया (Steps):",
        applyBtn: "आधिकारिक पोर्टल पर आवेदन करें"
      },
      en: {
        title: "Welfare Advisor Eligibility Report",
        summary: "Executive Summary",
        eligible: "Fully Eligible",
        nearMatch: "Near Match",
        score: "Readiness Score",
        benefits: "Scheme Benefits:",
        analysis: "Eligibility Analysis:",
        reqs: "Application Requirements:",
        docs: "Document Checklist:",
        steps: "Application Steps:",
        applyBtn: "Apply on Official Portal"
      },
      ta: {
        title: "நல ஆலோசகர் தகுதி அறிக்கை",
        summary: "நிர்வாக சுருக்கம்",
        eligible: "முழு தகுதி (Fully Eligible)",
        nearMatch: "நெருங்கிய தகுதி (Near Match)",
        score: "தயாரிப்பு மதிப்பெண்",
        benefits: "திட்டத்தின் நன்மைகள்:",
        analysis: "தகுதி பகுப்பாய்வு:",
        reqs: "விண்ணப்பிக்க தேவையான தகுதிகள்:",
        docs: "ஆவண சரிபார்ப்பு பட்டியல்:",
        steps: "விண்ணப்பிக்கும் நடைமுறை (Steps):",
        applyBtn: "அதிகாரப்பூர்வ போர்ட்டலில் விண்ணப்பிக்கவும்"
      },
      te: {
        title: "సంక్షేమ సలహాదారు అర్హత నివేదిక",
        summary: "ప్రధాన నివేదిక",
        eligible: "పూర్తి అర్హత (Fully Eligible)",
        nearMatch: "దాదాపు అర్హత (Near Match)",
        score: "సన్నద్ధత స్కోరు",
        benefits: "పథకం ప్రయోజనాలు:",
        analysis: "అర్హత విశ్లేషణ:",
        reqs: "దరఖాస్తు చేయడానికి అవసరమైన అర్హతలు:",
        docs: "పత్రాల తనిఖీ జాబితా:",
        steps: "దరఖాస్తు విధానం (Steps):",
        applyBtn: "అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోండి"
      }
    };

    const labels = reportLabels[language] || reportLabels.en;

    // Clean JSON content
    let cleanJson = reportText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    try {
      const data = JSON.parse(cleanJson);
      
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
          {/* Executive Summary Card */}
          {data.executive_summary && (
            <div className="glass-panel" style={{ padding: "1.5rem", borderLeft: "4px solid var(--accent-primary)", background: "linear-gradient(135deg, rgba(79, 70, 229, 0.04), rgba(255,255,255,0.75))" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--accent-primary)" }}>{labels.summary}</h4>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{data.executive_summary}</p>
            </div>
          )}

          {/* Scheme Cards */}
          {data.schemes && data.schemes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {data.schemes.map((s, idx) => {
                const isEligible = s.status === "eligible";
                
                // Retrieve apply link from local database using scheme_id or fuzzy match
                let applyUrl = null;
                const localScheme = schemes.find(ls => 
                  ls.scheme_id === s.scheme_id ||
                  ls.name.toLowerCase().replace(/[^a-z0-9]/g, "") === s.scheme_id?.toLowerCase() ||
                  ls.name.toLowerCase().replace(/[^a-z0-9]/g, "").includes(s.name.toLowerCase().replace(/\([^)]*\)/g, "").replace(/[^a-z0-9\s]/g, "").trim())
                );

                if (localScheme) {
                  applyUrl = localScheme.apply_url;
                } else {
                  const nameLower = s.name.toLowerCase();
                  let targetId = null;
                  if (nameLower.includes("आयुष्मान") || nameLower.includes("pm-jay") || nameLower.includes("pmjay") || nameLower.includes("jan arogya")) {
                    targetId = "pm_jay";
                  } else if (nameLower.includes("किसान") || nameLower.includes("kisan")) {
                    targetId = "pm_kisan";
                  } else if (nameLower.includes("वृद्धावस्था") || nameLower.includes("old age") || nameLower.includes("pension")) {
                    targetId = "ignoaps";
                  } else if (nameLower.includes("चिरंजीवी") || nameLower.includes("chiranjeevi")) {
                    targetId = "chiranjeevi";
                  } else if (nameLower.includes("सुकन्या") || nameLower.includes("sukanya") || nameLower.includes("ssy")) {
                    targetId = "ssy";
                  } else if (nameLower.includes("मातृ वंदना") || nameLower.includes("matru vandana") || nameLower.includes("pmmvy")) {
                    targetId = "pmmvy";
                  } else if (nameLower.includes("विश्वकर्मा") || nameLower.includes("vishwakarma")) {
                    targetId = "pm_vishwakarma";
                  } else if (nameLower.includes("स्वनिधि") || nameLower.includes("svanidhi") || nameLower.includes("street vendor")) {
                    targetId = "pm_svanidhi";
                  } else if (nameLower.includes("अटल") || nameLower.includes("atal") || nameLower.includes("apy")) {
                    targetId = "apy";
                  } else if (nameLower.includes("श्रम") || nameLower.includes("shram")) {
                    targetId = "e_shram";
                  }
                  
                  if (targetId) {
                    const matchLs = schemes.find(ls => ls.scheme_id === targetId);
                    if (matchLs) applyUrl = matchLs.apply_url;
                  }
                }

                return (
                  <div key={idx} className="glass-panel animate-fade-in" style={{ padding: "1.75rem", borderLeft: `6px solid ${isEligible ? "var(--color-success)" : "var(--color-warning)"}`, background: "var(--bg-glass-heavy)", borderRadius: "var(--radius-lg)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)", marginBottom: "0.5rem" }}>
                    {/* Category Header */}
                    <div style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                      {s.category || (language === "hi" ? "कल्याण" : "Welfare")}
                    </div>
                    
                    {/* Scheme Name */}
                    <h4 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 0.75rem 0", color: "var(--text-primary)" }}>{s.name}</h4>

                    {/* Status Pill and Readiness Score */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem", background: "rgba(0,0,0,0.02)", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--border-glass)" }}>
                      <span style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        padding: "0.3rem 0.75rem",
                        borderRadius: "99px",
                        background: isEligible ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                        color: isEligible ? "var(--color-success)" : "var(--color-warning)",
                        border: `1px solid ${isEligible ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`
                      }}>
                        {isEligible ? labels.eligible : labels.nearMatch}
                      </span>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                          {labels.score}: <strong style={{ color: "var(--accent-primary)", fontSize: "0.95rem" }}>{s.readiness_score || (isEligible ? 100 : 80)}/100</strong>
                        </span>
                        <div style={{ width: "60px", height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${s.readiness_score || (isEligible ? 100 : 80)}%`, height: "100%", background: isEligible ? "var(--color-success)" : "var(--color-warning)" }} />
                        </div>
                      </div>
                    </div>

                    {/* AI Quote */}
                    {s.ai_quote && (
                      <div style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--text-secondary)", borderLeft: "3px solid var(--accent-primary)", paddingLeft: "1rem", margin: "1rem 0 1.25rem 0", background: "rgba(79, 70, 229, 0.02)", padding: "0.75rem 1rem", borderRadius: "0 8px 8px 0" }}>
                        "{s.ai_quote}"
                      </div>
                    )}

                    {/* Scheme Information Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginTop: "1rem" }}>
                      {/* 1. Benefits */}
                      {s.benefits && s.benefits.length > 0 && (
                        <div>
                          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{labels.benefits}</h5>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                            {s.benefits.map((b, i) => <li key={i} style={{ marginBottom: "0.25rem" }}>{b}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* 2. Analysis */}
                      {s.eligibility_analysis && (
                        <div>
                          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{labels.analysis}</h5>
                          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{s.eligibility_analysis}</p>
                        </div>
                      )}

                      {/* 3. Requirements */}
                      {s.requirements && s.requirements.length > 0 && (
                        <div>
                          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{labels.reqs}</h5>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                            {s.requirements.map((r, i) => <li key={i} style={{ marginBottom: "0.25rem", color: "var(--color-warning)" }}>{r}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* 4. Documents */}
                      {s.documents && s.documents.length > 0 && (
                        <div>
                          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{labels.docs}</h5>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                            {s.documents.map((d, i) => <li key={i} style={{ marginBottom: "0.25rem" }}>{d}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* 5. Steps */}
                    {s.steps && s.steps.length > 0 && (
                      <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-glass)" }}>
                        <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{labels.steps}</h5>
                        <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                          {s.steps.map((st, i) => <li key={i} style={{ marginBottom: "0.35rem" }}>{st}</li>)}
                        </ol>
                      </div>
                    )}

                    {/* 6. Apply Button */}
                    {applyUrl && (
                      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                        <a 
                          href={applyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary"
                          style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem", borderRadius: "30px", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#fff", fontWeight: 600, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
                        >
                          <span>{labels.applyBtn}</span>
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
              {language === "hi" ? "कोई योजना विवरण उपलब्ध नहीं है।" : "No scheme details available."}
            </div>
          )}
        </div>
      );
    } catch (e) {
      console.error("JSON parsing of AI report failed, falling back to markdown", e);
      return (
        <div className="glass-panel ai-report-container animate-fade-in" style={{ padding: "2rem", borderLeft: "4px solid var(--accent-primary)", background: "var(--bg-glass-heavy)", borderRadius: "var(--radius-md)" }}>
          {renderMarkdown(reportText)}
        </div>
      );
    }
  }

  const i18n = {
    tagline: { hi: "योजना जागरूकता", en: "Schemes in your voice", ta: "திட்ட விழிப்புணர்வு", te: "పథకాల అవగాహన" },
    navHome: { hi: "होम", en: "Home", ta: "முகப்பு", te: "హోమ్" },
    navGuide: { hi: "गाइड", en: "Guide", ta: "வழிகாட்டி", te: "గైడ్" },
    navAbout: { hi: "हमारे बारे में", en: "About", ta: "எங்களைப் பற்றி", te: "మా గురించి" },
    navResults: { hi: "मेरी योजनाएं", en: "My Schemes", ta: "என் திட்டங்கள்", te: "నా పథకాలు" },
    viewResults: { hi: "परिणाम देखें", en: "View Schemes", ta: "முடிவுகள்", te: "ఫలితాలు" },
    eligibleCount: { hi: "पात्र योजनाएं", en: "Eligible Schemes", ta: "தகுதியான திட்டங்கள்", te: "అర్హత గల పథకాలు" },
    nearMatchCount: { hi: "लगभग पात्र", en: "Near Matches", ta: "கிட்டத்தட்ட தகுதியானவை", te: "దాదాపు అర్హత ఉన్నవి" },
    avgReadiness: { hi: "औसत तैयारी स्कोर", en: "Avg. Readiness Score", ta: "சராசரி தயார்நிலை", te: "సగటు సంసిద్ధత" },
    backBtn: { hi: "वापस होम पर", en: "Back to Home", ta: "முகப்புக்கு", te: "హోమ్‌కు" },
    reportTitle: { hi: "आपके लिए अनुशंसित योजनाएं", en: "Your Scheme Report", ta: "உங்கள் திட்ட அறிக்கை", te: "మీ పథకాల నివేదిక" },
    noMatches: { hi: "अभी कोई योजना नहीं — बस माइक दबाकर बोलिए!", en: "No schemes yet — just tap the mic and speak!", ta: "திட்டங்கள் இல்லை — மைக்கை அழுத்தி பேசவும்", te: "ఇంకా పథకాలు లేవు — మైక్ నొక్కి మాట్లాడండి" },
    heroKicker: { hi: "आपकी आवाज़, आपका हक़", en: "Your voice, your right", ta: "உங்கள் குரல், உங்கள் உரிமை", te: "మీ గొంతు, మీ హక్కు" },
    heroTitle: {
      hi: "बस बोलिए — हम आपकी सरकारी योजनाएं ढूंढ देंगे।",
      en: "Just speak — we'll find the government schemes meant for you.",
      ta: "வெறும் பேசுங்கள் — உங்களுக்கான அரசுத் திட்டங்களை நாங்கள் கண்டுபிடிப்போம்.",
      te: "మాట్లాడండి చాలు — మీకు సరిపోయే ప్రభుత్వ పథకాలను మేము కనుగొంటాం."
    },
    heroSub: {
      hi: "कोई फ़ॉर्म नहीं, कोई पढ़ाई-लिखाई नहीं। अपनी भाषा में बताइए — उम्र, काम, और आमदनी। बाकी आवाज़ संभाल लेगा।",
      en: "No forms, no jargon. Tell us in your language — your age, work and income. Awaaz handles the rest.",
      ta: "படிவங்கள் இல்லை, கடினம் இல்லை. உங்கள் மொழியில் வயது, வேலை, வருமானம் சொல்லுங்கள். மீதியை Awaaz பார்த்துக்கொள்ளும்.",
      te: "ఫారాలు లేవు, కష్టం లేదు. మీ భాషలో వయసు, పని, ఆదాయం చెప్పండి. మిగతాది Awaaz చూసుకుంటుంది."
    },
    heroCta: { hi: "अभी बोलना शुरू करें", en: "Start speaking now", ta: "இப்போது பேசுங்கள்", te: "ఇప్పుడే మాట్లాడండి" },
    heroCta2: { hi: "गाइड पढ़ें", en: "Read the guide", ta: "வழிகாட்டி", te: "గైడ్ చూడండి" },
    feat1Title: { hi: "अपनी भाषा में बोलिए", en: "Speak your language", ta: "உங்கள் மொழியில்", te: "మీ భాషలో" },
    feat1Body: { hi: "हिन्दी, English, தமிழ், తెలుగు — आप जैसे बोलते हैं वैसे ही समझा जाएगा।", en: "Hindi, English, Tamil, Telugu — talk the way you actually talk.", ta: "எப்படி பேசுகிறீர்களோ அப்படியே புரிந்துகொள்ளும்.", te: "మీరు ఎలా మాట్లాడితే అలాగే అర్థమవుతుంది." },
    feat2Title: { hi: "तुरंत मिलान", en: "Instant matching", ta: "உடனடி பொருத்தம்", te: "తక్షణ సరిపోలిక" },
    feat2Body: { hi: "हर योजना के लिए तैयारी स्कोर — किसमें आप पूरी तरह पात्र हैं, किसमें थोड़ी कमी है।", en: "A readiness score for every scheme — see what fits you fully or partly.", ta: "ஒவ்வொரு திட்டத்திற்கும் தயார்நிலை மதிப்பெண்.", te: "ప్రతి పథకానికి సంసిద్ధత స్కోర్." },
    feat3Title: { hi: "एक ही जगह दस्तावेज़", en: "Documents in one place", ta: "ஆவணங்கள் ஒரே இடத்தில்", te: "పత్రాలు ఒకే చోట" },
    feat3Body: { hi: "जो कागज़ चाहिए, उनकी एक साफ़ सूची — दौड़-भाग कम।", en: "A clean checklist of papers you'll need — less running around.", ta: "தேவையான ஆவணங்களின் தெளிவான பட்டியல்.", te: "అవసరమైన పత్రాల జాబితా." },
    builtFor: { hi: "किसके लिए?", en: "Built for", ta: "யாருக்காக?", te: "ఎవరి కోసం?" },
    audience: { hi: "किसान, मज़दूर, छोटे दुकानदार, गृहिणियाँ, बुज़ुर्ग — हर वो इंसान जिसके पास हक़ है, पर पता नहीं।", en: "Farmers, workers, small shopkeepers, homemakers and elders — everyone with a right but no roadmap.", ta: "விவசாயிகள், தொழிலாளர்கள், கடைக்காரர்கள், வீட்டம்மாக்கள், மூத்தோர் — அனைவருக்கும்.", te: "రైతులు, కార్మికులు, చిన్న వ్యాపారులు, గృహిణులు, వృద్ధులు — అందరికీ." },
    guideTitle: { hi: "आवाज़ असिस्टेंट कैसे काम करता है", en: "How the voice assistant works", ta: "குரல் அசிஸ்டண்ட் எப்படி வேலை செய்கிறது", te: "వాయిస్ అసిస్టెంట్ ఎలా పనిచేస్తుంది" },
    guideIntro: { hi: "तीन सीधे कदम। बस।", en: "Three simple steps. That's it.", ta: "மூன்று எளிய படிகள்.", te: "మూడు సులభమైన దశలు." },
    step1Title: { hi: "1. नीचे माइक दबाएँ", en: "1. Tap the mic below", ta: "1. மைக்கை அழுத்தவும்", te: "1. మైక్ నొక్కండి" },
    step1Body: { hi: "स्क्रीन के नीचे नीला कैप्सूल दिखेगा — उसे दबाते ही असिस्टेंट सुनना शुरू कर देगा।", en: "A blue capsule sits at the bottom of the screen — tap it and the assistant starts listening.", ta: "திரையின் கீழ் நீல பட்டன் — அழுத்தினால் கேட்க ஆரம்பிக்கும்.", te: "క్రింద నీలి బటన్ నొక్కితే వినడం మొదలవుతుంది." },
    step2Title: { hi: "2. खुलकर बोलिए", en: "2. Speak freely", ta: "2. தாராளமாக பேசுங்கள்", te: "2. స్వేచ్ఛగా మాట్లాడండి" },
    step2Body: { hi: "जैसे आप किसी दोस्त से बात करते हैं वैसे ही बोलिए। उम्र, काम, परिवार, ज़मीन, आमदनी — जो याद आए।", en: "Talk like you would to a friend — your age, work, family, land, income. Whatever you remember.", ta: "நண்பரிடம் பேசுவது போல — வயது, வேலை, குடும்பம், நிலம், வருமானம்.", te: "స్నేహితుడితో మాట్లాడినట్టు — వయసు, పని, కుటుంబం, భూమి, ఆదాయం." },
    step3Title: { hi: "3. रिज़ल्ट देखिए", en: "3. See your results", ta: "3. முடிவுகளைப் பாருங்கள்", te: "3. ఫలితాలు చూడండి" },
    step3Body: { hi: "बोलना खत्म होते ही 2–3 सेकंड में आपका डैशबोर्ड खुल जाएगा — हर योजना का तैयारी स्कोर साथ में।", en: "Once you stop, your dashboard opens in 2–3 seconds — with a readiness score for each scheme.", ta: "பேசி முடித்ததும் 2–3 வினாடிகளில் டாஷ்போர்டு திறக்கும்.", te: "మాట్లాడిన 2–3 సెకన్లలో డాష్‌బోర్డ్ తెరుచుకుంటుంది." },
    tipsTitle: { hi: "बेहतर रिज़ल्ट के लिए छोटी सलाह", en: "Tips for better results", ta: "சிறந்த முடிவுகளுக்கு", te: "మంచి ఫలితాల కోసం" },
    tip1: { hi: "शांत जगह से बोलें, माइक की अनुमति ज़रूर दें।", en: "Speak from a quiet place and allow mic access.", ta: "அமைதியான இடம், மைக் அனுமதி.", te: "ప్రశాంత ప్రదేశం, మైక్ అనుమతి." },
    tip2: { hi: "एक वाक्य में बहुत कुछ बता सकते हैं — \"मैं 42 साल का किसान हूँ, 1 एकड़ ज़मीन है\"।", en: "One sentence can carry a lot — \"I'm a 42 year old farmer with 1 acre of land\".", ta: "ஒரே வாக்கியத்தில் — \"நான் 42 வயது விவசாயி, 1 ஏக்கர் நிலம்\".", te: "ఒక వాక్యం చాలు — \"నేను 42 ఏళ్ల రైతు, 1 ఎకరం భూమి\"." },
    tip3: { hi: "गलती हो जाए तो दोबारा बोल सकते हैं — पुरानी जानकारी अपने आप अपडेट होगी।", en: "Made a mistake? Just speak again — old details auto-update.", ta: "தவறு என்றால் மறுபடியும் பேசுங்கள்.", te: "తప్పయితే మళ్ళీ మాట్లాడండి." },
    aboutTitle: { hi: "Awaaz के बारे में", en: "About Awaaz", ta: "Awaaz பற்றி", te: "Awaaz గురించి" },
    aboutLead: {
      hi: "Awaaz उन करोड़ों लोगों के लिए बनी है जिनके पास सरकारी हक़ तो हैं, लेकिन फ़ॉर्म, भाषा और दफ्तरों की भीड़ बीच में आ जाती है।",
      en: "Awaaz exists for the millions who have government rights — but forms, jargon and queues stand in between.",
      ta: "Awaaz அரசு உரிமைகள் இருந்தும் படிவம், மொழி, வரிசை இடையில் வரும் கோடிக்கணக்கானவர்களுக்கானது.",
      te: "ప్రభుత్వ హక్కులు ఉన్నా ఫారాలు, భాష, క్యూలు అడ్డుపడే కోట్లాదిమంది కోసం Awaaz."
    },
    missionTitle: { hi: "हमारा मक़सद", en: "Our mission", ta: "எங்கள் நோக்கம்", te: "మా లక్ష్యం" },
    missionBody: {
      hi: "एक ऐसा साथी जो आपकी भाषा बोले, आपको जज न करे, और सिर्फ़ इतना बताए — \"यह योजना आपकी है, और इस तरह मिल सकती है।\"",
      en: "A companion that speaks your language, never judges, and simply tells you — \"this scheme is yours, here's how to claim it.\"",
      ta: "உங்கள் மொழி பேசும், தீர்ப்பு சொல்லாத, \"இந்த திட்டம் உங்களுடையது\" என்று சொல்லும் துணை.",
      te: "మీ భాష మాట్లాడే, తీర్పు చెప్పని, \"ఈ పథకం మీది\" అని చెప్పే తోడు."
    },
    valuesTitle: { hi: "हम किस पर भरोसा करते हैं", en: "What we stand for", ta: "எங்கள் கொள்கைகள்", te: "మేము నమ్మే విలువలు" },
    val1: { hi: "गरिमा पहले", en: "Dignity first", ta: "மரியாதை முதல்", te: "గౌరవం మొదట" },
    val1Body: { hi: "कोई जज नहीं। कोई जटिल सवाल नहीं।", en: "No judgement. No complicated questions.", ta: "தீர்ப்பு இல்லை.", te: "తీర్పు లేదు." },
    val2: { hi: "भरोसेमंद जानकारी", en: "Trustworthy info", ta: "நம்பகமான தகவல்", te: "నమ్మదగిన సమాచారం" },
    val2Body: { hi: "केवल सरकारी स्रोतों पर आधारित।", en: "Sourced only from official government data.", ta: "அரசு ஆதாரத்திலிருந்து மட்டும்.", te: "ప్రభుత్వ మూలాల నుండే." },
    val3: { hi: "गोपनीयता", en: "Privacy", ta: "தனியுரிமை", te: "గోప్యత" },
    val3Body: { hi: "आपकी आवाज़, आपका डेटा — किसी और के पास नहीं जाता।", en: "Your voice and data stay with you. We don't share.", ta: "உங்கள் தரவு உங்களிடமே.", te: "మీ డేటా మీతోనే." },
  };

  const t = (k) => pick(i18n[k], language);

  // ============== PAGES ==============
  const HomePage = (
    <div className="page-transition-wrapper">
      <section className="hero-wrap">
        <div className="hero-blob blob1" />
        <div className="hero-blob blob2" />
        <div className="hero-inner">
          <h1 className="hero-title">{t("heroTitle")}</h1>
          <p className="hero-sub">{t("heroSub")}</p>
          <div className="hero-cta-row">
            <button className="btn btn-primary btn-lg" onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}>
              {t("heroCta")}
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => setCurrentPage("guide")}>
              {t("heroCta2")}
            </button>
          </div>

          {stats.total > 0 && (
            <div className="hero-readout glass-panel" onClick={() => setCurrentPage("results")}>
              <span>{stats.eligible} {t("eligibleCount")} • {stats.nearMatch} {t("nearMatchCount")}</span>
              <span className="hero-readout-cta">{t("viewResults")} →</span>
            </div>
          )}
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card glass-panel">
          <h3>{t("feat1Title")}</h3>
          <p>{t("feat1Body")}</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>{t("feat2Title")}</h3>
          <p>{t("feat2Body")}</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>{t("feat3Title")}</h3>
          <p>{t("feat3Body")}</p>
        </div>
      </section>

      <section className="audience-strip glass-panel">
        <div>
          <h4>{t("builtFor")}</h4>
          <p>{t("audience")}</p>
        </div>
      </section>


      <section className="dashboard-grid single-col-mobile">
        <UserProfile
          profile={userProfile}
          onProfileChange={handleProfileChange}
          onReset={handleResetProfile}
          language={language}
        />
        <div className="glass-panel profile-widget" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <h3 className="text-gradient" style={{ fontSize: "1.15rem" }}>
            {language === "hi" ? "जल्दी शुरुआत" : "Quick start"}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {language === "hi"
              ? "अगर आप अभी बोलना नहीं चाहते, तो दाईं तरफ़ अपनी जानकारी टाइप कर सकते हैं — योजनाएं उसी आधार पर मिल जाएंगी।"
              : "Not ready to speak? Type your details on the side and we'll match schemes the same way."}
          </p>
          <button className="btn btn-primary" onClick={() => setCurrentPage("guide")}>
            <BookOpen size={16} /> {t("navGuide")}
          </button>
        </div>
      </section>
    </div>
  );

  const GuidePage = (
    <div className="page-transition-wrapper">
      <div className="page-head">
        <button className="btn back-btn" onClick={() => setCurrentPage("home")}>
          <ArrowLeft size={16} /> {t("backBtn")}
        </button>
        <h2 className="page-title">{t("guideTitle")}</h2>
        <div style={{ width: "120px" }} />
      </div>

      <p className="page-lead">{t("guideIntro")}</p>

      <div className="steps-grid">
        {[
          { n: "step1", icon: <Mic size={22} /> },
          { n: "step2", icon: <MessageCircle size={22} /> },
          { n: "step3", icon: <Award size={22} /> },
        ].map((s) => (
          <div key={s.n} className="step-card glass-panel">
            <div className="step-icon">{s.icon}</div>
            <h3>{t(`${s.n}Title`)}</h3>
            <p>{t(`${s.n}Body`)}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel tips-panel">
        <h3><Star size={18} /> {t("tipsTitle")}</h3>
        <ul>
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
        </ul>
      </div>
    </div>
  );

  const AboutPage = (
    <div className="page-transition-wrapper">
      <div className="page-head">
        <button className="btn back-btn" onClick={() => setCurrentPage("home")}>
          <ArrowLeft size={16} /> {t("backBtn")}
        </button>
        <h2 className="page-title">{t("aboutTitle")}</h2>
        <div style={{ width: "120px" }} />
      </div>

      <div className="glass-panel about-lead">
        <Heart size={26} style={{ color: "var(--accent-secondary)" }} />
        <p>{t("aboutLead")}</p>
      </div>

      <div className="dashboard-grid single-col-mobile">
        <div className="glass-panel about-card">
          <h3>{t("missionTitle")}</h3>
          <p>{t("missionBody")}</p>
        </div>
        <div className="glass-panel about-card">
          <h3>{t("valuesTitle")}</h3>
          <ul className="values-list">
            <li><ShieldCheck size={18} /> <div><strong>{t("val1")}</strong><span>{t("val1Body")}</span></div></li>
            <li><CheckCircle2 size={18} /> <div><strong>{t("val2")}</strong><span>{t("val2Body")}</span></div></li>
            <li><Info size={18} /> <div><strong>{t("val3")}</strong><span>{t("val3Body")}</span></div></li>
          </ul>
        </div>
      </div>
    </div>
  );

  const ResultsPage = (
    <div className="page-transition-wrapper results-page-layout">
      <div className="page-head">
        <button className="btn back-btn" onClick={() => setCurrentPage("home")}>
          <ArrowLeft size={16} /> {t("backBtn")}
        </button>
        <h2 className="page-title">{t("reportTitle")}</h2>
        <div style={{ width: "120px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="glass-panel stat-card" style={{ borderTop: "3px solid var(--color-success)" }}>
          <div className="stat-head"><CheckCircle2 size={20} style={{ color: "var(--color-success)" }} /><span>{t("eligibleCount")}</span></div>
          <span className="stat-num" style={{ color: "var(--color-success)" }}>{stats.eligible}</span>
        </div>
        <div className="glass-panel stat-card" style={{ borderTop: "3px solid var(--color-warning)" }}>
          <div className="stat-head"><AlertTriangle size={20} style={{ color: "var(--color-warning)" }} /><span>{t("nearMatchCount")}</span></div>
          <span className="stat-num" style={{ color: "var(--color-warning)" }}>{stats.nearMatch}</span>
        </div>
        <div className="glass-panel stat-card" style={{ borderTop: "3px solid var(--accent-primary)" }}>
          <div className="stat-head"><Gauge size={20} style={{ color: "var(--accent-primary)" }} /><span>{t("avgReadiness")}</span></div>
          <div className="readiness-stat-value">
            <span className="stat-num" style={{ color: "var(--accent-primary)" }}>{stats.avgReadiness}</span>
            <span className="unit">/100</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid results-page-grid">
        <div className="right-column-container">
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>
                <Award size={22} style={{ color: "var(--accent-primary)" }} />
                <span>{language === "hi" ? "पात्र योजनाएं" : "Your Schemes"}</span>
              </h3>
              <span className="schemes-count-pill">
                {filteredSchemes.length} {language === "hi" ? "योजनाएं" : "schemes"}
              </span>
            </div>
            <div className="schemes-tabs">
              <button className={`tab-btn ${activeTab === "ai_report" ? "active" : ""}`} onClick={() => setActiveTab("ai_report")}>
                📋 {language === "hi" ? "पात्रता रिपोर्ट" : "Eligibility Report"}
              </button>
              <button className={`tab-btn ${activeTab === "eligible" ? "active" : ""}`} onClick={() => setActiveTab("eligible")}>
                {language === "hi" ? "पात्र" : language === "ta" ? "தகுதியானவை" : language === "te" ? "అర్హులు" : "Eligible"}
              </button>
              <button className={`tab-btn ${activeTab === "near_match" ? "active" : ""}`} onClick={() => setActiveTab("near_match")}>
                {language === "hi" ? "निकटतम" : language === "ta" ? "கிட்டத்தட்ட" : language === "te" ? "దాదాపు" : "Near"}
              </button>
              <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                {language === "hi" ? "सभी" : language === "ta" ? "அனைத்தும்" : language === "te" ? "అన్నీ" : "All"}
              </button>
            </div>
          </div>

          <div className="schemes-list">
            {activeTab === "ai_report" ? (
              isGeneratingReport ? (
                <div className="glass-panel" style={{ padding: "3rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={36} className="animate-spin text-gradient" />
                  <h4 style={{ fontWeight: 600 }}>{language === "hi" ? "आपकी कल्याण रिपोर्ट तैयार की जा रही है..." : "Preparing your welfare report..."}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{language === "hi" ? "कृपया प्रतीक्षा करें, हम आपकी पात्रता का विश्लेषण कर रहे हैं।" : "Analyzing matching database schemes and documents..."}</p>
                </div>
              ) : aiReport ? (
                <div className="glass-panel ai-report-container animate-fade-in" style={{ padding: "2rem", borderLeft: "4px solid var(--accent-primary)", background: "var(--bg-glass-heavy)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px dashed var(--border-glass)", paddingBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.95rem", color: "var(--accent-primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>📋</span> {language === "hi" ? "कल्याण सलाहकार पात्रता रिपोर्ट" : "Welfare Advisor Eligibility Report"}
                    </span>
                    <button 
                      className="btn" 
                      onClick={() => window.print()}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                    >
                      Print Report
                    </button>
                  </div>
                  <div className="ai-report-content" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {renderAIReportDashboard(aiReport)}
                  </div>
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: "3rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={32} style={{ color: "var(--accent-primary)" }} />
                  <h4 style={{ fontWeight: 600 }}>{language === "hi" ? "पात्रता रिपोर्ट उपलब्ध है" : "Eligibility Report Available"}</h4>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleGenerateReport}
                    style={{ padding: "0.6rem 1.5rem", borderRadius: "30px", fontWeight: 600 }}
                  >
                    {language === "hi" ? "रिपोर्ट लोड करें" : "Load Report Now"}
                  </button>
                </div>
              )
            ) : filteredSchemes.length > 0 ? (
              filteredSchemes.map((match) => (
                (match.status !== "ineligible" || activeTab === "all") && (
                  (match.status === activeTab || activeTab === "all") && (
                    <SchemeCard
                      key={match.scheme.scheme_id}
                      matchResult={match}
                      language={language}
                      userProfile={userProfile}
                    />
                  )
                )
              ))
            ) : (
              <div className="glass-panel empty-schemes">
                <ClipboardList className="empty-icon" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{t("noMatches")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="left-column-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <ConsolidatedDocs matchedResults={matchedSchemesList} userProfile={userProfile} language={language} />
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "0 0 8px rgba(79,70,229,0.4)" }} />
              <span>{language === "hi" ? "आपकी प्रोफ़ाइल" : "Your Profile"}</span>
            </h4>
            <UserProfile profile={userProfile} onProfileChange={handleProfileChange} onReset={handleResetProfile} language={language} />
          </div>
        </div>
      </div>
    </div>
  );

  const navItems = [
    { key: "home", icon: <HomeIcon size={15} />, label: t("navHome") },
    { key: "guide", icon: <BookOpen size={15} />, label: t("navGuide") },
    { key: "about", icon: <Info size={15} />, label: t("navAbout") },
    ...(stats.total > 0 ? [{ key: "results", icon: <Award size={15} />, label: t("navResults") }] : []),
  ];

  const currentLang = LANGS.find(l => l.code === language) || LANGS[0];

  return (
    <div className="app-container">
      {/* ============ NAVBAR ============ */}
      <header className="glass-panel app-header navbar">
        <div className="brand" onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
          <div>
            <h1 className="brand-text">Awaaz</h1>
            <span className="brand-tagline">{t("tagline")}</span>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map(n => (
            <button
              key={n.key}
              className={`nav-link ${currentPage === n.key ? "active" : ""}`}
              onClick={() => setCurrentPage(n.key)}
            >
              {n.icon}<span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-controls">
          {/* Language dropdown */}
          <div className="lang-dropdown" ref={langRef}>
            <button className="lang-dd-btn" onClick={() => setLangOpen(o => !o)}>
              <Globe size={14} className="lang-flag" />
              <span>{currentLang.label}</span>
              <ChevronDown size={14} className={`chev ${langOpen ? "open" : ""}`} />
            </button>
            {langOpen && (
              <div className="lang-dd-menu glass-panel">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    className={`lang-dd-item ${l.code === language ? "active" : ""}`}
                    onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                  >
                    <span>{l.label}</span>
                    <span className="lang-en">{l.english}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {currentPage === "home" && HomePage}
      {currentPage === "guide" && GuidePage}
      {currentPage === "about" && AboutPage}
      {currentPage === "results" && ResultsPage}

      <VoiceAssistant
        userProfile={userProfile}
        onProfileChange={handleProfileChange}
        onCompleteQuestionnaire={handleCompleteQuestionnaire}
        onTranscriptReceived={handleTranscriptReceived}
        aiResponse={aiResponse}
        language={language}
        isProcessing={isProcessing}
        onReadyToShowResults={handleReadyToShowResults}
        isGeneratingReport={isGeneratingReport}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onKeySave={() => {}}
      />
    </div>
  );
}
