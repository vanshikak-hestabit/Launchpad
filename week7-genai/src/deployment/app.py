from fastapi import FastAPI
from pydantic import BaseModel
from src.evaluation.rag_eval import context_match_score
from src.memory.memory_store import add_message, log_interaction
from src.memory.memory_store import add_message
from src.retriever.query_engine import Hybrid_retrieve_context
from src.pipelines.sql_pipeline import run_pipeline
from src.deployment.refinement import refine_answer
app = FastAPI()


class AskRequest(BaseModel):
    question: str

class AskImageRequest(BaseModel):
    image_name: str
    question: str

class AskSQLRequest(BaseModel):
    question: str



@app.post("/ask")
def ask(req: AskRequest):
    user_question = req.question

    add_message("user", user_question)

    reranked_chunks, SYSTEM_PROMPT, answer = Hybrid_retrieve_context(user_question)

    # evaluation part
    context_text = " ".join([r.page_content for r in reranked_chunks])
    refined_answer = refine_answer(user_question, answer, context=context_text)
  
    faithfulness = context_match_score(user_question, refined_answer)
    confidence = 0.85

    add_message("assistant", answer)

    log_interaction({
        "question": user_question,
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence,
        "retrieved_context": [r.page_content for r in reranked_chunks]
    })

    return {
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    }



@app.post("/ask-image")
def ask_image(req: AskImageRequest):
    image_name = req.image_name
    question = req.question

    add_message("user", f"[IMAGE: {image_name}] {question}")

    draft_answer = f"I received the image '{image_name}' and your question: {question}"
    refined_answer = draft_answer + " (This is a refined image answer)"

    faithfulness = context_match_score(question, refined_answer)

    confidence = 0.8

    add_message("assistant", refined_answer)

    log_interaction({
        "type": "image",
        "image": image_name,
        "question": question,
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    })

    return {
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    }

@app.post("/ask-sql")
def ask_sql(req: AskSQLRequest):
    question = req.question
    add_message("user", f"[SQL] {question}")

    try:
        result = run_pipeline(question)
        answer = result[0] 
    except Exception as e:
        answer = f"Error executing SQL query: {str(e)}"

    refined_answer = refine_answer(question, answer, context=None)

    faithfulness = context_match_score(question, answer)

    confidence = 0.9 

    add_message("assistant", answer)

    log_interaction({
        "type": "sql",
        "question": question,
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    })

    return {
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    }

