
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
          <button class="remove-btn" onclick="remove('${data.productID}')">Remove</button>
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
   <div id="popupModal" class="modal-overlay">
  <div class="modal-box">
   
    <h2 class="modal-title">Enter Customer Phone Number</h2>
    <input type="tel" class="modal-input" id="cusnumber" placeholder="Enter phone number">
    <div class="modal-buttons">
      <button class="modal-btn cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="modal-btn confirm-btn" onclick="placeorder()">Place</button>
    </div>
  </div>
</div>


  `


}
function closeModal() {
  document.getElementById("popupModal").style.display = "none";





}
////////////////Place Order ///////////////////////////////
function placeorder() {

  Swal.fire({
    title: "Are you sure?",
    text: "You won't Place this Order!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Place!"
  }).then((result) => {


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

        closeModal()
        if (cartArray.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Your cart is empty! Add some delicious burgers before placing an order.",
            footer: '<a href="product.html">Browse our menu and grab your favorite!</a>'
          });
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


                  //clear krnw cart array ek nttm page ek refresh krnn one ayin wen ewa pennhn 
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
    if (result.isConfirmed) {
      Swal.fire({
        title: "Placed!",
        text: "Your Order has been Placed.",
        icon: "success"
      });
    }
  });
}
function remove(id){


  Swal.fire({
    title: "Are you sure?",
    text: "You wont to remove this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!"
  }).then((result) => {
     const requestOptions = {
    method: "DELETE",
    redirect: "follow"
  };
  
  fetch("http://localhost:8080/cart/delete/"+id, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    if (result.isConfirmed) {
    
      Swal.fire({
        title: "Deleted!",
        text: "Your Products have been Deleted.",
        icon: "success"
      }).then(() => {
        window.location.reload();
      });
    }
  });



 
}