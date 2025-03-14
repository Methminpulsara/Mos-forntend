


getAll()

function getAll(){

    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://localhost:8080/order/getall", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          
          data.forEach(data => {
            data.orderDetail.forEach(detail=>{
           
            document.getElementById("tblbody").innerHTML +=`
             <tr>
                    <td>${data.id}</td>
                    <td>${data.customerID}</td>
                    <td>${detail.burgerID.name}</td>
                    <td>${detail.qty}</td>
                    <td>Rs : ${detail.unit_price}</td>
            
          
                    <td>${data.date}</td>
                    <td><button class="btn btn-edit">Edit</button></td>
                </tr> 
            `       
              })
          });
        })
        .catch((error) => console.error(error));
}


function search(){
 let id = document.getElementById("search").value

  const tblbody=document.getElementById("tblbody")
  tblbody.innerHTML="";

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  if (isNaN(id) || id === "") {
    Swal.fire({
      icon: "error",
      title: "Invalid Input",
      text: "Please enter a valid Order ID (numbers only)!",
      confirmButtonColor: "#ff6600",
    });
    return;
  }
  
  fetch("http://localhost:8080/order/serchbyid/"+id, requestOptions)
  .then((response) =>{return response.json()})
  .then ((data) => {
    if(!data || data.length===0){
      throw new Error("No orders found for this ID!");
      
    }  
  
      data.forEach(data => {
      data.orderDetail.forEach(detail=>{
     
        tblbody.innerHTML +=`
       <tr>
              <td>${data.id}</td>
              <td>${data.customerID}</td>
              <td>${detail.burgerID.name}</td>
              <td>${detail.qty}</td>
              <td>Rs : ${detail.unit_price}</td>
      
    
              <td>${data.date}</td>
              <td><button class="btn btn-edit">Edit</button></td>
          </tr> 
      `       
        })
    });
  })
  .catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message ,
      confirmButtonColor: "#ff6600",
    });
  });

}

