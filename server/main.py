# FASTAPI imports 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request

from langchain_core.messages import HumanMessage
#wrapper around OpenAI chat models. handles API calls, message formatting, streaming responses
from langchain_openai import ChatOpenAI 
# tools and functions the AI can call
from langchain.tools import tool 
# ReAct-style agent: Reason, Act, Observe , Repeat. lets AI think, decide, use result, respond
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
import os
import json
import re
from pathlib import Path
from pydantic import BaseModel

#loads in the .env file
# Load `server/.env` reliably when running from repo root.
load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

app = FastAPI(title="Nom API")

# Ensure 500s still return a JSON body (and pass through CORS middleware).
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": f"Internal Server Error: {type(exc).__name__}"})

# Simple in-memory cache for latest recommendations (single-process).
LAST_RECOMMENDATIONS: list[str] = []


origins=["http://localhost:5173","http://127.0.0.1:5173","https://nom-food-recommendation.vercel.app"]

# Enable CORS to talk to React (origin must include scheme: http://)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return{"message": "FastAPI is running"}

class Preferences(BaseModel):
    foods: list[str]
    preferences: list[str] = []

# get user's preferences
@app.post("/api/preferences")
def preferences(data: Preferences):
    print("foods:", data.foods)
    print("preferences:", data.preferences)
    return {"received": {"foods": data.foods, "preferences": data.preferences}}

@app.post("/api/generatefoodrec")
def generatefoodrec(data: Preferences):
    print(data)

    prompt = f"""
    The user likes these cuisines: {data.foods}
    Dietary preferences/restrictions: {data.preferences}

    Return 5 food recommendations as a JSON array of strings.
    Only return valid JSON (no backticks, no extra text).
    Example:
    ["Grilled Salmon Bowl", "Chicken Teriyaki", "Tofu Stir Fry"]

    """
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        msg = llm.invoke([HumanMessage(content=prompt)])
    except Exception as e:
        # If this fires in production, it's usually a missing/invalid OPENAI_API_KEY.
        raise HTTPException(status_code=500, detail=f"LLM call failed: {type(e).__name__}") from e
    content = (msg.content or "").strip()

    # Parse the model output as JSON array; fallback to extracting first [...] block.
    try:
        foods = json.loads(content)
    except json.JSONDecodeError:
        m = re.search(r"\[[\s\S]*\]", content)
        foods = json.loads(m.group(0)) if m else []

    if not isinstance(foods, list):
        foods = []
    foods = [str(x) for x in foods][:5]

    global LAST_RECOMMENDATIONS
    LAST_RECOMMENDATIONS = foods
    return {"foods": foods}




#send back test data
@app.get('/api/recommend')
def recommend():
    foods = LAST_RECOMMENDATIONS or ["beef", "chicken", "salmon"]
    print("sending data to react: ", foods)
    return {"foods": foods}
    



def main():
    # Instantiates a chat model. temp = 0 means very deterministic, less creative
    model = ChatOpenAI(temperature=0) 

    # registers functions the agent can use
    tools = []

    # creates the ReAct agent
    agent_executor = create_react_agent(model, tools)

    # startup messages 
    print("Welcome! I'm your AI assistant. Type 'quit' to exit.")
    print("You can ask me to perform calculations or chat with me.")

    # keeps chat running until quit
    while True:
        user_input = input("\nYou: ").strip() 

        if user_input == "quit":
            break
        
        # labels the response, doesn't move to a new line
        print("\nAssistant: ", end="") 

        # streaming the agent response, sends partial outputs to simulate typing 
        for chunk in agent_executor.stream(
            # calls the chat model we declared above
            {"messages": [HumanMessage(content=user_input)]}
        ):
            
            # a chunk is a partial update from LangGraph agent 
            # could represent resoning, calling a tool, generating final text
            # condition is to filter the chunks that come from agent and contain actual messages to print
            if "agent" in chunk and "messages" in chunk["agent"]:
                for message in chunk["agent"]["messages"]:
                    print(message.content, end="")
            print() # prints empty line

if __name__ == "__main__":
    main()




