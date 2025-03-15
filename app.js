function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://localhost:8080/login/burgerShop/search/" + email, requestOptions)
        .then(response => response.json())
        .then(data => {
            

            if (data.password !== password) {
                Swal.fire({
                    title: "Login Failed",
                    text: "Incorrect password. Please try again.",
                    icon: "error",
                    showClass: {
                        popup: "animate__animated animate__fadeInUp animate__faster"
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutDown animate__faster"
                    }
                });
                return;
            }

        
            Swal.fire({
                title: "Login Successful",
                text: "Welcome back!",
                icon: "success"
            
            }).then(()=>{
                setTimeout(() => {
                    
                }, 100000);
                window.location.href = "home.html"
                   
            })

            
           

        })
        .catch(error => {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: error.message || "An error occurred while logging in.",
                icon: "error"
            });
        });
}
