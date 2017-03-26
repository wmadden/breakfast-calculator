#!/usr/bin/env node
const { getFoodData } = require('./getFoodData');
const { solve } = require('./solve');
const { PROTEIN, CARBOHYDRATES, FAT } = require('./constants');

function generateMealPlan({ availableFoods, desiredNutrients }) {
  const {
    desiredProtein, desiredCarbohydrates, desiredFat,
  } = desiredNutrients;

  const { foodVariables } = solve({
    availableFoods,
    desiredProtein,
    desiredCarbohydrates,
    desiredFat,
  });

  const totals = { [PROTEIN]: 0, [CARBOHYDRATES]: 0, [FAT]: 0 };
  const ingredients = [];

  foodVariables.forEach(({ foodDescriptor, variable }) => {
    const { name, nutrients: { protein, carbohydrates, fat } } = foodDescriptor;
    const amount = variable.value;

    const amountProtein = amount * protein;
    const amountCarbohydrates = amount * carbohydrates;
    const amountFat = amount * fat;

    totals[PROTEIN] += amountProtein;
    totals[CARBOHYDRATES] += amountCarbohydrates;
    totals[FAT] += amountFat;

    ingredients.push({
      name,
      amount,
      foodDescriptor,
      [PROTEIN]: amountProtein,
      [CARBOHYDRATES]: amountCarbohydrates,
      [FAT]: amountFat,
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
      desiredNutrients: {
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

    ingredients.forEach(({ name, amount, protein, carbohydrates, fat }) => {
      console.log(`${name}: ${amount.toFixed(0)}g (${protein.toFixed(1)}, ${carbohydrates.toFixed(1)}, ${fat.toFixed(1)})`);
    });

    console.log('');
    console.log('Total:');
    console.log('  Protein:      ', totals[PROTEIN].toFixed(1));
    console.log('  Carbohydrates:', totals[CARBOHYDRATES].toFixed(1));
    console.log('  Fat:          ', totals[FAT].toFixed(1));
  });
}

main();
