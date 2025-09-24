import multer from 'multer';

//we are using disk storage here

const storage = multer.diskStorage({
    //req is the req from user in json format or etc, file is there in multer or it comes from mukter and cb is callback
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)  //here original name is the name of the file as it was in the user system
  }
})

export const upload = multer({ storage, })