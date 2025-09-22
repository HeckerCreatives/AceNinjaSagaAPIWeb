const router = require('express').Router();
const { uploadpatchnotesfile, listpatchnotesfolder, updatepatchnotesfile, deletepatchnotesfile } = require('../controllers/patchnotefilemanager');
const { protectsuperadmin } = require('../middleware/middleware');
const upload = require('../middleware/uploadpics');
// Use memory variant for forwarding uploads so files are not stored locally
const memoryUpload = upload.memory;

// Use the project's upload middleware which handles addressableFile storage/validation
// Accept multiple files uploaded under the 'addressableFile' field
router
 .post('/upload', protectsuperadmin, memoryUpload.array('addressableFile', 50), uploadpatchnotesfile)
 .post('/fileupdate', protectsuperadmin, upload.array('addressableFile', 50), updatepatchnotesfile)
 .post('/filedelete', protectsuperadmin, upload.array('addressableFile', 50), deletepatchnotesfile)
 .get('/list', protectsuperadmin, listpatchnotesfolder)
module.exports = router;
