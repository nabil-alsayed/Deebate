// chatgpt.js
const openai = require('openai');

openai.apiKey = process.env.OPENAI_API_KEY;

module.exports = openai;