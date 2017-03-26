const Cassowary = require('./c');
const { PROTEIN, CARBOHYDRATES, FAT } = require('./constants');

const {
  Variable,
  SimplexSolver,
  Inequality,
  Equation,
  Expression,
  GEQ,
  Strength,
} = Cassowary;

function getFoodVariable(foodDescriptor) {
  const { name, nutrients } = foodDescriptor;
  const ingredientAmountVariable = new Variable({ name });

  const nutrientExpressions = {};
  Object.keys(nutrients).forEach((nutrientName) => {
    const nutrientValue = nutrients[nutrientName];
    nutrientExpressions[nutrientName] = new Expression(ingredientAmountVariable).times(new Expression(nutrientValue));
  });

  return {
    foodDescriptor,
    variable: ingredientAmountVariable,
    constraints: [
      new Inequality(new Expression(ingredientAmountVariable), GEQ, new Expression(0), Strength.required),
    ],
    expressions: nutrientExpressions,
  };
}

function sumExpression(foodVariables, nutrientName) {
  let expression = new Expression(0);
  foodVariables.forEach((foodVariable) => {
    expression = expression.plus(foodVariable.expressions[nutrientName]);
  });
  return expression;
}

function solve({ availableFoods, desiredProtein, desiredCarbohydrates, desiredFat }) {
  const foodVariables = availableFoods.map(getFoodVariable);

  const solver = new SimplexSolver();

  foodVariables.forEach((foodVariable) => {
    foodVariable.constraints.forEach(constraint => solver.addConstraint(constraint));
  });

  const sumOfProtein = sumExpression(foodVariables, PROTEIN);
  const sumOfCarbohydrates = sumExpression(foodVariables, CARBOHYDRATES);
  const sumOfFat = sumExpression(foodVariables, FAT);

  const proteinSumEquation = new Equation(sumOfProtein, desiredProtein, Strength.strong);
  const carbohydratesSumEquation = new Equation(sumOfCarbohydrates, desiredCarbohydrates, Strength.strong);
  const fatSumEquation = new Equation(sumOfFat, desiredFat, Strength.strong);

  solver.addConstraint(proteinSumEquation);
  solver.addConstraint(carbohydratesSumEquation);
  solver.addConstraint(fatSumEquation);

  const ingredients = foodVariables.map(({ variable, foodDescriptor }) => {
    const { nutrients } = foodDescriptor;
    const amount = variable.value;

    const nutrientAmounts = {};
    Object.keys(nutrients).forEach((nutrientName) => {
      const nutrientValue = nutrients[nutrientName];
      const nutrientAmount = amount * nutrientValue;
      nutrientAmounts[nutrientName] = nutrientAmount;
    });

    return {
      foodDescriptor,
      amount,
      nutrientAmounts,
    };
  });

  return {
    ingredients,
  };
}

module.exports = {
  solve,
};
