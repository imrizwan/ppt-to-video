## Installation

ppt-to-video depends on 'libreoffice':

```
  $ apt-get install libreoffice
```

ppt-to-video depends on 'ffmpeg':


```
  $ apt-get install ffmpeg
```

ppt-to-video depends on 'graphicsmagick':

```
  $ apt-get install graphicsmagick
```


ppt-to-video depends on 'curl':

```
  $ apt-get install curl
```

To install use npm:

```
  $ npm install --save ppt-to-video
```

## Usage
e.g.
```javascript
const express = require("express")
const path = require("path")
const fs = require("fs")
const multer = require('multer')
const {p2vConverter} = require("ppt-to-video")
const asyncHandler = require("express-async-handler");
const uploads = multer({ dest: 'public/' })
const app = express()

app.post('/', uploads.single('file'), asyncHandler(async (req, res) => {
  const file = req.file
  const filename = file.filename
  const filepath = file.path
  const videoOptions = {
    fps: 25,
    loop: 5, // seconds
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    format: 'mp4',
    pixelFormat: 'yuv420p'
  }
  const pdf2PicOptions = {
    density: 100,           // output pixels per inch
    format: "png",          // output file format
    size: "600x600"         // output size in pixels
  }
  const videoPath = path.join(__dirname)
  const thumbnail = true;
  const thumbnailPath = path.join(__dirname)
  await p2vConverter(filepath, filename, videoOptions, pdf2PicOptions, videoPath, thumbnail, thumbnailPath).then(output => console.log(`video saved at: ${output}`))
  fs.unlinkSync(filepath)
  return res.json("Video Converted")
}));

app.listen(8080, function () {
  console.log('app listening on port 8080!');
});

```

## Testing

To run the tests:

```
  $ npm test
```

For more detailed testing with Mocha:

```
  $ npm run test:mocha
```
