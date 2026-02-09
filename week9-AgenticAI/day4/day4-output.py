import streamlit as st
from agents.answer_agent import AnswerAgent
from agents.memory_classifier import MemoryClassifierAgent
from memory.memory_manager import MemoryManager
from utils.day4_client import create_model_client

if "memory" not in st.session_state:
    st.session_state.memory = MemoryManager()

if "messages" not in st.session_state:
    st.session_state.messages = []

memory = st.session_state.memory
llm = create_model_client()

answer_agent = AnswerAgent(
    name="answer",
    system_prompt="Answer using memory context only.",
    llm=llm
)

classifier = MemoryClassifierAgent()

st.title("AutoGen AgenticAI Memory System")

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

query = st.chat_input("Ask a question")

if query:
    st.session_state.messages.append(
        {"role": "user", "content": query}
    )

    with st.chat_message("user"):
        st.write(query)

    context = memory.recall(query)

    answer = answer_agent.run_with_context(context, query)

    classified = classifier.run(query)
    memory.store(
        text=classified["data"]["text"],
        memory_type=classified["type"]
    )
    st.session_state.messages.append(
        {"role": "assistant", "content": answer}
    )

    with st.chat_message("assistant"):
        st.write(answer)