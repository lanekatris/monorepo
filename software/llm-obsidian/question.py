from langchain.vectorstores import Chroma
from langchain.embeddings import OllamaEmbeddings
from langchain.llms import Ollama
from langchain.chains import RetrievalQA

# Load saved Chroma DB
embedding = OllamaEmbeddings(model="mistral")
db = Chroma(persist_directory="./chroma", embedding_function=embedding)

# Use the retriever
retriever = db.as_retriever()
llm = Ollama(model="mistral")
qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

query = "tell me about csv"
result = qa.run(query)
print(result)