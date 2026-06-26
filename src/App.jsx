import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Award, ClipboardList, ArrowLeft, CheckCircle2, AlertTriangle,
  Gauge, ChevronDown, Mic, Sparkles, Users, Heart,
  Home as HomeIcon, BookOpen, Info, FileText, ShieldCheck, MessageCircle
} from "lucide-react";
import { schemes } from "./data/schemes";
import { matchSchemes } from "./utils/matchingEngine";
import { parseUserProfile, generateVernacularSummary, getEmptyProfile } from "./utils/gemini";
import VoiceAssistant from "./components/VoiceAssistant";
import UserProfile from "./components/UserProfile";
import SchemeCard from "./components/SchemeCard";
import ConsolidatedDocs from "./components/ConsolidatedDocs";

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
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState("home"); // home | results | guide | about
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

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
  const handleProfileChange = (updatedProfile) => { setUserProfile(updatedProfile); setAiResponse(""); };
  const handleResetProfile = () => {
    setUserProfile(getEmptyProfile());
    setAiResponse(""); setActiveTab("all"); setCurrentPage("home");
  };

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
          <span className="hero-kicker">
            <Sparkles size={14} /> {t("heroKicker")}
          </span>
          <h1 className="hero-title">{t("heroTitle")}</h1>
          <p className="hero-sub">{t("heroSub")}</p>
          <div className="hero-cta-row">
            <button className="btn btn-primary btn-lg" onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}>
              <Mic size={18} /> {t("heroCta")}
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => setCurrentPage("guide")}>
              <BookOpen size={18} /> {t("heroCta2")}
            </button>
          </div>

          {stats.total > 0 && (
            <div className="hero-readout glass-panel" onClick={() => setCurrentPage("results")}>
              <Award size={18} />
              <span>{stats.eligible} {t("eligibleCount")} • {stats.nearMatch} {t("nearMatchCount")}</span>
              <span className="hero-readout-cta">{t("viewResults")} →</span>
            </div>
          )}
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card glass-panel">
          <div className="feature-icon" style={{ background: "rgba(79,70,229,0.12)", color: "var(--accent-primary)" }}>
            <MessageCircle size={22} />
          </div>
          <h3>{t("feat1Title")}</h3>
          <p>{t("feat1Body")}</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon" style={{ background: "rgba(5,150,105,0.12)", color: "var(--color-success)" }}>
            <Gauge size={22} />
          </div>
          <h3>{t("feat2Title")}</h3>
          <p>{t("feat2Body")}</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon" style={{ background: "rgba(217,119,6,0.12)", color: "var(--color-warning)" }}>
            <FileText size={22} />
          </div>
          <h3>{t("feat3Title")}</h3>
          <p>{t("feat3Body")}</p>
        </div>
      </section>

      <section className="audience-strip glass-panel">
        <div className="audience-icon"><Users size={26} /></div>
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
        <h3><Sparkles size={18} /> {t("tipsTitle")}</h3>
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
              <span className="lang-flag">🌐</span>
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
        onTranscriptReceived={handleTranscriptReceived}
        aiResponse={aiResponse}
        language={language}
        isProcessing={isProcessing}
        onReadyToShowResults={handleReadyToShowResults}
      />
    </div>
  );
}
