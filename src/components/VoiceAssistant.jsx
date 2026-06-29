import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, X, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { parseSingleField } from "../utils/gemini";

const QUESTIONS = [
  {
    field: "age",
    label: { en: "Age", hi: "उम्र", ta: "வயது", te: "వయస్సు" },
    text: {
      en: "Question 1 of 8: Please tell me your age.",
      hi: "प्रश्न 1: कृपया अपनी उम्र बताएं।",
      ta: "கேள்வி 1: தயவுசெய்து உங்கள் வயதைச் சொல்லுங்கள்.",
      te: "ప్రశ్న 1: దయచేసి మీ వయస్సు చెప్పండి."
    },
    quickSelects: []
  },
  {
    field: "gender",
    label: { en: "Gender", hi: "लिंग", ta: "பாலினம்", te: "లింగం" },
    text: {
      en: "Question 2 of 8: What is your gender? Male or Female?",
      hi: "प्रश्न 2: आपका लिंग क्या है? पुरुष या महिला?",
      ta: "கேள்வி 2: உங்கள் பாலினம் என்ன? ஆண் அல்லது பெண்?",
      te: "ప్రశ్న 2: మీ లింగం ఏమిటి? పురుషుడు లేదా స్త్రీ?"
    },
    quickSelects: [
      { value: "male", label: { en: "Male", hi: "पुरुष", ta: "ஆண்", te: "புరుషుడు" } },
      { value: "female", label: { en: "Female", hi: "महिला", ta: "பெண்", te: "స్త్రీ" } },
      { value: "other", label: { en: "Other", hi: "अन्य", ta: "மற்றவை", te: "இతర" } }
    ]
  },
  {
    field: "state",
    label: { en: "State", hi: "राज्य", ta: "மாநிலம்", te: "రాష్ట్రం" },
    text: {
      en: "Question 3 of 8: Which state do you live in? (e.g. Uttar Pradesh, Tamil Nadu, Telangana)",
      hi: "प्रश्न 3: आप किस राज्य में रहते हैं? (जैसे, उत्तर प्रदेश, तमिलनाडु, तेलंगाना)",
      ta: "கேள்வி 3: நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்? (எ.கா., தமிழ்நாடு, உத்திரப் பிரதேசம், தெலுங்கானா)",
      te: "ప్రశ్న 3: మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు? (ఉదాహరణకు, తెలంగాణ, ఆంధ్రప్రదేశ్, ఉత్తర ప్రదేశ్)"
    },
    quickSelects: [
      { value: "uttar_pradesh", label: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश", ta: "உத்திரப் பிரதேசம்", te: "ఉత్తర ప్రదేశ్" } },
      { value: "tamil_nadu", label: { en: "Tamil Nadu", hi: "तमिलनाडु", ta: "தமிழ்நாடு", te: "தமையநாடு" } },
      { value: "telangana", label: { en: "Telangana", hi: "तेलंगाना", ta: "தெலுங்கானா", te: "తెలంగాణ" } },
      { value: "maharashtra", label: { en: "Maharashtra", hi: "महाराष्ट्र", ta: "மகாராஷ்டிரா", te: "మహారాష్ట్ర" } },
      { value: "bihar", label: { en: "Bihar", hi: "बिहार", ta: "பீகார்", te: "బీహార్" } },
      { value: "other", label: { en: "Other State", hi: "अन्य राज्य", ta: "இதர மாநிலம்", te: "ఇతర రాష్ట్రం" } }
    ]
  },
  {
    field: "occupation",
    label: { en: "Occupation", hi: "व्यवसाय", ta: "தொழில்", te: "వృత్తి" },
    text: {
      en: "Question 4 of 8: What is your occupation? (e.g. Farmer, Laborer, Shopkeeper, Unemployed)",
      hi: "प्रश्न 4: आपका व्यवसाय या काम क्या है? (जैसे, किसान, मजदूर, दुकानदार, बेरोजगार)",
      ta: "கேள்வி 4: உங்கள் தொழில் என்ன? (எ.கா., விவசாயி, தொழிலாளி, கடைக்காரர், வேலையில்லாதவர்)",
      te: "ప్రశ్న 4: మీ వృత్తి ఏమిటి? (ఉదాహరణకు, రైతు, కూలి, వ్యాపారి, నిరుద్యోగి)"
    },
    quickSelects: [
      { value: "farmer", label: { en: "Farmer", hi: "किसान", ta: "விவசாயி", te: "రైతు" } },
      { value: "laborer", label: { en: "Laborer", hi: "मजदूर", ta: "தொழிலாளி", te: "కూలి" } },
      { value: "artisan", label: { en: "Artisan/Craftsman", hi: "कारीगर", ta: "கைவினைஞர்", te: "చేతివృత్తిదారుడు" } },
      { value: "vendor", label: { en: "Street Vendor", hi: "दुकानदार/फेरीवाला", ta: "வியாபாரி", te: "వీధి వ్యాపారి" } },
      { value: "unemployed", label: { en: "Unemployed", hi: "बेरोजगार", ta: "வேலையில்லாதவர்", te: "నిరుద్యోగి" } }
    ]
  },
  {
    field: "land_ownership",
    label: { en: "Agricultural Land", hi: "खेती की ज़मीन", ta: "விவசாய நிலம்", te: "వ్యవసాయ భూమి" },
    text: {
      en: "Question 5 of 8: Do you own agricultural land? Yes or No?",
      hi: "प्रश्न 5: क्या आपके पास खेती की ज़मीन है? हाँ या नहीं?",
      ta: "கேள்வி 5: உங்களுக்கு விவசாய நிலம் உள்ளதா? ஆம் அல்லது இல்லை?",
      te: "ప్రశ్న 5: మీకు వ్యవసాయ భూమి ఉందా? అవును లేదా కాదు?"
    },
    quickSelects: [
      { value: "true", label: { en: "Yes", hi: "हाँ", ta: "ஆம்", te: "అవును" } },
      { value: "false", label: { en: "No (Landless)", hi: "नहीं (भूमिहीन)", ta: "இல்லை (நிலமற்றவர்)", te: "కాదు (భూమి లేదు)" } }
    ]
  },
  {
    field: "income_bracket",
    label: { en: "Monthly Income", hi: "मासिक आय", ta: "மாத வருமானம்", te: "నెలవారీ ఆదాయం" },
    text: {
      en: "Question 6 of 8: What is your approximate monthly family income in Rupees?",
      hi: "प्रश्न 6: आपकी अनुमानित मासिक पारिवारिक आय कितनी है?",
      ta: "கேள்வி 6: உங்கள் தோராயமான மாதாந்திர குடும்ப வருமானம் எவ்வளவு?",
      te: "ప్రశ్న 6: మీ కుటుంబ నెలవారీ ఆదాయం సుమారుగా ఎంత?"
    },
    quickSelects: [
      { value: "5000", label: { en: "Under ₹10,000", hi: "₹10,000 से कम", ta: "₹10,000 கீழ்", te: "₹10,000 లోపు" } },
      { value: "15000", label: { en: "₹10,000 - ₹25,000", hi: "₹10,000 - ₹25,000", ta: "₹10,000 - ₹25,000", te: "₹10,000 - ₹25,000" } },
      { value: "30000", label: { en: "Over ₹25,000", hi: "₹25,000 से अधिक", ta: "₹25,000 மேல்", te: "₹25,000 పైగా" } }
    ]
  },
  {
    field: "bpl",
    label: { en: "BPL Status", hi: "बीपीएल स्थिति", ta: "வறுமை நிலை", te: "దారిద్ర్య రేఖ" },
    text: {
      en: "Question 7 of 8: Do you have a BPL ration card? Yes or No?",
      hi: "प्रश्न 7: क्या आपके पास बीपीएल राशन कार्ड है? हाँ या नहीं?",
      ta: "கேள்வி 7: உங்களிடம் பிபிஎல் ரேஷன் கார்டு உள்ளதா? ஆம் அல்லது இல்லை?",
      te: "ప్రశ్న 7: మీకు బిపిఎల్ రేషన్ కార్డ్ ఉందా? అవును లేదా కాదు?"
    },
    quickSelects: [
      { value: "true", label: { en: "Yes (BPL Card)", hi: "हाँ (बीपीएल)", ta: "ஆம் (பிபிஎல்)", te: "అవును (బిపిఎల్)" } },
      { value: "false", label: { en: "No (APL)", hi: "नहीं (एपीएल)", ta: "இல்லை (ஏபிஎல்)", te: "కాదు (ఏపిఎల్)" } }
    ]
  },
  {
    field: "documents",
    label: { en: "Documents", hi: "दस्तावेज़", ta: "ஆவணங்கள்", te: "పత్రాలు" },
    text: {
      en: "Question 8 of 8: Do you have an Aadhaar card and a bank account?",
      hi: "प्रश्न 8: क्या आपके पास आधार कार्ड और बैंक खाता है?",
      ta: "கேள்வி 8: உங்களிடம் ஆதார் அட்டை மற்றும் வங்கி கணக்கு உள்ளதா?",
      te: "ప్రశ్న 8: మీ వద్ద ఆధార్ కార్డ్ మరియు బ్యాంక్ ఖాతా ఉన్నాయా?"
    },
    quickSelects: [
      { value: "both", label: { en: "Yes, both", hi: "हाँ, दोनों हैं", ta: "ஆம், இரண்டும்", te: "అవును, రెండూ ఉన్నాయి" } },
      { value: "aadhaar_only", label: { en: "Aadhaar Only", hi: "केवल आधार", ta: "ஆதார் மட்டும்", te: "ఆధార్ மட்டுமே" } },
      { value: "none", label: { en: "No", hi: "नहीं", ta: "இல்லை", te: "ఏవీ लेవు" } }
    ]
  }
];

export default function VoiceAssistant({
  userProfile,
  onProfileChange,
  language,
  isProcessing,
  onReadyToShowResults,
  aiResponse,
  onCompleteQuestionnaire,
  isGeneratingReport,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [textInput, setTextInput] = useState("");
  
  const isGeneratingReportRef = useRef(isGeneratingReport);
  useEffect(() => {
    isGeneratingReportRef.current = isGeneratingReport;
  }, [isGeneratingReport]);
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micError, setMicError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAiProcessingField, setIsAiProcessingField] = useState(false);

  // Mute state to control persistent listening
  const [isMuted, setIsMuted] = useState(false);

  // Wrap-up loading animation state
  const [wrapUpActive, setWrapUpActive] = useState(false);
  const [wrapUpProgress, setWrapUpProgress] = useState(0);

  const recognitionRef = useRef(null);
  const synthesisUtteranceRef = useRef(null);
  const languageRef = useRef(language);
  const accumulatedFinalRef = useRef("");
  const latestTranscriptRef = useRef("");
  const autoStartListeningTimeoutRef = useRef(null);
  const silenceTimerRef = useRef(null);
  
  // Timestamp to ignore incoming audio results to block TTS echo lag
  const ignoreSpeechUntilRef = useRef(0);

  // Stale closure refs to always access latest profile and handlers
  const userProfileRef = useRef(userProfile);
  const handleUserAnswerRef = useRef(null);

  // Synchronize state references for callbacks
  const isOpenRef = useRef(isOpen);
  const wrapUpActiveRef = useRef(wrapUpActive);
  const isSpeakingRef = useRef(isSpeaking);
  const isMutedRef = useRef(isMuted);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { wrapUpActiveRef.current = wrapUpActive; }, [wrapUpActive]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  
  // Keep profile ref in sync
  useEffect(() => {
    userProfileRef.current = userProfile;
  }, [userProfile]);

  // Sync language selection
  useEffect(() => {
    languageRef.current = language;
    if (recognitionRef.current) {
      recognitionRef.current.lang = localeFor(language);
    }
  }, [language]);

  function localeFor(lang) {
    if (lang === "hi") return "hi-IN";
    if (lang === "ta") return "ta-IN";
    if (lang === "te") return "te-IN";
    return "en-IN";
  }

  // Speak active question on index change
  useEffect(() => {
    if (isOpen && !wrapUpActive) {
      const q = QUESTIONS[currentQuestionIndex];
      if (!q) return;
      const textToSpeak = q.text[language] || q.text.en;
      
      // Cancel previous speech and clear silence timer
      cancelSpeaking();
      clearSilenceTimer();

      // Speak text, then listen continuously
      speakText(textToSpeak, () => {
        // Discard any audio echo for 800ms after TTS finishes
        ignoreSpeechUntilRef.current = Date.now() + 800;
        
        latestTranscriptRef.current = "";
        accumulatedFinalRef.current = "";
        setTranscript("");
        resetSilenceTimer(4500); // Wait 4.5s for initial speech
      });
    }

    return () => {
      clearSilenceTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, isOpen, wrapUpActive]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      cancelSpeaking();
      clearSilenceTimer();
      try { recognitionRef.current.abort(); } catch {}
    };
  }, []);

  // ---- Silence Detection & Finalization Helpers ----------------------------
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const resetSilenceTimer = useCallback((timeoutMs = 1000) => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      finalizeAnswer();
    }, timeoutMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalizeAnswer = () => {
    clearSilenceTimer();
    const finalText = latestTranscriptRef.current.trim();
    latestTranscriptRef.current = "";
    accumulatedFinalRef.current = "";
    setTranscript("");

    if (finalText && handleUserAnswerRef.current) {
      handleUserAnswerRef.current(finalText);
    }
  };

  // ---- Speech Recognition Initialization -----------------------------------
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
      return;
    }

    const rec = new SR();
    rec.continuous = true; 
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = localeFor(languageRef.current);

    rec.onstart = () => {
      setIsListening(true);
      setMicError("");
      setTranscript("");
      accumulatedFinalRef.current = "";
      latestTranscriptRef.current = "";
      resetSilenceTimer(4500); 
    };

    rec.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      clearSilenceTimer();
      const err = event.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        setMicError("Microphone access blocked. Please enable it in browser settings.");
      } else if (err === "no-speech") {
        console.log("No speech detected.");
      } else {
        setMicError("Speech recognition failed. Try again.");
      }
    };

    rec.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
      
      const finalText = latestTranscriptRef.current.trim();
      latestTranscriptRef.current = "";
      accumulatedFinalRef.current = "";
      if (finalText && handleUserAnswerRef.current) {
        handleUserAnswerRef.current(finalText);
      }

      // If drawer is still open and not muted, immediately restart the persistent session
      if (isOpenRef.current && !wrapUpActiveRef.current && !isMutedRef.current) {
        setTimeout(() => {
          try {
            if (recognitionRef.current) recognitionRef.current.start();
          } catch {}
        }, 100);
      }
    };

    rec.onresult = (event) => {
      // Discard results captured while TTS is reading, wizard is wrapping up, or during echo ignore gap
      if (isSpeakingRef.current || wrapUpActiveRef.current || Date.now() < ignoreSpeechUntilRef.current) {
        latestTranscriptRef.current = "";
        accumulatedFinalRef.current = "";
        return;
      }

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
      if (display) {
        setTranscript(display);
        latestTranscriptRef.current = display;
        resetSilenceTimer(1000); // 1.0 second silence timeout
      }
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.abort(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSilenceTimer]);

  // ---- Speech Synthesis ----------------------------------------------------
  const cancelSpeaking = () => {
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  };

  const speakText = (text, onEnd) => {
    cancelSpeaking();
    if (!window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text.replace(/[*#_`\-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
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

    utterance.onstart = () => {
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      clearSilenceTimer();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      if (onEnd) onEnd();
    };

    synthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // ---- Microphone Handlers -------------------------------------------------
  const startListening = () => {
    if (isMutedRef.current) return;
    setMicError("");
    if (!speechSupported || !recognitionRef.current) {
      setMicError("Speech recognition not supported in this browser.");
      return;
    }
    cancelSpeaking();
    const rec = recognitionRef.current;
    
    try {
      rec.abort();
    } catch (e) {
      // ignore
    }

    rec.lang = localeFor(languageRef.current);
    
    setTimeout(() => {
      try {
        rec.start();
      } catch (err) {
        console.warn("recognition.start() error:", err);
      }
    }, 100);
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    }
  };

  const toggleListening = (e) => {
    if (e) e.stopPropagation();
    if (isAiProcessingField) return;
    
    if (isListening) {
      setIsMuted(true);
      stopListening();
    } else {
      setIsMuted(false);
      startListening();
    }
  };

  // ---- Handle User Answers (Voice or Text) ---------------------------------
  const handleUserAnswer = async (answer) => {
    if (!answer || answer.trim() === "") return;
    if (isAiProcessingField) return;

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;

    setTranscript(answer);
    setIsAiProcessingField(true);
    cancelSpeaking();

    const field = currentQuestion.field;
    const latestProfile = userProfileRef.current; // Read profile from the latest reference

    try {
      if (field === "documents") {
        const hasAadhaar = await parseSingleField("has_aadhaar", answer, language);
        const hasBank = await parseSingleField("has_bank_account", answer, language);
        
        const finalProfile = {
          ...latestProfile,
          has_aadhaar: hasAadhaar !== null ? hasAadhaar : latestProfile.has_aadhaar,
          has_bank_account: hasBank !== null ? hasBank : latestProfile.has_bank_account
        };
        onProfileChange(finalProfile);
        
        if (typeof onCompleteQuestionnaire === "function") {
          onCompleteQuestionnaire(finalProfile);
        }
      } else {
        const val = await parseSingleField(field, answer, language);
        const finalProfile = {
          ...latestProfile,
          [field]: val !== null ? val : latestProfile[field]
        };
        onProfileChange(finalProfile);
      }

      advanceQuestion();
    } catch (e) {
      console.error("Error parsing user answer", e);
      advanceQuestion();
    } finally {
      setIsAiProcessingField(false);
      setTranscript("");
    }
  };

  // Sync the handler ref
  useEffect(() => {
    handleUserAnswerRef.current = handleUserAnswer;
  });

  const handleQuickSelect = (val) => {
    if (isAiProcessingField) return;

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const field = currentQuestion.field;
    cancelSpeaking();
    stopListening();

    const latestProfile = userProfileRef.current; // Read profile from the latest reference
    let updatedProfile = { ...latestProfile };
    
    if (field === "documents") {
      if (val === "both") {
        updatedProfile.has_aadhaar = true;
        updatedProfile.has_bank_account = true;
      } else if (val === "aadhaar_only") {
        updatedProfile.has_aadhaar = true;
        updatedProfile.has_bank_account = false;
      } else {
        updatedProfile.has_aadhaar = false;
        updatedProfile.has_bank_account = false;
      }
      
      onProfileChange(updatedProfile);
      
      if (typeof onCompleteQuestionnaire === "function") {
        onCompleteQuestionnaire(updatedProfile);
      }
    } else {
      let parsedVal = val;
      if (val === "true") parsedVal = true;
      if (val === "false") parsedVal = false;
      if (field === "age" || field === "income_bracket") {
        parsedVal = parseInt(val, 10);
      }
      updatedProfile[field] = parsedVal;
      onProfileChange(updatedProfile);
    }

    advanceQuestion();
  };

  const advanceQuestion = () => {
    setCurrentQuestionIndex((prev) => {
      if (prev < QUESTIONS.length - 1) {
        return prev + 1;
      } else {
        setTimeout(() => {
          startWrapUp();
        }, 10);
        return prev;
      }
    });
  };

  const regressQuestion = () => {
    if (isAiProcessingField) return;
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const skipQuestion = () => {
    if (isAiProcessingField) return;
    cancelSpeaking();
    stopListening();
    
    if (currentQuestionIndex === QUESTIONS.length - 1) {
      if (typeof onCompleteQuestionnaire === "function") {
        onCompleteQuestionnaire(userProfileRef.current);
      }
    }

    advanceQuestion();
  };

  // ---- Wrap Up & Redirect to Dashboard -------------------------------------
  const startWrapUp = () => {
    cancelSpeaking();
    stopListening();
    setWrapUpActive(true);
    setWrapUpProgress(0);

    const interval = setInterval(() => {
      setWrapUpProgress((prev) => {
        if (prev >= 95) {
          // If Gemini is still generating the report, hold at 95%
          if (isGeneratingReportRef.current) {
            return 95;
          }
          // Once report finishes, jump to 100% and redirect
          clearInterval(interval);
          setTimeout(() => {
            setWrapUpActive(false);
            setIsOpen(false);
            if (typeof onReadyToShowResults === "function") {
              onReadyToShowResults();
            }
          }, 150);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  // ---- Open/Close Drawer ---------------------------------------------------
  const openFresh = () => {
    cancelSpeaking();
    setTranscript("");
    setTextInput("");
    setMicError("");
    setWrapUpActive(false);
    setIsMuted(false);
    setCurrentQuestionIndex(0);
    latestTranscriptRef.current = "";
    
    // Open drawer first, then start mic
    setIsOpen(true);
    setTimeout(() => {
      startListening();
    }, 100);
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    cancelSpeaking();
    stopListening();
    try { recognitionRef.current.abort(); } catch {}
    latestTranscriptRef.current = "";
    setIsOpen(false);
  };

  const restartFlow = () => {
    cancelSpeaking();
    stopListening();
    try { recognitionRef.current.abort(); } catch {}
    setTranscript("");
    setCurrentQuestionIndex(0);
    setMicError("");
    setWrapUpActive(false);
    latestTranscriptRef.current = "";
    setIsMuted(false);
    setTimeout(() => {
      startListening();
    }, 100);
  };

  // ---- Form Submission ----------------------------------------------------
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (isAiProcessingField) return;
    const value = textInput.trim();
    if (!value) return;
    setTextInput("");
    handleUserAnswer(value);
  };

  // ---- UI Helpers ----------------------------------------------------------
  const getProgressPercentage = () => {
    return Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100);
  };

  const i18n = {
    title: {
      hi: "पात्रता जाँच (8 सवाल)",
      en: "Eligibility Checker (8 Questions)",
      ta: "தகுதி அசிஸ்டண்ட் (8 கேள்விகள்)",
      te: "అర్హత అసిస్టెంట్ (8 ప్రశ్నలు)"
    },
    sub: {
      hi: "सरकारी योजनाओं की योग्यता जांचने के लिए कृपया अपनी आवाज़ में उत्तर दें।",
      en: "Answer the voice assistant to determine your state and central benefits.",
      ta: "அரசுத் திட்டங்களின் தகுதிகளைக் கண்டறிய பின்வரும் கேள்விகளுக்குப் பதிலளிக்கவும்.",
      te: "ప్రభుత్వ పథకాల అర్హతలను తెలుసుకోవడానికి క్రింది ప్రశ్నలకు సమాధానం ఇవ్వండి."
    },
    listening: { hi: "सुन रहा हूँ...", en: "Listening...", ta: "கேட்கிறது...", te: "వింటున్నాను..." },
    processing: { hi: "विश्लेषण हो रहा है...", en: "AI विश्लेषण कर रहा है...", ta: "ஆராய்கிறது...", te: "விశ్లేషిస్తోంది..." },
    mute: { hi: "म्यूट", en: "Mute", ta: "ஒலிநிறுத்து", te: "ம్యూట్" },
    skip: { hi: "छोड़ें", en: "Skip", ta: "தவிர்", te: "வదిలేయి" },
    back: { hi: "पीछे", en: "Back", ta: "முன்பु", te: "వెనుకకు" },
    restart: { hi: "फिर से शुरू करें", en: "Restart", ta: "மீண்டும்", te: "మళ్ళీ ప్రారంభించు" },
    placeholder: {
      hi: "अपना उत्तर यहाँ टाइप करें या बोलें...",
      en: "Type your answer here or speak...",
      ta: "பதிலைத் தட்டச்சு செய்ய அல்லது பேசவும்...",
      te: "సమాధానం ఇక్కడ టైప్ చేయండి లేదా మాట్లాడండి..."
    },
    triggerTitle: {
      hi: "योग्यता जाँचे (बोलें)",
      en: "Check Eligibility (Speak)",
      ta: "தகுதித் திட்டங்கள் (பேசவும்)",
      te: "అర్హత చెక్ చేయండి (మాట్లాడండి)"
    },
    wrapText: {
      hi: "आपकी योजनाएं खोजी जा रही हैं...",
      en: "Matching schemes based on your profile...",
      ta: "திட்டங்களை பொருத்துகிறது...",
      te: "పథకాలను మ్యాచ్ చేస్తోంది..."
    }
  };

  const t = (key) => i18n[key]?.[language] || i18n[key]?.en || "";
  const activeQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <>
      {/* 1. Floating bottom trigger */}
      <div
        className="floating-assistant-trigger"
        onClick={() => {
          if (!isOpen) openFresh();
        }}
      >
        <div className="trigger-content">
          <div className="pulse-mic-icon">
            <Mic size={16} />
          </div>
          <span className="trigger-text">{t("triggerTitle")}</span>
          <ChevronUp size={16} className="trigger-arrow" />
        </div>
      </div>

      {/* 2. Drawer sheet overlay */}
      {isOpen && (
        <div className="assistant-overlay" onClick={handleClose}>
          <div className="assistant-sheet glass-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="sheet-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem" }}>
                <span className="live-dot"></span>
                <span>{t("title")}</span>
              </h3>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button className="btn" style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }} onClick={restartFlow}>
                  <RotateCcw size={12} />
                  <span>{t("restart")}</span>
                </button>
                <button className="btn close-sheet-btn" onClick={handleClose}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="sheet-body">
              {wrapUpActive || !activeQuestion ? (
                // Wrap-up loading screen
                <div style={{ padding: "2rem 1rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                  <Loader2 size={36} className="animate-spin text-gradient" />
                  <h4 style={{ fontWeight: 600 }}>{wrapUpActive ? t("wrapText") : "Loading..."}</h4>
                  <div style={{ width: "100%", maxWidth: "300px", height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${wrapUpActive ? wrapUpProgress : 0}%`, background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))", transition: "width 100ms linear" }} />
                  </div>
                  {wrapUpActive && <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{wrapUpProgress}% Completed</span>}
                </div>
              ) : (
                // Step-by-Step Questionnaire Form
                <>
                  <p className="status-sub" style={{ marginBottom: "1rem" }}>{t("sub")}</p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                      <span>Progress: Question {currentQuestionIndex + 1} of 8</span>
                      <span style={{ fontWeight: 700 }}>{getProgressPercentage()}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "rgba(0, 0, 0, 0.05)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${getProgressPercentage()}%`, background: "var(--accent-primary)", transition: "width 300ms ease" }} />
                    </div>
                  </div>

                  {/* Question Prompt display */}
                  <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--accent-primary)", marginBottom: "1.5rem", position: "relative" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>
                      {activeQuestion.text[language] || activeQuestion.text.en}
                    </h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                      Expected Information: {activeQuestion.label[language]}
                    </span>

                    {/* Speaker indicator status */}
                    {isSpeaking && (
                      <span style={{ position: "absolute", right: "1rem", top: "1rem", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-primary)", fontSize: "0.7rem", padding: "0.25rem 0.5rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <Volume2 size={10} /> Reading Aloud
                      </span>
                    )}
                  </div>

                  {/* Orb / Microhone Area */}
                  <div className="orb-container" style={{ margin: "1rem auto" }}>
                    <div
                      className={`orb ${isListening ? "recording" : ""} ${isSpeaking ? "speaking" : ""} ${isMuted ? "muted" : ""}`}
                      onClick={toggleListening}
                    >
                      <div className="mic-icon-container">
                        {isMuted ? (
                          <MicOff size={36} style={{ color: "var(--color-danger)" }} />
                        ) : isListening ? (
                          <Mic size={36} className="pulse-scale" />
                        ) : isAiProcessingField ? (
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

                  {/* Listening status */}
                  <div style={{ textAlign: "center", marginBottom: "1.5rem", height: "1.5rem" }}>
                    {isListening && !isSpeaking && (
                      <span className="status-text animate-pulse" style={{ color: "var(--accent-primary)", fontWeight: 700 }}>
                        {t("listening")}
                      </span>
                    )}
                    {isSpeaking && (
                      <span className="status-text" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                        Speaking...
                      </span>
                    )}
                    {isMuted && (
                      <span className="status-text" style={{ color: "var(--color-danger)", fontWeight: 700 }}>
                        Microphone Muted (Tap to speak)
                      </span>
                    )}
                    {isAiProcessingField && (
                      <span className="status-text" style={{ color: "var(--accent-primary)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        <Loader2 size={14} className="animate-spin" /> {t("processing")}
                      </span>
                    )}
                    {micError && (
                      <span className="status-text text-danger" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        <AlertTriangle size={14} /> {micError}
                      </span>
                    )}
                  </div>

                  {/* Quick Select Buttons */}
                  {activeQuestion.quickSelects.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem", textAlign: "center" }}>
                        Or select directly:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                        {activeQuestion.quickSelects.map((opt) => (
                          <button
                            key={opt.value}
                            className="btn btn-ghost"
                            disabled={isAiProcessingField}
                            onClick={() => handleQuickSelect(opt.value)}
                            style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem", background: "rgba(0, 0, 0, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "20px", opacity: isAiProcessingField ? 0.6 : 1 }}
                          >
                            {opt.label[language] || opt.label.en}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special input fields for age */}
                  {activeQuestion.field === "age" && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                      <input
                        type="number"
                        placeholder="Enter Age (e.g. 35)"
                        disabled={isAiProcessingField}
                        onChange={(e) => setTextInput(e.target.value)}
                        value={textInput}
                        style={{ background: "rgba(0, 0, 0, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)", padding: "0.5rem 1rem", width: "160px", textAlign: "center" }}
                      />
                      <button
                        className="btn btn-primary"
                        disabled={isAiProcessingField}
                        onClick={() => {
                          if (textInput) {
                            handleQuickSelect(textInput);
                            setTextInput("");
                          }
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {/* Live transcript feedback */}
                  {transcript && (
                    <div className="transcript-box" style={{ marginBottom: "1.5rem" }}>
                      <div className="transcript-label">Transcript:</div>
                      <div className="transcript-text" style={{ fontStyle: "italic" }}>"{transcript}"</div>
                    </div>
                  )}

                  {/* Stepper Navigation buttons */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-glass)" }}>
                    <button
                      className="btn"
                      onClick={regressQuestion}
                      disabled={currentQuestionIndex === 0 || isAiProcessingField}
                      style={{ opacity: (currentQuestionIndex === 0 || isAiProcessingField) ? 0.3 : 1, display: "flex", alignItems: "center", gap: "0.25rem" }}
                    >
                      <ChevronLeft size={16} />
                      <span>{t("back")}</span>
                    </button>

                    <button
                      className="btn btn-ghost"
                      onClick={skipQuestion}
                      disabled={isAiProcessingField}
                      style={{ color: "var(--text-muted)", opacity: isAiProcessingField ? 0.3 : 1 }}
                    >
                      {t("skip")}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Manual text input footer (only if not wrapping up) */}
            {!wrapUpActive && activeQuestion && (
              <div className="sheet-footer">
                <form onSubmit={handleTextSubmit} style={{ width: "100%", display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder={t("placeholder")}
                    disabled={isAiProcessingField}
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
                      opacity: isAiProcessingField ? 0.6 : 1
                    }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={isAiProcessingField} style={{ padding: "0.75rem" }}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
