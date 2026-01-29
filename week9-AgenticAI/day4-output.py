import streamlit as st
from memory.answer_agent import AnswerAgent
from memory.memory_check import MemoryClassifierAgent
from memory.memory_retriever import MemoryManager
from groq_client import create_model_client
 
memory = MemoryManager()
llm = create_model_client()
 
answer_agent = AnswerAgent(
    name="answer",
    system_prompt="Answer using memory context only.",
    llm=llm
)
 
classifier = MemoryClassifierAgent()
st.title("Agent Memory System")
 
query = st.text_input("Ask a question")
if st.button("Run") and query.strip():
 
    context = memory.recall(query)
 
    answer = answer_agent.run_with_context(context, query)
 
    classified = classifier.run(query)
 
    memory.store(
        text=classified["data"]["text"],
        memory_type=classified["type"]
    )
    st.subheader("Answer")
    st.write(answer)
 
 