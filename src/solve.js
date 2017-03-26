const Cassowary = require('./c');

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

function solve({ availableFoods, nutrientGoals }) {
  const foodVariables = availableFoods.map(getFoodVariable);

  const solver = new SimplexSolver();

  foodVariables.forEach((foodVariable) => {
    foodVariable.constraints.forEach(constraint => solver.addConstraint(constraint));
  });

  Object.keys(nutrientGoals).forEach((nutrientName) => {
    const nutrientTargetSum = nutrientGoals[nutrientName];
    const nutrientSumExpression = sumExpression(foodVariables, nutrientName);
    const nutrientSumEquation = new Equation(nutrientSumExpression, nutrientTargetSum, Strength.strong);
    solver.addConstraint(nutrientSumEquation);
  });

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
