console.log(
    "🔐 SESSION.JS CARGADO"
);


(async()=>{


console.log(
    "🔐 Verificando sesión Wanheda..."
);





async function redirect(page){

    window.location.replace(
        page
    );

}





async function showWanhedaMessage(title,text){


    const box =
    document.createElement("div");


    box.id =
    "wanheda-message";


    box.innerHTML = `

    <div class="wanheda-window">

        <h2>
            ${title}
        </h2>

        <p>
            ${text.replace(/\n/g,"<br>")}
        </p>

        <div class="loader-mini"></div>

    </div>

    `;


    document.body.appendChild(box);


}









try{


    console.log(
        "Esperando launcher API..."
    );



    let tries = 0;


    while(!window.launcher && tries < 50){


        await new Promise(
            r=>setTimeout(r,100)
        );


        tries++;

    }






    if(!window.launcher){


        throw new Error(
            "Launcher API no disponible"
        );


    }







    console.log(
        "Launcher API encontrada"
    );







    const account =
    await window.launcher.getAccount();




    console.log(
        "Cuenta guardada:",
        account
    );







    if(
        !account ||
        !account.nick
    ){


        console.log(
            "No hay cuenta"
        );


        return redirect(
            "./login.html"
        );


    }







    console.log(
        "Consultando Auth:",
        account.nick
    );







    const response =
    await fetch(

        "http://51.161.118.214:20014/auth/check",

        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                nick:
                account.nick

            })

        }

    );






    console.log(
        "HTTP:",
        response.status
    );








    const data =
    await response.json();






    console.log(
        "Respuesta Auth:",
        data
    );








    if(!data.success){



        await window.launcher.deleteAccount();



        await showWanhedaMessage(

            "⚠️ Sesión inválida",

            data.message ||
            "Cuenta sin acceso"

        );




        setTimeout(()=>{


            redirect(
                "./login.html"
            );


        },3000);



        return;


    }









    await window.launcher.saveAccount({

        nick:
        data.user.nick

    });







    console.log(
        "✅ Sesión correcta"
    );







    redirect(
        "./index.html"
    );






}
catch(error){



    console.error(
        "❌ Error sesión:",
        error
    );



    await showWanhedaMessage(

        "❌ Error",

        error.message

    );




    setTimeout(()=>{


        redirect(
            "./login.html"
        );


    },4000);



}



})();