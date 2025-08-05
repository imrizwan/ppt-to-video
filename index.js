const pdf2pic = require("pdf2pic")
const videoshow = require("videoshow")
const _ = require("lodash")
const path = require("path")
const fs = require("fs")
const gm = require("gm")
const libre = require("libreoffice-convert")

function generateThumbnail(outputPath, filename, thumbnailPath) {
  return new Promise((resolve, reject) => {
    gm(outputPath) // The name of your pdf
      .setFormat("jpg")
      .resize(200) // Resize to fixed 200px width, maintaining aspect ratio
      .quality(75) // Quality from 0 to 100
      .write(`${thumbnailPath}/${filename}.jpg`, function (error) {
        // Callback function executed when finished
        if (!error) {
          resolve("Thumbnail generated")
        } else {
          reject(`error from gm, ${error}`)
        }
      })
  })
}
function libreConverter(readFile, outputPath) {
  return new Promise((resolve, reject) => {
    console.log('Conversion to PDF started');
    libre.convert(readFile, "pdf", undefined, (err, done) => {
      if (err) {
        reject(`Libre error: ${err}`)
      } else {
        fs.writeFileSync(outputPath, done);
        resolve("Converted to PDF");
      }
    });

  })
}
function pdf2picConverter(outputPath, pdf2PicOptions) {
  return new Promise((resolve, reject) => {
    const convert = pdf2pic.fromPath(outputPath, pdf2PicOptions);
    
    convert.bulk(-1).then((resolve_bulk) => {
      resolve("PDF converted to png");
    }).catch((err) => {
      reject("error from PDF2Pic", err);
    });
  });
}


function converttoVideo(exportPath, filename, videoOptions, videoPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(exportPath, (err, data) => {
      if (!err && !_.isEmpty(data)) {
        const imagePaths = data.map(item => `${exportPath}/${item}`)
        videoshow(imagePaths, videoOptions)
          .save(`${videoPath}/${filename}.mp4`)
          .on('start', function (command) {
            console.log('videoshow process started:', command)
          })
          .on('error', function (err, stdout, stderr) {
            reject('videoshow Error:', err)
            reject('videoshow stderr:', stderr)
          })
          .on('end', () => {
            resolve("Video saved")
          })
      } else {
        reject("error from readdir", err)
      }
    })
  }
  )
}

function p2vConverter(filepath, filename, videoOptions, pdf2PicOptions, videoPath, thumbnail, thumbnailPath) {
  return new Promise(async (resolve, reject) => {
    try {
      const outputPath = path.join(__dirname, "/uploads/", `Folder_${filename}/`, `${filename}.pdf`)
      const exportPath = path.join(__dirname, "/uploads/", `Folder_${filename}/`, "outputs")
      const dir = path.join(__dirname, "/uploads/", `Folder_${filename}`)
      fs.mkdir(exportPath, { recursive: true }, (err) => {
        if (err) throw err;
      });
      const readFile = fs.readFileSync(filepath);
      await libreConverter(readFile, outputPath).then(libreMessage => console.log(libreMessage))
      if (thumbnail) {
        await generateThumbnail(outputPath, filename, thumbnailPath).then(thumbnailMessage => console.log(thumbnailMessage))
      }
      
      // Configure pdf2pic options with output directory
      const pdfOptions = {
        ...pdf2PicOptions,
        saveFilename: `${filename}.%d`,
        savePath: exportPath
      };
      
      await pdf2picConverter(outputPath, pdfOptions).then(p2pMessage => console.log(p2pMessage))
      await converttoVideo(exportPath, filename, videoOptions, videoPath).then(ctvMessage => {
        return ctvMessage
      })
      fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
          reject("error from rmdir", err)
        }

        console.log(`${dir} is deleted!`);
      });
      resolve(`${videoPath}/${filename}.mp4`)
    } catch {
      reject()
    }
  })
}

module.exports = { p2vConverter };