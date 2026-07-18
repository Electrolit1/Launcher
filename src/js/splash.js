const status =
document.getElementById("status");





function debug(message,data=null){


    console.log(
        message,
        data || ""
    );


    let logs =
    JSON.parse(
        localStorage.getItem(
            "wanheda-logs"
        ) || "[]"
    );



    logs.push({

        time:
        new Date().toLocaleTimeString(),

        message,

        data

    });



    if(logs.length > 100){

        logs.shift();

    }



    localStorage.setItem(

        "wanheda-logs",

        JSON.stringify(
            logs,
            null,
            4
        )

    );


}









function setStatus(message){


    if(status){

        status.textContent =
        message;

    }


    debug(
        "Estado:",
        message
    );


}









/*
========================
ESTADOS INSTALADOR
========================
*/


if(window.launcher){



    launcher.onInstallerStatus(

        message=>{


            setStatus(
                message
            );


        }

    );





}









async function checkSession(){


    try{


        debug(
            "Comprobando sesión..."
        );





        if(!window.launcher){


            throw new Error(
                "API launcher no disponible"
            );


        }







        const account =
        await launcher.getAccount();






        debug(
            "Cuenta:",
            account
        );








        if(
            !account ||
            !account.nick
        ){



            setStatus(
                "Solicitando acceso..."
            );




            setTimeout(()=>{


                location.href =
                "./login.html";


            },1000);



            return;


        }









        setStatus(

            "Verificando usuario "
            +
            account.nick
            +
            "..."

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









        const data =
        await response.json();








        debug(
            "Auth:",
            data
        );









        if(!data.success){


            await launcher.deleteAccount();



            setStatus(
                "Acceso denegado"
            );



            setTimeout(()=>{


                location.href =
                "./login.html";


            },2000);



            return;


        }









        await launcher.saveAccount({

            nick:
            data.user.nick

        });







        setStatus(
            "Acceso concedido"
        );








        setTimeout(()=>{


            location.href =
            "./index.html";


        },1000);






    }
    catch(error){



        debug(
            "Error:",
            error.message
        );



        setStatus(
            "Error de conexión"
        );



        setTimeout(()=>{


            location.href =
            "./login.html";


        },3000);



    }



}










debug(
    "Splash iniciado"
);









setStatus(
    "Iniciando Wanheda Studio..."
);







setTimeout(()=>{


    checkSession();


},1500);