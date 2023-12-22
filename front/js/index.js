main();
function main() {
fetch("http://localhost:3000/api/products")
    .then(reponse=>reponse.json())
    .then(produits=>{
        const items=document.getElementById("items")
        produits.forEach(produit => {
        items.insertAdjacentHTML("beforeend",`<a href="./product.html?id=${produit._id}">
            <article>
              <img src="${produit.imageUrl}" alt="${produit.altTxt}">
              <h3 class="productName">${produit.name}</h3>
              <p class="productDescription">${produit.description}</p>
            </article>
            </a>`)
    });
    })
    .catch(error=>alert(error));
}