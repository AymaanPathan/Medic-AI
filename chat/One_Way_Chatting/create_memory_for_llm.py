from langchain.document_loaders import PyPDFLoader,DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import   HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv
load_dotenv()

DATA_PATH = "docs/"
# 1 load the data
def load_pdf_files(data):
    loader =DirectoryLoader(data,glob="*.pdf",loader_cls=PyPDFLoader)
    documents = loader.load()
    return documents

my_docs = load_pdf_files(data=DATA_PATH)
# print(len(my_docs))


# 2 create chunks
def create_chunks(data):
    text_splitter =RecursiveCharacterTextSplitter(chunk_size=100,chunk_overlap=50)
    text_chunks =text_splitter.split_documents(data)
    return text_chunks 

print(create_chunks(my_docs))
text_chunks = create_chunks(data=my_docs)

# 3 create vector embeddings
def get_embedding_model():
    embedding_model=HuggingFaceEmbeddings (model_name="sentence-transformers/all-MiniLM-L6-v2")
    return embedding_model


embedding_model = get_embedding_model()


# 4 store embedding on FAISS [cloud]
DB_FAISS_PATH = "../vectorstore/db_faiss"
db = FAISS.from_documents(text_chunks,embedding_model)
db.save_local(DB_FAISS_PATH)