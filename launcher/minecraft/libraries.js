const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const axios = require("axios");
const http = require("http");
const https = require("https");

const paths = require("../core/paths");

const {
    sendInstallerStatus
} = require("../events/installerEvents");

const VERSION = "1.21.1";

const client = axios.create({

    timeout: 30000,

    httpAgent: new http.Agent({
        keepAlive: true
    }),

    httpsAgent: new https.Agent({
        keepAlive: true
    })

});

async function installLibraries(){

    const jsonPath =
    path.join(
        paths.MINECRAFT,
        "versions",
        VERSION,
        VERSION + ".json"
    );

    const version =
    JSON.parse(
        fs.readFileSync(
            jsonPath,
            "utf8"
        )
    );

    console.log(
        "Instalando librerías..."
    );

    sendInstallerStatus(
        "Preparando librerías de Minecraft..."
    );

    const total =
    version.libraries.length;

    let count = 0;
    let installed = 0;

    for(const lib of version.libraries){

        count++;

        if(
            !lib.downloads ||
            !lib.downloads.artifact
        ){
            continue;
        }

        const artifact =
        lib.downloads.artifact;

        const filePath =
        path.join(
            paths.MINECRAFT,
            "libraries",
            artifact.path
        );

        if(
            fs.existsSync(filePath)
        ){
            installed++;
            continue;
        }

        await fsp.mkdir(
            path.dirname(filePath),
            {
                recursive:true
            }
        );

        if(
            count % 5 === 0 ||
            count === total
        ){

            const message =
            `Instalando librerías... ${count}/${total}`;

            console.log(message);

            sendInstallerStatus(
                message
            );

        }

        try{

            const response =
            await client({

                url: artifact.url,

                method: "GET",

                responseType: "stream"

            });

            const writer =
            fs.createWriteStream(
                filePath
            );

            response.data.pipe(writer);

            await new Promise(
                (resolve,reject)=>{

                    writer.on(
                        "finish",
                        resolve
                    );

                    writer.on(
                        "error",
                        reject
                    );

                }
            );

            installed++;

        }
        catch(error){

            console.error(
                "Error descargando:",
                artifact.path
            );

            throw error;

        }

    }

    console.log(
        `Librerías instaladas (${installed}/${total})`
    );

    sendInstallerStatus(
        "Librerías instaladas correctamente"
    );

}

module.exports = {

    installLibraries

};