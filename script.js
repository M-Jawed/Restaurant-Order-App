import menuArray from "./data.js";

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const cardInput = document.getElementById('cardNumber');
const cvvInput = document.getElementById('cvv');
const errorMessage = document.getElementById('nameError');
const errorMessage2 = document.getElementById('cardError');
const errorMessage3 = document.getElementById('cvvError');

nameInput.addEventListener('input', () => {
    if (nameInput.validity.valueMissing) {
        nameInput.setCustomValidity('Your name is required');
    } else if (nameInput.validity.typeMismatch) {
        nameInput.setCustomValidity('Please enter a valid name!');
    } else {
        nameInput.setCustomValidity('');
    }
    errorMessage.textContent = nameInput.validationMessage;
});

cardInput.addEventListener('input', () => {
    if (cardInput.validity.valueMissing) {
        cardInput.setCustomValidity('Please enter your card number');
    } else if (cardInput.validity.typeMismatch) {
        cardInput.setCustomValidity('Please enter a correct card number');
    } else {
        cardInput.setCustomValidity('');
    }
    errorMessage2.textContent = cardInput.validationMessage;
});

cvvInput.addEventListener('input', () => {
    if (cvvInput.validity.valueMissing) {
        cvvInput.setCustomValidity('Please enter your CVV');
    } else if (cvvInput.validity.typeMismatch) {
        cvvInput.setCustomValidity('Please enter a correct CVV');
    } else {
        cvvInput.setCustomValidity('');
    }
    errorMessage3.textContent = cvvInput.validationMessage;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');

    if (!nameInput.checkValidity()) {
        errorMessage.textContent = nameInput.validationMessage;
    } else if (!cardInput.checkValidity()) {
        errorMessage2.textContent = cardInput.validationMessage;
    } else if (!cvvInput.checkValidity()) {
        errorMessage3.textContent = cvvInput.validationMessage;
    }

    setTimeout(() => {
        form.innerHTML = `
        <div class="inner-form"> 
            <div class="loading">
                <img src="images/loading.svg" class="loading-img">
            </div>
            <h3 id="proccess"> Processing your order... </h3>
        </div>`;
    }, 1000);

    setTimeout(() => {
        document.getElementById('proccess').textContent = 'Finishing up the order...';
    }, 4000);

    setTimeout(() => {
        form.style.display = 'none';
        document.getElementById('checkout').innerHTML = `
        <div class="end-order">
            <p> Thanks, <span class="name">${name}</span>! Your order is on the way! </p>
        </div>`;
    }, 7000);
});

let orders = [];

document.getElementById('container').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        const itemId = e.target.dataset.id;
        const selectedItem = menuArray.find(menu => menu.id == itemId);
        if (selectedItem) {
            orders.push(selectedItem);
            renderCheckout();
        }
    } else if (e.target.classList.contains('remove-item')) {
        const itemId = Number(e.target.dataset.id);
        const index = orders.findIndex((order) => order.id === itemId);
        if (index !== -1) {
            orders.splice(index, 1);
            renderCheckout();
        }
    } else if (e.target.id === 'completeOrder') {
        form.style.display = 'block';
    }
});

function renderCheckout() {
    if (orders.length === 0) {
        document.getElementById('checkout').style.display = "none";
        return;
    } else {
        document.getElementById('checkout').style.display = "flex";
    }

    const totalPrice = orders.reduce((acc, item) => acc + item.price, 0);

    document.getElementById('checkout').innerHTML = `
    <div class="order-modal"> 
        <h1> Your Order </h1>
        <div class="order-details-container"> 
            ${orders.map((order) => `
            <div class="order-details"> 
                <div class="order-text">
                    <h2 class="order-item"> ${order.name} - <span>$${order.price}</span> </h2>
                </div> 
                <button class="remove-item" data-id="${order.id}"> remove </button>
            </div>`).join('')}
        </div>
        <div class="total-price"> 
            <h3> Total Price: $${totalPrice} </h3>
        </div>
        <button class="complete-order" id="completeOrder"> Complete Order </button>
    </div>`;
}

function render(menus = menuArray) {
    return menus.map((menu) => `
        <div class="inner-menu"> 
            <div class="emoji-div"> 
                <h1 class="emoji">${menu.emoji} </h1>
            </div>
            <div class="texts"> 
                <h3> ${menu.name} </h3>
                <p> ${menu.ingredients.join(', ')} </p>
                <h4> $${menu.price} </h4>
            </div>
            <div class="button-div"> 
                <button class="btn" data-id="${menu.id}"> + </button>
            </div>
        </div>`
    ).join(' ');
}

document.getElementById('main').innerHTML = render();
