from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

pdf_path = "src/data/raw/geography.pdf"

#load file  in python program
loader = PyPDFLoader(file_path=pdf_path)
# loader.load() has loaded each page in docs, so basically we can iterate on docs 
docs = loader.load()
#print(docs[12])

def chunk_load():
    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 700,
    chunk_overlap = 300
    )
    return text_splitter.split_documents(documents=docs)





