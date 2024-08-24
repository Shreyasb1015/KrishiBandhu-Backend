const multer=require('multer');

const pdfStorage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/documents"); 
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
})

const pdfFilter=(req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); 
    } else {
        cb(new Error('Only PDF files are allowed!'), false); 
    }
};

export const handlePdfUpload=multer({storage:pdfStorage,fileFilter:pdfFilter}).single('certificate');
