
getCart()
let all = 0;
let cartArray = []





function getCart() {
  const requestOptions = {
    method: "GET"
  };


  let cart = document.getElementById("cartitems");

  const additems = new Set();


  fetch("http://localhost:8080/cart/cartproduct", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      cartdata = result
      result.forEach(data => {

        cart.innerHTML += ""


        let discount = data.price - (data.price / 100 * data.discount)
        let total = discount * data.qty
        all += total;

        if (!additems.has(data.productID)) {
          additems.add(data.productID)

          cart.innerHTML += `
              <div class="cart-item">
      <img src="${data.image}" alt="${data.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-info">
          <p class="cart-item-description"  >${data.name}</p>
          <p class="cart-item-dicount">Discount  :${data.discount}%</p>
          <p class="cart-item-price">Rs   : ${data.price}</p>
          <p class="cart-item-qty">You Have order : ${data.qty} items </p>
          <p class="cart-item-qty" id="price" >Total :${total} </p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-selector">
          </div>
          <button class="remove-btn" onclick="remove()">Remove</button>
        </div>
      </div>
    </div>`




          cartArray.push({
            name: data.name,
            burgerId: data.productID,
            price: data.price,
            qty: data.qty
          })



          document.getElementById("totalamount").innerText = `Rs: ${all}`;
        }
      });
    })
    .catch((error) => console.error(error));
}











function place() {

  document.getElementById("popupModal").style.display = "block";


  document.getElementById("popupModal").innerHTML = `
   <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Enter Customer phone number</h2>
            <input type="text" name="" id="cusnumber">
            <button class="checkout-btn" onclick="closeModal()">cancel</button>
              <button class="checkout-btn" onclick="placeorder()">place</button>
    </div>

  `


}

function closeModal() {
  document.getElementById("popupModal").style.display = "none";





}









////////////////Place Order ///////////////////////////////

function placeorder() {


  const date = new Date();

  let orderDetails = [];
  let isPlaced = false;

  let month = date.getMonth() + 1;
  let orderdate = date.getFullYear() + "-" + month + "-" + date.getDate()
  let customerid;

  const requestOptions = {
    method: "GET",

  };


  ////////////SEARCH ////////////////

  fetch("http://localhost:8080/customer/searphonenumber/" + document.getElementById("cusnumber").value, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      customerid = data.id
      if (customerid != null) {
        console.log(customerid);




        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        if (cartArray.length === 0) {
          console.error("Cart is empty");
          return;
        }


        // cart arrya eke details arn orderdetail array ek  hdnw 

        cartArray.forEach(element => {
          orderDetails.push({
            orderDetailID: 1,
            order: null,
            burgerID: {
              id: element.burgerId,
            },
            qty: element.qty,
            unit_price: element.price,
          });
        });


        const raw = JSON.stringify({
          customerID: customerid,
          total: all,
          date: orderdate,
          orderDetail: orderDetails,
        });


        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };


        fetch("http://localhost:8080/order/add", requestOptions)
          .then(response => response.text())
          .then(result => {

            isPlaced = true

            if (isPlaced) {
              const requestOptions = {
                method: "DELETE",
                redirect: "follow"
              };

              fetch("http://localhost:8080/cart/delete/All", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                  cartArray = [];
                  document.getElementById("cartitems").innerHTML = "";
                  document.getElementById("totalamount").innerText = "Rs: 0";
                })
                .catch((error) => console.error(error));

            }

          })
          .catch(error => isPlaced = false);

        closeModal()

      }
    })
}
