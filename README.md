# Vital Talk

An AI-powered conversational training platform for emergency physicians to practice end-of-life conversations in a safe, realistic environment.

## 🎯 Product Vision & Goals

### Problem

Emergency physicians frequently encounter end-of-life conversations but:

- Receive little formal training
- Must handle emotionally charged, unpredictable reactions
- Cannot "practice" safely without harming real patients or families

### Solution

A web-based conversational AI training platform that simulates realistic end-of-life conversations using emotion-driven AI agents, allowing physicians to:

- Practice difficult conversations
- Experience multiple emotional reactions (denial, anger, bargaining, sadness, acceptance)
- Pause, rewind, retry, and reflect
- Receive structured feedback aligned with medical ethics and Japanese cultural norms

### Target Users

- Emergency physicians (primary)
- Medical residents
- Medical students
- Hospital training programs
- National medical associations (Japan)

---

## 📋 Product Requirements Document (PRD)

### Core User Experience

**Primary Flow:**

1. User logs in
2. Selects a scenario
3. Selects difficulty level
4. Starts a live conversation
5. Interacts with an AI patient/family member
6. Can pause / rewind / retry
7. Receives feedback & reflection

### Scenarios

Each scenario consists of:

- Patient context (age, illness, prognosis)
- Family context (relationship, cultural expectations)
- Emotional baseline
- Conversation goals (e.g. discuss DNR, comfort care)

**Example Scenarios:**

- Elderly patient with terminal cancer + adult child in denial
- Sudden cardiac arrest + spouse in shock and anger
- Advanced dementia + family disagreement
- Pediatric end-of-life case (advanced mode)

### Emotional Modes (Critical Feature)

Each conversation has dynamic emotional states, not fixed scripts.

**Supported Emotional States:**

- Denial
- Anger
- Bargaining
- Sadness
- Acceptance
- Mixed / volatile (advanced)

Each state affects:

- Tone
- Response latency
- Willingness to accept information
- Likelihood of emotional escalation

The emotional state can:

- Shift mid-conversation
- React to physician phrasing
- Escalate or de-escalate

### Pause / Redo / Branching

**Key Training Feature**

At any point, the user can:

- ⏸ **Pause**
- 🔁 **Redo last response**
- 🔀 **Try an alternative phrasing**
- 🧠 **Ask "What could I say differently?"**

This requires:

- Conversation state checkpointing
- Deterministic replay
- Controlled branching

### Feedback & Evaluation

After each session:

- Empathy score
- Clarity score
- Emotional alignment score
- Ethical appropriateness
- Cultural sensitivity (Japan-specific)

**Feedback types:**

- Inline (optional hints)
- Post-conversation summary
- Annotated transcript
- Suggested alternative responses

### Non-Functional Requirements

- HIPAA-like privacy (even though synthetic)
- Japanese language support (primary)
- Sub-second response time
- High availability (national rollout)
- Explainability (why the agent reacted a certain way)

---

## 🤖 Agentic System Design (Key Differentiator)

Instead of one chatbot, this is a **multi-agent system**.

### Core Agents

#### 1️⃣ Patient/Family Emotional Agent

**Role:** Simulates the human counterpart

- Maintains emotional state
- Generates emotionally consistent responses
- Reacts to physician wording
- LLM + emotional state machine

#### 2️⃣ Emotion State Manager Agent

**Role:** Controls emotion transitions

- Tracks anger/sadness/denial intensity
- Decides if emotion escalates or de-escalates
- Ensures realism (no random jumps)

**This is critical for realism and training value.**

#### 3️⃣ Conversation Orchestrator Agent

**Role:** The "director"

- Coordinates all agents
- Handles pause/redo/branch
- Controls turn-taking
- Ensures scenario constraints

This agent enables:

- Rewinds
- Deterministic replays
- Branching practice

#### 4️⃣ Coach / Feedback Agent

**Role:** Medical educator

- Evaluates physician responses
- Maps responses to best practices
- Generates post-session feedback
- Can answer "what should I have said?"

#### 5️⃣ Safety & Ethics Guard Agent

**Role:** Risk control

- Prevents unsafe advice
- Enforces medical ethics
- Prevents hallucinated medical facts
- Ensures culturally appropriate language

### Why Agentic?

Because:

- Emotional realism requires stateful reasoning
- Pausing & branching require orchestration
- Feedback must be separate from role-play
- Safety must override generative freedom

---

## 🏗️ Scalable Technical Architecture

### Frontend (Web App)

**Tech Stack:**

- Next.js (React)
- TypeScript
- Tailwind / shadcn-ui
- WebSockets for live chat
- Audio support (future: voice)

**Frontend Responsibilities:**

- Conversation UI
- Emotion indicators (subtle, optional)
- Pause / redo controls
- Scenario selection
- Transcript visualization
- Feedback dashboard

### Backend (API & Orchestration)

**Core Services:**

- Conversation Orchestrator Service
- Agent Execution Service
- Scenario Management Service
- User Progress Service

**Tech Stack:**

- Node.js or Python (FastAPI)
- gRPC or REST
- Redis (conversation state)
- PostgreSQL (users, scenarios, metrics)

### AI Layer

**LLM Providers:**

- GPT-4.1 / GPT-4.1-mini (reasoning + dialog)
- Fine-tuned models for Japanese medical language
- Optional local LLM for cost control

**Agent Framework:**

- LangGraph / custom agent graph
- Deterministic seeds for replay
- Tool calling for emotion transitions

### Scalability & Reliability

- Stateless API servers
- Horizontal scaling (Kubernetes)
- Redis for low-latency state
- Async agent execution
- Rate limiting per user

---

## 🚀 Getting Started

This project is in the planning and design phase.

## 📄 License

TBD

## 🤝 Contributing

TBD
