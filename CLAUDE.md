# RTPM - Claude Code Project Memory
Version: v1
Last updated: 2026-06-26

## Project identity
App: RTPM Risk Manager - Viking DC demo
Live URL: https://rtpm-cf560.web.app
GitHub: https://github.com/HenningKristensenDK/RTPMgoogle (branch: main)
Local: C:\Users\henni\RTPMgoogle
Firebase project: rtpm-cf560 (deploy target passed via --project flag;
  .firebaserc default is the placeholder "risk-manager-app")

## Always deploy like this
npm run build
firebase deploy --only hosting --project rtpm-cf560

## Tech stack
React 18 + TypeScript + Tailwind + Vite (frontend)
Firebase Auth + Firestore + Storage + Hosting (backend)
Gemini API via @google/generative-ai SDK (AI, called from the frontend)
Zustand (state management)
React Router v6 (routing)
lucide-react (icons)

## Gemini setup (verified in src/services/geminiService.ts)
SDK: @google/generative-ai  (package.json: "^0.24.1")
Model: gemini-2.0-flash  (const MODEL in geminiService.ts)
API key: VITE_GEMINI_API_KEY in .env (read via import.meta.env)
Auth check: requires auth.currentUser (must be signed in)
Context builders:
  - buildRiskContext(risk, roles)   - single open risk (per-risk chat)
  - buildProjectContext(risks)      - ALL project risks (global Project
                                      Manager right panel + landing card)
Legacy: functions/src/index.ts (Anthropic Cloud Function) still in the repo
  but UNUSED - the app does not call it. AI is 100% frontend Gemini.

## Firestore
App project doc id: datacenter-vejle-phase-1
Collections: projects, risks, roles_and_responsibilities, risk_messages
Indexes (firestore.indexes.json):
  - risks: (projectId + status + createdAt), (projectId + createdAt)
  - risk_messages: (riskId + mode + timestamp)
  - roles_and_responsibilities: (projectId + workstream)
Undefined-field guard: initializeFirestore(app, { ignoreUndefinedProperties: true })
  in src/firebase/config.ts (prevents the authorAvatar undefined crash)

## Data (verified)
src/lib/seedData.ts: 3 demo risks (RK-001 .. RK-003) + 1 project + 5 R&R entries
scripts/seedRisks.ts: 6 Viking DC risks (RISK-001 .. RISK-006) with
  workstream / likelihood / impact / score / nextStepOwner fields
R&R entries (5) across 4 orgs:
  - MT Højgaard (Main Contractor) x2  - Civil Works, MEP
  - WSP Denmark (Advisor)             - Civil Works
  - Ørsted A/S (Owner)                - IT/Data
  - Region Syddanmark (Authority)     - MEP
Seed scripts (need serviceAccountKey.json + GOOGLE_APPLICATION_CREDENTIALS):
  - npm run seed        - project + roles + 3 generic risks
  - npm run seed:risks  - the 6 Viking DC risks (override id with RTPM_PROJECT_ID)
projectId is NOT hardcoded in riskStore.ts (default ""). It is set in
  src/App.tsx via setProject(SEED_PROJECT.id), where SEED_PROJECT.id =
  "datacenter-vejle-phase-1".

## Shell architecture (3 states) - src/store/shellStore.ts exists
landing - centered Project Manager chat card, indigo 65% overlay over dashboard
active  - sidebar 220px left + right Project Manager panel 320px always visible
focus   - sidebar collapses to 60px icons only + right panel still visible
Type: ShellMode = "landing" | "active" | "focus". App opens at "landing".

## Shell components (src/components/shell/) - all 5 exist
Header.tsx              - #090693 bar, toggle, RTPM wordmark, project name,
                          search, My To Do's bell + overdue badge, avatar
Sidebar.tsx             - #070474, 220px / 60px, module nav + badges + tooltips
ProjectManagerPanel.tsx - 320px right AI chat, always on, minimisable
LandingOverlay.tsx      - 480px landing card, greeting + overdue count + chips
MyTodosOverlay.tsx      - right slide panel, Responsible / Informed (BUILT)

## Brand tokens (binding - tailwind.config.js)
Sidebar bg:  #070474
Header bg:   #090693
Primary:     #0d08d2
Light:       #e7e6fa
Yellow:      #ffcc00
Red:         #e63946
Orange:      #ff8b00
Green:       #28a745
Font H:      Barlow Condensed Bold (use class font-head)
Font body:   Montserrat Regular (default sans)
Fonts loaded via Google Fonts in index.html.

## Routes (src/App.tsx)
/              - Overview (KPI dashboard)            -> Overview.tsx
/risks         - risk board (kanban + table)         -> Dashboard.tsx
/risks/:riskId - risk detail panel                   -> RiskDetail.tsx
/roles         - Roles & Responsibility admin        -> RolesResponsibility.tsx
/settings      - placeholder                          -> ModulePlaceholder.tsx
/m/:module     - placeholder for roadmap modules      -> ModulePlaceholder.tsx

## Navigation modules (left sidebar)
Built: Dashboard, Risk Management, Roles & Responsibility
Placeholder (roadmap, route to ModulePlaceholder, not built yet):
  Documents, Correspondence, NCR, RFI, Change Management,
  Interface Management, Technical Query, Time Log, Settings

## Key files
src/store/shellStore.ts        - landing/active/focus + global PM chat
src/store/riskStore.ts         - risks + roles + projectId (default "")
src/services/geminiService.ts  - Gemini call, buildRiskContext + buildProjectContext
src/firebase/config.ts         - Firebase init (ignoreUndefinedProperties)
src/firebase/firestore.ts      - all Firestore reads/writes
src/components/AppShell.tsx     - 3-state layout shell
src/lib/seedData.ts            - project + 5 R&R + 3 demo risks
scripts/seedRisks.ts           - 6 Viking DC risks (admin seed)

## Known issues / notes
- serviceAccountKey.json and .env must NOT be committed (both git-ignored)
- VITE_GEMINI_API_KEY required for AI chat; without it the panel errors gracefully
- Vite build is a single ~750 kB chunk (warns but builds fine); no code-split yet
- Em-dash characters removed from seed data (rendered as diamonds under encoding
  mismatch); replaced with "-" in seedData.ts and seedRisks.ts
- Legacy functions/src/index.ts kept but unused (Firebase Functions needs Blaze)

## Process rule
This file is maintained by Claude. After every session where code changed or
decisions were made, Claude provides an updated CLAUDE.md ready to paste into
Claude Code. Version increments on significant changes; date updates every change.
