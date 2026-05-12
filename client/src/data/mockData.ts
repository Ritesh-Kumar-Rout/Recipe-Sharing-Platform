import { GENERATED_RECIPES } from './generatedRecipes';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  likes: number;
  comments: number;
  category: string;
  ingredients: string[];
  steps: string[];
}
export interface SocialPost {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLikedByMe?: boolean;
}

export const MOCK_POSTS: SocialPost[] = [
  {
    id: 'p1',
    user: {
      name: 'Chef Maria',
      username: 'chefmaria',
      avatar: 'https://ui-avatars.com/api/?name=Chef+Maria&background=random',
      isVerified: true,
    },
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000',
    caption: 'Just perfected my signature smoked ribs! The secret is in the 12-hour dry rub 🥩🔥 #bbq #meatlover #chefslife',
    likes: 342,
    comments: 28,
    timeAgo: '2 hours ago',
    isLikedByMe: false,
  },
  {
    id: 'p2',
    user: {
      name: 'Emma Green',
      username: 'emmagreen_eats',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Green&background=random',
    },
    image: 'https://images.unsplash.com/photo-1484723091798-dffc12259843?auto=format&fit=crop&q=80&w=1000',
    caption: 'Sunday brunch situation 🥑🍞 Avocado toast with poached eggs and a sprinkle of chili flakes. Perfect start to the day!',
    likes: 890,
    comments: 45,
    timeAgo: '5 hours ago',
    isLikedByMe: true,
  },
  {
    id: 'p3',
    user: {
      name: 'John Baker',
      username: 'johnbaker',
      avatar: 'https://ui-avatars.com/api/?name=John+Baker&background=random',
    },
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000',
    caption: 'First attempt at a layered chocolate raspberry cake! 🍰 Need to work on my frosting skills but it tastes amazing. #baking #cake',
    likes: 124,
    comments: 12,
    timeAgo: '8 hours ago',
    isLikedByMe: false,
  },
  {
    id: 'p4',
    user: {
      name: 'Sushi Lovers',
      username: 'sushilovers',
      avatar: 'https://ui-avatars.com/api/?name=Sushi+Lovers&background=random',
      isVerified: true,
    },
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000',
    caption: 'Fresh salmon nigiri straight from the Tsukiji market! 🍣✨ #sushi #japanesefood #fresh',
    likes: 2156,
    comments: 134,
    timeAgo: '1 day ago',
    isLikedByMe: false,
  }
];


export const CATEGORIES = [
  { id: '1', name: 'Breakfast', icon: '🍳', color: 'bg-orange-100 text-orange-600' },
  { id: '2', name: 'Healthy', icon: '🥗', color: 'bg-green-100 text-green-600' },
  { id: '3', name: 'Desserts', icon: '🍰', color: 'bg-pink-100 text-pink-600' },
  { id: '4', name: 'Drinks', icon: '🍹', color: 'bg-blue-100 text-blue-600' },
  { id: '5', name: 'Vegan', icon: '🥑', color: 'bg-teal-100 text-teal-600' },
  { id: '6', name: 'Snacks', icon: '🍿', color: 'bg-yellow-100 text-yellow-600' },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Creamy Garlic Tuscan Salmon',
    description: 'A rich and creamy Tuscan salmon dish packed with flavors of garlic, sun-dried tomatoes, and spinach.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Chef Maria',
      avatar: 'https://ui-avatars.com/api/?name=Chef+Maria&background=random',
    },
    time: '30 min',
    difficulty: 'Medium',
    likes: 1245,
    comments: 89,
    category: 'Healthy',
    ingredients: [
      '2 Salmon fillets',
      '1 tbsp Olive oil',
      '2 cloves Garlic, minced',
      '1/2 cup Heavy cream',
      '1/4 cup Sun-dried tomatoes',
      '2 cups Baby spinach',
      'Salt and pepper to taste'
    ],
    steps: [
      'Season salmon fillets with salt and pepper.',
      'Heat oil in a skillet over medium-high heat. Sear salmon for 4 minutes per side. Remove and set aside.',
      'In the same skillet, add garlic and sun-dried tomatoes. Cook for 1 minute.',
      'Pour in heavy cream and let it simmer until slightly thickened.',
      'Stir in spinach until wilted. Return salmon to the skillet and simmer for 2 more minutes.',
      'Serve hot with a side of pasta or vegetables.'
    ]
  },
  {
    id: 'r2',
    title: 'Fluffy Buttermilk Pancakes',
    description: 'Classic, fluffy buttermilk pancakes perfect for a weekend breakfast treated with maple syrup.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'John Baker',
      avatar: 'https://ui-avatars.com/api/?name=John+Baker&background=random',
    },
    time: '20 min',
    difficulty: 'Easy',
    likes: 3412,
    comments: 210,
    category: 'Breakfast',
    ingredients: [
      '2 cups All-purpose flour',
      '2 tbsp Sugar',
      '2 tsp Baking powder',
      '1/2 tsp Baking soda',
      '2 cups Buttermilk',
      '2 large Eggs',
      '1/4 cup Melted butter'
    ],
    steps: [
      'Whisk dry ingredients (flour, sugar, baking powder, baking soda) in a large bowl.',
      'In a separate bowl, whisk buttermilk, eggs, and melted butter.',
      'Pour the wet ingredients into the dry ingredients and stir until just combined (lumps are fine).',
      'Heat a lightly oiled griddle or pan over medium heat.',
      'Pour 1/4 cup of batter for each pancake. Cook until bubbles form on the surface, then flip and cook until golden brown.',
      'Serve with butter and maple syrup.'
    ]
  },
  {
    id: 'r3',
    title: 'Vegan Buddha Bowl',
    description: 'A nourishing and vibrant bowl packed with quinoa, roasted chickpeas, avocado, and tahini dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Emma Green',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Green&background=random',
    },
    time: '45 min',
    difficulty: 'Easy',
    likes: 892,
    comments: 45,
    category: 'Vegan',
    ingredients: [
      '1 cup Quinoa',
      '1 can Chickpeas, rinsed and dried',
      '1 Sweet potato, cubed',
      '2 cups Kale or Spinach',
      '1 Avocado, sliced',
      '1/4 cup Tahini',
      '1 Lemon (juiced)'
    ],
    steps: [
      'Cook quinoa according to package instructions.',
      'Toss chickpeas and sweet potato with olive oil, salt, and spices. Roast at 400°F (200°C) for 25-30 minutes.',
      'Whisk tahini, lemon juice, a splash of water, and garlic powder to make the dressing.',
      'Assemble the bowls with quinoa, roasted veggies, greens, and avocado.',
      'Drizzle heavily with the tahini dressing before serving.'
    ]
  },
  {
    id: 'r4',
    title: 'Matcha Boba Tea',
    description: 'Refreshing homemade matcha milk tea with chewy brown sugar tapioca pearls.',
    image: 'https://images.unsplash.com/photo-1558855567-1a41c1ebcc6a?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Tea Master Li',
      avatar: 'https://ui-avatars.com/api/?name=Tea+Master+Li&background=random',
    },
    time: '15 min',
    difficulty: 'Medium',
    likes: 2156,
    comments: 134,
    category: 'Drinks',
    ingredients: [
      '1/2 cup Tapioca pearls',
      '2 tbsp Brown sugar',
      '2 tsp Matcha powder',
      '1/4 cup Hot water',
      '1 cup Milk (dairy or oat)',
      'Ice cubes'
    ],
    steps: [
      'Boil tapioca pearls according to package instructions. Drain and rinse.',
      'Mix warm pearls with brown sugar and let it sit for 5 minutes.',
      'Whisk matcha powder with hot water until frothy and smooth.',
      'Add the brown sugar pearls to a glass, then add ice.',
      'Pour in the milk, followed by the whisked matcha on top for a layered effect.',
      'Stir well before drinking.'
    ]
  },
  ...GENERATED_RECIPES
];
