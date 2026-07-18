const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");

const {
    downloadJava
} = require("./download");


const {
    sendInstallerStatus
} = require("../events/installerEvents");



// Evita dos instalaciones al mismo tiempo
let installing = null;






async function checkJava(){



    const javaPath =
    path.join(
        paths.JAVA,
        "bin",
        "java.exe"
    );







    // Java ya existe
    if(fs.existsSync(javaPath)){



        console.log(
            "Java Wanheda encontrado:",
            javaPath
        );


        sendInstallerStatus(
            "Java preparado"
        );


        return javaPath;


    }









    // Si otra instalación está ocurriendo
    if(installing){



        console.log(
            "Esperando instalación de Java existente..."
        );


        sendInstallerStatus(
            "Esperando instalación de Java..."
        );



        await installing;




        if(fs.existsSync(javaPath)){



            sendInstallerStatus(
                "Java preparado"
            );


            return javaPath;


        }


    }









    console.log(
        "Java Wanheda no encontrado"
    );



    console.log(
        "Instalando Java automáticamente..."
    );



    sendInstallerStatus(
        "Descargando Java necesario..."
    );









    installing =
    downloadJava();





    try{


        await installing;



    }
    finally{


        installing = null;


    }









    if(fs.existsSync(javaPath)){



        console.log(
            "Java instalado correctamente:",
            javaPath
        );



        sendInstallerStatus(
            "Java instalado correctamente"
        );



        return javaPath;



    }









    throw new Error(
        "Java no pudo instalarse"
    );



}








module.exports = {

    checkJava

};