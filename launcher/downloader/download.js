const axios = require("axios");
const fs = require("fs");
const path = require("path");


async function downloadFile(url, destination){


    try{


        const folder = path.dirname(destination);


        if(!fs.existsSync(folder)){


            fs.mkdirSync(folder, {
                recursive:true
            });


        }



        const response = await axios({

            method:"GET",

            url:url,

            responseType:"stream"


        });



        const writer = fs.createWriteStream(destination);



        response.data.pipe(writer);



        return new Promise((resolve,reject)=>{


            writer.on(
                "finish",
                resolve
            );


            writer.on(
                "error",
                reject
            );


        });



    }catch(error){


        console.log(
            "Error descargando:",
            error.message
        );


        throw error;


    }


}



module.exports = {

    downloadFile

};