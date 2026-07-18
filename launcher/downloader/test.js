const {
downloadFile
}=require("./download");


downloadFile(

"https://raw.githubusercontent.com/Electrolit1/Wanheda-Launcher-Updates/main/files.json",

"./test-files.json"

)
.then(()=>{


console.log(
"Descarga completada"
);


});