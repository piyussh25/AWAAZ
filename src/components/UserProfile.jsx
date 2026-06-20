import React from "react";
import { User, RefreshCw, AlertCircle } from "lucide-react";

export default function UserProfile({ profile, onProfileChange, onReset, language }) {
  const handleChange = (field, value) => {
    // Convert string representations of booleans back to booleans/null
    let processedValue = value;
    if (value === "true") processedValue = true;
    if (value === "false") processedValue = false;
    if (value === "null" || value === "") processedValue = null;
    
    // Parse age and income as numbers if applicable
    if ((field === "age" || field === "income_bracket") && value !== "") {
      const num = parseInt(value, 10);
      processedValue = isNaN(num) ? null : num;
    }

    onProfileChange({
      ...profile,
      [field]: processedValue
    });
  };

  const occupationsList = [
    { value: "", label: language === "hi" ? "अनिर्धारित" : "Not Set" },
    { value: "farmer", label: language === "hi" ? "किसान (Farmer)" : "Farmer" },
    { value: "laborer", label: language === "hi" ? "मजदूर (Laborer)" : "Laborer" },
    { value: "construction_worker", label: language === "hi" ? "निर्माण श्रमिक (Construction)" : "Construction Worker" },
    { value: "domestic_worker", label: language === "hi" ? "घरेलू कामगार (Domestic)" : "Domestic Worker" },
    { value: "vendor", label: language === "hi" ? "फेरीवाला (Vendor)" : "Street Vendor" },
    { value: "artisan", label: language === "hi" ? "कारीगर (Artisan)" : "Artisan/Craftsman" },
    { value: "rickshaw_puller", label: language === "hi" ? "रिक्शा चालक" : "Rickshaw Puller" },
    { value: "tailor", label: language === "hi" ? "दर्जी (Tailor)" : "Tailor" },
    { value: "barber", label: language === "hi" ? "नाई (Barber)" : "Barber" },
    { value: "washerman", label: language === "hi" ? "धोबी (Washerman)" : "Washerman" },
    { value: "self_employed", label: language === "hi" ? "स्वरोजगार" : "Self Employed" },
    { value: "unemployed", label: language === "hi" ? "बेरोजगार" : "Unemployed" },
    { value: "student", label: language === "hi" ? "छात्र" : "Student" }
  ];

  return (
    <div className="glass-panel profile-widget">
      <div className="profile-header">
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.15rem" }}>
          <User size={18} className="text-gradient" />
          <span>{language === "hi" ? "आपका विवरण (प्रोफ़ाइल)" : "Your Profile Inspector"}</span>
        </h3>
        <button 
          className="btn" 
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }} 
          onClick={onReset}
        >
          <RefreshCw size={12} />
          {language === "hi" ? "साफ़ करें" : "Reset"}
        </button>
      </div>

      <div className="profile-grid">
        {/* Age Pill */}
        <div className={`profile-pill ${profile.age !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "उम्र" : "Age"}</span>
          <input
            type="number"
            min="0"
            max="120"
            value={profile.age ?? ""}
            placeholder="--"
            onChange={(e) => handleChange("age", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none"
            }}
          />
        </div>

        {/* Gender Pill */}
        <div className={`profile-pill ${profile.gender !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "लिंग" : "Gender"}</span>
          <select
            value={profile.gender ?? "null"}
            onChange={(e) => handleChange("gender", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="null" style={{background: "#0f121d"}}>--</option>
            <option value="male" style={{background: "#0f121d"}}>{language === "hi" ? "पुरुष" : "Male"}</option>
            <option value="female" style={{background: "#0f121d"}}>{language === "hi" ? "महिला" : "Female"}</option>
            <option value="other" style={{background: "#0f121d"}}>{language === "hi" ? "अन्य" : "Other"}</option>
          </select>
        </div>

        {/* Occupation Pill */}
        <div className={`profile-pill ${profile.occupation !== null ? "active" : ""}`} style={{ gridColumn: "span 2" }}>
          <span className="profile-pill-label">{language === "hi" ? "व्यवसाय" : "Occupation"}</span>
          <select
            value={profile.occupation ?? ""}
            onChange={(e) => handleChange("occupation", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.85rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            {occupationsList.map((occ) => (
              <option key={occ.value} value={occ.value} style={{background: "#0f121d"}}>
                {occ.label}
              </option>
            ))}
          </select>
        </div>

        {/* Land Ownership Pill */}
        <div className={`profile-pill ${profile.land_ownership !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "खेती की ज़मीन" : "Agricultural Land"}</span>
          <select
            value={profile.land_ownership === null ? "null" : profile.land_ownership ? "true" : "false"}
            onChange={(e) => handleChange("land_ownership", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="null" style={{background: "#0f121d"}}>--</option>
            <option value="true" style={{background: "#0f121d"}}>{language === "hi" ? "हाँ (Owns)" : "Yes"}</option>
            <option value="false" style={{background: "#0f121d"}}>{language === "hi" ? "नहीं (Landless)" : "No"}</option>
          </select>
        </div>

        {/* Income Pill */}
        <div className={`profile-pill ${profile.income_bracket !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "मासिक आय (₹)" : "Monthly Income (₹)"}</span>
          <input
            type="number"
            min="0"
            value={profile.income_bracket ?? ""}
            placeholder="--"
            onChange={(e) => handleChange("income_bracket", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none"
            }}
          />
        </div>

        {/* BPL Card Pill */}
        <div className={`profile-pill ${profile.bpl !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "बीपीएल कार्ड" : "BPL / Ration Card"}</span>
          <select
            value={profile.bpl === null ? "null" : profile.bpl ? "true" : "false"}
            onChange={(e) => handleChange("bpl", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="null" style={{background: "#0f121d"}}>--</option>
            <option value="true" style={{background: "#0f121d"}}>{language === "hi" ? "हाँ (BPL)" : "Yes"}</option>
            <option value="false" style={{background: "#0f121d"}}>{language === "hi" ? "नहीं (APL)" : "No"}</option>
          </select>
        </div>

        {/* Marital Status Pill */}
        <div className={`profile-pill ${profile.marital_status !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "वैवाहिक स्थिति" : "Marital Status"}</span>
          <select
            value={profile.marital_status ?? "null"}
            onChange={(e) => handleChange("marital_status", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="null" style={{background: "#0f121d"}}>--</option>
            <option value="single" style={{background: "#0f121d"}}>{language === "hi" ? "अविवाहित" : "Single"}</option>
            <option value="married" style={{background: "#0f121d"}}>{language === "hi" ? "विवाहित" : "Married"}</option>
            <option value="widow" style={{background: "#0f121d"}}>{language === "hi" ? "विधवा" : "Widow"}</option>
          </select>
        </div>

        {/* Aadhaar Card Pill */}
        <div className={`profile-pill ${profile.has_aadhaar !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "आधार कार्ड" : "Aadhaar Card"}</span>
          <select
            value={profile.has_aadhaar === null ? "null" : profile.has_aadhaar ? "true" : "false"}
            onChange={(e) => handleChange("has_aadhaar", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="null" style={{background: "#0f121d"}}>--</option>
            <option value="true" style={{background: "#0f121d"}}>{language === "hi" ? "हाँ (Have)" : "Yes"}</option>
            <option value="false" style={{background: "#0f121d"}}>{language === "hi" ? "नहीं" : "No"}</option>
          </select>
        </div>

        {/* Bank Account Pill */}
        <div className={`profile-pill ${profile.has_bank_account !== null ? "active" : ""}`}>
          <span className="profile-pill-label">{language === "hi" ? "बैंक खाता" : "Bank Account"}</span>
          <select
            value={profile.has_bank_account === null ? "null" : profile.has_bank_account ? "true" : "false"}
            onChange={(e) => handleChange("has_bank_account", e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              width: "100%",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="null" style={{background: "#0f121d"}}>--</option>
            <option value="true" style={{background: "#0f121d"}}>{language === "hi" ? "हाँ (Have)" : "Yes"}</option>
            <option value="false" style={{background: "#0f121d"}}>{language === "hi" ? "नहीं" : "No"}</option>
          </select>
        </div>
      </div>
      
      {/* Information Tip */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.75rem", alignItems: "flex-start" }}>
        <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px", color: "var(--accent-primary)" }} />
        <span>
          {language === "hi" 
            ? "असिस्टेंट ने आपके भाषण से इन विवरणों को निकाला है। आप मिलान परिणामों को अद्यतन करने के लिए इन्हें सीधे बदल सकते हैं।" 
            : "The AI extracted these variables from your speech. Adjust them manually to re-run the eligibility calculations."}
        </span>
      </div>
    </div>
  );
}
