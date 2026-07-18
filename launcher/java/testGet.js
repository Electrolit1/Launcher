const {
getJava
}=require("./check");


getJava()
.then(java=>{

console.log(
"JAVA:",
java
);

});