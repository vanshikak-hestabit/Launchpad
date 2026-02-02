import streamlit as st
import asyncio
from orchestrator.tool_orchestrator import Orchestrator
import os 

st.set_page_config(page_title="Multi-Agent System", layout="wide")

def init_session_state():
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "orchestrator" not in st.session_state:
        st.session_state.orchestrator = Orchestrator()

def display_agent_result(agent_name: str, result):
    with st.expander(f"{agent_name.upper()} Agent Result", expanded=False):
        if isinstance(result, dict) and "generated_code" in result:
            st.markdown("**Generated Code**")
            st.code(result["generated_code"], language="python")
            st.markdown("**Execution Output**")
            st.code(result["execution_result"], language="text")
        else:
            st.code(str(result), language="text")

async def process_request(user_input: str):
    status_placeholder = st.empty()

    def update_status(msg: str):
        status_placeholder.info(msg)

    result = await st.session_state.orchestrator.process_request(
        user_input, status_callback=update_status
    )

    status_placeholder.empty()
    return result

def main():
    init_session_state()

    st.title("AutoGen Multi-Agent System")

    st.sidebar.header("Upload CSV to Database")
    uploaded_file = st.sidebar.file_uploader("Upload a CSV file", type=["csv"])

    if uploaded_file:
        save_path = os.path.join("uploads", uploaded_file.name)
        os.makedirs("uploads", exist_ok=True)

        with open(save_path, "wb") as f:
            f.write(uploaded_file.getbuffer())

        st.sidebar.success(f"Uploaded: {uploaded_file.name}")

        table_name = os.path.splitext(uploaded_file.name)[0]
        db_agent = st.session_state.orchestrator.agents["database"]
        msg = db_agent.import_csv(save_path, table_name)
        st.sidebar.info(msg)

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            if message["role"] == "assistant":
                for k, v in message["details"]["agent_results"].items():
                    display_agent_result(k, v)

    if prompt := st.chat_input("Enter your request..."):
        st.session_state.messages.append({"role": "user", "content": prompt})

        with st.chat_message("assistant"):
            result = asyncio.run(process_request(prompt))
            st.markdown(result["final_answer"])

            for k, v in result["agent_results"].items():
                display_agent_result(k, v)

            st.session_state.messages.append({
                "role": "assistant",
                "content": result["final_answer"],
                "details": result,
            })

if __name__ == "__main__":
    main()