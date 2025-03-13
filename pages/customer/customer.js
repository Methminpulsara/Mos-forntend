getAll()
function getAll(){

    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://localhost:8080/customer/allcustomer", requestOptions)
        .then((response) => response.json())
        .then((data) =>{
            data.forEach(data => {
                
            document.getElementById("tblbody").innerHTML +=`
                 <tr>
                <td>${data.id}</td>
                <td> ${data.name}</td>
                <td>${data.number}</td>
                <td>${data.address}</td>
                <td>
                     <button onclick="update('${data.id}')" class="action-btn edit-btn">Edit</button>
                     <button onclick="deletecustomer('${data.id}')" class="action-btn delete-btn">Delete</button>
                </td>
              </tr>


            `
            });

        })
        .catch((error) => console.error(error));

}
function serch() {
  const id = document.getElementById("search").value;

  const requestOptions = {
    method: "GET",
  };

  fetch("http://localhost:8080/customer/searphonenumber/" + id, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById("tblbody").innerHTML = `
        <tr>
          <td>${data.id}</td>
          <td>${data.name}</td>
          <td>${data.number}</td>
          <td>${data.address}</td>
          <td>
            <button onclick="update('${data.id}')" class="action-btn edit-btn">Edit</button>
            <button onclick="deletecustomer('${data.id}')" class="action-btn delete-btn">Delete</button>
          </td>
        </tr>
      `;
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Customer not found!",
        confirmButtonColor: "#ff6600", 
      });

      document.getElementById("tblbody").innerHTML = ""; 
    });
}

function deletecustomer(id){
  
  Swal.fire({
    title: "Are you sure?",
    text: "You wont to remove this Customer!",
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
  
  fetch("http://localhost:8080/customer/delete/"+id, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    if (result.isConfirmed) {
    
      Swal.fire({
        title: "Deleted!",
        text: "Your Customer have been Deleted.",
        icon: "success"
      }).then(() => {
        window.location.reload();
      });
    }
  });

}

async function update(id){

  const cusID = id ;

  const { value: formValues } = await Swal.fire({
    title: "Multiple inputs",
    html: `
      <input id="upname" class="swal2-input" placeholder="Enter name">
      <input id="upnumber" class="swal2-input" placeholder="Enter phone number">
      <input id="upaddress" class="swal2-input" placeholder="Enter Adderss">

    `,
    focusConfirm: false,
    preConfirm: () => {
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        "id": cusID,
        "name":document.getElementById("upname").value ,
        "address": document.getElementById("upaddress").value,
        "number": document.getElementById("upnumber").value
      });
      
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch("http://localhost:8080/customer/updatecustomer", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
  
    }
  });

}
function add() {
  const phoneNumber = document.getElementById("number").value;
  fetch("http://localhost:8080/customer/searphonenumber/" + phoneNumber, { method: "GET" })
    .then((response) => {
     
      return response.json(); 
    })
    .then((data) => {
      if (data.number === phoneNumber) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Customer already exists with this phone number!",
          confirmButtonColor: "#ff6600",
        });
        throw new Error("Duplicate");
      }
    })
    .catch((error) => {
      if (error.message === "Duplicate") {
        return; 
      }

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        name: document.getElementById("name").value,
        number: phoneNumber,
        address: document.getElementById("address").value,
      });

      fetch("http://localhost:8080/customer/add", {
        method: "POST",
        headers: myHeaders,
        body: raw,
      })


      //catch eken wenne empty ek hndel krn ekh 
        .then((response) => response.json().catch(() => ({}))) 
        .then((result) => {
          Swal.fire({
            icon: "success",
            title: "Customer Added",
            text: "Customer has been successfully added!",
            confirmButtonColor: "#ff6600",
            
          }).then(()=>{
            window.location.reload()
          })
        })
        .catch((error) => console.error(error));
    });
}
