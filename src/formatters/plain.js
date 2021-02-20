import _ from 'lodash';

const buildValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return _.isString(value) ? `'${value}'` : value;
};

const buildPath = (items) => items.join('.');

const events = {
  added: (path, { value }) => `Property '${buildPath(path)}' was added with value: ${buildValue(value)}`,
  removed: (path) => `Property '${buildPath(path)}' was removed`,
  updated: (path, { value }) => {
    const { oldValue, newValue } = value;
    return `Property '${buildPath(path)}' was updated. From ${buildValue(oldValue)} to ${buildValue(newValue)}`;
  },
  nested: (path, { children }, f) => f(children, path),
};

const getDescriptions = (tree, pathItems) => tree.flatMap((node) => {
  const { name, type } = node;
  const newPathItems = [...pathItems, name];
  const buildDescription = _.get(events, type, null);
  if (!buildDescription) {
    return null;
  }
  return buildDescription(newPathItems, node, getDescriptions);
});

const render = (ast) => {
  const descriptions = getDescriptions(ast, []);
  const filteredDescriptions = descriptions.filter((p) => p);
  return filteredDescriptions.join('\n');
};

export default render;
