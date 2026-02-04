# streamlit_nexus.py
import streamlit as st
import sys
import os

# Make sure orchestrator file is in the same directory or adjust path
sys.path.append(os.path.abspath("."))

# Import your orchestrator module
from agents.orchestrator import OrchestratorAgent  # <-- replace with your actual orchestrator class

# Initialize NEXUS AI orchestrator
orchestrator = OrchestratorAgent()
st.title("NEXUS AI Q&A")

# User input
user_question = st.text_input("Ask NEXUS AI anything about your project or startup:")

if st.button("Ask"):
    if user_question.strip() == "":
        st.warning("Please type a question!")
    else:
        # Send question to orchestrator
        try:
            # Here we assume your orchestrator has a method run_task
            response = orchestrator.run_task(user_question)
            st.success("Answer:")
            st.write(response)
        except Exception as e:
            st.error(f"Error: {e}")
