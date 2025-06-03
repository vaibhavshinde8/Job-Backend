import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(cb);
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      console.log("file error"+file);
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})