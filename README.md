# MediKiosk — AI-Powered OPD Intake (Frontend Prototype)

A working React + Vite + Tailwind prototype of the MediKiosk patient-intake and
doctor-console flow, wired end-to-end with in-memory state so the whole demo
works out of the box — and with Supabase integration points ready for you to
plug in your real project.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Add your Supabase project (optional but recommended)

1. Open `.env` in the project root.
2. Replace the two placeholder values:
   ```
   VITE_SUPABASE_URL=INSERT_YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=INSERT_YOUR_SUPABASE_ANON_KEY
   ```
3. Restart `npm run dev`.

The app runs perfectly **without** real keys — every screen falls back to
local/mock data (`src/supabaseClient.js` handles this automatically), which is
exactly what you want for a live demo where you don't want a flaky network
call to break the flow. Once real keys are added, the following writes start
hitting your database automatically:

- Patient registration → `patients`
- AI interview transmit → `ai_conversations`, `consultations`
- Treatment completion → `treatments`, `patient_histories`

Everything else (auth screens, the doctor queue, the OPD report, the consent
desk) runs on in-memory React state shared through `src/App.jsx`, matching the
"working prototype" scope of the brief.

## What's in the demo flow

- **Landing page** → "Start Patient Consultation" begins a new AI-interview intake.
- **Patient registration** (ABHA-style) → **AI Interview** (SOCRATES / AYUSH,
  red-flag keyword detection) → **Summary & Transmit**, which generates a
  `MEDI-####` keyword.
- **Reception Desk** (top nav) — enter that keyword to grant consent; the case
  then appears in the doctor's queue.
- **Doctor Login** → **Dashboard** (live stats + queue) → **View OPD** (AI
  summary + patient timeline) → **Start Treatment** → **Complete Treatment**,
  which closes the case and updates the queue.
- **Patient Login** (existing patient) → full **Patient Suite** dashboard:
  profile, a second independent mock "OPD Desk" flow, medical history editor,
  document vault with upload modal, and past prescriptions — matches the
  brief's "mock UI, no backend required" sections.

Demo credentials are shown directly on both login screens.

## Project structure

```
src/
  App.jsx                     — screen router + shared in-memory "database"
  supabaseClient.js           — Supabase client with safe fallback
  components/
    patient/                  — landing, login, registration, AI interview,
                                 summary/transmit, full patient dashboard
    doctor/                   — doctor login, dashboard, OPD report, treatment
    shared/                   — reception consent-verification desk
```

## Building for production

```bash
npm run build
npm run preview
```
