from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from connect_memory_for_llm import llm
from more_question_prompt import generate_more_prompt_template


def set_custom_prompt(prompt_template: str):
    return PromptTemplate(template=prompt_template, input_variables=["context"])

prompt = set_custom_prompt(generate_more_prompt_template)



generate_more_question_chain = (
    {"context": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)