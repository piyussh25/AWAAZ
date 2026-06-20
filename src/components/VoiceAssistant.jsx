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
  const [isOpen, setIsOpen] = useState(false); // Controls bottom-sheet drawer state

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
    rec.lang = language === "hi" ? "hi-IN" : "en-IN";

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
      // Auto-open assistant overlay when AI starts explaining things
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
      alert("Speech recognition is not supported on this browser. Please try Chrome, Edge, or Safari, or type in the input.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Ensure the drawer is open when recording starts
      setIsOpen(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    cancelSpeaking();
    if (!window.speechSynthesis) return;

    const cleanText = text.replace(/[*#_`\-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    
    const voices = window.speechSynthesis.getVoices();
    const targetLang = language === "hi" ? "hi" : "en";
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
              ? (language === "hi" ? "सुन रहा हूँ..." : "Listening...")
              : isProcessing 
                ? (language === "hi" ? "योजनाएं खोज रहा हूँ..." : "Processing...")
                : isSpeaking 
                  ? (language === "hi" ? "असिस्टेंट बोल रहा है..." : "Speaking...")
                  : (language === "hi" ? "आवाज़ से योजनाएं खोजें (Tap to Speak)" : "Speak to find schemes")}
          </span>
          <ChevronUp size={16} className="trigger-arrow" />
        </div>
      </div>

      {/* 2. Glassmorphic Modal Overlay / Drawer */}
      {isOpen && (
        <div className="assistant-overlay" onClick={handleClose}>
          <div className="assistant-sheet glass-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Header control */}
            <div className="sheet-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="live-dot"></span>
                <span>{language === "hi" ? "आवाज़ असिस्टेंट" : "Awaaz AI Assistant"}</span>
              </h3>
              <button className="btn close-sheet-btn" onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            <div className="sheet-body">
              <p className="status-sub">
                {language === "hi" 
                  ? "नीले गोले को छूकर अपनी उम्र, काम या परिवार के बारे में बताएं" 
                  : "Tap the blue orb to describe your age, job, land, or income"}
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

              {/* Speech Controls & Audio Stats */}
              <div className="audio-actions-row">
                {isSpeaking && (
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} 
                    onClick={cancelSpeaking}
                  >
                    <VolumeX size={14} /> {language === "hi" ? "म्यूट करें" : "Mute audio"}
                  </button>
                )}
                {!isSpeaking && aiResponse && (
                  <button 
                    className="btn" 
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }} 
                    onClick={() => speakText(aiResponse)}
                  >
                    <Volume2 size={14} /> {language === "hi" ? "फिर से सुनाएं" : "Repeat Voice"}
                  </button>
                )}
              </div>

              {/* Live Transcript Panel */}
              <div className="transcript-box">
                <div className="transcript-label">
                  {language === "hi" ? "आपकी आवाज़ (ट्रांसक्रिप्ट)" : "Your Voice Transcription"}
                </div>
                <div className="transcript-text">
                  {transcript ? (
                    transcript
                  ) : (
                    <span className="transcript-placeholder">
                      {language === "hi" 
                        ? "माइक आइकॉन दबाएं या नीचे टाइप करें..." 
                        : "Microphone input transcript will show here..."}
                    </span>
                  )}
                </div>
              </div>

              {/* Vernacular Speech Response Block */}
              {aiResponse && (
                <div className="ai-response-box" style={{ marginTop: "0.5rem" }}>
                  <div className="ai-response-title text-gradient">
                    <Volume2 size={14} />
                    <span>{language === "hi" ? "असिस्टेंट का सुझाव" : "Voice Advice Summary"}</span>
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
                  placeholder={language === "hi" ? "यहाँ टाइप करके भी पूछ सकते हैं..." : "Or type your message..."}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(0, 0, 0, 0.3)",
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
