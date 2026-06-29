import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export default function SchemeCard({ matchResult, language, userProfile }) {
  const { scheme, status, score, reasons, missing } = matchResult;
  const [showSteps, setShowSteps] = useState(false);

  // Map scheme status tags
  const statusLabels = {
    eligible: language === "hi" ? "पात्र (Eligible)" : "Eligible",
    near_match: language === "hi" ? "निकटतम पात्र (Near Match)" : "Near Match",
    ineligible: language === "hi" ? "अपात्र (Ineligible)" : "Ineligible"
  };

  // Check if a specific document is checked off based on user profile
  const isDocumentPossessed = (docName) => {
    const name = docName.toLowerCase();
    if (name.includes("aadhaar") || name.includes("आधार")) {
      return userProfile.has_aadhaar;
    }
    if (name.includes("bank") || name.includes("बैंक") || name.includes("khata") || name.includes("खाता")) {
      return userProfile.has_bank_account;
    }
    if (name.includes("land") || name.includes("ज़मीन") || name.includes("patta") || name.includes("khatauni")) {
      return userProfile.land_ownership;
    }
    if (name.includes("ration") || name.includes("bpl") || name.includes("राशन")) {
      return userProfile.bpl;
    }
    return null; // Don't know/neutral
  };

  // Get local summary text based on language
  const summaryText = scheme.language_summary[language] || scheme.language_summary.en;

  // Per-scheme readiness score (0-100)
  const readiness = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const readinessColor =
    readiness >= 90
      ? "var(--color-success)"
      : readiness >= 50
        ? "var(--color-warning)"
        : "var(--color-danger)";
  const readinessLabel =
    language === "hi"
      ? "तैयारी स्कोर"
      : language === "ta"
        ? "தயார்நிலை மதிப்பெண்"
        : language === "te"
          ? "సంసిద్ధత స్కోరు"
          : "Readiness Score";

  // Application steps
  const steps = scheme.apply_steps?.[language] || scheme.apply_steps?.en || [];

  return (
    <div className={`glass-panel scheme-card ${status}`}>

      {/* Header */}
      <div className="scheme-card-header">
        <div className="scheme-title-block">
          <span className="scheme-category">{scheme.category}</span>
          <h4 className="scheme-name">{scheme.name}</h4>
        </div>
        <span className={`scheme-badge ${status}`}>
          {statusLabels[status]}
        </span>
      </div>

      {/* Readiness Score */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.6rem 0.85rem",
          borderRadius: "var(--radius-md, 10px)",
          background: "rgba(79, 70, 229, 0.06)",
          border: "1px solid rgba(79, 70, 229, 0.15)",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.3rem",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-secondary)",
              }}
            >
              {readinessLabel}
            </span>
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: readinessColor }}>
              {readiness}<span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/100</span>
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${readiness}%`,
                height: "100%",
                background: readinessColor,
                transition: "width 400ms ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Vernacular Summary Statement */}
      {summaryText && (
        <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontStyle: "italic", lineHeight: "1.4", borderLeft: "2px solid var(--accent-primary)", paddingLeft: "0.75rem" }}>
          "{summaryText}"
        </p>
      )}

      {/* Scheme Benefits */}
      <div className="scheme-benefits">
        <strong style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
          {language === "hi" ? "योजना के लाभ:" : "Benefits:"}
        </strong>
        <p>{scheme.benefits}</p>
      </div>

      {/* Matching Details / Dynamic Explanations */}
      <div className="scheme-matching-info">
        <span className="matching-info-title">
          {language === "hi" ? "पात्रता विश्लेषण:" : "Eligibility Details:"}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {reasons.map((reason, idx) => {
            const isBlocker = reason.includes("Excluded") || reason.includes("higher than") || reason.includes("requires");
            return (
              <div key={idx} className={`reason-item ${isBlocker ? "not-match" : "match"}`}>
                <span style={{ fontSize: "0.85rem", color: isBlocker ? "var(--color-danger)" : "var(--text-secondary)" }}>
                  {reason}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Near Match Guidance */}
      {status === "near_match" && missing.length > 0 && (
        <div className="missing-warning">
          <span style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <AlertTriangle size={14} />
            {language === "hi" ? "आवेदन करने के लिए आवश्यक योग्यता:" : "Missing Requirements to Qualify:"}
          </span>
          <ul className="missing-list">
            {missing.map((item, idx) => (
              <li key={idx} style={{ listStyleType: "square", fontSize: "0.825rem" }}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Document Checklist */}
      <div className="scheme-docs">
        <span className="docs-title">
          {language === "hi" ? "दस्तावेज़ चेकलिस्ट:" : "Documents Checklist:"}
        </span>
        <div className="docs-grid">
          {scheme.documents_needed.map((doc, idx) => {
            const isOwned = isDocumentPossessed(doc);
            let indicator = null;
            let style = { background: "rgba(255, 255, 255, 0.03)", color: "var(--text-secondary)" };

            if (isOwned === true) {
              indicator = <CheckCircle2 size={13} style={{ flexShrink: 0 }} />;
              style = { background: "var(--color-success-bg)", borderColor: "rgba(16, 185, 129, 0.2)", color: "var(--color-success)" };
            } else if (isOwned === false) {
              indicator = <XCircle size={13} style={{ flexShrink: 0 }} />;
              style = { background: "var(--color-danger-bg)", borderColor: "rgba(239, 68, 68, 0.2)", color: "var(--color-danger)" };
            }

            return (
              <div key={idx} className="doc-tag" style={{ ...style, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                {indicator}{doc}
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible Step-by-Step Application Steps */}
      {steps.length > 0 && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1rem" }}>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="btn"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.825rem",
              padding: "0.45rem 0.75rem",
              background: "rgba(0,0,0,0.02)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-glass)",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FileText size={14} style={{ color: "var(--accent-primary)" }} />
              {language === "hi" ? "आवेदन करने की प्रक्रिया (Steps)" : "How to Apply (Step-by-Step)"}
            </span>
            {showSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showSteps && (
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.25rem 0.5rem" }}>
              {steps.map((step, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.75rem", position: "relative" }}>
                  {/* Timeline connecting line */}
                  {idx < steps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "9px",
                        top: "20px",
                        bottom: "-15px",
                        width: "2px",
                        background: "rgba(79, 70, 229, 0.15)"
                      }}
                    />
                  )}
                  {/* Timeline node */}
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "var(--accent-primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      flexShrink: 0,
                      boxShadow: "0 0 8px rgba(79,70,229,0.3)"
                    }}
                  >
                    {idx + 1}
                  </div>
                  {/* Step description */}
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="scheme-card-footer" style={{ marginTop: "1rem" }}>
        <a 
          href={scheme.apply_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 1rem", fontSize: "0.85rem", width: "100%", justifyContent: "center" }}
        >
          <span>{language === "hi" ? "आधिकारिक पोर्टल पर आवेदन करें" : "Apply Online"}</span>
          <ExternalLink size={14} />
        </a>
      </div>
      
    </div>
  );
}
