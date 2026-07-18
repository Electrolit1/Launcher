const fs = require("fs");
const path = require("path");
const axios = require("axios");

const paths = require("../core/paths");

const {
    sendInstallerStatus
} = require("../events/installerEvents");


const VERSION = "1.21.1";





async function downloadStream(url, file){


    const response =
    await axios({

        url:url,

        method:"GET",

        responseType:"stream"

    });



    const writer =
    fs.createWriteStream(file);



    response.data.pipe(writer);



    return new Promise(
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


}









async function downloadAssets(assetIndex){


    console.log(
        "Descargando assets de Minecraft..."
    );


    sendInstallerStatus(
        "Descargando recursos de Minecraft..."
    );



    const assetsPath =
    path.join(
        paths.MINECRAFT,
        "assets"
    );



    const indexesPath =
    path.join(
        assetsPath,
        "indexes"
    );



    const objectsPath =
    path.join(
        assetsPath,
        "objects"
    );



    fs.mkdirSync(
        indexesPath,
        {
            recursive:true
        }
    );



    fs.mkdirSync(
        objectsPath,
        {
            recursive:true
        }
    );






    const indexFile =
    path.join(
        indexesPath,
        assetIndex.id+".json"
    );



    await downloadStream(
        assetIndex.url,
        indexFile
    );



    const index =
    JSON.parse(
        fs.readFileSync(indexFile)
    );




    const objects =
    index.objects;



    let count = 0;


    const total =
    Object.keys(objects).length;




    for(
        const hash of Object.values(objects)
    ){



        const folder =
        hash.hash.substring(
            0,
            2
        );



        const objectPath =
        path.join(
            objectsPath,
            folder
        );



        fs.mkdirSync(
            objectPath,
            {
                recursive:true
            }
        );



        const file =
        path.join(
            objectPath,
            hash.hash
        );



        if(
            !fs.existsSync(file)
        ){


            await downloadStream(

                `https://resources.download.minecraft.net/${folder}/${hash.hash}`,

                file

            );


        }




        count++;





        if(
            count % 100 === 0
        ){


            const message =
            `Descargando recursos de Minecraft... ${count}/${total}`;



            console.log(
                message
            );



            sendInstallerStatus(
                message
            );


        }



    }



    sendInstallerStatus(
        "Recursos de Minecraft instalados"
    );



    console.log(
        "Assets Minecraft descargados correctamente"
    );


}









async function downloadClient(){



    const jsonPath =
    path.join(
        paths.MINECRAFT,
        "versions",
        VERSION,
        VERSION+".json"
    );



    const version =
    JSON.parse(
        fs.readFileSync(jsonPath)
    );







    const jarPath =
    path.join(
        paths.MINECRAFT,
        "versions",
        VERSION,
        VERSION+".jar"
    );






    console.log(
        "Descargando Minecraft cliente..."
    );



    sendInstallerStatus(
        "Descargando cliente de Minecraft..."
    );






    await downloadStream(

        version.downloads.client.url,

        jarPath

    );







    console.log(
        "Cliente Minecraft descargado"
    );



    sendInstallerStatus(
        "Cliente Minecraft instalado"
    );









    if(
        version.assetIndex
    ){



        await downloadAssets(
            version.assetIndex
        );


    }
    else{



        console.log(
            "Minecraft no tiene assetIndex"
        );


    }





}



module.exports = {

    downloadClient

};