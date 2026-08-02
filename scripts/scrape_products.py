import urllib.request
import json
import os
import re

url = "https://stylewing.pk/products.json?limit=50"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

parsed_products = []

image_fallback_triplets = [
    [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
    ]
]

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=8) as response:
        data = json.loads(response.read().decode('utf-8'))
        products = data.get('products', [])
        print(f"Fetched {len(products)} products from stylewing.pk")

        for idx, p in enumerate(products):
            desc_raw = p.get('body_html', '') or ''
            desc_clean = re.sub(r'<[^>]+>', ' ', desc_raw)
            desc_clean = ' '.join(desc_clean.split())
            
            variants = p.get('variants', [])
            price = float(variants[0]['price']) if variants else 4500.0
            compare_price = float(variants[0]['compare_at_price']) if variants and variants[0].get('compare_at_price') else round(price * 1.25, -2)
            sku = variants[0].get('sku') or f"SW-PAR-{p.get('id', idx+100)}"
            
            scraped_imgs = [img['src'] for img in p.get('images', [])]
            fallback_imgs = image_fallback_triplets[idx % len(image_fallback_triplets)]
            
            # Ensure minimum 3 images per product
            images = scraped_imgs
            if len(images) < 3:
                for f_img in fallback_imgs:
                    if f_img not in images:
                        images.append(f_img)
                    if len(images) >= 3:
                        break

            p_type = p.get('product_type', 'Unstitched Wear').strip() or "Luxury Wear"
            colors = ["Emerald Green", "Pastel Pink", "Royal Velvet", "Jet Black", "Ivory Gold", "Ruby Red"]
            available_colors = colors[idx % len(colors): idx % len(colors) + 3]
            sizes = ["Unstitched", "Small", "Medium", "Large", "Custom Tailored"]
            
            parsed_products.append({
                "id": f"product-{p.get('id')}",
                "title": p.get('title'),
                "slug": p.get('handle'),
                "sku": sku,
                "price": price,
                "compareAtPrice": compare_price,
                "category": p_type,
                "description": desc_clean if desc_clean else "Exquisite luxury ladies outfit featuring high grade embroidery, premium fabric, and elegant craftsmanship tailored for StyleWing collection.",
                "images": images[:4],
                "colors": available_colors,
                "sizes": sizes,
                "stock": 15 + (idx * 3) % 40,
                "rating": round(4.2 + (idx % 8) * 0.1, 1),
                "reviewCount": 12 + (idx * 7) % 85,
                "isFeatured": idx < 8,
                "isTrending": idx % 3 == 0,
                "isNewArrival": idx < 12,
                "isOffer": compare_price > price,
                "clicks": 45 + (idx * 17) % 230,
                "specifications": {
                    "Fabric": "Premium Lawn / Chiffon / Raw Silk",
                    "Dupatta": "Printed / Embroidered Silk Dupatta (2.5 MTR)",
                    "Shirt": "Embroidered Front & Back Lawn (2.5 MTR)",
                    "Trouser": "Dyed Cambric Trouser (2.5 MTR)",
                    "Care": "Dry Clean Recommended"
                }
            })

except Exception as e:
    print(f"Network request fallback: {e}")

if not parsed_products:
    sample_titles = [
        "StyleWing Dil-e-Raqsum 3 PC Lawn",
        "StyleWing Mahara Velvet Festive Suit",
        "StyleWing Noor-e-Bahar 3 PC Lawn",
        "StyleWing Sapphire Chiffon Formal",
        "StyleWing Digital Printed Summer Casual",
        "StyleWing Royal Gold Zari Work Formal",
        "StyleWing Pastels Cotton Net Set",
        "StyleWing Emerald Green Organza Suit",
        "StyleWing Black Rose Chiffon Festive",
        "StyleWing Ivory Embroidered Kurti",
        "StyleWing Crimson Red Bridal Suit",
        "StyleWing Rose Gold Silk Dupatta Set"
    ]

    for idx, title in enumerate(sample_titles):
        price = 4500.0 + (idx * 600)
        triplet = image_fallback_triplets[idx % len(image_fallback_triplets)]
        parsed_products.append({
            "id": f"product-{idx + 101}",
            "title": title,
            "slug": title.lower().replace(' ', '-'),
            "sku": f"SW-PAR-00{idx+1}",
            "price": price,
            "compareAtPrice": price * 1.25,
            "category": "Unstitched Wear" if idx % 2 == 0 else "Party Wear",
            "description": "Exquisite luxury ladies outfit featuring high grade embroidery, premium fabric, and elegant craftsmanship inspired by StyleWing collection.",
            "images": triplet,
            "colors": ["Pastel Pink", "Emerald Green", "Royal Velvet"],
            "sizes": ["Unstitched", "Small", "Medium", "Large"],
            "stock": 25,
            "rating": 4.8,
            "reviewCount": 35,
            "isFeatured": idx < 6,
            "isTrending": idx % 2 == 0,
            "isNewArrival": idx < 8,
            "isOffer": True,
            "clicks": 120 + idx * 15,
            "specifications": {
                "Fabric": "Premium Lawn / Chiffon / Silk",
                "Dupatta": "Embroidered Dupatta (2.5 MTR)",
                "Shirt": "Embroidered Front & Back (2.5 MTR)",
                "Trouser": "Dyed Cotton Trouser (2.5 MTR)",
                "Care": "Dry Clean Recommended"
            }
        })

target_dir = r"c:\Users\Janjua\Desktop\StyleWing\src\data"
os.makedirs(target_dir, exist_ok=True)
out_file = os.path.join(target_dir, "scraped_products.json")
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(parsed_products, f, indent=2, ensure_ascii=False)

print(f"SUCCESS: Ensured minimum 3 images for all {len(parsed_products)} products in {out_file}")
