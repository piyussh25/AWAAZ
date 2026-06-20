import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, X, ChevronUp } from "lucide-react";

export default function VoiceAssistant({ 
  onTranscriptReceived, 
  aiResponse, 
  language, 
  isProcessing 
}) {
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Controls bottom sheet drawer open/close

  const recognitionRef = useRef(null);
  const synthesisUtteranceRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    
    // Map language parameters to speech recognition locales
    if (language === "hi") rec.lang = "hi-IN";
    else if (language === "ta") rec.lang = "ta-IN";
    else if (language === "te") rec.lang = "te-IN";
    else rec.lang = "en-IN";

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("");
      cancelSpeaking();
    };

    rec.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      onTranscriptReceived(resultText);
    };

    recognitionRef.current = rec;
  }, [language, onTranscriptReceived]);

  // Sync vocal readouts with AI responses
  useEffect(() => {
    if (aiResponse) {
      setIsOpen(true);
      speakText(aiResponse);
    }
    return () => {
      cancelSpeaking();
    };
  }, [aiResponse]);

  const toggleListening = (e) => {
    e.stopPropagation();
    if (!speechSupported) {
      alert("Speech recognition is not supported on this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsOpen(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    cancelSpeaking();
    if (!window.speechSynthesis) return;

    const cleanText = text.replace(/[*#_`\-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set synthesis language locale
    if (language === "hi") utterance.lang = "hi-IN";
    else if (language === "ta") utterance.lang = "ta-IN";
    else if (language === "te") utterance.lang = "te-IN";
    else utterance.lang = "en-IN";
    
    const voices = window.speechSynthesis.getVoices();
    const targetLang = language;
    const voice = voices.find(v => v.lang.startsWith(targetLang));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const cancelSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput.trim());
    onTranscriptReceived(textInput.trim());
    setTextInput("");
    cancelSpeaking();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    cancelSpeaking();
    setIsOpen(false);
  };

  // Translations for localized Assistant Interface
  const i18n = {
    title: {
      hi: "आवाज़ असिस्टेंट",
      en: "Awaaz AI Assistant",
      ta: "ஆதார் குரல் அசிஸ்டண்ட்",
      te: "ఆవాజ్ వాయిస్ అసిస్టెంట్"
    },
    sub: {
      hi: "नीले गोले को छूकर अपनी उम्र, काम या परिवार के बारे में बताएं",
      en: "Tap the blue orb to describe your age, job, land, or income",
      ta: "உங்கள் வயது, தொழில் அல்லது வருமானம் பற்றி கூற நீல நிற வட்டத்தை தொடவும்",
      te: "మీ వయస్సు, ఉద్యోగం లేదా ఆదాయం గురించి చెప్పడానికి నీలి రంగు సర్కిల్‌ను తాకండి"
    },
    trigger: {
      listening: { hi: "सुन रहा हूँ...", en: "Listening...", ta: "கேட்கிறது...", te: "వింటున్నాను..." },
      processing: { hi: "योजनाएं खोज रहा हूँ...", en: "Processing...", ta: "திட்டங்களை தேடுகிறது...", te: "పథకాలను వెతుకుతోంది..." },
      speaking: { hi: "असिस्टेंट बोल रहा है...", en: "Speaking...", ta: "உரையாடுகிறது...", te: "మాట్లాడుతోంది..." },
      standby: { 
        hi: "आवाज़ से योजनाएं खोजें (Tap to Speak)", 
        en: "Speak to find schemes", 
        ta: "குரல் மூலம் தேடவும் (Tap to Speak)", 
        te: "మాట్లాడి పథకాలు వెతకండి (Tap to Speak)" 
      }
    },
    status: {
      listening: { hi: "सुन रहा हूँ...", en: "Listening...", ta: "கேட்கிறது...", te: "వింటున్నాను..." },
      processing: { hi: "खोज रहा हूँ...", en: "Matching schemes...", ta: "தேடுகிறது...", te: "వెతుకుతోంది..." },
      speaking: { hi: "असिस्टेंट बोल रहा है", en: "Speaking...", ta: "உரையாடுகிறது...", te: "మాట్లాడుతోంది..." },
      ready: { hi: "तैयार", en: "Ready", ta: "தயார்", te: "సిద్ధంగా ఉంది" }
    },
    mute: { hi: "म्यूट करें", en: "Mute audio", ta: "ஒலியை நிறுத்து", te: "మ్యూట్ చేయి" },
    repeat: { hi: "फिर से सुनाएं", en: "Repeat Voice", ta: "மீண்டும் கேள்", te: "మరోసారి వినిపించు" },
    transcriptLabel: { hi: "आपकी आवाज़ (ट्रांसक्रिप्ट)", en: "Your Voice Transcription", ta: "உங்கள் குரல் (நகல்)", te: "మీ వాయిస్ (ట్రాన్స్క్రిప్ట్)" },
    placeholderText: { 
      hi: "माइक आइकॉन दबाएं या नीचे टाइप करें...", 
      en: "Microphone input transcript will show here...",
      ta: "குரல் மூலம் பேசவும் அல்லது தட்டச்சு செய்யவும்...",
      te: "మైక్రోఫోన్ ఉపయోగించండి లేదా ఇక్కడ టైప్ చేయండి..."
    },
    aiAdvice: { hi: "असिस्टेंट का सुझाव", en: "Voice Advice Summary", ta: "அசிஸ்டண்ட் பரிந்துரை", te: "అసిస్టెంట్ సలహా" },
    inputPlaceholder: { 
      hi: "यहाँ टाइप करके भी पूछ सकते हैं...", 
      en: "Or type your message...",
      ta: "இங்கே தட்டச்சு செய்து கேட்கலாம்...",
      te: "ఇక్కడ టైప్ చేసి కూడా అడగవచ్చు..."
    }
  };

  const getTranslation = (key, fallback = "") => {
    return i18n[key]?.[language] || i18n[key]?.en || fallback;
  };

  return (
    <>
      {/* 1. Compact Floating Bottom Capsule (Sticky Trigger) */}
      <div 
        className={`floating-assistant-trigger ${isListening ? "active-listening" : ""} ${isSpeaking ? "active-speaking" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="trigger-content">
          <div className="pulse-mic-icon">
            {isListening ? (
              <MicOff size={16} className="text-danger" />
            ) : isProcessing ? (
              <Loader2 size={16} className="animate-spin text-gradient" />
            ) : (
              <Mic size={16} />
            )}
          </div>
          <span className="trigger-text">
            {isListening 
              ? getTranslation("trigger", {}).listening
              : isProcessing 
                ? getTranslation("trigger", {}).processing
                : isSpeaking 
                  ? getTranslation("trigger", {}).speaking
                  : getTranslation("trigger", {}).standby}
          </span>
          <ChevronUp size={16} className="trigger-arrow" />
        </div>
      </div>

      {/* 2. Glassmorphic Bottom Sheet Drawer */}
      {isOpen && (
        <div className="assistant-overlay" onClick={handleClose}>
          <div className="assistant-sheet glass-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Header controls */}
            <div className="sheet-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="live-dot"></span>
                <span>{getTranslation("title")}</span>
              </h3>
              <button className="btn close-sheet-btn" onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            <div className="sheet-body">
              <p className="status-sub">
                {getTranslation("sub")}
              </p>

              {/* Glowing Orb */}
              <div className="orb-container">
                <div 
                  className={`orb ${isListening ? "recording" : ""} ${isSpeaking ? "speaking" : ""}`}
                  onClick={toggleListening}
                >
                  <div className="mic-icon-container">
                    {isListening ? (
                      <MicOff size={36} />
                    ) : isProcessing ? (
                      <Loader2 size={36} className="animate-spin" />
                    ) : (
                      <Mic size={36} />
                    )}
                  </div>
                </div>
                <div className="orb-pulse-ring"></div>
                <div className="orb-ring-1"></div>
                <div className="orb-ring-2"></div>
              </div>

              {/* Speech Controls */}
              <div className="audio-actions-row">
                {isListening && (
                  <span className="status-text" style={{ color: "var(--color-danger)" }}>
                    {getTranslation("status", {}).listening}
                  </span>
                )}
                {isProcessing && (
                  <span className="status-text text-gradient">
                    {getTranslation("status", {}).processing}
                  </span>
                )}
                {!isListening && !isProcessing && (
                  <span className="status-text">
                    {isSpeaking 
                      ? getTranslation("status", {}).speaking 
                      : getTranslation("status", {}).ready}
                  </span>
                )}
                
                <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                  {isSpeaking && (
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} 
                      onClick={cancelSpeaking}
                    >
                      <VolumeX size={14} /> {getTranslation("mute")}
                    </button>
                  )}
                  {!isSpeaking && aiResponse && (
                    <button 
                      className="btn" 
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} 
                      onClick={() => speakText(aiResponse)}
                    >
                      <Volume2 size={14} /> {getTranslation("repeat")}
                    </button>
                  )}
                </div>
              </div>

              {/* Live Transcript Box */}
              <div className="transcript-box">
                <div className="transcript-label">
                  {getTranslation("transcriptLabel")}
                </div>
                <div className="transcript-text">
                  {transcript ? (
                    transcript
                  ) : (
                    <span className="transcript-placeholder">
                      {getTranslation("placeholderText")}
                    </span>
                  )}
                </div>
              </div>

              {/* AI Vernacular Advice Speech Block */}
              {aiResponse && (
                <div className="ai-response-box" style={{ marginTop: "0.5rem" }}>
                  <div className="ai-response-title text-gradient">
                    <Volume2 size={14} />
                    <span>{getTranslation("aiAdvice")}</span>
                  </div>
                  <div className="ai-response-text">{aiResponse}</div>
                </div>
              )}
            </div>

            {/* Manual text input */}
            <div className="sheet-footer">
              <form onSubmit={handleTextSubmit} style={{ width: "100%", display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder={getTranslation("inputPlaceholder")}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(0, 0, 0, 0.03)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem 1rem",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem" }}>
                  <Send size={16} />
                </button>
              </form>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
