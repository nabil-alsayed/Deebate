const express = require('express');
const router = express.Router();
const { generateResponse } = require('../../services/chatgpt.service');

console.log('ChatGPT routes file loaded');

router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateResponse(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Error in /generate endpoint:", error);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

router.get('/test', async (req, res) => {
  try {
    const response = await generateResponse("Hello, ChatGPT!");
    res.json({ message: "Connection successful", response });
  } catch (error) {
    console.error("Error in /test endpoint:", error);
    res.status(500).json({ error: 'Failed to connect to ChatGPT API.' });
  }
});

module.exports = router;
//
// const express = require('express');
// const router = express.Router();
// const chatgptController = require('../../controllers/v1/chatgpt.controller');
// const { authenticateRole } = require("../../utils/utils");
//
// console.log('ChatGPT routes file loaded');
//
// router.post('/generate', authenticateRole("user"), chatgptController.generate);
//
// router.get('/test', authenticateRole("user"), chatgptController.test);
//
// module.exports = router;