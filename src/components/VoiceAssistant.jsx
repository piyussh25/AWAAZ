import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, X, ChevronUp, CheckCircle2, AlertTriangle } from "lucide-react";

/**
 * VoiceAssistant
 *
 * Fixes / behavior:
 *  - Robust SpeechRecognition init (single instance, no rebuild on every render).
 *  - Mic permission errors surface a clear message instead of silently failing.
 *  - After the user finishes speaking, we show a "wrap-up" progress bar (~2.5s),
 *    then auto-close the drawer and ask App to open the dashboard via
 *    onReadyToShowResults. The AI response is NOT shown inside the assistant
 *    box and is NOT auto-spoken — the dashboard is the destination.
 */
export default function VoiceAssistant({
  onTranscriptReceived,
  aiResponse,
  language,
  isProcessing,
  onReadyToShowResults,
}) {
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [micError, setMicError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Wrap-up animation state — runs after the user finishes speaking
  // (or submits text), before the dashboard opens.
  const [wrapUpActive, setWrapUpActive] = useState(false);
  const [wrapUpProgress, setWrapUpProgress] = useState(0);

  const recognitionRef = useRef(null);
  const synthesisUtteranceRef = useRef(null);
  const onTranscriptRef = useRef(onTranscriptReceived);
  const onReadyRef = useRef(onReadyToShowResults);
  const languageRef = useRef(language);
  const wrapUpTimersRef = useRef([]);
  const hasFiredReadyRef = useRef(false);
  const accumulatedFinalRef = useRef("");

  // Keep latest callbacks/language in refs so we don't have to rebuild
  // the SpeechRecognition instance on every render.
  useEffect(() => { onTranscriptRef.current = onTranscriptReceived; }, [onTranscriptReceived]);
  useEffect(() => { onReadyRef.current = onReadyToShowResults; }, [onReadyToShowResults]);
  useEffect(() => {
    languageRef.current = language;
    if (recognitionRef.current) {
      recognitionRef.current.lang = localeFor(language);
    }
  }, [language]);

  // Sync vocal readouts with AI responses
  useEffect(() => {
    if (aiResponse) {
      speakText(aiResponse);
    }
    return () => {
      cancelSpeaking();
    };
  }, [aiResponse]);

  function localeFor(lang) {
    if (lang === "hi") return "hi-IN";
    if (lang === "ta") return "ta-IN";
    if (lang === "te") return "te-IN";
    return "en-IN";
  }

  // ---- Speech recognition: init ONCE ---------------------------------------
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = localeFor(languageRef.current);

    rec.onstart = () => {
      setIsListening(true);
      setMicError("");
      setTranscript("");
      accumulatedFinalRef.current = "";
      cancelSpeaking();
    };

    rec.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      const err = event.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        setMicError(
          "Microphone access is blocked. Please allow microphone permission in your browser settings and try again."
        );
      } else if (err === "no-speech") {
        setMicError("I couldn't hear anything. Please tap the mic and try again.");
      } else if (err === "audio-capture") {
        setMicError("No microphone was found. Please check your device.");
      } else if (err === "network") {
        setMicError("Network issue with speech recognition. Please check your internet and retry.");
      } else {
        setMicError("Voice recognition failed. Please try again.");
      }
    };

    rec.onend = () => {
      setIsListening(false);
      const finalText = accumulatedFinalRef.current.trim();
      accumulatedFinalRef.current = "";
      if (finalText) {
        handleSubmitTranscript(finalText);
      }
    };

    rec.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          accumulatedFinalRef.current = `${accumulatedFinalRef.current} ${res[0].transcript}`.trim();
        } else {
          interimText += res[0].transcript;
        }
      }
      const display = (accumulatedFinalRef.current + " " + interimText).trim();
      if (display) setTranscript(display);
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.abort(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Wrap-up flow --------------------------------------------------------
  const clearWrapUpTimers = () => {
    wrapUpTimersRef.current.forEach((t) => clearInterval(t) || clearTimeout(t));
    wrapUpTimersRef.current = [];
  };

  const startWrapUp = useCallback(() => {
    clearWrapUpTimers();
    hasFiredReadyRef.current = false;
    setWrapUpActive(true);
    setWrapUpProgress(0);

    const startedAt = Date.now();
    const DURATION = 2500; // 2.5s pause before opening dashboard

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setWrapUpProgress(Math.min(100, Math.round((elapsed / DURATION) * 100)));
    }, 60);
    wrapUpTimersRef.current.push(interval);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setWrapUpProgress(100);
      // Wait briefly for any in-flight processing too
      const fire = () => {
        if (hasFiredReadyRef.current) return;
        hasFiredReadyRef.current = true;
        setWrapUpActive(false);
        setIsOpen(false);
        if (typeof onReadyRef.current === "function") {
          onReadyRef.current();
        }
      };
      // If still processing, wait until it completes (poll lightly)
      const poll = setInterval(() => {
        if (!isProcessingRef.current) {
          clearInterval(poll);
          fire();
        }
      }, 120);
      wrapUpTimersRef.current.push(poll);
      // Hard cap: 6s total to avoid hanging
      const hardCap = setTimeout(() => {
        clearInterval(poll);
        fire();
      }, 3500);
      wrapUpTimersRef.current.push(hardCap);
    }, DURATION);
    wrapUpTimersRef.current.push(timeout);
  }, []);

  // Track isProcessing in a ref for the wrap-up poll
  const isProcessingRef = useRef(isProcessing);
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);

  // Submit a finalized transcript — kicks off wrap-up + parent pipeline
  const handleSubmitTranscript = useCallback((text) => {
    if (!text) return;
    setTranscript(text);
    cancelSpeaking();
    if (typeof onTranscriptRef.current === "function") {
      onTranscriptRef.current(text);
    }
    startWrapUp();
  }, [startWrapUp]);

  // Cleanup on unmount
  useEffect(() => () => clearWrapUpTimers(), []);

  // ---- Speech synthesis (reading aloud generated summaries) ----------------
  const cancelSpeaking = () => {
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    }
    setIsSpeaking(false);
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

  // ---- UI handlers ---------------------------------------------------------
  const toggleListening = (e) => {
    e.stopPropagation();
    setMicError("");
    if (!speechSupported || !recognitionRef.current) {
      setMicError(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }
    const rec = recognitionRef.current;
    if (isListening) {
      try { rec.stop(); } catch { /* noop */ }
      return;
    }
    setIsOpen(true);
    setTranscript("");
    setWrapUpActive(false);
    setWrapUpProgress(0);
    clearWrapUpTimers();
    // Ensure lang is up to date
    rec.lang = localeFor(languageRef.current);
    try {
      rec.start();
    } catch (err) {
      // start() throws if already started — try a quick recover
      console.warn("recognition.start() threw:", err);
      try {
        rec.stop();
        setTimeout(() => {
          try { rec.start(); } catch (e2) {
            console.error("Retry start failed:", e2);
            setMicError("Could not start the microphone. Please try again.");
          }
        }, 150);
      } catch { /* noop */ }
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const value = textInput.trim();
    if (!value) return;
    setTextInput("");
    handleSubmitTranscript(value);
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* noop */ }
    }
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    cancelSpeaking();
    clearWrapUpTimers();
    setWrapUpActive(false);
    setWrapUpProgress(0);
    setIsOpen(false);
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* noop */ }
    }
  };

  // Clear any previous conversation so reopening the assistant starts fresh.
  const resetSession = () => {
    cancelSpeaking();
    clearWrapUpTimers();
    setTranscript("");
    setTextInput("");
    setMicError("");
    setWrapUpActive(false);
    setWrapUpProgress(0);
    accumulatedFinalRef.current = "";
    hasFiredReadyRef.current = false;
  };

  // Open the assistant drawer with a clean slate.
  const openFresh = () => {
    resetSession();
    setIsOpen(true);
  };

  // ---- i18n ----------------------------------------------------------------
  const i18n = {
    title: {
      hi: "आवाज़ असिस्टेंट",
      en: "Awaaz AI Assistant",
      ta: "ஆவாஸ் குரல் அசிஸ்டண்ட்",
      te: "ఆవాజ్ వాయిస్ అసిస్టెంట్",
    },
    sub: {
      hi: "नीले गोले को छूकर अपनी उम्र, काम या परिवार के बारे में बताएं",
      en: "Tap the blue orb to describe your age, job, land, or income",
      ta: "உங்கள் வயது, தொழில் அல்லது வருமானம் பற்றி கூற நீல நிற வட்டத்தை தொடவும்",
      te: "మీ వయస్సు, ఉద్యోగం లేదా ఆదాయం గురించి చెప్పడానికి నీలి రంగు సర్కిల్‌ను తాకండి",
    },
    trigger: {
      listening: { hi: "सुन रहा हूँ...", en: "Listening...", ta: "கேட்கிறது...", te: "వింటున్నాను..." },
      processing: { hi: "योजनाएं खोज रहा हूँ...", en: "Processing...", ta: "திட்டங்களை தேடுகிறது...", te: "పథకాలను వెతుకుతోంది..." },
      wrapping: { hi: "डैशबोर्ड तैयार किया जा रहा है...", en: "Preparing your dashboard...", ta: "டாஷ்போர்டை தயாரிக்கிறது...", te: "డాష్‌బోర్డ్ సిద్ధం చేస్తోంది..." },
      standby: {
        hi: "आवाज़ से योजनाएं खोजें (Tap to Speak)",
        en: "Speak to find schemes",
        ta: "குரல் மூலம் தேடவும் (Tap to Speak)",
        te: "మాట్లాడి పథకాలు వెతకండి (Tap to Speak)",
      },
    },
    status: {
      listening: { hi: "सुन रहा हूँ...", en: "Listening...", ta: "கேட்கிறது...", te: "వింటున్నాను..." },
      processing: { hi: "खोज रहा हूँ...", en: "Matching schemes...", ta: "தேடுகிறது...", te: "వెతుకుతోంది..." },
      wrapping: { hi: "डैशबोर्ड खुल रहा है...", en: "Opening your dashboard...", ta: "டாஷ்போர்டு திறக்கிறது...", te: "డాష్‌బోర్డ్ తెరుచుకుంటోంది..." },
      ready: { hi: "तैयार", en: "Ready", ta: "தயார்", te: "సిద్ధంగా ఉంది" },
    },
    transcriptLabel: { hi: "आपकी आवाज़ (ट्रांसक्रिप्ट)", en: "Your Voice Transcription", ta: "உங்கள் குரல் (நகல்)", te: "మీ వాయిస్ (ట్రాన్స్క్రిప్ట్)" },
    placeholderText: {
      hi: "माइक आइकॉन दबाएं या नीचे टाइप करें...",
      en: "Microphone input transcript will show here...",
      ta: "குரல் மூலம் பேசவும் அல்லது தட்டச்சு செய்யவும்...",
      te: "మైక్రోఫోన్ ఉపయోగించండి లేదా ఇక్కడ టైప్ చేయండి...",
    },
    noSpeechSupport: {
      hi: "इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है। कृपया नीचे टाइप करें।",
      en: "Speech recognition is not supported on this browser. Please type below.",
      ta: "இந்த உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. தயவுசெய்து கீழே தட்டச்சு செய்யவும்.",
      te: "ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ చేయదు. దయచేసి క్రింద టైప్ చేయండి."
    },
    mute: { hi: "म्यूट करें", en: "Mute audio", ta: "ஒலியை நிறுத்து", te: "మ్యూట్ చేయి" },
    repeat: { hi: "फिर से सुनाएं", en: "Repeat Voice", ta: "மீண்டும் கேள்", te: "మరోసారి వినిపించు" },
    aiAdvice: { hi: "असिस्टेंट का सुझाव", en: "Voice Advice Summary", ta: "அசிஸ்டண்ட் பரிந்துரை", te: "అసిస్టెంట్ సలహా" },
    inputPlaceholder: {
      hi: "यहाँ टाइप करके भी पूछ सकते हैं...",
      en: "Or type your message...",
      ta: "இங்கே தட்டச்சு செய்து கேட்கலாம்...",
      te: "ఇక్కడ టైప్ చేసి కూడా అడగవచ్చు...",
    },
  };

  const t = (key) => i18n[key]?.[language] || i18n[key]?.en || "";
  const tSub = (key, sub) => i18n[key]?.[language]?.[sub] || i18n[key]?.en?.[sub] || "";
  // i18n trigger uses nested keys
  const triggerText = () => {
    if (isListening) return i18n.trigger.listening[language] || i18n.trigger.listening.en;
    if (wrapUpActive) return i18n.trigger.wrapping[language] || i18n.trigger.wrapping.en;
    if (isProcessing) return i18n.trigger.processing[language] || i18n.trigger.processing.en;
    return i18n.trigger.standby[language] || i18n.trigger.standby.en;
  };
  const statusText = () => {
    if (isListening) return i18n.status.listening[language] || i18n.status.listening.en;
    if (wrapUpActive) return i18n.status.wrapping[language] || i18n.status.wrapping.en;
    if (isProcessing) return i18n.status.processing[language] || i18n.status.processing.en;
    return i18n.status.ready[language] || i18n.status.ready.en;
  };

  return (
    <>
      {/* 1. Compact Floating Bottom Capsule (Sticky Trigger) */}
      <div
        className={`floating-assistant-trigger ${isListening ? "active-listening" : ""} ${wrapUpActive ? "active-speaking" : ""}`}
        onClick={(e) => {
          if (!isOpen) openFresh();
          // Tapping the capsule should start listening right away, not just
          // open the drawer and leave the user wondering why nothing happens.
          if (!isListening && !isProcessing && !wrapUpActive) {
            toggleListening(e);
          }
        }}
      >
        <div className="trigger-content">
          <div className="pulse-mic-icon">
            {isListening ? (
              <MicOff size={16} className="text-danger" />
            ) : (isProcessing || wrapUpActive) ? (
              <Loader2 size={16} className="animate-spin text-gradient" />
            ) : (
              <Mic size={16} />
            )}
          </div>
          <span className="trigger-text">{triggerText()}</span>
          <ChevronUp size={16} className="trigger-arrow" />
        </div>
      </div>

      {/* 2. Glassmorphic Bottom Sheet Drawer */}
      {isOpen && (
        <div className="assistant-overlay" onClick={handleClose}>
          <div className="assistant-sheet glass-panel" onClick={(e) => e.stopPropagation()}>

            <div className="sheet-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="live-dot"></span>
                <span>{t("title")}</span>
              </h3>
              <button className="btn close-sheet-btn" onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            <div className="sheet-body">
              <p className="status-sub">{t("sub")}</p>

              {/* Glowing Orb */}
              <div className="orb-container">
                <div
                  className={`orb ${isListening ? "recording" : ""} ${(isSpeaking || wrapUpActive) ? "speaking" : ""}`}
                  onClick={toggleListening}
                >
                  <div className="mic-icon-container">
                    {isListening ? (
                      <MicOff size={36} />
                    ) : (isProcessing || wrapUpActive) ? (
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
                <span
                  className="status-text"
                  style={{
                    color: isListening
                      ? "var(--color-danger)"
                      : wrapUpActive || isProcessing
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {statusText()}
                </span>
                
                <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                  {isSpeaking && (
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} 
                      onClick={cancelSpeaking}
                    >
                      <VolumeX size={14} /> {t("mute")}
                    </button>
                  )}
                  {!isSpeaking && aiResponse && (
                    <button 
                      className="btn" 
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} 
                      onClick={() => speakText(aiResponse)}
                    >
                      <Volume2 size={14} /> {t("repeat")}
                    </button>
                  )}
                </div>
              </div>

              {/* Mic error banner */}
              {micError && (
                <div
                  className="missing-warning"
                  style={{ marginTop: "0.5rem", color: "var(--color-danger)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <AlertTriangle size={14} style={{ flexShrink: 0 }} />{micError}
                </div>
              )}

              {/* Live Transcript Box */}
              <div className="transcript-box">
                <div className="transcript-label">{t("transcriptLabel")}</div>
                <div className="transcript-text">
                  {transcript ? (
                    transcript
                  ) : (
                    <span className="transcript-placeholder">
                      {speechSupported ? t("placeholderText") : t("noSpeechSupport")}
                    </span>
                  )}
                </div>
              </div>

              {/* Wrap-up progress bar — appears after user finishes speaking */}
              {wrapUpActive && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.8rem",
                      marginBottom: "0.35rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      <CheckCircle2 size={14} style={{ color: "var(--accent-primary)" }} />
                      {statusText()}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--accent-primary)" }}>
                      {wrapUpProgress}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "999px",
                      background: "rgba(79, 70, 229, 0.12)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${wrapUpProgress}%`,
                        background:
                          "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary, #8b5cf6))",
                        transition: "width 120ms linear",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* AI Vernacular Advice Speech Block */}
              {aiResponse && (
                <div className="ai-response-box" style={{ marginTop: "0.75rem" }}>
                  <div className="ai-response-title text-gradient">
                    <Volume2 size={14} />
                    <span>{t("aiAdvice")}</span>
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
                  placeholder={t("inputPlaceholder")}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(0, 0, 0, 0.03)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem 1rem",
                    color: "var(--text-primary)",
                    outline: "none",
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
