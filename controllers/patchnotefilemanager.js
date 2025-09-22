


const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const stream = require('stream');
const socket = require('../socket/config'); // Socket client to emit back to Web API

exports.uploadpatchnotesfile = async (req, res) => {
	const files = req.files || [];
	const { platform, version, description, socketId } = req.body;


	if (!files || files.length === 0) {
		return res.status(400).json({ message: 'failed', data: 'No files provided for upload' });
	}

	// Build multipart form
	const form = new FormData();
    
	if (platform) form.append('platform', platform);
	if (version) form.append('version', version);
	if (description) form.append('description', description);

	for (const file of files) {
		// Support memory-buffered uploads (req.file.buffer) or disk-based streams
		if (file && file.buffer) {
			form.append('addressableFile', file.buffer, { filename: file.originalname, contentType: file.mimetype });
		} else {
			// Append file stream; keep originalname for game API
			form.append('addressableFile', fs.createReadStream(file.path), { filename: file.originalname });
		}
	}

	// Forward socketId to game API so it can send updates back
	if (socketId) form.append('socketId', socketId);
    
    try {
        const apiKey = process.env.PATCHNOTES_API_KEY;
        if (!apiKey) {
            console.error('PATCHNOTE_API_KEY not set in environment');
            return res.status(500).json({ message: 'server-error', data: 'Server is not configured to forward patchnotes. Missing API key.' });
        }

        res.status(202).json({ message: 'accepted', data: { files: files.map(f => f.originalname), socketId } });

        // Background forward (do not await)
        setImmediate(async () => {
            try {
                const forwardForm = new FormData();
                if (platform) forwardForm.append('platform', platform);
                if (version) forwardForm.append('version', version);
                if (description) forwardForm.append('description', description);
                if (socketId) forwardForm.append('socketId', socketId);

                for (const file of files) {
                    if (file && file.path) {
                        forwardForm.append('addressableFile', fs.createReadStream(file.path), { filename: file.originalname });
                    } else if (file && file.buffer) {
                        forwardForm.append('addressableFile', file.buffer, { filename: file.originalname, contentType: file.mimetype });
                    }
                }

                const length = await new Promise((resolve, reject) => {
                    forwardForm.getLength((err, len) => {
                        if (err) return reject(err);
                        resolve(len);
                    });
                });

                const pass = new stream.PassThrough();
                forwardForm.pipe(pass);

                const headers = {
                    ...forwardForm.getHeaders(),
                    'content-length': length,
                    'x-api-key': apiKey
                };

                await axios.post(`${process.env.GAME_API_URL}/patchnotes/upload`, pass, {
                    headers,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 0
                });

            } catch (bgErr) {
                console.error('Background forward to Game API failed:', bgErr && (bgErr.message || bgErr));
            }
        });

        return;
    } catch (error) {
        console.error('Error preparing background forward:', error.message || error);
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'failed', data: 'Error uploading files to game API' };
        return res.status(status).json(data);
    }
}


exports.listpatchnotesfolder = async (req, res) => {
    const { platform, folderPath } = req.query;
    try {
        const apiKey = process.env.PATCHNOTES_API_KEY;
        if (!apiKey) {
            console.error('PATCHNOTE_API_KEY not set in environment');
            return res.status(500).json({ message: 'server-error', data: 'Server is not configured to list patchnotes. Missing API key.' });
        }
        const resp = await axios.get(`${process.env.GAME_API_URL}/patchnotes/list`, {
            params: { platform, folderPath },
            headers: { 'x-api-key': apiKey },
            timeout: 30000 // 30s
        });
        return res.status(resp.status).json(resp.data);
    } catch (error) {
        console.error('Error listing patchnotes folder:', error.message || error);
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'failed', data: 'Error listing patchnotes folder from game API' };
        return res.status(status).json(data);
    }
}

exports.deletepatchnotesfile = async (req, res) => {
    const { fileId } = req.body;
    if (!fileId) {
        return res.status(400).json({ message: 'failed', data: 'Please provide fileId to delete' });
    }
    try {
        const apiKey = process.env.PATCHNOTES_API_KEY;
        if (!apiKey) {
            console.error('PATCHNOTE_API_KEY not set in environment');
            return res.status(500).json({ message: 'server-error', data: 'Server is not configured to delete patchnotes. Missing API key.' });
        }
        const resp = await axios.post(`${process.env.GAME_API_URL}/patchnotes/filedelete`, { fileId }, {
            headers: { 'x-api-key': apiKey },
            timeout: 30000 // 30s
        });
        return res.status(resp.status).json(resp.data);
    } catch (error) {
        console.error('Error deleting patchnotes file:', error.message || error);
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'failed', data: 'Error deleting patchnotes file from game API' };
        return res.status(status).json(data);
    }
}
exports.updatepatchnotesfile = async (req, res) => {
    const { fileId, version, description } = req.body;
    if (!fileId) {
        return res.status(400).json({ message: 'failed', data: 'Please provide fileId to update' });
    }
    try {
        const apiKey = process.env.PATCHNOTES_API_KEY;
        if (!apiKey) {
            console.error('PATCHNOTE_API_KEY not set in environment');
            return res.status(500).json({ message: 'server-error', data: 'Server is not configured to update patchnotes. Missing API key.' });
        }
        const resp = await axios.post(`${process.env.GAME_API_URL}/patchnotes/fileupdate`, { fileId, version, description }, {
            headers: { 'x-api-key': apiKey },
            timeout: 30000 // 30s
        });
        return res.status(resp.status).json(resp.data);
    } catch (error) {
        console.error('Error updating patchnotes file:', error.message || error);
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'failed', data: 'Error updating patchnotes file in game API' };
        return res.status(status).json(data);
    }
}