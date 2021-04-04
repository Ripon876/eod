var fs            = require('fs');
var path          = require('path');



var cfo = { 

csf:function(s){



   var pp = "profile_pic.png";
   var g1= "gallary_1.png";
   var g2= "gallary_2.png";
   var g3= "gallary_3.png";

cSF(pp);
cSF(g1);
cSF(g2);
cSF(g3);




  function cSF(f){ 

  var folderName = s;
  const pathToFile = path.join("./public/img/sample" ,f);
  const pathToNewDestination = path.join("./public/uploads/" + folderName,f);

  fs.copyFile(pathToFile, pathToNewDestination, function(err) {
  if (err) {
    throw err
  } else {
    console.log("Successfully copied and moved the file!");
  };
});

  };

}
  
};

module.exports = cfo;