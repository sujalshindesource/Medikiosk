// ── MediKiosk Translation System ──────────────────────────────────────
// Simple key-value translation object for English and Hindi.
// Components call t('key') and the current language is read from context.

const translations = {
  en: {
    // Navigation
    home: 'Home',
    features: 'Features',
    about: 'About',
    login: 'Login',
    signUp: 'Sign Up',
    logout: 'Logout',
    signOut: 'Sign Out',
    dashboard: 'Dashboard',
    aiInterview: 'AI Interview',
    timeline: 'Timeline',
    myTimeline: 'My Timeline',
    documents: 'Documents',
    profile: 'Profile',
    queue: 'Queue',
    patients: 'Patients',
    settings: 'Settings',
    patientQueue: 'Patient Queue',

    // Dashboard
    welcomeBack: 'Welcome back',
    doctorDashboard: 'Doctor Dashboard',
    patientDashboard: 'Patient Dashboard',
    fillManualHistory: 'Fill Manual History',
    uploadDocuments: 'Upload Documents',

    // Actions
    startTreatment: 'Start Treatment',
    completeTreatment: 'Complete Treatment',
    generateSummary: 'Generate Summary',
    createOPDReport: 'Create OPD Report',

    // Auth
    patientLogin: 'Patient Login',
    doctorLogin: 'Doctor Login',
    patientPortal: 'Patient Portal',
    doctorPortal: 'Doctor Portal',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    receptionDesk: 'Reception Desk',

    // Medical
    totalConsultations: 'Total Consultations',
    opdPrescriptions: 'OPD Prescriptions',
    healthDocuments: 'Health Documents',
    pendingReports: 'Pending Reports',
    pendingQueue: 'Pending Queue',
    consentRequests: 'Consent Requests',
    completedTreatments: 'Completed Treatments',
    totalPatients: 'Total Patients',
    consultationHistory: 'Consultation & OPD History',
    medicalHistory: 'Medical History',
    pastPrescriptions: 'Past Prescriptions',
    personalDetails: 'Personal Details',
    opdConsultation: 'OPD Consultation & Reports',
    newOPDVisit: 'New OPD Visit',
    saveChanges: 'Save Changes',
    viewReport: 'View Report',
    consentDesk: 'Consent Desk',

    // Landing
    startConsultation: 'Start Patient Consultation',
    doctorTimeSaved: 'Doctor Time Saved',
    clinicalAccuracy: 'Clinical Accuracy',
    intakeSpeed: 'Intake Speed',
    abdmLinked: 'ABDM Linked',

    // Language
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',

    // Generic
    loading: 'Loading...',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    submit: 'Submit',
    search: 'Search',
    noData: 'No data available',
  },

  hi: {
    // Navigation
    home: 'होम',
    features: 'विशेषताएं',
    about: 'हमारे बारे में',
    login: 'लॉगिन',
    signUp: 'साइन अप',
    logout: 'लॉगआउट',
    signOut: 'साइन आउट',
    dashboard: 'डैशबोर्ड',
    aiInterview: 'एआई साक्षात्कार',
    timeline: 'टाइमलाइन',
    myTimeline: 'मेरी टाइमलाइन',
    documents: 'दस्तावेज़',
    profile: 'प्रोफ़ाइल',
    queue: 'कतार',
    patients: 'मरीज़',
    settings: 'सेटिंग्स',
    patientQueue: 'रोगी कतार',

    // Dashboard
    welcomeBack: 'वापसी पर स्वागत है',
    doctorDashboard: 'डॉक्टर डैशबोर्ड',
    patientDashboard: 'पेशेंट डैशबोर्ड',
    fillManualHistory: 'मैन्युअल इतिहास भरें',
    uploadDocuments: 'दस्तावेज़ अपलोड करें',

    // Actions
    startTreatment: 'उपचार शुरू करें',
    completeTreatment: 'उपचार पूर्ण करें',
    generateSummary: 'सारांश बनाएं',
    createOPDReport: 'ओपीडी रिपोर्ट बनाएं',

    // Auth
    patientLogin: 'मरीज लॉगिन',
    doctorLogin: 'डॉक्टर लॉगिन',
    patientPortal: 'पेशेंट पोर्टल',
    doctorPortal: 'डॉक्टर पोर्टल',
    signIn: 'साइन इन करें',
    signingIn: 'साइन इन हो रहा है...',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    receptionDesk: 'रिसेप्शन डेस्क',

    // Medical
    totalConsultations: 'कुल परामर्श',
    opdPrescriptions: 'ओपीडी प्रिस्क्रिप्शन',
    healthDocuments: 'स्वास्थ्य दस्तावेज़',
    pendingReports: 'लंबित रिपोर्ट',
    pendingQueue: 'लंबित कतार',
    consentRequests: 'सहमति अनुरोध',
    completedTreatments: 'पूर्ण उपचार',
    totalPatients: 'कुल मरीज़',
    consultationHistory: 'परामर्श व ओपीडी इतिहास',
    medicalHistory: 'चिकित्सा इतिहास',
    pastPrescriptions: 'पिछले प्रिस्क्रिप्शन',
    personalDetails: 'व्यक्तिगत विवरण',
    opdConsultation: 'ओपीडी परामर्श और रिपोर्ट',
    newOPDVisit: 'नया ओपीडी विज़िट',
    saveChanges: 'बदलाव सहेजें',
    viewReport: 'रिपोर्ट देखें',
    consentDesk: 'सहमति डेस्क',

    // Landing
    startConsultation: 'मरीज परामर्श शुरू करें',
    doctorTimeSaved: 'डॉक्टर का समय बचा',
    clinicalAccuracy: 'नैदानिक सटीकता',
    intakeSpeed: 'प्रवेश गति',
    abdmLinked: 'आभा से संबद्ध',

    // Language
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',

    // Generic
    loading: 'लोड हो रहा है...',
    back: 'वापस',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    submit: 'सबमिट करें',
    search: 'खोजें',
    noData: 'कोई डेटा उपलब्ध नहीं',
  },
};

/**
 * Translate a key using the given language.
 * Falls back to English if key not found in selected language.
 */
export function t(key, lang = 'en') {
  return translations[lang]?.[key] || translations.en?.[key] || key;
}

export default translations;
