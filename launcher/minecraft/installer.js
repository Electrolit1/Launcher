const {
    installVersion
}
=
require("./version");


const {
    downloadClient
}
=
require("./downloadClient");


const {
    installLibraries
}
=
require("./libraries");


const {
    installFabric
}
=
require("./fabric");



const {
    sendInstallerStatus
}
=
require("../events/installerEvents");







async function installMinecraft(){


    try{



        sendInstallerStatus(
            "Preparando Minecraft 1.21.1..."
        );





        sendInstallerStatus(
            "Instalando archivos de versión..."
        );


        await installVersion();







        sendInstallerStatus(
            "Descargando cliente Minecraft..."
        );


        await downloadClient();







        sendInstallerStatus(
            "Instalando librerías de Minecraft..."
        );


        await installLibraries();







        sendInstallerStatus(
            "Instalando Fabric..."
        );


        await installFabric();







        sendInstallerStatus(
            "Minecraft preparado correctamente"
        );



        console.log(
            "Minecraft instalado correctamente"
        );



    }
    catch(error){



        sendInstallerStatus(
            "Error instalando Minecraft"
        );



        console.error(
            "Error Minecraft:",
            error
        );



        throw error;



    }



}






module.exports = {

    installMinecraft

};