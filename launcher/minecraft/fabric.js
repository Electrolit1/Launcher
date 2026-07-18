const axios = require("axios");
const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");

const {
    getFiles
} = require("../api/files");


const {
    sendInstallerStatus
} = require("../events/installerEvents");







function convertMaven(name){



    const parts =
    name.split(":");



    return {



        path:
        `${parts[0].replace(/\./g, "/")}/${parts[1]}/${parts[2]}/${parts[1]}-${parts[2]}.jar`,





        url:
        `https://maven.fabricmc.net/${parts[0].replace(/\./g, "/")}/${parts[1]}/${parts[2]}/${parts[1]}-${parts[2]}.jar`



    };



}









async function download(url,file){



    const response =
    await axios({

        url:url,

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



    });



}









async function installFabric(){





    const remote =
    await getFiles();






    const MC_VERSION =
    remote.minecraftVersion || "1.21.1";





    const FABRIC_VERSION =
    remote.fabricLoader || "0.17.0";








    console.log(
        "Instalando Fabric:",
        FABRIC_VERSION
    );



    sendInstallerStatus(
        "Preparando Fabric..."
    );









    const url =

    `https://meta.fabricmc.net/v2/versions/loader/${MC_VERSION}/${FABRIC_VERSION}/profile/json`;







    const response =
    await axios.get(url);







    const profile =
    response.data;







    const total =
    profile.libraries.length;



    let count = 0;






    for(
        const lib of profile.libraries
    ){



        count++;





        if(!lib.name)
            continue;








        const artifact =
        convertMaven(
            lib.name
        );






        const file =
        path.join(

            paths.MINECRAFT,

            "libraries",

            artifact.path

        );








        if(fs.existsSync(file)){


            continue;


        }








        fs.mkdirSync(

            path.dirname(file),

            {
                recursive:true
            }

        );









        const message =

        `Instalando Fabric... ${count}/${total}`;





        console.log(
            message
        );




        sendInstallerStatus(
            message
        );







        console.log(
            "Descargando:",
            artifact.path
        );






        await download(

            artifact.url,

            file

        );







    }









    const versionFolder =

    path.join(

        paths.MINECRAFT,

        "versions",

        `fabric-loader-${FABRIC_VERSION}-${MC_VERSION}`

    );








    if(!fs.existsSync(versionFolder)){



        fs.mkdirSync(

            versionFolder,

            {
                recursive:true
            }

        );


    }









    fs.writeFileSync(



        path.join(

            versionFolder,

            `fabric-loader-${FABRIC_VERSION}-${MC_VERSION}.json`

        ),



        JSON.stringify(

            profile,

            null,

            4

        )



    );









    console.log(
        "Fabric instalado correctamente:",
        FABRIC_VERSION
    );




    sendInstallerStatus(
        "Fabric instalado correctamente"
    );



}








module.exports = {

    installFabric

};