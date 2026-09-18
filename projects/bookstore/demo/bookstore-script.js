const books = [
    {name: "Atomic Habits", price: 21.5},
    {name: "The Alchemist", price: 14.75},
    {name: "The Let Them Theory", price: 26.99}
];

const customers = [
    {username: "customer", password: "demo123", points: 750}
];

let currentCustomer = null;

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("login-message");
const signInButton = document.getElementById("sign-in-btn");

const ownerDemoButton = document.querySelector('[data-demo-user="owner"]');
const customerDemoButton = document.querySelector('[data-demo-user="customer"]');

// owner elements
const bookForm = document.getElementById("book-form");
const bookNameInput = document.getElementById("book-name");
const bookPriceInput = document.getElementById("book-price");
const bookMessage = document.getElementById("book-message");
const ownerBooks = document.getElementById("owner-books");

const customerForm = document.getElementById("customer-form");
const newUsernameInput = document.getElementById("new-username");
const newPasswordInput = document.getElementById("new-password");
const customerMessage = document.getElementById("customer-message");
const ownerCustomers = document.getElementById("owner-customers");

// customer elements
const customerBooks = document.getElementById("customer-books");
const customerWelcome = document.getElementById("customer-welcome");
const customerPoints = document.getElementById("customer-points");
const customerStatus = document.getElementById("customer-status");
const purchaseMessage = document.getElementById("purchase-message");

// buttons
const buyButton = document.getElementById("buy-btn");
const redeemButton = document.getElementById("redeem-btn");
// const logoutButtons = document.querySelectorAll(".logout-btn");
// const resetButton = document.getElementById("reset-demo");

// event listeners
loginForm.addEventListener("submit", login);

ownerDemoButton.addEventListener("click", selectOwnerAccount);
customerDemoButton.addEventListener("click", selectCustomerAccount);

bookForm.addEventListener("submit", addBook);
customerForm.addEventListener("submit", addCustomer);

buyButton.addEventListener("click", buyBooks);
redeemButton.addEventListener("click", redeemPointsAndBuy);

// for (let i = 0; i < logoutButtons.length; i++) {
//     logoutButtons[i].addEventListener("click", logout);
// }

// if (resetButton !== null) {
//     resetButton.addEventListener("click", resetDemo);
// }

// demo account buttons
function selectOwnerAccount() {
    usernameInput.value = "admin";
    passwordInput.value = "admin";
    signInButton.disabled = false;
    loginMessage.textContent = "Owner account selected. Click Sign In.";
}

function selectCustomerAccount() {
    usernameInput.value = "customer";
    passwordInput.value = "demo123";
    signInButton.disabled = false;
    loginMessage.textContent = "Customer account selected. Click Sign In.";
}

// login
function login(event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    loginMessage.textContent = "";

    if (username === "admin" && password === "admin") {
        showView("owner-view");
        displayOwnerBooks();
        displayCustomers();
        return;
    }

    for (let i = 0; i < customers.length; i++) {
        if (customers[i].username === username && customers[i].password === password){
            currentCustomer = customers[i];
            showView("customer-view");
            displayCustomerInformation();
            displayCustomerBooks();
            return;
        }
    }

    loginMessage.textContent = "Incorrect username or password.";
}

function showView(viewId) {
    const views = document.querySelectorAll(".view");

    for (let i = 0; i < views.length; i++) {
        views[i].hidden = true;
    }

    document.getElementById(viewId).hidden = false;
}

// logout
function logout() {
    currentCustomer = null;
    usernameInput.value = "";
    passwordInput.value = "";
    signInButton.disabled = true;
    loginMessage.textContent = "You have been logged out. Select a demo account to continue.";
    bookMessage.textContent = "";
    customerMessage.textContent = "";
    purchaseMessage.textContent = "";
    showView("login-view");
    window.scrollTo({top: 0, behavior: "smooth"});
}

// owner - display books
function displayOwnerBooks() {
    ownerBooks.innerHTML = "";

    if (books.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.textContent = "No books are currently available.";
        cell.colSpan = 3;

        row.appendChild(cell);
        ownerBooks.appendChild(row);
        return;
    }

    for (let i = 0; i < books.length; i++) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const priceCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        nameCell.textContent = books[i].name;
        priceCell.textContent = "$" + books[i].price.toFixed(2);

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteBook(i);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(actionCell);

        ownerBooks.appendChild(row);
    }
}

// owner - add & delete books
function addBook(event) {
    event.preventDefault();
    const name = bookNameInput.value.trim();
    const price = Number(bookPriceInput.value);

    if (name === "" || price <= 0) {
        bookMessage.textContent = "Please enter a valid book title and price.";
        return;
    }

    books.push({name: name, price: price});
    bookMessage.textContent = name + " was added successfully.";
    bookNameInput.value = "";
    bookPriceInput.value = "";

    displayOwnerBooks();
}

function deleteBook(bookIndex) {
    const deletedBook = books[bookIndex].name;
    books.splice(bookIndex, 1);
    bookMessage.textContent = deletedBook + " was removed from the inventory.";
    
    displayOwnerBooks();
}

// owner - display customers
function displayCustomers() {
    ownerCustomers.innerHTML = "";

    if (customers.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.textContent = "No customer accounts are available.";
        cell.colSpan = 4;

        row.appendChild(cell);
        ownerCustomers.appendChild(row);
        return;
    }

    for (let i = 0; i < customers.length; i++) {
        const row = document.createElement("tr");

        const usernameCell = document.createElement("td");
        const pointsCell = document.createElement("td");
        const statusCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        usernameCell.textContent = customers[i].username;
        pointsCell.textContent = customers[i].points;
        statusCell.textContent = getMembership(customers[i].points);

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteCustomer(i);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(usernameCell);
        row.appendChild(pointsCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        ownerCustomers.appendChild(row);
    }
}

// owner - add & delete customers
function addCustomer(event) {
    event.preventDefault();
    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value.trim();

    if (username === "" || password === "") {
        customerMessage.textContent = "Please enter a username and password.";
        return;
    }

    for (let i = 0; i < customers.length; i++) {
        if (customers[i].username === username) {
            customerMessage.textContent = "That username is already being used.";
            return;
        }
    }

    customers.push({username: username, password: password, points: 0});
    customerMessage.textContent = username + "'s account was created successfully.";
    newUsernameInput.value = "";
    newPasswordInput.value = "";

    displayCustomers();
}

function deleteCustomer(customerIndex) {
    const deletedCustomer = customers[customerIndex].username;
    customers.splice(customerIndex, 1);
    customerMessage.textContent = deletedCustomer + "'s account was deleted.";

    displayCustomers();
}

// customer info
function displayCustomerInformation() {
    customerWelcome.textContent = "Welcome, " + currentCustomer.username + "!";
    customerPoints.textContent = currentCustomer.points + " points";
    customerStatus.textContent = getMembership(currentCustomer.points);
}

function getMembership(points) {
    if (points >= 1000) {
        return "Gold";
    } else {
        return "Silver";
    }
}

// customer book selection
function displayCustomerBooks() {
    customerBooks.innerHTML = "";

    if (books.length === 0) {
        customerBooks.textContent = "There are currently no books available.";
        return;
    }

    for (let i = 0; i < books.length; i++) {
        const bookCard = document.createElement("label");
        const checkbox = document.createElement("input");
        const bookInformation = document.createElement("span");

        bookCard.className = "book-option";

        checkbox.type = "checkbox";
        checkbox.value = i;
        checkbox.className = "book-checkbox";

        bookInformation.textContent = books[i].name + " — $" + books[i].price.toFixed(2);

        bookCard.appendChild(checkbox);
        bookCard.appendChild(bookInformation);

        customerBooks.appendChild(bookCard);
    }
}

// get selected books
function getSelectedBooks() {
    const selectedCheckboxes = document.querySelectorAll(".book-checkbox:checked");
    const selectedBooks = [];

    for (let i = 0; i < selectedCheckboxes.length; i++) {
        const bookIndex = Number(selectedCheckboxes[i].value);
        selectedBooks.push(books[bookIndex]);
    }

    return selectedBooks;
}

function calculateTotal(selectedBooks) {
    let total = 0;

    for (let i = 0; i < selectedBooks.length; i++) {
        total = total + selectedBooks[i].price;
    }

    return total;
}

// buy w/o redeeming points
function buyBooks() {
    const selectedBooks = getSelectedBooks();
    if (selectedBooks.length === 0) {
        purchaseMessage.textContent = "Please select at least one book.";
        return;
    }

    const total = calculateTotal(selectedBooks);
    const earnedPoints = Math.floor(total * 10);
    currentCustomer.points = currentCustomer.points + earnedPoints;
    purchaseMessage.textContent = "Purchase complete! Total: $" + total.toFixed(2) + ". You earned " + earnedPoints + " points.";

    displayCustomerInformation();
    clearSelectedBooks();
}

// redeem points & buy
function redeemPointsAndBuy() {
    const selectedBooks = getSelectedBooks();

    if (selectedBooks.length === 0) {
        purchaseMessage.textContent = "Please select at least one book.";
        return;
    }

    if (currentCustomer.points === 0) {
        purchaseMessage.textContent = "You do not have any points to redeem.";
        return;
    }

    const total = calculateTotal(selectedBooks);

    // 100 = $1 discount.
    let discount = currentCustomer.points / 100;

    if (discount > total) {
        discount = total;
    }

    const pointsUsed = Math.round(discount * 100);
    const remainingTotal = total - discount;
    const earnedPoints = Math.floor(remainingTotal * 10);
    currentCustomer.points = currentCustomer.points - pointsUsed + earnedPoints;
    purchaseMessage.textContent = "Purchase complete! You used " + pointsUsed + " points and paid $" + remainingTotal.toFixed(2) + ". You earned " + earnedPoints + " new points.";

    displayCustomerInformation();
    clearSelectedBooks();
}

// clear checkboxes
function clearSelectedBooks() {
    const checkboxes = document.querySelectorAll(".book-checkbox");

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}

// reset
function resetDemo() {
    books.length = 0;
    books.push({ name: "Atomic Habits", price: 21.50 }, { name: "The Alchemist", price: 14.75 }, { name: "The Let Them Theory", price: 26.99 });
    customers.length = 0;
    customers.push({username: "customer", password: "demo123", points: 750});

    logout();
    loginMessage.textContent = "The demo data was reset. Select an account to continue.";
}

