import React, { useState, useEffect, useMemo } from "react";
import { Settings as SettingsIcon, Volume2, Award, ClipboardList, User, Layers } from "lucide-react";
import { schemes } from "./data/schemes";
import { matchSchemes } from "./utils/matchingEngine";
import { parseUserProfile, generateVernacularSummary, getEmptyProfile, initGemini } from "./utils/gemini";
import VoiceAssistant from "./components/VoiceAssistant";
import UserProfile from "./components/UserProfile";
import SchemeCard from "./components/SchemeCard";
import Settings from "./components/Settings";

export default function App() {
  const [language, setLanguage] = useState("hi"); // Default to Hindi
  const [apiKey, setApiKey] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(getEmptyProfile());
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'eligible', 'near_match'
  const [mobileView, setMobileView] = useState("schemes"); // 'schemes' or 'profile' for mobile views

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
      // 1. Parse details
      const parsedFields = await parseUserProfile(transcript, language);
      console.log("Parsed profile parameters:", parsedFields);

      // 2. Merge details
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

      // 4. Generate vernacular summaries
      const guidanceAudioText = await generateVernacularSummary(actionableMatches, mergedProfile, language);
      setAiResponse(guidanceAudioText);

      // If user speaks, jump them to the schemes tab automatically so they see results
      setMobileView("schemes");

    } catch (error) {
      console.error("Transcription pipeline error:", error);
      setAiResponse(
        language === "hi"
          ? "माफ़ कीजिये, जानकारी समझने में समस्या हुई। कृपया पुनः प्रयास करें।"
          : "Apologies, there was an issue processing your profile. Please try speaking again."
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
  };

  const handleKeySave = (newKey) => {
    setApiKey(newKey || "");
  };

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
            <span className="brand-tagline">{language === "hi" ? "योजना जागरूकता" : "Scheme Accessibility"}</span>
          </div>
        </div>

        <div className="header-controls">
          {/* Language selector */}
          <div className="lang-selector">
            <button 
              className={`lang-btn ${language === "hi" ? "active" : ""}`}
              onClick={() => {
                setLanguage("hi");
                setAiResponse("");
              }}
            >
              हिन्दी
            </button>
            <button 
              className={`lang-btn ${language === "en" ? "active" : ""}`}
              onClick={() => {
                setLanguage("en");
                setAiResponse("");
              }}
            >
              English
            </button>
          </div>

          {/* Settings Trigger */}
          <button 
            className="btn" 
            onClick={() => setIsSettingsOpen(true)}
            style={{ position: "relative" }}
          >
            <SettingsIcon size={18} />
            <span>{language === "hi" ? "सेटिंग्स" : "Settings"}</span>
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

      {/* Mobile-Only Top Nav Tabs */}
      <div className="mobile-view-tabs">
        <button 
          className={`mobile-tab-btn ${mobileView === "schemes" ? "active" : ""}`}
          onClick={() => setMobileView("schemes")}
        >
          <Award size={16} />
          <span>{language === "hi" ? "योजनाएं" : "Schemes"} ({filteredSchemes.length})</span>
        </button>
        <button 
          className={`mobile-tab-btn ${mobileView === "profile" ? "active" : ""}`}
          onClick={() => setMobileView("profile")}
        >
          <User size={16} />
          <span>{language === "hi" ? "प्रोफ़ाइल" : "Profile Details"}</span>
        </button>
      </div>

      {/* Main Grid Panels */}
      <div className="dashboard-grid">
        
        {/* Left Column (Profile Inspector) */}
        <div className={`left-column-container ${mobileView === "profile" ? "active-mobile" : "inactive-mobile"}`}>
          <UserProfile 
            profile={userProfile}
            onProfileChange={handleProfileChange}
            onReset={handleResetProfile}
            language={language}
          />
        </div>

        {/* Right Column (Schemes Listing) */}
        <main className={`right-column-container ${mobileView === "schemes" ? "active-mobile" : "inactive-mobile"}`}>
          <div className="schemes-section-header">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem" }}>
              <Award size={20} className="text-gradient" />
              <span>
                {language === "hi" 
                  ? "अनुशंसित सरकारी योजनाएं" 
                  : "Recommended Government Schemes"}
              </span>
            </h3>

            {/* Sub Filter tabs */}
            <div className="schemes-tabs">
              <button 
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                {language === "hi" ? "सभी" : "All"}
              </button>
              <button 
                className={`tab-btn ${activeTab === "eligible" ? "active" : ""}`}
                onClick={() => setActiveTab("eligible")}
              >
                {language === "hi" ? "पात्र" : "Eligible"}
              </button>
              <button 
                className={`tab-btn ${activeTab === "near_match" ? "active" : ""}`}
                onClick={() => setActiveTab("near_match")}
              >
                {language === "hi" ? "निकट" : "Near"}
              </button>
            </div>
          </div>

          {/* Card list */}
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
                  <p style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                    {language === "hi" ? "कोई योजना नहीं मिली" : "No Matching Schemes"}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {language === "hi" 
                      ? "नीचे माइक दबाकर बात करें या प्रोफ़ाइल विवरण भरें।" 
                      : "Tap the microphone below to speak, or complete your profile details."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Bottom Drawer Voice Assistant */}
      <VoiceAssistant 
        onTranscriptReceived={handleTranscriptReceived}
        aiResponse={aiResponse}
        language={language}
        isProcessing={isProcessing}
      />

      {/* Settings Modal Drawer */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onKeySave={handleKeySave}
      />
    </div>
  );
}
