const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");

const {
    getFiles
} = require("../api/files");






function addLibrary(list, lib){



    let libraryPath = null;





    if(
        lib.downloads?.artifact
    ){


        libraryPath =
        lib.downloads.artifact.path;


    }

    else if(lib.name){



        const parts =
        lib.name.split(":");



        if(parts.length >= 3){


            libraryPath =

            `${parts[0].replace(/\./g,"/")}/${parts[1]}/${parts[2]}/${parts[1]}-${parts[2]}.jar`;


        }


    }






    if(!libraryPath)
        return;






    const file =

    path.join(

        paths.MINECRAFT,

        "libraries",

        libraryPath

    );






    if(
        fs.existsSync(file)
    ){


        if(
            !list.includes(file)
        ){

            list.push(file);

        }


    }



}









async function buildClasspath(){





    const remote =
    await getFiles();






    const MC_VERSION =

    remote?.minecraftVersion
    ||
    "1.21.1";





    const FABRIC_VERSION =

    remote?.fabricLoader
    ||
    "0.17.0";








    console.log(
        "Generando classpath..."
    );






    let libraries = [];









    /*
    ========================
    VANILLA
    ========================
    */



    const vanillaPath =

    path.join(

        paths.MINECRAFT,

        "versions",

        MC_VERSION,

        `${MC_VERSION}.json`

    );






    if(
        !fs.existsSync(vanillaPath)
    ){

        throw new Error(
            "No existe JSON Vanilla"
        );

    }






    const vanilla =

    JSON.parse(

        fs.readFileSync(
            vanillaPath,
            "utf-8"
        )

    );








    for(
        const lib of vanilla.libraries
    ){


        addLibrary(
            libraries,
            lib
        );


    }









    /*
    ========================
    FABRIC
    ========================
    */



    const fabricVersion =

    `fabric-loader-${FABRIC_VERSION}-${MC_VERSION}`;







    const fabricPath =

    path.join(

        paths.MINECRAFT,

        "versions",

        fabricVersion,

        `${fabricVersion}.json`

    );






    if(
        !fs.existsSync(fabricPath)
    ){


        throw new Error(
            "Fabric no instalado"
        );


    }








    const fabric =

    JSON.parse(

        fs.readFileSync(

            fabricPath,

            "utf-8"

        )

    );







    for(
        const lib of fabric.libraries
    ){


        addLibrary(
            libraries,
            lib
        );


    }









    /*
    ========================
    FABRIC LOADER
    ========================
    */



    const fabricLoader =

    path.join(

        paths.MINECRAFT,

        "libraries",

        "net",

        "fabricmc",

        "fabric-loader",

        FABRIC_VERSION,

        `fabric-loader-${FABRIC_VERSION}.jar`

    );






    if(
        fs.existsSync(fabricLoader)
    ){


        libraries.push(
            fabricLoader
        );


    }









    /*
    ========================
    MINECRAFT CLIENT
    ========================
    */



    const minecraftJar =

    path.join(

        paths.MINECRAFT,

        "versions",

        MC_VERSION,

        `${MC_VERSION}.jar`

    );






    if(
        fs.existsSync(minecraftJar)
    ){


        libraries.push(
            minecraftJar
        );


    }







    console.log(

        "Classpath:",

        libraries.length,

        "archivos"

    );








    return libraries.join(";");



}









module.exports = {

    buildClasspath

};