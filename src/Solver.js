const Cassowary = require('./c');

const {
  Variable,
  SimplexSolver,
  Inequality,
  Equation,
  Expression,
  LEQ,
} = Cassowary;

// Input:
//  - available foods
//  - goals

function Solver({ availableFoods, desiredProtein, desiredCarbohydrates, desiredFat }) {
  const A = new Variable();
  const B = new Variable();

  const solver = new SimplexSolver();

  solver.addConstraint(new Equation(new Expression(A).plus(B), Expression.fromConstant(150)));
  console.log('A + B = 150');

  solver.addConstraint(new Inequality(new Expression(A), LEQ, new Expression(B)));
  console.log('A <= B');

  console.log('A =', A.value);
  console.log('B =', B.value);
}

module.exports = {
  Solver,
};
