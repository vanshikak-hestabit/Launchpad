import streamlit as st
import asyncio

from groq_client import model_client
from orchestrator.planner import create_planner_agent, plan_tasks
from agents.worker_agent import run_workers_parallel
from agents.reflector_agent import create_reflection_agent, reflect_answer
from agents.validator_agent import create_validator_agent, validate_answer

st.title("Agentic AI Task Pipeline")

# Input query
user_query = st.text_area("Enter your query:", height=150)

if st.button("Run Pipeline") and user_query:

    st.info("Running agents... Please wait!")

    async def run_pipeline():
        # Planner
        planner_agent = create_planner_agent(model_client)
        plan = await plan_tasks(planner_agent, user_query)

        # Workers
        worker_outputs = await run_workers_parallel(plan.tasks, model_client)
        merged_output = "\n".join(f"{t_id}: {out}" for t_id, out in worker_outputs.items())

        # Reflection
        reflection_agent = create_reflection_agent(model_client)
        refined_output = await reflect_answer(reflection_agent, merged_output)

        # Validation
        validator_agent = create_validator_agent(model_client)
        validation = await validate_answer(validator_agent, refined_output)

        return refined_output, validation.verdict, validation.reason

    refined_output, verdict, reason = asyncio.run(run_pipeline())

    st.subheader("Answer:")
    st.write(refined_output)

    st.subheader("Validation:")
    st.write(f"Verdict: {verdict}")
    st.write(f"Reason: {reason}")
