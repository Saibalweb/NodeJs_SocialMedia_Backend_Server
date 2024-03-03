import multer from "multer";

const stoarge = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'./public/temp/')
  },
  filename: function(req,file,cb){
     cb(null,file.fieldname)
  }
});
export const upload = multer({stoarge});
