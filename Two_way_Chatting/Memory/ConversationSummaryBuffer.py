from langchain.memory import ConversationSummaryBufferMemory
from Two_way_Chatting.model_config import load_llm
from langchain.chains import ConversationChain

memory = ConversationSummaryBufferMemory(llm=load_llm,max_token_limit=40)


chain = ConversationChain(llm=load_llm, memory=memory)

response = chain.invoke({"input": "hi my name is aymaan"})
response2 = chain.invoke({"input": "what is my name"})
print(response2) 