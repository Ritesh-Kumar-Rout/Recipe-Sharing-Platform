import fs from 'fs';
import path from 'path';

const categories = ['Breakfast', 'Healthy', 'Desserts', 'Drinks', 'Vegan', 'Snacks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const adjectives = ['Spicy', 'Sweet', 'Savory', 'Creamy', 'Crispy', 'Roasted', 'Grilled', 'Baked', 'Zesty', 'Classic', 'Gourmet', 'Quick', 'Delicious', 'Tasty', 'Hearty'];
const foods = ['Chicken', 'Beef', 'Tofu', 'Pasta', 'Salad', 'Burger', 'Pizza', 'Soup', 'Curry', 'Noodles', 'Rice Bowl', 'Sandwich', 'Tacos', 'Wrap', 'Pancakes'];
const extras = ['with Vegetables', 'with Garlic Sauce', 'with Cheese', 'with Herbs', 'with Lemon', 'Delight', 'Supreme', 'Special', 'Bowl', 'Platter'];

const images = [
  '1546069901-ba959aab5db4', '1565299624946-b28f40a0ae38', '1484723091771-2ebc1dc28bbf',
  '1473093295043-cdd812d0e601', '1499028068882-641bcedfd2d8', '1432139555190-58524dae6a55',
  '1455619156641-f761fc726e64', '1476224203421-9ce223cb11b9', '1504674900247-0877df9cc836',
  '1490645935967-10de6ba17061', '1528735602780-2552fd46c7af', '1460306855393-0410f61241c7',
  '1478144592103-25e218a04891', '1485692462843-cda497491d90', '1554502573-200908eb8ff7'
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const recipes = [];

// Generate 36 recipes
for (let i = 5; i <= 40; i++) {
  const title = `${getRandom(adjectives)} ${getRandom(foods)} ${getRandom(extras)}`;
  const recipe = {
    id: `r${i}`,
    title: title,
    description: `A delicious and ${getRandom(adjectives).toLowerCase()} recipe for ${title}. Perfect for any occasion.`,
    image: `https://images.unsplash.com/photo-${getRandom(images)}?auto=format&fit=crop&q=80&w=800`,
    author: {
      name: `Chef ${['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley'][Math.floor(Math.random() * 6)]}`,
      avatar: `https://ui-avatars.com/api/?name=Chef&background=random`
    },
    time: `${Math.floor(Math.random() * 45) + 15} min`,
    difficulty: getRandom(difficulties),
    likes: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 500) + 10,
    category: getRandom(categories),
    ingredients: [
      '1 cup Main Ingredient',
      '2 tbsp Olive Oil',
      '1 pinch Salt and Pepper',
      '1/2 cup Additional spices'
    ],
    steps: [
      'Prepare all ingredients by washing and chopping.',
      'Heat the pan and add the main ingredients.',
      'Cook for about half the required time, constantly stirring.',
      'Add the remaining spices and finish cooking.',
      'Serve hot and enjoy your meal!'
    ]
  };
  recipes.push(recipe);
}

const fileContent = `import type { Recipe } from './mockData';\n\nexport const GENERATED_RECIPES: Recipe[] = ${JSON.stringify(recipes, null, 2)};\n`;

fs.writeFileSync('./src/data/generatedRecipes.ts', fileContent);
console.log('Successfully generated docs.');
