/* ============================================================
   FRESHBITE - ONLINE FOOD ORDERING SYSTEM
   JavaScript - Frontend Only
   ============================================================ */


/* ============================================================
   1. FOOD DATA
   ============================================================ */

const foodItems = [
    {
        id: 1,
        name: "Chicken Biryani",
        price: 350,
        category: "Indian",
        restaurant: "Spice Garden",
        image: "images/biryani.jpg",
        description: "Aromatic basmati rice cooked with tender chicken and traditional spices.",
        dietary: ["Non-Veg", "Gluten-Free"]
    },
    {
        id: 2,
        name: "Paneer Butter Masala",
        price: 280,
        category: "Indian",
        restaurant: "Spice Garden",
        image: "images/paneer.jpg",
        description: "Soft paneer cooked in a creamy tomato gravy.",
        dietary: ["Veg"]
    },
    {
        id: 3,
        name: "Masala Dosa",
        price: 180,
        category: "Indian",
        restaurant: "Spice Garden",
        image: "images/dosa.jpg",
        description: "Crispy dosa served with potato masala and chutney.",
        dietary: ["Veg", "Gluten-Free"]
    },
    {
        id: 4,
        name: "Margherita Pizza",
        price: 299,
        category: "Italian",
        restaurant: "Pizza Palace",
        image: "images/pizza.jpg",
        description: "Fresh cheese, tomato sauce and basil.",
        dietary: ["Veg"]
    },
    {
        id: 5,
        name: "Classic Burger",
        price: 249,
        category: "American",
        restaurant: "Burger House",
        image: "images/burger.jpg",
        description: "Juicy burger with cheese and fresh vegetables.",
        dietary: ["Non-Veg"]
    }
];


/* ============================================================
   2. CART DATA
   ============================================================ */

let cart = JSON.parse(localStorage.getItem("freshbiteCart")) || [];


/* Save cart to localStorage */
function saveCart() {
    localStorage.setItem("freshbiteCart", JSON.stringify(cart));
}


/* ============================================================
   3. ADD ITEM TO CART
   ============================================================ */

function addToCart(item) {

    const existingItem = cart.find(product => product.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity || 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity || 1
        });
    }

    saveCart();

    alert(item.name + " added to cart!");

    updateCartCount();
}


/* ============================================================
   4. UPDATE CART COUNT
   ============================================================ */

function updateCartCount() {

    const cartLinks = document.querySelectorAll(
        'a[href="cart.html"]'
    );

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartLinks.forEach(link => {

        link.textContent = totalQuantity > 0
            ? `Cart (${totalQuantity})`
            : "Cart";

    });
}


/* ============================================================
   5. CONNECT "ADD TO CART" BUTTONS
   ============================================================ */

function setupAddToCartButtons() {

    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const article = button.closest("article");

            let itemName = "";
            let itemPrice = 0;
            let itemImage = "";

            /* Get food information from article */

            if (article) {

                const nameElement = article.querySelector("h3");
                const priceElement = article.querySelector("strong");
                const imageElement = article.querySelector("img");

                if (nameElement) {
                    itemName = nameElement.textContent.trim();
                }

                if (priceElement) {
                    itemPrice = parseInt(
                        priceElement.textContent.replace(/[^\d]/g, "")
                    );
                }

                if (imageElement) {
                    itemImage = imageElement.getAttribute("src");
                }
            }

            /* Find food from food array */

            const food = foodItems.find(
                item => item.name === itemName
            );

            if (food) {

                addToCart({
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    image: food.image,
                    quantity: 1
                });

            } else {

                /* Product page fallback */

                addToCart({
                    id: Date.now(),
                    name: itemName || "Food Item",
                    price: itemPrice,
                    image: itemImage,
                    quantity: 1
                });
            }

        });

    });
}


/* ============================================================
   6. DISPLAY CART ITEMS
   ============================================================ */

function displayCart() {

    const cartContainer = document.getElementById("cart-items");

    if (!cartContainer) {
        return;
    }

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
            <a href="menu.html">
                <button type="button">Browse Menu</button>
            </a>
        `;

        updateCartTotals();

        return;
    }


    cart.forEach(item => {

        const cartItem = document.createElement("article");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img 
                src="${item.image}" 
                alt="${item.name}" 
                width="120"
            >

            <div>
                <h3>${item.name}</h3>

                <p>Price: ₹${item.price}</p>

                <label>
                    Quantity:
                    <input 
                        type="number"
                        class="cart-quantity"
                        value="${item.quantity}"
                        min="1"
                        data-id="${item.id}"
                    >
                </label>

                <p>
                    Item Total:
                    <strong>
                        ₹${item.price * item.quantity}
                    </strong>
                </p>

                <button 
                    type="button"
                    class="remove-item"
                    data-id="${item.id}"
                >
                    Remove
                </button>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });


    /* Quantity change */

    const quantityInputs =
        document.querySelectorAll(".cart-quantity");

    quantityInputs.forEach(input => {

        input.addEventListener("change", function () {

            const id = Number(input.dataset.id);

            const item = cart.find(
                product => product.id === id
            );

            if (item) {

                let quantity = parseInt(input.value);

                if (quantity < 1 || isNaN(quantity)) {
                    quantity = 1;
                }

                item.quantity = quantity;

                saveCart();

                displayCart();

                updateCartCount();
            }

        });

    });


    /* Remove item */

    const removeButtons =
        document.querySelectorAll(".remove-item");

    removeButtons.forEach(button => {

        button.addEventListener("click", function () {

            const id = Number(button.dataset.id);

            cart = cart.filter(
                item => item.id !== id
            );

            saveCart();

            displayCart();

            updateCartCount();

        });

    });

    updateCartTotals();
}


/* ============================================================
   7. CART TOTALS
   ============================================================ */

function updateCartTotals() {

    const subtotalElement =
        document.getElementById("subtotal");

    const deliveryElement =
        document.getElementById("delivery-fee");

    const taxElement =
        document.getElementById("tax");

    const totalElement =
        document.getElementById("total");


    if (!subtotalElement ||
        !deliveryElement ||
        !taxElement ||
        !totalElement) {

        return;
    }


    let subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    /* Delivery rule */

    let deliveryFee = 0;

    if (subtotal > 0 && subtotal < 499) {
        deliveryFee = 40;
    }


    /* Tax */

    const tax = Math.round(subtotal * 0.05);

    const total = subtotal + deliveryFee + tax;


    subtotalElement.textContent =
        `₹${subtotal}`;

    deliveryElement.textContent =
        `₹${deliveryFee}`;

    taxElement.textContent =
        `₹${tax}`;

    totalElement.textContent =
        `₹${total}`;
}


/* ============================================================
   8. RESTAURANT FILTER
   ============================================================ */

function setupRestaurantFilters() {

    const cuisineFilter =
        document.getElementById("cuisine-filter");

    const ratingFilter =
        document.getElementById("rating-filter");

    const priceFilter =
        document.getElementById("price-filter");


    const restaurantCards =
        document.querySelectorAll(".restaurant-card");


    if (!cuisineFilter ||
        !ratingFilter ||
        !priceFilter) {

        return;
    }


    function filterRestaurants() {

        const selectedCuisine =
            cuisineFilter.value;

        const selectedRating =
            ratingFilter.value;

        const selectedPrice =
            priceFilter.value;


        restaurantCards.forEach(card => {

            const cuisine =
                card.dataset.cuisine;

            const rating =
                parseFloat(card.dataset.rating);

            const price =
                card.dataset.price;


            const cuisineMatch =
                selectedCuisine === "all" ||
                cuisine === selectedCuisine;


            const ratingMatch =
                selectedRating === "all" ||
                rating >= parseFloat(selectedRating);


            const priceMatch =
                selectedPrice === "all" ||
                price === selectedPrice;


            if (
                cuisineMatch &&
                ratingMatch &&
                priceMatch
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });
    }


    cuisineFilter.addEventListener(
        "change",
        filterRestaurants
    );

    ratingFilter.addEventListener(
        "change",
        filterRestaurants
    );

    priceFilter.addEventListener(
        "change",
        filterRestaurants
    );
}


/* ============================================================
   9. CHECKOUT PAGE
   ============================================================ */

function setupCheckout() {

    const checkoutForm =
        document.getElementById("checkout-form");

    if (!checkoutForm) {
        return;
    }


    displayCheckoutSummary();


    checkoutForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add food items first."
                );

                return;
            }


            const name =
                document.getElementById("full-name").value;

            const phone =
                document.getElementById("phone").value;

            const address =
                document.getElementById("address").value;

            const city =
                document.getElementById("city").value;

            const pin =
                document.getElementById("pin").value;


            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!payment) {

                alert("Please select a payment method.");

                return;
            }


            const subtotal = cart.reduce(
                (total, item) =>
                    total + item.price * item.quantity,
                0
            );


            const deliveryFee =
                subtotal > 0 && subtotal < 499
                    ? 40
                    : 0;


            const tax =
                Math.round(subtotal * 0.05);


            const total =
                subtotal + deliveryFee + tax;


            /* Create order object */

            const order = {

                orderId:
                    "#FB" +
                    Math.floor(
                        1000 + Math.random() * 9000
                    ),

                customerName: name,

                phone: phone,

                address: address,

                city: city,

                pin: pin,

                paymentMethod:
                    payment.value,

                items: [...cart],

                subtotal: subtotal,

                deliveryFee: deliveryFee,

                tax: tax,

                total: total,

                status: "Order Placed",

                date:
                    new Date().toLocaleString()

            };


            /* Save order */

            const orders =
                JSON.parse(
                    localStorage.getItem("freshbiteOrders")
                ) || [];


            orders.push(order);


            localStorage.setItem(
                "freshbiteOrders",
                JSON.stringify(orders)
            );


            /* Empty cart */

            cart = [];

            saveCart();

            updateCartCount();


            alert(
                `Order placed successfully!\n\n` +
                `Order ID: ${order.orderId}\n` +
                `Total: ₹${order.total}`
            );


            window.location.href =
                "account.html";
        }
    );
}


/* ============================================================
   10. CHECKOUT ORDER SUMMARY
   ============================================================ */

function displayCheckoutSummary() {

    const summarySection =
        document.querySelector(
            "#checkout-form section:last-child"
        );


    if (!summarySection) {
        return;
    }


    if (cart.length === 0) {

        summarySection.innerHTML = `
            <h3>Order Summary</h3>
            <p>Your cart is empty.</p>
            <a href="menu.html">
                <button type="button">
                    Go to Menu
                </button>
            </a>
        `;

        return;
    }


    let subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    let deliveryFee =
        subtotal < 499 ? 40 : 0;


    let tax =
        Math.round(subtotal * 0.05);


    let total =
        subtotal + deliveryFee + tax;


    let itemsHTML = "";


    cart.forEach(item => {

        itemsHTML += `
            <p>
                ${item.name} × ${item.quantity}
                — ₹${item.price * item.quantity}
            </p>
        `;

    });


    summarySection.innerHTML = `

        <h3>Order Summary</h3>

        ${itemsHTML}

        <p>
            Delivery Fee —
            ₹${deliveryFee}
        </p>

        <p>
            Tax —
            ₹${tax}
        </p>

        <h2>
            Total —
            ₹${total}
        </h2>

        <button type="submit">
            Place Order
        </button>
    `;
}


/* ============================================================
   11. LOGIN FORM
   ============================================================ */

function setupLogin() {

    const loginForm =
        document.getElementById("login-form");

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "login-email"
                ).value;


            const passwordInput =
                loginForm.querySelector(
                    'input[type="password"]'
                );


            const password =
                passwordInput.value;


            const users =
                JSON.parse(
                    localStorage.getItem(
                        "freshbiteUsers"
                    )
                ) || [];


            const user =
                users.find(
                    account =>
                        account.email === email &&
                        account.password === password
                );


            if (user) {

                localStorage.setItem(
                    "freshbiteLoggedInUser",
                    JSON.stringify(user)
                );


                alert(
                    "Login successful! Welcome " +
                    user.name
                );


                window.location.href =
                    "index.html";

            } else {

                alert(
                    "Invalid email or password."
                );

            }

        }
    );
}


/* ============================================================
   12. REGISTER FORM
   ============================================================ */

function setupRegister() {

    const registerForm =
        document.getElementById("register-form");

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "register-name"
                ).value;


            const email =
                document.getElementById(
                    "register-email"
                ).value;


            const phone =
                document.getElementById(
                    "register-phone"
                ).value;


            const password =
                document.getElementById(
                    "register-password"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirm-password"
                ).value;


            /* Check passwords */

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            /* Get existing users */

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "freshbiteUsers"
                    )
                ) || [];


            /* Check existing email */

            const existingUser =
                users.find(
                    user =>
                        user.email === email
                );


            if (existingUser) {

                alert(
                    "An account with this email already exists."
                );

                return;
            }


            /* Create user */

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                phone: phone,

                password: password

            };


            users.push(newUser);


            localStorage.setItem(
                "freshbiteUsers",
                JSON.stringify(users)
            );


            alert(
                "Registration successful! You can now login."
            );


            registerForm.reset();

        }
    );
}


/* ============================================================
   13. CONTACT FORM
   ============================================================ */

function setupContactForm() {

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (!contactForm) {
        return;
    }


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value;


            alert(
                `Thank you ${name}! Your message has been sent.`
            );


            contactForm.reset();

        }
    );
}


/* ============================================================
   14. HAMBURGER MENU
   ============================================================ */

function setupHamburgerMenu() {

    const hamburger =
        document.getElementById(
            "hamburger"
        );


    const nav =
        document.querySelector(
            ".nav-links"
        );


    if (!hamburger || !nav) {
        return;
    }


    hamburger.addEventListener(
        "click",
        function () {

            nav.classList.toggle(
                "active"
            );

        }
    );
}


/* ============================================================
   15. UPDATE ACCOUNT PAGE
   ============================================================ */

function updateAccountPage() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "freshbiteLoggedInUser"
            )
        );


    if (!user) {
        return;
    }


    const profileSection =
        document.querySelector(
            "section"
        );


    if (!profileSection) {
        return;
    }


    const paragraphs =
        profileSection.querySelectorAll("p");


    if (paragraphs.length >= 3) {

        paragraphs[0].innerHTML =
            `<strong>Name:</strong> ${user.name}`;

        paragraphs[1].innerHTML =
            `<strong>Email:</strong> ${user.email}`;

        paragraphs[2].innerHTML =
            `<strong>Phone:</strong> ${user.phone}`;

    }


    displayOrderHistory();
}


/* ============================================================
   16. ORDER HISTORY
   ============================================================ */

function displayOrderHistory() {

    const sections =
        document.querySelectorAll("section");


    let orderSection = null;


    sections.forEach(section => {

        const heading =
            section.querySelector("h3");

        if (
            heading &&
            heading.textContent.trim() ===
            "Order History"
        ) {
            orderSection = section;
        }

    });


    if (!orderSection) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem(
                "freshbiteOrders"
            )
        ) || [];


    const oldTable =
        orderSection.querySelector("table");


    if (oldTable) {
        oldTable.remove();
    }


    if (orders.length === 0) {

        orderSection.innerHTML +=
            "<p>No orders yet.</p>";

        return;
    }


    const table =
        document.createElement("table");


    table.border = "1";


    table.innerHTML = `

        <tr>
            <th>Order ID</th>
            <th>Food</th>
            <th>Total</th>
            <th>Status</th>
        </tr>
    `;


    orders.forEach(order => {

        const foodNames =
            order.items
                .map(item =>
                    `${item.name} × ${item.quantity}`
                )
                .join(", ");


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${order.orderId}</td>

            <td>${foodNames}</td>

            <td>₹${order.total}</td>

            <td>${order.status}</td>

        `;


        table.appendChild(row);

    });


    orderSection.appendChild(table);
}


/* ============================================================
   17. PAGE LOAD
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupAddToCartButtons();

        updateCartCount();

        displayCart();

        setupRestaurantFilters();

        setupCheckout();

        setupLogin();

        setupRegister();

        setupContactForm();

        setupHamburgerMenu();

        updateAccountPage();

    }
);