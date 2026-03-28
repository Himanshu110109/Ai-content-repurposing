from langchain_community.document_loaders import PyPDFLoader
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
from fastapi import UploadFile
import tempfile
async def pdfload(file:UploadFile):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        content = await file.read()
        temp.write(content)
        temp_path = temp.name

    loader = PyPDFLoader(temp_path)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    splitted = splitter.split_documents(documents)
    return splitted
