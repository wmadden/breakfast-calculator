#!/usr/bin/env node
const { getFoodData } = require('./getFoodData');
const { Solver } = require('./Solver');
const { PROTEIN, CARBOHYDRATES, FAT } = require('./constants');

const desiredProtein = 100;
const desiredCarbohydrates = 100;
const desiredFat = 100;

const desiredFoods = ['eggs', 'protein powder', 'oats', 'vanilla soy yoghurt', 'banana'];

getFoodData().then((foodData) => {
  const availableFoods = foodData.filter(food => desiredFoods.includes(food.name));
  const { foodVariables } = Solver({
    availableFoods,
    desiredProtein,
    desiredCarbohydrates,
    desiredFat,
  });

  console.log('');
  console.log('Desired protein:', desiredProtein);
  console.log('Desired carbohydrates:', desiredCarbohydrates);
  console.log('Desired fat:', desiredFat);
  console.log('');
  console.log('Meal plan: ingredient amount (g) (protein, carbohydrates, fat)');
  console.log('');

  const totals = { [PROTEIN]: 0, [CARBOHYDRATES]: 0, [FAT]: 0 };

  foodVariables.forEach(({ foodDescriptor, variable }) => {
    const { name, protein, carbohydrates, fat } = foodDescriptor;
    const amount = variable.value;

    const amountProtein = amount * protein;
    const amountCarbohydrates = amount * carbohydrates;
    const amountFat = amount * fat;

    totals[PROTEIN] += amountProtein;
    totals[CARBOHYDRATES] += amountCarbohydrates;
    totals[FAT] += amountFat;

    console.log(`${name}: ${amount.toFixed(0)}g (${amountProtein.toFixed(1)}, ${amountCarbohydrates.toFixed(1)}, ${amountFat.toFixed(1)})`);
  });

  console.log('');
  console.log('Total:');
  console.log('  Protein:      ', totals[PROTEIN].toFixed(1));
  console.log('  Carbohydrates:', totals[CARBOHYDRATES].toFixed(1));
  console.log('  Fat:          ', totals[FAT].toFixed(1));
});
