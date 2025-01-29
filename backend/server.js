import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual API key
const googleApiKey = 'AIzaSyBHDoMzpg7h37csxhflZ-HDuoNrBcCIG74';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(googleApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Route to handle generating safety tips
app.post('/generate-safety-tips', async (req, res) => {
  try {
    // Get the medical information from the request body
    const { medicalInfo } = req.body;

    if (!medicalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Medical information is required.',
      });
    }

    // Generate content using the model
    const prompt = `Generate important safety tips for a patient with the following medical information: ${medicalInfo}`;
    const result = await model.generateContent(prompt);

    // Assuming the result returns a safety tips text, split them into a list by newlines
    const safetyTips = result.response.text().split('\n'); // Adjust as needed based on actual response format

    // Return the safety tips in the expected format
    res.json({
      success: true,
      safetyTips,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
