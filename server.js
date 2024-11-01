const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-recipe', async (req, res) => {
    const { topic } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that generates recipes." },
                { role: "user", content: `Generate a recipe for ${topic}. Include a title, list of ingredients, and step-by-step instructions. Format the response as JSON with keys: title, ingredients (array), and instructions (array).` }
            ],
        });

        const recipeJson = JSON.parse(completion.choices[0].message.content);
        res.json({ recipe: recipeJson });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating the recipe.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
