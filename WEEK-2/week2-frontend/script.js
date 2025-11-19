// ---- DOM ----
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

let allProducts = []; // raw data from fetch
let visibleProducts = []; // filtered + sorted

// ---- fetch products ----
async function loadProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products');// requests data from this server
    const data = await res.json(); //res.json() converts the response to a js obj
    // dummyjson returns { products: [...] }
    allProducts = data.products || [];
    visibleProducts = allProducts.slice();
    renderProducts();
  } catch (err) {
    productsEl.innerHTML = '<p >Failed to load products.</p>';
    console.error(err);
  }
}

// ---- render function ----
function renderProducts() {
  if (!visibleProducts.length) {
    productsEl.innerHTML = '<p>No products found.</p>';
    return;
  }

  productsEl.innerHTML = visibleProducts.map(productCardHTML).join('');
}

// ---- card HTML ----
function productCardHTML(p) {
  // p.title, p.thumbnail or p.images[0], p.price
  const img = (p.thumbnail || (p.images && p.images[0]) || '');
  const safeTitle = escapeHtml(p.title || '');
  const safePrice = Number(p.price).toFixed(2);
  return `
    <article class="card" data-id="${p.id}">
      <div class="media">
        <img src="${img}" alt="${safeTitle}">
      </div>
      <div class="title">${safeTitle}</div>
      <div class="price">$ ${safePrice}</div>
    </article>
  `;
}

// small helper to avoid simple HTML injection in titles
function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#039;');
}

// ---- search + sort logic ----
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  visibleProducts = allProducts.filter(p => p.title.toLowerCase().includes(q));

  const sortMode = sortSelect.value;
  if (sortMode === 'high-low'){
    visibleProducts.sort((a,b) => b.price - a.price);
  }

  renderProducts();
}

// ---- events ----
searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);

// ---- start ----
loadProducts();
