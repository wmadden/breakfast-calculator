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
      console.log(data);
    });
}

module.exports = {
  getFoodData,
};
