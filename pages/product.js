
allProducts();
function allProducts() {
  const items = document.getElementById("items");

  const requestOptions = {
    method: "GET",
  };

  fetch("http://localhost:8080/product/getAll", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      data.forEach(data => {
        items.innerHTML += `
          <div class="product-card">
            <div class="product-image-container">
              <img src="${data.image}" alt="Classic Royale Burger" class="product-image">
            </div>
            <div class="product-info">
              <h3 class="product-title">${data.name}</h3>
              <p class="product-price">Rs : ${data.price}</p>
              <p class="product-desc">Discount : ${data.discount} %</p>
              <div class="product-footer">
                <button onclick="openModal('${data.id}')" class="add-cart">Add to Cart</button>
              </div>
            </div>
          </div>

          <!-- Simple Modal -->
          <div id="modal-${data.id}" class="modal" style="display: none;">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title">Add to Cart</h1>
                <span class="close-btn" onclick="closeModal('${data.id}')">&times;</span>
              </div>
              <div class="modal-body">
                <p>How many ${data.name} would you like?</p>
                <input type="number" id="qty-${data.id}" value="1" min="1">
              </div>
              <div class="modal-footer">
                <button onclick="closeModal('${data.id}')" class="btn-secondary">Close</button>
                <button onclick="addToCart('${data.id}', '${data.name}', '${data.price}', '${data.discount}', '${data.image}')" class="btn-primary">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
      });
    });
}


function openModal(id) {
  document.getElementById(`modal-${id}`).style.display = "block";
}

function closeModal(id) {
  document.getElementById(`modal-${id}`).style.display = "none";
}

function addToCart(id, name, price, discount, image) {
  const quantity = document.getElementById(`qty-${id}`).value;
  btnaddcart(id, name, price, discount, image, quantity);
  closeModal(id);
}

document.getElementById("btnserch").addEventListener("click",function serch(){

  const items = document.getElementById("items");
  items.innerHTML="";
  const requestOptions = {
    method: "GET"
  };
  
  fetch("http://localhost:8080/product/find/products/"+document.getElementById("search").value, requestOptions)
    .then((response) => response.json())
    .then((data) => {data.forEach(data => {

     
      


      if(data.length === 0){
        items.innerHTML = `<p>No product found</p>`
      }else{
        items.innerHTML += `
        <div class="product-card">
            <div class="product-image-container">
              <img src="${data.image}" alt="Classic Royale Burger" class="product-image">
            </div>
            <div class="product-info">
              <h3 class="product-title">${data.name}</h3>
              <p class="product-price">Rs : ${data.price}</p>
              <p class="product-desc">Discount : ${data.discount} %</p>
              <div class="product-footer">
                <button onclick="openModal('${data.id}')" class="add-cart">Add to Cart</button>
                
              </div>
            </div>
          </div>

          <!-- Simple Modal -->
          <div id="modal-${data.id}" class="modal" style="display: none;">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title">Add to Cart</h1>
                <span class="close-btn" onclick="closeModal('${data.id}')">&times;</span>
              </div>
              <div class="modal-body">
                <p>How many ${data.name} would you like?</p>
                <input type="number" id="qty-${data.id}" value="1" min="1">
              </div>
              <div class="modal-footer">
                <button onclick="closeModal('${data.id}')" class="btn-secondary">Close</button>
                <button onclick="addToCart('${data.id}', '${data.name}', '${data.price}', '${data.discount}', '${data.image}')" class="btn-primary">Add to Cart</button>
              </div>
            </div>
          </div>
      `;
      }

      
    
    });
  });

})

function btnaddcart(id , name , price , discount ,image, qty ){
 
 
 
  const additems = new Set()

  const requestOptions = {
    method: "GET",
   
  };
  
  fetch("http://localhost:8080/cart/searchProductID/"+name, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      
      if(result.length ===0){
       

        
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "productID": id,
    "name": name,
    "price": price,
    "qty": qty,
    "discount": discount,
    "availabillity": "not Placed",
    "image":  image
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw
  };
  
  fetch("http://localhost:8080/cart/addcart", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    
        
      }else{
        const requestOptions = {
          method: "PUT"
        };
        
        fetch("http://localhost:8080/cart/"+id+"/"+qty, requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => console.error(error));
}

