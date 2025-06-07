import requests
import os
from PIL import Image
from io import BytesIO

# URLs das imagens
IMAGES = {
    'hero-image.jpg': 'https://images.unsplash.com/photo-1559057697-8c475a777765',
    'profissional.jpg': 'https://images.unsplash.com/photo-1573497019587-69e4b09b6c3e',
    'logo.png': 'https://images.unsplash.com/photo-1573497019587-69e4b09b6c3e'
}

def download_image(url, filename):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Salvar a imagem
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"Imagem {filename} baixada com sucesso!")
        
        # Abrir e redimensionar a imagem se necessário
        with Image.open(filename) as img:
            # Redimensionar hero-image para 1600x900
            if filename == 'hero-image.jpg':
                img = img.resize((1600, 900), Image.Resampling.LANCZOS)
            # Redimensionar profissional para 800x600
            elif filename == 'profissional.jpg':
                img = img.resize((800, 600), Image.Resampling.LANCZOS)
            # Redimensionar logo para 300x100
            elif filename == 'logo.png':
                img = img.resize((300, 100), Image.Resampling.LANCZOS)
            
            # Salvar a imagem redimensionada
            img.save(filename)
            print(f"Imagem {filename} redimensionada com sucesso!")
            
    except Exception as e:
        print(f"Erro ao baixar {filename}: {str(e)}")

if __name__ == "__main__":
    # Criar pasta assets/images se não existir
    os.makedirs('assets/images', exist_ok=True)
    
    # Baixar cada imagem
    for filename, url in IMAGES.items():
        filepath = os.path.join('assets', 'images', filename)
        download_image(url, filepath)
