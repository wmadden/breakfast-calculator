#!/usr/bin/env node
const { getFoodData } = require('./getFoodData');
const { solve } = require('./solve');

function main() {
  const desiredProtein = 66.7;
  const desiredCarbohydrates = 58.3;
  const desiredFat = 30.0;

  const desiredFoods = ['eggs', 'protein powder', 'oats', 'vanilla soy yoghurt', 'banana'];

  getFoodData().then((foodData) => {
    const availableFoods = foodData.filter(food => desiredFoods.includes(food.name));
    const { ingredients } = solve({
      availableFoods,
      nutrientGoals: {
        protein: desiredProtein,
        carbohydrates: desiredCarbohydrates,
        fat: desiredFat,
      },
    });

    const totals = {};

    ingredients.forEach(({ nutrientAmounts }) => {
      Object.keys(nutrientAmounts).forEach((nutrientName) => {
        const nutrientAmount = nutrientAmounts[nutrientName];
        if (!totals.hasOwnProperty(nutrientName)) totals[nutrientName] = 0;
        totals[nutrientName] += nutrientAmount;
      });
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
    console.log('  Protein:      ', totals.protein.toFixed(1));
    console.log('  Carbohydrates:', totals.carbohydrates.toFixed(1));
    console.log('  Fat:          ', totals.fat.toFixed(1));
  });
}

main();
