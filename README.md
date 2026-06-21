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
| Backend     | Firebase Firestore, Auth, Storage, Cloud Functions (Node 20)  |
| AI agent    | Anthropic Claude (`claude-sonnet-4-6`) via a Cloud Function    |

The Anthropic API key is **never** exposed to the client — all AI calls are
proxied server-side through the `riskManagerAgent` callable Cloud Function.

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

### 4. Configure the Anthropic API key (server-side only)

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
# paste your sk-ant-... key when prompted
```

The key lives only in the Cloud Function runtime — it is never bundled into the
client.

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
# Frontend (Hosting)
npm run build
firebase deploy --only hosting

# Cloud Functions (AI agent)
cd functions && npm run build && cd ..
firebase deploy --only functions

# Rules & indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Or deploy everything at once: `firebase deploy`.

---

## Seeding a real project (optional)

The client seeds automatically, but for provisioning a fresh production project
you can run the admin script:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
npm run seed
```

Download a service account key from **Project settings → Service accounts** and
save it as `serviceAccountKey.json` (git-ignored).

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
