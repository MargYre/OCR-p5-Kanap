//Récupération du paramétre orderId depuis l'url de la page en cours
const txtParams = window.location.search;
const objParams = new URLSearchParams(txtParams);
const confirmOrderId = objParams.get('orderId');

//Récupération de l'élément ayant l'id "orderId" depuis le dom, et insertion du code 
//de confirmation dedans (l'élément).
const orderIdEl = document.getElementById("orderId");
orderIdEl.innerText = confirmOrderId;