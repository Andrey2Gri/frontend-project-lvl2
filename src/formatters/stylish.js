import _ from 'lodash';

const addIndent = (depth) => ' '.repeat(depth);

const getValue = (element, depth, f) => {
  if (_.isArray(element)) {
    const values = f(element, depth);
    return `{\n${values.join('\n')}\n${addIndent(depth - 4)}}`;
  }
  if (!_.isObject(element)) {
    return element;
  }
  const keys = _.keys(element).sort();
  const items = keys.map((key) => {
    const value = element[key];
    return `${addIndent(depth)}${key}: ${getValue(value, depth + 4, f)}`;
  });
  return `{\n${items.join('\n')}\n${addIndent(depth - 4)}}`;
};

const mapping = {
  added: (node, depth) => {
    const { key, value } = node;
    return `${addIndent(depth - 2)}+ ${key}: ${getValue(value, depth + 4)}`;
  },
  deleted: (node, depth) => {
    const { key, value } = node;
    return `${addIndent(depth - 2)}- ${key}: ${getValue(value, depth + 4)}`;
  },
  nested: (node, depth, f) => {
    const { key, value } = node;
    return `${addIndent(depth)}${key}: ${getValue(value, depth + 4, f)}`;
  },
  unchanged: (node, depth) => {
    const { key, value } = node;
    return `${addIndent(depth)}${key}: ${value}`;
  },
  changed: (node, depth) => {
    const {
      key,
      value: { oldValue, newValue },
    } = node;
    const oldValueStr = `${addIndent(depth - 2)}- ${key}: ${getValue(oldValue, depth + 4)}`;
    const newValueStr = `${addIndent(depth - 2)}+ ${key}: ${getValue(newValue, depth + 4)}`;
    return `${oldValueStr}\n${newValueStr}`;
  },
};

const render = (ast) => {
  const iter = (tree, depth) => tree.map((node) => {
    const { type } = node;
    const element = mapping[type](node, depth, iter);
    return element;
  });
  const elements = iter(ast, 4);
  return `{\n${elements.join('\n')}\n}`;
};

export default render;
