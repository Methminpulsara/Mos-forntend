getCart();
let all = 0;
let cartArray = [];

function getCart() {
  const requestOptions = { method: "GET" };

  let cart = document.getElementById("cartitems");
  const additems = new Set();

  fetch("http://localhost:8080/cart/cartproduct", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      cart.innerHTML = "";

      result.forEach((data) => {
        let discount = data.price - (data.price / 100 * data.discount);
        let total = discount * data.qty;
        all += total;

        if (!additems.has(data.productID)) {
          additems.add(data.productID);

          cart.innerHTML += `
            <div class="cart-item">
              <img src="${data.image}" alt="${data.name}" class="cart-item-image">
              <div class="cart-item-details">
                <div class="cart-item-info">
                  <p class="cart-item-description">${data.name}</p>
                  <p class="cart-item-dicount">Discount: ${data.discount}%</p>
                  <p class="cart-item-price">Rs: ${data.price}</p>
                  <p class="cart-item-qty">You have ordered: ${data.qty} items</p>
                  <p class="cart-item-qty" id="price">Total: ${total}</p>
                </div>
                <div class="cart-item-actions">
                  <button class="remove-btn" onclick="remove('${data.productID}')">Remove</button>
                </div>
              </div>
            </div>`;

          cartArray.push({
            name: data.name,
            burgerId: data.productID,
            price: data.price,
            qty: data.qty,
          });

          document.getElementById("totalamount").innerText = `Rs: ${all}`;
        }
      });
    })
    .catch((error) => console.error(error));
}

function place() {
  document.getElementById("popupModal").style.display = "block";
  document.getElementById("popupModal").innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h2 class="modal-title">Enter Customer Phone Number</h2>
        <input type="tel" class="modal-input" id="cusnumber" placeholder="Enter phone number">
        <div class="modal-buttons">
          <button class="modal-btn cancel-btn" onclick="closeModal()">Cancel</button>
          <button class="modal-btn confirm-btn" onclick="placeorder()">Place</button>
        </div>
      </div>
    </div>`;
}

function closeModal() {
  document.getElementById("popupModal").style.display = "none";
}

function placeorder() {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to place this order!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, place it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const phoneNumber = document.getElementById("cusnumber").value.trim();
      if (!phoneNumber) {
        Swal.fire("Error!", "Please enter a phone number.", "error");
        return;
      }

      fetch(`http://localhost:8080/customer/searphonenumber/${phoneNumber}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          if (!data.id) {
            Swal.fire({
              icon: "error",
              title: "Customer Not Found!",
              text: "Please check the phone number and try again.",
            });
            return;
          }

          const customerid = data.id;
          if (cartArray.length === 0) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Your cart is empty! Add some delicious burgers before placing an order.",
              footer: '<a href="product.html">Browse our menu and grab your favorite!</a>'
            });
            return;
          }

          const date = new Date();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const orderdate = `${date.getFullYear()}-${month}-${day}`;

          const orderDetails = cartArray.map((element) => ({
            orderDetailID: 1,
            order: null,
            burgerID: { id: element.burgerId },
            qty: element.qty,
            unit_price: element.price,
          }));

          const orderData = {
            customerID: customerid,
            total: all,
            date: orderdate,
            orderDetail: orderDetails,
          };

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          fetch("http://localhost:8080/order/add", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(orderData),
          })
            .then((response) => response.text())
            .then(() => {
              Swal.fire("Success!", "Your order has been placed.", "success").then(() => {

                fetch("http://localhost:8080/cart/delete/All", { method: "DELETE" })
                  .then(() => {
                    cartArray = [];
                    document.getElementById("cartitems").innerHTML = "";
                    document.getElementById("totalamount").innerText = "Rs: 0";
                    closeModal();
                  })
                  .catch((error) => console.error(error));
              });
            })
            .catch((error) => {
              Swal.fire("Error!", "Something went wrong while placing the order.", "error");
              console.error(error);
            });
        })
        .catch((error) => {
          Swal.fire("Error!", "Failed to find customer.", "error"); 
          
          console.error(error);
          
        });
    }
  });
}

function remove(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to remove this item!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/cart/delete/${id}`, { method: "DELETE" })
        .then((response) => response.text())
        .then(() => {
          Swal.fire("Deleted!", "Item has been removed.", "success").then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          Swal.fire("Error!", "Something went wrong!", "error");
          console.error(error);
        });
    }
  });
}
  