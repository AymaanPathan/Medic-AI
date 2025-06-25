from langchain.memory import ConversationBufferWindowMemory
from Two_way_Chatting.Main.model_config import load_llm
from langchain.chains import ConversationChain

memory = ConversationBufferWindowMemory(k=1,return_messages=True)


chain = ConversationChain(llm=load_llm, memory=memory)

response = chain.invoke({"input": "hi my name is aymaan"})
response2 = chain.invoke({"input": "what is my name"})
print(response2) 