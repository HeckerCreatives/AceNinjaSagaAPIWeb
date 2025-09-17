


const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.uploadpatchnotesfile = async (req, res) => {
	const files = req.files || [];
	const { platform, version, description } = req.body;


	if (!files || files.length === 0) {
		return res.status(400).json({ message: 'failed', data: 'No files provided for upload' });
	}

	// Build multipart form
	const form = new FormData();
    
	if (platform) form.append('platform', platform);
	if (version) form.append('version', version);
	if (description) form.append('description', description);
	for (const file of files) {
		// Append file stream; keep originalname for game API
		form.append('addressableFile', fs.createReadStream(file.path), { filename: file.originalname });
	}
    
	try {
		const apiKey = process.env.PATCHNOTES_API_KEY;
		if (!apiKey) {
			console.error('PATCHNOTE_API_KEY not set in environment');
			return res.status(500).json({ message: 'server-error', data: 'Server is not configured to forward patchnotes. Missing API key.' });
		}
		const resp = await axios.post(`${process.env.GAME_API_URL}/patchnotes/upload`, form, {
			headers: {
				...form.getHeaders(),
				'x-api-key': apiKey
			},
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
			timeout: 600000 // 10min
		});

		return res.status(resp.status).json(resp.data);
	} catch (error) {
		console.error('Error forwarding patchnotes files:', error.message || error);
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