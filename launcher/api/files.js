const axios = require("axios");


const FILES_URL =
"https://raw.githubusercontent.com/Electrolit1/Wanheda-Launcher-Updates/main/files.json";





async function getFiles(){


    try{


        const response =
        await axios.get(
            FILES_URL,
            {
                headers:{
                    "Cache-Control":"no-cache"
                },
                params:{
                    t: Date.now()
                }
            }
        );



        return response.data;



    }
    catch(error){


        console.log(
            "Error cargando archivos:",
            error.message
        );


        return null;


    }


}





module.exports = {

    getFiles

};