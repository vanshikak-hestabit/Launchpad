import streamlit as st

from src.retriever.query_engine import Hybrid_retrieve_context
from src.deployment.refinement import refine_answer
from src.evaluation.rag_eval import context_match_score
from src.memory.memory_store import add_message, log_interaction
from src.pipelines.sql_pipeline import run_pipeline

st.set_page_config(page_title="RAG Capstone", layout="wide")

st.title("📚 RAG + SQL AGENT")

mode = st.sidebar.selectbox(
    "Choose mode",
    ["Ask (Text)", "Ask Image", "Ask SQL"]
)

question = st.text_input("Enter your question")

# ---------------- TEXT RAG ----------------
if mode == "Ask (Text)" and st.button("Ask"):
    add_message("user", question)

    chunks, system_prompt, answer = Hybrid_retrieve_context(question)

    context_text = " ".join([c.page_content for c in chunks])
    refined_answer = refine_answer(question, answer, context=context_text)

    faithfulness = context_match_score(question, refined_answer)
    confidence = 0.85

    add_message("assistant", refined_answer)

    log_interaction({
        "type": "text",
        "question": question,
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    })

    st.subheader("Answer")
    st.write(refined_answer)

    # st.metric("Faithfulness", round(faithfulness, 2))
    # st.metric("Confidence", confidence)

# ---------------- IMAGE ----------------
if mode == "Ask Image":
    image_name = st.text_input("Image name")

    if st.button("Ask Image"):
        add_message("user", f"[IMAGE] {image_name} {question}")

        draft = f"I received the image '{image_name}' and your question."
        refined_answer = draft + " (Refined)"

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

        st.subheader("Answer")
        st.write(refined_answer)

# ---------------- SQL ----------------
if mode == "Ask SQL" and st.button("Run SQL"):
    add_message("user", f"[SQL] {question}")

    try:
        result = run_pipeline(question)

        sql_query = result[0]
        answer = result[1] if len(result) > 1 else result[0]

    except Exception as e:
        sql_query = "SQL generation failed"
        answer = str(e)

    refined_answer = refine_answer(question, answer, context=None)
    faithfulness = context_match_score(question, refined_answer)
    confidence = 0.9

    add_message("assistant", refined_answer)

    log_interaction({
        "type": "sql",
        "question": question,
        "sql_query": sql_query,
        "answer": refined_answer,
        "faithfulness_score": faithfulness,
        "confidence": confidence
    })

    st.subheader("Generated SQL")
    st.code(sql_query, language="sql")

    st.subheader("Answer")
    st.write(refined_answer)
