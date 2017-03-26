#!/usr/bin/env node
const Cassowary = require('./c');

const {
  Variable,
  SimplexSolver,
  Inequality,
  Equation,
  Expression,
  LEQ,
} = Cassowary;

// TEST
//   variables A and B
//   constraint: A + B <= 100
//   constraint: A > 20
//   solve

const A = new Variable();
const B = new Variable();

const solver = new SimplexSolver();

solver.addConstraint(new Equation(new Expression(A).plus(B), Expression.fromConstant(150)));
console.log('A + B = 150');

solver.addConstraint(new Inequality(new Expression(A), LEQ, new Expression(B)));
console.log('A <= B');

console.log('A =', A.value);
console.log('B =', B.value);
