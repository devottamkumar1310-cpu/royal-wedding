from PIL import Image

def generate_themed_ganesh(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    new_data = []
    
    # Coordinates mapping
    for y in range(height):
        # Calculate transition factor: Dusty Blue (0) -> Muted Charcoal (1)
        # Transition completes by 35% of the image height
        factor = y / (height * 0.35)
        factor = min(1.0, factor)
        
        # Interpolating RGB:
        # Start: Dusty Blue #A4C3D2 (164, 195, 210)
        # End: Muted Charcoal #3A3B4C (58, 59, 76)
        r = int((1 - factor) * 164 + factor * 58)
        g = int((1 - factor) * 195 + factor * 59)
        b = int((1 - factor) * 210 + factor * 76)
        
        for x in range(width):
            pixel = img.getpixel((x, y))
            # Keep original alpha channel
            a = pixel[3]
            new_data.append((r, g, b, a))
            
    themed_img = Image.new("RGBA", (width, height))
    themed_img.putdata(new_data)
    themed_img.save(output_path, "PNG")
    print(f"Successfully generated themed Ganesh image at {output_path}")

input_img = "c:/Users/Devottam/OneDrive/Pictures/Desktop/royal-wedding/public/ganesh.png"
output_img = "c:/Users/Devottam/OneDrive/Pictures/Desktop/royal-wedding/public/ganesh-blue-theme.png"

generate_themed_ganesh(input_img, output_img)
