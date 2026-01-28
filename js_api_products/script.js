/**
 * Fetch data from API and display products
 * API: https://api.escuelajs.co/api/v1/products
 */

const API_URL = 'https://api.escuelajs.co/api/v1/products';
const productList = document.getElementById('product-list');

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        productList.innerHTML = `<p class="error">Failed to load products. Please try again later.</p>`;
    }
}

function renderProducts(products) {
    // Clear list just in case
    productList.innerHTML = '';

    products.forEach(product => {
        // Create product card
        const card = document.createElement('div');
        card.className = 'product-card';

        // Extract data
        // Check if images array exists and has items, otherwise use a placeholder
        // Sometimes the API returns dirty URLs in image array (brackets, quotes etc), 
        // but usually just strings. We'll try to use the first one.
        // Some images in this API are notoriously clean, others broken.
        let imageUrl = 'https://placehold.co/600x400?text=No+Image';
        if (product.images && product.images.length > 0) {
            // Clean up URL if it has extra generic brackets/quotes (a known quirk of this specific API sometime)
             let rawUrl = product.images[0];
            // Simple check to remove ["..."] casing if it accidentally comes as stringified array
            if (rawUrl.startsWith('["') && rawUrl.endsWith('"]')) {
                rawUrl = rawUrl.substring(2, rawUrl.length - 2);
            }
            imageUrl = rawUrl;
        }

        const title = product.title || 'Untitled';
        const description = product.description || 'No description available.';
        const price = product.price ? `$${product.price}` : 'Free';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" class="product-image" onerror="this.src='https://placehold.co/600x400?text=Image+Error'">
            <div class="product-info">
                <h3 class="product-title">${title}</h3>
                <p class="product-description">${description}</p>
                <div class="product-price">${price}</div>
            </div>
        `;

        productList.appendChild(card);
    });
}

// Initial Call
fetchProducts();
