from PIL import Image

def make_transparent(image_path):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    # Champagne gold #D4AF37 -> 212, 175, 55
    target_r, target_g, target_b = 212, 175, 55
    
    for item in data:
        r, g, b, a = item
        # Calculate pixel brightness (luma)
        luma = (0.299*r + 0.587*g + 0.114*b)
        
        # Boost luma slightly to ensure lines aren't too faint
        alpha = int(min(255, luma * 1.5))
        
        # Use target color with computed alpha to eliminate black halos
        new_data.append((target_r, target_g, target_b, alpha))
        
    img.putdata(new_data)
    img.save(image_path, "PNG")

make_transparent("c:/Users/Devottam/OneDrive/Pictures/Desktop/royal-wedding/public/ganesh.png")
print("Successfully processed Ganesh PNG to true transparency.")
