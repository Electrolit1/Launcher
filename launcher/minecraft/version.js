const axios = require("axios");
const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");


const VERSION =
"1.21.1";


async function installVersion(){


    console.log(
        "Descargando información de Minecraft..."
    );


    const url =
    `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`;



    const response =
    await axios.get(url);



    const versions =
    response.data.versions;



    const version =
    versions.find(
        v=>v.id === VERSION
    );



    if(!version){


        throw new Error(
            "Versión no encontrada"
        );


    }



    console.log(
        "Encontrada versión:",
        version.id
    );



    const json =
    await axios.get(
        version.url
    );



    const folder =
    path.join(
        paths.MINECRAFT,
        "versions",
        VERSION
    );



    if(!fs.existsSync(folder)){


        fs.mkdirSync(folder,{
            recursive:true
        });


    }



    fs.writeFileSync(

        path.join(
            folder,
            VERSION+".json"
        ),

        JSON.stringify(
            json.data,
            null,
            4
        )

    );



    console.log(
        "Version instalada"
    );


}



module.exports = {

    installVersion

};