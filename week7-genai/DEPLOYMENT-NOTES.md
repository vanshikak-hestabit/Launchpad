# Deployment Notes

## Overview
This project implements an Advanced RAG-style system with conversational memory, evaluation, and logging.

## Features Implemented
- Short-term conversational memory (last 5 messages)
- Refinement loop for improving responses
- Hallucination detection (rule-based)
- Faithfulness / context match scoring
- Confidence scoring
- Human-readable interaction logging
- Production-ready FastAPI structure

## Available API Endpoints

### /ask
- Handles text-based questions
- Applies refinement, hallucination detection, faithfulness scoring
- Stores conversation memory and logs

### /ask-image
- Accepts image metadata and question
- Fully logged and evaluated

### /ask-sql
- Accepts SQL-related questions
- no query execution
- Prevents destructive SQL execution
- Logged and evaluated

## Memory
- Local file-based memory (`CHAT-LOGS.json`)
- Stores last 5 messages (short-term memory)

## Evaluation
- Faithfulness scoring using TF-IDF + cosine similarity
- Answer refinement using a secondary LLM
- Confidence score reported alongside faithfulness score


## Running the Application
```bash
uvicorn deployment.app:app --reload
