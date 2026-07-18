const fs = require("fs");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const paths = require("../core/paths");


const {
    sendInstallerStatus
} = require("../events/installerEvents");



const JAVA_URL =
"https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse";







function downloadFile(url, destination){


    return new Promise((resolve,reject)=>{


        https.get(url,response=>{



            // Redirecciones
            if(
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location
            ){



                return downloadFile(
                    response.headers.location,
                    destination
                )
                .then(resolve)
                .catch(reject);



            }







            if(response.statusCode !== 200){



                reject(
                    new Error(
                        "Descarga Java falló: "
                        + response.statusCode
                    )
                );


                return;


            }








            const total =
            Number(
                response.headers["content-length"]
            );



            let downloaded = 0;





            const file =
            fs.createWriteStream(destination);






            response.on(
                "data",
                chunk=>{


                    downloaded += chunk.length;



                    if(total){


                        const percent =
                        Math.floor(
                            downloaded / total * 100
                        );



                        if(
                            percent % 10 === 0
                        ){


                            sendInstallerStatus(
                                "Descargando Java... "
                                + percent
                                + "%"
                            );


                        }


                    }


                }
            );








            response.pipe(file);






            file.on(
                "finish",
                ()=>{


                    file.close(()=>{


                        resolve();


                    });


                }
            );






        }).on(
            "error",
            reject
        );


    });


}













async function downloadJava(){





    const javaExe =
    path.join(
        paths.JAVA,
        "bin",
        "java.exe"
    );






    if(fs.existsSync(javaExe)){



        console.log(
            "Java ya instalado, cancelando descarga"
        );



        return;


    }








    if(!fs.existsSync(paths.ROOT)){



        fs.mkdirSync(
            paths.ROOT,
            {
                recursive:true
            }
        );


    }









    const temp =
    path.join(
        paths.ROOT,
        "java.zip"
    );









    console.log(
        "Descargando Java 21:",
        temp
    );



    sendInstallerStatus(
        "Preparando descarga de Java..."
    );








    await downloadFile(
        JAVA_URL,
        temp
    );









    const stats =
    fs.statSync(temp);





    if(stats.size < 1000000){



        fs.unlinkSync(temp);



        throw new Error(
            "Java descargado incorrectamente"
        );


    }







    sendInstallerStatus(
        "Extrayendo Java..."
    );



    console.log(
        "Extrayendo Java..."
    );








    await new Promise(
        (resolve,reject)=>{


            exec(

                `tar -xf "${temp}" -C "${paths.ROOT}"`,

                error=>{


                    if(error){

                        reject(error);

                    }
                    else{

                        resolve();

                    }


                }

            );


        }
    );









    const folder =
    fs.readdirSync(
        paths.ROOT
    )
    .find(
        f=>f.startsWith("jdk")
    );








    if(!folder){


        throw new Error(
            "No se encontró Java extraído"
        );


    }









    if(fs.existsSync(paths.JAVA)){



        fs.rmSync(
            paths.JAVA,
            {
                recursive:true,
                force:true
            }
        );


    }









    fs.renameSync(

        path.join(
            paths.ROOT,
            folder
        ),

        paths.JAVA

    );









    if(fs.existsSync(temp)){



        fs.unlinkSync(temp);


    }









    console.log(
        "Java instalado correctamente:",
        paths.JAVA
    );



    sendInstallerStatus(
        "Java instalado correctamente"
    );



}








module.exports = {

    downloadJava

};