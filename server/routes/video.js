const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
//const { Video } = require("../models/User");
//const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//=================================
//            Video
//=================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }

})



const fileFilter = (req, file, cb) => {

  // mime type 체크하여 원하는 타입만 필터링
  if (file.mimetype == 'video/mp4') {
    cb(null, true);
  } else {
    cb({ msg: 'mp4 파일만 업로드 가능합니다.' }, false);
  }
}



const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file")



//=================================

// Video

//=================================

router.post("/uploadfiles", (req, res) => {

  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    else {
      return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    }
  })
});


router.post("/thumbnail", (req, res) => {

  let thumbsFilePath = "";
  let fileDuration = "";

  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  })


  ffmpeg(req.body.filePath)
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '))
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration })
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png'
    });
});




module.exports = router;
