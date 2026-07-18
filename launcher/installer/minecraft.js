const fs = require("fs");
const path = require("path");

const paths = require("../core/paths");
const { sendInstallerStatus } = require("../events/installerEvents");


function prepareMinecraft() {

    const folders = [

        paths.MINECRAFT,

        path.join(
            paths.MINECRAFT,
            "versions"
        ),

        path.join(
            paths.MINECRAFT,
            "libraries"
        ),

        path.join(
            paths.MINECRAFT,
            "assets"
        ),

        path.join(
            paths.MINECRAFT,
            "mods"
        ),

        path.join(
            paths.MINECRAFT,
            "resourcepacks"
        )

    ];


    for (const folder of folders) {

        if (!fs.existsSync(folder)) {

            fs.mkdirSync(folder, {
                recursive: true
            });

            console.log(
                "Creada:",
                folder
            );

        }

    }


    sendInstallerStatus(
        "Carpetas preparadas"
    );


    console.log(
        "Minecraft preparado"
    );

}


module.exports = {
    prepareMinecraft
};