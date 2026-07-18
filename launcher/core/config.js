const fs = require("fs");
const path = require("path");
const os = require("os");


const DEFAULT_ROOT = path.join(
    os.homedir(),
    "AppData",
    "Roaming",
    "WanhedaStudio"
);


const CONFIG_PATH = path.join(
    DEFAULT_ROOT,
    "config.json"
);



function createConfig() {


    if (!fs.existsSync(DEFAULT_ROOT)) {

        fs.mkdirSync(
            DEFAULT_ROOT,
            {
                recursive: true
            }
        );

    }


    if (!fs.existsSync(CONFIG_PATH)) {


        const config = {

            gamePath: DEFAULT_ROOT,

            ram: 8,

            java: "",

            installed: false,

            modpackVersion: "0"

        };


        fs.writeFileSync(

            CONFIG_PATH,

            JSON.stringify(
                config,
                null,
                4
            )

        );


    }


}



function getConfig() {


    createConfig();


    return JSON.parse(

        fs.readFileSync(
            CONFIG_PATH,
            "utf-8"
        )

    );


}



function saveConfig(data) {


    fs.writeFileSync(

        CONFIG_PATH,

        JSON.stringify(
            data,
            null,
            4
        )

    );


}



module.exports = {

    getConfig,

    saveConfig,

    CONFIG_PATH,
    DEFAULT_ROOT

};