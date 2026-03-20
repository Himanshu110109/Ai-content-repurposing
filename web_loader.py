from langchain_community.document_loaders import WebBaseLoader
from bs4 import SoupStrainer
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
def webload(path):
    webloader = WebBaseLoader(
            web_path=path,
            bs_kwargs={
                "parse_only": SoupStrainer([
                    "main",
                    "article",
                    "section",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "p",
                    "li"
                ])
            }
        )
    webdocuments = webloader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    websplits = splitter.split_documents(webdocuments)
    return websplits