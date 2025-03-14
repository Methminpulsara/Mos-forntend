


getAll()

function getAll(){

    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://localhost:8080/order/getall", requestOptions)
        .then((response) => response.json())
        .then((data) => {
         
          console.log(data);
          
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