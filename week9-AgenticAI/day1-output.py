import streamlit as st
import asyncio
from agents.research_agent import ResearchAgent
from agents.summarizer_agent import SummarizerAgent
from agents.answer_agent import AnswerAgent

# Initialize agents
research_agent = ResearchAgent()
summarizer_agent = SummarizerAgent()
answer_agent = AnswerAgent()

st.title("Agentic AI Demo")
st.write("Ask a question and see Research → Summary → Answer")

# User input
query = st.text_input("Enter your question:")

if query:
    with st.spinner("Generating response..."):
        # Step 1: Research
        research_text = asyncio.run(research_agent.run(query))

        st.subheader("Research")
        st.write(research_text)

        # Step 2: Summary
        summary_text = asyncio.run(summarizer_agent.run(research_text))

        st.subheader("Summary")
        st.write(summary_text)

        # Step 3: Final Answer
        final_answer = asyncio.run(answer_agent.run(summary_text))

        st.subheader("Final Answer")
        st.write(final_answer)
