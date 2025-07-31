from langchain.chains import RetrievalQA
from langchain.llms import Ollama

llm = Ollama(model="mistral")  # Change to your preferred Ollama model
retriever = db.as_retriever()

qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

query = "What are my notes about productivity?"
result = qa.run(query)

print(result)
