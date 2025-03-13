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
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      
      fetch("http://localhost:8080/customer/delete/"+id, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
function update(){}













function add(){





  const requestOptions = {
    method: "GET",
   
  };
  
  fetch("http://localhost:8080/customer/searphonenumber/"+document.getElementById("number").value, requestOptions)
    .then((response) => response.text())
    .then((data) => {

     console.log(data)

    })
    
    .catch((error) => console.error(error));


}