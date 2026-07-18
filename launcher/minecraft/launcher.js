const { sendInstallerStatus } = require("../events/installerEvents");



async function prepareLauncher(){


    console.log(
        "Preparando launcher..."
    );



    sendInstallerStatus(
        "Preparando Wanheda Studio..."
    );



    await new Promise(
        resolve =>
        setTimeout(resolve,300)
    );



    sendInstallerStatus(
        "Comprobando archivos del juego..."
    );



    await new Promise(
        resolve =>
        setTimeout(resolve,300)
    );



    sendInstallerStatus(
        "Launcher listo"
    );


}








module.exports = {

    prepareLauncher

};