import streamlit as st
import asyncio

from autogen_ext.models.ollama import OllamaChatCompletionClient
from orchestrator.planner import Planner


def create_model_client():
    return OllamaChatCompletionClient(
        model="llama3.1:latest",
        model_info={
            "type": "ollama",
            "json_output": False,
            "vision": False,
            "function_calling": False,
        },
        device="cuda",
        max_new_tokens=512,
        temperature=0.7,
    )


async def run_planner(query: str):
    model_client = create_model_client()
    planner = Planner(model_client)
    return await planner.run(query)


st.set_page_config(page_title="Multi-Agent Orchestrator", layout="wide")
st.title("🧠 Multi-Agent Orchestrator")

st.caption("Planner → Workers → Reflector → Validator (doing their tiny corporate jobs).")

query = st.text_area("Enter your query", height=120)

run_btn = st.button("Run Agents")

if run_btn and query.strip():
    with st.spinner("Agents are thinking..."):
        try:
            final_output, execution_tree = asyncio.run(run_planner(query))
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            final_output, execution_tree = loop.run_until_complete(run_planner(query))

    st.subheader("✅ Final Answer")
    st.write(final_output)

    st.subheader("🌳 Execution Tree")

    for node, data in execution_tree.items():
        with st.expander(f"Node: {node}"):
            st.write("**Dependencies:**", data["deps"])
            st.write("**Output:**")
            st.write(data["output"])

elif run_btn:
    st.warning("Type something before waking the agents.")
