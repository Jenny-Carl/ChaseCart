import requests

def get_product_info(barcode):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if data.get("status") == 1:  # Check if product exists
            product = data.get("product", {})
            name = product.get("product_name", "Unknown Product")
            brand = product.get("brands", "Unknown Brand")
            description = product.get("generic_name", "No description available")
            ingredients = product.get("ingredients_text", "No ingredient information")
            return {
                "Name": name,
                "Brand": brand,
                "Description": description,
                "Ingredients": ingredients
            }
        else:
            return {"Error": "Product not found in Open Food Facts database."}
    else:
        return {"Error": f"Failed to fetch data. HTTP Status: {response.status_code}"}

if __name__ == "__main__":
    barcode = input("Scan a barcode: ").strip()
    product_info = get_product_info(barcode)
    
    print("\nProduct Information:")
    for key, value in product_info.items():
        print(f"{key}: {value}")
