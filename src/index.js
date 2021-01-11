import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (filepath) => {
  const fullPath = path.resolve(filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

const gendiff = (filepath1, filepath2) => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const parsedData1 = JSON.parse(data1);
  const parsedData2 = JSON.parse(data2);

  const keys = _.union(_.keys(parsedData1), _.keys(parsedData2)).sort();

  const result = keys.reduce((acc, key) => {
    if (!_.has(parsedData1, key)) {
      acc[`+ ${key}`] = parsedData2[key];
      return acc;
    }
    if (!_.has(parsedData2, key)) {
      acc[`- ${key}`] = parsedData1[key];
      return acc;
    }
    if (parsedData1[key] !== parsedData2[key]) {
      acc[`- ${key}`] = parsedData1[key];
      acc[`+ ${key}`] = parsedData2[key];
      return acc;
    }
    acc[`${key}`] = parsedData1[key];
    return acc;
  }, {});

  return JSON.stringify(result, null, 2);
};

export default gendiff;
