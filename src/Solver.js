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
  const { name, protein, carbohydrates, fat } = foodDescriptor;
  const variable = new Variable({ name });
  const proteinExpression = new Expression(protein).times(new Expression(variable));
  const carbohydratesExpression = new Expression(carbohydrates).times(new Expression(variable));
  const fatExpression = new Expression(fat).times(new Expression(variable));

  return {
    foodDescriptor,
    variable,
    constraints: [
      new Inequality(new Expression(variable), GEQ, new Expression(0), Strength.required),
    ],
    expressions: {
      [PROTEIN]: proteinExpression,
      [CARBOHYDRATES]: carbohydratesExpression,
      [FAT]: fatExpression,
    },
  };
}

function sumExpression(foodVariables, nutrientName) {
  let expression = new Expression(0);
  foodVariables.forEach((foodVariable) => {
    expression = expression.plus(foodVariable.expressions[nutrientName]);
  });
  return expression;
}

function Solver({ availableFoods, desiredProtein, desiredCarbohydrates, desiredFat }) {
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

  return {
    foodVariables,
    solver,
  };
}

module.exports = {
  Solver,
};
