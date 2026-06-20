import React, { useState, useEffect } from "react";
import { X, Key, Info, Check, ShieldAlert } from "lucide-react";
import { initGemini } from "../utils/gemini";

export default function Settings({ isOpen, onClose, onKeySave }) {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("awaaz_gemini_key");
    if (saved) {
      setApiKey(saved);
      setIsSaved(true);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      localStorage.removeItem("awaaz_gemini_key");
      setApiKey("");
      setIsSaved(false);
      onKeySave(null);
      return;
    }

    const success = initGemini(apiKey.trim());
    if (success) {
      setIsSaved(true);
      setError(null);
      onKeySave(apiKey.trim());
      // Show temporary save checkmark
      setTimeout(() => onClose(), 800);
    } else {
      setError("Invalid API Key format");
      setIsSaved(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("awaaz_gemini_key");
    setApiKey("");
    setIsSaved(false);
    onKeySave(null);
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Key size={22} className="text-gradient" />
            <span>Settings</span>
          </h2>
          <button className="btn" style={{ padding: "0.25rem", borderRadius: "50%" }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
            Configure your Gemini API Key below to unlock advanced conversational parsing and vernacular explanations.
          </p>

          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key</label>
            <div style={{ position: "relative" }}>
              <input
                id="apiKey"
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsSaved(false);
                  setError(null);
                }}
              />
            </div>
            {error && (
              <span style={{ fontSize: "0.75rem", color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ShieldAlert size={12} /> {error}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button 
              className={`btn btn-primary`} 
              style={{ flex: 1, justifyContent: "center" }}
              onClick={handleSave}
            >
              {isSaved ? (
                <>
                  <Check size={16} /> Saved
                </>
              ) : "Save Configuration"}
            </button>
            {apiKey && (
              <button 
                className="btn" 
                style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }} 
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>

          <div 
            className="glass-panel" 
            style={{ 
              padding: "1rem", 
              fontSize: "0.8rem", 
              color: "var(--text-secondary)", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem",
              marginTop: "2rem",
              background: "rgba(255, 255, 255, 0.01)"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: "600", color: "var(--text-primary)" }}>
              <Info size={14} className="text-gradient" /> Hackathon Fallback Mode
            </span>
            <p style={{ lineHeight: "1.4" }}>
              If you don't have a Gemini API key active, <strong>Awaaz will automatically switch to a localized regex-keyword parser</strong>. 
            </p>
            <p style={{ lineHeight: "1.4" }}>
              This allows immediate demo testing. Speak or type expressions like:
              <br />
              <em style={{ color: "var(--text-primary)", display: "block", margin: "0.25rem 0" }}>
                "I am a 45 year old female farmer from Bihar, with no land."
              </em>
              and the app will evaluate eligibility locally!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
