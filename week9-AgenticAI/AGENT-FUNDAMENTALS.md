# AGENT FUNDAMENTALS

This document explains the basics of building AI agents using message-based communication and strict role separation.

---

## 1. What Is an AI Agent?

An AI agent is a system that:

* Receives input (perception)
* Thinks about what to do (reasoning)
* Performs an action (acting)
* Repeats the loop

Agent = Brain + Memory + Rules + Actions
---

## 2. Agent vs Chatbot vs Pipeline

**Chatbot**

* Input → Output
* No planning or delegation

**Pipeline**

* Fixed steps
* No decisions

**Agent**

* Thinks before acting
* Chooses actions
* Uses memory and communication

---

## 3. Agent Architecture

Each agent contains:

* System prompt (identity + rules)
* Memory buffer
* Model
* run(input) method

This wraps reasoning, memory, and execution logic.

---

## 4. ReAct Pattern

ReAct means **Reason + Act**.

Instead of answering immediately, agents:

Reason → Act → Observe → Repeat

This prevents premature or incorrect answers.

---

## 5. LLM as Executor

The LLM is not only for text. It can:

* Call tools
* Trigger other agents
* Write files

Flow:

Model → Plan → Tool → Result → Continue

---

## 6. System Prompts

System prompts define the agent’s job and limits.

They enforce:

* Identity
* Behavior
* Output rules

They prevent agents from overlapping roles.

---

## 7. Role Isolation

Each agent does one job:

* Research Agent: gather info
* Summarizer Agent: compress info
* Answer Agent: respond to user

Agents must not steal each other’s work.

---

## 8. Multi-Agent Flow

Standard flow:

User → Research → Summarizer → Answer → User

Each step is isolated and controlled.

---

## Core Idea

Agents are small workers with rules, memory, communication, and actions.

They think before acting and cooperate instead of guessing.
