const express = require('express')
const router = express.router

router.get('/:id/tweets', (req, res) => {
	console.log('get tweets request')
	res.send('ok')
})

export default router