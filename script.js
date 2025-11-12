document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // --- State & Storage ---
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('artsInTheOvenCart')) || [];
    let isLoggedIn = localStorage.getItem('artsInTheOvenLoggedIn') === 'true'; 

    const saveCart = () => {
        localStorage.setItem('artsInTheOvenCart', JSON.stringify(cart));
        updateCartDisplay();
    };

    // --- Product Data (Single Source of Truth) ---
    // NOTE: Make sure you have an 'images' folder containing these files 
    // (e.g., 'red_velvet.jpg', 'brownie_cupcake.jpg', etc.)
    const products = [
        // Cupcakes
        { id: 'cvc', name: 'Red Velvet Cupcake', price: 45, category: 'Cupcakes', image: 'images/red velvet.jpg'},
        { id: 'cbc', name: 'Brownie Cupcake', price: 45, category: 'Cupcakes', image: 'images/brownie cupcake.jpg' },
        
        // Cupsize Cheesecakes
        { id: 'cbb', name: 'Classic Burnt Basque', price: 40, category: 'Cupsize Cheesecakes', image: 'images/basque cup - Copy.jpg' },
        { id: 'cst', name: 'Strawberry', price: 40, category: 'Cupsize Cheesecakes', image: 'images/strawberry cup.jpg' },
        { id: 'cnt', name: 'Nutella', price: 40, category: 'Cupsize Cheesecakes', image: 'images/nutella cup.jpg' },
        
        // Cookies
        { id: 'ccc', name: 'Chocolate Chip Cookies', price: 60, category: 'Cookies', image: 'images/chocolate chips.jpg' },
        { id: 'ckc', name: 'Cookies and Cream Cookies', price: 60, category: 'Cookies', image: 'images/cookies cream cookie.jpg' },
        { id: 'cmc', name: 'Cookie Monster Cookies', price: 60, category: 'Cookies', image: 'images/cookie monster.jpg' },
        
        // 4-inch Pan Cheesecakes
        { id: 'pbb', name: 'Classic Burnt Basque (4-inch)', price: 190, category: '4-inch Pan Cheesecakes', image: 'images/basque pan.jpg' },
        { id: 'pst', name: 'Strawberry (4-inch)', price: 210, category: '4-inch Pan Cheesecakes', image: 'images/strawberry pan.jpg' },
        { id: 'pnt', name: 'Nutella (4-inch)', price: 210, category: '4-inch Pan Cheesecakes', image: 'images/nutella pan.jpg' },
    ];


    // --- Cart Functions (Made global so they can be called directly from product buttons) ---

    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        // Visual feedback
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1.0)', 300);
    };

    window.removeFromCart = (productId) => {
        const index = cart.findIndex(item => item.id === productId);
        if (index > -1) {
            cart.splice(index, 1);
        }
        saveCart();
    };

    const updateCartDisplay = () => {
        let total = 0;
        let totalCount = 0;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            document.getElementById('purchase-btn').style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            document.getElementById('purchase-btn').style.display = 'inline-block';
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalCount += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-info">
                    <strong>${item.name} (${item.quantity})</strong>
                    <span>₱${item.price.toFixed(2)}</span>
                </div>
                <span>₱${itemTotal.toFixed(2)}</span>
                <button class="secondary-btn remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = `₱${total.toFixed(2)}`;
        cartCountElement.textContent = totalCount;
    };

    // --- Modal Handlers (Shared across all pages) ---
    const openCartModal = () => {
        updateCartDisplay();
        cartModal.classList.add('open');
    };

    const closeCartModal = () => {
        cartModal.classList.remove('open');
    };

    cartBtn.addEventListener('click', openCartModal);
    closeBtn.addEventListener('click', closeCartModal);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

    // --- Products Page specific function (Generates product cards) ---
    window.loadProducts = () => {
        const productListContainer = document.getElementById('product-list');
        if (!productListContainer) return;

        // Group products by category
        const categorizedProducts = products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {});

        let html = '<h2>Our Delicious Menu</h2>';

        for (const category in categorizedProducts) {
            html += `<section class="product-category">`;
            html += `<h2>${category}</h2>`;
            html += `<div class="product-grid">`;

            categorizedProducts[category].forEach(product => {
                
                // *** UPDATED TO USE product.image ***
                html += `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">₱${product.price.toFixed(2)}</p>
                        <button class="primary-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
                    </div>

                   
                `;
            });

            html += `</div></section>`;
        }
        productListContainer.innerHTML += html;
    };
    
    // --- Login Page specific function (Fake validation and status display) ---
    window.handleLoginForm = () => {
        const loginForm = document.getElementById('login-form');
        const loginMessage = document.getElementById('login-message');
        const statusContainer = document.getElementById('login-status-message');
        
        // Initial status check
        if (isLoggedIn) {
            statusContainer.innerHTML = `
                <p style="color: green; font-weight: bold;">Welcome back to Arts in the Oven!</p>
                <button id="logout-btn" class="secondary-btn">Logout</button>
            `;
            if (loginForm) loginForm.style.display = 'none';
        } else {
            statusContainer.innerHTML = '<p style="color: var(--color-brown);">Please log in to manage your account.</p>';
            if (loginForm) loginForm.style.display = 'block';
        }

        // Logout handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                isLoggedIn = false;
                localStorage.removeItem('artsInTheOvenLoggedIn');
                alert('You have been logged out.');
                window.location.reload();
            });
        }

        // Login handler (Fake validation)
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = e.target.elements.password.value;

                if (password.length >= 4) { // Simple check
                    isLoggedIn = true;
                    localStorage.setItem('artsInTheOvenLoggedIn', 'true');
                    alert(`Successfully logged in!`);
                    window.location.reload();
                } else {
                    loginMessage.textContent = 'Invalid credentials. Password must be at least 4 characters.';
                    loginMessage.style.color = 'red';
                }
            });
        }
    };

    // --- Location Page specific function (Saves location and finalizes purchase) ---
    window.handleLocationForm = () => {
        const locationForm = document.getElementById('location-form');
        const locationDisplay = document.getElementById('location-display');
        const savedLocationText = document.getElementById('saved-location-text');
        const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');

        // Check if cart is empty before showing checkout
        if (cart.length === 0 && locationDisplay) {
            locationDisplay.innerHTML = "<h4>Your cart is empty! Please add items before checking out.</h4>";
            locationDisplay.style.display = 'block';
            if (locationForm) locationForm.style.display = 'none';
            return;
        }

        // Load saved location on page load
        const savedLocation = localStorage.getItem('artsInTheOvenDeliveryLocation');
        if (savedLocation) {
            const loc = JSON.parse(savedLocation);
            savedLocationText.innerHTML = `
                <strong>Region:</strong> ${loc.region}<br>
                <strong>City/Municipality:</strong> ${loc.city}<br>
                <strong>Barangay:</strong> ${loc.barangay}<br>
            `;
            locationDisplay.style.display = 'block';
            if (locationForm) locationForm.style.display = 'none';
        } else {
            if (locationForm) locationForm.style.display = 'block';
        }

        // Save location handler
        if (locationForm) {
            locationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const region = document.getElementById('region').value;
                const city = document.getElementById('city').value;
                const barangay = document.getElementById('barangay').value;

                const locationData = { region, city, barangay };
                localStorage.setItem('artsInTheOvenDeliveryLocation', JSON.stringify(locationData));
                alert("Delivery location saved! Please click 'Finalize Purchase' to confirm the order.");
                window.location.reload(); // Reload to show display and purchase button
            });
        }

        // Finalize purchase handler
        if (confirmPurchaseBtn) {
            confirmPurchaseBtn.addEventListener('click', () => {
                alert("Thank you for your purchase from Arts in the Oven!");
                
                // Clear state
                cart = [];
                saveCart();
                localStorage.removeItem('artsInTheOvenDeliveryLocation');
                
                window.location.href = 'index.html'; // Redirect to home
            });
        }
    };

    // Initial cart display update on every page load
    updateCartDisplay();
});
