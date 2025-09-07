from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader
from tqdm import tqdm
import logging
import time
import os

# Set GPU layers for Ollama (uncomment if GPU issues persist)
# os.environ["OLLAMA_GPU_LAYERS"] = "50"

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Path to your Obsidian vault
VAULT_PATH = "/home/lane/Documents/lkat-vault/20-29 Work/23 MMH"

logger.info(f"Loading documents from: {VAULT_PATH}")
# Load and split markdown files
loader = DirectoryLoader(VAULT_PATH, glob="**/*.md", loader_cls=TextLoader)
docs = loader.load()
logger.info(f"Loaded {len(docs)} documents")

logger.info("Splitting documents into chunks...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
splits = text_splitter.split_documents(docs)
logger.info(f"Created {len(splits)} chunks from {len(docs)} documents")

logger.info("Initializing Ollama embeddings...")
# Use Ollama for embeddings - will use GPU if available, CPU as fallback
embeddings = OllamaEmbeddings(model="mistral")  # or llama3, phi3, etc.

logger.info("Creating embeddings and storing in Chroma...")
# Store in Chroma with progress tracking
start_time = time.time()
db = Chroma.from_documents(
    documents=splits, 
    embedding=embeddings, 
    persist_directory="./chroma"
)
end_time = time.time()
logger.info(f"Vector database created successfully in {end_time - start_time:.2f} seconds!")
# No need to call persist() explicitly in newer versions
