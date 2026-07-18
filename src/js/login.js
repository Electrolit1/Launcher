const status =
document.getElementById("status");



async function checkSession(){


    try{


        const account =
        await launcher.getAccount();



        if(
            account &&
            account.nick
        ){


            console.log(
                "Sesión existente:",
                account
            );


            window.location.href =
            "index.html";


        }


    }
    catch(error){


        console.log(
            "Sin sesión previa"
        );


    }


}



checkSession();






document
.getElementById("login")
.onclick = async()=>{


const nick =
document
.getElementById("nick")
.value
.trim();



const password =
document
.getElementById("password")
.value
.trim();





if(!nick || !password){


    status.textContent =
    "Completa todos los campos";


    return;


}





status.textContent =
"Verificando acceso...";





try{


const response =
await fetch(

"http://51.161.118.214:20014/auth/login",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

nick,

password

})


}

);






const data =
await response.json();






console.log(
"Respuesta servidor:",
data
);








if(data.success){



    console.log(
        "Usuario conectado:",
        data.user
    );






    await launcher.saveAccount({

        nick:data.user.nick

    });



    const statusContainer = document.getElementById("status-container");
    if (statusContainer) {
        statusContainer.className = "login-status success";
    }
    status.textContent =
    "Acceso correcto";








    setTimeout(()=>{


        window.location.href =
        "index.html";


    },800);






}
else{


    const statusContainer = document.getElementById("status-container");
    if (statusContainer) {
        statusContainer.className = "login-status error";
    }
    status.textContent =
    data.message;


}






}
catch(error){



console.error(
    "Error login:",
    error
);



status.textContent =
"Servidor no disponible";



}



};