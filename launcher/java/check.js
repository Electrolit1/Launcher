const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");
const { downloadJava } = require("./download");


let installingJava = null;



async function getJava(){


    const javaPath =
    path.join(
        paths.JAVA,
        "bin",
        "java.exe"
    );



    /*
    =========================
    JAVA YA INSTALADO
    =========================
    */


    if(fs.existsSync(javaPath)){


        console.log(
            "Java Wanheda encontrado:",
            javaPath
        );


        return javaPath;


    }




    /*
    =========================
    SI YA HAY DESCARGA
    ESPERAR
    =========================
    */


    if(installingJava){


        console.log(
            "Esperando instalación Java existente..."
        );


        await installingJava;


        if(fs.existsSync(javaPath)){

            return javaPath;

        }


    }






    /*
    =========================
    INSTALAR JAVA
    =========================
    */


    installingJava =
    (async()=>{


        console.log(
            "Instalando Java 21 para WanhedaLauncher..."
        );


        await downloadJava();



        if(!fs.existsSync(javaPath)){


            throw new Error(
                "Java no existe después de instalar"
            );


        }



        console.log(
            "Java instalado correctamente:",
            javaPath
        );


    })();




    try{


        await installingJava;


    }
    finally{


        installingJava = null;


    }





    return javaPath;


}





module.exports = {

    getJava

};