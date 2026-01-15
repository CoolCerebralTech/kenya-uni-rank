# 🎓 UniPulse (MVP)

UniPulse is a **frictionless, poll-based platform** that lets students vote on
and compare Kenyan universities based on **real student sentiment** — not
official rankings.

The MVP focuses on **Nairobi’s major universities** and uses a **no-signup,
one-click voting** experience inspired by platforms like Polymarket (without
betting).

---

## 🚀 Product Vision

Choosing a university in Kenya is often based on hearsay.
UniPulse aims to make that decision **transparent, social, and data-driven**
by aggregating anonymous student opinions into clear visual rankings.

This MVP answers one question:

> **Do students care enough to vote and compare universities publicly?**

---

## 🧪 MVP Scope (Very Important)

This is an **early validation build**, not a full product.

### What the MVP **does**
- Displays live polls comparing universities
- Allows users to vote with **one click**
- Shows real-time results as charts and rankings
- Works fully on mobile
- Prevents repeat voting using browser fingerprinting

### What the MVP **does NOT do**
- No user accounts or sign-up
- No comments or reviews
- No payments or ads
- No predictions or betting
- No AI analysis (yet)

---

## 🏫 Universities Included (MVP)

- University of Nairobi (UoN)
- Kenyatta University (KU)
- Jomo Kenyatta University of Agriculture and Technology (JKUAT)
- Strathmore University
- USIU-Africa
- Mount Kenya University (MKU)
- Technical University of Kenya (TUK)

---

## 🗳️ Voting Categories

Each poll belongs to one of the following categories:

### `general`
- Best Overall Student Experience  
- Best Value for Money  
- University You’d Recommend to a Friend  

### `vibes`
- Best Campus Life & Vibes  
- Most Fun Campus  
- Best Events & Student Activities  

### `sports`
- Best Sports Facilities  

### `academics`
- Best Academic Environment  

More categories will be added **only after validation**.

---

## 🧱 Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Charting (Recharts / Chart.js)

### Backend
- Supabase (PostgreSQL)
- Minimal REST APIs
- Server-side vote aggregation

### Deployment
- Frontend: Vercel / Netlify
- Backend: Supabase

---

## 🧩 Core Data Models

```ts
University
Poll
Vote
PollResult
