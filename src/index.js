import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers.js';

const getData = (filepath) => {
  const fullPath = path.resolve(filepath);
  const type = path.extname(fullPath).slice(1);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return parse(data, type);
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
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);

  const diff = getDiff(data1, data2);
  return JSON.stringify(diff, null, 2);
};

export default gendiff;
