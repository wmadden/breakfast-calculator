const Cassowary = require('./c');

const {
  Variable,
  SimplexSolver,
  Inequality,
  Equation,
  Expression,
  GEQ,
  LEQ,
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

function parseIngredientConstraints(ingredientAmountVariable, constraintDescriptor) {
  if (!constraintDescriptor) return [];

  const result = [];
  const { min, equal, max } = constraintDescriptor;
  const ingredientAmountExpression = new Expression(ingredientAmountVariable);

  if (min != null) {
    const minConstraint = new Inequality(ingredientAmountExpression, GEQ, new Expression(min), Strength.strong);
    result.push(minConstraint);
  }
  if (equal != null) {
    const equalityConstraint = new Equation(ingredientAmountExpression, new Expression(equal), Strength.strong);
    result.push(equalityConstraint);
  }
  if (max != null) {
    const maxConstraint = new Inequality(ingredientAmountExpression, LEQ, new Expression(max), Strength.strong);
    result.push(maxConstraint);
  }

  return result;
}

function solve({ availableFoods, nutrientGoals, ingredientConstraints = {} }) {
  const foodVariables = availableFoods.map(getFoodVariable);

  const solver = new SimplexSolver();

  foodVariables.forEach(({ variable, foodDescriptor }) => {
    const positiveConstraint = new Inequality(new Expression(variable), GEQ, new Expression(0), Strength.required);

    const constraintDescriptor = ingredientConstraints[foodDescriptor.name];
    const globalIngredientConstraints = parseIngredientConstraints(variable, constraintDescriptor);

    [positiveConstraint].concat(globalIngredientConstraints)
      .forEach((constraint) => {
        solver.addConstraint(constraint);
      });
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
