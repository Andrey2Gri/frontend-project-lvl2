import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import chooseFormatter from './formatters/index.js';

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
    predicant: (beforeData, afterData, name) => !_.has(beforeData, name),
    parseItem: (beforeData, afterData, name) => ({
      value: afterData[name],
      children: null,
    }),
  },
  {
    type: 'removed',
    children: null,
    predicant: (beforeData, afterData, name) => !_.has(afterData, name),
    parseItem: (beforeData, afterData, name) => ({
      value: beforeData[name],
      children: null,
    }),
  },
  {
    type: 'nested',
    value: null,
    predicant: (beforeData, afterData, name) => isObject(beforeData[name])
      && isObject(afterData[name]),
    parseItem: (beforeData, afterData, name, f) => ({
      value: null,
      children: f(beforeData[name], afterData[name]),
    }),
  },
  {
    type: 'unchanged',
    children: null,
    predicant: (beforeData, afterData, name) => beforeData[name] === afterData[name],
    parseItem: (beforeData, afterData, name) => ({
      value: beforeData[name],
      children: null,
    }),
  },
  {
    type: 'updated',
    children: null,
    predicant: (beforeData, afterData, name) => beforeData[name] !== afterData[name],
    parseItem: (beforeData, afterData, name) => ({
      value: {
        oldValue: beforeData[name],
        newValue: afterData[name],
      },
      children: null,
    }),
  },
];

const buildNodeAst = (data1, data2, f) => (key) => {
  const mappingItem = mapping.find(({ predicant }) => predicant(data1, data2, key));
  const { type, parseItem } = mappingItem;
  return { name: key, type, ...parseItem(data1, data2, key, f) };
};

const buildAST = (data1, data2) => {
  const keys1 = _.keys(data1);
  const keys2 = _.keys(data2);
  const keys = _.union(keys1, keys2).sort();
  return keys.map(buildNodeAst(data1, data2, buildAST));
};

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  const beforeData = getData(filepath1);
  const afterData = getData(filepath2);

  const ast = buildAST(beforeData, afterData);
  const formatter = chooseFormatter(format);
  return formatter(ast);
};

export default gendiff;
