const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");

const { getJava } =
require("../java/check");

const { buildClasspath } =
require("./classpath");

const { getFiles } =
require("../api/files");





async function getVersionConfig(){


    try{


        const response =
        await fetch(
            "https://raw.githubusercontent.com/Electrolit1/Wanheda-Launcher-Updates/main/version.json",
            { signal: AbortSignal.timeout(5000) }
        );


        return await response.json();


    }
    catch(error){


        console.log(
            "No se pudo cargar version.json"
        );


        return null;


    }


}









async function launchMinecraft(account = null){


    console.log(
        "Preparando Minecraft..."
    );





    const java =
    await getJava();





    if(!java){


        throw new Error(
            "Java no encontrado"
        );


    }






    const remote =
    await getFiles();




    const versionConfig =
    await getVersionConfig();







    const MC_VERSION =

    versionConfig?.minecraftVersion

    ||

    remote?.minecraftVersion

    ||

    "1.21.1";







    const FABRIC_VERSION =

    versionConfig?.fabricVersion

    ||

    remote?.fabricLoader

    ||

    "0.17.0";







    const versionName =

    `fabric-loader-${FABRIC_VERSION}-${MC_VERSION}`;








    const fabricJson =

    path.join(

        paths.MINECRAFT,

        "versions",

        versionName,

        `${versionName}.json`

    );







    if(
        !fs.existsSync(fabricJson)
    ){


        throw new Error(

            "Fabric no está instalado:\n"

            +

            fabricJson

        );


    }









    /*
        Cargar información vanilla
        para obtener assets correctos
    */


    const vanillaJson =

    path.join(

        paths.MINECRAFT,

        "versions",

        MC_VERSION,

        `${MC_VERSION}.json`

    );







    if(
        !fs.existsSync(vanillaJson)
    ){


        throw new Error(

            "Minecraft vanilla no encontrado:\n"

            +

            vanillaJson

        );


    }







    const vanillaData =

    JSON.parse(

        fs.readFileSync(

            vanillaJson,

            "utf8"

        )

    );








    const assetIndex =

    vanillaData.assetIndex?.id;







    if(!assetIndex){


        throw new Error(

            "No se encontró assetIndex en Minecraft"

        );


    }










    let username =
    "WanhedaPlayer";







    if(
        account &&
        account.nick
    ){


        username =
        account.nick;


    }








    console.log(
        "Jugador:",
        username
    );


    console.log(
        "Versión:",
        MC_VERSION
    );


    console.log(
        "Fabric:",
        FABRIC_VERSION
    );


    console.log(
        "Asset Index:",
        assetIndex
    );










    const classpath =

    await buildClasspath();







    if(
        !classpath
    ){


        throw new Error(
            "Classpath vacío"
        );


    }









    const args = [


        "-Xmx8G",

        "-Xms2G",



        "-cp",

        classpath,



        "net.fabricmc.loader.impl.launch.knot.KnotClient",






        "--username",

        username,





        "--version",

        versionName,





        "--gameDir",

        paths.MINECRAFT,





        "--assetsDir",

        path.join(

            paths.MINECRAFT,

            "assets"

        ),





        "--assetIndex",

        assetIndex,






        "--uuid",

        account?.uuid

        ||

        "00000000-0000-0000-0000-000000000000",






        "--accessToken",

        account?.accessToken

        ||

        "0",






        "--userType",

        "legacy",






        "--versionType",

        "release"



    ];









    console.log(
        "Argumentos Minecraft:"
    );


    console.log(args);









    console.log(
        "Iniciando Minecraft..."
    );


    console.log(
        "Java:",
        java
    );









    const game =

    spawn(

        java,

        args,

        {

            cwd:
            paths.MINECRAFT,


            shell:false,


            detached:false

        }

    );









    game.stdout.on(

        "data",

        data=>{


            console.log(

                "[Minecraft]",

                data.toString()

            );


        }

    );









    game.stderr.on(

        "data",

        data=>{


            console.error(

                "[Minecraft ERROR]",

                data.toString()

            );


        }

    );









    game.on(

        "error",

        error=>{


            console.error(

                "Error iniciando Minecraft:",

                error

            );


        }

    );









    game.on(

        "close",

        code=>{


            console.log(

                "Minecraft cerrado:",

                code

            );


        }

    );








    return game;



}









module.exports = {

    launchMinecraft

};