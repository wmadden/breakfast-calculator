#!/usr/bin/env node
const { getFoodData } = require('./getFoodData');
const { solve } = require('./solve');
const { PROTEIN, CARBOHYDRATES, FAT } = require('./constants');

function generateMealPlan({ availableFoods, nutrientGoals }) {
  const { ingredients } = solve({
    availableFoods,
    nutrientGoals,
  });

  const totals = {};

  ingredients.forEach(({ nutrientAmounts }) => {
    Object.keys(nutrientAmounts).forEach((nutrientName) => {
      const nutrientAmount = nutrientAmounts[nutrientName];
      if (!totals.hasOwnProperty(nutrientName)) totals[nutrientName] = 0;
      totals[nutrientName] += nutrientAmount;
    });
  });

  return {
    totals,
    ingredients,
  };
}

function main() {
  const desiredProtein = 100;
  const desiredCarbohydrates = 100;
  const desiredFat = 100;

  const desiredFoods = ['eggs', 'protein powder', 'oats', 'vanilla soy yoghurt', 'banana'];

  getFoodData().then((foodData) => {
    const availableFoods = foodData.filter(food => desiredFoods.includes(food.name));
    const { ingredients, totals } = generateMealPlan({
      availableFoods,
      nutrientGoals: {
        desiredProtein,
        desiredCarbohydrates,
        desiredFat,
      },
    });

    console.log('');
    console.log('Desired protein:', desiredProtein);
    console.log('Desired carbohydrates:', desiredCarbohydrates);
    console.log('Desired fat:', desiredFat);
    console.log('');
    console.log('Meal plan: ingredient amount (g) (protein, carbohydrates, fat)');
    console.log('');

    ingredients.forEach(({ foodDescriptor, amount, nutrientAmounts }) => {
      console.log(`${foodDescriptor.name}: ${amount.toFixed(0)}g (${nutrientAmounts.protein.toFixed(1)}, ${nutrientAmounts.carbohydrates.toFixed(1)}, ${nutrientAmounts.fat.toFixed(1)})`);
    });

    console.log('');
    console.log('Total:');
    console.log('  Protein:      ', totals[PROTEIN].toFixed(1));
    console.log('  Carbohydrates:', totals[CARBOHYDRATES].toFixed(1));
    console.log('  Fat:          ', totals[FAT].toFixed(1));
  });
}

main();
