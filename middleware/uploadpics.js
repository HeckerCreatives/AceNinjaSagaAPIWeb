const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Disk storage for regular uploads
var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/';

        if (file.fieldname === "imageUrl") {
            folder = 'uploads/market/';
        }

        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

// Memory storage for addressableFile so we don't write large assets to disk
var memoryStorage = multer.memoryStorage();

// Create multer instances for each storage strategy. We'll dispatch in middleware
var upload = multer({
    storage: diskStorage,
    fileFilter: function (req, file, callback) {
        let allowedMimeTypes = [];
        let allowedExtensions = [];


        if (file.fieldname === "imageUrl") {
            allowedMimeTypes = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "video/mp4",
                "video/quicktime", // for .mov files
                "video/x-msvideo"  // for .avi files
            ];
        } else if (file.fieldname === "addressableFile") {
            // For addressable files, check by extension since MIME types vary
            allowedExtensions = [
                '.bundle',
                '.hash',
                '.json',
                '.manifest',
                '.catalog',
                '.dat',
                '.unity3d',
                '.assetbundle',
                '.bytes',
                '.txt',
                // for testing purposes only
                ".png",
                ".jpg",
                ".jpeg",
                ".mp4",
                ".mov", // for .mov files
                ".avi"  // for .avi files
            ];
            
            const fileExt = path.extname(file.originalname).toLowerCase();
            if (allowedExtensions.includes(fileExt)) {
                callback(null, true);
                return;
            } else {
                console.log(`${fileExt} is not supported for addressable files. Allowed extensions: ${allowedExtensions.join(', ')}`);
                callback(new Error('Invalid addressable file type'));
                return;
            }
        }
        
        if (allowedMimeTypes.length > 0 && allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else if (allowedMimeTypes.length > 0) {
            console.log(`${file.mimetype} is not supported. Only image and video files are allowed.`);
            callback(new Error('Invalid file type'));
        }
    }
});

// Export a small helper that chooses the correct multer middleware based on fieldname.
// For single-field usage you can call: uploadFields.single('addressableFile')
const uploadFields = {
    // For addressableFile we use memoryStorage so files are available at req.file.buffer
    addressableFile: multer({ storage: memoryStorage, fileFilter: upload._options.fileFilter }),
    // Default handler for other file uploads (imageUrl etc.)
    default: upload
};

module.exports = uploadFields;
