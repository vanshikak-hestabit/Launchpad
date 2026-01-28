import asyncio
from memory.agent_memory_runner import MemoryAgent

async def main():
    agent = MemoryAgent()
    print("Memory Agent Ready. Type 'exit' to quit.")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        reply = await agent.chat(user_input)
        print("Agent:", reply)

if __name__ == "__main__":
    asyncio.run(main())
