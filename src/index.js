import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import stylish from './stylish.js';

const getData = (pathFile) => {
  const fullPath = path.resolve(pathFile);
  const extname = path.extname(fullPath).slice(1);
  const data = fs.readFileSync(fullPath, 'utf8');
  return parse(data, extname);
};

const isObject = (coll) => {
  if (_.isArray(coll)) {
    return false;
  }
  return _.isObject(coll);
};

const mapping = [
  {
    type: 'added',
    predicant: (beforeData, afterData, key) => !_.has(beforeData, key),
    parseItem: (beforeData, afterData, key) => ({ value: afterData[key] }),
  },
  {
    type: 'deleted',
    predicant: (beforeData, afterData, key) => !_.has(afterData, key),
    parseItem: (beforeData, afterData, key) => ({ value: beforeData[key] }),
  },
  {
    type: 'nested',
    predicant: (beforeData, afterData, key) => isObject(beforeData[key])
      && isObject(afterData[key]),
    parseItem: (beforeData, afterData, key, f) => ({ value: f(beforeData[key], afterData[key]) }),
  },
  {
    type: 'unchanged',
    predicant: (beforeData, afterData, key) => beforeData[key] === afterData[key],
    parseItem: (beforeData, afterData, key) => ({ value: beforeData[key] }),
  },
  {
    type: 'changed',
    predicant: (beforeData, afterData, key) => beforeData[key] !== afterData[key],
    parseItem: (beforeData, afterData, key) => ({
      value: {
        oldValue: beforeData[key],
        newValue: afterData[key],
      },
    }),
  },
];

const buildNodeAst = (data1, data2, f) => (key) => {
  const mappingItem = mapping.find(({ predicant }) => predicant(data1, data2, key));
  const { type, parseItem } = mappingItem;
  return { key, type, ...parseItem(data1, data2, key, f) };
};

const buildAST = (data1, data2) => {
  const keys1 = _.keys(data1);
  const keys2 = _.keys(data2);
  const keys = _.union(keys1, keys2).sort();
  return keys.map(buildNodeAst(data1, data2, buildAST));
};

const gendiff = (filepath1, filepath2, formatter = stylish) => {
  const beforeData = getData(filepath1);
  const afterData = getData(filepath2);

  const ast = buildAST(beforeData, afterData);
  return formatter(ast);
};

export default gendiff;
