const https = require("https");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const AdmZip = require("adm-zip");


const {
    launcherVersion
} = require("../core/version");





const VERSION_URL =
"https://raw.githubusercontent.com/Electrolit1/Wanheda-Launcher-Updates/main/version.json";









function getRemoteVersion(){


    return new Promise((resolve,reject)=>{


        const url =
        VERSION_URL +
        "?nocache=" +
        Date.now();



        https.get(

            url,

            response=>{


                let data = "";



                response.on(
                    "data",
                    chunk=>{

                        data += chunk;

                    }
                );





                response.on(
                    "end",
                    ()=>{


                        try{


                            const json =
                            JSON.parse(data);



                            console.log(
                                "VERSION REMOTA:",
                                json
                            );



                            resolve(json);


                        }
                        catch(error){


                            reject(error);


                        }


                    }
                );



            }

        )
        .on(
            "error",
            reject
        );


    });


}









async function checkUpdate(){


    try{


        const remote =
        await getRemoteVersion();




        return {


            update:
            String(remote.launcherVersion)
            !==
            String(launcherVersion),



            current:
            launcherVersion,



            latest:
            remote.launcherVersion,



            download:
            remote.download || null,



            message:
            remote.message || null



        };



    }
    catch(error){


        console.log(
            "Error actualizador:",
            error.message
        );


        return null;


    }


}









function downloadFile(url,destination){


    return new Promise((resolve,reject)=>{


        https.get(

            url,

            response=>{



                if(

                    response.statusCode >=300 &&
                    response.statusCode <400 &&
                    response.headers.location

                ){



                    console.log(
                        "Redirect:",
                        response.headers.location
                    );



                    return downloadFile(

                        response.headers.location,

                        destination

                    )
                    .then(resolve)
                    .catch(reject);



                }






                if(response.statusCode !== 200){


                    return reject(

                        new Error(

                            "HTTP ERROR " +
                            response.statusCode

                        )

                    );


                }







                const file =
                fs.createWriteStream(
                    destination
                );




                response.pipe(file);





                file.on(
                    "finish",
                    ()=>{


                        file.close();


                        resolve(destination);


                    }
                );




            }

        )
        .on(
            "error",
            reject
        );


    });


}









function findExe(folder){


    const files =
    fs.readdirSync(

        folder,

        {
            withFileTypes:true
        }

    );




    for(
        const file of files
    ){


        const full =
        path.join(

            folder,

            file.name

        );




        if(
            file.isDirectory()
        ){


            const found =
            findExe(full);



            if(found)
                return found;


        }




        if(

            file.name.toLowerCase()
            ===
            "wanhedastudio.exe"

        ){


            return full;


        }


    }



    return null;


}









async function downloadUpdate(url){


    if(!url){


        throw new Error(
            "No existe URL de actualización"
        );


    }







    const tempDir =
    path.join(

        process.cwd(),

        "wanheda-update"

    );





    if(
        fs.existsSync(tempDir)
    ){


        fs.rmSync(

            tempDir,

            {
                recursive:true,
                force:true
            }

        );


    }







    fs.mkdirSync(

        tempDir,

        {
            recursive:true
        }

    );








    const zipPath =
    path.join(

        tempDir,

        "update.zip"

    );








    console.log(
        "DESCARGANDO UPDATE:",
        url
    );







    await downloadFile(

        url,

        zipPath

    );








    console.log(
        "EXTRAYENDO..."
    );





    const zip =
    new AdmZip(
        zipPath
    );



    zip.extractAllTo(

        tempDir,

        true

    );







    const newExe =
    findExe(tempDir);





    if(!newExe){


        throw new Error(

            "No se encontró WanhedaStudio.exe"

        );


    }






    console.log(
        "Nuevo exe:",
        newExe
    );








    const currentExe =
    process.execPath;





    console.log(
        "Exe actual:",
        currentExe
    );








    /*
    ========================
    BACKUP
    ========================
    */



    const backup =
    currentExe +
    ".backup";



    try{


        fs.copyFileSync(

            currentExe,

            backup

        );


    }
    catch(e){



        console.log(
            "No se pudo crear backup"
        );


    }








    /*
    ========================
    REEMPLAZAR
    ========================
    */



    fs.copyFileSync(

        newExe,

        currentExe

    );








    console.log(
        "Launcher reemplazado"
    );









    execFile(

        currentExe,

        [],

        error=>{


            if(error){


                console.log(
                    "Error iniciando:",
                    error.message
                );


            }


        }

    );








    setTimeout(

        ()=>{


            process.exit(0);


        },

        2000

    );






    return currentExe;


}









module.exports = {


    checkUpdate,


    downloadUpdate


};