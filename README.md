# Risk Manager

A full-stack **Risk Manager** web application for large-scale **data center
construction projects**, hosted on **Google Firebase**. The UI is inspired by
the Microsoft Planner task-detail panel: a two-column layout with a risk detail
form on the left and a contextual, dual-mode chat panel on the right.

It manages construction project risks end-to-end — identification, assessment,
mitigation tracking, and resolution — with real-time team chat and an embedded
AI agent named **Risk Manager**.

---

## Tech stack

| Layer       | Technology                                                     |
| ----------- | -------------------------------------------------------------- |
| Frontend    | React 18 + TypeScript + Vite                                   |
| Styling     | Tailwind CSS (custom components, no UI kit)                    |
| State       | Zustand                                                        |
| Routing     | React Router v6                                                |
| Icons       | Lucide React                                                   |
| Backend     | Firebase Firestore, Auth, Storage                             |
| AI agent    | Google Gemini (`gemini-2.0-flash`) called from the frontend   |

The AI chat is powered by Google Gemini, called directly from the frontend in
`src/services/geminiService.ts` using `VITE_GEMINI_API_KEY`. The user must be
signed in for the AI chat to run.

> A legacy Anthropic/Cloud Function implementation remains at
> `functions/src/index.ts` for reference but is **no longer used** by the app
> (Firebase Functions requires the paid Blaze plan).

---

## Project structure

```
src/
  components/
    risk/      RiskPanel, RiskHeader, RiskStatusBar, RiskMetadata,
               RiskChecklist, RiskNotes, RiskAttachments,
               InvolvedPartiesCard, WorkstreamLookup, RiskCard
    chat/      ChatPanel, ChatMessages, ChatInput, ChatModeToggle
    AppShell.tsx
  pages/       Dashboard, RiskDetail, RolesResponsibility, Login
  firebase/    config, firestore, auth, storage, agent
  store/       riskStore, chatStore, authStore (Zustand)
  lib/         format, toast, seed, seedData
functions/
  src/index.ts AI agent proxy Cloud Function
scripts/
  seed.ts      Standalone admin seed script (ts-node)
```

---

## Getting started

### 1. Install dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Create a Firebase project

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication → Email/Password**.
3. Create a **Firestore** database (production mode).
4. Enable **Storage**.
5. Register a **Web app** and copy its config.

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in the `VITE_FIREBASE_*` values from your Web app config. Update
`.firebaserc` with your real project id (replace `risk-manager-app`).

### 4. Configure the Gemini API key

Add your key to `.env` (get one at https://aistudio.google.com/app/apikey):

```bash
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Because the call is made from the browser, this key is shipped to the client —
restrict it to the Generative Language API and your Hosting domain in the Google
Cloud console, and never commit `.env`.

### 5. Run locally

```bash
npm run dev
```

The app seeds demo data automatically on first sign-in when Firestore is empty
(1 project, 3 workstreams, 5 R&R entries, 3 risks).

To run against the full local emulator suite instead of live Firebase, set
`VITE_USE_EMULATORS=true` in `.env` and run:

```bash
firebase emulators:start
```

---

## Deploy

```bash
# Frontend (Hosting) — this is all that's needed for the app + AI chat
npm run build
firebase deploy --only hosting

# Rules & indexes (when changed)
firebase deploy --only firestore:rules,firestore:indexes,storage
```

No Cloud Functions deploy is required — the AI runs in the frontend via Gemini.

---

## Seeding a real project (optional)

The client seeds automatically, but for provisioning a fresh production project
you can run the admin script:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
npm run seed          # project + roles + 3 generic demo risks
npm run seed:risks    # the 6 Viking DC demo risks (RISK-001 … RISK-006)
```

Download a service account key from **Project settings → Service accounts** and
save it as `serviceAccountKey.json` (git-ignored). `seed:risks` writes to the
project id `datacenter-vejle-phase-1` by default — override with
`RTPM_PROJECT_ID` if your deployment uses a different project doc.

---

## Key features

- **Risk detail panel** — Planner-style two-column layout.
- **Custom status timeline** — hand-built (no third-party stepper). Click a
  future status to advance it; an immutable `statusHistory` trail is recorded.
- **Workstream lookup** — side drawer sourced from `roles_and_responsibilities`.
- **Involved parties card** — auto-derived Responsible/Informed (RACI) view with
  org-type color accents.
- **Dual-mode chat panel**
  - **Risk Resolve Chat** — real-time multi-user (`onSnapshot`), `@mentions`,
    emoji reactions.
  - **Risk Manager (AI)** — Claude-powered analysis with full risk context
    injection, typing indicator, and 1-request-per-3s client-side rate limiting.
- **Dashboard** — Kanban board + table views with workstream / organization /
  priority / status filters.
- **Optimistic writes** — local state updates immediately; Firestore syncs in
  the background and reconciles via listeners.

---

## Security notes

The included Firestore and Storage rules grant any authenticated user full
access — suitable for an MVP. Tighten them with per-project membership checks
before production use.
