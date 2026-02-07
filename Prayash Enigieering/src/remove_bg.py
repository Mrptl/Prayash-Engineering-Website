import sys
import os

try:
    from rembg import remove
    from PIL import Image
    
    def remove_background(input_path, output_path):
        print(f"Processing {input_path} with rembg...")
        inp = Image.open(input_path)
        output = remove(inp)
        output.save(output_path)
        print(f"Saved to {output_path}")

except ImportError:
    print("rembg not found, falling back to simple white removal with PIL")
    from PIL import Image
    
    def remove_background(input_path, output_path):
        print(f"Processing {input_path} with PIL (white removal)...")
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")

if __name__ == "__main__":
    files = [
        r"d:\SuchnaTS\Prayash Engineering\Prayash Enigieering\src\assets\whatsapp.png",
        r"d:\SuchnaTS\Prayash Engineering\Prayash Enigieering\src\assets\arrow-up.png"
    ]
    
    for f in files:
        if os.path.exists(f):
            # Backup original
            backup = f + ".bak"
            if not os.path.exists(backup):
                import shutil
                shutil.copy2(f, backup)
            
            # Process
            remove_background(f, f)
        else:
            print(f"File not found: {f}")
