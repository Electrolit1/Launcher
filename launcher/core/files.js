const fs = require("fs");
const paths = require("./paths");


function checkFolders(){


    const folders=[

        paths.ROOT,

        paths.MINECRAFT,

        paths.JAVA

    ];


    folders.forEach(folder=>{


        if(!fs.existsSync(folder)){


            fs.mkdirSync(

                folder,

                {
                    recursive:true
                }

            );


        }


    });


}



module.exports={

    checkFolders

};