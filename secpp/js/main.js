// ---------------------- Navbar Injection ----------------------
window.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-placeholder");
  if (navbarContainer) {
    fetch("../components/navbar.html")
      .then(res => res.text())
      .then(data => {
        navbarContainer.innerHTML = data;
      })
      .catch(err => console.error("Navbar load failed:", err));
  }
});

// ---------------------- Cart Badge Update ----------------------
function updateCartBadge() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

// ---------------------- Add Product to Cart ----------------------
function addToCart(productId, productList) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const product = productList.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  alert(`${product.name} added to cart!`);
}

// ---------------------- Place Order ----------------------
function placeOrder(customerUsername) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const newOrder = {
    id: Date.now(),
    customer: customerUsername,
    items: cart,
    status: "Pending",
    assignedTo: null,
    history: [{ status: "Pending", timestamp: new Date().toISOString() }]
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  alert("Order placed successfully!");
  window.location.href = "my-orders.html";
}

// ---------------------- Assign Order to Driver (Admin Panel) ----------------------
function assignOrder(orderId, driverName) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const order = orders.find(o => o.id === orderId);

  if (order) {
    order.assignedTo = driverName;
    order.status = "Assigned to Driver";
    order.history.push({ status: "Assigned to Driver", timestamp: new Date().toISOString() });

    localStorage.setItem("orders", JSON.stringify(orders));
    alert(`Order assigned to ${driverName}`);
    location.reload();
  }
}

// ---------------------- Update Order Status (Driver Panel) ----------------------
function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const order = orders.find(o => o.id === orderId);

  if (order) {
    order.status = newStatus;
    order.history.push({ status: newStatus, timestamp: new Date().toISOString() });

    localStorage.setItem("orders", JSON.stringify(orders));
    alert("Order status updated!");
    location.reload();
  }
}

// ---------------------- Load Orders By Role ----------------------
function getOrdersByRole(role, username) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (role === "customer") {
    return orders.filter(o => o.customer === username);
  }

  if (role === "driver") {
    return orders.filter(o => o.assignedTo === username);
  }

  return orders; // For admin
}
