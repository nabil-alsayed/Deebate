const { generateResponse } = require("../../services/chatgpt.service");


const generate = async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await generateResponse(prompt);

        if(!response) {
            return res.status(400).json({ error: 'Failed to generate response.' });
        }

        res.json({ response });
    } catch (error) {
        console.error("Error in /generate endpoint:", error);
        res.status(500).json({ error: 'An error occurred while generating the response.' });
    }
}

const test = async (req, res) => {
    try {
        const response = await generateResponse("Hello, ChatGPT!");
        res.json({ message: "Connection successful", response });
    } catch (error) {
        console.error("Error in /test endpoint:", error);
        res.status(500).json({ error: 'Failed to connect to ChatGPT API.' });
    }
}

module.exports = {
    generate,
    test
}

// const { generateResponse } = require("../../services/chatgpt.service");
// const Debate = require("../../models/debate");
//
// // Controller function for generating analysis
// const generate = async (req, res) => {
//     try {
//         const { debateId } = req.body;
//
//         // Fetch the debate by ID
//         const debate = await Debate.findById(debateId);
//
//         // Handle non-existent debate
//         if (!debate) {
//             return res.status(404).json({ error: 'Debate not found.' });
//         }
//
//         // Ensure debate is closed before generating analysis
//         if (debate.status !== 'closed') {
//             return res.status(400).json({ error: 'Debate is still open, wait till the debate is closed.' });
//         }
//
//         // Check if analysis has already been generated
//         if (debate.analysis) {
//             return res.status(400).json({ error: 'Response already generated for this debate.' });
//         }
//
//         // Generate analysis if arguments exist
//         if (!debate.arguments || debate.arguments.length === 0) {
//             return res.status(400).json({ error: 'No arguments to analyze for this debate.' });
//         }
//
//         // Generate the prompt for ChatGPT analysis
//         const prompt = await generatePrompt(debate);
//
//         // Get AI response using OpenAI's API
//         const response = await generateResponse(prompt);
//
//         if (!response) {
//             return res.status(400).json({ error: 'Failed to generate AI analysis.' });
//         }
//
//         // Save the analysis to the debate
//         debate.analysis = response;
//         await debate.save();
//
//         res.status(200).json({ message: 'Response generated successfully', response });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while generating the analysis.' });
//     }
// };
//
// // Test connection with ChatGPT
// const test = async (req, res) => {
//     try {
//         const response = await generateResponse("Hello, ChatGPT!");
//         res.json({ message: "Connection successful", response });
//     } catch (error) {
//         console.error("Error in /test endpoint:", error);
//         res.status(500).json({ error: 'Failed to connect to ChatGPT API.' });
//     }
// };
//
// module.exports = {
//     generate,
//     test
// };
