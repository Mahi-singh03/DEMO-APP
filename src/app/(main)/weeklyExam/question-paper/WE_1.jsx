import React from 'react';

// Function to get random questions from the array
const getRandomQuestions = (questions, count) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const questions = [
  {
    question: "What is the capital of France?",
    options: [
      "London",
      "Berlin",
      "Paris",
      "Madrid"
    ],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    answer: "Mars"
  },
  {
    question: "What is the largest mammal in the world?",
    options: [
      "African Elephant",
      "Blue Whale",
      "Giraffe",
      "Hippopotamus"
    ],
    answer: "Blue Whale"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: [
      "Gold",
      "Oxygen",
      "Osmium",
      "Oganesson"
    ],
    answer: "Oxygen"
  },
  {
    question: "What is the main component of the Sun?",
    options: [
      "Helium",
      "Hydrogen",
      "Oxygen",
      "Carbon"
    ],
    answer: "Hydrogen"
  },
  {
    question: "Which country is home to the kangaroo?",
    options: [
      "New Zealand",
      "Australia",
      "South Africa",
      "Brazil"
    ],
    answer: "Australia"
  },
  {
    question: "What is the largest organ in the human body?",
    options: [
      "Heart",
      "Brain",
      "Liver",
      "Skin"
    ],
    answer: "Skin"
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: [
      "Isaac Newton",
      "Albert Einstein",
      "Galileo Galilei",
      "Stephen Hawking"
    ],
    answer: "Albert Einstein"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: [
      "Gold",
      "Diamond",
      "Platinum",
      "Titanium"
    ],
    answer: "Diamond"
  },
  {
    question: "Which ocean is the largest?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    answer: "Pacific Ocean"
  },
  {
    question: "What is the main component of natural gas?",
    options: [
      "Methane",
      "Ethane",
      "Propane",
      "Butane"
    ],
    answer: "Methane"
  },
  {
    question: "Which planet has the most moons?",
    options: [
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune"
    ],
    answer: "Saturn"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: [
      "Go",
      "Gd",
      "Au",
      "Ag"
    ],
    answer: "Au"
  },
  {
    question: "Which animal can change its color to match its surroundings?",
    options: [
      "Chameleon",
      "Octopus",
      "Both A and B",
      "Neither A nor B"
    ],
    answer: "Both A and B"
  },
  {
    question: "What is the smallest unit of matter?",
    options: [
      "Atom",
      "Electron",
      "Quark",
      "Neutron"
    ],
    answer: "Quark"
  },
  {
    question: "Which country has the most natural lakes?",
    options: [
      "Canada",
      "Russia",
      "United States",
      "Finland"
    ],
    answer: "Canada"
  },
  {
    question: "What is the main component of the Earth's atmosphere?",
    options: [
      "Oxygen",
      "Carbon Dioxide",
      "Nitrogen",
      "Hydrogen"
    ],
    answer: "Nitrogen"
  },
  {
    question: "Which animal has the longest lifespan?",
    options: [
      "Giant Tortoise",
      "Bowhead Whale",
      "Greenland Shark",
      "African Elephant"
    ],
    answer: "Greenland Shark"
  },
  {
    question: "What is the largest desert in the world?",
    options: [
      "Sahara Desert",
      "Gobi Desert",
      "Antarctic Desert",
      "Arabian Desert"
    ],
    answer: "Antarctic Desert"
  },
  {
    question: "Which element is the most abundant in the Earth's crust?",
    options: [
      "Iron",
      "Oxygen",
      "Silicon",
      "Aluminum"
    ],
    answer: "Oxygen"
  },
  {
    question: "What is the speed of light in a vacuum?",
    options: [
      "299,792,458 meters per second",
      "186,282 miles per second",
      "Both A and B",
      "Neither A nor B"
    ],
    answer: "Both A and B"
  },
  {
    question: "Which country has the most active volcanoes?",
    options: [
      "Japan",
      "Indonesia",
      "United States",
      "Italy"
    ],
    answer: "Indonesia"
  },
  {
    question: "What is the largest living organism on Earth?",
    options: [
      "Blue Whale",
      "Giant Sequoia Tree",
      "Great Barrier Reef",
      "Pando Aspen Grove"
    ],
    answer: "Great Barrier Reef"
  },
  {
    question: "Which planet has the strongest winds in the solar system?",
    options: [
      "Jupiter",
      "Saturn",
      "Neptune",
      "Uranus"
    ],
    answer: "Neptune"
  },
  {
    question: "What is the main component of the Sun's energy production?",
    options: [
      "Nuclear Fission",
      "Nuclear Fusion",
      "Chemical Combustion",
      "Gravitational Collapse"
    ],
    answer: "Nuclear Fusion"
  },
  {
    question: "Which animal has the largest brain relative to body size?",
    options: [
      "Human",
      "Dolphin",
      "Elephant",
      "Chimpanzee"
    ],
    answer: "Dolphin"
  },
  {
    question: "What is the deepest point in the Earth's oceans?",
    options: [
      "Mariana Trench",
      "Puerto Rico Trench",
      "Java Trench",
      "Philippine Trench"
    ],
    answer: "Mariana Trench"
  },
  {
    question: "Which element is liquid at room temperature?",
    options: [
      "Bromine",
      "Mercury",
      "Both A and B",
      "Neither A nor B"
    ],
    answer: "Both A and B"
  },
  {
    question: "What is the largest organ in the human body by weight?",
    options: [
      "Skin",
      "Liver",
      "Brain",
      "Heart"
    ],
    answer: "Liver"
  },
  {
    question: "Which country has the most islands?",
    options: [
      "Indonesia",
      "Sweden",
      "Finland",
      "Norway"
    ],
    answer: "Sweden"
  }
];

export const WE_1 = getRandomQuestions(questions, 30);

export const WE_1_questions = [
  {
    question: "What is the capital of France?",
    options: [
      "London",
      "Berlin",
      "Paris",
      "Madrid"
    ],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    answer: "Mars"
  },
  {
    question: "What is the largest mammal in the world?",
    options: [
      "African Elephant",
      "Blue Whale",
      "Giraffe",
      "Hippopotamus"
    ],
    answer: "Blue Whale"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: [
      "Gold",
      "Oxygen",
      "Osmium",
      "Oganesson"
    ],
    answer: "Oxygen"
  },
  {
    question: "What is the main component of the Sun?",
    options: [
      "Helium",
      "Hydrogen",
      "Oxygen",
      "Carbon"
    ],
    answer: "Hydrogen"
  },
  {
    question: "Which country is home to the kangaroo?",
    options: [
      "New Zealand",
      "Australia",
      "South Africa",
      "Brazil"
    ],
    answer: "Australia"
  },
  {
    question: "What is the largest organ in the human body?",
    options: [
      "Heart",
      "Brain",
      "Liver",
      "Skin"
    ],
    answer: "Skin"
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: [
      "Isaac Newton",
      "Albert Einstein",
      "Galileo Galilei",
      "Stephen Hawking"
    ],
    answer: "Albert Einstein"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: [
      "Gold",
      "Diamond",
      "Platinum",
      "Titanium"
    ],
    answer: "Diamond"
  },
  {
    question: "Which ocean is the largest?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    answer: "Pacific Ocean"
  },
  {
    question: "What is the main component of natural gas?",
    options: [
      "Methane",
      "Ethane",
      "Propane",
      "Butane"
    ],
    answer: "Methane"
  },
  {
    question: "Which planet has the most moons?",
    options: [
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune"
    ],
    answer: "Saturn"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: [
      "Go",
      "Gd",
      "Au",
      "Ag"
    ],
    answer: "Au"
  },
  {
    question: "Which animal can change its color to match its surroundings?",
    options: [
      "Chameleon",
      "Octopus",
      "Both A and B",
      "Neither A nor B"
    ],
    answer: "Both A and B"
  },
  {
    question: "What is the smallest unit of matter?",
    options: [
      "Atom",
      "Electron",
      "Quark",
      "Neutron"
    ],
    answer: "Quark"
  },
  {
    question: "Which country has the most natural lakes?",
    options: [
      "Canada",
      "Russia",
      "United States",
      "Finland"
    ],
    answer: "Canada"
  },
  {
    question: "What is the main component of the Earth's atmosphere?",
    options: [
      "Oxygen",
      "Carbon Dioxide",
      "Nitrogen",
      "Hydrogen"
    ],
    answer: "Nitrogen"
  },
  {
    question: "Which animal has the longest lifespan?",
    options: [
      "Giant Tortoise",
      "Bowhead Whale",
      "Greenland Shark",
      "African Elephant"
    ],
    answer: "Greenland Shark"
  },
  {
    question: "What is the largest desert in the world?",
    options: [
      "Sahara Desert",
      "Gobi Desert",
      "Antarctic Desert",
      "Arabian Desert"
    ],
    answer: "Antarctic Desert"
  },
  {
    question: "Which element is the most abundant in the Earth's crust?",
    options: [
      "Iron",
      "Oxygen",
      "Silicon",
      "Aluminum"
    ],
    answer: "Oxygen"
  },
  {
    question: "What is the speed of light in a vacuum?",
    options: [
      "299,792,458 meters per second",
      "186,282 miles per second",
      "Both A and B",
      "Neither A nor B"
    ],
    answer: "Both A and B"
  },
  {
    question: "Which country has the most active volcanoes?",
    options: [
      "Japan",
      "Indonesia",
      "United States",
      "Italy"
    ],
    answer: "Indonesia"
  },
  {
    question: "What is the largest living organism on Earth?",
    options: [
      "Blue Whale",
      "Giant Sequoia Tree",
      "Great Barrier Reef",
      "Pando Aspen Grove"
    ],
    answer: "Great Barrier Reef"
  },
  {
    question: "Which planet has the strongest winds in the solar system?",
    options: [
      "Jupiter",
      "Saturn",
      "Neptune",
      "Uranus"
    ],
    answer: "Neptune"
  },
  {
    question: "What is the main component of the Sun's energy production?",
    options: [
      "Nuclear Fission",
      "Nuclear Fusion",
      "Chemical Combustion",
      "Gravitational Collapse"
    ],
    answer: "Nuclear Fusion"
  },
  {
    question: "Which animal has the largest brain relative to body size?",
    options: [
      "Human",
      "Dolphin",
      "Elephant",
      "Chimpanzee"
    ],
    answer: "Dolphin"
  },
  {
    question: "What is the deepest point in the Earth's oceans?",
    options: [
      "Mariana Trench",
      "Puerto Rico Trench",
      "Java Trench",
      "Philippine Trench"
    ],
    answer: "Mariana Trench"
  },
  {
    question: "Which element is liquid at room temperature?",
    options: [
      "Bromine",
      "Mercury",
      "Both A and B",
      "Neither A nor B"
    ],
    answer: "Both A and B"
  },
  {
    question: "What is the largest organ in the human body by weight?",
    options: [
      "Skin",
      "Liver",
      "Brain",
      "Heart"
    ],
    answer: "Liver"
  },
  {
    question: "Which country has the most islands?",
    options: [
      "Indonesia",
      "Sweden",
      "Finland",
      "Norway"
    ],
    answer: "Sweden"
  }
];