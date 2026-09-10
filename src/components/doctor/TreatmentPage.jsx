import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2, ClipboardCheck } from 'lucide-react';

const emptyMed = () => ({ name: '', dosage: '', frequency: '', duration: '' });

export default function TreatmentPage({ consultation, onBack, onComplete, onFinish }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([emptyMed()]);
  const [investigations, setInvestigations] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [dietaryAdvice, setDietaryAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateMed = (idx, field, value) => {
    setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const addMed = () => setMedicines(prev => [...prev, emptyMed()]);
  const removeMed = (idx) => setMedicines(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) return;
    setSubmitted(true);
    onComplete({
      token: consultation.token,
      diagnosis,
      medicines: medicines.filter(m => m.name.trim()),
      investigations,
      precautions,
      dietaryAdvice,
      followUpDate,
      followUpNotes,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-lg transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to OPD Report</span>
          </button>
          <span className="text-xs font-mono text-slate-500">{consultation.token} • {consultation.patient.fullName}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 page-enter">

        {submitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-3xl p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Treatment Completed</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              The consultation for <strong className="text-white">{consultation.patient.fullName}</strong> has been closed, the prescription saved, and the patient's timeline updated.
            </p>
            <button
              onClick={onFinish}
              className="mt-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl transition cursor-pointer"
            >
              Return to Queue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="flex items-center space-x-2">
              <ClipboardCheck className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">Treatment & Prescription</h1>
            </div>

            {/* Diagnosis */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Diagnosis *</label>
              <textarea
                rows={2}
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Atypical Angina / Stage 1 Essential Hypertension"
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Medicines */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Medicines (Rx)</label>
                <button
                  type="button"
                  onClick={addMed}
                  className="text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[2fr_1.3fr_1.3fr_1fr_auto] gap-2 items-center bg-slate-950 border border-slate-800 rounded-xl p-3">
                    <input
                      placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => updateMed(idx, 'name', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                    />
                    <input
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => updateMed(idx, 'dosage', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                    />
                    <input
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) => updateMed(idx, 'frequency', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                    />
                    <input
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => updateMed(idx, 'duration', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeMed(idx)}
                      disabled={medicines.length === 1}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed justify-self-end"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Investigations / Precautions / Diet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Investigations</label>
                <textarea
                  rows={3}
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  placeholder="e.g. CBC, ECG, Lipid Profile"
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400 resize-none"
                />
              </div>
              <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Precautions</label>
                <textarea
                  rows={3}
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  placeholder="e.g. Avoid strenuous exercise for 1 week"
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Dietary Advice</label>
              <textarea
                rows={2}
                value={dietaryAdvice}
                onChange={(e) => setDietaryAdvice(e.target.value)}
                placeholder="e.g. Low sodium diet, avoid fried foods"
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Follow up */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Follow-up Notes</label>
                <input
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Review BP and lipid panel"
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Treatment</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
