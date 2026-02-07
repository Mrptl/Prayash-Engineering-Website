import pypdf
import sys
import os

def extract_text_from_pdf(pdf_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error reading {pdf_path}: {str(e)}"

if __name__ == "__main__":
    files = [
        r"d:\SuchnaTS\Prayash Engineering\Prayash Enigieering\src\assets\Prayash Compny Profile.pdf",
        # Add other files here later if needed
    ]
    
    for file_path in files:
        print(f"--- Extracting from {os.path.basename(file_path)} ---")
        print(extract_text_from_pdf(file_path))
        print("--------------------------------------------------\n")
