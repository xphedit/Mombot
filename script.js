document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const recipeTopic = document.getElementById('recipe-topic');
    const recipeOutput = document.getElementById('recipe-output');

    generateBtn.addEventListener('click', async () => {
        const topic = recipeTopic.value.trim();
        if (topic) {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            recipeOutput.innerHTML = 'Generating recipe...';

            try {
                const response = await fetch('/generate-recipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic }),
                });

                if (response.ok) {
                    const data = await response.json();
                    recipeOutput.innerHTML = formatRecipe(data.recipe);
                } else {
                    throw new Error('Failed to generate recipe');
                }
            } catch (error) {
                console.error('Error:', error);
                recipeOutput.textContent = 'An error occurred while generating the recipe. Please try again.';
            } finally {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate Recipe';
            }
        } else {
            recipeOutput.textContent = 'Please enter a recipe topic.';
        }
    });

    function formatRecipe(recipe) {
        return `
            <h3>${recipe.title}</h3>
            <h4>Ingredients:</h4>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <h4>Instructions:</h4>
            <ol>
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
    }
});
