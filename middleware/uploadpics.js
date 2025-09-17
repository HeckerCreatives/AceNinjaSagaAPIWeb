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
// Extract fileFilter so both memory and disk multers use the same validation
const fileFilter = function (req, file, callback) {
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
    } else {
        // No specific mime type restrictions and extension check didn't reject: accept
        callback(null, true);
    }
};

// Multer instances
const diskMulter = multer({ storage: diskStorage, fileFilter: fileFilter });
const memoryMulter = multer({ storage: memoryStorage, fileFilter: fileFilter });

// Export multer instances. Usage examples:
// uploadpics.addressableFile.single('addressableFile') -> keeps file in memory (req.file.buffer)
// uploadpics.default.single('imageUrl') -> stores file on disk
module.exports = {
    addressableFile: memoryMulter,
    default: diskMulter
};
