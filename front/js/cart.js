main();

async function main() {
  const currentCartTxt = localStorage.getItem("cart");
  let cart = [];
  if (currentCartTxt) {
    cart = JSON.parse(currentCartTxt);
  }
  let cartDetails = [];
  for (const cartItem of cart) {
    await fetch('http://localhost:3000/api/products/' + cartItem.id)
      .then(response => response.json())
      .then(product => {
        cartDetails.push({ ...product, color: cartItem.color, quantity: cartItem.quantity });
      })
  }
  cartDetails.forEach(produit => {
    const items = document.getElementById("cart__items");
    items.insertAdjacentHTML("beforeend", `<article class="cart__item" data-id="${produit._id}" data-color="${produit.color}">
    <div class="cart__item__img">
      <img src="${produit.imageUrl}" alt="${produit.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${produit.name}</h2>
        <p>${produit.color}</p>
        <p>${produit.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`)
  });
  cartTotal(cartDetails);


  const deleteItemElems = document.querySelectorAll(".deleteItem");
  deleteItemElems.forEach(deleteItemElem => deleteItemElem.addEventListener("click", deleteItem));
  function deleteItem(e) {
    const currentElem = e.target;
    const parentItem = currentElem.closest(".cart__item");
    const idToDelete = parentItem.dataset.id;
    const colorToDelete = parentItem.dataset.color;
    const tmpCart = cart.filter(article => article.id != idToDelete || article.color != colorToDelete);
    cart = [...tmpCart];
    const tmpCartDetails = cartDetails.filter(article => article._id != idToDelete || article.color != colorToDelete);
    cartDetails = [...tmpCartDetails];
    localStorage.setItem("cart", JSON.stringify(cart));
    //Supprimer l'élément parent depuis la page
    parentItem.remove();
    cartTotal(cartDetails);
  }


  const changeQuantityElems = document.querySelectorAll(".itemQuantity");
  changeQuantityElems.forEach(changeQuantityElem => changeQuantityElem.addEventListener("change", changeItemQuantity));
  function changeItemQuantity(e) {
    const currentElem = e.target;
    const parentItem = currentElem.closest(".cart__item");
    const idToChange = parentItem.dataset.id;
    const colorToChange = parentItem.dataset.color;
    const item = cart.find(article => article.id == idToChange && article.color == colorToChange);
    item.quantity = currentElem.value;
    const itemDetails = cartDetails.find(article => article._id == idToChange && article.color == colorToChange);
    itemDetails.quantity = currentElem.value;
    localStorage.setItem("cart", JSON.stringify(cart));
    cartTotal(cartDetails);
  }

  const btnOrder = document.getElementById("order");
  btnOrder.addEventListener("click", sendOrder);
  function sendOrder(e) {
    e.preventDefault();
    if (!formValid()) {
      return;
    }
    //récupération des données depuis le DOM des input du formulaire
    const prenom = document.getElementById("firstName").value;
    const nom = document.getElementById("lastName").value;
    const adresse = document.getElementById("address").value;
    const ville = document.getElementById("city").value;
    const email = document.getElementById("email").value;

    //Création d'un objet JSON contenant les données du formulaire
    //La structure de l'objet est imposée par le back-end
    const infos = {
      firstName: prenom,
      lastName: nom,
      address: adresse,
      city: ville,
      email: email,
    };
    //création d'un objet JSON contenant les informations du client et un tableau des Id des produits
    //Les champs contact et products font partie de la structure exigée par le back-end
    const order = {
      contact: infos,
      products: cart.map((article) => article.id),
    };
    //Renseigner les paramêtres de la requête http POST qui va envoyer les données au back-end
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    };
    //envoyer les informations de la commande au back-end
    fetch("http://localhost:3000/api/products/order", requestOptions)
      .then(response => {
        if (response.ok) {

          return response.json()
        }
      })
      .then(function (confirmOrder) {
        localStorage.removeItem("cart")
        window.location.replace(`confirmation.html?orderId=${confirmOrder.orderId}`)
      })
  }
}

function formValid() {
  const regexName = /^[A-ÿ][A-ÿ]+(\s[A-ÿ][A-ÿ]+)*$/;
  const prenom = document.getElementById("firstName").value;
  if (prenom === "") {
    alert("veuillez introduire votre prénom");
    return false;
  }
  if (!regexName.test(prenom)) {
    alert("veuillez introduire un prénom valide");
    return false;
  }
  const nom = document.getElementById("lastName").value;
  if (nom === "") {
    alert("nom vide");
    return false;
  }
  if (!regexName.test(nom)) {
    alert("veuillez introduire un nom valide");
    return false;
  }
  const regexAddress = /^[A-ÿ0-9°',]+(\s[A-ÿ0-9°',]+)*$/;
  const address = document.getElementById("address").value;
  if (address === "") {
    alert("veuillez introduire votre adresse");
    return false;
  }
  if (!regexAddress.test(address)) {
    alert("veuillez introduire une adresse valide");
    return false;
  }
  const city = document.getElementById("city").value;
  if (city === "") {
    alert("veuillez introduire le nom de votre ville");
    return false;
  }
  if (!regexName.test(city)) {
    alert("veuillez introduire un nom de ville");
    return false;
  }
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const email = document.getElementById("email").value;
  if (email === "") {
    alert("veuillez introduire une adresse mail");
    return false;
  }
  if (!regexEmail.test(email)) {
    alert("veuillez introduire une adresse mail valide");
    return false;
  }
  return true;
}

function cartTotal(cart) {
  let totalPrice = 0;
  let totalQuantity = 0;
  for (const item of cart) {
    totalQuantity = totalQuantity + parseInt(item.quantity);
    totalPrice = totalPrice + (parseFloat(item.price) * parseFloat(item.quantity));
  }
  document.getElementById("totalQuantity").innerText = totalQuantity;
  document.getElementById("totalPrice").innerText = totalPrice;
}