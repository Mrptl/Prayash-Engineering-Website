from docx import Document

doc = Document(r'src/assets/Details For Page.docx')

with open('docx_content.txt', 'w', encoding='utf-8') as f:
    for para in doc.paragraphs:
        f.write(para.text + '\n')

print("Content extracted to docx_content.txt")
