const axios = require("axios");
const { launcherVersion } = require("../core/version");


const VERSION_URL =
"https://raw.githubusercontent.com/Electrolit1/Wanheda-Launcher-Updates/main/version.json";


async function checkVersion(){

    try {

        const response =
        await axios.get(VERSION_URL);


        const remote =
        response.data;



        return {

            current:
            launcherVersion,


            latest:
            remote.launcherVersion,


            update:
            remote.launcherVersion !== launcherVersion,


            minecraftVersion:
            remote.minecraftVersion,


            fabricVersion:
            remote.fabricVersion,


            modpackVersion:
            remote.modpackVersion,


            filesVersion:
            remote.filesVersion

        };


    } catch(error){


        console.log(
            "Error comprobando versión:",
            error.message
        );


        return null;

    }

}


module.exports = {
    checkVersion
};