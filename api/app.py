from fastapi import FastAPI
from api.State import FinalPrompt, FollowupAnswers, InitInput, UserInfoInput
from chat.chat_graph import compiled_graph
from chat.get_more_question_chain import generate_more_question_chain
from chat.qa_chain import qa_chain
app = FastAPI()

@app.get('/')
async def test():
    return {"message": "Hello medic-man"}

# 1 Initialize the chat first time
@app.post("/init")
async def initializeChat(data: InitInput):
    state = {
        "symptoms_input": data.symptoms_input
    }
    result = compiled_graph.invoke(state)
    return result

# 2 get more personal information like age/gender
@app.post("/get_personal_info")
async def getInfo(data:UserInfoInput):
    state = {
        "user_info": data.user_info
    }
    result = compiled_graph.invoke(
        state
    )
    return result


# 3 LLM generate more question
@app.post("/generate_followUp")
async def generate_follow_up(data: InitInput):
    state = " ".join(data.userSymptoms)  
    llm_output = generate_more_question_chain.invoke(state)
    lines = llm_output.split("\n")  
    questions = []

    for line in lines:
        if line.strip().startswith("-"):  
            cleaned = line.strip("- ").strip()  
            questions.append(cleaned)  

    print(questions)
    
    return {"followupQuestions": questions}


# 4 Give Answers based on llm question
@app.post("/get_answers")
async def getAnswers(data:FollowupAnswers):
    state = {
        "user_response":data.user_response
    }
    result = compiled_graph.invoke(state)
    return result

# 5. 
@app.post("/generate_diagnosis")
async def getAnswers(data:FinalPrompt):
    state = data.finalPrompt
    result = qa_chain.invoke(state)
    return result