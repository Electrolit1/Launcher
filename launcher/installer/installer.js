const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const AdmZip = require("adm-zip");


const {
    sendInstallerStatus
}
=
require("../events/installerEvents");


const {
    saveConfig,
    getConfig
}
=
require("../core/config");


const {
    getFiles
}
=
require("../api/files");


const {
    downloadFile
}
=
require("../downloader/download");


const paths =
require("../core/paths");



const {
    prepareMinecraft
}
=
require("./minecraft");



const {
    installVersion
}
=
require("../minecraft/version");


const {
    downloadClient
}
=
require("../minecraft/downloadClient");


const {
    installLibraries
}
=
require("../minecraft/libraries");


const {
    installFabric
}
=
require("../minecraft/fabric");







function getHash(file){


    const buffer =
    fs.readFileSync(file);


    return crypto
    .createHash("md5")
    .update(buffer)
    .digest("hex");


}









async function installZipConfig(file){



    const temp =
    path.join(
        paths.MINECRAFT,
        file.name
    );



    sendInstallerStatus(

        "Instalando configuración\n"
        +
        file.name

    );



    await downloadFile(

        file.url,

        temp

    );





    let extractPath =
    paths.MINECRAFT;



    if(file.path){


        extractPath =
        path.join(

            paths.MINECRAFT,

            file.path

        );


    }





    if(
        !fs.existsSync(extractPath)
    ){


        fs.mkdirSync(

            extractPath,

            {
                recursive:true
            }

        );


    }





    const zip =
    new AdmZip(temp);



    zip.extractAllTo(

        extractPath,

        true

    );





    fs.unlinkSync(temp);



    console.log(

        "Configuración instalada:",

        file.name

    );


}









async function createFolders(){



    const folders = [

        "mods",

        "resourcepacks",

        "shaderpacks"

    ];



    for(
        const folder of folders
    ){


        const dir =
        path.join(

            paths.MINECRAFT,

            folder

        );



        if(
            !fs.existsSync(dir)
        ){


            fs.mkdirSync(

                dir,

                {
                    recursive:true
                }

            );


        }


    }


}









async function installModpack(){



    console.log(
        "Comprobando modpack Wanheda..."
    );




    const config =
    getConfig();





    const remote =
    await getFiles();





    if(!remote){


        throw new Error(

            "No se pudo descargar files.json"

        );


    }






    const installed =
    config.modpackVersion || "0";



    const latest =
    remote.modpackVersion || "0";





    const first =
    !config.installed;



    const update =
    installed !== latest;






    console.log({

        instalado:installed,

        servidor:latest,

        primera:first,

        update

    });









    if(
        !first &&
        !update
    ){


        sendInstallerStatus(

            "✓ Vacío Extremo actualizado"

        );


        return;


    }








    sendInstallerStatus(


        first

        ?

        "Instalando Vacío Extremo..."

        :

        "Actualizando Vacío Extremo..."

    );







    await prepareMinecraft();









    if(first){





        sendInstallerStatus(

            "Instalando versión Minecraft..."

        );



        await installVersion();







        sendInstallerStatus(

            "Descargando cliente Minecraft..."

        );



        await downloadClient();







        sendInstallerStatus(

            "Instalando librerías..."

        );



        await installLibraries();








        sendInstallerStatus(

            "Instalando Fabric..."

        );



        await installFabric();



    }







    await createFolders();









    const folders = {


        mod:

        path.join(

            paths.MINECRAFT,

            "mods"

        ),



        resourcepack:

        path.join(

            paths.MINECRAFT,

            "resourcepacks"

        ),



        shaderpack:

        path.join(

            paths.MINECRAFT,

            "shaderpacks"

        )


    };









    const total =
    remote.files.length;



    let current = 0;









    for(
        const file of remote.files
    ){


        current++;






        if(
            file.type === "config"
        ){



            sendInstallerStatus(

                `Instalando configuración ${current}/${total}`

            );



            await installZipConfig(file);



            continue;


        }










        const type =
        file.type || "mod";





        const targetFolder =
        folders[type]
        ||
        folders.mod;








        const target =
        path.join(

            targetFolder,

            file.name

        );









        let need =
        false;







        if(
            !fs.existsSync(target)
        ){


            need = true;


        }








        if(

            file.hash &&
            fs.existsSync(target)

        ){


            const hash =
            getHash(target);




            if(
                hash !== file.hash
            ){


                need = true;


            }


        }









        if(need){





            sendInstallerStatus(


                `Descargando ${type} ${current}/${total}\n${file.name}`


            );





            await downloadFile(

                file.url,

                target

            );




        }
        else{


            console.log(

                file.name,

                "OK"

            );


        }







    }









    config.installed =
    true;



    config.modpackVersion =
    latest;





    saveConfig(config);






    sendInstallerStatus(

        "✓ Vacío Extremo listo"

    );





    console.log(

        "Modpack terminado:",

        latest

    );



}









module.exports = {


    installModpack


};