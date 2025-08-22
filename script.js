// Product data
const products = [
  {
    id: 1,
    name: "MayaCode Premium 90g",
    price: 55,
    image: "assets/gold.jpg",
    description: "Perfecto para probar nuestro café premium. Ideal para 1-2 semanas de consumo diario.",
    features: ["90g de café soluble premium", "Aproximadamente 45 tazas", "Empaque hermético"],
  },
  {
    id: 2,
    name: "MayaCode Premium 180g",
    price: 95,
    image: "assets/gold-big.png",
    description: "La opción más popular. Perfecto para familias o consumidores frecuentes.",
    features: ["180g de café soluble premium", "Aproximadamente 90 tazas", "Mejor relación precio-cantidad"],
  },
]

// Carrito
let cart = []

const cartBtn = document.getElementById("cart-btn")
const cartCount = document.getElementById("cart-count")
const productModal = document.getElementById("product-modal")
const cartModal = document.getElementById("cart-modal")
const closeModal = document.getElementById("close-modal")
const closeCart = document.getElementById("close-cart")
const addToCartBtn = document.getElementById("add-to-cart-btn")
const checkoutBtn = document.getElementById("checkout-btn")

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  updateCartUI()
})

function setupEventListeners() {
  // Boton de carrito
  cartBtn.addEventListener("click", () => showCart())

  // WhatsApp
  document.getElementById("whatsapp-btn").addEventListener("click", handleWhatsApp)
  document.getElementById("subscribe-btn").addEventListener("click", handleWhatsApp)
  document.getElementById("phone-btn").addEventListener("click", handleWhatsApp)

  // Boton de navegación
  document.getElementById("explore-btn").addEventListener("click", () => {
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("buy-now-btn").addEventListener("click", () => {
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" })
  })

  document.querySelectorAll(".product-details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = Number.parseInt(e.target.dataset.product)
      showProductModal(productId)
    })
  })

  // Modal 
  closeModal.addEventListener("click", () => hideProductModal())
  closeCart.addEventListener("click", () => hideCart())

  productModal.addEventListener("click", (e) => {
    if (e.target === productModal) hideProductModal()
  })

  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) hideCart()
  })

  // Boton añadir al carrito
  addToCartBtn.addEventListener("click", () => {
    const productId = Number.parseInt(addToCartBtn.dataset.productId)
    addToCart(productId)
    hideProductModal()
    showCart()
  })

  checkoutBtn.addEventListener("click", handleCheckout)
}

function showProductModal(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  document.getElementById("modal-product-name").textContent = product.name
  document.getElementById("modal-product-image").src = product.image
  document.getElementById("modal-product-image").alt = product.name
  document.getElementById("modal-product-description").textContent = product.description
  document.getElementById("modal-product-price").textContent = `Q${product.price}`

  const featuresList = document.getElementById("modal-product-features")
  featuresList.innerHTML = ""
  product.features.forEach((feature) => {
    const li = document.createElement("li")
    li.textContent = feature
    featuresList.appendChild(li)
  })

  addToCartBtn.dataset.productId = productId
  productModal.classList.remove("hidden")
}

function hideProductModal() {
  productModal.classList.add("hidden")
}

function showCart() {
  updateCartModal()
  cartModal.classList.remove("hidden")
}

function hideCart() {
  cartModal.classList.add("hidden")
}

function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ ...product, quantity })
  }

  updateCartUI()
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
  updateCartModal()
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity === 0) {
    removeFromCart(productId)
  } else {
    const item = cart.find((item) => item.id === productId)
    if (item) {
      item.quantity = newQuantity
      updateCartUI()
      updateCartModal()
    }
  }
}

function getTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

function getTotalItems() {
  return cart.reduce((total, item) => total + item.quantity, 0)
}

function updateCartUI() {
  const totalItems = getTotalItems()
  if (totalItems > 0) {
    cartCount.textContent = totalItems
    cartCount.classList.remove("hidden")
  } else {
    cartCount.classList.add("hidden")
  }
}

function updateCartModal() {
  const cartItems = document.getElementById("cart-items")
  const cartEmpty = document.getElementById("cart-empty")
  const cartTotal = document.getElementById("cart-total")
  const totalPrice = document.getElementById("total-price")

  if (cart.length === 0) {
    cartItems.innerHTML = ""
    cartEmpty.classList.remove("hidden")
    cartTotal.classList.add("hidden")
  } else {
    cartEmpty.classList.add("hidden")
    cartTotal.classList.remove("hidden")

    cartItems.innerHTML = ""
    cart.forEach((item) => {
      const cartItem = createCartItemElement(item)
      cartItems.appendChild(cartItem)
    })

    totalPrice.textContent = `Q${getTotalPrice()}`
  }
}

function createCartItemElement(item) {
  const div = document.createElement("div")
  div.className = "cart-item"
  div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">Q${item.price}</p>
        </div>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `
  return div
}

function handleCheckout() {
  alert("¡Pagado! Gracias por tu compra!")
  cart = []
  updateCartUI()
  hideCart()
}

function handleWhatsApp() {
  const message = encodeURIComponent(
    "¡Hola! Me interesa conocer más sobre MayaCode - Café Soluble Premium. ¿Podrían brindarme más información?",
  )
  window.open(`https://wa.me/50212345678?text=${message}`, "_blank")
}

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity
window.removeFromCart = removeFromCart
