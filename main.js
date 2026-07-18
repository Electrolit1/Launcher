const {
    app,
    BrowserWindow,
    ipcMain
}
=
require("electron");


const path =
require("path");


const fs =
require("fs");



let accountStore = null;
let mainWindow = null;
let minecraftProcess = null;



const paths =
require("./launcher/core/paths");



const { getFiles } =
require("./launcher/api/files");


const { getNews } =
require("./launcher/api/news");



const {
    checkUpdate,
    downloadUpdate
}
=
require("./launcher/updater/updater");



const {
    prepareLauncher
}
=
require("./launcher/minecraft/launcher");



const {
    saveConfig,
    getConfig
}
=
require("./launcher/core/config");



const {
    installModpack
}
=
require("./launcher/installer/installer");



const {
    launchMinecraft
}
=
require("./launcher/minecraft/game");



const {
    checkJava
}
=
require("./launcher/java/java");



const {
    installMinecraft
}
=
require("./launcher/minecraft/installer");





function splashStatus(message){

    console.log(
        message
    );


    if(mainWindow){

        mainWindow.webContents.send(
            "splash-status",
            message
        );

    }

}







function createWindow(){


    mainWindow =
    new BrowserWindow({

        width:1280,

        height:720,

        minWidth:1100,

        minHeight:650,

        frame:false,

        title:"Wanheda Studio",

        icon:path.join(
            __dirname,
            "assets",
            "icon.ico"
        ),

        backgroundColor:"#0b0b0b",


        webPreferences:{

            preload:path.join(
                __dirname,
                "src",
                "preload.js"
            ),

            nodeIntegration:false,

            contextIsolation:true

        }

    });



    mainWindow.loadFile(
        path.join(
            __dirname,
            "src",
            "views",
            "splash.html"
        )
    );



    ipcMain.on(
        "minimize",
        ()=>mainWindow.minimize()
    );


    ipcMain.on(
        "maximize",
        ()=>{

            mainWindow.isMaximized()
            ?
            mainWindow.unmaximize()
            :
            mainWindow.maximize();

        }
    );



    ipcMain.on(
        "close",
        ()=>mainWindow.close()
    );


}








/*
========================
 CUENTA
========================
*/


ipcMain.handle(
"save-account",
(event,account)=>{

    accountStore.set(
        "account",
        account
    );

    return true;

});



ipcMain.handle(
"get-account",
()=>{

    return accountStore.get(
        "account"
    )
    ||
    null;

});



ipcMain.handle(
"delete-account",
()=>{

    accountStore.delete(
        "account"
    );

    return true;

});
/*
========================
 UPDATE LAUNCHER
========================
*/


ipcMain.handle(
"check-update",
()=>checkUpdate()
);



ipcMain.handle(
"download-update",
(event,url)=>downloadUpdate(url)
);








/*
========================
 API
========================
*/


ipcMain.handle(
"get-news",
()=>getNews()
);



ipcMain.handle(
"get-files",
()=>getFiles()
);



ipcMain.handle(
"get-config",
()=>getConfig()
);



ipcMain.handle(
"save-config",
(event,data)=>{

    saveConfig(data);

    return true;

});








/*
========================
 MODPACK
========================
*/


ipcMain.handle(
"check-modpack-update",
async()=>{


    try{


        const config =
        getConfig();


        const remote =
        await getFiles();



        if(!remote)

        return null;



        return {

            update:
            (config.modpackVersion || "0")
            !==
            (remote.modpackVersion || "0"),


            current:
            config.modpackVersion || "0",


            latest:
            remote.modpackVersion || "0",


            files:
            remote.files?.length || 0

        };


    }
    catch(error){


        console.log(
            "Modpack error:",
            error.message
        );


        return null;

    }


});





ipcMain.handle(
"install-modpack",
async()=>{


    splashStatus(
        "Instalando Vacío Extremo..."
    );


    await installModpack();


    return true;


});










/*
========================
 MINECRAFT
========================
*/



ipcMain.handle(
"launch-game",
async(event)=>{


    const minecraftJson =
    path.join(

        paths.MINECRAFT,

        "versions",

        "1.21.1",

        "1.21.1.json"

    );



    if(
        !fs.existsSync(
            minecraftJson
        )
    ){


        throw new Error(
            "Minecraft no instalado"
        );


    }




    const account =
    accountStore.get(
        "account"
    );



    minecraftProcess =
    await launchMinecraft(
        account
    );



    event.sender.send(
        "minecraft-started"
    );




    minecraftProcess.on(
        "close",
        ()=>{


            event.sender.send(
                "minecraft-closed"
            );


            minecraftProcess=null;


        }
    );


});





ipcMain.handle(
"close-minecraft",
()=>{


    if(
        minecraftProcess
    ){


        minecraftProcess.kill();


        minecraftProcess=null;


        return true;


    }



    return false;


});








/*
========================
 JAVA
========================
*/



ipcMain.handle(
"check-java",
()=>checkJava()
);
/*
========================
 START
========================
*/


app.whenReady()
.then(
async()=>{


    console.log(
        "Preparando launcher..."
    );



    const { default: Store } =
    await import(
        "electron-store"
    );



    accountStore =
    new Store({

        name:"wanheda-account"

    });



    /*
    ========================
    ABRIR SPLASH PRIMERO
    ========================
    */


    createWindow();



    splashStatus(
        "Preparando sistema Wanheda..."
    );




    /*
    ========================
    UPDATE LAUNCHER
    ========================
    */


    try{


        const update =
        await checkUpdate();



        console.log(
            "Estado actualización:",
            update
        );


    }
    catch(error){


        console.log(
            "Error updater:",
            error.message
        );


    }





    /*
    ========================
    PREPARAR MINECRAFT
    ========================
    */


    try{


        splashStatus(
            "Preparando Minecraft..."
        );



        await prepareLauncher();




        splashStatus(
            "Instalando archivos del juego..."
        );



        await installMinecraft();



    }
    catch(error){


        console.log(
            "Error Minecraft:",
            error.message
        );


        splashStatus(
            "Error preparando Minecraft"
        );


    }





    /*
    ========================
    MODPACK
    ========================
    */


    try{


        const remote =
        await getFiles();



        const config =
        getConfig();




        if(
            remote &&
            remote.modpackVersion !== config.modpackVersion
        ){


            splashStatus(
                "Actualización de modpack disponible..."
            );


        }
        else{


            console.log(
                "Modpack actualizado"
            );


        }


    }
    catch(error){


        console.log(
            "Error modpack:",
            error.message
        );


    }





    splashStatus(
        "Launcher listo"
    );





    /*
    ========================
    ACTIVAR VENTANA NORMAL
    ========================
    */


    mainWindow.once(
        "ready-to-show",
        ()=>{


            mainWindow.show();


        }
    );






    app.on(
    "activate",
    ()=>{


        if(
            BrowserWindow
            .getAllWindows()
            .length === 0
        ){


            createWindow();


        }


    });



});






app.on(
"window-all-closed",
()=>{


    if(
        process.platform !== "darwin"
    ){


        app.quit();

    }


});