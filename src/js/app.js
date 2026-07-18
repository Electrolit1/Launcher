(async()=>{


console.log(
    "🚀 Wanheda App iniciado"
);



if(!window.launcher){

    console.error(
        "Launcher API no disponible"
    );

    return;

}




const account =
await launcher.getAccount();



console.log(
    "Cuenta:",
    account
);





if(
    !account ||
    !account.nick
){

    window.location.href =
    "login.html";

    return;

}









/*
========================
 PERFIL
========================
*/


const username =
document.getElementById(
"username"
);


const playerHead =
document.getElementById(
"player-head"
);



if(username)
username.textContent =
account.nick;



if(playerHead)

playerHead.src =
`https://mc-heads.net/avatar/${account.nick}/128`;









/*
========================
 VENTANA
========================
*/


document
.getElementById("minimize")
?.addEventListener(
"click",
()=>launcher.minimize()
);



document
.getElementById("maximize")
?.addEventListener(
"click",
()=>launcher.maximize()
);



document
.getElementById("close")
?.addEventListener(
"click",
()=>launcher.close()
);











/*
========================
 LOGOUT
========================
*/


document
.getElementById("logout")
?.addEventListener(
"click",
async()=>{


try{


    await launcher.deleteAccount();



    window.location.href =
    "login.html";


}
catch(error){


    console.error(
        "Error cerrando sesión:",
        error
    );


}


});









/*
========================
 ESTADO MODPACK
========================
*/


let modpackUpdate=false;




async function checkModpack(){



const install =
document.getElementById(
"install"
);



const play =
document.getElementById(
"play"
);



const status =
document.getElementById(
"status"
);



try{


const data =
await launcher.checkModpackUpdate();



console.log(
"Modpack:",
data
);




if(!data)
return;





if(data.update){



modpackUpdate=true;



if(install){


install.style.display =
"block";


install.textContent =
"ACTUALIZAR";


}




if(play)

play.style.display =
"none";




if(status)

status.textContent =
`⚠ Actualización Vacío Extremo ${data.latest}`;



}
else{


modpackUpdate=false;



if(status)

status.textContent =
"✓ Vacío Extremo actualizado";


}



}
catch(error){


console.error(
"Error modpack:",
error
);


}



}









/*
========================
 NOTICIAS
========================
*/


async function loadNews(){



const list =
document.getElementById(
"news-list"
);



if(!list)
return;




try{


const news =
await launcher.getNews();



list.innerHTML="";




news.forEach(item=>{


const li =
document.createElement(
"li"
);



li.innerHTML =
`
<b>${item.title}</b>
<br>
${item.text}
`;



list.appendChild(li);



});



}
catch(error){


console.error(
"Noticias error:",
error
);


}



}





loadNews();









/*
========================
 JAVA / CONFIG
========================
*/


async function loadStatus(){



try{


const java =
await launcher.checkJava();



const javaText =
document.getElementById(
"java-status"
);



if(javaText)

javaText.textContent =
java
?
"✓ Instalado"
:
"✕ Falta";






const config =
await launcher.getConfig();




const modpack =
document.getElementById(
"modpack-status"
);



if(modpack)

modpack.textContent =
config.installed
?
"✓ Instalado"
:
"✕ Pendiente";



}
catch(error){


console.error(
"Estado error:",
error
);


}



}




loadStatus();









/*
========================
 INSTALADOR
========================
*/


launcher.onInstallerStatus(
message=>{


const status =
document.getElementById(
"status"
);



if(status)

status.textContent =
message;



});







const install =
document.getElementById(
"install"
);



if(install){



install.onclick =
async()=>{



install.disabled=true;



const status =
document.getElementById(
"status"
);



if(status)

status.textContent =
"Instalando actualización...";




try{



await launcher.installModpack();



if(status)

status.textContent =
"✓ Vacío Extremo actualizado";



modpackUpdate=false;



await checkInstallation();



}
catch(error){



console.error(
error
);



if(status)

status.textContent =
"❌ Error instalando";



}



install.disabled=false;



};



}









/*
========================
 JUGAR
========================
*/


const play =
document.getElementById(
"play"
);



let minecraftRunning=false;



if(play){



play.onclick =
async()=>{



if(minecraftRunning){


await launcher.closeMinecraft();


return;


}




play.disabled=true;


play.textContent =
"ABRIENDO...";




try{



await launcher.launchGame();



}
catch(error){



console.error(
error
);



play.disabled=false;


play.textContent =
"JUGAR";



}



};



}









launcher.onMinecraftStarted(
()=>{



minecraftRunning=true;




if(play){


play.disabled=false;


play.textContent =
"CERRAR MINECRAFT";


}



});









launcher.onMinecraftClosed(
()=>{



minecraftRunning=false;



if(play)


play.textContent =
"JUGAR";



});









/*
========================
 INSTALACIÓN
========================
*/


async function checkInstallation(){



const config =
await launcher.getConfig();



const install =
document.getElementById(
"install"
);



const play =
document.getElementById(
"play"
);






if(
config.installed &&
!modpackUpdate
){



if(play)

play.style.display =
"block";



if(install)

install.style.display =
"none";



}
else{



if(install)

install.style.display =
"block";



if(play)

play.style.display =
"none";



}



}









await checkModpack();


await checkInstallation();





})();