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

function serch(){
const id = document.getElementById("search").value
    const raw = "";

    const requestOptions = {
      method: "GET",
     
    };


    fetch("http://localhost:8080/customer/searphonenumber/"+id, requestOptions)
      .then((response) => response.json())
      .then((data) =>{
        document.getElementById("tblbody").innerHTML =`
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
      } )
      .catch((error) => console.error(error));



}


function add(){
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
   
    "name": "ranugi",
    "number": "345",
    "address": "Horana"
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://localhost:8080/customer/add", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

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