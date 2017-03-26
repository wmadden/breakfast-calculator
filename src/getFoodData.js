const fs = require('fs');
const parse = require('csv-parse');
const { PROTEIN, CARBOHYDRATES, FAT } = require('./constants');

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
        return Object.assign({}, food, {
          [PROTEIN]: parseFloat(food[PROTEIN], 10) / 100.0,
          [CARBOHYDRATES]: parseFloat(food[CARBOHYDRATES], 10) / 100.0,
          [FAT]: parseFloat(food[FAT], 10) / 100.0,
        });
      });
    })
    .then((data) => {
      console.log(data);
      return data;
    });
}

module.exports = {
  getFoodData,
};
