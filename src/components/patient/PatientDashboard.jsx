import React, { useState, useEffect, useRef } from 'react';
import {
  LogOut,
  ChevronDown,
  FileText,
  ClipboardList,
  UserCog,
  Upload,
  Pill,
  FolderOpen,
  Stethoscope,
  X,
  Plus,
  Trash2,
  Save,
  Globe,
  CheckCircle,
  Clock,
  Heart,
  Printer,
  Check,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function PatientDashboard({ patientData, setPatientData, onSignOut, lang, setLang }) {
  const [activePanel, setActivePanel] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    category: 'Signed Prescription Slip',
    file: null,
    fileName: '',
    clinicalNotes: ''
  });
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Document State ──────────────────────────────────────
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Discharge_Summary_AIIMS_2025.pdf', type: 'discharge', category: 'Discharge Card', size: '2.4 MB', date: '14 Jan 2025', status: 'Verified' },
    { id: 2, name: 'Cardiology_Rx_Dr_Sharma.pdf', type: 'prescription', category: 'Prescription', size: '840 KB', date: '02 Aug 2025', status: 'Verified' },
    { id: 3, name: 'Lipid_Profile_Report.pdf', type: 'lab', category: 'Lab Report', size: '1.1 MB', date: '28 Nov 2025', status: 'Verified' },
    { id: 4, name: 'ECG_Report_Fortis.pdf', type: 'lab', category: 'Lab Report', size: '3.2 MB', date: '15 Dec 2025', status: 'Pending' },
    { id: 5, name: 'Metformin_500mg_Rx.pdf', type: 'prescription', category: 'Prescription', size: '520 KB', date: '10 Jan 2026', status: 'Verified' },
    { id: 6, name: 'CBC_Blood_Test_2026.pdf', type: 'lab', category: 'Lab Report', size: '980 KB', date: '22 Jan 2026', status: 'Verified' },
    { id: 7, name: 'Amlodipine_5mg_Rx.pdf', type: 'prescription', category: 'Prescription', size: '410 KB', date: '05 Mar 2026', status: 'Verified' },
    { id: 8, name: 'X-Ray_Chest_PA.pdf', type: 'imaging', category: 'Imaging', size: '5.6 MB', date: '12 Apr 2026', status: 'Verified' },
  ]);

  const [docFilter, setDocFilter] = useState('all');

  // ── Medical History State ───────────────────────────────
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: ['Type 2 Diabetes Mellitus', 'Hypertension (Stage 1)'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    surgeries: ['Appendectomy (2018)', 'Dental extraction (2021)'],
    familyHistory: ['Father: Coronary artery disease', 'Mother: Type 2 Diabetes'],
    currentMedications: ['Metformin 500mg BD', 'Amlodipine 5mg OD', 'Atorvastatin 10mg HS'],
  });
  const [newItem, setNewItem] = useState({ field: '', value: '' });

  // ── Consultation History ────────────────────────────────
  const [consultations, setConsultations] = useState([
    { id: 'OPD-2301', date: '08 Sep 2026', doctor: 'Dr. S. K. Sharma', dept: 'Cardiology', complaint: 'Chest tightness, mild breathlessness on exertion', stream: 'Allopathic', status: 'Completed', notes: 'ECG normal sinus, stress test advised. Review in 2 weeks.' },
    { id: 'OPD-2287', date: '15 Aug 2026', doctor: 'Dr. Anita Patel', dept: 'General Medicine', complaint: 'Persistent dry cough, low-grade fever for 5 days', stream: 'Allopathic', status: 'Completed', notes: 'Viral URTI. Symptomatic Rx given. Cough resolved.' },
    { id: 'OPD-2265', date: '02 Jul 2026', doctor: 'Vd. Ramesh Joshi', dept: 'Ayurveda', complaint: 'Chronic indigestion, fatigue, poor appetite', stream: 'Ayurvedic', status: 'Completed', notes: 'Pitta-Vata imbalance. Dietary changes + Triphala advised.' },
    { id: 'OPD-2251', date: '18 Jun 2026', doctor: 'Dr. S. K. Sharma', dept: 'Cardiology', complaint: 'Follow-up: BP monitoring, medication review', stream: 'Allopathic', status: 'Completed', notes: 'BP controlled at 128/82. Continue current Rx.' },
    { id: 'OPD-2230', date: '25 May 2026', doctor: 'Dr. Neha Gupta', dept: 'Endocrinology', complaint: 'HbA1c review, fasting glucose elevated', stream: 'Allopathic', status: 'Completed', notes: 'HbA1c 7.2%. Metformin dose maintained. Diet counseling done.' },
  ]);

  // ── OPD Tab & Report State ──────────────────────────────
  const [opdView, setOpdView] = useState('form'); // 'form' or 'report'
  const [opdFormData, setOpdFormData] = useState({
    department: 'General Medicine',
    doctor: 'Dr. Anita Patel (MD, General Medicine)',
    stream: 'Allopathic',
    priority: 'Regular OPD',
    chiefComplaint: '',
    selectedSymptoms: ['Fever', 'Fatigue'],
    duration: '2-4 Days',
    severity: 'Moderate',
    notes: 'Mild body aches and throat irritation observed since morning.',
  });

  const [generatedReport, setGeneratedReport] = useState(null);

  const availableDoctors = {
    'General Medicine': 'Dr. Anita Patel (MD, General Medicine • Reg #MCI-39821)',
    'Cardiology': 'Dr. S. K. Sharma (MD, DM Cardiology • Reg #MCI-48291)',
    'Ayurveda / AYUSH': 'Vd. Ramesh Joshi (BAMS, Ayurveda Specialist • Reg #AY-19402)',
    'Endocrinology': 'Dr. Neha Gupta (MD, DNB Endocrinology • Reg #MCI-52109)',
    'Orthopedics': 'Dr. Vikram Malhotra (MS Orthopedics • Reg #MCI-31940)',
    'Pediatrics': 'Dr. Sunita Rao (MD Pediatrics • Reg #MCI-40192)',
  };

  const symptomList = [
    'Fever', 'Dry Cough', 'Chest Tightness', 'Shortness of Breath',
    'Headache', 'Indigestion / Acidity', 'Joint Pain', 'Fatigue',
    'Sore Throat', 'High Blood Sugar Symptoms', 'Dizziness', 'Skin Rash'
  ];

  const handleToggleSymptom = (sym) => {
    setOpdFormData(prev => {
      const exists = prev.selectedSymptoms.includes(sym);
      return {
        ...prev,
        selectedSymptoms: exists
          ? prev.selectedSymptoms.filter(s => s !== sym)
          : [...prev.selectedSymptoms, sym]
      };
    });
  };

  const handleDepartmentChange = (dept) => {
    const stream = dept.includes('Ayurveda') ? 'Ayurvedic' : 'Allopathic';
    setOpdFormData(prev => ({
      ...prev,
      department: dept,
      doctor: availableDoctors[dept] || prev.doctor,
      stream
    }));
  };

  // ── Generate OPD Report Logic ───────────────────────────
  const handleGenerateOpdReport = (e) => {
    if (e) e.preventDefault();

    // 1. Validate phone (must be exactly 10 digits)
    const cleanPhone = (patientData.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Error: Patient mobile number must be exactly 10 digits before booking OPD (currently: ' + (patientData.phone || 'empty') + '). Please update in personal details.');
      setActivePanel('details');
      return;
    }

    // 2. Validate email (must contain @)
    if (!patientData.email || !patientData.email.includes('@')) {
      alert('Error: Patient email must contain "@" (e.g., patient@healthvault.in). Please update in personal details.');
      setActivePanel('details');
      return;
    }

    const tokenNumber = `OPD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build intelligent Rx based on department/symptoms
    let rxList = [];
    let diagnosis = 'Acute Upper Respiratory Tract Infection (URTI)';
    let investigations = ['Complete Blood Count (CBC)', 'Erythrocyte Sedimentation Rate (ESR)'];
    let dietAdvice = 'Stay well hydrated with warm liquids. Light, easily digestible home-cooked meals.';

    if (opdFormData.department === 'Cardiology') {
      diagnosis = 'Atypical Angina / Stage 1 Essential Hypertension Evaluation';
      rxList = [
        { name: 'Tab. Amlodipine 5mg', dose: '1 tab once daily (OD) at bedtime', duration: '30 Days', instructions: 'Take with water after dinner' },
        { name: 'Tab. Atorvastatin 10mg', dose: '1 tab once daily (HS) at night', duration: '30 Days', instructions: 'Monitor lipid profile' },
        { name: 'Tab. Sorbitrate 5mg', dose: '1 tab Sublingual S.O.S', duration: 'As needed', instructions: 'Keep under tongue if acute chest discomfort occurs' }
      ];
      investigations = ['12-Lead Resting ECG', 'Fasting Lipid Profile', '2D Echocardiogram'];
      dietAdvice = 'Strict low sodium intake (< 2g/day). Avoid fried, oily, and high-cholesterol foods. Regular 30 min brisk walk.';
    } else if (opdFormData.department.includes('Ayurveda')) {
      diagnosis = 'Agnimandya (Impaired Digestive Fire) with Vata-Pitta Dushti';
      rxList = [
        { name: 'Triphala Churna 5g', dose: '1 tsp with lukewarm water at bedtime', duration: '21 Days', instructions: 'Take on empty stomach' },
        { name: 'Avipattikar Churna 3g', dose: '1/2 tsp before meals twice daily', duration: '14 Days', instructions: 'Take with warm water' },
        { name: 'Ashwagandharishta 15ml', dose: '15ml with equal quantity of water BD', duration: '30 Days', instructions: 'After lunch and dinner' }
      ];
      investigations = ['Liver Function Tests (LFT)', 'Stool Routine Examination'];
      dietAdvice = 'Consume freshly prepared warm sattvic food. Avoid stale, cold, acidic, and excessively spicy foods. Practice anulom-vilom pranayama.';
    } else if (opdFormData.department === 'Endocrinology') {
      diagnosis = 'Type 2 Diabetes Mellitus with Mild Hyperglycemia';
      rxList = [
        { name: 'Tab. Metformin 500mg SR', dose: '1 tab twice daily (BD) with meals', duration: '30 Days', instructions: 'Take immediately after morning & night food' },
        { name: 'Tab. Teneligliptin 20mg', dose: '1 tab once daily (OD) in morning', duration: '30 Days', instructions: 'After breakfast' },
        { name: 'Tab. Neurobion Forte', dose: '1 tab OD', duration: '30 Days', instructions: 'Post dinner' }
      ];
      investigations = ['Fasting & Postprandial Blood Sugar (FBS/PPBS)', 'HbA1c Glycated Hemoglobin', 'Urine Microalbumin'];
      dietAdvice = 'Strict low glycemic index diet. Avoid sugar, sweets, refined flours, and potatoes. Daily 45 minutes walking.';
    } else {
      // General Medicine
      rxList = [
        { name: 'Tab. Paracetamol 650mg', dose: '1 tab thrice daily (TDS) as needed', duration: '5 Days', instructions: 'Take after meals for fever/pain' },
        { name: 'Tab. Levocetirizine 5mg + Montelukast 10mg', dose: '1 tab once daily (HS) at night', duration: '7 Days', instructions: 'For cough, allergy, and throat relief' },
        { name: 'Syp. Ascoril D (100ml)', dose: '10ml thrice daily', duration: '5 Days', instructions: 'Gargle with warm saline water' }
      ];
      investigations = ['Complete Blood Count (CBC)', 'Dengue & Malaria rapid antigen if fever > 3 days'];
      dietAdvice = 'Rest adequately. Drink 3-4 liters of boiled water. Avoid cold beverages and air-conditioned draughts.';
    }

    const complaintSummary = opdFormData.selectedSymptoms.length > 0
      ? opdFormData.selectedSymptoms.join(', ') + (opdFormData.chiefComplaint ? ` — ${opdFormData.chiefComplaint}` : '')
      : opdFormData.chiefComplaint || 'Routine medical evaluation';

    const newReport = {
      token: tokenNumber,
      date: currentDate,
      time: currentTime,
      patient: { ...patientData, phone: cleanPhone },
      department: opdFormData.department,
      doctor: opdFormData.doctor,
      stream: opdFormData.stream,
      priority: opdFormData.priority,
      chiefComplaint: complaintSummary,
      duration: opdFormData.duration,
      severity: opdFormData.severity,
      notes: opdFormData.notes,
      diagnosis,
      prescriptions: rxList,
      investigations,
      dietAdvice,
      followUp: '7 Days (or immediately if symptoms aggravate)',
    };

    setGeneratedReport(newReport);
    setOpdView('report');

    // Add to consultations list
    setConsultations(prev => [
      {
        id: tokenNumber,
        date: currentDate,
        doctor: opdFormData.doctor.split('(')[0].trim(),
        dept: opdFormData.department,
        complaint: complaintSummary,
        stream: opdFormData.stream,
        status: 'Completed',
        notes: `${diagnosis}. Follow-up in 7 days.`
      },
      ...prev
    ]);

    // Automatically add to Health Vault documents
    const docEntry = {
      id: Date.now(),
      name: `${tokenNumber}_OPD_CaseSheet.pdf`,
      type: 'prescription',
      category: 'OPD Report',
      size: '1.4 MB',
      date: currentDate,
      status: 'Verified'
    };
    setDocuments(prev => [docEntry, ...prev]);
  };

  // ── Validation Helpers for Details Form ─────────────────
  const validateForm = () => {
    const errors = {};
    const cleanPhone = (patientData.phone || '').replace(/\D/g, '');

    if (!cleanPhone) {
      errors.phone = 'Mobile number is required';
    } else if (cleanPhone.length !== 10) {
      errors.phone = `Mobile number must be exactly 10 digits (currently ${cleanPhone.length} digits)`;
    }

    if (!patientData.email || !patientData.email.trim()) {
      errors.email = 'Email ID is required';
    } else if (!patientData.email.includes('@')) {
      errors.email = 'Email must contain "@" (e.g., patient@healthvault.in)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDetails = () => {
    if (!validateForm()) {
      return;
    }
    setSaveSuccessMessage('Details saved successfully! Mobile (10 digits) & Email (@ checked) verified.');
    setTimeout(() => setSaveSuccessMessage(''), 4000);
  };

  const handleAddHistoryItem = (field) => {
    if (!newItem.value.trim()) return;
    setMedicalHistory(prev => ({
      ...prev,
      [field]: [...prev[field], newItem.value.trim()]
    }));
    setNewItem({ field: '', value: '' });
  };

  const handleRemoveHistoryItem = (field, idx) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));
  };

  const handleUploadSubmit = (e) => {
    if (e) e.preventDefault();
    const docTitle = uploadFormData.title.trim() || uploadFormData.category;
    const categoryTypeMap = {
      'Signed Prescription Slip': 'prescription',
      'Lab Investigation Order': 'lab',
      'Discharge Summary': 'discharge',
      'Radiology / Imaging': 'imaging',
      'Clinical Consultation Note': 'prescription',
      'Other Medical Record': 'lab'
    };

    const newDoc = {
      id: Date.now(),
      name: uploadFormData.fileName || `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
      type: categoryTypeMap[uploadFormData.category] || 'prescription',
      category: uploadFormData.category,
      size: uploadFormData.file ? `${(uploadFormData.file.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Verified',
      notes: uploadFormData.clinicalNotes
    };

    setDocuments(prev => [newDoc, ...prev]);
    setShowUploadModal(false);
    setUploadFormData({
      title: '',
      category: 'Signed Prescription Slip',
      file: null,
      fileName: '',
      clinicalNotes: ''
    });
  };

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const filteredDocs = docFilter === 'all'
    ? documents
    : documents.filter(d => d.type === docFilter);

  const initials = patientData.fullName
    ? patientData.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'PT';

  const cleanCurrentPhone = (patientData.phone || '').replace(/\D/g, '');
  const isPhoneValid = cleanCurrentPhone.length === 10;
  const isEmailValid = patientData.email && patientData.email.includes('@');

  // ── Profile Dropdown Menu Items ─────────────────────────
  const menuItems = [
    { id: 'overview', icon: ClipboardList, label: lang === 'en' ? 'Dashboard' : 'डैशबोर्ड', color: 'text-blue-600' },
    { id: 'opd', icon: Stethoscope, label: lang === 'en' ? 'OPD Consultation & Reports' : 'ओपीडी परामर्श और रिपोर्ट', color: 'text-emerald-600', badge: 'Active' },
    { id: 'details', icon: UserCog, label: lang === 'en' ? 'Add / Edit Details' : 'विवरण जोड़ें', color: 'text-teal-600' },
    { id: 'history', icon: Heart, label: lang === 'en' ? 'Medical History' : 'चिकित्सा इतिहास', color: 'text-rose-500' },
    { id: 'documents', icon: Upload, label: lang === 'en' ? 'Upload Documents' : 'दस्तावेज़ अपलोड', color: 'text-amber-600' },
    { id: 'prescriptions', icon: Pill, label: lang === 'en' ? 'Past Prescriptions' : 'पिछले प्रिस्क्रिप्शन', color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">

      {/* ── Header ──────── */}
      <header className="sticky top-0 z-50 shadow-lg" style={{ background: 'linear-gradient(135deg, #0d3b2e 0%, #134e3a 50%, #1a5e4a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Left: Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActivePanel('overview')}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white font-extrabold text-sm transition cursor-pointer"
            >
              MK
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base sm:text-lg tracking-tight">MediKiosk Patient Suite</span>
                <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70 hidden sm:block">ABDM Integrated Health Records & OPD Portal</p>
            </div>
          </div>

          {/* Center Navigation Tabs: Direct Access */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActivePanel('overview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activePanel === 'overview'
                  ? 'bg-white text-teal-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Dashboard' : 'डैशबोर्ड'}</span>
            </button>

            <button
              onClick={() => { setActivePanel('opd'); setOpdView('form'); }}
              className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activePanel === 'opd'
                  ? 'bg-emerald-400 text-teal-950 shadow-md font-extrabold'
                  : 'text-emerald-200 hover:text-white hover:bg-white/10 border border-emerald-400/30 bg-emerald-900/30'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'OPD' : 'ओपीडी'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping absolute -top-0.5 -right-0.5" />
            </button>

            <button
              onClick={() => { setActivePanel('documents'); setShowUploadModal(true); }}
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activePanel === 'documents'
                  ? 'bg-white text-teal-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Vault' : 'वॉल्ट'}</span>
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Language */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/10 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Profile Area (Clickable) */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(v => !v)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/15 pl-2.5 sm:pl-3 pr-2 py-1.5 rounded-xl transition cursor-pointer"
              >
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-white leading-none">{patientData.fullName}</div>
                  <div className="text-[11px] text-emerald-200/70 leading-tight truncate max-w-[120px]">{patientData.email}</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow">
                  {initials}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* ── Profile Dropdown Menu ──────────────── */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
                  {/* User info header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow">
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-slate-800 truncate">{patientData.fullName}</div>
                        <div className="text-xs text-slate-500 truncate">{patientData.email}</div>
                        <div className="text-[11px] text-teal-700 font-mono mt-0.5">Mob: {cleanCurrentPhone || 'Not set'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePanel(item.id);
                          if (item.id === 'opd' && !generatedReport) {
                            setOpdView('form');
                          }
                          if (item.id === 'documents') {
                            setShowUploadModal(true);
                          }
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition cursor-pointer ${
                          activePanel === item.id
                            ? 'bg-teal-50 text-teal-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${activePanel === item.id ? 'text-teal-600' : item.color}`} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {activePanel === item.id && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                      </button>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-200 p-1.5">
                    <button
                      onClick={onSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold">{lang === 'en' ? 'Sign Out' : 'साइन आउट'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sign Out Button (desktop) */}
            <button
              onClick={onSignOut}
              className="hidden lg:flex items-center space-x-1.5 bg-red-500/90 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer shadow"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">

        {activePanel === 'overview' && (
          <div className="space-y-6 page-enter">

            {/* OPD Quick Action Banner */}
            <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-teal-950 text-xs font-black uppercase tracking-wider">
                    OPD Desk
                  </span>
                  <span className="text-xs text-emerald-200">ABDM e-Prescription Active</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Need a Clinical Consultation?</h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
                  Book an OPD appointment, consult with specialized doctors (Allopathic & AYUSH), and instantly receive your official digital OPD Report.
                </p>
              </div>
              <button
                onClick={() => { setActivePanel('opd'); setOpdView('form'); }}
                className="bg-white hover:bg-emerald-50 text-teal-900 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer self-start md:self-auto shrink-0"
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Start OPD Consultation &rarr;</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Consultations', val: consultations.length, sub: 'OPD visits on file', color: 'border-teal-500', icon: Stethoscope, iconBg: 'bg-teal-50 text-teal-600' },
                { label: 'OPD Prescriptions', val: documents.filter(d => d.type === 'prescription').length, sub: 'Active Rx documents', color: 'border-blue-500', icon: Pill, iconBg: 'bg-blue-50 text-blue-600' },
                { label: 'Health Documents', val: documents.length, sub: 'In your Health Vault', color: 'border-emerald-500', icon: FolderOpen, iconBg: 'bg-emerald-50 text-emerald-600' },
                { label: 'Pending Reports', val: documents.filter(d => d.status === 'Pending').length, sub: 'Awaiting doctor sign', color: 'border-amber-500', icon: Clock, iconBg: 'bg-amber-50 text-amber-600' },
              ].map((stat, idx) => (
                <div key={idx} className={`bg-white rounded-xl border-l-4 ${stat.color} border border-slate-200 p-5 shadow-sm flex items-start justify-between`}>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{stat.label}</div>
                    <div className="text-3xl font-extrabold text-slate-900">{stat.val}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Consultation History Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === 'en' ? 'Consultation & OPD History' : 'परामर्श व ओपीडी इतिहास'}
                  </h2>
                  <p className="text-xs text-slate-500">{lang === 'en' ? 'All your recorded OPD visits, clinical notes, and generated case reports' : 'आपकी सभी पिछली ओपीडी विजिट'}</p>
                </div>
                <button
                  onClick={() => { setActivePanel('opd'); setOpdView('form'); }}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New OPD Visit</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                      <th className="px-5 py-3 text-left">Token</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Doctor & Specialization</th>
                      <th className="px-5 py-3 text-left">Stream</th>
                      <th className="px-5 py-3 text-left">Chief Complaint</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-right">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {consultations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-4 font-bold text-teal-700 whitespace-nowrap">{c.id}</td>
                        <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{c.date}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">{c.doctor}</div>
                          <div className="text-xs text-slate-400">{c.dept}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            c.stream === 'Allopathic'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {c.stream}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 max-w-xs">
                          <div className="truncate font-medium">{c.complaint}</div>
                          <div className="text-xs text-slate-400 mt-0.5 truncate italic">{c.notes}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{c.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              if (generatedReport && generatedReport.token === c.id) {
                                setActivePanel('opd');
                                setOpdView('report');
                              } else {
                                handleDepartmentChange(c.dept);
                                setOpdFormData(prev => ({ ...prev, chiefComplaint: c.complaint, notes: c.notes }));
                                setActivePanel('opd');
                                setOpdView('form');
                              }
                            }}
                            className="text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition cursor-pointer"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'opd' && (
          <div className="space-y-6 page-enter">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-bold text-slate-900">
                    {lang === 'en' ? 'OPD Clinical Consultation Desk' : 'ओपीडी परामर्श डेस्क'}
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {lang === 'en'
                    ? 'Submit symptoms to consult with doctors and generate an official ABDM OPD Report'
                    : 'लक्षण दर्ज करें और आधिकारिक ओपीडी रिपोर्ट प्राप्त करें'}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  onClick={() => setOpdView('form')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    opdView === 'form'
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  New OPD Consultation
                </button>
                {generatedReport && (
                  <button
                    onClick={() => setOpdView('report')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      opdView === 'report'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    View OPD Report ({generatedReport.token})
                  </button>
                )}
              </div>
            </div>

            {opdView === 'form' && (
              <form onSubmit={handleGenerateOpdReport} className="space-y-6">

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Patient Profile Verification</span>
                    <button
                      type="button"
                      onClick={() => setActivePanel('details')}
                      className="text-xs font-bold text-teal-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Edit Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block font-semibold">Patient Name</span>
                      <span className="font-bold text-slate-800 text-sm">{patientData.fullName}</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isPhoneValid ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50 border-red-300'}`}>
                      <span className="text-slate-500 block font-semibold">Mobile Number (10 Digits)</span>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {cleanCurrentPhone || 'Missing phone'}
                        </span>
                        {isPhoneValid ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">✓ 10 Digits</span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">⚠️ Must be 10 Digits</span>
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${isEmailValid ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50 border-red-300'}`}>
                      <span className="text-slate-500 block font-semibold">Email ID (Contains @)</span>
                      <div className="flex items-center space-x-1.5 mt-0.5 truncate">
                        <span className="font-mono font-bold text-slate-900 text-sm truncate">
                          {patientData.email || 'Missing email'}
                        </span>
                        {isEmailValid ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded shrink-0">✓ Valid @</span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded shrink-0">⚠️ Missing @</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block font-semibold">ABHA ID / Blood</span>
                      <span className="font-mono font-bold text-slate-800 text-xs truncate block">{patientData.abhaId} • {patientData.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block border-b border-slate-100 pb-2">
                    2. Select Department & Consulting Doctor
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(availableDoctors).map((dept) => {
                      const isSelected = opdFormData.department === dept;
                      const isAyush = dept.includes('Ayurveda');
                      return (
                        <div
                          key={dept}
                          onClick={() => handleDepartmentChange(dept)}
                          className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{dept}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAyush ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isAyush ? 'AYUSH' : 'Allopathic'}
                            </span>
                          </div>
                          <div className="font-bold text-slate-800 text-sm">{availableDoctors[dept].split('(')[0]}</div>
                          <div className="text-xs text-slate-500 mt-1 truncate">{availableDoctors[dept]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block border-b border-slate-100 pb-2">
                    3. Chief Complaint & Symptoms
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Select Presenting Symptoms (Click to toggle):</label>
                    <div className="flex flex-wrap gap-2">
                      {symptomList.map((sym) => {
                        const isSelected = opdFormData.selectedSymptoms.includes(sym);
                        return (
                          <button
                            type="button"
                            key={sym}
                            onClick={() => handleToggleSymptom(sym)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'bg-teal-700 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Duration of Symptoms
                      </label>
                      <select
                        value={opdFormData.duration}
                        onChange={(e) => setOpdFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 outline-none bg-white"
                      >
                        <option value="1-2 Days">1 - 2 Days</option>
                        <option value="2-4 Days">2 - 4 Days</option>
                        <option value="1 Week">1 Week</option>
                        <option value="2 Weeks+">2 Weeks or more</option>
                        <option value="Chronic (> 1 Month)">Chronic (&gt; 1 Month)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Severity Level
                      </label>
                      <select
                        value={opdFormData.severity}
                        onChange={(e) => setOpdFormData(prev => ({ ...prev, severity: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 outline-none bg-white"
                      >
                        <option value="Mild">Mild (Tolerable, regular daily activities)</option>
                        <option value="Moderate">Moderate (Discomfort, disturbed sleep)</option>
                        <option value="Severe">Severe (Urgent clinical review)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Specific Chief Complaint / Notes for Doctor
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what you are experiencing in your own words..."
                      value={opdFormData.chiefComplaint}
                      onChange={(e) => setOpdFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Ready to generate your OPD Case Report?</h3>
                    <p className="text-xs text-slate-500">
                      An official digital OPD Report with consultation summary, diagnosis, and prescription will be created.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer shrink-0"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate OPD Report</span>
                  </button>
                </div>
              </form>
            )}

            {opdView === 'report' && generatedReport && (
              <div className="space-y-6">

                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-sm font-bold text-slate-800">OPD Consultation Report Generated</span>
                      <span className="text-xs text-slate-400 block">Token: {generatedReport.token} • Saved to Health Vault</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Download PDF</span>
                    </button>
                    <button
                      onClick={() => { setOpdView('form'); }}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-3.5 py-2 rounded-lg border border-teal-200 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Consultation</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6">

                  <div className="border-b-2 border-teal-700 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-xl bg-teal-800 text-white font-extrabold flex items-center justify-center text-base shadow">
                          MK
                        </div>
                        <div>
                          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            MEDIKIOSK MULTI-SPECIALTY CLINIC & OPD SUITE
                          </h1>
                          <p className="text-xs font-semibold text-teal-700">
                            Ayushman Bharat Digital Mission (ABDM) Integrated Health Facility • HFID: IN-27-0914-MH
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        42, MG Road Healthcare Enclave, Pune, Maharashtra 411001 • Phone: 1800-419-2026 • Email: opd.desk@medikiosk.in
                      </p>
                    </div>

                    <div className="text-right self-end sm:self-auto shrink-0">
                      <span className="inline-block bg-teal-50 border border-teal-300 text-teal-800 font-mono font-bold text-xs px-3 py-1 rounded-lg">
                        {generatedReport.token}
                      </span>
                      <div className="text-xs text-slate-500 mt-1">{generatedReport.date} • {generatedReport.time}</div>
                    </div>
                  </div>

                  <div className="text-center py-1 bg-slate-100 rounded-lg border border-slate-200">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                      OUTPATIENT DEPARTMENT (OPD) CONSULTATION REPORT & Rx
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold">Patient Name</span>
                      <span className="font-bold text-slate-900 text-sm">{generatedReport.patient.fullName}</span>
                      <span className="text-slate-500 block mt-0.5">{generatedReport.patient.age} Yrs / {generatedReport.patient.gender}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Mobile Number</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{generatedReport.patient.phone}</span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">✓ Verified (10 Digits)</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Email ID</span>
                      <span className="font-mono font-bold text-slate-900 truncate block">{generatedReport.patient.email}</span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">✓ Verified (@ Checked)</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">ABHA ID / Blood</span>
                      <span className="font-mono font-bold text-slate-900 block">{generatedReport.patient.abhaId}</span>
                      <span className="text-slate-500 block">Group: <strong className="text-slate-800">{generatedReport.patient.bloodGroup}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-teal-200 bg-teal-50/40 text-xs gap-2">
                    <div>
                      <span className="text-teal-700 font-bold uppercase tracking-wider block text-[10px]">Consulting Physician</span>
                      <span className="font-extrabold text-slate-900 text-sm">{generatedReport.doctor}</span>
                      <span className="text-slate-500 block">{generatedReport.department} • Stream: {generatedReport.stream}</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Type</span>
                      <span className="font-bold text-teal-800">{generatedReport.priority}</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-white">
                        <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block mb-1">Chief Complaints & Duration</span>
                        <div className="font-bold text-slate-800 text-sm">{generatedReport.chiefComplaint}</div>
                        <div className="text-slate-500 mt-1">Duration: {generatedReport.duration} • Severity: {generatedReport.severity}</div>
                        {generatedReport.notes && (
                          <div className="text-slate-600 mt-1 italic">Notes: {generatedReport.notes}</div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                        <span className="font-bold text-blue-800 uppercase text-[10px] tracking-wider block mb-1">Provisional Clinical Diagnosis</span>
                        <div className="font-extrabold text-blue-950 text-sm">{generatedReport.diagnosis}</div>
                        <div className="text-blue-700 text-[11px] mt-1">Evaluated as per standard clinical OPD protocol.</div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center space-x-2">
                        <Pill className="w-4 h-4 text-teal-700" />
                        <span className="font-black text-xs uppercase tracking-wider text-slate-800">Rx — Prescribed Medicines</span>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Medicine & Strength</th>
                            <th className="px-4 py-2 text-left">Dosage & Frequency</th>
                            <th className="px-4 py-2 text-left">Duration</th>
                            <th className="px-4 py-2 text-left">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {generatedReport.prescriptions.map((med, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2.5 font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-2.5 font-bold text-slate-800">{med.name}</td>
                              <td className="px-4 py-2.5 text-slate-600">{med.dose}</td>
                              <td className="px-4 py-2.5 font-semibold text-teal-700">{med.duration}</td>
                              <td className="px-4 py-2.5 text-slate-500">{med.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1.5">Investigations Advised</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {generatedReport.investigations.map((inv, i) => (
                            <li key={i}><span className="font-medium text-slate-800">{inv}</span></li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1.5">Dietary & Lifestyle Advice</span>
                        <p className="text-slate-600 leading-relaxed">{generatedReport.dietAdvice}</p>
                        <div className="mt-2 pt-2 border-t border-slate-200 text-slate-700 font-semibold">
                          Follow-up Review: <span className="text-teal-700 font-bold">{generatedReport.followUp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Digitally Signed via ABDM Secure Gateway</span>
                      </div>
                      <div>Compliance: Digital Personal Data Protection (DPDP) Act 2023</div>
                      <div>Document Hash: SHA256-e89c-4820-b19a-{generatedReport.token}</div>
                    </div>

                    <div className="text-right self-end sm:self-auto border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                      <div className="font-serif italic font-bold text-teal-800 text-base">
                        {generatedReport.doctor.split('(')[0]}
                      </div>
                      <div className="text-[11px] font-bold text-slate-600">Authorized Clinical Signatory</div>
                      <div className="text-[10px] text-slate-400">MediKiosk Health System • Pune Center</div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {activePanel === 'details' && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{lang === 'en' ? 'Personal Details' : 'व्यक्तिगत विवरण'}</h2>
                <p className="text-sm text-slate-500">
                  {lang === 'en'
                    ? 'Update profile. Note: Mobile number must be exactly 10 digits and Email must contain "@"'
                    : 'अपनी प्रोफ़ाइल और संपर्क जानकारी अपडेट करें'}
                </p>
              </div>
              <button
                onClick={() => setActivePanel('overview')}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            {saveSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-4 rounded-xl flex items-center space-x-2 animate-scale-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={patientData.fullName || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Email ID (Must contain @)</label>
                    {isEmailValid ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Valid Email</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Requires @</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    placeholder="e.g. rajesh.kumar@healthvault.in"
                    value={patientData.email || ''}
                    onChange={(e) => {
                      setPatientData(prev => ({ ...prev, email: e.target.value }));
                      if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: null }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 outline-none transition ${
                      validationErrors.email || (!isEmailValid && patientData.email)
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.email}</p>
                  )}
                  {!validationErrors.email && !patientData.email?.includes('@') && patientData.email && (
                    <p className="text-xs text-amber-600 mt-1">Please include '@' in your email address.</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Mobile Number (10 Digits)</label>
                    {isPhoneValid ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>10 Digits ✓</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600">
                        {cleanCurrentPhone.length}/10 Digits
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-xs font-mono font-bold select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={cleanCurrentPhone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPatientData(prev => ({ ...prev, phone: digitsOnly }));
                        if (validationErrors.phone) setValidationErrors(prev => ({ ...prev, phone: null }));
                      }}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm font-mono text-slate-800 outline-none transition ${
                        validationErrors.phone || (!isPhoneValid && cleanCurrentPhone.length > 0)
                          ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                      }`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.phone}</p>
                  )}
                  {!validationErrors.phone && cleanCurrentPhone.length !== 10 && (
                    <p className="text-xs text-slate-400 mt-1">Must be exactly 10 digits without prefix.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Age (Years)</label>
                  <input
                    type="number"
                    value={patientData.age || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Gender</label>
                  <select
                    value={patientData.gender || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white cursor-pointer"
                  >
                    {['Male', 'Female', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Blood Group</label>
                  <select
                    value={patientData.bloodGroup || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white cursor-pointer"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">ABHA Health ID</label>
                  <input
                    type="text"
                    value={patientData.abhaId || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, abhaId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Emergency Contact Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543211"
                    value={patientData.emergencyContact || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Address</label>
                  <textarea
                    value={patientData.address || ''}
                    onChange={(e) => setPatientData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Save Changes' : 'बदलाव सहेजें'}</span>
                </button>

                <div className="text-xs text-slate-400">
                  Ensures ABDM compliance for 10-digit mobile &amp; email delivery.
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'history' && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{lang === 'en' ? 'Medical History' : 'चिकित्सा इतिहास'}</h2>
                <p className="text-sm text-slate-500">{lang === 'en' ? 'Update your medical conditions, allergies, and medications' : 'अपनी बीमारियों, एलर्जी और दवाओं को अपडेट करें'}</p>
              </div>
              <button onClick={() => setActivePanel('overview')} className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer">
                <X className="w-3.5 h-3.5" /><span>Back</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                { field: 'conditions', title: lang === 'en' ? 'Known Conditions' : 'ज्ञात बीमारियाँ', color: 'border-rose-400', tagColor: 'bg-rose-50 text-rose-700 border-rose-200' },
                { field: 'allergies', title: lang === 'en' ? 'Allergies' : 'एलर्जी', color: 'border-amber-400', tagColor: 'bg-amber-50 text-amber-700 border-amber-200' },
                { field: 'surgeries', title: lang === 'en' ? 'Past Surgeries' : 'पिछली सर्जरी', color: 'border-blue-400', tagColor: 'bg-blue-50 text-blue-700 border-blue-200' },
                { field: 'familyHistory', title: lang === 'en' ? 'Family History' : 'पारिवारिक इतिहास', color: 'border-purple-400', tagColor: 'bg-purple-50 text-purple-700 border-purple-200' },
                { field: 'currentMedications', title: lang === 'en' ? 'Current Medications' : 'वर्तमान दवाएं', color: 'border-teal-400', tagColor: 'bg-teal-50 text-teal-700 border-teal-200' },
              ].map((section) => (
                <div key={section.field} className={`bg-white rounded-2xl border border-slate-200 ${section.color} border-l-4 shadow-sm p-5 space-y-3`}>
                  <h3 className="font-bold text-sm text-slate-800">{section.title}</h3>

                  <div className="flex flex-wrap gap-2">
                    {medicalHistory[section.field].map((item, idx) => (
                      <span key={idx} className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${section.tagColor}`}>
                        <span>{item}</span>
                        <button onClick={() => handleRemoveHistoryItem(section.field, idx)} className="hover:text-red-600 transition cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder={`Add new ${section.title.toLowerCase()}...`}
                      value={newItem.field === section.field ? newItem.value : ''}
                      onChange={(e) => setNewItem({ field: section.field, value: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddHistoryItem(section.field)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:border-teal-500 outline-none"
                    />
                    <button
                      onClick={() => handleAddHistoryItem(section.field)}
                      className="p-2 bg-slate-100 hover:bg-teal-50 rounded-lg text-slate-500 hover:text-teal-600 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePanel === 'documents' && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{lang === 'en' ? 'Upload Documents & Health Vault' : 'दस्तावेज़ अपलोड और हेल्थ वॉल्ट'}</h2>
                <p className="text-sm text-slate-500">{lang === 'en' ? 'Manage your medical documents — prescriptions, lab reports, imaging, OPD case reports' : 'अपने मेडिकल दस्तावेज़ प्रबंधित करें'}</p>
              </div>
              <button onClick={() => setActivePanel('overview')} className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer">
                <X className="w-3.5 h-3.5" /><span>Back</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#E6F7F9" />
                    <path d="M9 22V10C9 8.89543 9.89543 8 11 8H21C22.1046 8 23 8.89543 23 10V22C23 23.1046 22.1046 24 21 24H11C9.89543 24 9 23.1046 9 22Z" fill="#3B82F6" fillOpacity="0.2" stroke="#2563EB" strokeWidth="1.5" />
                    <path d="M16 19V13M16 13L13 16M16 13L19 16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload Document For {patientData.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    This file will be transmitted into the patient's records vault.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#0d5c4b] hover:bg-[#09473a] text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M12 18v-4" />
                  <path d="m9 16 3-3 3 3" />
                </svg>
                <span>+ Upload Document</span>
              </button>
            </div>

            {showUploadModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">

                  <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm shrink-0">
                        <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                          <rect width="32" height="32" rx="8" fill="#E6F7F9" />
                          <path d="M9 22V10C9 8.89543 9.89543 8 11 8H21C22.1046 8 23 8.89543 23 10V22C23 23.1046 22.1046 24 21 24H11C9.89543 24 9 23.1046 9 22Z" fill="#3B82F6" fillOpacity="0.2" stroke="#2563EB" strokeWidth="1.5" />
                          <path d="M16 19V13M16 13L13 16M16 13L19 16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          Upload Document For {patientData.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          This file will be transmitted into the patient's records vault.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Document / Slip Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Signed Prescription Slip / Lab Investigation Order"
                        value={uploadFormData.title}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Document Category
                        </label>
                        <select
                          value={uploadFormData.category}
                          onChange={(e) => setUploadFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white cursor-pointer"
                        >
                          <option value="Signed Prescription Slip">Signed Prescription Slip</option>
                          <option value="Lab Investigation Order">Lab Investigation Order</option>
                          <option value="Discharge Summary">Discharge Summary</option>
                          <option value="Radiology / Imaging">Radiology / Imaging</option>
                          <option value="Clinical Consultation Note">Clinical Consultation Note</option>
                          <option value="Other Medical Record">Other Medical Record</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Attach Local PDF/Scan (Optional)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.dcm"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadFormData(prev => ({
                                ...prev,
                                file: e.target.files[0],
                                fileName: e.target.files[0].name
                              }));
                            }
                          }}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-xl py-1 px-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Clinical Notes / Summary for Patient
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Instructions or diagnosis summary that will appear on patient's kiosk/app..."
                        value={uploadFormData.clinicalNotes}
                        onChange={(e) => setUploadFormData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition resize-none"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0d5c4b] hover:bg-[#09473a] text-white font-bold text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                          <path d="M12 18v-4" />
                          <path d="m9 16 3-3 3 3" />
                        </svg>
                        <span>Send & Upload to Patient</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Documents' },
                { id: 'prescription', label: 'Prescriptions & OPD' },
                { id: 'lab', label: 'Lab Reports' },
                { id: 'imaging', label: 'Imaging' },
                { id: 'discharge', label: 'Discharge Cards' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDocFilter(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    docFilter === tab.id
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">No documents found in this category.</div>
                ) : (
                  filteredDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          doc.type === 'prescription' ? 'bg-purple-50 text-purple-600' :
                          doc.type === 'lab' ? 'bg-blue-50 text-blue-600' :
                          doc.type === 'imaging' ? 'bg-cyan-50 text-cyan-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{doc.name}</div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.date}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">{doc.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          doc.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {doc.status}
                        </span>
                        <button onClick={() => handleDeleteDoc(doc.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activePanel === 'prescriptions' && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{lang === 'en' ? 'Past Prescriptions' : 'पिछले प्रिस्क्रिप्शन'}</h2>
                <p className="text-sm text-slate-500">{lang === 'en' ? 'All your prescription documents segregated for quick reference' : 'त्वरित संदर्भ हेतु सभी प्रिस्क्रिप्शन'}</p>
              </div>
              <button onClick={() => setActivePanel('overview')} className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer">
                <X className="w-3.5 h-3.5" /><span>Back</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-purple-50/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-bold text-purple-800">
                    {documents.filter(d => d.type === 'prescription').length} Prescription Documents Found
                  </span>
                </div>
                <button
                  onClick={() => { setActivePanel('opd'); setOpdView('form'); }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-white border border-teal-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  + Generate New Prescription via OPD
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {documents.filter(d => d.type === 'prescription').map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{doc.name}</div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-mono text-[10px]">{doc.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {doc.status}
                      </span>
                      <button onClick={() => handleDeleteDoc(doc.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-800">{lang === 'en' ? 'Consultations That Issued Prescriptions' : 'प्रिस्क्रिप्शन जारी करने वाले परामर्श'}</h3>
              <div className="space-y-3">
                {consultations.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{c.doctor} — {c.dept}</div>
                        <div className="text-xs text-slate-400">{c.date} • {c.id}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Rx Issued</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-200 bg-white py-4 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© 2026 MediKiosk Health Tech • ABDM Sandbox v2.4 • DPDP Act 2023 Compliant</span>
          <span>All medical records are end-to-end encrypted and HIPAA grade secured.</span>
        </div>
      </footer>
    </div>
  );
}
