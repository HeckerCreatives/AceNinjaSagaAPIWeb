const express = require('express');
const axios = require('axios');

const router = express.Router();

// Proxy GET requests to the game API's addressables endpoint. Forwards query string parameters from req.query.
// Example: GET /addressables/StandaloneWindows64/scenes.bundle -> ${GAME_API_URL}/addressables/StandaloneWindows64/scenes.bundle
router.get('/download', async (req, res) => {
	const { path } = req.query
    const apiKey = process.env.PATCHNOTES_API_KEY;
	const gameApi = process.env.GAME_API_URL;
	if (!apiKey || !gameApi) {
		return res.status(500).json({ message: 'server-error', data: 'GAME_API_URL or PATCHNOTES_API_KEY not configured' });
	}

	// Build and sanitize the requested path. Accepts Windows backslashes and
	// paths that may include a leading 'addressables' segment.
	let requestedPath = path || req.path || '/';
	// Normalize slashes
	requestedPath = requestedPath.replace(/\\/g, '/');

	// Remove any leading "addressables" segment to avoid double-prefixing
	requestedPath = requestedPath.replace(/^\/?addressables\/?/i, '');

	// Ensure it starts with a single slash
	if (!requestedPath.startsWith('/')) requestedPath = '/' + requestedPath;

	// Reject path traversal attempts and Windows drive letters
	if (requestedPath.includes('..') || /^[a-zA-Z]:/.test(requestedPath)) {
		return res.status(400).json({ message: 'failed', data: 'Invalid path' });
	}

	const targetUrl = encodeURI(`${gameApi.replace(/\/$/, '')}/addressables${requestedPath}`);

	try {
		// Forward query params except the special 'path' param used by this proxy
		const forwardedQuery = Object.assign({}, req.query);
		if (forwardedQuery.hasOwnProperty('path')) delete forwardedQuery.path;

		const axiosRes = await axios.get(targetUrl, {
			responseType: 'stream',
			headers: {
				'x-api-key': apiKey,
				// forward range header if present for partial content
				...(req.headers.range ? { range: req.headers.range } : {})
			},
			params: forwardedQuery,
			validateStatus: status => status < 500
		});

		// Forward status and headers (content-type, content-length, accept-ranges, etc.)
		res.status(axiosRes.status);
		for (const [k, v] of Object.entries(axiosRes.headers)) {
			// Skip hop-by-hop headers
			if (['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'upgrade'].includes(k.toLowerCase())) continue;
			res.setHeader(k, v);
		}

		// Pipe the stream
		axiosRes.data.pipe(res);
	} catch (err) {
		console.error('Error proxying addressables request:', err.message || err);
		if (err.response) {
			return res.status(err.response.status).json(err.response.data || { message: 'failed' });
		}
		return res.status(502).json({ message: 'failed', data: 'Bad gateway when contacting game API' });
	}
});

module.exports = router;
