from langchain.memory import ConversationSummaryMemory
from Two_way_Chatting.model_config import load_llm
from langchain.chains import ConversationChain

memory = ConversationSummaryMemory(llm=load_llm,return_messages=True)


chain = ConversationChain(llm=load_llm, memory=memory)

response = chain.invoke({"input": "hi my name is aymaan"})
response2 = chain.invoke({"input": "what is my name"})
print(response2)