import React, { useState, useEffect, useMemo } from "react";
import { Settings as SettingsIcon, Volume2, Award, ClipboardList, ArrowLeft, CheckCircle2, AlertTriangle, Languages } from "lucide-react";
import { schemes } from "./data/schemes";
import { matchSchemes } from "./utils/matchingEngine";
import { parseUserProfile, generateVernacularSummary, getEmptyProfile, initGemini } from "./utils/gemini";
import VoiceAssistant from "./components/VoiceAssistant";
import UserProfile from "./components/UserProfile";
import SchemeCard from "./components/SchemeCard";
import ConsolidatedDocs from "./components/ConsolidatedDocs";
import Settings from "./components/Settings";

export default function App() {
  const [language, setLanguage] = useState("hi"); // Default to Hindi
  const [apiKey, setApiKey] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(getEmptyProfile());
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'eligible', 'near_match'
  const [currentPage, setCurrentPage] = useState("home"); // 'home' or 'results'

  // Initialize key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("awaaz_gemini_key");
    if (savedKey) {
      setApiKey(savedKey);
      initGemini(savedKey);
    }
  }, []);

  // Compute matched schemes reactively
  const matchedSchemesList = useMemo(() => {
    return matchSchemes(userProfile, schemes);
  }, [userProfile]);

  // Compute count metrics for stats cards
  const stats = useMemo(() => {
    const eligibleCount = matchedSchemesList.filter(s => s.status === "eligible").length;
    const nearMatchCount = matchedSchemesList.filter(s => s.status === "near_match").length;
    return {
      eligible: eligibleCount,
      nearMatch: nearMatchCount,
      total: eligibleCount + nearMatchCount
    };
  }, [matchedSchemesList]);

  // Filter schemes based on activeTab
  const filteredSchemes = useMemo(() => {
    if (activeTab === "eligible") {
      return matchedSchemesList.filter((s) => s.status === "eligible");
    }
    if (activeTab === "near_match") {
      return matchedSchemesList.filter((s) => s.status === "near_match");
    }
    return matchedSchemesList; 
  }, [matchedSchemesList, activeTab]);

  // Main Pipeline controller
  const handleTranscriptReceived = async (transcript) => {
    setIsProcessing(true);
    setAiResponse("");

    try {
      // 1. Parse transcript
      const parsedFields = await parseUserProfile(transcript, language);
      console.log("Parsed profile fields:", parsedFields);

      // 2. Merge profile
      const mergedProfile = { ...userProfile };
      Object.keys(parsedFields).forEach((key) => {
        if (parsedFields[key] !== null && parsedFields[key] !== undefined) {
          mergedProfile[key] = parsedFields[key];
        }
      });
      setUserProfile(mergedProfile);

      // 3. Recalculate matches
      const newMatches = matchSchemes(mergedProfile, schemes);
      const actionableMatches = newMatches.filter(
        (m) => m.status === "eligible" || m.status === "near_match"
      );

      // 4. Generate summaries
      const guidanceAudioText = await generateVernacularSummary(actionableMatches, mergedProfile, language);
      setAiResponse(guidanceAudioText);

      // Smooth auto-navigation to results page after audio loads
      setCurrentPage("results");

    } catch (error) {
      console.error("Redirection pipeline error:", error);
      setAiResponse(
        language === "hi"
          ? "माफ़ कीजिये, आपकी आवाज़ को समझने में त्रुटि हुई।"
          : "Apologies, there was an issue processing your voice data."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfileChange = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setAiResponse("");
  };

  const handleResetProfile = () => {
    setUserProfile(getEmptyProfile());
    setAiResponse("");
    setActiveTab("all");
    setCurrentPage("home");
  };

  const handleKeySave = (newKey) => {
    setApiKey(newKey || "");
  };

  // UI Localized Strings
  const i18n = {
    tagline: { hi: "யோஜனா ஜாகரூக்தா", en: "Scheme Accessibility", ta: "திட்ட விழிப்புணர்வு", te: "పథకాల అవగాహన" },
    settings: { hi: "सेटिंग्स", en: "Settings", ta: "அமைப்புகள்", te: "సెట్టింగులు" },
    viewResults: { hi: "परिणाम देखें", en: "View Schemes Report", ta: "முடிவுகளைப் பார்க்கவும்", te: "ఫలితాలు చూడండి" },
    eligibleCount: { hi: "पात्र योजनाएं", en: "Eligible Schemes", ta: "தகுதியான திட்டங்கள்", te: "అర్హత గల పథకాలు" },
    nearMatchCount: { hi: "लगभग पात्र", en: "Near Matches", ta: "கிட்டத்தட்ட தகுதியானவை", te: "దాదాపు అర్హత ఉన్నవి" },
    backBtn: { hi: "वापस जाएँ (असिस्टेंट)", en: "Back to Assistant", ta: "பின்செல்லவும்", te: "తిరిగి వెళ్ళండి" },
    reportTitle: { hi: "आपके लिए अनुशंसित सरकारी योजनाएं", en: "Personalized Scheme Report", ta: "பரிந்துரைக்கப்பட்ட திட்டங்கள்", te: "వ్యక్తిగతీకరించిన పథకాల నివేదిక" },
    noMatches: { hi: "कोई पात्र योजना नहीं मिली", en: "No Matching Schemes Found", ta: "பொருத்தமான திட்டங்கள் எதுவும் இல்லை", te: "ఎటువంటి పథకాలు లభించలేదు" },
    resultsBannerTitle: {
      hi: "योजना मिलान रिपोर्ट तैयार है!",
      en: "Scheme Report is Ready!",
      ta: "திட்ட அறிக்கை தயாராக உள்ளது!",
      te: "పథకాల నివేదిక సిద్ధంగా ఉంది!"
    },
    resultsBannerDesc: {
      hi: `आपके विवरण के अनुसार ${stats.eligible} पात्र योजनाएं और ${stats.nearMatch} निकटतम योजनाएं पाई गई हैं।`,
      en: `Based on your profile, we found ${stats.eligible} eligible schemes and ${stats.nearMatch} potential near-matches.`,
      ta: `உங்கள் விவரங்களின்படி ${stats.eligible} தகுதியான திட்டங்கள் மற்றும் ${stats.nearMatch} கிட்டத்தட்ட தகுதியான திட்டங்கள் உள்ளன.`,
      te: `మీ ప్రొఫైల్ ప్రకారం ${stats.eligible} అర్హత గల పథకాలు మరియు ${stats.nearMatch} దాదాపు అర్హత ఉన్న పథకాలు లభించాయి.`
    }
  };

  const getTxt = (key) => i18n[key]?.[language] || i18n[key]?.en || "";

  return (
    <div className="app-container">
      
      {/* Header Bar */}
      <header className="glass-panel app-header">
        <div className="brand">
          <div className="brand-logo-container">
            <Volume2 size={24} style={{ color: "#fff" }} />
          </div>
          <div>
            <h1 className="brand-text">Awaaz</h1>
            <span className="brand-tagline">{getTxt("tagline")}</span>
          </div>
        </div>

        <div className="header-controls">
          {/* 4-Language Switcher */}
          <div className="lang-selector">
            <button className={`lang-btn ${language === "hi" ? "active" : ""}`} onClick={() => setLanguage("hi")}>हिन्दी</button>
            <button className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => setLanguage("en")}>English</button>
            <button className={`lang-btn ${language === "ta" ? "active" : ""}`} onClick={() => setLanguage("ta")}>தமிழ்</button>
            <button className={`lang-btn ${language === "te" ? "active" : ""}`} onClick={() => setLanguage("te")}>తెలుగు</button>
          </div>

          {/* Settings Trigger */}
          <button className="btn" onClick={() => setIsSettingsOpen(true)} style={{ position: "relative" }}>
            <SettingsIcon size={18} />
            <span className="hide-on-mobile">{getTxt("settings")}</span>
            {!apiKey && (
              <span 
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "var(--color-warning)",
                  border: "2px solid var(--bg-main)"
                }}
              />
            )}
          </button>
        </div>
      </header>

      {/* ==================== PAGE 1: HOME VIEW ==================== */}
      {currentPage === "home" && (
        <div className="page-transition-wrapper">
          
          {/* Quick Notification Banner if schemes are matched */}
          {stats.total > 0 && (
            <div 
              className="glass-panel results-banner-alert" 
              onClick={() => setCurrentPage("results")}
              style={{
                cursor: "pointer",
                padding: "1.25rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(79, 70, 229, 0.05)",
                borderColor: "rgba(79, 70, 229, 0.25)"
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{ background: "var(--accent-primary)", padding: "0.5rem", borderRadius: "50%", color: "#fff" }}>
                  <Award size={20} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700" }}>{getTxt("resultsBannerTitle")}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    {getTxt("resultsBannerDesc")}
                  </p>
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
                {getTxt("viewResults")}
              </button>
            </div>
          )}

          <div className="dashboard-grid single-col-mobile">
            {/* Left side: Guide instructions card */}
            <div className="glass-panel profile-widget" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="profile-header">
                <h3 className="text-gradient" style={{ fontSize: "1.25rem" }}>
                  {language === "hi" ? "आवाज़ का उपयोग कैसे करें" : 
                   language === "ta" ? "குரல் அசிஸ்டண்டை எவ்வாறு பயன்படுத்துவது" :
                   language === "te" ? "వాయిస్ అసిస్టెంట్ ఎలా ఉపయోగించాలి" :
                   "How to use Awaaz Assistant"}
                </h3>
              </div>
              
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                <li>
                  {language === "hi" ? "नीचे दिए गए नीले रिकॉर्डिंग कैप्सूल पर टैप करें।" : 
                   language === "ta" ? "கீழே உள்ள நீல நிற ரெக்கார்டிங் பட்டனை கிளிக் செய்யவும்." :
                   language === "te" ? "క్రింద ఉన్న నీలి రంగు రికార్డింగ్ బటన్‌ను క్లిక్ చేయండి." :
                   "Tap the blue recording capsule sticky at the bottom."}
                </li>
                <li>
                  {language === "hi" ? "अपनी उम्र, काम, मासिक आय और ज़मीन के बारे में बताएं। (जैसे: 'मैं दर्जी हूँ, 35 साल की उम्र है, ज़मीन नहीं है')" : 
                   language === "ta" ? "உங்கள் வயது, வேலை, வருமானம் மற்றும் நிலம் பற்றி கூறவும். (எ.கா. 'நான் தையல்காரர், வயது 35, சொந்த நிலம் இல்லை')" :
                   language === "te" ? "మీ వయస్సు, పని, ఆదాయం మరియు భూమి గురించి చెప్పండి. (ఉదా: 'నాకు సొంత భూమి లేదు, దర్జీ పని చేస్తాను, వయస్సు 35')" :
                   "Describe your age, job, income, or land. (e.g. 'I am a 35 year old tailor with no land')"}
                </li>
                <li>
                  {language === "hi" ? "असिस्टेंट आपकी जानकारी को समझेगा और आपको सीधे परिणाम पेज पर ले जाएगा!" : 
                   language === "ta" ? "அசிஸ்டண்ட் உங்கள் குரலை புரிந்து கொண்டு தானாகவே திட்டங்கள் பக்கத்திற்கு அழைத்துச் செல்லும்!" :
                   language === "te" ? "వాయిస్ అసిస్టెంట్ మీ మాటలను విశ్లేషించి నేరుగా పథకాల నివేదిక పేజీకి తీసుకువెళుతుంది!" :
                   "The AI will parse your profile parameters and automatically redirect you to the Results Page!"}
                </li>
              </ul>

              {stats.total > 0 && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setCurrentPage("results")} 
                  style={{ width: "100%", marginTop: "1rem", padding: "0.75rem" }}
                >
                  {getTxt("viewResults")} ({stats.total})
                </button>
              )}
            </div>

            {/* Right side: Profile Inspector Customizer */}
            <UserProfile 
              profile={userProfile}
              onProfileChange={handleProfileChange}
              onReset={handleResetProfile}
              language={language}
            />
          </div>
        </div>
      )}

      {/* ==================== PAGE 2: FULL RESULTS REPORT VIEW ==================== */}
      {currentPage === "results" && (
        <div className="page-transition-wrapper results-page-layout">
          
          {/* Header Action Row */}
          <div className="results-header-row">
            <button className="btn back-btn" onClick={() => setCurrentPage("home")}>
              <ArrowLeft size={16} />
              <span>{getTxt("backBtn")}</span>
            </button>
            <h2 className="text-gradient report-title-text">{getTxt("reportTitle")}</h2>
          </div>

          {/* Quick Stats Cards Widget */}
          <div className="results-stats-row">
            <div className="glass-panel stat-card success">
              <CheckCircle2 className="stat-icon" size={24} />
              <div className="stat-info">
                <span className="stat-label">{getTxt("eligibleCount")}</span>
                <span className="stat-number">{stats.eligible}</span>
              </div>
            </div>
            <div className="glass-panel stat-card warning">
              <AlertTriangle className="stat-icon" size={24} />
              <div className="stat-info">
                <span className="stat-label">{getTxt("nearMatchCount")}</span>
                <span className="stat-number">{stats.nearMatch}</span>
              </div>
            </div>
          </div>

          {/* Core Content Grid: Schemes list vs Documents aggregate side by side */}
          <div className="dashboard-grid results-page-grid">
            
            {/* Left Column: Matches list */}
            <div className="right-column-container">
              <div className="schemes-section-header" style={{ marginBottom: "1rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.15rem" }}>
                  <Award size={20} className="text-gradient" />
                  <span>{language === "hi" ? "पात्रता रिपोर्ट" : "Matches Summary"}</span>
                </h3>
                
                {/* Tabs */}
                <div className="schemes-tabs">
                  <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                    {language === "hi" ? "सभी" : language === "ta" ? "அனைத்தும்" : language === "te" ? "అన్నీ" : "All"}
                  </button>
                  <button className={`tab-btn ${activeTab === "eligible" ? "active" : ""}`} onClick={() => setActiveTab("eligible")}>
                    {language === "hi" ? "पात्र" : language === "ta" ? "தகுதியானவை" : language === "te" ? "అర్హులు" : "Eligible"}
                  </button>
                  <button className={`tab-btn ${activeTab === "near_match" ? "active" : ""}`} onClick={() => setActiveTab("near_match")}>
                    {language === "hi" ? "निकटतम" : language === "ta" ? "கிட்டத்தட்ட" : language === "te" ? "దాదాపు" : "Near"}
                  </button>
                </div>
              </div>

              <div className="schemes-list">
                {filteredSchemes.length > 0 ? (
                  filteredSchemes.map((match) => (
                    (match.status !== "ineligible" || activeTab === "all") && (
                      <SchemeCard 
                        key={match.scheme.scheme_id} 
                        matchResult={match}
                        language={language}
                        userProfile={userProfile}
                      />
                    )
                  ))
                ) : (
                  <div className="glass-panel empty-schemes">
                    <ClipboardList className="empty-icon" />
                    <div>
                      <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>{getTxt("noMatches")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Aggregated Documents Toolkit */}
            <div className="left-column-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <ConsolidatedDocs 
                matchedResults={matchedSchemesList}
                userProfile={userProfile}
                language={language}
              />
              
              {/* Collapsible Mini profile overrides drawer in results page */}
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="live-dot" style={{ background: "var(--accent-primary)" }}></span>
                  <span>{language === "hi" ? "विवरण बदलें (त्वरित सुधार)" : "Tweak Profile Details"}</span>
                </h4>
                <UserProfile 
                  profile={userProfile}
                  onProfileChange={handleProfileChange}
                  onReset={handleResetProfile}
                  language={language}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Bottom Drawer Voice Assistant capsule */}
      <VoiceAssistant 
        onTranscriptReceived={handleTranscriptReceived}
        aiResponse={aiResponse}
        language={language}
        isProcessing={isProcessing}
      />

      {/* Settings Drawer */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onKeySave={handleKeySave}
      />
    </div>
  );
}
