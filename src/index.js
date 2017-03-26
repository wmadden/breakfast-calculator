#!/usr/bin/env node
const { getFoodData } = require('./getFoodData');
const { Solver } = require('./Solver');

getFoodData();
Solver({});
