const { BrowserWindow } = require("electron");


function sendInstallerStatus(message){


    const windows =
    BrowserWindow.getAllWindows();


    if(windows.length > 0){


        windows[0].webContents.send(
            "installer-status",
            message
        );


    }


}



module.exports = {

    sendInstallerStatus

};