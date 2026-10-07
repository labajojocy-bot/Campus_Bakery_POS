let cart = [];


// =========================================
// SCREEN NAVIGATION
// =========================================

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

}


// =========================================
// ADD TO CART
// =========================================

function addToCart(name, price) {

    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

}


// =========================================
// UPDATE CART
// =========================================

function updateCart() {

    const cartContainer =
        document.getElementById("cart-items");

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML =
            `<div class="empty">
                Your cart is empty.
             </div>`;

    } else {

        cart.forEach((item, index) => {

            const subtotal =
                item.price * item.quantity;


            cartContainer.innerHTML += `

                <div class="cart-item">

                    <div class="cart-info">

                        <strong>
                            ${item.name}
                        </strong>

                        <br>

                        ₱${item.price.toFixed(2)}
                        each

                        <br>

                        Subtotal:
                        ₱${subtotal.toFixed(2)}

                    </div>


                    <div class="cart-controls">

                        <button
                            class="quantity-btn"
                            onclick="decreaseQuantity(${index})">
                            -
                        </button>


                        <span class="quantity">
                            ${item.quantity}
                        </span>


                        <button
                            class="quantity-btn"
                            onclick="increaseQuantity(${index})">
                            +
                        </button>


                        <button
                            class="remove-btn"
                            onclick="removeItem(${index})">
                            Remove
                        </button>

                    </div>

                </div>

            `;

        });

    }


    updateTotal();

}


// =========================================
// INCREASE QUANTITY
// =========================================

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();

}


// =========================================
// DECREASE QUANTITY
// =========================================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();

}


// =========================================
// REMOVE ITEM
// =========================================

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}


// =========================================
// CALCULATE TOTAL
// =========================================

function calculateTotal() {

    return cart.reduce(
        (total, item) =>
            total + (item.price * item.quantity),
        0
    );

}


function updateTotal() {

    const total = calculateTotal();

    document.getElementById("cart-total").textContent =
        "₱" + total.toFixed(2);

}


// =========================================
// GO TO CART
// =========================================

function goToCart() {

    updateCart();

    showScreen("cart-screen");

}


// =========================================
// GO TO PAYMENT
// =========================================

function goToPayment() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add a product first.");

        return;

    }


    const total = calculateTotal();

    document.getElementById("payment-total").textContent =
        "₱" + total.toFixed(2);


    document.getElementById("cash").value = "";

    clearPaymentMessage();

    showScreen("payment-screen");

}


// =========================================
// PAYMENT VALIDATION
// =========================================

function processPayment() {

    const cashInput =
        document.getElementById("cash").value.trim();


    const total =
        calculateTotal();


    if (cashInput === "") {

        showPaymentError(
            "Please enter your cash payment."
        );

        return;

    }


    const cash = Number(cashInput);


    if (isNaN(cash)) {

        showPaymentError(
            "Please enter a valid numeric amount."
        );

        return;

    }


    if (cash < 0) {

        showPaymentError(
            "Cash payment cannot be negative."
        );

        return;

    }


    if (cash < total) {

        showPaymentError(
            "Insufficient payment. Please enter enough cash."
        );

        return;

    }


    const change = cash - total;


    generateReceipt(cash, change);

}


// =========================================
// PAYMENT ERROR
// =========================================

function showPaymentError(message) {

    const messageBox =
        document.getElementById("payment-message");

    messageBox.textContent = message;

    messageBox.className =
        "message error";

}


function clearPaymentMessage() {

    const messageBox =
        document.getElementById("payment-message");

    messageBox.textContent = "";

    messageBox.className =
        "message";

}


// =========================================
// GENERATE TRANSACTION REFERENCE
// =========================================

function generateTransactionReference() {

    const number =
        Math.floor(100000 + Math.random() * 900000);

    return "CB-" + number;

}


// =========================================
// GENERATE RECEIPT
// =========================================

function generateReceipt(cash, change) {

    const total =
        calculateTotal();


    const reference =
        generateTransactionReference();


    document.getElementById(
        "transaction-reference"
    ).textContent =
        "Transaction Reference: " + reference;


    const receiptItems =
        document.getElementById("receipt-items");

    receiptItems.innerHTML = "";


    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;


        receiptItems.innerHTML += `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <div class="receipt-row">

                    <span>
                        ${item.quantity}
                        ×
                        ₱${item.price.toFixed(2)}
                    </span>

                    <span>
                        ₱${subtotal.toFixed(2)}
                    </span>

                </div>

            </div>

        `;

    });


    document.getElementById(
        "receipt-total"
    ).textContent =
        "₱" + total.toFixed(2);


    document.getElementById(
        "receipt-paid"
    ).textContent =
        "₱" + cash.toFixed(2);


    document.getElementById(
        "receipt-change"
    ).textContent =
        "₱" + change.toFixed(2);


    showScreen("receipt-screen");

}


// =========================================
// NEW TRANSACTION
// =========================================

function newTransaction() {

    // Clear cart
    cart = [];


    // Clear payment
    document.getElementById("cash").value = "";


    // Clear payment message
    clearPaymentMessage();


    // Clear receipt
    document.getElementById(
        "receipt-items"
    ).innerHTML = "";


    document.getElementById(
        "transaction-reference"
    ).textContent = "";


    document.getElementById(
        "receipt-total"
    ).textContent = "₱0.00";


    document.getElementById(
        "receipt-paid"
    ).textContent = "₱0.00";


    document.getElementById(
        "receipt-change"
    ).textContent = "₱0.00";


    document.getElementById(
        "cart-total"
    ).textContent = "₱0.00";


    document.getElementById(
        "payment-total"
    ).textContent = "₱0.00";


    updateCart();


    // Return to product screen
    showScreen("product-screen");

}