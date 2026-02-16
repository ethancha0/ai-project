# FASTAPI imports 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.messages import HumanMessage
#wrapper around OpenAI chat models. handles API calls, message formatting, streaming responses
from langchain_openai import ChatOpenAI 
# tools and functions the AI can call
from langchain.tools import tool 
# ReAct-style agent: Reason, Act, Observe , Repeat. lets AI think, decide, use result, respond
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
import os
from pydantic import BaseModel

#loads in the .env file
load_dotenv()
api_key = os.getenv("OPENAI_AI_KEY")

app = FastAPI(title="Nom API")


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

# get user's preferences
@app.post("/api/preferences")
def preferences(data: Preferences):
    print(data.foods)
    return{"recieved": data.foods}

#send back test data
@app.get('/api/recommend')
def recommend():
    foods = ["beef", "chicken", "salmon"]
    print("sending data to react: ", foods)
    return{"foods": foods}
    



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




