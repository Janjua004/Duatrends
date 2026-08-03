import { Product } from '../types';

// StyleWing Cloud Database API Configuration
const API_ENDPOINT = 'https://api.npoint.io/468bc70d306b3a246ad1';

/**
 * Fetch latest products from the cloud database server
 */
export async function fetchProductsFromCloud(): Promise<Product[] | null> {
  try {
    const customUrl = localStorage.getItem('stylewing_custom_api_url');
    const targetUrl = customUrl || API_ENDPOINT;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const productsList = data?.record || (Array.isArray(data) ? data : null);

    if (Array.isArray(productsList) && productsList.length > 0) {
      localStorage.setItem('stylewing_products', JSON.stringify(productsList));
      return productsList as Product[];
    }
    return null;
  } catch (err) {
    console.warn('Cloud database fetch warning:', err);
    return null;
  }
}

/**
 * Sync updated products array to the cloud database server automatically
 */
export async function syncProductsToCloud(products: Product[]): Promise<boolean> {
  try {
    // Save to local device cache immediately
    localStorage.setItem('stylewing_products', JSON.stringify(products));

    const customUrl = localStorage.getItem('stylewing_custom_api_url');
    const targetUrl = customUrl || API_ENDPOINT;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products),
    });

    return response.ok;
  } catch (err) {
    console.warn('Cloud sync error:', err);
    return false;
  }
}
