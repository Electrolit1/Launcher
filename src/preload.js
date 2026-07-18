const {
    contextBridge,
    ipcRenderer
}
=
require("electron");



contextBridge.exposeInMainWorld(
"launcher",
{


/*
========================
VENTANA
========================
*/


minimize(){

    ipcRenderer.send(
        "minimize"
    );

},


maximize(){

    ipcRenderer.send(
        "maximize"
    );

},


close(){

    ipcRenderer.send(
        "close"
    );

},





/*
========================
CUENTA WANHEDA
========================
*/


saveAccount(account){

    return ipcRenderer.invoke(
        "save-account",
        account
    );

},



getAccount(){

    return ipcRenderer.invoke(
        "get-account"
    );

},



deleteAccount(){

    return ipcRenderer.invoke(
        "delete-account"
    );

},







/*
========================
UPDATE LAUNCHER
========================
*/


checkUpdate(){

    return ipcRenderer.invoke(
        "check-update"
    );

},



downloadUpdate(url){

    return ipcRenderer.invoke(
        "download-update",
        url
    );

},



onLauncherUpdate(callback){

    ipcRenderer.on(
        "launcher-update",
        (event,data)=>{

            if(
                typeof callback === "function"
            ){

                callback(data);

            }

        }
    );

},







/*
========================
API
========================
*/


getNews(){

    return ipcRenderer.invoke(
        "get-news"
    );

},



getFiles(){

    return ipcRenderer.invoke(
        "get-files"
    );

},



getConfig(){

    return ipcRenderer.invoke(
        "get-config"
    );

},



saveConfig(data){

    return ipcRenderer.invoke(
        "save-config",
        data
    );

},







/*
========================
MODPACK
========================
*/


installModpack(){

    return ipcRenderer.invoke(
        "install-modpack"
    );

},



checkModpackUpdate(){

    return ipcRenderer.invoke(
        "check-modpack-update"
    );

},







/*
========================
MINECRAFT
========================
*/


launchGame(){

    return ipcRenderer.invoke(
        "launch-game"
    );

},



closeMinecraft(){

    return ipcRenderer.invoke(
        "close-minecraft"
    );

},







/*
========================
JAVA
========================
*/


checkJava(){

    return ipcRenderer.invoke(
        "check-java"
    );

},









/*
========================
SPLASH SCREEN
========================
*/


onSplashStatus(callback){


    ipcRenderer.on(

        "splash-status",

        (event,message)=>{


            if(
                typeof callback === "function"
            ){

                callback(message);

            }


        }

    );


},







/*
========================
INSTALADOR
========================
*/


onInstallerStatus(callback){


    ipcRenderer.on(

        "installer-status",

        (event,message)=>{


            if(
                typeof callback === "function"
            ){

                callback(message);

            }


        }

    );


},








/*
========================
MINECRAFT EVENTS
========================
*/


onMinecraftStarted(callback){


    ipcRenderer.on(

        "minecraft-started",

        ()=>{


            if(
                typeof callback === "function"
            ){

                callback();

            }


        }

    );


},




onMinecraftClosed(callback){


    ipcRenderer.on(

        "minecraft-closed",

        ()=>{


            if(
                typeof callback === "function"
            ){

                callback();

            }


        }

    );


}



});