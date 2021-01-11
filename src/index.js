import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (filepath) => {
  const fullPath = path.resolve(filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

const getDiff = (data1, data2) => {
  const keys1 = _.keys(data1);
  const keys2 = _.keys(data2);
  const keys = _.union(keys1, keys2).sort();

  const diff = keys.reduce((acc, key) => {
    if (!_.has(data1, key)) {
      acc[`+ ${key}`] = data2[key];
      return acc;
    }
    if (!_.has(data2, key)) {
      acc[`- ${key}`] = data1[key];
      return acc;
    }
    if (data1[key] !== data2[key]) {
      acc[`- ${key}`] = data1[key];
      acc[`+ ${key}`] = data2[key];
      return acc;
    }
    acc[`${key}`] = data1[key];
    return acc;
  }, {});

  return diff;
};

const gendiff = (filepath1, filepath2) => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const parsedData1 = JSON.parse(data1);
  const parsedData2 = JSON.parse(data2);

  const diff = getDiff(parsedData1, parsedData2);
  return JSON.stringify(diff, null, 2);
};

export default gendiff;
