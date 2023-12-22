//Récupération du paramétre id depuis l'url de la page en cours
const txtParams = window.location.search;
const objParams = new URLSearchParams(txtParams);
const productId = objParams.get('id');

fetch('http://localhost:3000/api/products/' + productId)
    .then(response => response.json())
    .then(product => {
        const titleEl = document.getElementById("title");
        titleEl.innerText = product.name;
        const descriptionEl = document.getElementById("description");
        descriptionEl.innerText = product.description;
        const imageEl = document.querySelector(".item__img");
        imageEl.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
        const priceEl = document.getElementById("price");
        priceEl.innerText = moneyFormat(product.price);
        const colorEl = document.getElementById("colors");
        product.colors.forEach(color => colorEl.insertAdjacentHTML("beforeend", `<option value="${color}">${color}</option>`))
        // 
    })
    .catch(error => alert(error));

function moneyFormat(amount) {
    let formatedAmount = parseFloat(amount).toFixed(2);
    return formatedAmount;
}

const btnAddProd = document.getElementById("addToCart");
btnAddProd.addEventListener("click", addToCart);

function addToCart() {
    if (!formValid()) {
        return;
    }
    const colorSelected = document.getElementById("colors").value;
    const quantitySelected = document.getElementById("quantity").value;
    const productSelected = { id: productId, color: colorSelected, quantity: quantitySelected };
    
    const currentCartTxt = localStorage.getItem("cart");
    let cart = [];
    if (currentCartTxt) { //Si le panier existe
        cart = JSON.parse(currentCartTxt);
    }
    
    let produitExistant = cart.find(produit => produit.id == productId && produit.color == colorSelected);
    if (!produitExistant) {
        cart.push(productSelected);
    } else {
        produitExistant.quantity = parseInt(quantitySelected) + parseInt(produitExistant.quantity);
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Produit ajouté avec succés !");
}

function formValid() {
    const colorSelected = document.getElementById("colors").value;
    const quantitySelected = document.getElementById("quantity").value;

    if (colorSelected == "") {
        alert("Veuillez choisir une couleur");
        return false;
    }
    if (quantitySelected < 1) {
        alert("Veuillez choisir une quantité");
        return false;
    }
    if (quantitySelected > 100) {
        alert("Vous ne pouvez pas sélectionner une quantité supérieure à  100");
        return false;
    }
    return true
}