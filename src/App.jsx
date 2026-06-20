import React, { useState, useEffect, useMemo } from "react";
import { Settings as SettingsIcon, Volume2, Award, ClipboardList, HelpCircle, Layers } from "lucide-react";
import { schemes } from "./data/schemes";
import { matchSchemes } from "./utils/matchingEngine";
import { parseUserProfile, generateVernacularSummary, getEmptyProfile, initGemini } from "./utils/gemini";
import VoiceAssistant from "./components/VoiceAssistant";
import UserProfile from "./components/UserProfile";
import SchemeCard from "./components/SchemeCard";
import Settings from "./components/Settings";

export default function App() {
  const [language, setLanguage] = useState("hi"); // Default to Hindi for inclusive accessibility
  const [apiKey, setApiKey] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(getEmptyProfile());
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'eligible', 'near_match'

  // Attempt to initialize key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("awaaz_gemini_key");
    if (savedKey) {
      setApiKey(savedKey);
      initGemini(savedKey);
    }
  }, []);

  // Compute matched schemes reactively when profile updates
  const matchedSchemesList = useMemo(() => {
    return matchSchemes(userProfile, schemes);
  }, [userProfile]);

  // Recalculate filters
  const filteredSchemes = useMemo(() => {
    if (activeTab === "eligible") {
      return matchedSchemesList.filter((s) => s.status === "eligible");
    }
    if (activeTab === "near_match") {
      return matchedSchemesList.filter((s) => s.status === "near_match");
    }
    return matchedSchemesList; // 'all' - shows eligible and near matches (filters out hard block ineligible)
  }, [matchedSchemesList, activeTab]);

  // Main controller: Speech Transcription -> Profile Variable Merge -> Matching -> Speech Synthesis Text
  const handleTranscriptReceived = async (transcript) => {
    setIsProcessing(true);
    setAiResponse("");

    try {
      // 1. Send speech transcript to Gemini (or local regex parser fallback) to parse details
      const parsedFields = await parseUserProfile(transcript, language);
      console.log("Parsed profile parameters from voice:", parsedFields);

      // 2. Merge extracted fields with current profile state (incrementally builds the profile!)
      const mergedProfile = { ...userProfile };
      Object.keys(parsedFields).forEach((key) => {
        if (parsedFields[key] !== null && parsedFields[key] !== undefined) {
          mergedProfile[key] = parsedFields[key];
        }
      });
      setUserProfile(mergedProfile);

      // 3. Recalculate match lists using the updated profile
      const newMatches = matchSchemes(mergedProfile, schemes);
      
      // Filter for only eligible/near_match schemes to explain to the user
      const actionableMatches = newMatches.filter(
        (m) => m.status === "eligible" || m.status === "near_match"
      );

      // 4. Generate natural bilingual vocal advice/instructions script from Gemini
      const guidanceAudioText = await generateVernacularSummary(actionableMatches, mergedProfile, language);
      setAiResponse(guidanceAudioText);

    } catch (error) {
      console.error("Pipeline matching error:", error);
      setAiResponse(
        language === "hi"
          ? "माफ़ कीजिये, आपकी आवाज़ को समझने में थोड़ी समस्या हुई। कृपया पुनः प्रयास करें या प्रोफ़ाइल में विवरण जाँचें।"
          : "Apologies, there was an issue processing your profile. Please try speaking again or edit details in the inspector."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfileChange = (updatedProfile) => {
    setUserProfile(updatedProfile);
    // When manual changes happen, reset the AI voice response to prevent outdated audio playback
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
          {/* Language Switcher */}
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

          {/* Settings Drawer Trigger */}
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

      {/* Main Grid Panels */}
      <div className="dashboard-grid">
        
        {/* Left Hand Column: Animated Orb & Speech Transcript */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <VoiceAssistant 
            onTranscriptReceived={handleTranscriptReceived}
            aiResponse={aiResponse}
            language={language}
            isProcessing={isProcessing}
          />
          
          <UserProfile 
            profile={userProfile}
            onProfileChange={handleProfileChange}
            onReset={handleResetProfile}
            language={language}
          />
        </div>

        {/* Right Hand Column: Matched Scheme Lists */}
        <main className="results-panel">
          <div className="schemes-section-header">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem" }}>
              <Award size={20} className="text-gradient" />
              <span>
                {language === "hi" 
                  ? "अनुशंसित सरकारी योजनाएं" 
                  : "Recommended Government Schemes"}
              </span>
            </h3>

            {/* Filter Tabs */}
            <div className="schemes-tabs">
              <button 
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                {language === "hi" ? "सभी योजनाएं" : "All Matches"}
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
                {language === "hi" ? "लगभग पात्र" : "Near Matches"}
              </button>
            </div>
          </div>

          {/* Scheme Cards Layout */}
          <div className="schemes-list">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((match) => (
                // Filter out absolute ineligible cards in "all" view to avoid cluttering the interface
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
                    {language === "hi" ? "कोई मिलान नहीं मिला" : "No Matching Schemes"}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {language === "hi" 
                      ? "पात्र योजनाओं की सूची देखने के लिए कृपया माइक दबाकर बात करें या प्रोफ़ाइल विवरण भरें।" 
                      : "Speak into the assistant or complete your profile details to search for schemes."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Settings Modal Drawer */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onKeySave={handleKeySave}
      />
    </div>
  );
}
