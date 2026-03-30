# TCS Enterprise Platform Discovery Synthesis

## Purpose

This note consolidates the BRD, architecture decks, executive proposal, strategy assessment, and internal discussion transcripts into one working understanding for POC planning.

## What TCS Is Really Trying To Build

TCS is not simply trying to redesign a website. The target state across the documents is a multi-tenant compliance SaaS platform for long-term care that combines:

- a public marketing and lead-generation surface
- a subscriber application with role-aware experiences
- TCS-owned compliance content
- customer-owned documents
- AI-powered search and assistance
- compliance workflows such as survey readiness and Plan of Correction
- LMS/training workflows
- support, notifications, analytics, and account management

The repeated strategic framing is:

- today: a valuable but mostly gated compliance library on WordPress
- future: the operating system for LTC compliance

## Core Business Problem Being Solved

Across the decks and transcripts, the business problem is consistent:

- TCS has a rare asset: 7,000+ compliance documents across all 50 states
- competitors with less depth are winning digital mindshare
- most TCS value is hidden behind login and not discoverable
- the current platform does not create operational dependency for customers
- WordPress is sufficient for a document library, but not for a scalable SaaS product

The desired business outcomes are also consistent:

- improve market visibility and organic lead generation
- make TCS harder to replace by embedding into daily compliance operations
- create upsell paths through modules and analytics-driven recommendations
- improve customer retention by increasing switching cost
- present TCS as category leader, not just content provider

## Strategic Options Presented To The Client

The strategy deck presents three options.

### Option 1: Extend Current WordPress Platform

Pros:

- lowest disruption
- no migration needed initially
- quick incremental changes

Cons:

- no true tenant isolation
- no real entitlement engine
- AI and advanced workflows become plugin bolt-ons
- growing technical debt
- weak path to differentiation

Conclusion in the materials: not viable for the long-term target state.

### Option 2: Hybrid Approach

Pros:

- allows new capabilities outside WordPress
- lower short-term disruption than full replacement

Cons:

- duplicated or synchronized data
- fragmented UX
- two systems to maintain
- integration bottlenecks
- WordPress limitations still remain for core areas

Conclusion in the materials: a transition path at best, but not a clean end state.

### Option 3: Purpose-Built Unified Platform

Pros:

- single source of truth
- better tenant isolation and entitlement control
- AI native workflows
- scalable architecture
- public content plus subscriber product in one ecosystem
- strongest business case and market differentiation

Cons:

- higher upfront investment
- requires discovery, phased delivery, and stakeholder buy-in

Conclusion in the materials: recommended direction.

## Architecture Direction That Repeats Across The Files

The recommended architecture is consistent across the decks:

- React SPA/PWA frontend
- headless CMS only for public marketing and editorial content
- SaaS backend for all product logic
- multi-tenant data model
- entitlement-aware rendering
- AI layer using RAG, embeddings, and summarization
- AWS-hosted cloud-native services
- analytics based on usage events
- enterprise identity via Entra ID, with provider-agnostic design

Important architectural principle:

Headless CMS is for content publishing only. It is not the product core.

## Why WordPress Is Considered Insufficient

This is one of the strongest cross-document alignments. WordPress is described as inadequate because it lacks:

- true company-level tenant isolation
- robust role + entitlement enforcement
- native AI search / RAG support
- compliance workflow support
- deep product analytics
- scalable operational architecture
- a clean HIPAA-ready path

The internal discussions add practical concerns:

- current autologin/trusted login links create security and revenue leakage risk
- customer/user management is manually handled in WordPress admin
- hybrid integration increases dependency on multiple systems and APIs
- long-term maintainability becomes harder, not easier

## BRD: What The Product Actually Contains

The BRD strongly supports the SaaS interpretation.

### Core entities

- Company
- Subscription
- Plan
- User
- Role
- Entitlement
- Account Manager
- TCS Document
- Customer Document
- Alert
- Lesson Plan
- Assignment
- Completion Record
- Support Ticket
- Usage Event
- Notification

### Key product surfaces

- Public Marketing Site
- Subscriber Homepage
- Navigation Menu
- Document Library
- Search Interface
- Document Cafe
- Admin Console
- Company Portal
- LMS Portal
- Support Portal
- Reporting Dashboards
- Notification Center
- User Management

### Most important product model

The platform logic is built on this chain:

`Company -> Subscription -> Plan -> Entitlements -> Role-aware user experience`

That chain determines:

- what modules a company can access
- what content appears
- what actions users can perform
- what analytics and dashboards are shown

## Roles That Matter For POC Design

The materials repeatedly reference these personas:

- TCS Admin
- TCS Employee
- Customer Admin
- Customer Employee
- Account Manager

Role-based rendering is not cosmetic. It is central to the product story.

The homepage, navigation, search results, dashboards, and management actions should all visibly change by role and entitlement.

## Modules Most Important To The Story

Across the BRD, decks, and transcripts, the highest-value modules are:

- Subscriber homepage / command center
- Company portal and user management
- Document library + Document Cafe
- Search with AI and citations
- LMS / training
- Support ticketing
- Reporting dashboards / command center
- Notifications / alerts
- Survey readiness
- Plan of Correction

For client persuasion, not all modules are equally valuable in a POC.

## What The Internal Discussions Add

The transcripts add critical context that is not explicit in the decks.

### 1. The POC must sell business value, not technology alone

This was said repeatedly. The demo should answer:

- how does this help TCS retain customers?
- how does this help upsell modules?
- how does this help land new customers?
- how does this help beat competitors?
- how does this help leadership justify spending more than WordPress costs today?

### 2. Security and revenue leakage are immediate pain points

The current trusted-login/autologin pattern allows access sharing outside the paying company. That creates:

- poor access governance
- weak visibility
- possible subscription leakage
- limited trust in auditability

This is a strong POC talking point.

### 3. Visibility is a major unmet need

Leadership appears interested in seeing:

- which companies are active or at risk
- who is using what
- support issues by customer
- billing and AR risk
- product engagement
- compliance/training status

This is why the command center/dashboard concept resonated in prior demos.

### 4. Upsell intelligence is part of the pitch

Several discussions describe showing recommendations such as:

- modules a facility has not purchased
- business reasons to upgrade
- benchmarks from similar facilities
- AI-generated recommendations tied to outcomes

This is more persuasive than simply listing unavailable modules.

### 5. The POC can be hardcoded, but the vision must feel real

The team explicitly discussed building a visually convincing, role-based prototype without full backend completeness. The goal is to make the future feel inevitable.

## Biggest Storyline The Client Needs To Experience

If the POC is successful, the client should feel:

1. this is much more than a redesign
2. this solves visible business and operational problems WordPress cannot solve cleanly
3. this creates new revenue, retention, and market-positioning advantages
4. this can be phased and de-risked, rather than treated as one giant leap

## What Will Likely Win Confidence In The POC

Based on all materials, the strongest POC themes are:

- role-aware, entitlement-aware product experience
- command-center style visibility
- secure self-service customer administration
- AI-assisted search or compliance workflow
- a clear upsell and retention story
- polished UX that makes the old platform feel outdated

## What To Avoid In The POC

The discussions imply several pitfalls to avoid:

- presenting it as "Web3" for its own sake
- over-indexing on technical architecture without business outcomes
- trying to build every module deeply
- showing generic dashboards with no LTC-specific value
- making WordPress replacement seem like change for change's sake
- proposing expensive tools without a clear build-vs-buy reason

## Recommended POC Framing

The POC should be framed as a proof of business transformation through a modern platform. A strong message would be:

- secure, role-aware operations
- better customer self-service
- AI that shortens compliance work
- visibility that enables account growth and churn prevention
- phased modernization, not reckless replacement

## Working Assumptions For Future Claude Prompts

Unless future inputs override them, these assumptions are well supported by the documents:

- the target stack is React frontend plus modern SaaS services
- WordPress is not the desired long-term product foundation
- a headless CMS may support public content only
- the POC should emphasize business value and executive confidence
- modules should be built around personas and entitlement-aware states
- dashboards and recommendations should feel actionable, not decorative

## Suggested Next Step

When defining the POC, map each requested module to:

- primary persona
- business problem solved
- visible wow moment
- supporting data and metrics
- future-state architecture implication
- why this helps win the deal

