const fs = require('fs');
const parse = require('csv-parse');

function loadCSV(filepath, parserOptions = {}) {
  return new Promise((success) => {
    const parser = parse(parserOptions, (err, data) => {
      if (err) {
        throw err;
      }
      success(data);
    });

    fs.createReadStream(filepath)
      .pipe(parser);
  });
}

function getFoodData() {
  return loadCSV('./src/foods.csv', { columns: true })
    .then((data) => {
      return data.map((food) => {
        const nutrients = {};

        Object.keys(food).forEach((nutrient) => {
          nutrients[nutrient] = parseFloat(food[nutrient]) / 100.0;
        });

        return {
          name: food.name,
          nutrients,
        };
      });
    });
}

module.exports = {
  getFoodData,
};
