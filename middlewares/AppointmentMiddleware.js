const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/issues'); // Directory where images will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4(); // Generate a unique filename using uuid
        const ext = path.extname(file.originalname); // Extract file extension
        cb(null, `${uniqueSuffix}${ext}`); // Set filename
    }
});

// Define file filter to accept only images
const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    
    const allowedTypes = ['image/*'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    }
});

module.exports = upload;
