const multer=require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pdfStorage=multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, "./public/documents"); 
    },
    filename:function(req,file,cb){
        const uniqueSuffix = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtension}`);
    }
})

const pdfFilter=(req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); 
    } else {
        cb(new Error('Only PDF files are allowed!'), false); 
    }
};
module.exports = multer({storage:pdfStorage,fileFilter:pdfFilter}).single('certificate');
