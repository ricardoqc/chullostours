import requests
from bs4 import BeautifulSoup
import json
import os
import re

URLS = [
    "https://www.chullostours.com/tours-en-cusco-guia-completa/",
    "https://www.chullostours.com/guia-completa-para-viajar-a-machupicchu/",
    "https://www.chullostours.com/cuanto-cuesta-viajar-a-machu-picchu-2025/",
    "https://www.chullostours.com/mejores-fechas-viaje-machu-picchu-en-2025/"
]

output_dir = "C:/Users/Ricki/OneDrive/Documentos/Proyectos/chullostours/app-frontend/src/data/blog"
os.makedirs(output_dir, exist_ok=True)

for url in URLS:
    try:
        print(f"Scraping {url}")
        res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')
        
        slug = url.strip('/').split('/')[-1]
        
        # WordPress commonly uses h1 for title
        title_tag = soup.find('h1')
        title = title_tag.get_text(strip=True) if title_tag else ""
        
        # Category
        cat_tag = soup.select_one('.blog-category a') or soup.select_one('.category')
        category = cat_tag.get_text(strip=True) if cat_tag else "Guías de Viaje"
        
        # Date
        date_tag = soup.select_one('.blog-date') or soup.select_one('.post-date')
        date = date_tag.get_text(strip=True) if date_tag else "Enero 2025"
        
        # Image
        img_tag = soup.select_one('.blog-details-img img') or soup.select_one('.wp-post-image')
        image_url = img_tag['src'] if img_tag and img_tag.has_attr('src') else ""
        
        # Content - extract from article or .blog-details or .entry-content
        content_container = soup.select_one('.entry-content') or soup.select_one('.blog-details') or soup.find('article')
        
        content = ""
        if content_container:
            # Clean up the container
            for el in content_container.select('script, style, .sharedaddy, .jp-relatedposts'):
                el.decompose()
            # extract basic html
            content = str(content_container)
        
        # Meta description or excerpt
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        excerpt = meta_desc['content'] if meta_desc else ""
        
        data = {
            "slug": slug,
            "title": title,
            "excerpt": excerpt,
            "date": date,
            "author": "Equipo Chullos",
            "category": category,
            "imageUrl": image_url,
            "content": content
        }
        
        out_path = os.path.join(output_dir, f"{slug}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Saved {slug}.json")
    except Exception as e:
        print(f"Error scraping {url}: {e}")
