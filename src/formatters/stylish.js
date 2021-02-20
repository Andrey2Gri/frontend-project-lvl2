import _ from 'lodash';

const addIndent = (level) => (level ? ' '.repeat(level * 4) : '');

const getValue = (element, level, f) => {
  if (!_.isObject(element)) {
    return element;
  }
  const keys = _.keys(element);
  const sortedKeys = _.sortBy(keys);
  const items = sortedKeys.map((key) => {
    const value = element[key];
    return `${addIndent(level)}${key}: ${getValue(value, level + 1, f)}`;
  });
  return `{\n${items.join('\n')}\n${addIndent(level - 1)}}`;
};

const builder = (node, level, status = '') => {
  const { name, value } = node;
  const space = addIndent(level);
  const beginningSpace = status === '' ? space : space.slice(2);
  return `${beginningSpace}${status}${name}: ${getValue(value, level + 1)}`;
};

const mapping = {
  added: (node, level) => builder(node, level, '+ '),
  removed: (node, level) => builder(node, level, '- '),
  unchanged: (node, level) => builder(node, level),
  nested: (node, level, f) => {
    const { name, children } = node;
    const value = f(children, level + 1);
    return builder({ name, value }, level);
  },
  updated: (node, level) => {
    const { name, value: { oldValue, newValue } } = node;
    const oldNode = { name, value: oldValue };
    const newNode = { name, value: newValue };
    return `${builder(oldNode, level, '- ')}\n${builder(newNode, level, '+ ')}`;
  },
};

const renderIter = (tree, level) => {
  const elements = tree.map((node) => {
    const { type } = node;
    const builderElement = mapping[type];
    return builderElement(node, level, renderIter);
  });
  return `{\n${elements.join('\n')}\n${addIndent(level - 1)}}`;
};

const render = (ast) => renderIter(ast, 1);

export default render;
