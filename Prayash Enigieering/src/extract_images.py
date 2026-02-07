import pypdf
import os

def extract_images_from_pdf(pdf_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    try:
        reader = pypdf.PdfReader(pdf_path)
        count = 0
        for page_num, page in enumerate(reader.pages):
            if '/Resources' in page and '/XObject' in page['/Resources']:
                xObject = page['/Resources']['/XObject'].get_object()
                for obj in xObject:
                    if xObject[obj]['/Subtype'] == '/Image':
                        size = (xObject[obj]['/Width'], xObject[obj]['/Height'])
                        data = xObject[obj].get_data()
                        if '/Filter' in xObject[obj]:
                            if xObject[obj]['/Filter'] == '/FlateDecode':
                                ext = '.png'
                            elif xObject[obj]['/Filter'] == '/DCTDecode':
                                ext = '.jpg'
                            elif xObject[obj]['/Filter'] == '/JPXDecode':
                                ext = '.jp2'
                            else:
                                ext = '.bin'
                        else:
                            ext = '.bin'
                        
                        img_path = os.path.join(output_dir, f"img_{page_num}_{obj}{ext}")
                        with open(img_path, "wb") as f:
                            f.write(data)
                        print(f"Extracted: {img_path}")
                        count += 1
        return count
    except Exception as e:
        print(f"Error: {str(e)}")
        return 0

if __name__ == "__main__":
    pdf = r"d:\SuchnaTS\Prayash Engineering\Prayash Enigieering\Prayash Enigieering\src\assets\Prayash Compny Profile.pdf"
    out = r"d:\SuchnaTS\Prayash Engineering\Prayash Enigieering\Prayash Enigieering\src\assets\extracted_logos"
    extracted = extract_images_from_pdf(pdf, out)
    print(f"Total extracted: {extracted}")
