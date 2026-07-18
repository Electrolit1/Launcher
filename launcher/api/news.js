const axios = require("axios");


const NEWS_URL =
"https://raw.githubusercontent.com/Electrolit1/Wanheda-Launcher-Updates/main/news.json";


async function getNews(){

    try{

        const response = await axios.get(NEWS_URL);

        return response.data.news;

    }catch(error){

        console.log(
            "Error cargando noticias:",
            error.message
        );

        return [];

    }

}


module.exports = {
    getNews
};