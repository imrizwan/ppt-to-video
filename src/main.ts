import * as http from "http";
import { fromPath } from "./pdf2pic";
import * as path from "path"

//create a server object:
http.createServer(function (req, res) {
   res.writeHead(200, { 'Content-Type': 'text/html' }); // http header
   var url = req.url;
   if (url === '/ppt2pdf') {
      res.write('<h1>about us page<h1>'); //write a response
      res.end(); //end the response
   } else {

      const options = {
         density: 100,
         saveFilename: "image",
         savePath: path.join(`${__dirname}/images`),
         format: "png",
         width: 600,
         height: 600
      };
      const storeAsImage = fromPath(path.join(`${__dirname}/sample.pdf`), options);
      const pageToConvertAsImage = 1;

      storeAsImage(pageToConvertAsImage).then((resolve) => {
         console.log("Page 1 is now converted as image");

         return resolve;
      });

      res.write('<h1>Hello World!<h1>'); //write a response
      res.end(); //end the response
   }
}).listen(3001, function () {
   console.log("server start at port 3001"); //the server object listens on port 3000
});