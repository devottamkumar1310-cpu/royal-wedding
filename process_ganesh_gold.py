from PIL import Image

def generate_gold_ganesh(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    new_data = []
    
    # Matte Gold values
    # Top: #C8A85D (200, 168, 93)
    # Bottom: #B89B52 (184, 155, 82)
    for y in range(height):
        factor = y / height
        # Simple linear interpolation between the two matte gold shades
        r = int((1 - factor) * 200 + factor * 184)
        g = int((1 - factor) * 168 + factor * 155)
        b = int((1 - factor) * 93 + factor * 82)
        
        for x in range(width):
            pixel = img.getpixel((x, y))
            # Keep original alpha channel
            a = pixel[3]
            new_data.append((r, g, b, a))
            
    gold_img = Image.new("RGBA", (width, height))
    gold_img.putdata(new_data)
    gold_img.save(output_path, "PNG")
    print(f"Successfully generated gold Ganesh image at {output_path}")

input_img = "c:/Users/Devottam/OneDrive/Pictures/Desktop/royal-wedding/public/ganesh.png"
output_img = "c:/Users/Devottam/OneDrive/Pictures/Desktop/royal-wedding/public/ganesh-gold.png"

generate_gold_ganesh(input_img, output_img)
