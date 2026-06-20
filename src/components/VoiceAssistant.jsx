import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, Play } from "lucide-react";

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
    // Map language parameter to speech locales
    rec.lang = language === "hi" ? "hi-IN" : "en-IN";

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("");
      // Cancel any ongoing speaking to prevent audio overlap
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

  // Handle Speech synthesis readouts when AI Response updates
  useEffect(() => {
    if (aiResponse) {
      speakText(aiResponse);
    }
    return () => {
      cancelSpeaking();
    };
  }, [aiResponse]);

  const toggleListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported on this browser. Please try Chrome, Edge, or Safari, or use the text input below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    cancelSpeaking();

    if (!window.speechSynthesis) return;

    // Clean text of markdown characters before synthesis
    const cleanText = text.replace(/[*#_`\-]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    
    // Attempt to pick a good local voice
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

  return (
    <div className="glass-panel assistant-panel">
      <div>
        <h2 className="text-gradient" style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
          {language === "hi" ? "आवाज़ असिस्टेंट" : "Awaaz Assistant"}
        </h2>
        <p className="status-sub">
          {language === "hi" 
            ? "माइक चालू करने के लिए नीले गोले को छुएं और अपनी समस्या बताएं" 
            : "Tap the blue orb to speak and describe your work, income, or family details"}
        </p>
      </div>

      {/* Glowing Orb UI */}
      <div className="orb-container">
        <div 
          className={`orb ${isListening ? "recording" : ""} ${isSpeaking ? "speaking" : ""}`}
          onClick={toggleListening}
        >
          <div className="mic-icon-container">
            {isListening ? (
              <MicOff size={40} />
            ) : isProcessing ? (
              <Loader2 size={40} className="animate-spin" />
            ) : (
              <Mic size={40} />
            )}
          </div>
        </div>
        <div className="orb-pulse-ring"></div>
        <div className="orb-ring-1"></div>
        <div className="orb-ring-2"></div>
      </div>

      {/* Speaking Indicator & Audio controls */}
      <div style={{ minHeight: "40px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {isListening && (
          <span className="status-text" style={{ color: "var(--color-danger)" }}>
            {language === "hi" ? "सुन रहा हूँ..." : "Listening..."}
          </span>
        )}
        {isProcessing && (
          <span className="status-text text-gradient">
            {language === "hi" ? "योजनाएं खोज रहा हूँ..." : "Matching schemes..."}
          </span>
        )}
        {!isListening && !isProcessing && (
          <span className="status-text">
            {isSpeaking 
              ? (language === "hi" ? "असिस्टेंट बोल रहा है" : "Speaking...") 
              : (language === "hi" ? "तैयार" : "Ready")}
          </span>
        )}

        {isSpeaking && (
          <button 
            className="btn" 
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderColor: "var(--color-danger-bg)" }} 
            onClick={cancelSpeaking}
          >
            <VolumeX size={14} /> {language === "hi" ? "म्यूट करें" : "Mute"}
          </button>
        )}
        {!isSpeaking && aiResponse && (
          <button 
            className="btn" 
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} 
            onClick={() => speakText(aiResponse)}
          >
            <Volume2 size={14} /> {language === "hi" ? "सुनाएं" : "Read Aloud"}
          </button>
        )}
      </div>

      {/* Transcript Box */}
      <div className="transcript-box">
        <div className="transcript-label">
          {language === "hi" ? "आपकी आवाज़ (ट्रांसक्रिप्ट)" : "Your Voice (Transcript)"}
        </div>
        <div className="transcript-text">
          {transcript ? (
            transcript
          ) : (
            <span className="transcript-placeholder">
              {language === "hi" 
                ? "माइक पर क्लिक करें या नीचे टाइप करें..." 
                : "Microphone transcript will appear here..."}
            </span>
          )}
        </div>
      </div>

      {/* AI Vernacular Speech Text Box */}
      {aiResponse && (
        <div className="ai-response-box">
          <div className="ai-response-title text-gradient">
            <Volume2 size={14} />
            <span>{language === "hi" ? "असिस्टेंट की सलाह" : "Assistant Advice"}</span>
          </div>
          <div className="ai-response-text">{aiResponse}</div>
        </div>
      )}

      {/* Manual text input forms */}
      <form onSubmit={handleTextSubmit} style={{ width: "100%", display: "flex", gap: "0.5rem", marginTop: "auto" }}>
        <input
          type="text"
          placeholder={language === "hi" ? "अपनी परेशानी यहाँ लिखें..." : "Or type your profile details..."}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          style={{
            flex: 1,
            background: "rgba(0, 0, 0, 0.2)",
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
  );
}
