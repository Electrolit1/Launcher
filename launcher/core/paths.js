const path = require("path");
const { getConfig, DEFAULT_ROOT } = require("./config");


function getWanhedaPath() {

    const config = getConfig();


    if (
        config.gamePath &&
        config.gamePath.trim() !== ""
    ) {

        return config.gamePath;

    }


    return DEFAULT_ROOT;

}



const WANHEDA_PATH = getWanhedaPath();



module.exports = {

    ROOT: WANHEDA_PATH,


    MINECRAFT:
    path.join(
        WANHEDA_PATH,
        "minecraft"
    ),


    JAVA:
    path.join(
        WANHEDA_PATH,
        "java"
    ),


    CONFIG:
    require("./config").CONFIG_PATH

};