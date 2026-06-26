# RTPM — Claude Code Project Memory
Version: v1
Last updated: 2026-06-26

## Project identity
App: RTPM Risk Manager — Viking DC demo
Live URL: https://rtpm-cf560.web.app
GitHub: https://github.com/HenningKristensenDK/RTPMgoogle (branch: main)
Local: C:\Users\henni\RTPMgoogle
Firebase project: rtpm-cf560 (europe-west1)

## Always deploy like this
npm run build
firebase deploy --only hosting --project rtpm-cf560

## Tech stack
React + TypeScript + Tailwind + Vite (frontend)
Firebase Auth + Firestore + Hosting (backend)
Gemini API via @google/genai SDK (AI)
Zustand (state management)

## Gemini setup
Model: gemini-2.5-flash
API key: VITE_GEMINI_API_KEY in .env (uses Google AI Studio AQ. key format)
Service: src/services/geminiService.ts
AI context: all project risks fetched before each call

## Firestore
Project ID: datacenter-vejle-phase-1
Collections: projects, risks, roles_and_responsibilities, risk_messages
Composite index exists on risk_messages (mode + riskId + timestamp)
Composite index exists on risks (projectId + createdAt)

## Data
20 Viking DC demo risks seeded (RK-001 to RK-020)
5 R&R entries: MT Højgaard, WSP Denmark, Turner & Townsend, Energinet
Seed script: npm run seed (requires serviceAccountKey.json)
Store default projectId hardcoded: "datacenter-vejle-phase-1" in riskStore.ts

## Shell architecture (3 states)
landing — centered Project Manager chat card, indigo 65% overlay over dashboard
active — sidebar 220px left + right panel 320px always visible
focus — sidebar 60px icons only + right panel visible
State managed by: src/store/shellStore.ts

## Brand tokens (binding)
Sidebar bg:  #070474
Header bg:   #090693
Primary:     #0d08d2
Light:       #e7e6fa
Yellow:      #ffcc00
Red:         #e63946
Orange:      #ff8b00
Green:       #28a745
Font H:      Barlow Condensed Bold
Font body:   Montserrat Regular

## Navigation modules (left sidebar)
Built: Dashboard, Risk Management, Roles & Responsibility
Placeholder (not built yet):
  - Documents
  - Correspondence
  - NCR
  - RFI
  - Change Management
  - Interface Management
  - Technical Query
  - Time Log

## Key files
src/store/shellStore.ts        — landing/active/focus state
src/store/riskStore.ts         — risks + projectId (hardcoded default)
src/services/geminiService.ts  — Gemini API call with full risk context
src/components/AppShell.tsx    — main layout shell
src/lib/seedData.ts            — Viking DC demo data (20 risks)
scripts/seed.ts                — admin seed script

## Known issues
- Diamond character showing in some risk titles (encoding issue in seedData.ts)
- Duplicate RK-003 risks in Firestore (seed ran multiple times)
- serviceAccountKey.json must NOT be committed to git
- VITE_GEMINI_API_KEY uses AQ. format (Google AI Studio new key format)
- Org policy blocked service account key bindings — resolved by resetting
  iam.managed.disableServiceAccountApiKeyCreation at org level

## Demo context
Client: Claus Risum Korsgaard, Project Director at Turner & Townsend
Project: Viking DC — DataCenter Vejle Phase 1 (fictional name)
Demo target: August 2026
Key demo flow:
  1. Landing screen — Project Manager AI chat
  2. Click through to Risk Board — 20 live risks
  3. Open a risk — RACI, checklist, status timeline
  4. Ask AI — risk-specific and portfolio questions
  5. Roles & Responsibility module

## Next priorities
1. Deploy new 3-state shell UI (built but not yet deployed)
2. Fix diamond encoding in risk titles
3. Remove duplicate risks from Firestore
4. Build My To Do's overlay
5. Looker Studio executive dashboard

## Process rule
This file is maintained by Claude in the RTPM Google project chat.
After every session where code was changed or decisions were made,
Claude provides an updated CLAUDE.md ready to paste into Claude Code.
Version number increments on significant changes.
Date updates on every change.
