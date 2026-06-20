import React, { useState } from "react";
import { FileCheck, Check, AlertCircle, Bookmark, CheckSquare, Square } from "lucide-react";

export default function ConsolidatedDocs({ matchedResults, userProfile, language }) {
  // Keep track of manual checklist selections for custom documents
  const [manualChecks, setManualChecks] = useState({});

  const toggleManualCheck = (doc) => {
    setManualChecks(prev => ({
      ...prev,
      [doc]: !prev[doc]
    }));
  };

  // Translations
  const i18n = {
    title: {
      hi: "दस्तावेज़ टूलकिट (चेकलिस्ट)",
      en: "Documents Checklist Toolkit",
      ta: "ஒருங்கிணைந்த ஆவணங்கள் பட்டியல்",
      te: "సమీకృత పత్రాల జాబితా"
    },
    sub: {
      hi: "आपकी योग्य योजनाओं के लिए आवश्यक सभी दस्तावेज़ों की सूची:",
      en: "Combined list of all documents required for your qualified schemes:",
      ta: "தகுதியான திட்டங்களுக்கு தேவையான அனைத்து ஆவணங்களின் தொகுப்பு:",
      te: "మీ అర్హత గల పథకాలకు కావలసిన అన్ని పత్రాల సముదాయం:"
    },
    have: {
      hi: "दस्तावेज़ जो आपके पास हैं:",
      en: "Documents You Already Have:",
      ta: "உங்களிடம் உள்ள ஆவணங்கள்:",
      te: "మీ వద్ద ఉన్న పత్రాలు:"
    },
    need: {
      hi: "दस्तावेज़ जिनकी आवश्यकता है (लापता):",
      en: "Documents You Need to Obtain:",
      ta: "தேவைப்படும் ஆவணங்கள் (இல்லை):",
      te: "కావలసిన పత్రాలు (లేవు):"
    },
    additional: {
      hi: "योजना-विशिष्ट दस्तावेज (सत्यापित करें):",
      en: "Scheme-Specific Proofs (Verify):",
      ta: "திட்டம் சார்ந்த கூடுதல் ஆவணங்கள்:",
      te: "పథక నిర్దిష్ట అదనపు పత్రాలు:"
    },
    empty: {
      hi: "दस्तावेज़ लोड करने के लिए कृपया मिलान वाली योजनाएं देखें।",
      en: "No documents to aggregate. Qualify for schemes to see details.",
      ta: "ஆவணங்கள் எதுவும் இல்லை. திட்ட விவரங்களை பார்க்க தகுதிகளை பூர்த்தி செய்யவும்.",
      te: "చూపించడానికి పత్రాలు ఏవీ లేవు. పథకాలకు అర్హత పొంది వివరాలు చూడండి."
    }
  };

  const getTranslation = (key) => i18n[key]?.[language] || i18n[key]?.en || "";

  // 1. Filter only Eligible and Near Match schemes
  const activeMatches = matchedResults.filter(
    (m) => m.status === "eligible" || m.status === "near_match"
  );

  if (activeMatches.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
        <p>{getTranslation("empty")}</p>
      </div>
    );
  }

  // 2. Gather all unique documents needed across matching schemes
  const allDocs = new Set();
  activeMatches.forEach(m => {
    m.scheme.documents_needed.forEach(doc => allDocs.add(doc));
  });

  const docsArray = Array.from(allDocs);

  // 3. Categorize documents based on user profile
  const documentsHave = [];
  const documentsNeed = [];
  const documentsSchemeSpecific = [];

  const checkDocStatus = (doc) => {
    const d = doc.toLowerCase();
    
    // Aadhaar Card checks
    if (d.includes("aadhaar") || d.includes("आधार")) {
      return userProfile.has_aadhaar === true ? "have" : userProfile.has_aadhaar === false ? "need" : "have"; // default to have if not set
    }
    
    // Bank Account checks
    if (d.includes("bank") || d.includes("बैंक") || d.includes("khata") || d.includes("खाता")) {
      return userProfile.has_bank_account === true ? "have" : userProfile.has_bank_account === false ? "need" : "have"; 
    }
    
    // Land documents
    if (d.includes("land") || d.includes("ज़मीन") || d.includes("patta") || d.includes("khatauni") || d.includes("நிலம்") || d.includes("భూమి")) {
      return userProfile.land_ownership === true ? "have" : userProfile.land_ownership === false ? "need" : "need";
    }

    // Ration card / BPL card
    if (d.includes("ration") || d.includes("bpl") || d.includes("ராஷன்") || d.includes("రేషన్")) {
      return userProfile.bpl === true ? "have" : userProfile.bpl === false ? "need" : "need";
    }

    return "specific"; // Other scheme-specific proofs (Artisan cert, birth cert, Voter ID etc.)
  };

  docsArray.forEach(doc => {
    const status = checkDocStatus(doc);
    if (status === "have") {
      documentsHave.push(doc);
    } else if (status === "need") {
      documentsNeed.push(doc);
    } else {
      documentsSchemeSpecific.push(doc);
    }
  });

  return (
    <div className="glass-panel profile-widget" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="profile-header" style={{ marginBottom: "0.25rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.15rem" }}>
          <FileCheck size={20} className="text-gradient" />
          <span>{getTranslation("title")}</span>
        </h3>
      </div>
      
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
        {getTranslation("sub")}
      </p>

      {/* Category 1: Documents You Have */}
      {documentsHave.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--color-success)" }}>
            {getTranslation("have")}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {documentsHave.map((doc, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  fontSize: "0.85rem",
                  background: "var(--color-success-bg)",
                  border: "1px solid rgba(5, 150, 105, 0.12)",
                  color: "var(--color-success)",
                  padding: "0.45rem 0.75rem",
                  borderRadius: "var(--radius-sm)"
                }}
              >
                <Check size={14} strokeWidth={3} />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category 2: Documents You Need */}
      {documentsNeed.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--color-danger)" }}>
            {getTranslation("need")}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {documentsNeed.map((doc, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  fontSize: "0.85rem",
                  background: "var(--color-danger-bg)",
                  border: "1px solid rgba(220, 38, 38, 0.12)",
                  color: "var(--color-danger)",
                  padding: "0.45rem 0.75rem",
                  borderRadius: "var(--radius-sm)"
                }}
              >
                <AlertCircle size={14} />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category 3: Scheme Specific Manual Checkboxes */}
      {documentsSchemeSpecific.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--accent-primary)" }}>
            {getTranslation("additional")}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {documentsSchemeSpecific.map((doc, idx) => {
              const isChecked = manualChecks[doc] === true;
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleManualCheck(doc)}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    fontSize: "0.85rem",
                    background: isChecked ? "rgba(79, 70, 229, 0.04)" : "rgba(0, 0, 0, 0.02)",
                    border: isChecked ? "1px solid rgba(79, 70, 229, 0.2)" : "1px solid var(--border-glass)",
                    color: isChecked ? "var(--accent-primary)" : "var(--text-secondary)",
                    padding: "0.45rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)"
                  }}
                >
                  {isChecked ? (
                    <CheckSquare size={14} className="text-gradient" />
                  ) : (
                    <Square size={14} />
                  )}
                  <span style={{ textDecoration: isChecked ? "line-through" : "none" }}>{doc}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div 
        style={{ 
          fontSize: "0.725rem", 
          color: "var(--text-muted)", 
          textAlign: "center", 
          borderTop: "1px dashed rgba(0,0,0,0.06)",
          paddingTop: "0.75rem",
          marginTop: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25rem"
        }}
      >
        <Bookmark size={12} />
        <span>{language === "hi" ? "इन कागजातों को लेकर नजदीकी जनसेवा केंद्र पर जाएं।" : "Bring these documents when visiting the CSC center."}</span>
      </div>
    </div>
  );
}
